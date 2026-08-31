import { NextRequest, NextResponse } from "next/server";
import { DatabaseStore } from "@/lib/db/store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const featured = searchParams.get("featured") ? searchParams.get("featured") === "true" : undefined;
    const sort = searchParams.get("sort") || undefined;

    const products = await DatabaseStore.getProducts({
      category,
      search,
      minPrice,
      maxPrice,
      inStockOnly,
      featured,
      sort,
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const requiredFields = ["name", "description", "category", "price", "stock", "images"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newProduct = await DatabaseStore.createProduct({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: body.description,
      category: body.category,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      rating: body.rating ? Number(body.rating) : 5.0,
      reviewCount: 0,
      stock: Number(body.stock),
      images: Array.isArray(body.images) ? body.images : [body.images],
      tags: body.tags || [],
      featured: Boolean(body.featured),
      specifications: body.specifications || {},
      variants: body.variants || [],
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
