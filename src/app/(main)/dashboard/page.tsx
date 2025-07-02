import { getActivities } from "@/api/api";
import Calendar from "@/components/Calender";
import { Repository } from "@/types/repository";
import { format } from "date-fns";
import ActivityCount from "./components/ActivityCount";
import { FaCodeCommit, FaCodePullRequest } from "react-icons/fa6";
import { VscIssues, VscCodeReview } from "react-icons/vsc";

export default async function DashboardPage() {
  const username = "96kyle";

  const today = new Date();

  const from = "2025-06-01T00:00:00Z";
  const to = "2025-06-30T23:59:59Z";

  const data = await getActivities(username, from, to);

  console.log(data);

  return (
    <div>
      <div className="bg-bg p-4 text-2xl  border-b-2 border-gray-300 text-fontNavy">
        Dashboard
      </div>
      <div className="w-full p-6">
        <h1 className="text-2xl font-bold mb-4 text-fontNavy">
          {format(today, "yyyy년 M월")}
        </h1>
        <div className="flex flex-row mb-4 gap-6">
          <ActivityCount
            count={3}
            title="Commit"
            Icon={FaCodeCommit}
            beforeCount={0}
          />
          <ActivityCount
            count={11}
            title="Issues"
            Icon={VscIssues}
            beforeCount={17}
          />
          <ActivityCount
            count={12}
            title="PRs"
            Icon={FaCodePullRequest}
            beforeCount={0}
          />
          <ActivityCount
            count={9}
            title="PR Reveiws"
            Icon={VscCodeReview}
            beforeCount={0}
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
