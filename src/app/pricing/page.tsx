"use client";

import React from "react";
import { motion } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";
import { ThemeButton } from "@/components/ThemeButton";

export default function Pricing() {
  const tiers = [
    {
      name: "Complete Visa Service",
      originalPrice: "£270",
      price: "£175",
      period: "per applicant",
      description: "Everything handled. Start to finish. Nothing left for you to figure out.",
      features: [
        "Free consultation — cost, checklist, timeline, before you pay",
        "Document checklist, built for your situation",
        "Cover letter, written for you",
        "Visa application forms, completed for you",
        "Travel insurance, sorted",
        "Appointment booked and confirmed — your letter, ready",
        "Flights & hotels — refundable options, booked in your name. No markup. No lock-in.",
        "Tracked to decision day"
      ],
      footerNote: "One price. Every step covered.",
      buttonText: "Book Complete Service",
      buttonHref: "/contact-us",
      popular: true
    },
    {
      name: "Documentation Service",
      originalPrice: "£145",
      price: "£95",
      period: "per applicant",
      description: "Your paperwork, done right — you handle the appointment yourself.",
      features: [
        "Document checklist, built for your situation",
        "Cover letter, written for you",
        "Travel insurance, sorted",
        "Flights & hotels — refundable options, booked in your name"
      ],
      footerNote: "Not included: appointment booking, visa application form.",
      buttonText: "Book Documentation Service",
      buttonHref: "/contact-us",
      popular: false
    },
    {
      name: "Appointment Booking Service",
      originalPrice: "£145",
      price: "£95",
      period: "per applicant",
      description: "Already have your documents ready? This is for you.",
      features: [
        "Appointment booked and confirmed at your preferred centre",
        "Visa application form, completed for you"
      ],
      footerNote: "Fast, simple, done.",
      buttonText: "Book Appointment Booking",
      buttonHref: "/contact-us",
      popular: false
    }
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-20 pb-36 px-8 sm:px-16 md:px-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-4 text-zinc-900 dark:text-white"
          >
            Clear, upfront pricing —{" "}
            <span className="text-primary">
              <Highlighter action="underline" color="#CCA352" strokeWidth={2.5} isView={true}>
                backed by accountability.
              </Highlighter>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto"
          >
            No hidden fees. Check eligibility for free. Only pay deposit to open your case file.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto text-left">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300 relative ${tier.popular
                  ? "bg-zinc-50 dark:bg-zinc-900/60 border-primary shadow-2xl scale-102 z-10"
                  : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10"
                }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] tracking-widest font-sans font-bold uppercase py-1 px-3 rounded-full shadow-lg">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="font-serif text-2xl font-semibold mb-2 text-zinc-900 dark:text-white">
                  {tier.name}
                </h3>
                <p className="font-sans text-zinc-500 dark:text-zinc-400 text-xs mb-6 font-light">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-1.5 mb-6">
                  {tier.originalPrice && (
                    <span className="line-through text-zinc-400 dark:text-zinc-500 text-lg sm:text-xl font-normal mr-1">
                      {tier.originalPrice}
                    </span>
                  )}
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white">
                    {tier.price}
                  </span>
                  <span className="font-sans text-zinc-500 dark:text-zinc-400 text-xs font-light ml-1">
                    / {tier.period}
                  </span>
                </div>
                <ul className="space-y-3.5 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm font-light text-zinc-700 dark:text-zinc-300">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {tier.footerNote && (
                  <p className="font-sans text-xs italic text-zinc-500 dark:text-zinc-400 mb-6 font-light">
                    {tier.footerNote}
                  </p>
                )}
              </div>
              <ThemeButton href={tier.buttonHref}>
                {tier.buttonText}
              </ThemeButton>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
