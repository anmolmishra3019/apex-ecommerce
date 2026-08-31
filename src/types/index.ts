export type Role = "CUSTOMER" | "ADMIN";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "CAPTURED" | "FAILED" | "REFUNDED";

export type PaymentMethod = "RAZORPAY" | "COD" | "UPI" | "CARD";

export type ShipmentStatus =
  | "MANIFEST_CREATED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "REACHED_DESTINATION_HUB"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED_ATTEMPT"
  | "RETURNED";

export type CourierPartner = "Delhivery" | "BlueDart" | "Shadowfax" | "XpressBees" | "DTDC";

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size: M, Color: Midnight Blue"
  sku: string;
  price: number;
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  tags: string[];
  featured?: boolean;
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  selectedVariant?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  id: string;
  orderId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  status: ShipmentStatus;
  location: string;
  description: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string; // AWB
  courier: CourierPartner;
  status: ShipmentStatus;
  currentLocation: string;
  estimatedDeliveryDate: string;
  shippingAddress: ShippingAddress;
  events: TrackingEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment: PaymentDetails;
  shippingAddress: ShippingAddress;
  shipment?: Shipment;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingShipments: number;
  deliveredOrders: number;
  revenueChart: { date: string; revenue: number; orders: number }[];
  categorySales: { category: string; count: number; value: number }[];
  recentOrders: Order[];
}
