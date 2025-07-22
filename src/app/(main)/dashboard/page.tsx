import { fetchData } from "@/lib/api/activity_api";
import DashboardView from "./view";
import { QueryClient } from "@tanstack/react-query";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { getGitHubContext } from "@/lib/auth/github_auth";
import { LoginInfo } from "@/app/types/users/user_type";
import { Metadata } from "next";
import { MergedActivity } from "@/app/types/activities/activity_type";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "GitHub 활동분석",
  description: "GitHub 커밋, PR, 이슈 활동들을 시각화합니다.",
  openGraph: {
    title: "GitHub 활동 분석",
    description: "GitHub 커밋, PR, 이슈 활동들을 시각화합니다.",
    url: `${baseUrl}/dashboard`,
    siteName: "GitHub Activity Analysis",
    type: "website",
  },
};

export default async function DashboardPage() {
  const today = new Date().toISOString();
  const from = startOfMonth(today).toISOString();
  const to = endOfMonth(today).toISOString();

  const prevMonth = subMonths(today, 1);
  const prevFrom = startOfMonth(prevMonth).toISOString();
  const prevTo = endOfMonth(prevMonth).toISOString();

  const queryClient = new QueryClient();

  const userInfo: LoginInfo = await getGitHubContext();

  const prevData = await queryClient.prefetchQuery<MergedActivity>({
    queryKey: ["activity", userInfo.username, prevFrom],
    queryFn: () =>
      fetchData({
        from: prevFrom,
        to: prevTo,
        isServer: true,
      }),
  });

  const currData = await queryClient.prefetchQuery<MergedActivity>({
    queryKey: ["activity", userInfo.username, from],
    queryFn: () =>
      fetchData({
        from: from,
        to: to,
        isServer: true,
      }),
  });

  return (
    <div>
      <DashboardView
        userInfo={userInfo}
        date={today}
        initPrevData={prevData!}
        initCurrData={currData!}
      />
    </div>
  );
}
