"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ThemeButton } from "@/components/ThemeButton";
import { Highlighter } from "@/components/ui/highlighter";
import Link from "next/link";

export default function AddReviewPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Auth fields (pre-filled if already logged in as agent)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Review fields
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [caption, setCaption] = useState("");

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Pre-fill username from agent session if available
    const savedUser = localStorage.getItem("qh-agent-username") || "";
    setUsername(savedUser);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !password) {
      setError("Please enter your admin/agent username and password to authorize this upload.");
      return;
    }

    if (!name || !country || !youtubeLink || !caption) {
      setError("Please fill out all reviewer details (Name, Visa Country, YouTube link, and Caption).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/video-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          name,
          country,
          youtubeLink,
          caption
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to authorize or add review.");
        setIsSubmitting(false);
        return;
      }

      setSuccess(`Successfully added video review for ${name}! It is now live in the system.`);
      
      // Clear fields on success
      setName("");
      setCountry("");
      setYoutubeLink("");
      setCaption("");
      setIsSubmitting(false);

      // Redirect after brief delay
      setTimeout(() => {
        router.push("/reviews");
      }, 3000);

    } catch (err) {
      console.error(err);
      setError("Connection error. Could not reach server reviews API.");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-32 pb-36 px-6 sm:px-12 md:px-24 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest block">
            Agent Dashboard Tool
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-zinc-900 dark:text-white leading-tight">
            Add Client <span className="text-primary"><Highlighter action="underline" color="#CCA352" strokeWidth={2.5} isView={true}>Video Review</Highlighter></span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
            Upload new Schengen visa success testimonials. Paste the YouTube link or Short link directly to parse and embed it live.
          </p>
        </div>

        {/* Form Container */}
        <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 shadow-xl text-left">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Authorization */}
            <div className="border-b border-zinc-200 dark:border-white/5 pb-6 space-y-4">
              <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                1. Authorization Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    Agent Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#C99537] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    Agent Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#C99537] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Review Content */}
            <div className="space-y-4">
              <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                2. Testimonial Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    Reviewer Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Natasha K."
                    className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#C99537] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                    Visa Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. France Visa"
                    className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#C99537] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                  YouTube Video Link / Shorts Link
                </label>
                <input
                  type="text"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="https://youtube.com/shorts/..."
                  className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#C99537] transition-all"
                />
                <span className="text-[10px] text-zinc-500 font-sans block mt-1">
                  Supports full URLs, shorts links (e.g. youtube.com/shorts/id), or directly standard 11-char video IDs.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                  Caption / Caption Text
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Professional cover letter and checklist. Approved in 8 days."
                  rows={3}
                  className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-sans text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-[#C99537] transition-all resize-none"
                />
              </div>
            </div>

            {/* Notification messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/35 text-red-400 p-4 text-xs leading-normal flex items-start gap-2 rounded-xl"
                >
                  <span className="font-bold shrink-0">⚠️</span>
                  <span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/35 text-emerald-500 p-4 text-xs leading-normal flex items-start gap-2 rounded-xl"
                >
                  <span className="font-bold shrink-0">✓</span>
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit CTA */}
            <div className="pt-4 flex justify-between items-center">
              <Link 
                href="/reviews"
                className="text-xs font-sans text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors underline"
              >
                Back to Reviews list
              </Link>
              <ThemeButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading & Embedding..." : "Submit & Embed Review"}
              </ThemeButton>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
