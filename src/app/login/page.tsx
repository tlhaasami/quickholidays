"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ThemeButton } from "@/components/ThemeButton";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [clientIp, setClientIp] = useState("127.0.0.1");

  useEffect(() => {
    setMounted(true);

    const fetchIp = async () => {
      try {
        const res = await fetch("/api/agent/ip");
        if (res.ok) {
          const data = await res.json();
          setClientIp(data.ip);
        }
      } catch (err) {
        console.error("Failed to load client IP address:", err);
      }
    };
    fetchIp();
    
    // Seed initial default accounts if none exist or update account directory
    let accounts = localStorage.getItem("qh-agent-accounts");
    if (!accounts) {
      const initialAccounts = {
        owner: { password: "12345678", suspended: false },
        admin: { password: "12345678", suspended: false },
        tlhaasami: { password: "12345678", suspended: false }
      };
      localStorage.setItem("qh-agent-accounts", JSON.stringify(initialAccounts));
    } else {
      try {
        const parsed = JSON.parse(accounts);
        let changed = false;
        if (!parsed.owner) {
          parsed.owner = { password: "12345678", suspended: false };
          changed = true;
        }
        if (!parsed.admin) {
          parsed.admin = { password: "12345678", suspended: false };
          changed = true;
        }
        if (!parsed.tlhaasami) {
          parsed.tlhaasami = { password: "12345678", suspended: false };
          changed = true;
        }
        if (parsed.agent) {
          delete parsed.agent;
          changed = true;
        }
        if (parsed.processor) {
          delete parsed.processor;
          changed = true;
        }
        if (parsed["qh-agent"]) {
          delete parsed["qh-agent"];
          changed = true;
        }
        if (changed) {
          localStorage.setItem("qh-agent-accounts", JSON.stringify(parsed));
        }
      } catch (err) {}
    }

    const session = localStorage.getItem("qh-agent-session");
    if (session === "authenticated") {
      router.push("/agent-portal");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const userClean = username.trim().toLowerCase();
    
    if (!userClean || !password) {
      setError("Please fill out both username and password fields.");
      return;
    }

    try {
      const res = await fetch("/api/agent/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", username: userClean, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Invalid username or password.");
        return;
      }

      localStorage.setItem("qh-agent-session", "authenticated");
      localStorage.setItem("qh-agent-username", userClean);
      localStorage.setItem("qh-agent-session-time", Date.now().toString());
      router.push("/agent-portal");
    } catch (err) {
      console.error(err);
      setError("Server authentication service error. Please try again.");
    }
  };

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const docHasDark = document.documentElement.classList.contains("dark");
    setIsDark(theme === "dark" || (theme === null && docHasDark));
  }, []);

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-300 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans select-none">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 border-2 border-zinc-200 dark:border-zinc-800 hover:border-[#C99537] text-zinc-655 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer rounded-none no-custom-cursor bg-white dark:bg-zinc-900"
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
      </div>

      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#C99537]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-zinc-200 dark:bg-zinc-900 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-8 shadow-[8px_8px_0_#C99537] relative rounded-none text-left"
      >
        {/* Brand Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C99537] bg-[#C99537]/10 px-2.5 py-1">
            Agent Dashboard
          </span>
          <h2 className="font-sans text-3xl font-extrabold text-zinc-900 dark:text-white mt-4 leading-tight">
            Quick Holidays Ltd
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light mt-1.5 leading-normal">
            Visa Application Control. Enter your credentials to access the document verification assistant.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              placeholder="e.g. agent"
              className="w-full bg-white dark:bg-zinc-950/80 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-sm focus:outline-none focus:border-[#C99537] px-4 py-3 transition-all placeholder-zinc-400 dark:placeholder-zinc-700 rounded-none no-custom-cursor"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
              Password
            </label>
            <div className="relative text-left">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••••••••"
                className="w-full bg-white dark:bg-zinc-950/80 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-sm focus:outline-none focus:border-[#C99537] pl-4 pr-11 py-3 transition-all placeholder-zinc-400 dark:placeholder-zinc-700 rounded-none no-custom-cursor"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 dark:text-zinc-550 hover:text-zinc-900 dark:hover:text-white cursor-pointer no-custom-cursor"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/35 text-red-400 px-4 py-3.5 text-xs leading-normal flex items-start gap-2 rounded-none"
              >
                <span className="font-bold shrink-0">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-2">
            <ThemeButton type="submit" fullWidth={true}>
              Authenticate Agent
            </ThemeButton>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-4 text-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            For internal employee use only. All login attempts are recorded.
          </span>
        </div>
      </motion.div>
    </div>
  );
}
