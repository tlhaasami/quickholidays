"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { heroBg } from "@/constants/data";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    setAnimateCard(true);
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateErr } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateErr) {
        throw new Error(updateErr.message || "Failed to reset password.");
      }

      setSuccess("Password updated successfully! Redirecting to login...");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An error occurred while resetting your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white font-sans select-none overflow-hidden">
      
      {/* Background Section with preloaded high quality sketch image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBg}
          alt="Schengen Visa Consulting Background Illustration"
          fill
          sizes="100vw"
          onLoad={() => setBgLoaded(true)}
          className={`object-cover object-center select-none transition-all duration-[1500ms] ease-out ${
            bgLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-sm"
          }`}
          priority
        />
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className={`w-full max-w-md bg-[#0F2148]/80 border border-white/10 border-t-4 border-t-brand-gold/60 rounded-[32px] p-8 shadow-2xl shadow-[0_20px_50px_rgba(15,33,72,0.35),0_0_35px_rgba(204,163,82,0.15)] backdrop-blur-md text-left transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          animateCard ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
        }`}>
          
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold block mb-2">
              Security Portal
            </span>
            <h1 className="font-serif text-3xl font-extrabold text-white">
              Reset Password
            </h1>
            <p className="text-white/60 text-xs mt-2">
              Please enter your new password to regain access to the portal.
            </p>
          </div>

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

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="new-pass" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                New Password
              </label>
              <input
                id="new-pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="confirm-pass" className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2 ml-1">
                Confirm New Password
              </label>
              <input
                id="confirm-pass"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full rounded-full bg-[#182C54]/60 border border-white/10 px-6 py-2.5 text-sm text-white placeholder-white/30 focus:bg-[#182C54]/80 focus:outline-none focus:border-brand-gold transition-all duration-200"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center rounded-full bg-brand-gold hover:bg-brand-gold-dark text-brand-navy hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] px-8 py-3 text-sm font-bold transition-all duration-300 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>

        </div>
      </div>

    </div>
  );
}
