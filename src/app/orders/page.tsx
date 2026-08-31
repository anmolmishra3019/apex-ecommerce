"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Order } from "@/types";
import { formatCurrency, formatDate, getOrderStatusBadge } from "@/lib/utils";
import {
  Package,
  Truck,
  ExternalLink,
  ChevronRight,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load customer orders", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf8] text-[#121212]">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-12 space-y-10">
        <div className="flex items-center justify-between pb-6 border-b border-[#121212]">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#004fff]">
              ORDER HISTORY
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#121212] uppercase tracking-tight font-heading">
              YOUR RECENT ORDERS ({orders.length})
            </h1>
          </div>
          <Link
            href="/products"
            className="px-6 py-3 bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest hover:bg-[#003ecc] transition"
          >
            Shop Objects
          </Link>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#121212]">
              Loading Orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#fffdf8] p-16 text-center border border-[#121212] space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-[#f4f3ef] text-[#121212] mx-auto flex items-center justify-center border border-[#121212]">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-extrabold text-[#121212] uppercase">No orders placed yet</h2>
            <p className="text-xs text-zinc-500 uppercase">
              Start your collection of sculptural lights and conversation starters today.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest"
            >
              <span>Explore Studio Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => {
              const badge = getOrderStatusBadge(ord.status);
              return (
                <div
                  key={ord.id}
                  className="bg-[#fffdf8] border border-[#121212] p-6 sm:p-8 space-y-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e8e5dc] gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-black text-[#121212]">
                          {ord.orderNumber}
                        </span>
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-[#121212] text-[#fffdf8]">
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-bold uppercase">
                        Placed on {formatDate(ord.createdAt)} • {ord.customerName}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 font-extrabold uppercase block">
                          Total Amount
                        </span>
                        <span className="text-lg font-black text-[#004fff]">
                          {formatCurrency(ord.total)}
                        </span>
                      </div>

                      {ord.trackingNumber && (
                        <Link
                          href={`/track/${ord.trackingNumber}`}
                          className="px-4 py-2.5 bg-[#121212] hover:bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track AWB</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Order Items preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {ord.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-[#f4f3ef] border border-[#e8e5dc]"
                      >
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-14 h-14 object-cover bg-white border border-[#e8e5dc] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-[#121212] uppercase truncate">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-zinc-500 uppercase mt-0.5">
                            Qty: {item.quantity} • {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
