import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import { DatabaseStore } from "@/lib/db/store";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Zap,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const allProducts = await DatabaseStore.getProducts();
  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 8);

  const disciplines = [
    {
      title: "LIGHTING & TOTEMS",
      tag: "AMBIENT MONOLITHS",
      href: "/products?category=Lighting",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=85",
      description: "Laser-cut carbon steel floor monoliths and sculptural table lights.",
    },
    {
      title: "FURNITURE & TABLES",
      tag: "SPRING & MESH SERIES",
      href: "/products?category=Furniture",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=85",
      description: "Coiled structural steel springs with industrial perforated mesh.",
    },
    {
      title: "SCULPTURES & OBJECTS",
      tag: "CONCRETE & CAST ZINC",
      href: "/products?category=Sculptures",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=85",
      description: "Heavyweight tetrapods and architectural conversation pieces.",
    },
    {
      title: "ALUMINIUM DECOR",
      tag: "FLUTED EXTRUSIONS",
      href: "/products?category=Decor",
      image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=1200&q=85",
      description: "Single-billet CNC milled architectural vases and desktop trays.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf8] text-[#121212]">
      <Navbar />

      <main className="flex-1 space-y-20 sm:space-y-28 pb-28">
        {/* Full-Viewport Notice Hero Slideshow */}
        <HeroSlideshow />

        {/* Notice Brand Statement / Manifesto */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-12 border-y border-[#e8e5dc]">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#004fff]">
                THE NOTICE MANIFESTO
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase leading-tight font-heading">
                Designed &amp; Manufactured In-House at our Noida Studio.
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">
              <p>
                Every Notice object begins as a raw material investigation: laser-cut structural carbon steel, extruded aerospace-grade aluminium, and high-density aggregate concrete. We reject mass-produced soulless home decor in favor of bold, tactile, functional art.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-[#e8e5dc] text-[11px] font-black uppercase tracking-wider text-[#121212]">
                <div>
                  <span className="text-[#004fff] block text-xl font-black">100%</span>
                  <span>Original In-House Designs</span>
                </div>
                <div>
                  <span className="text-[#004fff] block text-xl font-black">PAN-INDIA</span>
                  <span>Express Logistics &amp; Tracking</span>
                </div>
                <div>
                  <span className="text-[#004fff] block text-xl font-black">256-BIT</span>
                  <span>Instant Razorpay Gateway</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Objects Grid (Notice Curated Collection) */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#121212]">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#004fff]">
                CURATED DROPS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase font-heading">
                ICONIC CONVERSATION PIECES
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[#121212] hover:text-[#004fff] transition-colors"
            >
              <span>View All Objects ({allProducts.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* Disciplines & Typologies Editorial Showcase */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#004fff]">
              SERIES &amp; TYPOLOGIES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase font-heading">
              DISCOVER BY DISCIPLINE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {disciplines.map((disc) => (
              <Link
                key={disc.title}
                href={disc.href}
                className="group relative block bg-[#121212] rounded-[1.2rem] overflow-hidden aspect-[4/3] sm:aspect-[16/10] shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
              >
                <img
                  src={disc.image}
                  alt={disc.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent" />

                <div className="relative z-10 p-8 sm:p-10 h-full flex flex-col justify-between">
                  <span className="inline-block self-start px-3 py-1 bg-[#fffdf8] text-[#121212] text-[10px] font-black uppercase tracking-widest">
                    {disc.tag}
                  </span>

                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#fffdf8] uppercase tracking-tight group-hover:text-[#004fff] transition-colors font-heading">
                      {disc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#e8e5dc] font-medium uppercase tracking-wider line-clamp-1">
                      {disc.description}
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#004fff]">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Industrial Engineering & Full-Stack Platform Showcase */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="bg-[#121212] text-[#fffdf8] p-8 sm:p-16 border border-zinc-800 rounded-[1.2rem] shadow-xl space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="px-3.5 py-1 bg-[#004fff] text-[#fffdf8] text-[11px] font-black uppercase tracking-widest">
                  FULL-STACK E-COMMERCE ENGINE
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight font-heading">
                  Engineered with Next.js, Supabase, MongoDB &amp; Razorpay.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 uppercase tracking-wider leading-relaxed">
                  Experience seamless real-time database transactions across PostgreSQL &amp; MongoDB, instantaneous Razorpay sandbox payment verification, and automated Delhivery / BlueDart AWB generation.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-4">
                <Link
                  href="/products"
                  className="w-full py-4 bg-[#004fff] hover:bg-[#003ecc] text-[#fffdf8] text-xs font-black uppercase tracking-widest text-center shadow-lg transition"
                >
                  Test Checkout &amp; Razorpay
                </Link>
                <Link
                  href="/admin/shipments"
                  className="w-full py-4 bg-transparent border border-zinc-600 hover:border-white text-white text-xs font-black uppercase tracking-widest text-center transition"
                >
                  Open Logistics Dispatch Hub
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
