import {
  ActivityItem,
  ActivityType,
  CommitContributionEntry,
  DailyActivityMap,
  // GithubIssueOrPRNode,
  MergedActivity,
  // PullRequestReviewContributionNode,
} from "@/app/types/activities/activity_type";
import { ActivityReq } from "@/app/types/activities/activity_request";
import { getGitHubContext } from "../auth/github_auth";
import { formatKorean } from "@/app/util/date_format";

const GITHUB_API = "https://api.github.com";
const GITHUB_API_GRAPH = "https://api.github.com/graphql";

//기간 중 활동한 레포지토리 목록 api
export const getContributedReposInRange = async ({
  username,
  from,
  to,
  token,
}: ActivityReq): Promise<{ owner: string; name: string }[]> => {
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

  data.commitContributionsByRepository.forEach(
    (entry: CommitContributionEntry) => {
      push(entry.repository.owner.login, entry.repository.name);
    }
  );

  return Array.from(repos).map((fullName) => {
    const [owner, name] = fullName.split("/");
    return { owner, name };
  });
};

const hasNextPage = (headers: Headers): boolean => {
  const link = headers.get("link");
  return link?.includes('rel="next"') ?? false;
};

//레포 별 커밋 목록 호출 api
export const fetchCommitsForRepo = async (
  owner: string,
  repo: string,
  username: string,
  since: string,
  until: string,
  token: string
) => {
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

    const commits = json.map((commit) => {
      const activity: ActivityItem = {
        state: "",
        title: commit.commit.message.split("\n")[0],
        repo: `${owner}/${repo}`,
        url: commit.html_url,
        createdAt: commit.commit.author.date,
        type: "commit",
      };
      return activity;
    });

    allCommits.push(...commits);

    // ✅ Link 헤더에 next 없으면 종료
    if (!hasNextPage(res.headers)) break;

    page++;
  }

  return allCommits;
};

//기간 중 모든 커밋 내용 호출 api
export const getAllCommits = async ({
  username,
  from,
  to,
  token,
}: ActivityReq): Promise<DailyActivityMap> => {
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
};

//기간동안 모든 pr, issues, review 호출 api
export const getActivities = async ({
  username,
  from,
  to,
  token,
}: ActivityReq): Promise<DailyActivityMap> => {
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
  try {
    const res = await fetch(GITHUB_API_GRAPH, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a = new Date(from);
    console.log("from ------>" + formatKorean(a.toISOString(), "yyyy-M"));

    json.data.search.nodes.forEach((node: any) => {
      const createdAt = new Date(node.createdAt);
      const searchDate = new Date(from);

      const type = node.url.includes("/pull/") ? "pr" : "issue";
      const repo = `${node.repository.owner.login}/${node.repository.name}`;

      if (
        node.author.login === username &&
        formatKorean(createdAt.toISOString(), "yyyy-M") ===
          formatKorean(searchDate.toISOString(), "yyyy-M")
      ) {
        const korDate = formatKorean(createdAt.toISOString(), "yyyy-MM-dd");
        if (!result[korDate]) result[korDate] = [];

        result[korDate].push({
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
      json.data.user.contributionsCollection.pullRequestReviewContributions
        .nodes;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reviews.forEach((review: any) => {
      const occurredAt = new Date(review.occurredAt);
      const searchDate = new Date(from);

      const repo = `${review.pullRequest.repository.owner.login}/${review.pullRequest.repository.name}`;

      if (
        formatKorean(occurredAt.toISOString(), "yyyy-M") ===
        formatKorean(searchDate.toISOString(), "yyyy-M")
      ) {
        const korDate = formatKorean(occurredAt.toISOString(), "yyyy-MM-dd");
        if (!result[korDate]) result[korDate] = [];
        result[korDate].push({
          title: review.pullRequest.title,
          url: review.pullRequest.url,
          createdAt: review.occurredAt,
          type: "review",
          state: review.pullRequest.state,
          repo,
        });
      }
    });

    return result;
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const serverFetch = async ({
  from,
  to,
}: {
  from: string;
  to: string;
}): Promise<MergedActivity> => {
  const { username, token } = await getGitHubContext();

  const commitMap = await getAllCommits({ username, from, to, token });
  const activityMap = await getActivities({ username, from, to, token });

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
};

export const clientFetch = async ({
  from,
  to,
}: {
  from: string;
  to: string;
}): Promise<MergedActivity> => {
  const res = await fetch("/api/github/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to }),
  });

  if (!res.ok) throw new Error("클라이언트 요청 실패");

  const data = await res.json();

  return data;
};

export const fetchData = async ({
  from,
  to,
  isServer,
}: {
  from: string;
  to: string;
  isServer: boolean;
}): Promise<MergedActivity> => {
  if (isServer) {
    return serverFetch({ from, to });
  } else {
    return clientFetch({ from, to });
  }
};
