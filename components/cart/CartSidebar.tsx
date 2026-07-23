"use client";

import Link from "next/link";
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/features/cart/CartProvider";
import { formatPrice } from "@/lib/utils";

export function CartSidebar() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Sidebar */}
          <motion.aside
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background text-foreground z-50 flex flex-col shadow-2xl border-l border-gray-100 dark:border-zinc-800"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <h2 className="font-bold text-lg">
                  Cart {totalItems > 0 && <span className="text-gray-400 font-normal text-base">({totalItems})</span>}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                    <ShoppingBag className="text-gray-400" size={32} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Add some products to get started
                    </p>
                  </div>
                  <Link
                    href="/#products"
                    onClick={closeCart}
                    className="btn-primary mt-2"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const key = `${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`;
                      const price = item.product.salePrice ?? item.product.price;

                      return (
                        <motion.div
                          key={key}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0 }}
                          className="flex gap-4 p-3 bg-gray-50 dark:bg-zinc-900 rounded-2xl"
                        >
                          {/* Image */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.selectedColor.image || item.product.mainImage || "/placeholder.jpg"}
                              alt={item.product.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-contain"
                              style={{ mixBlendMode: "multiply" }}
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {item.product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div
                                className="w-3 h-3 rounded-full border border-gray-200 dark:border-zinc-800"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {item.selectedColor.name} / {item.selectedSize}
                              </span>
                            </div>
                            <p className="font-bold text-sm mt-1">
                              {formatPrice(price * item.quantity)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-end justify-between">
                            <button
                              onClick={() =>
                                removeItem(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor.hex
                                )
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 rounded-lg p-1 border border-gray-200 dark:border-zinc-700">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateQuantity(
                                      item.product.id,
                                      item.selectedSize,
                                      item.selectedColor.hex,
                                      item.quantity - 1
                                    );
                                  }
                                }}
                                className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="text-xs font-semibold w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedSize,
                                    item.selectedColor.hex,
                                    item.quantity + 1
                                  )
                                }
                                className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-700 rounded"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Subtotal</span>
                  <span className="font-bold text-lg">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-xs text-gray-400">
                  Shipping calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center py-4 bg-accent text-background rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full text-center py-3 border border-gray-200 dark:border-zinc-700 rounded-xl font-medium text-sm hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  View Cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
