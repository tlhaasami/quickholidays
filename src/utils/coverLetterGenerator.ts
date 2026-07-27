/**
 * Utility functions for generating ATS-friendly Cover Letters and exporting vector PDFs.
 */

// Helper to remove any accidental emojis from text
export function sanitizeTextForATS(text: string): string {
  if (!text) return "";
  // Remove emojis and non-standard symbols
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
}

/**
 * Generate formatted plain text using the Single Master Modular Template schema
 */
export function generateMasterCoverLetterText(data: Record<string, string>): string {
  const fullNameRaw = data.full_name || (data.personal_surname ? `${data.personal_first_names || ''} ${data.personal_surname || ''}`.trim() : "");
  const name = fullNameRaw ? fullNameRaw.toUpperCase() : "[Full Name]";
  
  const address = data.uk_address || [data.address_street, data.address_city, data.address_postal_code, data.address_country].filter(Boolean).join(", ") || "[UK Address]";
  const phone = data.phone_number || data.address_phone || data.address_mobile || "[Phone Number]";
  const email = data.email_address || data.address_email || "[Email Address]";
  const passport = data.passport_number || data.passport_no || "[Passport Number]";
  const nationality = data.nationality || data.personal_nationality || "[Current Nationality]";
  const shareCode = data.uk_share_code || data.residence_share_code || "[UK Share Code]";
  const shareCodeExp = data.share_code_expiry || data.uk_share_code_expiry || data.residence_permit_expiry || "[Share Code Expiry]";
  const embassy = data.target_embassy || (data.travel_destinations ? `Embassy of ${data.travel_destinations}` : "[Target Embassy]");
  const venue = data.submission_venue || (data.travel_submission_city ? `VFS / TLS / BLS Center (${data.travel_submission_city})` : "[Submission Venue]");
  const destination = (data.destination_country || data.travel_destinations || "[Destination Country]").toUpperCase();
  const appDate = data.application_date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const startDate = data.trip_start_date || data.travel_start_date || "[Trip Start Date]";
  const endDate = data.trip_end_date || data.travel_return_date || "[Trip Return Date]";

  // Combine academic & employer details if both exist
  const schoolName = data.emp_school_name || "";
  const employerName = data.emp_employer_name || "";
  const institution = data.institution_or_employer || [schoolName, employerName].filter(Boolean).join(" & ") || "[Employer / University]";

  const occupation = data.emp_occupation || "";
  const jobTitle = data.emp_job_title || "";
  const role = data.job_title_or_degree || [occupation, jobTitle].filter(Boolean).join(" / ") || "[Job Title / Degree]";

  const salaryStatus = data.salary_or_status_details || (employerName || schoolName ? `Official support & status evidence from ${employerName || schoolName} attached` : "[Salary / Support Proof]");
  const outboundFlight = data.flight_pnr_outbound || "[Outbound Flight & PNR]";
  const inboundFlight = data.flight_pnr_inbound || "[Inbound Flight & PNR]";
  
  const hotelParts = [data.accommodation_hotel_name || data.acc_hotel_name, data.acc_street, data.acc_city, data.acc_country].filter(Boolean);
  const hotel = data.hotel_booking_details || (hotelParts.length > 0 ? hotelParts.join(", ") : "[Hotel reference]");
  const bankSummary = data.bank_summary || "[Financial Funds & Bank Summary]";
  const itinerary = data.daily_itinerary_summary || `Day 1 (${startDate}): Arrival, Check-in & Evening Walk in Historic Center.\nDay 2: Sightseeing, Cultural Landmarks & City Excursions.\nDay 3: Local Museums & Leisure Exploration.\nDay 4 (${endDate}): Hotel Check-out, Transfer to Airport & Return Flight to UK.`;
  const multiEntry = data.multiple_entry_request || "";
  const priorVisas = data.prior_visa_history || data.visa_issued_last_59_months || "";

  let body = `${name}
${address}
Phone: ${phone} | Email: ${email}
Passport No: ${passport} | Nationality: ${nationality}
UK Home Office Share Code: ${shareCode} (Valid until: ${shareCodeExp})

--------------------------------------------------------------------------------
Date: ${appDate}

To:
The Visa Officer / Consular Department
${embassy}
Submission Venue: ${venue}

SUBJECT: APPLICATION FOR SCHENGEN TOURIST VISA TO ${destination} (${startDate} TO ${endDate})

Dear Sir/Madam,

I am writing this cover letter to formally submit my application for a short-stay Schengen Tourist Visa (Type C) to visit ${destination} from ${startDate} to ${endDate}.

1. PERSONAL BACKGROUND & UK LEGAL ANCHOR
I am an international national legally residing in the United Kingdom under valid UK Immigration Status (Share Code: ${shareCode}, expiry date: ${shareCodeExp}).
My primary legal and social anchor in the UK is as a ${role} at ${institution}. ${salaryStatus}. My commitments and lawful status in the UK ensure my mandatory return immediately following the conclusion of this holiday.

2. FLIGHT & ACCOMMODATION LOGISTICS
My round-trip travel arrangements and accommodation bookings are fully confirmed:
- Outbound Transit: ${outboundFlight}
- Inbound Transit: ${inboundFlight}
- Accommodation: ${hotel}

3. CHRONOLOGICAL DAY-BY-DAY TRAVEL ITINERARY
Below is my planned daily itinerary for the duration of my stay:
${itinerary}

4. FINANCIAL SUBSISTENCE & PROOF OF FUNDS
This vacation is entirely self-funded through my personal savings and earnings. Enclosed are ${bankSummary}, demonstrating sufficient financial means to meet all expenses during my stay.
`;

  if (multiEntry.trim() || priorVisas.trim()) {
    body += `\n5. REQUEST FOR MULTIPLE-ENTRY VISA & PRIOR VISA HISTORY\nI respectfully request favorable consideration for a Multiple-Entry Visa. ${multiEntry ? multiEntry + '. ' : ''}${priorVisas ? `Prior Travel History: ${priorVisas}.` : ''}\n`;
  }

  body += `
6. ENCLOSED SUPPORTING DOCUMENTATION CHECKLIST
- Completed and signed Schengen Visa Application Form.
- Valid Passport & UK Share Code verification document.
- Official UK Status / Ties Evidence (${institution} Support / Employment Letter).
- Confirmed Round-Trip Flight Reservation e-tickets.
- Confirmed Hotel Accommodation Booking Confirmation.
- Certified Bank Statements & Payslips for the last 3 months.
- Schengen Travel Health Insurance Policy (€30,000 emergency medical coverage).

7. FORMAL GUARANTEE OF COMPLIANCE & RETURN TO THE UK
I hereby guarantee to strictly abide by all immigration laws and public directives of the Schengen zone. I assure you that I will depart the Schengen area on or before ${endDate} and return directly to the United Kingdom.

Thank you very much for your time, diligence, and favorable consideration of my application.

Yours faithfully,

_______________________________________
${name}
Applicant
`;

  return sanitizeTextForATS(body);
}

