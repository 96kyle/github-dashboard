"use client";

import { fetchData } from "@/app/lib/services/github/activity_api";
import Calendar from "@/app/(main)/dashboard/components/Calender";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import ActivityCount from "./components/ActivityCount";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DashboardFallbackView from "./fallback/DashboardFallbackView";
import { useDebounce } from "use-debounce";
import { LoginInfo } from "../../types/users/user_type";
import ActivityHistory from "./components/ActivityHistory";
import {
  AlertCircle,
  GitCommit,
  GitPullRequest,
  MessageSquare,
} from "lucide-react";
import ActivityHeader from "./components/ActivityHeader";
import ActivityChart from "./components/ActivityChart";

export default function DashboardView({
  today,
  userInfo,
  clientId,
  isLogin,
}: {
  today: Date;
  userInfo: LoginInfo;
  clientId: string;
  isLogin: boolean;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [isPending, setIsPending] = useState(false);
  const [debouncedDate] = useDebounce(selectedDate, 1000);

  const from = startOfMonth(debouncedDate).toISOString();
  const to = endOfMonth(debouncedDate).toISOString();

  const prevMonth = subMonths(debouncedDate, 1);
  const prevFrom = startOfMonth(prevMonth).toISOString();
  const prevTo = endOfMonth(prevMonth).toISOString();

  const {
    data: prevData,
    isLoading: prevLoading,
    isFetching: prevFetching,
  } = useQuery({
    queryKey: ["activity", userInfo.username, prevFrom],
    queryFn: () =>
      fetchData({
        username: userInfo.username,
        from: prevFrom,
        to: prevTo,
        token: userInfo.token,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: currentData,
    isLoading: currentLoading,
    isFetching: currentFetching,
  } = useQuery({
    queryKey: ["activity", userInfo.username, from],
    queryFn: () =>
      fetchData({
        username: userInfo.username,
        from,
        to,
        token: userInfo.token,
      }),

    staleTime: 1000 * 60 * 5,
  });

  console.log(currentData);

  useEffect(() => {
    setSelectedDate(debouncedDate);
  }, [debouncedDate]);

  useEffect(() => {
    if (!prevFetching && !currentFetching) setIsPending(false);
  }, [prevData, currentData, prevFetching, currentFetching]);

  async function moveMonth(isPrev: boolean) {
    setIsPending(true);
    if (isPrev) {
      setSelectedDate(startOfMonth(subMonths(selectedDate, 1)));
    } else {
      setSelectedDate(startOfMonth(addMonths(selectedDate, 1)));
    }
  }

  return (
    <div>
      <ActivityHeader
        username={userInfo.username}
        clientId={clientId}
        isLogin={isLogin}
        moveMonth={moveMonth}
        selectedDate={selectedDate}
      />
      <div className="w-full p-6">
        {prevLoading || currentLoading || isPending ? (
          <DashboardFallbackView />
        ) : (
          <>
            <div className="flex flex-row mb-4 gap-6">
              <ActivityCount
                count={currentData?.totalCount.commit ?? 0}
                title="Commits"
                Icon={GitCommit}
                iconColor="text-green-600"
                beforeCount={prevData?.totalCount.commit ?? 0}
              />
              <ActivityCount
                count={currentData?.totalCount.issue ?? 0}
                title="Issues"
                Icon={AlertCircle}
                iconColor="text-gray-600"
                beforeCount={prevData?.totalCount.issue ?? 0}
              />
              <ActivityCount
                count={currentData?.totalCount.pr ?? 0}
                title="PRs"
                Icon={GitPullRequest}
                iconColor="text-blue-600"
                beforeCount={prevData?.totalCount.pr ?? 0}
              />
              <ActivityCount
                count={currentData?.totalCount.review ?? 0}
                title="PR Reveiws"
                Icon={MessageSquare}
                iconColor="text-purple-600"
                beforeCount={prevData?.totalCount.review ?? 0}
              />
            </div>
            <Calendar
              data={currentData!.map}
              count={
                (currentData?.totalCount.commit ?? 0) +
                (currentData?.totalCount.pr ?? 0) +
                (currentData?.totalCount.issue ?? 0) +
                (currentData?.totalCount.review ?? 0)
              }
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <ActivityHistory
              items={currentData?.map ?? {}}
              selectedDate={selectedDate}
            />
            <div className="flex flex-row gap-6 mt-4">
              <ActivityChart
                selectedDate={selectedDate}
                count={
                  (currentData?.totalCount.commit ?? 0) +
                  (currentData?.totalCount.pr ?? 0) +
                  (currentData?.totalCount.issue ?? 0) +
                  (currentData?.totalCount.review ?? 0)
                }
                prevMap={prevData?.map ?? {}}
                currentMap={currentData?.map ?? {}}
              />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
