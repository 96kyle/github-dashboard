import {
  ActivityItem,
  ActivityType,
  DailyActivityMap,
  MergedActivity,
} from "@/app/types/activities/activity_type";
import { ActivityReq } from "@/app/types/activities/activity_request";

const GITHUB_API = "https://api.github.com";
const GITHUB_API_GRAPH = "https://api.github.com/graphql";

//기간 중 활동한 레포지토리 목록 api
export async function getContributedReposInRange({
  username,
  from,
  to,
  token,
}: ActivityReq): Promise<{ owner: string; name: string }[]> {
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          commitContributionsByRepository {
            repository {
              name
              owner {
                login
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(GITHUB_API_GRAPH, {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username, from, to },
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL Error:", json.errors);
    throw new Error("GraphQL query failed");
  }

  const repos = new Set<string>();

  const push = (owner: string, name: string) => {
    repos.add(`${owner}/${name}`);
  };

  const data = json.data.user.contributionsCollection;

  data.commitContributionsByRepository.forEach((entry: any) => {
    push(entry.repository.owner.login, entry.repository.name);
  });

  return Array.from(repos).map((fullName) => {
    const [owner, name] = fullName.split("/");
    return { owner, name };
  });
}

function hasNextPage(headers: Headers): boolean {
  const link = headers.get("link");
  return link?.includes('rel="next"') ?? false;
}

//레포 별 커밋 목록 호출 api
export async function fetchCommitsForRepo(
  owner: string,
  repo: string,
  username: string,
  since: string,
  until: string,
  token: string
) {
  let page = 1;
  const allCommits: ActivityItem[] = [];

  while (true) {
    const url = `${GITHUB_API}/repos/${owner}/${repo}/commits?author=${username}&since=${since}&until=${until}&per_page=100&page=${page}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (!Array.isArray(json)) break;

    const commits = json.map(
      (commit: any) =>
        ({
          state: "",
          title: commit.commit.message.split("\n")[0],
          repo: `${owner}/${repo}`,
          url: commit.html_url,
          createdAt: commit.commit.author.date,
          type: "commit",
        } as ActivityItem)
    );

    allCommits.push(...commits);

    // ✅ Link 헤더에 next 없으면 종료
    if (!hasNextPage(res.headers)) break;

    page++;
  }

  return allCommits;
}

//기간 중 모든 커밋 내용 호출 api
export async function getAllCommits({
  username,
  from,
  to,
  token,
}: ActivityReq): Promise<DailyActivityMap> {
  const repos = await getContributedReposInRange({
    username,
    from,
    to,
    token: token,
  });
  const result: DailyActivityMap = {};

  const results = await Promise.all(
    repos.map((repo) =>
      fetchCommitsForRepo(repo.owner, repo.name, username, from, to, token)
    )
  );

  for (const commits of results) {
    for (const commit of commits) {
      const date = commit.createdAt.split("T")[0];
      if (!result[date]) result[date] = [];

      result[date].push(commit);
    }
  }

  return result;
}

//기간동안 모든 pr, issues, review 호출 api
export async function getActivities({
  username,
  from,
  to,
  token,
}: ActivityReq): Promise<DailyActivityMap> {
  const query = `
    query($username: String!, $queryString: String!, $from: DateTime!, $to: DateTime!) {
      search(query: $queryString, type: ISSUE, first: 100) {
        nodes {
          ... on PullRequest {
            title
            url
            createdAt
            state
            author {
              login
            }
            repository {
              name
              owner {
                login
              }
            }
          }
          ... on Issue {
            title
            url
            createdAt
            state
            author {
              login
            }
            repository {
              name
              owner {
                login
              }
            }
          }
        }
      }

      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          pullRequestReviewContributions(first: 100) {
            nodes {
              occurredAt
              pullRequest {
                title
                url
                state
                repository {
                  name
                  owner {
                    login
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const q = `involves:${username} created:${from.split("T")[0]}..${
    to.split("T")[0]
  }`;

  const res = await fetch(GITHUB_API_GRAPH, {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        username,
        queryString: q,
        from,
        to,
      },
    }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error("GraphQL Error:", json.errors);
    throw new Error("GraphQL query failed");
  }

  const result: DailyActivityMap = {};

  json.data.search.nodes.forEach((node: any) => {
    const date = node.createdAt.split("T")[0];
    const type = node.url.includes("/pull/") ? "pr" : "issue";
    const repo = `${node.repository.owner.login}/${node.repository.name}`;

    if (node.author.login === username) {
      if (!result[date]) result[date] = [];

      result[date].push({
        title: node.title,
        url: node.url,
        createdAt: node.createdAt,
        type,
        state: node.state,
        repo,
      });
    }
  });

  const reviews =
    json.data.user.contributionsCollection.pullRequestReviewContributions.nodes;
  reviews.forEach((review: any) => {
    const date = review.occurredAt.split("T")[0];
    const repo = `${review.pullRequest.repository.owner.login}/${review.pullRequest.repository.name}`;

    if (!result[date]) result[date] = [];
    result[date].push({
      title: review.pullRequest.title,
      url: review.pullRequest.url,
      createdAt: review.occurredAt,
      type: "review",
      state: review.pullRequest.state,
      repo,
    });
  });

  return result;
}

export async function serverFetch({
  username,
  from,
  to,
  token,
}: ActivityReq): Promise<MergedActivity> {
  const [commitMap, activityMap] = await Promise.all([
    getAllCommits({ username, from, to, token }),
    getActivities({ username, from, to, token }),
  ]);
  const merged: DailyActivityMap = {};
  const totalCount: Record<ActivityType, number> = {
    pr: 0,
    issue: 0,
    review: 0,
    commit: 0,
  };

  const allDates = new Set([
    ...Object.keys(commitMap),
    ...Object.keys(activityMap),
  ]);

  for (const date of allDates) {
    const items = [...(commitMap[date] ?? []), ...(activityMap[date] ?? [])];
    merged[date] = items;

    for (const item of items) {
      totalCount[item.type] += 1;
    }
  }

  return {
    map: merged,
    totalCount: totalCount,
  };
}

export async function clientFetch({ username, from, to, token }: ActivityReq) {
  const res = await fetch("/api/github/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, from, to, token }),
  });

  if (!res.ok) throw new Error("클라이언트 요청 실패");
  return await res.json();
}

export async function fetchData({
  username,
  from,
  to,
  token,
}: ActivityReq): Promise<MergedActivity> {
  // 서버 환경인지 감지
  const isServer = typeof window === "undefined";

  if (isServer) {
    return serverFetch({ username, from, to, token });
  } else {
    return clientFetch({ username, from, to, token });
  }
}
