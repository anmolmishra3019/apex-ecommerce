"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RazorpayPaymentButton from "@/components/checkout/RazorpayPaymentButton";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Truck,
  Lock,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal } = useCart();

  const [address, setAddress] = useState({
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    street: "Flat 304, Emerald Heights, MG Road",
    apartment: "Tower 2",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560001",
    country: "India",
  });

  const [discount, setDiscount] = useState(0);
  const [selectedCourier, setSelectedCourier] = useState<"Delhivery" | "BlueDart">("Delhivery");

  const shippingFee = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = Math.max(0, subtotal - discount + shippingFee + tax);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fffdf8]">
        <Navbar />
        <div className="flex-1 max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-xl font-black text-[#121212] uppercase">Your bag is empty</h2>
          <p className="text-xs text-zinc-500 uppercase">
            Please add objects to your bag before proceeding to checkout.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-[#004fff] text-[#fffdf8] font-extrabold text-xs uppercase tracking-widest"
          >
            Browse Objects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf8] text-[#121212]">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-10">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#121212]">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <Link href="/cart" className="hover:text-[#004fff] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Bag</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[#121212] font-black">Express Checkout</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-extrabold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Shipping Details Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer & Address Information */}
            <div className="bg-[#fffdf8] p-6 sm:p-8 border border-[#121212] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#121212]">
                <div className="w-7 h-7 bg-[#121212] text-[#fffdf8] flex items-center justify-center text-xs font-black">
                  1
                </div>
                <h2 className="text-sm font-extrabold text-[#121212] uppercase tracking-wider">
                  SHIPPING &amp; CONTACT DETAILS
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider">
                <div>
                  <label className="text-zinc-600 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff] normal-case"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-600 block mb-1">Mobile Phone *</label>
                  <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-600 block mb-1">Apartment / Suite</label>
                  <input
                    type="text"
                    value={address.apartment}
                    onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-zinc-600 block mb-1">Street Address *</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-600 block mb-1">City *</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-600 block mb-1">State *</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-600 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-600 block mb-1">Country</label>
                  <input
                    type="text"
                    value={address.country}
                    readOnly
                    className="w-full px-3.5 py-2.5 bg-[#e8e5dc] border border-[#121212] text-zinc-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Courier Logistics Partner */}
            <div className="bg-[#fffdf8] p-6 sm:p-8 border border-[#121212] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#121212]">
                <div className="w-7 h-7 bg-[#121212] text-[#fffdf8] flex items-center justify-center text-xs font-black">
                  2
                </div>
                <h2 className="text-sm font-extrabold text-[#121212] uppercase tracking-wider">
                  LOGISTICS CARRIER PARTNER
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider">
                <div
                  onClick={() => setSelectedCourier("Delhivery")}
                  className={`p-4 border-2 cursor-pointer transition flex items-start gap-3 ${
                    selectedCourier === "Delhivery"
                      ? "border-[#004fff] bg-[#004fff]/5"
                      : "border-[#e8e5dc] hover:border-[#121212]"
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#004fff] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[#121212]">Delhivery Express</h4>
                    <p className="text-zinc-500 mt-0.5 text-[10px]">Estimated: 2-3 Business Days</p>
                    <span className="inline-block mt-2 text-[#004fff] text-[10px]">
                      FREE Delivery
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedCourier("BlueDart")}
                  className={`p-4 border-2 cursor-pointer transition flex items-start gap-3 ${
                    selectedCourier === "BlueDart"
                      ? "border-[#004fff] bg-[#004fff]/5"
                      : "border-[#e8e5dc] hover:border-[#121212]"
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#004fff] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[#121212]">BlueDart Priority Air</h4>
                    <p className="text-zinc-500 mt-0.5 text-[10px]">Estimated: Next-Day Air</p>
                    <span className="inline-block mt-2 text-[#121212] text-[10px]">
                      High Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Items & Razorpay Payment */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="bg-[#f4f3ef] p-6 sm:p-8 border border-[#121212] space-y-6">
              <h2 className="text-sm font-black text-[#121212] uppercase tracking-widest pb-3 border-b border-[#121212]">
                ORDER SUMMARY ({cart.length} OBJECTS)
              </h2>

              {/* Items preview */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs border-b border-[#e8e5dc] pb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover bg-white border border-[#e8e5dc] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-[#121212] uppercase truncate">{item.name}</p>
                      <p className="text-zinc-500 text-[10px] uppercase">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-black text-[#121212]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs font-bold uppercase tracking-wider text-zinc-700 pt-2 border-t border-[#121212]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#121212] font-black">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-[#004fff]">
                    {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Taxes (18%)</span>
                  <span className="text-[#121212] font-black">{formatCurrency(tax)}</span>
                </div>
                <div className="pt-3 border-t border-[#121212] flex justify-between text-base font-black text-[#121212]">
                  <span>Total Payable</span>
                  <span className="text-[#004fff]">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Razorpay Integration Component in Cobalt Blue */}
              <div className="space-y-3 pt-2">
                <RazorpayPaymentButton
                  amount={total}
                  customerData={address}
                  cartItems={cart}
                  discount={discount}
                />

                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Encrypted Gateway • Instant AWB Generation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
