"use client";

import React from "react";
import { motion } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";
import { ThemeButton } from "@/components/ThemeButton";

export default function Pricing() {
  const tiers = [
    {
      name: "Schengen Eligibility Check",
      price: "£0",
      period: "Free Assessment",
      description: "Complete qualification check before you pay a single penny.",
      features: [
        "Embassy destination validation",
        "Document check (BRP status & history)",
        "Appointment slot availability check",
        "No obligation consultation review"
      ],
      buttonText: "Start Free Assessment",
      buttonHref: "/contact-us",
      popular: false
    },
    {
      name: "Premium Visa Pack Assured",
      price: "£199",
      period: "per applicant",
      description: "Full service visa compilation, checklist drafting, and booking.",
      features: [
        "Custom document checklists & templates",
        "Official application form compilation",
        "Embassy-ready travel cover letters",
        "Flight & hotel reservation drafts",
        "24/7 priority slot tracking & booking",
        "Accountability Promise refund cover"
      ],
      buttonText: "Book Premium Visa Pack",
      buttonHref: "/contact-us",
      popular: true
    },
    {
      name: "Priority VIP Fast-Track",
      price: "£349",
      period: "per applicant",
      description: "Urgent visa scheduling and direct case manager monitoring.",
      features: [
        "Everything in Premium Visa Pack",
        "Same-day documentation reviews",
        "Dedicated case manager WhatsApp line",
        "Priority slot booking tracking",
        "Pre-appointment briefing review"
      ],
      buttonText: "Book VIP Fast-Track",
      buttonHref: "/contact-us",
      popular: false
    }
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-32 pb-48 px-8 sm:px-16 md:px-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight mb-6 text-zinc-900 dark:text-white"
          >
            Clear, upfront pricing — <br />
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
            className="font-sans text-lg sm:text-xl text-zinc-650 dark:text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto"
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
              className={`flex flex-col justify-between p-8 rounded-2xl border transition-all duration-300 relative ${
                tier.popular
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
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white">
                    {tier.price}
                  </span>
                  <span className="font-sans text-zinc-500 dark:text-zinc-400 text-xs font-light">
                    / {tier.period}
                  </span>
                </div>
                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm font-light text-zinc-700 dark:text-zinc-300">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
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
