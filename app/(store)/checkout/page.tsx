"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Smartphone, CreditCard } from "lucide-react";
import { useCart } from "@/features/cart/CartProvider";
import { createOrder } from "@/lib/firebase/firestore";
import { formatPrice } from "@/lib/utils";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations/checkout.schema";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import type { PaymentMethod, OrderItem } from "@/types/order";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("vodafone_cash");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "vodafone_cash" },
  });

  if (items.length === 0) {
    router.replace("/shop");
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);
    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] || "",
        price: item.product.salePrice ?? item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      }));

      const orderId = await createOrder({
        customerName: data.customerName,
        phone: data.phone,
        city: data.city,
        address: data.address,
        notes: data.notes,
        paymentMethod: paymentMethod,
        items: orderItems,
        subtotal: totalPrice,
        total: totalPrice,
      });

      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          className="text-3xl font-bold tracking-tight mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form — 3 cols */}
            <div className="lg:col-span-3 space-y-8">
              {/* Customer Info */}
              <motion.div
                className="bg-gray-50 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-bold text-lg mb-5">Customer Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="customerName"
                    label="Full Name"
                    placeholder="Ahmed Mohamed"
                    error={errors.customerName?.message}
                    {...register("customerName")}
                  />
                  <Input
                    id="phone"
                    label="Phone Number"
                    placeholder="01012345678"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="city"
                    label="City"
                    placeholder="Cairo"
                    error={errors.city?.message}
                    {...register("city")}
                  />
                  <div className="sm:col-span-1 col-span-1" />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Address
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none bg-white"
                    rows={3}
                    placeholder="Street, Building, Apartment number..."
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Notes (optional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none bg-white"
                    rows={2}
                    placeholder="Any special instructions..."
                    {...register("notes")}
                  />
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                className="bg-gray-50 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-bold text-lg mb-5">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: "vodafone_cash" as PaymentMethod,
                      label: "Vodafone Cash",
                      icon: Smartphone,
                      number: "01012345678",
                    },
                    {
                      id: "instapay" as PaymentMethod,
                      label: "InstaPay",
                      icon: CreditCard,
                      number: "@nxtstore",
                    },
                  ].map(({ id, label, icon: Icon, number }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === id
                          ? "border-black bg-white"
                          : "border-gray-200 hover:border-gray-400 bg-white"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          paymentMethod === id ? "bg-black text-white" : "bg-gray-100"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{label}</p>
                        <p className="text-xs text-gray-400">{number}</p>
                      </div>
                      {paymentMethod === id && (
                        <div className="ml-auto w-4 h-4 bg-black rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {paymentMethod === "vodafone_cash" && (
                  <p className="mt-4 text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    💳 Please send payment to{" "}
                    <strong>01012345678</strong> after placing your order.
                    Include your order ID in the message.
                  </p>
                )}
                {paymentMethod === "instapay" && (
                  <p className="mt-4 text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-xl p-3">
                    💳 Please send payment to{" "}
                    <strong>@nxtstore</strong> after placing your order.
                    Include your order ID in the note.
                  </p>
                )}
              </motion.div>
            </div>

            {/* Order Summary — 2 cols */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                <h2 className="font-bold text-lg mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 max-h-72 overflow-y-auto mb-5">
                  {items.map((item) => {
                    const key = `${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`;
                    const price = item.product.salePrice ?? item.product.price;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          <Image
                            src={item.product.images[0] || "/placeholder.jpg"}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain p-1"
                            style={{ mixBlendMode: "multiply" }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.selectedColor.name} / {item.selectedSize} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-xs font-bold">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-400">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-black text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <Spinner size="sm" className="border-white border-t-transparent" />
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