/**
 * Generate production-ready LaTeX source code (.tex) using standard article/geometry/titlesec packages
 */
export function generateLaTeXCoverLetterCode(data: Record<string, string>): string {
  const escapeLaTeX = (str: string) => {
    if (!str) return "";
    return str
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\$")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_")
      .replace(/\{/g, "\\{")
      .replace(/\}/g, "\\}")
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}");
  };

  const fullNameRaw = data.full_name || (data.personal_surname ? `${data.personal_first_names || ''} ${data.personal_surname || ''}`.trim() : "");
  const name = fullNameRaw ? escapeLaTeX(fullNameRaw.toUpperCase()) : "[Full Name]";
  const rawAddr = data.uk_address || [data.address_street, data.address_city, data.address_postal_code, data.address_country].filter(Boolean).join(", ");
  const address = rawAddr ? escapeLaTeX(rawAddr) : "[UK Address]";
  const phone = (data.phone_number || data.address_phone || data.address_mobile) ? escapeLaTeX(data.phone_number || data.address_phone || data.address_mobile) : "[Phone Number]";
  const email = (data.email_address || data.address_email) ? escapeLaTeX(data.email_address || data.address_email) : "[Email Address]";
  const passport = (data.passport_number || data.passport_no) ? escapeLaTeX(data.passport_number || data.passport_no) : "[Passport Number]";
  const nationality = (data.nationality || data.personal_nationality) ? escapeLaTeX(data.nationality || data.personal_nationality) : "[Current Nationality]";
  const shareCode = (data.uk_share_code || data.residence_share_code) ? escapeLaTeX(data.uk_share_code || data.residence_share_code) : "[UK Share Code]";
  const shareCodeExp = (data.share_code_expiry || data.uk_share_code_expiry || data.residence_permit_expiry) ? escapeLaTeX(data.share_code_expiry || data.uk_share_code_expiry || data.residence_permit_expiry) : "[Share Code Expiry]";
  const embassy = (data.target_embassy || data.travel_destinations) ? escapeLaTeX(data.target_embassy || `Embassy of ${data.travel_destinations}`) : "[Target Embassy]";
  const venue = (data.submission_venue || data.travel_submission_city) ? escapeLaTeX(data.submission_venue || `VFS / TLS / BLS Center (${data.travel_submission_city})`) : "[Submission Venue]";
  const destination = (data.destination_country || data.travel_destinations) ? escapeLaTeX((data.destination_country || data.travel_destinations).toUpperCase()) : "[Destination Country]";
  const appDate = escapeLaTeX(data.application_date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }));
  const startDate = (data.trip_start_date || data.travel_start_date) ? escapeLaTeX(data.trip_start_date || data.travel_start_date) : "[Trip Start Date]";
  const endDate = (data.trip_end_date || data.travel_return_date) ? escapeLaTeX(data.trip_end_date || data.travel_return_date) : "[Trip Return Date]";

  const schoolName = data.emp_school_name || "";
  const employerName = data.emp_employer_name || "";
  const rawInst = data.institution_or_employer || [schoolName, employerName].filter(Boolean).join(" & ");
  const institution = rawInst ? escapeLaTeX(rawInst) : "[Employer / University]";

  const occupation = data.emp_occupation || "";
  const jobTitle = data.emp_job_title || "";
  const rawRole = data.job_title_or_degree || [occupation, jobTitle].filter(Boolean).join(" / ");
  const role = rawRole ? escapeLaTeX(rawRole) : "[Job Title / Degree]";

  const salaryStatus = data.salary_or_status_details ? escapeLaTeX(data.salary_or_status_details) : (employerName || schoolName ? escapeLaTeX(`Official support & status evidence from ${employerName || schoolName} attached`) : "[Salary / Support Proof]");
  const outboundFlight = data.flight_pnr_outbound ? escapeLaTeX(data.flight_pnr_outbound) : "[Outbound Flight & PNR]";
  const inboundFlight = data.flight_pnr_inbound ? escapeLaTeX(data.flight_pnr_inbound) : "[Inbound Flight & PNR]";

  const hotelParts = [data.accommodation_hotel_name || data.acc_hotel_name, data.acc_street, data.acc_city, data.acc_country].filter(Boolean);
  const rawHotel = data.hotel_booking_details || (hotelParts.length > 0 ? hotelParts.join(", ") : "");
  const hotel = rawHotel ? escapeLaTeX(rawHotel) : "[Hotel reference]";
  const bankSummary = data.bank_summary ? escapeLaTeX(data.bank_summary) : "[Financial Funds & Bank Summary]";

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{lmodern}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\definecolor{navy}{RGB}{15, 33, 72}
\\definecolor{gold}{RGB}{201, 149, 55}

