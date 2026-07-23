"use client";

import { useState, useEffect } from "react";
import { IntroScreen } from "@/components/home/IntroScreen";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import type { Product } from "@/types/product";
import { getProducts } from "@/lib/firebase/firestore";

export default function HomePage() {
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Check if intro has already been seen in this session
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("nxt_intro_seen");
      if (!seen) {
        setHasSeenIntro(false);
      } else {
        setHasSeenIntro(true);
      }
    }

    // Load products
    getProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }, []);

  const handleIntroComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("nxt_intro_seen", "true");
    }
    setHasSeenIntro(true);
  };

  return (
    <>
      {/* Cinematic Intro — plays only ONCE per browser session */}
      {!hasSeenIntro && (
        <IntroScreen onComplete={handleIntroComplete} />
      )}

      {/* Main Content */}
      <div
        style={{
          opacity: hasSeenIntro ? 1 : 0,
          transition: "opacity 0.4s ease",
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
