# Software Engineering Architecture - Quick Holidays Homepage

This document outlines the software engineering principles, design patterns, and architectural decisions made during the replication of the Quick Holidays Schengen Visa Specialist homepage.

## 1. Codebase Structure

We followed a highly structured, modular layout to ensure separation of concerns and high cohesion:

```
src/
├── app/
│   ├── globals.css         # Tailwind v4 theme definitions and custom CSS overrides
│   ├── layout.tsx          # Main HTML structure, SEO, and Google Font optimization
│   └── page.tsx            # Main entrypoint composing individual sections
├── assets/                 # Image assets directory (unchanged source files)
├── components/             # Self-contained presentation/logical components
│   ├── Navbar.tsx          # Interactive header with mobile drawer menu
│   ├── Hero.tsx            # Hero landing section with statistics banner
│   ├── Services.tsx        # Services list and card grid
│   ├── WhyChooseUs.tsx     # Reassurance checklist and dark-themed promo content
│   ├── Testimonials.tsx    # Customer slider reviews (3-column on desktop, slider on mobile)
│   ├── Destinations.tsx    # Popular destinations gallery with hover effects
│   ├── ConsultationForm.tsx# Multi-column booking form with custom inputs
│   └── Footer.tsx          # Dark footer with map pin, envelope, and site maps
└── constants/
    └── data.ts             # Decoupled text constants and asset import references
```

---

## 2. Architectural Design Patterns

### High Cohesion and Low Coupling (Information Expert Pattern)
We decoupled text content, testimonials, services lists, and image references from the presentation layers into [data.ts](file:///a:/Full-Stack-Development/QuickHolidaysProject/quickholidays/src/constants/data.ts).
- **Benefit**: If marketing copy or testimonial lists change in the future, developers only edit `data.ts`. Layout components remain completely untouched, ensuring they have high cohesion (only handling rendering/visual logic) and low coupling to hardcoded text.

### Modular Section Components
Each section is isolated in a separate, dedicated file.
- **Benefit**: Keeps components small, easily readable, and highly maintainable. Any bugs in the form validation are completely local to `ConsultationForm.tsx`, avoiding side-effects across the remainder of the page.

---

## 3. Technology Integration

### Native Next.js Font Optimization
Instead of fetching custom fonts via layout link tags (which can cause flash of unstyled text or layout shift), we loaded Google Fonts directly in [layout.tsx](file:///a:/Full-Stack-Development/QuickHolidaysProject/quickholidays/src/app/layout.tsx):
- `Playfair_Display` is mapped to the CSS variable `--font-playfair` (used for high-end travel serif headers).
- `Inter` is mapped to `--font-inter` (used for clean, legible interface text).

### Tailwind CSS v4 Theme Extension
We configured the styles natively in [globals.css](file:///a:/Full-Stack-Development/QuickHolidaysProject/quickholidays/src/app/globals.css) using Tailwind v4's new `@theme` system:
- Defines custom brand colors: `--color-brand-navy` (rich slate-navy `#0F2148`), `--color-brand-gold` (elegant golden sand `#CCA352`), and `--color-brand-cream` (soft warm beige `#FAF9F5`).
- Hooks the Google Font CSS variables into standard classes: `--font-serif: var(--font-playfair)` and `--font-sans: var(--font-inter)`.

### Interactive Mobile UI
- **Navbar**: Toggleable mobile menu using a simple slide-down CSS transition.
- **Testimonials**: Interactive Carousel supporting standard 3-column layouts on desktop, and a swipeable/dot-navigable single card layout on mobile.
- **Consultation Form**: Controlled React inputs with submit loading state indicators, field verification, custom radio buttons, and a success callback panel.
