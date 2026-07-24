"use client";

import React from "react";
import { motion } from "motion/react";

export default function AboutUs() {
  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24 px-8 sm:px-16 md:px-24">
      <div className="max-w-4xl mx-auto text-left">
        
        {/* H1 Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl font-medium tracking-tight mb-4"
          >
            Why Quick Holidays exists.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-400 font-light max-w-xl mx-auto"
          >
            Our founding mission, our team, and our commitment to premium trust.
          </motion.p>
        </div>

        {/* Verbatim Vision Story (3 Paragraphs) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-950 border border-white/5 rounded-2xl p-8 sm:p-12 space-y-6 mb-16 shadow-2xl font-serif text-lg sm:text-xl text-zinc-300 leading-relaxed italic"
        >
          <p>
            Schengen visas are confusing. Consultancies contradict each other. Forums give bad advice. Small mistakes get you rejected. Most consultancies don't fix this. They're expensive. Impersonal. Disorganised.
          </p>
          <p>
            We built Quick Holidays to fix it.
          </p>
          <p>
            We can't promise you a visa. We can promise you clarity. You'll know exactly where you stand. Every step. Start to finish.
          </p>
        </motion.div>

        {/* Core Beliefs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-white/5 bg-zinc-950/40 p-8 rounded-2xl"
          >
            <h3 className="font-serif text-xl sm:text-2xl text-white mb-3">Transparency First</h3>
            <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed">
              We charge fixed, clear consultancy fees agreed in writing beforehand. We do not bundle VFS/embassy costs or mark them up. You always know exactly what your application costs and why.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="border border-white/5 bg-zinc-950/40 p-8 rounded-2xl"
          >
            <h3 className="font-serif text-xl sm:text-2xl text-white mb-3">Quality Over Quantity</h3>
            <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed">
              We deliberately accept fewer clients to ensure that every single application gets checked by a trained specialist. We prepare every document, flight layout, and checklist manually.
            </p>
          </motion.div>
        </div>

        {/* Team Story */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-white/5 bg-zinc-950/40 p-8 sm:p-12 rounded-2xl mb-16 text-left"
        >
          <h3 className="font-serif text-2xl sm:text-3xl text-white mb-4">Our Team</h3>
          <div className="font-sans text-sm sm:text-base text-zinc-400 font-light leading-relaxed space-y-4">
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
        </motion.div>

        {/* Verification Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-white/10 pt-8 text-center text-zinc-500 font-sans text-sm font-light"
        >
          Quick Holidays Ltd is registered in England and Wales, Company No. 15948457. You can check our official business status by viewing our record at{" "}
          <a
            href="https://find-and-update.company-information.service.gov.uk/company/15948457"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-white underline transition-colors font-semibold"
          >
            Companies House →
          </a>
        </motion.div>

      </div>
    </div>
  );
}
