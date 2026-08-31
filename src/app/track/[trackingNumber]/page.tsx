"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";
import { Shipment } from "@/types";
import { Search, Package, ArrowLeft, Loader2 } from "lucide-react";

export default function TrackOrderPage() {
  const params = useParams();
  const router = useRouter();
  const trackingNumber = params.trackingNumber as string;

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchAwb, setSearchAwb] = useState(trackingNumber || "");

  useEffect(() => {
    async function fetchTracking() {
      if (!trackingNumber) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/shipments/${trackingNumber}`);
        const data = await res.json();
        if (data.success && data.shipment) {
          setShipment(data.shipment);
        } else {
          setShipment(null);
        }
      } catch (err) {
        console.error("Failed to load shipment", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTracking();
  }, [trackingNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAwb.trim()) {
      router.push(`/track/${encodeURIComponent(searchAwb.trim())}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf8] text-[#121212]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#121212] gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#004fff]">
              LOGISTICS PORTAL
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121212] uppercase tracking-tight font-heading">
              LIVE PACKAGE TRACKING
            </h1>
          </div>

          <Link
            href="/orders"
            className="text-xs font-extrabold uppercase tracking-wider text-zinc-600 hover:text-[#004fff] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Orders</span>
          </Link>
        </div>

        {/* Search AWB Box */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="ENTER AIR WAYBILL (e.g. DEL-849201948)..."
            value={searchAwb}
            onChange={(e) => setSearchAwb(e.target.value)}
            className="flex-1 px-4 py-3 text-xs uppercase font-mono font-bold bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#004fff] hover:bg-[#003ecc] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest transition flex items-center gap-1.5 shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>Track</span>
          </button>
        </form>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#121212]">
              Querying Courier Hubs...
            </p>
          </div>
        ) : shipment ? (
          <TrackingTimeline shipment={shipment} />
        ) : (
          <div className="bg-[#fffdf8] p-12 text-center border border-[#121212] space-y-4">
            <div className="w-16 h-16 bg-[#f4f3ef] text-[#121212] mx-auto flex items-center justify-center border border-[#121212]">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold uppercase text-[#121212]">
              AWB Not Found: {trackingNumber}
            </h3>
            <p className="text-xs text-zinc-500 uppercase">
              Please verify your tracking code or check your order confirmation.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
