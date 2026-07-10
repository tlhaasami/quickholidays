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
    <section className="bg-brand-cream/20 pt-20 sm:pt-28 pb-6 sm:pb-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials Header (Without slider buttons) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="text-left">
            <span className="text-sm font-bold tracking-widest text-brand-gold uppercase block mb-3">
              What Our Clients Say
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
              Real Stories, Real Satisfaction
            </h2>
          </div>
        </div>

        {/* Testimonials Container (With floating golden slider buttons) */}
        <div className="relative px-4 sm:px-12">
          
          {/* Floating Gold Left Button (Desktop only) */}
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute left-0 lg:left-[-12px] top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-brand-gold text-white hover:bg-brand-gold/90 active:scale-95 transition-all duration-200 shadow-md shadow-brand-gold/25"
            aria-label="Previous testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Floating Gold Right Button (Desktop only) */}
          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-0 lg:right-[-12px] top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-brand-gold text-white hover:bg-brand-gold/90 active:scale-95 transition-all duration-200 shadow-md shadow-brand-gold/25"
            aria-label="Next testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Desktop Layout (Show all 3 in a grid) */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col bg-[#F9F8F6] rounded-[24px] p-8 border-[1.5px] border-slate-100 shadow-[0_4px_20px_rgba(15,33,72,0.03)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(15,33,72,0.08)] hover:border-brand-gold"
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
                <p className="text-slate-600 text-[14px] leading-relaxed mb-8 flex-grow">
                  {t.quote}
                </p>

                {/* Author Info - Without border line */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-navy/5 bg-slate-100 flex-shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      sizes="48px"
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
            <div className="flex flex-col bg-[#F9F8F6] rounded-[24px] p-6 border-[1.5px] border-slate-100 shadow-[0_4px_20px_rgba(15,33,72,0.03)] min-h-[300px] justify-between animate-fadeIn transition-all duration-300 hover:border-brand-gold">
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
                <p className="text-slate-600 text-sm leading-relaxed mb-8">
                  {TESTIMONIALS[activeIndex].quote}
                </p>
              </div>

              {/* Author Info - Without border line */}
              <div className="flex items-center gap-4 pt-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-navy/5 bg-slate-100 flex-shrink-0">
                  <Image
                    src={TESTIMONIALS[activeIndex].avatar}
                    alt={TESTIMONIALS[activeIndex].name}
                    fill
                    sizes="48px"
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
