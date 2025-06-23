// components/Calendar.tsx
"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const today = new Date();
  const monthDays = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  return (
    <div className="w-80 mx-auto p-4 border-0 rounded-lg bg-bg">
      <h2 className="text-xl font-bold mb-4">{format(today, "yyyy년 M월")}</h2>
      <div className="grid grid-cols-7 gap-2 text-center">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="font-bold text-gray-600">
            {d}
          </div>
        ))}
        {monthDays.map((date) => (
          <div
            key={date.toISOString()}
            onClick={() => setSelectedDate(date)}
            className={`p-1 text-fontGrey font-semibold rounded-full cursor-pointer aspect-square ${
              selectedDate?.toDateString() === date.toDateString()
                ? "bg-fontNavy text-white font-bold"
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
