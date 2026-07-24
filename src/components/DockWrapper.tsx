"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  MagneticDock,
  DockIconHome,
} from "@/components/ui/magnetic-dock";
import { trackContact } from "@/lib/analytics";

/* ─────────────────────────────────────────
   DEFAULT ICONS  (clean stroke SVGs)
───────────────────────────────────────── */
const DefaultPassportIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <circle cx="12" cy="10" r="3" />
    <path d="M12 7v6M9 10h6" />
  </svg>
);
const DefaultPricingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const DefaultRouteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" />
  </svg>
);
const DefaultFaqIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </svg>
);
const DefaultStarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const DefaultAboutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const DefaultContactIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const DefaultBotIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 8V4H8M12 8v4M12 12H8m4 0h4m-4 8v-4m0-4V8h.01" />
    <rect x="5" y="8" width="14" height="10" rx="2" /><circle cx="9" cy="13" r="1" /><circle cx="15" cy="13" r="1" />
  </svg>
);
const DefaultWhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" />
  </svg>
);

/* ─────────────────────────────────────────
   CREATIVE ICONS  (artistic, travel-themed, 
   colourful — inspired by the theme toggle)
───────────────────────────────────────── */

/** Home – a premium handcrafted house with sun, clouds, and tree */
const CreativeHomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 512 512" fill="none" {...props}>
    <defs>
      {/* Terracotta Roof Gradient */}
      <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
      {/* Warm Cream Walls Gradient */}
      <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </linearGradient>
      {/* Terracotta Wood Door Gradient */}
      <linearGradient id="doorGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      {/* Sky Blue Glass Window Gradient */}
      <linearGradient id="windowGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      {/* Glowing Golden Sun Gradient */}
      <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="70%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </radialGradient>
      {/* Emerald Green Leaves Gradient */}
      <linearGradient id="foliageGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      {/* Dark Wood Trunk Gradient */}
      <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      {/* Fluffy White Cloud Gradient */}
      <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>

    {/* Sun (behind roof) */}
    <g id="sun">
      <circle cx="170" cy="170" r="60" fill="url(#sunGrad)" />
      {/* Sun rays */}
      <g stroke="#eab308" strokeWidth="6" strokeLinecap="round">
        <line x1="170" y1="80" x2="170" y2="100" />
        <line x1="170" y1="240" x2="170" y2="260" />
        <line x1="80" y1="170" x2="100" y2="170" />
        <line x1="240" y1="170" x2="260" y2="170" />
        <line x1="106" y1="106" x2="120" y2="120" />
        <line x1="220" y1="220" x2="234" y2="234" />
        <line x1="220" y1="120" x2="234" y2="106" />
        <line x1="106" y1="234" x2="120" y2="220" />
      </g>
    </g>

    {/* Clouds */}
    <g id="clouds">
      <path d="M 400 130 C 400 110, 420 100, 440 110 C 455 100, 475 110, 475 130 C 485 130, 495 140, 495 155 C 495 170, 485 180, 470 180 L 390 180 C 375 180, 365 170, 365 155 C 365 140, 375 130, 390 130 Z" 
            fill="url(#cloudGrad)" stroke="#1c1917" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 60 110 C 60 95, 75 88, 90 95 C 100 88, 115 95, 115 110 C 122 110, 130 118, 130 130 C 130 142, 122 150, 110 150 L 50 150 C 38 150, 30 142, 30 130 C 30 118, 38 110, 50 110 Z" 
            fill="url(#cloudGrad)" stroke="#1c1917" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </g>

    {/* Smoke (emitted from chimney) */}
    <g id="smoke" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.6">
      <path d="M 370 120 Q 380 90 365 70" />
      <path d="M 382 100 Q 395 80 385 60" />
    </g>

    {/* Chimney */}
    <g id="chimney">
      <rect x="350" y="150" width="38" height="85" rx="4" fill="url(#roofGrad)" stroke="#1c1917" strokeWidth="12" strokeLinejoin="round" />
      {/* Chimney rim */}
      <rect x="342" y="140" width="54" height="15" rx="2" fill="#7c2d12" stroke="#1c1917" strokeWidth="12" strokeLinejoin="round" />
    </g>

    {/* Tree (beside house) */}
    <g id="tree">
      {/* Tree trunk */}
      <rect x="85" y="280" width="22" height="130" rx="6" fill="url(#trunkGrad)" stroke="#1c1917" strokeWidth="12" strokeLinejoin="round" />
      {/* Fluffy green foliage */}
      <path d="M 96 150 C 60 150 40 180 40 210 C 20 220 20 260 45 275 C 40 300 70 310 96 310 C 122 310 152 300 147 275 C 172 260 172 220 152 210 C 152 180 132 150 96 150 Z" 
            fill="url(#foliageGrad)" stroke="#1c1917" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      {/* Leaf detail details */}
      <path d="M 75 200 Q 96 220 85 250" stroke="#047857" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 120 210 Q 96 230 110 260" stroke="#047857" strokeWidth="6" strokeLinecap="round" fill="none" />
    </g>

    {/* House Base */}
    <g id="house-base">
      <rect x="175" y="240" width="215" height="170" rx="12" fill="url(#wallGrad)" stroke="#1c1917" strokeWidth="12" strokeLinejoin="round" />
    </g>

    {/* Roof */}
    <g id="roof">
      <path d="M 140 245 L 282.5 110 L 425 245 Z" fill="url(#roofGrad)" stroke="#1c1917" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      {/* Roof window */}
      <circle cx="282.5" cy="180" r="18" fill="url(#windowGrad)" stroke="#1c1917" strokeWidth="10" />
      <line x1="282.5" y1="162" x2="282.5" y2="198" stroke="#1c1917" strokeWidth="8" />
      <line x1="264.5" y1="180" x2="300.5" y2="180" stroke="#1c1917" strokeWidth="8" />
    </g>

    {/* Door */}
    <g id="door">
      <rect x="257.5" y="305" width="50" height="105" rx="6" fill="url(#doorGrad)" stroke="#1c1917" strokeWidth="12" strokeLinejoin="round" />
      {/* Brass doorknob */}
      <circle cx="270" cy="355" r="5" fill="#facc15" stroke="#1c1917" strokeWidth="8" />
    </g>

    {/* Windows */}
    <g id="windows">
      {/* Left rounded window */}
      <rect x="202" y="260" width="40" height="50" rx="8" fill="url(#windowGrad)" stroke="#1c1917" strokeWidth="12" strokeLinejoin="round" />
      <line x1="222" y1="260" x2="222" y2="310" stroke="#1c1917" strokeWidth="8" />
      <line x1="202" y1="285" x2="242" y2="285" stroke="#1c1917" strokeWidth="8" />

      {/* Right rounded window */}
      <rect x="323" y="260" width="40" height="50" rx="8" fill="url(#windowGrad)" stroke="#1c1917" strokeWidth="12" strokeLinejoin="round" />
      <line x1="343" y1="260" x2="343" y2="310" stroke="#1c1917" strokeWidth="8" />
      <line x1="323" y1="285" x2="363" y2="285" stroke="#1c1917" strokeWidth="8" />
    </g>

    {/* Grass & Ground */}
    <g id="grass">
      {/* Flat ground line */}
      <line x1="25" y1="410" x2="487" y2="410" stroke="#1c1917" strokeWidth="12" strokeLinecap="round" />
      {/* Grass tufts left */}
      <path d="M 45 410 L 40 395 M 45 410 L 45 390 M 45 410 L 50 395" stroke="#047857" strokeWidth="8" strokeLinecap="round" />
      <path d="M 140 410 L 135 398 M 140 410 L 140 394 M 140 410 L 145 398" stroke="#047857" strokeWidth="8" strokeLinecap="round" />
      {/* Grass tufts right */}
      <path d="M 410 410 L 405 395 M 410 410 L 410 390 M 410 410 L 415 395" stroke="#047857" strokeWidth="8" strokeLinecap="round" />
      <path d="M 450 410 L 445 398 M 450 410 L 450 394 M 450 410 L 455 398" stroke="#047857" strokeWidth="8" strokeLinecap="round" />
    </g>
  </svg>
);

