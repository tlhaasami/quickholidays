"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { COUNTRIES } from "@/constants";

export default function SchengenVisaHub() {
  const processSteps = [
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
  ];

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24 px-8 sm:px-16 md:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Intro Hub Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight mb-6"
          >
            Schengen tourist visas,<br />
            <span className="text-primary">country by country.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-400 font-light leading-relaxed"
          >
            The embassy fee is set by EU regulation and is the same for every Schengen country. What can vary is your document checklist and processing time — we confirm both for your exact destination, free, before you pay anything.
          </motion.p>
        </div>

        {/* 1. QuickVisa Assurance Process Block (2.5) */}
        <div className="mb-24 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-3 text-white">The QuickVisa Assurance Process</h2>
          <p className="font-sans text-sm sm:text-base text-zinc-500 font-light mb-12 max-w-xl mx-auto">
            Our systematic approach to auditing files, preparing applications, and booking appointments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
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
        </div>

        {/* 2. Interactive Country Grid (2.6) */}
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-3 text-white">Schengen Destinations</h2>
          <p className="font-sans text-sm sm:text-base text-zinc-500 font-light mb-12 max-w-xl mx-auto">
            Choose your destination below to see specific fees, checklists, and embassy guidelines.
          </p>
          
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

      </div>
    </div>
  );
}
