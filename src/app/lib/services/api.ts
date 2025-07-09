import {
  ActivityItem,
  ActivityType,
  DailyActivityMap,
  MergedActivity,
} from "@/app/(main)/dashboard/types/activities";
import { headers } from "next/headers";

const GITHUB_API = "https://api.github.com";
const GITHUB_API_GRAPH = "https://api.github.com/graphql";
const HEADERS = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  "Content-Type": "application/json",
};

//기간 중 활동한 레포지토리 목록 api
export async function getContributedReposInRange(
  username: string,
  from: string,
  to: string
): Promise<{ owner: string; name: string }[]> {
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
    headers: HEADERS,
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

//레포 별 커밋 목록 호출 api
export async function fetchCommitsForRepo(
  owner: string,
  repo: string,
  username: string,
  since: string,
  until: string
): Promise<ActivityItem[]> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/commits?author=${username}&since=${since}&until=${until}&per_page=100`;

  const res = await fetch(url, {
    headers: HEADERS,
  });

  const json = await res.json();
  if (!Array.isArray(json)) return [];

  return json.map((commit: any) => ({
    state: "",
    title: commit.commit.message.split("\n")[0],
    repo: `${owner}/${repo}`,
    url: commit.html_url,
    createdAt: commit.commit.author.date,
    type: "commit",
  }));
}

//기간 중 모든 커밋 내용 호출 api
export async function getAllCommits(
  username: string,
  from: string,
  to: string
): Promise<DailyActivityMap> {
  const repos = await getContributedReposInRange(username, from, to);
  const result: DailyActivityMap = {};

  const results = await Promise.all(
    repos.map((repo) =>
      fetchCommitsForRepo(repo.owner, repo.name, username, from, to)
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
export async function getActivities(
  username: string,
  from: string,
  to: string
): Promise<DailyActivityMap> {
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
    headers: HEADERS,
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
}: {
  username: string;
  from: string;
  to: string;
}): Promise<MergedActivity> {
  const [commitMap, activityMap] = await Promise.all([
    getAllCommits(username, from, to),
    getActivities(username, from, to),
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

export async function clientFetch({
  username,
  from,
  to,
}: {
  username: string;
  from: string;
  to: string;
}) {
  const res = await fetch("/api/github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, from, to }),
  });

  if (!res.ok) throw new Error("클라이언트 요청 실패");
  return await res.json();
}

export async function fetchData({
  username,
  from,
  to,
}: {
  username: string;
  from: string;
  to: string;
}): Promise<MergedActivity> {
  // 서버 환경인지 감지
  const isServer = typeof window === "undefined";

  if (isServer) {
    return serverFetch({ username, from, to });
  } else {
    return clientFetch({ username, from, to });
  }
}
