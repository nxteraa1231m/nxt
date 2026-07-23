"use client";

import Link from "next/link";
import { X, Heart, ShoppingBag, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/features/wishlist/WishlistProvider";
import { formatPrice } from "@/lib/utils";

export function WishlistSidebar() {
  const { isOpen, closeWishlist, wishlist, toggleWishlist } = useWishlist();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={closeWishlist}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-950 z-50 shadow-2xl border-l border-gray-100 dark:border-zinc-900 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-zinc-900 dark:text-white fill-zinc-900 dark:fill-white" />
                <h2 className="text-lg font-bold">My Wishlist</h2>
                <span className="text-xs bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full font-bold">
                  {wishlist.length}
                </span>
              </div>
              <button
                onClick={closeWishlist}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 pb-20">
                  <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                    <Heart size={30} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Your wishlist is empty</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-[240px] mx-auto">
                      Save items you love here to keep track of them and make them yours!
                    </p>
                  </div>
                  <button
                    onClick={closeWishlist}
                    className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                wishlist.map((product) => {
                  const displayPrice = product.salePrice ?? product.price;
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-3 bg-gray-50 dark:bg-zinc-900/40 rounded-2xl border border-transparent dark:border-zinc-900 hover:border-gray-200 dark:hover:border-zinc-800 transition-all"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 flex-shrink-0 flex items-center justify-center p-1.5 border border-gray-100 dark:border-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.mainImage || "/placeholder.jpg"}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Info & Action Column */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-xs text-zinc-950 dark:text-zinc-50 truncate">
                              {product.name}
                            </h4>
                            <button
                              onClick={() => toggleWishlist(product)}
                              className="text-zinc-400 hover:text-red-500 transition-colors p-0.5"
                              title="Remove from wishlist"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-[10px] text-zinc-400 capitalize font-medium mt-0.5">
                            {product.brand}
                          </p>
                        </div>

                        {/* Pricing & View Button Row */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-extrabold">
                            {formatPrice(displayPrice)}
                          </span>
                          
                          <Link
                            href={`/products/${product.slug}`}
                            onClick={closeWishlist}
                            className="inline-flex items-center gap-1 bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-lg text-[9px] font-black hover:opacity-90 transition-all"
                          >
                            <Eye size={10} />
                            VIEW PRODUCT
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
