# Required Website Sections and Pages Guide

This document outlines all the sections, pages, layouts, and interactive components required for the Quick Holidays Ltd website launch, as defined in [needed.md](file:///a:/Real-World-Projects/Quick-Holidays/needed.md).

---

## 1. Global Components (Sitewide)

These components are rendered on every page of the application to maintain consistency and ease of navigation.

### 1.1 Sticky Header
*   **Logo:** Links back to the homepage (`/`).
*   **Navigation Links:**
    *   [Home](file:///a:/Real-World-Projects/Quick-Holidays/src/app/page.tsx) (`/`)
    *   Schengen Visa Hub (`/schengen-visa`)
    *   How It Works (`/how-it-works`)
    *   FAQ (`/faq`)
    *   Reviews (`/reviews`)
    *   About Us (`/about-us`)
*   **Primary CTA Button:** "Book a Free Consultation" (routes to `/contact-us` or opens the form).
*   **Utility/Login Area:** Render "Login" only if the `/login` route is audited and functional (Phase 2 portal).

### 1.2 Sitewide Footer
*   **Brand Statement:** "Quick Holidays Ltd — Schengen visa specialists for Non-UK nationals living in the UK. Clear costs, honest advice, and full accountability, every step."
*   **Columns:**
    *   **Quick Links:** Home, Schengen Visa, How It Works, FAQ, Reviews, About Us.
    *   **Policies:** Refund & Cancellation Policy, Service Terms, Insurance Disclaimer, Privacy Policy, Sitemap.
    *   **Contact Info:**
        *   Email: `info@quickholidays.co.uk`
        *   Phone: `+44 800 058 4673`
        *   WhatsApp details
        *   Address: `Office 25 Innovation Park, Edge Lane, Liverpool, England, L7 9NJ`
*   **Legal Disclosures:**
    *   Registration details: "Quick Holidays Ltd is registered in England and Wales, Company No. 15948457— view our record at Companies House." (Linked to the public Companies House record).
    *   Copyright: "© 2026 Quick Holidays Ltd."
*   **Social Icons:** External links to LinkedIn, Instagram, and Facebook profiles (only active links, no placeholder icons allowed).

### 1.3 Floating WhatsApp Button
*   **Position:** Bottom-right of all screens/pages.
*   **Action:** Opens `wa.me/[WHATSAPP NUMBER]` with prefilled text: `"Hi, I'd like to ask about a Schengen visa."`
*   **Analytics:** Fires the `Contact` tracking event upon click.

---

## 2. Homepage Sections (`/`)

The homepage must be built from top to bottom using the following sections:

### 2.1 Hero Section
*   **Heading (H1):** `"Your Schengen visa, handled properly."`
*   **Subheading:** `"Clear costs. Honest advice. A team that stands behind each application. We prepare Schengen tourist visa applications for non-UK nationals living in the UK — No surprises, No guessing."`
*   **Primary CTA Button:** `"Book a Free Consultation"` (solid Heritage Gold, white text, links to `/contact-us` or the form section).
*   **Secondary CTA Button:** `"See how it works"` (outline style, links to `/how-it-works`).

### 2.2 Stat Counters Section
Directly below the Hero. Counters must animate from `0` to the real value on viewport entry (once).
*   **Experience Counter:** `[5 YEARS]+` (Source note: *"Serving UK-based applicants since [START YEAR]."*).
*   **Clients Served Counter:** `[2600 CLIENTS]+` (Source note: *"Applications handled [START YEAR]–2026."*).
*   **Approval Rate Counter:** `[97]%` (Source note: *"Approvals across all applications submitted [START YEAR]–2026."*).
*   *Note: If any stat is missing or unavailable, the counter must be omitted (do not display zero).*

### 2.3 Proof Strip
*   **Company Verification text:** `"Quick Holidays Ltd is a UK-registered company — Companies House No. [15948457]. Verify us before you pay us. We recommend it. →"` (linked to Companies House).
*   **Trustpilot Widget:** A CMS-controlled slot, hidden until 10+ reviews are reached, then enabled when the widget is supplied.

### 2.4 Accountability Promise Section
*   **Heading (H2):** `"If we make a mistake, we own it."`
*   **Body Copy:** `"Most visa consultancies disappear when something goes wrong. We do the opposite. If we make a mistake, we refund our service fee — in full, excluding appointment, insurance and other charges. That promise is in writing, in our refund policy, for every client."`
*   **CTA Button:** `"Read our Refund Policy"` (outline style, links to `/refund-policy`).

### 2.5 QuickVisa Assurance Process Section
Showcases the 4-step process. Each card must support a hover interaction (desktop) or tap interaction (mobile) displaying a popup card containing:
*   **Step 1: Consultation:** `"A free, honest assessment: whether you're ready to apply, what it will cost, and a realistic timeline — before you pay anything."`
*   **Step 2: Documentation:** `"Your checklist, cover letter, and application forms — built for your situation. We also help find refundable flights and pay-at-property hotels, wherever possible. Everything reviewed before submission."`
*   **Step 3: Appointment Booking:** `"We book and manage your biometrics appointment — London, Manchester, or Edinburgh — and hand you your appointment letter once confirmed."`
*   **Step 4: Approval Monitoring:** `"We track your application wherever the system allows it. Where it doesn't, we follow up directly. Either way, you're not left wondering — and you're covered by our Accountability Promise if we get something wrong."`
*   **CTA link below section:** `"See the full process →"` (links to `/how-it-works`).

### 2.6 Country Grid Section
*   **Heading (H2):** `"Where do you want to go?"`
*   **Body Copy:** `"Fees, documents and timelines for every Schengen country — see exactly what your application needs before you talk to anyone."`
*   **Grid:** Cards representing Schengen countries (e.g. France, Germany, Spain, Italy, etc.). Flags must be locally-bundled static SVG assets (no third-party fetches). Every card must link to its specific country page `/schengen-visa/[country]` (no generic `/contact-us` links or disabled tiles).

### 2.7 Reviews Section
*   **Heading (H2):** `"Real clients. Real decisions."`
*   **Content:** 3 testimonial cards fetched from CMS. Each card features a `"Read more"` link leading to `/reviews`.
*   **CTA Button:** `"All reviews"` (links to `/reviews`).

### 2.8 Consultation Form Section
Embeds the qualifying lead-capture form (see [Section 4](#4-consultation-form-specification) for details).
*   **Heading (H2):** `"Start with a free consultation."`
*   **Body Copy:** `"Tell us about your trip. We'll tell you exactly what it takes — the cost, the documents, and a realistic timeline. No obligation, no pressure."`

---

## 3. Schengen Visa Pages

### 3.1 Hub Page (`/schengen-visa`)
*   **Heading (H1):** `"Schengen tourist visas, country by country."`
*   **Body Copy:** `"The embassy fee is set by EU regulation and is the same for every Schengen country. What can vary is your document checklist and processing time — we confirm both for your exact destination, free, before you pay anything."`
*   **Page Elements:**
    1.  The QuickVisa Assurance Process block (Section 2.5).
    2.  The full interactive Country Grid (Section 2.6).

### 3.2 Country Page Template (`/schengen-visa/[country]`)
A single, consistent dynamic template. Redesigns per country are forbidden; only the content varies.
*   **Intro Section:** `"Applying for a [Country] short-stay (tourist) visa as a non-UK national living in the UK? Here's what it costs, and how we handle it with you."` (Includes the country's flag SVG).
*   **Costs Table:**
    *   *Embassy fee (adult):* €90 (Set by EU regulation. Children 6-12: €45; under 6: free).
    *   *Our service fee:* `[SERVICE FEE]` (Fixed, agreed in writing beforehand).
    *   *Deposit to begin:* `[DEPOSIT]` (Starts case: assessment, checklist, appointment search. Balance trigger noted).
*   **Embassy Variations Note:** A short paragraph explaining that documents and processing times vary by embassy and are confirmed at the free consultation.
*   **CTA Block:**
    *   *Heading (H2):* `"Ready to start your [Country] application?"`
    *   *Body:* `"Book a free consultation and we'll confirm your exact checklist, your costs, and a realistic timeline — before you pay anything."`
    *   *Button:* `"Book a Free Consultation"`.
*   **FAQ Snippet:** 3 identical general FAQ cards:
    1.  *"How long does it take?"*
    2.  *"What if my visa is refused?"*
    3.  *"Can you help with flights and hotels?"*
*   **Meta tags:**
    *   *Title:* `"[Country] Schengen Visa from the UK — Fees & How It Works | Quick Holidays"`
    *   *Description:* `"[Country] short-stay visa for non-UK nationals living in the UK: embassy fee, our process, and honest timelines."`

---

## 4. Consultation Form Specification

This is a Typeform-style sequential, step-by-step animated flow (150–200ms fade/scale transition) with a progress bar.

*   **Step 1:** Full name, Phone, Email
*   **Step 2:** Nationality (searchable dropdown), Destination country (pre-filled if arriving from a country page)
*   **Step 3:** Schengen visas issued in the past 4 years (Dropdown: `None` / `1` / `2` / `3+`)
*   **Step 4:** Preferred response channel (Call, Email, or WhatsApp - visually emphasise WhatsApp) and an optional comment field (*"Anything we should know?"*).
*   **CTA Button:** `"Book My Free Consultation."`
*   **Legal disclaimer under button:** `"We'll come back to you within one working day. Your details are handled under our Privacy Policy and never sold or shared for marketing."`
*   **Success Screen:** `"Thank you — your consultation request is in. We'll contact you by [chosen channel] within one working day. In the meantime, see what happens next → /how-it-works"`

---

## 5. Dedicated Content Pages

### 5.1 How It Works Page (`/how-it-works`)
*   **Heading (H1):** `"How it works — from first call to decision day."`
*   **Body Copy:** `"No black box. Here's the whole journey, including when you pay what."`
*   **Timeline Steps:**
    1.  *Free consultation* (assess destination, dates, travel history, finances; give checklist/costs).
    2.  *Deposit & documentation* (deposit opens file, custom checklist provided, review all documents before submission).
    3.  *Appointment booking* (biometrics appointment secured, application pack prepared, balance payment triggered).
    4.  *Decision & after* (monitor application, check visa for errors, review refusal options if needed).
*   **Closing CTA (H2):** `"Know exactly where you stand — from day one."` with a `"Book a Free Consultation"` button.

### 5.2 FAQ Page (`/faq`)
Presents questions organized under four categories:
*   **Trust & Company Verification:** Questions about UK registration (Companies House No. 15948457), visa guarantees, passport security, and physical office location details.
*   **The Visa Process:** Details on processing timelines (approx. 15 calendar days), biometrics appointments, and reapplying after prior refusals.
*   **Fees & Payments:** Information on fees, deposit breakdown, Refund Policy rules, and free consultation confirmation.
*   **Documents:** General document requirements, warnings about falsified documents, and passport retention policies.

### 5.3 Reviews Page (`/reviews`)
*   **Heading (H1):** `"Real clients. Real decisions."`
*   **Contents:** All CMS reviews ordered newest first, displaying Name, City, Destination country, and Outcome.
*   **Trustpilot Widget:** Placed at the top (active once there are 10+ reviews).
*   **Content Rule:** Must contain at least one review explaining how Quick Holidays resolved a problem (accountability storytelling).

### 5.4 About Us Page (`/about-us`)
*   **Heading (H1):** `"Why Quick Holidays exists."`
*   **Vision Story:** Verbatim 3-paragraph copy from the Brand Vision (Section 2.1 of `needed.md`).
*   **Core Beliefs:** Explaining the values of transparency (clarity on pricing and rules) and quality over quantity.
*   **Verification:** Link to the Companies House record.

### 5.5 Policy and Legal Pages
*   **Refund & Cancellation Policy (`/refund-policy`):** Explains service fee scope, deposit rules, non-refundable embassy fees, and the specific terms of the **Accountability Promise** (full refund of the service fee if refused due to documented Quick Holidays error).
*   **Visa & Immigration Service Terms (`/service-terms`):** Detailed clause summary covering consultancy scope, client responsibilities (no falsified documents), estimates vs guarantees, and document handling.
*   **Travel Insurance Disclaimer (`/travel-insurance-disclaimer`):** States that Quick Holidays is not an insurance company, and policies are governed by the named insurer's terms.
*   **Privacy Policy (`/privacy-policy`):** GDPR information outlining document collection, storage security, retention period, and ICO registration rules.

---

## 6. Technical & Conversion Sections

### 6.1 Event Tracking Integration
*   `PageView`: Fires on every page.
*   `ViewContent`: Fires when a country page is viewed.
*   `Lead`: Fires on successful consultation form submission.
*   `Contact`: Fires when WhatsApp or phone numbers are clicked.
*   `FormAbandon`: Custom event tracking step completion to identify drop-off fields.

### 6.2 SEO & Schema Structure
*   **Metadata:** Title & Description dynamically set per page (e.g., matching the pattern defined for France in section 8.3).
*   **Structured Schema:** Organization schema (with Companies House details), `FAQPage` schema on `/faq`, and `Review` schema on `/reviews`.

---

## 7. Post-Launch Features (Phase 2)

*   **Client Portal (`/login`):** Dashboard for document uploads, real-time checklist tracking, application status timeline, and secure messaging.
*   **Resources Blog (`/blog`):** FAQ-derived articles to build organic SEO weight.
*   **Programmatic SEO Pages:** Landing pages matching specific destinations and appointment centers (e.g., `/schengen-visa/france/manchester`).
