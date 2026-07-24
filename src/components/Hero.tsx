"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { TiltedCard } from "@/components/ui/tilted-card";
import { TypeformForm } from "@/components/TypeformForm";
import { FLAG_IMAGES, MARQUEE_CONFIG, HERO_CONFIG, COUNTRIES } from "@/constants";

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
        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm text-left flex items-center justify-between focus:outline-none transition-colors duration-200"
        style={{ borderColor: isOpen ? "var(--color-primary)" : "rgba(255,255,255,0.1)" }}
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
        <div className="absolute left-0 right-0 mt-2 z-50 bg-zinc-950 border border-white/10 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto no-scrollbar">
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
                className={`w-full text-left px-4 py-3 text-sm font-sans transition-colors ${
                  isSelected 
                    ? "bg-primary text-white font-semibold" 
                    : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Multiply the flag images array to create more rows in the columns
  const repeatedFlagImages = Array(MARQUEE_CONFIG.repeats).fill(FLAG_IMAGES).flat();

  const [residency, setResidency] = useState("brp-work");
  const [destination, setDestination] = useState("france");

  const sections = [
    { id: "proof-strip", label: "7.3 Proof Strip" },
    { id: "about-us", label: "7.4 Accountability Promise" },
    { id: "how-it-works", label: "7.5 QuickVisa Assurance Process" },
    { id: "schengen-visa", label: "7.6 Country Grid" },
    { id: "reviews", label: "7.7 Reviews" },
    { id: "contact-us", label: "7.8 Consultation Form" },
    { id: "faq", label: "7.9 FAQ" }, // Inline FAQ section target
  ];

  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      {/* Premium dark gradient overlays for editorial depth (Fixed Position) */}
      <div className="fixed inset-0 bg-linear-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-10" />

      {/* 1. Hero Section (7.1) - Now 1st Section at the top */}
      <section id="hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
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
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 z-0 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Configurable black fade overlay controlled from constants */}
          <div
            className="absolute inset-0 bg-black pointer-events-none z-10"
            style={{ opacity: HERO_CONFIG.fadeOpacity }}
          />
        </div>

        {/* Content Container (Bottom Left style matching the reference picture) */}
        <div className="absolute bottom-7 right-9 sm:right-16 z-20 select-none pointer-events-none">
          <img
            src="/assets/logos/quick-holidays-logo-search.png"
            alt="Quick Holidays Logo"
            className="h-12 sm:h-16 md:h-20 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          />
        </div>
        <div className="absolute bottom-8 left-8 sm:left-16 z-20 max-w-4xl text-left select-none pointer-events-none">
          {/* Ambient Backdrop Glow Blob */}
          <div 
            style={{ backgroundColor: HERO_CONFIG.holidaysColor }}
            className="absolute -inset-10 rounded-full blur-[80px] opacity-15 pointer-events-none mix-blend-screen animate-slow-glow" 
          />
          <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-sans font-bold tracking-tighter leading-[0.95] animate-text-shadow">
            <span style={{ color: HERO_CONFIG.quickColor }}>Quick</span>
            <br />
            <span style={{ color: HERO_CONFIG.holidaysColor }}>Holidays</span>
          </h1>
        </div>
      </section>

      {/* 2. Stat Counters Section (7.2) - Now 2nd Section */}
      <section id="stat-counters" className="relative w-full min-h-screen lg:h-screen flex items-center justify-center py-20 px-8 sm:px-16 md:px-24 bg-black text-white z-20 overflow-hidden border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">
          
          {/* Left Column: Heading, Subheading, CTAs */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col text-left justify-center"
          >
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6 leading-tight">
              Your Schengen visa,<br />handled properly.
            </h2>
            <p className="font-sans text-base sm:text-lg text-zinc-400 font-light leading-relaxed mb-10 max-w-xl">
              Clear costs. Honest advice. A team that stands behind each application. We prepare Schengen tourist visa applications for non-UK nationals living in the UK — No surprises, No guessing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Link 
                href="/contact-us" 
                className="px-6 py-4 bg-primary text-white font-sans font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-300 inline-block text-center whitespace-nowrap"
              >
                Book a Free Consultation
              </Link>
              <Link 
                href="/how-it-works" 
                className="px-6 py-4 border border-white/20 text-white font-sans font-semibold rounded-lg hover:bg-white/5 transition-all duration-300 inline-block text-center whitespace-nowrap"
              >
                See how it works
              </Link>
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
              <div className="text-zinc-500 text-xs sm:text-sm font-light italic">
                Serving UK-based applicants since 2021.
              </div>
            </div>

            {/* Clients Served Counter */}
            <div className="border-l-2 border-primary/40 pl-6 py-2 transition-all duration-500 hover:border-primary">
              <div className="text-5xl sm:text-6xl font-sans font-extrabold text-primary tracking-tight mb-2">
                <AnimatedCounter value={2600} suffix=" CLIENTS+" />
              </div>
              <div className="text-zinc-500 text-xs sm:text-sm font-light italic">
                Applications handled 2021–2026.
              </div>
            </div>

            {/* Approval Rate Counter */}
            <div className="border-l-2 border-primary/40 pl-6 py-2 transition-all duration-500 hover:border-primary">
              <div className="text-5xl sm:text-6xl font-sans font-extrabold text-primary tracking-tight mb-2">
                <AnimatedCounter value={97} suffix="%" />
              </div>
              <div className="text-zinc-500 text-xs sm:text-sm font-light italic">
                Approvals across all applications submitted 2021–2026.
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2.3 Proof Strip */}
      <section id="proof-strip" className="relative w-full py-8 border-t border-b border-white/5 bg-zinc-950 text-white z-20 flex items-center justify-center">
        <div className="max-w-7xl w-full mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm font-sans tracking-wide">
          <a 
            href="https://find-and-update.company-information.service.gov.uk/company/15948457" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-primary transition-colors flex items-center gap-2 group text-center md:text-left"
          >
            <span>Quick Holidays Ltd is a UK-registered company — Companies House No. <strong className="text-white group-hover:text-primary transition-colors">15948457</strong>. Verify us before you pay us. We recommend it.</span>
            <span className="text-primary transform group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <div className="text-zinc-500 italic text-[11px] flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse" />
            <span>Trustpilot widget (integrating soon)</span>
          </div>
        </div>
      </section>

      {/* 2.4 Accountability Promise Section (About Us) - Includes 3D Marquee at the bottom */}
      <section id="about-us" className="relative w-full bg-black z-20 border-t border-white/5 flex flex-col justify-between overflow-hidden">
        <div className="max-w-4xl mx-auto px-8 py-24 text-center flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-white mb-8 tracking-tight"
          >
            If we make a mistake,<br />we own it.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-400 font-light leading-relaxed mb-10 max-w-2xl"
          >
            Most visa consultancies disappear when something goes wrong. We do the opposite. If we make a mistake, we refund our service fee — in full, excluding appointment, insurance and other charges. That promise is in writing, in our refund policy, for every client.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              href="/refund-policy"
              className="px-8 py-4 border border-white/20 text-white font-sans font-semibold rounded-lg hover:bg-white/5 transition-all duration-300 inline-block text-center"
            >
              Read our Refund Policy
            </Link>
          </motion.div>
        </div>

        {/* 3D Marquee moved to About Us section */}
        <div className="relative w-full h-[55vh] flex items-center justify-center overflow-hidden border-t border-white/5 bg-zinc-950/40">
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
      </section>

      {/* 2.5 QuickVisa Assurance Process Section */}
      <section id="how-it-works" className="relative w-full py-24 px-8 sm:px-16 bg-black z-20 border-t border-white/5 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-white tracking-tight"
          >
            QuickVisa Assurance Process
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-400 font-light max-w-2xl mx-auto mb-16"
          >
            Our step-by-step commitment to secure your Schengen visa with zero guessing and complete transparency.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                description: "A free, honest assessment: whether you're ready to apply, what it will cost, and a realistic timeline — before you pay anything."
              },
              {
                step: "02",
                title: "Documentation",
                description: "Your checklist, cover letter, and application forms — built for your situation. We also help find refundable flights and pay-at-property hotels, wherever possible. Everything reviewed before submission."
              },
              {
                step: "03",
                title: "Appointment Booking",
                description: "We book and manage your biometrics appointment — London, Manchester, or Edinburgh — and hand you your appointment letter once confirmed."
              },
              {
                step: "04",
                title: "Approval Monitoring",
                description: "We track your application wherever the system allows it. Where it doesn't, we follow up directly. Either way, you're not left wondering — and you're covered by our Accountability Promise if we get something wrong."
              }
            ].map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative overflow-hidden border border-white/5 rounded-xl p-8 bg-zinc-950/60 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 h-72 flex flex-col justify-between"
              >
                <div className="text-left">
                  <span className="text-primary font-sans font-extrabold text-2xl tracking-widest block opacity-75">{step.step}</span>
                  <h3 className="text-white font-serif text-xl sm:text-2xl mt-4 font-semibold">{step.title}</h3>
                </div>

                <div className="text-left text-zinc-400 font-sans text-xs sm:text-sm font-light mt-auto">
                  Hover to view details <span className="text-primary">→</span>
                </div>

                <div className="absolute inset-0 bg-zinc-950 p-8 rounded-xl flex flex-col justify-center border border-primary/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md transform translate-y-4 group-hover:translate-y-0 text-left">
                  <span className="text-primary font-sans font-bold text-xs tracking-wider uppercase mb-3">Step {step.step}: {step.title}</span>
                  <p className="text-sm font-light leading-relaxed text-zinc-100 font-sans">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/how-it-works"
              className="text-primary hover:text-white transition-colors font-sans font-semibold inline-flex items-center gap-2 text-sm group"
            >
              See the full process <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2.6 Country Grid Section */}
      <section id="schengen-visa" className="relative w-full py-24 px-8 sm:px-16 bg-black z-20 border-t border-white/5 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-white tracking-tight"
          >
            Where do you want to go?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-400 font-light max-w-2xl mx-auto mb-16"
          >
            Fees, documents and timelines for every Schengen country — see exactly what your application needs before you talk to anyone.
          </motion.p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {COUNTRIES.map((country, idx) => (
              <motion.div
                key={country.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.03, 0.5) }} // Cap delay to avoid excessive staggered delay on 29 items
              >
                <Link 
                  href={`/schengen-visa/${country.slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden border border-white/5 bg-zinc-950/60 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 h-full text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-serif text-lg sm:text-xl font-semibold text-white group-hover:text-primary transition-colors">{country.name}</span>
                    <img 
                      src={country.flag} 
                      alt={`${country.name} Flag`}
                      className="w-12 h-8 object-cover rounded-sm border border-white/10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" 
                    />
                  </div>
                  <span className="text-zinc-500 font-sans text-xs tracking-wider uppercase group-hover:text-white transition-colors inline-flex items-center gap-1 self-start mt-2">
                    Visa Guide <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2.7 Reviews Section */}
      <section id="reviews" className="relative w-full py-24 px-8 sm:px-16 bg-black z-20 border-t border-white/5 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-white tracking-tight"
          >
            Real clients. Real decisions.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-400 font-light max-w-2xl mx-auto mb-16"
          >
            Read what our clients say about our document verification and biometrics search process.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
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
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="border border-white/5 bg-zinc-950/40 rounded-xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1 text-primary text-sm mb-4">★ ★ ★ ★ ★</div>
                  <p className="text-zinc-400 font-sans text-sm font-light leading-relaxed mb-6">"{rev.text}"</p>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                  <div>
                    <h4 className="font-sans font-bold text-sm text-white">{rev.name}</h4>
                    <span className="font-sans text-xs text-primary">{rev.country}</span>
                  </div>
                  <Link href="/reviews" className="text-xs text-zinc-500 hover:text-white transition-colors underline">
                    Read more
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              href="/reviews"
              className="px-8 py-4 border border-white/20 text-white font-sans font-semibold rounded-lg hover:bg-white/5 transition-all duration-300 inline-block text-center"
            >
              All reviews
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2.8 Consultation Form Section */}
      <section id="contact-us" className="relative w-full py-24 px-8 sm:px-16 bg-black z-20 border-t border-white/5 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-white tracking-tight"
          >
            Start with a free consultation.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-400 font-light max-w-2xl mx-auto mb-12"
          >
            Tell us about your trip. We'll tell you exactly what it takes — the cost, the documents, and a realistic timeline. No obligation, no pressure.
          </motion.p>

          {/* Lead Capture Form */}
          <TypeformForm />
        </div>
      </section>

      {/* 2.9 FAQ Section */}
      <section id="faq" className="relative w-full py-24 px-8 sm:px-16 bg-black z-20 border-t border-white/5 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-center text-white tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-400 font-light text-center max-w-2xl mx-auto mb-16"
          >
            Answers to the most common questions about Schengen visa applications for UK residents.
          </motion.p>

          <div className="space-y-6">
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
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="border border-white/5 bg-zinc-950/40 rounded-xl p-6 sm:p-8"
              >
                <h4 className="font-sans font-bold text-base sm:text-lg text-white mb-2">{faq.q}</h4>
                <p className="font-sans text-zinc-400 text-sm font-light leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sitewide Footer (1.2) */}
      <footer className="relative w-full bg-zinc-950 border-t border-white/10 text-white z-20 pt-20 pb-12 px-8 sm:px-16 md:px-24">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6 text-left">
            <img 
              src="/assets/logos/quick-holidays-logo-search.png"
              alt="Quick Holidays Logo"
              className="h-10 w-auto object-contain self-start filter brightness-95"
            />
            <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed">
              Quick Holidays Ltd — Schengen visa specialists for Non-UK nationals living in the UK. Clear costs, honest advice, and full accountability, every step.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://wa.me/448000584673" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-400 font-sans text-xs font-semibold rounded-lg transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-6 text-left">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-primary">Quick Links</h4>
            <div className="flex flex-col gap-3 font-sans text-sm font-light text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/schengen-visa" className="hover:text-white transition-colors">Schengen Visa</Link>
              <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link>
              <Link href="/contact-us" className="hover:text-white transition-colors">Book Consultation</Link>
            </div>
          </div>

          {/* Policies Column */}
          <div className="flex flex-col gap-6 text-left">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-primary">Policies</h4>
            <div className="flex flex-col gap-3 font-sans text-sm font-light text-zinc-400">
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refund & Cancellation Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Service Terms</Link>
              <Link href="/insurance-disclaimer" className="hover:text-white transition-colors">Insurance Disclaimer</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>

          {/* Contact Info Column */}
          <div className="flex flex-col gap-6 text-left">
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-primary">Contact Info</h4>
            <div className="flex flex-col gap-4 font-sans text-sm font-light text-zinc-400">
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">✉</span>
                <div>
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Email</span>
                  <a href="mailto:info@quickholidays.co.uk" className="hover:text-white transition-colors">info@quickholidays.co.uk</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">📞</span>
                <div>
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Phone</span>
                  <a href="tel:+448000584673" className="hover:text-white transition-colors">+44 800 058 4673</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">📍</span>
                <div>
                  <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Address</span>
                  <span className="leading-relaxed">Office 25 Innovation Park, Edge Lane, Liverpool, England, L7 9NJ</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclosures & Copyright */}
        <div className="max-w-7xl w-full mx-auto border-t border-white/5 pt-8 text-xs font-sans font-light text-zinc-500 text-left space-y-4">
          <p className="leading-relaxed">
            <strong>Legal Disclaimer:</strong> Quick Holidays Ltd is a private visa support agency and is not affiliated with TLScontact, VFS Global, or any government embassy or consular authority. We offer document checking, appointment search assistance, and consulting services for Schengen visa applications. Official visa fees are set by EU regulation and are payable directly to the respective embassy/consulate or visa outsourcing center.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 text-[11px]">
            <span>© 2026 Quick Holidays Ltd. All rights reserved. Company No. 15948457.</span>
            <span>Made with precision for Schengen visa applicants in the UK.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
