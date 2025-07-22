import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/api/activity_api";

export async function POST(req: Request) {
  try {
    const { from, to } = await req.json();

    if (!from || !to) {
      return NextResponse.json(
        { error: "Invalid 'from' or 'to' field" },
        { status: 400 }
      );
    }

    const data = await serverFetch({ from, to });

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Error in /api/activity:", message);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
