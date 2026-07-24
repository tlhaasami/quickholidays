<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Quick Holidays - Project Context & Architecture

Welcome! This document provides complete context, structure, and design decisions for the **Quick Holidays** project. Read this before starting any work to stay aligned with existing patterns.

---

## 1. Project Overview & Tech Stack
**Quick Holidays** is a premium, high-converting Schengen visa consultancy portal designed for UK-based applicants (primarily non-UK nationals residing on BRPs, spouse/work visas).

* **Framework:** Next.js (App Router, Turbopack)
* **React Version:** React 19
* **Styling:** Tailwind CSS v4 (CSS-first configuration)
* **Animations:** Motion (Framer Motion v12)
* **Analytics/Backend:** Supabase integration setup ready for lead capturing.

---

## 2. Important Architectural Rules

### A. Tailwind CSS v4 Theme Toggling (Class-based)
Tailwind v4 uses media queries for dark mode by default. Class-based dark mode (`dark:`) is enabled explicitly in `src/app/globals.css` using the custom variant:
```css
@variant dark (&:where(.dark, .dark *));
```
* **HTML Class Toggle:** Toggling dark mode appends/removes the `.dark` class from the `html` root tag (managed by `Navbar.tsx`).
* **Hydration Protection:** To prevent Next.js from throwing console errors when theme-synchronization scripts write class properties before React hydration starts, `suppressHydrationWarning` must be present on the `<html>` tag inside [layout.tsx](file:///a:/Real-World-Projects/Quick-Holidays/src/app/layout.tsx).

### B. Hydration & Semantic Nesting (Critical)
* **Do NOT nest `<div>` or `<p>` tags inside Tooltips if the trigger tag is inside a `<p>` block.** A `<div>` cannot be a descendant of a `<p>` element in standard HTML.
* Use `<span>` tags with `block` or `flex` classes for Tooltip content blocks (e.g. `Tooltip` inside the hero description text) to avoid hydration mismatches.

---

## 3. Directory & Routing Structure
All routes are inside `src/app`:
* `/` -> Main landing page containing hero section, step process cards, and review modules.
* `/about-us` -> Editorial vision and company registration details.
* `/contact-us` -> Typeform-style qualification assessment lead funnel.
* `/faq` -> Accordion layout for embassy/residence rules.
* `/how-it-works` -> Step-by-step process outline.
* `/schengen-visa` -> Destination country guides selector hub.
* `/schengen-visa/[country]` -> Dynamic guides for specific destination countries.
* `/service-terms` & `/refund-policy` & `/privacy-policy` -> Fine print / plain English drafts.

---

## 4. Key Component Profiles

### `Hero.tsx` ([Hero.tsx](file:///a:/Real-World-Projects/Quick-Holidays/src/components/Hero.tsx))
* The top statistics counters, editorial header, and company trust indicators.
* **Marquee status:** The 3D Flag Marquee section is currently commented out (`{/* 3D Marquee ... */}`) to temporarily hide it without deleting the underlying code.
* **Background video status:** The background hero video and overlay assets are commented out, leaving only the central branding text visible on a premium solid dark background.

### `TypeformForm.tsx` ([TypeformForm.tsx](file:///a:/Real-World-Projects/Quick-Holidays/src/components/TypeformForm.tsx))
* The interactive multi-step wizard form capturing client qualifications (name, phone, destination, prior visas).
* Styled to adapt dynamically to light/dark themes (`bg-white` and `bg-zinc-950`).

### `Navbar.tsx` ([Navbar.tsx](file:///a:/Real-World-Projects/Quick-Holidays/src/components/Navbar.tsx))
* Floating navigation header with the custom sun/moon theme switcher switch widget. Handles class injection on the root `<html>`.
