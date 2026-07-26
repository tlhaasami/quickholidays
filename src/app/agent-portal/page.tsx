"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ThemeButton } from "@/components/ThemeButton";
import { visaSections } from "@/constants/visaFields";
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

const CRITICAL_FIELDS = [
  "personal_surname",
  "personal_first_names",
  "personal_dob",
  "passport_number",
  "travel_destinations",
  "travel_start_date",
  "address_email"
];

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

  // Agent Access Code controls
  const [showChangeCodeModal, setShowChangeCodeModal] = useState(false);
  const [oldAgentCode, setOldAgentCode] = useState("");
  const [newAgentCode, setNewAgentCode] = useState("");
  const [confirmAgentCode, setConfirmAgentCode] = useState("");
  const [changeCodeError, setChangeCodeError] = useState<string | null>(null);

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

    // Load dynamic accounts list for admin preview
    const accounts = localStorage.getItem("qh-agent-accounts");
    if (accounts) {
      setAdminAccounts(JSON.parse(accounts));
    }

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
    CRITICAL_FIELDS.forEach(fId => {
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
  const handleCreateAccount = (e: React.FormEvent) => {
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

    const updated = {
      ...adminAccounts,
      [cleanUser]: { password: cleanPass, suspended: false }
    };
    setAdminAccounts(updated);
    localStorage.setItem("qh-agent-accounts", JSON.stringify(updated));
    setNewUsername("");
    setNewPassword("");
    setAdminError(null);
    showToast(`Account "${cleanUser}" created successfully.`);
  };

  const handleChangeAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOld = oldAgentCode.trim();
    const cleanNew = newAgentCode.trim();
    const cleanConfirm = confirmAgentCode.trim();

    if (!cleanOld || !cleanNew || !cleanConfirm) {
      setChangeCodeError("Please fill out all access code fields.");
      return;
    }

    const accounts = localStorage.getItem("qh-agent-accounts");
    if (!accounts) {
      setChangeCodeError("Error: Registry not found.");
      return;
    }

    const parsed = JSON.parse(accounts);
    const userProfile = parsed[agentUsername];

    if (!userProfile) {
      setChangeCodeError("Error: Agent profile not found in directory.");
      return;
    }

    // 1. Verify previous access code matches
    if (userProfile.password !== cleanOld) {
      setChangeCodeError("Previous access code is incorrect.");
      return;
    }

    // 2. Validate new access code entered twice matches
    if (cleanNew !== cleanConfirm) {
      setChangeCodeError("New access codes do not match.");
      return;
    }

    // 3. Validate length
    if (cleanNew.length < 3) {
      setChangeCodeError("New access code must be at least 3 characters.");
      return;
    }

    // 4. Final confirmation
    const isConfirmed = window.confirm(
      "CONFIRMATION: Are you sure you want to change your login access code?\n" +
      "You will need to use your new credentials next time you sign in."
    );
    if (!isConfirmed) return;

    // Save
    userProfile.password = cleanNew;
    localStorage.setItem("qh-agent-accounts", JSON.stringify(parsed));
    setAdminAccounts(parsed); // Sync state

    setShowChangeCodeModal(false);
    setOldAgentCode("");
    setNewAgentCode("");
    setConfirmAgentCode("");
    setChangeCodeError(null);
    showToast("Your access code has been updated successfully.");
  };

  const handleToggleSuspendAccount = (user: string) => {
    const isCurrentlySuspended = adminAccounts[user].suspended;
    const nextSuspended = !isCurrentlySuspended;

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

  const handleDeleteAccount = (user: string) => {
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
    const missing: string[] = [...CRITICAL_FIELDS];

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
    CRITICAL_FIELDS.forEach(field => {
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
        missingFields: [...CRITICAL_FIELDS],
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

  const generateWordDocContent = (convo: Conversation) => {
    let html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Schengen Visa Application Document</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #333333; }
          h1 { font-family: "Georgia", serif; font-size: 20pt; color: #C99537; border-bottom: 2px solid #C99537; padding-bottom: 5px; margin-bottom: 20px; }
          h2 { font-family: "Georgia", serif; font-size: 14pt; color: #111111; margin-top: 25px; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th, td { padding: 6px 10px; text-align: left; vertical-align: top; font-size: 10pt; }
          th { font-weight: bold; background-color: #f8fafc; border: 1px solid #cbd5e1; width: 40%; color: #475569; }
          td { border: 1px solid #cbd5e1; color: #0f172a; }
          .meta-table th { background-color: #f1f5f9; }
          .footer { font-size: 8pt; color: #94a3b8; text-align: center; margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Schengen Visa Application</h1>
        
        <h2>Document Metadata</h2>
        <table class="meta-table">
          <tr><th>Exported By</th><td>${convo.agentUsername || agentUsername}</td></tr>
          <tr><th>Exported At</th><td>${new Date().toLocaleString()}</td></tr>
          <tr><th>Session ID</th><td>${convo.id}</td></tr>
        </table>
    `;

    visaSections.forEach(sec => {
      html += `<h2>${sec.title}</h2>`;
      html += `<table>`;
      sec.fields.forEach(field => {
        const val = convo.parsedData[field.id] || "";
        html += `
          <tr>
            <th>${field.label}</th>
            <td>${val || "[Empty / Not Provided]"}</td>
          </tr>
        `;
      });
      html += `</table>`;
    });

    html += `
        <div class="footer">
          Generated automatically via Quick Holidays Visa Application Workspace. For internal use only.
        </div>
      </body>
      </html>
    `;

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
          <img src="/logos/logo-search.png" alt="Logo" className="h-8 w-auto object-contain" />
          
          <span className="font-sans text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Quick Holidays Portal
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C99537] bg-[#C99537]/15 px-2 py-0.5 border border-[#C99537]/20">
            Visa Application Workspace
          </span>

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

          {/* Tab selectors */}
          <div className="flex border-b-2 border-zinc-200 dark:border-zinc-805 shrink-0 text-xs font-bold uppercase tracking-wider bg-zinc-200 dark:bg-zinc-950">
            <button
              onClick={() => setActiveTab("convos")}
              className={`flex-1 py-3 text-center transition-colors border-r border-zinc-200 dark:border-zinc-800 cursor-pointer no-custom-cursor flex items-center justify-center ${
                activeTab === "convos" ? "bg-white dark:bg-zinc-900 text-[#C99537]" : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {/* Active Chats Bubble Icon SVG */}
              <svg className="w-3.5 h-3.5 mr-1.5 inline-block shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Chats ({conversations.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("entries");
                fetchFormEntries();
              }}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer no-custom-cursor flex items-center justify-center ${
                activeTab === "entries" ? "bg-white dark:bg-zinc-900 text-[#C99537]" : "text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {/* Inbox/Inquiries Icon SVG */}
              <svg className="w-3.5 h-3.5 mr-1.5 inline-block shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18M2.25 13.5l1.125-11.25h14.25l1.125 11.25M18.75 13.5v7.5a2.25 2.25 0 01-2.25 2.25H7.5a2.25 2.25 0 01-2.25-2.25v-7.5"/>
              </svg>
              Inquiries ({formEntries.length})
            </button>
          </div>

          {/* Sidebar List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {activeTab === "convos" ? (
              conversations.length === 0 ? (
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
              )
            ) : (
              formEntries.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-zinc-400 dark:text-zinc-650 text-xs uppercase tracking-wider font-bold">No Contact Inquiries</p>
                  <p className="text-[10px] text-zinc-500 font-light mt-1 max-w-[180px] mx-auto leading-relaxed">
                    Once users submit consultation forms on the public website, leads list will automatically load here.
                  </p>
                </div>
              ) : (
                formEntries.map((entry) => {
                  const dateString = new Date(entry.created_at).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  });

                  return (
                    <div
                      key={entry.id}
                      onClick={() => handleLoadFormEntry(entry)}
                      className="p-3 border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20 hover:border-[#C99537] hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all cursor-pointer rounded-none text-left no-custom-cursor"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-zinc-800 dark:text-white truncate max-w-[150px] flex items-center gap-1.5">
                          {/* User Avatar SVG */}
                          <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                          </svg>
                          {entry.payload.name || "Unnamed Client"}
                        </span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-600 font-mono shrink-0">
                          ID: #{entry.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#C99537] font-semibold mt-1 truncate pl-5">
                        Dest: {entry.payload.destination || "Not selected"} | Plan: {entry.payload.plan || "Free"}
                      </p>
                      <div className="flex justify-between items-center mt-2 border-t border-zinc-100 dark:border-zinc-800/65 pt-1.5 pl-5">
                        <span className="text-[9px] text-zinc-500 dark:text-zinc-550 font-light block">
                          Submitted: {dateString}
                        </span>
                        <span className="text-[8px] bg-[#C99537]/10 text-[#C99537] border border-[#C99537]/20 px-1.5 py-0.5 font-bold uppercase tracking-wider">
                          Load Entry
                        </span>
                      </div>
                    </div>
                  );
                })
              )
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
            <img src="/logos/logo-search.png" alt="Watermark" className="w-[420px] h-auto object-contain" />
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

                    const filteredFields = sec.fields.filter(field => {
                      const val = activeConvo.parsedData[field.id] || "";
                      const isCritical = CRITICAL_FIELDS.includes(field.id);
                      
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
                              const isCritical = CRITICAL_FIELDS.includes(field.id);
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
                <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={handleSaveChanges}
                    disabled={!hasUnsavedChanges}
                    className="w-full bg-[#C99537] text-zinc-950 font-bold uppercase tracking-wider text-xs py-3 rounded-none transition-all cursor-pointer shadow-[3px_3px_0_#000] hover:bg-[#E2B755] disabled:opacity-45 disabled:pointer-events-none no-custom-cursor animate-none"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleExportWordClick}
                    className="w-full border-2 border-[#C99537] text-[#C99537] font-bold uppercase tracking-wider text-xs py-2.5 rounded-none transition-all cursor-pointer hover:bg-[#C99537] hover:text-zinc-950 no-custom-cursor animate-none"
                  >
                    Export Word Document
                  </button>
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
    </div>
  );
}
