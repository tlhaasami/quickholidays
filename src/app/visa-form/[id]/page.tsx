"use client";

import React, { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import { visaSections, VisaField, VisaForm, ClientProfile } from "@/constants/visaFields";
import { logoTop, formBg } from "@/constants/data";
import { createClient } from "@/lib/supabase/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ClientVisaFormPage({ params }: PageProps) {
  const { id: formId } = use(params);
  const supabase = createClient();
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [clientForm, setClientForm] = useState<VisaForm | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving..." | "Error">("Saved");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Add Form client-side state
  const [showAddFormModal, setShowAddFormModal] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newFormApplicantName, setNewFormApplicantName] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      const { data: form, error } = await supabase
        .from("visa_forms")
        .select(`
          id,
          title,
          applicant_name,
          status,
          created_at,
          updated_at,
          form_data,
          approved_data,
          clients (
            id,
            name,
            email,
            phone
          )
        `)
        .eq("id", formId)
        .single();

      if (!error && form) {
        setClient({
          id: (form.clients as any).id,
          name: (form.clients as any).name,
          email: (form.clients as any).email || "",
          phone: (form.clients as any).phone || "",
          forms: [],
        });
        setClientForm({
          id: form.id,
          title: form.title,
          applicantName: form.applicant_name || "",
          status: form.status,
          created_at: form.created_at,
          updated_at: form.updated_at,
          formData: form.form_data || {},
          approvedData: form.approved_data || {},
        });
        setFormData(form.form_data || {});
      } else {
        console.error("Failed to load form from database:", error?.message);
      }
      setLoading(false);
    };

    fetchForm();
  }, [formId]);

  useEffect(() => {
    if (loading) return;

    function handleScroll() {
      const viewportHeaderHeight = 100;
      let closestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < visaSections.length; i++) {
        const el = document.getElementById(`section-${i}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const distance = Math.abs(rect.top - viewportHeaderHeight);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
          }
        }
      }
      setActiveSectionIndex(closestIndex);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const updateField = (fieldId: string, value: string) => {
    if (!clientForm || clientForm.status === "approved" || !client) return;

    if (clientForm.status === "needs_approval" || clientForm.status === "client_completed") {
      return;
    }

    setSaveStatus("Saving...");
    const updatedFormData = { ...formData, [fieldId]: value };
    setFormData(updatedFormData);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const { error } = await supabase
        .from("visa_forms")
        .update({
          form_data: updatedFormData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", formId);

      if (error) {
        setSaveStatus("Error");
      } else {
        setSaveStatus("Saved");
      }
    }, 1000);
  };

  const handleMarkAsCompleted = async () => {
    if (!clientForm || clientForm.status === "approved" || !client) return;

    const updated = {
      ...clientForm,
      status: "client_completed" as const,
      updated_at: new Date().toISOString()
    };
    setClientForm(updated);

    const { error } = await supabase
      .from("visa_forms")
      .update({
        status: "client_completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", formId);

    if (error) {
      console.error("Failed to mark form as completed:", error.message);
    }
  };

  const handleClientAddForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;

    const { count } = await supabase
      .from("visa_forms")
      .select("*", { count: "exact", head: true })
      .eq("client_id", client.id);

    if (count !== null && count >= 10) {
      alert("Maximum limit of 10 visa forms reached.");
      return;
    }

    const applicant = newFormApplicantName.trim() || client.name;
    const tenDigitId = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const { data: dbForm, error: formErr } = await supabase
      .from("visa_forms")
      .insert({
        id: tenDigitId,
        client_id: client.id,
        title: newFormTitle.trim() || `Schengen Visa Form #${(count || 0) + 1}`,
        applicant_name: applicant,
        status: "draft",
        form_data: {
          address_email: client.email || "",
          address_phone: client.phone || "",
        },
        approved_data: {},
      })
      .select()
      .single();

    if (formErr || !dbForm) {
      alert(formErr?.message || "Failed to create new visa form.");
      return;
    }

    setShowAddFormModal(false);
    setNewFormTitle("");
    setNewFormApplicantName("");
    window.location.href = `/visa-form/${tenDigitId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-gold border-t-brand-navy rounded-full animate-spin"></div>
          <p className="text-slate-600 text-sm font-medium">Connecting to secure server...</p>
        </div>
      </div>
    );
  }

  if (!clientForm || !client) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white border border-red-200 rounded-[32px] p-8 max-w-md shadow-lg">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-navy mb-2">Visa Draft Form Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            The link you followed may have expired, or the form ID is incorrect. Please contact your Quick Holidays agent to get a valid form URL.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-6 py-3 transition-colors shadow-sm"
          >
            Go back to homepage
          </a>
        </div>
      </div>
    );
  }

  const getSectionProgress = (sec: typeof visaSections[0]) => {
    const fields = sec.fields;
    const filledCount = fields.filter((f) => {
      const val = formData[f.id];
      return val !== undefined && val !== null && String(val).trim() !== "";
    }).length;
    return {
      filled: filledCount,
      total: fields.length,
      percentage: Math.round((filledCount / fields.length) * 100)
    };
  };

  const isLocked = clientForm.status === "approved" || clientForm.status === "needs_approval";
  const isAwaitingReview = clientForm.status === "client_completed";

  const hasUnapprovedChanges = Object.keys(formData).some((key) => {
    const val = formData[key] || "";
    const approvedVal = (clientForm.approvedData && clientForm.approvedData[key]) || "";
    return val !== approvedVal && val !== "";
  });

  return (
    <div className="min-h-screen bg-brand-cream text-slate-800 font-sans relative pb-20 select-none antialiased overflow-x-clip">
      {/* Background Cover Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-[0.06] z-0"
        style={{ backgroundImage: `url(${formBg.src})` }}
      />
      {/* Background Watermark */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02] select-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] whitespace-nowrap text-[120px] font-black tracking-widest text-slate-400">
          QUICK HOLIDAYS
        </div>
        <div className="absolute top-2/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] whitespace-nowrap text-[120px] font-black tracking-widest text-slate-400">
          QUICK HOLIDAYS
        </div>
        <div className="absolute top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-45deg] whitespace-nowrap text-[120px] font-black tracking-widest text-slate-400">
          QUICK HOLIDAYS
        </div>
      </div>

      {/* Sticky Banner Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-800 py-4 px-6 border-b border-brand-gold/15 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <Image src={logoTop} alt="Quick Holidays Logo" className="h-10 w-auto object-contain shrink-0" />
            <div className="hidden sm:block h-6 w-[1px] bg-slate-200"></div>
            <span className="hidden sm:inline-block bg-brand-gold/10 text-brand-navy text-[8px] uppercase font-extrabold tracking-widest rounded-full px-2.5 py-0.5 border border-brand-gold/25 whitespace-nowrap">
              Secure Client Portal
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Realtime synced status */}
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>
                {saveStatus === "Saving..." ? "Syncing..." : "Synced"}
              </span>
            </div>

            <span className={`text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full border ${isLocked
                ? "bg-green-50 text-green-700 border-green-200"
                : isAwaitingReview
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}>
              {isLocked ? "Approved & Locked" : isAwaitingReview ? "Awaiting Agent" : "Drafting Mode"}
            </span>
          </div>
        </div>
      </header>

      <style>{`
        .custom-date-input::-webkit-calendar-picker-indicator {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          opacity: 0;
          cursor: pointer;
        }
      `}</style>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Active Dossier Navigation & Form Switcher */}
        <div className="bg-white border border-brand-gold/15 rounded-[24px] p-5 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-left relative overflow-hidden">

          <div className="pl-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Travel Dossier</span>
            <h4 className="font-serif text-base font-black text-brand-navy mt-0.5 leading-tight">
              {clientForm.title} {clientForm.applicantName ? `(for ${clientForm.applicantName})` : ""}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Registered to: <strong className="text-slate-800 font-bold">{client.name}</strong>
            </p>
          </div>

          <div className="flex items-end gap-3 flex-wrap">
            {client.forms && client.forms.length > 1 && (
              <div className="flex flex-col gap-1 min-w-[240px]">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-black pl-1">All Forms:</span>
                <CustomSelect
                  value={clientForm.id}
                  onChange={(val) => {
                    window.location.href = `/visa-form/${val}`;
                  }}
                  options={client.forms.map((f) => ({
                    value: f.id,
                    label: `${f.title} ${f.applicantName ? `(for ${f.applicantName})` : ""}`
                  }))}
                />
              </div>
            )}

            {client.forms && client.forms.length < 10 && (
              <button
                onClick={() => setShowAddFormModal(true)}
                className="bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy rounded-xl px-4 py-3 text-xs font-black cursor-pointer transition-all duration-300 shadow-sm self-end h-[42px]"
                title="Create a new Schengen Visa Application Form (Max 10)"
              >
                + Create New Form
              </button>
            )}
          </div>
        </div>

        {/* Collaborative Workspace Banner */}
        <div className={`mb-8 border rounded-3xl p-6 sm:p-8 shadow-sm text-left relative overflow-hidden transition-all duration-300 ${isLocked
            ? "bg-green-50/50 border-green-200 text-green-900"
            : isAwaitingReview
              ? "bg-amber-50/50 border-amber-200 text-amber-900"
              : "bg-blue-50/50 border-blue-200 text-blue-900"
          }`}>
          {/* Subtle side glow */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-navy opacity-85"></div>

          <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🛡️</span>
                <h4 className="font-serif text-lg font-black text-brand-navy uppercase tracking-wide">
                  {isLocked
                    ? "Application Finalized & Locked"
                    : isAwaitingReview
                      ? "Dossier Submitted to Consultant"
                      : "Secure Schengen Visa Workspace"}
                </h4>
              </div>

              <p className="text-xs leading-relaxed text-slate-600 font-medium">
                {isLocked
                  ? "Your Quick Holidays specialist has finalized your visa draft dossier. All fields have been locked and compiled into the official consular registration records."
                  : isAwaitingReview
                    ? "Your dossier is currently under review by our specialist team. We are cross-referencing your entries with your flight and accommodation bookings. You will be notified immediately of any updates."
                    : "Welcome to your secure Schengen Travel Dossier. Any adjustments you make below are updated in real-time. Fields marked in yellow indicate pending reviews that your visa specialist will verify."}
              </p>
            </div>

            {!isLocked && !isAwaitingReview && (
              <button
                onClick={handleMarkAsCompleted}
                className="inline-flex items-center gap-2 rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-black px-6 py-3.5 transition-all duration-300 cursor-pointer shadow-md transform hover:scale-[1.02] shrink-0 border border-brand-navy/10 self-start md:self-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Form Completed - Done From My Side
              </button>
            )}
          </div>
        </div>

        {/* Professional Warning / Accuracy Disclosure */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 mb-8 text-left text-xs text-amber-900 shadow-xs flex items-start gap-4">
          <span className="text-xl shrink-0 mt-0.5">⚖️</span>
          <div>
            <h5 className="font-bold text-slate-800 mb-1 uppercase tracking-wider text-[10px]">Important Accuracy & Visa Policy Disclosure</h5>
            <p className="leading-relaxed text-slate-600 font-medium">
              Quick Holidays Ltd prepares official Schengen submissions strictly based on client-provided details.
              Please verify that all entries correspond exactly with your passport, BRP card, and travel tickets.
              Consular offices enforce rigid verification policies; minor transcription errors, name mismatches, or invalid numbers can result in processing delays or immediate application refusal.
              Please check your details thoroughly.
            </p>
          </div>
        </div>

        {/* Security Encryption Note */}
        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-semibold justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>

        {/* Detailed Form Layout with Sidebar navigation */}
        <div className="flex flex-col md:flex-row gap-8 items-start relative mt-8">

          {/* Sticky Left Navigation Sidebar */}
          <div className="w-full md:w-64 shrink-0 md:sticky md:top-[100px] self-start md:max-h-[calc(100vh-140px)] md:overflow-y-auto scrollbar-none space-y-3 z-30 mb-4 md:mb-0">
            <div className="bg-white border border-brand-gold/15 rounded-3xl p-4 shadow-sm">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-3 hidden md:block text-left pl-1">
                Sections & Progress
              </h3>
              {/* Flex row on mobile, flex col on desktop */}
              <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-2 md:pb-0 scrollbar-thin">
                {visaSections.map((section, idx) => {
                  const status = getSectionProgress(section);
                  const isActive = activeSectionIndex === idx;
                  return (
                    <button
                      type="button"
                      key={section.title}
                      onClick={() => {
                        setActiveSectionIndex(idx);
                        const el = document.getElementById(`section-${idx}`);
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      className={`text-left p-3 rounded-2xl border text-xs transition-all duration-200 shrink-0 w-56 md:w-full cursor-pointer relative flex flex-col justify-between ${isActive
                          ? "bg-brand-navy border-brand-gold text-white shadow-md font-semibold"
                          : "bg-slate-50/50 border-slate-100 text-slate-655 hover:bg-slate-50 hover:text-slate-805"
                        }`}
                    >
                      <div className="flex justify-between items-center w-full gap-2 mb-1 min-w-0">
                        <span className="font-serif truncate min-w-0 flex-1">{section.title}</span>
                        <span className={`text-[9px] font-bold font-mono shrink-0 ${isActive ? "text-brand-gold" : "text-slate-400"}`}>
                          {status.filled}/{status.total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200/50 h-1.5 rounded-full overflow-hidden mt-1.5 relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${status.percentage === 100
                              ? "bg-green-500"
                              : isActive
                                ? "bg-brand-gold"
                                : "bg-brand-navy"
                            }`}
                          style={{ width: `${status.percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Scrollable Form sections list on the right */}
          <div className="flex-1 w-full space-y-12">
            {visaSections.map((section, idx) => (
              <div
                key={section.title}
                id={`section-${idx}`}
                onFocusCapture={() => setActiveSectionIndex(idx)}
                className="bg-white border border-brand-gold/15 rounded-[32px] p-6 sm:p-8 shadow-sm text-left relative scroll-mt-24"
              >
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                  <span className="w-1.5 h-5 bg-brand-gold rounded-full shrink-0"></span>
                  <h3 className="font-serif text-lg font-black text-brand-navy uppercase tracking-wide">
                    {section.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field) => {
                    const currentValue = formData[field.id] || "";
                    const approvedValue = (clientForm.approvedData && clientForm.approvedData[field.id]) || "";
                    const isUnapproved = currentValue !== approvedValue && currentValue !== "";

                    return (
                      <div key={field.id} className="flex flex-col gap-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          {field.label}
                        </label>

                        <div className="relative">
                          {field.type === "select" ? (
                            <CustomSelect
                              disabled={isLocked || isAwaitingReview}
                              value={currentValue}
                              onChange={(val) => updateField(field.id, val)}
                              options={field.options || []}
                              placeholder="-- Select Option --"
                              isUnapproved={isUnapproved}
                            />
                          ) : field.type === "date" ? (
                            <div className="relative flex items-center">
                              <div className="absolute left-3.5 pointer-events-none text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                </svg>
                              </div>
                              <input
                                disabled={isLocked || isAwaitingReview}
                                type="date"
                                value={currentValue}
                                onChange={(e) => updateField(field.id, e.target.value)}
                                className={`w-full custom-date-input rounded-xl border pl-10 pr-10 py-3 text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-gold/45 transition-all ${isUnapproved
                                    ? "border-amber-400 bg-amber-50/10 focus:border-amber-500 focus:ring-amber-500 text-slate-900 font-medium"
                                    : "border-slate-200 focus:border-brand-gold focus:ring-brand-gold"
                                  }`}
                              />
                            </div>
                          ) : field.type === "textarea" ? (
                            <textarea
                              disabled={isLocked || isAwaitingReview}
                              rows={3}
                              placeholder={field.placeholder}
                              value={currentValue}
                              onChange={(e) => updateField(field.id, e.target.value)}
                              className={`w-full rounded-xl border px-3.5 py-3 text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-gold/45 transition-all ${isUnapproved
                                  ? "border-amber-400 bg-amber-50/10 focus:border-amber-500 focus:ring-amber-500 text-slate-900 font-medium"
                                  : "border-slate-200 focus:border-brand-gold focus:ring-brand-gold"
                                }`}
                            />
                          ) : (
                            <input
                              disabled={isLocked || isAwaitingReview}
                              type="text"
                              placeholder={field.placeholder}
                              value={currentValue}
                              onChange={(e) => updateField(field.id, e.target.value)}
                              className={`w-full rounded-xl border px-3.5 py-3 text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-gold/45 transition-all ${isUnapproved
                                  ? "border-amber-400 bg-amber-50/10 focus:border-amber-500 focus:ring-amber-500 text-slate-900 font-medium"
                                  : "border-slate-200 focus:border-brand-gold focus:ring-brand-gold"
                                }`}
                            />
                          )}

                        </div>

                        {isUnapproved && approvedValue && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-medium text-left">
                            <span>Previously approved: &ldquo;{approvedValue}&rdquo;</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

        {hasUnapprovedChanges && (
          <div className="bg-amber-50 border border-amber-200/60 rounded-[32px] p-6 mt-12 mb-4 text-left text-xs text-amber-900 shadow-xs flex items-start gap-4">
            <span className="text-xl shrink-0 mt-0.5">⚠️</span>
            <div>
              <h5 className="font-bold text-slate-800 mb-1 uppercase tracking-wider text-[10px]">Unapproved modifications</h5>
              <p className="leading-relaxed text-slate-600 font-medium">
                You have updated visa fields. These modifications will be sent to the agent for approval once synced.
              </p>
            </div>
          </div>
        )}

        {/* Footer Contact Details */}
        <div className="mt-12 bg-slate-900 rounded-[32px] p-8 text-white text-left relative overflow-hidden border border-brand-gold/10 shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(204,163,82,0.12),transparent_60%)] pointer-events-none" />

          <h4 className="font-serif text-lg font-bold text-brand-gold mb-2 flex items-center gap-2">
            <span>📞</span> Need assistance with drafting?
          </h4>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-xl">
            If you have questions about required Schengen credentials, share codes, or consulate guidelines, please consult your assigned travel specialist.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Helpline Support</span>
              <a href="tel:+448000584673" className="font-bold text-brand-gold hover:underline mt-auto">+44 800 058 4673</a>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Direct WhatsApp</span>
              <a href="https://wa.me/447828707425" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-gold hover:underline mt-auto">+44 7828 707425</a>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">General Email</span>
              <a href="mailto:info@quickholidays.co.uk" className="font-bold text-brand-gold hover:underline mt-auto">info@quickholidays.co.uk</a>
            </div>
          </div>
        </div>
      </main>

      {/* CLIENT ADD FORM MODAL */}
      {showAddFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 text-left">
          <div className="bg-brand-cream border border-brand-gold/25 rounded-[32px] max-w-sm w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAddFormModal(false)}
              className="absolute right-6 top-6 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-serif text-xl font-bold text-brand-navy mb-1">Add New Visa Form</h3>
            <p className="text-xs text-slate-500 mb-6">Create another visa draft dossier. Limit: 10 forms maximum.</p>

            <form onSubmit={handleClientAddForm} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-widest mb-1.5">Visa Form Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. France Schengen Visa"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  className="w-full rounded-xl border border-brand-gold/30 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-navy uppercase tracking-widest mb-1.5">Applicant Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Emma Green (Leave blank to use client's name)"
                  value={newFormApplicantName}
                  onChange={(e) => setNewFormApplicantName(e.target.value)}
                  className="w-full rounded-xl border border-brand-gold/30 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white transition-all duration-300 py-2.5 text-xs font-bold cursor-pointer mt-2"
              >
                Create Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  disabled?: boolean;
  value: string;
  onChange: (val: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  isUnapproved?: boolean;
  className?: string;
}

function CustomSelect({ disabled, value, onChange, options, placeholder, isUnapproved, className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const parsedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = parsedOptions.find((opt) => opt.value === value);
  const selectedLabel = selectedOption ? selectedOption.label : placeholder || "-- Select Option --";

  return (
    <div ref={dropdownRef} className="relative w-full z-10 text-left">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left rounded-xl border px-3.5 py-3 text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-gold/45 transition-all flex items-center justify-between cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""
          } ${isUnapproved
            ? "border-amber-400 bg-amber-50/10 focus:border-amber-500 focus:ring-amber-500 text-slate-900 font-medium"
            : "border-slate-200 focus:border-brand-gold focus:ring-brand-gold"
          } ${className || ""}`}
      >
        <span className={value ? "text-slate-955 font-bold" : "text-slate-400"}>{selectedLabel}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl z-50 py-1">
          {placeholder && (
            <div
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="px-3.5 py-2.5 text-xs text-slate-400 hover:bg-slate-50 cursor-pointer font-medium"
            >
              {placeholder}
            </div>
          )}
          {parsedOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3.5 py-2.5 text-xs hover:bg-brand-cream/80 hover:text-brand-navy cursor-pointer font-bold transition-colors flex items-center justify-between ${value === opt.value ? "bg-brand-cream text-brand-navy" : "text-slate-700"
                }`}
            >
              <span>{opt.label}</span>
              {value === opt.value && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-brand-gold">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
