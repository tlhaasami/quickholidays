# QUICK HOLIDAYS LTD - Website Master Document

## 0. How to Use This Document
Shaded grey boxes are final website copy. The developer pastes this text as-is. Do not paraphrase, shorten, or “improve” it — the wording is deliberate and follows the brand voice rules in Section 2.6.
Anything in [SQUARE BRACKETS] is a value the team must supply (e.g. [COMPANIES HOUSE NO.], [SERVICE FEE], [DEPOSIT]). The site must not launch with a single bracket still visible. The full placeholder list is in Section 13.
Policy drafts (Section 10) are working drafts, written in brand voice for a solicitor to review — not final legal text. They exist so the solicitor edits a document instead of starting from a blank page.
Priority: everything in this document is Launch scope unless explicitly marked “Phase 2”.

## 1. The Decision: One Consistent Direction, Not Isolated Fixes
The current site has several unresolved issues — stat counters stuck at zero, all 12+ country tiles routing to Contact Us, placeholder social links, template copy, no verifiable proof anywhere. Fixing these one at a time, without a shared direction, is what created the patchwork feel in the first place. The business is repositioning as "Premium Trust" (higher price, fewer clients, real accountability), and that position needs one coherent design system applied consistently — not a new set of disconnected patches. This document consolidates that direction.

### 1.1 Platform Decision
The live site is a custom Next.js (React) application (confirmed by `/_next/` asset paths). Decision: continue on Next.js. It is fast, SEO-strong, and suited to the programmatic country pages below. Do not migrate to WordPress/Webflow — it adds migration time without adding capability.

### 1.2 Ownership handover (business-critical, Week 1)
The business currently depends on one developer who is sometimes unreachable. Before any build work starts, obtain and store in company records:
* Git repository access (confirm where the repository is hosted).
* Hosting account access (likely Vercel) with billing moved to a company card.
* A one-page deployment note: how to run the site locally, and how a change goes live.

## 2. Brand Foundation (Binding on All Design and Copy)

### 2.1 Vision story
Schengen visas are confusing.
Consultancies contradict each other. Forums give bad advice. Small mistakes get you rejected.
Most consultancies don't fix this. They're expensive. Impersonal. Disorganised.
We built Quick Holidays to fix it.
We can't promise you a visa. We can promise you clarity.
You'll know exactly where you stand. Every step. Start to finish.

### 2.2 Core values
* **Transparency** — Clients always know where they stand, what things cost, and why.
* **Quality over quantity** — Fewer clients, Served properly.

### 2.3 Ideal client
Non-UK nationals living in the UK who need a Schengen tourist visa — mainly Nigerian, Indian and Pakistani nationals: workers, students, and workers' families.
They are saving for this trip. A refusal costs money, time, and often a family visit. The site must respect that weight without being dramatic.

### 2.4 Positioning: Premium Trust
Competitors race to the bottom on price; rock-bottom pricing in this industry reads as scam-like. Quick Holidays charges more because it's real: refund if we err, accountability throughout, full clarity. Test for every design/copy decision: does this look and sound like the most trustworthy option — not the cheapest?

### 2.5 The differentiator
“If we make a mistake, we own it — We take responsibility.” This appears as a named homepage section (7.4), a proud Refund Policy page (10.1), and testimonials where something went wrong and was made right.

### 2.6 Voice rules (every sentence on the site must pass these)
* **Respect, not sympathy** — talk to capable adults; no hand-holding, no drama.
* **Direct, No Jargon** — jargon is what competitors use to justify hidden charges.
* **“We're with you”, not “we're serving you”** — knowledgeable friend, not call-centre script.
* **Banned:** "Unparalleled excellence", "seamless journey", "world-class", "stress-free" as a headline claim, "guaranteed visa/approval" or any outcome-guarantee language, any statistic without a source.
* **Model sentence:** “We tell you exactly what you need, what it costs, and how long it takes — no surprises.”

## 3. Design System (Developer Specification)

### 3.1 Look and feel
Premium-trust, editorial, calm. Think private clinic or boutique law firm — not a travel-deals site. Generous white space, few colours, no decorative icons or filler stock imagery.
One primary call-to-action per screen section. If a section has two buttons, one must be visually secondary (outline style).

### 3.2 Tokens