\\titleformat{\\section}{\\large\\bfseries\\color{navy}}{\\thesection}{1em}{}[\\titlerule]

\\pagestyle{empty}

\\begin{document}

\\begin{center}
{\\LARGE \\textbf{\\color{navy}{${name}}}}\\\\
\\vspace{4pt}
\\small ${address} \\quad | \\quad Phone: ${phone} \\quad | \\quad Email: ${email}\\\\
\\small Passport No: ${passport} \\quad | \\quad Nationality: ${nationality}\\\\
\\small UK Home Office Share Code: ${shareCode} \\quad (Valid until: ${shareCodeExp})
\\end{center}

\\vspace{10pt}
\\hrule
\\vspace{15pt}

\\noindent \\textbf{Date:} ${appDate}\\\\[10pt]
\\textbf{To:}\\\\
The Visa Officer / Consular Department\\\\
${embassy}\\\\
Submission Venue: ${venue}\\\\[15pt]

\\noindent \\textbf{\\underline{SUBJECT: APPLICATION FOR SCHENGEN TOURIST VISA TO ${destination} (${startDate} TO ${endDate})}}

\\vspace{15pt}
\\noindent Dear Sir/Madam,

\\vspace{10pt}
\\noindent I am writing this cover letter to formally submit my application for a short-stay Schengen Tourist Visa (Type C) to visit ${destination} from ${startDate} to ${endDate}.

