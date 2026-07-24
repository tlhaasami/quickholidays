"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function ServiceTerms() {
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
            Visa & Immigration Service Terms
          </motion.h1>
          <span className="text-zinc-500 font-sans text-xs uppercase tracking-wider block">
            Plain English Draft • Last Reviewed: 2026-07-23
          </span>
        </div>

        <p className="font-sans text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
          These terms outline the agreement between Quick Holidays Ltd and you for visa consulting, checklists, and document verification services.
        </p>

        {/* Content */}
        <div className="space-y-6 font-sans text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">1. Scope of Service</h3>
            <p>
              We provide consultancy, document verification, appointment booking assistance, and application monitoring for Schengen short-stay tourist visas. We are not a government body, embassy, or law firm, and we do not decide visa outcomes. Decision-making authority rests solely with the corresponding consulate.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">2. Service Fees</h3>
            <p>
              Our fees are for professional document preparation work performed, not for the final outcome of your application. Payment of deposits and balances follows the timeline specified in our{" "}
              <Link href="/refund-policy" className="text-primary hover:text-white underline transition-colors">
                Refund & Cancellation Policy
              </Link>.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">3. Client Responsibilities</h3>
            <p>
              You must provide truthful, complete, and genuine information and documents. You must attend your biometrics appointment in person. We will refuse to submit any application we believe contains false or altered information — without refund of work already performed.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">4. Processing Timelines</h3>
            <p>
              Timelines are set by consulates and change without notice. Timelines we quote are realistic estimates based on past applications, not guarantees. We are not liable for travel plans disrupted by consular delays.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">5. Refusals & Liability</h3>
            <p>
              In the event of a refusal, our liability is strictly limited to the service fee refund standard outlined in our Accountability Promise (documented Quick Holidays error only). We are not liable for flight costs, hotel bookings, or third-party visa appointment center fees.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">6. Document Handling & Liability</h3>
            <p>
              Original documents in our care are stored securely and returned by [METHOD]. Our liability for loss or damage of original documents is limited to [LIABILITY CAP — solicitor to advise].
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">7. Regulatory Disclosure</h3>
            <p>
              Quick Holidays Ltd provides administrative document compiling and booking assistance. We do not provide UK immigration advice or visa representation under the Office of the Immigration Services Commissioner (OISC) rules, as our work is restricted to foreign Schengen country tourist applications.
            </p>
          </section>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/10 pt-8 mt-12 flex justify-between items-center text-xs font-sans">
          <Link href="/refund-policy" className="text-primary hover:text-white underline transition-colors">
            Refund & Cancellation Policy
          </Link>
          <Link href="/privacy-policy" className="text-zinc-500 hover:text-white underline transition-colors">
            Privacy Policy
          </Link>
        </div>

      </div>
    </div>
  );
}
