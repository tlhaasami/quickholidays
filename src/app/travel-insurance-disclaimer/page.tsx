"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function TravelInsuranceDisclaimer() {
  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24 px-8 sm:px-16 md:px-24">
      <div className="max-w-3xl mx-auto text-left space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-white mb-2"
          >
            About the travel insurance included in our service.
          </motion.h1>
          <span className="text-zinc-500 font-sans text-xs uppercase tracking-wider block">
            Plain English Draft • Last Reviewed: 2026-07-23
          </span>
        </div>

        {/* Verbatim copy */}
        <div className="space-y-6 font-sans text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
          <p>
            Schengen applications require travel medical insurance with at least €30,000 of cover. Where insurance is arranged as part of our service, please be clear about what that means: Quick Holidays Ltd is not an insurance company. The policy is issued by the insurer named on your certificate, and their terms govern your cover.
          </p>
          <p>
            Claims are made to the insurer, not to us — though we'll point you in the right direction if you need it.
          </p>
          <p>
            It is your responsibility to ensure you are fit to travel and to disclose any medical conditions the insurer asks about; failing to do so can void your cover. Read your policy certificate before you travel.
          </p>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/10 pt-8 mt-12 flex justify-between items-center text-xs font-sans">
          <Link href="/service-terms" className="text-primary hover:text-white underline transition-colors">
            Service Terms
          </Link>
          <Link href="/privacy-policy" className="text-zinc-500 hover:text-white underline transition-colors">
            Privacy Policy
          </Link>
        </div>

      </div>
    </div>
  );
}
