"use client";

import React, { Suspense } from "react";
import { TypeformForm } from "@/components/TypeformForm";
import { motion } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";
import { useSearchParams } from "next/navigation";

function ContactUsFormWrapper() {
  const searchParams = useSearchParams();
  const dest = searchParams ? (searchParams.get("destination") || "france") : "france";
  return <TypeformForm defaultDestination={dest} />;
}

export default function ContactUs() {
  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-32 pb-24 px-6 sm:px-16 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="max-w-6xl w-full text-left mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-3 text-zinc-900 dark:text-white"
        >
          Book your <Highlighter action="underline" color="#CCA352" strokeWidth={2.5} isView={true}>consultation.</Highlighter>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-light"
        >
          Tell us about your Schengen trip. We'll tell you exactly what it takes — the cost, the documents, and a realistic timeline.
        </motion.p>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

        {/* Left Side: Form Content */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full"
          >
            <Suspense fallback={<div className="text-zinc-550 dark:text-zinc-400 font-sans text-sm">Loading form...</div>}>
              <ContactUsFormWrapper />
            </Suspense>
          </motion.div>
        </div>

        {/* Right Side: The Premium Theme Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="lg:col-span-6 hidden lg:block relative w-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10 group bg-zinc-900"
        >
          {/* Subtle gold overlay highlight on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-10 transition-opacity duration-300" />
          <img
            src="/images/contact-right.webp"
            alt="Quick Visa Consultation"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
          />
          {/* Elegant floating caption inside the image */}
          <div className="absolute bottom-6 left-6 z-20 text-left">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C99537] bg-black/45 px-2.5 py-1 rounded-full backdrop-blur-md">
              Secure Schengen Visa
            </span>
            <h3 className="font-serif text-lg sm:text-xl text-white font-medium mt-2 drop-shadow-md">
              Your gateway to Europe, simplified.
            </h3>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
