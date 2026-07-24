// Country details with flag paths and famous places
export const COUNTRIES = [
  { name: "Austria", slug: "austria", flag: "/flags/austria/flag-austria.webp" },
  { name: "Belgium", slug: "belgium", flag: "/flags/belgium/flag-belgium.webp" },
  { name: "Bulgaria", slug: "bulgaria", flag: "/flags/bulgaria/flag-bulgaria.webp" },
  { name: "Croatia", slug: "croatia", flag: "/flags/croatia/flag-croatia.webp" },
  { name: "Czech Republic", slug: "czech-republic", flag: "/flags/czech-republic/flag-czech-republic.webp" },
  { name: "Denmark", slug: "denmark", flag: "/flags/denmark/flag-denmark.webp" },
  { name: "Estonia", slug: "estonia", flag: "/flags/estonia/flag-estonia.webp" },
  { name: "Finland", slug: "finland", flag: "/flags/finland/flag-finland.webp" },
  { name: "France", slug: "france", flag: "/flags/france/flag-france.webp" },
  { name: "Spain", slug: "spain", flag: "/flags/spain/flag-spain.webp" },

  { name: "Greece", slug: "greece", flag: "/flags/greece/flag-greece.webp" },
  { name: "Hungary", slug: "hungary", flag: "/flags/hungary/flag-hungary.webp" },
  { name: "Iceland", slug: "iceland", flag: "/flags/iceland/flag-iceland.webp" },
  { name: "Italy", slug: "italy", flag: "/flags/italy/flag-italy.webp" },
  { name: "Latvia", slug: "latvia", flag: "/flags/latvia/flag-latvia.webp" },
  { name: "Liechtenstein", slug: "liechtenstein", flag: "/flags/liechtenstein/flag-liechtenstein.webp" },
  { name: "Lithuania", slug: "lithuania", flag: "/flags/lithuania/flag-lithuania.webp" },
  { name: "Luxembourg", slug: "luxembourg", flag: "/flags/luxembourg/flag-luxembourg.webp" },
  { name: "Malta", slug: "malta", flag: "/flags/malta/flag-malta.webp" },
  { name: "Netherlands", slug: "netherlands", flag: "/flags/netherlands/flag-netherlands.webp" },
  { name: "Norway", slug: "norway", flag: "/flags/norway/flag-norway.webp" },
  { name: "Poland", slug: "poland", flag: "/flags/poland/flag-poland.webp" },
  { name: "Portugal", slug: "portugal", flag: "/flags/portugal/flag-portugal.webp" },
  { name: "Romania", slug: "romania", flag: "/flags/romania/flag-romania.webp" },
  { name: "Slovakia", slug: "slovakia", flag: "/flags/slovakia/flag-slovakia.webp" },
  { name: "Slovenia", slug: "slovenia", flag: "/flags/slovenia/flag-slovenia.webp" },
  { name: "Germany", slug: "germany", flag: "/flags/germany/flag-germany.webp" },
  { name: "Sweden", slug: "sweden", flag: "/flags/sweden/flag-sweden.webp" },
  { name: "Switzerland", slug: "switzerland", flag: "/flags/switzerland/flag-switzerland.webp" },
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

// Configurations for the Hero layout, typography, sizes, and colors
export const HERO_CONFIG = {
  // Brand colors
  quickColor: "#101b37",         // Hex color for "QUICK"
  holidaysColor: "#C99537",      // Hex color for "HOLIDAYS"

  // Logo dimensions
  logoSizeMobile: "w-20 h-20",
  logoSizeTablet: "sm:w-28 sm:h-28",
  logoSizeDesktop: "md:w-36 md:h-36",

  // Typography & Boldness configuration (e.g., font-sans, font-serif, font-playfair)
  headingFont: "font-serif",      // Best serif typography for premium travel brand
  headingBoldness: "font-black",  // Thickness: font-black (900), font-extrabold (800), etc.

  // Paragraph width configuration
  paragraphMaxWidth: "max-w-lg",  // Bounds: max-w-md, max-w-lg, max-w-xl, max-w-2xl
  containerMaxWidth: "max-w-3xl",  // Overall container max-width bounds
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
};
