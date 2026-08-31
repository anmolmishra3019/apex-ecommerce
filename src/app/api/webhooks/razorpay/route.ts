import { NextRequest, NextResponse } from "next/server";
import { RazorpayService } from "@/lib/razorpay";
import { DatabaseStore } from "@/lib/db/store";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (signature && process.env.NODE_ENV === "production") {
      const isValid = RazorpayService.verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`[Razorpay Webhook] Received event: ${event}`);

    switch (event) {
      case "payment.captured": {
        const paymentEntity = payload.payload?.payment?.entity;
        const orderId = paymentEntity?.notes?.orderId;
        if (orderId) {
          await DatabaseStore.updateOrderStatus(orderId, "PAID");
        }
        break;
      }
      case "payment.failed": {
        const paymentEntity = payload.payload?.payment?.entity;
        const orderId = paymentEntity?.notes?.orderId;
        if (orderId) {
          await DatabaseStore.updateOrderStatus(orderId, "PENDING_PAYMENT");
        }
        break;
      }
      case "refund.processed": {
        // Refund logic
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