\\section*{1. PERSONAL BACKGROUND \\& UK LEGAL ANCHOR}
I am an international national legally residing in the United Kingdom under valid UK Immigration Status (Share Code: ${shareCode}, expiry date: ${shareCodeExp}).
My primary legal and social anchor in the UK is as a ${role} at ${institution}. ${salaryStatus}. My commitments and lawful status in the UK ensure my mandatory return immediately following the conclusion of this holiday.

\\section*{2. FLIGHT \\& ACCOMMODATION LOGISTICS}
My round-trip travel arrangements and accommodation bookings are fully confirmed:
\\begin{itemize}[leftmargin=*]
  \\item \\textbf{Outbound Transit:} ${outboundFlight}
  \\item \\textbf{Inbound Transit:} ${inboundFlight}
  \\item \\textbf{Accommodation:} ${hotel}
\\end{itemize}

\\section*{3. CHRONOLOGICAL DAY-BY-DAY TRAVEL ITINERARY}
Below is my planned daily itinerary for the duration of my stay:
Day 1 (${startDate}): Arrival, Check-in \\& Evening Walk in Historic Center.
Day 2: Sightseeing, Cultural Landmarks \\& City Excursions.
Day 3: Local Museums \\& Leisure Exploration.
Day 4 (${endDate}): Hotel Check-out, Transfer to Airport \\& Return Flight to UK.

\\section*{4. FINANCIAL SUBSISTENCE \\& PROOF OF FUNDS}
This vacation is entirely self-funded through my personal savings and earnings. Enclosed are ${bankSummary}, demonstrating sufficient financial means to meet all expenses during my stay.

\\section*{5. ENCLOSED SUPPORTING DOCUMENTATION CHECKLIST}
\\begin{itemize}[leftmargin=*]
  \\item Completed and signed Schengen Visa Application Form.
  \\item Valid Passport \\& UK Share Code verification document.
  \\item Official UK Status / Ties Evidence (${institution} Support Letter).
  \\item Confirmed Round-Trip Flight Reservation e-tickets.
  \\item Confirmed Hotel Accommodation Booking Confirmation.
  \\item Certified Bank Statements \\& Payslips for the last 3 months.
  \\item Schengen Travel Health Insurance Policy (€30,000 emergency medical coverage).
\\end{itemize}

\\section*{6. FORMAL GUARANTEE OF COMPLIANCE \\& RETURN TO THE UK}
I hereby guarantee to strictly abide by all immigration laws and public directives of the Schengen zone. I assure you that I will depart the Schengen area on or before ${endDate} and return directly to the United Kingdom.

