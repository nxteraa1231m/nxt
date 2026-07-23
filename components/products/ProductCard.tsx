"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import { useWishlist } from "@/features/wishlist/WishlistProvider";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);
  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPct = hasDiscount
    ? getDiscountPercentage(product.price, product.salePrice!)
    : 0;

  // Stagger index within grid row (4 items per row max)
  const staggerDelay = (index % 4) * 0.08;

  return (
    <motion.article
      initial={{ opacity: 0, y: 35, scale: 0.94, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: staggerDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/products/${product.slug}`} className="block group">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Wishlist Heart Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-100 dark:border-zinc-800 text-zinc-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-md"
            title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={14} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
            {product.bestSeller && (
              <span className="bg-black/90 dark:bg-white/90 text-white dark:text-black text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                Best Seller
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                -{discountPct}%
              </span>
            )}
            {product.featured && !product.bestSeller && (
              <span className="bg-zinc-900/90 text-white text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                New
              </span>
            )}
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 z-10 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <motion.span
              className="flex items-center gap-2 bg-black/90 text-white dark:bg-white/90 dark:text-black text-xs font-bold px-4 py-2 rounded-full shadow-xl backdrop-blur-sm"
              initial={{ y: 12, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
            >
              <Eye size={14} />
              Quick View
            </motion.span>
          </div>

          {/* Product Image Container */}
          <div className="aspect-square relative overflow-hidden bg-zinc-100/80 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800/60 transition-colors">
            {product.mainImage ? (
              <motion.div
                className="w-full h-full"
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={product.mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-4 transition-transform duration-500"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-300 dark:text-zinc-700 text-4xl font-black">NXT</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="pt-3.5 text-center space-y-1.5 px-2">
          {/* Colors swatches */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              {product.variants.slice(0, 4).map((variant) => (
                <div
                  key={variant.colorHex}
                  className="w-3 h-3 rounded-full border border-gray-200 dark:border-zinc-800 shadow-sm"
                  style={{ backgroundColor: variant.colorHex }}
                  title={variant.colorName}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="text-[10px] text-gray-400 font-bold">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          )}

          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm sm:text-base font-black text-foreground">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through font-semibold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
