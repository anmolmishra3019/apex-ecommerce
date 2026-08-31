"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    title: "ALL OBJECTS",
    tag: "COMPLETE REPERTOIRE",
    href: "/products",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=85",
    description: "Every architectural light, brutalist sculpture, and furniture piece.",
  },
  {
    title: "LIGHTING & TOTEMS",
    tag: "AMBIENT SCULPTURES",
    href: "/products?category=Lighting",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=85",
    description: "Laser-cut steel floor monoliths and warm diffused table lights.",
  },
  {
    title: "FURNITURE & TABLES",
    tag: "SPRING & MESH SERIES",
    href: "/products?category=Furniture",
    image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=85",
    description: "Coiled structural steel springs with industrial perforated mesh.",
  },
  {
    title: "SCULPTURES & CAST ART",
    tag: "CONCRETE & CAST ZINC",
    href: "/products?category=Sculptures",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=85",
    description: "Heavyweight tetrapods and conversational art objects.",
  },
  {
    title: "ALUMINIUM DECOR",
    tag: "FLUTED EXTRUSIONS",
    href: "/products?category=Decor",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=1200&q=85",
    description: "Single-billet CNC milled architectural vases and incense canyon stations.",
  },
  {
    title: "DESK & FUNCTIONAL",
    tag: "SHEET METAL SERIES",
    href: "/products?category=Desk",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85",
    description: "Laser-cut book cradles, trays, and intentional everyday tools.",
  },
];

export default function CollectionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf8] text-[#121212]">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-12 space-y-12">
        {/* Page Header */}
        <div className="pb-6 border-b border-[#121212]">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#004fff]">
            SERIES &amp; TYPOLOGIES
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-[#121212] uppercase tracking-tight font-heading mt-1">
            COLLECTIONS
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">
            Explore our design disciplines and material investigations.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <Link
              key={col.title}
              href={col.href}
              className="group relative block bg-[#121212] rounded-[1.2rem] overflow-hidden aspect-[4/3] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-500"
            >
              <img
                src={col.image}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent" />

              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <span className="inline-block self-start px-3 py-1 bg-[#fffdf8] text-[#121212] text-[10px] font-black uppercase tracking-widest">
                  {col.tag}
                </span>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#fffdf8] uppercase tracking-tight group-hover:text-[#004fff] transition-colors font-heading">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#e8e5dc] font-medium uppercase tracking-wider line-clamp-1">
                    {col.description}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#004fff]">
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
