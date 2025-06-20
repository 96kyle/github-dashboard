// app/(main)/dashboard/page.tsx

import { getRepoCommits, getUserRepos } from "@/api/api";

export default async function DashboardPage() {
  const username = "96kyle";
  const repos = await getUserRepos(username);

  const commits = await getRepoCommits(username, repos[1]?.name); // 첫 레포만 예시

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        {username}의 GitHub 리포지토리
      </h2>
      <ul>
        {repos.map((repo: any) => (
          <li key={repo.id}>
            ⭐ {repo.updated_at} - {repo.name} - {repo.stargazers_count} stars
          </li>
        ))}
      </ul>

      <h3 className="text-xl mt-6 mb-2">📜 최근 커밋</h3>
      <ul className="text-sm">
        {commits.slice(0, 5).map((commit: any) => (
          <li key={commit.sha}>
            {commit.commit.author.name}: {commit.commit.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
