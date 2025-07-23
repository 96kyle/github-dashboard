import {
  DailyActivityMap,
  MergedActivity,
} from "@/app/types/activities/activity_type";
import { formatKorean } from "@/app/util/date_format";
import { subMonths } from "date-fns";
import {
  AreaChart,
  Area,
  Line,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

export default function ActivityChart({
  today,
  selectedDate,
  prevActivity,
  currentActivity,
  shouldRenderChart,
}: {
  today: Date;
  selectedDate: Date;
  prevActivity: MergedActivity;
  currentActivity: MergedActivity;
  shouldRenderChart: boolean;
}) {
  const maxDay = 31;
  const currentMonthDayLimit =
    formatKorean(selectedDate, "yyyy-M") === formatKorean(today, "yyyy-M")
      ? Number(formatKorean(today, "d"))
      : maxDay;
  const prevCount =
    (prevActivity?.totalCount.commit ?? 0) +
    (prevActivity?.totalCount.pr ?? 0) +
    (prevActivity?.totalCount.issue ?? 0) +
    (prevActivity?.totalCount.review ?? 0);
  const currentCount =
    (currentActivity?.totalCount.commit ?? 0) +
    (currentActivity?.totalCount.pr ?? 0) +
    (currentActivity?.totalCount.issue ?? 0) +
    (currentActivity?.totalCount.review ?? 0);

  const lastOffset: { x: number; y: number } = {
    x: currentMonthDayLimit,
    y: currentCount,
  };

  const findDataByDate = (data: DailyActivityMap, day: number) => {
    const dayStr = day.toString().padStart(2, "0");

    const key = Object.keys(data).find((d) => d.endsWith(`-${dayStr}`));

    return key;
  };

  const buildChartData = (
    prevMap: DailyActivityMap,
    currentMap: DailyActivityMap
  ): { day: string; prev: number; current: number | undefined }[] => {
    let prevSum = 0;
    let currSum = 0;

    const data: { day: string; prev: number; current: number | undefined }[] =
      Array.from({ length: maxDay }, (_, i) => i + 1).map((day) => {
        const prevKey = findDataByDate(prevMap, day);
        const currKey = findDataByDate(currentMap, day);

        const prevCount = prevKey ? prevMap[prevKey].length : 0;
        const currCount = currKey ? currentMap[currKey].length : 0;

        prevSum += prevCount;
        currSum += currCount;

        return {
          day: `${day}일`,
          prev: prevSum,
          current: day <= currentMonthDayLimit ? currSum : undefined,
        };
      });

    const defaultData = { day: "0일", prev: 0, current: 0 };

    return [defaultData, ...data];
  };

  const countPrevMonth = (): number => {
    if (
      formatKorean(selectedDate, "yyyy-M") === formatKorean(today, "yyyy-M")
    ) {
      let count = 0;
      for (let i = 1; i <= Number(formatKorean(today, "d")); i++) {
        const key = findDataByDate(prevActivity.map, i);
        count = count + (key ? prevActivity.map[key].length : 0);
      }

      return count;
    } else {
      return prevCount;
    }
  };

  const data = buildChartData(prevActivity.map, currentActivity.map);

  const diff = currentCount - countPrevMonth();

  const titleCommnet = (): string => {
    if (
      formatKorean(selectedDate, "yyyy-M") === formatKorean(today, "yyyy-M")
    ) {
      if (diff > 0) {
        return `지난달 ${formatKorean(
          subMonths(today, 1).toISOString(),
          "d"
        )}일 보다 ${Math.abs(diff)}번의 많은 활동을 했어요`;
      } else if (diff < 0) {
        return `지난달에 비해 ${formatKorean(
          subMonths(today, 1).toISOString(),
          "d"
        )}일 보다 ${Math.abs(diff)}번의 적은 활동을 했어요`;
      } else {
        return `지난달과 동일한 활동을 했어요`;
      }
    } else {
      if (diff > 0) {
        return `지난달보다 ${Math.abs(diff)}번의 많은 활동을 했어요`;
      } else if (diff < 0) {
        return `지난달에 비해 ${Math.abs(diff)}번의 적은 활동을 했어요`;
      } else {
        return `지난달과 동일한 활동을 했어요`;
      }
    }
  };

  return (
    <div className=" rounded-xl shadow-sm border border-gray-200 p-4  bg-white flex flex-col flex-1">
      <div className="font-semibold text-xl ">
        {currentCount - countPrevMonth() >= 0
          ? "지난달보다 페이스가 좋아요!"
          : "지난달보다 페이스가 아쉬워요.."}
      </div>
      <div className="font-medium text-lg mt-1">{titleCommnet()}</div>
      <div className="border-l-1 border-b-1 flex-1 min-w-0 border-gray-300 aspect-[5/3] mt-2">
        {shouldRenderChart ? (
          <ResponsiveContainer width="100%" aspect={5 / 3}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#e5e7eb" stopOpacity={0.8} />
                  <stop offset="90%" stopColor="#e5e7eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="prev"
                stroke="#d1d5db"
                fillOpacity={1}
                fill="url(#colorPrev)"
                activeDot={false}
                isAnimationActive={true}
                animationDuration={1200}
                animationBegin={0}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#6366f1"
                strokeWidth={3}
                dot={false}
                activeDot={false}
                isAnimationActive={true}
                animationDuration={1200}
                animationBegin={0}
                connectNulls
              />
              <ReferenceDot
                x={lastOffset.x}
                y={lastOffset.y}
                r={6}
                fill="#6366f1"
                stroke="white"
                strokeWidth={2}
                style={{
                  cursor: "pointer",
                }}
              ></ReferenceDot>
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div></div>
        )}
      </div>
      <div className="flex flex-row justify-center items-center gap-2 pt-4">
        <div className="w-8 h-1 bg-[#6366F1] "></div>
        <div>{Number(formatKorean(selectedDate, "M"))}월</div>
        <div className="w-8 h-1 bg-[#d1d5db] "></div>
        <div>{Number(formatKorean(selectedDate, "M")) - 1}월</div>
      </div>
    </div>
  );
}
