import { NextRequest, NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/db/store";

export async function GET() {
  try {
    const orders = await DatabaseStore.getOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, customerPhone, items, shippingAddress, paymentMethod } = body;

    if (!customerName || !customerEmail || !items || !items.length || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required order checkout fields" },
        { status: 400 }
      );
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const discount = body.discount || 0;
    const shippingFee = subtotal > 2000 ? 0 : 150;
    const tax = Math.round((subtotal - discount) * 0.18); // 18% GST standard
    const total = Math.max(0, subtotal - discount + shippingFee + tax);

    const order = await DatabaseStore.createOrder({
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      items,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      shippingAddress,
      paymentMethod: paymentMethod || "RAZORPAY",
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpaySignature: body.razorpaySignature,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
