"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ClientLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  nationality: string;
  status: "new" | "contacted" | "document_pending" | "processing" | "completed";
  created_at: string;
  notes?: string;
  // Processing additions
  docsChecked?: string[]; // Array of checked document ids
  appointmentDate?: string;
  appointmentRef?: string;
}

export default function ProcessingDashboard() {
  const router = useRouter();
  const [processorName, setProcessorName] = useState("Processor");
  const [cases, setCases] = useState<ClientLead[]>([]);
  const [selectedCase, setSelectedCase] = useState<ClientLead | null>(null);

  // Document checklist options
  const checkableDocs = [
    { id: "passport", label: "Valid Passport (>6 months remaining)" },
    { id: "brp", label: "Valid UK Visa / BRP (>3 months remaining)" },
    { id: "photo", label: "Schengen-compliant Photos (x2)" },
    { id: "flights", label: "Confirmed Flight Itinerary (Round-trip)" },
    { id: "hotel", label: "Confirmed Hotel Reservation / Proof of Stay" },
    { id: "insurance", label: "Travel Health Insurance (£30,000 cover)" },
    { id: "employment", label: "Employment Letter / Enrollment Certificate" },
    { id: "finance", label: "3 Months Bank Statements (Sufficient funds)" },
  ];

  // Appointment Form States
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentRef, setAppointmentRef] = useState("");

  useEffect(() => {
    // Authenticate Processor
    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(session);
    if (user.role !== "processor") {
      router.push("/login");
      return;
    }
    setProcessorName(user.name);

    // Load Cases (shared with agent's database)
    const storedLeads = localStorage.getItem("quick_holidays_client_leads");
    if (storedLeads) {
      setCases(JSON.parse(storedLeads));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/login");
  };

  // Toggle document check state
  const handleToggleDoc = (docId: string) => {
    if (!selectedCase) return;

    const currentChecked = selectedCase.docsChecked || [];
    const newChecked = currentChecked.includes(docId)
      ? currentChecked.filter((id) => id !== docId)
      : [...currentChecked, docId];

    const updatedCase: ClientLead = {
      ...selectedCase,
      docsChecked: newChecked,
      notes: selectedCase.notes
        ? `${selectedCase.notes}\n- Document check updated: ${docId} state toggled.`
        : `Document check updated: ${docId} state toggled.`,
    };

    const updatedList = cases.map((c) => (c.id === selectedCase.id ? updatedCase : c));
    localStorage.setItem("quick_holidays_client_leads", JSON.stringify(updatedList));
    setCases(updatedList);
    setSelectedCase(updatedCase);
  };

  // Save Appointment booking details
  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    const updatedCase: ClientLead = {
      ...selectedCase,
      appointmentDate,
      appointmentRef,
      notes: selectedCase.notes
        ? `${selectedCase.notes}\n- Appointment Booked: Ref ${appointmentRef} for date ${appointmentDate}`
        : `Appointment Booked: Ref ${appointmentRef} for date ${appointmentDate}`,
    };

    const updatedList = cases.map((c) => (c.id === selectedCase.id ? updatedCase : c));
    localStorage.setItem("quick_holidays_client_leads", JSON.stringify(updatedList));
    setCases(updatedList);
    setSelectedCase(updatedCase);
    alert("Visa appointment details saved successfully!");
  };

  // Complete processing / update case status
  const handleCompleteCase = () => {
    if (!selectedCase) return;
    
    const updatedCase: ClientLead = {
      ...selectedCase,
      status: "completed",
      notes: selectedCase.notes
        ? `${selectedCase.notes}\n- Visa application completed. Documents ready for collection/submission.`
        : `Visa application completed. Documents ready for collection/submission.`,
    };

    const updatedList = cases.map((c) => (c.id === selectedCase.id ? updatedCase : c));
    localStorage.setItem("quick_holidays_client_leads", JSON.stringify(updatedList));
    setCases(updatedList);
    setSelectedCase(updatedCase);
  };

  const handleReturnToAgent = () => {
    if (!selectedCase) return;
    
    const updatedCase: ClientLead = {
      ...selectedCase,
      status: "document_pending",
      notes: selectedCase.notes
        ? `${selectedCase.notes}\n- Returned to agent: Document check failed or client contact required.`
        : `Returned to agent: Document check failed or client contact required.`,
    };

    const updatedList = cases.map((c) => (c.id === selectedCase.id ? updatedCase : c));
    localStorage.setItem("quick_holidays_client_leads", JSON.stringify(updatedList));
    setCases(updatedList);
    setSelectedCase(updatedCase);
  };

  // Filter cases: show those that are 'processing' or 'completed'
  const processingCases = cases.filter((c) => c.status === "processing" || c.status === "completed" || c.status === "document_pending");

  // Load appointment details when selected case changes
  useEffect(() => {
    if (selectedCase) {
      setAppointmentDate(selectedCase.appointmentDate || "");
      setAppointmentRef(selectedCase.appointmentRef || "");
    }
  }, [selectedCase]);

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
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Side: Client Cases Queue */}
        <div className="lg:col-span-6 bg-white border border-brand-gold/15 rounded-3xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold text-brand-navy">Processing Queue</h2>
            <p className="text-xs text-slate-500 mt-1">Review documents and schedule visa submission appointments.</p>
          </div>

          {processingCases.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-sm text-slate-500 font-medium">No cases currently in the processing pipeline.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {processingCases.map((c) => {
                const checkedCount = c.docsChecked?.length || 0;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      selectedCase?.id === c.id
                        ? "border-brand-gold bg-brand-cream/30 shadow-xs"
                        : "border-slate-100 hover:border-brand-gold/30 bg-slate-50/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-brand-navy">{c.name}</h4>
                        <span className="text-xs text-slate-500">{c.destination} • {c.nationality}</span>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                        c.status === "processing"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : c.status === "document_pending"
                          ? "bg-red-50 text-red-700 border-red-100 animate-pulse"
                          : "bg-green-50 text-green-700 border-green-100"
                      }`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Progress details */}
                    <div className="mt-4 pt-3 border-t border-slate-100/50 flex justify-between items-center text-xs">
                      <span className="text-slate-500">
                        Documents Checked: <strong>{checkedCount}/{checkableDocs.length}</strong>
                      </span>
                      {c.appointmentDate && (
                        <span className="text-brand-gold font-bold">
                          Appt: {c.appointmentDate.split("T")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Case Processing Workspace */}
        <div className="lg:col-span-6">
          {selectedCase ? (
            <div className="bg-white border border-brand-gold/15 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-serif text-xl font-bold text-brand-navy">
                  Case File: {selectedCase.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">ID: {selectedCase.id} • Registered: {selectedCase.created_at.split(",")[0]}</p>
              </div>

              {/* Document Checklist */}
              <div>
                <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block mb-3">
                  1. Document Checklist Review
                </span>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5">
                  {checkableDocs.map((doc) => {
                    const isChecked = selectedCase.docsChecked?.includes(doc.id) || false;
                    return (
                      <label
                        key={doc.id}
                        onClick={() => handleToggleDoc(doc.id)}
                        className="flex items-center gap-3 cursor-pointer group select-none text-xs text-slate-700"
                      >
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked ? "bg-brand-navy border-brand-navy text-white" : "border-slate-300 bg-white group-hover:border-brand-navy"
                        }`}>
                          {isChecked && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.5} stroke="currentColor" className="w-2.5 h-2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </div>
                        <span className={isChecked ? "line-through text-slate-400 font-medium" : "font-semibold"}>
                          {doc.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Appointment Booking */}
              <div className="border-t border-slate-100 pt-6">
                <span className="text-xs font-bold text-brand-navy uppercase tracking-wider block mb-3">
                  2. Visa Submission Appointment
                </span>
                
                <form onSubmit={handleSaveAppointment} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div>
                    <label htmlFor="appt-date" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Appointment Date</label>
                    <input
                      id="appt-date"
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label htmlFor="appt-ref" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reference Number</label>
                    <input
                      id="appt-ref"
                      type="text"
                      value={appointmentRef}
                      onChange={(e) => setAppointmentRef(e.target.value)}
                      placeholder="e.g. TLS-892019"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="sm:col-span-2 text-right">
                    <button
                      type="submit"
                      className="bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 cursor-pointer shadow-xs"
                    >
                      Save Appointment Info
                    </button>
                  </div>
                </form>
              </div>

              {/* Final Actions */}
              <div className="border-t border-slate-100 pt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleCompleteCase}
                  disabled={selectedCase.status === "completed"}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-full px-6 py-2.5 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Approve & Complete Case
                </button>
                <button
                  onClick={handleReturnToAgent}
                  disabled={selectedCase.status === "document_pending"}
                  className="bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 border border-red-100 rounded-full px-6 py-2.5 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Return to Agent (Fail Checks)
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-brand-gold/15 rounded-3xl p-8 shadow-sm text-center">
              <p className="text-slate-400 text-sm font-medium">Select a case from the processing queue to check documents, input appointment records, or complete processing.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
