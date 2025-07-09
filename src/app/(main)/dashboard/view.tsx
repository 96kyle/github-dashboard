"use client";

import { fetchData } from "@/app/lib/services/api";
import Calendar from "@/components/Calender";
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
import { useState } from "react";

export default function DashboardView({
  username,
  today,
}: {
  username: string;
  today: Date;
}) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(today);

  const from = startOfMonth(selectedMonth).toISOString();
  const to = endOfMonth(selectedMonth).toISOString();

  const prevMonth = subMonths(selectedMonth, 1);
  const prevFrom = startOfMonth(prevMonth).toISOString();
  const prevTo = endOfMonth(prevMonth).toISOString();

  const { data: prevData } = useQuery({
    queryKey: ["activity", username, prevFrom],
    queryFn: () =>
      fetchData({
        username,
        from: prevFrom,
        to: prevTo,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: currentData } = useQuery({
    queryKey: ["activity", username, from],
    queryFn: () =>
      fetchData({
        username,
        from,
        to,
      }),
    staleTime: 1000 * 60 * 5,
  });

  async function moveMonth(isPrev: boolean) {
    if (isPrev) {
      setSelectedMonth(subMonths(selectedMonth, 1));
    } else {
      setSelectedMonth(addMonths(selectedMonth, 1));
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
            {format(selectedMonth, "yyyy년 M월")}
          </div>
          <FaCaretRight
            size={24}
            className="cursor-pointer"
            onClick={() => moveMonth(false)}
          />
        </div>
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
        <div className="flex flex-row">
          <div className="flex-4">
            <Calendar data={currentData!.map} date={selectedMonth} />
          </div>
          <div className="flex-3"></div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex flex-row gap-4  pl-4"></div>
        </div>
      </div>
    </div>
  );
}
