import { NextRequest, NextResponse } from "next/server";
import { RAG_CONFIG } from "@/rag/config";

export const dynamic = "force-dynamic";

// Schengen countries checklist for destination verification
const SCHENGEN_COUNTRIES = new Set([
  "austria", "belgium", "croatia", "czech republic", "denmark", "estonia",
  "finland", "france", "germany", "greece", "hungary", "iceland", "italy",
  "latvia", "liechtenstein", "lithuania", "luxembourg", "malta", "netherlands",
  "norway", "poland", "portugal", "slovakia", "slovenia", "spain", "sweden",
  "switzerland"
]);

export async function POST(req: NextRequest) {
  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY env variable is not configured" },
      { status: 500 }
    );
  }

  try {
    const { text, history = [] } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Input text is required" }, { status: 400 });
    }

    const messages = [
      {
        role: "system",
        content: `You are an expert administrative assistant for Quick Holidays Ltd. Your job is to read unstructured texts, notes, passports, or email copy-pastes and convert them into official Schengen Visa Application Form fields.

The schema you must output is:
{
  "data": {
    "personal_surname": string or null (Surname/Family Name),
    "personal_surname_birth": string or null (Former Surname),
    "personal_first_names": string or null (First/Given Names),
    "personal_dob": string or null (YYYY-MM-DD Date of birth),
    "personal_pob": string or null (Place of birth, e.g. 'LONDON'),
    "personal_cob": string or null (Country of birth, e.g. 'UNITED KINGDOM'),
    "personal_nationality": string or null (e.g. 'INDIAN'),
    "personal_nationality_birth": string or null (Nationality at birth),
    "personal_sex": string or null ('MALE' or 'FEMALE' or 'OTHER'),
    "personal_marital_status": string or null ('Single', 'Married', 'Cohabitating', 'Separated', 'Divorced', 'Widowed'),
    "travel_submission_city": string or null (City where application will be submitted),
    "travel_destinations": string or null (Country intending to travel/visit),
    "travel_purpose": string or null (Purpose of Travel, e.g. 'TOURISM'),
    "travel_start_date": string or null (YYYY-MM-DD travel start date),
    "travel_return_date": string or null (YYYY-MM-DD travel return date),
    "passport_type": string or null (e.g. 'ORDINARY PASSPORT'),
    "passport_number": string or null,
    "passport_issue_date": string or null (YYYY-MM-DD),
    "passport_expiry_date": string or null (YYYY-MM-DD),
    "address_street": string or null,
    "address_postal_code": string or null,
    "address_city": string or null,
    "address_county": string or null,
    "address_country": string or null,
    "address_phone": string or null,
    "address_email": string or null,
    "uk_share_code": string or null,
    "uk_share_code_issue": string or null (YYYY-MM-DD),
    "uk_share_code_expiry": string or null (YYYY-MM-DD),
    "emp_occupation": string or null,
    "emp_school_name": string or null,
    "emp_employer_name": string or null,
    "emp_job_title": string or null,
    "emp_street": string or null,
    "emp_postal_code": string or null,
    "emp_city": string or null,
    "emp_county": string or null,
    "emp_country": string or null,
    "emp_phone": string or null,
    "emp_email": string or null,
    "history_visa_issued": string or null,
    "history_sticker_number": string or null,
    "history_fingerprint_date": string or null,
    "acc_hotel_name": string or null,
    "acc_street": string or null,
    "acc_postal_code": string or null,
    "acc_city": string or null,
    "acc_county": string or null,
    "acc_country": string or null,
    "acc_phone": string or null,
    "acc_email": string or null,
    "finance_costs_covered": string or null,
    "finance_sponsor_name": string or null,
    "finance_sponsor_address": string or null,
    "finance_sponsor_contact": string or null,
    "family_personal_data": string or null,
    "family_relationship": string or null,
    "family_eu_passport": string or null,
    "family_surname": string or null,
    "family_first_name": string or null,
    "family_dob": string or null (YYYY-MM-DD),
    "family_nationality": string or null,
    "family_passport_number": string or null,
    "family_passport_expiry": string or null (YYYY-MM-DD),
    "minor_relation": string or null,
    "minor_surname": string or null,
    "minor_first_name": string or null,
    "minor_dob": string or null (YYYY-MM-DD),
    "minor_nationality": string or null,
    "minor_street": string or null,
    "minor_postal_code": string or null,
    "minor_city": string or null,
    "minor_county": string or null,
    "minor_country": string or null,
    "minor_phone": string or null,
    "minor_email": string or null
  },
  "missingFields": string[] (List of CRITICAL missing fields ONLY: personal_surname, personal_first_names, passport_number, travel_destinations, travel_start_date, travel_return_date, uk_share_code, address_street. Do NOT include optional fields like address_county, emp_street, emp_phone, emp_email, minor fields in missingFields),
  "message": string (A structured plain-text response in EXACTLY this format — no markdown symbols, no asterisks, no hashes:

EXTRACTED DETAILS
(List every field that was successfully extracted, grouped by section. Use the exact human-readable label for each field from the mapping below. Format each line as: [Section] > [Field Label]: [Value])

REMAINING FIELDS NEEDED
Please provide the following details to complete the application:
(List ONLY CRITICAL missing fields necessary for visa application: Surname, First name, Passport Number, Destination Country, Travel Dates, UK Share Code, Street Address. One per line starting with a dash. Do NOT list optional fields like County, Employer Phone, or Employer Email if employment info is provided.)

Use this field ID to human-readable label mapping:
personal_surname -> Surname (Family name)
personal_surname_birth -> Surname at birth (Former name)
personal_first_names -> First name(s) (Given name)
personal_dob -> Date of Birth
personal_pob -> Place of Birth
personal_cob -> Country of Birth
personal_nationality -> Current Nationality
personal_nationality_birth -> Nationality at Birth
personal_sex -> Sex (Male/Female/Other)
personal_marital_status -> Marital Status
travel_submission_city -> City where application will be submitted
travel_destinations -> Country/ies intending to travel/visit
travel_purpose -> Purpose of Travel
travel_start_date -> Start date of travel to Schengen country
travel_return_date -> Return date from Schengen country
passport_type -> Type of Travel Document
passport_number -> Passport Number
passport_issue_date -> Passport Issue Date
passport_expiry_date -> Passport Expiry Date
address_street -> Street No & Street Address
address_postal_code -> Postal Code
address_city -> City (Residence)
address_county -> County (Residence)
address_country -> Country (Residence)
address_phone -> Mobile / WhatsApp Number
address_email -> Email Address
uk_share_code -> UK Share Code
uk_share_code_issue -> Share Code Issue Date
uk_share_code_expiry -> Share Code Expiry Date
emp_occupation -> Occupation
emp_school_name -> University / College Name
emp_employer_name -> Employer / Business Name
emp_job_title -> Job Title
emp_street -> Street No & Street Address (Employer/School)
emp_postal_code -> Postal Code (Employer/School)
emp_city -> City (Employer/School)
emp_county -> County (Employer/School)
emp_country -> Country (Employer/School)
emp_phone -> Employer / School Phone
emp_email -> Employer / School Email
history_visa_issued -> Visa issued in last 59 months?
history_sticker_number -> Visa Sticker Number & Dates
history_fingerprint_date -> Fingerprint collected? Date if known
acc_hotel_name -> Hotel Name / Inviting Person Name
acc_street -> Street No & Street Address (Accommodation)
acc_postal_code -> Postal Code (Accommodation)
acc_city -> City (Accommodation)
acc_county -> County (Accommodation)
acc_country -> Country (Accommodation)
acc_phone -> Telephone Number (Accommodation)
acc_email -> Email Address (Accommodation)
finance_costs_covered -> Travel Costs Covered by
finance_sponsor_name -> Sponsor Name & Surname
finance_sponsor_address -> Sponsor Address
finance_sponsor_contact -> Sponsor Contact Details
family_personal_data -> Family Member Personal Data
family_relationship -> Relationship to Applicant
family_eu_passport -> Does family member hold EU/EEA/CH Passport?
family_surname -> Family Member Surname
family_first_name -> Family Member First & Middle Name
family_dob -> Family Member Date of Birth
family_nationality -> Family Member Nationality
family_passport_number -> Family Member Passport/ID Number
family_passport_expiry -> Family Member Passport Expiry Date
minor_relation -> Minor: Relation to Applicant
minor_surname -> Minor: Surname
minor_first_name -> Minor: First name
minor_dob -> Minor: Date of Birth
minor_nationality -> Minor: Current Nationality
minor_street -> Minor: Street No & Street Address
minor_postal_code -> Minor: Postal Code
minor_city -> Minor: City
minor_county -> Minor: County
minor_country -> Minor: Country
minor_phone -> Minor: Mobile/WhatsApp Number
minor_email -> Minor: Email Address

Do NOT use any technical field IDs (no underscores). Do NOT use markdown symbols (no **, no ##, no backticks). Only output plain text.),
  "isComplete": boolean (true if all critical fields are validly populated, false otherwise)
}

You MUST verify the travel_destinations value:
- The travel_destinations country MUST be a Schengen member country.
- Valid Schengen countries are: Austria, Belgium, Croatia, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland.
- If it is NOT in this list, set it to null and add "travel_destinations" to the missingFields list.

Handling Ambiguities & Zero Assumption Rule:
- ABSOLUTE ZERO ASSUMPTIONS: You must NEVER assume, guess, or invent missing information. If a value is not explicitly stated in the text, set it to null.
- CONFUSION & MISSING EXPLANATIONS: If the input contains ambiguous or incomplete details (for instance, travel destination is missing or not a Schengen member, travel dates are vague, passport number is omitted, or employment status is unclear), explicitly describe the exact confusion under the "message" response so the agent immediately knows what needs clarification. Do not make conversational chit-chat, but clearly list each point of confusion.

You must return ONLY a valid JSON object matching this schema. Do not output any markup, markdown, backticks, or intro text outside of the JSON block.`
      }
    ];

    // Inject history if any
    for (const h of history) {
      messages.push({
        role: h.role,
        content: h.content
      });
    }

    // Inject current text
    messages.push({
      role: "user",
      content: `Please parse this text and return the structured JSON:
"${text}"`
    });

    const chatRes = await fetch(RAG_CONFIG.GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        messages,
        model: RAG_CONFIG.CHAT_MODEL,
        temperature: 0.15,
        response_format: { type: "json_object" }
      }),
    });

    if (!chatRes.ok) {
      const errText = await chatRes.text();
      throw new Error(`Groq API failed: ${chatRes.status} - ${errText}`);
    }

    const chatData = await chatRes.json();
    const content = chatData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response returned from Groq parser");
    }

    const parsed = JSON.parse(content.trim());

    // Server-side safety double check on Schengen country listing
    if (parsed.data && parsed.data.travel_destinations) {
      const destLower = parsed.data.travel_destinations.toLowerCase().trim();
      if (!SCHENGEN_COUNTRIES.has(destLower)) {
        parsed.data.travel_destinations = null;
        if (!parsed.missingFields.includes("travel_destinations")) {
          parsed.missingFields.push("travel_destinations");
        }
        parsed.isComplete = false;
        parsed.message = `The travel destination "${parsed.data.travel_destinations || ''}" is invalid. Please select a valid Schengen country.`;
      }
    }

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Agent lead parser API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
