"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

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
      text: "Fast appointment booking and helpful cover letter drafts. Recommending to all my fellow BRP holders living in the UK."
    }
  ];

  // Injects Google Review schemas for SEO optimization
  const jsonLdSchema = reviewsData.map((rev) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "LocalBusiness",
      "name": "Quick Holidays Ltd",
      "image": "/assets/logos/quick-holidays-logo-search.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office 25 Innovation Park, Edge Lane",
        "addressLocality": "Liverpool",
        "postalCode": "L7 9NJ",
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
    <div className="bg-black min-h-screen text-white pt-32 pb-24 px-8 sm:px-16 md:px-24">
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
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl font-medium tracking-tight mb-4"
          >
            Real clients. Real decisions.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-400 font-light max-w-xl mx-auto"
          >
            Read what UK resident permit holders say about our service and our Accountability Promise.
          </motion.p>
        </div>

        {/* Mock Trustpilot Widget slot (hidden until 10+ reviews) */}
        <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-emerald-500 font-bold text-lg">★</span>
            <span className="font-sans font-bold text-sm text-white">Trustpilot Widget</span>
          </div>
          <div className="text-zinc-500 text-xs italic">
            Connecting dynamic Trustpilot API (enabled upon reaching 10+ reviews)
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-16">
          {reviewsData.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: Math.min(idx * 0.1, 0.4) }}
              className="border border-white/5 bg-zinc-950/40 rounded-2xl p-8 flex flex-col justify-between hover:border-white/10 transition-colors"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1 text-primary text-sm">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-zinc-500 font-sans text-xs">{rev.date}</span>
                </div>
                <p className="text-zinc-300 font-sans text-sm sm:text-base font-light leading-relaxed mb-6">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-auto">
                <div>
                  <h4 className="font-sans font-bold text-sm text-white">{rev.name}</h4>
                  <span className="font-sans text-xs text-zinc-500">{rev.city} • </span>
                  <span className="font-sans text-xs text-primary">{rev.country}</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider font-sans bg-emerald-600/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/10">
                  {rev.outcome}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="text-center">
          <Link
            href="/contact-us"
            className="px-8 py-4 bg-primary text-white font-sans font-bold uppercase tracking-wider text-xs rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-300 inline-block"
          >
            Start Your Schengen Application
          </Link>
        </div>
      </div>
    </div>
  );
}
