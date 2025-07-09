import { serverFetch } from "@/app/lib/services/api";

export async function POST(req: Request) {
  try {
    const { username, from, to } = await req.json();
    if (!username || !from || !to) {
      return new Response("Missing fields", { status: 400 });
    }

    const data = await serverFetch({ username, from, to });
    return Response.json(data);
  } catch (e) {
    console.error("Error in /api/activity:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
