"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import ProductFilter from "@/components/products/ProductFilter";
import { Product } from "@/types";
import { Search, PackageOpen, Loader2 } from "lucide-react";

const SLUG_TO_CATEGORY: Record<string, string> = {
  all: "All",
  lighting: "Lighting",
  furniture: "Furniture",
  sculptures: "Sculptures",
  decor: "Decor",
  desk: "Desk",
};

function CollectionContent() {
  const params = useParams();
  const slug = (params.slug as string)?.toLowerCase() || "all";
  const initialCategory = SLUG_TO_CATEGORY[slug] || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(p.category));
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== "All" && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTags) return false;
        }
        if (p.price > priceRange[1]) return false;
        if (inStockOnly && p.stock <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategory, searchQuery, priceRange, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setPriceRange([0, 50000]);
    setInStockOnly(false);
    setSortBy("newest");
  };

  return (
    <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-12 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#121212]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#004fff]">
            COLLECTION REPERTOIRE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#121212] tracking-tight uppercase font-heading mt-1">
            {selectedCategory === "All" ? "ALL OBJECTS" : selectedCategory} ({filteredProducts.length})
          </h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-semibold">
            Architectural objects, brutalist art &amp; functional sculptures
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="SEARCH IN COLLECTION..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 text-xs font-bold uppercase tracking-wider bg-[#f4f3ef] border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
          />
          <Search className="w-4 h-4 text-[#121212] absolute right-3.5 top-3.5" />
        </div>
      </div>

      {/* Grid Layout (Filters + Products) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 sticky top-28">
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            inStockOnly={inStockOnly}
            onToggleInStock={setInStockOnly}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
          />
        </div>

        <div className="lg:col-span-9">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-zinc-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#121212]">
                Loading Collection Objects...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-[#fffdf8] p-12 text-center border border-[#121212] space-y-4">
              <div className="w-16 h-16 bg-[#f4f3ef] text-[#121212] mx-auto flex items-center justify-center border border-[#121212]">
                <PackageOpen className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#121212] uppercase tracking-wider">
                  No matching objects found in this collection
                </h3>
                <p className="text-xs text-zinc-500 mt-1 uppercase">
                  Try adjusting your filters, category selection, or search keywords.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest shadow-md transition hover:bg-[#003ecc]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function CollectionDetailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf8] text-[#121212]">
      <Navbar />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
          </div>
        }
      >
        <CollectionContent />
      </Suspense>
      <Footer />
    </div>
  );
}
