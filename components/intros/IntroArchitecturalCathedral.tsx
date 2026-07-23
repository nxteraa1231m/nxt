"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function IntroArchitecturalCathedral({ onComplete }: { onComplete: () => void }) {
  const [scene, setScene] = useState<number>(1);

  // Audio Synthesizer for Deep Bass & Glass Echo
  useEffect(() => {
    const playGlassResonance = () => {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(28, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 6.5);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + 5);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 10);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 10);
      } catch {}
    };

    playGlassResonance();
  }, []);

  // 15-Second Master Architectural Cathedral Timeline across 14 Scenes
  useEffect(() => {
    const t1 = setTimeout(() => setScene(2), 1000);   // 1.0s: Black Glass Corridor
    const t2 = setTimeout(() => setScene(3), 2500);   // 2.5s: Floating Glass Panels
    const t3 = setTimeout(() => setScene(4), 4000);   // 4.0s: Gold Reflections & DOF
    const t4 = setTimeout(() => setScene(5), 5500);   // 5.5s: Mirror Water Floor
    const t5 = setTimeout(() => setScene(6), 6500);   // 6.5s: 20-Meter Circular Glass Ring
    const t6 = setTimeout(() => setScene(7), 7500);   // 7.5s: Floating Glass Cubes
    const t7 = setTimeout(() => setScene(8), 8500);   // 8.5s: Cubes Magnetic Assembly
    const t8 = setTimeout(() => setScene(9), 9500);   // 9.5s: N X T Cubes Formation
    const t9 = setTimeout(() => setScene(10), 10500); // 10.5s: Solid Crystal Logo
    const t10 = setTimeout(() => setScene(11), 11500); // 11.5s: Floating Black Fabric & Stitching
    const t11 = setTimeout(() => setScene(12), 12500); // 12.5s: Architectural Room & Model
    const t12 = setTimeout(() => setScene(13), 13500); // 13.5s: God Rays Sunlight
    const t13 = setTimeout(() => setScene(14), 14200); // 14.2s: Scale to Navbar & Exit
    const t14 = setTimeout(() => onComplete(), 15200); // 15.2s: Complete

    return () => {
      [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14].forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {scene !== 14 ? (
        <motion.div
          className="fixed inset-0 bg-[#010102] z-[99999] flex flex-col items-center justify-center overflow-hidden select-none font-sans"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 1.1, ease: [0.77, 0, 0.175, 1] },
          }}
        >
          {/* SCENE 01: Complete Darkness & Soft Volumetric Dust */}
          {scene === 1 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="w-[700px] h-[700px] rounded-full bg-white/[0.015] blur-[170px]"
                animate={{ opacity: [0.1, 0.25, 0.1], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          )}

          {/* SCENE 02 & 03: Black Glass Corridor & Floating Glass Panels */}
          {(scene === 2 || scene === 3 || scene === 4) && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
              className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#010102] to-black flex items-center justify-center"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-25">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotateY: [0, 90, 180, 270, 360] }}
                    transition={{ duration: 10, delay: i * 0.2, repeat: Infinity, ease: "linear" }}
                    className="w-44 h-64 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                  />
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute text-[10px] font-mono tracking-[0.9em] text-white/80 uppercase"
              >
                BLACK GLASS CATHEDRAL
              </motion.p>
            </motion.div>
          )}

          {/* SCENE 05 & 06: Reflective Mirror Water & Circular Glass Ring (20m) */}
          {(scene === 5 || scene === 6) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <motion.div
                className="w-[380px] sm:w-[540px] md:w-[680px] h-[380px] sm:h-[540px] md:h-[680px] rounded-full border-2 border-amber-400/40 shadow-[0_0_50px_rgba(245,158,11,0.2)]"
                animate={{ rotate: [0, 360], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="absolute text-xs font-mono tracking-[0.6em] text-amber-400 uppercase">
                CIRCULAR GLASS RING
              </span>
            </motion.div>
          )}

          {/* SCENE 07, 08 & 09: Floating Glass Cubes & Magnetic NXT Assembly */}
          {(scene === 7 || scene === 8 || scene === 9) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-20 flex flex-col items-center justify-center gap-6"
            >
              <div className="relative w-[320px] sm:w-[500px] h-[160px] sm:h-[230px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/intro.png"
                  alt="NXT Crystal Logo"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_45px_white] invert dark:invert-0"
                />
              </div>
              <p className="text-xs md:text-sm font-black tracking-[0.6em] uppercase text-white drop-shadow-[0_0_18px_white]">
                CRYSTAL CUBE ASSEMBLY
              </p>
            </motion.div>
          )}

          {/* SCENE 10 & 11: Solid Crystal Logo & Floating Black Cotton Fabric */}
          {(scene === 10 || scene === 11) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 bg-zinc-950 flex items-center justify-center"
            >
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #444 0, #444 1px, transparent 0, transparent 50%)`,
                  backgroundSize: "8px 8px",
                }}
              />
              <span className="text-xs font-mono tracking-[0.7em] text-zinc-200 uppercase z-10">
                COTTON FABRIC & SILHOUETTE
              </span>
            </motion.div>
          )}

          {/* SCENE 12 & 13: Minimalist Architectural Room, Model & God Rays */}
          {(scene === 12 || scene === 13) && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.8, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 z-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/banner.png"
                alt="NXT Architecture & Model"
                className="w-full h-full object-cover object-center brightness-90 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#010102] via-transparent to-[#010102]" />
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
