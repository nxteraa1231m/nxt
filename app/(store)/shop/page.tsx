"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductGrid } from "@/components/products/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { getProducts } from "@/lib/firebase/firestore";
import type { Product } from "@/types/product";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState("newest");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const priceRange: [number, number] = [0, 10000];

  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const bestSeller = searchParams.get("bestSeller");

  useEffect(() => {
    setLoading(true);
    getProducts({
      category: category || undefined,
      featured: featured === "true" ? true : undefined,
      bestSeller: bestSeller === "true" ? true : undefined,
    })
      .then((data) => {
        setProducts(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, featured, bestSeller]);

  // Apply filters + sort
  useEffect(() => {
    let result = [...products];

    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        selectedSizes.some((s) => p.sizes.includes(s))
      );
    }

    result = result.filter(
      (p) =>
        (p.salePrice ?? p.price) >= priceRange[0] &&
        (p.salePrice ?? p.price) <= priceRange[1]
    );

    if (sort === "price-asc") {
      result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sort === "price-desc") {
      result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    }

    setFiltered(result);
  }, [products, selectedSizes, priceRange, sort]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const pageTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : featured === "true"
    ? "New Arrivals"
    : bestSeller === "true"
    ? "Best Sellers"
    : "All Products";

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              Collection
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {pageTitle}
            </h1>
            {!loading && (
              <p className="text-gray-400 text-sm mt-1">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 text-sm border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filter
              {selectedSizes.length > 0 && (
                <span className="bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {selectedSizes.length}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              className="mt-6 p-6 bg-gray-50 rounded-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                {selectedSizes.length > 0 && (
                  <button
                    onClick={() => setSelectedSizes([])}
                    className="text-xs text-gray-500 flex items-center gap-1 hover:text-black"
                  >
                    <X size={12} />
                    Clear all
                  </button>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-10 h-10 rounded-xl border text-xs font-semibold transition-all ${
                        selectedSizes.includes(size)
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Products */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or browse all products."
          />
        ) : (
          <ProductGrid products={filtered} columns={4} />
        )}
      </div>
    </div>
  );
}
