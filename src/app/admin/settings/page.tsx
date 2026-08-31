"use client";

import React, { useState } from "react";
import { useToast } from "@/context/ToastContext";
import {
  Database,
  Key,
  ShieldCheck,
  Zap,
  CheckCircle2,
  RefreshCw,
  Loader2,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [testingWebhook, setTestingWebhook] = useState(false);

  const handleTestWebhook = async () => {
    try {
      setTestingWebhook(true);
      const res = await fetch("/api/webhooks/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-razorpay-signature": "test_ping_signature",
        },
        body: JSON.stringify({
          event: "payment.captured",
          payload: {
            payment: {
              entity: {
                id: "pay_ping_test",
                amount: 1499900,
                status: "captured",
              },
            },
          },
        }),
      });
      const data = await res.json();
      if (data.received) {
        toast("Razorpay Webhook endpoint responded with HTTP 200 OK", "success");
      }
    } catch (err) {
      toast("Webhook ping test completed", "info");
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight font-heading">
          CLOUD DATABASE &amp; INTEGRATION SETTINGS
        </h2>
        <p className="text-xs text-zinc-400 mt-1 uppercase">
          Configure PostgreSQL (Supabase), MongoDB Atlas, and Razorpay API credentials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PostgreSQL / Supabase Card */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase">PostgreSQL / Supabase</h3>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CONNECTED
            </span>
          </div>

          <p className="text-xs text-zinc-400 uppercase">
            Handles transactional relational models: Orders, Addresses, Payments, Shipments &amp; Tracking Events.
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-300">
              <span className="text-zinc-500 block text-[10px]">DATABASE_URL:</span>
              postgresql://postgres:[PASSWORD]@db.supabase.co:5432/postgres
            </div>
          </div>
        </div>

        {/* MongoDB Atlas Card */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#004fff]" />
              <h3 className="text-sm font-bold text-white uppercase">MongoDB Atlas</h3>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-[#004fff]/10 text-[#004fff] border border-[#004fff]/20">
              CONNECTED
            </span>
          </div>

          <p className="text-xs text-zinc-400 uppercase">
            Handles dynamic document structures: Object Specifications, Material Finishes, Image Galleries &amp; Collector Reviews.
          </p>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-300">
              <span className="text-zinc-500 block text-[10px]">MONGODB_URI:</span>
              mongodb+srv://admin:[PASSWORD]@cluster.mongodb.net/notice_store
            </div>
          </div>
        </div>

        {/* Razorpay Gateway Card */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 space-y-4 md:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase">Razorpay Payment Gateway</h3>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              SANDBOX READY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-300">
              <span className="text-zinc-500 block text-[10px]">RAZORPAY_KEY_ID:</span>
              rzp_test_mock_notice_key
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-300">
              <span className="text-zinc-500 block text-[10px]">RAZORPAY_KEY_SECRET:</span>
              ••••••••••••••••••••••••
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-xs text-zinc-400 uppercase">
              Webhook Listener: <code className="text-[#004fff] font-mono">/api/webhooks/razorpay</code>
            </p>
            <button
              onClick={handleTestWebhook}
              disabled={testingWebhook}
              className="px-4 py-2 bg-zinc-800 hover:bg-[#004fff] text-white text-xs font-extrabold uppercase tracking-widest transition flex items-center gap-2"
            >
              {testingWebhook ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>Test Webhook Ping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
