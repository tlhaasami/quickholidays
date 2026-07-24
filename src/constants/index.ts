// Country details with flag paths and famous places
export const COUNTRIES = [
  { name: "Austria", slug: "austria", flag: "/Flags/austria/flag-austria.webp" },
  { name: "Belgium", slug: "belgium", flag: "/Flags/belgium/flag-belgium.webp" },
  { name: "Bulgaria", slug: "bulgaria", flag: "/Flags/bulgaria/flag-bulgaria.webp" },
  { name: "Croatia", slug: "croatia", flag: "/Flags/croatia/flag-croatia.webp" },
  { name: "Czech Republic", slug: "czech-republic", flag: "/Flags/czech-republic/flag-czech-republic.webp" },
  { name: "Denmark", slug: "denmark", flag: "/Flags/denmark/flag-denmark.webp" },
  { name: "Estonia", slug: "estonia", flag: "/Flags/estonia/flag-estonia.webp" },
  { name: "Finland", slug: "finland", flag: "/Flags/finland/flag-finland.webp" },
  { name: "France", slug: "france", flag: "/Flags/france/flag-france.webp" },
  { name: "Spain", slug: "spain", flag: "/Flags/spain/flag-spain.webp" },

  { name: "Greece", slug: "greece", flag: "/Flags/greece/flag-greece.webp" },
  { name: "Hungary", slug: "hungary", flag: "/Flags/hungary/flag-hungary.webp" },
  { name: "Iceland", slug: "iceland", flag: "/Flags/iceland/flag-iceland.webp" },
  { name: "Italy", slug: "italy", flag: "/Flags/italy/flag-italy.webp" },
  { name: "Latvia", slug: "latvia", flag: "/Flags/latvia/flag-latvia.webp" },
  { name: "Liechtenstein", slug: "liechtenstein", flag: "/Flags/liechtenstein/flag-liechtenstein.webp" },
  { name: "Lithuania", slug: "lithuania", flag: "/Flags/lithuania/flag-lithuania.webp" },
  { name: "Luxembourg", slug: "luxembourg", flag: "/Flags/luxembourg/flag-luxembourg.webp" },
  { name: "Malta", slug: "malta", flag: "/Flags/malta/flag-malta.webp" },
  { name: "Netherlands", slug: "netherlands", flag: "/Flags/netherlands/flag-netherlands.webp" },
  { name: "Norway", slug: "norway", flag: "/Flags/norway/flag-norway.webp" },
  { name: "Poland", slug: "poland", flag: "/Flags/poland/flag-poland.webp" },
  { name: "Portugal", slug: "portugal", flag: "/Flags/portugal/flag-portugal.webp" },
  { name: "Romania", slug: "romania", flag: "/Flags/romania/flag-romania.webp" },
  { name: "Slovakia", slug: "slovakia", flag: "/Flags/slovakia/flag-slovakia.webp" },
  { name: "Slovenia", slug: "slovenia", flag: "/Flags/slovenia/flag-slovenia.webp" },
  { name: "Germany", slug: "germany", flag: "/Flags/germany/flag-germany.webp" },
  { name: "Sweden", slug: "sweden", flag: "/Flags/sweden/flag-sweden.webp" },
  { name: "Switzerland", slug: "switzerland", flag: "/Flags/switzerland/flag-switzerland.webp" },
];

// Array of all organized flag image paths for the marquee
export const FLAG_IMAGES = COUNTRIES.map((c) => c.flag);

// Custom configurations for the 3D Marquee layout
export const MARQUEE_CONFIG = {
  columns: 5,               // Set exactly 4 columns as requested
  speedOdd: 25,             // Scroll duration in seconds for odd columns
  speedEven: 30,            // Scroll duration in seconds for even columns
  gap: 20,                  // Gap spacing in pixels between cards
  hoverTranslateY: -10,     // Translation offset on card hover (px)
  size: 1300,               // Dimension of the grid canvas
  scaleMobile: 1.0,        // Scale factor on mobile viewports
  scaleTablet: 1.0,         // Scale factor on tablet viewports
  scaleDesktop: 1.45,       // Scale factor on desktop viewports
  repeats: 1,               // No flags repeated
};

// Configurations for the Hero video background overlays
export const HERO_CONFIG = {
  fadeOpacity: 0.1,        // Black fade opacity overlay on the video background (e.g. 0.15 = 15% black fade overlay)
  quickColor: "#18213bff",     // Custom hex color for the word "Quick" (Midnight Navy)
  holidaysColor: "#C99537",  // Custom hex color for the word "Holidays" (Heritage Gold)
};

// Navigation Links for site pages
export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Schengen Visa", href: "/schengen-visa" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "FAQ", href: "/faq" },
  { name: "Reviews", href: "/reviews" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
];

// Configurations for the floating Navbar styling (matching theme colors)
export const NAVBAR_CONFIG = {
  bgColor: "#0F1936e6",      // Midnight Navy with 90% opacity (Official Ink color)
  borderColor: "#ffffff1a",  // Subtle white border (10% opacity)
  activeColor: "#C99537",    // Heritage Gold (Official Primary color)
  inactiveColor: "#a1a1aa",  // Muted grey for non-active links
  hoverColor: "#e4e4e7",     // Light grey for link hover states
};

