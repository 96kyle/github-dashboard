import { serverFetch } from "@/lib/api/activity_api";

export async function POST(req: Request) {
  try {
    const { from, to } = await req.json();
    if (!from || !to) {
      return new Response("Missing fields", { status: 400 });
    }

    const data = await serverFetch({ from, to });

    return Response.json(data);
  } catch (e) {
    console.error("Error in /api/activity:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
}
