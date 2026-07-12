"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { visaSections } from "@/constants/visaFields";

interface ProcessingCase {
  id: string;
  title: string;
  applicantName: string;
  createdAt: string;
  formData: any;
  approvedData: any;
  agentName: string;
  agentEmail: string;
  forwardNote?: string;
}

export default function ProcessingDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [processorName, setProcessorName] = useState("Processor");
  const [cases, setCases] = useState<ProcessingCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewForm, setPreviewForm] = useState<ProcessingCase | null>(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      setLoading(true);
      const session = localStorage.getItem("user_session");
      if (!session) {
        window.location.href = "/login";
        return;
      }
      const user = JSON.parse(session);

      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (!sbUser || sbUser.id !== user.id) {
        window.location.href = "/login";
        return;
      }
      setProcessorName(user.name);

      // Load all visa forms
      const { data: formsData, error: formsErr } = await supabase
        .from("visa_forms")
        .select(`
          id,
          title,
          applicant_name,
          status,
          created_at,
          form_data,
          approved_data,
          clients (
            id,
            name,
            agent_id
          )
        `);

      // Load all profiles to identify the forwarding agent
      const { data: profilesData, error: profilesErr } = await supabase
        .from("profiles")
        .select("id, name, email");

      if (!formsErr && formsData) {
        const mapped = (formsData || [])
          .filter((f: any) =>
            f.status === "needs_approval" &&
            (!f.form_data?.assigned_processor_id || f.form_data.assigned_processor_id === user.id)
          )
          .map((f: any) => {
            const agentId = f.clients?.agent_id;
            const agentProfile = (profilesData || []).find((p: any) => p.id === agentId);
            return {
              id: f.id,
              title: f.title,
              applicantName: f.applicant_name || "Applicant",
              createdAt: new Date(f.created_at).toLocaleDateString(),
              formData: f.form_data || {},
              approvedData: f.approved_data || {},
              agentName: agentProfile?.name || "System/Unknown",
              agentEmail: agentProfile?.email || "",
              forwardNote: f.form_data?.forward_note || "",
            };
          });
        setCases(mapped);
      }
      setLoading(false);
    };

    checkAuthAndLoad();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user_session");
    window.location.href = "/login";
  };

  // Word Document exporter
  const handleExportWord = (form: ProcessingCase) => {
    const data = form.approvedData || form.formData || {};

    // Helper to get divider headers
    const getDividerRow = (fieldId: string) => {
      if (fieldId === "address_street") {
        return `
          <tr>
            <td colspan="2" style="background-color: #FAFAFA; font-weight: bold; text-align: center; font-size: 10.5pt; border: 1px solid #000000; padding: 6px 10px; font-family: 'Arial', sans-serif; color: #0F2148;">
              Full Residence Address
            </td>
          </tr>
        `;
      }
      if (fieldId === "emp_street") {
        return `
          <tr>
            <td colspan="2" style="background-color: #FAFAFA; font-weight: bold; text-align: center; font-size: 10.5pt; border: 1px solid #000000; padding: 6px 10px; font-family: 'Arial', sans-serif; color: #0F2148;">
              Employer/University/College Full Address
            </td>
          </tr>
        `;
      }
      return "";
    };

    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns:v='urn:schemas-microsoft-com:vml' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Schengen Visa Draft Form - ${form.applicantName}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          v\\:* { behavior: url(#default#VML); }
          o\\:* { behavior: url(#default#VML); }
          w\\:* { behavior: url(#default#VML); }
          .shape { behavior: url(#default#VML); }
          
          @page Section1 {
            size: 8.5in 11.0in;
            margin: 1.0in 1.5in 1.0in 1.5in;
            mso-header-margin: .5in;
            mso-footer-margin: .5in;
            mso-header: h1;
          }
          div.Section1 { page: Section1; }
          
          body { font-family: 'Arial', sans-serif; color: #0F2148; line-height: 1.4; }
          h1 { text-align: center; margin-bottom: 2px; }
          .subtitle { color: #1F497D; font-size: 16pt; text-align: center; font-weight: bold; margin-bottom: 20px; }
          h2 { color: #5B9BD5; font-size: 14pt; margin-top: 20px; margin-bottom: 8px; font-weight: bold; }
          table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; margin-bottom: 15px; border: 1px solid #000000; }
          th, td { word-wrap: break-word; word-break: break-all; overflow-wrap: break-word; }
        </style>
      </head>
      <body>
        <div class="Section1">
          <!-- Watermark VML Definition in Page Header -->
          <div style="mso-element:header" id="h1">
            <p class="MsoHeader" style="text-align:left;line-height:normal;margin:0;">
              <!--[if gte vml 1]>
              <v:shapetype id="_x0000_t136" coordsize="21600,21600" o:spt="136" adj="10800" path="m@7,l@8,m@5,21600l@6,21600e">
                <v:formulas/>
                <v:path textpathok="t" o:connecttype="custom" o:connectlocs="0,0"/>
                <v:textpath on="t" fitshape="t"/>
              </v:shapetype>
              <v:shape id="WaterMark" o:spid="_x0000_s2051" type="#_x0000_t136" 
                style="position:absolute;width:450pt;height:120pt;z-index:-251658240;
                 mso-position-horizontal:center;mso-position-horizontal-relative:margin;
                 mso-position-vertical:center;mso-position-vertical-relative:margin;
                 rotation:-30;" fillcolor="#E6E9EF" stroked="f">
                <v:textpath string="QUICK HOLIDAYS" style="font-family:'Arial';font-weight:bold;"/>
              </v:shape>
              <![endif]-->
            </p>
          </div>

          <!-- Document Brand Header -->
          <h1 style="text-align: center; margin-top: 0; margin-bottom: 2px;">
            <span style="color: #E36C0A; font-family: 'Arial Black', sans-serif; font-weight: 900; font-size: 26pt; letter-spacing: 0.5px;">QUICK</span>
            <span style="color: #1F497D; font-family: 'Arial Black', sans-serif; font-weight: 900; font-size: 26pt; letter-spacing: 0.5px;"> HOLIDAYS</span>
          </h1>
          <div class="subtitle">Future Vision Organization Limited</div>
          
          <div style="font-family: 'Arial', sans-serif; font-size: 10pt; color: #0F2148; line-height: 1.45; margin-bottom: 15px; text-align: left;">
            Please fill in <strong>CLEAR BLOCK CAPITAL LETTERS</strong>.<br>
            The details you provide will be used to complete the online application form.<br>
            Any mistakes, faint or unclear writing may cause errors in your application.<br>
            It is <strong>your responsibility</strong> to provide correct and readable information.<br>
            <span style="color: #FF0000;">In case of any errors on the visa draft form, the <strong>company will not be held responsible</strong>. Please carefully <strong>re-check your form</strong> before submitting.</span>
          </div>

          <!-- Agent Name Table -->
          <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; margin-bottom: 20px; border: 1px solid #000000;">
            <tr>
              <th style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FAFAFA; font-weight: bold; width: 35%; font-family: 'Arial', sans-serif; color: #0F2148; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word;">Agent Name</th>
              <td style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FFFFFF; width: 65%; font-family: 'Arial', sans-serif; color: #0F2148; font-weight: bold; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word;">${form.agentName.toUpperCase()}</td>
            </tr>
          </table>

          <!-- Form Sections -->
          ${visaSections.map((section) => `
            <p style="color: #FF0000; font-size: 9.5pt; font-family: 'Arial', sans-serif; margin-top: 22px; margin-bottom: 4px; text-align: left; font-weight: bold;">
              &#9888; Warning: <span style="font-weight: normal;">The company holds no responsibility for errors. Check form carefully before submitting.</span>
            </p>
            <h2 style="color: #5B9BD5; font-size: 14pt; margin-top: 0px; margin-bottom: 8px; font-weight: bold; font-family: 'Arial', sans-serif; text-align: left;">${section.title}</h2>
            <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; margin-bottom: 15px; border: 1px solid #000000;">
              ${section.fields.map((field) => `
                ${getDividerRow(field.id)}
                <tr>
                  <th style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FAFAFA; font-weight: bold; width: 35%; font-family: 'Arial', sans-serif; color: #0F2148; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word;">${field.label}</th>
                  <td style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FFFFFF; width: 65%; font-family: 'Arial', sans-serif; color: #0F2148; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word;">${data[field.id] || ""}</td>
                </tr>
              `).join("")}
            </table>
          `).join("")}

          <!-- Footer Acknowledgment & Contact details -->
          <p style="color: #1F497D; font-size: 11pt; font-weight: bold; text-align: center; margin-top: 25px; margin-bottom: 20px; font-family: 'Arial', sans-serif;">
            Thank you for your cooperation and patience.
          </p>

          <div style="font-family: 'Arial', sans-serif; font-size: 10pt; color: #1F497D; text-align: left; margin-top: 15px; line-height: 1.5;">
            <strong>☎ Contact Us</strong>
            <ul style="margin-top: 5px; margin-bottom: 0; padding-left: 20px; list-style-type: disc;">
              <li>Phone: +44 800 058 4673</li>
              <li>WhatsApp: +44 7428 878936</li>
              <li>Email: info@quickholidays.co.uk</li>
            </ul>
          </div>

        </div>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff" + docHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Visa_Draft_${form.applicantName.replace(/\s+/g, "_")}_${form.id}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-slate-800 font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-brand-navy text-white py-4 px-6 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold tracking-tight text-brand-gold">
              Quick Holidays
            </span>
            <span className="bg-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-wider rounded-md px-2 py-0.5 border border-blue-500/20">
              Processing Team
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden sm:inline text-sm text-slate-300">
              Welcome, <strong className="text-white font-bold">{processorName}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/20 bg-white/5 hover:bg-brand-gold hover:text-brand-navy hover:border-brand-gold transition-all duration-200 px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grow flex flex-col items-stretch text-left">
        <div className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 mb-6 gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-navy">Forwarded Applications</h2>
              <p className="text-xs text-slate-500 mt-1">Export approved dossiers directly into Microsoft Word document format.</p>
            </div>
            <span className="bg-brand-navy text-brand-gold font-bold text-xs px-4 py-1.5 rounded-full shrink-0">
              {cases.length} Dossiers Pending
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-brand-navy border-t-brand-gold rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Loading applications queue...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-slate-500 font-medium">No forwarded applications are currently pending processing.</p>
            </div>
          ) : (
            <>
              {/* Mobile View: Cases Cards List */}
              <div className="block md:hidden space-y-4">
                {cases.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4 text-left">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-mono font-bold text-slate-700 text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{c.id}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{c.createdAt}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy leading-tight">{c.applicantName}</h4>
                      <p className="text-xs text-slate-600 mt-1 font-semibold">{c.title}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Agent</span>
                      <strong className="text-slate-800 text-xs font-bold">{c.agentName}</strong>
                      {c.agentEmail && <span className="text-[10px] text-slate-450 block">{c.agentEmail}</span>}
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => setPreviewForm(c)}
                        className="flex-1 rounded-full border border-slate-200 hover:border-brand-navy bg-white hover:bg-slate-50 py-2.5 text-center text-xs font-bold text-slate-700 cursor-pointer shadow-xs"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleExportWord(c)}
                        className="flex-1 rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy py-2.5 text-center text-xs font-bold text-white cursor-pointer shadow-xs transition-colors"
                      >
                        Export Word
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="pb-3 pl-2">Reference ID</th>
                      <th className="pb-3">Applicant Name</th>
                      <th className="pb-3">Form Description</th>
                      <th className="pb-3">Date Forwarded</th>
                      <th className="pb-3">Forwarded By (Agent)</th>
                      <th className="pb-3 pr-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cases.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pl-2 font-mono font-bold text-slate-700">{c.id}</td>
                        <td className="py-4 font-bold text-brand-navy">{c.applicantName}</td>
                        <td className="py-4 text-slate-600 font-semibold">{c.title}</td>
                        <td className="py-4 text-slate-500">{c.createdAt}</td>
                        <td className="py-4">
                          <div className="text-slate-800 font-semibold">{c.agentName}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{c.agentEmail}</div>
                        </td>
                        <td className="py-4 pr-2 text-right space-x-2">
                          <button
                            onClick={() => setPreviewForm(c)}
                            className="rounded-full border border-slate-200 hover:border-brand-navy bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 transition-all duration-300 shadow-sm cursor-pointer hover:scale-[1.02] inline-flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 014-4z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview Details
                          </button>

                          <button
                            onClick={() => handleExportWord(c)}
                            className="rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-4 py-2 transition-all duration-300 shadow-sm cursor-pointer hover:scale-[1.02] inline-flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Word Doc
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )
          }
        </div>
        {/* 2. DOSSIER DETAILS PREVIEW MODAL */}
        {previewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 text-left">
            <div className="bg-brand-cream border border-brand-gold/20 rounded-[32px] max-w-3xl w-full max-h-[85vh] flex flex-col p-8 shadow-2xl relative overflow-hidden">
              <button
                onClick={() => setPreviewForm(null)}
                className="absolute right-6 top-6 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="border-b border-slate-200 pb-4 mb-6">
                <h3 className="font-serif text-2xl font-bold text-brand-navy">{previewForm.applicantName}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Reference ID: <strong className="text-slate-700">{previewForm.id}</strong> • Title: <strong className="text-slate-700">{previewForm.title}</strong> • Forwarded by: <strong className="text-slate-700">{previewForm.agentName}</strong>
                </p>
              </div>

              {/* Agent Note Banner */}
              {previewForm.forwardNote && (
                <div className="bg-amber-50 border border-amber-100/70 rounded-2xl p-4 text-xs mb-6 text-left shrink-0">
                  <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1 font-semibold">
                    Agent's Note
                  </span>
                  <p className="text-slate-700 italic font-medium">"{previewForm.forwardNote}"</p>
                </div>
              )}

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto space-y-8 pr-2">
                {visaSections.map((section) => {
                  const data = (previewForm.approvedData && Object.keys(previewForm.approvedData).length > 0)
                    ? previewForm.approvedData
                    : (previewForm.formData || {});

                  return (
                    <div key={section.title} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                      <h4 className="font-sans font-bold text-xs text-brand-navy uppercase tracking-wider border-b border-slate-100 pb-2">
                        {section.title}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 text-left">
                        {section.fields.map((field) => (
                          <div key={field.id} className="text-xs">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              {field.label}
                            </span>
                            <span className="text-slate-800 font-semibold break-words">
                              {data[field.id] || <span className="text-slate-300 italic font-normal">Not provided</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 pt-6 mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setPreviewForm(null)}
                  className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-6 py-2.5 transition-all duration-200 cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    handleExportWord(previewForm);
                    setPreviewForm(null);
                  }}
                  className="rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-6 py-2.5 transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Export Word Doc
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