\\vspace{20pt}
\\noindent Thank you very much for your time, diligence, and favorable consideration of my application.

\\vspace{20pt}
\\noindent Yours faithfully,\\\\[35pt]
\\noindent \\rule{6cm}{0.4pt}\\\\
\\textbf{${name}}\\\\
Applicant

\\end{document}`;
}

export function downloadLaTeXCode(data: Record<string, string> | string, fileName: string = "Schengen_Cover_Letter") {
  const code = typeof data === "string" 
    ? generateLaTeXCoverLetterCode({ full_name: "Applicant", destination_country: "Schengen" })
    : generateLaTeXCoverLetterCode(data);

  const blob = new Blob([code], { type: "text/x-tex" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName.replace(/\s+/g, "_")}.tex`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Open print modal to export crisp, professional LaTeX-styled vector PDF
 */
export function exportCoverLetterPDF(content: string, fileName: string = "Schengen_Visa_Cover_Letter") {
  const cleanContent = sanitizeTextForATS(content);
  
  // Format content to HTML with LaTeX Document Typography
  const formattedHtml = cleanContent
    .split("\n")
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "<br/>";
      if (trimmed.startsWith("SUBJECT:")) {
        return `<div class="latex-subject">${trimmed}</div>`;
      }
      if (trimmed.match(/^[0-9]\. /)) {
        return `<div class="latex-section-title">${trimmed}</div>`;
      }
      if (trimmed.startsWith("- ")) {
        return `<div class="latex-bullet">• ${trimmed.substring(2)}</div>`;
      }
      return `<p class="latex-paragraph">${line}</p>`;
    })
    .join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export PDF");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${fileName}</title>
        <style>
          @page {
            size: A4;
            margin: 25.4mm;
          }
          body {
            font-family: "Latin Modern Roman", "Computer Modern", "Garamond", "Georgia", serif;
            font-size: 10.5pt;
            line-height: 1.5;
            color: #111111;
            background: #ffffff;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .latex-container {
            max-width: 720px;
            margin: 0 auto;
            word-wrap: break-word;
          }
          .latex-header {
            text-align: center;
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 1.5px solid #0F2148;
          }
          .latex-title {
            font-size: 16pt;
            font-weight: bold;
            color: #0F2148;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
            text-transform: uppercase;
          }
          .latex-meta {
            font-size: 9.5pt;
            color: #333333;
            line-height: 1.4;
          }
          .latex-subject {
            font-size: 11pt;
            font-weight: bold;
            color: #0F2148;
            margin-top: 16px;
            margin-bottom: 16px;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .latex-section-title {
            font-size: 11pt;
            font-weight: bold;
            color: #0F2148;
            margin-top: 20px;
            margin-bottom: 8px;
            padding-bottom: 3px;
            border-bottom: 1px solid #0F2148;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          .latex-paragraph {
            margin: 6px 0;
            line-height: 1.5;
            text-align: justify;
          }
          .latex-bullet {
            margin: 3px 0 3px 20px;
            line-height: 1.45;
          }
          @media print {
            body { width: 100%; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="latex-container">
          ${formattedHtml}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Export cover letter as Word (.doc) document
 */
export function downloadCoverLetterDocx(content: string, fileName: string = "Schengen_Visa_Cover_Letter") {
  const cleanContent = sanitizeTextForATS(content);
  const paragraphs = cleanContent
    .split("\n")
    .map(line => `<p style="font-family: Arial, sans-serif; font-size: 10.5pt; line-height: 1.4; color: #111111;">${line || "&nbsp;"}</p>`)
    .join("");

  const docHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${fileName}</title>
        <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
        <style>
          @page { size: 8.5in 11.0in; margin: 1.0in 1.0in 1.0in 1.0in; }
          body { font-family: Arial, sans-serif; }
        </style>
      </head>
      <body>
        ${paragraphs}
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff" + docHtml], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName.replace(/\s+/g, "_")}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
