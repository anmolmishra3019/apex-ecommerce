import { NextRequest, NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/db/store";

export async function GET(
  req: NextRequest,
  { params }: { params: { awb: string } }
) {
  try {
    const shipment = await DatabaseStore.getShipmentByAWB(params.awb);
    if (!shipment) {
      return NextResponse.json({ success: false, error: "Shipment AWB not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, shipment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { awb: string } }
) {
  try {
    const body = await req.json();
    const { status, location, description } = body;

    if (!status || !location) {
      return NextResponse.json(
        { success: false, error: "Status and location are required" },
        { status: 400 }
      );
    }

    const updated = await DatabaseStore.updateShipmentMilestone({
      trackingNumber: params.awb,
      status,
      location,
      description: description || `Status updated to ${status} at ${location}`,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: "Shipment AWB not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, shipment: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
