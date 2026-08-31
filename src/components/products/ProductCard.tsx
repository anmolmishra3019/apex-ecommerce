"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { Plus } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast(`Added "${product.name}" to bag`, "success");
  };

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col bg-[#fffdf8] rounded-[1.2rem] overflow-hidden border border-[#e8e5dc]/60 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300">
      {/* Product Image Area with Notice Rounded Curvature */}
      <div className="relative aspect-square w-full bg-[#f4f3ef] overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0] || "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&q=80"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Category / Discount Tag (Minimalist) */}
        {discountPct > 0 && (
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className="bg-[#004fff] text-[#fffdf8] text-[10px] font-black px-2.5 py-1 uppercase tracking-widest">
              {discountPct}% OFF
            </span>
          </div>
        )}

        {/* Quick Add Button on Hover */}
        <button
          onClick={handleQuickAdd}
          disabled={product.stock <= 0}
          className="absolute bottom-3 right-3 w-10 h-10 bg-[#121212] hover:bg-[#004fff] text-[#fffdf8] flex items-center justify-center transition-all duration-200 shadow-md opacity-90 group-hover:opacity-100 disabled:opacity-40"
          title="Quick Add to Bag"
          aria-label="Add to cart"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Product Information Section (Notice Clean Left-Aligned Style) */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-2">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
            {product.category}
          </span>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm sm:text-base font-bold text-[#121212] uppercase tracking-wide group-hover:text-[#004fff] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 flex items-baseline justify-between border-t border-[#f4f3ef]">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-extrabold text-[#121212]">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-400 line-through font-medium">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="text-[11px] font-bold uppercase tracking-widest text-[#004fff] hover:underline"
          >
            DISCOVER &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
