"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSiteSettings } from "@/lib/firebase/firestore";

// ─── The one and only NXT Intro ─────────────────────────────────
// Phase 1 (0-2s)   : Pure black + floating particle stars
// Phase 2 (2-4.5s) : NXT logo + brand name appears center
// Phase 3 (4.5-7s) : Admin uploaded intro images slide in as blurred background
// Phase 4 (7s)     : Fade out → site loads
// ─────────────────────────────────────────────────────────────────

type Phase = 1 | 2 | 3 | 4;

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  top: `${(i * 19 + 7) % 93 + 3}%`,
  left: `${(i * 31 + 11) % 91 + 3}%`,
  size: i % 5 === 0 ? 3 : i % 3 === 0 ? 2.5 : 1.8,
  duration: 2 + (i % 4) * 0.4,
  delay: (i % 7) * 0.1,
}));

export function NXTIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>(1);
  const [introImages, setIntroImages] = useState<string[]>([]);
  const [imgIndex, setImgIndex] = useState(0);

  // Fetch admin-uploaded intro background images
  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        const imgs = data?.introImages?.length
          ? data.introImages
          : data?.heroImagesDark?.length
          ? data.heroImagesDark
          : [];
        setIntroImages(imgs);
      })
      .catch(() => {});
  }, []);

  // Phase timeline
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 2000);
    const t2 = setTimeout(() => setPhase(3), 4500);
    const t3 = setTimeout(() => setPhase(4), 7000);
    const t4 = setTimeout(() => onComplete(), 7800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  // Image slideshow in phase 3
  useEffect(() => {
    if (phase === 3 && introImages.length > 1) {
      const iv = setInterval(() => setImgIndex((p) => (p + 1) % introImages.length), 1400);
      return () => clearInterval(iv);
    }
  }, [phase, introImages.length]);

  const currentImg = introImages[imgIndex] || null;

  return (
    <AnimatePresence>
      {phase !== 4 && (
        <motion.div
          key="nxt-intro"
          className="fixed inset-0 z-[99999] bg-black overflow-hidden select-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] } }}
        >
          {/* ── PARTICLES (always visible in phase 1 & 2) ── */}
          {(phase === 1 || phase === 2) && (
            <div className="absolute inset-0 pointer-events-none">
              {PARTICLES.map((p) => (
                <motion.span
                  key={p.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    top: p.top,
                    left: p.left,
                    width: p.size,
                    height: p.size,
                    boxShadow: `0 0 ${p.size * 4}px rgba(255,255,255,0.8)`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.25, 0.9, 0.25],
                    scale: [0.7, 1.4, 0.7],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* ── PHASE 3: Admin intro images blurred background ── */}
          <AnimatePresence mode="wait">
            {phase === 3 && currentImg && (
              <motion.div
                key={currentImg}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 0.5, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImg}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: "blur(12px) saturate(1.2)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CENTER CONTENT: Logo + Brand Name (phases 2 & 3) ── */}
          <AnimatePresence>
            {(phase === 2 || phase === 3) && (
              <motion.div
                key="brand"
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 pointer-events-none z-10"
                initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Logo Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/intro.png"
                  alt="NXT"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }}
                  className="w-48 sm:w-72 md:w-96 object-contain"
                  style={{ filter: "drop-shadow(0 0 40px rgba(255,255,255,0.85)) invert(1)" }}
                />

                {/* Brand name text */}
                <motion.p
                  className="text-white/40 text-[11px] font-bold tracking-[0.4em] uppercase"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                >
                  Premium Fashion Brand
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── TOP BRAND BADGE ── */}
          <motion.div
            className="absolute top-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 pointer-events-none"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="NXT"
              className="h-6 object-contain"
              style={{ filter: "invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.6))" }}
            />
            <span className="text-white text-base font-black tracking-[0.35em] uppercase"
              style={{ textShadow: "0 0 20px rgba(255,255,255,0.6)" }}>
              NXT
            </span>
          </motion.div>

          {/* ── BOTTOM THIN PROGRESS LINE ── */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10">
            <motion.div
              className="h-full bg-white/50"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 7, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
