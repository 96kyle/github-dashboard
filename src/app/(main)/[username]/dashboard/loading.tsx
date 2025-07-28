import {
  AlertCircle,
  GitCommit,
  GitPullRequest,
  MessageSquare,
} from "lucide-react";
import DashboardFallbackView from "./fallback/DashboardFallbackView";
import DashboardHeaderFallback from "./fallback/DashboardHeaderFallbackView";

export default function Loading() {
  return (
    <div className="flex flex-col items-center">
      <DashboardHeaderFallback />
      <div className="w-full p-6 max-w-[1300px] self-center">
        <DashboardFallbackView />
      </div>
    </div>
  );
}
