import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus, ShipmentStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  const symbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  return `${symbol}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function getOrderStatusBadge(status: OrderStatus): { label: string; className: string } {
  switch (status) {
    case "PENDING_PAYMENT":
      return { label: "Payment Pending", className: "bg-amber-100 text-amber-800 border-amber-300" };
    case "PAID":
      return { label: "Paid", className: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    case "PROCESSING":
      return { label: "Processing", className: "bg-blue-100 text-blue-800 border-blue-300" };
    case "SHIPPED":
      return { label: "Shipped", className: "bg-indigo-100 text-indigo-800 border-indigo-300" };
    case "OUT_FOR_DELIVERY":
      return { label: "Out for Delivery", className: "bg-purple-100 text-purple-800 border-purple-300" };
    case "DELIVERED":
      return { label: "Delivered", className: "bg-teal-100 text-teal-800 border-teal-300" };
    case "CANCELLED":
      return { label: "Cancelled", className: "bg-rose-100 text-rose-800 border-rose-300" };
    default:
      return { label: status, className: "bg-slate-100 text-slate-800 border-slate-300" };
  }
}

export function getShipmentStatusBadge(status: ShipmentStatus): { label: string; className: string } {
  switch (status) {
    case "MANIFEST_CREATED":
      return { label: "Manifest Created", className: "bg-slate-100 text-slate-700 border-slate-300" };
    case "PICKED_UP":
      return { label: "Picked Up", className: "bg-blue-100 text-blue-800 border-blue-300" };
    case "IN_TRANSIT":
      return { label: "In Transit", className: "bg-indigo-100 text-indigo-800 border-indigo-300" };
    case "REACHED_DESTINATION_HUB":
      return { label: "At Destination Hub", className: "bg-amber-100 text-amber-800 border-amber-300" };
    case "OUT_FOR_DELIVERY":
      return { label: "Out for Delivery", className: "bg-purple-100 text-purple-800 border-purple-300" };
    case "DELIVERED":
      return { label: "Delivered Successfully", className: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    case "FAILED_ATTEMPT":
      return { label: "Delivery Attempt Failed", className: "bg-amber-100 text-amber-800 border-amber-300" };
    case "RETURNED":
      return { label: "Returned to Origin", className: "bg-rose-100 text-rose-800 border-rose-300" };
    default:
      return { label: status, className: "bg-slate-100 text-slate-700 border-slate-300" };
  }
}
