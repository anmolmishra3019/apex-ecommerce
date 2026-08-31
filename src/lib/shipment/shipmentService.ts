import { CourierPartner, ShipmentStatus, TrackingEvent } from "@/types";

export interface CourierInfo {
  name: CourierPartner;
  code: string;
  trackingPrefix: string;
  estimatedDays: number;
  rating: number;
  icon: string;
}

export const COURIER_PARTNERS: CourierInfo[] = [
  {
    name: "Delhivery",
    code: "DEL",
    trackingPrefix: "DEL-",
    estimatedDays: 2,
    rating: 4.8,
    icon: "Truck",
  },
  {
    name: "BlueDart",
    code: "BLU",
    trackingPrefix: "BLU-",
    estimatedDays: 1,
    rating: 4.9,
    icon: "Plane",
  },
  {
    name: "Shadowfax",
    code: "SHD",
    trackingPrefix: "SHD-",
    estimatedDays: 3,
    rating: 4.6,
    icon: "Package",
  },
  {
    name: "XpressBees",
    code: "XPB",
    trackingPrefix: "XPB-",
    estimatedDays: 2,
    rating: 4.7,
    icon: "Navigation",
  },
];

export const SHIPMENT_STAGES: {
  status: ShipmentStatus;
  title: string;
  defaultDescription: string;
  stepNumber: number;
}[] = [
  {
    status: "MANIFEST_CREATED",
    title: "Order Processed & Manifested",
    defaultDescription: "Shipment manifest created at central fulfillment center. Awaiting courier pickup.",
    stepNumber: 1,
  },
  {
    status: "PICKED_UP",
    title: "Picked Up by Courier",
    defaultDescription: "Courier partner has collected the packaged goods from warehouse.",
    stepNumber: 2,
  },
  {
    status: "IN_TRANSIT",
    title: "In Transit to Destination City",
    defaultDescription: "Package in transit through regional logistics hubs.",
    stepNumber: 3,
  },
  {
    status: "REACHED_DESTINATION_HUB",
    title: "Arrived at Destination Hub",
    defaultDescription: "Package received at the local delivery center and sorted for last-mile route.",
    stepNumber: 4,
  },
  {
    status: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    defaultDescription: "Delivery executive is en route with your package.",
    stepNumber: 5,
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    defaultDescription: "Package handed over to recipient. Delivery confirmed.",
    stepNumber: 6,
  },
];

export class ShipmentService {
  static generateAWB(courier: CourierPartner): string {
    const courierInfo = COURIER_PARTNERS.find((c) => c.name === courier) || COURIER_PARTNERS[0];
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    return `${courierInfo.trackingPrefix}${randomDigits}`;
  }

  static getProgressPercentage(status: ShipmentStatus): number {
    switch (status) {
      case "MANIFEST_CREATED":
        return 15;
      case "PICKED_UP":
        return 35;
      case "IN_TRANSIT":
        return 55;
      case "REACHED_DESTINATION_HUB":
        return 75;
      case "OUT_FOR_DELIVERY":
        return 90;
      case "DELIVERED":
        return 100;
      case "FAILED_ATTEMPT":
        return 80;
      case "RETURNED":
        return 0;
      default:
        return 10;
    }
  }

  static getNextStatus(currentStatus: ShipmentStatus): ShipmentStatus | null {
    const order: ShipmentStatus[] = [
      "MANIFEST_CREATED",
      "PICKED_UP",
      "IN_TRANSIT",
      "REACHED_DESTINATION_HUB",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];

    const idx = order.indexOf(currentStatus);
    if (idx === -1 || idx >= order.length - 1) return null;
    return order[idx + 1];
  }
}
