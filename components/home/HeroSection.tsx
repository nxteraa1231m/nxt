"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeProvider";
import { getSiteSettings, type SiteSettings } from "@/lib/firebase/firestore";

export function HeroSection() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(console.error);
  }, []);

  // Compute active media list based on current theme (light / dark)
  const isDark = theme === "dark";
  const mediaType = settings?.heroMediaType || "image";

  const videoUrl = isDark
    ? settings?.heroVideoUrlDark || settings?.heroVideoUrlLight
    : settings?.heroVideoUrlLight || settings?.heroVideoUrlDark;

  const imageList = useMemo(() => {
    return isDark
      ? settings?.heroImagesDark?.length
        ? settings.heroImagesDark
        : ["/banner.png"]
      : settings?.heroImagesLight?.length
      ? settings.heroImagesLight
      : ["/banner_light.png"];
  }, [isDark, settings?.heroImagesDark, settings?.heroImagesLight]);

  // Auto-slideshow for hero images if multiple images exist
  useEffect(() => {
    if (mediaType === "image" && imageList.length > 1) {
      const interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % imageList.length);
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [mediaType, imageList.length]);

  const currentImage = imageList[activeImageIndex % imageList.length] || (isDark ? "/banner.png" : "/banner_light.png");

  const handleScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white dark:bg-black transition-colors duration-500">
      {/* Background Media Container */}
      <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-black transition-colors duration-500">
        {mediaType === "video" && videoUrl ? (
          <video
            key={videoUrl}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center rounded-none scale-100"
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={currentImage}
              alt="NXT Hero — Premium Fashion"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover object-center rounded-none scale-100"
            />
          </AnimatePresence>
        )}

        {/* Full-bleed gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 dark:from-black/30 dark:via-transparent dark:to-black/60 pointer-events-none" />
      </div>

      {/* Sleek Minimal Subtitle */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 z-10 text-center text-black dark:text-white pointer-events-none">
        <motion.p
          className="text-xs md:text-sm font-light tracking-[0.5em] uppercase text-black/60 dark:text-white/60"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {settings?.heroTagline || "next is yours"}
        </motion.p>
      </div>

      {/* Center CTA Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10 mt-64">
        <motion.button
          onClick={handleScroll}
          className="inline-flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-2xl hover:opacity-90 dark:hover:bg-gray-100 transition-all duration-300 group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {settings?.heroButtonText || "Shop Now"}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-black/40 dark:text-white/40 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-black/60 dark:text-white/60">Scroll</span>
        <motion.div
          className="w-[1px] h-8 bg-black/40 dark:bg-white/40"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </motion.div>
    </section>
  );
}
