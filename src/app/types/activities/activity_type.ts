export type ActivityType = "pr" | "issue" | "review" | "commit";

export type ActivityItem = {
  type: ActivityType;
  repo: string;
  title: string;
  url: string;
  createdAt: string;
  state: string;
};

export type DailyActivityMap = {
  [date: string]: ActivityItem[];
};

export type MergedActivity = {
  map: DailyActivityMap;
  totalCount: Record<ActivityType, number>;
};

export type CommitContributionEntry = {
  repository: {
    name: string;
    owner: {
      login: string;
    };
  };
};

export type GithubIssueOrPRNode = {
  __typename: "Issue" | "PullRequest";
  createdAt: string;
  title: string;
  url: string;
  state: "OPEN" | "CLOSED" | "MERGED" | string;
  author: {
    login: string;
  };
  repository: {
    name: string;
    owner: {
      login: string;
    };
  };
};

export type PullRequestReviewContributionNode = {
  occurredAt: string;
  pullRequest: {
    title: string;
    url: string;
    state: string;
    repository: {
      name: string;
      owner: {
        login: string;
      };
    };
  };
};
