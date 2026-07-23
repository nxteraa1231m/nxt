"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getProductBySlug } from "@/lib/firebase/firestore";
import { useCart } from "@/features/cart/CartProvider";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import type { Product, ProductColor } from "@/types/product";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { addItem, openCart } = useCart();

  useEffect(() => {
    getProductBySlug(slug)
      .then((data) => {
        if (!data) notFound();
        setProduct(data);
        setSelectedColor(data?.colors[0] || null);
        setSelectedSize(data?.sizes[0] || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) return null;

  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPct = hasDiscount
    ? getDiscountPercentage(product.price, product.salePrice!)
    : 0;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    setAdding(true);
    addItem(product, quantity, selectedSize, selectedColor);
    await new Promise((r) => setTimeout(r, 600));
    setAdding(false);
    toast.success(`${product.name} added to cart`);
    openCart();
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              className="aspect-square relative overflow-hidden rounded-2xl bg-gray-50"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Image
                    src={product.images[activeImage] || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    style={{ mixBlendMode: "multiply" }}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Image Nav */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage((i) =>
                        i === 0 ? product.images.length - 1 : i - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImage((i) =>
                        i === product.images.length - 1 ? 0 : i + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-black"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-2 bg-gray-50"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              {product.bestSeller && (
                <Badge variant="default">Best Seller</Badge>
              )}
              {product.featured && (
                <Badge variant="info">New Arrival</Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="warning">Only {product.stock} left</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>

            <p className="text-sm text-gray-500 font-medium mb-1">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">
                    -{discountPct}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Color Picker */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">
                  Color:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedColor?.name}
                  </span>
                </p>
                <div className="flex gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor?.hex === color.hex
                          ? "border-black scale-110"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Picker */}
            {product.sizes.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold mb-3">
                  Size:{" "}
                  <span className="font-normal text-gray-500">
                    {selectedSize}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-semibold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      product.stock > 0 ? Math.min(product.stock, q + 1) : q + 1
                    )
                  }
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <motion.button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="flex-1 h-12 bg-black text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.98 }}
              >
                {adding ? (
                  <Spinner size="sm" className="border-white border-t-transparent" />
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </>
                )}
              </motion.button>
            </div>

            {/* Stock info */}
            {product.stock > 0 && (
              <p className="text-xs text-gray-400 mt-3">
                {product.stock} items available in stock
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
