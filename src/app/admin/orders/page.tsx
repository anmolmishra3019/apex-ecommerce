"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types";
import { formatCurrency, formatDate, getOrderStatusBadge } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import {
  ShoppingBag,
  Truck,
  ExternalLink,
  Search,
  CheckCircle2,
  RefreshCw,
  Loader2,
  X,
} from "lucide-react";

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      toast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`Order ${orderId} updated to ${newStatus}`, "success");
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      toast("Error updating order status", "error");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-heading">
            STUDIO ORDERS FULFILLMENT ({orders.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Manage Razorpay settlements, dispatch pipeline, and collector receipts
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 border border-zinc-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="SEARCH BY ORDER REF OR COLLECTOR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-3 text-xs uppercase font-bold bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-[#004fff] text-white"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase text-white focus:outline-none focus:border-[#004fff]"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending Payment</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Dispatched / Shipped</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 overflow-x-auto">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
            <p className="text-xs font-bold uppercase tracking-widest">Loading Orders from PostgreSQL...</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs uppercase font-bold">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 tracking-wider">
                <th className="pb-3">Order Ref</th>
                <th className="pb-3">Collector</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Gross Total</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredOrders.map((ord) => {
                const badge = getOrderStatusBadge(ord.status);
                return (
                  <tr key={ord.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3.5 font-mono text-white">{ord.orderNumber}</td>
                    <td className="py-3.5">
                      <p className="text-zinc-200">{ord.customerName}</p>
                      <p className="text-[10px] text-zinc-400 normal-case">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3.5 text-zinc-400 font-mono text-[10px]">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="py-3.5 text-[#004fff] font-black">{formatCurrency(ord.total)}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {ord.payment.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 text-[9px] border ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1 bg-zinc-800 hover:bg-[#004fff] text-white text-[10px] uppercase font-bold transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Inspect Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-black text-white uppercase">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <p className="text-[10px] text-zinc-400">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Updater */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-2">
              <label className="text-[10px] font-extrabold uppercase text-zinc-400 block">
                Update Order Status:
              </label>
              <div className="flex flex-wrap gap-2">
                {(["PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={`px-3 py-1 text-[10px] font-extrabold uppercase transition ${
                      selectedOrder.status === st
                        ? "bg-[#004fff] text-white"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {st.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase">Purchased Objects:</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 text-xs uppercase">
                  <div className="flex items-center gap-3">
                    <img src={item.productImage} alt="" className="w-10 h-10 object-cover bg-zinc-900" />
                    <div>
                      <p className="text-white font-bold">{item.productName}</p>
                      <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-[#004fff] font-bold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Customer Details */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 text-xs uppercase space-y-1">
              <h4 className="text-[10px] font-bold text-zinc-400">Shipping Destination:</h4>
              <p className="text-white font-black">{selectedOrder.customerName}</p>
              <p className="text-zinc-400 text-[11px] normal-case">{selectedOrder.customerEmail} • {selectedOrder.customerPhone}</p>
              <p className="text-zinc-400 text-[11px]">{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
