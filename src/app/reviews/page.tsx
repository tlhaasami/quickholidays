"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ThemeButton } from "@/components/ThemeButton";
import { Highlighter } from "@/components/ui/highlighter";
import { WobbleCard } from "@/components/ui/wobble-card";

interface ReviewItem {
  name: string;
  city: string;
  country: string;
  outcome: string;
  rating: number;
  text: string;
  date: string;
}

export default function Reviews() {
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const reviewsData: ReviewItem[] = [
    {
      name: "Omar M.",
      city: "London",
      country: "Italy Visa",
      outcome: "Approved (2-Year Multi-Entry)",
      rating: 5,
      date: "2026-07-15",
      text: "My initial biometrics appointment was rejected at the desk because of a missing stamped copy of my BRP bank statements. It was a detail that was easily overlooked in my self-compiled file, but Quick Holidays took full responsibility since they had reviewed it. They immediately refunded my service fee in full under their Accountability Promise, within 48 hours, and assisted me with compiling the new documents and booking a free replacement slot. That level of honesty is incredibly rare today."
    },
    {
      name: "Amara O.",
      city: "London",
      country: "France Visa",
      outcome: "Approved (6-Month Multi-Entry)",
      rating: 5,
      date: "2026-07-12",
      text: "They managed to search and secure a France appointment in London within 4 days of booking. Absolutely saved my summer holiday. The checklist was extremely precise and the form auto-fill saved hours."
    },
    {
      name: "Dmitry K.",
      city: "Manchester",
      country: "Spain Visa",
      outcome: "Approved (2-Year Multi-Entry)",
      rating: 5,
      date: "2026-07-09",
      text: "Highly recommend the Accountability Promise. It gives you absolute peace of mind knowing they stand behind their checklist check. The consultancy fee is clear and there are no surprise extra bills."
    },
    {
      name: "Priyah S.",
      city: "Edinburgh",
      country: "Germany Visa",
      outcome: "Approved (1-Year Multi-Entry)",
      rating: 5,
      date: "2026-07-05",
      text: "Very professional from start to finish. Everything handled online. They accompanied me right until my VFS appointment day. Excellent service and responsive communication on WhatsApp."
    },
    {
      name: "Chloe T.",
      city: "Bristol",
      country: "Netherlands Visa",
      outcome: "Approved (3-Month Single)",
      rating: 5,
      date: "2026-06-28",
      text: "Simple, easy, transparent. No hidden charges. The document upload portal made it easy to get everything audited from home."
    },
    {
      name: "Ali R.",
      city: "Leeds",
      country: "Spain Visa",
      outcome: "Approved (1-Year Multi-Entry)",
      rating: 5,
      date: "2026-06-22",
      text: "Fast appointment booking and helpful cover letter drafts. Recommending to all my BRP holders living in the UK."
    }
  ];

  // Injects Google Review schemas for SEO optimization
  const jsonLdSchema = reviewsData.map((rev) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "LocalBusiness",
      "name": "Quick Holidays Ltd",
      "image": "/logos/logo-search.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office 25 Innovation Park, Edge Lane",
        "addressLocality": "Liverpool",
        "postalCode": "L7 9NN",
        "addressCountry": "GB"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": rev.rating.toString(),
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": rev.name
    },
    "reviewBody": rev.text,
    "publisher": {
      "@type": "Organization",
      "name": "Quick Holidays"
    }
  }));

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-32 pb-24 px-8 sm:px-16 md:px-24 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Schema Script Injection */}
        {jsonLdSchema.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        {/* Intro */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl font-medium tracking-tight mb-4 text-zinc-900 dark:text-white"
          >
            Real <Highlighter action="underline" color="#C99537" strokeWidth={2.5} isView={true}>clients.</Highlighter> Real <Highlighter action="highlight" color="#CCA35255" isView={true}>decisions.</Highlighter>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light max-w-xl mx-auto mb-10"
          >
            Read what UK resident permit holders say about our service and our Accountability Promise.
          </motion.p>

          {/* Add a Review Button CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center"
          >
            <ThemeButton href="/contact-us" size="sm">
              Add a Review
            </ThemeButton>
          </motion.div>
        </div>

        {/* Reviews Grid - Desktop (hidden md:grid) */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-16">
          {reviewsData.map((rev, idx) => (
            <WobbleCard
              key={idx}
              containerClassName="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 shadow-md h-full flex flex-col"
              className="p-8 flex flex-col justify-between h-full cursor-pointer"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1 text-primary text-sm">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-zinc-550 font-sans text-xs">{rev.date}</span>
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-200 font-sans text-sm sm:text-base font-light leading-relaxed mb-6">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-200 dark:border-white/5 pt-4 mt-auto">
                  <div>
                    <h4 className="font-sans font-bold text-sm text-zinc-900 dark:text-white">{rev.name}</h4>
                    <span className="font-sans text-xs text-zinc-550">{rev.city} • </span>
                    <span className="font-sans text-xs text-primary">{rev.country}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider font-sans bg-emerald-600/10 text-emerald-450 dark:text-emerald-450 px-2 py-1 rounded border border-emerald-500/10">
                    {rev.outcome}
                  </span>
                </div>
              </div>
            </WobbleCard>
          ))}
        </div>

        {/* Reviews Carousel - Mobile (block md:hidden) */}
        <div className="block md:hidden text-left mb-16">
          <div className="min-h-[260px]">
            {reviewsData.map((rev, idx) => {
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
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1 text-primary text-sm">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <span className="text-zinc-555 font-sans text-xs">{rev.date}</span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-200 font-sans text-sm font-light leading-relaxed mb-6">
                        "{rev.text}"
                      </p>

                      <div className="flex justify-between items-center border-t border-zinc-200 dark:border-white/5 pt-4 mt-2">
                        <div>
                          <h4 className="font-sans font-bold text-sm text-zinc-900 dark:text-white">{rev.name}</h4>
                          <span className="font-sans text-xs text-zinc-550">{rev.city} • </span>
                          <span className="font-sans text-xs text-primary">{rev.country}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider font-sans bg-emerald-600/10 text-emerald-450 dark:text-emerald-450 px-2 py-1 rounded border border-emerald-500/10">
                          {rev.outcome}
                        </span>
                      </div>
                    </div>
                  </WobbleCard>
                </motion.div>
              );
            })}
          </div>

          {/* Slider Dots indicators */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {reviewsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReviewIndex(idx)}
                className={`transition-all duration-300 h-2 cursor-pointer ${
                  activeReviewIndex === idx
                    ? "w-6 rounded-full bg-[#C99537]"
                    : "w-2 rounded-full bg-zinc-300 dark:bg-zinc-700 hover:bg-[#C99537]"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div className="text-center">
          <ThemeButton href="/contact-us">
            Start Your Schengen Application
          </ThemeButton>
        </div>
      </div>
    </div>
  );
}
