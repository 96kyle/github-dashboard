import { DailyActivityMap } from "@/app/types/activities/activity_type";
import { ResponsiveContainer, Bar, BarChart, XAxis } from "recharts";

export default function ActivityBarChart({
  today,
  selectedDate,
  prevActivity,
  currActivity,
  shouldRenderChart,
}: {
  today: Date;
  selectedDate: Date;
  prevActivity: DailyActivityMap;
  currActivity: DailyActivityMap;
  shouldRenderChart: boolean;
}) {
  const nowMonth =
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear();

  const findDataByDate = (data: DailyActivityMap, day: number) => {
    const dayStr = day.toString().padStart(2, "0");

    const key = Object.keys(data).find((d) => d.endsWith(`-${dayStr}`));

    return key;
  };

  const buildChartData = () => {
    const countList = [
      {
        id: 7,
        name: "일",
        count: 0,
        length: 0,
      },
      {
        id: 1,
        name: "월",
        count: 0,
        length: 0,
      },
      {
        id: 2,
        name: "화",
        count: 0,
        length: 0,
      },
      {
        id: 3,
        name: "수",
        count: 0,
        length: 0,
      },
      {
        id: 4,
        name: "목",
        count: 0,
        length: 0,
      },
      {
        id: 5,
        name: "금",
        count: 0,
        length: 0,
      },
      {
        id: 6,
        name: "토",
        count: 0,
        length: 0,
      },
    ];

    for (let i = 1; i <= 31; i++) {
      const prevKey = findDataByDate(prevActivity, i);
      const prevCount = prevKey ? prevActivity[prevKey].length : 0;
      const prevDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() - 1,
        i
      ).getDay();
      countList[prevDay].count += prevCount;
      countList[prevDay].length++;

      const currKey = findDataByDate(currActivity, i);
      const currCount = currKey ? currActivity[currKey].length : 0;
      const currDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        i
      ).getDay();
      countList[currDay].count += currCount;
      if (!nowMonth || i <= today.getDate()) {
        countList[currDay].length++;
      }
    }
    const chartData = countList
      .map((e) => ({ ...e, value: e.count / e.length }))
      .sort((a, b) => {
        if (b.value !== a.value) {
          return b.value - a.value;
        }
        return a.id - b.id;
      });

    return chartData;
  };

  const data = buildChartData();

  return (
    <div className=" rounded-xl shadow-sm border border-gray-200 p-4  bg-white flex flex-col flex-1">
      <div className="font-semibold text-xl ">
        최근 2달간 {data[0].name}요일에 가장 많은 활동을 했어요!
      </div>
      <div className="font-medium text-lg mt-1">
        평균 {data[0].value.toFixed(2)}번의 활동을 했어요
      </div>
      <div className="flex-1 min-w-0 aspect-[5/3] mt-2 ">
        {shouldRenderChart ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="15%">
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: "#d1d5db", width: 1 }}
                tickMargin={12}
              />
              <Bar
                dataKey="value"
                fill="#8884d8"
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
