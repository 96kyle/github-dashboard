import {
  ActivityItem,
  DailyActivityMap,
} from "@/app/types/activities/activity_type";

export default function ActivityHistory({
  items,
  date,
}: {
  items: DailyActivityMap;
  date: Date;
}) {
  function countReposInDailyActivity(
    map: DailyActivityMap
  ): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const date in map) {
      const items: ActivityItem[] = map[date];

      for (const item of items) {
        counts[item.repo] = (counts[item.repo] || 0) + 1;
      }
    }

    return counts;
  }

  const repoCounts = countReposInDailyActivity(items);

  return (
    <div className="min-w-0 flex-1 bg-bg p-4 rounded-lg shadow h-full max-h-[500px] min-h-0 overflow-auto">
      {Object.entries(repoCounts).map(([repo, count]) => (
        <div key={repo} className="flex justify-between">
          <span className="font-medium">{repo}</span>
          <span className="text-gray-500">{count}개</span>
        </div>
      ))}
    </div>
  );
}
