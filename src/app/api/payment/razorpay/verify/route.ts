import { NextRequest, NextResponse } from "next/server";
import { RazorpayService } from "@/lib/razorpay";
import { DatabaseStore } from "@/lib/db/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, error: "Missing Razorpay verification parameters" },
        { status: 400 }
      );
    }

    const isValid = RazorpayService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Cryptographic signature verification failed" },
        { status: 400 }
      );
    }

    // If existing order ID passed, update order status to PAID
    if (orderId) {
      await DatabaseStore.updateOrderStatus(orderId, "PAID");
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Payment successfully verified and captured",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
