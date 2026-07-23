"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSiteSettings } from "@/lib/firebase/firestore";

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "tagline" | "exit">("logo");
  const [taglineText, setTaglineText] = useState("DEFINE YOUR STYLE");

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data?.introTagline) {
          setTaglineText(data.introTagline);
        }
      })
      .catch(console.error);
  }, []);

  const taglineLetters = taglineText.split("");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 1100);
    const t2 = setTimeout(() => setPhase("exit"), 2900);
    const t3 = setTimeout(() => onComplete(), 3600);
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
          className="fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Ambient Glowing Orbs Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-white/[0.03] rounded-full blur-[120px]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/[0.04] rounded-full blur-[90px]" />
          </div>

          {/* 3D Animated Concentric Rings */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ perspective: "1000px" }}
          >
            {[320, 480, 640].map((size, i) => (
              <motion.div
                key={size}
                className="absolute rounded-full border border-white/[0.06]"
                style={{ width: size, height: size }}
                animate={{
                  rotateX: [0, 360],
                  rotateY: [0, 360],
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 12 + i * 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Floating Light Dust Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 18 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                style={{
                  top: `${(i * 17) % 100}%`,
                  left: `${(i * 23) % 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.4, 0.8],
                }}
                transition={{
                  duration: 3 + (i % 4),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Main 3D Brand Logo Container */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-[340px] sm:w-[480px] md:w-[640px] h-[160px] sm:h-[220px] md:h-[290px] flex items-center justify-center"
              style={{ perspective: "1000px" }}
            >
              {/* High-Impact 3D Extrusion Engine */}
              <motion.div
                className="w-full h-full relative flex items-center justify-center"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateY: [-30, 30, -30],
                  rotateX: [16, -16, 16],
                  rotateZ: [-2, 2, -2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.8,
                  ease: "easeInOut",
                }}
              >
                {Array.from({ length: 70 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                    style={{
                      transform: `translateZ(${-i * 0.05}px)`,
                      backfaceVisibility: "visible",
                      filter:
                        i === 0
                          ? "drop-shadow(0 25px 35px rgba(255,255,255,0.3))"
                          : `brightness(${Math.max(0.12, 1 - (i / 70) * 0.88)})`,
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

            {/* Holographic Tagline Reveal */}
            <AnimatePresence>
              {phase === "tagline" && (
                <motion.div
                  className="flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {taglineLetters.map((letter, i) => (
                    <motion.span
                      key={i}
                      className={`text-xs md:text-sm font-semibold tracking-[0.4em] uppercase ${
                        letter === " " ? "w-3" : "text-white/80 drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                      }`}
                      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.04, duration: 0.35 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing Shimmer Loading Bar */}
            <motion.div
              className="w-36 h-[2px] bg-white/10 rounded-full overflow-hidden relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-white/40 via-white to-white/40 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.6, delay: 0.4, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
