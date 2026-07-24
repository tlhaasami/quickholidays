"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Free Consultation",
      description: "We assess your Schengen destination, travel dates, visa history, and financial standing. If eligible, we provide your service fee quote and initial document requirements before you pay a penny."
    },
    {
      num: "02",
      title: "Deposit & Documentation",
      description: "Paying the deposit opens your case file. We construct your custom document checklist, prepare your cover letters, compile your official application forms, and find flight/hotel reservations where possible. Every document is reviewed before submission."
    },
    {
      num: "03",
      title: "Appointment Booking",
      description: "Our tracking system secures your biometrics appointment at the corresponding visa center (London, Manchester, or Edinburgh). Once confirmed, we release your prepared application pack, triggering your balance payment."
    },
    {
      num: "04",
      title: "Decision & After",
      description: "We track your application through the processing cycle. If something is wrong due to our error, you're covered by our Accountability Promise refund. Once you get your passport back, we verify your visa stamps for dates and accuracy."
    }
  ];

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24 px-8 sm:px-16 md:px-24">
      <div className="max-w-5xl mx-auto">
        {/* Intro */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight mb-6"
          >
            How it works — <br className="hidden sm:inline" />
            <span className="text-primary">from first call to decision day.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-lg sm:text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto"
          >
            No black box. Here's the whole journey, including when you pay what.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-white/5 pl-8 sm:pl-16 py-8 space-y-16 max-w-3xl mx-auto mb-24">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative group text-left"
            >
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[41px] sm:-left-[73px] top-1.5 w-6 h-6 rounded-full bg-zinc-950 border-2 border-primary/40 flex items-center justify-center group-hover:border-primary transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>

              <span className="font-sans text-primary text-sm font-bold tracking-widest block uppercase mb-1">Step {step.num}</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="font-sans text-sm sm:text-base text-zinc-400 font-light leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Closing CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-zinc-950 border border-white/10 rounded-2xl p-12 text-center max-w-3xl mx-auto shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -inset-10 rounded-full bg-primary/10 blur-[80px] opacity-20 pointer-events-none" />
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4 text-white">
            Know exactly where you stand — from day one.
          </h2>
          <p className="font-sans text-zinc-400 text-sm sm:text-base font-light max-w-lg mx-auto mb-8 leading-relaxed">
            Ready to secure your appointment and start compiling your Schengen checklist? Book a free qualification assessment now.
          </p>
          <Link
            href="/contact-us"
            className="px-8 py-4 bg-primary text-white font-sans font-bold uppercase tracking-wider text-xs rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-300 inline-block"
          >
            Book a Free Consultation
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
