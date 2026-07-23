"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Check, Sparkles, ArrowLeft, Zap, Castle, Award } from "lucide-react";
import Link from "next/link";
import { IntroWorldClassLuxury } from "@/components/intros/IntroWorldClassLuxury";
import { IntroArchitecturalCathedral } from "@/components/intros/IntroArchitecturalCathedral";

const masterPromptsList = [
  {
    id: 99,
    title: "★ Idea 2: $5M Architectural Black Crystal Cathedral (15s)",
    style: "14-Scene PBR Black Glass Cathedral + Water Mirror + 20m Circular Ring + Cubes + Fashion Model",
    duration: "15s",
    description: "Futuristic cathedral built from black glass, mirror water, circular ring, floating cubes, macro fabric & fashion model in concrete architecture.",
  },
  {
    id: 0,
    title: "★ Idea 1: 12s World-Class Master Luxury Intro",
    style: "9-Scene PBR Fluid Chrome + Black Marble + Reverse Gravity Particles + Streetwear Model",
    duration: "12s",
    description: "Deep bass void, black marble floor, liquid chrome droplet, reverse gravity particle explosion, N-X-T logo assembly & model reveal.",
  },
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
              NXT Cinema Intro Suite <Castle size={22} className="text-amber-400" />
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Featured $5M Architectural Black Crystal Cathedral (15s) & World-Class Master Intro (12s)
            </p>
          </div>
        </div>

        <span className="text-xs bg-zinc-900 border border-zinc-800 text-amber-400 font-extrabold uppercase px-3.5 py-1.5 rounded-full tracking-wider flex items-center gap-1.5">
          <Zap size={14} /> 2 Master Concepts Ready
        </span>
      </div>

      {/* Grid of Master Prompts */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {masterPromptsList.map((opt) => {
          const isActiveOnSite = activeSiteIntroId === opt.id;

          return (
            <motion.div
              key={opt.id}
              whileHover={{ y: -4 }}
              className={`bg-zinc-900/60 border rounded-2xl p-6 sm:p-8 flex flex-col justify-between backdrop-blur-md transition-all shadow-xl ${
                isActiveOnSite ? "border-amber-500 bg-amber-500/10 shadow-amber-500/20" : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-widest bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full uppercase">
                    {opt.duration}
                  </span>

                  {isActiveOnSite && (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold bg-amber-500 text-zinc-950 px-3 py-1 rounded-full uppercase tracking-wider">
                      <Check size={12} /> Active On Main Site
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-white leading-snug">{opt.title}</h2>
                <p className="text-xs text-amber-400 font-semibold">{opt.style}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{opt.description}</p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-800/60">
                <button
                  onClick={() => playIntro(opt.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-black font-extrabold text-xs uppercase px-5 py-3 rounded-xl hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
                >
                  <Play size={14} className="fill-black" /> Preview Concept
                </button>

                <button
                  onClick={() => setAsActiveSiteIntro(opt.id)}
                  title="Set as active main site intro"
                  className={`p-3 rounded-xl border transition-all ${
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
