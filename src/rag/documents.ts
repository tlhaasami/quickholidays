export interface DocumentChunk {
  content: string;
  metadata: {
    category: string;
    type: string;
  };
}

export const knowledgeBase: DocumentChunk[] = [
  // Section 1: Core System Directives & Navigation Index
  {
    content: "Agent Persona Operational Guidelines: We are the AI Knowledge & Support Agent for Quick Holidays Ltd. We provide precise, highly accurate information regarding Schengen visa requirements, processes, and service plans. We maintain a professional, empathetic, and reassuring tone. We never guarantee visa approvals, as the embassy or consulate makes 100% of final approval decisions. Service fee refunds under our Accountability Promise apply only to verified documentation errors made by our team. Physical passports stay with the applicant until their biometrics date.",
    metadata: { category: "Operational Protocol", type: "policy" }
  },
  {
    content: "Quick Holidays System Link Index:\n- Start / Book Complete Service: [Book Complete Visa Service](/services/complete-visa)\n- Book Documentation Only: [Book Documentation Service](/services/documentation-only)\n- Book Appointment Tracking Only: [Book Appointment Booking Service](/services/appointment-only)\n- Request Free Eligibility Consultation: [Claim Free Consultation](/consultation)\n- Verify UK Company Registry: [Verify on Companies House](/verify-legitimacy)\n- Track Ongoing Application: [Application Tracking Portal](/portal/track)\n- Submit Documents for Audit: [Secure Document Portal](/portal/upload)\n- Contact Customer Support: [Contact Support Team](/contact)\n- View Refund and Guarantee Policy: [Refund and Accountability Policy](/policies/refunds)",
    metadata: { category: "Navigation Index", type: "general" }
  },

  // Section 2: Company Profile, Legitimacy & Trust Framework
  {
    content: "Is Quick Holidays Ltd a registered company in the UK? Yes, Quick Holidays Ltd is registered in England & Wales under Companies House Registry Number 15948457. You can check our active business registry details, filing history, and company status directly via the UK registry link: [Verify Companies House Record](/verify-legitimacy). Our physical registered office is located at Office 25 Innovation Park, Edge Lane, Liverpool, England, L7 9NJ.",
    metadata: { category: "Trust & Verification", type: "faq" }
  },
  {
    content: "Physical Passport Handling & Data Security: We operate entirely on digital document audits. We never request or keep your physical passport in our office, avoiding mail loss risks. You retain your physical passport at all times and present it personally during your biometrics appointment at the center (VFS Global or TLScontact). All bank statements and files are audited via secure, 256-bit encrypted database servers.",
    metadata: { category: "Data Security", type: "policy" }
  },

  // Section 3: Service Packages, Pricing & Payment Structure
  {
    content: "Schengen Visa Service Tier Inclusions and Comparison:\n1. Complete Visa Service (£175, original price £270): Premium, hands-off end-to-end service. Includes free consultation, custom checklist, cover letter, completed application forms, travel insurance, flight/hotel itineraries, automated slot tracking and booking, and decision day status tracking. [Select Complete Plan](/services/complete-visa)\n2. Documentation Service (£95, original price £145): Paperwork done right. Includes document checklist, cover letter, insurance, and flight/hotel bookings. Ideal if you already have an appointment booked and want a flawless file. Excludes appointment booking and forms. [Select Docs Plan](/services/documentation-only)\n3. Appointment Booking Service (£95, original price £145): Secured biometrics slots. Includes VFS/TLS slot search and booking, plus application forms completed accurately. Excludes checklists, letters, insurance, and hotel/flight itineraries. [Select Slot Plan](/services/appointment-only)",
    metadata: { category: "Pricing Tiers", type: "service" }
  },
  {
    content: "Add-Ons and Deposit payment breakdown: For the Complete Visa Service (£175), we charge an Initial Case Deposit of £45 to start document compiling, checklist generation, and slot tracking. The remaining Service Balance of £130 is only due after an official appointment slot at VFS/TLS is successfully secured and confirmed in your name.",
    metadata: { category: "Fees & Payments", type: "service" }
  },

  // Section 4: Operational Workflow & Visa Mechanics
  {
    content: "Schengen Visa Process Steps:\n- Step 1: Free Consultation (timeline, eligibility check)\n- Step 2: Pay £45 Case Deposit (initiates documents, custom checklist, letter, and slot tracking)\n- Step 3: Slot Tracking & Booking (monitoring VFS/TLS for biometrics dates)\n- Step 4: Confirm Slot & Pay £130 Balance (complete application forms, insurance, flight & hotel reservations guidance)\n- Step 5: Attend Biometrics Appointment (attend center in London, Manchester, or Edinburgh in person to submit physical passport and capture fingerprints)\n- Step 6: Embassy Decision & Passport Return (embassy processes the visa, typically taking 15 calendar days).",
    metadata: { category: "Visa Process", type: "faq" }
  },
  {
    content: "Embassy Visa Fees: The mandatory fees paid directly to embassies are separate from our service fees. The standard Embassy Visa Fee is €90 for adults (€45 for children aged 6-12; free for children under 6). For Denmark, Norway, and Sweden, the visa fee is paid online on behalf of the customer (this fee is not included in our services). Standard consulate processing takes 15 calendar days, but can take up to 30-45 days during peak summer seasons (May to August). We recommend starting your process 6-8 weeks before your intended travel date.",
    metadata: { category: "Fees & Payments", type: "faq" }
  },

  // Section 5: Document Requirement Matrix by Applicant Profile
  {
    content: "Core documents required for all Schengen visa applicants in the UK: Non-UK nationals residing on a BRP or digital status must have at least 3 months validity remaining on their UK Resident Permit/BRP beyond their intended exit date from the Schengen zone. Core documents include:\n- Passport: Issued within last 10 years, valid for 3+ months past return date, minimum 2 blank pages.\n- UK Resident Permit (BRP) or Digital share code status: Valid for 3+ months past return date.\n- Schengen Travel Insurance: Valid across all 29 Schengen states, covering €30,000+ medical and repatriation.\n- Financial Proof: 3 months of official UK bank statements showing sufficient closing balance.\n- Travel Itinerary: compliant round-trip flight reservations and hotel booking guidance (we show you exactly which refundable flights and free-cancellation hotels satisfy the embassy, and you book them directly).\n- Cover Letter: custom compiled, explaining itinerary and UK ties.",
    metadata: { category: "Documents", type: "faq" }
  },
  {
    content: "Document requirements by applicant niche profile:\n- Employed (Work Visa/ILR): Official employer letter dated within 30 days stating job title, salary, approved leave dates, plus last 3 months of payslips. Small businesses must provide registration details.\n- International Student: Status letter from university with CAS/Registry stamp confirming course dates and approved holidays, confirming the student will return to resume studies.\n- Self-Employed: HMRC UTR letter, recent SA302 tax calculation, and 3 months personal + 3 months business bank statements.\n- Dependent / Sponsored Spouse: Marriage certificate (translated to English if foreign), sponsor's passport, BRP, employment proof, 3 months bank statements, and a sponsorship letter.\n- Prior Refusal Applicants: previous refusal letter + custom rebuttal cover letter addressing the previous rejection reasons (e.g. proof of funds, UK ties).",
    metadata: { category: "Documents", type: "faq" }
  },

  // Section 6: Guarantees, Accountability Promise & Refund Policy
  {
    content: "The Accountability Promise and Refund Terms: If your visa is rejected due to a verifiable documentation error made by Quick Holidays Ltd (e.g. incorrect form detail, wrong checklist, or faulty insurance policy), we refund your full service fee (excluding paid appointment and insurance fees) within 5 working days. This promise does not cover rejections caused by embassy discretion (e.g. Article 32 refusal for doubting intention to return), insufficient personal bank funds, forged/unverifiable documents provided by you, or failure to attend your biometrics appointment. Cancellations made before our team begins work/checklist creation are eligible for a 100% deposit refund. Once work begins or slots are booked, fees are non-refundable unless covered by our documentation error promise.",
    metadata: { category: "Refund Policy", type: "policy" }
  },

  // Section 7: 2026 Schengen Regulations
  {
    content: "2026 Schengen Area Regulations: The Entry/Exit System (EES) is fully operational as of April 2026. Manual passport stamps have ended, replaced by biometric checks (fingerprints and facial images) at the border for all non-EU travelers. The ETIAS visa-waiver program (launching late 2026) is for visa-exempt nationals only. UK BRP holders requiring a Schengen visa do not apply for ETIAS. Schengen visas allow a maximum stay of 90 days in any rolling 180-day period. Under Schengen rules, you must apply to the consulate of the country where you spend the longest duration. If spending equal nights in two countries, you must apply to the country of first entry.",
    metadata: { category: "Schengen Visa", type: "general" }
  },

  // Section 8: Multi-Niche Intent Scripts
  {
    content: "How to calculate where to apply for multi-country Schengen tours: If travelling to multiple countries (e.g. 3 days France, 4 days Italy, 4 days Spain), you must apply to the country where you spend the most nights. If the duration is equal (e.g., 4 nights in both Italy and Spain), apply to the country you enter first. We map this out in your custom cover letter so the embassy does not reject your file for incorrect jurisdiction. [Book Complete Visa Service (£175)](/services/complete-visa)",
    metadata: { category: "Schengen Visa", type: "general" }
  },
  {
    content: "Can a freelance designer or self-employed person in the UK get a Schengen visa? Yes. Embassies process self-employed applicants daily. Instead of an employer letter, you must provide your HMRC Unique Taxpayer Reference (UTR) letter, latest SA302 tax calculation, accountant letter, and 3 months of business + personal bank statements. We audit and package these files to ensure compliance. [Book Documentation Service (£95)](/services/documentation-only)",
    metadata: { category: "Documents", type: "faq" }
  },
  {
    content: "What if I already booked non-refundable flights but do not have my visa? Schengen embassies advise against buying non-refundable tickets before visa approval due to potential consulate processing delays (takes 15-30 days). If you already booked, we will use your itinerary.",
    metadata: { category: "Visa Process", type: "faq" }
  },
  {
    content: "If biometric fingerprints are captured at the border under the 2026 EES, do I still need a VFS/TLS appointment? Yes. The Entry/Exit System (EES) captures biometric border entry data. However, to obtain the physical Schengen visa sticker before you travel, you must still attend VFS Global or TLScontact in the UK to submit your application and initial biometrics. [Book Appointment Booking (£95)](/services/appointment-only)",
    metadata: { category: "Visa Process", type: "faq" }
  }
];
