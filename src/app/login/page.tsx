"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Form states
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration specific states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"agent" | "processor">("agent");

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Seed default requests if none exist
    const storedRequests = localStorage.getItem("quick_holidays_user_requests");
    if (storedRequests) {
      const parsed: UserRequest[] = JSON.parse(storedRequests);
      const updated = parsed.map((item) => ({
        ...item,
        username: item.username || (item.name ? item.name.split(" ")[0].toLowerCase() : "chloe"),
        password: item.password || "password123",
      }));
      localStorage.setItem("quick_holidays_user_requests", JSON.stringify(updated));
    } else {
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
    }
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const storedRequests = localStorage.getItem("quick_holidays_user_requests");
    const requests: UserRequest[] = storedRequests ? JSON.parse(storedRequests) : [];

    // Allow sign in by username OR email
    const user = requests.find(
      (r) =>
        r.email.toLowerCase() === usernameOrEmail.toLowerCase() ||
        (r.username && r.username.toLowerCase() === usernameOrEmail.toLowerCase())
    );

    if (!user) {
      setError("No account found with this username or email. Please register first.");
      return;
    }

    if (password !== (user.password || "password123")) {
      setError("Incorrect password. (Try default: password123)");
      return;
    }

    if (user.status === "pending") {
      setError("Access Pending: Awaiting Admin approval.");
      return;
    }

    if (user.status === "suspended") {
      setError("Account Suspended: Contact administrator.");
      return;
    }

    // Approved, login!
    localStorage.setItem("user_session", JSON.stringify(user));

    if (user.role === "agent") {
      router.push("/agent-dashboard");
    } else {
      router.push("/processing-dashboard");
    }
  };

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const storedRequests = localStorage.getItem("quick_holidays_user_requests");
    const requests: UserRequest[] = storedRequests ? JSON.parse(storedRequests) : [];

    // Verify email uniqueness
    const emailExists = requests.some((r) => r.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      setError("This email address is already registered or has a pending request.");
      return;
    }

    // Verify username uniqueness
    const usernameExists = requests.some(
      (r) => r.username && r.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (usernameExists) {
      setError("This username is already taken. Please choose a unique username.");
      return;
    }

    const newRequest: UserRequest = {
      id: `req-${Date.now()}`,
      name,
      username: username.trim().toLowerCase(),
      email,
      role,
      status: "pending",
      created_at: new Date().toLocaleString(),
      password: password,
    };

    const updated = [newRequest, ...requests];
    localStorage.setItem("quick_holidays_user_requests", JSON.stringify(updated));

    setSuccess("Access request submitted successfully! Awaiting Admin approval.");
    
    // Clear signup form
    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    
    setTimeout(() => {
      setActiveTab("signin");
      setSuccess("");
    }, 3000);
  };

  return (
    <div className="relative min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#0F2148] font-sans p-6 select-none overflow-hidden">
      
      {/* CLEAR background image layer */}
      <div className="absolute inset-0 w-full h-full z-0 select-none">
        <Image
          src={loginBg}
          alt="Kayak Ocean Background"
          fill
          sizes="100vw"
          className="object-cover object-center select-none -scale-x-100"
          priority
        />
        {/* Navy-themed soft shadow gradient matching our color scheme */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#0F2148]/95 via-[#0F2148]/60 to-transparent pointer-events-none" />
      </div>

      {/* Spacer for left side on desktop */}
      <div className="hidden md:block" />

      {/* Wrapper to center the glassmorphic card on the right half */}
      <div className="relative z-10 flex items-center justify-center w-full">
        {/* Main glassmorphic card positioned in the center of the right half */}
        <div className="w-full max-w-lg bg-[#0F2148]/35 border border-white/10 rounded-[32px] p-8 shadow-2xl backdrop-blur-md text-left flex flex-col justify-center dark-autofill">
        
        {/* Branding Title */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold block mb-2">
            Quick Holidays Portal
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-white">
            Team Workspace
          </h1>
        </div>

        {/* Customer Warning Note */}
        <div className="mb-6 p-4 rounded-2xl bg-[#182C54]/60 border border-brand-gold/30 text-xs text-white/90 leading-relaxed">
          <div className="flex gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-brand-gold shrink-0 mt-0.5 animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <p>
              This page is for company employees, not for customers. Kindly fill the form on{" "}
              <Link href="/contact-us" className="text-brand-gold font-bold hover:underline">
                Contact Us
              </Link>{" "}
              and we'll reach you.
            </p>
          </div>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="bg-red-500/20 text-red-300 text-xs font-semibold rounded-2xl p-3.5 mb-5 border border-red-500/20">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 text-green-300 text-xs font-semibold rounded-2xl p-3.5 mb-5 border border-green-500/20">
            {success}
          </div>
        )}

        <div>
          {/* Continue with Google button with colorful logo and dynamic hover states */}
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
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Or continue with Email</span>
            <span className="grow h-[1px] bg-white/10" />
          </div>

          {/* Tab 1: SIGN IN */}
          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Username or Email
                </label>
                <input
                  id="signin-email"
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="signin-pass" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Password
                </label>
                <input
                  id="signin-pass"
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
                  Login to Portal
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: REQUEST ACCESS */}
          {activeTab === "signup" && (
            <form onSubmit={handleRequestAccess} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1 font-semibold">Select Role</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("agent")}
                    className={`flex-1 rounded-full py-2 text-xs font-bold transition-all border ${
                      role === "agent"
                        ? "bg-brand-gold border-brand-gold text-brand-navy shadow-sm"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-brand-gold/40"
                    }`}
                  >
                    Agent Team
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("processor")}
                    className={`flex-1 rounded-full py-2 text-xs font-bold transition-all border ${
                      role === "processor"
                        ? "bg-brand-gold border-brand-gold text-brand-navy shadow-sm"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-brand-gold/40"
                    }`}
                  >
                    Proccessing Team
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="signup-name" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="signup-user" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Unique Username
                </label>
                <input
                  id="signup-user"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Create a unique username"
                  className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="signup-pass" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                  Password
                </label>
                <input
                  id="signup-pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-full bg-brand-gold hover:bg-brand-gold-dark text-brand-navy hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] px-8 py-3 text-sm font-bold transition-all duration-300 cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Switch tab link */}
        <div className="text-left text-xs font-semibold text-white/70 mt-5 border-t border-white/10 pt-4 ml-1">
          {activeTab === "signin" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setError("");
                  setSuccess("");
                }}
                className="text-brand-gold hover:underline font-bold focus:outline-none cursor-pointer"
              >
                Register Now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setActiveTab("signin");
                  setError("");
                  setSuccess("");
                }}
                className="text-brand-gold hover:underline font-bold focus:outline-none cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
      </div>
    </div>
  );
}
