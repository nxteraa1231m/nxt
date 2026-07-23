"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, X } from "lucide-react";
import { getOrders, updateOrderStatus } from "@/lib/firebase/firestore";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/types/order";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";

const STATUS_TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipping", label: "Shipping" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_NEXT: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipping", "cancelled"],
  shipping: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchSearch =
      search === "" ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
      }
      toast.success(`Order marked as ${ORDER_STATUS_LABELS[newStatus]}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-400 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? orders.length
              : orders.filter((o) => o.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.value
                  ? "bg-black text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  statusFilter === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name, phone, or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          No orders found
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Order</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Payment</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gray-500">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(
                        order.createdAt instanceof Date
                          ? order.createdAt
                          : (order.createdAt as any).toDate()
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 capitalize">
                      {order.paymentMethod.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {STATUS_NEXT[order.status].length > 0 && (
                        <div className="relative inline-block">
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusChange(order.id, e.target.value as OrderStatus);
                              }
                            }}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-black bg-white cursor-pointer"
                            disabled={updatingId === order.id}
                          >
                            <option value="">Update</option>
                            {STATUS_NEXT[order.status].map((s) => (
                              <option key={s} value={s}>
                                → {ORDER_STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h3 className="font-bold">
                  Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Customer
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Name</p>
                      <p className="font-semibold">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Phone</p>
                      <p className="font-semibold">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">City</p>
                      <p className="font-semibold">{selectedOrder.city}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Payment</p>
                      <p className="font-semibold capitalize">
                        {selectedOrder.paymentMethod.replace("_", " ")}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 text-xs">Address</p>
                      <p className="font-semibold">{selectedOrder.address}</p>
                    </div>
                    {selectedOrder.notes && (
                      <div className="col-span-2">
                        <p className="text-gray-400 text-xs">Notes</p>
                        <p className="font-semibold">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Items
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          {item.productImage && (
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain p-1"
                              style={{ mixBlendMode: "multiply" }}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.selectedColor.name} / {item.selectedSize} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total + Status */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-2xl font-bold">
                      {formatPrice(selectedOrder.total)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {STATUS_NEXT[selectedOrder.status].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedOrder.id, s)}
                        disabled={updatingId === selectedOrder.id}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                          s === "cancelled"
                            ? "border border-red-200 text-red-500 hover:bg-red-50"
                            : "bg-black text-white hover:bg-gray-900"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
