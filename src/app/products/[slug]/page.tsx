"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Product, Review } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Zap,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const slug = params.slug as string;
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0].name);
          }
        }
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedVariant);
    toast(`Added ${quantity}x "${product.name}" to your bag!`, "success");
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, selectedVariant);
    router.push("/checkout");
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast("Please provide your name and review feedback", "error");
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };

    setProduct((prev) => {
      if (!prev) return null;
      const reviews = prev.reviews ? [newRev, ...prev.reviews] : [newRev];
      const avg =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      return {
        ...prev,
        reviews,
        reviewCount: reviews.length,
        rating: Number(avg.toFixed(1)),
      };
    });

    toast("Review submitted successfully! Thank you.", "success");
    setReviewName("");
    setReviewComment("");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fffdf8]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fffdf8]">
        <Navbar />
        <div className="flex-1 max-w-[1600px] mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-black text-[#121212] uppercase">Object not found</h2>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest"
          >
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#fffdf8] text-[#121212]">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-16">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[11px] text-zinc-500 font-extrabold uppercase tracking-wider">
          <Link href="/" className="hover:text-[#004fff]">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-[#004fff]">
            Objects
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#121212] truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square overflow-hidden bg-[#f4f3ef] border border-[#121212]">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-[#004fff] text-[#fffdf8] text-xs font-extrabold px-3.5 py-1 uppercase tracking-widest shadow-md">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-24 h-24 overflow-hidden border-2 shrink-0 transition ${
                      activeImageIndex === idx
                        ? "border-[#004fff] ring-1 ring-[#004fff]"
                        : "border-[#e8e5dc] hover:border-[#121212] opacity-70"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Actions Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2 border-b border-[#e8e5dc] pb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#121212] text-[#fffdf8] text-[10px] font-extrabold uppercase tracking-widest">
                  {product.category}
                </span>
                {product.stock > 0 ? (
                  <span className="px-3 py-1 bg-[#004fff]/10 text-[#004fff] text-[10px] font-extrabold uppercase tracking-widest border border-[#004fff]/30">
                    In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase tracking-widest">
                    Sold Out
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#121212] uppercase tracking-tight leading-tight font-heading">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#121212]">{product.rating}</span>
                <span>• {product.reviewCount || 0} Verified Reviews</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 bg-[#f4f3ef] border border-[#121212] flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-black text-[#121212]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-zinc-400 line-through font-bold">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              <span className="text-[11px] text-zinc-500 font-extrabold uppercase tracking-wider ml-auto">
                Incl. of all taxes &amp; GST
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium uppercase tracking-wide">
              {product.description}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-600 block">
                  Select Finish / Edition:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.name)}
                      className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider border transition ${
                        selectedVariant === v.name
                          ? "border-[#121212] bg-[#121212] text-[#fffdf8]"
                          : "border-[#e8e5dc] hover:border-[#121212] text-[#121212] bg-[#fffdf8]"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-600">
                Quantity:
              </span>
              <div className="flex items-center border border-[#121212] bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-[#f4f3ef] text-[#121212] transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-5 text-xs font-black text-[#121212]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2.5 hover:bg-[#f4f3ef] text-[#121212] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notice Signature Vertical Stack Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full py-4 px-6 bg-[#121212] hover:bg-zinc-800 text-[#fffdf8] text-xs sm:text-sm font-extrabold uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-4 px-6 bg-[#004fff] hover:bg-[#003ecc] text-[#fffdf8] text-xs sm:text-sm font-extrabold uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Buy It Now (Express Checkout)</span>
              </button>
            </div>

            {/* Notice Studio Assurances */}
            <div className="p-4 bg-[#f4f3ef] border border-[#e8e5dc] space-y-2 text-[11px] text-zinc-700 font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#004fff]" />
                <span>Free Pan-India Express Shipping on all orders</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% In-House Design &amp; Craftsmanship</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#121212]" />
                <span>7-Day Hassle-Free Doorstep Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-[#fffdf8] p-8 border border-[#121212] space-y-6">
            <h3 className="text-xl font-extrabold uppercase tracking-tight font-heading text-[#121212]">
              OBJECT SPECIFICATIONS &amp; MATERIALITY
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between p-3.5 bg-[#f4f3ef] border border-[#e8e5dc]"
                >
                  <span className="text-zinc-500">{key}</span>
                  <span className="text-[#121212] font-black">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="bg-[#fffdf8] p-8 border border-[#121212] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#121212] gap-4">
            <div>
              <h3 className="text-xl font-extrabold uppercase tracking-tight font-heading text-[#121212]">
                CUSTOMER STORIES &amp; EXPERIENCES
              </h3>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">
                Unfiltered impressions from verified owners
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-[#121212]">{product.rating}</span>
              <div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">
                  {product.reviewCount || 0} Ratings
                </span>
              </div>
            </div>
          </div>

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="p-6 bg-[#f4f3ef] border border-[#121212] space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#121212]">
              Submit Your Review
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs uppercase bg-white border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 block mb-1">
                  Rating *
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs font-bold uppercase bg-white border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Masterpiece)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                  <option value={1}>⭐ (1 - Poor)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 block mb-1">
                Your Feedback *
              </label>
              <textarea
                rows={3}
                placeholder="Share how this object lives in your home..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs uppercase bg-white border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#004fff]"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#121212] hover:bg-[#004fff] text-[#fffdf8] text-xs font-extrabold uppercase tracking-widest transition shadow-sm"
            >
              Post Review
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 border border-[#e8e5dc] bg-[#fffdf8] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-[#121212]">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-[#004fff] bg-[#004fff]/10 px-2 py-0.5 border border-[#004fff]/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Collector</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-700 uppercase tracking-wide font-medium">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 italic uppercase">No reviews yet. Be the first to review this object!</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
