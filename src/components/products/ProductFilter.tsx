"use client";

import React from "react";
import { SlidersHorizontal, Check, RefreshCw } from "lucide-react";

interface ProductFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export default function ProductFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  sortBy,
  onSortChange,
  onReset,
}: ProductFilterProps) {
  return (
    <div className="bg-[#fffdf8] p-6 border border-[#121212] space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#121212]">
        <div className="flex items-center gap-2 text-[#121212] font-black text-xs uppercase tracking-widest">
          <SlidersHorizontal className="w-4 h-4 text-[#004fff]" />
          <span>FILTER OBJECTS</span>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] font-bold text-zinc-500 hover:text-[#004fff] flex items-center gap-1 transition uppercase tracking-wider"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-600 mb-3">
          CATEGORIES
        </h4>
        <div className="space-y-1">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`w-full text-left px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider flex items-center justify-between transition ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-[#004fff] text-[#fffdf8]"
                  : "text-[#121212] hover:bg-[#f4f3ef]"
              }`}
            >
              <span>{cat}</span>
              {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                <Check className="w-3.5 h-3.5 text-[#fffdf8]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-600 mb-2">
          SORT BY
        </h4>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-xs font-bold uppercase tracking-wider bg-[#f4f3ef] border border-[#121212] px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#004fff] text-[#121212]"
        >
          <option value="newest">Newest Drops</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex justify-between text-[11px] font-extrabold uppercase tracking-widest text-zinc-600 mb-2">
          <span>MAX BUDGET</span>
          <span className="text-[#004fff] font-black">₹{priceRange[1].toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full h-2 bg-[#f4f3ef] appearance-none cursor-pointer accent-[#004fff] border border-[#121212]"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-bold uppercase">
          <span>₹1,000</span>
          <span>₹50,000</span>
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-3 border-t border-[#e8e5dc] flex items-center justify-between">
        <label htmlFor="instock-toggle" className="text-xs font-extrabold uppercase tracking-wider text-[#121212] cursor-pointer">
          In Stock Only
        </label>
        <input
          id="instock-toggle"
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onToggleInStock(e.target.checked)}
          className="w-4 h-4 rounded-none text-[#004fff] focus:ring-[#004fff] border-[#121212] cursor-pointer accent-[#004fff]"
        />
      </div>
    </div>
  );
}
