export interface VisaField {
  id: string;
  label: string;
  placeholder?: string;
  type: "text" | "select" | "date" | "textarea";
  options?: string[];
}

export interface VisaSection {
  title: string;
  fields: VisaField[];
}

export interface VisaForm {
  id: string; // 10-digit number string
  title: string;
  applicantName?: string;
  status: "draft" | "client_completed" | "approved" | "needs_approval";
  created_at: string;
  updated_at: string;
  formData: Record<string, string>;
  approvedData: Record<string, string>;
}

export interface ClientProfile {
  id: string; // Client unique ID
  name: string;
  email?: string;
  phone?: string;
  forms: VisaForm[];
}

export const visaSections: VisaSection[] = [
  {
    title: "Personal Details",
    fields: [
      { id: "personal_surname", label: "Surname (Family name)", placeholder: "e.g. KHAN", type: "text" },
      { id: "personal_surname_birth", label: "Surname at birth (Former name)", placeholder: "", type: "text" },
      { id: "personal_first_names", label: "First name(s) (Given name)", placeholder: "e.g. SEHAR AFSHAN TARIQ", type: "text" },
      { id: "personal_dob", label: "Date of Birth", type: "date" },
      { id: "personal_pob", label: "Place of Birth", placeholder: "e.g. LIVERPOOL, UK", type: "text" },
      { id: "personal_cob", label: "Country of Birth", placeholder: "e.g. UNITED KINGDOM", type: "text" },
      { id: "personal_nationality", label: "Current Nationality", placeholder: "e.g. BRITISH", type: "text" },
      { id: "personal_nationality_birth", label: "Nationality at Birth", placeholder: "e.g. BRITISH", type: "text" },
      { id: "personal_sex", label: "Sex (Male/Female/Other)", type: "select", options: ["FEMALE", "MALE", "OTHER"] },
      { id: "personal_marital_status", label: "Marital Status", type: "select", options: ["Single", "Married", "Cohabitating", "Separated", "Divorced", "Widowed"] },
    ],
  },
  {
    title: "Travel Details",
    fields: [
      { id: "travel_submission_city", label: "City where application will be submitted", placeholder: "e.g. LONDON", type: "text" },
      { id: "travel_destinations", label: "Country/ies intending to travel/visit", placeholder: "e.g. PORTUGAL", type: "text" },
      { id: "travel_purpose", label: "Purpose of Travel (Tourism/Business etc.)", placeholder: "e.g. TOURISM", type: "text" },
      { id: "travel_start_date", label: "Start date of travel to Schengen country", type: "date" },
      { id: "travel_return_date", label: "Return date from Schengen country", type: "date" },
    ],
  },
  {
    title: "Travel Document / Passport Details",
    fields: [
      { id: "passport_type", label: "Type of Document (Ordinary Passport/Other)", placeholder: "ORDINARY PASSPORT", type: "text" },
      { id: "passport_number", label: "Passport Number", placeholder: "e.g. RU4154351", type: "text" },
      { id: "passport_issue_date", label: "Issue Date", type: "date" },
      { id: "passport_expiry_date", label: "Expiry Date", type: "date" },
    ],
  },
  {
    title: "Applicant Residence Address Details",
    fields: [
      { id: "address_street", label: "Street No & Street Address", placeholder: "e.g. 184 Ilchester Road", type: "text" },
      { id: "address_postal_code", label: "Postal Code", placeholder: "e.g. RM82YA", type: "text" },
      { id: "address_city", label: "City", placeholder: "e.g. Dagenham", type: "text" },
      { id: "address_county", label: "County (Optional)", placeholder: "e.g. Essex", type: "text" },
      { id: "address_country", label: "Country", placeholder: "e.g. United Kingdom", type: "text" },
      { id: "address_phone", label: "Mobile/Landline Number & WhatsApp", placeholder: "e.g. 7507677927", type: "text" },
      { id: "address_email", label: "Email Address", placeholder: "e.g. Seherkhan576@gmail.com", type: "text" },
    ],
  },
  {
    title: "UK Immigration Status",
    fields: [
      { id: "uk_share_code", label: "Share Code", placeholder: "e.g. 9X9Y9Z9W9", type: "text" },
      { id: "uk_share_code_issue", label: "Share Code Issue Date", type: "date" },
      { id: "uk_share_code_expiry", label: "Share Code Expiry Date", type: "date" },
    ],
  },
  {
    title: "Employment / Education Details",
    fields: [
      { id: "emp_occupation", label: "Occupation", placeholder: "", type: "text" },
      { id: "emp_school_name", label: "University/College Name (if student)", placeholder: "", type: "text" },
      { id: "emp_employer_name", label: "Employer/Business Name", placeholder: "", type: "text" },
      { id: "emp_job_title", label: "Job Title", placeholder: "", type: "text" },
      { id: "emp_street", label: "Street No & Street Address (Employer/School)", placeholder: "", type: "text" },
      { id: "emp_postal_code", label: "Postal Code (Employer/School)", placeholder: "", type: "text" },
      { id: "emp_city", label: "City (Employer/School)", placeholder: "", type: "text" },
      { id: "emp_county", label: "County (Employer/School - Optional)", placeholder: "", type: "text" },
      { id: "emp_country", label: "Country (Employer/School)", placeholder: "", type: "text" },
      { id: "emp_phone", label: "Employer/School Phone", placeholder: "", type: "text" },
      { id: "emp_email", label: "Employer/School Email", placeholder: "", type: "text" },
    ],
  },
  {
    title: "Previous Schengen Visa History",
    fields: [
      { id: "history_visa_issued", label: "Visa issued in last 59 months? (Yes/No)", placeholder: "", type: "text" },
      { id: "history_sticker_number", label: "Visa Sticker Number & Dates", placeholder: "", type: "text" },
      { id: "history_fingerprint_date", label: "Fingerprint collected? Date if known", placeholder: "", type: "text" },
    ],
  },
  {
    title: "Accommodation Details",
    fields: [
      { id: "acc_hotel_name", label: "Hotel Name / Inviting Person Name", placeholder: "", type: "text" },
      { id: "acc_street", label: "Street No & Street Address (Accommodation)", placeholder: "", type: "text" },
      { id: "acc_postal_code", label: "Postal Code (Accommodation)", placeholder: "", type: "text" },
      { id: "acc_city", label: "City (Accommodation)", placeholder: "", type: "text" },
      { id: "acc_county", label: "County (Accommodation - Optional)", placeholder: "", type: "text" },
      { id: "acc_country", label: "Country (Accommodation)", placeholder: "", type: "text" },
      { id: "acc_phone", label: "Telephone Number (Accommodation)", placeholder: "", type: "text" },
      { id: "acc_email", label: "Email Address (Accommodation)", placeholder: "", type: "text" },
    ],
  },
  {
    title: "Financial Sponsorship",
    fields: [
      { id: "finance_costs_covered", label: "Travel Costs Covered by (Applicant/Sponsor)", placeholder: "", type: "text" },
      { id: "finance_sponsor_name", label: "Sponsor Name & Surname", placeholder: "", type: "text" },
      { id: "finance_sponsor_address", label: "Sponsor Address", placeholder: "", type: "text" },
      { id: "finance_sponsor_contact", label: "Sponsor Contact Details", placeholder: "", type: "text" },
    ],
  },
  {
    title: "Family Member (EU/EEA/CH Citizen) Details",
    fields: [
      { id: "family_personal_data", label: "Family Member Personal Data", placeholder: "", type: "text" },
      { id: "family_relationship", label: "Relationship (Spouse/Child)", placeholder: "", type: "text" },
      { id: "family_eu_passport", label: "Does spouse/child hold EU/EEA/CH Passport/ID? (Yes/No)", placeholder: "", type: "text" },
      { id: "family_surname", label: "Surname", placeholder: "", type: "text" },
      { id: "family_first_name", label: "First & Middle Name", placeholder: "", type: "text" },
      { id: "family_dob", label: "Date of Birth", type: "date" },
      { id: "family_nationality", label: "Nationality", placeholder: "", type: "text" },
      { id: "family_passport_number", label: "Passport/ID Number", placeholder: "", type: "text" },
      { id: "family_passport_expiry", label: "Passport/ID Expiry Date", type: "date" },
    ],
  },
  {
    title: "Minor Parents Details",
    fields: [
      { id: "minor_relation", label: "Relation", placeholder: "", type: "text" },
      { id: "minor_surname", label: "Surname", placeholder: "", type: "text" },
      { id: "minor_first_name", label: "First name", placeholder: "", type: "text" },
      { id: "minor_dob", label: "Date of Birth", type: "date" },
      { id: "minor_nationality", label: "Current Nationality", placeholder: "", type: "text" },
      { id: "minor_street", label: "Street No & Street Address", placeholder: "", type: "text" },
      { id: "minor_postal_code", label: "Postal Code", placeholder: "", type: "text" },
      { id: "minor_city", label: "City", placeholder: "", type: "text" },
      { id: "minor_county", label: "County (Optional)", placeholder: "", type: "text" },
      { id: "minor_country", label: "Country", placeholder: "", type: "text" },
      { id: "minor_phone", label: "Mobile/Landline Number & WhatsApp", placeholder: "", type: "text" },
      { id: "minor_email", label: "Email Address", placeholder: "", type: "text" },
    ],
  },
];
