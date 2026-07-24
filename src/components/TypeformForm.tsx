"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COUNTRIES } from "@/constants";
import { trackLead, trackFormAbandon } from "@/lib/analytics";
import Link from "next/link";
import { ThemeButton } from "@/components/ThemeButton";
import { CoolMode } from "@/components/ui/cool-mode";

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
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const destinationContainerRef = useRef<HTMLDivElement>(null);
  
  // Tracks the current step ref for abandonment analytics
  const stepRef = useRef(1);
  const hasSubmitted = useRef(false);

  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const showWarning = (msg: string) => {
    setNotification({ message: msg, type: "error" });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

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

  // Handle outside clicks for destination dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (destinationContainerRef.current && !destinationContainerRef.current.contains(e.target as Node)) {
        setShowDestinationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        showWarning("Please enter your full name.");
        return;
      }
      if (!formData.phone.trim()) {
        showWarning("Please enter your phone number.");
        return;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        showWarning("Please enter a valid email address.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.nationality.trim()) {
        showWarning("Please select or enter your nationality.");
        return;
      }
      if (!formData.destination.trim()) {
        showWarning("Please choose a destination country.");
        return;
      }
    }
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
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl relative transition-colors duration-300">
      {/* Step Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-900">
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
                <h3 className="text-zinc-900 dark:text-white font-serif text-2xl mt-1 font-semibold">Introduce yourself</h3>
              </div>
              <div className="space-y-8 mt-4">
                <div className="brutalist-container">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="brutalist-input smooth-type"
                  />
                  <label className="brutalist-label">Full Name</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="brutalist-container">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +44 7700 900077"
                      className="brutalist-input smooth-type"
                    />
                    <label className="brutalist-label">Phone Number</label>
                  </div>
                  <div className="brutalist-container">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="brutalist-input smooth-type"
                    />
                    <label className="brutalist-label">Email Address</label>
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
                <h3 className="text-zinc-900 dark:text-white font-serif text-2xl mt-1 font-semibold">Nationality & Destination</h3>
              </div>
              <div className="space-y-8 mt-6">
                {/* Searchable Nationality */}
                <div ref={nationalityContainerRef} className="brutalist-container">
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
                    className="brutalist-input smooth-type"
                  />
                  <label className="brutalist-label">Nationality</label>
                  {showNationalityDropdown && filteredNationalities.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border-3 border-black dark:border-white z-50 shadow-2xl max-h-40 overflow-y-auto no-scrollbar">
                      {filteredNationalities.map((nat) => (
                        <button
                          key={nat}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, nationality: nat });
                            setNationalitySearch(nat);
                            setShowNationalityDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-300 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors font-bold"
                        >
                          {nat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination Country */}
                <div ref={destinationContainerRef} className="brutalist-container">
                  <button
                    type="button"
                    onClick={() => setShowDestinationDropdown(!showDestinationDropdown)}
                    className="w-full text-left brutalist-input cursor-pointer font-bold flex items-center justify-between pointer-events-auto bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white"
                  >
                    <span>
                      {COUNTRIES.find((c) => c.slug === formData.destination)?.name || "Select Country"}
                    </span>
                    <svg
                      className={`w-4 h-4 text-zinc-500 transition-transform duration-200 shrink-0 ${showDestinationDropdown ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <label className="brutalist-label">Destination Country</label>
                  {showDestinationDropdown && (
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border-3 border-black dark:border-white z-50 shadow-2xl max-h-[252px] overflow-y-auto no-scrollbar pointer-events-auto">
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, destination: c.slug });
                            setShowDestinationDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${
                            formData.destination === c.slug
                              ? "bg-[#C99537] text-white"
                              : "text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
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
                <h3 className="text-zinc-900 dark:text-white font-serif text-2xl mt-1 font-semibold">Your Travel History</h3>
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
                            : "bg-zinc-100 dark:bg-zinc-900/30 border-zinc-200 dark:border-white/10 text-zinc-650 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white"
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
                <h3 className="text-zinc-900 dark:text-white font-serif text-2xl mt-1 font-semibold">Preferred Response Channel</h3>
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
                            : "bg-zinc-100 dark:bg-zinc-900/30 border-zinc-200 dark:border-white/10 text-zinc-650 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white"
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
                    className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-zinc-900 dark:text-white font-sans text-sm focus:outline-none focus:border-primary transition-colors resize-none"
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
              <h3 className="text-zinc-900 dark:text-white font-serif text-3xl font-bold tracking-tight">Thank you!</h3>
              <p className="font-sans text-zinc-650 dark:text-zinc-400 text-sm font-light leading-relaxed max-w-sm mx-auto">
                Your consultation request has been submitted successfully. We will reach back to you via <strong className="text-primary">{formData.channel}</strong> within 1 working day.
              </p>
              <div className="pt-6">
                <ThemeButton href="/how-it-works">
                  See what happens next
                </ThemeButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wizard Controls */}
        {step < 5 && (
          <div className="border-t border-zinc-200 dark:border-white/5 pt-6 mt-8 flex flex-col space-y-4">
            <div className="flex justify-between items-center w-full gap-4">
              {step > 1 ? (
                <ThemeButton
                  type="button"
                  onClick={prevStep}
                  hideArrow={true}
                >
                  Back
                </ThemeButton>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <CoolMode>
                  <ThemeButton
                    type="button"
                    onClick={nextStep}
                  >
                    Continue
                  </ThemeButton>
                </CoolMode>
              ) : (
                <CoolMode>
                  <ThemeButton
                    type="submit"
                  >
                    Book My Free Consultation
                  </ThemeButton>
                </CoolMode>
              )}
            </div>
            
            <p className="text-[10px] text-zinc-500 leading-normal text-left">
              {step === 4 ? (
                <span>We'll come back to you within one working day. Your details are handled under our <Link href="/privacy-policy" className="underline hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link> and never sold or shared for marketing.</span>
              ) : (
                <span>By continuing, you agree to our <Link href="/service-terms" className="underline hover:text-zinc-900 dark:hover:text-white transition-colors">Service Terms</Link> and data handling.</span>
              )}
            </p>
          </div>
        )}
      </form>

      {/* Floating Side Toast Validation Notice */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-24 right-6 sm:bottom-6 sm:right-6 z-[99999] bg-zinc-950 border border-red-500/30 text-white px-5 py-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex items-center gap-3.5 max-w-sm pointer-events-auto"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-500">Validation Notice</h4>
              <p className="text-[13px] text-zinc-300 font-medium leading-normal mt-0.5">{notification.message}</p>
            </div>
            <button 
              type="button"
              onClick={() => setNotification(null)} 
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
