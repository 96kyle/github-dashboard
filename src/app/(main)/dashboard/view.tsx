"use client";

import { fetchData } from "@/api/api";
import Calendar from "@/components/Calender";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import ActivityCount from "./components/ActivityCount";
import { FaCodeCommit, FaCodePullRequest } from "react-icons/fa6";
import { VscIssues, VscCodeReview } from "react-icons/vsc";
import { useQuery } from "@tanstack/react-query";

export default function DashboardView({
  username,
  from,
  to,
}: {
  username: string;
  from: string;
  to: string;
}) {
  const prevMonth = subMonths(from, 1);
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

  return (
    <div>
      <div className="w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-fontNavy">
          {format(from, "yyyy년 M월")}
        </h1>
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
            <Calendar />
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
