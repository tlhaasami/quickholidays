"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </motion.h1>
          <span className="text-zinc-500 font-sans text-xs uppercase tracking-wider block">
            Plain English Draft • Last Reviewed: 2026-07-23
          </span>
        </div>

        <p className="font-sans text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
          At Quick Holidays Ltd, we respect your privacy and are committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR).
        </p>

        {/* Content */}
        <div className="space-y-6 font-sans text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">1. What we collect and why</h3>
            <p>
              We collect identity documents (passport details, UK BRP cards or eVisa status), financial documents (bank statements, payslips), contact details (name, email, phone), and travel itineraries. We collect this information solely to assess your Schengen eligibility, compile your checklist, and prepare your visa application.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">2. Legal basis (UK GDPR)</h3>
            <p>
              We process your data on the legal basis of performing our contract with you (preparing your visa file). Any special-category data (like health details or biometric booking details) is processed only with your explicit consent.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">3. Storage and security</h3>
            <p>
              All personal data is encrypted at rest and in transit. Access is limited strictly to staff members actively working on your case file. Original physical documents are stored securely and returned immediately after review.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">4. Data retention</h3>
            <p>
              Case files and document copies are securely stored for 24 months after a visa decision is returned. This retention period allows us to support you in follow-ups or subsequent applications, after which your documents are permanently deleted/destroyed.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">5. Sharing third-parties</h3>
            <p>
              We share your documents only with the corresponding Schengen country embassy and their official outsourcing center (TLScontact or VFS Global), or the travel insurer issuing your medical certificate. We never sell your data or share it with third parties for marketing.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl sm:text-2xl text-white font-semibold">6. Your rights</h3>
            <p>
              You have the right to access, correct, or request deletion of your personal data, or file a complaint with the UK Information Commissioner's Office (ICO, registration number [ICO NO.] if applicable). For requests, contact us at{" "}
              <a href="mailto:info@quickholidays.co.uk" className="text-primary hover:text-white underline">
                info@quickholidays.co.uk
              </a>.
            </p>
          </section>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/10 pt-8 mt-12 flex justify-between items-center text-xs font-sans">
          <Link href="/service-terms" className="text-primary hover:text-white underline transition-colors">
            Service Terms
          </Link>
          <Link href="/refund-policy" className="text-zinc-500 hover:text-white underline transition-colors">
            Refund Policy
          </Link>
        </div>

      </div>
    </div>
  );
}
