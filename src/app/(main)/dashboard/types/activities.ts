export type ActivityItem = {
  type: "PR" | "Issue" | "Review" | "Commit";
  title: string;
  url: string;
  createdAt: string;
  state: string;
};

export type DailyActivityMap = {
  [date: string]: ActivityItem[];
};
