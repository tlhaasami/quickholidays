"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function FloatingAssistant() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsMobileMenuOpen(!!customEvent.detail?.open);
    };
    window.addEventListener("mobile-menu-toggle", handleToggle);
    return () => window.removeEventListener("mobile-menu-toggle", handleToggle);
  }, []);

  if (isMobileMenuOpen) return null;

  return (
    <Link
      href="/ai-assistant"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#C99537] to-amber-500 text-zinc-950 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-[#C99537]/20 md:hidden pointer-events-auto"
      aria-label="AI Consultation Assistant"
    >
      <svg className="w-5.5 h-5.5 text-zinc-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8M12 8v4M12 12H8m4 0h4m-4 8v-4m0-4V8h.01" />
        <rect x="5" y="8" width="14" height="10" rx="2" />
        <circle cx="9" cy="13" r="1" fill="currentColor" />
        <circle cx="15" cy="13" r="1" fill="currentColor" />
      </svg>
    </Link>
  );
}
