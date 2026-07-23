"use client";

import { useState, useEffect, useCallback } from "react";
import { IntroScreen } from "@/components/home/IntroScreen";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import type { Product } from "@/types/product";
import { getProducts } from "@/lib/firebase/firestore";

export default function HomePage() {
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(true); // default true to avoid flash
  const [introChecked, setIntroChecked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Check sessionStorage — if user already saw intro this session, skip it
    const alreadySeen = sessionStorage.getItem("nxt-intro-seen");
    if (!alreadySeen) {
      setHasSeenIntro(false); // show intro
    }
    setIntroChecked(true);

    // Load products
    getProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }, []);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem("nxt-intro-seen", "1");
    setHasSeenIntro(true);
  }, []);

  return (
    <>
      {/* Cinematic Intro — only shown once per browser session */}
      {introChecked && !hasSeenIntro && (
        <IntroScreen onComplete={handleIntroComplete} />
      )}

      {/* Main Content */}
      <div
        style={{
          opacity: hasSeenIntro ? 1 : 0,
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
