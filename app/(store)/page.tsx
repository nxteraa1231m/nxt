"use client";

import { useState, useEffect } from "react";
import { IntroScreen } from "@/components/home/IntroScreen";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import type { Product } from "@/types/product";
import { getProducts } from "@/lib/firebase/firestore";

export default function HomePage() {
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load all products for the catalog
    getProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }, []);

  const handleIntroComplete = () => {
    setHasSeenIntro(true);
    setIntroComplete(true);
  };

  return (
    <>
      {/* Cinematic Intro — only shows once per session */}
      {!hasSeenIntro && (
        <IntroScreen onComplete={handleIntroComplete} />
      )}

      {/* Main Content — rendered underneath intro for faster paint */}
      <div
        style={{
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.5s ease",
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