/** Schengen Visa – passport with EU circle of stars */
const CreativePassportIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <defs>
      <linearGradient id="passGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    {/* Passport book */}
    <rect x="6" y="3" width="20" height="26" rx="2.5" fill="url(#passGrad)" />
    <rect x="8" y="5" width="16" height="22" rx="1.5" fill="#1e40af" opacity="0.4" />
    {/* EU stars circle */}
    {Array.from({length: 12}).map((_, i) => {
      const a = (i * 30 - 90) * Math.PI / 180;
      return <circle key={i} cx={16 + 6.5 * Math.cos(a)} cy={14 + 6.5 * Math.sin(a)} r="0.9" fill="#FFD700" />;
    })}
    {/* Photo box */}
    <rect x="11" y="22" width="10" height="4" rx="1" fill="#93c5fd" opacity="0.6" />
    {/* Spine */}
    <rect x="6" y="3" width="2.5" height="26" rx="1.2" fill="#1e3a8a" opacity="0.6" />
  </svg>
);

/** Pricing – stylised golden coin/tag with upward arrow */
const CreativePricingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <defs>
      <radialGradient id="coinGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF176" />
        <stop offset="50%" stopColor="#C99537" />
        <stop offset="100%" stopColor="#92400e" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="16" r="12" fill="url(#coinGrad)" />
    <circle cx="16" cy="16" r="9" fill="none" stroke="#FFD700" strokeWidth="0.8" strokeDasharray="2 1.5" />
    <text x="16" y="20.5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1c1917" fontFamily="serif">£</text>
    {/* Arrow up */}
    <path d="M24 8 L27 5 L30 8" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="27" y1="5" x2="27" y2="11" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** How It Works – compass with colourful needle */
const CreativeRouteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <defs>
      <radialGradient id="compassBg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e293b" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="16" r="12" fill="url(#compassBg)" />
    <circle cx="16" cy="16" r="11" fill="none" stroke="#C99537" strokeWidth="1" />
    {/* Cardinal marks */}
    {[0,90,180,270].map((d,i) => {
      const r = d * Math.PI / 180;
      return <line key={i} x1={16+8.5*Math.cos(r-Math.PI/2)} y1={16+8.5*Math.sin(r-Math.PI/2)} x2={16+10*Math.cos(r-Math.PI/2)} y2={16+10*Math.sin(r-Math.PI/2)} stroke="#C99537" strokeWidth="1.5" strokeLinecap="round" />;
    })}
    {/* N / S label */}
    <text x="16" y="8.5" textAnchor="middle" fontSize="3.5" fill="#C99537" fontWeight="bold">N</text>
    <text x="16" y="25.5" textAnchor="middle" fontSize="3.5" fill="#6b7280" fontWeight="bold">S</text>
    {/* Needle – north red, south white */}
    <polygon points="16,7 17.2,16 16,15 14.8,16" fill="#ef4444" />
    <polygon points="16,25 17.2,16 16,17 14.8,16" fill="#f1f5f9" />
    <circle cx="16" cy="16" r="1.5" fill="#C99537" />
  </svg>
);

/** FAQ – speech bubble with glowing question mark */
const CreativeFaqIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <defs>
      <linearGradient id="bubbleGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <path d="M4 6 Q4 3 7 3 H25 Q28 3 28 6 V19 Q28 22 25 22 H18 L12 29 L13 22 H7 Q4 22 4 19 Z" fill="url(#bubbleGrad)" />
    {/* Glow dot */}
    <circle cx="16" cy="6.5" r="4" fill="#e879f9" opacity="0.25" />
    <text x="16" y="17" textAnchor="middle" fontSize="13" fontWeight="900" fill="white" fontFamily="serif">?</text>
  </svg>
);

/** Reviews – five-pointed star with gradient glow */
const CreativeStarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <defs>
      <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF176" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#C99537" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="starFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#C99537" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="14" fill="url(#starGlow)" />
    <polygon points="16,3 19.5,12 29,12.5 22,19 24.5,29 16,23.5 7.5,29 10,19 3,12.5 12.5,12" fill="url(#starFill)" />
    <polygon points="16,7 18.5,13 25,13.5 20,18 21.8,25 16,21.5 10.2,25 12,18 7,13.5 13.5,13" fill="#FFF9C4" opacity="0.35" />
  </svg>
);

/** About Us – globe with flight path arc */
const CreativeAboutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <defs>
      <radialGradient id="globeOcean" cx="40%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0369a1" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="16" r="12" fill="url(#globeOcean)" />
    {/* Latitude lines */}
    <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="#bae6fd" strokeWidth="0.7" opacity="0.5" />
    <ellipse cx="16" cy="11" rx="8" ry="3" fill="none" stroke="#bae6fd" strokeWidth="0.7" opacity="0.4" />
    {/* Meridian */}
    <ellipse cx="16" cy="16" rx="5" ry="12" fill="none" stroke="#bae6fd" strokeWidth="0.7" opacity="0.5" />
    {/* Continents silhouette */}
    <path d="M10 12 Q13 9 15 12 Q17 14 20 12 Q22 10 22 14 Q21 18 18 18 Q15 19 13 17 Q10 15 10 12Z" fill="#22c55e" opacity="0.7" />
    {/* Flight arc */}
    <path d="M7 22 Q16 8 25 10" stroke="#FFD700" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
    <polygon points="25,10 23,8 27,9" fill="#FFD700" />
  </svg>
);

