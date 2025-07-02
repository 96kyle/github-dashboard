import { DailyActivityMap } from "@/app/(main)/dashboard/types/activities";

const GITHUB_API = "https://api.github.com";
const GITHUB_API_GRAPH = "https://api.github.com/graphql";
const HEADERS = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  "Content-Type": "application/json",
};

export async function getUserRepos(username: string) {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100`,
    {
      headers: HEADERS,
    }
  );
  if (!res.ok) throw new Error(`Fail to get repos: ${res.status}`);
  return res.json();
}

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

export async function getCommitsInRepo(
  owner: string,
  repo: string,
  username: string,
  since: string, // e.g. "2025-06-01T00:00:00Z"
  until: string // e.g. "2025-06-30T23:59:59Z"
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?author=${username}&since=${since}&until=${until}`;

  const res = await fetch(url, {
    method: "GET",
    headers: HEADERS,
  });

  if (res.status !== 200) {
    console.error(`❌ Failed to fetch commits: ${res.status}`);
    return [];
  }

  const json = await res.json();

  if (!Array.isArray(json)) {
    console.error("Unexpected response:", json);
    return [];
  }

  return json.map((commit: any) => ({
    message: commit.commit.message.split("\n")[0],
    url: commit.html_url,
    date: commit.commit.author.date,
    sha: commit.sha,
  }));
}

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
          }
          ... on Issue {
            title
            url
            createdAt
            state
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
    const type = node.url.includes("/pull/") ? "PR" : "Issue";
    if (!result[date]) result[date] = [];
    result[date].push({
      title: node.title,
      url: node.url,
      createdAt: node.createdAt,
      type,
      state: node.state,
    });
  });

  const reviews =
    json.data.user.contributionsCollection.pullRequestReviewContributions.nodes;
  reviews.forEach((review: any) => {
    const date = review.occurredAt.split("T")[0];
    if (!result[date]) result[date] = [];
    result[date].push({
      title: review.pullRequest.title,
      url: review.pullRequest.url,
      createdAt: review.occurredAt,
      type: "Review",
      state: review.pullRequest.state,
    });
  });

  return result;
}
