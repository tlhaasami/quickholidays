"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";
import { ThemeButton } from "@/components/ThemeButton";
import Link from "next/link";

export default function RefusedBeforePage() {
  useEffect(() => {
    document.title = "Schengen Visa Reapplication Guide | Quick Holidays";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Step-by-step reapplication strategy for Schengen visa refusals. Learn how to address rejection reason codes and draft rebuttals.");
    }
  }, []);

  const refusalReasons = [
    {
      code: "Reason 2",
      title: "Purpose and conditions of the intended stay were not justified",
      description: "This is the most common refusal code. It means the embassy doubted your travel plans, found gaps in your daily itinerary, or suspected that your flight and hotel bookings were not legitimate.",
      causes: [
        "Generic or copy-pasted cover letters that do not explain why you are visiting.",
        "Mismatching travel dates between your flight reservation, hotel booking, and cover letter.",
        "Using obvious 'dummy' hotel reservations that were cancelled before the embassy checked them."
      ],
      solution: "Provide a detailed, day-by-day travel itinerary. Use real, flexible/refundable hotel bookings and keep them active until your passport is returned. Write a personal cover letter detailing your travel motivations."
    },
    {
      code: "Reason 3",
      title: "Insufficient proof of financial means of subsistence",
      description: "The embassy wants to verify that you can comfortably afford your trip (typically £60-£100 per day) and return to the UK without needing public funds.",
      causes: [
        "Closing bank balances that are below the recommended threshold.",
        "Sudden, unexplained lump-sum deposits ('funds stuffing') right before exporting statements.",
        "Missing bank statements, or submitting credit card statements instead of debit checking/savings statements."
      ],
      solution: "Submit 3 consecutive months of official current bank statements showing a steady balance (ideally over £1,500). If you received a large deposit, you must submit proof of its source (e.g., payslips, transfer letters)."
    },
    {
      code: "Reason 8",
      title: "The information submitted regarding the purpose of stay was not reliable",
      description: "This means the visa officer suspects that you do not intend to leave the Schengen area before your visa expires, or that your documentation is untrustworthy.",
      causes: [
        "Your UK visa/BRP expires less than 90 days after your intended return date from Europe.",
        "No proof of ongoing employment, student registry, or family ties in the UK.",
        "Inconsistent details across employer verification letters."
      ],
      solution: "Submit an official, signed, and stamped employer letter confirming your salary, job title, and approved leave dates. Ensure your UK BRP is valid for at least 90 days past your trip exit date."
    }
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-24 pb-36 px-6 sm:px-12 md:px-24 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest block">
            Reapplication Guide
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white leading-tight">
            Refused a Schengen Visa?<br />
            <span className="text-primary">
              <Highlighter action="underline" color="#CCA352" strokeWidth={2.5} isView={true}>
                How to reapply successfully.
              </Highlighter>
            </span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
            A visa rejection is frustrating, but it is not a permanent ban. Schengen consulates refuse files for specific document discrepancies. By addressing the exact refusal code, you can secure an approval.
          </p>
        </div>

        {/* Step-by-Step Reapplication Process */}
        <div className="space-y-8 text-left">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-zinc-900 dark:text-white tracking-tight">
              Reapplication Roadmap
            </h2>
            <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 font-light mt-1">
              Follow these three crucial steps to rebuild your application successfully:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-white/10 space-y-3">
              <span className="font-serif text-3xl font-bold text-primary">01</span>
              <h4 className="font-serif text-base font-semibold text-zinc-900 dark:text-white">Audit the documentation</h4>
              <p className="font-sans text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                Compare your submitted bank statements, hotel bookings, and employment letters side-by-side to catch inconsistency points.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-white/10 space-y-3">
              <span className="font-serif text-3xl font-bold text-primary">02</span>
              <h4 className="font-serif text-base font-semibold text-zinc-900 dark:text-white">Draft a custom rebuttal</h4>
              <p className="font-sans text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                Your cover letter must address the refusal code explicitly, outlining the corrected information and counter-proof.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-white/10 space-y-3">
              <span className="font-serif text-3xl font-bold text-primary">03</span>
              <h4 className="font-serif text-base font-semibold text-zinc-900 dark:text-white">Secure a new appointment</h4>
              <p className="font-sans text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                Book a new slot at VFS/TLS. You must submit a brand new application form and updated 3-month bank statements.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Block */}
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 text-center space-y-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Let us audit your refusal letter.
          </h3>
          <p className="font-sans text-sm text-zinc-650 dark:text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
            Don't risk another rejection fee. Run your profile details through our eligibility tool first, or book a consultation with our Schengen visa consultants to prepare your rebuttal file.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link 
              href="/schengen-ready"
              className="px-6 py-3 rounded-xl border border-zinc-250 dark:border-white/10 text-xs font-sans font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all text-center"
            >
              Test Schengen Readiness
            </Link>
            <ThemeButton href="/contact-us">
              Book Reapplication Audit
            </ThemeButton>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link href="/" className="text-xs font-sans text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors underline">
            Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
