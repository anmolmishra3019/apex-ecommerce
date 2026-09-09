# APEX Store — Full-Stack E-Commerce Platform

A full-stack e-commerce application built with **Next.js, React, TypeScript, Tailwind CSS, PostgreSQL/Supabase, MongoDB, and Razorpay**.

The project focuses on realistic commerce workflows: product discovery, cart and checkout, payment verification, order management, shipment tracking, and admin operations.

## What I Built

### Customer Experience

- Responsive storefront and product catalog
- Category, price, stock, rating, search, and sorting filters
- Product details with variants, specifications, stock, and reviews
- Cart drawer and dedicated cart flow
- Coupon handling and GST calculation
- Multi-step checkout
- Razorpay payment flow
- Customer order portal

### Payments

- Razorpay order creation
- HMAC-SHA256 signature verification
- Razorpay webhook endpoint
- Sandbox-friendly payment workflow

### Shipment Tracking

- AWB generation for logistics partners
- Shipment milestone state machine
- Tracking page using AWB numbers
- Dispatch and milestone management through the admin panel

Example shipment flow:

```text
MANIFEST_CREATED
       ↓
   PICKED_UP
       ↓
   IN_TRANSIT
       ↓
REACHED_DESTINATION_HUB
       ↓
OUT_FOR_DELIVERY
       ↓
    DELIVERED
```

### Admin Operations

- Revenue and KPI dashboard
- Product management
- Order fulfillment workflow
- Payment receipt visibility
- Courier assignment
- Shipment/AWB management
- Customer metrics such as LTV and order frequency
- Infrastructure/configuration status

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js / React / TypeScript |
| Styling | Tailwind CSS |
| Transactional data | PostgreSQL / Supabase + Prisma |
| Catalog data | MongoDB Atlas + Mongoose |
| Payments | Razorpay |
| Charts | Recharts |
| Deployment target | Vercel |

## Architecture

```text
                    Next.js App
                        │
        ┌───────────────┴───────────────┐
        │                               │
   Customer UI                     Admin UI
        │                               │
        └───────────────┬───────────────┘
                        │
                  API / Server Logic
                        │
          ┌─────────────┴─────────────┐
          │                           │
 PostgreSQL / Supabase           MongoDB Atlas
  Orders / Payments / Users      Products / Reviews
          │                           │
          └─────────────┬─────────────┘
                        │
                    Razorpay
                        │
                 Payment Events
```

### Database Responsibilities

**PostgreSQL / Supabase** handles transactional data such as users, orders, order items, payments, addresses, and shipment milestones.

**MongoDB Atlas** handles flexible catalog data, product specifications, and customer reviews.

This separation keeps transactional workflows and flexible product data independently modeled.

## Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL/Supabase, MongoDB, and Razorpay credentials for live integrations

### Install

```bash
npm install
```

### Environment Variables

Create `.env.local` with the credentials required by the application. Keep secrets out of Git.

```env
DATABASE_URL="..."
DIRECT_URL="..."
MONGODB_URI="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CURRENCY="INR"
NEXT_PUBLIC_CURRENCY_SYMBOL="₹"
```

### Development

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start
```

## Key Routes

```text
/                  Storefront
/products          Product catalog
/cart              Cart
/checkout          Checkout
/orders            Customer orders
/track/[awb]       Shipment tracking
/admin             Admin dashboard
/admin/shipments   Logistics operations
```

## Engineering Highlights

- Full-stack Next.js App Router architecture
- Transactional data modeling with Prisma/PostgreSQL
- Flexible catalog modeling with MongoDB/Mongoose
- Payment signature verification instead of trusting client-side payment state
- Shipment lifecycle represented as explicit state transitions
- Separate customer and operational/admin workflows
- Responsive UI across commerce-critical screens

## Future Improvements

- Authentication and role-based access control
- Production logistics API integrations
- Expanded automated test coverage
- Inventory reservation and concurrency handling
- Observability and production monitoring
- Live deployment with secure managed credentials

## Author

**Anmol Mishra**  
B.Tech ECE | Full-Stack Development | Next.js | React | TypeScript | Node.js
