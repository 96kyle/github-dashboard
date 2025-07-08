import { fetchData, getActivities, getAllCommits } from "@/api/api";
import DashboardView from "./view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

export default async function DashboardPage() {
  const username = "96kyle";

  const today = new Date();
  const from = startOfMonth(today).toISOString();
  const to = endOfMonth(today).toISOString();

  const prevMonth = subMonths(today, 1);
  const prevFrom = startOfMonth(prevMonth).toISOString();
  const prevTo = endOfMonth(prevMonth).toISOString();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["activity", username, prevFrom],
    queryFn: () =>
      fetchData({ username: username, from: prevFrom, to: prevTo }),
  });

  await queryClient.prefetchQuery({
    queryKey: ["activity", username, from],
    queryFn: () => fetchData({ username: username, from: from, to: to }),
  });

  return (
    <div>
      <div className="bg-bg p-4 text-2xl  border-b-2 border-gray-300 text-fontNavy">
        Dashboard
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardView username={username} from={from} to={to} />
      </HydrationBoundary>
    </div>
  );
}
