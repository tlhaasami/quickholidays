"use client";

import React, { useState, useEffect } from "react";
import { getSiteConfig } from "@/utils/siteConfig";

export function PromoBanner() {
  const [promoText, setPromoText] = useState("avail 35% Discount now");

  useEffect(() => {
    const config = getSiteConfig();
    if (config.promoText) {
      setPromoText(config.promoText);
    }

    const handleStorage = () => {
      const updatedConfig = getSiteConfig();
      if (updatedConfig.promoText) {
        setPromoText(updatedConfig.promoText);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-8 z-[2000] bg-gradient-to-r from-[#C99537] to-amber-500 text-zinc-950 flex items-center justify-center text-center font-sans text-[10px] sm:text-xs font-bold uppercase tracking-widest select-none shadow-md">
      {promoText}
    </div>
  );
}
