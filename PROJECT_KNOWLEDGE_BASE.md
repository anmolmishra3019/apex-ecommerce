# APEX STORE — COMPLETE PROJECT KNOWLEDGE BASE & SYSTEM SPECIFICATION (A to Z)

> **Instructions for AI / ChatGPT:**
> This document is the complete, self-contained architecture and technical specification for the **APEX STORE Full-Stack E-Commerce Project**. You do NOT need any other source code files. Use the details below to explain any feature, troubleshoot code, guide the user, or teach concepts from beginner to advanced.

---

## 1. Executive Summary & Tech Stack

| Category | Technologies / Libraries Used |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router), React 18, TypeScript, Server Components, API Route Handlers |
| **Styling & Icons** | Tailwind CSS 3.4, PostCSS, Lucide React (Icons), Canvas-Confetti (Celebration effects) |
| **Data Visualization**| Recharts (AreaChart, BarChart, ResponsiveContainer) |
| **Relational Database**| PostgreSQL / Supabase with Prisma ORM Schema (`prisma/schema.prisma`) |
| **Document Store** | MongoDB Atlas with Mongoose sub-document schema |
| **Local Store Adapter**| In-Memory Persistent Data Store (`DatabaseStore`) with pre-seeded rich catalog |
| **Payment Gateway** | Razorpay Gateway (SDK, Order creation, HMAC-SHA256 signature verification, Webhooks) |
| **Logistics / Delivery**| Pan-India Courier Engine (Delhivery, BlueDart, Shadowfax, XpressBees), AWB Generator, Milestone State Machine |
| **Deployment Target** | Vercel Serverless / Edge ready (`vercel.json`) |

---

## 2. System Architecture Overview

```mermaid
graph TD
    Client[Storefront UI: Next.js Client Components]
    Admin[Admin Panel UI: /admin Dashboard]
    NextServer[Next.js App Router Server: API Routes & Actions]
    
    subgraph "Payment & Logistics"
        Razorpay[Razorpay Gateway: Order, HMAC SHA256 Verification, Webhook]
        Logistics[Shipment Engine: AWB Generation, Tracking States]
    end

    subgraph "Dual Database Layer"
        Postgres[PostgreSQL / Supabase via Prisma: ACID Orders, Payments, Users, Addresses, Milestones]
        MongoDB[MongoDB Atlas via Mongoose: Dynamic Product Specs, Variants, Reviews, Logs]
        LocalStore[Local In-Memory Adapter: Zero-Setup Fallback & Seed Data]
    end

    Client -->|Browse, Cart, Place Order| NextServer
    Admin -->|Manage Catalog, Shipments, Orders, Metrics| NextServer
    NextServer -->|Create Order & Verify Signature| Razorpay
    NextServer -->|AWB & Milestone Scans| Logistics
    NextServer --> Postgres
    NextServer --> MongoDB
    NextServer --> LocalStore
```

---

## 3. Database Architecture & Complete Schemas

### A. PostgreSQL / Supabase Relational Schema (`prisma/schema.prisma`)
Used for ACID-critical financial and order records:
- **`User`**: `id`, `name`, `email` (unique), `phone`, `role` (`CUSTOMER` | `ADMIN`), timestamps.
- **`Address`**: `id`, `fullName`, `email`, `phone`, `street`, `apartment`, `city`, `state`, `postalCode`, `country`.
- **`Order`**: `id`, `orderNumber` (e.g. `ORD-94821`), `customerName`, `customerEmail`, `customerPhone`, `subtotal`, `discount`, `shippingFee`, `tax`, `total`, `status` (`PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`), `trackingNumber`.
- **`OrderItem`**: `id`, `orderId`, `productId`, `productName`, `productImage`, `price`, `quantity`, `selectedVariant`.
- **`Payment`**: `id`, `orderId`, `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`, `amount`, `currency` (`INR`), `status` (`PENDING`, `CAPTURED`, `FAILED`, `REFUNDED`), `method` (`RAZORPAY`, `COD`, `UPI`, `CARD`).
- **`Shipment`**: `id`, `orderId`, `trackingNumber` (AWB), `courier` (`Delhivery`, `BlueDart`, `Shadowfax`, `XpressBees`), `status` (`MANIFEST_CREATED`, `PICKED_UP`, `IN_TRANSIT`, `REACHED_DESTINATION_HUB`, `OUT_FOR_DELIVERY`, `DELIVERED`), `currentLocation`, `estimatedDeliveryDate`.
- **`TrackingEvent`**: `id`, `shipmentId`, `status`, `location`, `description`, `timestamp`.

