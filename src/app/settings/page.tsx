"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  MagneticDock,
  DockIconHome,
  DockIconSearch,
  DockIconFolder,
  DockIconMail,
  DockIconMusic,
  DockIconSettings,
} from "@/components/ui/magnetic-dock";
import { ThemeButton } from "@/components/ThemeButton";
import { getSiteConfig, saveSiteConfig, defaultSiteConfig } from "@/utils/siteConfig";

export default function SettingsPage() {
  // --- Dynamic Site Content States ---
  const [heroTitle, setHeroTitle] = useState(defaultSiteConfig.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(defaultSiteConfig.heroSubtitle);
  const [heroDescription, setHeroDescription] = useState(defaultSiteConfig.heroDescription);
  const [phone, setPhone] = useState(defaultSiteConfig.phone);
  const [whatsappUrl, setWhatsappUrl] = useState(defaultSiteConfig.whatsappUrl);
  const [address, setAddress] = useState(defaultSiteConfig.address);
  const [companyNumber, setCompanyNumber] = useState(defaultSiteConfig.companyNumber);
  const [promoText, setPromoText] = useState(defaultSiteConfig.promoText);

  // --- MagneticDock Local Settings State ---
  const [dockIconSize, setDockIconSize] = useState(40);
  const [dockMaxScale, setDockMaxScale] = useState(1.3);
  const [dockMagneticDistance, setDockMagneticDistance] = useState(100);
  const [dockPosition, setDockPosition] = useState<"bottom" | "top" | "left" | "right">("bottom");
  const [dockVariant, setDockVariant] = useState<"glass" | "solid" | "transparent">("glass");
  const [dockShowLabels, setDockShowLabels] = useState(true);
  const [dockIconStyle, setDockIconStyle] = useState<"default" | "creative">("default");
  const [dockDesign, setDockDesign] = useState<"classic" | "sketchy" | "brutalist" | "neon" | "minimal">("classic");

  const [heroGoldenOverlay, setHeroGoldenOverlay] = useState(false);
  const [dockUnifiedGlow, setDockUnifiedGlow] = useState(false);

  // Position and mobile configurations
  const [dockMobileMode, setDockMobileMode] = useState<"hamburger" | "always">("hamburger");
  const [dockSide, setDockSide] = useState<"bottom" | "top" | "left" | "right">("bottom");
  const [dockVerticalAlign, setDockVerticalAlign] = useState<"bottom" | "top" | "center">("bottom");
  const [dockCenterOffset, setDockCenterOffset] = useState<number>(0);

  // --- Toast alert notifications state ---
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // --- Load Saved Settings ---
  useEffect(() => {
    try {
      // Load Dynamic Site Content
      const config = getSiteConfig();
      setHeroTitle(config.heroTitle);
      setHeroSubtitle(config.heroSubtitle);
      setHeroDescription(config.heroDescription);
      setPhone(config.phone);
      setWhatsappUrl(config.whatsappUrl);
      setAddress(config.address);
      setCompanyNumber(config.companyNumber);
      setPromoText(config.promoText);

      // Dock properties
      const savedDockSize = localStorage.getItem("dock_iconSize");
      if (savedDockSize) setDockIconSize(parseInt(savedDockSize));

      const savedDockScale = localStorage.getItem("dock_maxScale");
      if (savedDockScale) setDockMaxScale(parseFloat(savedDockScale));

      const savedDockDist = localStorage.getItem("dock_magneticDistance");
      if (savedDockDist) setDockMagneticDistance(parseInt(savedDockDist));

      const savedDockPos = localStorage.getItem("dock_position");
      if (savedDockPos) setDockPosition(savedDockPos as any);

      const savedDockVar = localStorage.getItem("dock_variant");
      if (savedDockVar) setDockVariant(savedDockVar as any);

      const savedDockLabels = localStorage.getItem("dock_showLabels");
      if (savedDockLabels) setDockShowLabels(savedDockLabels === "true");

      const savedDockIconStyle = localStorage.getItem("dock_iconStyle");
      if (savedDockIconStyle) setDockIconStyle(savedDockIconStyle as any);

      const savedDockDesign = localStorage.getItem("dock_design");
      if (savedDockDesign) setDockDesign(savedDockDesign as any);

      const savedGoldenOverlay = localStorage.getItem("hero_goldenOverlay");
      if (savedGoldenOverlay) setHeroGoldenOverlay(savedGoldenOverlay === "true");

      const savedUnifiedGlow = localStorage.getItem("dock_unifiedGlow");
      if (savedUnifiedGlow) setDockUnifiedGlow(savedUnifiedGlow === "true");

      const savedMobileMode = localStorage.getItem("dock_mobileMode");
      if (savedMobileMode) setDockMobileMode(savedMobileMode as any);

      const savedSide = localStorage.getItem("dock_side");
      if (savedSide) setDockSide(savedSide as any);

      const savedAlign = localStorage.getItem("dock_verticalAlign");
      if (savedAlign) setDockVerticalAlign(savedAlign as any);

      const savedOffset = localStorage.getItem("dock_centerOffset");
      if (savedOffset) setDockCenterOffset(parseInt(savedOffset));
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    }
  }, []);

  // --- Save Individual Sections ---
  const handleSaveDockParameters = () => {
    try {
      localStorage.setItem("dock_iconSize", dockIconSize.toString());
      localStorage.setItem("dock_maxScale", dockMaxScale.toString());
      localStorage.setItem("dock_magneticDistance", dockMagneticDistance.toString());
      localStorage.setItem("dock_position", dockPosition);
      localStorage.setItem("dock_variant", dockVariant);
      localStorage.setItem("dock_showLabels", dockShowLabels.toString());
      localStorage.setItem("dock_mobileMode", dockMobileMode);
      localStorage.setItem("dock_side", dockSide);
      localStorage.setItem("dock_verticalAlign", dockVerticalAlign);
      localStorage.setItem("dock_centerOffset", dockCenterOffset.toString());
      
      window.dispatchEvent(new Event("storage"));
      triggerToast("Dock parameters saved successfully!", "success");
    } catch (e) {
      console.error(e);
      triggerToast("Failed to save dock parameters.", "error");
    }
  };

  const handleSaveVisualOptions = () => {
    try {
      localStorage.setItem("dock_iconStyle", dockIconStyle);
      localStorage.setItem("dock_design", dockDesign);
      localStorage.setItem("dock_unifiedGlow", dockUnifiedGlow.toString());
      
      window.dispatchEvent(new Event("storage"));
      triggerToast("Visual style options saved successfully!", "success");
    } catch (e) {
      console.error(e);
      triggerToast("Failed to save visual styles.", "error");
    }
  };

  const handleSaveHeroSection = () => {
    try {
      saveSiteConfig({
        heroTitle,
        heroSubtitle,
        heroDescription,
        phone,
        whatsappUrl,
        address,
        companyNumber,
        promoText
      });
      localStorage.setItem("hero_goldenOverlay", heroGoldenOverlay.toString());
      
      window.dispatchEvent(new Event("storage"));
      triggerToast("Hero section configuration saved successfully!", "success");
    } catch (e) {
      console.error(e);
      triggerToast("Failed to save hero section.", "error");
    }
  };

  const handleSaveWebsiteContent = () => {
    try {
      saveSiteConfig({
        heroTitle,
        heroSubtitle,
        heroDescription,
        phone,
        whatsappUrl,
        address,
        companyNumber,
        promoText
      });
      
      window.dispatchEvent(new Event("storage"));
      triggerToast("Website content configuration saved successfully!", "success");
    } catch (e) {
      console.error(e);
      triggerToast("Failed to save website coordinates.", "error");
    }
  };

  // --- Save / Apply globally ---
  const handleApply = () => {
    try {
      saveSiteConfig({
        heroTitle,
        heroSubtitle,
        heroDescription,
        phone,
        whatsappUrl,
        address,
        companyNumber,
        promoText
      });

      localStorage.setItem("dock_iconSize", dockIconSize.toString());
      localStorage.setItem("dock_maxScale", dockMaxScale.toString());
      localStorage.setItem("dock_magneticDistance", dockMagneticDistance.toString());
      localStorage.setItem("dock_position", dockPosition);
      localStorage.setItem("dock_variant", dockVariant);
      localStorage.setItem("dock_showLabels", dockShowLabels.toString());
      localStorage.setItem("dock_iconStyle", dockIconStyle);
      localStorage.setItem("dock_design", dockDesign);
      localStorage.setItem("hero_goldenOverlay", heroGoldenOverlay.toString());
      localStorage.setItem("dock_unifiedGlow", dockUnifiedGlow.toString());

      localStorage.setItem("dock_mobileMode", dockMobileMode);
      localStorage.setItem("dock_side", dockSide);
      localStorage.setItem("dock_verticalAlign", dockVerticalAlign);
      localStorage.setItem("dock_centerOffset", dockCenterOffset.toString());

      window.dispatchEvent(new Event("storage"));
      triggerToast("All customizations applied globally!", "success");
    } catch (e) {
      console.error(e);
      triggerToast("Failed to apply settings globally.", "error");
    }
  };

  const handleReset = () => {
    if (confirm("Reset all customizations to factory defaults?")) {
      // Clear Dynamic Site Content
      localStorage.removeItem("site_heroTitle");
      localStorage.removeItem("site_heroSubtitle");
      localStorage.removeItem("site_heroDescription");
      localStorage.removeItem("site_phone");
      localStorage.removeItem("site_whatsappUrl");
      localStorage.removeItem("site_address");
      localStorage.removeItem("site_companyNumber");
      localStorage.removeItem("site_promoText");

      setHeroTitle(defaultSiteConfig.heroTitle);
      setHeroSubtitle(defaultSiteConfig.heroSubtitle);
      setHeroDescription(defaultSiteConfig.heroDescription);
      setPhone(defaultSiteConfig.phone);
      setWhatsappUrl(defaultSiteConfig.whatsappUrl);
      setAddress(defaultSiteConfig.address);
      setCompanyNumber(defaultSiteConfig.companyNumber);
      setPromoText(defaultSiteConfig.promoText);

      localStorage.removeItem("dock_iconSize");
      localStorage.removeItem("dock_maxScale");
      localStorage.removeItem("dock_magneticDistance");
      localStorage.removeItem("dock_position");
      localStorage.removeItem("dock_variant");
      localStorage.removeItem("dock_showLabels");
      localStorage.removeItem("dock_iconStyle");
      localStorage.removeItem("dock_design");
      localStorage.removeItem("hero_goldenOverlay");
      localStorage.removeItem("dock_unifiedGlow");

      localStorage.removeItem("dock_mobileMode");
      localStorage.removeItem("dock_side");
      localStorage.removeItem("dock_verticalAlign");
      localStorage.removeItem("dock_centerOffset");

      // Reload state variables
      setDockIconSize(40);
      setDockMaxScale(1.3);
      setDockMagneticDistance(100);
      setDockPosition("bottom");
      setDockVariant("glass");
      setDockShowLabels(true);
      setDockIconStyle("default");
      setDockDesign("classic");
      setHeroGoldenOverlay(false);
      setDockUnifiedGlow(false);

      setDockMobileMode("hamburger");
      setDockSide("bottom");
      setDockVerticalAlign("bottom");
      setDockCenterOffset(0);

      window.dispatchEvent(new Event("storage"));
      triggerToast("All customizations reset to defaults.", "success");
    }
  };

  // Preview dock items
  const previewItems = [
    { id: "home", label: "Home", icon: <DockIconHome className="w-5 h-5" />, isActive: true },
    { id: "search", label: "Search Guides", icon: <DockIconSearch className="w-5 h-5" /> },
    { id: "folder", label: "Finder", icon: <DockIconFolder className="w-5 h-5" /> },
    { id: "mail", label: "Messages", icon: <DockIconMail className="w-5 h-5" />, badge: 3 },
    { id: "music", label: "Music Center", icon: <DockIconMusic className="w-5 h-5" /> },
    { id: "settings", label: "Dock Config", icon: <DockIconSettings className="w-5 h-5" /> },
  ];

  const dockCodeString = `<MagneticDock 
  items={items}
  iconSize={${dockIconSize}}
  maxScale={${dockMaxScale}}
  magneticDistance={${dockMagneticDistance}}
  showLabels={${dockShowLabels}}
  position="${dockPosition}"
  variant="${dockVariant}"
/>`;

  return (
    <div className="relative w-full min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300 pt-32 pb-24 px-4">
      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-sans font-bold text-xs uppercase tracking-widest hover:underline">
            ← Back to Homepage
          </Link>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
            Component Configurator
          </h1>
          <p className="font-sans text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Customize dock and hero parameters in real-time, inspect visual changes instantly, and apply settings globally across the site.
          </p>
        </div>

        {/* Live Dock Interactive Preview Container */}
        <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[220px] backdrop-blur-md shadow-xl gap-4">
          <span className="text-xs uppercase tracking-widest font-sans font-bold text-zinc-450 dark:text-zinc-500">Live Magnetic Dock Preview</span>
          <MagneticDock
            items={previewItems}
            iconSize={dockIconSize}
            maxScale={dockMaxScale}
            magneticDistance={dockMagneticDistance}
            showLabels={dockShowLabels}
            position={dockPosition}
            variant={dockVariant}
            design={dockDesign}
            iconStyle={dockIconStyle}
          />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Column 1: MagneticDock Controller */}
          <div className="bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-3xl p-8 backdrop-blur-md space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-white/10 pb-4">
              <h2 className="text-xl font-sans font-bold tracking-tight">
                1. Magnetic Dock Parameters
              </h2>
              <button 
                onClick={handleSaveDockParameters}
                className="px-3 py-1.5 bg-[#C99537] text-zinc-950 font-sans font-bold text-[10px] tracking-wider uppercase border border-zinc-950 dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] transition-all cursor-pointer shrink-0"
              >
                Save Section
              </button>
            </div>

            <div className="space-y-4 font-sans text-sm">
              {/* Icon Size Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Base Icon Size</span>
                  <span className="text-primary">{dockIconSize}px</span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="80"
                  value={dockIconSize}
                  onChange={(e) => setDockIconSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C99537]"
                />
              </div>

              {/* Max Scale Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Hover Max Scale Factor</span>
                  <span className="text-primary">{dockMaxScale}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.1"
                  value={dockMaxScale}
                  onChange={(e) => setDockMaxScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C99537]"
                />
              </div>

              {/* Magnetic Distance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Magnetic Dist. (Effect Width)</span>
                  <span className="text-primary">{dockMagneticDistance}px</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={dockMagneticDistance}
                  onChange={(e) => setDockMagneticDistance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C99537]"
                />
              </div>

              {/* Position Select */}
              <div className="flex justify-between items-center gap-4 py-2 border-b border-zinc-200/50 dark:border-white/5">
                <span className="font-medium">Dock Orientation Position</span>
                <div className="flex border border-zinc-200 dark:border-neutral-700 rounded-lg overflow-hidden shrink-0">
                  {(["bottom", "top", "left", "right"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setDockPosition(pos)}
                      className={`px-3 py-1 text-xs font-bold capitalize transition-colors ${dockPosition === pos
                        ? "bg-[#C99537] text-white"
                        : "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant Select */}
              <div className="flex justify-between items-center gap-4 py-2 border-b border-zinc-200/50 dark:border-white/5">
                <span className="font-medium">Background Styling Variant</span>
                <div className="flex border border-zinc-200 dark:border-neutral-700 rounded-lg overflow-hidden shrink-0">
                  {(["glass", "solid", "transparent"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setDockVariant(v)}
                      className={`px-3 py-1 text-xs font-bold capitalize transition-colors ${dockVariant === v
                        ? "bg-[#C99537] text-white"
                        : "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Show Labels Toggle */}
              <div className="flex justify-between items-center py-2 border-b border-zinc-200/50 dark:border-white/5">
                <span className="font-medium">Render Hover Tooltip Labels</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dockShowLabels}
                    onChange={(e) => setDockShowLabels(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C99537]"></div>
                </label>
              </div>

              {/* Unified Background Glow Toggle */}
              <div className="flex justify-between items-center py-2 border-b border-zinc-200/50 dark:border-white/5">
                <div>
                  <span className="font-medium block">Unified Background Glow</span>
                  <span className="text-[10px] font-light text-zinc-500">Use same gold accent light glow for all options</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dockUnifiedGlow}
                    onChange={(e) => setDockUnifiedGlow(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C99537]"></div>
                </label>
              </div>

              {/* Mobile Dock Options */}
              <div className="flex justify-between items-center gap-4 py-2 border-b border-zinc-200/50 dark:border-white/5">
                <div>
                  <span className="font-medium block">Mobile Dock Mode</span>
                  <span className="text-[10px] font-light text-zinc-500">Hamburger triggered overlay vs. always visible</span>
                </div>
                <div className="flex border border-zinc-200 dark:border-neutral-700 rounded-lg overflow-hidden shrink-0">
                  {([
                    { label: "Hamburger Toggle", val: "hamburger" },
                    { label: "Always Visible", val: "always" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setDockMobileMode(opt.val)}
                      className={`px-3 py-1 text-xs font-bold transition-colors ${dockMobileMode === opt.val
                        ? "bg-[#C99537] text-white"
                        : "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dock Side Placement */}
              <div className="flex justify-between items-center gap-4 py-2 border-b border-zinc-200/50 dark:border-white/5">
                <div>
                  <span className="font-medium block">Dock Screen Side</span>
                  <span className="text-[10px] font-light text-zinc-500">Pick screen boundary edge</span>
                </div>
                <div className="flex border border-zinc-200 dark:border-neutral-700 rounded-lg overflow-hidden shrink-0">
                  {(["bottom", "top", "left", "right"] as const).map((side) => (
                    <button
                      key={side}
                      onClick={() => setDockSide(side)}
                      className={`px-3 py-1 text-xs font-bold capitalize transition-colors ${dockSide === side
                        ? "bg-[#C99537] text-white"
                        : "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dock Vertical Alignment (only active if left or right side) */}
              {(dockSide === "left" || dockSide === "right") && (
                <div className="flex justify-between items-center gap-4 py-2 border-b border-zinc-200/50 dark:border-white/5">
                  <div>
                    <span className="font-medium block">Dock Side Alignment</span>
                    <span className="text-[10px] font-light text-zinc-500">Align vertically on the side edge</span>
                  </div>
                  <div className="flex border border-zinc-200 dark:border-neutral-700 rounded-lg overflow-hidden shrink-0">
                    {(["bottom", "top", "center"] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => setDockVerticalAlign(align)}
                        className={`px-3 py-1 text-xs font-bold capitalize transition-colors ${dockVerticalAlign === align
                          ? "bg-[#C99537] text-white"
                          : "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Center Offset Coordinate Slider */}
              <div className="space-y-2 py-2 border-b border-zinc-200/50 dark:border-white/5">
                <div className="flex justify-between font-medium">
                  <div>
                    <span className="block">Alignment Height Offset</span>
                    <span className="text-[10px] font-light text-zinc-500">Shift up/down from screen boundary/center</span>
                  </div>
                  <span className="text-primary">{dockCenterOffset}px</span>
                </div>
                <input
                  type="range"
                  min="-300"
                  max="300"
                  step="5"
                  value={dockCenterOffset}
                  onChange={(e) => setDockCenterOffset(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C99537]"
                />
              </div>
            </div>
          </div>
          {/* Column 2: Icon Style & Design */}
          <div className="bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-3xl p-8 backdrop-blur-md space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-white/10 pb-4">
              <h2 className="text-xl font-sans font-bold tracking-tight">
                2. Visual Style Options
              </h2>
              <button 
                onClick={handleSaveVisualOptions}
                className="px-3 py-1.5 bg-[#C99537] text-zinc-950 font-sans font-bold text-[10px] tracking-wider uppercase border border-zinc-950 dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] transition-all cursor-pointer shrink-0"
              >
                Save Section
              </button>
            </div>

            <div className="space-y-4 font-sans text-sm">
              {/* Icon Style Toggle */}
              <div className="py-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Dock Icon Style</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Preview</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Default Option */}
                  <button
                    onClick={() => setDockIconStyle("default")}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      dockIconStyle === "default"
                        ? "border-[#C99537] bg-[#C99537]/10"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {dockIconStyle === "default" && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C99537]" />
                    )}
                    {/* Default icon preview row */}
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-550">Default</span>
                    <span className="text-[10px] text-zinc-400 text-center leading-tight">Clean minimal strokes</span>
                  </button>

                  {/* Creative Option */}
                  <button
                    onClick={() => setDockIconStyle("creative")}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      dockIconStyle === "creative"
                        ? "border-[#C99537] bg-[#C99537]/10"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {dockIconStyle === "creative" && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C99537]" />
                    )}
                    {/* Creative icon preview row */}
                    <div className="flex items-center gap-2">
                      {/* Mini sun */}
                      <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                        <defs><radialGradient id="s1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFD700" /><stop offset="100%" stopColor="#FF8C00" /></radialGradient></defs>
                        <circle cx="16" cy="16" r="7" fill="url(#s1)" />
                        <line x1="25" y1="16" x2="28" y2="16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                        <line x1="20.5" y1="23.8" x2="22" y2="26.4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                        <line x1="11.5" y1="23.8" x2="10" y2="26.4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                        <line x1="7" y1="16" x2="4" y2="16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                        <line x1="11.5" y1="8.2" x2="10" y2="5.6" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                        <line x1="20.5" y1="8.2" x2="22" y2="5.6" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {/* Mini star */}
                      <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                        <defs><linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFD700" /><stop offset="100%" stopColor="#C99537" /></linearGradient></defs>
                        <polygon points="16,3 19.5,12 29,12.5 22,19 24.5,29 16,23.5 7.5,29 10,19 3,12.5 12.5,12" fill="url(#sg1)" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-550">Creative</span>
                    <span className="text-[10px] text-zinc-400 text-center leading-tight">Artistic travel-themed</span>
                  </button>
                </div>
              </div>

              {/* Dock Design Style Toggle */}
              <div className="py-3 border-t border-zinc-200/50 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium block">Dock Container Design</span>
                    <span className="text-[10px] font-light text-zinc-500">Pick from 5 unique styles</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Classic Option */}
                  <button
                    onClick={() => setDockDesign("classic")}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                      dockDesign === "classic"
                        ? "border-[#C99537] bg-[#C99537]/10"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {dockDesign === "classic" && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C99537]" />
                    )}
                    {/* Classic layout preview */}
                    <div className="w-16 h-8 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-300 dark:border-white/10 flex items-center justify-center gap-1 shadow-sm">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#C99537] opacity-80" />
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-500 opacity-85" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-550 mt-1">Classic</span>
                    <span className="text-[9px] text-zinc-400 text-center leading-tight">Glass & glow</span>
                  </button>

                  {/* Sketchy Option */}
                  <button
                    onClick={() => setDockDesign("sketchy")}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                      dockDesign === "sketchy"
                        ? "border-[#C99537] bg-[#C99537]/10"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {dockDesign === "sketchy" && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C99537]" />
                    )}
                    {/* Sketchy layout preview */}
                    <div
                      className="w-16 h-8 rounded-md bg-[#faf6eb] dark:bg-zinc-900 border border-zinc-700 flex items-center justify-center gap-1"
                      style={{
                        filter: "url(#sketchy-sm)",
                        boxShadow: "1px 1.5px 0 0.5px rgba(0, 0, 0, 0.25)",
                        transform: "rotate(-1deg)"
                      }}
                    >
                      <div className="w-2.5 h-2.5 border border-zinc-600 rounded-xs bg-[#C99537]/80" />
                      <div className="w-2.5 h-2.5 border border-zinc-600 rounded-xs bg-blue-500/80" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-550 mt-1">Sketchy</span>
                    <span className="text-[9px] text-zinc-400 text-center leading-tight">Hand-drawn</span>
                  </button>

                  {/* Brutalist Option */}
                  <button
                    onClick={() => setDockDesign("brutalist")}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                      dockDesign === "brutalist"
                        ? "border-[#C99537] bg-[#C99537]/10"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {dockDesign === "brutalist" && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C99537]" />
                    )}
                    {/* Brutalist layout preview */}
                    <div className="w-16 h-8 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-white flex items-center justify-center gap-1 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]">
                      <div className="w-3 h-3 bg-[#C99537] border border-zinc-950 dark:border-white" />
                      <div className="w-3 h-3 bg-blue-500 border border-zinc-950 dark:border-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-550 mt-1">Brutalist</span>
                    <span className="text-[9px] text-zinc-400 text-center leading-tight">Flat offset</span>
                  </button>

                  {/* Neon Option */}
                  <button
                    onClick={() => setDockDesign("neon")}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                      dockDesign === "neon"
                        ? "border-[#C99537] bg-[#C99537]/10"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {dockDesign === "neon" && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C99537]" />
                    )}
                    {/* Neon layout preview */}
                    <div className="w-16 h-8 rounded-lg bg-zinc-950 border border-[#C99537] flex items-center justify-center gap-1 shadow-[0_0_6px_rgba(201,149,55,0.4)]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C99537] shadow-[0_0_3px_rgba(201,149,55,0.8)]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_3px_rgba(59,130,246,0.8)]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-550 mt-1">Neon</span>
                    <span className="text-[9px] text-zinc-400 text-center leading-tight">Cyber glow</span>
                  </button>

                  {/* Minimal Option */}
                  <button
                    onClick={() => setDockDesign("minimal")}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                      dockDesign === "minimal"
                        ? "border-[#C99537] bg-[#C99537]/10"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {dockDesign === "minimal" && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C99537]" />
                    )}
                    {/* Minimal layout preview */}
                    <div className="w-16 h-8 bg-transparent flex items-center justify-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-700 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C99537]" />
                      </div>
                      <div className="w-3.5 h-3.5 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-350 dark:border-zinc-700 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-550 mt-1">Minimal</span>
                    <span className="text-[9px] text-zinc-400 text-center leading-tight">Borderless</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Settings Card */}
        <div className="bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm border border-zinc-200/80 dark:border-white/8 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-200/50 dark:border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white">3. Hero Section</h2>
              <p className="text-xs font-light text-zinc-500">Visual overlays and effects on the landing hero video.</p>
            </div>
            <button 
              onClick={handleSaveHeroSection}
              className="px-3 py-1.5 bg-[#C99537] text-zinc-950 font-sans font-bold text-[10px] tracking-wider uppercase border border-zinc-950 dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] transition-all cursor-pointer shrink-0"
            >
              Save Section
            </button>
          </div>
          <div className="space-y-4">
            {/* Golden overlay toggle */}
            <div className="flex justify-between items-center py-3 border-b border-zinc-200/50 dark:border-white/5">
              <div>
                <span className="font-medium block">Golden Shimmer Overlay</span>
                <span className="text-xs text-zinc-500 font-light">Adds a warm gold radial glow over the hero video</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={heroGoldenOverlay}
                  onChange={(e) => setHeroGoldenOverlay(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C99537]"></div>
              </label>
            </div>

            {/* Preview swatch */}
            <div className="relative h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-800 via-sky-600 to-slate-800" />
              {heroGoldenOverlay && (
                <div
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,149,55,0.35) 0%, rgba(201,149,55,0.10) 55%, transparent 100%)" }}
                />
              )}
              <div className="relative z-10 h-full flex items-center justify-center">
                <span className="text-white/70 text-xs font-sans tracking-widest uppercase">Hero Preview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Website Content Configuration */}
        <div className="bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm border border-zinc-200/80 dark:border-white/8 rounded-3xl p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-200/50 dark:border-white/5 pb-4">
            <div>
              <h2 className="text-xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white">4. Website Content Configuration</h2>
              <p className="text-xs font-light text-zinc-500">Edit core website copywriting, headings, links, and contact coordinates. Apply settings globally to persist the changes.</p>
            </div>
            <button 
              onClick={handleSaveWebsiteContent}
              className="px-3 py-1.5 bg-[#C99537] text-zinc-950 font-sans font-bold text-[10px] tracking-wider uppercase border border-zinc-950 dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_#000] transition-all cursor-pointer shrink-0"
            >
              Save Section
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-sm">
            {/* Hero Title */}
            <div className="space-y-2">
              <label className="font-semibold block">Hero Brand Heading</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Hero Subtitle */}
            <div className="space-y-2">
              <label className="font-semibold block">Hero Subtitle</label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Hero Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="font-semibold block">Hero Description Text</label>
              <textarea
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                rows={3}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-primary font-sans leading-relaxed resize-y"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="font-semibold block">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Promo Strip Text */}
            <div className="space-y-2">
              <label className="font-semibold block">Top Promo Strip Text</label>
              <input
                type="text"
                value={promoText}
                onChange={(e) => setPromoText(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* Companies House Number */}
            <div className="space-y-2">
              <label className="font-semibold block">Companies House Number (UK)</label>
              <input
                type="text"
                value={companyNumber}
                onChange={(e) => setCompanyNumber(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>

            {/* WhatsApp API Link */}
            <div className="space-y-2 md:col-span-2">
              <label className="font-semibold block">WhatsApp API Integration URL</label>
              <input
                type="text"
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-primary font-mono text-xs"
              />
            </div>

            {/* Office Physical Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="font-semibold block">Office Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Global Save Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t border-zinc-250 dark:border-white/10">
          <ThemeButton onClick={handleApply}>
            Apply Settings Globally
          </ThemeButton>
          <button
            onClick={handleReset}
            className="px-6 py-3 font-sans font-bold text-xs uppercase tracking-wider rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>

        {/* Generated Code block */}
        <div className="bg-zinc-900 text-zinc-200 border border-white/5 rounded-3xl p-8 space-y-4">
          <h3 className="text-lg font-sans font-bold text-white border-b border-white/10 pb-4">
            Generated Dock JSX
          </h3>
          <span className="text-xs text-zinc-500 uppercase tracking-widest block">MagneticDock JSX Code</span>
          <pre className="p-4 bg-black/60 rounded-xl text-xs font-mono overflow-x-auto text-emerald-400 select-all border border-white/5">
            {dockCodeString}
          </pre>
        </div>

        {/* Brutalist Custom Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`fixed bottom-6 left-6 z-[9999] px-6 py-4 border-3 border-zinc-950 dark:border-white font-sans font-bold text-xs uppercase tracking-widest flex items-center gap-3 shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] ${
                toast.type === "success" 
                  ? "bg-[#C99537] text-zinc-950" 
                  : "bg-red-500 text-white"
              }`}
            >
              <span>{toast.type === "success" ? "✓" : "✗"}</span>
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
