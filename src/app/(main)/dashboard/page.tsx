import { fetchData } from "@/app/lib/services/github/activity_api";
import DashboardView from "./view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { getLoginInfo } from "@/app/lib/services/users/user_api";
import { LoginInfo } from "../../types/users/user_type";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const userInfo: LoginInfo = (await getLoginInfo()) ?? {
    username: "96kyle",
    token: process.env.GITHUB_TOKEN ?? "",
  };

  const today = new Date();
  const from = startOfMonth(today).toISOString();
  const to = endOfMonth(today).toISOString();

  const prevMonth = subMonths(today, 1);
  const prevFrom = startOfMonth(prevMonth).toISOString();
  const prevTo = endOfMonth(prevMonth).toISOString();

  const queryClient = new QueryClient();

  const clientId = process.env.GITHUB_CLIENT_ID;

  await queryClient.prefetchQuery({
    queryKey: ["activity", userInfo.username, prevFrom],
    queryFn: () =>
      fetchData({
        username: userInfo.username,
        from: prevFrom,
        to: prevTo,
        token: userInfo.token,
      }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["activity", userInfo.username, from],
    queryFn: () =>
      fetchData({
        username: userInfo.username,
        from: from,
        to: to,
        token: userInfo.token,
      }),
  });

  const cookieStore = await cookies();
  const token = cookieStore.get("github_token")?.value;

  const isLogin = Boolean(token); // 로그인 여부 판단

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardView
          today={today}
          userInfo={userInfo}
          clientId={clientId ?? ""}
          isLogin={isLogin}
        />
      </HydrationBoundary>
    </div>
  );
}
