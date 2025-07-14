"use client";

import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { DailyActivityMap } from "@/app/types/activities/activity_type";

export default function Calendar({
  data,
  selectedDate,
  setSelectedDate,
}: {
  data: DailyActivityMap;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const start = startOfMonth(selectedDate);
  const end = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start, end });

  const startDay = start.getDay();

  function returnColor(clickDate: Date) {
    const formatDate: string = format(clickDate, "yyyy-MM-dd");

    if (data[formatDate]) {
      if (data[formatDate].length >= 5) {
        return "bg-green-700";
      } else if (data[formatDate].length >= 4) {
        return "bg-green-600";
      } else if (data[formatDate].length >= 3) {
        return "bg-green-500";
      } else if (data[formatDate].length >= 2) {
        return "bg-green-400";
      } else if (data[formatDate].length >= 1) {
        return "bg-green-300";
      }
    } else {
      return "";
    }
  }

  return (
    <div className="p-4 pt-6 border-0 rounded-lg bg-bg shadow h-full">
      <div className="grid grid-cols-7 text-left">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div
            key={d}
            className="font-bold text-gray-600 border-b-1 border-gray-300"
          >
            {d}
          </div>
        ))}

        {Array.from({ length: startDay }).map((_, idx) => (
          <div key={`empty-${idx}`} className="" />
        ))}

        {monthDays.map((date) => (
          <div
            key={date.toISOString()}
            onClick={() => setSelectedDate(date)}
            className={`text-black text-sm cursor-pointer aspect-square text-left p-1 flex justify-start bg-bg
              ${
                date?.toDateString() === selectedDate.toDateString()
                  ? `shadow-[0_0_8px_8px_rgba(0,0,0,0.3)] font-bold z-10  ${returnColor(
                      date
                    )}`
                  : `hover:bg-blue-100 ${returnColor(date)}`
              }`}
          >
            <div className="px-1">{date.getDate()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
