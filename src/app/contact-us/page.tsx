"use client";

import React from "react";
import { TypeformForm } from "@/components/TypeformForm";
import { motion } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";

export default function ContactUs() {
  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-32 pb-24 px-8 sm:px-16 flex flex-col items-center justify-center transition-colors duration-300">
      <div className="max-w-xl w-full text-center mb-10">
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-xl"
      >
        <TypeformForm />
      </motion.div>
    </div>
  );
}