/** Contact Us – envelope with golden wax seal */
const CreativeContactIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <defs>
      <linearGradient id="envGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* Envelope body */}
    <rect x="3" y="8" width="26" height="18" rx="2.5" fill="url(#envGrad)" />
    <rect x="3" y="8" width="26" height="18" rx="2.5" stroke="#C99537" strokeWidth="1" />
    {/* Flap */}
    <path d="M3 8 L16 19 L29 8" stroke="#C99537" strokeWidth="1.2" fill="none" />
    {/* Wax seal */}
    <circle cx="23" cy="22" r="4.5" fill="#C99537" />
    <text x="23" y="24.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#1c1917" fontFamily="serif">Q</text>
  </svg>
);

/** AI Assistant – geometric brain/neural nodes */
const CreativeBotIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <defs>
      <radialGradient id="brainGlow" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#4f46e5" />
      </radialGradient>
    </defs>
    {/* Neural network connections */}
    <line x1="8" y1="10" x2="16" y2="16" stroke="#a5b4fc" strokeWidth="1" opacity="0.7" />
    <line x1="24" y1="10" x2="16" y2="16" stroke="#a5b4fc" strokeWidth="1" opacity="0.7" />
    <line x1="8" y1="22" x2="16" y2="16" stroke="#a5b4fc" strokeWidth="1" opacity="0.7" />
    <line x1="24" y1="22" x2="16" y2="16" stroke="#a5b4fc" strokeWidth="1" opacity="0.7" />
    <line x1="8" y1="10" x2="8" y2="22" stroke="#6366f1" strokeWidth="0.8" opacity="0.5" />
    <line x1="24" y1="10" x2="24" y2="22" stroke="#6366f1" strokeWidth="0.8" opacity="0.5" />
    <line x1="8" y1="10" x2="24" y2="10" stroke="#6366f1" strokeWidth="0.8" opacity="0.5" />
    <line x1="8" y1="22" x2="24" y2="22" stroke="#6366f1" strokeWidth="0.8" opacity="0.5" />
    {/* Nodes */}
    <circle cx="8" cy="10" r="3" fill="url(#brainGlow)" />
    <circle cx="24" cy="10" r="3" fill="url(#brainGlow)" />
    <circle cx="8" cy="22" r="3" fill="url(#brainGlow)" />
    <circle cx="24" cy="22" r="3" fill="url(#brainGlow)" />
    {/* Centre hub */}
    <circle cx="16" cy="16" r="4.5" fill="#4f46e5" />
    <circle cx="16" cy="16" r="2.5" fill="white" opacity="0.9" />
    <circle cx="16" cy="16" r="1" fill="#4f46e5" />
  </svg>
);

/** WhatsApp – speech bubble with wave signal bands */
const CreativeWhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <defs>
      <radialGradient id="waGrad" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#16a34a" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="16" r="13" fill="url(#waGrad)" />
    <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" fill="white" transform="translate(4,4) scale(0.75)" />
  </svg>
);

