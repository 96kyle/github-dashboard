"use client";

import { fetchData } from "@/app/lib/services/github/activity_api";
import Calendar from "@/app/(main)/dashboard/components/Calender";
import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  subMonths,
} from "date-fns";
import ActivityCount from "./components/ActivityCount";
import {
  FaCodeCommit,
  FaCodePullRequest,
  FaCaretLeft,
  FaCaretRight,
} from "react-icons/fa6";
import { VscIssues, VscCodeReview } from "react-icons/vsc";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DashboardFallbackView from "./fallback/DashboardFallbackView";
import { useDebounce } from "use-debounce";
import { LoginInfo } from "../../types/users/user_type";

export default function DashboardView({
  today,
  userInfo,
}: {
  today: Date;
  userInfo: LoginInfo;
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

  useEffect(() => {
    setSelectedDate(debouncedDate);
  }, [debouncedDate]);

  useEffect(() => {
    if (!prevFetching && !currentFetching) setIsPending(false);
  }, [prevData, currentData]);

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
      <div className="w-full p-6">
        <div className="flex flex-row items-center justify-center mb-4">
          <FaCaretLeft
            size={24}
            className="cursor-pointer"
            onClick={() => moveMonth(true)}
          />
          <div className="text-2xl font-bold text-fontNavy px-2">
            {format(selectedDate, "yyyy년 M월")}
          </div>
          <FaCaretRight
            size={24}
            className="cursor-pointer"
            onClick={() => moveMonth(false)}
          />
        </div>

        {prevLoading || currentLoading || isPending ? (
          <DashboardFallbackView />
        ) : (
          <>
            <div className="flex flex-row mb-4 gap-6">
              <ActivityCount
                count={currentData?.totalCount.commit ?? 0}
                title="Commits"
                Icon={FaCodeCommit}
                beforeCount={prevData?.totalCount.commit ?? 0}
              />
              <ActivityCount
                count={currentData?.totalCount.issue ?? 0}
                title="Issues"
                Icon={VscIssues}
                beforeCount={prevData?.totalCount.issue ?? 0}
              />
              <ActivityCount
                count={currentData?.totalCount.pr ?? 0}
                title="PRs"
                Icon={FaCodePullRequest}
                beforeCount={prevData?.totalCount.pr ?? 0}
              />
              <ActivityCount
                count={currentData?.totalCount.review ?? 0}
                title="PR Reveiws"
                Icon={VscCodeReview}
                beforeCount={prevData?.totalCount.review ?? 0}
              />
            </div>

            <div className="flex flex-row gap-4">
              <div className="min-w-0 flex-1">
                <Calendar
                  data={currentData!.map}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>
              <div className="flex-1"></div>
            </div>

            <div className="flex flex-col flex-1">
              <div className="flex flex-row gap-4 pl-4"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
