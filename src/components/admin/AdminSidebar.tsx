"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  Users,
  Settings,
  ArrowLeft,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Shipments & AWB", href: "/admin/shipments", icon: Truck },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Cloud DB & Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#121212] text-zinc-300 border-r border-zinc-800 flex flex-col justify-between shrink-0 min-h-screen font-sans">
      {/* Top Section */}
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#004fff] flex items-center justify-center text-white font-black text-sm">
              N
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wider uppercase">NOTICE ADMIN</h2>
              <span className="text-[9px] text-[#004fff] font-extrabold tracking-widest uppercase block">
                Studio Console
              </span>
            </div>
          </div>
        </div>

        {/* Database Status Pills */}
        <div className="px-4 py-3 m-4 bg-zinc-900 border border-zinc-800 text-[10px] space-y-1.5 font-bold uppercase tracking-wider">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>PostgreSQL / Supabase</span>
            </span>
            <span className="text-emerald-400">LIVE</span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>MongoDB Atlas</span>
            </span>
            <span className="text-emerald-400">SYNCED</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs font-extrabold uppercase tracking-wider transition ${
                  isActive
                    ? "bg-[#004fff] text-white shadow-md"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#004fff]" />
          <span>Back to Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
