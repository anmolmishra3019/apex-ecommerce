"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shipment, ShipmentStatus } from "@/types";
import { ShipmentService, SHIPMENT_STAGES } from "@/lib/shipment/shipmentService";
import { formatDate, getShipmentStatusBadge } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import {
  Truck,
  Plus,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  RefreshCw,
  Loader2,
  X,
} from "lucide-react";

export default function AdminShipmentsPage() {
  const { toast } = useToast();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingAwb, setUpdatingAwb] = useState<string | null>(null);

  // Modal State for Progressing Milestone
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [newEventStatus, setNewEventStatus] = useState<ShipmentStatus>("IN_TRANSIT");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    fetchShipments();
  }, []);

  async function fetchShipments() {
    try {
      setLoading(true);
      const res = await fetch("/api/shipments");
      const data = await res.json();
      if (data.success) {
        setShipments(data.shipments);
      }
    } catch (err) {
      toast("Failed to load shipments", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenMilestoneModal = (ship: Shipment) => {
    setSelectedShipment(ship);
    setNewEventStatus(ship.status);
    setNewLocation(ship.currentLocation);
    setNewDescription(`Package scanned at ${ship.currentLocation}`);
  };

  const handleUpdateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    try {
      setUpdatingAwb(selectedShipment.trackingNumber);
      const res = await fetch(`/api/shipments/${selectedShipment.trackingNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newEventStatus,
          location: newLocation,
          description: newDescription,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast(`AWB ${selectedShipment.trackingNumber} milestone updated to ${newEventStatus}`, "success");
        setSelectedShipment(null);
        fetchShipments();
      } else {
        toast(data.error || "Failed to update milestone", "error");
      }
    } catch (err) {
      toast("Error updating shipment event", "error");
    } finally {
      setUpdatingAwb(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-heading">
            LOGISTICS &amp; DISPATCH HUB ({shipments.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Live carrier manifests, AWB tracking logs, and automated milestones for Delhivery &amp; BlueDart
          </p>
        </div>

        <button
          onClick={fetchShipments}
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 border border-zinc-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* Shipment Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
            <p className="text-xs font-bold uppercase tracking-widest">Querying Carrier APIs...</p>
          </div>
        ) : shipments.length === 0 ? (
          <div className="p-12 bg-zinc-900 border border-zinc-800 text-center space-y-3">
            <Truck className="w-8 h-8 text-zinc-500 mx-auto" />
            <p className="text-sm font-bold text-white uppercase">No active manifests generated yet</p>
          </div>
        ) : (
          shipments.map((ship) => {
            const badge = getShipmentStatusBadge(ship.status);
            const progress = ShipmentService.getProgressPercentage(ship.status);
            return (
              <div
                key={ship.id}
                className="p-6 bg-zinc-900 border border-zinc-800 space-y-4"
              >
                {/* Meta Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#004fff]/10 border border-[#004fff]/30 flex items-center justify-center text-[#004fff]">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-white">
                          {ship.trackingNumber}
                        </span>
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-zinc-800 text-[#004fff]">
                          {ship.courier}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-bold uppercase mt-0.5">
                        Destination: {ship.shippingAddress.fullName} ({ship.shippingAddress.city}, {ship.shippingAddress.state})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase border ${badge.className}`}>
                      {badge.label}
                    </span>

                    <button
                      onClick={() => handleOpenMilestoneModal(ship)}
                      className="px-4 py-2 bg-[#004fff] hover:bg-[#003ecc] text-white text-xs font-extrabold uppercase tracking-widest transition"
                    >
                      Update Milestone
                    </button>

                    <Link
                      href={`/track/${ship.trackingNumber}`}
                      target="_blank"
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                      title="Customer Live Tracking"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Step Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Manifested</span>
                    <span>In Transit</span>
                    <span>Out for Delivery</span>
                    <span>Delivered</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-[#004fff] transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Latest Checkpoint */}
                <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/60 uppercase">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#004fff]" />
                    <span className="font-bold text-zinc-300">Hub: {ship.currentLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px]">
                    <Clock className="w-3 h-3" />
                    <span>Est. Delivery: {formatDate(ship.estimatedDeliveryDate)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Update Milestone Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-black text-white uppercase">Log Shipment Milestone</h3>
                <p className="text-[10px] text-zinc-400 font-mono">{selectedShipment.trackingNumber}</p>
              </div>
              <button onClick={() => setSelectedShipment(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMilestone} className="space-y-4 text-xs font-bold uppercase">
              <div>
                <label className="text-zinc-400 block mb-1">Select Milestone Stage *</label>
                <select
                  value={newEventStatus}
                  onChange={(e) => setNewEventStatus(e.target.value as ShipmentStatus)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#004fff]"
                >
                  <option value="MANIFEST_CREATED">1. MANIFEST CREATED</option>
                  <option value="PICKED_UP">2. PICKED UP BY COURIER</option>
                  <option value="IN_TRANSIT">3. IN TRANSIT (AIR / SURFACE)</option>
                  <option value="REACHED_DESTINATION_HUB">4. REACHED DESTINATION HUB</option>
                  <option value="OUT_FOR_DELIVERY">5. OUT FOR DELIVERY (OTP DISPATCH)</option>
                  <option value="DELIVERED">6. DELIVERED TO COLLECTOR</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Current Location / Facility *</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Indiranagar Delivery Hub, Bengaluru"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#004fff]"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Status Description *</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#004fff]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedShipment(null)}
                  className="px-4 py-2 bg-zinc-800 text-white text-xs font-extrabold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingAwb !== null}
                  className="px-5 py-2 bg-[#004fff] hover:bg-[#003ecc] text-white text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-md"
                >
                  {updatingAwb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>Push Milestone</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
