"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function RefundPolicy() {
  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24 px-8 sm:px-16 md:px-24">
      <div className="max-w-3xl mx-auto text-left space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-white mb-2"
          >
            Refund & Cancellation Policy
          </motion.h1>
          <span className="text-zinc-500 font-sans text-xs uppercase tracking-wider block">
            Plain English Draft • Last Reviewed: 2026-07-23
          </span>
        </div>

        <p className="font-sans text-sm sm:text-base text-zinc-400 font-light leading-relaxed italic">
          Most companies hide this page. We link to it from our homepage, because it's the clearest proof of how we work.
        </p>

        {/* Sections */}
        <div className="space-y-6 font-sans text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">1. What you pay for</h3>
            <p>
              Our service fee pays for professional work: assessing your case, building your document checklist, reviewing everything, booking your appointment, and monitoring your application. It is a fee for work performed — not a fee for a visa. No consultancy can sell you a guaranteed visa; anyone who says otherwise is lying to you.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">2. The deposit</h3>
            <p>
              Your deposit of <strong>£150</strong> starts your case. If you cancel before we have begun work on your file, we refund it in full. Once work has begun, the deposit covers the work already done and is non-refundable. The balance of <strong>£140</strong> is due as soon as your biometrics appointment is secured.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">3. Embassy fees</h3>
            <p>
              Embassy and visa-centre fees are paid to the embassy, not to us. They are outside our control and are not refundable by us under any circumstances.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">4. Our Accountability Promise</h3>
            <p>
              If your application is refused because of a documented error on our side — a mistake in your application, a missed document we were responsible for checking, a deadline we caused you to miss — we refund our full service fee (£290). We will tell you plainly whether the error was ours; you will not have to fight us for it.
            </p>
            <div className="bg-zinc-950 border border-white/5 p-4 rounded-lg mt-2 space-y-2 text-xs sm:text-sm">
              <strong className="text-primary block">What the promise doesn't cover:</strong>
              <ul className="list-disc list-inside text-zinc-400 space-y-1">
                <li>Refusals based on the embassy's judgement of your circumstances (finances, travel history, ties to the UK).</li>
                <li>Information you didn't disclose to us.</li>
                <li>Documents that were not genuine.</li>
              </ul>
              <span className="text-[11px] text-zinc-500 block italic pt-2">
                We will always tell you before applying if we believe your case is weak.
              </span>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">5. Refund handling</h3>
            <p>
              Approved refunds are paid to your original payment method within 14 days of confirming the refund agreement.
            </p>
          </section>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/10 pt-8 mt-12 flex justify-between items-center text-xs font-sans">
          <Link href="/service-terms" className="text-primary hover:text-white underline transition-colors">
            Service Terms
          </Link>
          <Link href="/privacy-policy" className="text-zinc-500 hover:text-white underline transition-colors">
            Privacy Policy
          </Link>
        </div>

      </div>
    </div>
  );
}
