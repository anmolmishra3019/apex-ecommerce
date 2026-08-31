"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CheckCircle2,
  Truck,
  Package,
  ArrowRight,
  ShieldCheck,
  Loader2,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function OrderSuccessPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#004fff", "#121212", "#ff5200"],
      });
    } catch (e) {}

    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${params.orderId}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Failed to load order confirmation", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.orderId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fffdf8]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fffdf8]">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-black text-[#121212] uppercase">Order Not Found</h2>
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest"
          >
            Explore Objects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf8] text-[#121212]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Success Banner */}
        <div className="bg-[#fffdf8] p-8 sm:p-12 border border-[#121212] text-center space-y-4">
          <div className="w-16 h-16 bg-[#004fff] text-white mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#004fff]">
            TRANSACTION VERIFIED &amp; LOGGED
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121212] uppercase tracking-tight font-heading">
            ORDER CONFIRMED • {order.orderNumber}
          </h1>
          <p className="text-xs text-zinc-600 max-w-md mx-auto uppercase font-medium">
            Thank you for welcoming these objects into your living space. A confirmation receipt and courier manifest have been generated.
          </p>

          {/* Quick Tracking CTA */}
          {order.trackingNumber && (
            <div className="pt-4">
              <Link
                href={`/track/${order.trackingNumber}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#121212] hover:bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest shadow-md transition"
              >
                <Truck className="w-4 h-4" />
                <span>Track Shipment ({order.trackingNumber})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Order Breakdown Receipt */}
        <div className="bg-[#f4f3ef] p-6 sm:p-8 border border-[#121212] space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-[#121212] pb-3 border-b border-[#121212]">
            RECEIPT &amp; ORDER SPECIFICATIONS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider text-zinc-700">
            <div>
              <span className="text-zinc-500 block text-[10px]">Customer</span>
              <p className="text-[#121212] font-black">{order.customerName}</p>
              <p className="text-[11px] normal-case">{order.customerEmail}</p>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">Payment Proof</span>
              <p className="text-[#004fff] font-mono text-[11px]">{order.payment.razorpayPaymentId}</p>
              <p className="text-[10px] text-emerald-600 font-extrabold">STATUS: {order.payment.status}</p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-3 pt-4 border-t border-[#e8e5dc]">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 block">
              Purchased Objects:
            </span>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs font-bold uppercase">
                <div className="flex items-center gap-3">
                  <img src={item.productImage} alt="" className="w-12 h-12 object-cover bg-white border border-[#e8e5dc]" />
                  <div>
                    <span className="text-[#121212]">{item.productName}</span>
                    <span className="text-zinc-500 text-[10px] block">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-black text-[#121212]">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-[#121212] flex justify-between text-sm font-black text-[#121212] uppercase">
            <span>Total Captured</span>
            <span className="text-[#004fff]">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Back to store navigation */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/orders"
            className="text-xs font-extrabold uppercase tracking-widest text-zinc-600 hover:text-[#004fff]"
          >
            &larr; View All My Orders
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest hover:bg-[#003ecc]"
          >
            Explore More Objects
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
