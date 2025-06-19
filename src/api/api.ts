const GITHUB_API = "https://api.github.com";
const HEADERS = {
  // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  "Content-Type": "application/json",
};

/**
 * 유저의 공개 레포지토리 목록 조회
 */
export async function getUserRepos(username: string) {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100`,
    {
      headers: HEADERS,
      next: { revalidate: 3600 }, // optional: 캐시
    }
  );
  if (!res.ok) throw new Error(`Fail to get repos: ${res.status}`);
  return res.json();
}

/**
 * 특정 레포지토리의 커밋 목록 가져오기
 */
export async function getRepoCommits(username: string, repo: string) {
  const res = await fetch(
    `${GITHUB_API}/repos/${username}/${repo}/commits?per_page=100`,
    {
      headers: HEADERS,
    }
  );
  if (!res.ok) throw new Error(`Fail to get commits: ${res.status}`);
  return res.json();
}

/**
 * 특정 레포지토리의 Pull Request 내역
 */
export async function getRepoPullRequests(username: string, repo: string) {
  const res = await fetch(
    `${GITHUB_API}/repos/${username}/${repo}/pulls?state=all`,
    {
      headers: HEADERS,
    }
  );
  if (!res.ok) throw new Error(`Fail to get PRs: ${res.status}`);
  return res.json();
}

/**
 * 특정 레포지토리의 Issue 목록
 */
export async function getRepoIssues(username: string, repo: string) {
  const res = await fetch(
    `${GITHUB_API}/repos/${username}/${repo}/issues?state=all`,
    {
      headers: HEADERS,
    }
  );
  if (!res.ok) throw new Error(`Fail to get issues: ${res.status}`);
  return res.json();
}
