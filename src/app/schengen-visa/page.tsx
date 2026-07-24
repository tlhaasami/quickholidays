"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { COUNTRIES } from "@/constants";
import { Highlighter } from "@/components/ui/highlighter";
import { VerticalAccordion } from "@/components/VerticalAccordion";

export default function SchengenVisaHub() {
  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-32 pb-24 px-8 sm:px-16 md:px-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Intro Hub Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight mb-6 text-zinc-900 dark:text-white"
          >
            Schengen tourist visas,<br />
            <span className="text-primary">
              <Highlighter action="underline" color="#CCA352" strokeWidth={2.5} isView={true}>
                country by country.
              </Highlighter>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-650 dark:text-zinc-400 font-light leading-relaxed"
          >
            The embassy fee is set by EU regulation and is the same for every Schengen country. What can vary is your document checklist and processing time — we confirm both for your exact destination, free, before you pay anything.
          </motion.p>
        </div>

        {/* 1. QuickVisa Assurance Process Block (2.5) */}
        <div className="mb-24 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-zinc-900 dark:text-white tracking-tight"
          >
            The QuickVisa Assurance Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-600 dark:text-zinc-450 font-light max-w-2xl mx-auto mb-16"
          >
            Our systematic approach to auditing files, preparing applications, and booking appointments.
          </motion.p>
          
          <VerticalAccordion />
        </div>

        {/* 2. Interactive Country Grid (2.6) */}
        <div className="text-center pt-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-zinc-900 dark:text-white tracking-tight"
          >
            Schengen Destinations
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-600 dark:text-zinc-450 font-light mb-16 max-w-2xl mx-auto"
          >
            Choose your destination below to see specific fees, checklists, and embassy guidelines.
          </motion.p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {COUNTRIES.map((country, idx) => (
              <motion.div
                key={country.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.03, 0.4) }}
              >
                <Link 
                  href={`/schengen-visa/${country.slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl p-6 hover:border-primary/50 hover:bg-zinc-100 dark:hover:bg-zinc-950/80 transition-all duration-300 h-full text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-serif text-lg sm:text-xl font-semibold text-zinc-900 dark:text-white group-hover:text-primary transition-colors">{country.name}</span>
                    <img 
                      src={country.flag} 
                      alt={`${country.name} Flag`}
                      className="w-12 h-8 object-cover rounded-sm border border-zinc-200/50 dark:border-white/10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" 
                    />
                  </div>
                  <span className="text-zinc-550 font-sans text-xs tracking-wider uppercase group-hover:text-zinc-900 dark:group-hover:text-white transition-colors inline-flex items-center gap-1 self-start mt-2">
                    Visa Guide <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
