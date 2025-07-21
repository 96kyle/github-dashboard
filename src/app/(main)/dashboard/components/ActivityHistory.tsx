import { DailyActivityMap } from "@/app/types/activities/activity_type";
import { formatDate } from "date-fns";
import {
  AlertCircle,
  Calendar,
  GitBranch,
  GitCommit,
  GitPullRequest,
  MessageSquare,
} from "lucide-react";

export default function ActivityHistory({
  items,
  selectedDate,
}: {
  items: DailyActivityMap;
  selectedDate: Date;
}) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "commit":
        return <GitCommit className="w-4 h-4" />;
      case "pr":
        return <GitPullRequest className="w-4 h-4" />;
      case "issue":
        return <AlertCircle className="w-4 h-4" />;
      case "review":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <GitBranch className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "commit":
        return "text-green-600 bg-green-50 border-green-200";
      case "pr":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "issue":
        return "text-red-600 bg-red-50 border-red-200";
      case "review":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const selectedDateToString: string = formatDate(selectedDate, "yyyy-MM-dd");

  return (
    <div className="space-y-6 mt-4 ">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedDate
            ? `${new Date(selectedDate).getDate()}일 활동`
            : "날짜를 선택하세요"}
        </h3>

        {items[selectedDateToString] ? (
          <div className="space-y-4">
            {items[selectedDateToString].map((activity, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getActivityColor(
                  activity.type
                )} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {activity.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="font-medium">{activity.repo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatDate(
                          activity.createdAt,
                          "yyyy년 MM월 dd일 hh시 mm분 a"
                        )}
                      </span>
                      <span className="px-2 py-1 bg-white bg-opacity-80 rounded text-xs font-medium">
                        {activity.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {selectedDate
                ? "이 날짜에는 활동이 없습니다."
                : "캘린더에서 날짜를 선택해주세요."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
