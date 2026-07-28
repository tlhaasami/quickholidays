"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { TiltedCard } from "@/components/ui/tilted-card";
import { TypeformForm } from "@/components/TypeformForm";
import { FLAG_IMAGES, MARQUEE_CONFIG, HERO_CONFIG, COUNTRIES, INFINITE_MENU_CONFIG, COUNTRY_NICHES } from "@/constants";
import { Highlighter } from "@/components/ui/highlighter";
import { VerticalAccordion } from "@/components/VerticalAccordion";
import { ThemeButton } from "@/components/ThemeButton";
import { Tooltip } from "@/components/ui/tooltip-card";
import Stack from "@/components/ui/stack";
import InfiniteMenu from "@/components/ui/infinite-menu";


import { trackContact } from "@/lib/analytics";

import { WobbleCard } from "@/components/ui/wobble-card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSiteConfig } from "@/hooks/useSiteConfig";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 45, damping: 15 });
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    return displayValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString() + suffix;
      }
    });
  }, [displayValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

interface CustomSelectOption {
  value: string;
  label: string;
}

function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option"
}: {
  label: string;
  options: CustomSelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="block text-zinc-400 font-sans text-xs font-semibold uppercase tracking-wider mb-2">
        {label}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white font-sans text-sm text-left flex items-center justify-between focus:outline-none transition-colors duration-200"
        style={{ borderColor: isOpen ? "var(--color-primary)" : "" }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Options Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 z-50 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto no-scrollbar">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-sans transition-colors ${isSelected
                  ? "bg-primary text-white font-semibold"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const siteConfig = useSiteConfig();
  const titleWords = (siteConfig.heroTitle || "Quick Holidays").split(" ");
  const word1 = titleWords[0]?.toUpperCase() || "QUICK";
  const word2 = titleWords.slice(1).join(" ")?.toUpperCase() || "HOLIDAYS";
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [flagsLoaded, setFlagsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  useEffect(() => {
    if (!flagsLoaded) return;

    const loadVideo = () => {
      const timer = setTimeout(() => {
        setVideoSrc("/videos/bg-video.webm");
      }, 1000);
      return () => clearTimeout(timer);
    };

    if (document.readyState === "complete") {
      return loadVideo();
    } else {
      window.addEventListener("load", loadVideo);
      return () => window.removeEventListener("load", loadVideo);
    }
  }, [flagsLoaded]);

  // Preload all flag images — show Stack only once every flag is ready
  useEffect(() => {
    let cancelled = false;
    const total = FLAG_IMAGES.length;
    if (total === 0) { setFlagsLoaded(true); return; }
    let loaded = 0;
    FLAG_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (!cancelled && loaded >= total) setFlagsLoaded(true);
      };
      img.src = src;
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (videoSrc && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setVideoLoaded(true);
      }).catch(() => { });
    }
  }, [videoSrc]);

  useEffect(() => {
    setMounted(true);
    // Check initially
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);

    // Watch for theme changes on html tag
    const observer = new MutationObserver(() => {
      const isDarkTheme = document.documentElement.classList.contains("dark");
      setIsDark(isDarkTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Force-play video after mount (browser autoplay policies can suppress it)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const tryPlay = () => {
      video.play().catch(() => {
        // Silently ignore — video will still show poster
      });
    };
    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }
  }, []);

  const activeDark = mounted ? isDark : true;

  // Hero golden overlay setting
  const [goldenOverlay, setGoldenOverlay] = useState(false);

  useEffect(() => {
    const loadOverlay = () => {
      const saved = localStorage.getItem("hero_goldenOverlay");
      if (saved) setGoldenOverlay(saved === "true");
    };
    loadOverlay();
    window.addEventListener("storage", loadOverlay);
    return () => window.removeEventListener("storage", loadOverlay);
  }, []);

  const repeatedFlagImages = Array(MARQUEE_CONFIG.repeats).fill(FLAG_IMAGES).flat();

  const menuItems = useMemo(() => COUNTRIES.map((c) => {
    return {
      image: c.flag,
      link: `/contact-us?destination=${c.slug}`,
      title: c.name,
      description: COUNTRY_NICHES[c.name] || `Official Schengen visa application guide and document check for ${c.name} travelers residing in the UK.`
    };
  }), []);

  const selectorMenuItems = useMemo(() => COUNTRIES.map((c) => {
    return {
      image: c.flag,
      link: `/contact-us?destination=${c.slug}`,
      title: c.name,
      description: COUNTRY_NICHES[c.name] || `Official Schengen visa application guide and document check for ${c.name} travelers residing in the UK.`
    };
  }), []);

  const [residency, setResidency] = useState("brp-work");
  const [destination, setDestination] = useState("france");
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const sections = [
    { id: "proof-strip", label: "7.3 Proof Strip" },
    { id: "about-us", label: "7.4 Accountability Promise" },
    { id: "how-it-works", label: "7.5 QuickVisa Assurance Process" },
    { id: "schengen-visa", label: "7.6 Country Grid" },
    { id: "reviews", label: "7.7 Reviews" },
    { id: "contact-us", label: "7.8 Consultation Form" },
    { id: "faq", label: "7.9 FAQ" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300">
      {/* Premium dark gradient overlays removed — video plays clear */}


      {/* 1. Hero Section (7.1) */}
      <section id="hero" className="relative w-full h-screen overflow-hidden bg-black">
        {/* Background Hero Image (Visible immediately until video is fully loaded) */}
        <div className="absolute inset-0 overflow-hidden z-0 bg-black">
          <img
            src="/videos/bg-video-first-frame.webp"
            alt="Hero Background"
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
          />

          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              poster="/videos/bg-video-first-frame.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onPlaying={() => {
                setVideoLoaded(true);
              }}
              onTimeUpdate={() => {
                if (videoRef.current && videoRef.current.currentTime > 0) {
                  setVideoLoaded(true);
                }
              }}
              onLoadedData={() => {
                if (videoRef.current) {
                  videoRef.current.play().then(() => setVideoLoaded(true)).catch(() => { });
                }
              }}
              onCanPlay={() => {
                if (videoRef.current) {
                  videoRef.current.play().then(() => setVideoLoaded(true)).catch(() => { });
                }
              }}
              onCanPlayThrough={() => {
                if (videoRef.current) {
                  videoRef.current.play().then(() => setVideoLoaded(true)).catch(() => { });
                }
              }}
              onEnded={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.play().catch(() => { });
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? "opacity-100" : "opacity-0"
                }`}
            >
              <source src="/videos/bg-video.webm" type="video/webm" />
            </video>
          )}
        </div>

        {/* Optional golden shimmer overlay */}
        {goldenOverlay && (
          <div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,149,55,0.28) 0%, rgba(201,149,55,0.08) 55%, transparent 100%)",
            }}
          />
        )}

        {/* Hero content split container — centered vertically (shifted slightly up on mobile), brand on left, flags on right, pinned using vw */}
        <div className="absolute inset-0 z-10 w-full px-[6vw] lg:px-[8vw] flex flex-col lg:flex-row justify-start lg:justify-between items-center gap-8 lg:gap-12 pointer-events-none pt-20 sm:pt-24 lg:pt-0 overflow-hidden">

          {/* Left Column: Brand Block */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.25
                }
              }
            }}
            className={`w-full lg:max-w-xl flex flex-col gap-4 pointer-events-auto`}
          >
            {/* Row 1: Logo (Left) + Stacked Text Heading (Right) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="flex items-center gap-6"
            >
              {/* Logo */}
              <div className={`shrink-0 flex items-center justify-center ${HERO_CONFIG.logoSizeMobile} ${HERO_CONFIG.logoSizeTablet} ${HERO_CONFIG.logoSizeDesktop}`}>
                <img
                  src="/logos/logo.svg"
                  alt="Quick Holidays"
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              {/* Stacked Heading */}
              <div className={`flex flex-col leading-none select-none tracking-tighter ${HERO_CONFIG.headingFont} ${HERO_CONFIG.headingBoldness}`}>
                <span className={`text-4xl xs:text-5xl sm:text-6xl md:text-7xl ${HERO_CONFIG.headingBoldness}`} style={{ color: HERO_CONFIG.quickColor, textShadow: "0 1px 3px rgba(255,255,255,0.4)" }}>
                  {word1}
                </span>
                <span className={`text-4xl xs:text-5xl sm:text-6xl md:text-7xl ${HERO_CONFIG.headingBoldness}`} style={{ color: HERO_CONFIG.holidaysColor }}>
                  {word2}
                </span>
              </div>
            </motion.div>

            {/* Row 2: Description */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className={HERO_CONFIG.paragraphMaxWidth}
            >
              <p className="font-sans text-white/95 text-base sm:text-lg font-light leading-relaxed"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
                {siteConfig.heroDescription}
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 items-start mt-2"
            >
              <ThemeButton href="/contact-us" size="sm">
                Book a Consultation
              </ThemeButton>
              <ThemeButton href="/how-it-works" size="sm">
                See how it works
              </ThemeButton>

            </motion.div>
          </motion.div>

          {/* Right Column: Swipable Polaroid Flag Stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="block relative w-[280px] xs:w-[320px] sm:w-[420px] h-[180px] xs:h-[200px] sm:h-[265px] pr-0 sm:pr-8 pointer-events-auto select-none mt-14 lg:mt-0"
          >
            <div className="w-full h-full">
              {flagsLoaded ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full"
                >
                  <Stack
                    randomRotation={true}
                    sensitivity={45}
                    sendToBackOnClick={true}
                    autoplay={true}
                    autoplayDelay={3500}
                    pauseOnHover={true}
                    cards={FLAG_IMAGES.map((src, i) => {
                      const countryName = COUNTRIES[i]?.name || "Schengen Country";
                      return (
                        <div key={i} className="w-full h-full p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col justify-between select-none">
                          <div className="w-full h-[84%] overflow-hidden rounded-xl border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                            <img
                              src={src}
                              alt={countryName}
                              className="w-full h-full object-cover pointer-events-none"
                            />
                          </div>
                          <div className="flex items-center justify-between px-1 pt-1 shrink-0">
                            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                              {countryName}
                            </span>
                            <span className="text-[10px] font-sans font-extrabold uppercase text-[#C99537]">
                              Schengen Visa
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  />
                  
                  {/* Creative instructional labels */}
                  <div className="flex items-center justify-between gap-3 mt-4 px-0.5 pointer-events-auto">
                    {/* Swipe hint — frosted glass pill with bouncing arrows */}
                    <div
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full select-none"
                      style={{
                        background: "rgba(255,255,255,0.18)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.35)",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.25)"
                      }}
                    >
                      <motion.span
                        animate={{ x: [-3, 0, -3] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-white text-xs leading-none"
                      >←</motion.span>
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                        Swipe to explore
                      </span>
                      <motion.span
                        animate={{ x: [3, 0, 3] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-white text-xs leading-none"
                      >→</motion.span>
                    </div>

                    {/* See all countries — gold accent pill button */}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer active:scale-95 transition-transform duration-150"
                      style={{
                        background: "rgba(201,149,55,0.92)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 2px 12px rgba(201,149,55,0.45)"
                      }}
                    >
                      <svg className="w-3 h-3 text-zinc-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      <span className="text-zinc-950 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        All Countries
                      </span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="w-full h-full rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Stat Counters Section (7.2) - Now 2nd Section */}
      <section id="stat-counters" className="relative w-full min-h-screen lg:h-screen flex items-center justify-center py-20 px-8 sm:px-16 md:px-24 bg-white dark:bg-black text-zinc-900 dark:text-white z-20 overflow-hidden border-t border-zinc-200 dark:border-white/5 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">

          {/* Left Column: Heading, Subheading, CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col text-left justify-center"
          >
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight">
              Your Schengen visa,<br />
              <Highlighter action="underline" color="#CCA352" strokeWidth={2.5} isView={true}>
                handled properly.
              </Highlighter>
            </h2>
            <div className="font-sans text-base sm:text-lg text-zinc-650 dark:text-zinc-400 font-light leading-relaxed mb-10 max-w-xl">
              Clear costs. Honest advice. A team that stands behind each application. We prepare Schengen tourist visa applications for{" "}
              <Tooltip
                content={
                  <span className="flex flex-col gap-1.5 font-sans">
                    <span className="text-[11px] text-[#C99537] font-bold uppercase tracking-wider block">Eligible Residents</span>
                    <span className="text-xs font-light text-zinc-300 leading-normal block">
                      Includes BRP holders, Work visa, Student visa, Spouse visa, and Indefinite Leave to Remain (ILR) holders living in the UK.
                    </span>
                  </span>
                }
              >
                <span className="underline decoration-dotted decoration-primary/40 cursor-help font-semibold hover:text-primary transition-colors text-zinc-900 dark:text-zinc-100">non-UK nationals</span>
              </Tooltip>{" "}
              living in the UK — No surprises, No guessing.
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-stretch sm:items-center mt-4">
              <ThemeButton href="/contact-us">
                Book a Consultation
              </ThemeButton>
              <ThemeButton href="/how-it-works">
                See how it works
              </ThemeButton>
            </div>
          </motion.div>

          {/* Right Column: Animated Counters */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col gap-12 justify-center lg:pl-12"
          >
            {/* Experience Counter */}
            <div className="border-l-2 border-primary/40 pl-6 py-2 transition-all duration-500 hover:border-primary">
              <div className="text-5xl sm:text-6xl font-sans font-extrabold text-primary tracking-tight mb-2">
                <AnimatedCounter value={5} suffix=" YEARS+" />
              </div>
              <div className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-light italic">
                Serving UK-based applicants since 2021.
              </div>
            </div>

            {/* Clients Served Counter */}
            <div className="border-l-2 border-primary/40 pl-6 py-2 transition-all duration-500 hover:border-primary">
              <div className="text-5xl sm:text-6xl font-sans font-extrabold text-primary tracking-tight mb-2">
                <AnimatedCounter value={2600} suffix=" CLIENTS+" />
              </div>
              <div className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-light italic">
                Applications handled 2021–2026.
              </div>
            </div>

            {/* Approval Rate Counter */}
            <div className="border-l-2 border-primary/40 pl-6 py-2 transition-all duration-500 hover:border-primary">
              <div className="text-5xl sm:text-6xl font-sans font-extrabold text-primary tracking-tight mb-2">
                <AnimatedCounter value={97} suffix="%" />
              </div>
              <div className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-light italic">
                Approvals across all applications submitted 2021–2026.
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2.3 Proof & Verification Section */}
      <section id="proof-strip" className="relative w-full py-20 border-t border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-800 dark:text-white z-20 transition-colors duration-300">
        <div className="max-w-7xl w-full mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-left"
          >
            <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest block">UK Registered Company</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-zinc-900 dark:text-white tracking-tight">
              Registered and verified at Companies House.
            </h2>
            <p className="font-sans text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-light leading-relaxed">
              We operate with complete corporate transparency. Quick Holidays Ltd is officially registered in England and Wales under Company Number <strong>{siteConfig.companyNumber}</strong>. You can verify our active business registration details, filing history, and company records directly on the UK government registry.
            </p>
            <div className="pt-2">
              <ThemeButton
                href={`https://find-and-update.company-information.service.gov.uk/company/${siteConfig.companyNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Verify on Companies House
              </ThemeButton>
            </div>

            {/* Additional Trust Indicators */}
            <div className="border-t border-zinc-200 dark:border-white/10 pt-6 mt-8 flex flex-col sm:flex-row gap-6 text-xs text-zinc-555 dark:text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-700 animate-pulse" />
                <span>Verify us before you pay us. We recommend it.</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div className="relative group max-w-md w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl p-3 transition-transform duration-500 hover:scale-[1.02]">
              <img
                src={activeDark ? "/images/companyverification-dark.png" : "/images/companyverification.png"}
                alt="Companies House Verification Record"
                className="w-full h-auto rounded-xl object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2.4 Accountability Promise Section (About Us) - Includes 3D Marquee at the bottom */}
      <section id="about-us" className="relative w-full bg-white dark:bg-black z-20 border-t border-zinc-200 dark:border-white/5 flex flex-col justify-between overflow-hidden transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-8 py-24 text-center flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-zinc-900 dark:text-white mb-8 tracking-tight"
          >
            If we make a mistake,<br />
            <span className="inline-block mt-2">
              <Highlighter action="circle" color="#CCA352" strokeWidth={2} padding={8} isView={true}>
                we own it.
              </Highlighter>
            </span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-700 dark:text-zinc-200 font-light leading-relaxed mb-10 max-w-2xl"
          >
            Most visa consultancies disappear when something goes wrong. We do the opposite. If we make a mistake, we{" "}
            <Tooltip
              content={
                <span className="flex flex-col gap-1.5 font-sans">
                  <span className="text-[11px] text-[#C99537] font-bold uppercase tracking-wider block">Refund Scope</span>
                  <span className="text-xs font-light text-zinc-300 leading-normal text-left block">
                    Covers 100% of our consulting service fee. Note that third-party VFS appointment fees, embassy visa fees, and travel insurance costs are non-refundable.
                  </span>
                </span>
              }
            >
              <span className="underline decoration-dotted decoration-primary/40 cursor-help font-semibold hover:text-primary transition-colors text-zinc-900 dark:text-zinc-100">refund our service fee</span>
            </Tooltip>{" "}
            — in full, excluding appointment, insurance and other charges. That promise is in writing, in our refund policy, for every client.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4"
          >
            <ThemeButton href="/refund-policy">
              Read our Refund Policy
            </ThemeButton>
          </motion.div>
        </div>

        {/* 3D Marquee moved to About Us section */}
        {/* 
        <div className="relative w-full h-[55vh] flex items-center justify-center overflow-hidden border-t border-zinc-200 dark:border-white/5 bg-zinc-100/40 dark:bg-zinc-950/40 transition-colors duration-300">
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
              className="w-full h-full rounded-none"
            />
          </div>
        </div>
        */}
      </section>

      {/* 2.5 QuickVisa Assurance Process Section */}
      <section id="how-it-works" className="relative w-full py-24 px-8 sm:px-16 bg-white dark:bg-black z-20 border-t border-zinc-200 dark:border-white/5 text-zinc-900 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-zinc-900 dark:text-white tracking-tight"
          >
            QuickVisa <Highlighter action="underline" color="#C99537" strokeWidth={2.5} isView={true}>Assurance Process.</Highlighter>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-650 dark:text-zinc-400 font-light max-w-2xl mx-auto mb-16"
          >
            Our step-by-step commitment to secure your Schengen visa with zero guessing and complete transparency.
          </motion.p>

          <VerticalAccordion />

          <div className="mt-12 text-center">
            <ThemeButton href="/how-it-works">
              See the full process
            </ThemeButton>
          </div>
        </div>
      </section>

      {/* 2.6 Country Grid Section */}
      <section id="schengen-visa" className="relative w-full py-24 bg-white dark:bg-black z-20 border-t border-zinc-200 dark:border-white/5 text-zinc-900 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center px-8 sm:px-16 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-zinc-900 dark:text-white tracking-tight"
          >
            Where do you want to <Highlighter action="underline" color="#C99537" strokeWidth={2.5} isView={true}>go?</Highlighter>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light max-w-2xl mx-auto"
          >
            Fees, documents and timelines for every Schengen country — see exactly what your application needs before you talk to anyone.
          </motion.p>
        </div>
        <div className="max-w-7xl mx-auto px-8 sm:px-16 pb-12 mt-12">
          <div className="w-full h-[550px] md:h-[680px] relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl shadow-inner">
            <InfiniteMenu
              items={selectorMenuItems}
              scale={INFINITE_MENU_CONFIG.scale}
              flagSizeFactor={INFINITE_MENU_CONFIG.flagSizeFactor}
              borderColor={INFINITE_MENU_CONFIG.borderColor}
              borderWidth={INFINITE_MENU_CONFIG.borderWidth}
            />
          </div>
        </div>

      </section>

      {/* 2.6b Discover Countries Section — removed */}

      {/* 2.7 Reviews Section */}
      <section id="reviews" className="relative w-full py-24 px-8 sm:px-16 bg-zinc-50 dark:bg-black z-20 border-t border-zinc-200 dark:border-white/5 text-zinc-900 dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-zinc-900 dark:text-white tracking-tight"
          >
            Real <Highlighter action="underline" color="#C99537" strokeWidth={2.5} isView={true}>clients.</Highlighter> Real <Highlighter action="highlight" color="#CCA35255" isView={true}>decisions.</Highlighter>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-650 dark:text-zinc-400 font-light max-w-2xl mx-auto mb-16"
          >
            Read what our clients say about our document verification and biometrics search process.
          </motion.p>

          {/* Desktop view: 3-Column Wobble Card Grid */}
          <div className="hidden md:grid grid-cols-3 gap-8 text-left mb-12">
            {[
              {
                name: "Amara O.",
                country: "France Visa",
                text: "They managed to find a France appointment in London within 4 days. Absolutely saved my summer holiday. The checklist was extremely precise.",
              },
              {
                name: "Dmitry K.",
                country: "Spain Visa",
                text: "Highly recommend the Accountability Promise. It gives you absolute peace of mind knowing they back their check. Got my 2-year multiple entry visa.",
              },
              {
                name: "Priyah S.",
                country: "Germany Visa",
                text: "Very professional from start to finish. Everything handled online, and they accompanied me right until my VFS appointment day. Excellent service.",
              }
            ].map((rev, idx) => (
              <WobbleCard
                key={idx}
                containerClassName="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 shadow-md h-full flex flex-col"
                className="p-8 flex flex-col justify-between h-full cursor-pointer"
              >
                <div className="flex flex-col h-full justify-between text-left">
                  <div>
                    <div className="flex items-center gap-1 text-primary text-sm mb-4">★ ★ ★ ★ ★</div>
                    <p className="text-zinc-700 dark:text-zinc-200 font-sans text-sm font-light leading-relaxed mb-6">"{rev.text}"</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-zinc-200 dark:border-white/5 pt-4 mt-2">
                    <div>
                      <h4 className="font-sans font-bold text-sm text-zinc-900 dark:text-white">{rev.name}</h4>
                      <span className="font-sans text-xs text-primary">{rev.country}</span>
                    </div>
                    <Link href="/reviews" className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors underline">
                      Read more
                    </Link>
                  </div>
                </div>
              </WobbleCard>
            ))}
          </div>

          {/* Mobile view: Swipe Slider / Auto-carousel Card with Dot Indicators */}
          <div className="block md:hidden text-left mb-12">
            <div className="min-h-[220px]">
              {[
                {
                  name: "Amara O.",
                  country: "France Visa",
                  text: "They managed to find a France appointment in London within 4 days. Absolutely saved my summer holiday. The checklist was extremely precise.",
                },
                {
                  name: "Dmitry K.",
                  country: "Spain Visa",
                  text: "Highly recommend the Accountability Promise. It gives you absolute peace of mind knowing they back their check. Got my 2-year multiple entry visa.",
                },
                {
                  name: "Priyah S.",
                  country: "Germany Visa",
                  text: "Very professional from start to finish. Everything handled online, and they accompanied me right until my VFS appointment day. Excellent service.",
                }
              ].map((rev, idx) => {
                if (idx !== activeReviewIndex) return null;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <WobbleCard
                      containerClassName="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 shadow-md flex flex-col"
                      className="p-8 flex flex-col justify-between"
                    >
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1 text-primary text-sm mb-4">★ ★ ★ ★ ★</div>
                        <p className="text-zinc-700 dark:text-zinc-200 font-sans text-sm font-light leading-relaxed mb-6">"{rev.text}"</p>

                        <div className="flex justify-between items-center border-t border-zinc-200 dark:border-white/5 pt-4 mt-2">
                          <div>
                            <h4 className="font-sans font-bold text-sm text-zinc-900 dark:text-white">{rev.name}</h4>
                            <span className="font-sans text-xs text-primary">{rev.country}</span>
                          </div>
                          <Link href="/reviews" className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors underline">
                            Read more
                          </Link>
                        </div>
                      </div>
                    </WobbleCard>
                  </motion.div>
                );
              })}
            </div>

            {/* Slider Dots indicators */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveReviewIndex(idx)}
                  className={`transition-all duration-300 h-2 cursor-pointer ${activeReviewIndex === idx
                    ? "w-6 rounded-full bg-[#C99537]"
                    : "w-2 rounded-full bg-zinc-300 dark:bg-zinc-700 hover:bg-[#C99537]"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ThemeButton href="/reviews">
              All reviews
            </ThemeButton>
          </motion.div>
        </div>
      </section>

      {/* 2.8 Consultation Form Section */}
      <section id="contact-us" className="relative w-full py-24 px-6 sm:px-16 bg-white dark:bg-black z-20 border-t border-zinc-200 dark:border-white/5 text-zinc-900 dark:text-white transition-colors duration-300 flex flex-col items-center justify-center">
        <div className="max-w-6xl w-full text-left mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-zinc-900 dark:text-white tracking-tight"
          >
            Start with a <Highlighter action="underline" color="#C99537" strokeWidth={2.5} isView={true}>consultation.</Highlighter>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-655 dark:text-zinc-400 font-light max-w-3xl"
          >
            Tell us about your trip. We'll tell you exactly what it takes — the cost, the documents, and a realistic timeline. No obligation, no pressure.
          </motion.p>
        </div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* Left Column: Form */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            <TypeformForm />
          </div>

          {/* Right Column: Contact Image Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="lg:col-span-6 hidden lg:block relative w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10 group bg-zinc-900"
          >
            {/* Subtle gold overlay highlight on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-10 transition-opacity duration-300" />
            <img
              src="images/contact-right.webp"
              alt="Quick Visa Consultation"
              className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
            />
            {/* Elegant floating caption inside the image */}
            <div className="absolute bottom-6 left-6 z-20 text-left">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C99537] bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-md">
                Secure Schengen Visa
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-white font-medium mt-2 drop-shadow-md">
                Your gateway to Europe, simplified.
              </h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2.9 FAQ Section */}
      <section id="faq" className="relative w-full py-24 px-8 sm:px-16 bg-white dark:bg-black z-20 border-t border-zinc-200 dark:border-white/5 text-zinc-900 dark:text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-center text-zinc-900 dark:text-white tracking-tight"
          >
            Frequently <Highlighter action="underline" color="#C99537" strokeWidth={2.5} isView={true}>Asked Questions.</Highlighter>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-650 dark:text-zinc-400 font-light text-center max-w-2xl mx-auto mb-16"
          >
            Answers to the most common questions about Schengen visa applications for UK residents.
          </motion.p>

          <Accordion type="multiple" className="w-full space-y-3">
            {[
              {
                q: "Who is eligible to apply for a Schengen visa from the UK?",
                a: "Non-UK nationals who hold a valid UK residence permit (e.g. BRP, work visa, student visa, spouse visa, ILR) can apply from the UK. You must have at least 3 months validity remaining on your UK residence permit after your intended return date from the Schengen area."
              },
              {
                q: "How long does the Schengen visa application process take?",
                a: "Processing times vary by embassy, usually taking between 15 to 45 calendar days after your biometrics appointment. However, finding appointment slots can sometimes take additional time, which is why we recommend starting the process 6-8 weeks before your travel."
              },
              {
                q: "What is your Accountability Promise refund policy?",
                a: "Our promise is simple: if we make a mistake on your document compilation or checking that directly leads to a visa rejection, we refund our service fee in full. Third-party costs like VFS appointment bookings, embassy visa fees, and travel insurance cannot be refunded."
              }
            ].map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`home-faq-${idx}`}
                className="border-b border-zinc-200 dark:border-white/10"
              >
                <AccordionTrigger className="hover:underline font-sans font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-650 dark:text-zinc-400 font-sans text-sm font-light leading-relaxed pb-4 pt-1">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Sitewide Footer (1.2) */}
      <footer className="relative w-full bg-zinc-100 dark:bg-black border-t border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white z-20 pt-20 pb-12 px-8 sm:px-16 md:px-24 transition-colors duration-300">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="flex flex-col gap-6 text-left items-start">
            <img
              src="/logos/logo.svg"
              alt="Quick Holidays Logo"
              className="h-10 w-10 object-contain self-start filter brightness-95"
            />
            <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              Quick Holidays Ltd — Schengen visa specialists for Non-UK nationals living in the UK. Clear costs, honest advice, and full accountability, every step.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-6 text-left items-start">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-primary">Quick Links</h4>
            <div className="flex flex-col gap-3 font-sans text-sm font-light text-zinc-600 dark:text-zinc-400 items-start">
              <Link href="/" className="hover:text-primary dark:hover:text-white transition-colors">Home</Link>
              <Link href="/schengen-visa" className="hover:text-primary dark:hover:text-white transition-colors">Schengen Visa</Link>
              <Link href="/how-it-works" className="hover:text-primary dark:hover:text-white transition-colors">How It Works</Link>
              <Link href="/reviews" className="hover:text-primary dark:hover:text-white transition-colors">Reviews</Link>
              <Link href="/contact-us" className="hover:text-primary dark:hover:text-white transition-colors">Book Consultation</Link>
            </div>
          </div>

          {/* Policies Column */}
          <div className="flex flex-col gap-6 text-left items-start">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-primary">Policies</h4>
            <div className="flex flex-col gap-3 font-sans text-sm font-light text-zinc-600 dark:text-zinc-400 items-start">
              <Link href="/refund-policy" className="hover:text-primary dark:hover:text-white transition-colors">Refund & Cancellation Policy</Link>
              <Link href="/terms" className="hover:text-primary dark:hover:text-white transition-colors">Service Terms</Link>
              <Link href="/insurance-disclaimer" className="hover:text-primary dark:hover:text-white transition-colors">Insurance Disclaimer</Link>
              <Link href="/privacy-policy" className="hover:text-primary dark:hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/sitemap" className="hover:text-primary dark:hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>

          {/* Contact Info Column */}
          <div className="flex flex-col gap-6 text-left items-start">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-primary">Contact Info</h4>
            <div className="flex flex-col gap-4 font-sans text-sm font-light text-zinc-600 dark:text-zinc-400 items-start">
              <div className="flex flex-row items-start text-left gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary mt-1 shrink-0">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Email</span>
                  <a href="mailto:info@quickholidays.co.uk" className="hover:text-primary dark:hover:text-white transition-colors">info@quickholidays.co.uk</a>
                </div>
              </div>
              <div className="flex flex-row items-start text-left gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary mt-1 shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Phone</span>
                  <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="hover:text-primary dark:hover:text-white transition-colors">{siteConfig.phone}</a>
                </div>
              </div>
              <div className="flex flex-row items-start text-left gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary mt-1 shrink-0">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div className="flex flex-col items-start">
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Address</span>
                  <span className="leading-relaxed">{siteConfig.address}</span>
                </div>
              </div>
            </div>
          </div>

        </div>



        {/* Legal Disclosures & Copyright */}
        <div className="max-w-7xl w-full mx-auto border-t border-zinc-200 dark:border-white/5 pt-8 text-xs font-sans font-light text-zinc-500 text-left space-y-4">
          <p className="leading-relaxed">
            <strong>Legal Disclaimer:</strong> Quick Holidays Ltd is a private visa support agency and is not affiliated with TLScontact, VFS Global, or any government embassy or consular authority. We offer document checking, appointment search assistance, and consulting services for Schengen visa applications. Official visa fees are set by EU regulation and are payable directly to the respective embassy/consulate or visa outsourcing center.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 pt-4 text-[11px]">
            <span>© 2026 Quick Holidays Ltd. All rights reserved. Company No. {siteConfig.companyNumber}.</span>
            <span>Made with precision for Schengen visa applicants in the UK.</span>
          </div>
        </div>
      </footer>

      {/* Country Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-zinc-900 border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-left"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-start justify-between shrink-0">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                    Select Schengen Destination
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-zinc-400 font-light">
                    Choose a country to view custom visa requirements, document checklists, and book your consultation.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Search input & Grid */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-3 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl font-sans text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#C99537]/50 focus:ring-1 focus:ring-[#C99537]/50 transition-all"
                  />
                  <svg className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Countries list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredCountries.map((c) => (
                    <div
                      key={c.slug}
                      className="group p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between gap-4 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={c.flag}
                          alt={`${c.name} flag`}
                          className="w-8 h-5.5 object-cover rounded-sm border border-white/10 shrink-0"
                        />
                        <span className="font-sans text-sm font-medium text-white group-hover:text-[#C99537] transition-colors">
                          {c.name}
                        </span>
                      </div>
                      <Link
                        href={`/schengen-visa/${c.slug}`}
                        onClick={() => setIsModalOpen(false)}
                        className="py-1.5 px-3 rounded-lg font-sans text-[10px] font-bold uppercase tracking-wider text-black bg-[#C99537] hover:bg-amber-500 transition-colors shadow-sm cursor-pointer"
                      >
                        Book Visa
                      </Link>
                    </div>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500 font-sans text-sm font-light">
                      No countries match your search query.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
