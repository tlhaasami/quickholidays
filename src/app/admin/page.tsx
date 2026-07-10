"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import loginBg from "@/assets/backgrounds/login-signup-page-bg.png";

interface UserRequest {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "agent" | "processor";
  status: "pending" | "approved" | "suspended";
  created_at: string;
  password?: string;
}

interface ConfirmModalState {
  isOpen: boolean;
  step: 1 | 2;
  action: "approve" | "reject";
  userId: string;
  userName: string;
  userEmail: string;
  userRole: "agent" | "processor";
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Dashboard state
  const [requests, setRequests] = useState<UserRequest[]>([]);

  // Add User Form States
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"agent" | "processor">("agent");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  // Custom UI Dialog Modal State (Replaces native confirm dialogs)
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    step: 1,
    action: "approve",
    userId: "",
    userName: "",
    userEmail: "",
    userRole: "agent",
  });

  // Load state and sample data if empty
  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("admin_auth") === "true";
    setIsAuthenticated(authStatus);

    // Load user signup requests
    const storedRequests = localStorage.getItem("quick_holidays_user_requests");
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    } else {
      // Seed sample data for immediate evaluation
      const sampleRequests: UserRequest[] = [
        {
          id: "req-1",
          name: "Amara Okoye",
          username: "amara",
          email: "amara.o@quickholidays.co.uk",
          role: "agent",
          status: "pending",
          created_at: new Date(Date.now() - 3600000 * 2).toLocaleString(),
          password: "password123",
        },
        {
          id: "req-2",
          name: "Liam O'Connor",
          username: "liam",
          email: "liam.oc@quickholidays.co.uk",
          role: "processor",
          status: "pending",
          created_at: new Date(Date.now() - 3600000 * 24).toLocaleString(),
          password: "password123",
        },
        {
          id: "req-3",
          name: "Chloe Dupont",
          username: "chloe",
          email: "chloe.d@quickholidays.co.uk",
          role: "agent",
          status: "approved",
          created_at: new Date(Date.now() - 3600000 * 48).toLocaleString(),
          password: "password123",
        },
        {
          id: "req-4",
          name: "David Smith",
          username: "david",
          email: "david.s@quickholidays.co.uk",
          role: "processor",
          status: "approved",
          created_at: new Date(Date.now() - 3600000 * 72).toLocaleString(),
          password: "password123",
        },
      ];
      localStorage.setItem("quick_holidays_user_requests", JSON.stringify(sampleRequests));
      setRequests(sampleRequests);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid administrator credentials.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  const updateRequestStatus = (id: string, newStatus: "approved" | "suspended" | "pending") => {
    const updated = requests.map((req) => {
      if (req.id === id) {
        return { ...req, status: newStatus };
      }
      return req;
    });
    localStorage.setItem("quick_holidays_user_requests", JSON.stringify(updated));
    setRequests(updated);
  };

  const deleteRequest = (id: string) => {
    const updated = requests.filter((req) => req.id !== id);
    localStorage.setItem("quick_holidays_user_requests", JSON.stringify(updated));
    setRequests(updated);
  };

  // Open custom modal for approval check
  const triggerApproveModal = (user: UserRequest) => {
    setConfirmModal({
      isOpen: true,
      step: 1,
      action: "approve",
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
    });
  };

  // Open custom modal for rejection check
  const triggerRejectModal = (user: UserRequest) => {
    setConfirmModal({
      isOpen: true,
      step: 1,
      action: "reject",
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
    });
  };

  // Process the action committed in the custom modal
  const handleCommitModalAction = () => {
    if (confirmModal.action === "approve") {
      updateRequestStatus(confirmModal.userId, "approved");
    } else {
      deleteRequest(confirmModal.userId);
    }
    // Close modal
    setConfirmModal((m) => ({ ...m, isOpen: false }));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");

    if (!newFullName || !newUsername || !newEmail || !newPassword) {
      setAddError("Please fill out all fields.");
      return;
    }

    // Check unique username
    const usernameExists = requests.some(
      (r) => r.username && r.username.toLowerCase() === newUsername.trim().toLowerCase()
    );
    if (usernameExists) {
      setAddError("This username is already taken. Please choose another one.");
      return;
    }

    // Check unique email
    const emailExists = requests.some(
      (r) => r.email.toLowerCase() === newEmail.trim().toLowerCase()
    );
    if (emailExists) {
      setAddError("This email address is already registered.");
      return;
    }

    const newUser: UserRequest = {
      id: `req-${Date.now()}`,
      name: newFullName.trim(),
      username: newUsername.trim().toLowerCase(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      status: "approved", // Automatically approved when created by Admin
      created_at: new Date().toLocaleString(),
      password: newPassword,
    };

    const updated = [newUser, ...requests];
    localStorage.setItem("quick_holidays_user_requests", JSON.stringify(updated));
    setRequests(updated);

    setAddSuccess(`Account for ${newFullName.trim()} created successfully!`);
    
    // Clear inputs
    setNewFullName("");
    setNewUsername("");
    setNewEmail("");
    setNewPassword("");
    
    setTimeout(() => {
      setAddSuccess("");
      setShowAddUserForm(false);
    }, 2500);
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen flex items-center justify-start bg-[#0F2148] font-sans p-6 md:pl-28 select-none overflow-hidden">
        {/* Back to Site Button */}
        <div className="absolute top-6 right-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:scale-[1.04]"
          >
            Back to Site
          </Link>
        </div>
        
        {/* CLEAR background image layer */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src={loginBg}
            alt="Admin Login Background"
            fill
            sizes="100vw"
            className="object-cover object-center select-none"
            priority
          />
          {/* Navy-themed soft shadow gradient matching our color scheme */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2148]/95 via-[#0F2148]/60 to-transparent pointer-events-none" />
        </div>

        {/* Main glassmorphic card positioned to the left */}
        <div className="relative z-10 w-full max-w-lg bg-[#0F2148]/35 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-md text-left flex flex-col justify-center dark-autofill">
          
          {/* Branding Title */}
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold block mb-2">
              System Administrator
            </span>
            <h1 className="font-serif text-3xl font-extrabold text-white">
              Admin Sign In
            </h1>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-300 text-xs font-semibold rounded-2xl p-3.5 mb-5 border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            {/* Continue with Google button with multicolor Google logo */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-2.5 px-6 text-xs transition-all duration-300 shadow-sm hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] active:scale-[0.98] cursor-pointer group"
            >
              <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Separator line */}
            <div className="flex items-center gap-4 my-5">
              <span className="grow h-[1px] bg-white/10" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Or admin details</span>
              <span className="grow h-[1px] bg-white/10" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="admin-user" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Username
                </label>
                <input
                  id="admin-user"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="admin-pass" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Password
                </label>
                <input
                  id="admin-pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-full bg-brand-gold hover:bg-brand-gold-dark text-brand-navy hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] px-8 py-3 text-sm font-bold transition-all duration-300 cursor-pointer"
                >
                  Login to System
                </button>
              </div>
            </form>
          </div>

          <div className="text-left text-[10px] text-white/40 mt-5 border-t border-white/10 pt-4 ml-1">
            Secure administrator console area.
          </div>

        </div>

      </div>
    );
  }

  // Dashboard View
  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedUsers = requests.filter((r) => r.status === "approved" || r.status === "suspended");

  return (
    <div className="min-h-screen bg-brand-cream text-slate-800 font-sans flex">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-[#0F2148] text-white border-r border-white/10 z-30 justify-between p-6 select-none">
        <div className="space-y-8">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <span className="font-serif text-xl font-bold tracking-tight text-brand-gold">
              Quick Holidays
            </span>
            <span className="bg-amber-500/20 text-amber-500 text-[9px] uppercase font-bold tracking-wider rounded-md px-1.5 py-0.5 border border-amber-500/20">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <a
              href="#add-user"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("add-user")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Add User
            </a>
            <a
              href="#pending-requests"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("pending-requests")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Pending Requests
            </a>
            <a
              href="#approved-accounts"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("approved-accounts")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              Approved Accounts
            </a>
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className="border-t border-white/10 pt-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-brand-gold hover:bg-brand-gold-dark text-brand-navy text-xs font-bold py-3 px-6 transition-all duration-300 hover:shadow-[0_0_15px_rgba(204,163,82,0.3)] hover:scale-[1.02] cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 min-h-screen pt-8 pb-16">
      
      {/* Top Welcome Title Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-brand-navy/10 pb-6 mb-8 text-left">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-navy">
              System Control Room
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Welcome back, Administrator. Manage registration requests, add team members, and check active accounts.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-6 py-2.5 transition-all duration-300 shadow-md hover:scale-[1.03] cursor-pointer"
          >
            Log Out from Portal
          </button>
        </div>

        {/* Enhanced Full-Width UI Dashboard Container */}
        <div className="space-y-8">
          
          {/* Stats section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
            <div className="bg-white rounded-2xl p-5 border border-brand-gold/15 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Requests</p>
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              </div>
              <p className="text-3xl font-extrabold text-brand-gold mt-2">{pendingRequests.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-brand-gold/15 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Registered Users</p>
              <p className="text-3xl font-extrabold text-brand-navy mt-2">{requests.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-brand-gold/15 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Approved Agents</p>
              <p className="text-3xl font-extrabold text-green-600 mt-2">
                {requests.filter((r) => r.role === "agent" && r.status === "approved").length}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-brand-gold/15 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Approved Processors</p>
              <p className="text-3xl font-extrabold text-blue-600 mt-2">
                {requests.filter((r) => r.role === "processor" && r.status === "approved").length}
              </p>
            </div>
          </div>

          {/* Direct Admin Control: Add User Account Card */}
          <div id="add-user" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-navy">
                  Add User Account
                </h2>
                <p className="text-xs text-slate-500 mt-1">Directly register a secure agent or processor account.</p>
              </div>
              <button
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className={`rounded-full px-6 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                  showAddUserForm
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-brand-gold hover:bg-brand-gold-dark text-brand-navy hover:shadow-[0_0_15px_rgba(204,163,82,0.3)] hover:scale-[1.02]"
                }`}
              >
                {showAddUserForm ? "Hide Form" : "Create Account"}
              </button>
            </div>

            {showAddUserForm && (
              <form onSubmit={handleAddUser} className="space-y-4 border-t border-slate-100 pt-6 mt-6 animate-fadeIn">
                {addError && (
                  <div className="bg-red-50 text-red-600 text-xs font-semibold rounded-xl p-3.5 border border-red-100">
                    {addError}
                  </div>
                )}
                {addSuccess && (
                  <div className="bg-green-50 text-green-700 text-xs font-semibold rounded-xl p-3.5 border border-green-100">
                    {addSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      placeholder="e.g. David Jones"
                      className="w-full rounded-full border border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Unique Username</label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. djones"
                      className="w-full rounded-full border border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. djones@quickholidays.co.uk"
                      className="w-full rounded-full border border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Assign secret password"
                      className="w-full rounded-full border border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 font-semibold">Select Account Role</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setNewRole("agent")}
                      className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all border ${
                        newRole === "agent"
                          ? "bg-brand-navy border-brand-navy text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      Agent Team
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRole("processor")}
                      className={`flex-1 rounded-full py-2.5 text-xs font-bold transition-all border ${
                        newRole === "processor"
                          ? "bg-brand-navy border-brand-navy text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      Proccessing Team
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold px-8 py-3 transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
                  >
                    Save & Approve User
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Awaiting Approvals Card */}
          <div id="pending-requests" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-6">
              Access Requests Awaiting Approval ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">No pending requests at this time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] pb-4">
                      <th className="pb-3 text-left">Name</th>
                      <th className="pb-3 text-left">Email</th>
                      <th className="pb-3 text-left">Role</th>
                      <th className="pb-3 text-left">Request Date</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-bold text-brand-navy">{req.name}</td>
                        <td className="py-4 text-slate-600">{req.email}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                            req.role === "agent" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {req.role === "agent" ? "Agent Team" : "Proccessing Team"}
                          </span>
                        </td>
                        <td className="py-4 text-slate-500 text-xs">{req.created_at}</td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => triggerApproveModal(req)}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5 py-1.5 text-xs font-bold transition-all shadow-sm hover:scale-[1.03] cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => triggerRejectModal(req)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-5 py-1.5 text-xs font-bold transition-all hover:scale-[1.03] cursor-pointer"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Registered Users Table Card */}
          <div id="approved-accounts" className="bg-white border border-brand-gold/15 rounded-3xl p-6 sm:p-8 shadow-sm text-left hover:shadow-md transition-shadow duration-300">
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-6">
              Approved & Registered Accounts ({approvedUsers.length})
            </h2>

            {approvedUsers.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">No registered accounts yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px] pb-4">
                      <th className="pb-3 text-left">Name</th>
                      <th className="pb-3 text-left">Email</th>
                      <th className="pb-3 text-left">Role</th>
                      <th className="pb-3 text-left">Status</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {approvedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-bold text-brand-navy">{user.name}</td>
                        <td className="py-4 text-slate-600">{user.email}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                            user.role === "agent" ? "bg-amber-50 text-amber-700 border border-amber-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {user.role === "agent" ? "Agent Team" : "Proccessing Team"}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            user.status === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                          }`}>
                            {user.status === "approved" ? "Active" : "Suspended"}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          {user.status === "approved" ? (
                            <button
                              onClick={() => updateRequestStatus(user.id, "suspended")}
                              className="bg-red-50 hover:bg-red-100 text-red-600 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => updateRequestStatus(user.id, "approved")}
                              className="bg-green-50 hover:bg-green-100 text-green-700 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer"
                            >
                              Unsuspend
                            </button>
                          )}
                          <button
                            onClick={() => deleteRequest(user.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            aria-label="Delete user"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* CUSTOM DOUBLE-CONFIRMATION MODAL (Replaces default browser alert confirm dialog) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fadeIn">
          
          <div className="bg-white border border-brand-gold/20 rounded-[32px] max-w-md w-full p-8 shadow-2xl text-left relative animate-scaleUp">
            
            {/* Modal Subheader Step */}
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] block mb-1">
              Step {confirmModal.step} of 2 • Confirm Action
            </span>

            {/* Modal Step 1 */}
            {confirmModal.step === 1 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl font-bold text-brand-navy leading-snug">
                  {confirmModal.action === "approve"
                    ? "Verify Account Approval"
                    : "Confirm Registration Rejection"}
                </h3>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2 text-slate-700">
                  <p><strong>Name:</strong> {confirmModal.userName}</p>
                  <p><strong>Email:</strong> {confirmModal.userEmail}</p>
                  <p><strong>Target Role:</strong> {confirmModal.userRole === "agent" ? "Agent Team" : "Proccessing Team"}</p>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {confirmModal.action === "approve"
                    ? "Approving this user creates an active, verified account in the workspace. They will be granted full access to log in with their credentials and manage customer bookings immediately."
                    : "Rejecting this user deletes their registration request. They will be blocked from accessing the workspace and their request record will be permanently deleted."}
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setConfirmModal((m) => ({ ...m, step: 2 }))}
                    className="flex-1 rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white text-xs font-bold py-3 transition-all duration-300 shadow-md cursor-pointer text-center"
                  >
                    Proceed to Step 2
                  </button>
                  <button
                    onClick={() => setConfirmModal((m) => ({ ...m, isOpen: false }))}
                    className="flex-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-3 transition-all duration-300 cursor-pointer text-center"
                  >
                    Cancel Action
                  </button>
                </div>
              </div>
            )}

            {/* Modal Step 2 */}
            {confirmModal.step === 2 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl font-bold text-brand-navy leading-snug">
                  Double Check Confirmation
                </h3>

                <p className="text-slate-600 text-xs leading-relaxed">
                  Are you absolutely sure you want to {confirmModal.action === "approve" ? "APPROVE" : "REJECT & DELETE"} the account for <strong>{confirmModal.userName}</strong>? This action will immediately update the database.
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCommitModalAction}
                    className={`flex-1 rounded-full text-white text-xs font-bold py-3 transition-all duration-300 shadow-md cursor-pointer text-center ${
                      confirmModal.action === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Yes, Commit Action
                  </button>
                  <button
                    onClick={() => setConfirmModal((m) => ({ ...m, step: 1 }))}
                    className="flex-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-3 transition-all duration-300 cursor-pointer text-center"
                  >
                    Back to Step 1
                  </button>
                </div>
              </div>
            )}

          </div>
          
        </div>
      )}

      </div>
    </div>
  );
}
