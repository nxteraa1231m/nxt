"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPct = hasDiscount
    ? getDiscountPercentage(product.price, product.salePrice!)
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/products/${product.slug}`} className="block group">
        {/* 
          IMAGE CONTAINER — KEY FLOATING CARD DESIGN
          - Transparent background (no bg color set)
          - No border, no shadow on the card itself
          - The product PNG image uses mix-blend-mode: multiply
            so white/light areas in the image become transparent,
            making it look like the product is floating on the page
        */}
        <div className="relative overflow-hidden">
          {/* Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.bestSeller && (
              <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Best Seller
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                -{discountPct}%
              </span>
            )}
            {product.featured && !product.bestSeller && (
              <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>

          {/* Quick View Overlay — appears on hover */}
          <div className="absolute inset-0 z-10 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.span
              className="flex items-center gap-2 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full"
              initial={{ y: 10 }}
              whileHover={{ scale: 1.05 }}
            >
              <Eye size={14} />
              Quick View
            </motion.span>
          </div>

          {/* Product Image — aspect-square, object-contain */}
          <div className="aspect-square relative overflow-hidden">
            {product.images[0] ? (
              <motion.div
                className="w-full h-full"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-4 transition-opacity duration-300"
                  style={{
                    mixBlendMode: "multiply",
                  }}
                />
              </motion.div>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-300 text-4xl font-black">NXT</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info — minimal, centered */}
        <div className="pt-4 text-center space-y-1 px-2">
          {/* Colors swatches */}
          {product.colors.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 mb-2">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color.hex}
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-gray-400">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          <h3 className="text-sm font-semibold text-gray-900 leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center justify-center gap-2">
            <span className="text-base font-bold">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
