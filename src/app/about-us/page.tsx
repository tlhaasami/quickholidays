"use client";

import { useState } from "react";
import Image from "next/image";
import { aboutUsBg } from "@/constants/data";
import ourPurposeIcon from "@/assets/icons/our-purpose.png";
import ScrollReveal from "@/components/ScrollReveal";

export default function AboutPage() {
  const [bgLoaded, setBgLoaded] = useState(false);

  return (
    <div className="bg-brand-cream text-slate-800 font-sans min-h-screen">
      <main className="grow">
        {/* Hero Section matching home design (image only) */}
        <section className="relative w-full bg-brand-cream min-h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0 select-none overflow-hidden">
            <Image
              src={aboutUsBg}
              alt="About - Background"
              fill
              sizes="100vw"
              onLoad={() => setBgLoaded(true)}
              className={`object-cover object-right select-none origin-top transition-all duration-[1500ms] ease-out ${bgLoaded ? "opacity-100 scale-[1.02] blur-0" : "opacity-0 scale-[1.07] blur-sm"
                }`}
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-linear-to-t from-brand-cream via-brand-cream/80 to-transparent pointer-events-none z-10" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-20 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 text-left z-10">
                <ScrollReveal animation="fade-up">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[72px] font-serif font-extrabold text-brand-navy leading-[1.03] mb-6">
                    Experts in
                    <br />
                    Schengen Visas
                  </h1>
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl mb-6">
                    Quick Holidays is a trusted UK Schengen Visa Specialist dedicated to simplifying the visa application process. Through expert consultation, efficient preparation, and personalized support, we help clients submit approval-focused Schengen visa applications with confidence, making every step clear, seamless, and stress-free.
                  </p>
                  <p className="text-sm text-slate-600 max-w-2xl">
                    Our identity reflects professionalism, transparency, expertise, and efficiency. Every element of the brand is designed to communicate trust, confidence, and a commitment to delivering a fast, stress-free Schengen visa experience for UK residents.
                  </p>
                </ScrollReveal>
              </div>

              <div className="hidden lg:block lg:col-span-6" />
            </div>
          </div>
        </section>

        <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Icon + Title */}
            <div className="flex items-center gap-6 md:gap-8 md:flex-1">
              <ScrollReveal animation="slide-left" className="flex items-center gap-6 md:gap-8">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-full bg-brand-navy flex items-center justify-center border-4 border-brand-gold">
                    <Image src={ourPurposeIcon} alt="purpose icon" width={40} height={40} className="w-10 h-10 object-contain" />
                  </div>
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-gold mb-2">OUR PURPOSE</div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy leading-tight">
                    We Handle the Process.
                    <br />
                    You Enjoy Europe.
                  </h3>
                </div>
              </ScrollReveal>
            </div>

            {/* Divider + Description */}
            <div className="md:flex-1 w-full md:w-auto md:pl-8">
              <ScrollReveal animation="slide-right" delay={150}>
                <div className="md:border-l md:border-brand-gold/30 md:pl-8 text-slate-600">
                  <p className="mb-0">
                    Our purpose is to remove uncertainty from the Schengen visa application process. By providing expert guidance, transparent communication, and approval-focused preparation, we help clients move forward with confidence while we take care of every detail.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