| Token | Value | Usage |
| :--- | :--- | :--- |
| Primary | Heritage Gold — #C99537 (verified from actual logo file, matches official brand guidelines) | CTAs, links, section labels, active states |
| Ink | Midnight Navy — #0F1936 (official brand color, not generic grey — keeps brand identity in body text too) | All body text and headings |
| Muted | #6D7077 (Slate Grey — matches official brand guidelines exactly) | Captions, source notes, secondary text |
| Surface | #FFFFFF / #F4EFE7 (Ivory Mist — official brand color) | Page background / alternating section background |
| Success | #15803D (functional green, no brand conflict — kept as-is) | Checklist ticks, approval states only — use sparingly |
| Headings font | Playfair Display (official brand primary typeface — confirmed in brand guidelines) | H1–H3 — the premium signal |
| Body font | DM Sans (official brand body typeface — confirmed in brand guidelines) | Everything else, 16–18px body, 1.6 line height |
| Radius / shadow | 8px radius; one soft shadow level only (no brand conflict — kept as-is) | Cards, form fields, buttons |

*A small note to keep in mind:* Ink is now #0F1936 (navy), instead of the previous neutral #0F1936 grey — this will slightly change the contrast ratio (navy on white/ivory backgrounds). This is visually better and brand-accurate, but accessibility should be checked once (WCAG AA contrast) when actually implemented on the site — navy #0F1936 has very high contrast against white, but if light or thin-weight text is ever placed on the light ivory background (#F4EFE7), that combination should be double-checked.

### 3.3 Component rules
* **Buttons:** primary = solid gold, white text, “Book a Free Consultation” style verbs. Secondary = 1px outline. Never two solid buttons side by side.
* **Stat counters:** number + label + a one-line source note in Muted underneath. If a real number is unavailable, the counter is removed — never faked, never zero.
* **Country tiles:** flag rendered as a local static SVG asset (bundle flag-icons or equivalent — no runtime fetch from third-party flag APIs; the current “Loading…” bug must be structurally impossible). Whole tile is a link to its country page.
* **Forms:** labels above fields, inline validation, one column on mobile. Error text is specific (“Enter a UK phone number”), never “invalid input”.
* **Floating WhatsApp button:** bottom-right, all pages, opens `wa.me/[WHATSAPP NUMBER]` with prefill text “Hi, I'd like to ask about a Schengen visa.” Fires the Contact tracking event (11.1).

## 4. Trust Assets — Status and Plan

| Asset | Status | Action |
| :--- | :--- | :--- |
| Companies House number | READY | Footer Sitewide + About Us + FAQ answer, Always linked to the public Companies House record. |
| Real stats (clients, success rate, years) | READY | Hero Counters with source notes (copy in 7.2). Never publish a number the team cannot defend. |
| Trustpilot | READY | Trustpilot widget would be provided as it is under update. |
| Team Story | READY | **Our Team**: Behind every application is a dedicated, professional team — trained specifically in Schengen visa requirements, and focused on one thing: getting your application right, the first time.<br>We work as one connected team, using the same process, the same standards, and the same accountability for every single client — no matter where in the world you're applying from.<br>You're never just a case number. Every application gets a real person checking it, start to finish. |
| Real social URLs | NOT READY | LinkedIn / Instagram / Facebook URLs before launch, or remove the icons. Placeholder links to generic homepages are forbidden. |

## 5. The QuickVisa Assurance Process (Core Brand Asset)
One named process, used with identical wording on the Homepage, the Schengen Visa hub, and How It Works. It replaces the current 5-icon service grid and the 4-tile feature strip everywhere. Final copy:

**THE QUICKVISA ASSURANCE PROCESS**
One process. Four steps. You always know where you stand.
1. **Consultation.** A free, honest assessment: whether you're ready to apply, what it will cost, and a realistic timeline — before you pay anything.
2. **Documentation.** Your checklist, cover letter, and application forms — built for your situation. We also help find refundable flights and pay-at-property hotels, wherever possible. Everything reviewed before submission.
3. **Appointment Booking.** We secure and manage your biometrics appointment at your preferred centre — London, Manchester or Edinburgh.
4. **Approval Monitoring.** We track your application wherever the system allows it. Where it doesn't, we follow up directly. Either way, you're not left wondering — and you're covered by our Accountability Promise if we get something wrong.

### 5.1 Interaction: Hover Detail
Each of the 4 process steps is hoverable. On hover, a popup card appears above the step showing its full detail (the complete sentence already written in Section 5), styled per Section 3.2 tokens: white surface, 8px radius, one soft shadow level, Ink text color, DM Sans body font, Primary gold used only for the step number. Popup appears with a short fade/scale transition (150–200ms) — no bounce, no slide-in from off-screen. Only one popup open at a time; hovering a new step closes the previous one instantly.
On mobile/touch devices (no hover capability): tapping the step opens the same popup card; tapping again, or tapping outside it, closes it. This is not optional — hover-only interactions are invisible on touch screens, and the current site's biggest complaint is broken interactions, so this must be tested on an actual phone before launch, not just resized in a desktop browser.

