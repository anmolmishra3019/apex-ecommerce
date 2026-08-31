"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, Mail, Phone, ShoppingBag, ShieldCheck, Loader2 } from "lucide-react";

interface CustomerAgg {
  email: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpend: number;
  lastOrderDate: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerAgg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomerData() {
      try {
        setLoading(true);
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success && data.orders) {
          const map = new Map<string, CustomerAgg>();
          data.orders.forEach((o: Order) => {
            const existing = map.get(o.customerEmail);
            if (existing) {
              existing.orderCount += 1;
              existing.totalSpend += o.total;
              if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
                existing.lastOrderDate = o.createdAt;
              }
            } else {
              map.set(o.customerEmail, {
                email: o.customerEmail,
                name: o.customerName,
                phone: o.customerPhone,
                orderCount: 1,
                totalSpend: o.total,
                lastOrderDate: o.createdAt,
              });
            }
          });
          setCustomers(Array.from(map.values()));
        }
      } catch (err) {
        console.error("Failed to load customer metrics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomerData();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight font-heading">
          COLLECTOR INTELLIGENCE ({customers.length})
        </h2>
        <p className="text-xs text-zinc-400 mt-1 uppercase">
          Customer lifetime value (LTV), repeat purchase frequency &amp; order history
        </p>
      </div>

      <div className="p-6 bg-zinc-900 border border-zinc-800 overflow-x-auto">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
            <p className="text-xs font-bold uppercase tracking-widest">Calculating Lifetime Value...</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs uppercase font-bold">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 tracking-wider">
                <th className="pb-3">Collector</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Orders</th>
                <th className="pb-3">Lifetime Value</th>
                <th className="pb-3">Last Acquisition</th>
                <th className="pb-3">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {customers.map((c) => (
                <tr key={c.email} className="hover:bg-zinc-800/40 transition">
                  <td className="py-3.5">
                    <p className="text-white font-bold">{c.name}</p>
                  </td>
                  <td className="py-3.5">
                    <p className="text-zinc-300 normal-case">{c.email}</p>
                    <p className="text-[10px] text-zinc-500">{c.phone}</p>
                  </td>
                  <td className="py-3.5 text-zinc-300">{c.orderCount} Orders</td>
                  <td className="py-3.5 text-[#004fff] font-black">{formatCurrency(c.totalSpend)}</td>
                  <td className="py-3.5 text-zinc-400 font-mono text-[10px]">{formatDate(c.lastOrderDate)}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 text-[9px] bg-[#004fff]/10 text-[#004fff] border border-[#004fff]/30">
                      {c.totalSpend > 25000 ? "VIP COLLECTOR" : "VERIFIED"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
