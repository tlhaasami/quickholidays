"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { trackPageView } from "@/lib/analytics";

/* ─────────────────────────────────────────
   MINIMAL PROFESSIONAL STROKE ICONS 
   ───────────────────────────────────────── */

const StrokeHomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const StrokePassportIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <circle cx="12" cy="10" r="3" />
    <path d="M12 7v6M9 10h6" />
  </svg>
);

const StrokePricingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const StrokeRouteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);

const StrokeFaqIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </svg>
);

const StrokeStarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StrokeAboutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const StrokeContactIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const StrokeBotIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 8V4H8M12 8v4M12 12H8m4 0h4m-4 8v-4m0-4V8h.01" />
    <rect x="5" y="8" width="14" height="10" rx="2" />
    <circle cx="9" cy="13" r="1" />
    <circle cx="15" cy="13" r="1" />
  </svg>
);

const MOBILE_NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Schengen Visa", href: "/schengen-visa" },
  { name: "Pricing", href: "/pricing" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "FAQ", href: "/faq" },
  { name: "Reviews", href: "/reviews" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "AI Assistant", href: "/ai-assistant" }
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Initialize theme status on mount
  useEffect(() => {
    trackPageView(pathname);
    setMounted(true);
    
    const theme = localStorage.getItem("theme");
    const docHasDark = document.documentElement.classList.contains("dark");
    setIsDark(theme === "dark" || (theme === null && docHasDark));
  }, [pathname]);

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
    // Sync storage event globally
    window.dispatchEvent(new Event("storage"));
  };

  // Close sidebar on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const getRouteIcon = (href: string) => {
    const iconClass = "w-5 h-5 transition-transform duration-300 group-hover:scale-110";
    switch (href) {
      case "/":
        return <StrokeHomeIcon className={iconClass} />;
      case "/schengen-visa":
        return <StrokePassportIcon className={iconClass} />;
      case "/pricing":
        return <StrokePricingIcon className={iconClass} />;
      case "/how-it-works":
        return <StrokeRouteIcon className={iconClass} />;
      case "/faq":
        return <StrokeFaqIcon className={iconClass} />;
      case "/reviews":
        return <StrokeStarIcon className={iconClass} />;
      case "/about-us":
        return <StrokeAboutIcon className={iconClass} />;
      case "/contact-us":
        return <StrokeContactIcon className={iconClass} />;
      case "/ai-assistant":
        return <StrokeBotIcon className={iconClass} />;
      default:
        return null;
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* SVG sketchy turbulence filter definitions required for the theme switch */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="sketchy" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.035 0.042"
              numOctaves="4"
              result="noise"
              seed="42"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="sketchy-sm" x="-18%" y="-18%" width="136%" height="136%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.06"
              numOctaves="3"
              result="noise"
              seed="7"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Hamburger Menu Button (Mobile Only: z-[1000] to sit above backdrop and drawer) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation Menu"
        className="fixed top-6 right-6 z-[1000] p-2.5 rounded-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-lg cursor-pointer md:hidden flex flex-col justify-center items-center gap-1.5 w-11 h-11 pointer-events-auto transition-transform hover:scale-105 active:scale-95"
      >
        <span className={cn("w-5 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all duration-300 origin-center", isOpen ? "rotate-45 translate-y-1" : "")} />
        <span className={cn("w-5 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all duration-300", isOpen ? "opacity-0" : "")} />
        <span className={cn("w-5 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all duration-300 origin-center", isOpen ? "-rotate-45 -translate-y-1" : "")} />
      </button>

      {/* Sidebar Backdrop Overlay (Mobile Only: z-[998]) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[998] md:hidden pointer-events-auto"
        />
      )}

      {/* Sidebar Drawer Container (Mobile Only: z-[999]) */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-[270px] z-[999] bg-white dark:bg-zinc-950 border-l border-zinc-200/80 dark:border-white/8 p-6 pt-24 shadow-2xl flex flex-col justify-between md:hidden transition-transform duration-300 ease-out transform pointer-events-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Navigation Links List */}
        <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar max-h-[70dvh]">
          {MOBILE_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "group relative px-4 py-2.5 text-xs font-sans font-bold tracking-widest uppercase rounded-2xl transition-all duration-350 flex items-center gap-3.5 select-none",
                  isActive 
                    ? "bg-[#C99537]/10 text-[#C99537] dark:text-[#E2B755] font-extrabold border border-[#C99537]/25 shadow-sm" 
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent"
                )}
              >
                {/* Minimal Stroke Icon Slot */}
                <div className="shrink-0 flex items-center justify-center w-5 h-5">
                  {getRouteIcon(link.href)}
                </div>
                {/* Text Label */}
                <span className="font-sans font-bold tracking-widest text-[11px] uppercase">
                  {link.name}
                </span>
                {/* Active dot indicator */}
                {isActive && (
                  <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#C99537] animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer containing Theme Switch Toggle */}
        <div className="pt-6 border-t border-zinc-150 dark:border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Appearance
          </span>
          <label className="theme-switch cursor-pointer scale-90">
            <input 
              className="theme-switch__checkbox" 
              type="checkbox" 
              checked={isDark}
              onChange={toggleTheme}
            />
            <div className="theme-switch__container">
              <div className="theme-switch__clouds" />
              <div className="theme-switch__stars-container">
                <svg fill="none" viewBox="0 0 144 55" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="currentColor"
                    d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 37.5976 23.602 36.9802 24.0053ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.831 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div className="theme-switch__circle-container">
                <div className="theme-switch__sun-moon-container">
                  <div className="theme-switch__moon">
                    <div className="theme-switch__spot" />
                    <div className="theme-switch__spot" />
                    <div className="theme-switch__spot" />
                  </div>
                </div>
              </div>
              <div className="theme-switch__shooting-star" />
              <div className="theme-switch__shooting-star-2" />
              <div className="theme-switch__meteor" />
              <div className="theme-switch__stars-cluster">
                <div className="star" />
                <div className="star" />
                <div className="star" />
                <div className="star" />
                <div className="star" />
              </div>
              <div className="theme-switch__aurora" />
              <div className="theme-switch__comets">
                <div className="comet" />
                <div className="comet" />
              </div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
}
