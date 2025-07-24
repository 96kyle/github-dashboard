import { fetchData } from "@/lib/api/activity_api";
// import DashboardView from "./view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { subMonths } from "date-fns";
import { getGitHubContext } from "@/lib/auth/github_auth";
import { LoginInfo } from "@/app/types/users/user_type";
import { Metadata } from "next";
import { MergedActivity } from "@/app/types/activities/activity_type";
import DashboardView from "./view";
import { endOfMonthUTC, startOfMonthUTC } from "@/app/util/date_util";
// import DashboardView from "./view";

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
  const today = new Date();

  const from = startOfMonthUTC(today).toISOString();
  const to = endOfMonthUTC(today).toISOString();

  const prevMonth = subMonths(today, 1);
  const prevFrom = startOfMonthUTC(prevMonth).toISOString();
  const prevTo = endOfMonthUTC(prevMonth).toISOString();

  console.log(from);
  console.log(to);

  const queryClient = new QueryClient();

  const userInfo: LoginInfo = await getGitHubContext();

  await queryClient.prefetchQuery<MergedActivity>({
    queryKey: ["activity", userInfo.username, prevFrom.substring(0, 10)],
    queryFn: () =>
      fetchData({
        from: prevFrom,
        to: prevTo,
        isServer: true,
      }),
    staleTime: 1000 * 60 * 5,
  });

  await queryClient.prefetchQuery<MergedActivity>({
    queryKey: ["activity", userInfo.username, from.substring(0, 10)],
    queryFn: () =>
      fetchData({
        from: from,
        to: to,
        isServer: true,
      }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardView userInfo={userInfo} date={today} />
      </HydrationBoundary>
    </div>
  );
}
