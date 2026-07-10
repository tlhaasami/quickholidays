"use client";

import { useState } from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/constants/data";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-brand-cream/30 py-20 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials Header with Navigation Arrows */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="text-left">
            <span className="text-sm font-bold tracking-widest text-brand-gold uppercase block mb-3">
              What Our Clients Say
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
              Real Stories,
              <br />
              Real Satisfaction
            </h2>
          </div>
          
          {/* Navigation Controls (Slider Buttons) */}
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-brand-gold bg-transparent text-brand-gold hover:bg-brand-gold hover:text-white active:scale-95 transition-all duration-200 shadow-sm"
              aria-label="Previous testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center w-12 h-12 rounded-full border border-brand-gold bg-transparent text-brand-gold hover:bg-brand-gold hover:text-white active:scale-95 transition-all duration-200 shadow-sm"
              aria-label="Next testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonials List / Slider Grid */}
        <div className="relative">
          {/* Desktop Layout (Show all 3 in a grid) */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col bg-white/70 hover:bg-white rounded-2xl p-8 border border-brand-navy/5 shadow-[0_4px_25px_-4px_rgba(15,33,72,0.04)] transition-all duration-300 hover:shadow-lg hover:border-brand-gold/15"
              >
                {/* 5 Stars Rating */}
                <div className="flex gap-1 mb-6 text-brand-gold">
                  {[...Array(t.rating)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-slate-600 text-sm leading-relaxed italic mb-8 flex-grow">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-brand-navy/5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-navy/5 bg-slate-100 flex-shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-brand-navy">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Slider View (Show 1 card at a time with touch/button support) */}
          <div className="block md:hidden">
            <div className="flex flex-col bg-white rounded-2xl p-6 border border-brand-navy/5 shadow-md min-h-[300px] justify-between animate-fadeIn">
              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 mb-5 text-brand-gold">
                  {[...Array(TESTIMONIALS[activeIndex].rating)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4.5 h-4.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed italic mb-8">
                  &ldquo;{TESTIMONIALS[activeIndex].quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-brand-navy/5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-navy/5 bg-slate-100 flex-shrink-0">
                  <Image
                    src={TESTIMONIALS[activeIndex].avatar}
                    alt={TESTIMONIALS[activeIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-brand-navy">
                    {TESTIMONIALS[activeIndex].name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {TESTIMONIALS[activeIndex].location}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "w-6 bg-brand-gold" : "w-2.5 bg-brand-gold/30"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
