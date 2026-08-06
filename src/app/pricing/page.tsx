"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";
import { ThemeButton } from "@/components/ThemeButton";

export default function Pricing() {
  useEffect(() => {
    document.title = "Service Pricing & Fees | Quick Holidays";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "View transparent pricing structures for Schengen visa document checking, VFS/TLS slot booking, and full end-to-end consulting.");
    }
  }, []);

  const tiers = [
    {
      name: "Complete Visa Service",
      originalPrice: "£270",
      price: "£175",
      period: "per applicant",
      depositNote: "£45 case deposit to start • £130 balance after slot is secured",
      description: "Everything handled. Start to finish. Nothing left for you to figure out. This is our premium, end-to-end service designed for maximum peace of mind. We take over the entire process so you can focus on planning your trip, knowing every detail is managed by professionals.",
      features: [
        "Consultation: Cost, checklist, and timeline assessment provided before you pay.",
        "Custom Document Checklist: Built perfectly for your exact situation and profile.",
        "Professional Cover Letter: Written for you to present a compelling and accurate itinerary to the embassy.",
        "Visa Application Forms: Completed for you to ensure zero errors.",
        "Travel Insurance: Sorted and guaranteed to meet Schengen requirements.",
        "Appointment Booking & Confirmation: Your appointment is booked and confirmed, with your letter ready.",
        <span>Flight & Hotel: Guidance on cheapest options <strong className="text-primary font-semibold">(booking costs paid by you directly)</strong>.</span>,
        "Tracked to Decision Day: Continuous monitoring of your application status."
      ],
      footerNote: "One price. Every step covered.",
      buttonText: "Book Complete Service",
      buttonHref: "/contact-us?plan=complete",
      popular: true
    },
    {
      name: "Documentation Service",
      originalPrice: "£145",
      price: "£95",
      period: "per applicant",
      description: "Your paperwork, done right — you handle the appointment yourself. This package is ideal if you already have an appointment booked or prefer to manage the portal yourself, but want the assurance that your file is flawless.",
      features: [
        "Document Checklist: Built precisely for your personal and financial profile.",
        "Professional Cover Letter: Expertly written for you.",
        "Travel Insurance: Sorted for your exact travel dates.",
        <span>Flight & Hotel: Guidance on cheapest options <strong className="text-primary font-semibold">(booking costs paid by you directly)</strong>.</span>
      ],
      notIncluded: [
        "Appointment booking & confirmation",
        "Visa application form completion",
        "Tracked to Decision Day status monitoring",
        "Pre-payment eligibility consultation"
      ],
      buttonText: "Book Documentation Service",
      buttonHref: "/contact-us?plan=documentation",
      popular: false
    },
    {
      name: "Appointment Booking Service",
      originalPrice: "£145",
      price: "£95",
      period: "per applicant",
      description: "Already have your documents ready? This is for you. Appointment slots disappear in seconds. With this service, our processing team uses their continuous monitoring systems to secure your spot without the headache.",
      features: [
        "Appointment Booking: Secured and confirmed at your preferred centre.",
        "Visa Application Form: Completed for you accurately."
      ],
      notIncluded: [
        "Custom Document Checklist",
        "Professional Cover Letter",
        "Travel Insurance sorted",
        "Flight & Hotel booking guidance",
        "Tracked to Decision Day status monitoring",
        "Pre-payment eligibility consultation"
      ],
      buttonText: "Book Appointment Booking",
      buttonHref: "/contact-us?plan=appointment",
      popular: false
    }
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-20 pb-36 px-8 sm:px-16 md:px-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-16">
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

        {/* Initial Deposit Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="inline-flex items-center gap-3 bg-primary/8 border border-primary/25 rounded-2xl px-6 py-4 mb-12 text-left max-w-xl mx-auto"
        >
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
          <div>
            <p className="font-sans text-xs font-bold text-primary uppercase tracking-wider mb-0.5">How payment works</p>
            <p className="font-sans text-sm text-zinc-700 dark:text-zinc-300 font-light leading-snug">
              The <span className="font-semibold text-zinc-900 dark:text-white">Complete Visa Service</span> starts with a <span className="font-semibold text-zinc-900 dark:text-white">£45 initial deposit</span> to open your case file — the remaining £130 balance is only collected once your appointment slot is confirmed.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch max-w-7xl mx-auto text-left">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 relative ${
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
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-sm font-light text-zinc-700 dark:text-zinc-300">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {tier.notIncluded && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/5 mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">What is NOT Included:</span>
                    <ul className="space-y-2">
                      {tier.notIncluded.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 line-through">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500 shrink-0">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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

        {/* Third-Party Fees Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 max-w-4xl mx-auto p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-white/5 text-left"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest block">
                Required External Costs
              </span>
              <h3 className="font-serif text-2xl font-medium text-zinc-900 dark:text-white tracking-tight">
                Third-Party & Embassy Fees
              </h3>
              <p className="font-sans text-sm text-zinc-650 dark:text-zinc-400 font-light leading-relaxed">
                The fees paid to consulates and booking centers are set by regulation and are separate from our service pricing. We never markup these fees — you pay them directly:
              </p>
              <ul className="space-y-2 text-xs font-sans text-zinc-600 dark:text-zinc-400 font-light">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span><strong>Embassy Visa Fee:</strong> €90 (~£78) for adults, €45 (~£39) for children aged 6-12, free for under 6. Paid directly at VFS or TLS.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  <span>For Denmark, Norway and Sweden, the visa fee is paid online on behalf of the customer. This fee is not included in our services.</span>
                </li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 flex flex-col justify-center items-start shrink-0 md:w-64">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                Accountability Promise
              </span>
              <span className="font-serif text-base font-semibold text-zinc-900 dark:text-white mb-2 leading-tight">
                Mistake refund policy
              </span>
              <p className="font-sans text-[11px] text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mb-4">
                If a visa refusal is caused by an administrative checklist check omission on our end, we refund your consulting fees in full.
              </p>
              <a href="/refund-policy" className="text-xs text-primary font-semibold hover:underline font-sans">
                Read Refund Policy →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
