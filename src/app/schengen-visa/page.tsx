"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { COUNTRIES, INFINITE_MENU_CONFIG } from "@/constants";
import { Highlighter } from "@/components/ui/highlighter";
import { VerticalAccordion } from "@/components/VerticalAccordion";
import InfiniteMenu from "@/components/ui/infinite-menu";

export default function SchengenVisaHub() {
  const menuItems = useMemo(() => {
    return COUNTRIES.map((c) => {
      let desc = `Official Schengen visa application guide and document check for ${c.name} travelers residing in the UK.`;
      if (c.name === "France") {
        desc = "France is the most popular Schengen destination from the UK. Biometrics slots fill up quickly, and decisions are returned in 7-10 days.";
      } else if (c.name === "Spain") {
        desc = "Spain is a top choice for summer vacations and quick getaways. Applications are processed in London, Manchester, and Edinburgh.";
      } else if (c.name === "Italy") {
        desc = "Italy tourist visas require detailed proof of travel. Slots are highly competitive and require early booking.";
      } else if (c.name === "Germany") {
        desc = "Germany is high-demand for business and holiday travelers. Embassy guidelines are strict and require complete precision.";
      } else if (c.name === "Switzerland") {
        desc = "Switzerland is famed for the scenic Alps. We organize complete day-by-day flight, hotel, and travel itineraries.";
      } else if (c.name === "Greece") {
        desc = "Greece is heavily requested for summer travel. Appointments are processed at the GVC centers across the UK.";
      } else if (c.name === "Netherlands") {
        desc = "Netherlands is a major European transit and tourist hub. Appointment slots are monitored and secured 24/7 by our team.";
      } else if (c.name === "Portugal") {
        desc = "Portugal is highly popular for beach and cultural trips. Applications are processed via VFS centers in London and Manchester.";
      } else if (c.name === "Austria") {
        desc = "Austria is famous for ski resorts and Vienna tours. Accommodation proofs and financial stability are strictly verified.";
      } else if (c.name === "Belgium") {
        desc = "Belgium is highly accessible via Eurostar from St Pancras. The ideal destination for short weekend breaks.";
      }
      return {
        image: c.flag,
        link: `/schengen-visa/${c.slug}`,
        title: c.name,
        description: desc,
      };
    });
  }, []);

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-20 pb-32 transition-colors duration-300">
      <div className="w-full">
        
        {/* Intro Hub Header */}
        <div className="text-center max-w-4xl mx-auto mb-10 px-8 sm:px-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-4 text-zinc-900 dark:text-white"
          >
            Schengen tourist visas,{" "}
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
            className="font-sans text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-light leading-relaxed"
          >
            The embassy fee is set by EU regulation and is the same for every Schengen country. What can vary is your document checklist and processing time — we confirm both for your exact destination, free, before you pay anything.
          </motion.p>
        </div>

        {/* 1. QuickVisa Assurance Process Block (2.5) */}
        <div className="mb-24 text-center px-8 sm:px-16 max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-zinc-900 dark:text-white tracking-tight"
          >
            The QuickVisa <Highlighter action="underline" color="#C99537" strokeWidth={2.5} isView={true}>Assurance Process.</Highlighter>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-600 dark:text-zinc-455 font-light max-w-2xl mx-auto mb-16"
          >
            Our systematic approach to auditing files, preparing applications, and booking appointments.
          </motion.p>
          
          <VerticalAccordion />
        </div>

        {/* 2. Interactive Country Grid (2.6) */}
        <div className="text-center pt-8">
          <div className="max-w-7xl mx-auto px-8 sm:px-16 mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium mb-4 text-zinc-900 dark:text-white tracking-tight"
            >
              Schengen <Highlighter action="underline" color="#C99537" strokeWidth={2.5} isView={true}>Destinations.</Highlighter>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-sans text-base sm:text-lg text-zinc-600 dark:text-zinc-455 font-light max-w-2xl mx-auto"
            >
              Choose your destination below to see specific fees, checklists, and embassy guidelines.
            </motion.p>
          </div>
          <div className="max-w-7xl mx-auto px-8 sm:px-16 pb-12">
            <div className="w-full h-[550px] md:h-[680px] relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl shadow-inner">
              <InfiniteMenu
                items={menuItems}
                scale={INFINITE_MENU_CONFIG.scale}
                flagSizeFactor={INFINITE_MENU_CONFIG.flagSizeFactor}
                borderColor={INFINITE_MENU_CONFIG.borderColor}
                borderWidth={INFINITE_MENU_CONFIG.borderWidth}
              />
            </div>
          </div>


          <div className="mt-12 flex justify-center pb-12">
            <Link 
              href="/contact-us"
              className="px-8 py-4 bg-primary text-white font-bold border-3 border-black dark:border-white hover:bg-[#B58532] hover:scale-105 active:scale-98 transition-all cursor-pointer shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] shrink-0"
            >
              Book Visa Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
