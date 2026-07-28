"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";

const AiAssistantPopup = dynamic(
  () => import("@/components/AiAssistantPopup").then((mod) => mod.AiAssistantPopup),
  { ssr: false }
);
import {
  MagneticDock,
  DockIconHome,
} from "@/components/ui/magnetic-dock";

const DockIconPassport = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <circle cx="12" cy="10" r="3" />
    <path d="M12 7v6M9 10h6" />
  </svg>
);

const DockIconRoute = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);

const DockIconStar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DockIconCalendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
  </svg>
);

const DockIconFaq = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </svg>
);

const DockIconAbout = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DockIconBot = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 8V4H8M12 8v4M12 12H8m4 0h4m-4 8v-4m0-4V8h.01" />
    <rect x="5" y="8" width="14" height="10" rx="2" />
    <circle cx="9" cy="13" r="1" />
    <circle cx="15" cy="13" r="1" />
  </svg>
);

const DockIconPricing = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 7c0-5.333-8-5.333-8 0" />
    <path d="M10 7v14" />
    <path d="M6 21h12" />
    <path d="M6 13h10" />
  </svg>
);

const DockIconWhatsapp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" />
  </svg>
);

export function DockWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const isExcludedPath = pathname === "/login" || pathname === "/agent-portal" || pathname === "/create-document";
  // --- Dynamic settings from localStorage ---
  const [iconSize, setIconSize] = useState(48);
  const [maxScale, setMaxScale] = useState(1.3);
  const [magneticDistance, setMagneticDistance] = useState(100);
  const [position, setPosition] = useState<"bottom" | "top" | "left" | "right">("bottom");
  const [variant, setVariant] = useState<"glass" | "solid" | "transparent">("glass");
  const [showLabels, setShowLabels] = useState(true);
  const [design, setDesign] = useState<"classic" | "sketchy" | "brutalist" | "neon" | "minimal">("classic");
  const [iconStyle, setIconStyle] = useState<"default" | "creative">("default");
  const [showDock, setShowDock] = useState(true);

  // Position settings
  const [dockMobileMode, setDockMobileMode] = useState<"hamburger" | "always">("hamburger");
  const [dockSide, setDockSide] = useState<"bottom" | "top" | "left" | "right">("bottom");
  const [dockVerticalAlign, setDockVerticalAlign] = useState<"bottom" | "top" | "center">("bottom");
  const [dockCenterOffset, setDockCenterOffset] = useState<number>(0);

  // --- Mobile & Hamburger menu synchronization states ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- Theme toggle states & callbacks ---
  const [isDark, setIsDark] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsMobileMenuOpen(!!customEvent.detail?.open);
    };
    window.addEventListener("mobile-menu-toggle", handleToggle);
    return () => window.removeEventListener("mobile-menu-toggle", handleToggle);
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem("theme");
      const docHasDark = document.documentElement.classList.contains("dark");
      setIsDark(theme === "dark" || (theme === null && docHasDark));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // homepage scroll monitor
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (
          path === "/create-cover-letter" ||
          path === "/create-document" ||
          path === "/agent-portal"
        ) {
          setShowDock(false);
          return;
        }

        const isHomePage = path === "/";
        if (isHomePage) {
          setShowDock(window.scrollY > 80);
        } else {
          setShowDock(true);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSize = localStorage.getItem("dock_iconSize");
        if (savedSize) setIconSize(parseInt(savedSize));

        const savedScale = localStorage.getItem("dock_maxScale");
        if (savedScale) setMaxScale(parseFloat(savedScale));

        const savedDist = localStorage.getItem("dock_magneticDistance");
        if (savedDist) setMagneticDistance(parseInt(savedDist));

        const savedPos = localStorage.getItem("dock_position");
        if (savedPos) setPosition(savedPos as any);

        const savedVar = localStorage.getItem("dock_variant");
        if (savedVar) setVariant(savedVar as any);

        const savedLabels = localStorage.getItem("dock_showLabels");
        if (savedLabels) setShowLabels(savedLabels === "true");

        const savedDesign = localStorage.getItem("dock_design");
        if (savedDesign) setDesign(savedDesign as any);

        const savedIconStyle = localStorage.getItem("dock_iconStyle");
        if (savedIconStyle) setIconStyle(savedIconStyle as any);

        // Custom positioning and mobile keys
        const savedMobileMode = localStorage.getItem("dock_mobileMode");
        if (savedMobileMode) setDockMobileMode(savedMobileMode as any);

        const savedSide = localStorage.getItem("dock_side");
        if (savedSide) setDockSide(savedSide as any);

        const savedAlign = localStorage.getItem("dock_verticalAlign");
        if (savedAlign) setDockVerticalAlign(savedAlign as any);

        const savedOffset = localStorage.getItem("dock_centerOffset");
        if (savedOffset) setDockCenterOffset(parseInt(savedOffset));
      } catch (e) {
        console.error(e);
      }
    };

    loadSettings();

    // Listen for custom storage modifications in real-time
    window.addEventListener("storage", loadSettings);
    return () => window.removeEventListener("storage", loadSettings);
  }, []);

  const items = [
    {
      id: "home",
      label: "Home",
      icon: <DockIconHome className="w-[24px] h-[24px]" />,
      isActive: pathname === "/",
      onClick: () => router.push("/"),
    },
    {
      id: "schengen-visa",
      label: "Schengen Visa",
      icon: <DockIconPassport className="w-[24px] h-[24px]" />,
      isActive: pathname.startsWith("/schengen-visa"),
      onClick: () => router.push("/schengen-visa"),
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: <DockIconPricing className="w-[24px] h-[24px]" />,
      isActive: pathname === "/pricing",
      onClick: () => router.push("/pricing"),
    },
    {
      id: "how-it-works",
      label: "How It Works",
      icon: <DockIconRoute className="w-[24px] h-[24px]" />,
      isActive: pathname === "/how-it-works",
      onClick: () => router.push("/how-it-works"),
    },
    {
      id: "faq",
      label: "FAQ",
      icon: <DockIconFaq className="w-[24px] h-[24px]" />,
      isActive: pathname === "/faq",
      onClick: () => router.push("/faq"),
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <DockIconStar className="w-[24px] h-[24px]" />,
      isActive: pathname === "/reviews",
      onClick: () => router.push("/reviews"),
    },
    {
      id: "about-us",
      label: "About Us",
      icon: <DockIconAbout className="w-[24px] h-[24px]" />,
      isActive: pathname === "/about-us",
      onClick: () => router.push("/about-us"),
    },
    {
      id: "contact-us",
      label: "Contact Us",
      icon: <DockIconCalendar className="w-[24px] h-[24px]" />,
      isActive: pathname === "/contact-us",
      onClick: () => router.push("/contact-us"),
    },

    {
      id: "theme-toggle",
      label: isDark ? "Light Mode" : "Dark Mode",
      icon: (
        <label 
          className="theme-switch select-none origin-center shrink-0 pointer-events-auto cursor-pointer block"
          style={{
            "--toggle-size": `${iconSize / 2.5}px`,
            "--container-width": "2.5em",
            "--container-height": "2.5em",
            "--circle-container-diameter": "2.5em",
            "--sun-moon-diameter": "1.7em",
            "--circle-container-offset": "0px",
          } as React.CSSProperties}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
          }}
        >
          <input 
            className="theme-switch__checkbox" 
            type="checkbox" 
            checked={isDark}
            readOnly
          />
          <div className="theme-switch__container">
            <div className="theme-switch__clouds" />
            <div className="theme-switch__stars-container">
              <svg fill="none" viewBox="0 0 144 55" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.831 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z"
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
      ),
      onClick: toggleTheme,
    },
  ];

  // Dynamic positioning logic for desktop screens (md and wider)
  const getDockStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: "fixed",
      zIndex: 9999,
    };

    // 1. Horizontal Side Positioning
    if (dockSide === "left") {
      styles.left = "24px";
    } else if (dockSide === "right") {
      styles.right = "24px";
    } else {
      // Top or Bottom -> Horizontally Centered
      styles.left = "50%";
    }

    // 2. Vertical Align Positioning with custom offset support
    if (dockSide === "top") {
      styles.top = "32px";
    } else if (dockSide === "bottom") {
      styles.bottom = `${24 - dockCenterOffset}px`;
    } else {
      // Left or Right Side -> Vertical Alignments
      if (dockVerticalAlign === "top") {
        styles.top = "32px";
      } else if (dockVerticalAlign === "bottom") {
        styles.bottom = `${24 - dockCenterOffset}px`;
      } else {
        // Centered Vertically
        styles.top = "50%";
      }
    }

    // Translate properties based on coordinates
    let xTrans = "0px";
    let yTrans = "0px";

    if (dockSide !== "left" && dockSide !== "right") {
      xTrans = "-50%";
    }
    
    if (dockSide === "top" || (dockSide !== "bottom" && dockVerticalAlign === "top")) {
      // 30% visible when not hovered (translated up by 65%)
      yTrans = isHovered ? "12px" : "-65%";
    } else if (dockSide !== "bottom" && dockVerticalAlign === "center") {
      yTrans = `calc(-50% + ${dockCenterOffset}px)`;
    }

    styles.transform = `translate(${xTrans}, ${yTrans})`;
    styles.transition = "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), top 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
    return styles;
  };

  const showMobileDock = dockMobileMode === "always" || (dockMobileMode === "hamburger" && isMobileMenuOpen);

  if (isExcludedPath) {
    return null;
  }

  return (
    <>
      {/* Desktop Dock wrapper with dynamic layouts */}
      <div 
        className="hidden md:block" 
        style={getDockStyles()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* SVG sketchy turbulence filter definitions required for the theme switch inside the dock */}
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

        <AnimatePresence>
          {showDock && (
            <motion.div
              initial={{ 
                opacity: 0, 
                y: position === "bottom" ? 30 : position === "top" ? -30 : 0,
                x: position === "left" ? -30 : position === "right" ? 30 : 0
              }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ 
                opacity: 0, 
                y: position === "bottom" ? 30 : position === "top" ? -30 : 0,
                x: position === "left" ? -30 : position === "right" ? 30 : 0
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <MagneticDock 
                items={items} 
                iconSize={iconSize}
                maxScale={maxScale}
                magneticDistance={magneticDistance}
                showLabels={showLabels}
                position={position} 
                variant={variant} 
                design={design}
                iconStyle={iconStyle}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Sidebar — appears from behind hamburger, desktop hidden */}
      <AnimatePresence>
        {showMobileDock && (
          <motion.div
            key="mobile-dock"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 35 }}
            className="fixed top-16 right-0 bottom-0 w-72 h-[calc(100vh-64px)] z-[999] bg-white/95 dark:bg-black/95 backdrop-blur-md border-l border-zinc-200 dark:border-white/10 shadow-2xl flex flex-col md:hidden"
          >
            {/* Menu List */}
            <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-2">
              {items
                .filter((i) => i.id !== "whatsapp" && i.id !== "ai-assistant" && i.id !== "theme-toggle")
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={item.onClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer select-none outline-none ${
                      item.isActive
                        ? "bg-[#C99537]/15 text-[#C99537] dark:text-[#E2B755]"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                  </div>
                ))}
            </div>

            {/* Footer with Theme Switch */}
            <div className="p-5 border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Theme</span>
              {items.find((i) => i.id === "theme-toggle") && (
                <div onClick={items.find((i) => i.id === "theme-toggle")?.onClick} className="cursor-pointer">
                  {items.find((i) => i.id === "theme-toggle")?.icon}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AiAssistantPopup />
    </>
  );
}
