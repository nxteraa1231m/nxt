"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TAGLINE_LETTERS = "DEFINE YOUR STYLE".split("");

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "tagline" | "exit">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 1200);
    const t2 = setTimeout(() => setPhase("exit"), 3000);
    const t3 = setTimeout(() => onComplete(), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center overflow-hidden"
          exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* 3D Animated Rings */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            {[350, 500, 650].map((size, i) => (
              <div
                key={size}
                className="absolute rounded-full border border-white/5"
                style={{
                  width: size,
                  height: size,
                  animation: `ring3D${i + 1} ${6 + i * 2}s linear infinite ${i % 2 ? "reverse" : ""}`,
                }}
              />
            ))}
          </div>

          {/* Brand Name */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-[320px] sm:w-[440px] md:w-[560px] h-[150px] sm:h-[200px] md:h-[240px] flex items-center justify-center"
              style={{ perspective: "1200px" }}
            >
              {/* 3D Stacked Extrusion Container */}
              <motion.div
                className="w-full h-full relative flex items-center justify-center"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateY: [-18, 18, -18],
                  rotateX: [12, -8, 12],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
              >
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                    style={{
                      transform: `translateZ(${-i * 0.35}px)`,
                      backfaceVisibility: "visible",
                      filter: i > 0 ? `brightness(${Math.max(0.2, 1 - (i / 30) * 0.85)})` : "none",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/intro.png"
                      alt="NXT 3D Brand Intro"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/logo.png";
                      }}
                      className="w-full h-full object-contain pointer-events-none select-none"
                    />
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Tagline — letter by letter */}
            <AnimatePresence>
              {phase === "tagline" && (
                <motion.div
                  className="flex gap-0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {TAGLINE_LETTERS.map((letter, i) => (
                    <motion.span
                      key={i}
                      className={`text-xs md:text-sm font-medium tracking-[0.3em] ${
                        letter === " " ? "w-3" : "text-white/70"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Bar */}
            <motion.div
              className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-white/70 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.8, delay: 0.5, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
