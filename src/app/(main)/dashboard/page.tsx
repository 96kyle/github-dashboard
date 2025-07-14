import { fetchData } from "@/app/lib/services/github/activity_api";
import DashboardView from "./view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { LoginButton } from "@/components/LoginButton";
import { getLoginInfo } from "@/app/lib/services/users/user_api";
import { LoginInfo } from "../../types/users/user_type";

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

  return (
    <div>
      <div className="bg-bg p-4 text-2xl  border-b-2 border-gray-300 text-fontNavy flex flex-row justify-between">
        Dashboard
        <LoginButton clientId={clientId!} />
        {/* {loggedInUsername ? (
          <p>{loggedInUsername}</p>
        ) : (
          
        )} */}
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardView today={today} userInfo={userInfo} />
      </HydrationBoundary>
    </div>
  );
}
