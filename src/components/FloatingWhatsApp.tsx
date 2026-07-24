"use client";

import React from "react";
import { trackContact } from "@/lib/analytics";

export function FloatingWhatsApp() {
  const handleClick = () => {
    trackContact("WhatsApp");
  };

  return (
    <a
      href="https://wa.me/448000584673?text=Hi,%20I'd%20like%20to%20ask%20about%20a%20Schengen%20visa."
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all duration-300 group border border-emerald-500/30"
      aria-label="Chat on WhatsApp"
    >
      <svg
        className="w-6 h-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.732 2.01 14.28 1.01 11.758 1.01c-5.445 0-9.87 4.373-9.873 9.803-.001 1.77.477 3.497 1.393 5.041L2.235 21.5l5.882-1.53c-1.524-.873-1.47-1.468-1.47-1.468zm10.14-5.326c-.304-.151-1.796-.879-2.073-.979-.278-.1-.48-.151-.68.151-.2.3-.775.979-.95 1.179-.176.2-.351.224-.655.074-1.2-.6-2.05-1.05-2.85-2.45-.15-.27-.08-.42.06-.55.125-.125.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.68-1.624-.93-2.224-.244-.588-.491-.508-.68-.518-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.11 4.525.714.31 1.27.495 1.702.632.718.228 1.37.196 1.885.12.575-.085 1.796-.73 2.05-1.43.253-.7.253-1.3.177-1.43-.076-.13-.277-.2-.581-.35z" />
      </svg>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 font-sans font-bold text-xs uppercase tracking-wider transition-all duration-500 ease-out whitespace-nowrap">
        Chat with Us
      </span>
    </a>
  );
}
