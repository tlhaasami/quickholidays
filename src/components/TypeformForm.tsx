"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COUNTRIES } from "@/constants";
import { trackLead, trackFormAbandon } from "@/lib/analytics";
import Link from "next/link";

const COMMON_NATIONALITIES = [
  "Indian", "Pakistani", "Nigerian", "Chinese", "Filipino", 
  "South African", "Russian", "Turkish", "Brazilian", "Egyptian",
  "Ghanaian", "Bangladeshi", "Vietnamese", "Indonesian", "Thai",
  "Kenyan", "Mexican", "Ukrainian", "Iranian", "Iraqi"
].sort();

interface TypeformFormProps {
  defaultDestination?: string;
}

export function TypeformForm({ defaultDestination = "france" }: TypeformFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    nationality: "",
    destination: defaultDestination,
    priorVisas: "None",
    channel: "WhatsApp",
    comment: ""
  });

  const [nationalitySearch, setNationalitySearch] = useState("");
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const nationalityContainerRef = useRef<HTMLDivElement>(null);

  // Tracks the current step ref for abandonment analytics
  const stepRef = useRef(1);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    // Detect form abandonment on component unmount
    return () => {
      if (!hasSubmitted.current && stepRef.current < 5) {
        trackFormAbandon(stepRef.current, `step-${stepRef.current}`);
      }
    };
  }, []);

  // Handle outside clicks for nationality search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (nationalityContainerRef.current && !nationalityContainerRef.current.contains(e.target as Node)) {
        setShowNationalityDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.phone || !formData.email)) return;
    if (step === 2 && (!formData.nationality || !formData.destination)) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hasSubmitted.current = true;
    trackLead(formData.email, {
      name: formData.name,
      phone: formData.phone,
      nationality: formData.nationality,
      destination: formData.destination,
      priorVisas: formData.priorVisas,
      channel: formData.channel,
      comment: formData.comment
    });
    setStep(5); // Success Screen
  };

  const filteredNationalities = COMMON_NATIONALITIES.filter((n) =>
    n.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-xl mx-auto bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Step Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-900">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "20%" }}
          animate={{ width: `${Math.min(step * 25, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <form onSubmit={handleSubmit} className="p-8 sm:p-12 min-h-[380px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-left">
                <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Step 01 / 04</span>
                <h3 className="text-white font-serif text-2xl mt-1 font-semibold">Introduce yourself</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +44 7700 900077"
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-left">
                <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Step 02 / 04</span>
                <h3 className="text-white font-serif text-2xl mt-1 font-semibold">Nationality & Destination</h3>
              </div>
              <div className="space-y-4">
                {/* Searchable Nationality */}
                <div ref={nationalityContainerRef} className="relative">
                  <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Nationality</label>
                  <input
                    type="text"
                    required
                    value={nationalitySearch || formData.nationality}
                    onFocus={() => setShowNationalityDropdown(true)}
                    onChange={(e) => {
                      setNationalitySearch(e.target.value);
                      setFormData({ ...formData, nationality: e.target.value });
                    }}
                    placeholder="Search nationality (e.g. Indian)"
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  {showNationalityDropdown && filteredNationalities.length > 0 && (
                    <div className="absolute left-0 right-0 mt-1 bg-zinc-900 border border-white/10 rounded-lg z-50 shadow-2xl max-h-40 overflow-y-auto no-scrollbar">
                      {filteredNationalities.map((nat) => (
                        <button
                          key={nat}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, nationality: nat });
                            setNationalitySearch(nat);
                            setShowNationalityDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                          {nat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination Country */}
                <div>
                  <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Destination Country</label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.slug} value={c.slug} className="bg-zinc-950">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-left">
                <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Step 03 / 04</span>
                <h3 className="text-white font-serif text-2xl mt-1 font-semibold">Your Travel History</h3>
              </div>
              <div>
                <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider mb-3">
                  Schengen visas issued in the past 4 years
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["None", "1", "2", "3+"].map((num) => {
                    const isSelected = formData.priorVisas === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, priorVisas: num })}
                        className={`py-4 rounded-xl border text-sm font-sans font-medium transition-all ${
                          isSelected
                            ? "bg-primary border-primary text-white font-semibold"
                            : "bg-zinc-900/30 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {num === "None" ? "No Prior Visas" : `${num} Visa${num !== "1" ? "s" : ""}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-left">
                <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Step 04 / 04</span>
                <h3 className="text-white font-serif text-2xl mt-1 font-semibold">Preferred Response Channel</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "WhatsApp", label: "WhatsApp", icon: "💬" },
                    { value: "Call", label: "Phone Call", icon: "📞" },
                    { value: "Email", label: "Email", icon: "✉" }
                  ].map((ch) => {
                    const isSelected = formData.channel === ch.value;
                    const isWhatsApp = ch.value === "WhatsApp";
                    return (
                      <button
                        key={ch.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, channel: ch.value })}
                        className={`py-3 px-2 rounded-lg border text-xs font-sans font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? isWhatsApp
                              ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse"
                              : "bg-primary border-primary text-white"
                            : "bg-zinc-900/30 border-white/10 text-zinc-400 hover:border-white/20"
                        }`}
                      >
                        <span className="text-lg">{ch.icon}</span>
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Anything we should know? (Optional)</label>
                  <textarea
                    rows={2}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="e.g. Travel dates, visa refusal history..."
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center py-8"
            >
              <div className="w-16 h-16 bg-primary/25 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/45">
                <span className="text-3xl text-primary">✓</span>
              </div>
              <h3 className="text-white font-serif text-3xl font-bold tracking-tight">Thank you!</h3>
              <p className="font-sans text-zinc-400 text-sm font-light leading-relaxed max-w-sm mx-auto">
                Your consultation request has been submitted successfully. We will reach back to you via <strong className="text-primary">{formData.channel}</strong> within 1 working day.
              </p>
              <div className="pt-6">
                <Link
                  href="/how-it-works"
                  className="px-6 py-3 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-lg transition-colors inline-block"
                >
                  See what happens next →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Controls */}
        {step < 5 && (
          <div className="border-t border-white/5 pt-6 mt-8 flex flex-col space-y-4">
            <div className="flex justify-between items-center w-full gap-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-5 py-3 border border-white/15 hover:bg-white/5 text-zinc-300 font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 shadow-lg ml-auto"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg ml-auto"
                >
                  Book My Free Consultation
                </button>
              )}
            </div>
            
            <p className="text-[10px] text-zinc-500 leading-normal text-left">
              {step === 4 ? (
                <span>We'll come back to you within one working day. Your details are handled under our <Link href="/privacy-policy" className="underline hover:text-white transition-colors">Privacy Policy</Link> and never sold or shared for marketing.</span>
              ) : (
                <span>By continuing, you agree to our <Link href="/service-terms" className="underline hover:text-white transition-colors">Service Terms</Link> and data handling.</span>
              )}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
