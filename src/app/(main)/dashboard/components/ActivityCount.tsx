import { IconType } from "react-icons";

export default function ActivityCount({
  title,
  Icon,
  count,
  beforeCount,
}: {
  title: string;
  Icon: IconType;
  count: number;
  beforeCount: number;
}) {
  return (
    <div className="min-w-0 flex-1 bg-white p-4 rounded-lg shadow">
      <div className="flex flex-row items-center mb-2">
        <Icon className="text-fontGrey" size={20} />
        <p className="ml-2 text-fontGrey text-lg">{title}</p>
      </div>
      <div className="flex flex-row items-center mb-4">
        <p className=" text-fontGrey text-lg">{count}회</p>
        <div className="ml-2 px-3 py-1 text-fontGrey  rounded-2xl bg-gray-200 text-xs font-bold">
          {beforeCount > count ? "▼ " : "▲ "}
          {Math.abs(count - beforeCount)}회
        </div>
      </div>
      <p className="text-fontGrey text-sm">
        지난 달보다{" "}
        <span
          className={`${
            beforeCount > count ? "text-blue-500" : "text-red-500"
          } font-bold`}
        >
          {Math.abs(count - beforeCount)}
        </span>
        회 {beforeCount > count ? "감소했습니다." : "증가했습니다."}
      </p>
    </div>
  );
}
