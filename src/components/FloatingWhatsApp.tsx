"use client";

import React, { useState, useEffect } from "react";
import { trackContact } from "@/lib/analytics";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const messages = [
    "Get 10 pounds discount over whatsapp now",
    "Chat with our visa experts now",
    "Get instant Schengen visa offers"
  ];

  useEffect(() => {
    // 1. Initial delay: appear after 3.5 seconds
    const startTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(startTimeout);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // 2. Rotate through the messages once
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev >= messages.length - 1) {
          // If we completed one full cycle, hide the tag and stop
          setIsVisible(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleClick = () => {
    trackContact("WhatsApp");
  };

  if (pathname === "/login" || pathname === "/agent-portal" || pathname === "/create-document") return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 w-14 h-14 pointer-events-auto select-none">
      {/* Rotating Tagline Label — always visible above the button */}
      {isVisible && (
        <div className="absolute bottom-full left-0 mb-3.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-sans font-semibold tracking-wide px-4 py-2 rounded-xl border border-zinc-800 dark:border-zinc-200 shadow-xl whitespace-nowrap min-h-[32px] flex items-center justify-center gap-2">
          {/* Speech bubble pointer arrow */}
          <div className="absolute top-full left-6 -mt-[5px] w-2 h-2 bg-zinc-950 dark:bg-white border-r border-b border-zinc-800 dark:border-zinc-200 transform rotate-45" />
          
          {/* Pulsing WhatsApp Indicator */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>

          <AnimatePresence mode="wait">
            <motion.span
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {messages[messageIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/447828707425?text=Hi,%20I'd%20like%20to%20get%20the%2010%20pounds%20discount%20over%20WhatsApp%20now."
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center justify-center w-full h-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-none shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/40"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" />
        </svg>
      </a>
    </div>
  );
}