### B. MongoDB Atlas Document Schema
Used for flexible catalog attributes and reviews:
```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: "Audio" | "Wearables" | "Peripherals" | "Power" | "Accessories";
  price: number;
  originalPrice?: number;
  rating: number; // e.g. 4.8
  reviewCount: number;
  stock: number;
  images: string[];
  tags: string[];
  featured?: boolean;
  specifications: Record<string, string>; // Dynamic JSON key-values (e.g. "Battery Life": "45 Hours")
  variants?: { id: string; name: string; sku: string; price: number; stock: number }[];
  reviews?: { id: string; userName: string; rating: number; comment: string; createdAt: string; verifiedPurchase: boolean }[];
}
```

---

## 4. Payment Gateway: Razorpay Integration Deep Dive

### A. The 4-Step Payment Flow
1. **Order Initiation (`/api/payment/razorpay/create-order`)**:
   - The frontend calls the API with the total payable amount in INR.
   - The server converts amount to **paise** (`amount * 100`) and calls Razorpay's API `POST https://api.razorpay.com/v1/orders` (or generates a high-fidelity test order in sandbox mode).
   - Returns `{ orderId, amount, currency: "INR", keyId }`.

2. **Frontend Razorpay Modal / Sandbox Simulator (`RazorpayPaymentButton.tsx`)**:
   - In production: Loads `https://checkout.razorpay.com/v1/checkout.js` and opens Razorpay's modal (supporting UPI, NetBanking, Cards, EMI).
   - In sandbox test mode: Pops up an interactive simulated modal allowing 1-click test payments without requiring bank cards.

3. **Cryptographic Signature Verification (`/api/payment/razorpay/verify`)**:
   - After payment completion, Razorpay returns:
     - `razorpay_order_id`
     - `razorpay_payment_id`
     - `razorpay_signature`
   - **Verification Formula**:
     $$\text{HMAC-SHA256}(\text{razorpay\_order\_id} + "|" + \text{razorpay\_payment\_id}, \text{RAZORPAY\_KEY\_SECRET}) == \text{razorpay\_signature}$$
   - If signatures match, the payment is 100% verified authentic, preventing tampering or fake payments.

4. **Order Creation & Shipment Manifest Trigger**:
   - Once verified, the order is saved in the database with status `PAID`.
   - An automated AWB number is generated and linked to the order.
   - The user is redirected to `/order-success/[orderId]`.

### B. Webhook Listener (`/api/webhooks/razorpay`)
- Validates `x-razorpay-signature` header against `RAZORPAY_WEBHOOK_SECRET`.
- Handles events:
  - `payment.captured`: Sets order status to `PAID`.
  - `payment.failed`: Sets order status to `PENDING_PAYMENT`.
  - `refund.processed`: Marks refund status in payments table.

---

## 5. Logistics & Live Delivery Tracking Engine

### A. Courier Partners & SLA Configuration (`src/lib/shipment/shipmentService.ts`)
- **Delhivery**: Code `DEL`, Prefix `DEL-`, SLA 2 Days, 4.8 Rating.
- **BlueDart**: Code `BLU`, Prefix `BLU-`, SLA 1 Day (Priority Air), 4.9 Rating.
- **Shadowfax**: Code `SHD`, Prefix `SHD-`, SLA 3 Days, 4.6 Rating.
- **XpressBees**: Code `XPB`, Prefix `XPB-`, SLA 2 Days, 4.7 Rating.

### B. AWB (Air Waybill) Generation
- Automatically generates unique 9-digit AWBs with courier prefix (e.g. `DEL-849201948`, `BLU-729104812`).

