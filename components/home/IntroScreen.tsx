"use client";

import { useEffect, useState } from "react";
import { IntroWorldClassLuxury } from "@/components/intros/IntroWorldClassLuxury";

export function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [enabled, setEnabled] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("nxt-intro-enabled");
    if (saved === "false") {
      setEnabled(false);
      onComplete();
    }
  }, [onComplete]);

  if (!enabled) return null;

  return <IntroWorldClassLuxury onComplete={onComplete} />;
}
