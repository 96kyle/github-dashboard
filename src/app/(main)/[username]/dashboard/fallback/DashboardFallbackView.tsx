import {
  AlertCircle,
  GitCommit,
  GitPullRequest,
  MessageSquare,
} from "lucide-react";

export default function DashboardFallbackView() {
  return (
    <div className="w-full">
      <div className="flex flex-row mb-4 gap-6">
        {[
          { title: "Commits", Icon: GitCommit },
          { title: "Issues", Icon: AlertCircle },
          { title: "PRs", Icon: GitPullRequest },
          { title: "PR Reviews", Icon: MessageSquare },
        ].map(({ title, Icon }) => (
          <div
            key={title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1 animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <div className="w-5 h-5 rounded">
                  <Icon className="text-fontGrey" size={20} />
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="h-8 w-16 bg-gray-300 rounded" />
                <div className="h-3 w-14 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="h-4">{title}</div>
              <div className="h-4 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 w-full min-w-0 mb-4">
        <div className="w-full aspect-[3/1] bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="flex-1 w-full min-w-0">
        <div className="w-full aspect-[3/1] bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
