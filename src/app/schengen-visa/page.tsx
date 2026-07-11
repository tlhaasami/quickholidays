"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { schengenVisaBg, SCHENGEN_DESTINATIONS } from "@/constants/data";
import ScrollReveal from "@/components/ScrollReveal";

export default function SchengenVisaPage() {
  const [schengenDestinations, setSchengenDestinations] = useState(SCHENGEN_DESTINATIONS);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("quick_holidays_flags");
    if (stored) {
      setSchengenDestinations(JSON.parse(stored));
    }
  }, []);
  const checklist = [
    {
      title: "Fastest Process",
      desc: "Efficient application designed to save you time.",
    },
    {
      title: "Stress-Free Experience",
      desc: "We handle the details so you can apply with confidence.",
    },
    {
      title: "Highest Visa Approval",
      desc: "Every application is prepared with precision and care.",
    },
    {
      title: "Expert Support",
      desc: "Dedicated Schengen specialists guiding you every step.",
    },
  ];

  return (
    <div className="bg-brand-cream text-slate-800 font-sans min-h-screen">
      <main className="grow">
      {/* Hero Section */}
        <section className="relative w-full bg-brand-cream min-h-[90vh] flex items-center overflow-visible">
          {/* Backdrop Image */}
          <div className="absolute inset-0 z-0 select-none overflow-hidden">
            <Image
              src={schengenVisaBg}
              alt="Schengen Visa Background"
              fill
              sizes="100vw"
              onLoad={() => setBgLoaded(true)}
              className={`object-cover object-right select-none origin-top transition-all duration-[1500ms] ease-out ${
                bgLoaded ? "opacity-100 scale-[1.02] blur-0" : "opacity-0 scale-[1.07] blur-sm"
              }`}
              priority
            />
            {/* Soft bottom fade-to-cream gradient */}
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-linear-to-t from-brand-cream via-brand-cream/80 to-transparent pointer-events-none z-10" />
          </div>

          {/* Hero Content — same 12-col grid as homepage */}
          <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pt-10 sm:pb-24 lg:pt-12 lg:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column: Text Content (Spans 6 columns) */}
              <div className="lg:col-span-6 text-left z-10">
                <ScrollReveal animation="fade-up">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-gold block mb-4">
                    Schengen Tourist Visa
                  </span>
                  <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-tight text-brand-navy leading-[1.05] mb-6">
                    Apply Your<br />
                    Schengen Visa
                  </h1>
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-lg mb-8">
                    We specialize exclusively in Schengen Tourist Visa applications for UK residents. Choose your destination and let our dedicated specialists guide you through every stage of the application.
                  </p>
                </ScrollReveal>

                {/* Checklist bullets */}
                <div className="space-y-4 max-w-lg">
                  {checklist.map((item, idx) => (
                    <ScrollReveal key={idx} animation="fade-up" delay={150 + idx * 80}>
                      <div className="flex items-start gap-3.5">
                        <div className="mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full bg-brand-gold" />
                        <div>
                          <h4 className="text-sm font-bold text-brand-navy">{item.title}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* Right Column: Empty — lets background image show */}
              <div className="hidden lg:block lg:col-span-6" />

            </div>
          </div>
        </section>

        {/* Destination Chooser Grid */}
        <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
              <div className="text-left space-y-3.5 md:max-w-md">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-gold block">
                  We're Here To Help
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight leading-[1.15]">
                  Choose Your Destination
                </h2>
              </div>
              <div className="md:max-w-xl text-left">
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed border-l-2 border-brand-gold/30 pl-6">
                  We provide expert consultation and application support for Schengen Tourist Visas across all Schengen member countries. Select your destination and begin your application with confidence.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {schengenDestinations.map((dest, idx) => (
              <ScrollReveal key={idx} animation="scale-in" delay={idx * 60} className="w-full">
                <Link
                  href="/contact-us"
                  className="flex flex-col items-center justify-between h-full bg-white rounded-3xl p-8 border-[1.5px] border-slate-100 shadow-[0_10px_30px_rgba(15,33,72,0.06)] text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(15,33,72,0.12)] hover:border-brand-gold group cursor-pointer"
                >
                  {/* Flag Area */}
                  <div className="relative w-32 h-20 mb-6 overflow-hidden rounded-xl border border-slate-100 shadow-sm flex items-center justify-center bg-slate-50">
                    <img
                      src={typeof dest.flag === "string" ? dest.flag : (dest.flag && (dest.flag as any).src) || ""}
                      alt={`${dest.name} Flag`}
                      className="absolute inset-0 w-full h-full object-cover scale-[1.25] transition-transform duration-300 group-hover:scale-[1.38]"
                    />
                  </div>

                  {/* Country Name */}
                  <h3 className="text-base font-bold text-brand-navy tracking-tight mb-2">
                    {dest.name}
                  </h3>

                  {/* Arrow Button */}
                  <div className="mt-4 flex items-center justify-center w-10 h-10 rounded-full border border-brand-gold/60 text-brand-gold group-hover:bg-brand-gold group-hover:text-white group-hover:shadow-[0_0_12px_rgba(204,163,82,0.45)] group-hover:scale-105 transition-all duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-4.5 h-4.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
