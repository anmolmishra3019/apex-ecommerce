"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Lighting");
  const [price, setPrice] = useState(4999);
  const [originalPrice, setOriginalPrice] = useState(6999);
  const [stock, setStock] = useState(10);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      toast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setName(prod.name);
      setSlug(prod.slug);
      setCategory(prod.category);
      setPrice(prod.price);
      setOriginalPrice(prod.originalPrice || prod.price);
      setStock(prod.stock);
      setDescription(prod.description);
      setImage(prod.images[0] || "");
    } else {
      setEditingProduct(null);
      setName("");
      setSlug("");
      setCategory("Lighting");
      setPrice(4999);
      setOriginalPrice(6999);
      setStock(10);
      setDescription("");
      setImage("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&q=80");
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      price: Number(price),
      originalPrice: Number(originalPrice),
      stock: Number(stock),
      description,
      images: [image],
      rating: 5.0,
      reviewCount: 1,
      tags: [category, "Studio Drop"],
      featured: true,
      specifications: {
        "Material": "Precision Milled Steel / Concrete",
        "Origin": "Notice Studio, Noida",
      },
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        });
        const data = await res.json();
        if (data.success) {
          toast("Object updated successfully", "success");
          fetchProducts();
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        });
        const data = await res.json();
        if (data.success) {
          toast("New object added to catalog", "success");
          fetchProducts();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      toast("Error saving object", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this object from the studio catalog?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast("Object deleted successfully", "success");
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (err) {
      toast("Failed to delete object", "error");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-heading">
            STUDIO OBJECT CATALOG ({products.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase">
            Manage product specs, inventory quantities, pricing &amp; drops
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 bg-[#004fff] hover:bg-[#003ecc] text-white text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Object</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="SEARCH BY NAME OR CATEGORY..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-10 py-3 text-xs uppercase font-bold bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-[#004fff] text-white"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3.5" />
      </div>

      {/* Table */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 overflow-x-auto">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#004fff]" />
            <p className="text-xs font-bold uppercase tracking-widest">Querying MongoDB...</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs uppercase font-bold">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 tracking-wider">
                <th className="pb-3">Object</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock Units</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-3.5 flex items-center gap-3">
                    <img
                      src={prod.images[0]}
                      alt=""
                      className="w-10 h-10 object-cover bg-zinc-800 border border-zinc-700"
                    />
                    <div>
                      <p className="text-white font-extrabold">{prod.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{prod.slug}</p>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-300">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3.5 text-[#004fff] font-black">{formatCurrency(prod.price)}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] ${prod.stock > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 text-zinc-300">⭐ {prod.rating}</td>
                  <td className="py-3.5 text-right space-x-2">
                    <Link
                      href={`/products/${prod.slug}`}
                      target="_blank"
                      className="p-1.5 text-zinc-400 hover:text-white inline-block"
                      title="View live"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleOpenModal(prod)}
                      className="p-1.5 text-zinc-400 hover:text-[#004fff] inline-block"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-500 inline-block"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {editingProduct ? "Edit Object" : "Create New Object"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-bold uppercase">
              <div>
                <label className="text-zinc-400 block mb-1">Object Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#004fff]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#004fff]"
                  >
                    <option value="Lighting">Lighting</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Sculptures">Sculptures</option>
                    <option value="Decor">Decor</option>
                    <option value="Desk">Desk</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#004fff]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Selling Price (INR) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#004fff]"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Original Price (Strike)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#004fff]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Image URL *</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#004fff] normal-case"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-[#004fff] normal-case"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-extrabold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#004fff] hover:bg-[#003ecc] text-white text-xs font-extrabold uppercase tracking-widest shadow-md"
                >
                  Save Object
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
