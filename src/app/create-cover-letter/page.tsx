"use client";

import { useState, useEffect } from "react";
import { coverLetterSections, COVER_LETTER_SYSTEM_PROMPT } from "@/constants/coverLetterFields";
import { generateMasterCoverLetterText, exportCoverLetterPDF, downloadCoverLetterDocx, sanitizeTextForATS } from "@/utils/coverLetterGenerator";
import { parseApplicantNotes } from "@/utils/coverLetterParser";
import { isAgentAuthenticated } from "@/utils/auth";
import Link from "next/link";

export default function CreateCoverLetterPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [rawNotes, setRawNotes] = useState("");
  const [coverLetterText, setCoverLetterText] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [exportName, setExportName] = useState("Schengen_Cover_Letter");
  const [isAgent, setIsAgent] = useState(false);

  // Theme management & Agent Auth check
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsAgent(isAgentAuthenticated());
    const theme = localStorage.getItem("theme");
    const docHasDark = document.documentElement.classList.contains("dark");
    setIsDark(theme === "dark" || (theme === null && docHasDark));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleInputChange = (id: string, val: string) => {
    setFormData((prev) => ({ ...prev, [id]: val }));
  };

  const [missingValidationModal, setMissingValidationModal] = useState<{
    show: boolean;
    missingFieldsList: string[];
    actionType: "generate" | "exportPdf" | "exportDoc";
  } | null>(null);

  const checkCoverLetterFields = (actionType: "generate" | "exportPdf" | "exportDoc") => {
    const missing: string[] = [];
    if (!formData.full_name?.trim()) missing.push("Applicant Full Name");
    if (!formData.passport_number?.trim()) missing.push("Passport Number");
    if (!formData.destination_country?.trim()) missing.push("Destination Country");
    if (!formData.trip_start_date?.trim()) missing.push("Travel Start Date");
    if (!formData.uk_address?.trim()) missing.push("UK Address & Contact");

    if (missing.length > 0) {
      setMissingValidationModal({
        show: true,
        missingFieldsList: missing,
        actionType
      });
    } else {
      executeCoverAction(actionType);
    }
  };

  const executeCoverAction = (actionType: "generate" | "exportPdf" | "exportDoc") => {
    if (actionType === "generate") {
      const generated = generateMasterCoverLetterText(formData);
      setCoverLetterText(generated);
      setStep(2);
    } else if (actionType === "exportPdf") {
      exportCoverLetterPDF(coverLetterText, exportName || "Schengen_Cover_Letter");
    } else if (actionType === "exportDoc") {
      downloadCoverLetterDocx(coverLetterText, exportName || "Schengen_Cover_Letter");
    }
  };

  const handleGenerateTemplate = () => {
    checkCoverLetterFields("generate");
  };

  const handleCopySystemPrompt = async () => {
    const filledDetails = Object.entries(formData)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    const fullPrompt = `${COVER_LETTER_SYSTEM_PROMPT}\n\nApplicant Details:\n${filledDetails || "No specific details entered yet."}`;

    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = fullPrompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    }
  };

  const handleCopyLetterText = async () => {
    try {
      await navigator.clipboard.writeText(coverLetterText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = coverLetterText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const handleExportPDF = () => {
    checkCoverLetterFields("exportPdf");
  };

  const handleExportDocx = () => {
    checkCoverLetterFields("exportDoc");
  };

  // Shared token styles
  const NAV_BG = "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800";
  const CARD = "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl";
  const BTN_GOLD = "bg-[#C99537] hover:bg-[#b0822d] text-white font-bold transition-all shadow-md";
  const BTN_GHOST = "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white transition-all";

  return (
    <div className="min-h-screen bg-[#F4F2EE] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 ${NAV_BG}`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logos/logo-search.png" alt="Quick Holidays" className="h-8 w-auto" />
            <span className="font-black text-zinc-900 dark:text-white text-lg tracking-tight">
              Quick Holidays <span className="text-[#C99537] font-normal text-xs ml-1 uppercase tracking-widest">AI Cover Letter</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/create-document"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 transition-all"
            >
              Visa Application Draft Tool
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              title="Toggle Theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header Title */}
        <div className="text-center mb-10">
          <span className="inline-block text-[#C99537] dark:text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-3">
            Consular Approved Dual Persona AI Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Schengen Visa AI Cover Letter Creator
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Evaluated simultaneously by Applicant voice and Visa Officer compliance standards. ATS-friendly formatting, zero emojis, standard margins, and vector PDF export.
          </p>
        </div>

        {/* Step Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setStep(1)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              step === 1
                ? "bg-[#C99537] text-white shadow"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            1. Applicant Details & AI Prompt
          </button>
          <span className="text-zinc-400 dark:text-zinc-600">→</span>
          <button
            onClick={() => setStep(2)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              step === 2
                ? "bg-[#C99537] text-white shadow"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            2. Edit & ATS Sanitize
          </button>
          <span className="text-zinc-400 dark:text-zinc-600">→</span>
          <button
            onClick={() => {
              if (coverLetterText) setStep(3);
            }}
            disabled={!coverLetterText}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              step === 3
                ? "bg-[#C99537] text-white shadow"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 opacity-60"
            }`}
          >
            3. ATS Preview & PDF Export
          </button>
        </div>

        {/* STEP 1: Applicant Details & Prompt Setting */}
        {step === 1 && (
          <div className="space-y-8">
            <div className={`${CARD} p-6 sm:p-8 space-y-6 shadow-sm`}>
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              {/* Agent Mode / Public Mode Auth Notice */}
              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-center justify-between gap-4 ${
                isAgent
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
              }`}>
                <div>
                  <strong className="block font-bold text-xs">
                    {isAgent ? "🔒 Agent Mode Active (API Key Generation Unlocked)" : "🌐 Public User Mode"}
                  </strong>
                  <p className="text-[11px] mt-0.5 opacity-90">
                    {isAgent
                      ? "You are logged in as an authorized agent. Live API key natural language extraction & instant 1-click document creation is enabled."
                      : "Direct API key generation is restricted to logged-in agents. Copy the Dual-Persona AI Prompt below to use with ChatGPT, Claude, or Gemini — or log into the Agent Portal."}
                  </p>
                </div>
                {!isAgent && (
                  <Link
                    href="/agent-portal"
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-all"
                  >
                    Agent Login →
                  </Link>
                )}
              </div>
                <button
                  onClick={handleCopySystemPrompt}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    copiedPrompt
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"
                  }`}
                >
                  {copiedPrompt ? "Copied Prompt to Clipboard!" : "Copy Dual-Persona AI Prompt"}
                </button>
              </div>

              {/* Natural Language AI Extractor */}
              <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#C99537] dark:text-amber-400 flex items-center gap-1.5">
                    ✨ AI Smart Natural Language Auto-Extractor
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Paste raw notes from WhatsApp, Email, or Typeform</span>
                </div>
                <textarea
                  rows={4}
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  placeholder="Paste unorganized applicant details here (e.g. 'Name: Rigved Kashikar, Passport: P9280608, Share Code: SFA T2R 77T exp 30/09/2026, Student at Hertfordshire, visiting Greece from 26/08/2026 to 30/08/2026...')"
                  className="w-full p-3 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C99537]"
                />
                <button
                  onClick={() => {
                    if (!rawNotes.trim()) return;
                    const parsed = parseApplicantNotes(rawNotes);
                    setFormData((prev) => ({ ...prev, ...parsed }));
                    const generated = generateMasterCoverLetterText({ ...formData, ...parsed });
                    setCoverLetterText(generated);
                    setStep(2);
                  }}
                  disabled={!rawNotes.trim()}
                  className={`px-4 py-2 rounded-xl text-xs ${BTN_GOLD} ${!rawNotes.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  ⚡ Auto-Extract Details & Generate Cover Letter
                </button>
              </div>

              {/* Form Fields by Category */}
              {coverLetterSections.map((sec, idx) => (
                <div key={idx} className="space-y-4 pt-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#C99537] dark:text-amber-400">{sec.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sec.fields.map((f) => (
                      <div key={f.id} className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {f.label} {f.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          value={formData[f.id] || ""}
                          onChange={(e) => handleInputChange(f.id, e.target.value)}
                          placeholder={f.placeholder}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#C99537] text-zinc-900 dark:text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={handleCopySystemPrompt}
                  className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold ${BTN_GHOST}`}
                >
                  {copiedPrompt ? "✓ System Prompt Copied" : "Copy AI Prompt for ChatGPT / Claude / Gemini"}
                </button>
                <button
                  onClick={handleGenerateTemplate}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs ${BTN_GOLD}`}
                >
                  Generate Master Cover Letter & Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Edit & ATS Sanitize */}
        {step === 2 && (
          <div className={`${CARD} p-6 sm:p-8 space-y-6 shadow-sm`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Review & Edit Cover Letter Text</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  You can edit the text directly or paste your AI-generated response. ATS Sanitizer will automatically strip all prohibited emojis.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Zero Emojis Enforced
                </span>
              </div>
            </div>

            <textarea
              rows={22}
              value={coverLetterText}
              onChange={(e) => setCoverLetterText(sanitizeTextForATS(e.target.value))}
              placeholder="Paste your AI generated cover letter or edit text here..."
              className="w-full p-4 font-mono text-xs leading-relaxed rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#C99537]"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setStep(1)}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold ${BTN_GHOST}`}
              >
                ← Back to Details
              </button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleCopyLetterText}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold ${BTN_GHOST}`}
                >
                  {copiedText ? "✓ Text Copied" : "Copy Text"}
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!coverLetterText.trim()}
                  className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs ${BTN_GOLD}`}
                >
                  Proceed to ATS Preview & PDF Export →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ATS Preview & Vector PDF Export */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Export Bar */}
            <div className={`${CARD} p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm`}>
              <div className="w-full sm:w-auto">
                <label className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  Document Export Name:
                </label>
                <input
                  type="text"
                  value={exportName}
                  onChange={(e) => setExportName(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleExportDocx}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold ${BTN_GHOST}`}
                >
                  📄 Export Word (.doc)
                </button>
                <button
                  onClick={handleExportPDF}
                  className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs ${BTN_GOLD}`}
                >
                  🖨️ Export PDF (Vector Printable)
                </button>
              </div>
            </div>

            {/* A4 Sheet Preview */}
            <div className="bg-white text-zinc-900 p-8 sm:p-14 rounded-2xl shadow-xl border border-zinc-200 max-w-4xl mx-auto font-sans leading-relaxed text-xs sm:text-sm">
              <div className="space-y-4 whitespace-pre-wrap font-sans text-zinc-900">
                {coverLetterText}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Missing Details Validation Warning Modal */}
      {missingValidationModal?.show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border-2 border-amber-500 p-6 max-w-md w-full shadow-2xl rounded-2xl text-left">
            <div className="flex items-center gap-3 text-amber-500 mb-2">
              <span className="text-2xl font-bold">⚠️</span>
              <h3 className="font-sans text-base font-extrabold uppercase tracking-wide text-zinc-900 dark:text-white">
                Missing Required Cover Letter Details
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-4 font-light leading-relaxed">
              Before proceeding, please note that the following essential fields have not been filled out yet:
            </p>

            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 mb-5 rounded-xl space-y-1.5">
              {missingValidationModal.missingFieldsList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span className="text-amber-500">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setMissingValidationModal(null);
                }}
                className="bg-[#C99537] text-white px-4 py-2 font-bold text-xs rounded-xl hover:bg-[#b0822d] transition-all cursor-pointer"
              >
                Complete Details
              </button>
              <button
                type="button"
                onClick={() => {
                  const act = missingValidationModal.actionType;
                  setMissingValidationModal(null);
                  executeCoverAction(act);
                }}
                className="border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 px-4 py-2 font-semibold text-xs rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
