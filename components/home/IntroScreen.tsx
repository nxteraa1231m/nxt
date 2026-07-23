"use client";

import { useEffect, useState } from "react";
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

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [activeIntroId, setActiveIntroId] = useState<number>(99);

  useEffect(() => {
    const saved = localStorage.getItem("nxt-active-intro");
    if (saved) {
      const parsed = parseInt(saved, 10);
      setActiveIntroId(parsed);
    }
  }, []);

  switch (activeIntroId) {
    case 99: return <IntroArchitecturalCathedral onComplete={onComplete} />;
    case 0: return <IntroWorldClassLuxury onComplete={onComplete} />;
    case 1: return <Intro1_LiquidChrome onComplete={onComplete} />;
    case 2: return <Intro2_BlackMarble onComplete={onComplete} />;
    case 3: return <Intro3_InfiniteMirror onComplete={onComplete} />;
    case 4: return <Intro4_CyberNeon onComplete={onComplete} />;
    case 5: return <Intro5_GoldenDesert onComplete={onComplete} />;
    case 6: return <Intro6_UnderwaterSilk onComplete={onComplete} />;
    case 7: return <Intro7_GlassLabyrinth onComplete={onComplete} />;
    case 8: return <Intro8_VolcanicObsidian onComplete={onComplete} />;
    case 9: return <Intro9_CelestialVoid onComplete={onComplete} />;
    case 10: return <Intro10_LiquidGold onComplete={onComplete} />;
    case 11: return <Intro11_CrystalCave onComplete={onComplete} />;
    case 12: return <Intro12_OrigamiMotion onComplete={onComplete} />;
    case 13: return <Intro13_DiamondFracture onComplete={onComplete} />;
    case 14: return <Intro14_VelvetShadow onComplete={onComplete} />;
    case 15: return <Intro15_MuseumLight onComplete={onComplete} />;
    case 16: return <Intro16_KineticSculpture onComplete={onComplete} />;
    case 17: return <Intro17_IcePalace onComplete={onComplete} />;
    case 18: return <Intro18_SmokeSilk onComplete={onComplete} />;
    case 19: return <Intro19_BrutalistConcrete onComplete={onComplete} />;
    case 20: return <Intro20_HolographicRunway onComplete={onComplete} />;
    default: return <IntroArchitecturalCathedral onComplete={onComplete} />;
  }
}
