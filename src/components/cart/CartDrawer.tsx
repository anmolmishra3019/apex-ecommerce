"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, cartCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "SAVE10") {
      const discount = Math.round(subtotal * 0.1);
      setAppliedDiscount(discount);
      setCouponSuccess("SAVE10 APPLIED • 10% DISCOUNT");
      setCouponError("");
    } else if (couponCode.toUpperCase() === "WELCOME500" && subtotal >= 3000) {
      setAppliedDiscount(500);
      setCouponSuccess("FLAT ₹500 OFF APPLIED");
      setCouponError("");
    } else {
      setCouponError("INVALID PROMO CODE. TRY: SAVE10");
      setCouponSuccess("");
      setAppliedDiscount(0);
    }
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#121212]/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fffdf8] shadow-2xl flex flex-col border-l border-[#121212]">
          {/* Header */}
          <div className="p-6 border-b border-[#121212] flex items-center justify-between bg-[#f4f3ef]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#004fff]" />
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-[#121212]">
                YOUR BAG ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#121212] hover:text-[#004fff] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-[#f4f3ef] text-[#121212] border border-[#121212] flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#121212]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide">
                    Explore our objects and conversation starters.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest transition hover:bg-[#003ecc]"
                >
                  Shop All Objects
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 border border-[#e8e5dc] bg-[#fffdf8]"
                >
                  <div className="w-20 h-20 bg-[#f4f3ef] border border-[#e8e5dc] shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-[#121212] uppercase tracking-wider truncate">
                        {item.name}
                      </h4>
                      {item.selectedVariant && (
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-0.5">
                          {item.selectedVariant}
                        </p>
                      )}
                      <p className="text-xs font-black text-[#121212] mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#121212] bg-[#fffdf8]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#f4f3ef] text-[#121212] transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-black text-[#121212]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#f4f3ef] text-[#121212] transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-rose-600 transition p-1"
                        title="Remove Object"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#121212] bg-[#f4f3ef] space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="PROMO CODE (SAVE10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs uppercase font-extrabold tracking-wider bg-[#fffdf8] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#121212] hover:bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest transition"
                  >
                    Apply
                  </button>
                </div>
                {couponSuccess && <p className="text-[10px] text-[#004fff] font-extrabold uppercase">{couponSuccess}</p>}
                {couponError && <p className="text-[10px] text-rose-600 font-extrabold uppercase">{couponError}</p>}
              </form>

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs uppercase font-bold tracking-wider text-zinc-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-black text-[#121212]">{formatCurrency(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#004fff]">
                    <span>Discount</span>
                    <span>-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#004fff]">
                    {subtotal > 2000 ? "FREE EXPRESS" : formatCurrency(150)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#121212] flex justify-between text-sm font-black text-[#121212]">
                  <span>Total Amount</span>
                  <span className="text-[#004fff]">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Notice Signature Cobalt Blue Checkout Button */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-4 bg-[#004fff] hover:bg-[#003ecc] text-[#fffdf8] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Checkout Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Razorpay 256-Bit SSL Instant Verification</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
