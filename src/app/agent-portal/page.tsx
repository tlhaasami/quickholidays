"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ThemeButton } from "@/components/ThemeButton";
import { visaSections } from "@/constants/visaFields";
import { coverLetterSections, COVER_LETTER_SYSTEM_PROMPT } from "@/constants/coverLetterFields";
import { generateMasterCoverLetterText, exportCoverLetterPDF, downloadCoverLetterDocx, sanitizeTextForATS, downloadLaTeXCode } from "@/utils/coverLetterGenerator";
import { downloadVisaDoc, exportVisaDocPDF } from "@/utils/visaDocGenerator";
import Link from "next/link";

interface Conversation {
  id: string;
  timestamp: number;
  agentUsername: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  parsedData: Record<string, string>;
  missingFields: string[];
  assistantMsg: string;
}

export function getDynamicCriticalFields(data: Record<string, string>): string[] {
  const list = [
    "personal_surname",
    "personal_first_names",
    "personal_dob",
    "passport_number",
    "passport_issue_date",
    "passport_expiry_date",
    "travel_destinations",
    "travel_start_date",
    "travel_return_date",
    "address_street",
    "address_postal_code",
    "address_city",
    "address_country",
    "address_phone",
    "address_email"
  ];

  // If UK Residency is BRP/visa (not citizen), uk_share_code is required
  const nationality = (data.personal_nationality || "").toLowerCase();
  const isUKCitizen = nationality.includes("british") || nationality.includes("united kingdom") || nationality.includes("uk");
  if (!isUKCitizen) {
    list.push("uk_share_code");
  }

  // Check employment status
  const occupation = (data.emp_occupation || "").toLowerCase();
  const hasEmployer = !!data.emp_employer_name || !!data.emp_job_title;
  const isEmployed = occupation && !occupation.includes("student") && !occupation.includes("unemployed") && !occupation.includes("child") && !occupation.includes("minor") && !occupation.includes("retired");
  
  if (isEmployed || hasEmployer) {
    list.push("emp_employer_name", "emp_job_title", "emp_street", "emp_postal_code", "emp_city", "emp_country");
  } else if (occupation.includes("student") || !!data.emp_school_name) {
    list.push("emp_school_name", "emp_street", "emp_postal_code", "emp_city", "emp_country");
  }

  // Check if minor
  const dobStr = data.personal_dob;
  if (dobStr) {
    try {
      const dob = new Date(dobStr);
      const ageDiff = Date.now() - dob.getTime();
      const age = ageDiff / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) {
        list.push("minor_relation", "minor_surname", "minor_first_name", "minor_dob", "minor_nationality");
      }
    } catch (e) {}
  }

  return list;
}

// Initialize default lead with all visa form fields set to empty strings
const DEFAULT_LEAD: Record<string, string> = {};
visaSections.forEach(sec => {
  sec.fields.forEach(field => {
    DEFAULT_LEAD[field.id] = "";
  });
});

