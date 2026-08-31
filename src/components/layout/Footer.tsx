import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, RotateCcw, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-[#fffdf8] border-t border-zinc-800 pt-16 pb-12 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-zinc-800 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#004fff] text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm">Pan-India Express</h4>
              <p className="text-zinc-400 mt-1 normal-case text-xs">
                Delhivery &amp; BlueDart with live GPS milestone tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm">Razorpay Secure</h4>
              <p className="text-zinc-400 mt-1 normal-case text-xs">
                256-bit SSL encrypted UPI, Cards, NetBanking &amp; EMI.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-zinc-800 text-white flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm">7-Day Easy Returns</h4>
              <p className="text-zinc-400 mt-1 normal-case text-xs">
                Doorstep pickup and automated refund settlements.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#004fff] text-white flex items-center justify-center shrink-0">
              <span className="font-black text-sm">100%</span>
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm">In-House Design</h4>
              <p className="text-zinc-400 mt-1 normal-case text-xs">
                Original studio creations manufactured in Noida, India.
              </p>
            </div>
          </div>
        </div>

        {/* Brand & Editorial Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-4xl font-black tracking-tighter text-[#fffdf8] uppercase font-heading">
                NOTICE<span className="text-[#004fff]">.</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 max-w-sm uppercase leading-relaxed font-medium">
              Some objects blend in. Ours don&apos;t. Notice crafts objects and conversation starters for people who refuse to live with the ordinary.
            </p>
            <p className="text-[11px] text-zinc-500 font-mono pt-2">
              OPERATED BY DACURIO STUDIO PRIVATE LIMITED • NOIDA, UP, INDIA
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="lg:col-span-2 space-y-3 text-xs uppercase font-extrabold tracking-widest">
            <h5 className="text-[#004fff] text-[11px] mb-4">Objects</h5>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products?category=Lighting" className="text-zinc-300 hover:text-white transition">
                  Totem Lighting
                </Link>
              </li>
              <li>
                <Link href="/products?category=Furniture" className="text-zinc-300 hover:text-white transition">
                  Spring Furniture
                </Link>
              </li>
              <li>
                <Link href="/products?category=Sculptures" className="text-zinc-300 hover:text-white transition">
                  Tetrapod Sculptures
                </Link>
              </li>
              <li>
                <Link href="/products?category=Decor" className="text-zinc-300 hover:text-white transition">
                  Extrusion Vases
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="lg:col-span-2 space-y-3 text-xs uppercase font-extrabold tracking-widest">
            <h5 className="text-[#004fff] text-[11px] mb-4">Operations</h5>
            <ul className="space-y-2.5">
              <li>
                <Link href="/track/DEL-849201948" className="text-zinc-300 hover:text-white transition">
                  Live AWB Tracker
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-zinc-300 hover:text-white transition">
                  Customer Orders
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-zinc-300 hover:text-white transition">
                  Admin Analytics
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="text-zinc-300 hover:text-white transition">
                  DB &amp; Razorpay Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-[#004fff] text-[11px] uppercase font-extrabold tracking-widest">
              Private Object Drops
            </h5>
            <p className="text-xs text-zinc-400 uppercase">
              Get notified of limited batch studio releases and material experiments.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="YOUR EMAIL..."
                className="w-full px-3 py-2.5 text-xs bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-[#004fff]"
              />
              <button
                type="button"
                className="px-4 bg-[#004fff] hover:bg-[#003ecc] text-white flex items-center justify-center transition"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 uppercase tracking-wider gap-4">
          <p>© 2026 NOTICE / DACURIO STUDIO. ALL RIGHTS RESERVED.</p>
          <p className="text-zinc-400">ENGINEERED ON NEXT.JS • SUPABASE • MONGODB • RAZORPAY</p>
        </div>
      </div>
    </footer>
  );
}
