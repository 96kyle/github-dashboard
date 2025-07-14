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
  }

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

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-16"></div>;
          }

          const isSelected = day.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`
                          h-16 rounded-lg border-2 transition-all duration-200 text-lg font-medium flex items-center justify-center cursor-pointer
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                              : "border-transparent"
                          }
                          
                          ${returnColor(day)}
                          
                        `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
