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

// Configurations for the InfiniteMenu component (destinations area)
export const INFINITE_MENU_CONFIG = {
  scale: 3,             // Controls camera zoom
  flagSizeFactor: 0.28,   // Scale factor for flags
  borderColor: "#C99537", // Gold border matching theme
  borderWidth: 12,        // Border thickness for flags
};

export const COUNTRY_NICHES: Record<string, string> = {
  "Austria": "Austria is famous for Alpine resorts and Vienna tours. Accommodation proof and financial stability checks are strictly verified.",
  "Belgium": "Belgium is easily accessible via Eurostar. Perfect for short weekend breaks; applications are processed with high efficiency.",
  "Bulgaria": "Bulgaria offers rich history and beautiful Black Sea resorts. We verify all travel itineraries and accommodation details.",
  "Croatia": "Croatia is popular for historic coastal towns and islands. We check your flight layouts and hotel bookings for precision.",
  "Czech Republic": "Czech Republic is a top choice for Prague city breaks. Applications require precise travel insurance and funds check.",
  "Denmark": "Denmark is a premium Nordic destination. Applications are processed via London visa centers with swift processing timelines.",
  "Estonia": "Estonia is perfect for quiet Baltic medieval escapes. We prepare all documents to ensure hassle-free embassy checks.",
  "Finland": "Finland is the ultimate winter wonderland. Financial statements and detailed travel itineraries are strictly verified.",
  "France": "France is the most popular Schengen destination from the UK. Biometrics slots fill up quickly, and decisions are returned in 7-10 days.",
  "Spain": "Spain is a top choice for summer vacations and quick getaways. Applications are processed in London, Manchester, and Edinburgh.",
  "Greece": "Greece is heavily requested for summer travel. Appointments are processed at the GVC centers across the UK.",
  "Hungary": "Hungary is a top thermal bath and cultural destination. We audit your application files to match embassy guidelines.",
  "Iceland": "Iceland is famous for the Northern Lights and glaciers. Requires comprehensive travel insurance and flight layouts.",
  "Italy": "Italy tourist visas require detailed proof of travel. Slots are highly competitive and require early booking.",
  "Latvia": "Latvia offers beautiful nature and historic Riga. We coordinate your checklist to ensure quick and positive processing.",
  "Liechtenstein": "Liechtenstein is nestled in the Alps. Applications are processed under Swiss embassy guidelines with full precision.",
  "Lithuania": "Lithuania is famed for historic Vilnius and Baltic castles. We check your documentation and resident permit status for a smooth application.",
  "Luxembourg": "Luxembourg is a compact, premium destination. High requirements for financial proof apply for tourist visas.",
  "Malta": "Malta is a sunny Mediterranean island destination. Biometrics appointments are highly sought after; we monitor slots 24/7.",
  "Netherlands": "Netherlands is a major European transit and tourist hub. Appointment slots are monitored and secured 24/7 by our team.",
  "Norway": "Norway is famous for fjords and polar nights. Checklists require highly detailed proof of internal travel bookings.",
  "Poland": "Poland is popular for historic cities like Krakow and Warsaw. We compile and verify all employment and banking documents.",
  "Portugal": "Portugal is highly popular for beach and cultural trips. Applications are processed via VFS centers in London and Manchester.",
  "Romania": "Romania is famous for Transylvanian castles and mountains. We ensure all flights and accommodation bookings align with rules.",
  "Slovakia": "Slovakia is ideal for hiking and exploring medieval castles. Financial requirements and insurance coverage must be precisely audited.",
  "Slovenia": "Slovenia is a scenic green destination featuring Lake Bled. We draft custom cover letters and verify checklists.",
  "Germany": "Germany is high-demand for business and holiday travelers. Embassy guidelines are strict and require complete precision.",
  "Sweden": "Sweden is a major Scandinavian business and holiday hub. Embassy processing is strict and requires error-free applications.",
  "Switzerland": "Switzerland is famed for the scenic Alps. We organize complete day-by-day flight, hotel, and travel itineraries."
};

