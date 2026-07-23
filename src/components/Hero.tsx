"use client";

import React, { useState, useRef } from "react";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { FLAG_IMAGES, MARQUEE_CONFIG, HERO_CONFIG } from "@/constants";

export default function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Multiply the flag images array to create more rows in the columns
  const repeatedFlagImages = Array(MARQUEE_CONFIG.repeats).fill(FLAG_IMAGES).flat();

  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      {/* Premium dark gradient overlays for editorial depth (Fixed Position) */}
      <div className="fixed inset-0 bg-linear-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-10" />

      {/* 1. Hero Section (7.1) - Now 1st Section at the top */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video with Poster state */}
        <div className="absolute inset-0 overflow-hidden">
          {!videoLoaded && (
            <img
              src="/videos/hero-section-bg-first-frame.jpg"
              alt="Hero Background Poster"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}
          <video
            ref={videoRef}
            src="/videos/hero-section-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            onCanPlayThrough={() => {
              setVideoLoaded(true);
              if (videoRef.current) {
                videoRef.current.playbackRate = 0.8;
              }
            }}
            onPlay={() => {
              if (videoRef.current) {
                videoRef.current.playbackRate = 0.8;
              }
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-0 ${videoLoaded ? "opacity-100" : "opacity-0"
              }`}
          />
          {/* Configurable black fade overlay controlled from constants */}
          <div
            className="absolute inset-0 bg-black pointer-events-none z-10"
            style={{ opacity: HERO_CONFIG.fadeOpacity }}
          />
        </div>

        {/* Content Container (Bottom Left Text) */}
        <div className="absolute bottom-8 left-8 sm:left-16 z-20 max-w-4xl text-left select-none pointer-events-none">
          <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-sans font-bold tracking-tighter leading-[0.95] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            <span style={{ color: HERO_CONFIG.quickColor }}>Quick</span>
            <br />
            <span style={{ color: HERO_CONFIG.holidaysColor }}>Holidays</span>
          </h1>
        </div>

        {/* Content Container (Bottom Right Logo) */}
        <div className="absolute bottom-7 right-9 sm:right-16 z-20 select-none pointer-events-none">
          <img
            src="/assets/logos/quick-holidays-logo-search.png"
            alt="Quick Holidays Logo"
            className="h-12 sm:h-16 md:h-20 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          />
        </div>
      </section>

      {/* 2. Stat Counters Section (7.2) - Now 2nd Section */}
      <section className="relative w-full h-screen flex items-center justify-center border-t border-white/5 z-20 bg-black text-white">
        <div className="text-center px-4">
          <h2 className="text-4xl font-serif text-primary/80 mb-3 tracking-wide">
            This section is for 7.2 Stat Counters
          </h2>
        </div>
      </section>

      {/* 3. 3D Marquee Section - Now 3rd Section (No text, no scroll elements) */}
      <section className="relative w-full h-screen flex items-center justify-center z-20 overflow-hidden border-t border-white/5 bg-black">
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
      </section>

      {/* Placeholder sections for the rest of the homepage (needed.md Section 7) */}
      {[
        "7.3 Proof Strip",
        "7.4 Accountability Promise",
        "7.5 QuickVisa Assurance Process",
        "7.6 Country Grid",
        "7.7 Reviews",
        "7.8 Consultation Form",
      ].map((label) => (
        <section
          key={label}
          className="relative w-full h-screen flex items-center justify-center border-t border-white/5 z-20 bg-black text-white"
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
