"use client";

import { useEffect, useState } from "react";
import { IntroWorldClassLuxury } from "@/components/intros/IntroWorldClassLuxury";
import { IntroArchitecturalCathedral } from "@/components/intros/IntroArchitecturalCathedral";

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [activeIntroId, setActiveIntroId] = useState<number>(99);

  useEffect(() => {
    const saved = localStorage.getItem("nxt-active-intro");
    if (saved) {
      const parsed = parseInt(saved, 10);
      setActiveIntroId(parsed);
    }
  }, []);

  if (activeIntroId === 0) {
    return <IntroWorldClassLuxury onComplete={onComplete} />;
  }

  return <IntroArchitecturalCathedral onComplete={onComplete} />;
}
