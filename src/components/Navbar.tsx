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
    <path d="M18 7c0-5.333-8-5.333-8 0" />
    <path d="M10 7v14" />
    <path d="M6 21h12" />
    <path d="M6 13h10" />
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
  { name: "AI Assistant", href: "/ai-assistant" },
  { name: "Create Document", href: "/create-document" },
  { name: "Create Cover Letter", href: "/create-cover-letter" }
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [mobileMode, setMobileMode] = useState<"hamburger" | "always">("hamburger");

  // Track window scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize theme status on mount
  useEffect(() => {
    trackPageView(pathname);
    setMounted(true);
    
    const theme = localStorage.getItem("theme");
    const docHasDark = document.documentElement.classList.contains("dark");
    setIsDark(theme === "dark" || (theme === null && docHasDark));

    const savedMode = localStorage.getItem("dock_mobileMode");
    if (savedMode) setMobileMode(savedMode as any);
  }, [pathname]);

  useEffect(() => {
    const handleStorage = () => {
      const savedMode = localStorage.getItem("dock_mobileMode");
      if (savedMode) setMobileMode(savedMode as any);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
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
    // Sync storage event globally
    window.dispatchEvent(new Event("storage"));
  };

  // Close sidebar on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Dispatch hamburger menu toggle event
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("mobile-menu-toggle", { detail: { open: isOpen } }));
  }, [isOpen]);

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

  const isExcludedPath = pathname === "/login" || pathname === "/agent-portal" || pathname === "/create-document" || pathname === "/create-cover-letter";
  if (isExcludedPath) return null;

  const isHomepage = pathname === "/";
  const showTransparent = isHomepage && !isScrolled;

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



      {/* Sticky Mobile Navbar (Mobile Only) */}
      <header className={cn(
        "fixed top-0 left-0 right-0 h-16 z-[998] md:hidden transition-all duration-300",
        showTransparent 
          ? "bg-transparent border-transparent" 
          : "bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-white/10"
      )}>
        <div className={cn(
          "h-full flex items-center justify-between px-6 transition-opacity duration-300",
          showTransparent ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        )}>
          <Link href="/" className="flex items-center gap-2.5 select-none">
            <img
              src="/logos/logo-search.png"
              alt="Quick Holidays Logo"
              className="h-8 w-auto object-contain filter brightness-95"
            />
            <span className="font-serif text-base font-bold tracking-tight text-zinc-900 dark:text-white">
              Quick Holidays
            </span>
          </Link>
        </div>
      </header>

      {/* Hamburger Menu Button (Mobile Only) - Only rendered if dockMobileMode is set to "hamburger" */}
      {mobileMode === "hamburger" && (
        <button
          onClick={() => {
            const newOpen = !isOpen;
            setIsOpen(newOpen);
            window.dispatchEvent(new CustomEvent('mobile-menu-toggle', { detail: { open: newOpen } }));
          }}
          aria-label="Toggle Navigation Menu"
          className={cn(
            "fixed top-2.5 right-6 z-[1000] p-2.5 rounded-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200 dark:border-white/10 shadow-lg cursor-pointer md:hidden flex flex-col justify-center items-center gap-1.5 w-11 h-11 pointer-events-auto transition-all duration-300 hover:scale-105 active:scale-95",
            isOpen ? "rotate-90" : "rotate-0"
          )}
        >
          <span className="w-5 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all duration-300" />
          <span className="w-5 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all duration-300" />
          <span className="w-5 h-0.5 bg-zinc-900 dark:bg-white rounded-full transition-all duration-300" />
        </button>
      )}
  
    </>
  );
}
