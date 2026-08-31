import { NextRequest, NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/db/store";

export async function GET() {
  try {
    const shipments = await DatabaseStore.getShipments();
    return NextResponse.json({ success: true, count: shipments.length, shipments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, courier } = body;

    if (!orderId || !courier) {
      return NextResponse.json(
        { success: false, error: "Order ID and Courier Partner are required" },
        { status: 400 }
      );
    }

    const shipment = await DatabaseStore.createShipment({ orderId, courier });
    return NextResponse.json({ success: true, shipment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
