"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Smartphone, CreditCard, MapPin, Truck, MessageSquare } from "lucide-react";
import { useCart } from "@/features/cart/CartProvider";
import { createOrder, getShippingRates } from "@/lib/firebase/firestore";
import { formatPrice } from "@/lib/utils";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations/checkout.schema";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import type { PaymentMethod, OrderItem } from "@/types/order";
import { TruckSubmitButton } from "@/components/checkout/TruckSubmitButton";
import type { GovernorateRate } from "@/constants/governorates";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("vodafone_cash");
  const [shippingRates, setShippingRates] = useState<GovernorateRate[]>([]);
  const [selectedGovernorateId, setSelectedGovernorateId] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "vodafone_cash" },
  });

  const selectedGovernorate = watch("governorate");

  // Fetch Shipping Rates from Firestore
  useEffect(() => {
    getShippingRates()
      .then((data) => {
        setShippingRates(data);
        if (data.length > 0) {
          const defaultGov = data.find((r) => r.active) || data[0];
          setValue("governorate", defaultGov.nameAr);
          setSelectedGovernorateId(defaultGov.id);
        }
      })
      .catch(console.error);
  }, [setValue]);

  // Update selected rate when dropdown changes
  useEffect(() => {
    if (selectedGovernorate && shippingRates.length > 0) {
      const found = shippingRates.find((r) => r.nameAr === selectedGovernorate || r.nameEn === selectedGovernorate);
      if (found) setSelectedGovernorateId(found.id);
    }
  }, [selectedGovernorate, shippingRates]);

  const activeRateObj = shippingRates.find((r) => r.id === selectedGovernorateId);
  const currentShippingCost = activeRateObj ? activeRateObj.price : 50;
  const finalOrderTotal = totalPrice + currentShippingCost;

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      setIsRedirecting(true);
      router.replace("/");
    }
  }, [items, router]);

  if (!mounted || items.length === 0 || isRedirecting) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);
    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.selectedColor.image || item.product.mainImage || "",
        price: item.product.salePrice ?? item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      }));

      const orderId = await createOrder({
        customerName: data.customerName,
        phone: data.phone,
        whatsappPhone: data.whatsappPhone || data.phone,
        governorate: data.governorate,
        city: data.city,
        address: data.address,
        notes: data.notes,
        paymentMethod: paymentMethod,
        items: orderItems,
        subtotal: totalPrice,
        shippingCost: currentShippingCost,
        total: finalOrderTotal,
      });

      clearCart();
      setTimeout(() => {
        router.push(`/order-success?orderId=${orderId}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen font-sans selection:bg-black selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          className="text-3xl font-black tracking-tight mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Checkout & Shipping
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form — 3 cols */}
            <div className="lg:col-span-3 space-y-8">
              {/* Customer Info */}
              <motion.div
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 space-y-5 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <MapPin size={20} className="text-gray-900" /> Customer & Delivery Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="customerName"
                    label="الاسم بالكامل (Full Name)"
                    placeholder="أحمد محمد"
                    error={errors.customerName?.message}
                    {...register("customerName")}
                  />
                  <Input
                    id="phone"
                    label="رقم الهاتف للتواصل (Phone Number)"
                    placeholder="01012345678"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="whatsappPhone"
                    label="رقم الواتساب (WhatsApp Number)"
                    placeholder="01012345678 (اختياري)"
                    error={errors.whatsappPhone?.message}
                    {...register("whatsappPhone")}
                  />

                  {/* Governorate Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      المحافظة (Governorate)
                    </label>
                    <select
                      {...register("governorate")}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-black bg-white cursor-pointer"
                    >
                      {shippingRates.map((rate) => (
                        <option key={rate.id} value={rate.nameAr}>
                          {rate.nameAr} ({rate.nameEn}) — شحن {rate.price} ج.م
                        </option>
                      ))}
                    </select>
                    {errors.governorate && (
                      <p className="text-red-500 text-xs mt-1">{errors.governorate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Input
                    id="city"
                    label="المنطقة / الحي (City or District)"
                    placeholder="مثال: المعادي / مدينة نصر / سموحة"
                    error={errors.city?.message}
                    {...register("city")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    العنوان بالتفصيل (Detailed Address)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black resize-none bg-white"
                    rows={3}
                    placeholder="اسم الشارع، رقم العمارة، الدور، رقم الشقة..."
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    ملاحظات التوصيل (Notes)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black resize-none bg-white"
                    rows={2}
                    placeholder="أي تعليمات للمندوب أو الموعد المفضل للتسليم..."
                    {...register("notes")}
                  />
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-bold text-lg text-gray-900 mb-5">Payment Method</h2>
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
                          ? "border-black bg-white shadow-sm"
                          : "border-gray-200 hover:border-gray-400 bg-white"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          paymentMethod === id ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-xs">{label}</p>
                        <p className="text-xs text-gray-400 font-mono">{number}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary — 2 cols */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 sticky top-24 border border-gray-100 space-y-6">
                <h2 className="font-bold text-lg text-gray-900">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const key = `${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`;
                    const price = item.product.salePrice ?? item.product.price;
                    return (
                      <div key={key} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-100">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                          <Image
                            src={item.selectedColor.image || item.product.mainImage || "/placeholder.jpg"}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {item.selectedColor.name} / {item.selectedSize} × {item.quantity}
                          </p>
                        </div>
                        <span className="text-xs font-black text-gray-900">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Subtotal (المجموع الفرعي)</span>
                    <span className="font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium flex items-center gap-1">
                      <Truck size={14} className="text-amber-500" /> الشحن ({selectedGovernorate || "المحافظة"})
                    </span>
                    <span className="font-bold text-amber-600">{formatPrice(currentShippingCost)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 flex justify-between font-black text-lg text-gray-900">
                  <span>Total Order (الإجمالي)</span>
                  <span>{formatPrice(finalOrderTotal)}</span>
                </div>

                {/* ANIMATED DELIVERY TRUCK SUBMIT BUTTON */}
                <div className="pt-2">
                  <TruckSubmitButton
                    isSubmitting={submitting}
                    onClick={handleSubmit(onSubmit)}
                    totalText={formatPrice(finalOrderTotal)}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
