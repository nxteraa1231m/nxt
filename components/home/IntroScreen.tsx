"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSiteSettings } from "@/lib/firebase/firestore";

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"laser" | "logo" | "tagline" | "exit">("laser");
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
    const t1 = setTimeout(() => setPhase("logo"), 600);
    const t2 = setTimeout(() => setPhase("tagline"), 1800);
    const t3 = setTimeout(() => setPhase("exit"), 3600);
    const t4 = setTimeout(() => onComplete(), 4400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          className="fixed inset-0 bg-[#050505] z-[99999] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] },
          }}
        >
          {/* Volumetric Radial Aura in Background */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <motion.div
              className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-amber-500/10 via-white/5 to-purple-500/10 blur-[140px]"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 0.7, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Laser Horizon Line Animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 0.8], opacity: [0, 1, 0.2] }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Floating Atmospheric Sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/50 rounded-full"
                style={{
                  top: `${(i * 13) % 100}%`,
                  left: `${(i * 19) % 100}%`,
                }}
                animate={{
                  y: [-30, 30, -30],
                  x: [-10, 10, -10],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>

          {/* Central Monolith & 3D Logo Reveal */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-10 px-4">
            {/* 3D Orbit Rings around logo */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ perspective: "1200px" }}
            >
              <motion.div
                className="w-[380px] sm:w-[540px] md:w-[680px] h-[380px] sm:h-[540px] md:h-[680px] rounded-full border border-white/10"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateX: [65, 75, 65],
                  rotateZ: [0, 360],
                }}
                transition={{
                  rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  rotateZ: { duration: 16, repeat: Infinity, ease: "linear" },
                }}
              />
              <motion.div
                className="w-[280px] sm:w-[420px] md:w-[540px] h-[280px] sm:h-[420px] md:h-[540px] rounded-full border border-amber-400/20"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateY: [-60, -70, -60],
                  rotateZ: [360, 0],
                }}
                transition={{
                  rotateY: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  rotateZ: { duration: 12, repeat: Infinity, ease: "linear" },
                }}
              />
            </div>

            {/* 3D Logo Entry */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, z: -400, filter: "blur(25px)" }}
              animate={
                phase !== "laser"
                  ? { opacity: 1, scale: 1, z: 0, filter: "blur(0px)" }
                  : {}
              }
              transition={{
                duration: 1.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-[320px] sm:w-[460px] md:w-[620px] h-[150px] sm:h-[210px] md:h-[270px] flex items-center justify-center"
              style={{ perspective: "1000px" }}
            >
              <motion.div
                className="w-full h-full relative flex items-center justify-center"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  rotateY: [-20, 20, -20],
                  rotateX: [10, -10, 10],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
              >
                {/* 3D Glass Layer Stack */}
                {Array.from({ length: 45 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
                    style={{
                      transform: `translateZ(${-i * 0.08}px)`,
                      backfaceVisibility: "visible",
                      filter:
                        i === 0
                          ? "drop-shadow(0 30px 45px rgba(255,255,255,0.35))"
                          : `brightness(${Math.max(0.1, 1 - (i / 45) * 0.9)})`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/intro.png"
                      alt="NXT 3D Monolith"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/logo.png";
                      }}
                      className="w-full h-full object-contain pointer-events-none select-none"
                    />
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Kinetic Letter-by-Letter Tagline */}
            <div className="h-8 flex items-center justify-center">
              <AnimatePresence>
                {(phase === "tagline" || phase === "exit") && (
                  <motion.div
                    className="flex gap-1.5 items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-400/80 mr-2" />
                    {taglineLetters.map((letter, i) => (
                      <motion.span
                        key={i}
                        className={`text-xs md:text-sm font-extrabold tracking-[0.4em] uppercase ${
                          letter === " "
                            ? "w-3"
                            : "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                        }`}
                        initial={{ opacity: 0, y: 15, rotateX: -90, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                        transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                    <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-400/80 ml-2" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Futuristic Progress Monolith Line */}
            <motion.div
              className="w-48 h-[2px] bg-zinc-900 rounded-full overflow-hidden relative border border-white/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-white to-amber-500 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.2, delay: 0.5, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
