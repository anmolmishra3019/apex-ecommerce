import { NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/db/store";

export async function GET() {
  try {
    const metrics = await DatabaseStore.getDashboardMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
