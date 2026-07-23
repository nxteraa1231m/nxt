"use client";

import { useState, useEffect } from "react";
import { IntroScreen } from "@/components/home/IntroScreen";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import type { Product } from "@/types/product";
import { getProducts } from "@/lib/firebase/firestore";

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Set to false initially so it runs on every page reload/refresh
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    // Load featured products
    getProducts({ featured: true, limitCount: 8 })
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to load products:", err);
        // Products will be empty — graceful degradation
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
        <FeaturedProducts products={products} />
      </div>
    </>
  );
}
