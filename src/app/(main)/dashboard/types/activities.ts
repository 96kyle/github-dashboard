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
