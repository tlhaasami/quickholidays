"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COUNTRIES } from "@/constants";
import { trackLead, trackFormAbandon } from "@/lib/analytics";
import Link from "next/link";
import { ThemeButton } from "@/components/ThemeButton";
import { CoolMode } from "@/components/ui/cool-mode";
import { usePathname } from "next/navigation";

const COMMON_NATIONALITIES = [
  "Indian", "Pakistani", "Nigerian", "Chinese", "Filipino", 
  "South African", "Russian", "Turkish", "Brazilian", "Egyptian",
  "Ghanaian", "Bangladeshi", "Vietnamese", "Indonesian", "Thai",
  "Kenyan", "Mexican", "Ukrainian", "Iranian", "Iraqi"
].sort();

const COUNTRY_CODES = [
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "Andorra", code: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "+244", flag: "🇦🇴" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "+374", flag: "🇦🇲" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "+1", flag: "🇧🇸" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "+1", flag: "🇧🇧" },
  { name: "Belarus", code: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "+229", flag: "🇧🇯" },
  { name: "Bermuda", code: "+1", flag: "🇧🇲" },
  { name: "Bhutan", code: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "+591", flag: "🇧🇴" },
  { name: "Bosnia & Herzegovina", code: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Brunei", code: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "+257", flag: "🇧🇮" },
  { name: "Cambodia", code: "+855", flag: "🇰🇭" },
  { name: "Cameroon", code: "+237", flag: "🇨🇲" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Cape Verde", code: "+238", flag: "🇨🇻" },
  { name: "Cayman Islands", code: "+1", flag: "🇰🇾" },
  { name: "Central African Rep.", code: "+236", flag: "🇨🇫" },
  { name: "Chad", code: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "+56", flag: "🇨🇱" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "+269", flag: "🇰🇲" },
  { name: "Congo", code: "+242", flag: "🇨🇬" },
  { name: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { name: "Croatia", code: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "+53", flag: "🇨🇺" },
  { name: "Cyprus", code: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "+420", flag: "🇨🇿" },
  { name: "DR Congo", code: "+243", flag: "🇨🇩" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "+1", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "+1", flag: "🇩🇴" },
  { name: "Ecuador", code: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "+372", flag: "🇪🇪" },
  { name: "Eswatini", code: "+268", flag: "🇸🇿" },
  { name: "Ethiopia", code: "+251", flag: "🇪🇹" },
  { name: "Fiji", code: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Gabon", code: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "Greece", code: "+30", flag: "🇬🇷" },
  { name: "Grenada", code: "+1", flag: "🇬🇩" },
  { name: "Guatemala", code: "+502", flag: "🇬🇹" },
  { name: "Guinea", code: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "+509", flag: "🇭🇹" },
  { name: "Honduras", code: "+504", flag: "🇭🇳" },
  { name: "Hong Kong", code: "+852", flag: "🇭🇰" },
  { name: "Hungary", code: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "+354", flag: "🇮🇸" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Iran", code: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "+353", flag: "🇮🇪" },
  { name: "Israel", code: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Jamaica", code: "+1", flag: "🇯🇲" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "Jordan", code: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Kosovo", code: "+383", flag: "🇽🇰" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "+996", flag: "🇰🇬" },
  { name: "Laos", code: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺" },
  { name: "Macau", code: "+853", flag: "🇲🇴" },
  { name: "Madagascar", code: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "+356", flag: "🇲🇹" },
  { name: "Mauritania", code: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "+230", flag: "🇲🇺" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Moldova", code: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "+382", flag: "🇲🇪" },
  { name: "Morocco", code: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "+264", flag: "🇳🇦" },
  { name: "Nepal", code: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "+227", flag: "🇳🇪" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "North Korea", code: "+850", flag: "🇰🇵" },
  { name: "North Macedonia", code: "+389", flag: "🇲🇰" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Palestine", code: "+970", flag: "🇵🇸" },
  { name: "Panama", code: "+507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "+675", flag: "🇵🇬" },
  { name: "Paraguay", code: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Poland", code: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "+351", flag: "🇵🇹" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Romania", code: "+40", flag: "🇷🇴" },
  { name: "Russia", code: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "+250", flag: "🇷🇼" },
  { name: "Samoa", code: "+685", flag: "🇼🇸" },
  { name: "San Marino", code: "+378", flag: "🇸🇲" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "+381", flag: "🇷🇸" },
  { name: "Seychelles", code: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "+232", flag: "🇸🇱" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "Slovakia", code: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "+386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "+677", flag: "🇸🇧" },
  { name: "Somalia", code: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "South Sudan", code: "+211", flag: "🇸🇸" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "+249", flag: "🇸🇩" },
  { name: "Suriname", code: "+597", flag: "🇸🇷" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Syria", code: "+963", flag: "🇸🇾" },
  { name: "Taiwan", code: "+886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "+992", flag: "🇹🇯" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "Togo", code: "+228", flag: "🇹🇬" },
  { name: "Trinidad & Tobago", code: "+1", flag: "🇹🇹" },
  { name: "Tunisia", code: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "+90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "+993", flag: "🇹🇲" },
  { name: "UAE", code: "+971", flag: "🇦🇪" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "+380", flag: "🇺🇦" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "+998", flag: "🇺🇿" },
  { name: "Vatican City", code: "+39", flag: "🇻🇦" },
  { name: "Venezuela", code: "+58", flag: "🇻🇪" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
  { name: "Yemen", code: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "+263", flag: "🇿🇼" }
].sort((a, b) => a.name.localeCompare(b.name));

const COUNTRY_CODES_LIST = [
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  ...COUNTRY_CODES.filter(c => c.name !== "United Kingdom")
];

interface TypeformFormProps {
  defaultDestination?: string;
}

export function TypeformForm({ defaultDestination = "france" }: TypeformFormProps) {
  const pathname = usePathname();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "+44 ",
    phoneCode: "+44",
    phoneNoOnly: "",
    email: "",
    nationality: "",
    destination: defaultDestination,
    priorVisas: "None",
    channel: "WhatsApp",
    comment: "",
    plan: "",
    priorityUpgrade: false
  });

  const [nationalitySearch, setNationalitySearch] = useState("");
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const nationalityContainerRef = useRef<HTMLDivElement>(null);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const destinationContainerRef = useRef<HTMLDivElement>(null);

  const phoneCodeContainerRef = useRef<HTMLDivElement>(null);
  const [showPhoneCodeDropdown, setShowPhoneCodeDropdown] = useState(false);
  const [phoneCodeSearch, setPhoneCodeSearch] = useState("");

  const filteredPhoneCodes = useMemo(() => {
    const q = phoneCodeSearch.trim().toLowerCase();
    if (!q) return COUNTRY_CODES_LIST;
    return COUNTRY_CODES_LIST.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [phoneCodeSearch]);
  
  // Tracks the current step ref for abandonment analytics
  const stepRef = useRef(1);
  const hasSubmitted = useRef(false);

  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (!hasSubmitted.current && stepRef.current < 6) {
        trackFormAbandon(stepRef.current, `step-${stepRef.current}`);
      }
    };
  }, []);

  useEffect(() => {
    if (defaultDestination) {
      setFormData((prev) => ({ ...prev, destination: defaultDestination }));
    }
  }, [defaultDestination]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get("name");
      const urlPhone = params.get("phone");
      const urlEmail = params.get("email");
      const urlNotes = params.get("notes");
      const urlPlan = params.get("plan");

      let planName = "";
      if (urlPlan) {
        if (urlPlan === "complete") planName = "Complete Visa Service (£175)";
        else if (urlPlan === "documentation") planName = "Documentation Service (£95)";
        else if (urlPlan === "appointment") planName = "Appointment Booking Service (£95)";
      }

      setFormData((prev) => ({
        ...prev,
        name: urlName || prev.name,
        phone: urlPhone || prev.phone,
        email: urlEmail || prev.email,
        comment: urlNotes || prev.comment,
        plan: planName || prev.plan,
        priorityUpgrade: prev.priorityUpgrade
      }));
    }
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

  // Handle outside clicks for phone code dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (phoneCodeContainerRef.current && !phoneCodeContainerRef.current.contains(e.target as Node)) {
        setShowPhoneCodeDropdown(false);
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
      if (!formData.phoneNoOnly.trim()) {
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
    if (step === 3) {
      if (!formData.plan) {
        showWarning("Please choose a visa service plan.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          nationality: formData.nationality,
          destination: formData.destination,
          priorVisas: formData.priorVisas,
          channel: formData.channel,
          comment: formData.comment,
          plan: formData.plan || "Help Me Choose / Consultation (Free)",
          priorityUpgrade: formData.priorityUpgrade,
          priorityUpgradeText: formData.priorityUpgrade ? "Yes" : "No"
        })
      });

      if (res.status === 429) {
        const data = await res.json();
        showWarning(data.error || "The daily consultation booking limit has been reached. Please try again after 12:00 PM.");
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to submit lead");
      }

      hasSubmitted.current = true;
      trackLead(formData.email, {
        name: formData.name,
        phone: formData.phone,
        nationality: formData.nationality,
        destination: formData.destination,
        priorVisas: formData.priorVisas,
        channel: formData.channel,
        comment: formData.comment,
        plan: formData.plan || "Help Me Choose / Consultation (Free)",
        priorityUpgrade: formData.priorityUpgrade,
        priorityUpgradeText: formData.priorityUpgrade ? "Yes" : "No"
      });
      setStep(6); // Success Screen
    } catch (err) {
      console.error("Submission failed:", err);
      showWarning("Failed to submit your request. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          animate={{ width: `${Math.min(step * 20, 100)}%` }}
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
                <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Step 01 / 05</span>
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

                <div className="flex gap-4 items-end brutalist-phone-wrapper w-full">
                  {/* Country Code Custom Select */}
                  <div ref={phoneCodeContainerRef} className="brutalist-container !w-[115px] shrink-0 relative">
                    <button
                      type="button"
                      onClick={() => setShowPhoneCodeDropdown(!showPhoneCodeDropdown)}
                      className="w-full brutalist-input cursor-pointer font-bold flex items-center justify-between pointer-events-auto bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white pr-3 py-3.5"
                    >
                      <span className="truncate">
                        {COUNTRY_CODES_LIST.find((c) => c.code === formData.phoneCode)?.flag || "🇬🇧"}{" "}
                        {formData.phoneCode}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 shrink-0 ${showPhoneCodeDropdown ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <label className="brutalist-label">Code</label>

                    {showPhoneCodeDropdown && (
                      <div className="absolute left-0 mt-2 bg-white dark:bg-zinc-900 border-3 border-black dark:border-white z-[999] shadow-2xl w-[260px] max-h-56 flex flex-col overflow-hidden pointer-events-auto">
                        {/* Search Input inside the dropdown */}
                        <div className="p-2 border-b-2 border-black dark:border-white bg-zinc-50 dark:bg-zinc-950 shrink-0">
                          <input
                            type="text"
                            placeholder="Search country/code..."
                            value={phoneCodeSearch}
                            onChange={(e) => setPhoneCodeSearch(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white outline-none font-bold placeholder-zinc-400 rounded-none"
                          />
                        </div>
                        
                        {/* Scrollable list */}
                        <div className="flex-1 overflow-y-auto max-h-[170px] bg-white dark:bg-zinc-900">
                          {filteredPhoneCodes.length > 0 ? (
                            filteredPhoneCodes.map((c) => (
                              <button
                                key={`${c.code}-${c.name}`}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    phoneCode: c.code,
                                    phone: `${c.code} ${formData.phoneNoOnly}`
                                  });
                                  setShowPhoneCodeDropdown(false);
                                  setPhoneCodeSearch("");
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-zinc-900 dark:text-zinc-300 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors font-bold flex items-center gap-2 cursor-pointer border-b border-zinc-100 dark:border-zinc-800/40"
                              >
                                <span className="text-sm shrink-0">{c.flag}</span>
                                <span className="truncate flex-1">{c.name}</span>
                                <span className="text-zinc-500 dark:text-zinc-400 shrink-0">{c.code}</span>
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-xs text-zinc-500 dark:text-zinc-400 font-bold text-center">
                              No countries found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phone Number Input */}
                  <div className="brutalist-container flex-1">
                    <input
                      type="tel"
                      required
                      value={formData.phoneNoOnly}
                      onChange={(e) => {
                        const newNum = e.target.value;
                        setFormData({
                          ...formData,
                          phoneNoOnly: newNum,
                          phone: `${formData.phoneCode} ${newNum}`
                        });
                      }}
                      placeholder="e.g. 7700 900077"
                      className="brutalist-input smooth-type"
                    />
                    <label className="brutalist-label">Phone Number</label>
                  </div>
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
                <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Step 02 / 05</span>
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
                    placeholder="Search nationality (e.g. Portuguese)"
                    className="brutalist-input smooth-type"
                  />
                  <label className="brutalist-label">Nationality</label>
                  {showNationalityDropdown && filteredNationalities.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border-3 border-black dark:border-white z-50 shadow-2xl max-h-40 overflow-y-auto no-scrollbar pointer-events-auto no-custom-cursor">
                      {filteredNationalities.map((nat) => (
                        <button
                          key={nat}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, nationality: nat });
                            setNationalitySearch(nat);
                            setShowNationalityDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-300 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors font-bold cursor-pointer"
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
                    <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border-3 border-black dark:border-white z-50 shadow-2xl max-h-[252px] overflow-y-auto no-scrollbar pointer-events-auto no-custom-cursor">
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, destination: c.slug });
                            setShowDestinationDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer ${
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
                <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Step 03 / 05</span>
                <h3 className="text-zinc-900 dark:text-white font-serif text-2xl mt-1 font-semibold">Choose Your Visa Plan</h3>
                <p className="font-sans text-xs text-zinc-500 font-light mt-1">Select a service level.</p>
              </div>

              <div className="space-y-2.5 mt-4">
                {[
                  { id: "complete", name: "Complete Visa Service", price: "£175", desc: "End-to-end guidance, slot tracking, and bookings." },
                  { id: "documentation", name: "Documentation Service", price: "£95", desc: "Checklist, document review, and file drafting." },
                  { id: "appointment", name: "Appointment Booking Service", price: "£95", desc: "Secures biometrics slots and completes forms." },
                  { id: "help", name: "Help Me Choose / Consultation", price: "Free", desc: "Speak to a visa officer first to assess eligibility." }
                ].map((plan) => {
                  const fullPlanName = `${plan.name} (${plan.price})`;
                  const isSelected = formData.plan === fullPlanName || formData.plan.startsWith(plan.name);
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, plan: fullPlanName })}
                      className={`w-full p-3 text-left border-2 transition-all flex justify-between items-center cursor-pointer group rounded-xl no-custom-cursor ${
                        isSelected
                          ? "border-[#C99537] bg-amber-500/10 dark:bg-amber-500/20 shadow-[2px_2px_0_#C99537] dark:shadow-[2px_2px_0_#C99537]"
                          : "border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/30 hover:border-[#C99537] hover:bg-[#C99537]/5"
                      }`}
                    >
                      <div className="text-left pointer-events-none">
                        <h4 className="font-sans font-bold text-xs sm:text-sm text-zinc-900 dark:text-white flex items-center gap-1.5 pointer-events-none">
                          {plan.name}
                          {isSelected && (
                            <span className="text-[9px] bg-primary text-zinc-950 px-1 py-0.2 font-sans font-extrabold uppercase rounded-none tracking-wider pointer-events-none">
                              Selected
                            </span>
                          )}
                        </h4>
                        <p className="font-sans text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 font-light mt-0.5 leading-tight pointer-events-none">{plan.desc}</p>
                      </div>
                      <span className="font-serif font-bold text-xs sm:text-sm text-primary shrink-0 ml-4 pointer-events-none">{plan.price}</span>
                    </button>
                  );
                })}
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
                <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Step 04 / 05</span>
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
                        className={`py-4 rounded-xl border text-sm font-sans font-medium cursor-pointer no-custom-cursor transition-all ${
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

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-left">
                <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Step 05 / 05</span>
                <h3 className="text-zinc-900 dark:text-white font-serif text-2xl mt-1 font-semibold">Preferred Response Channel</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { 
                      value: "WhatsApp", 
                      label: "WhatsApp", 
                      icon: (
                        <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      )
                    },
                    { 
                      value: "Call", 
                      label: "Phone Call", 
                      icon: (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      )
                    },
                    { 
                      value: "Email", 
                      label: "Email", 
                      icon: (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )
                    }
                  ].map((ch) => {
                    const isSelected = formData.channel === ch.value;
                    const isWhatsApp = ch.value === "WhatsApp";
                    return (
                      <button
                        key={ch.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, channel: ch.value })}
                        className={`py-3 px-2 rounded-lg border text-xs font-sans font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer no-custom-cursor ${
                          isSelected
                            ? isWhatsApp
                              ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse"
                              : "bg-primary border-primary text-white"
                            : "bg-zinc-100 dark:bg-zinc-900/30 border-zinc-200 dark:border-white/10 text-zinc-650 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="w-5 h-5 flex items-center justify-center pointer-events-none">{ch.icon}</div>
                        <span className="pointer-events-none">{ch.label}</span>
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

          {step === 6 && (
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
        {step < 6 && (
          <div className="border-t border-zinc-200 dark:border-white/5 pt-6 mt-8 flex flex-col space-y-4">
            <div className="flex justify-between items-center w-full gap-4">
              {step > 1 ? (
                <ThemeButton
                  type="button"
                  onClick={prevStep}
                  hideArrow={true}
                  disabled={isSubmitting}
                >
                  Back
                </ThemeButton>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <CoolMode>
                  <ThemeButton
                    type="button"
                    onClick={nextStep}
                    disabled={isSubmitting}
                  >
                    Continue
                  </ThemeButton>
                </CoolMode>
              ) : (
                <CoolMode>
                  <ThemeButton
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Booking..." : "Book My Consultation"}
                  </ThemeButton>
                </CoolMode>
              )}
            </div>
            
            <p className="text-[10px] text-zinc-500 leading-normal text-left">
              {step === 5 ? (
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
            className="fixed bottom-24 right-6 sm:bottom-6 sm:right-6 z-[99999] bg-zinc-950 border border-[#C99537]/45 text-white px-5 py-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex items-center gap-3.5 max-w-sm pointer-events-auto"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C99537]/15 flex items-center justify-center text-[#E2B755]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#E2B755]">Validation Notice</h4>
              <p className="text-[13px] text-zinc-100 font-medium leading-normal mt-0.5">{notification.message}</p>
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