Popup content per step (exact text, already final from Section 5):
* **Consultation:** "A free, honest assessment: whether you're ready to apply, what it will cost, and a realistic timeline — before you pay anything."
* **Documentation:** "Your checklist, cover letter, and application forms — built for your situation. We also help find refundable flights and pay-at-property hotels, wherever possible. Everything reviewed before submission."
* **Appointment Booking:** "We book and manage your biometrics appointment — London, Manchester, or Edinburgh — and hand you your appointment letter once confirmed."
* **Approval Monitoring:** "We track your application wherever the system allows it. Where it doesn't, we follow up directly. Either way, you're not left wondering — and you're covered by our Accountability Promise if we get something wrong."

## 6. Site Map and Navigation

### 6.1 Header (sticky)
Logo (links home) · Home · Schengen Visa · How It Works · FAQ · Reviews · About Us · [Button] Book a Free Consultation. “Login” stays in the utility area only if the existing `/login` route is functional — developer audits it Week 1 (Phase-2 portal, Section 12).

### 6.2 Full page list

| URL | Page | Phase |
| :--- | :--- | :--- |
| `/` | Homepage | Launch |
| `/schengen-visa` | Schengen Visa hub (country selector) | Launch |
| `/schengen-visa/[country]` | All Schengen countries, identical template. Each page: flag, fee, a short "what can vary by embassy" note, and an embedded enquiry form pre-filled with the country name. No special/full-page treatment for any country. | Launch |
| `/how-it-works` | Process in full + pricing structure | Launch |
| `/faq` | FAQ (four categories) | Launch |
| `/reviews` | All testimonials + Trustpilot slot | Launch |
| `/about-us` | Vision story + verification | Launch |
| `/contact-us` | Consultation form | Launch |
| `/refund-policy` | Refund & Cancellation Policy | Launch |
| `/service-terms` | Visa & Immigration Service Terms (replaces generic T&Cs) | Launch |
| `/travel-insurance-disclaimer` | Insurance disclaimer | Launch |
| `/privacy-policy` | Rewritten privacy policy | Launch |
| `/blog` | Resources / SEO articles | Phase 2 |
| `/sitemap` + `sitemap.xml` | Human + XML sitemap | Launch |

*Note on country page personalization:* Every country page uses identical Section 3.2 tokens (colors, fonts, spacing, component rules) — no visual redesign per country. Only content is localized: flag and country name. Embassy fee is EU-wide fixed and identical on every page; the exact document checklist and processing time are confirmed at the free consultation rather than promised per country. The site's design system stays constant; only the facts on the page change per country.

### 6.3 Footer (identical on every page)
Quick Holidays Ltd — Schengen visa specialists for Non-UK nationals living in the UK. Clear costs, honest advice, and full accountability, every step.
Columns: Quick Links (Home, Schengen Visa, How It Works, FAQ, Reviews, About Us) · Policies (Refund & Cancellation, Service Terms, Insurance Disclaimer, Privacy, Sitemap) · Contact (info@quickholidays.co.uk · +44 800 058 4673 · WhatsApp (Would be provided) · Office 25 Innovation Park, Edge Lane, Liverpool, England, L7 9NJ) .
Quick Holidays Ltd is registered in England and Wales, Company No. 15948457— view our record at Companies House. © 2026 Quick Holidays Ltd.

Social icons: only real profile URLs ([LINKEDIN URL], [INSTAGRAM URL], [FACEBOOK URL]), opening in a new tab.

## 7. Homepage — Full Copy, Top to Bottom

### 7.1 Hero
* **H1:** Your Schengen visa, handled properly.
* **Subhead:** Clear costs. Honest advice. A team that stands behind each application. We prepare Schengen tourist visa applications for non-UK nationals living in the UK — No surprises, No guessing.
* **Primary CTA:** Book a Free Consultation → `/contact-us`
* **Secondary CTA (outline):** See how it works → `/how-it-works`

### 7.2 Stat counters (directly under hero)
* **[5 YEARS]+** — Years of experience. Source note: Serving UK-based applicants since [START YEAR].
* **[2600 CLIENTS]+** — Clients served. Source note: Applications handled [START YEAR]–2026.
* **[97]%** — Approval rate. Source note: Approvals across all applications submitted [START YEAR]–2026.

*Developer:* counters animate from 0 to the real value on first viewport entry, once. If any value is not supplied, remove that counter — do not ship a zero.

### 7.3 Proof strip
Quick Holidays Ltd is a UK-registered company — Companies House No. [15948457].
Verify us before you pay us. We recommend it. → `https://find-and-update.company-information.service.gov.uk/company/15948457`
[Trustpilot widget slot — hidden until 10+ reviews, then enabled from CMS once the official widget is supplied]

