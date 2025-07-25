"use client";

import { fetchData } from "@/lib/api/activity_api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
// import DashboardFallbackView from "./fallback/DashboardFallbackView";
import { useDebounce } from "use-debounce";
import { LoginInfo } from "../../types/users/user_type";

import { MergedActivity } from "@/app/types/activities/activity_type";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

export default function TestView({
  userInfo,
  date,
}: {
  userInfo: LoginInfo;
  date: string;
}) {
  const [selectedDate, setSelectedDate] = useState<string>(date);
  // const [isPending, setIsPending] = useState(false);
  const [debouncedDate] = useDebounce(selectedDate, 1000);

  const from = startOfMonth(debouncedDate).toISOString();
  const to = endOfMonth(debouncedDate).toISOString();

  const prevMonth = subMonths(debouncedDate, 1);
  const prevFrom = startOfMonth(prevMonth).toISOString();
  const prevTo = endOfMonth(prevMonth).toISOString();

  useQuery<MergedActivity>({
    queryKey: ["activity", userInfo.username, prevFrom.substring(0, 10)],
    queryFn: () =>
      fetchData({
        from: prevFrom,
        to: prevTo,
        isServer: false,
      }),
    staleTime: 1000 * 60 * 5,
  });

  useQuery<MergedActivity>({
    queryKey: ["activity", userInfo.username, from.substring(0, 10)],
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

  // useEffect(() => {
  //   if (!prevLoading && !currentLoading) setIsPending(false);
  // }, [prevData, currentData, prevLoading, currentLoading]);

  // const moveMonth = async (isPrev: boolean) => {
  //   setIsPending(true);
  //   if (isPrev) {
  //     setSelectedDate(startOfMonth(subMonths(selectedDate, 1)).toISOString());
  //   } else {
  //     setSelectedDate(startOfMonth(addMonths(selectedDate, 1)).toISOString());
  //   }
  // };

  return (
    <div className="flex flex-col items-center">
      {/* <ActivityHeader
        username={userInfo.username}
        moveMonth={moveMonth}
        selectedDate={selectedDate}
      /> */}
      <div className="w-full p-6 max-w-[1300px] self-center">
        {selectedDate}
        {/* {prevLoading || currentLoading || isPending ? (
          <DashboardFallbackView />
        ) : ( */}
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
              /> */}
          </div>
          {/* <ActivityCalendar
              data={currentData!.map}
              count={
                (currentData?.totalCount.commit ?? 0) +
                (currentData?.totalCount.pr ?? 0) +
                (currentData?.totalCount.issue ?? 0) +
                (currentData?.totalCount.review ?? 0)
              }
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            /> */}

          {/* <ActivityHistory
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
                selectedDate={selectedDate}
                prevActivity={prevData?.map ?? {}}
                currActivity={currentData?.map ?? {}}
                shouldRenderChart={shouldRenderChart}
              />
            </div> */}
        </>
        {/* )} */}
      </div>
    </div>
  );
}
