"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";
import { ThemeButton } from "@/components/ThemeButton";
import Link from "next/link";

interface Verdict {
  status: "green" | "yellow" | "red";
  title: string;
  reasons: string[];
  fixes: React.ReactNode[];
}

export default function SchengenReadyTool() {
  React.useEffect(() => {
    document.title = "Schengen Visa Eligibility Checker | Quick Holidays";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Check if you are ready to apply for a Schengen visa in 60 seconds. Test your BRP validity, passport rules, and financial savings.");
    }
  }, []);

  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Email Lead Capture State
  const [emailInput, setEmailInput] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Form State
  const [visaType, setVisaType] = useState("");
  const [brpExpiry, setBrpExpiry] = useState("");
  const [passportIssue, setPassportIssue] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [bankBalance, setBankBalance] = useState("");
  const [employment, setEmployment] = useState("");
  const [destination, setDestination] = useState("France");
  const [priorRefusal, setPriorRefusal] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [tripDuration, setTripDuration] = useState("7");

  // Options
  const visaOptions = [
    { label: "Physical BRP Card (Skilled Worker, Spouse, ILR, etc.)", value: "brp" },
    { label: "Digital eVisa / Skilled Worker on eVisa", value: "evisa" },
    { label: "EU Settlement Scheme (EUSS - Settled / Pre-Settled)", value: "euss" },
    { label: "Student Visa / Student Route (formerly Tier 4)", value: "student" },
    { label: "Graduate Visa", value: "graduate" },
    { label: "Dependant / PBS Dependant Visa", value: "dependant" },
    { label: "Standard Visitor / Tourist Visa", value: "tourist" }
  ];

  const balanceOptions = [
    { label: "Under £500", value: "under500" },
    { label: "£500 - £1,500", value: "500to1500" },
    { label: "£1,500 - £3,000", value: "1500to3000" },
    { label: "Over £3,000", value: "over3000" }
  ];

  const employmentOptions = [
    { label: "Employed (Full-Time or Part-Time)", value: "employed" },
    { label: "Self-Employed", value: "selfemployed" },
    { label: "Student", value: "student" },
    { label: "Sponsored Dependent / Housewife", value: "sponsored" },
    { label: "Unemployed", value: "unemployed" }
  ];

  const destinations = [
    "France", "Spain", "Germany", "Italy", "Greece", "Switzerland", 
    "Portugal", "Netherlands", "Austria", "Belgium", "Norway", "Sweden"
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const calculateVerdict = (): Verdict => {
    const reasons: string[] = [];
    const fixes: React.ReactNode[] = [];
    let isRed = false;
    let isYellow = false;

    const today = new Date();
    const parsedTravelStart = travelDate ? new Date(travelDate) : new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const parsedTravelEnd = new Date(parsedTravelStart.getTime() + (parseInt(tripDuration) || 7) * 24 * 60 * 60 * 1000);

    // 1. UK Visa Type Checks
    if (visaType === "tourist") {
      isRed = true;
      reasons.push("You hold a UK Standard Visitor or Tourist visa.");
      fixes.push("Schengen consulates in the UK do not accept visa applications from short-term tourists. You must return to your home country to apply.");
    }

    // 2. BRP/UK Visa Expiry Checks
    if (visaType !== "tourist" && brpExpiry) {
      const parsedBrpExpiry = new Date(brpExpiry);
      const minBrpDate = new Date(parsedTravelEnd.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days after exit
      
      if (parsedBrpExpiry < minBrpDate) {
        isRed = true;
        reasons.push("Your UK Residence Permit (BRP) expires too soon after your trip.");
        fixes.push("Schengen embassies require your UK visa to be valid for at least 90 days (3 months) past your travel return date. You should renew your BRP first.");
      }
    }

    // 3. Passport Issue & Expiry Checks
    if (passportIssue) {
      const parsedIssue = new Date(passportIssue);
      const tenYearsAgo = new Date(parsedTravelStart.getTime() - 10 * 365 * 24 * 60 * 60 * 1000);
      
      if (parsedIssue < tenYearsAgo) {
        isRed = true;
        reasons.push("Your passport was issued more than 10 years ago.");
        fixes.push("Schengen rules dictate that your passport must be issued within the last 10 years. You must renew your passport before applying.");
      }
    }

    if (passportExpiry) {
      const parsedExpiry = new Date(passportExpiry);
      const minExpiryDate = new Date(parsedTravelEnd.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days after exit

      if (parsedExpiry < minExpiryDate) {
        isRed = true;
        reasons.push("Your passport expires too soon after your intended return date.");
        fixes.push("Your passport must be valid for at least 90 days after you leave the Schengen zone. Renew your passport before booking VFS/TLS.");
      }
    }

    // 4. Proof of Funds Checks
    if (bankBalance === "under500") {
      isRed = true;
      reasons.push("Your personal UK bank balance is under £500.");
      fixes.push("The embassy requires proof of financial subsistence (typically £60-£100 per day of trip). A balance under £500 faces a high refusal risk. We recommend building savings to at least £1,500.");
    } else if (bankBalance === "500to1500") {
      isYellow = true;
      reasons.push("Your bank balance is low relative to standard consulate guidelines.");
      fixes.push("Ensure you provide 3 months of bank statements showing a steady closing balance. If possible, show a balance closer to £1,500 to secure approval.");
    }

    // 5. Employment Checks
    if (employment === "unemployed") {
      isYellow = true;
      reasons.push("Your employment status is listed as Unemployed.");
      fixes.push("Unemployed applicants must show strong financial independence (large personal savings) or provide a sponsor letter from a spouse or parent who is working.");
    } else if (employment === "selfemployed") {
      isYellow = true;
      reasons.push("You are Self-Employed.");
      fixes.push("Self-employed files require extra verification: you must submit your HMRC UTR letter, SA302 tax calculation, and an accountant letter.");
    } else if (employment === "sponsored") {
      isYellow = true;
      reasons.push("You are applying as a sponsored dependent.");
      fixes.push("You must provide your official marriage/birth certificate (translated to English if foreign) and your sponsor's employment letters + 3 months of bank statements.");
    }

    // 6. Prior Refusals
    if (priorRefusal === "yes") {
      isYellow = true;
      reasons.push("You have faced a Schengen visa refusal in the last 2 years.");
      fixes.push(
        <span>
          Your application requires a custom rebuttal cover letter addressing the exact refusal codes from your rejection letter to prove the issue is resolved. Read our dedicated{" "}
          <Link href="/refused-before" className="text-primary underline hover:text-[#C99537] font-semibold">
            Visa Refusal Guide
          </Link>
          .
        </span>
      );
    }

    if (isRed) {
      return {
        status: "red",
        title: "Not Ready Yet",
        reasons,
        fixes
      };
    }

    if (isYellow) {
      return {
        status: "yellow",
        title: "Ready with Fixes",
        reasons,
        fixes
      };
    }

    return {
      status: "green",
      title: "Schengen Ready!",
      reasons: ["Your passport is fully compliant.", "Your BRP validity meets the 90-day post-trip requirement.", "You have sufficient personal financial proof.", "Your travel itinerary meets the guidelines."],
      fixes: ["Everything looks perfect! You are ready to book your appointment and submit your documents."]
    };
  };

  const verdict = calculateVerdict();

  const isStepValid = () => {
    switch (step) {
      case 1: return visaType !== "";
      case 2: return visaType === "tourist" || brpExpiry !== "";
      case 3: return passportIssue !== "" && passportExpiry !== "";
      case 4: return bankBalance !== "";
      case 5: return employment !== "";
      case 6: return destination !== "";
      case 7: return priorRefusal !== "";
      case 8: return travelDate !== "" && tripDuration !== "";
      default: return false;
    }
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-24 pb-36 px-6 sm:px-12 md:px-24 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest block mb-2">
            Free Eligibility Check
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-4 text-zinc-900 dark:text-white leading-tight">
            Are you{" "}
            <span className="text-primary">
              <Highlighter action="underline" color="#CCA352" strokeWidth={2.5} isView={true}>
                Schengen Ready?
              </Highlighter>
            </span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
            Consulates reject thousands of applications each month for simple document errors. Use our assessment engine to test your file eligibility instantly.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="relative p-6 sm:p-10 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 shadow-2xl">
          
          {step <= totalSteps ? (
            <div>
              {/* Progress bar */}
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full mb-8 overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>

              {/* Step indicator */}
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-6">
                Question {step} of {totalSteps}
              </span>

              {/* Question Slides */}
              <div className="min-h-[220px] mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 text-left"
                  >
                    {step === 1 && (
                      <div className="space-y-4">
                        <label className="font-serif text-lg sm:text-xl font-medium text-zinc-900 dark:text-white block">
                          What type of UK visa or permit do you hold?
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {visaOptions.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => { setVisaType(opt.value); handleNext(); }}
                              className={`w-full text-left p-4 rounded-xl border text-sm font-sans transition-all flex justify-between items-center ${
                                visaType === opt.value
                                  ? "border-primary bg-primary/5 text-primary font-semibold"
                                  : "border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-350 dark:hover:border-white/20"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {visaType === opt.value && <span className="text-primary font-bold">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <label className="font-serif text-lg sm:text-xl font-medium text-zinc-900 dark:text-white block">
                          When does your UK BRP / Residency Visa expire?
                        </label>
                        <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 font-light">
                          If you hold Indefinite Leave to Remain (ILR) or EUSS Settled Status, choose a date several years in the future.
                        </p>
                        <input
                          type="date"
                          value={brpExpiry}
                          onChange={(e) => setBrpExpiry(e.target.value)}
                          className="brutalist-input font-sans bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white cursor-pointer"
                        />
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-4">
                        <label className="font-serif text-lg sm:text-xl font-medium text-zinc-900 dark:text-white block">
                          Confirm your passport dates
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-sans font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">Issue Date:</span>
                            <input
                              type="date"
                              value={passportIssue}
                              onChange={(e) => setPassportIssue(e.target.value)}
                              className="brutalist-input font-sans bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white cursor-pointer"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-sans font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">Expiry Date:</span>
                            <input
                              type="date"
                              value={passportExpiry}
                              onChange={(e) => setPassportExpiry(e.target.value)}
                              className="brutalist-input font-sans bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-4">
                        <label className="font-serif text-lg sm:text-xl font-medium text-zinc-900 dark:text-white block">
                          What is your average personal bank balance?
                        </label>
                        <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 font-light">
                          Consulates verify your statements for the last 3 consecutive months.
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {balanceOptions.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => { setBankBalance(opt.value); handleNext(); }}
                              className={`w-full text-left p-4 rounded-xl border text-sm font-sans transition-all flex justify-between items-center ${
                                bankBalance === opt.value
                                  ? "border-primary bg-primary/5 text-primary font-semibold"
                                  : "border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-350 dark:hover:border-white/20"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {bankBalance === opt.value && <span className="text-primary font-bold">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 5 && (
                      <div className="space-y-4">
                        <label className="font-serif text-lg sm:text-xl font-medium text-zinc-900 dark:text-white block">
                          What is your UK employment status?
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {employmentOptions.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => { setEmployment(opt.value); handleNext(); }}
                              className={`w-full text-left p-4 rounded-xl border text-sm font-sans transition-all flex justify-between items-center ${
                                employment === opt.value
                                  ? "border-primary bg-primary/5 text-primary font-semibold"
                                  : "border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-350 dark:hover:border-white/20"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {employment === opt.value && <span className="text-primary font-bold">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 6 && (
                      <div className="space-y-4">
                        <label className="font-serif text-lg sm:text-xl font-medium text-zinc-900 dark:text-white block">
                          Which Schengen destination is your main stop?
                        </label>
                        <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400 font-light">
                          Select the country you enter first or spend the most nights in.
                        </p>
                        <div className="relative">
                          <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="brutalist-input appearance-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white pr-10 cursor-pointer font-sans"
                          >
                            {destinations.map((dest) => (
                              <option key={dest} value={dest} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">{dest}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 7 && (
                      <div className="space-y-4">
                        <label className="font-serif text-lg sm:text-xl font-medium text-zinc-900 dark:text-white block">
                          Have you been refused a Schengen visa in the last 2 years?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            onClick={() => { setPriorRefusal("yes"); handleNext(); }}
                            className={`p-4 rounded-xl border text-sm font-sans transition-all flex justify-between items-center ${
                              priorRefusal === "yes"
                                ? "border-primary bg-primary/5 text-primary font-semibold"
                                : "border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-350 dark:hover:border-white/20"
                            }`}
                          >
                            <span>Yes, I have a prior refusal</span>
                            {priorRefusal === "yes" && <span className="text-primary font-bold">✓</span>}
                          </button>
                          <button
                            onClick={() => { setPriorRefusal("no"); handleNext(); }}
                            className={`p-4 rounded-xl border text-sm font-sans transition-all flex justify-between items-center ${
                              priorRefusal === "no"
                                ? "border-primary bg-primary/5 text-primary font-semibold"
                                : "border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-350 dark:hover:border-white/20"
                            }`}
                          >
                            <span>No prior refusals</span>
                            {priorRefusal === "no" && <span className="text-primary font-bold">✓</span>}
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 8 && (
                      <div className="space-y-4">
                        <label className="font-serif text-lg sm:text-xl font-medium text-zinc-900 dark:text-white block">
                          Enter your travel start date and length of stay
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-sans font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">Expected Travel Start Date:</span>
                            <input
                              type="date"
                              value={travelDate}
                              onChange={(e) => setTravelDate(e.target.value)}
                              className="brutalist-input font-sans bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white cursor-pointer"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-sans font-semibold text-zinc-500 dark:text-zinc-400 block mb-1">Number of Days:</span>
                            <input
                              type="number"
                              min="1"
                              max="90"
                              value={tripDuration}
                              onChange={(e) => setTripDuration(e.target.value)}
                              className="brutalist-input font-sans bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center border-t border-zinc-200 dark:border-white/5 pt-6">
                <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`px-6 py-2 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all ${
                    step === 1
                      ? "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  Back
                </button>

                {step === totalSteps ? (
                  <ThemeButton
                    onClick={() => setStep(totalSteps + 1)}
                    disabled={!isStepValid()}
                  >
                    View Results
                  </ThemeButton>
                ) : (
                  <ThemeButton
                    onClick={handleNext}
                    disabled={!isStepValid()}
                  >
                    Continue
                  </ThemeButton>
                )}
              </div>
            </div>
          ) : (
            
            // Verdict State Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-left space-y-8"
            >
              <div className="text-center pb-6 border-b border-zinc-200 dark:border-white/5">
                {verdict.status === "green" && (
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 border border-emerald-200 dark:border-emerald-800/30 text-3xl mb-4">
                    ✓
                  </div>
                )}
                {verdict.status === "yellow" && (
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-500 border border-amber-200 dark:border-amber-800/30 text-3xl mb-4">
                    !
                  </div>
                )}
                {verdict.status === "red" && (
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-500 border border-rose-200 dark:border-rose-800/30 text-3xl mb-4">
                    ✗
                  </div>
                )}
                <h3 className="font-serif text-3xl font-bold text-zinc-900 dark:text-white">
                  {verdict.title}
                </h3>
                <span className="text-xs font-sans text-zinc-450 dark:text-zinc-500 uppercase tracking-widest mt-1 block">
                  Assessment Complete
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-serif text-base font-semibold text-zinc-900 dark:text-white mb-3">Profile Assessment:</h4>
                  <ul className="space-y-2">
                    {verdict.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-zinc-650 dark:text-zinc-400 font-light">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
                          verdict.status === "green" ? "bg-emerald-500" : verdict.status === "yellow" ? "bg-amber-500" : "bg-rose-500"
                        }`} />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 space-y-3">
                  <h4 className="font-serif text-base font-semibold text-zinc-900 dark:text-white">
                    {verdict.status === "red" ? "Action Required to Apply:" : "Recommended Next Steps:"}
                  </h4>
                  <ul className="space-y-2.5">
                    {verdict.fixes.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">
                        <span className="text-primary font-bold shrink-0">&raquo;</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Emailed Summary Lead Capture */}
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                <h4 className="font-serif text-base font-semibold text-zinc-900 dark:text-white">
                  Email my eligibility report
                </h4>
                <p className="font-sans text-xs text-zinc-650 dark:text-zinc-400 font-light leading-relaxed">
                  Get a complete breakdown of your assessment, checklist fixes, and next steps sent straight to your inbox.
                </p>
                {emailSubmitted ? (
                  <div className="text-emerald-500 font-sans text-xs font-semibold flex items-center gap-2">
                    <span>✓</span> Report successfully sent to {emailInput}!
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!emailInput) return;
                      setEmailLoading(true);
                      setTimeout(() => {
                        setEmailLoading(false);
                        setEmailSubmitted(true);
                      }, 1000);
                    }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="brutalist-input font-sans bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white flex-1 text-sm py-2.5"
                    />
                    <button
                      type="submit"
                      disabled={emailLoading}
                      className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-sans font-bold uppercase tracking-wider hover:opacity-90 transition-all shrink-0 cursor-pointer"
                    >
                      {emailLoading ? "Sending..." : "Send Report"}
                    </button>
                  </form>
                )}
              </div>

              {/* Final CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center pt-6 border-t border-zinc-200 dark:border-white/5">
                {verdict.status === "red" ? (
                  <>
                    <button
                      onClick={() => { setStep(1); setVisaType(""); setBrpExpiry(""); setPassportIssue(""); setPassportExpiry(""); setBankBalance(""); setEmployment(""); setPriorRefusal(""); }}
                      className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-white/10 text-xs font-sans font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all text-center"
                    >
                      Start Assessment Over
                    </button>
                    <ThemeButton href="/contact-us">
                      Book a Free Consultation
                    </ThemeButton>
                  </>
                ) : verdict.status === "yellow" ? (
                  <>
                    <ThemeButton href="/contact-us?plan=documentation">
                      Get Document Check (£95)
                    </ThemeButton>
                    <ThemeButton href="/contact-us?plan=complete">
                      Book Full Service (£175)
                    </ThemeButton>
                  </>
                ) : (
                  <>
                    <ThemeButton href="/contact-us?plan=documentation">
                      Get Documentation Service (£95)
                    </ThemeButton>
                    <ThemeButton href="/contact-us?plan=complete">
                      Book Full Service (£175)
                    </ThemeButton>
                  </>
                )}
              </div>
            </motion.div>
          )}

        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-xs font-sans text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors underline">
            Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
