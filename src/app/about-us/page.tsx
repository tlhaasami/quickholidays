"use client";

import React from "react";
import { motion } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";
import { WobbleCard } from "@/components/ui/wobble-card";

export default function AboutUs() {
  return (
    <div className="bg-white dark:bg-[#0A0D16] min-h-screen text-zinc-950 dark:text-white pt-20 pb-32 px-8 sm:px-16 md:px-24 transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-left">
        
        {/* H1 Header */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-4 text-zinc-900 dark:text-white"
          >
            Why Quick Holidays exists.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-light max-w-xl mx-auto"
          >
            Our founding mission, our team, and our commitment to premium trust.
          </motion.p>
        </div>

        {/* Verbatim Vision Story (3 Paragraphs) - Now as WobbleCard */}
        <WobbleCard 
          containerClassName="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 mb-16 shadow-2xl" 
          className="p-8 sm:p-12 text-zinc-700 dark:text-zinc-100 font-serif text-lg sm:text-xl leading-relaxed italic space-y-6"
        >
          <p>
            Schengen visas are confusing. Consultancies contradict each other. Forums give bad advice. Small mistakes get you rejected. Most consultancies don't fix this. They're expensive. Impersonal. Disorganised.
          </p>
          <p>
            We built <Highlighter action="highlight" color="#CCA35255" isView={true}>Quick Holidays</Highlighter> to fix it.
          </p>
          <p>
            We can't promise you a visa. We can promise you clarity. You'll know exactly where you stand. Every step. Start to finish.
          </p>
        </WobbleCard>

        {/* Core Beliefs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <WobbleCard 
            containerClassName="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 shadow-md" 
            className="p-8"
          >
            <h3 className="font-serif text-xl sm:text-2xl text-zinc-900 dark:text-white mb-3">Transparency First</h3>
            <p className="font-sans text-sm text-zinc-700 dark:text-zinc-200 font-light leading-relaxed">
              We charge fixed, clear consultancy fees agreed in writing beforehand. We do not bundle VFS/embassy costs or mark them up. You always know exactly what your application costs and why.
            </p>
          </WobbleCard>

          <WobbleCard 
            containerClassName="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 shadow-md" 
            className="p-8"
          >
            <h3 className="font-serif text-xl sm:text-2xl text-zinc-900 dark:text-white mb-3">Quality Over Quantity</h3>
            <p className="font-sans text-sm text-zinc-700 dark:text-zinc-200 font-light leading-relaxed">
              We deliberately accept fewer clients to ensure that every single application gets checked by a trained specialist. We prepare every document, flight layout, and checklist manually.
            </p>
          </WobbleCard>
        </div>

        {/* Team Story */}
        <WobbleCard 
          containerClassName="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 mb-16 shadow-2xl" 
          className="p-8 sm:p-12 text-left"
        >
          <h3 className="font-serif text-2xl sm:text-3xl text-zinc-900 dark:text-white mb-4">Our Team</h3>
          <div className="font-sans text-sm sm:text-base text-zinc-700 dark:text-zinc-200 font-light leading-relaxed space-y-4">
            <p>
              Behind every application is a dedicated, professional team — trained specifically in Schengen visa requirements, and focused on one thing: getting your application right, the first time.
            </p>
            <p>
              We work as one connected team, using the same process, the same standards, and the same accountability for every single client — no matter where in the world you're applying from.
            </p>
            <p>
              You're never just a case number. Every application gets a real person checking it, start to finish.
            </p>
          </div>
        </WobbleCard>

        {/* Verification Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-zinc-200 dark:border-white/10 pt-8 text-center text-zinc-500 font-sans text-sm font-light"
        >
          Quick Holidays Ltd is registered in England and Wales, Company No. 15948457. You can check our official business status by viewing our record at{" "}
          <a
            href="https://find-and-update.company-information.service.gov.uk/company/15948457"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-zinc-900 dark:hover:text-white underline transition-colors font-semibold"
          >
            Companies House →
          </a>
        </motion.div>

      </div>
    </div>
  );
}
