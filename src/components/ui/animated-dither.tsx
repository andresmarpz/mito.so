"use client";

import { useEffect, useRef } from "react";

export function AnimatedDither() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-background">
      {/* Layer 1: Deep slow movement */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay animate-pulse-slow">
        <svg className="w-full h-full">
          <filter id="noise-1">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.6"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise-1)" />
        </svg>
      </div>

      {/* Layer 2: Mid-range movement */}
      <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-[0.04] mix-blend-overlay animate-drift-slow">
        <svg className="w-full h-full">
          <filter id="noise-2">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise-2)" />
        </svg>
      </div>

      {/* Layer 3: Fine grain, faster movement */}
      <div className="absolute inset-[-50%] w-[200%] h-[200%] opacity-[0.05] mix-blend-overlay animate-drift-medium">
        <svg className="w-full h-full">
          <filter id="noise-3">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.2"
              numOctaves="2"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise-3)" />
        </svg>
      </div>
      
      {/* Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
    </div>
  );
}
