"use client";

import { useState, useRef, useEffect } from "react";
import { visaSections } from "@/constants/visaFields";
import { downloadVisaDoc, exportVisaDocPDF } from "@/utils/visaDocGenerator";
import { isAgentAuthenticated } from "@/utils/auth";

// ── LLM Prompt ──────────────────────────────────────────────────────────────
const FIELD_LIST = visaSections
  .flatMap((sec) => sec.fields.map((f) => `  "${f.id}": ""  // ${f.label}`))
  .join(",\n");

const LLM_PROMPT = `You are a Schengen visa application data assistant for Quick Holidays (UK).

Based on the applicant information I provide, return ONLY a valid JSON object with these exact field keys filled in. Leave a field as an empty string "" if the information is not available. Do not add any explanation — just the JSON.

JSON format:
{
${FIELD_LIST}
}

Now fill this in for the following applicant:
[PASTE APPLICANT DETAILS HERE]`;

// ── Types ────────────────────────────────────────────────────────────────────
type ParsedData = Record<string, string>;

// ── Component ────────────────────────────────────────────────────────────────
export default function CreateDocumentPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [jsonInput, setJsonInput] = useState("");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [jsonError, setJsonError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportDocName, setExportDocName] = useState("Visa_Draft");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const allFieldIds = new Set(visaSections.flatMap((s) => s.fields.map((f) => f.id)));

  // ── Theme Toggle ──
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [isAgent, setIsAgent] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    window.dispatchEvent(new Event("storage"));
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(LLM_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = LLM_PROMPT;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleParseJson = () => {
    setJsonError("");
    if (!jsonInput.trim()) {
      setJsonError("Please paste your JSON first.");
      return;
    }
    try {
      let cleaned = jsonInput.trim();
      const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) cleaned = codeBlockMatch[1].trim();

      const parsed = JSON.parse(cleaned);
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        setJsonError("Expected a JSON object, not an array or primitive.");
        return;
      }
      const data: ParsedData = {};
      for (const id of allFieldIds) {
        const val = parsed[id];
        data[id] = val !== undefined && val !== null ? String(val) : "";
      }
      setParsedData(data);
      setStep(3);
    } catch {
      setJsonError("Invalid JSON. Check your paste and try again.");
    }
  };

  const handleExport = () => {
    if (!parsedData) return;
    setIsExportModalOpen(true);
  };

  const confirmExport = () => {
    if (!parsedData) return;
    downloadVisaDoc(parsedData, exportDocName || "Visa_Draft");
    setIsExportModalOpen(false);
  };

  const filledCount = parsedData
    ? Object.values(parsedData).filter((v) => v.trim() !== "").length
    : 0;
  const totalCount = allFieldIds.size;

  // ── Shared class tokens ──
  const NAV_BG   = "bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800";
  const CARD     = "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl";
  const DIVIDER  = "border-zinc-200 dark:border-zinc-800";
  const LABEL    = "text-zinc-500 dark:text-zinc-400";
  const HEADING  = "text-zinc-900 dark:text-white";
  const BODY     = "text-zinc-700 dark:text-zinc-300";
  const GOLD     = "text-[#C99537] dark:text-amber-400";
  const BTN_GOLD = "bg-[#C99537] hover:bg-[#b0822d] text-white font-bold transition-all";
  const BTN_GHOST = "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white transition-all";

  return (
    <div className="min-h-screen bg-[#F4F2EE] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">

      {/* ── Navbar ── consistent in both themes ── */}
      <nav className={`sticky top-0 z-50 ${NAV_BG}`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <img
              src="/logos/logo-search.png"
              alt="Quick Holidays"
              className="h-8 w-auto"
            />
            <span className="font-black text-zinc-900 dark:text-white text-lg tracking-tight">
              QUICK<span className={GOLD}> HOLIDAYS</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/create-cover-letter"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 transition-all"
            >
              AI Cover Letter Tool
            </a>
            <span className={`text-xs ${LABEL} hidden sm:block`}>
              Visa Document Generator
            </span>
            {mounted && (
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-10">

        {/* ── Hero ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#C99537]/10 dark:bg-amber-400/10 border border-[#C99537]/30 dark:border-amber-400/30 text-[#C99537] dark:text-amber-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            <span>✦</span> AI-Powered Doc Generator
          </div>
          <h1 className={`text-4xl sm:text-5xl font-black ${HEADING} leading-tight mb-4`}>
            Generate Your Visa Draft
            <br />
            <span className={GOLD}>in Seconds</span>
          </h1>
          <p className={`${LABEL} text-lg max-w-2xl mx-auto leading-relaxed`}>
            Use our AI prompt with any LLM, paste the JSON output, preview your
            details, and download the official Quick Holidays visa draft document.
          </p>
        </div>

        {/* ── Step Indicators ── */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[
            { n: 1, label: "Copy Prompt" },
            { n: 2, label: "Paste JSON" },
            { n: 3, label: "Preview & Export" },
          ].map(({ n, label }, idx) => (
            <div key={n} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (n === 1 || n === 2 || (n === 3 && parsedData)) {
                    setStep(n as 1 | 2 | 3);
                  }
                }}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  step === n
                    ? "bg-[#C99537] dark:bg-amber-400 text-white dark:text-zinc-900 shadow-[0_0_20px_rgba(201,149,55,0.4)]"
                    : step > n
                    ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600 cursor-pointer"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-default"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                    step === n
                      ? "bg-white/30 dark:bg-zinc-900/30 text-white dark:text-zinc-900"
                      : step > n
                      ? "bg-emerald-500 dark:bg-emerald-400 text-white"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {step > n ? "✓" : n}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {idx < 2 && (
                <div
                  className={`w-8 h-px transition-all duration-500 ${
                    step > n ? "bg-[#C99537] dark:bg-amber-400" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ═══ STEP 1 — Copy Prompt ═══ */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Agent Mode / Public Mode Auth Notice */}
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isAgent
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
            }`}>
              <div>
                <strong className="block font-bold text-sm">
                  {isAgent ? "🔒 Agent Mode Active (API Key Generation Unlocked)" : "🌐 Public User Mode"}
                </strong>
                <p className="text-xs mt-1 opacity-90">
                  {isAgent
                    ? "You are logged in as an authorized agent. Live API key natural language extraction & instant 1-click document creation is enabled."
                    : "Direct API key generation is restricted to logged-in agents. Copy the AI System Prompt below to use with ChatGPT, Claude, or Gemini — or log into the Agent Portal."}
                </p>
              </div>
              {!isAgent && (
                <a
                  href="/agent-portal"
                  className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-sm"
                >
                  Agent Login →
                </a>
              )}
            </div>

            <div className={CARD}>
              <div className={`flex items-center justify-between px-6 py-4 border-b ${DIVIDER}`}>
                <div>
                  <h2 className={`text-lg font-bold ${HEADING}`}>AI Prompt</h2>
                  <p className={`text-sm ${LABEL} mt-0.5`}>
                    Copy this and paste into ChatGPT, Claude, or Gemini — then add your client details at the bottom
                  </p>
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    copied
                      ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)]"
                      : `${BTN_GOLD} shadow-[0_0_20px_rgba(201,149,55,0.3)]`
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Prompt
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <pre className={`p-6 text-xs ${BODY} font-mono leading-relaxed overflow-auto max-h-72 whitespace-pre-wrap select-all bg-zinc-50 dark:bg-zinc-950/40`}>
                  {LLM_PROMPT}
                </pre>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-zinc-50 dark:from-zinc-900 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* LLM links */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "ChatGPT", url: "https://chat.openai.com", color: "#10a37f", letter: "G" },
                { name: "Claude", url: "https://claude.ai", color: "#cc785c", letter: "C" },
                { name: "Gemini", url: "https://gemini.google.com", color: "#4285f4", letter: "G" },
              ].map((llm) => (
                <a
                  key={llm.name}
                  href={llm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 ${CARD} hover:border-zinc-400 dark:hover:border-zinc-600 px-4 py-3 transition-all duration-200 group`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black shrink-0"
                    style={{ backgroundColor: llm.color }}
                  >
                    {llm.letter}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${HEADING} group-hover:${GOLD} transition-colors`}>{llm.name}</div>
                    <div className={`text-xs ${LABEL}`}>Open ↗</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 ${BTN_GHOST} px-6 py-3 rounded-xl font-semibold text-sm`}
              >
                Next: Paste JSON
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2 — Paste JSON ═══ */}
        {step === 2 && (
          <div className="space-y-6">
            <div className={CARD}>
              <div className={`px-6 py-4 border-b ${DIVIDER}`}>
                <h2 className={`text-lg font-bold ${HEADING}`}>Paste JSON Output</h2>
                <p className={`text-sm ${LABEL} mt-0.5`}>
                  Paste the JSON from the LLM — markdown code blocks are handled automatically
                </p>
              </div>
              <div className="p-6">
                <textarea
                  ref={textareaRef}
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    setJsonError("");
                  }}
                  placeholder={`Paste JSON here…\n\nExample:\n{\n  "personal_surname": "KHAN",\n  "personal_first_names": "SEHAR AFSHAN",\n  "personal_dob": "1990-05-15",\n  ...\n}`}
                  rows={18}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 focus:border-[#C99537] dark:focus:border-amber-400 focus:outline-none rounded-xl px-4 py-4 text-sm font-mono text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors resize-none"
                  spellCheck={false}
                />
                {jsonError && (
                  <div className="mt-3 flex items-start gap-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 rounded-lg px-4 py-3 text-sm text-red-600 dark:text-red-300">
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {jsonError}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 ${LABEL} hover:text-zinc-900 dark:hover:text-white text-sm font-semibold transition-colors`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                onClick={handleParseJson}
                className={`flex items-center gap-2 ${BTN_GOLD} px-7 py-3 rounded-xl text-sm shadow-[0_0_20px_rgba(201,149,55,0.3)] hover:shadow-[0_0_30px_rgba(201,149,55,0.5)]`}
              >
                Parse & Preview
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3 — Preview & Export ═══ */}
        {step === 3 && parsedData && (
          <div className="space-y-6">
            {/* Summary bar */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${CARD} px-6 py-4`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-400/10 border border-emerald-200 dark:border-emerald-400/30 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className={`${HEADING} font-bold`}>
                    {(parsedData.personal_first_names || parsedData.personal_surname)
                      ? `${parsedData.personal_first_names || ""} ${parsedData.personal_surname || ""}`.trim()
                      : "Applicant"}
                  </div>
                  <div className={`text-sm ${LABEL}`}>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{filledCount}</span> of {totalCount} fields filled
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep(2)}
                  className={`flex items-center gap-2 ${BTN_GHOST} px-4 py-2.5 rounded-xl text-sm font-semibold`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit JSON
                </button>
                <button
                  onClick={handleExport}
                  className={`flex items-center gap-2 ${BTN_GOLD} px-6 py-2.5 rounded-xl text-sm shadow-[0_0_20px_rgba(201,149,55,0.3)]`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export .doc
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C99537] to-emerald-500 dark:from-amber-400 dark:to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${(filledCount / totalCount) * 100}%` }}
              />
            </div>

            {/* Section previews */}
            <div className="space-y-3">
              {visaSections.map((sec) => {
                const sectionFilled = sec.fields.filter((f) => parsedData[f.id]?.trim()).length;
                return (
                  <details
                    key={sec.title}
                    className={`group ${CARD} overflow-hidden`}
                    open={sectionFilled > 0}
                  >
                    <summary className={`flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            sectionFilled === sec.fields.length
                              ? "bg-emerald-500 dark:bg-emerald-400"
                              : sectionFilled > 0
                              ? "bg-[#C99537] dark:bg-amber-400"
                              : "bg-zinc-400 dark:bg-zinc-600"
                          }`}
                        />
                        <span className={`font-semibold ${HEADING}`}>{sec.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs ${LABEL} font-mono`}>
                          {sectionFilled}/{sec.fields.length}
                        </span>
                        <svg
                          className={`w-4 h-4 ${LABEL} transition-transform duration-200 group-open:rotate-180`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    <div className={`border-t ${DIVIDER}`}>
                      <table className="w-full text-sm">
                        <tbody>
                          {sec.fields.map((field, idx) => (
                            <tr
                              key={field.id}
                              className={idx % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50 dark:bg-zinc-950/50"}
                            >
                              <td className={`px-6 py-3 ${LABEL} font-medium w-[42%] border-r ${DIVIDER} align-top leading-snug text-sm`}>
                                {field.label}
                              </td>
                              <td className={`px-6 py-2 align-top font-mono text-xs leading-relaxed ${
                                parsedData[field.id]?.trim() ? HEADING : LABEL
                              }`}>
                                <input
                                  type="text"
                                  value={parsedData[field.id] || ""}
                                  onChange={(e) =>
                                    setParsedData({ ...parsedData, [field.id]: e.target.value })
                                  }
                                  className="w-full bg-transparent border-b border-transparent focus:border-[#C99537] dark:focus:border-amber-400 focus:outline-none py-1 transition-colors placeholder-zinc-400 dark:placeholder-zinc-600"
                                  placeholder="—"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="flex flex-wrap justify-center gap-4 pt-6 pb-4">
              <button
                onClick={handleExport}
                className={`flex items-center gap-3 ${BTN_GOLD} px-8 py-3.5 rounded-2xl text-sm font-bold shadow-[0_0_30px_rgba(201,149,55,0.4)] hover:shadow-[0_0_50px_rgba(201,149,55,0.6)] hover:scale-105 active:scale-100 duration-300`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Visa Draft (.doc)
              </button>
              <button
                onClick={() => {
                  if (parsedData) exportVisaDocPDF(parsedData, exportDocName || "Schengen_Visa_Application");
                }}
                className="flex items-center gap-3 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold px-8 py-3.5 rounded-2xl text-sm shadow duration-300 hover:scale-105 active:scale-100"
              >
                <span className="text-base">📕</span>
                Export Visa Form (PDF)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className={`border-t ${DIVIDER} mt-16 py-8 text-center text-sm`}>
        <p className={LABEL}>© 2025 Future Vision Organization Limited — Quick Holidays UK</p>
        <p className={`mt-1 text-xs ${LABEL}`}>Documents generated here are for visa application assistance only.</p>
      </footer>

      {/* ── Export Name Modal ── */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm">
          <div className={`${CARD} w-full max-w-sm shadow-2xl overflow-hidden`}>
            <div className={`px-6 py-5 border-b ${DIVIDER}`}>
              <h3 className={`text-lg font-bold ${HEADING}`}>Export Visa Draft</h3>
              <p className={`text-sm ${LABEL} mt-0.5`}>Choose a filename and select format</p>
            </div>
            <div className="p-6">
              <label className={`block text-sm font-semibold ${BODY} mb-2`}>
                Document Name
              </label>
              <input
                type="text"
                autoFocus
                value={exportDocName}
                onChange={(e) => setExportDocName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirmExport();
                  if (e.key === "Escape") setIsExportModalOpen(false);
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 focus:border-[#C99537] dark:focus:border-amber-400 focus:outline-none rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors"
                placeholder="e.g. John_Doe_Visa"
              />
            </div>
            <div className={`px-6 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-t ${DIVIDER} flex flex-col gap-2`}>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${LABEL} hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmExport}
                  className={`px-4 py-2 rounded-xl text-xs ${BTN_GOLD} shadow`}
                >
                  Download .DOC
                </button>
                <button
                  onClick={() => {
                    if (parsedData) {
                      exportVisaDocPDF(parsedData, exportDocName || "Visa_Draft");
                      setIsExportModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold shadow hover:bg-zinc-800 dark:hover:bg-zinc-100"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
