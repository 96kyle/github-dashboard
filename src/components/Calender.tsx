"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const today = new Date();

  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const monthDays = eachDayOfInterval({ start, end });

  const startDay = start.getDay();

  return (
    <div className="p-4 pt-6 border-0 rounded-lg bg-bg">
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
          <div key={`empty-${idx}`} />
        ))}

        {monthDays.map((date) => (
          <div
            key={date.toISOString()}
            onClick={() => setSelectedDate(date)}
            className={`text-fontGrey font-semibold cursor-pointer aspect-square text-left p-1 flex justify-start
              ${
                selectedDate?.toDateString() === date.toDateString()
                  ? "shadow-xl font-bold bg-white"
                  : "hover:bg-blue-100"
              }`}
          >
            {date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}
