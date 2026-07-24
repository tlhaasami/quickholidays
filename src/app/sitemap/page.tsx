"use client";

import React from "react";
import Link from "next/link";
import { COUNTRIES } from "@/constants";
import { motion } from "motion/react";

export default function Sitemap() {
  const pages = [
    { name: "Home", href: "/" },
    { name: "Schengen Visa Selector Hub", href: "/schengen-visa" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "FAQ", href: "/faq" },
    { name: "Reviews", href: "/reviews" },
    { name: "About Us", href: "/about-us" },
    { name: "Book Consultation", href: "/contact-us" },
    { name: "Refund & Cancellation Policy", href: "/refund-policy" },
    { name: "Service Terms", href: "/service-terms" },
    { name: "Insurance Disclaimer", href: "/travel-insurance-disclaimer" },
    { name: "Privacy Policy", href: "/privacy-policy" }
  ];

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24 px-8 sm:px-16 md:px-24">
      <div className="max-w-4xl mx-auto text-left">
        
        <div className="border-b border-white/10 pb-6 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-white mb-2"
          >
            Sitemap
          </motion.h1>
          <span className="text-zinc-500 font-sans text-xs uppercase tracking-wider block">
            Verifiable Route Tree Directory
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
          {/* Main Pages */}
          <div className="space-y-4 text-left">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold border-b border-white/5 pb-2">Main Pages</h3>
            <ul className="space-y-2 text-sm sm:text-base font-light text-zinc-400 font-sans">
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-primary text-[10px]">■</span>
                    <span>{p.name}</span>
                    <span className="text-zinc-600 text-xs font-light">({p.href})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmatic Schengen Country Guides */}
          <div className="space-y-4 text-left">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold border-b border-white/5 pb-2">Country Visa Guides</h3>
            <ul className="space-y-2 text-sm sm:text-base font-light text-zinc-400 max-h-96 overflow-y-auto pr-2 no-scrollbar font-sans">
              {COUNTRIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/schengen-visa/${c.slug}`} className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="text-primary text-[10px]">●</span>
                    <span>{c.name} Visa Info</span>
                    <span className="text-zinc-600 text-xs font-light">(/schengen-visa/{c.slug})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