export function DockWrapper() {
  const router = useRouter();
  const pathname = usePathname();

  // --- Dynamic settings from localStorage ---
  const [iconSize, setIconSize] = useState(40);
  const [maxScale, setMaxScale] = useState(1.3);
  const [magneticDistance, setMagneticDistance] = useState(100);
  const [position, setPosition] = useState<"bottom" | "top" | "left" | "right">("bottom");
  const [variant, setVariant] = useState<"glass" | "solid" | "transparent">("glass");
  const [showLabels, setShowLabels] = useState(true);
  const [iconStyle, setIconStyle] = useState<"default" | "creative">("default");
  const [dockDesign, setDockDesign] = useState<"classic" | "sketchy">("classic");

  // --- Inactivity Tracking to hide the Dock ---
  const [isUserActive, setIsUserActive] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleActivity = () => {
      setIsUserActive(true);
      clearTimeout(timeoutId);
      // Hides the dock after 4 seconds of idle inactivity
      timeoutId = setTimeout(() => {
        setIsUserActive(false);
      }, 4000);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    handleActivity();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearTimeout(timeoutId);
    };
  }, []);

  // --- Theme toggle states & callbacks ---
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

        const savedIconStyle = localStorage.getItem("dock_iconStyle");
        if (savedIconStyle) setIconStyle(savedIconStyle as "default" | "creative");

        const savedDesign = localStorage.getItem("dock_design");
        if (savedDesign) setDockDesign(savedDesign as "classic" | "sketchy");
      } catch (e) {
        console.error(e);
      }
    };

    loadSettings();

    // Listen for custom storage modifications in real-time
    window.addEventListener("storage", loadSettings);
    return () => window.removeEventListener("storage", loadSettings);
  }, []);

  // Helper to pick icon based on current style
  const ic = (creative: React.ReactNode, def: React.ReactNode) =>
    iconStyle === "creative" ? creative : def;

  const items = [
    {
      id: "home",
      label: "Home",
      icon: iconStyle === "creative"
        ? <CreativeHomeIcon className="w-7 h-7" />
        : <DockIconHome className="w-5 h-5" />,
      isActive: pathname === "/",
      onClick: () => router.push("/"),
    },
    {
      id: "schengen-visa",
      label: "Schengen Visa",
      icon: ic(<CreativePassportIcon className="w-7 h-7" />, <DefaultPassportIcon className="w-5 h-5" />),
      isActive: pathname.startsWith("/schengen-visa"),
      onClick: () => router.push("/schengen-visa"),
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: ic(<CreativePricingIcon className="w-7 h-7" />, <DefaultPricingIcon className="w-5 h-5" />),
      isActive: pathname === "/pricing",
      onClick: () => router.push("/pricing"),
    },
    {
      id: "how-it-works",
      label: "How It Works",
      icon: ic(<CreativeRouteIcon className="w-7 h-7" />, <DefaultRouteIcon className="w-5 h-5" />),
      isActive: pathname === "/how-it-works",
      onClick: () => router.push("/how-it-works"),
    },
    {
      id: "faq",
      label: "FAQ",
      icon: ic(<CreativeFaqIcon className="w-7 h-7" />, <DefaultFaqIcon className="w-5 h-5" />),
      isActive: pathname === "/faq",
      onClick: () => router.push("/faq"),
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: ic(<CreativeStarIcon className="w-7 h-7" />, <DefaultStarIcon className="w-5 h-5" />),
      isActive: pathname === "/reviews",
      onClick: () => router.push("/reviews"),
    },
    {
      id: "about-us",
      label: "About Us",
      icon: ic(<CreativeAboutIcon className="w-7 h-7" />, <DefaultAboutIcon className="w-5 h-5" />),
      isActive: pathname === "/about-us",
      onClick: () => router.push("/about-us"),
    },
    {
      id: "contact-us",
      label: "Contact Us",
      icon: ic(<CreativeContactIcon className="w-7 h-7" />, <DefaultContactIcon className="w-5 h-5" />),
      isActive: pathname === "/contact-us",
      onClick: () => router.push("/contact-us"),
    },
    {
      id: "whatsapp",
      label: "WhatsApp Chat",
      icon: ic(<CreativeWhatsappIcon className="w-7 h-7" />, <DefaultWhatsappIcon className="w-5 h-5" />),
      isActive: false,
      onClick: () => {
        trackContact("WhatsApp");
        window.open("https://wa.me/447828707425?text=Hi,%20I'd%20like%20to%20ask%20about%20a%20Schengen%20visa.", "_blank");
      },
    },
    {
      id: "ai-assistant",
      label: "Ai Assistant",
      icon: ic(<CreativeBotIcon className="w-7 h-7" />, <DefaultBotIcon className="w-5 h-5" />),
      isActive: pathname === "/ai-assistant",
      onClick: () => router.push("/ai-assistant"),
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

  if (!mounted) return null;

  // Render position-specific alignment classes
  const containerClasses = {
    bottom: "fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:block",
    top: "fixed top-6 left-1/2 -translate-x-1/2 z-40 hidden md:block",
    left: "fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden md:block",
    right: "fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:block",
  }[position];

  const activeClasses = isUserActive 
    ? "translate-y-0 opacity-100 scale-100" 
    : position === "top"
      ? "-translate-y-24 opacity-0 scale-95"
      : position === "left"
        ? "-translate-x-24 opacity-0 scale-95"
        : position === "right"
          ? "translate-x-24 opacity-0 scale-95"
          : "translate-y-24 opacity-0 scale-95";

  return (
    <div className={`${containerClasses} transition-all duration-700 ease-out transform ${activeClasses}`}>
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

      <MagneticDock 
        items={items} 
        iconSize={iconSize}
        maxScale={maxScale}
        magneticDistance={magneticDistance}
        showLabels={showLabels}
        position={position} 
        variant={variant} 
        dockDesign={dockDesign}
      />
    </div>
  );
}
