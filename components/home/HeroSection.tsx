"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/features/theme/ThemeProvider";

export function HeroSection() {
  const { theme } = useTheme();
  const bannerSrc = theme === "dark" ? "/banner.png" : "/banner_light.png";

  const handleScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white dark:bg-black transition-colors duration-500">
      {/* Background image — full bleed, edge to edge without borders */}
      <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-black transition-colors duration-500">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerSrc}
          alt="NXT Hero — Premium Fashion"
          className="w-full h-full object-cover object-center rounded-none scale-100 transition-all duration-700"
        />
        {/* Full-bleed gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 dark:from-black/30 dark:via-transparent dark:to-black/60 pointer-events-none" />
      </div>

      {/* Sleek Minimal Subtitle — positioned further down to avoid header overlap */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 z-10 text-center text-black dark:text-white pointer-events-none">
        <motion.p
          className="text-xs md:text-sm font-light tracking-[0.5em] uppercase text-black/50 dark:text-white/50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          next is yours
        </motion.p>
      </div>

      {/* Center CTA Button — pushed down to mt-64 to clear the central logo graphics */}
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
          Shop Now
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </motion.button>
      </div>

      {/* Scroll indicator / CTA */}
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
