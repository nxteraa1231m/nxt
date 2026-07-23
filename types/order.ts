import { Timestamp } from "firebase/firestore";
import type { Product } from "./product";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "vodafone_cash" | "instapay";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: {
    name: string;
    hex: string;
    image: string;
  };
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  whatsappPhone?: string;
  governorate?: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shippingCost?: number;
  total: number;
  status: OrderStatus;
  createdAt: Timestamp | Date;
}

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  whatsappPhone?: string;
  governorate?: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shippingCost?: number;
  total: number;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipping: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};
