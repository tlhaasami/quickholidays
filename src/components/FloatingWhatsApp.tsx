"use client";
import React, { useState, useEffect } from "react";
import { trackContact } from "@/lib/analytics";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [waIndex, setWaIndex] = useState(0);
  const [waVisible, setWaVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const waMessages = [
    "Get 10 pounds discount over whatsapp now",
    "Chat with our visa experts now",
    "Get instant Schengen visa offers"
  ];

  const [hotlineVisible, setHotlineVisible] = useState(false);

  useEffect(() => {
    // WhatsApp initial delay: 2 seconds
    const waStart = setTimeout(() => {
      setWaVisible(true);
    }, 2000);

    // Hotline initial delay: 29 seconds (after WhatsApp and AI Assistant tooltips finish)
    const hotlineStart = setTimeout(() => {
      setHotlineVisible(true);
    }, 29000);

    return () => {
      clearTimeout(waStart);
      clearTimeout(hotlineStart);
    };
  }, []);

  useEffect(() => {
    if (!waVisible) return;

    // Rotate through WhatsApp messages once
    const interval = setInterval(() => {
      setWaIndex((prev) => {
        if (prev >= waMessages.length - 1) {
          setWaVisible(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [waVisible]);

  if (pathname === "/login" || pathname === "/agent-portal" || pathname === "/create-document") return null;

  return (
    <>
      {/* 1. WhatsApp floating widget (stacked bottom) */}
      <div className="fixed bottom-6 left-6 z-50 w-14 h-14 pointer-events-auto select-none">
        <AnimatePresence>
          {waVisible && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-sans font-semibold tracking-wide px-4 py-2.5 rounded-xl border border-zinc-800 dark:border-zinc-200 shadow-xl w-[160px] sm:w-[220px] whitespace-normal leading-tight flex items-center justify-start gap-2"
            >
              <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-4px] w-2 h-2 bg-zinc-950 dark:bg-white border-l border-b border-zinc-800 dark:border-zinc-200 transform rotate-45" />
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`wa-${waIndex}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {waMessages[waIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <a
          href="https://wa.me/447828707425?text=Hi,%20I'd%20like%20to%20get%20the%2010%20pounds%20discount%20over%20WhatsApp%20now."
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContact("WhatsApp")}
          className="flex items-center justify-center w-full h-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/40"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" />
          </svg>
        </a>
      </div>

      {/* 2. Complaints hotline floating widget (stacked top, with clear gap) */}
      <div className="fixed bottom-[96px] left-6 z-50 w-14 h-14 pointer-events-auto select-none">
        {/* Tagline showing after other tooltips finish */}
        <AnimatePresence>
          {hotlineVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-3.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-sans font-semibold tracking-wide px-4 py-2.5 rounded-xl border border-zinc-800 dark:border-zinc-200 shadow-xl w-max whitespace-nowrap leading-tight flex items-center justify-start gap-2"
            >
              <div className="absolute top-full left-6 -mt-[5px] w-2 h-2 bg-zinc-950 dark:bg-white border-r border-b border-zinc-800 dark:border-zinc-200 transform rotate-45" />
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>Complaints Hotline</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center w-full h-full bg-[#0F1936] dark:bg-zinc-900 hover:bg-[#1a2d5e] dark:hover:bg-zinc-800 text-white rounded-full shadow-[0_10px_30px_rgba(15,25,54,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#C99537]/35 cursor-pointer"
          aria-label="Call Complaints Hotline"
        >
          <svg className="w-6 h-6 stroke-current text-[#C99537]" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>
      </div>

      {/* Modal Popup details */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <h3 className="font-serif text-xl font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2 border-b border-zinc-100 dark:border-white/5 pb-3">
              <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Helpline &amp; Support Details
            </h3>

            <div className="space-y-4 font-sans text-sm text-zinc-600 dark:text-zinc-300">
              <div>
                <h4 className="font-bold text-zinc-800 dark:text-white text-[10px] uppercase tracking-wider mb-1.5">Standard Support &amp; Complaints</h4>
                <p className="mb-2 leading-relaxed">
                  For service feedback, application status questions, or formal complaints, please contact our dedicated office line:
                </p>
                <a href="tel:+448000584673" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors font-bold">
                  📞 +44 800 058 4673
                </a>
              </div>

              <hr className="border-zinc-200 dark:border-white/5" />

              <div>
                <h4 className="font-bold text-zinc-800 dark:text-white text-[10px] uppercase tracking-wider mb-1.5">Out-of-Hours &amp; Emergency Queries</h4>
                <p className="mb-2 leading-relaxed">
                  For urgent appointment issues, out-of-hours assistance, or Schengen visa emergencies:
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href="tel:+447828707425" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors font-bold">
                    📞 +44 7828 707425
                  </a>
                  <a href="https://wa.me/447828707425" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/20 transition-colors font-bold">
                    💬 WhatsApp Emergency
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-white/5 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-sans font-bold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
