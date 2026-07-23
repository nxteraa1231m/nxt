"use client";

import { motion } from "framer-motion";

interface Logo3DProps {
  className?: string;
  layers?: number;
  size?: number;
}

export function Logo3D({ className, layers = 15, size = 220 }: Logo3DProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        perspective: "1200px",
      }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: [0, 360],
          rotateX: [12, 12], // Keep tilted slightly forward to show 3D depth clearly
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
      >
        {Array.from({ length: layers }).map((_, i) => {
          const zOffset = -i * 0.12; // Ultra tight spacing between layers for a solid 3D extrusion look
          return (
            <div
              key={i}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              style={{
                transform: `translateZ(${zOffset}px)`,
                backfaceVisibility: "visible",
                // Simulate depth shading/shadows: deeper layers are progressively darker
                filter: i > 0 ? `brightness(${Math.max(0.25, 1 - (i / layers) * 0.75)})` : "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="NXT 3D Extrusion Layer"
                className="w-full h-full object-contain pointer-events-none select-none"
                style={{
                  // Prevent image color wash on dark/light transitions
                  filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                }}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
