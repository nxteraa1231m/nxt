"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Check, Sparkles, ArrowLeft, Zap, Award, Castle } from "lucide-react";
import Link from "next/link";
import { IntroWorldClassLuxury } from "@/components/intros/IntroWorldClassLuxury";
import { IntroArchitecturalCathedral } from "@/components/intros/IntroArchitecturalCathedral";
import {
  Intro1_LiquidChrome,
  Intro2_BlackMarble,
  Intro3_InfiniteMirror,
  Intro4_CyberNeon,
  Intro5_GoldenDesert,
  Intro6_UnderwaterSilk,
  Intro7_GlassLabyrinth,
  Intro8_VolcanicObsidian,
  Intro9_CelestialVoid,
  Intro10_LiquidGold,
  Intro11_CrystalCave,
  Intro12_OrigamiMotion,
  Intro13_DiamondFracture,
  Intro14_VelvetShadow,
  Intro15_MuseumLight,
  Intro16_KineticSculpture,
  Intro17_IcePalace,
  Intro18_SmokeSilk,
  Intro19_BrutalistConcrete,
  Intro20_HolographicRunway,
} from "@/components/intros/MasterIntros";

const masterPromptsList = [
  { id: 99, title: "★ Idea 2: $5M Architectural Black Crystal Cathedral (15s)", style: "14 Scenes: Black Glass Cathedral + Water Mirror + 20m Ring + Cubes + Model", duration: "15s" },
  { id: 0, title: "★ Idea 1: 12s World-Class Master Luxury Intro", style: "9-Scene PBR Fluid + Black Marble + Reverse Gravity + Model Architecture", duration: "12s" },
  { id: 1, title: "1. Liquid Chrome Genesis", style: "Houdini Fluid Sim + Metaball Morphing + Chrome PBR", duration: "10s" },
  { id: 2, title: "2. Black Marble Temple", style: "Voronoi Fracture + Gold Vein Shader + Chiseling", duration: "10s" },
  { id: 3, title: "3. Infinite Mirror Room", style: "Recursive Ray-traced Mirror + Staggered Rotation", duration: "10s" },
  { id: 4, title: "4. Cyber Luxury Neon", style: "Volumetric Rain + Holographic Grid + Leather Sim", duration: "10s" },
  { id: 5, title: "5. Golden Desert Mirage", style: "Sand Particle Sim + Heat Refraction + Silk Sim", duration: "10s" },
  { id: 6, title: "6. Underwater Silk", style: "Underwater Caustics + Fluid Cloth + Bubble Particle", duration: "10s" },
  { id: 7, title: "7. Glass Labyrinth", style: "Procedural Glass Panel + Emissive Edge + Shatter", duration: "10s" },
  { id: 8, title: "8. Volcanic Obsidian", style: "Molten Lava Sim + Thermal Cooling Shader + Embers", duration: "10s" },
  { id: 9, title: "9. Celestial Void", style: "Nebula Shader + Gravitational Particle Assembly", duration: "10s" },
  { id: 10, title: "10. Liquid Gold Pour", style: "High-Res Gold Pour + Fluid-to-Solid Morphing", duration: "10s" },
  { id: 11, title: "11. Crystal Cave", style: "L-System Crystal Growth + Subsurface Scattering", duration: "10s" },
  { id: 12, title: "12. Origami Motion", style: "Procedural Fold Rigging + Matte Paper PBR", duration: "10s" },
  { id: 13, title: "13. Diamond Fracture", style: "Voronoi Fracture + Diamond Dispersion Caustics", duration: "10s" },
  { id: 14, title: "14. Velvet Shadow", style: "High-Fidelity Velvet Cloth + Volumetric Light Reveal", duration: "10s" },
  { id: 15, title: "15. Museum of Light", style: "Spotlight Rig + Light Particle Assembly + GI Bake", duration: "10s" },
  { id: 16, title: "16. Kinetic Sculpture Hall", style: "Mechanical Gear Sim + Wave Rotation Rig", duration: "10s" },
  { id: 17, title: "17. Ice Palace Minimal", style: "Snow Accumulation + Ice PBR + Fog Dissolve", duration: "10s" },
  { id: 18, title: "18. Smoke & Silk", style: "Fluid Smoke Solver + Backlight Rim + Dissipation", duration: "10s" },
  { id: 19, title: "19. Brutalist Concrete Reveal", style: "CNC Carving Displacement + Dust Fall Particle", duration: "10s" },
  { id: 20, title: "20. Holographic Runway", style: "Scanline Shader + Hologram Character + Particle Dissolve", duration: "10s" },
];