export default function AgentPortal() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [agentUsername, setAgentUsername] = useState<string>("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  // Resize / Collapse panel widths
  const [leftWidth, setLeftWidth] = useState(320);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightWidth, setRightWidth] = useState(384);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("storage"));
  };
  
  const [formEntries, setFormEntries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"convos" | "entries">("convos");
  
  // Input / Chat controls
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailToInput, setEmailToInput] = useState("");
  const [fieldFilter, setFieldFilter] = useState<"all" | "filled" | "missing">("all");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalStep, setApprovalStep] = useState<"preview" | "email">("preview");

  // Admin Account controls
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminAccounts, setAdminAccounts] = useState<Record<string, { password: string; suspended: boolean }>>({});
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adminError, setAdminError] = useState<string | null>(null);

  // Temporary editing state for form fields
  const [tempParsedData, setTempParsedData] = useState<Record<string, string>>({});
  
  // Custom toast notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Active Workspace Mode inside Portal: "visaDoc" (Visa Application Workspace) | "coverLetter" (Visa Cover Letter Workspace)
  const [portalWorkspaceMode, setPortalWorkspaceMode] = useState<"visaDoc" | "coverLetter">("visaDoc");
  const [embeddedCoverLetterText, setEmbeddedCoverLetterText] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLetterText, setCopiedLetterText] = useState(false);
  const [coverLetterAiInput, setCoverLetterAiInput] = useState("");
  const [isAiParsingCoverLetter, setIsAiParsingCoverLetter] = useState(false);
  const [showCoverLetterPreviewModal, setShowCoverLetterPreviewModal] = useState(false);
  const [coverLetterMessages, setCoverLetterMessages] = useState<
    Array<{
      role: "user" | "assistant";
      content: string;
      missingFields?: string[];
    }>
  >([
    {
      role: "assistant",
      content: "Hello! I am your AI Cover Letter Parser Assistant. Paste any client notes, passport details, travel dates, or share code text below to extract data and build the official Schengen cover letter."
    }
  ]);

  const handleParseCoverLetterWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputText = coverLetterAiInput.trim();
    if (!inputText || isAiParsingCoverLetter) return;

    // Add User Input to Conversation Stream
    const userMsg = { role: "user" as const, content: inputText };
    setCoverLetterMessages(prev => [...prev, userMsg]);
    setCoverLetterAiInput("");
    setIsAiParsingCoverLetter(true);

    try {
      const res = await fetch("/api/agent/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          history: coverLetterMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) throw new Error("AI parser API call failed");

      const resData = await res.json();
      const extractedData = resData.data || {};
      const missingList = resData.missingFields || [];
      const aiMessageText = resData.message || "Processed applicant details.";

      const updated = { ...tempParsedData };

      // Comprehensive Bidirectional Field Mapping
      if (extractedData.full_name) {
        updated.full_name = extractedData.full_name;
      }
      if (extractedData.personal_surname || extractedData.personal_first_names) {
        const fn = extractedData.personal_first_names || "";
        const sn = extractedData.personal_surname || "";
        updated.full_name = `${fn} ${sn}`.trim() || updated.full_name;
        updated.personal_surname = sn;
        updated.personal_first_names = fn;
      }

      if (extractedData.passport_number) {
        updated.passport_number = extractedData.passport_number;
        updated.passport_no = extractedData.passport_number;
      }

      if (extractedData.personal_nationality || extractedData.nationality) {
        const nat = extractedData.personal_nationality || extractedData.nationality;
        updated.nationality = nat;
        updated.personal_nationality = nat;
      }

      if (extractedData.address_street || extractedData.uk_address) {
        const addr = extractedData.uk_address || [extractedData.address_street, extractedData.address_city, extractedData.address_postal_code, extractedData.address_country].filter(Boolean).join(", ");
        updated.uk_address = addr;
        updated.address_street = extractedData.address_street || addr;
      }

      if (extractedData.address_phone || extractedData.phone_number || extractedData.address_mobile) {
        const ph = extractedData.address_phone || extractedData.phone_number || extractedData.address_mobile;
        updated.phone_number = ph;
        updated.address_phone = ph;
      }

      if (extractedData.address_email || extractedData.email_address) {
        const em = extractedData.address_email || extractedData.email_address;
        updated.email_address = em;
        updated.address_email = em;
      }

      if (extractedData.uk_share_code || extractedData.residence_share_code) {
        const sc = extractedData.uk_share_code || extractedData.residence_share_code;
        updated.uk_share_code = sc;
        updated.residence_share_code = sc;
      }
      if (extractedData.uk_share_code_expiry || extractedData.share_code_expiry || extractedData.residence_permit_expiry) {
        const sce = extractedData.uk_share_code_expiry || extractedData.share_code_expiry || extractedData.residence_permit_expiry;
        updated.share_code_expiry = sce;
        updated.uk_share_code_expiry = sce;
      }

      if (extractedData.travel_destinations || extractedData.destination_country) {
        const dest = extractedData.destination_country || extractedData.travel_destinations;
        updated.destination_country = dest;
        updated.travel_destinations = dest;
        updated.target_embassy = extractedData.target_embassy || `Embassy of ${dest}`;
      }

      if (extractedData.travel_start_date || extractedData.trip_start_date) {
        const sd = extractedData.travel_start_date || extractedData.trip_start_date;
        updated.trip_start_date = sd;
        updated.travel_start_date = sd;
      }
      if (extractedData.travel_return_date || extractedData.trip_end_date) {
        const ed = extractedData.travel_return_date || extractedData.trip_end_date;
        updated.trip_end_date = ed;
        updated.travel_return_date = ed;
      }

      if (extractedData.emp_employer_name || extractedData.institution_or_employer) {
        const emp = extractedData.emp_employer_name || extractedData.institution_or_employer;
        updated.institution_or_employer = emp;
        updated.emp_employer_name = emp;
      }
      if (extractedData.emp_job_title || extractedData.job_title_or_degree || extractedData.emp_occupation) {
        const jt = extractedData.emp_job_title || extractedData.job_title_or_degree || extractedData.emp_occupation;
        updated.job_title_or_degree = jt;
        updated.emp_job_title = jt;
      }

      if (extractedData.acc_hotel_name || extractedData.hotel_booking_details) {
        const h = extractedData.hotel_booking_details || [extractedData.acc_hotel_name, extractedData.acc_city, extractedData.acc_country].filter(Boolean).join(", ");
        updated.hotel_booking_details = h;
        updated.acc_hotel_name = extractedData.acc_hotel_name || h;
      }

      if (extractedData.finance_costs_covered || extractedData.bank_summary) {
        const bs = extractedData.bank_summary || extractedData.finance_costs_covered;
        updated.bank_summary = bs;
      }

      Object.keys(extractedData).forEach(k => {
        if (extractedData[k] && !updated[k]) {
          updated[k] = String(extractedData[k]);
        }
      });

      setTempParsedData(updated);
      const generated = generateMasterCoverLetterText(updated);
      setEmbeddedCoverLetterText(generated);

      // Append Assistant Message to Conversation Stream
      const aiMsg = {
        role: "assistant" as const,
        content: aiMessageText,
        missingFields: missingList
      };
      setCoverLetterMessages(prev => [...prev, aiMsg]);
      showToast("Parsed text & updated Cover Letter data!");
    } catch (err) {
      console.error(err);
      setCoverLetterMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error: Failed to process notes. Please check connection and try again." }
      ]);
      showToast("Failed to parse notes with AI.", "error");
    } finally {
      setIsAiParsingCoverLetter(false);
    }
  };

  const handleNewCoverLetterSession = () => {
    setTempParsedData({});
    setEmbeddedCoverLetterText("");
    setCoverLetterAiInput("");
    setCoverLetterMessages([
      {
        role: "assistant",
        content: "Hello! I am your AI Cover Letter Parser Assistant. Paste any client notes, passport details, travel dates, or share code text below to extract data and build the official Schengen cover letter."
      }
    ]);
    showToast("Started new blank Cover Letter session.");
  };

  // Agent Access Code controls
  const [showChangeCodeModal, setShowChangeCodeModal] = useState(false);
  const [oldAgentCode, setOldAgentCode] = useState("");
  const [newAgentCode, setNewAgentCode] = useState("");
  const [confirmAgentCode, setConfirmAgentCode] = useState("");
  const [changeCodeError, setChangeCodeError] = useState<string | null>(null);

  const handleChangeAccessCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeCodeError(null);

    if (newAgentCode !== confirmAgentCode) {
      setChangeCodeError("New access codes do not match.");
      return;
    }

    if (newAgentCode.length < 6) {
      setChangeCodeError("Access code must be at least 6 characters long.");
      return;
    }

    try {
      const res = await fetch("/api/agent/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          username: agentUsername,
          oldPassword: oldAgentCode,
          newPassword: newAgentCode
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setChangeCodeError(data.error || "Failed to update access code.");
        return;
      }

      showToast(data.message || "Access code updated server-wide across all production sessions!");
      setShowChangeCodeModal(false);
      setOldAgentCode("");
      setNewAgentCode("");
      setConfirmAgentCode("");
    } catch (err) {
      console.error(err);
      setChangeCodeError("Server error while updating access code.");
    }
  };

  // Missing details export validation modal state
  const [missingValidationModal, setMissingValidationModal] = useState<{
    show: boolean;
    missingFieldsList: string[];
    exportType: "visaDoc" | "visaPdf" | "coverDoc" | "coverPdf";
  } | null>(null);

  const executeExportFormat = (type: "visaDoc" | "visaPdf" | "coverDoc" | "coverPdf") => {
    const surname = tempParsedData.personal_surname || tempParsedData.full_name || "Applicant";
    if (type === "visaDoc") {
      if (activeConvo) downloadWordDoc(activeConvo);
      else downloadVisaDoc(tempParsedData, `Schengen_Visa_Draft_${surname}`);
      showToast("Downloaded Visa Application (.DOC)");
    } else if (type === "visaPdf") {
      exportVisaDocPDF(tempParsedData, `Schengen_Visa_Application_${surname}`);
      showToast("Generating Visa Application (PDF)...");
    } else if (type === "coverDoc") {
      const letterText = generateMasterCoverLetterText(tempParsedData);
      downloadCoverLetterDocx(letterText, `${surname}_Schengen_Cover_Letter`);
      showToast("Downloaded Cover Letter (.DOC)");
    } else if (type === "coverPdf") {
      const letterText = generateMasterCoverLetterText(tempParsedData);
      exportCoverLetterPDF(letterText, `${surname}_Schengen_Cover_Letter`);
      showToast("Generating ATS Cover Letter (PDF)...");
    }
  };

  const handleExportWithValidation = (type: "visaDoc" | "visaPdf" | "coverDoc" | "coverPdf") => {
    const missing: string[] = [];
    if (!tempParsedData.personal_surname && !tempParsedData.full_name) missing.push("Applicant Surname / Full Name");
    if (!tempParsedData.passport_number && !tempParsedData.passport_no) missing.push("Passport Number");
    if (!tempParsedData.travel_destinations && !tempParsedData.destination_country) missing.push("Destination Country");
    if (!tempParsedData.travel_start_date && !tempParsedData.trip_start_date) missing.push("Travel Start Date");
    if (!tempParsedData.address_email && !tempParsedData.email_address) missing.push("Applicant Email Address");

    if (missing.length > 0) {
      setMissingValidationModal({
        show: true,
        missingFieldsList: missing,
        exportType: type
      });
    } else {
      executeExportFormat(type);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Drag resizer handlers
  const handleLeftMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startWidth = leftWidth;
    const startX = e.clientX;
    
    const doDrag = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(200, Math.min(500, startWidth + (moveEvent.clientX - startX)));
      setLeftWidth(newWidth);
    };
    
    const stopDrag = () => {
      window.removeEventListener("mousemove", doDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
    
    window.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  const handleRightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startWidth = rightWidth;
    const startX = e.clientX;
    
    const doDrag = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(280, Math.min(600, startWidth - (moveEvent.clientX - startX)));
      setRightWidth(newWidth);
    };
    
    const stopDrag = () => {
      window.removeEventListener("mousemove", doDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
    
    window.addEventListener("mousemove", doDrag);
    window.addEventListener("mouseup", stopDrag);
  };

  // Trigger Toast Notification helper
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ message: msg, type });
  };

  const fetchFormEntries = async () => {
    try {
      const res = await fetch("/api/submit-lead");
      if (res.ok) {
        const data = await res.json();
        setFormEntries(data.leads || []);
      }
    } catch (err) {
      console.error("Failed to load form entries:", err);
    }
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Auth Guard & Caching cleanup on mount
  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem("qh-agent-session");
    if (session !== "authenticated") {
      router.push("/login");
      return;
    }

    // Load logged-in agent username
    const storedUsername = localStorage.getItem("qh-agent-username") || "agent";
    setAgentUsername(storedUsername);

    // Load active theme
    const theme = localStorage.getItem("theme");
    const docHasDark = document.documentElement.classList.contains("dark");
    setIsDark(theme === "dark" || (theme === null && docHasDark));

    // Load dynamic accounts list for admin preview and sync from server
    const accounts = localStorage.getItem("qh-agent-accounts");
    if (accounts) {
      setAdminAccounts(JSON.parse(accounts));
    }

    const syncAccounts = async () => {
      try {
        const res = await fetch("/api/agent/auth");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.fullAccounts) {
            setAdminAccounts(data.fullAccounts);
            localStorage.setItem("qh-agent-accounts", JSON.stringify(data.fullAccounts));
          }
        }
      } catch (err) {
        console.error("Failed to sync accounts from server:", err);
      }
    };
    syncAccounts();

    // Load active histories from cache
    const stored = localStorage.getItem("qh-conversations");
    if (stored) {
      try {
        const parsedList: Conversation[] = JSON.parse(stored);
        const now = Date.now();
        // Keep only conversations younger than 1 day (86,400,000 milliseconds)
        const validList = parsedList.filter(
          (c) => now - c.timestamp < 86400000
        );

        // Update local storage if any expired ones were dropped
        if (validList.length !== parsedList.length) {
          localStorage.setItem("qh-conversations", JSON.stringify(validList));
        }

        setConversations(validList);
        if (validList.length > 0) {
          setActiveConvoId(validList[0].id);
        }
      } catch (err) {
        console.error("Failed to parse cached conversations:", err);
      }
    }

    fetchFormEntries();
  }, [router]);

  const activeConvo = conversations.find((c) => c.id === activeConvoId);

  // Synchronize temporary parsed data buffer
  useEffect(() => {
    if (activeConvo) {
      setTempParsedData({ ...activeConvo.parsedData });
    } else {
      setTempParsedData({});
    }
  }, [activeConvoId, conversations]);

  const hasUnsavedChanges = activeConvo && JSON.stringify(tempParsedData) !== JSON.stringify(activeConvo.parsedData);

  const handleSaveChanges = () => {
    if (!activeConvo) return;
    const newMissing: string[] = [];
    const dynamicCritical = getDynamicCriticalFields(tempParsedData);
    dynamicCritical.forEach(fId => {
      if (!tempParsedData[fId]) {
        newMissing.push(fId);
      }
    });

    const listCopy = conversations.map(c => {
      if (c.id === activeConvo.id) {
        return {
          ...c,
          parsedData: tempParsedData,
          missingFields: newMissing
        };
      }
      return c;
    });

    saveConversations(listCopy);
    showToast("Changes to visa form fields saved successfully.");
  };

  // Admin Management handlers
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = newUsername.trim().toLowerCase();
    const cleanPass = newPassword.trim();

    if (!cleanUser || !cleanPass) {
      setAdminError("Please fill out both fields.");
      return;
    }

    if (cleanUser.length < 3) {
      setAdminError("Username must be at least 3 characters long.");
      return;
    }

    // Check if exists
    if (adminAccounts[cleanUser]) {
      setAdminError("Account username already exists.");
      return;
    }

    try {
      const res = await fetch("/api/agent/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_account", targetUser: cleanUser, newPassword: cleanPass })
      });
      if (!res.ok) {
        const errData = await res.json();
        setAdminError(errData.error || "Failed to create account on server.");
        return;
      }
    } catch (err) {
      setAdminError("Failed to communicate with server auth service.");
      return;
    }

    const updated = {
      ...adminAccounts,
      [cleanUser]: { password: cleanPass, suspended: false, role: "agent" }
    };
    setAdminAccounts(updated);
    localStorage.setItem("qh-agent-accounts", JSON.stringify(updated));
    setNewUsername("");
    setNewPassword("");
    setAdminError(null);
    showToast(`Account "${cleanUser}" created successfully.`);
  };

  const handleToggleSuspendAccount = async (user: string) => {
    const isCurrentlySuspended = adminAccounts[user].suspended;
    const nextSuspended = !isCurrentlySuspended;

    try {
      const res = await fetch("/api/agent/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_suspend", targetUser: user, suspendState: nextSuspended })
      });
      if (!res.ok) {
        showToast("Failed to update suspension on server.", "error");
        return;
      }
    } catch (err) {
      showToast("Failed to communicate with server auth service.", "error");
      return;
    }

    const updated = {
      ...adminAccounts,
      [user]: { ...adminAccounts[user], suspended: nextSuspended }
    };
    setAdminAccounts(updated);
    localStorage.setItem("qh-agent-accounts", JSON.stringify(updated));

    if (nextSuspended) {
      localStorage.setItem(`qh-suspended-${user}`, "true");
      showToast(`Account "${user}" has been suspended.`);
    } else {
      localStorage.removeItem(`qh-suspended-${user}`);
      localStorage.removeItem(`qh-attempts-${user}`);
      showToast(`Account "${user}" has been activated.`);
    }
  };

  const handleDeleteAccount = async (user: string) => {
    if (user === "admin" || user === "owner") {
      showToast("Cannot delete system administration accounts.", "error");
      return; // Safety check
    }

    const confirmationCode = `${user}-delete`;
    const userInput = window.prompt(`WARNING: This will permanently delete the agent profile "@${user}".\nTo confirm, please type: ${confirmationCode}`);
    
    if (userInput !== confirmationCode) {
      showToast("Deletion cancelled: Confirmation mismatch.", "error");
      return;
    }

    try {
      const res = await fetch("/api/agent/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_account", targetUser: user })
      });
      if (!res.ok) {
        showToast("Failed to delete account on server.", "error");
        return;
      }
    } catch (err) {
      showToast("Failed to communicate with server auth service.", "error");
      return;
    }

    const updated = { ...adminAccounts };
    delete updated[user];

    setAdminAccounts(updated);
    localStorage.setItem("qh-agent-accounts", JSON.stringify(updated));
    localStorage.removeItem(`qh-suspended-${user}`);
    localStorage.removeItem(`qh-attempts-${user}`);
    showToast(`Account "${user}" has been removed.`);
  };

  // Save changes to localStorage
  const saveConversations = (list: Conversation[]) => {
    setConversations(list);
    localStorage.setItem("qh-conversations", JSON.stringify(list));
  };

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvoId, conversations, isSubmitting]);



  // New Convo trigger
  const handleNewConvo = () => {
    const newId = `convo_${Date.now()}`;
    
    // Copy all critical fields to missing list initially
    const missing: string[] = getDynamicCriticalFields(DEFAULT_LEAD);

    const newConvo: Conversation = {
      id: newId,
      timestamp: Date.now(),
      agentUsername,
      messages: [
        {
          role: "assistant",
          content: `Hello ${agentUsername}. Please paste the client's passport details, flight bookings, or personal declarations. I will structure them into the official Schengen Visa Application Form fields.`
        }
      ],
      parsedData: { ...DEFAULT_LEAD },
      missingFields: missing,
      assistantMsg: "Paste client details to begin."
    };

    const updated = [newConvo, ...conversations];
    saveConversations(updated);
    setActiveConvoId(newId);
    setInputText("");
  };

  // Delete Convo trigger
  const handleDeleteConvo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== id);
    saveConversations(updated);
    
    if (activeConvoId === id) {
      if (updated.length > 0) {
        setActiveConvoId(updated[0].id);
      } else {
        setActiveConvoId(null);
      }
    }
    showToast("Conversation deleted successfully.");
  };

  const handleLoadFormEntry = (entry: any) => {
    const payload = entry.payload;
    const newId = `convo_${Date.now()}`;
    
    const parsedData = { ...DEFAULT_LEAD };
    
    // Attempt name split
    const nameParts = (payload.name || "").trim().split(/\s+/);
    if (nameParts.length > 1) {
      parsedData.personal_surname = nameParts.pop() || "";
      parsedData.personal_first_names = nameParts.join(" ");
    } else {
      parsedData.personal_first_names = payload.name || "";
    }
    
    parsedData.personal_nationality = payload.nationality || "";
    parsedData.travel_destinations = payload.destination || "";
    parsedData.address_phone = payload.phone || "";
    parsedData.address_email = payload.email || "";
    parsedData.travel_purpose = "TOURISM";

    // Calculate initial missing fields validation
    const missing: string[] = [];
    const dynamicCritical = getDynamicCriticalFields(parsedData);
    dynamicCritical.forEach(field => {
      if (!parsedData[field]) {
        missing.push(field);
      }
    });

    const newConvo: Conversation = {
      id: newId,
      timestamp: Date.now(),
      agentUsername,
      messages: [
        {
          role: "assistant",
          content: `Loaded client details submitted by ${payload.name || "Client"} via contact form. Review or edit the Schengen Visa Application Form fields on the right.`
        }
      ],
      parsedData,
      missingFields: missing,
      assistantMsg: "Loaded lead from contact form."
    };

    const updated = [newConvo, ...conversations];
    saveConversations(updated);
    setActiveConvoId(newId);
    setActiveTab("convos"); // Switch tab back to active conversation list
    setInputText("");
    showToast("Form entry loaded into visa application form workspace.");
  };

  // Send message for parsing
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    let currentConvoId = activeConvoId;
    let listCopy = [...conversations];
    
    if (!currentConvoId) {
      const newId = `convo_${Date.now()}`;
      const newConvo: Conversation = {
        id: newId,
        timestamp: Date.now(),
        agentUsername,
        messages: [],
        parsedData: { ...DEFAULT_LEAD },
        missingFields: getDynamicCriticalFields(DEFAULT_LEAD),
        assistantMsg: ""
      };
      listCopy = [newConvo];
      currentConvoId = newId;
    }

    const currentConvo = listCopy.find((c) => c.id === currentConvoId);
    if (!currentConvo) return;

    const userMsgText = inputText;
    setInputText("");
    setIsSubmitting(true);

    currentConvo.messages.push({ role: "user", content: userMsgText });
    currentConvo.timestamp = Date.now();
    saveConversations(listCopy);
    setActiveConvoId(currentConvoId);

    try {
      const response = await fetch("/api/agent/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userMsgText,
          history: currentConvo.messages.slice(0, -1)
        })
      });

      if (!response.ok) {
        throw new Error("Parser API failed");
      }

      const resData = await response.json();

      // Merge newly parsed fields
      const updatedData = { ...currentConvo.parsedData };
      if (resData.data) {
        Object.keys(resData.data).forEach(key => {
          if (resData.data[key] !== null && resData.data[key] !== undefined) {
            updatedData[key] = String(resData.data[key]);
          }
        });
      }

      currentConvo.messages.push({ role: "assistant", content: resData.message });
      currentConvo.parsedData = updatedData;
      currentConvo.missingFields = resData.missingFields ?? [];
      currentConvo.assistantMsg = resData.message;

      saveConversations(listCopy);

      // Immediately sync the edit buffer so the right panel fields populate
      setTempParsedData({ ...updatedData });

      // Switch filter to "filled" so agent sees newly extracted values at a glance
      setFieldFilter("filled");
    } catch (err) {
      console.error(err);
      currentConvo.messages.push({
        role: "assistant",
        content: "Error parsing visa details. Please double-check your credentials and connection."
      });
      saveConversations(listCopy);
      showToast("Parser error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign out agent
  const handleSignOut = () => {
    localStorage.removeItem("qh-agent-session");
    localStorage.removeItem("qh-agent-username");
    localStorage.removeItem("qh-agent-session-time");
    router.push("/login");
  };

  const LOGO_BASE64 = "data:image/png;base64,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";

  const generateWordDocContent = (convo: Conversation) => {
    const agentName = (convo.agentUsername || agentUsername || '').toUpperCase();

    const TH = 'style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FAFAFA; font-weight: bold; width: 35%; font-family: Arial, sans-serif; color: #0F2148; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word;"';
    const TD = 'style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FFFFFF; width: 65%; font-family: Arial, sans-serif; color: #0F2148; word-wrap: break-word; word-break: break-all; overflow-wrap: break-word;"';
    const TABLE_ATTRS = 'border="1" cellspacing="0" cellpadding="8" style="width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; margin-bottom: 15px; border: 1px solid #000000;"';
    const WARNING = '<p style="color: #FF0000; font-size: 9.5pt; font-family: Arial, sans-serif; margin-top: 22px; margin-bottom: 4px; text-align: left; font-weight: bold;">&#9888; Warning: <span style="font-weight: normal;">The company holds no responsibility for errors. Check form carefully before submitting.</span></p>';
    const makeH2 = (title: string) => '<h2 style="color: #5B9BD5; font-size: 14pt; margin-top: 0px; margin-bottom: 8px; font-weight: bold; font-family: Arial, sans-serif; text-align: left;">' + title + '</h2>';
    const makeSubHeader = (label: string) => '<tr><td colspan="2" style="background-color: #FAFAFA; font-weight: bold; text-align: center; font-size: 10.5pt; border: 1px solid #000000; padding: 6px 10px; font-family: Arial, sans-serif; color: #0F2148;">' + label + '</td></tr>';

    const surname = convo.parsedData.personal_surname || 'Applicant';

    let html = [
      '<html xmlns:o=\'urn:schemas-microsoft-com:office:office\' xmlns:w=\'urn:schemas-microsoft-com:office:word\' xmlns:v=\'urn:schemas-microsoft-com:vml\' xmlns=\'http://www.w3.org/TR/REC-html40\'>',
      '<head>',
      '<meta charset="utf-8">',
      '<title>Schengen Visa Draft Form - ' + surname + '</title>',
      '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->',
      '<style>',
      '@page Section1 { size: 8.5in 11.0in; margin: 1.0in 1.5in 1.0in 1.5in; mso-header-margin: .5in; mso-footer-margin: .5in; mso-header: h1; }',
      'div.Section1 { page: Section1; }',
      'body { font-family: Arial, sans-serif; color: #0F2148; line-height: 1.4; }',
      'h1 { text-align: center; margin-bottom: 2px; }',
      '.subtitle { color: #1F497D; font-size: 16pt; text-align: center; font-weight: bold; margin-bottom: 20px; }',
      'h2 { color: #5B9BD5; font-size: 14pt; margin-top: 20px; margin-bottom: 8px; font-weight: bold; }',
      'table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; margin-bottom: 15px; border: 1px solid #000000; }',
      'th, td { word-wrap: break-word; word-break: break-all; overflow-wrap: break-word; }',
      '</style>',
      '</head>',
      '<body>',
      '<div class="Section1">',
      '<div style="mso-element:header" id="h1"><p class="MsoHeader" style="text-align:left;line-height:normal;margin:0;"></p></div>',
      '<div style="text-align: center; margin-bottom: 8px;">' +
      '<img src="' + LOGO_BASE64 + '" alt="Quick Holidays Logo" style="height: 60px; width: auto; object-fit: contain; display: inline-block;" />' +
      '</div>',
      '<h1 style="text-align: center; margin-top: 0; margin-bottom: 2px;">',
      '<span style="color: #E36C0A; font-family: Arial Black, sans-serif; font-weight: 900; font-size: 26pt;">QUICK</span>',
      '<span style="color: #1F497D; font-family: Arial Black, sans-serif; font-weight: 900; font-size: 26pt;"> HOLIDAYS</span>',
      '</h1>',
      '<div class="subtitle">Future Vision Organization Limited</div>',
      '<div style="font-family: Arial, sans-serif; font-size: 10pt; color: #0F2148; line-height: 1.45; margin-bottom: 15px; text-align: left;">',
      'Please fill in <strong>CLEAR BLOCK CAPITAL LETTERS</strong>.<br>',
      'The details you provide will be used to complete the online application form.<br>',
      'Any mistakes, faint or unclear writing may cause errors in your application.<br>',
      'It is <strong>your responsibility</strong> to provide correct and readable information.<br>',
      '<span style="color: #FF0000;">In case of any errors on the visa draft form, the <strong>company will not be held responsible</strong>. Please carefully <strong>re-check your form</strong> before submitting.</span>',
      '</div>',
      '<table border="1" cellspacing="0" cellpadding="8" style="width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 5px; margin-bottom: 20px; border: 1px solid #000000;">',
      '<tr>',
      '<th style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FAFAFA; font-weight: bold; width: 35%; font-family: Arial, sans-serif; color: #0F2148;">Agent Name</th>',
      '<td style="border: 1px solid #000000; padding: 8px 10px; text-align: left; font-size: 10pt; background-color: #FFFFFF; width: 65%; font-family: Arial, sans-serif; color: #0F2148; font-weight: bold;">' + agentName + '</td>',
      '</tr>',
      '</table>',
    ].join('\n');

    visaSections.forEach(sec => {
      html += WARNING;
      html += makeH2(sec.title);
      html += '<table ' + TABLE_ATTRS + '>';

      if (sec.title === 'Applicant Residence Address Details') {
        html += makeSubHeader('Full Residence Address');
        sec.fields.forEach(field => {
          const val = convo.parsedData[field.id] || '';
          html += '<tr><th ' + TH + '>' + field.label + '</th><td ' + TD + '>' + val + '</td></tr>';
        });
      } else if (sec.title === 'Employment / Education Details') {
        const basicFields = sec.fields.slice(0, 4);
        const addrFields = sec.fields.slice(4);
        basicFields.forEach(field => {
          const val = convo.parsedData[field.id] || '';
          html += '<tr><th ' + TH + '>' + field.label + '</th><td ' + TD + '>' + val + '</td></tr>';
        });
        html += makeSubHeader('Employer/University/College Full Address');
        addrFields.forEach(field => {
          const val = convo.parsedData[field.id] || '';
          html += '<tr><th ' + TH + '>' + field.label + '</th><td ' + TD + '>' + val + '</td></tr>';
        });
      } else {
        sec.fields.forEach(field => {
          const val = convo.parsedData[field.id] || '';
          html += '<tr><th ' + TH + '>' + field.label + '</th><td ' + TD + '>' + val + '</td></tr>';
        });
      }

      html += '</table>';
    });

    html += [
      '<p style="color: #1F497D; font-size: 11pt; font-weight: bold; text-align: center; margin-top: 25px; margin-bottom: 20px; font-family: Arial, sans-serif;">',
      'Thank you for your cooperation and patience.',
      '</p>',
      '<div style="font-family: Arial, sans-serif; font-size: 10pt; color: #1F497D; text-align: left; margin-top: 15px; line-height: 1.5;">',
      '<strong>Contact Us</strong>',
      '<ul style="margin-top: 5px; margin-bottom: 0; padding-left: 20px; list-style-type: disc;">',
      '<li>Phone: +44 800 058 4673</li>',
      '<li>WhatsApp: +44 7428 878936</li>',
      '<li>Email: info@quickholidays.co.uk</li>',
      '</ul>',
      '</div>',
      '</div>',
      '</body>',
      '</html>',
    ].join('\n');

    return html;
  };

  const downloadWordDoc = (convo: Conversation) => {
    const htmlContent = generateWordDocContent(convo);
    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qh-visa-${convo.parsedData.personal_surname?.toLowerCase() || "unnamed"}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWordClick = () => {
    if (!activeConvo) return;
    setApprovalStep("preview");
    setShowApprovalModal(true);
  };

  if (!mounted) return null;

  return (
    <div className="h-screen flex flex-col bg-zinc-55 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300 font-sans overflow-hidden transition-colors duration-300">
      {/* Header Banner */}
      <header className="h-16 shrink-0 border-b-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center px-6 z-10 transition-colors duration-300">
        <div className="flex items-center gap-3">
          {/* Logo Prefix */}
          <img src="/logos/logo.svg" alt="Logo" className="h-8 w-8 object-contain" />
          
          <span className="font-sans text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Quick Holidays Portal
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C99537] bg-[#C99537]/15 px-2 py-0.5 border border-[#C99537]/20">
            {portalWorkspaceMode === "visaDoc" ? "Visa Application Workspace" : "Visa Cover Letter Workspace"}
          </span>

          {/* 2 Portal Tool Workspace Mode Selectors */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            <button
              onClick={() => setPortalWorkspaceMode("visaDoc")}
              className={`font-bold uppercase text-[10px] tracking-wider px-3.5 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer rounded-none border ${
                portalWorkspaceMode === "visaDoc"
                  ? "bg-[#C99537] text-zinc-950 border-[#C99537] font-extrabold shadow-[2px_2px_0_#000]"
                  : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
              }`}
            >
              📄 Visa Application Form
            </button>
            <button
              onClick={() => {
                setPortalWorkspaceMode("coverLetter");
                if (!embeddedCoverLetterText) {
                  setEmbeddedCoverLetterText(generateMasterCoverLetterText(tempParsedData));
                }
              }}
              className={`font-bold uppercase text-[10px] tracking-wider px-3.5 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer rounded-none border ${
                portalWorkspaceMode === "coverLetter"
                  ? "bg-[#C99537] text-zinc-950 border-[#C99537] font-extrabold shadow-[2px_2px_0_#000]"
                  : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
              }`}
            >
              ✉️ Visa Cover Letter
            </button>
          </div>

          {/* Dynamic Sidebar Toggle Controllers in Header Banner */}
          {agentUsername !== "admin" && agentUsername !== "owner" && (
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setLeftCollapsed(!leftCollapsed)}
                className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-none cursor-pointer no-custom-cursor"
                title={leftCollapsed ? "Expand Navigation Sidebar" : "Collapse Navigation Sidebar"}
              >
                {leftCollapsed ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"/></svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"/></svg>
                )}
              </button>

              <button
                onClick={() => setRightCollapsed(!rightCollapsed)}
                className="p-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-none cursor-pointer no-custom-cursor"
                title={rightCollapsed ? "Expand Visa Fields Sidebar" : "Collapse Visa Fields Sidebar"}
              >
                {rightCollapsed ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12.75 19.5L5.25 12l7.5-7.5m6 15l-7.5-7.5 7.5-7.5"/></svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5"/></svg>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-550 dark:text-zinc-500 block leading-none">Signed in as</span>
            <span className="text-xs font-bold text-zinc-900 dark:text-white">@{agentUsername}</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 border-2 border-zinc-200 dark:border-zinc-800 hover:border-[#C99537] text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer rounded-none no-custom-cursor bg-zinc-55 dark:bg-zinc-950"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setShowChangeCodeModal(true)}
            className="text-xs uppercase tracking-wider font-bold text-zinc-550 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer border-2 border-zinc-200 dark:border-zinc-800 px-4 py-2 hover:border-[#C99537] no-custom-cursor mr-1"
          >
            Change Access Code
          </button>

          <button
            onClick={handleSignOut}
            className="text-xs uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer border-2 border-zinc-200 dark:border-zinc-800 px-4 py-2 hover:border-[#C99537] no-custom-cursor"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {(agentUsername === "admin" || agentUsername === "owner") ? (
          /* Full Page Admin Control center workspace */
          <main className="flex-1 overflow-y-auto p-8 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-8">
              <div>
                <h2 className="font-sans text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                  <span className="text-[#C99537]">⚙</span> Administrative Control Center
                </h2>
                <p className="text-xs text-zinc-550 dark:text-zinc-450 font-light mt-1.5 leading-relaxed">
                  As Administrator, you have total access visibility. Manage logins, configure passwords/access codes directly, suspend or activate user credentials instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Create User Card */}
                <div className="lg:col-span-4 border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#111]">
                  <h3 className="font-sans text-xs uppercase font-bold text-[#C99537] tracking-wider mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    Create Agent Profile
                  </h3>
                  
                  {agentUsername === "owner" ? (
                    <div className="py-6 text-left space-y-3">
                      <div className="bg-amber-500/10 border border-amber-500/25 text-[#C99537] p-4 text-[11px] leading-relaxed font-light">
                        <strong className="block font-bold mb-1">Owner Restricted Access:</strong>
                        Profile creation is restricted for this account type. You have administrative permissions to view, suspend, delete, or modify agent access codes in the directory.
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateAccount} className="space-y-4 text-left">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                          New Username
                        </label>
                        <input
                          type="text"
                          required
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="e.g. agent2"
                          autoComplete="off"
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-xs px-3 py-2 focus:outline-none focus:border-[#C99537] transition-all rounded-none no-custom-cursor"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                          Access Code / Password
                        </label>
                        <input
                          type="text"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="e.g. pass456"
                          autoComplete="off"
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-xs px-3 py-2 focus:outline-none focus:border-[#C99537] transition-all rounded-none no-custom-cursor"
                        />
                      </div>

                      {adminError && (
                        <div className="bg-red-500/10 border border-red-500/35 text-red-500 dark:text-red-400 p-2.5 text-[10px] rounded-none">
                          ⚠️ {adminError}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-[#C99537] text-zinc-955 font-bold uppercase tracking-wider text-xs py-3 rounded-none hover:bg-[#E2B755] transition-colors cursor-pointer no-custom-cursor shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                      >
                        Add Account
                      </button>
                    </form>
                  )}
                </div>

                {/* Accounts Directory Card */}
                <div className="lg:col-span-8 border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#111]">
                  <h3 className="font-sans text-xs uppercase font-bold text-[#C99537] tracking-wider mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    Accounts Directory
                  </h3>
                  
                  <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {Object.keys(adminAccounts).map((user) => {
                      const info = adminAccounts[user];
                      const isAdmin = user === "admin";
                      return (
                        <div key={user} className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-55 dark:bg-zinc-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-zinc-900 dark:text-white">@{user}</span>
                              {isAdmin && (
                                <span className="text-[8px] bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 font-bold uppercase tracking-wider px-1">
                                  System
                                </span>
                              )}
                              {info.suspended && (
                                <span className="text-[8px] bg-amber-500/10 border border-amber-500/25 text-amber-500 font-bold uppercase tracking-wider px-1">
                                  Suspended
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-550 dark:text-zinc-400 font-sans">
                              <span>Access Code:</span>
                              <input
                                type="text"
                                value={info.password}
                                onChange={(e) => {
                                  const newCode = e.target.value;
                                  const updated = {
                                    ...adminAccounts,
                                    [user]: { ...adminAccounts[user], password: newCode }
                                  };
                                  setAdminAccounts(updated);
                                  localStorage.setItem("qh-agent-accounts", JSON.stringify(updated));
                                }}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-xs px-2.5 py-0.5 focus:outline-none focus:border-[#C99537] rounded-none w-36 ml-1 inline-block font-mono"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Toggle Suspend */}
                            {!isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleToggleSuspendAccount(user)}
                                className={`text-[9px] uppercase tracking-wider font-bold px-3 py-1.5 border transition-colors cursor-pointer no-custom-cursor ${
                                  info.suspended
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                                    : "bg-amber-500/10 border-amber-500/30 text-amber-650 dark:text-amber-500 hover:bg-amber-500/20"
                                }`}
                              >
                                {info.suspended ? "Activate" : "Suspend"}
                              </button>
                            )}

                            {/* Delete */}
                            {!isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleDeleteAccount(user)}
                                className="text-[9px] uppercase tracking-wider font-bold px-3 py-1.5 border border-red-500/35 bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer no-custom-cursor"
                                title="Remove Profile"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </main>
        ) : portalWorkspaceMode === "coverLetter" ? (
          /* Embedded Visa Cover Letter Workspace */
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            {/* Left Column: Cover Letter Form Fields */}
            <div className="w-full lg:w-[480px] shrink-0 border-r-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-950/80 flex items-center justify-between">
                <div>
                  <h3 className="font-sans text-xs font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>✉️</span> Embassy Cover Letter Details
                  </h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-light">Fields automatically sync with active parsed applicant data.</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleNewCoverLetterSession}
                    className="text-[9px] font-extrabold uppercase tracking-wider bg-[#C99537] text-zinc-950 px-2.5 py-1.5 rounded-none hover:bg-[#E2B755] cursor-pointer shadow-[2px_2px_0_#000]"
                  >
                    ➕ New Session
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const fresh = generateMasterCoverLetterText(tempParsedData);
                      setEmbeddedCoverLetterText(fresh);
                      showToast("Refreshed Cover Letter from current applicant details");
                    }}
                    className="text-[9px] font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-2.5 py-1.5 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    🔄 Sync
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                {coverLetterSections.map((sec, idx) => (
                  <div key={idx} className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-3.5 text-left space-y-3">
                    <h4 className="font-sans text-[11px] font-bold text-[#C99537] uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                      {sec.title}
                    </h4>
                    <div className="space-y-2 text-[11px]">
                      {sec.fields.map((field) => (
                        <div key={field.id} className="flex flex-col gap-1 text-left">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            {field.label} {field.required && <span className="text-amber-500">*</span>}
                          </label>
                          <input
                            type="text"
                            value={tempParsedData[field.id] || ""}
                            onChange={(e) => {
                              const updated = { ...tempParsedData, [field.id]: e.target.value };
                              setTempParsedData(updated);
                              setEmbeddedCoverLetterText(generateMasterCoverLetterText(updated));
                            }}
                            placeholder={field.placeholder}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-xs px-2.5 py-1.5 focus:outline-none focus:border-[#C99537] rounded-none w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: AI Extraction Assistant Chat & Conversation Stream */}
            <div className="flex-1 flex flex-col overflow-hidden bg-zinc-100/50 dark:bg-zinc-950 p-4 sm:p-6 text-left">
              {/* Top Action Header */}
              <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-sans text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span>🤖</span> AI Cover Letter Extraction Assistant & Chat
                  </h2>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-light">Interactive AI workspace for parsing applicant notes, share codes, and travel logistics.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleNewCoverLetterSession}
                    className="text-[10px] font-extrabold uppercase tracking-wider bg-[#C99537]/15 border border-[#C99537]/50 text-[#C99537] hover:bg-[#C99537] hover:text-zinc-950 px-3 py-2 rounded-none cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <span>➕</span> Start New Cover Letter
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCoverLetterPreviewModal(true)}
                    className="text-[10px] font-extrabold uppercase tracking-wider bg-[#C99537] text-zinc-950 px-4 py-2 hover:bg-[#E2B755] rounded-none cursor-pointer shadow-[2px_2px_0_#000] flex items-center gap-1.5"
                  >
                    <span>👁️</span> Preview & Edit Cover Letter
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleExportWithValidation("coverDoc")}
                    className="text-[10px] font-bold uppercase tracking-wider border-2 border-[#C99537] text-[#C99537] px-3.5 py-2 hover:bg-[#C99537] hover:text-zinc-950 rounded-none cursor-pointer"
                  >
                    📄 Export Word (.DOC)
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleExportWithValidation("coverPdf")}
                    className="text-[10px] font-bold uppercase tracking-wider border-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-3.5 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-none cursor-pointer"
                  >
                    📕 Export ATS Cover Letter (PDF)
                  </button>
                </div>
              </div>

              {/* Chat Conversation Log Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-[3px_3px_0_#000] mb-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                {coverLetterMessages.map((m, idx) => {
                  const isAssistant = m.role === "assistant";
                  return (
                    <div key={idx} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-2xl p-4 text-xs font-sans leading-relaxed border-2 ${
                        isAssistant
                          ? "bg-zinc-50 dark:bg-zinc-950/80 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-[2px_2px_0_#ccc] dark:shadow-[2px_2px_0_#111]"
                          : "bg-zinc-100 dark:bg-zinc-800/90 border-[#C99537]/50 text-zinc-900 dark:text-white shadow-[2px_2px_0_rgba(201,149,55,0.2)]"
                      }`}>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-[#C99537] block mb-1.5">
                          {isAssistant ? "AI Cover Letter Parser Assistant" : `@${agentUsername} (Agent Notes)`}
                        </span>
                        <div className="whitespace-pre-wrap font-sans text-xs">{m.content}</div>

                        {m.missingFields && m.missingFields.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-amber-500/25 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                            ⚠️ Remaining Unclear / Missing Fields:
                            <div className="flex flex-wrap gap-1 mt-1">
                              {m.missingFields.map((f) => (
                                <span key={f} className="bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded-none text-[9px] font-mono">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleParseCoverLetterWithAI} className="p-3 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-[3px_3px_0_#000] flex gap-2 shrink-0">
                <textarea
                  rows={2}
                  value={coverLetterAiInput}
                  onChange={(e) => setCoverLetterAiInput(e.target.value)}
                  placeholder="Type or paste raw client notes, passport info, flight booking emails, share code details, or reply to AI questions..."
                  className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-xs p-2.5 focus:outline-none focus:border-[#C99537] rounded-none resize-none"
                />
                <button
                  type="submit"
                  disabled={isAiParsingCoverLetter || !coverLetterAiInput.trim()}
                  className="bg-[#C99537] text-zinc-950 px-5 py-2.5 font-extrabold uppercase tracking-wider text-[10px] rounded-none hover:bg-[#E2B755] disabled:opacity-50 flex items-center gap-1.5 shrink-0 shadow-[2px_2px_0_#000] cursor-pointer"
                >
                  {isAiParsingCoverLetter ? "Processing..." : "✨ Send to AI Parser"}
                </button>
              </form>
            </div>
          </main>
        ) : (
          <>
        {/* Left Column: Sidebar History */}
        <aside 
          className="shrink-0 border-r-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/50 flex flex-col overflow-hidden relative"
          style={{ 
            width: leftCollapsed ? "0px" : `${leftWidth}px`, 
            minWidth: leftCollapsed ? "0px" : `${leftWidth}px`,
            display: leftCollapsed ? "none" : "flex"
          }}
        >
          <div className="p-4 shrink-0 border-b border-zinc-200 dark:border-zinc-850">
            <button
              onClick={handleNewConvo}
              className="w-full bg-[#C99537] text-zinc-950 font-bold uppercase tracking-wider text-xs py-3 rounded-none shadow-[4px_4px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-[#E2B755] transition-all cursor-pointer flex items-center justify-center gap-2 no-custom-cursor"
            >
              {/* Plus Icon SVG */}
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
              New Form Session
            </button>
          </div>

          {/* Active Chats Header */}
          <div className="py-2.5 px-4 border-b-2 border-zinc-200 dark:border-zinc-800 shrink-0 text-xs font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-950 flex items-center justify-between text-[#C99537]">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 inline-block shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Active Chats ({conversations.length})
            </span>
          </div>

          {/* Sidebar List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {conversations.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-zinc-400 dark:text-zinc-650 text-xs uppercase tracking-wider font-bold">No Active Chats</p>
                <p className="text-[10px] text-zinc-500 font-light mt-1 max-w-[180px] mx-auto leading-relaxed">
                  Start a new form session using the button above. Histories are held in storage for 24 hours.
                </p>
              </div>
            ) : (
              conversations.map((c) => {
                const userMsgs = c.messages.filter((m) => m.role === "user");
                const previewText = userMsgs.length > 0 
                  ? userMsgs[userMsgs.length - 1].content 
                  : "New Form Session";
                
                const timeString = new Date(c.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                const isActive = c.id === activeConvoId;

                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConvoId(c.id)}
                    className={`p-3 border-2 transition-all cursor-pointer flex justify-between items-start group rounded-none no-custom-cursor ${
                      isActive
                        ? "border-[#C99537] bg-[#C99537]/10"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 hover:border-[#C99537] hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors truncate">
                        {previewText}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-zinc-450 dark:text-zinc-600 font-light block">
                          {timeString}
                        </span>
                        {c.agentUsername && (
                          <span className="text-[8px] font-bold uppercase tracking-wider text-[#C99537]/70 bg-[#C99537]/10 px-1 py-px">
                            @{c.agentUsername}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConvo(c.id, e)}
                      className="text-zinc-400 dark:text-zinc-600 hover:text-red-500 p-1 transition-colors cursor-pointer shrink-0 no-custom-cursor"
                      title="Delete Conversation"
                    >
                      {/* Trash Icon SVG */}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Left Resizer Drag Handle */}
        {!leftCollapsed && (
          <div className="w-0.5 bg-zinc-200 dark:bg-zinc-800 shrink-0 z-30 relative flex items-center justify-center">
            {/* Centered pull-tab handle with horizontal double arrow */}
            <div
              onMouseDown={handleLeftMouseDown}
              className="absolute w-5 h-8 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-[2px_2px_0_#000] flex items-center justify-center cursor-col-resize select-none z-40 hover:border-[#C99537] active:border-[#C99537] transition-colors rounded-none"
            >
              <svg className="w-3.5 h-3.5 text-zinc-650 dark:text-zinc-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18m0 0l-7.5 7.5M21 12l-7.5-7.5" />
              </svg>
            </div>
          </div>
        )}

        {/* Middle Column: Chat workspace area */}
        <main className="flex-1 flex flex-col bg-white dark:bg-zinc-950 relative overflow-hidden transition-colors duration-300">
          {/* Logo Watermark behind workspace */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-[0.03] dark:opacity-[0.015]">
            <img src="/logos/logo.svg" alt="Watermark" className="w-[420px] h-[420px] object-contain" />
          </div>

          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent z-10">
            {activeConvo ? (
              activeConvo.messages.map((m, idx) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div
                    key={idx}
                    className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-xl p-4 border-2 text-xs sm:text-sm font-sans leading-relaxed ${
                        isAssistant
                          ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-none shadow-[3px_3px_0_#ccc] dark:shadow-[3px_3px_0_#222]"
                          : "bg-zinc-100 dark:bg-zinc-800/85 border-zinc-300 dark:border-[#C99537]/45 text-zinc-900 dark:text-white rounded-none shadow-[3px_3px_0_rgba(201,149,55,0.15)]"
                      }`}
                    >
                      <span className={`text-[9px] uppercase font-bold tracking-wider block mb-1.5 ${
                        isAssistant ? "text-[#C99537]" : "text-amber-500 dark:text-amber-300"
                      }`}>
                        {isAssistant ? "AI Parsing Assistant" : "Agent Input"}
                      </span>
                      <p className="whitespace-pre-wrap font-light select-text cursor-text">{m.content}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center p-8">
                <svg className="w-12 h-12 text-[#C99537] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5" />
                </svg>
                <h3 className="font-sans text-zinc-900 dark:text-white font-bold text-xl mt-4">Schengen Visa Form Parser</h3>
                <p className="text-zinc-650 dark:text-zinc-450 font-light text-xs max-w-sm mt-1 leading-normal">
                  Paste emails, chats, passport scans, or client details. The AI will extract the data and show any missing info fields on the right.
                </p>
                <button
                  onClick={handleNewConvo}
                  className="mt-6 border-2 border-[#C99537] text-[#C99537] px-6 py-2.5 font-bold uppercase tracking-wider text-xs hover:bg-[#C99537] hover:text-zinc-950 transition-all cursor-pointer no-custom-cursor"
                >
                  Start New Session
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          {activeConvo && (
            <form onSubmit={handleSendMessage} className="p-4 shrink-0 border-t-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/60 flex gap-3.5 items-end z-10">
              <textarea
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste client text here..."
                disabled={isSubmitting}
                className="flex-1 bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-xs sm:text-sm px-4 py-3.5 focus:outline-none focus:border-[#C99537] transition-all resize-none placeholder-zinc-400 dark:placeholder-zinc-700 rounded-none no-custom-cursor"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting || !inputText.trim()}
                className="bg-[#C99537] text-zinc-950 font-bold uppercase tracking-widest text-xs px-6 py-4 shadow-[3px_3px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-[#E2B755] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0 no-custom-cursor"
              >
                {isSubmitting ? "Parsing..." : "Parse"}
              </button>
            </form>
          )}
        </main>

        {/* Right Resizer Drag Handle */}
        {!rightCollapsed && (
          <div className="w-0.5 bg-zinc-200 dark:bg-zinc-800 shrink-0 z-30 relative flex items-center justify-center">
            {/* Centered pull-tab handle with horizontal double arrow */}
            <div
              onMouseDown={handleRightMouseDown}
              className="absolute w-5 h-8 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 shadow-[2px_2px_0_#000] flex items-center justify-center cursor-col-resize select-none z-40 hover:border-[#C99537] active:border-[#C99537] transition-colors rounded-none"
            >
              <svg className="w-3.5 h-3.5 text-zinc-650 dark:text-zinc-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18m0 0l-7.5 7.5M21 12l-7.5-7.5" />
              </svg>
            </div>
          </div>
        )}

        {/* Right Column: Structured Data Review Panel */}
        <aside 
          className="shrink-0 border-l-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/30 flex flex-col overflow-hidden relative"
          style={{ 
            width: rightCollapsed ? "0px" : `${rightWidth}px`, 
            minWidth: rightCollapsed ? "0px" : `${rightWidth}px`,
            display: rightCollapsed ? "none" : "flex"
          }}
        >
          <div className="h-14 shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/60 flex items-center justify-between px-6 transition-colors duration-300">
            <h4 className="font-sans text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wider">
              Visa Form Fields
            </h4>
          </div>

          {/* Unsaved Changes Banner */}
          {hasUnsavedChanges && (
            <div className="bg-[#C99537] text-zinc-950 px-4 py-2.5 flex justify-between items-center shrink-0 shadow-md">
              <span className="text-[9px] font-extrabold uppercase tracking-wider">Unsaved Edits</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setTempParsedData({ ...activeConvo.parsedData })}
                  className="text-[8px] uppercase font-bold px-2 py-0.5 bg-zinc-950 text-white hover:bg-zinc-850 transition-colors cursor-pointer no-custom-cursor rounded-none border-none"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="text-[8px] uppercase font-bold px-2 py-0.5 bg-white text-zinc-950 hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer no-custom-cursor rounded-none border-none"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {activeConvo && (
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-zinc-950 shrink-0">
              {(["all", "filled", "missing"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFieldFilter(filter)}
                  className={`flex-1 py-2.5 text-center transition-colors cursor-pointer border-r border-zinc-200 dark:border-zinc-800/80 last:border-r-0 no-custom-cursor ${
                    fieldFilter === filter ? "bg-zinc-100 dark:bg-zinc-900 text-[#C99537]" : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {filter} Fields
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {activeConvo ? (
              <>
                {/* Active missing fields alerts */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                    Validation Checklist
                  </span>
                  {activeConvo.missingFields.length === 0 ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 p-3.5 text-xs rounded-none font-semibold text-left">
                      ✓ Ready: All critical Schengen Visa form fields verified and complete!
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 border border-[#C99537]/35 text-[#C99537] p-3.5 text-xs rounded-none font-light leading-relaxed text-left">
                      <strong className="block font-bold mb-1">Critical Missing Fields:</strong>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {activeConvo.missingFields.map((field) => {
                          // Find human friendly label
                          let label = field;
                          visaSections.forEach(sec => {
                            const found = sec.fields.find(f => f.id === field);
                            if (found) label = found.label;
                          });
                          return (
                            <li key={field} className="capitalize text-left">{label}</li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Grouped Visa Form Fields Panel */}
                <div className="space-y-4">
                  {visaSections.map((sec, sIdx) => {
                    const totalFieldsCount = sec.fields.length;
                    const filledFieldsCount = sec.fields.filter(f => activeConvo.parsedData[f.id]).length;
                    const percentage = totalFieldsCount > 0 ? Math.round((filledFieldsCount / totalFieldsCount) * 100) : 0;

                    const dynamicCritical = getDynamicCriticalFields(activeConvo.parsedData);

                    const filteredFields = sec.fields.filter(field => {
                      const val = activeConvo.parsedData[field.id] || "";
                      const isCritical = dynamicCritical.includes(field.id);
                      
                      if (fieldFilter === "filled") {
                        return !!val;
                      }
                      if (fieldFilter === "missing") {
                        return isCritical && !val;
                      }
                      return true; // "all"
                    });

                    return (
                      <div key={sIdx} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 space-y-3 text-left">
                        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-2">
                          <h5 className="font-sans text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                            {sec.title}
                          </h5>
                          <span className="text-[#C99537] font-mono text-[10px] font-bold">
                            {percentage}%
                          </span>
                        </div>
                        
                        <div className="space-y-2.5 text-[11px] font-sans text-left">
                          {filteredFields.length > 0 ? (
                            filteredFields.map((field) => {
                              const isCritical = dynamicCritical.includes(field.id);
                              const isMissing = isCritical && !(tempParsedData[field.id] || "");
                              return (
                                <div key={field.id} className="flex flex-col gap-1 text-left py-1.5 border-b border-zinc-100 dark:border-zinc-800/40 last:border-b-0">
                                  <span className={`text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[9px] tracking-wider shrink-0 ${isCritical ? "after:content-['*'] after:text-primary after:ml-0.5" : ""}`}>
                                    {field.label}:
                                  </span>
                                  <input
                                    type="text"
                                    value={tempParsedData[field.id] || ""}
                                    onChange={(e) => {
                                      setTempParsedData({
                                        ...tempParsedData,
                                        [field.id]: e.target.value
                                      });
                                    }}
                                    placeholder={isCritical ? "Required *" : "Optional"}
                                    className={`bg-white dark:bg-zinc-900/60 border ${isMissing ? "border-amber-500/40 focus:border-amber-500" : "border-zinc-200 dark:border-zinc-800 focus:border-[#C99537]"} text-zinc-900 dark:text-white font-sans text-xs px-2.5 py-1.5 focus:outline-none w-full rounded-none no-custom-cursor`}
                                  />
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-[10px] text-zinc-400 dark:text-zinc-650 italic text-center py-1">
                              No fields match filter
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={handleSaveChanges}
                    disabled={!hasUnsavedChanges}
                    className="w-full bg-[#C99537] text-zinc-950 font-bold uppercase tracking-wider text-xs py-3 rounded-none transition-all cursor-pointer shadow-[3px_3px_0_#000] hover:bg-[#E2B755] disabled:opacity-45 disabled:pointer-events-none no-custom-cursor animate-none"
                  >
                    Save Changes
                  </button>
                  
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 text-left">
                      Option 1: Visa Application Form Exports
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleExportWithValidation("visaDoc")}
                        className="border-2 border-[#C99537] text-[#C99537] font-bold uppercase tracking-wider text-[10px] py-2.5 rounded-none transition-all cursor-pointer hover:bg-[#C99537] hover:text-zinc-950 no-custom-cursor"
                      >
                        📄 Form (.DOC)
                      </button>
                      <button
                        onClick={() => handleExportWithValidation("visaPdf")}
                        className="bg-[#C99537]/20 border-2 border-[#C99537] text-[#C99537] font-bold uppercase tracking-wider text-[10px] py-2.5 rounded-none transition-all cursor-pointer hover:bg-[#C99537] hover:text-zinc-950 no-custom-cursor"
                      >
                        📕 Form (PDF)
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 text-left">
                      Option 2: Embassy Cover Letter Exports
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleExportWithValidation("coverDoc")}
                        className="border-2 border-zinc-700 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wider text-[10px] py-2.5 rounded-none transition-all cursor-pointer hover:bg-zinc-800 hover:text-white no-custom-cursor"
                      >
                        📄 Letter (.DOC)
                      </button>
                      <button
                        onClick={() => handleExportWithValidation("coverPdf")}
                        className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold uppercase tracking-wider text-[10px] py-2.5 rounded-none transition-all cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-100 no-custom-cursor"
                      >
                        📕 Letter (PDF)
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-zinc-400 dark:text-zinc-650 text-xs font-bold uppercase tracking-wider">
                Select a conversation
              </div>
            )}
          </div>
        </aside>
      </>
    )}
  </div>

      {/* Floating Side Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-6 right-6 z-[99999] border-2 px-5 py-4 shadow-[6px_6px_0_#000] flex items-center gap-3.5 max-w-sm pointer-events-auto rounded-none ${
              toast.type === "success"
                ? "bg-[#C99537] border-zinc-950 text-zinc-950"
                : "bg-red-950 border-red-500 text-white"
            }`}
          >
            <span className="text-base">✓</span>
            <div className="flex-1 text-left text-xs font-bold uppercase tracking-wider">
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approval & Export Word Modal */}
      <AnimatePresence>
        {showApprovalModal && activeConvo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs pointer-events-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-950 border-2 border-zinc-300 dark:border-[#C99537]/70 p-6 max-w-lg w-full shadow-[6px_6px_0_rgba(0,0,0,0.6)] dark:shadow-[6px_6px_0_rgba(201,149,55,0.25)] text-left relative rounded-none animate-none"
            >
              {approvalStep === "preview" ? (
                <>
                  <h3 className="font-sans text-lg font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Final Review & Approval</h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4 font-light leading-relaxed">
                    Please review the Schengen Visa application document details below. Approving the document will generate and download the official Word document draft.
                  </p>

                  <div className="max-h-64 overflow-y-auto border-2 border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-none font-sans text-xs space-y-4 mb-5 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {visaSections.map((sec, sIdx) => {
                      const populatedFields = sec.fields.filter(f => activeConvo.parsedData[f.id]);
                      if (populatedFields.length === 0) return null;
                      return (
                        <div key={sIdx} className="space-y-1.5">
                          <h4 className="text-[9px] uppercase font-extrabold tracking-widest text-[#C99537] flex items-center gap-2">
                            <span className="flex-1 h-px bg-[#C99537]/20" />
                            {sec.title}
                            <span className="flex-1 h-px bg-[#C99537]/20" />
                          </h4>
                          <div className="pl-3 border-l-2 border-[#C99537]/40 space-y-1">
                            {populatedFields.map(field => (
                              <div key={field.id} className="flex justify-between gap-4 py-0.5 group">
                                <span className="text-zinc-400 dark:text-zinc-500 shrink-0">{field.label}:</span>
                                <span className="text-zinc-900 dark:text-zinc-100 text-right font-semibold tracking-tight">{activeConvo.parsedData[field.id]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-wider font-medium">Review all details before approval</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowApprovalModal(false)}
                        className="border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 py-2 font-bold uppercase tracking-wider text-[10px] rounded-none transition-all cursor-pointer no-custom-cursor"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          downloadWordDoc(activeConvo);
                          setApprovalStep("email");
                          setEmailToInput(activeConvo.parsedData.address_email || "");
                        }}
                        className="bg-[#C99537] text-zinc-950 px-5 py-2.5 font-bold uppercase tracking-wider text-[10px] rounded-none transition-colors cursor-pointer hover:bg-[#E2B755] no-custom-cursor shadow-[3px_3px_0_rgba(0,0,0,0.4)]"
                      >
                        Approve & Download
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center py-2 mb-5">
                    <div className="w-12 h-12 bg-[#C99537]/10 border-2 border-[#C99537]/40 text-[#C99537] flex items-center justify-center mx-auto text-2xl mb-3 font-bold">
                      ✓
                    </div>
                    <h3 className="font-sans text-base font-bold text-zinc-900 dark:text-white mb-1 tracking-tight">Document Downloaded</h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-light max-w-xs mx-auto leading-relaxed">
                      The document has been approved and downloaded as a Word file. Would you like to email this draft to the client now?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                        Client Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={emailToInput}
                        onChange={(e) => setEmailToInput(e.target.value)}
                        placeholder="client@example.com"
                        className="w-full bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-xs sm:text-sm px-4 py-3 focus:outline-none focus:border-[#C99537] transition-all rounded-none no-custom-cursor"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowApprovalModal(false);
                          setEmailToInput("");
                        }}
                        className="border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 py-2 font-bold uppercase tracking-wider text-[10px] rounded-none transition-colors cursor-pointer no-custom-cursor"
                      >
                        Skip & Close
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (emailToInput.trim()) {
                            showToast(`Email draft successfully sent to ${emailToInput}`);
                            setShowApprovalModal(false);
                            setEmailToInput("");
                          }
                        }}
                        className="bg-[#C99537] text-zinc-950 px-5 py-2.5 font-bold uppercase tracking-wider text-[10px] rounded-none transition-colors cursor-pointer hover:bg-[#E2B755] no-custom-cursor"
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cover Letter Live Preview & Direct Editor Modal */}
      <AnimatePresence>
        {showCoverLetterPreviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 w-full max-w-4xl max-h-[90vh] flex flex-col p-6 shadow-[8px_8px_0_#000] text-left"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b-2 border-zinc-200 dark:border-zinc-800 pb-4 mb-4 shrink-0">
                <div>
                  <h3 className="font-sans text-base font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                    <span>📜</span> Cover Letter Live Preview & Direct Text Editor
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-light mt-0.5">
                    Live ATS-compliant letter matching official embassy standards. Edit text directly below.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const fresh = generateMasterCoverLetterText(tempParsedData);
                      setEmbeddedCoverLetterText(fresh);
                      showToast("Refreshed Cover Letter from current applicant details");
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider bg-[#C99537] text-zinc-950 px-3 py-1.5 rounded-none hover:bg-[#E2B755] cursor-pointer"
                  >
                    🔄 Sync Form Data
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCoverLetterPreviewModal(false)}
                    className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Textarea Editor */}
              <div className="flex-1 flex flex-col overflow-hidden mb-4">
                <textarea
                  rows={20}
                  value={embeddedCoverLetterText || generateMasterCoverLetterText(tempParsedData)}
                  onChange={(e) => setEmbeddedCoverLetterText(sanitizeTextForATS(e.target.value))}
                  placeholder="Cover letter text will render here..."
                  className="flex-1 w-full p-4 font-mono text-xs leading-relaxed bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#C99537] rounded-none resize-none scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
                />
              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
                <span className="text-[10px] text-zinc-400 font-light">Direct edits are preserved upon export.</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleExportWithValidation("coverDoc")}
                    className="text-[10px] font-bold uppercase tracking-wider border-2 border-[#C99537] text-[#C99537] px-4 py-2 hover:bg-[#C99537] hover:text-zinc-950 rounded-none cursor-pointer"
                  >
                    📄 Export Word (.DOC)
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleExportWithValidation("coverPdf")}
                    className="text-[10px] font-bold uppercase tracking-wider bg-[#C99537] text-zinc-950 px-4 py-2 hover:bg-[#E2B755] rounded-none cursor-pointer font-extrabold shadow-[2px_2px_0_#000]"
                  >
                    📕 Export ATS Cover Letter (PDF)
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCoverLetterPreviewModal(false)}
                    className="text-[10px] font-bold uppercase tracking-wider border border-zinc-300 dark:border-zinc-700 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-none cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Agent Change Access Code Modal */}
      <AnimatePresence>
        {showChangeCodeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs pointer-events-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-[#C99537] p-6 max-w-md w-full shadow-[6px_6px_0_#000] text-left relative rounded-none animate-none"
            >
              <h3 className="font-sans text-lg font-bold text-zinc-900 dark:text-white mb-2">Change Your Access Code</h3>
              <p className="text-[11px] text-zinc-550 dark:text-zinc-400 mb-4 font-light leading-relaxed">
                Update your login password/access code for security. Please provide your previous credentials and the new credentials twice to confirm.
              </p>

              <form onSubmit={handleChangeAccessCode} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Previous Access Code
                  </label>
                  <input
                    type="password"
                    required
                    value={oldAgentCode}
                    onChange={(e) => setOldAgentCode(e.target.value)}
                    placeholder="Enter previous access code"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-xs px-3 py-2.5 focus:outline-none focus:border-[#C99537] transition-all rounded-none no-custom-cursor"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    New Access Code
                  </label>
                  <input
                    type="password"
                    required
                    value={newAgentCode}
                    onChange={(e) => setNewAgentCode(e.target.value)}
                    placeholder="Enter new access code"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-xs px-3 py-2.5 focus:outline-none focus:border-[#C99537] transition-all rounded-none no-custom-cursor"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Confirm New Access Code
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmAgentCode}
                    onChange={(e) => setConfirmAgentCode(e.target.value)}
                    placeholder="Re-enter new access code"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-xs px-3 py-2.5 focus:outline-none focus:border-[#C99537] transition-all rounded-none no-custom-cursor"
                  />
                </div>

                {changeCodeError && (
                  <div className="bg-red-500/10 border border-red-500/35 text-red-500 dark:text-red-400 p-2.5 text-[10px] rounded-none">
                    ⚠️ {changeCodeError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangeCodeModal(false);
                      setOldAgentCode("");
                      setNewAgentCode("");
                      setConfirmAgentCode("");
                      setChangeCodeError(null);
                    }}
                    className="border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 py-2 font-bold uppercase tracking-wider text-[10px] rounded-none transition-colors cursor-pointer no-custom-cursor"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#C99537] text-zinc-950 px-5 py-2.5 font-bold uppercase tracking-wider text-[10px] rounded-none transition-colors cursor-pointer hover:bg-[#E2B755] no-custom-cursor shadow-[3px_3px_0_#000]"
                  >
                    Save Code
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Missing Details Validation Warning Modal */}
      <AnimatePresence>
        {missingValidationModal?.show && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs pointer-events-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 border-2 border-amber-500 p-6 max-w-md w-full shadow-[6px_6px_0_#000] text-left relative rounded-none"
            >
              <div className="flex items-center gap-3 text-amber-500 mb-2">
                <span className="text-xl font-bold">⚠️</span>
                <h3 className="font-sans text-base font-extrabold uppercase tracking-wide text-zinc-900 dark:text-white">
                  Missing Required Applicant Details
                </h3>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mb-4 font-light leading-relaxed">
                Before exporting, please note that the following essential fields are currently blank:
              </p>

              <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 mb-5 space-y-1.5">
                {missingValidationModal.missingFieldsList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <span className="text-amber-500">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setFieldFilter("missing");
                    setMissingValidationModal(null);
                  }}
                  className="bg-[#C99537] text-zinc-950 px-4 py-2 font-bold uppercase tracking-wider text-[10px] rounded-none hover:bg-[#E2B755] cursor-pointer"
                >
                  Complete Missing Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const exportType = missingValidationModal.exportType;
                    setMissingValidationModal(null);
                    executeExportFormat(exportType);
                  }}
                  className="border-2 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 px-4 py-2 font-bold uppercase tracking-wider text-[10px] rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Export Anyway
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
