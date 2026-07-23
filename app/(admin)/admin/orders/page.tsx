"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { getOrders, updateOrderStatus } from "@/lib/firebase/firestore";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";

const STATUS_TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All Orders" },
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

const statusDots: Record<string, string> = {
  pending: "bg-amber-500",
  processing: "bg-blue-500",
  confirmed: "bg-blue-500",
  shipping: "bg-indigo-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
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
      toast.success(`Order status updated to ${ORDER_STATUS_LABELS[newStatus]}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Orders</h1>
        <p className="text-zinc-400 text-xs mt-1">
          {orders.length} total orders registered in Firestore. Click an order row to inspect details.
        </p>
      </div>

      {/* Status Tabs Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? orders.length
              : orders.filter((o) => o.status === tab.value).length;
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/10"
                  : "bg-white border border-zinc-100 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              {tab.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-zinc-50 text-zinc-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search by customer name, phone number, or Firestore ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all placeholder:text-zinc-400"
        />
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Spinner size="lg" />
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Loading orders</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-100/80 p-16 text-center text-zinc-400 text-xs font-medium">
          No orders matching filters found.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-left">Payment</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-zinc-50/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500 font-medium">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-zinc-900">{order.customerName}</p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500 font-medium">
                      {formatDate(
                        order.createdAt instanceof Date
                          ? order.createdAt
                          : (order.createdAt as { toDate(): Date }).toDate()
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-zinc-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      {order.paymentMethod.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-800 capitalize">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDots[order.status] || "bg-zinc-300"}`} />
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {STATUS_NEXT[order.status].length > 0 ? (
                        <div className="relative inline-block">
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusChange(order.id, e.target.value as OrderStatus);
                              }
                            }}
                            className="text-[10px] font-bold border border-zinc-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-zinc-300 bg-white cursor-pointer hover:bg-zinc-50 transition-all"
                            disabled={updatingId === order.id}
                          >
                            <option value="">Status</option>
                            {STATUS_NEXT[order.status].map((s) => (
                              <option key={s} value={s}>
                                {ORDER_STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
                          Locked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 sticky top-0 bg-white z-10">
                <div>
                  <h3 className="font-black text-sm text-zinc-900 uppercase tracking-widest">
                    Order Details
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                    ID: {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-50 border border-transparent hover:border-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-8">
                {/* Status indicator bar */}
                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusDots[selectedOrder.status] || "bg-zinc-300"}`} />
                    <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                      Current Status: {selectedOrder.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    Placed on {formatDate(
                      selectedOrder.createdAt instanceof Date
                        ? selectedOrder.createdAt
                        : (selectedOrder.createdAt as { toDate(): Date }).toDate()
                    )}
                  </span>
                </div>

                {/* Customer Details Grid */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                    <Sparkles size={11} className="text-zinc-400" />
                    Customer Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs bg-white border border-zinc-100 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.005)]">
                    <div>
                      <p className="text-zinc-400 font-medium">Name</p>
                      <p className="font-bold text-zinc-900 mt-0.5">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 font-medium">Phone</p>
                      <p className="font-mono font-bold text-zinc-900 mt-0.5">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 font-medium">City</p>
                      <p className="font-bold text-zinc-900 mt-0.5">{selectedOrder.city}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 font-medium">Payment Method</p>
                      <p className="font-bold text-zinc-900 capitalize mt-0.5">
                        {selectedOrder.paymentMethod.replace("_", " ")}
                      </p>
                    </div>
                    <div className="col-span-2 border-t border-zinc-50 pt-3">
                      <p className="text-zinc-400 font-medium">Shipping Address</p>
                      <p className="font-bold text-zinc-800 mt-0.5">{selectedOrder.address}</p>
                    </div>
                    {selectedOrder.notes && (
                      <div className="col-span-2 border-t border-zinc-50 pt-3">
                        <p className="text-zinc-400 font-medium">Order Notes</p>
                        <p className="font-bold text-zinc-700 italic mt-0.5">&ldquo;{selectedOrder.notes}&rdquo;</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Ordered List */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                    <Sparkles size={11} className="text-zinc-400" />
                    Order Items ({selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)})
                  </h4>
                  <div className="space-y-2.5">
                    {selectedOrder.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3.5 p-3.5 bg-zinc-50/50 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-colors duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-zinc-100 flex-shrink-0 flex items-center justify-center p-1">
                          {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <div className="text-[10px] font-black text-zinc-300">NXT</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-zinc-950 truncate">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                            Color: {item.selectedColor.name} | Size: {item.selectedSize} | Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-black text-xs text-zinc-950">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total + Operations Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-100">
                  <div>
                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Total Value</p>
                    <p className="text-2xl font-black text-zinc-900 tracking-tight mt-0.5">
                      {formatPrice(selectedOrder.total)}
                    </p>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    {STATUS_NEXT[selectedOrder.status].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedOrder.id, s)}
                        disabled={updatingId === selectedOrder.id}
                        className={`inline-flex items-center gap-1 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm ${
                          s === "cancelled"
                            ? "border border-red-200 text-red-500 hover:bg-red-50"
                            : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/10"
                        }`}
                      >
                        Mark as {ORDER_STATUS_LABELS[s]}
                        <ChevronRight size={12} />
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