### C. Milestone Progression & Progress Math
| Step # | Milestone Status | Progress Bar % | Default Description |
| :--- | :--- | :--- | :--- |
| **1** | `MANIFEST_CREATED` | **15%** | Electronic shipping manifest generated. Awaiting courier pickup. |
| **2** | `PICKED_UP` | **35%** | Courier partner has collected the packaged goods from warehouse. |
| **3** | `IN_TRANSIT` | **55%** | Package in transit through regional logistics hubs. |
| **4** | `REACHED_DESTINATION_HUB` | **75%** | Package received at destination city sorting center. |
| **5** | `OUT_FOR_DELIVERY` | **90%** | Delivery agent is en route with OTP contactless verification. |
| **6** | `DELIVERED` | **100%** | Package handed over to recipient. Delivery confirmed. |

---

## 6. Complete Pages & Frontend Component Structure

### A. Customer Storefront
1. **Homepage (`/`)**:
   - Announcement bar with discount code `SAVE10`.
   - Hero banner with CTA buttons ("Explore Products", "Live Tracking Demo", "Admin Dashboard").
   - Curated category cards (Audio, Wearables, Peripherals, Power).
   - Trending Essentials grid with quick add to cart.
   - Dual-database promotional banner and trust badges.
2. **Product Catalog (`/products`)**:
   - Instant live search bar with real-time matching.
   - Sidebar filters: Category checkboxes, Price slider (₹1,000 to ₹50,000), In-stock only toggle, Sort options (Newest, Price Low-High, Price High-Low, Top Rated).
   - Wrapped in Next.js `<Suspense>` for optimal CSR/SSR hydration.
3. **Product Detail Page (`/products/[slug]`)**:
   - Multi-angle image preview gallery.
   - Dynamic variant buttons (e.g., Colorways: Obsidian Black vs Silver Mist).
   - Stock level indicator (`Only X left` or `In Stock`).
   - Technical specifications sub-document table.
   - Interactive Customer Review Submission form (Name, 1-5 Star selector, Comments).
4. **Shopping Cart Page (`/cart`) & Slide-Over Drawer (`CartDrawer.tsx`)**:
   - Persistent across browser refreshes via `localStorage` in `CartContext`.
   - Quantity increment/decrement and item removal.
   - Promo discount coupon engine (`SAVE10` gives 10% off, `WELCOME500` gives ₹500 off on orders $\ge$ ₹3000).
   - Automatic GST (18%) and Free Shipping calculation (Free for orders $>$ ₹2000).
5. **Multi-Step Checkout Page (`/checkout`)**:
   - Shipping address validation (Full name, Email, Phone, Street, Apartment, City, State, PIN).
   - Courier partner selector (Delhivery Express vs BlueDart Priority Air).
   - Embedded `RazorpayPaymentButton` with sandbox test mode.
6. **Order Success Page (`/order-success/[orderId]`)**:
   - Canvas-confetti celebration explosion.
   - Order receipt breakdown with customer details and payment ID.
   - 1-Click button to track package: `/track/[awb]`.
7. **Customer Order Portal (`/orders`)**:
   - Full history of placed orders, payment badges, items purchased, and live tracking links.
8. **Live Shipment Tracking Portal (`/track/[trackingNumber]`)**:
   - Search bar accepting any AWB number.
   - Visual gradient progress bar (15% to 100%).
   - Delivery destination and current logistics hub summary card.
   - Timestamped timeline of all milestone scans.

### B. Admin Operations Panel (`/admin`)
1. **Analytics Dashboard (`/admin`)**:
   - KPI cards: Total Revenue, Total Orders, Active Shipments, Catalog Products.
   - Recharts AreaChart: 7-Day Revenue Velocity (INR).
   - Recharts BarChart: Category inventory distribution.
   - Live stream of recent orders.
2. **Product Manager (`/admin/products`)**:
   - Products table with search and stock badges.
   - Add/Edit product modal (Title, Category, Price, Original Price, Stock, Image URL, Tags, Description).
   - 1-Click product delete handler.
3. **Order Fulfillment (`/admin/orders`)**:
   - Filter by status (`ALL`, `PAID`, `PROCESSING`, `SHIPPED`, `OUT_FOR_DELIVERY`, `DELIVERED`).
   - Direct status dropdown selector that updates Postgres database records.
   - Inspection modal showing full customer address and payment signature reference.
4. **Logistics Dispatch Hub (`/admin/shipments`)**:
   - Courier partner performance SLA cards.
   - "Dispatch New Order" modal to assign orders to Delhivery/BlueDart and generate AWBs.
   - "Advance Milestone" modal to log hub scans (e.g. "Arrived at Bengaluru East Hub"), updating customer tracking immediately.
