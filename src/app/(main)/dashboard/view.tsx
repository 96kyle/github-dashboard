"use client";

import { fetchData } from "@/lib/api/activity_api";
// import ActivityCalendar from "@/app/(main)/dashboard/components/ActivityCalender";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
// import ActivityCount from "./components/ActivityCount";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DashboardFallbackView from "./fallback/DashboardFallbackView";
import { useDebounce } from "use-debounce";
import { LoginInfo } from "../../types/users/user_type";
// import ActivityHistory from "./components/ActivityHistory";
// import {
//   AlertCircle,
//   GitCommit,
//   GitPullRequest,
//   MessageSquare,
// } from "lucide-react";
// import ActivityHeader from "./components/ActivityHeader";
// import ActivityLineChart from "./components/ActivityLineChart";
// import { useInView } from "react-intersection-observer";
// import ActivityBarChart from "./components/ActivityBarChart";
import { MergedActivity } from "@/app/types/activities/activity_type";

export default function DashboardView({
  userInfo,
  date,
}: {
  userInfo: LoginInfo;
  date: Date;
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(date);
  const [isPending, setIsPending] = useState(false);
  const [debouncedDate] = useDebounce(selectedDate, 1000);

  const from = startOfMonth(debouncedDate).toISOString();
  const to = endOfMonth(debouncedDate).toISOString();

  const prevMonth = subMonths(debouncedDate, 1);
  const prevFrom = startOfMonth(prevMonth).toISOString();
  const prevTo = endOfMonth(prevMonth).toISOString();

  // const { ref, inView } = useInView({ threshold: 0.1 });
  // const [shouldRenderChart, setShouldRenderChart] = useState(false);

  const { data: prevData, isLoading: prevLoading } = useQuery<MergedActivity>({
    queryKey: ["activity", userInfo.username, prevFrom],
    queryFn: () =>
      fetchData({
        from: prevFrom,
        to: prevTo,
        isServer: false,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: currentData, isLoading: currentLoading } =
    useQuery<MergedActivity>({
      queryKey: ["activity", userInfo.username, from],
      queryFn: () =>
        fetchData({
          from,
          to,
          isServer: false,
        }),

      staleTime: 1000 * 60 * 5,
    });

  useEffect(() => {
    setSelectedDate(debouncedDate);
  }, [debouncedDate]);

  useEffect(() => {
    if (!prevLoading && !currentLoading) setIsPending(false);
  }, [prevData, currentData, prevLoading, currentLoading]);

  // useEffect(() => {
  //   if (inView) {
  //     setShouldRenderChart(true); // 한 번만 렌더링
  //   }
  // }, [inView]);

  const moveMonth = async (isPrev: boolean) => {
    setIsPending(true);
    // setShouldRenderChart(false);
    if (isPrev) {
      setSelectedDate(startOfMonth(subMonths(selectedDate, 1)));
    } else {
      setSelectedDate(startOfMonth(addMonths(selectedDate, 1)));
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* <ActivityHeader
        username={userInfo.username}
        moveMonth={moveMonth}
        selectedDate={selectedDate}
      /> */}
      <div className="w-full p-6 max-w-[1300px] self-center">
        {prevLoading || currentLoading || isPending ? (
          <DashboardFallbackView />
        ) : (
          <>
            <div className="flex flex-row mb-4 gap-6">
              {/* <ActivityCount
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
            <ActivityCalendar
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
            <div ref={ref} className="flex flex-row gap-6 mt-4">
              <ActivityLineChart
                today={date}
                selectedDate={selectedDate}
                prevActivity={prevData!}
                currentActivity={currentData!}
                shouldRenderChart={shouldRenderChart}
              />
              <ActivityBarChart
                today={date}
                prevActivity={prevData?.map ?? {}}
                currActivity={currentData?.map ?? {}}
                selectedDate={selectedDate}
                shouldRenderChart={shouldRenderChart}
              /> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
