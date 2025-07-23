"use client";

import { eachDayOfInterval } from "date-fns";
import { DailyActivityMap } from "@/app/types/activities/activity_type";
import { formatKorean } from "@/app/util/date_format";
import { endOfMonthUTC, startOfMonthUTC } from "@/app/util/date_util";

export default function ActivityCalendar({
  data,
  count,
  selectedDate,
  setSelectedDate,
}: {
  data: DailyActivityMap;
  count: number;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const start = startOfMonthUTC(selectedDate);
  const end = endOfMonthUTC(selectedDate);
  const monthDays = eachDayOfInterval({ start, end });

  console.log(end);

  const startDay = Number(formatKorean(start.toISOString(), "e"));

  const returnColor = (clickDate: Date) => {
    const formatDate: string = formatKorean(
      clickDate.toISOString(),
      "yyyy-MM-dd"
    );

    if (data[formatDate]) {
      if (data[formatDate].length >= 5) {
        return "bg-green-500";
      } else if (data[formatDate].length >= 4) {
        return "bg-green-400";
      } else if (data[formatDate].length >= 3) {
        return "bg-green-300";
      } else if (data[formatDate].length >= 2) {
        return "bg-green-200";
      } else if (data[formatDate].length >= 1) {
        return "bg-green-100";
      }
    } else {
      return "";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0
                ? "text-red-500"
                : index === 6
                ? "text-blue-500"
                : "text-gray-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={i} className="h-12"></div>
        ))}
        {monthDays.map((day, index) => {
          const isSelected =
            formatKorean(day.toISOString(), "d") ===
            formatKorean(selectedDate.toISOString(), "d");

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`
                          h-12 rounded-lg border-2 transition-all duration-200 text-base font-medium flex items-center justify-center cursor-pointer
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                              : "border-transparent"
                          }
                          
                          ${returnColor(day)}
                          
                        `}
            >
              {formatKorean(day.toISOString(), "d")}
            </button>
          );
        })}
      </div>
      <div className="flex flex-row pt-6 justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>적음</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          </div>
          <span>많음</span>
        </div>
        <div className="text-sm text-gray-500">총 {count}개의 활동</div>
      </div>
    </div>
  );
}
