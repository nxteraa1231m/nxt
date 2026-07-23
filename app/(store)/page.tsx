"use client";

import { useState, useEffect, useCallback } from "react";
import { IntroScreen } from "@/components/home/IntroScreen";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import type { Product } from "@/types/product";
import { getProducts } from "@/lib/firebase/firestore";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load products
    getProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <>
      {/* Cinematic Intro — Plays on main homepage entrance */}
      {showIntro && (
        <IntroScreen onComplete={handleIntroComplete} />
      )}

      {/* Main Content */}
      <div
        className="transition-opacity duration-700 ease-out"
        style={{
          opacity: showIntro ? 0 : 1,
          pointerEvents: showIntro ? "none" : "auto",
        }}
      >
        <HeroSection />
        <div id="products">
          <FeaturedProducts products={products} />
        </div>
      </div>
    </>
  );
}
