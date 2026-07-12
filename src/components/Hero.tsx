"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { heroBg, STATS } from "@/constants/data";

function Counter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const numericVal = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    let startTimestamp: number | null = null;
    const duration = 1800; // 1.8 seconds count-up duration

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericVal));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [numericVal]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const stored = localStorage.getItem("quick_holidays_bg_hero");
    if (stored) {
      setCustomBg(stored);
    }
  }, []);

  return (
    <section className="relative w-full bg-brand-cream min-h-[90vh] flex items-center overflow-visible">
      {/* Background Image Spread Across the Complete Section */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden">
        {customBg ? (
          <img
            src={customBg}
            alt="Schengen Visa Background"
            className={`w-full h-full object-cover object-right sm:object-center transition-all duration-[1200ms] ease-out ${
              bgLoaded ? "opacity-30 sm:opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-md"
            }`}
            onLoad={() => setBgLoaded(true)}
          />
        ) : (
          <Image
            src={heroBg}
            alt="Schengen Visa Background"
            fill
            sizes="100vw"
            className={`object-cover object-right sm:object-center transition-all duration-[1200ms] ease-out ${
              bgLoaded ? "opacity-30 sm:opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-md"
            }`}
            onLoad={() => setBgLoaded(true)}
            priority
          />
        )}
        {/* Readable text background overlay (stronger on mobile, fading to transparent on the right) */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/90 via-brand-cream/75 to-transparent sm:bg-gradient-to-r sm:from-brand-cream/95 sm:via-brand-cream/75 sm:to-transparent pointer-events-none z-10" />
        {/* Soft bottom fade-to-cream gradient to blend image seamlessly into the cream background below */}
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-linear-to-t from-brand-cream via-brand-cream/80 to-transparent pointer-events-none z-10" />
      </div>

      {/* Content Container overlayed on background */}
      <div className="relative z-20 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-20 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text Content (Spans 6 columns) */}
          <div className="lg:col-span-6 text-left z-10">
            <h1 className={`font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-black tracking-tight text-brand-navy leading-[1.05] mb-6 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              Schengen Visa
              <br />
              Specialist
            </h1>
            <p className={`text-base sm:text-lg font-bold sm:font-normal text-slate-900 sm:text-slate-700 leading-relaxed max-w-lg mb-8 transition-all duration-[1200ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              We simplify the Schengen visa process for UK residents through expert guidance,
              meticulous application preparation, and personalized support making every journey to
              Europe seamless, confident, and stress-free.
            </p>
          </div>

          {/* Right Column: Empty on Desktop to show the background image Basilica/sunset */}
          <div className="hidden lg:block lg:col-span-6" />

        </div>
      </div>

      {/* Floating Statistics Banner (Shifted downward to sit 30% on image and 70% below, overflow-visible) */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 translate-y-[65%] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 transition-all duration-[1200ms] delay-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLoaded ? "opacity-100 translate-y-[65%]" : "opacity-0 translate-y-[80%]"}`}>
        <div className="bg-brand-gold rounded-3xl sm:rounded-full py-6 px-6 sm:px-12 shadow-lg shadow-brand-gold/25 border border-white/20">
          <div className="grid grid-cols-1 gap-6 divide-y divide-brand-navy/10 sm:grid-cols-3 sm:gap-0 sm:divide-y-0 sm:divide-x">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-start sm:justify-center gap-5 py-2 sm:py-0 sm:px-6 transition-all duration-300 hover:scale-[1.03]"
              >
                {/* Stat Icon - Large size, directly on the gold banner background */}
                <div className="shrink-0">
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                    priority
                  />
                </div>
                {/* Stat Text - Dark Navy */}
                <div className="text-left text-brand-navy">
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
                    <Counter value={stat.value} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold opacity-90 mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
