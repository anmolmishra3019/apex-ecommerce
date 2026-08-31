"use client";

import React from "react";
import { Shipment } from "@/types";
import { ShipmentService } from "@/lib/shipment/shipmentService";
import { formatDate, getShipmentStatusBadge } from "@/lib/utils";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function TrackingTimeline({ shipment }: { shipment: Shipment }) {
  const currentProgress = ShipmentService.getProgressPercentage(shipment.status);
  const statusBadge = getShipmentStatusBadge(shipment.status);

  return (
    <div className="bg-[#fffdf8] p-6 sm:p-8 border border-[#121212] space-y-8">
      {/* Top Shipment Meta Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#121212] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
              AWB TRACKING NUMBER
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-[#004fff] text-white">
              {shipment.courier} Express
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight mt-1 font-mono">
            {shipment.trackingNumber}
          </h2>
        </div>

        <div className="flex flex-col sm:items-end">
          <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-[#121212] text-[#fffdf8]">
            {statusBadge.label}
          </span>
          <p className="text-xs text-zinc-600 mt-1.5 flex items-center gap-1 font-bold uppercase">
            <Clock className="w-3.5 h-3.5 text-[#004fff]" />
            <span>Est. Delivery: <strong>{new Date(shipment.estimatedDeliveryDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", weekday: "short" })}</strong></span>
          </p>
        </div>
      </div>

      {/* Visual Step Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-extrabold uppercase tracking-wider text-zinc-600">
          <span>Manifested</span>
          <span>In Transit</span>
          <span>Out for Delivery</span>
          <span>Delivered</span>
        </div>
        <div className="w-full h-2.5 bg-[#f4f3ef] border border-[#121212] overflow-hidden relative">
          <div
            className="h-full bg-[#004fff] transition-all duration-1000"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

      {/* Destination & Courier Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-[#f4f3ef] border border-[#e8e5dc] text-xs font-bold uppercase tracking-wider">
        <div>
          <span className="text-zinc-500 text-[10px] block mb-1">
            DELIVERY DESTINATION
          </span>
          <p className="text-[#121212] font-black">{shipment.shippingAddress.fullName}</p>
          <p className="text-zinc-600 mt-0.5 text-[11px]">
            {shipment.shippingAddress.street}
            {shipment.shippingAddress.apartment && `, ${shipment.shippingAddress.apartment}`},{" "}
            {shipment.shippingAddress.city}, {shipment.shippingAddress.state} -{" "}
            {shipment.shippingAddress.postalCode}
          </p>
        </div>

        <div>
          <span className="text-zinc-500 text-[10px] block mb-1">
            CURRENT LIVE STATUS &amp; HUB
          </span>
          <p className="text-[#004fff] font-black flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{shipment.currentLocation}</span>
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-zinc-600 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Contactless OTP Delivery Enabled</span>
          </div>
        </div>
      </div>

      {/* Activity Timeline Events */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#121212] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#004fff]" />
          <span>REAL-TIME DISPATCH LOG</span>
        </h3>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#121212]">
          {shipment.events
            .slice()
            .reverse()
            .map((event, idx) => (
              <div key={event.id || idx} className="relative">
                {/* Marker */}
                <div
                  className={`absolute -left-6 top-1 w-4 h-4 flex items-center justify-center ${
                    idx === 0 ? "bg-[#004fff]" : "bg-[#121212]"
                  }`}
                >
                  <div className="w-1.5 h-1.5 bg-white" />
                </div>

                <div className="bg-[#f4f3ef] p-4 border border-[#e8e5dc] space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-black uppercase text-[#121212]">
                      {event.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 uppercase font-medium">{event.description}</p>
                  <div className="text-[10px] text-[#004fff] font-extrabold uppercase flex items-center gap-1 pt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
