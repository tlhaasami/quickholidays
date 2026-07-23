"use client";

import React from "react";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { VideoText } from "@/components/ui/video-text";
import { FLAG_IMAGES, MARQUEE_CONFIG, HERO_CONFIG } from "@/constants";

export default function Hero() {
  // Multiply the flag images array to create more rows in the columns
  const repeatedFlagImages = Array(MARQUEE_CONFIG.repeats).fill(FLAG_IMAGES).flat();

  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      {/* Premium dark gradient overlays for editorial depth (Fixed Position) */}
      <div className="fixed inset-0 bg-linear-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-10" />

      {/* Viewport-wide 3D Marquee hero section */}
      <section className="relative w-full h-screen flex items-center justify-center z-20 overflow-hidden">
        {/* Background 3D Marquee */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ThreeDMarquee
            images={repeatedFlagImages}
            columns={MARQUEE_CONFIG.columns}
            speedOdd={MARQUEE_CONFIG.speedOdd}
            speedEven={MARQUEE_CONFIG.speedEven}
            gap={MARQUEE_CONFIG.gap}
            hoverTranslateY={MARQUEE_CONFIG.hoverTranslateY}
            size={MARQUEE_CONFIG.size}
            scaleMobile={MARQUEE_CONFIG.scaleMobile}
            scaleTablet={MARQUEE_CONFIG.scaleTablet}
            scaleDesktop={MARQUEE_CONFIG.scaleDesktop}
            className="w-full h-screen rounded-none max-sm:h-screen"
          />
        </div>

        {/* Uniform black fade overlay on the hero section controlled by constants */}
        <div
          className="absolute inset-0 bg-black pointer-events-none z-10"
          style={{ opacity: HERO_CONFIG.fadeOpacity }}
        />

        {/* Centered Video Text animation */}
        <div className="relative z-20 w-full px-6 h-[200px] sm:h-[300px] md:h-[400px] flex items-center justify-center pointer-events-none select-none">
          <VideoText
            src={HERO_CONFIG.videoSrc}
            fontSize={HERO_CONFIG.fontSize}
            fontWeight={HERO_CONFIG.fontWeight}
            fontFamily={HERO_CONFIG.fontFamily}
            className="w-full h-full select-none"
          >
            QUICK HOLIDAYS
          </VideoText>
        </div>
      </section>

      {/* Placeholder sections for the rest of the homepage (needed.md Section 7) */}
      {[
        "7.2 Stat Counters",
        "7.3 Proof Strip",
        "7.4 Accountability Promise",
        "7.5 QuickVisa Assurance Process",
        "7.6 Country Grid",
        "7.7 Reviews",
        "7.8 Consultation Form",
      ].map((label) => (
        <section
          key={label}
          className="relative w-full h-screen flex items-center justify-center border-t border-white/5 z-20"
        >
          <div className="text-center px-4">
            <h2 className="text-4xl font-serif text-primary/80 mb-3 tracking-wide">
              This section is for {label}
            </h2>
          </div>
        </section>
      ))}
    </div>
  );
}
