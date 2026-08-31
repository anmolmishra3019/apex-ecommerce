"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { DashboardMetrics } from "@/types";
import { formatCurrency, formatDate, getOrderStatusBadge } from "@/lib/utils";
import {
  IndianRupee,
  ShoppingBag,
  Truck,
  Package,
  ArrowUpRight,
  TrendingUp,
  Loader2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/metrics");
        const data = await res.json();
        if (data.success) {
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.error("Failed to load metrics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Aggregating real-time studio analytics...
        </p>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Gross Revenue",
      value: formatCurrency(metrics.totalRevenue),
      subtext: "+24.8% vs last week",
      icon: IndianRupee,
      color: "text-[#004fff]",
      bg: "bg-[#004fff]/10 border-[#004fff]/30",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders.toString(),
      subtext: `${metrics.deliveredOrders} delivered to collectors`,
      icon: ShoppingBag,
      color: "text-white",
      bg: "bg-zinc-800 border-zinc-700",
    },
    {
      title: "Active Shipments",
      value: metrics.pendingShipments.toString(),
      subtext: "Delhivery & BlueDart active",
      icon: Truck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Studio Objects",
      value: metrics.totalProducts.toString(),
      subtext: "MongoDB Document Schema",
      icon: Package,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-heading">
            NOTICE STUDIO TELEMETRY
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">
            Real-time analytics across PostgreSQL relational tables and MongoDB object documents
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-3 bg-[#004fff] hover:bg-[#003ecc] text-white text-xs font-extrabold uppercase tracking-widest transition shadow-lg"
          >
            + Add New Object
          </Link>
          <Link
            href="/admin/shipments"
            className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-extrabold uppercase tracking-widest border border-zinc-700 transition"
          >
            Logistics Hub
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-6 bg-zinc-900 border border-zinc-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                  {kpi.title}
                </span>
                <div className={`w-8 h-8 border flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight font-heading">{kpi.value}</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wide">{kpi.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-8 p-6 bg-zinc-900 border border-zinc-800 space-y-4">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#004fff]" />
              <span>7-Day Revenue Velocity (INR)</span>
            </h3>
            <p className="text-[11px] text-zinc-400 uppercase">Razorpay captured settlement volume</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.revenueChart}>
                <defs>
                  <linearGradient id="colorRevNotice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#004fff" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#004fff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#121212", borderColor: "#27272a", borderRadius: "0px" }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#004fff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevNotice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Stock Distribution */}
        <div className="lg:col-span-4 p-6 bg-zinc-900 border border-zinc-800 space-y-4">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#004fff]" />
              <span>Category Stock</span>
            </h3>
            <p className="text-[11px] text-zinc-400 uppercase">Units available by series</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.categorySales} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" stroke="#71717a" fontSize={10} />
                <YAxis dataKey="category" type="category" stroke="#a1a1aa" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#121212", borderColor: "#27272a", borderRadius: "0px" }}
                  formatter={(val: any) => [`${val} Units`, "Stock"]}
                />
                <Bar dataKey="count" fill="#004fff" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Recent Studio Orders Stream
            </h3>
            <p className="text-[11px] text-zinc-400 uppercase">Captured via Razorpay Checkout</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-[#004fff] hover:underline font-extrabold uppercase tracking-wider flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase font-bold">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 tracking-wider">
                <th className="pb-3">Order Ref</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Tracking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {metrics.recentOrders.map((ord) => {
                const badge = getOrderStatusBadge(ord.status);
                return (
                  <tr key={ord.id} className="hover:bg-zinc-800/50 transition">
                    <td className="py-3.5 font-mono text-white">{ord.orderNumber}</td>
                    <td className="py-3.5">
                      <p className="text-zinc-200">{ord.customerName}</p>
                      <p className="text-[10px] text-zinc-400 normal-case">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3.5 text-zinc-300">{ord.items.length} items</td>
                    <td className="py-3.5 text-[#004fff] font-black">
                      {formatCurrency(ord.total)}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {ord.payment.method} • {ord.payment.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 text-[9px] border ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {ord.trackingNumber ? (
                        <Link
                          href={`/track/${ord.trackingNumber}`}
                          className="font-mono text-[10px] text-[#004fff] hover:underline"
                        >
                          {ord.trackingNumber}
                        </Link>
                      ) : (
                        <span className="text-zinc-500">Unassigned</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
