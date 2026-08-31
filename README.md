# APEX STORE — Next-Gen Full-Stack E-Commerce Platform

A production-grade, full-stack E-Commerce store built with **Next.js (App Router, React, TypeScript, Tailwind CSS)**, a dual database architecture (**PostgreSQL / Supabase** + **MongoDB Atlas**), **Razorpay** payment gateway with cryptographic signature verification, **Real-Time Live Shipment & Delivery Tracking**, and a comprehensive **Admin Operations Panel**.

---

## 🌟 Key Highlights & Capabilities

- **Modern Responsive Storefront**:
  - Hero banner with animations, curated categories, trending highlights.
  - Multi-faceted product catalog (filter by Category, Price Range, In-Stock, Rating, Search query, and multiple sorting modes).
  - High-conversion Product Details Page with multi-image preview, variant selectors, dynamic specs, stock indicator, and verified customer review breakdown.
  - Cart drawer & dedicated cart review with coupon codes (`SAVE10`, `WELCOME500`), dynamic tax (GST 18%), and free express shipping calculations.
  - Multi-step checkout with instant address validation and Razorpay gateway.

- **Bonus Features**:
  - **Razorpay Payment Gateway Setup**: Complete checkout flow, order creation, HMAC-SHA256 signature verification (`/api/payment/razorpay/verify`), webhook event listener (`/api/webhooks/razorpay`), and sandbox simulator.
  - **Live Shipment & Delivery Tracking**: Auto Air Waybill (AWB) generation for logistics partners (**Delhivery, BlueDart, Shadowfax**), milestone state machine (`MANIFEST_CREATED` $\rightarrow$ `PICKED_UP` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `REACHED_DESTINATION_HUB` $\rightarrow$ `OUT_FOR_DELIVERY` $\rightarrow$ `DELIVERED`), and dedicated tracking portal (`/track/[awb]`).
  - **Admin Operations Hub (`/admin`)**:
    - Real-time Analytics Dashboard with revenue velocity charts (Recharts) and KPI cards.
    - Product Manager: Add, edit, and delete products with image URLs and dynamic specifications.
    - Order Fulfillment Pipeline: Track orders, view payment receipts, and switch order states.
    - Logistics Dispatch Hub: Assign couriers, generate AWB tracking numbers, and log milestone scans with city location.
    - Customer Intelligence: Lifetime Value (LTV) metrics, order frequency, and contact records.
    - Cloud Infrastructure & Settings: Supabase, MongoDB Atlas, and Razorpay configuration status.

- **Dual / Polyglot Database Architecture**:
  - **PostgreSQL / Supabase (Prisma ORM)**: Handles transactional ACID data: Users, Orders, Order Items, Payments (Razorpay IDs & signatures), Addresses, and Shipment Milestones.
  - **MongoDB Atlas (Mongoose)**: Handles dynamic product attributes, catalog collections, flexible specifications, and verified customer reviews.
  - **Zero-Friction Local Mode**: Pre-seeded with realistic data so the application runs immediately without requiring active cloud credentials, while allowing seamless switch to live cloud connections.

- **Vercel Ready**:
  - App Router serverless architecture, edge-friendly API endpoints, and `vercel.json` deployment rules.

---

## 🚀 Quick Start Guide

### 1. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Key URLs
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Product Catalog**: [http://localhost:3000/products](http://localhost:3000/products)
- **Shopping Cart**: [http://localhost:3000/cart](http://localhost:3000/cart)
- **Checkout Flow**: [http://localhost:3000/checkout](http://localhost:3000/checkout)
- **Customer Order Portal**: [http://localhost:3000/orders](http://localhost:3000/orders)
- **Live AWB Tracking Demo**: [http://localhost:3000/track/DEL-849201948](http://localhost:3000/track/DEL-849201948)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin Logistics Hub**: [http://localhost:3000/admin/shipments](http://localhost:3000/admin/shipments)

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in the project root:

```env
# Database Connections
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?sslmode=require"
MONGODB_URI="mongodb+srv://admin:password@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority"

# Razorpay API Credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_yourKeyHere"
RAZORPAY_KEY_SECRET="yourSecretHere"
RAZORPAY_WEBHOOK_SECRET="yourWebhookSecretHere"

# App URL & Currency
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CURRENCY="INR"
NEXT_PUBLIC_CURRENCY_SYMBOL="₹"
```

---

## 📦 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Under **Project Settings $\rightarrow$ Environment Variables**, configure your `DATABASE_URL`, `MONGODB_URI`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET`.
4. Click **Deploy**.
