"use client";

import React from "react";
import { TypeformForm } from "@/components/TypeformForm";
import { motion } from "motion/react";

export default function ContactUs() {
  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24 px-8 sm:px-16 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-3 text-white"
        >
          Book your consultation.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-sm sm:text-base text-zinc-400 font-light"
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
