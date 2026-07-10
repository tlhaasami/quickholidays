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
}

export default function AgentDashboard() {
  const router = useRouter();
  const [agentName, setAgentName] = useState("Agent");
  const [leads, setLeads] = useState<ClientLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<ClientLead | null>(null);
  const [newNote, setNewNote] = useState("");

  // Booking Form State
  const [showAddLead, setShowAddLead] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("Italy");
  const [nationality, setNationality] = useState("");

  useEffect(() => {
    // Authenticate Agent
    const session = localStorage.getItem("user_session");
    if (!session) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(session);
    if (user.role !== "agent") {
      router.push("/login");
      return;
    }
    setAgentName(user.name);

    // Load Client Leads
    const storedLeads = localStorage.getItem("quick_holidays_client_leads");
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    } else {
      // Seed sample client cases for agent to manage
      const sampleLeads: ClientLead[] = [
        {
          id: "lead-1",
          name: "Sophia Martinez",
          email: "sophia.m@example.com",
          phone: "+447700900077",
          destination: "France",
          nationality: "Indian (UK BRP)",
          status: "new",
          created_at: new Date(Date.now() - 3600000 * 3).toLocaleString(),
          notes: "First time traveler to Schengen zone. High urgency.",
        },
        {
          id: "lead-2",
          name: "Daniel Kovacs",
          email: "daniel.k@example.com",
          phone: "+447911122233",
          destination: "Germany",
          nationality: "British National (Overseas)",
          status: "contacted",
          created_at: new Date(Date.now() - 3600000 * 20).toLocaleString(),
          notes: "Spoke on phone. Sending checklist. Documents expected by tomorrow.",
        },
        {
          id: "lead-3",
          name: "Fatima Al-Sayed",
          email: "fatima.as@example.com",
          phone: "+447455566677",
          destination: "Spain",
          nationality: "Pakistani (UK ILR)",
          status: "document_pending",
          created_at: new Date(Date.now() - 3600000 * 72).toLocaleString(),
          notes: "Awaiting updated bank statements and flight itinerary.",
        },
      ];
      localStorage.setItem("quick_holidays_client_leads", JSON.stringify(sampleLeads));
      setLeads(sampleLeads);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/login");
  };

  const handleUpdateStatus = (id: string, newStatus: ClientLead["status"]) => {
    const updated = leads.map((lead) => {
      if (lead.id === id) {
        const updatedLead = { ...lead, status: newStatus };
        if (selectedLead?.id === id) {
          setSelectedLead(updatedLead);
        }
        return updatedLead;
      }
      return lead;
    });
    localStorage.setItem("quick_holidays_client_leads", JSON.stringify(updated));
    setLeads(updated);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    const updated = leads.map((lead) => {
      if (lead.id === selectedLead.id) {
        const updatedLead = {
          ...lead,
          notes: lead.notes ? `${lead.notes}\n- ${newNote}` : newNote,
        };
        setSelectedLead(updatedLead);
        return updatedLead;
      }
      return lead;
    });
    localStorage.setItem("quick_holidays_client_leads", JSON.stringify(updated));
    setLeads(updated);
    setNewNote("");
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();

    const newLead: ClientLead = {
      id: `lead-${Date.now()}`,
      name,
      email,
      phone,
      destination,
      nationality,
      status: "new",
      created_at: new Date().toLocaleString(),
      notes: "Account created manually by agent.",
    };

    const updated = [newLead, ...leads];
    localStorage.setItem("quick_holidays_client_leads", JSON.stringify(updated));
    setLeads(updated);

    // Reset Form
    setName("");
    setEmail("");
    setPhone("");
    setNationality("");
    setDestination("Italy");
    setShowAddLead(false);
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
            <span className="bg-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-wider rounded-md px-2 py-0.5 border border-amber-500/20">
              Agent Portal
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span className="hidden sm:inline text-sm text-slate-300">
              Welcome, <strong className="text-white font-bold">{agentName}</strong>
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
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Client Leads Table */}
        <div className="lg:col-span-8 bg-white border border-brand-gold/15 rounded-3xl p-6 shadow-sm text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-navy">Client Leads Portfolio</h2>
              <p className="text-xs text-slate-500 mt-1">Review new consultation enquiries and coordinate with customers.</p>
            </div>
            
            <button
              onClick={() => setShowAddLead(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy px-5 py-2.5 text-xs font-bold text-white transition-all duration-200 cursor-pointer shadow-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Booking
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-sm text-slate-500 font-medium">No client leads available.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="pb-3 text-left">Client</th>
                    <th className="pb-3 text-left">Destination</th>
                    <th className="pb-3 text-left">Created At</th>
                    <th className="pb-3 text-left">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                        selectedLead?.id === lead.id ? "bg-brand-cream/40 font-semibold" : ""
                      }`}
                    >
                      <td className="py-4 text-left">
                        <div className="font-bold text-brand-navy">{lead.name}</div>
                        <div className="text-xs text-slate-500 font-normal">{lead.email}</div>
                      </td>
                      <td className="py-4 text-left">
                        <span className="font-medium text-slate-700">{lead.destination}</span>
                        <div className="text-[10px] text-slate-400 font-normal">{lead.nationality}</div>
                      </td>
                      <td className="py-4 text-left text-slate-400 text-xs">{lead.created_at.split(",")[0]}</td>
                      <td className="py-4 text-left">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold border ${
                          lead.status === "new"
                            ? "bg-purple-50 text-purple-700 border-purple-100"
                            : lead.status === "contacted"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : lead.status === "document_pending"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : lead.status === "processing"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-green-50 text-green-700 border-green-100"
                        }`}>
                          {lead.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="text-brand-gold hover:text-brand-navy text-xs font-bold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Lead Action Centre */}
        <div className="lg:col-span-4 space-y-6">
          
          {selectedLead ? (
            <div className="bg-white border border-brand-gold/15 rounded-3xl p-6 shadow-sm text-left">
              <h3 className="font-serif text-lg font-bold text-brand-navy mb-4 border-b border-slate-100 pb-2">
                Lead Action Centre
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                  <p className="font-bold text-brand-navy mt-0.5">{selectedLead.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone</span>
                    <p className="text-slate-700 mt-0.5">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nationality</span>
                    <p className="text-slate-700 mt-0.5">{selectedLead.nationality}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Destination</span>
                    <p className="text-slate-700 mt-0.5">{selectedLead.destination}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Case ID</span>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedLead.id}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Change Lead Status</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "contacted", label: "Contacted" },
                      { id: "document_pending", label: "Docs Pending" },
                      { id: "processing", label: "Send to Process" },
                      { id: "completed", label: "Complete Case" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => handleUpdateStatus(selectedLead.id, btn.id as any)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer border transition-colors ${
                          selectedLead.status === btn.id
                            ? "bg-brand-gold text-brand-navy border-brand-gold"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-brand-gold"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes Block */}
                <div className="border-t border-slate-100 pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Case History Notes</span>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 mt-1 max-h-36 overflow-y-auto whitespace-pre-line font-mono">
                    {selectedLead.notes || "No log entries yet."}
                  </div>

                  <form onSubmit={handleAddNote} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Add case update note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="grow rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-gold focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-brand-gold/15 rounded-3xl p-8 shadow-sm text-center">
              <p className="text-slate-400 text-sm font-medium">Select a client lead from the list to update status and add notes.</p>
            </div>
          )}

          {/* Add Lead Manual Booking Modal */}
          {showAddLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-xs p-4">
              <div className="bg-brand-cream border border-brand-gold/20 rounded-[32px] max-w-md w-full p-8 shadow-2xl relative text-left">
                <button
                  onClick={() => setShowAddLead(false)}
                  className="absolute right-6 top-6 text-slate-500 hover:text-brand-navy transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h3 className="font-serif text-xl font-bold text-brand-navy mb-1">New Booking Request</h3>
                <p className="text-xs text-slate-500 mb-6">Manually record a telephone or in-office consultation lead.</p>

                <form onSubmit={handleCreateLead} className="space-y-4">
                  <div>
                    <label htmlFor="lead-name" className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1.5">Client Name</label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rachel Green"
                      className="w-full rounded-xl border border-brand-gold/30 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-email" className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rachel@example.com"
                      className="w-full rounded-xl border border-brand-gold/30 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +447000111222"
                      className="w-full rounded-xl border border-brand-gold/30 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lead-dest" className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1.5">Destination</label>
                      <select
                        id="lead-dest"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full rounded-xl border border-brand-gold/30 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      >
                        {["Italy", "France", "Spain", "Germany", "Greece", "Switzerland", "Portugal", "Netherlands"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="lead-nat" className="block text-[10px] font-bold text-brand-navy uppercase tracking-wider mb-1.5">Nationality</label>
                      <input
                        id="lead-nat"
                        type="text"
                        required
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="e.g. British"
                        className="w-full rounded-xl border border-brand-gold/30 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy px-6 py-2.5 text-xs font-bold text-white transition-all duration-300 mt-2 shadow-xs cursor-pointer"
                  >
                    Create Lead Entry
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
