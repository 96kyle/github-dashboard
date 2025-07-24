import { fetchData } from "@/lib/api/activity_api";
// import DashboardView from "./view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { getGitHubContext } from "@/lib/auth/github_auth";
import { LoginInfo } from "@/app/types/users/user_type";
import { Metadata } from "next";
import { MergedActivity } from "@/app/types/activities/activity_type";
import DashboardView from "./view";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
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
  const timeZone = "Asia/Seoul";

  const today = toZonedTime(new Date(), timeZone);

  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const from = fromZonedTime(monthStart, timeZone).toISOString();
  const to = fromZonedTime(monthEnd, timeZone).toISOString();

  const prevMonth = subMonths(today, 1);
  const prevMonthStart = startOfMonth(prevMonth);
  const prevMonthEnd = endOfMonth(prevMonth);

  const prevFrom = fromZonedTime(prevMonthStart, timeZone).toISOString();
  const prevTo = fromZonedTime(prevMonthEnd, timeZone).toISOString();

  const queryClient = new QueryClient();

  const userInfo: LoginInfo = await getGitHubContext();

  console.log(today);

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
