// app/(main)/dashboard/page.tsx

import { getRepoCommits, getUserRepos } from "@/api/api";
import Calendar from "@/components/Calender";
import { Repository } from "@/types/repository";

export default async function DashboardPage() {
  const username = "96kyle";
  const repos: Repository[] = await getUserRepos(username);

  const commits = await getRepoCommits(username, repos[1]?.name);

  return (
    <div>
      <div className="bg-bg p-4 text-lg font-bold border-b-2 border-gray-300 text-fontNavy">
        Dashboard
      </div>
      <div className="p-6 flex flex-col w-full">
        <div className="flex flex-row">
          <div className="flex grow bg-red-500">hi</div>
          <Calendar />
        </div>
      </div>
    </div>
  );
}
