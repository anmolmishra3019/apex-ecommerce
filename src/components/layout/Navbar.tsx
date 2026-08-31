"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fffdf8]/95 backdrop-blur-md border-b border-[#e8e5dc] transition-all">
      {/* Top Notice Marquee Announcement Bar */}
      <div className="bg-[#004fff] text-[#fffdf8] text-[11px] py-2 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee flex items-center gap-10 font-extrabold tracking-widest uppercase">
          <span>• SOME OBJECTS BLEND IN. OURS DON&apos;T</span>
          <span>• NOTICE: OBJECTS THAT TELL A STORY</span>
          <span>• DESIGNED &amp; MANUFACTURED IN-HOUSE</span>
          <span>• 10% OFF FIRST ORDER WITH CODE: <strong>SAVE10</strong></span>
          <span>• PAN-INDIA EXPRESS LOGISTICS WITH LIVE GPS AWB TRACKING</span>
          <span>• SOME OBJECTS BLEND IN. OURS DON&apos;T</span>
          <span>• NOTICE: OBJECTS THAT TELL A STORY</span>
          <span>• DESIGNED &amp; MANUFACTURED IN-HOUSE</span>
          <span>• 10% OFF FIRST ORDER WITH CODE: <strong>SAVE10</strong></span>
          <span>• PAN-INDIA EXPRESS LOGISTICS WITH LIVE GPS AWB TRACKING</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo - Notice Geometric Minimal Wordmark */}
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-3xl sm:text-4xl font-black tracking-tighter text-[#121212] uppercase font-heading">
              NOTICE<span className="text-[#004fff]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[12px] font-extrabold tracking-widest text-[#121212] uppercase">
            <Link href="/products" className="hover:text-[#004fff] transition-colors">
              All Objects
            </Link>
            <Link href="/products?category=Lighting" className="hover:text-[#004fff] transition-colors">
              Lighting
            </Link>
            <Link href="/products?category=Furniture" className="hover:text-[#004fff] transition-colors">
              Furniture
            </Link>
            <Link href="/products?category=Sculptures" className="hover:text-[#004fff] transition-colors">
              Sculptures
            </Link>
            <Link href="/products?category=Decor" className="hover:text-[#004fff] transition-colors">
              Decor
            </Link>
            <Link href="/orders" className="hover:text-[#004fff] transition-colors">
              My Orders
            </Link>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Bar / Trigger */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="relative w-48 sm:w-64 animate-in fade-in">
                <input
                  type="text"
                  placeholder="SEARCH OBJECTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-3 pr-8 py-2 text-xs font-bold tracking-wider uppercase bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 top-2 text-[#121212] hover:text-[#004fff]"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#121212] hover:text-[#004fff] transition-colors"
                title="Search Objects"
              >
                <Search className="w-5 h-5 stroke-[2.2]" />
              </button>
            )}

            {/* Live AWB Tracking Link */}
            <Link
              href="/track/DEL-849201948"
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#121212] hover:text-[#004fff] border border-[#121212] px-3.5 py-2 transition hover:bg-[#121212] hover:text-[#fffdf8]"
            >
              <span>Track AWB</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Admin Management Hub */}
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#fffdf8] bg-[#121212] hover:bg-[#004fff] px-3.5 py-2 transition-colors shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#004fff] group-hover:text-white" />
              <span>Admin</span>
            </Link>

            {/* Cart Drawer Trigger in Notice Signature Blue Pill */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center justify-center gap-2 bg-[#004fff] hover:bg-[#003ecc] text-[#fffdf8] px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-widest transition shadow-sm"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cartCount})</span>
            </button>

            {/* Mobile Navigation Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#121212] hover:text-[#004fff]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-[#e8e5dc] space-y-4 animate-in slide-in-from-top-2">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="SEARCH ALL OBJECTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-3 text-xs font-bold uppercase bg-[#f4f3ef] border border-[#121212] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#121212] absolute right-3.5 top-3.5" />
            </form>

            <div className="flex flex-col space-y-3 text-sm font-black uppercase tracking-widest text-[#121212]">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#e8e5dc] hover:text-[#004fff]"
              >
                All Objects
              </Link>
              <Link
                href="/products?category=Lighting"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#e8e5dc] hover:text-[#004fff]"
              >
                Lighting &amp; Totem Lamps
              </Link>
              <Link
                href="/products?category=Furniture"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#e8e5dc] hover:text-[#004fff]"
              >
                Tables &amp; Furniture
              </Link>
              <Link
                href="/products?category=Sculptures"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#e8e5dc] hover:text-[#004fff]"
              >
                Sculptures &amp; Cast Art
              </Link>
              <Link
                href="/products?category=Decor"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#e8e5dc] hover:text-[#004fff]"
              >
                Vases &amp; Decor
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-[#e8e5dc] hover:text-[#004fff]"
              >
                Track Orders
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-[#004fff]"
              >
                Admin Operations Hub
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
