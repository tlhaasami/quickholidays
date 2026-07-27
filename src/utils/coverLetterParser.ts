/**
 * Smart Natural Language Parser & Extractor for Applicant Notes
 * Parses unstructured text/notes and extracts key Schengen Visa field values.
 */

export interface ParsedApplicantData {
  full_name: string;
  passport_number: string;
  nationality: string;
  uk_address: string;
  phone_number: string;
  email_address: string;
  uk_share_code: string;
  share_code_expiry: string;
  uk_residency_type: string;
  target_embassy: string;
  submission_venue: string;
  destination_country: string;
  application_date: string;
  uk_anchor_type: string;
  institution_or_employer: string;
  job_title_or_degree: string;
  salary_or_status_details: string;
  trip_start_date: string;
  trip_end_date: string;
  flight_pnr_outbound: string;
  flight_pnr_inbound: string;
  hotel_booking_details: string;
  bank_summary: string;
  daily_itinerary_summary: string;
  multiple_entry_request: string;
  prior_visa_history: string;
}

export function parseApplicantNotes(rawText: string): ParsedApplicantData {
  const text = rawText || "";
  
  // Helper match function
  const matchPattern = (patterns: RegExp[]): string => {
    for (const pat of patterns) {
      const m = text.match(pat);
      if (m && m[1]) return m[1].trim();
    }
    return "";
  };

  // 1. Passport
  const passport = matchPattern([
    /passport\s*(?:no|number|#)?\s*[:\-=]?\s*([A-Z0-9]{6,10})/i,
    /passport\s*([A-Z0-9]{6,10})/i,
    /\b([A-Z][0-9]{7,8})\b/
  ]);

  // 2. UK Share Code
  const shareCode = matchPattern([
    /share\s*code\s*[:\-=]?\s*([A-Z0-9]{3}\s*[A-Z0-9]{3}\s*[A-Z0-9]{3})/i,
    /share\s*code\s*[:\-=]?\s*([A-Z0-9\s]{8,12})/i,
    /\b([A-Z0-9]{3}\s[A-Z0-9]{3}\s[A-Z0-9]{3})\b/
  ]);

  // 3. Share Code Expiry
  const shareCodeExp = matchPattern([
    /(?:share\s*code\s*)?expir(?:y|es|ation)\s*[:\-=]?\s*([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/i,
    /(?:valid\s*until|valid\s*to)\s*[:\-=]?\s*([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/i
  ]);

  // 4. Email
  const email = matchPattern([
    /\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b/
  ]);

  // 5. Phone
  const phone = matchPattern([
    /(?:phone|mobile|tel)\s*[:\-=]?\s*(\+?[0-9\s\-\(\)]{10,16})/i,
    /(\+44\s?[0-9\s\-]{10,13})/
  ]);

  // 6. Name
  const name = matchPattern([
    /(?:name|applicant|full\s*name)\s*[:\-=]?\s*([A-Z\s]{4,35})/i,
    /I\s+am\s+([A-Z\s]{4,30})(?:\.|\,|\s+residing|\s+living|\s+a\s+resident)/i
  ]);

  // 7. Nationality
  const nationality = matchPattern([
    /(?:nationality|citizen)\s*[:\-=]?\s*([A-Za-z\s]{3,20})/i,
    /(Indian|Pakistani|Bangladeshi|Nigerian|Ghanaian|Turkish|Egyptian|Filipino)/i
  ]);

  // 8. Destination Country
  const destination = matchPattern([
    /(?:destination|visiting|travelling\s+to|travel\s+to)\s*[:\-=]?\s*([A-Za-z\s]{3,25})/i,
    /(Greece|Switzerland|Spain|France|Italy|Germany|Netherlands|Austria|Czech\s+Republic|Latvia|Malta|Portugal)/i
  ]);

  // 9. Target Embassy
  const embassy = matchPattern([
    /(?:embassy|consulate)\s*[:\-=]?\s*([A-Za-z\s]{4,40})/i
  ]) || (destination ? `Embassy of ${destination}` : "");

  // 10. Dates
  const datesMatch = text.match(/(?:from|dates?|period)\s*[:\-=]?\s*([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})\s*(?:to|until|\-)\s*([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/i);
  const startDate = datesMatch ? datesMatch[1] : matchPattern([/(?:start|departure)\s*date\s*[:\-=]?\s*([0-9\/\-\.]{8,10})/i]);
  const endDate = datesMatch ? datesMatch[2] : matchPattern([/(?:end|return)\s*date\s*[:\-=]?\s*([0-9\/\-\.]{8,10})/i]);

  // 11. Employer / University
  const institution = matchPattern([
    /(?:employer|company|university|college|workplace)\s*[:\-=]?\s*([A-Za-z0-9\s\.,&'\-]{3,40})/i,
    /(?:at|for)\s+([A-Z][A-Za-z0-9\s&'\-]{3,35}\s+(?:Limited|Ltd|University|Inc|PLC|Services))/
  ]);

  // 12. Job Title / Course
  const role = matchPattern([
    /(?:job\s*title|position|course|degree|role)\s*[:\-=]?\s*([A-Za-z0-9\s\.,&'\-]{3,40})/i,
    /(?:employed\s+as|working\s+as|student\s+of|enrolled\s+in)\s+([A-Za-z\s]{3,30})/i
  ]);

  // 13. Salary / Status details
  const salary = matchPattern([
    /(?:salary|annual\s*income|earnings)\s*[:\-=]?\s*(£?[0-9,]+(?:\s*per\s*annum|\s*\/yr)?)/i
  ]);

  // 14. Flight Details
  const outboundFlight = matchPattern([
    /(?:outbound\s*flight|departure\s*flight|flight\s*out)\s*[:\-=]?\s*([A-Za-z0-9\s\.,\-\(\)]{5,60})/i,
    /(Flight\s+[A-Z0-9]+\s+[A-Za-z0-9\s\-\(\)\.]+Ref\s*:\s*[A-Z0-9]+)/i
  ]);
  const inboundFlight = matchPattern([
    /(?:inbound\s*flight|return\s*flight|flight\s*back)\s*[:\-=]?\s*([A-Za-z0-9\s\.,\-\(\)]{5,60})/i
  ]);

  // 15. Hotel Booking Details
  const hotel = matchPattern([
    /(?:hotel|accommodation|staying\s+at)\s*[:\-=]?\s*([A-Za-z0-9\s\.,&'\-]{5,60})/i
  ]);

  // 16. Address
  const address = matchPattern([
    /(?:address|residing\s+at|living\s+at)\s*[:\-=]?\s*([A-Za-z0-9\s\.,\-]{10,60})/i
  ]);

  // 17. Multi-Entry Request
  const multiEntry = matchPattern([
    /(?:multiple-entry|multi-entry|1-year|1\s*year)\s*(?:request|visa)?\s*[:\-=]?\s*([A-Za-z0-9\s\.,\-]{10,80})/i
  ]);

  return {
    full_name: name,
    passport_number: passport,
    nationality: nationality,
    uk_address: address,
    phone_number: phone,
    email_address: email,
    uk_share_code: shareCode,
    share_code_expiry: shareCodeExp,
    uk_residency_type: text.toLowerCase().includes("student") ? "Student Visa" : "Legal UK Resident",
    target_embassy: embassy,
    submission_venue: embassy ? `VFS / TLS Global (${destination || "UK"})` : "",
    destination_country: destination,
    application_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
    uk_anchor_type: text.toLowerCase().includes("student") ? "Student" : "Employed",
    institution_or_employer: institution,
    job_title_or_degree: role,
    salary_or_status_details: salary ? `Salary: ${salary}` : "Official Support Letter enclosed",
    trip_start_date: startDate,
    trip_end_date: endDate,
    flight_pnr_outbound: outboundFlight,
    flight_pnr_inbound: inboundFlight,
    hotel_booking_details: hotel,
    bank_summary: "3 months certified bank statements attached proving sufficient liquid funds",
    daily_itinerary_summary: "",
    multiple_entry_request: multiEntry,
    prior_visa_history: ""
  };
}