5. **Customer Intelligence (`/admin/customers`)**:
   - Aggregated customer lifecycle records: Total lifetime spend (LTV), order frequency, city, and last active date.
6. **Cloud DB & Settings (`/admin/settings`)**:
   - Live telemetry status indicators for Supabase (Postgres) and MongoDB Atlas.
   - Razorpay API key configuration view.
   - "Test Webhook Ping" button sending mock HTTP POST to `/api/webhooks/razorpay`.
   - Vercel production environment variable guide.

---

## 7. REST API Endpoints Specification

| Method | Endpoint | Description | Payload / Query | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Get products | `category`, `search`, `minPrice`, `maxPrice`, `inStockOnly`, `sort` | `{ success: true, count, products: [...] }` |
| `POST`| `/api/products` | Create product | `{ name, category, price, stock, images, description, specifications }` | `{ success: true, product }` |
| `GET` | `/api/products/[id]` | Get single product | Slug or ID parameter | `{ success: true, product }` |
| `PUT` | `/api/products/[id]` | Update product | Partial product fields | `{ success: true, product }` |
| `DELETE`| `/api/products/[id]`| Delete product | ID parameter | `{ success: true, message }` |
| `GET` | `/api/orders` | Get all orders | None | `{ success: true, count, orders: [...] }` |
| `POST`| `/api/orders` | Place order | `{ customerName, customerEmail, items, shippingAddress, paymentMethod, ... }` | `{ success: true, order }` |
| `GET` | `/api/orders/[id]` | Get order by ID | Order ID or Order Number | `{ success: true, order }` |
| `PATCH`| `/api/orders/[id]`| Update order status | `{ status: "PROCESSING" | "SHIPPED" | ... }` | `{ success: true, order }` |
| `POST`| `/api/payment/razorpay/create-order` | Generate Razorpay order | `{ amount, receipt, notes }` | `{ success: true, orderId, amount, currency, keyId }` |
| `POST`| `/api/payment/razorpay/verify` | Verify HMAC SHA256 | `{ razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId }` | `{ success: true, verified: true }` |
| `POST`| `/api/webhooks/razorpay` | Razorpay webhook listener | Webhook body + `x-razorpay-signature` | `{ received: true }` |
| `GET` | `/api/shipments` | Get shipments | None | `{ success: true, count, shipments: [...] }` |
| `POST`| `/api/shipments` | Dispatch order | `{ orderId, courier: "Delhivery" | "BlueDart" }` | `{ success: true, shipment }` |
| `GET` | `/api/shipments/[awb]` | Get tracking info | AWB tracking number | `{ success: true, shipment }` |
| `PATCH`| `/api/shipments/[awb]`| Advance milestone | `{ status, location, description }` | `{ success: true, shipment }` |
| `GET` | `/api/admin/metrics` | Get dashboard analytics | None | `{ success: true, metrics: { totalRevenue, totalOrders, ... } }` |

---

## 8. Directory & File Organization

