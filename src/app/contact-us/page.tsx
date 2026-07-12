"use client";

import { useState } from "react";
import Image from "next/image";
import { contactUsBg } from "@/constants/data";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContactUsPage() {
  const [bgLoaded, setBgLoaded] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [city, setCity] = useState("");
  const [pastVisas, setPastVisas] = useState("");
  const [responsePreferred, setResponsePreferred] = useState("By Call");

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          nationality,
          city,
          pastVisas,
          responsePreferred,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit. Please try again.");
      }

      setSuccessMessage("Your consultation has been booked successfully! We will get in touch soon.");
      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setNationality("");
      setCity("");
      setPastVisas("");
      setResponsePreferred("By Call");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-cream text-slate-800 font-sans min-h-screen">
      <main className="grow">
        <section className="relative w-full overflow-hidden bg-brand-cream">
          <div className="absolute inset-0 z-0 select-none">
            <Image
              src={contactUsBg}
              alt="Contact Us Background"
              fill
              sizes="100vw"
              onLoad={() => setBgLoaded(true)}
              className={`object-cover object-right select-none transition-all duration-[1500ms] ease-out ${
                bgLoaded ? "opacity-30 sm:opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-sm"
              }`}
              priority
            />
            {/* Readable text background overlay (stronger on mobile, fading to transparent on the right) */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/90 via-brand-cream/75 to-transparent sm:bg-gradient-to-r sm:from-brand-cream/95 sm:via-brand-cream/75 sm:to-transparent pointer-events-none z-10" />
            <div className="absolute inset-0 bg-brand-cream/95 md:bg-brand-cream/70 lg:bg-transparent z-10" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
            <ScrollReveal animation="fade-up">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold mb-4">
                  Contact Us
                </p>
                <h1 className="text-5xl sm:text-6xl font-serif font-black sm:font-extrabold text-brand-navy leading-tight">
                  We’re Here to Help.
                  <br />
                  Let’s Get in Touch.
                </h1>
                <p className="mt-6 max-w-2xl text-base sm:text-lg font-bold sm:font-normal text-slate-900 sm:text-slate-700 leading-relaxed">
                  Have questions about your Schengen Visa application? Our team is ready to assist you at every step with expert guidance, clear next steps, and personalised support.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="scale-in" delay={150}>
              <div className="mt-16 max-w-4xl">
                <div className="rounded-[40px] border border-brand-gold/20 bg-brand-cream/95 p-8 shadow-[0_25px_80px_rgba(15,33,72,0.06)] backdrop-blur-sm">
                  
                  {successMessage && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-sm font-semibold flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                      </div>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-semibold text-brand-navy mb-2">
                          Full Name *
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full rounded-xl border border-brand-gold/30 bg-brand-cream/70 px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-brand-navy mb-2">
                          Email *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="w-full rounded-xl border border-brand-gold/30 bg-brand-cream/70 px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-brand-navy mb-2">
                          Phone *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone"
                          className="w-full rounded-xl border border-brand-gold/30 bg-brand-cream/70 px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="nationality" className="block text-sm font-semibold text-brand-navy mb-2">
                          Nationality
                        </label>
                        <input
                          id="nationality"
                          name="nationality"
                          type="text"
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
                          placeholder="Nationality"
                          className="w-full rounded-xl border border-brand-gold/30 bg-brand-cream/70 px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold text-brand-navy mb-2">
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full rounded-xl border border-brand-gold/30 bg-brand-cream/70 px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="pastVisas" className="block text-sm font-semibold text-brand-navy mb-2">
                          Schengen Visas issued during the past three years
                        </label>
                        <input
                          id="pastVisas"
                          name="pastVisas"
                          type="text"
                          value={pastVisas}
                          onChange={(e) => setPastVisas(e.target.value)}
                          placeholder="Past visas"
                          className="w-full rounded-xl border border-brand-gold/30 bg-brand-cream/70 px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-brand-navy">Response Preferred By</p>
                      <div className="flex flex-wrap gap-4">
                        {[
                          { id: "contact-call", label: "By Call" },
                          { id: "contact-email", label: "By Email" },
                          { id: "contact-whatsapp", label: "By Whatsapp" },
                        ].map((option) => (
                          <label key={option.id} htmlFor={option.id} className="inline-flex items-center gap-3 rounded-full border border-brand-gold/30 bg-brand-cream/80 px-4 py-3 text-sm font-medium text-slate-700 hover:border-brand-gold hover:text-brand-navy transition-all duration-200 cursor-pointer group">
                            <input
                              id={option.id}
                              name="responsePreferred"
                              type="radio"
                              checked={responsePreferred === option.label}
                              onChange={() => setResponsePreferred(option.label)}
                              className="h-4 w-4 appearance-none rounded-full border border-brand-gold/60 bg-white checked:bg-brand-gold checked:border-brand-gold checked:ring-2 checked:ring-white checked:ring-inset focus:outline-none transition-all duration-200 cursor-pointer"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 px-8 py-3 text-sm font-bold text-white shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Booking..." : "Book Consultation"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </div>
  );
}
