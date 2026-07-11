"use client";

import { useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import { formBg } from "@/constants/data";

type ConsultationFormProps = {
  backgroundImage?: StaticImageData;
  title?: string;
  subtitle?: string;
  sectionId?: string;
  showBackground?: boolean;
  showSectionWrapper?: boolean;
  wrapperClassName?: string;
};

export default function ConsultationForm({
  backgroundImage,
  title = "Need a Consultation?",
  subtitle = "Our team is ready to assist you at every step of your Schengen visa journey.",
  sectionId = "consultation",
  showBackground = true,
  showSectionWrapper = true,
  wrapperClassName = "",
}: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    city: "",
    pastVisas: "",
    preferredContact: "call",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, preferredContact: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        nationality: "",
        city: "",
        pastVisas: "",
        preferredContact: "call",
      });
    }, 1500);
  };

  const [customBg, setCustomBg] = useState<string | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("quick_holidays_bg_consultation_form");
    if (stored) {
      setCustomBg(stored);
    }
  }, []);

  const background = customBg || backgroundImage || formBg;

  return (
    <section id={sectionId} className="relative w-full overflow-hidden py-20 sm:py-28 border-t border-brand-navy/5 bg-brand-cream">
      {/* Full background sketch image */}
      {showBackground && (
        <div className="absolute inset-0 z-0 select-none">
          {customBg ? (
            <img
              src={customBg}
              alt="Schengen Consultation Sketch Backdrop"
              onLoad={() => setBgLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover object-bottom-right select-none transition-all duration-[1500ms] ease-out ${
                bgLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-sm"
              }`}
            />
          ) : (
            <Image
              src={background}
              alt="Schengen Consultation Sketch Backdrop"
              fill
              sizes="100vw"
              onLoad={() => setBgLoaded(true)}
              className={`object-cover object-bottom-right select-none transition-all duration-[1500ms] ease-out ${
                bgLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.05] blur-sm"
              }`}
              priority
            />
          )}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-left mb-12 sm:mb-16">
          <span className="text-sm font-bold tracking-widest text-brand-gold uppercase block mb-3">
            Schengen Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
            Need a Consultation?
          </h2>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl relative z-10 text-left">
          {success ? (
            <div className="bg-white rounded-3xl p-8 border border-green-200 shadow-md max-w-xl text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Consultation Booked!</h3>
              <p className="text-slate-600 text-sm">
                Thank you for reaching out. A Schengen Visa Specialist will contact you shortly during your preferred time.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-gold-dark transition-all"
              >
                Book another consultation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Form Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Column 1 */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-bold text-brand-navy mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-brand-navy/10 bg-white/60 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 backdrop-blur-sm focus:border-brand-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-brand-navy mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +44 7123 456789"
                      className="w-full rounded-xl border border-brand-navy/10 bg-white/60 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 backdrop-blur-sm focus:border-brand-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="pastVisas" className="block text-sm font-bold text-brand-navy mb-2">
                      Schengen Visas issued during the past three years
                    </label>
                    <input
                      type="text"
                      id="pastVisas"
                      name="pastVisas"
                      value={formData.pastVisas}
                      onChange={handleChange}
                      placeholder="e.g. 1 (issued in 2024), None"
                      className="w-full rounded-xl border border-brand-navy/10 bg-white/60 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 backdrop-blur-sm focus:border-brand-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-brand-navy mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      className="w-full rounded-xl border border-brand-navy/10 bg-white/60 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 backdrop-blur-sm focus:border-brand-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="nationality" className="block text-sm font-bold text-brand-navy mb-2">
                      Nationality
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      name="nationality"
                      required
                      value={formData.nationality}
                      onChange={handleChange}
                      placeholder="e.g. British, Indian"
                      className="w-full rounded-xl border border-brand-navy/10 bg-white/60 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 backdrop-blur-sm focus:border-brand-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-bold text-brand-navy mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. London"
                      className="w-full rounded-xl border border-brand-navy/10 bg-white/60 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 backdrop-blur-sm focus:border-brand-gold focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-200"
                    />
                  </div>
                </div>

              </div>

              {/* Radio Selector preferred contact method */}
              <div className="pt-4">
                <span className="block text-sm font-bold text-brand-navy mb-4">
                  Response Preferred By
                </span>
                <div className="flex flex-wrap gap-8">
                  {["call", "email", "whatsapp"].map((method) => (
                    <label
                      key={method}
                      onClick={() => handleRadioChange(method)}
                      className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                      {/* Styled Custom Radio */}
                      <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-brand-gold/60 bg-white group-hover:border-brand-gold transition-all duration-200">
                        {formData.preferredContact === method && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-scaleUp" />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 capitalize">
                        By {method === "whatsapp" ? "Whatsapp" : method}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 px-8 py-3 text-sm font-bold text-white shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Booking...
                    </span>
                  ) : (
                    "Book Consultation"
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </section>
  );
}
