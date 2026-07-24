"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS, NAVBAR_CONFIG } from "@/constants";
import { trackPageView } from "@/lib/analytics";

export function Navbar() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return (
    <nav 
      style={{ 
        backgroundColor: NAVBAR_CONFIG.bgColor,
        borderColor: NAVBAR_CONFIG.borderColor 
      }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md border px-8 py-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 sm:gap-4 max-w-[95vw] md:max-w-max overflow-x-auto no-scrollbar"
    >
      {NAV_LINKS.map((link, idx) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ 
              color: isActive 
                ? NAVBAR_CONFIG.activeColor 
                : (hoveredIndex === idx ? NAVBAR_CONFIG.hoverColor : NAVBAR_CONFIG.inactiveColor)
            }}
            className={cn(
              "relative px-4 py-1.5 text-[11px] sm:text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 select-none whitespace-nowrap",
              isActive ? "font-extrabold" : ""
            )}
          >
            {/* Glow Light Spotlight Effect (Only when active) */}
            {isActive && (
              <>
                {/* Bright Theme Light Source Indicator at the Top Edge of capsule */}
                <span 
                  style={{ 
                    backgroundColor: NAVBAR_CONFIG.activeColor,
                    boxShadow: `0 0 8px ${NAVBAR_CONFIG.activeColor}, 0 0 15px ${NAVBAR_CONFIG.activeColor}`
                  }}
                  className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full animate-pulse" 
                />
                
                {/* Glowing Theme Light Beam spreading downwards */}
                <span 
                  style={{
                    backgroundImage: `radial-gradient(ellipse at top, ${NAVBAR_CONFIG.activeColor}38, transparent 75%)`
                  }}
                  className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-16 h-12 pointer-events-none" 
                />
              </>
            )}
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