### 7.4 Accountability Promise section
* **H2:** If we make a mistake, we own it.
* **Body:** Most visa consultancies disappear when something goes wrong. We do the opposite. If we make a mistake, we refund our service fee — in full, excluding appointment, insurance and other charges. That promise is in writing, in our refund policy, for every client.
* **CTA (outline):** Read our Refund Policy → `/refund-policy`

### 7.5 QuickVisa Assurance Process section
Exact copy from Section 5, as four numbered cards. CTA below: “See the full process → `/how-it-works`”.

### 7.6 Country grid
* **H2:** Where do you want to go?
* **Body:** Fees, documents and timelines for every Schengen country — see exactly what your application needs before you talk to anyone.
* All Schengen country tiles → every tile links to its own `/schengen-visa/[country]` page — never to a shared `/contact-us` URL. No tile is ever non-clickable or routed to a generic, contextless page. No country gets special full-page treatment over another — the template is identical for all.

### 7.7 Reviews section
* **H2:** Real clients. Real decisions.
* 3 review cards from CMS · each card's “Read more” → `/reviews` · Section CTA: All reviews → `/reviews`

### 7.8 Consultation form section (form spec in Section 9)
* **H2:** Start with a free consultation.
* **Body:** Tell us about your trip. We'll tell you exactly what it takes — the cost, the documents, and a realistic timeline. No obligation, no pressure.

## 8. Schengen Visa Hub + Country Page Template

