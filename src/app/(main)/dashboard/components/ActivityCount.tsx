import { IconType } from "react-icons";

export default function ActivityCount({
  title,
  Icon,
  iconColor,
  count,
  beforeCount,
}: {
  title: string;
  Icon: IconType;
  iconColor: string;
  count: number;
  beforeCount: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{count}회</div>
          <div className={`text-xs ${iconColor}`}>
            {beforeCount > count ? "▼ " : "▲ "}
            {Math.abs(count - beforeCount)}회
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">{title}</span>
        <br />
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
    </div>
  );
}