export default function IntroLabPage() {
  const [selectedIntroId, setSelectedIntroId] = useState<number | null>(null);
  const [activeSiteIntroId, setActiveSiteIntroId] = useState<number>(99);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nxt-active-intro");
    if (saved) {
      setActiveSiteIntroId(parseInt(saved, 10));
    }
  }, []);

  const playIntro = (id: number) => {
    setCompleted(false);
    setSelectedIntroId(id);
  };

  const setAsActiveSiteIntro = (id: number) => {
    setActiveSiteIntroId(id);
    localStorage.setItem("nxt-active-intro", id.toString());
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 sm:p-12 font-sans selection:bg-amber-500 selection:text-black">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-zinc-800/80 pb-6 mb-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              NXT Master Cinema Suite <Castle size={22} className="text-amber-400" />
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              15s Architectural Black Crystal Cathedral + 12s Master + 20 8K 60FPS Prompts
            </p>
          </div>
        </div>

        <span className="text-xs bg-zinc-900 border border-zinc-800 text-amber-400 font-extrabold uppercase px-3.5 py-1.5 rounded-full tracking-wider flex items-center gap-1.5">
          <Zap size={14} /> 22 Concepts Live
        </span>
      </div>

      {/* Grid of Master Prompts */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {masterPromptsList.map((opt) => {
          const isActiveOnSite = activeSiteIntroId === opt.id;
          const isFeatured = opt.id === 99 || opt.id === 0;

          return (
            <motion.div
              key={opt.id}
              whileHover={{ y: -4 }}
              className={`bg-zinc-900/60 border rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md transition-all shadow-xl ${
                isFeatured ? "border-amber-500 bg-amber-500/10 shadow-amber-500/20 col-span-1 md:col-span-2 lg:col-span-3" : isActiveOnSite ? "border-amber-500/80 bg-zinc-900/90 shadow-amber-500/10" : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-widest bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full uppercase">
                    {opt.duration}
                  </span>

                  {isActiveOnSite && (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold bg-amber-500 text-zinc-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      <Check size={12} /> Active On Site
                    </span>
                  )}
                </div>

                <h2 className="text-base sm:text-lg font-bold text-white leading-snug">{opt.title}</h2>
                <p className="text-xs text-amber-400 font-semibold leading-relaxed">{opt.style}</p>
              </div>

              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-zinc-800/60">
                <button
                  onClick={() => playIntro(opt.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-black font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
                >
                  <Play size={14} className="fill-black" /> Preview Concept
                </button>

                <button
                  onClick={() => setAsActiveSiteIntro(opt.id)}
                  title="Set as active main site intro"
                  className={`p-2.5 rounded-xl border transition-all ${
                    isActiveOnSite
                      ? "bg-amber-500 text-black border-amber-400"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <Check size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Fullscreen Intro Modal / Preview Player */}
      <AnimatePresence>
        {selectedIntroId !== null && !completed && (
          <div className="fixed inset-0 z-[999999]">
            {selectedIntroId === 99 && <IntroArchitecturalCathedral onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 0 && <IntroWorldClassLuxury onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 1 && <Intro1_LiquidChrome onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 2 && <Intro2_BlackMarble onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 3 && <Intro3_InfiniteMirror onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 4 && <Intro4_CyberNeon onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 5 && <Intro5_GoldenDesert onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 6 && <Intro6_UnderwaterSilk onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 7 && <Intro7_GlassLabyrinth onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 8 && <Intro8_VolcanicObsidian onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 9 && <Intro9_CelestialVoid onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 10 && <Intro10_LiquidGold onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 11 && <Intro11_CrystalCave onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 12 && <Intro12_OrigamiMotion onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 13 && <Intro13_DiamondFracture onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 14 && <Intro14_VelvetShadow onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 15 && <Intro15_MuseumLight onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 16 && <Intro16_KineticSculpture onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 17 && <Intro17_IcePalace onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 18 && <Intro18_SmokeSilk onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 19 && <Intro19_BrutalistConcrete onComplete={() => setCompleted(true)} />}
            {selectedIntroId === 20 && <Intro20_HolographicRunway onComplete={() => setCompleted(true)} />}

            <button
              onClick={() => setCompleted(true)}
              className="fixed top-6 right-6 z-[9999999] bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all"
            >
              Skip Preview
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
