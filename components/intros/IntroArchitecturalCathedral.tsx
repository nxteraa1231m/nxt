"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSiteSettings } from "@/lib/firebase/firestore";

export function IntroArchitecturalCathedral({ onComplete }: { onComplete: () => void }) {
  const [scene, setScene] = useState<number>(1);
  const [introImages, setIntroImages] = useState<string[]>(["/banner.png"]);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  // Fetch Dedicated Admin Intro Images from Firestore
  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data?.introImages?.length) {
          setIntroImages(data.introImages);
        } else if (data?.heroImagesDark?.length) {
          setIntroImages(data.heroImagesDark);
        }
      })
      .catch(console.error);
  }, []);

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
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 5.5);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 4);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 8);
      } catch {}
    };

    playGlassResonance();
  }, []);

  // Storyboard Scene Transitions
  useEffect(() => {
    const t1 = setTimeout(() => setScene(2), 1000);   // 1.0s: Black Glass Environment
    const t2 = setTimeout(() => setScene(3), 3500);   // 3.5s: Direct NXT Logo Reveal
    const t3 = setTimeout(() => setScene(4), 6000);   // 6.0s: Floating Black Fabric Texture
    const t4 = setTimeout(() => setScene(5), 8500);   // 8.5s: Dedicated Intro Photos Reveal
    const t5 = setTimeout(() => setScene(6), 11200);  // 11.2s: Scale & Transition to Header
    const t6 = setTimeout(() => onComplete(), 12200); // 12.2s: Complete

    return () => {
      [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
    };
  }, [onComplete]);

  // Slideshow for Dedicated Intro Background Images
  useEffect(() => {
    if (scene === 5 && introImages.length > 1) {
      const interval = setInterval(() => {
        setActiveImgIndex((prev) => (prev + 1) % introImages.length);
      }, 1300);
      return () => clearInterval(interval);
    }
  }, [scene, introImages.length]);

  const currentIntroImg = introImages[activeImgIndex % introImages.length] || "/banner.png";

  return (
    <AnimatePresence>
      {scene !== 6 ? (
        <motion.div
          className="fixed inset-0 bg-[#010102] z-[99999] flex flex-col items-center justify-center overflow-hidden select-none font-sans"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 1.1, ease: [0.77, 0, 0.175, 1] },
          }}
        >
          {/* SCENE 01: Complete Darkness & Soft Volumetric Lighting */}
          {scene === 1 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="w-[750px] h-[750px] rounded-full bg-white/[0.02] blur-[180px]"
                animate={{ opacity: [0.1, 0.35, 0.1], scale: [0.9, 1.15, 0.9] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          )}

          {/* SCENE 02: Pure Black Glass Ambient Reflection */}
          {scene === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4 }}
              className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#010102] to-black flex items-center justify-center"
            >
              <div className="w-[600px] h-[600px] rounded-full bg-amber-500/[0.03] blur-[150px] pointer-events-none" />
            </motion.div>
          )}

          {/* SCENE 03: DIRECT NXT BRAND LOGO REVEAL */}
          {scene === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-20 flex flex-col items-center justify-center gap-6"
            >
              <motion.div
                animate={{ rotateY: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[320px] sm:w-[500px] h-[160px] sm:h-[230px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/intro.png"
                  alt="NXT Brand Logo"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                  className="w-full h-full object-contain filter drop-shadow-[0_0_45px_white] invert dark:invert-0"
                />
              </motion.div>
            </motion.div>
          )}

          {/* SCENE 04: Floating Black Premium Cotton Fabric */}
          {scene === 4 && (
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
            </motion.div>
          )}

          {/* SCENE 05: DEDICATED INTRO PHOTOS BACKGROUND WITH FROSTED GLASS BLUR */}
          {scene === 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 1.15, filter: "blur(20px)" }}
              animate={{ opacity: 0.8, scale: 1, filter: "blur(3px)" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-0"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIntroImg}
                  src={currentIntroImg}
                  alt="NXT Dedicated Intro Photo"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.5 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full object-cover object-center brightness-90 contrast-125"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#010102] via-transparent to-[#010102]" />
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
