"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import FloatingLines from "@/components/ui/floating-lines";
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

export default function SettingsPage() {
  // --- FloatingLines Local Settings State ---
  const [lineCount, setLineCount] = useState(1);
  const [lineDistance, setLineDistance] = useState(8);
  const [bendRadius, setBendRadius] = useState(8);
  const [bendStrength, setBendStrength] = useState(-2);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [gradientStart, setGradientStart] = useState("#e945f5");
  const [gradientMid, setGradientMid] = useState("#6f6f6f");
  const [gradientEnd, setGradientEnd] = useState("#6a6a6a");

  // --- MagneticDock Local Settings State ---
  const [dockIconSize, setDockIconSize] = useState(40);
  const [dockMaxScale, setDockMaxScale] = useState(1.3);
  const [dockMagneticDistance, setDockMagneticDistance] = useState(100);
  const [dockPosition, setDockPosition] = useState<"bottom" | "top" | "left" | "right">("bottom");
  const [dockVariant, setDockVariant] = useState<"glass" | "solid" | "transparent">("glass");
  const [dockShowLabels, setDockShowLabels] = useState(true);
  const [dockIconStyle, setDockIconStyle] = useState<"default" | "creative">("default");

  // --- Hero Section Settings ---
  const [heroGoldenOverlay, setHeroGoldenOverlay] = useState(false);

  // --- Load Saved Settings ---
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem("fl_lineCount");
      if (savedCount) setLineCount(parseInt(savedCount));

      const savedDistance = localStorage.getItem("fl_lineDistance");
      if (savedDistance) setLineDistance(parseInt(savedDistance));

      const savedRadius = localStorage.getItem("fl_bendRadius");
      if (savedRadius) setBendRadius(parseFloat(savedRadius));

      const savedStrength = localStorage.getItem("fl_bendStrength");
      if (savedStrength) setBendStrength(parseFloat(savedStrength));

      const savedSpeed = localStorage.getItem("fl_animationSpeed");
      if (savedSpeed) setAnimationSpeed(parseFloat(savedSpeed));

      const savedStart = localStorage.getItem("fl_gradientStart");
      if (savedStart) setGradientStart(savedStart);

      const savedMid = localStorage.getItem("fl_gradientMid");
      if (savedMid) setGradientMid(savedMid);

      const savedEnd = localStorage.getItem("fl_gradientEnd");
      if (savedEnd) setGradientEnd(savedEnd);

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

      const savedGoldenOverlay = localStorage.getItem("hero_goldenOverlay");
      if (savedGoldenOverlay) setHeroGoldenOverlay(savedGoldenOverlay === "true");
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    }
  }, []);

  // --- Save / Apply globally ---
  const handleApply = () => {
    try {
      localStorage.setItem("fl_lineCount", lineCount.toString());
      localStorage.setItem("fl_lineDistance", lineDistance.toString());
      localStorage.setItem("fl_bendRadius", bendRadius.toString());
      localStorage.setItem("fl_bendStrength", bendStrength.toString());
      localStorage.setItem("fl_animationSpeed", animationSpeed.toString());
      localStorage.setItem("fl_gradientStart", gradientStart);
      localStorage.setItem("fl_gradientMid", gradientMid);
      localStorage.setItem("fl_gradientEnd", gradientEnd);

      localStorage.setItem("dock_iconSize", dockIconSize.toString());
      localStorage.setItem("dock_maxScale", dockMaxScale.toString());
      localStorage.setItem("dock_magneticDistance", dockMagneticDistance.toString());
      localStorage.setItem("dock_position", dockPosition);
      localStorage.setItem("dock_variant", dockVariant);
      localStorage.setItem("dock_showLabels", dockShowLabels.toString());
      localStorage.setItem("dock_iconStyle", dockIconStyle);
      localStorage.setItem("hero_goldenOverlay", heroGoldenOverlay.toString());

      // Trigger custom storage update event to sync on active components in DOM immediately
      window.dispatchEvent(new Event("storage"));
      alert("Settings applied globally successfully!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all customizations to factory defaults?")) {
      localStorage.removeItem("fl_lineCount");
      localStorage.removeItem("fl_lineDistance");
      localStorage.removeItem("fl_bendRadius");
      localStorage.removeItem("fl_bendStrength");
      localStorage.removeItem("fl_animationSpeed");
      localStorage.removeItem("fl_gradientStart");
      localStorage.removeItem("fl_gradientMid");
      localStorage.removeItem("fl_gradientEnd");

      localStorage.removeItem("dock_iconSize");
      localStorage.removeItem("dock_maxScale");
      localStorage.removeItem("dock_magneticDistance");
      localStorage.removeItem("dock_position");
      localStorage.removeItem("dock_variant");
      localStorage.removeItem("dock_showLabels");
      localStorage.removeItem("dock_iconStyle");
      localStorage.removeItem("hero_goldenOverlay");

      // Reload state variables
      setLineCount(8);
      setLineDistance(8);
      setBendRadius(8);
      setBendStrength(-2);
      setAnimationSpeed(1);
      setGradientStart("#e945f5");
      setGradientMid("#6f6f6f");
      setGradientEnd("#6a6a6a");

      setDockIconSize(40);
      setDockMaxScale(1.3);
      setDockMagneticDistance(100);
      setDockPosition("bottom");
      setDockVariant("glass");
      setDockShowLabels(true);
      setDockIconStyle("default");
      setHeroGoldenOverlay(false);

      window.dispatchEvent(new Event("storage"));
      alert("Settings reset to default values.");
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

  // Generated React Component code representation
  const flCodeString = `<FloatingLines 
  enabledWaves={["top", "middle", "bottom"]}
  lineCount={${lineCount}}
  lineDistance={${lineDistance}}
  bendRadius={${bendRadius}}
  bendStrength={${bendStrength}}
  interactive={true}
  parallax={true}
  animationSpeed={${animationSpeed}}
  gradientStart="${gradientStart}"
  gradientMid="${gradientMid}"
  gradientEnd="${gradientEnd}"
/>`;

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
    <div className="relative w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 pt-32 pb-48 px-4">
      {/* Dynamic Background Preview block */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={lineCount}
          lineDistance={lineDistance}
          bendRadius={bendRadius}
          bendStrength={bendStrength}
          interactive={false}
          parallax={false}
          animationSpeed={animationSpeed}
          gradientStart={gradientStart}
          gradientMid={gradientMid}
          gradientEnd={gradientEnd}
        />
      </div>

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
            Customize parameters in real-time, inspect physics and visual changes instantly, and copy components' drop-in JSX markup files.
          </p>
        </div>

        {/* Live Dock Interactive Preview Container */}
        <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[220px] backdrop-blur-md shadow-xl gap-4">
          <span className="text-xs uppercase tracking-widest font-sans font-bold text-zinc-450 dark:text-zinc-500">Live Magnetic Dock Preview</span>

          <div className="py-4 w-full flex items-center justify-center overflow-x-auto">
            <MagneticDock
              items={previewItems}
              iconSize={dockIconSize}
              maxScale={dockMaxScale}
              magneticDistance={dockMagneticDistance}
              showLabels={dockShowLabels}
              position={dockPosition}
              variant={dockVariant}
            />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Column 1: FloatingLines Controller */}
          <div className="bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-3xl p-8 backdrop-blur-md space-y-6">
            <h2 className="text-xl font-sans font-bold tracking-tight border-b border-zinc-200 dark:border-white/10 pb-4">
              1. Floating Lines Parameters
            </h2>

            <div className="space-y-4 font-sans text-sm">
              {/* Line Count Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Line Count (Density)</span>
                  <span className="text-primary">{lineCount}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  value={lineCount}
                  onChange={(e) => setLineCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C99537]"
                />
              </div>

              {/* Line Distance Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Line Distance</span>
                  <span className="text-primary">{lineDistance}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={lineDistance}
                  onChange={(e) => setLineDistance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C99537]"
                />
              </div>

              {/* Bend Radius Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Bend Radius</span>
                  <span className="text-primary">{bendRadius}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.5"
                  value={bendRadius}
                  onChange={(e) => setBendRadius(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C99537]"
                />
              </div>

              {/* Bend Strength Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Bend Strength (Deformation)</span>
                  <span className="text-primary">{bendStrength}</span>
                </div>
                <input
                  type="range"
                  min="-8"
                  max="8"
                  step="0.5"
                  value={bendStrength}
                  onChange={(e) => setBendStrength(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C99537]"
                />
              </div>

              {/* Speed Slider */}
              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Animation Speed</span>
                  <span className="text-primary">{animationSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.1"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#C99537]"
                />
              </div>

              {/* Color Gradient Pickers */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">Start Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={gradientStart}
                      onChange={(e) => setGradientStart(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 outline-none"
                    />
                    <span className="text-xs font-mono select-all uppercase">{gradientStart}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">Mid Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={gradientMid}
                      onChange={(e) => setGradientMid(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 outline-none"
                    />
                    <span className="text-xs font-mono select-all uppercase">{gradientMid}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">End Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={gradientEnd}
                      onChange={(e) => setGradientEnd(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 outline-none"
                    />
                    <span className="text-xs font-mono select-all uppercase">{gradientEnd}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: MagneticDock Controller */}
          <div className="bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-3xl p-8 backdrop-blur-md space-y-6">
            <h2 className="text-xl font-sans font-bold tracking-tight border-b border-zinc-200 dark:border-white/10 pb-4">
              2. Magnetic Dock Parameters
            </h2>

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
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Default</span>
                    <span className="text-[10px] text-zinc-400 text-center">Clean minimal strokes</span>
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
                        {/* Pre-computed ray endpoints for 0,60,120,180,240,300 degrees — avoids SSR/CSR float mismatch */}
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
                      {/* Mini globe */}
                      <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
                        <defs><radialGradient id="gg1" cx="40%" cy="40%" r="55%"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0369a1" /></radialGradient></defs>
                        <circle cx="16" cy="16" r="12" fill="url(#gg1)" />
                        <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="#bae6fd" strokeWidth="0.8" opacity="0.5" />
                        <path d="M10 12 Q13 9 15 12 Q17 14 20 12 Q22 10 22 14 Q21 18 18 18 Q15 19 13 17 Q10 15 10 12Z" fill="#22c55e" opacity="0.7" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Creative</span>
                    <span className="text-[10px] text-zinc-400 text-center">Artistic travel-themed</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section Settings Card */}
        <div className="bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm border border-zinc-200/80 dark:border-white/8 rounded-3xl p-8 space-y-6">
          <div>
            <h2 className="text-xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white mb-1">3. Hero Section</h2>
            <p className="text-xs font-light text-zinc-500">Visual overlays and effects on the landing hero video.</p>
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

        {/* Generated Code blocks */}
        <div className="bg-zinc-900 text-zinc-200 border border-white/5 rounded-3xl p-8 space-y-6">
          <h3 className="text-lg font-sans font-bold text-white border-b border-white/10 pb-4">
            3. Generated Component Code
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs text-zinc-500 uppercase tracking-widest block">FloatingLines JSX Code</span>
              <pre className="p-4 bg-black/60 rounded-xl text-xs font-mono overflow-x-auto text-emerald-400 select-all border border-white/5">
                {flCodeString}
              </pre>
            </div>
            <div className="space-y-2">
              <span className="text-xs text-zinc-500 uppercase tracking-widest block">MagneticDock JSX Code</span>
              <pre className="p-4 bg-black/60 rounded-xl text-xs font-mono overflow-x-auto text-emerald-400 select-all border border-white/5">
                {dockCodeString}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