### 8.1 Hub page (`/schengen-visa`)
* **H1:** Schengen tourist visas, country by country.
* **Body:** The embassy fee is set by EU regulation and is the same for every Schengen country. What can vary is your document checklist and processing time — we confirm both for your exact destination, free, before you pay anything.
* Below: the QuickVisa Assurance Process (Section 5 copy), then the full country grid.
*(Change from original: removed "every embassy has its own fees" — factually incorrect, fee is fixed EU-wide. Replaced with an honest distinction between what's fixed and what varies.)*

### 8.2 Country page template — structure
One template, same structure and same wording for every country, only the country name and flag change. No CMS content-modeling needed per applicant type — this is intentionally general, not customized per embassy.
Sections in order:
* **Intro** — one line, country name inserted: "Applying for a [Country] short-stay (tourist) visa as a non-UK national living in the UK? Here's what it costs, and how we handle it with you."
* **Costs table** — embassy fee (€90 adult / €45 child 6-12 / free under 6 — same for every country, sourced to EU regulation), our service fee, deposit to begin. Identical for every country page.
* **What can vary, by embassy** — one short paragraph: documents and processing time can differ slightly by embassy; exact checklist and timeline confirmed at the free consultation (Step 1 of the QuickVisa Assurance Process).
* **CTA block** — "Ready to start your [Country] application?" → Book a Free Consultation.
* **FAQ snippet** — 3 general questions (same across all countries: "How long does it take?", "What if my visa is refused?", "Can you help with flights and hotels?").
*(Removed from original: documents-by-employment-type tabs, entry-types section, downloadable PDF checklist per country. These implied country-specific precision we can't accurately promise per embassy — moved to "confirmed at consultation" instead.)*

### 8.3 Example — France
* **H1:** France Schengen Visa from the UK
* **Body:** Applying for a France short-stay (tourist) visa as a non-UK national living in the UK? Here's what it costs, and how we handle it with you.

| Cost item | Amount | Notes |
| :--- | :--- | :--- |
| Embassy fee (adult) | €90 | Set by EU regulation. Children 6-12: €45; under 6: free. Same across all Schengen countries. |
| Our service fee | [SERVICE FEE] | Fixed, agreed in writing before we start. Covers the full QuickVisa Assurance Process. |
| Deposit to begin | [DEPOSIT] | Starts your case: assessment, checklist, appointment search. Balance due [BALANCE TRIGGER]. |

Documents and processing times can vary slightly by embassy. We'll confirm your exact checklist and a realistic timeline at your free consultation — before you pay anything.
* **CTA block — H2:** "Ready to start your France application?" **Body:** "Book a free consultation and we'll confirm your exact checklist, your costs, and a realistic timeline — before you pay anything." **Button:** Book a Free Consultation.
* **Meta title:** "France Schengen Visa from the UK — Fees & How It Works | Quick Holidays". **Meta description:** "France short-stay visa for non-UK nationals living in the UK: embassy fee, our process, and honest timelines." Same pattern for every country — only the country name changes.

## 9. Consultation Form — Exact Specification
The form is a working team member: it qualifies leads so agents close instead of screening, and it catches weak documentation from the client side — which protects approval rate, reviews, and next month's leads. Used on `/contact-us` and the homepage form section (same component).

### 9.1 Interaction pattern: One step at a time
The form is not a single long page — it's a sequential, animated flow, one group of related fields per screen, in the spirit of Typeform-style conversational forms. A progress bar at top shows step X of 4. Each step animates in with the same fade/scale transition defined in Section 5.1 (150–200ms, no bounce) — consistent with the QuickVisa process hover cards. A "Back" link is always available to revisit a previous step without losing answers already entered.

| Step | Fields |
| :--- | :--- |
| 1 | Full name, Phone, Email |
| 2 | Nationality, Destination country |
| 3 | Schengen visas issued in the past 4 years |
| 4 | How should we respond?, Anything we should know? |

### 9.2 Field specification

| # | Field | Type / options | Required |
| :--- | :--- | :--- | :--- |
| 1 | Full name | Text | Yes |
| 2 | Phone | Tel, UK format validated | Yes |
| 3 | Email | Email validated | Yes |
| 4 | Nationality | Searchable dropdown (full country list) | Yes |
| 5 | Destination country | Dropdown: Schengen countries (pre-filled when arriving from a country page) | Yes |
| 6 | Schengen visas issued in the past 4 years | Dropdown: None / 1 / 2 / 3+ | Yes |
| 7 | How should we respond? | Call / Email / WhatsApp (WhatsApp visually emphasised) | Yes |
| 8 | Anything we should know? | Text area | No |

### 9.3 Submission
* **Submit button:** "Book My Free Consultation."
* **Under button:** "We'll come back to you within one working day. Your details are handled under our Privacy Policy and never sold or shared for marketing."
* **Success screen:** "Thank you — your consultation request is in. We'll contact you by [chosen channel] within one working day. In the meantime, see what happens next → `/how-it-works`"

### 9.4 Tracking
* **On submit:** fire Meta Lead event (11.1); write the lead to the CMS/CRM and email a formatted copy to [LEADS EMAIL].
* **Abandon tracking:** if a visitor starts but doesn't submit, tag with the exact step number where they dropped off (e.g., Step 3 — visa history) for the retargeting audience (11.1). This is more precise than a generic "started form" tag — it shows the team exactly what causes hesitation.

## 10. Content Pages — Full Draft Copy

### 10.1 Refund & Cancellation Policy (`/refund-policy`) — draft for solicitor review
* **H1:** Our Refund & Cancellation Policy — in plain English.
Most companies hide this page. We link to it from our homepage, because it's the clearest proof of how we work.
* **What you pay for.** Our service fee pays for professional work: assessing your case, building your document checklist, reviewing everything, booking your appointment, and monitoring your application. It is a fee for work performed — not a fee for a visa. No consultancy can sell you a guaranteed visa; anyone who says otherwise is lying to you.
* **The deposit.** Your deposit of [DEPOSIT] starts your case. If you cancel before we have begun work on your file, we refund it in full. Once work has begun, the deposit covers the work already done and is non-refundable. The balance of [BALANCE] is due [BALANCE TRIGGER].
* **Embassy fees.** Embassy and visa-centre fees are paid to the embassy, not to us. They are outside our control and are not refundable by us under any circumstances.
* **Our Accountability Promise.** If your application is refused because of a documented error on our side — a mistake in your application, a missed document we were responsible for checking, a deadline we missed — we refund our full service fee. We will tell you plainly whether the error was ours; you will not have to fight us for it.
* **What the promise doesn't cover:** refusals based on the embassy's judgement of your circumstances (finances, travel history, ties to the UK), information you didn't disclose to us, or documents that were not genuine. We will always tell you before applying if we believe your case is weak.
* **Refund handling.** Approved refunds are paid to your original payment method within 14 days.
*[Solicitor to review: consumer-rights compliance (Consumer Contracts Regulations cancellation rights), and exact deposit/balance amounts and trigger.]*

### 10.2 Visa & Immigration Service Terms (`/service-terms`) — draft clause summary for solicitor
Replaces the generic T&Cs page. Written as short plain-English clauses; solicitor formalises. Clause list with draft wording:
* **Scope:** “We provide consultancy, document preparation, appointment booking and application monitoring for Schengen short-stay tourist visas. We are not a government body, embassy, or law firm, and we do not decide visa outcomes.”
* **Fees:** “Our fees are for professional work performed, not for the outcome of your application.” (cross-links Refund Policy).
* **Client responsibilities:** “You must provide truthful, complete, genuine information and documents, and attend your biometrics appointment. We will refuse to submit any application we believe contains false information — without refund of work already performed.”
* **Processing times:** “Timelines are set by embassies and can change without notice. Timelines we quote are realistic estimates, not guarantees.”
* **Refusals:** cross-reference to the Accountability Promise, including the documented-error standard.
* **Document handling and liability:** “Original documents in our care are stored securely and returned by [METHOD]. Our liability for loss or damage is limited to [LIABILITY CAP — solicitor to advise].”
* **Regulatory note (Week-1 legal question):** solicitor must confirm whether UK immigration-advice regulation (IAA/OISC regime) applies to Schengen visa consultancy for UK residents, before this page is finalised. This can change required disclosures.

### 10.3 Travel Insurance Disclaimer (`/travel-insurance-disclaimer`) — full draft
* **H1:** About the travel insurance included in our service.
Schengen applications require travel medical insurance with at least €30,000 of cover. Where insurance is arranged as part of our service, please be clear about what that means: Quick Holidays Ltd is not an insurance company. The policy is issued by the insurer named on your certificate, and their terms govern your cover. Claims are made to the insurer, not to us — though we'll point you in the right direction if you need it. It is your responsibility to ensure you are fit to travel and to disclose any medical conditions the insurer asks about; failing to do so can void your cover. Read your policy certificate before you travel. *[Solicitor to confirm whether arranging insurance triggers FCA-regulated activity — Week-1 legal question.]*

### 10.4 Privacy Policy (`/privacy-policy`) — required content (rewrite, not from scratch)
*(I would confirm this first with a lawyer and then give you a go-ahead)*
* **What we collect and why:** identity documents (passport, BRP/eVisa), financial documents (bank statements, payslips), contact details, travel plans — collected solely to prepare and submit your visa application.
* **Legal basis (UK GDPR):** performance of a contract; explicit consent for any special-category data.
* **Storage and security:** encrypted at rest, access limited to staff working on your case; physical documents stored securely and returned.
* **Retention:** case files kept for [RETENTION PERIOD, e.g. 24 months] after decision, then deleted/destroyed — solicitor to confirm period.
* **Sharing:** embassies/visa centres for your application, the insurer if insurance is arranged, and no one else. Never sold, never shared for marketing.
* **Your rights:** access, correction, deletion, complaint to the ICO; contact info@quickholidays.co.uk. Include ICO registration number [ICO NO.] if applicable.

### 10.5 FAQ page (`/faq`) — full final copy
**Trust & company verification**
* **Are you a real UK company?** — Yes. Quick Holidays Ltd is registered in England and Wales, Company No. 15948457, based at Office 25 Innovation Park, Edge Lane, Liverpool, England, L7 9NJ. Don't take our word for it: check our record on Companies House before you pay us anything. We recommend every client does.
* **Do you guarantee my visa will be approved?** — No — and be careful with anyone who says yes. The decision belongs to the embassy alone. What we guarantee is the quality of the work: a complete, accurate, properly presented application, and our Accountability Promise — if a refusal is caused by our documented error, we refund our full service fee.
* **Why should I trust you with my passport and bank statements?** — Because we treat them like the sensitive documents they are: encrypted storage, access limited to the people working on your case, securely returned, never shared beyond the embassy and never used for marketing. The details are in our Privacy Policy — written in plain English.
* **Can I visit your office?** — Yes. We're at Office 25 Innovation Park, Edge Lane, Liverpool, England, L7 9NJ. Message us first so the right person is there to meet you.

**The visa process**
* **How long does it take?** — Typically around 15 calendar days after your biometrics/appointment date, but embassies get busy — especially May to August — and appointment availability varies by centre. At your consultation we give you a realistic date for your specific case, not a best-case guess.
* **Do I have to attend in person?** — Yes, once: your biometrics (fingerprints and photo) must be given in person at a visa application centre. We book it at your preferred centre — London, Manchester or Edinburgh — and prepare everything you take with you.
* **I've been refused before. Can you still help?** — Often, yes — but honestly. We look at your refusal letter, tell you plainly why we think it happened, and whether reapplying now makes sense. If we think your case is weak, we'll tell you to wait and tell you why — we'd rather lose a sale than submit an application we don't believe in.

**Fees & payments**
* **How much does it cost?** — Two parts, both told to you upfront: the embassy fee (€90 per adult, set by the embassy) and our service fee. You start with a small initial deposit of [DEPOSIT]; the balance is paid once you get your appointment letter. No other charges — if anyone quotes you “extras” later, something's wrong, and that's not how we work. If you desire to opt for premium services offered by the appointment center, the extra charge would be paid to the appointment center and receipts would be shared.
* **What is the deposit for?** — It starts your case: your assessment, your personal document checklist, and your appointment search. If you cancel before the appointment is booked, it's refunded in full.
* **What happens to my money if the visa is refused?** Most refusals happen for reasons outside anyone's control — they reflect the embassy's own judgment on your case, not a documentation error. Embassy fees are non-refundable in all cases; this is set by the embassy, not by us. Our Accountability Promise applies when an error can be identified on our side — a missed document, an incorrectly filled form, or a deadline we caused you to miss. Please note that every document is sent to you for review before submission, and your confirmation triggers the next steps — so once you've approved a document, responsibility for its content no longer rests with us. We track every case internally, so we know when an error on our part has occurred — regardless of whether the embassy's refusal letter explains its own reasoning. If the refusal is traced back to our error, we refund our service fee in full, in writing, in line with our Refund Policy.
* **Is the first consultation really free?** — Yes. You'll leave it knowing your costs, your document list, and a realistic timeline — whether or not you go ahead with us.

**Documents**
* **What documents do I need?** — It depends on your destination and whether you're employed, a student, or self-employed. At your free consultation we give you the exact checklist for your situation — and when you work with us, we review every document before anything is submitted.
* **My bank statement looks weak. Can you “sort it out”?** — No — and please be careful with anyone who offers to. Altered or fake documents are fraud; embassies detect them, and the result can be a ban from the entire Schengen area for years. What we will do is tell you honestly whether your finances support an application now, or whether waiting a few months gives you a real chance.
* **Do you keep my documents afterwards?** — Case files are kept securely for a specific retention period, in case of follow-up questions from the embassy, then deleted. Details are in our Privacy Policy.

### 10.6 How It Works (`/how-it-works`) — full copy
* **H1:** How it works — from first call to decision day.
* **Body:** No black box. Here's the whole journey, including when you pay what.
1. **Free consultation.** We assess your case honestly: destination, dates, travel history, finances. You leave with your exact costs, your document list, and a realistic timeline. If we think your case is weak, we say so — before you pay anything.
2. **Deposit & documentation.** An initial deposit opens your file. You get a personal checklist for your situation — employed, student or self-employed — and we review every document you send. Nothing goes forward until it's right.
3. **Appointment booking.** We secure your biometrics appointment at London, Manchester or Edinburgh, prepare your full application pack, and brief you on exactly what happens at the centre. The balance is paid as soon as you get the appointment letter.
4. **Decision & after.** We monitor your application to decision day. Approved — we check your visa for errors before you travel (Embassy misprints happen). Refused — we go through the refusal letter with you, tell you plainly what happened and what your options are. We are with you from start to end.
* **Closing CTA — H2:** Know exactly where you stand — from day one. **Button:** Book a Free Consultation.

### 10.7 About Us (`/about-us`) — launch copy
* **H1:** Why Quick Holidays exists.
[Vision story from Section 2.1, verbatim, as three short paragraphs.]
* **What we believe.** Transparency: you always know where you stand, what things cost, and why. Quality over quantity: we'd rather serve fewer clients properly than many badly — it's why we're not the cheapest, and why we don't want to be.
* **Verify us.** Quick Holidays Ltd · Company No. 15948457· View our Companies House record →

### 10.8 Reviews page (`/reviews`)
* **H1:** “Real clients. Real decisions.” All reviews from CMS, newest first, each with name, city, destination country and decision outcome.
* Trustpilot widget slot at top (enabled from CMS at 10+ reviews)(This widget would be provided soon, talha bhai)
* Editorial rule: include at least one review describing a problem Quick Holidays fixed — the accountability story converts harder than perfect five-star reviews.
* Existing homepage reviews (James Wilson, Sarah Ahmad, Daniel Carter) migrate here only if they are genuine and consented — the team confirms; fabricated or unverifiable reviews are deleted, permanently.

## 11. Technical & Conversion Specification

### 11.1 Tracking (Meta Pixel + Conversions API, server-side via Next.js)

| Event | Fires when | Notes |
| :--- | :--- | :--- |
| PageView | Every page | Pixel + CAPI, deduplicated by event_id |
| ViewContent | Country page view | content_name = country |
| Lead | Consultation form submit / checklist download | Primary optimisation event for ad campaigns |
| Contact | WhatsApp button click / phone number click | Sales is WhatsApp-driven — this must be counted |
| FormAbandon (custom) | Form field focused, no submit in session | Builds the retargeting audience |

Call tracking: per-campaign numbers (e.g. WhatConverts/CallRail-style) so phone leads attribute to campaigns — marketing configures, developer places the dynamic number script.
Verification: all events checked in Meta Events Manager test mode before launch (QA item).

### 11.2 Performance & SEO
* Core Web Vitals: LCP under 2.5s on a mid-range Android over 4G; images in `next/image` with explicit dimensions; flags as local SVGs; fonts self-hosted with display swap.
* Meta titles/descriptions per page follow the France pattern (8.3); homepage title: “Schengen Visa Specialists for UK Residents | Quick Holidays Ltd”.
* Schema.org: Organization (with Companies House identifier), FAQPage on `/faq`, Review markup on `/reviews` once reviews are genuine-only.
* XML sitemap + `robots.txt`; 301-redirect any old URLs that change.

### 11.3 CMS content models

| Model | Fields |
| :--- | :--- |
| Country | Country: name · slug · flag · embassyFeeAdult · embassyFeeChild · serviceFee · deposit · metaTitle · metaDescription · published |
| FAQ item | category (Trust / Process / Fees / Documents) · question · answer · order · published |
| Review | name · city · destinationCountry · outcome · text · date · consented (bool) · featuredOnHome (bool) |
| Policy page | title · body (rich text) · lastReviewedDate · solicitorApproved (bool) |
| Site settings | stats (years/clients/rate + source lines) · trustpilotEnabled (bool) · socialURLs · companiesHouseNo · whatsappNumber |

## 12. (Post-Launch) — Scoped Now, Built Later
* **Client portal:** developer audits the existing `/login` route in Week 1 and reports what exists. Target scope: client login · document upload with per-document status (received / reviewed / issue) · application status timeline mirroring the 4 process steps · secure messaging. Business case: removes per-client WhatsApp status updates — the single biggest manual-workload lever for scaling revenue without scaling headcount.
* **Blog / SEO engine:** launch cadence of 2 articles/month from the FAQ material (e.g. “Why Schengen visas get refused — and how to avoid it”, “France vs Spain: which embassy should you apply through?”).
* **Programmatic SEO:** country × appointment-centre Pages (“France Schengen visa appointment in Manchester”) generated from the same Country model.
* **Founder content:** Founder story + Team photography added to About Us after the photo session.
* **Video testimonials** on `/reviews`.

## 13. Placeholder Checklist (Team Fills Before Launch)

| Placeholder | Owner | Needed by |
| :--- | :--- | :--- |
| [COMPANIES HOUSE NO.] | Management | |
| [YEARS] / [CLIENTS] / [RATE] / [START YEAR] + source lines | Management | |
| [SERVICE FEE] / [DEPOSIT] / [BALANCE] / [BALANCE TRIGGER] | Management | |
| [WHATSAPP NUMBER] (+447828707425) | Management | |
| [LEADS EMAIL] for form notifications | Management | |
| [LINKEDIN URL] / [https://www.instagram.com/quickholidaysltd.co.uk] [https://www.facebook.com/quickholidaysltd.co.uk/] — or decision to omit | Marketing | |
| [RETENTION PERIOD] / [LIABILITY CAP] / [ICO NO.] | Solicitor(I would confirm these) | |
| Per-country fees, documents, processing times (CMS) | Ops team | |
| Genuine, consented reviews (min. 6, incl. one accountability story) | Sales team | |

## 14. Pre-Launch QA Checklist
* [ ] Zero [square brackets] visible anywhere on the site.
* [ ] All three stat counters show real, sourced numbers and animate once on load.
* [ ] Every country tile shows a locally-bundled SVG flag and links to its own country page — no tile routes to Contact Us, no loading states possible.
* [ ] “Read more” on every testimonial links to `/reviews`; only consented, genuine reviews are live.
* [ ] Footer: real social URLs (or icons removed) opening in new tabs; Companies House number linked; all policy pages linked.
* [ ] Form: all 8 fields per spec, step-by-step animated flow (Section 9.1), validation messages specific, WhatsApp option emphasised, success screen correct, lead email arrives at [LEADS EMAIL].
* [ ] Floating WhatsApp button on every page with prefill text, desk and mobile.
* [ ] Meta events (PageView, ViewContent, Lead, Contact, FormAbandon) verified in Events Manager test mode with CAPI deduplication.
* [ ] All four policy pages live, solicitor-approved flag set in CMS, linked in footer.
* [ ] LCP under 2.5s on a real mid-range Android over 4G; also tested on iOS Safari.
* [ ] Team demonstrates editing a country's fee in the CMS and publishing — without the developer.
* [ ] 301 redirects from any changed URLs; XML sitemap submitted to Search Console.

## 15. Summary — How This Reaches Multi-Million
* **Cheaper leads:** Pixel + CAPI + call tracking + retargeting make every ad pound measurable and improvable.
* **Higher conversion:** Premium Trust positioning, verifiable proof, a named process, country-specific answers, and an Accountability Promise no competitor dares to put in writing.
* **Lower cost per client:** the qualification form screens leads, the CMS removes developer dependency, and the Phase-2 portal removes manual status updates — revenue scales without headcount scaling with it.