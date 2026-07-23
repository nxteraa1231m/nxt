"use client";

import { useEffect, useState } from "react";
import { IntroAppleMinimal } from "@/components/intros/IntroAppleMinimal";
import { IntroFabricCraft } from "@/components/intros/IntroFabricCraft";
import { IntroCyberLuxury } from "@/components/intros/IntroCyberLuxury";
import { IntroAppleKeynote } from "@/components/intros/IntroAppleKeynote";
import { IntroFastStreetwear } from "@/components/intros/IntroFastStreetwear";

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [activeIntroId, setActiveIntroId] = useState<number>(1);

  useEffect(() => {
    const saved = localStorage.getItem("nxt-active-intro");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed >= 1 && parsed <= 5) {
        setActiveIntroId(parsed);
      }
    }
  }, []);

  if (activeIntroId === 1) return <IntroAppleMinimal onComplete={onComplete} />;
  if (activeIntroId === 2) return <IntroFabricCraft onComplete={onComplete} />;
  if (activeIntroId === 3) return <IntroCyberLuxury onComplete={onComplete} />;
  if (activeIntroId === 4) return <IntroAppleKeynote onComplete={onComplete} />;
  if (activeIntroId === 5) return <IntroFastStreetwear onComplete={onComplete} />;

  return <IntroAppleMinimal onComplete={onComplete} />;
}
