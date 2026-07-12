"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { heroBg } from "@/constants/data";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "forgot">("signin");

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
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [animateCard, setAnimateCard] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Trigger animation
    setAnimateCard(true);

    // Load backgrounds
    const storedBg = localStorage.getItem("quick_holidays_bg_login");
    if (storedBg) {
      setCustomBg(storedBg);
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    let loginEmail = usernameOrEmail.trim();

    // If it's not a standard email, check if it's a username
    if (!loginEmail.includes("@")) {
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", loginEmail.toLowerCase())
        .single();
      
      if (profileErr || !profile) {
        setError("No account found with this username.");
        return;
      }
      loginEmail = profile.email;
    }

    // Sign in using Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password,
    });

    if (authErr || !authData.user) {
      setError(authErr?.message || "Authentication failed.");
      return;
    }

    // Retrieve their dashboard role profile to verify status and select redirect
    const { data: profile, error: dbErr } = await supabase
      .from("profiles")
      .select("name, username, role, status")
      .eq("id", authData.user.id)
      .single();

    if (dbErr || !profile) {
      setError("Failed to fetch user profile details.");
      await supabase.auth.signOut();
      return;
    }

    if (profile.status === "pending") {
      setError("Access Pending: Awaiting Admin approval.");
      await supabase.auth.signOut();
      return;
    }

    if (profile.status === "suspended") {
      setError("Account Suspended: Contact administrator.");
      await supabase.auth.signOut();
      return;
    }

    // Save basic session metadata
    localStorage.setItem("user_session", JSON.stringify({
      id: authData.user.id,
      name: profile.name,
      username: profile.username,
      email: loginEmail,
      role: profile.role,
      status: profile.status,
    }));

    setSuccess("Login successful! Redirecting...");

    setTimeout(() => {
      if (profile.role === "admin") {
        const hostname = window.location.host;
        if (!hostname.startsWith("admin.")) {
          window.location.href = window.location.protocol + "//admin." + hostname + "/";
        } else {
          router.push("/admin");
        }
      } else if (profile.role === "processor") {
        router.push("/processing-dashboard");
      } else {
        router.push(`/${profile.username.toLowerCase()}/agent-dashboard`);
      }
    }, 1000);
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanedName = name.trim();
    const cleanedUsername = username.trim().toLowerCase();
    const cleanedEmail = email.trim();

    // Validate format
    if (cleanedUsername.includes("@")) {
      setError("Username cannot contain '@'.");
      return;
    }

    // Check username uniqueness in DB first
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", cleanedUsername)
      .maybeSingle();

    if (existingUser) {
      setError("This username is already taken. Please choose a unique username.");
      return;
    }

    // Register in Supabase Auth
    const { data: authData, error: signupErr } = await supabase.auth.signUp({
      email: cleanedEmail,
      password: password,
      options: {
        data: {
          name: cleanedName,
          username: cleanedUsername,
          role: role,
        }
      }
    });

    if (signupErr) {
      setError(signupErr.message || "Failed to register account.");
      return;
    }

    // Force sign out immediately so they aren't auto-logged in under pending status
    await supabase.auth.signOut();
    localStorage.removeItem("user_session");

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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (resetErr) {
      setError(resetErr.message || "Failed to send reset link.");
      return;
    }

    setSuccess("Password reset link sent! Check your inbox for instructions.");
    setEmail("");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white font-sans select-none overflow-hidden">

      {/* Moving warning strip below navbar */}
      <div className="w-full bg-brand-gold py-2.5 overflow-hidden relative z-20 border-b border-brand-navy/10 shadow-sm">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 25s linear infinite;
          }
          @keyframes float-plane {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(8deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .animate-plane {
            animation: float-plane 4s ease-in-out infinite;
          }
        `}} />
        <div className="animate-marquee text-xs font-bold text-brand-navy flex items-center">
          <span className="inline-flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-brand-navy shrink-0 animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            This page is for company employees, not for customers. Kindly fill the form on &nbsp;
            <Link href="/contact-us" className="text-brand-navy font-black underline hover:text-slate-700">
              Contact Us
            </Link>{" "}
            and we'll reach you.
          </span>
        </div>
      </div>

      {/* Main Grid containing background and login card */}
      <div className="relative grow grid grid-cols-1 md:grid-cols-2 p-6 overflow-hidden">
        {/* CLEAR background image layer */}
        <div className="absolute inset-0 w-full h-full z-0 select-none">
          {customBg ? (
            <img
              src={customBg}
              alt="Workspace Background"
              onLoad={() => setBgLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover object-center select-none transition-all duration-[1500ms] ease-out ${
                bgLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-sm"
              }`}
            />
          ) : (
            <Image
              src={heroBg}
              alt="Workspace Background"
              fill
              sizes="100vw"
              onLoad={() => setBgLoaded(true)}
              className={`object-cover object-center select-none transition-all duration-[1500ms] ease-out ${
                bgLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-sm"
              }`}
              priority
            />
          )}
          {/* Transparent light layer to remove dark blue shading and keep bg natural */}
          <div className="absolute inset-0 bg-white/10 pointer-events-none" />
        </div>

        {/* Wrapper to center the glassmorphic card on the left half */}
        <div className="relative z-10 flex items-center justify-center w-full">
          {/* Main glassmorphic card with entrance animation - gold border top & shadow glow */}
          <div className={`w-full max-w-lg bg-[#0F2148]/80 border border-white/10 border-t-4 border-t-brand-gold/60 rounded-[32px] p-8 shadow-2xl shadow-[0_20px_50px_rgba(15,33,72,0.35),0_0_35px_rgba(204,163,82,0.15)] backdrop-blur-md text-left flex flex-col justify-center dark-autofill transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${animateCard ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
            }`}>

            {/* Branding Title with animated aeroplane */}
            <div className="mb-6 flex justify-between items-start relative">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold block mb-2">
                  Quick Holidays Portal
                </span>
                <h1 className="font-serif text-3xl font-extrabold text-white">
                  Team Workspace
                </h1>
              </div>
              <div className="animate-plane text-brand-gold shrink-0 mt-1 mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(204,163,82,0.6)]">
                  <path d="M3.4 20.4l17.4-8.4L3.4 3.6v6.6l12 1.8-12 1.8v6.6z" />
                </svg>
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

                  <div className="flex justify-end text-xs pr-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("forgot");
                        setError("");
                        setSuccess("");
                      }}
                      className="text-brand-gold hover:text-brand-gold-dark font-semibold transition-all cursor-pointer"
                    >
                      Forgot Password?
                    </button>
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

              {/* Tab 3: FORGOT PASSWORD */}
              {activeTab === "forgot" && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-white/60 text-xs leading-relaxed ml-1 mb-2">
                    Enter your registered email address and we'll send you a secure link to reset your password.
                  </p>
                  <div>
                    <label htmlFor="forgot-email" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                      Email Address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
                    />
                  </div>

                  <div className="pt-3 flex flex-col gap-3">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center rounded-full bg-brand-gold hover:bg-brand-gold-dark text-brand-navy hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] px-8 py-3 text-sm font-bold transition-all duration-300 cursor-pointer"
                    >
                      Send Reset Link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("signin");
                        setError("");
                        setSuccess("");
                      }}
                      className="w-full text-center text-white/70 hover:text-white text-xs font-semibold py-1.5 transition-all cursor-pointer"
                    >
                      Back to Sign In
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
                        className={`flex-1 rounded-full py-2 text-xs font-bold transition-all border ${role === "agent"
                          ? "bg-brand-gold border-brand-gold text-brand-navy shadow-sm"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-brand-gold/40"
                          }`}
                      >
                        Agent Team
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("processor")}
                        className={`flex-1 rounded-full py-2 text-xs font-bold transition-all border ${role === "processor"
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

              {/* Separator line */}
              <div className="flex items-center gap-4 my-5">
                <span className="grow h-[1px] bg-white/10" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Or continue with Google</span>
                <span className="grow h-[1px] bg-white/10" />
              </div>

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

      {/* Spacer for right side on desktop */}
      <div className="hidden md:block" />
    </div>

  );
}