```
ecommerce-store/
├── .env.example                     # Cloud database & Razorpay template variables
├── .env.local                       # Local development environment configuration
├── package.json                     # Next.js 14, React 18, Tailwind, Lucide, Razorpay, Recharts
├── tsconfig.json                    # TypeScript compiler path aliases (@/* -> ./src/*)
├── tailwind.config.ts               # Custom Indigo, Emerald, and Slate palette
├── next.config.mjs                  # Image remote patterns for Unsplash
├── vercel.json                      # Vercel deployment framework configuration
├── README.md                        # Quick start & developer guide
├── PROJECT_KNOWLEDGE_BASE.md        # This self-contained knowledge base document
├── prisma/
│   └── schema.prisma                # PostgreSQL / Supabase schema (Users, Orders, Payments, Shipments)
└── src/
    ├── types/
    │   └── index.ts                 # Full TypeScript interfaces & types
    ├── context/
    │   ├── CartContext.tsx          # LocalStorage persistent shopping cart state
    │   └── ToastContext.tsx         # Global toast notifications
    ├── lib/
    │   ├── utils.ts                 # Currency formatting (INR), date helpers, status badge classes
    │   ├── razorpay.ts              # Razorpay order creator & HMAC-SHA256 signature verifier
    │   ├── db/
    │   │   ├── seed-data.ts         # Initial rich audio, wearable & peripheral products
    │   │   └── store.ts             # Universal DatabaseStore (SQL/NoSQL async operations)
    │   └── shipment/
    │       └── shipmentService.ts   # Courier partners, AWB generator & milestone transitions
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx           # Header with search, categories, cart counter, and admin badge
    │   │   ├── Footer.tsx           # Footer with value props, quick links, and tracking shortcuts
    │   │   └── Providers.tsx        # Client Context Providers wrapper
    │   ├── cart/
    │   │   └── CartDrawer.tsx       # Slide-over cart sheet with promo codes
    │   ├── products/
    │   │   ├── ProductCard.tsx      # Card with discount badge, ratings, quick add
    │   │   └── ProductFilter.tsx    # Multi-faceted filter sidebar
    │   ├── tracking/
    │   │   └── TrackingTimeline.tsx # Interactive visual shipment timeline
    │   ├── checkout/
    │   │   └── RazorpayPaymentButton.tsx # Official Razorpay SDK loader + Sandbox simulator
    │   └── admin/
    │       └── AdminSidebar.tsx     # Admin navigation sidebar with live database status pills
    └── app/
        ├── layout.tsx               # Root layout
        ├── globals.css              # Custom styling & scrollbars
        ├── page.tsx                 # Homepage
        ├── products/
        │   ├── page.tsx             # Products catalog with Suspense
        │   └── [slug]/page.tsx      # Product detail page with specs & reviews
        ├── cart/page.tsx            # Shopping cart review
        ├── checkout/page.tsx        # Multi-step checkout with address & Razorpay
        ├── order-success/[orderId]/ # Confirmation with confetti & live AWB tracking link
        │   └── page.tsx
        ├── orders/page.tsx          # Customer order history
        ├── track/[trackingNumber]/  # Customer live package tracking portal
        │   └── page.tsx
        ├── admin/
        │   ├── layout.tsx           # Admin layout
        │   ├── page.tsx             # Analytics dashboard with Recharts
        │   ├── products/page.tsx    # Product catalog manager CRUD
        │   ├── orders/page.tsx      # Order fulfillment pipeline
        │   ├── shipments/page.tsx   # Logistics hub & milestone broadcaster
        │   ├── customers/page.tsx   # Customer intelligence & LTV
        │   └── settings/page.tsx    # Database status & Razorpay webhook ping
        └── api/
            ├── products/
            │   ├── route.ts         # GET & POST products
            │   └── [id]/route.ts    # GET, PUT, DELETE product
            ├── orders/
            │   ├── route.ts         # GET & POST orders
            │   └── [id]/route.ts    # GET & PATCH order status
            ├── payment/razorpay/
            │   ├── create-order/route.ts # Razorpay order creation
            │   └── verify/route.ts  # HMAC-SHA256 signature validation
            ├── webhooks/razorpay/
            │   └── route.ts         # Razorpay async webhook listener
            ├── shipments/
            │   ├── route.ts         # GET & POST shipments
            │   └── [awb]/route.ts   # GET tracking & PATCH milestone scan
            └── admin/metrics/
                └── route.ts         # Dashboard analytics & revenue velocity
```

---

## 9. Environment Variables & Production Deployment

### `.env.local` / `.env` Variables:
```env
# PostgreSQL / Supabase Connection URL
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:password@db.supabase.co:5432/postgres?sslmode=require"

# MongoDB Atlas Connection URI
MONGODB_URI="mongodb+srv://admin:password@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority"

# Razorpay API Credentials (from https://dashboard.razorpay.com/app/keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_mockKeyId123456789"
RAZORPAY_KEY_SECRET="mockSecretKeyXYZ987654321"
RAZORPAY_WEBHOOK_SECRET="mockWebhookSecret123"

# App URL & Currency
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CURRENCY="INR"
NEXT_PUBLIC_CURRENCY_SYMBOL="₹"
```

### Vercel Deployment in 3 Steps:
1. Push to GitHub (`git init`, `git add .`, `git commit`, `git push`).
2. Import project in [Vercel Dashboard](https://vercel.com).
3. Paste the Environment Variables from above into Vercel Settings and click **Deploy**.
