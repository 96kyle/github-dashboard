import { fetchData } from "@/lib/api/activity_api";
import DashboardView from "./view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { getGitHubContext } from "@/lib/auth/github_auth";
import { LoginInfo } from "@/app/types/users/user_type";

export default async function DashboardPage() {
  const today = new Date();
  const from = startOfMonth(today).toISOString();
  const to = endOfMonth(today).toISOString();

  const prevMonth = subMonths(today, 1);
  const prevFrom = startOfMonth(prevMonth).toISOString();
  const prevTo = endOfMonth(prevMonth).toISOString();

  const queryClient = new QueryClient();

  const userInfo: LoginInfo = await getGitHubContext();

  await queryClient.prefetchQuery({
    queryKey: ["activity", userInfo.username, prevFrom],
    queryFn: () =>
      fetchData({
        from: prevFrom,
        to: prevTo,
      }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["activity", userInfo.username, from],
    queryFn: () =>
      fetchData({
        from: from,
        to: to,
      }),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardView userInfo={userInfo} />
      </HydrationBoundary>
    </div>
  );
}
