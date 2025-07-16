import { DailyActivityMap } from "@/app/types/activities/activity_type";
import { useState } from "react";
import {
  AreaChart,
  Area,
  Line,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

export default function ActivityChart({
  selectedDate,
  count,
  prevMap,
  currentMap,
}: {
  selectedDate: Date;
  count: number;
  prevMap: DailyActivityMap;
  currentMap: DailyActivityMap;
}) {
  const maxDay = 31;
  const today = new Date();
  const currentMonthDayLimit =
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear()
      ? today.getDate()
      : maxDay;

  const lastOffset: { x: number; y: number } = {
    x: currentMonthDayLimit,
    y: count,
  };

  function buildChartData(
    prevMap: DailyActivityMap,
    currentMap: DailyActivityMap
  ) {
    let prevSum = 0;
    let currSum = 0;

    return Array.from({ length: maxDay }, (_, i) => i + 1).map((day) => {
      const dayStr = day.toString().padStart(2, "0");

      const prevKey = Object.keys(prevMap).find((d) =>
        d.endsWith(`-${dayStr}`)
      );
      const currKey = Object.keys(currentMap).find((d) =>
        d.endsWith(`-${dayStr}`)
      );

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
  }

  const data = buildChartData(prevMap, currentMap);

  return (
    <div className=" rounded-xl shadow-sm border border-gray-200 p-4  bg-white flex flex-col flex-1">
      <div className="border-l-1 border-b-1 flex-1 min-w-0 border-gray-300 aspect-[5/3]">
        <ResponsiveContainer width="100%" aspect={5 / 3}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c7d2fe" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#c7d2fe" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="prev"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorPrev)"
              activeDot={false}
              isAnimationActive={true}
              animationDuration={800}
              animationBegin={0}
            />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#FAC699"
              strokeWidth={3}
              dot={false}
              activeDot={false}
              isAnimationActive={true}
              animationDuration={800}
              animationBegin={0}
              connectNulls
            />
            <ReferenceDot
              x={lastOffset.x - 1}
              y={lastOffset.y}
              r={6}
              fill="#FAC699"
              stroke="white"
              strokeWidth={2}
              style={{
                cursor: "pointer",
              }}
            ></ReferenceDot>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
