import { FaCodeCommit, FaCodePullRequest } from "react-icons/fa6";
import { VscIssues, VscCodeReview } from "react-icons/vsc";

export default function DashboardFallbackView() {
  return (
    <div className="w-full">
      <div className="flex flex-row mb-4 gap-6">
        {[
          { title: "Commits", Icon: FaCodeCommit },
          { title: "Issues", Icon: VscIssues },
          { title: "PRs", Icon: FaCodePullRequest },
          { title: "PR Reviews", Icon: VscCodeReview },
        ].map(({ title, Icon }) => (
          <div
            key={title}
            className="min-w-0 flex-1 bg-bg p-4 rounded-lg shadow animate-pulse"
          >
            <div className="flex flex-row items-center mb-2">
              <Icon className="text-fontGrey" size={20} />
              <p className="ml-2 text-fontGrey text-lg">{title}</p>
            </div>

            <div className="flex flex-row items-center mb-4">
              <div className="w-14 h-6 bg-gray-300 rounded" />
              <div className="ml-2 px-3 py-1 bg-gray-300 rounded-2xl w-16 h-6" />
            </div>

            <div className="w-40 h-4 bg-gray-300 rounded" />
          </div>
        ))}
      </div>

      <div className="flex flex-row gap-4">
        <div className="flex-1 w-full min-w-0">
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="flex-1"></div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex flex-row gap-4 pl-4"></div>
      </div>
    </div>
  );
}
