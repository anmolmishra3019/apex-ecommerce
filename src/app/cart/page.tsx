"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "SAVE10") {
      setDiscount(Math.round(subtotal * 0.1));
      setCouponMessage("SAVE10 APPLIED • 10% DISCOUNT ADDED");
    } else if (couponCode.toUpperCase() === "WELCOME500" && subtotal >= 3000) {
      setDiscount(500);
      setCouponMessage("FLAT ₹500 DISCOUNT APPLIED");
    } else {
      setCouponMessage("INVALID PROMO CODE. TRY: SAVE10");
      setDiscount(0);
    }
  };

  const shippingFee = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = Math.max(0, subtotal - discount + shippingFee + tax);

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf8] text-[#121212]">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-12 space-y-10">
        <div className="flex items-center justify-between pb-6 border-b border-[#121212]">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#004fff]">
              ORDER REVIEW
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#121212] tracking-tight uppercase font-heading">
              YOUR SHOPPING BAG
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-extrabold uppercase tracking-wider text-rose-600 hover:underline"
            >
              Clear Bag
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#fffdf8] p-16 text-center border border-[#121212] space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-[#f4f3ef] text-[#121212] mx-auto flex items-center justify-center border border-[#121212]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-[#121212] uppercase tracking-wider">
              Your bag is currently empty
            </h2>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">
              Discover totem lamps, coiled furniture, and brutalist objects.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#004fff] text-[#fffdf8] font-extrabold text-xs uppercase tracking-widest shadow-md transition hover:bg-[#003ecc]"
            >
              <span>Explore Studio Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Items Table */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-5 border border-[#121212] bg-[#fffdf8] flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-[#f4f3ef] border border-[#e8e5dc] shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#121212] uppercase tracking-wider line-clamp-1">
                        {item.name}
                      </h3>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-zinc-500 uppercase tracking-wide mt-0.5">
                          {item.selectedVariant}
                        </p>
                      )}
                      <p className="text-sm font-black text-[#121212] mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#121212] bg-[#fffdf8]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-[#f4f3ef] text-[#121212] transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-black text-[#121212]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-[#f4f3ef] text-[#121212] transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-black text-[#121212] w-24 text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-400 hover:text-rose-600 p-2 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 bg-[#f4f3ef] p-6 border border-[#121212] space-y-6">
              <h2 className="text-sm font-black text-[#121212] uppercase tracking-widest pb-3 border-b border-[#121212]">
                ORDER SUMMARY
              </h2>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-600">
                  PROMO COUPON
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. SAVE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs uppercase font-bold bg-[#fffdf8] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#121212] hover:bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest transition"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-[10px] font-extrabold uppercase ${
                      discount > 0 ? "text-[#004fff]" : "text-rose-600"
                    }`}
                  >
                    {couponMessage}
                  </p>
                )}
              </form>

              {/* Cost Calculations */}
              <div className="space-y-2 text-xs font-bold uppercase tracking-wider text-zinc-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#121212] font-black">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#004fff]">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
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
                  <span>Total Amount</span>
                  <span className="text-[#004fff]">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout Link */}
              <Link
                href="/checkout"
                className="w-full py-4 bg-[#004fff] hover:bg-[#003ecc] text-[#fffdf8] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase text-zinc-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected by Razorpay Payment Gateway</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
