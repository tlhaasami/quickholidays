export interface CoverLetterField {
  id: string;
  label: string;
  placeholder: string;
  category: "applicant" | "embassy" | "trip" | "uk_tie" | "documents";
  required?: boolean;
}

export const coverLetterSections = [
  {
    title: "1. Applicant Profile & UK Legal Status",
    fields: [
      { id: "full_name", label: "Full Name (as per Passport)", placeholder: "e.g. Rigved Anant KASHIKAR", category: "applicant", required: true },
      { id: "passport_number", label: "Passport Number", placeholder: "e.g. P9280608", category: "applicant", required: true },
      { id: "nationality", label: "Current Nationality", placeholder: "e.g. Indian / Pakistani / Bangladeshi", category: "applicant", required: true },
      { id: "uk_address", label: "UK Residential Address", placeholder: "e.g. 15 Crescent Road, London, SE18 7BL", category: "applicant", required: true },
      { id: "phone_number", label: "Phone Number", placeholder: "e.g. +44 7823 466149", category: "applicant", required: true },
      { id: "email_address", label: "Email Address", placeholder: "e.g. applicant@email.com", category: "applicant", required: true },
      { id: "uk_share_code", label: "UK Home Office Share Code", placeholder: "e.g. SFA T2R 77T", category: "applicant", required: true },
      { id: "share_code_expiry", label: "Share Code Expiry Date", placeholder: "e.g. 30/09/2026", category: "applicant", required: true },
      { id: "uk_residency_type", label: "UK Visa / Residency Type", placeholder: "e.g. Skilled Worker Visa / Student Visa / Spouse Visa", category: "applicant", required: true },
    ]
  },
  {
    title: "2. Consular Target Authority",
    fields: [
      { id: "target_embassy", label: "Target Embassy / Consulate", placeholder: "e.g. Embassy of Greece / Embassy of Switzerland", category: "embassy", required: true },
      { id: "submission_venue", label: "Submission Venue (VFS / TLS / BLS)", placeholder: "e.g. VFS Global London / TLScontact Manchester", category: "embassy", required: true },
      { id: "destination_country", label: "Primary Destination Country", placeholder: "e.g. Greece / Switzerland / Spain", category: "embassy", required: true },
      { id: "application_date", label: "Application Date", placeholder: "e.g. 25 July 2026", category: "embassy", required: true },
    ]
  },
  {
    title: "3. UK Economic & Social Anchor (Ties to the UK)",
    fields: [
      { id: "uk_anchor_type", label: "Anchor Type", placeholder: "Employed / Student / Self-Employed", category: "uk_tie", required: true },
      { id: "institution_or_employer", label: "Employer or University Name", placeholder: "e.g. University of Hertfordshire / Sainsbury's", category: "uk_tie", required: true },
      { id: "job_title_or_degree", label: "Job Title or Degree Course", placeholder: "e.g. Master's in Computer Science / Retail Assistant", category: "uk_tie", required: true },
      { id: "salary_or_status_details", label: "Annual Salary / Support Letter Details", placeholder: "e.g. £28,000 per annum / Enrolment Letter attached", category: "uk_tie" },
    ]
  },
  {
    title: "4. Travel Logistics & Accommodation",
    fields: [
      { id: "trip_start_date", label: "Trip Start Date", placeholder: "e.g. 26/08/2026", category: "trip", required: true },
      { id: "trip_end_date", label: "Trip End Date", placeholder: "e.g. 30/08/2026", category: "trip", required: true },
      { id: "flight_pnr_outbound", label: "Outbound Flight & PNR", placeholder: "e.g. London (LHR) to Athens (ATH) • BA850 • Ref: Z8AKNX", category: "trip", required: true },
      { id: "flight_pnr_inbound", label: "Inbound Flight & PNR", placeholder: "e.g. Athens (ATH) to London (LHR) • BA927 • Ref: Z8FZ2V", category: "trip", required: true },
      { id: "hotel_booking_details", label: "Hotel Name & Booking Reference", placeholder: "e.g. Raise Boutique Rooms, Athens • Confirmation: 2516629906", category: "trip", required: true },
      { id: "bank_summary", label: "Financial Funds Summary", placeholder: "e.g. £4,200 average liquid balance in Lloyds Bank (3 months statements)", category: "trip", required: true },
    ]
  },
  {
    title: "5. Optional Special Requests & Travel History",
    fields: [
      { id: "daily_itinerary_summary", label: "Day-by-Day Travel Plan", placeholder: "Day 1: Arrival & Old Town; Day 2: Acropolis; Day 3: Museum...", category: "documents" },
      { id: "multiple_entry_request", label: "Multi-Entry Request (Optional)", placeholder: "Requesting 1-year multiple entry due to planned trip to Swiss Alps in Dec", category: "documents" },
      { id: "prior_visa_history", label: "Prior Visa History (Optional)", placeholder: "Previous Schengen Visa 2024, UK Residence Permit RW0959086", category: "documents" },
    ]
  }
];

export const COVER_LETTER_SYSTEM_PROMPT = `You are an expert Schengen Visa Application Consultant for Quick Holidays (UK).

DUAL-PERSONA DIRECTIVE:
1. ACT AS THE APPLICANT: Write in a polite, highly respectful, clear, and professional first-person voice ("I am writing to formally submit...").
2. ACT AS A SCHENGEN VISA OFFICER: Evaluate every sentence against strict consular verification rules. Anticipate and address all primary grounds for visa refusal (e.g. "Doubt regarding intention to leave the territory", "Insufficient proof of ties to the UK", "Unclear accommodation or transit arrangements").

STRICT FORMATTING & ATS COMPLIANCE RULES:
- NO EMOJIS OR INFORMAL SYMBOLS: Use zero emojis, decorative symbols, or non-standard characters.
- ATS-FRIENDLY TYPOGRAPHY & SPACING: Ensure clean line height, standard business letter headers, 1-inch margins, and structured uppercase/bold headers.
- NO UNNECESSARY FLUFF: Omit conversational musings (e.g. do not say "I saw animations of this city"). Focus strictly on facts, legal ties, confirmed bookings, and clear itinerary.
- SINGLE MASTER MODULAR TEMPLATE: Use the following mandatory section order:
  1. Applicant Contact Header & Target Embassy Address
  2. Subject Line (APPLICATION FOR SCHENGEN TOURIST VISA TO [COUNTRY] ([DATES]))
  3. Purpose of Visit & UK Legal Anchor (Share Code, Passport, UK Employment/Academic ties proving return)
  4. Confirmed Flight & Accommodation Summary Table / Bullet points
  5. Chronological Day-by-Day Travel Itinerary
  6. Financial Subsistence & Bank Summary
  7. [Conditional] Request for Multiple-Entry Visa & Travel History (only if requested)
  8. Enclosed Document Checklist
  9. Formal Guarantee of Compliance & Return to UK + Sign-off

Return ONLY the complete, ready-to-print, ATS-friendly cover letter text or a JSON object with a "cover_letter_text" key.

Applicant details provided below:
[PASTE APPLICANT DETAILS HERE]`;
