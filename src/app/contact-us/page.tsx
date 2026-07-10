import Image from "next/image";
import { contactUsBg } from "@/constants/data";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContactUsPage() {
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
              className="object-cover object-right select-none"
              priority
            />
            <div className="absolute inset-0 bg-brand-cream/95 md:bg-brand-cream/70 lg:bg-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
            <ScrollReveal animation="fade-up">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold mb-4">
                  Contact Us
                </p>
                <h1 className="text-5xl sm:text-6xl font-serif font-extrabold text-brand-navy leading-tight">
                  We’re Here to Help.
                  <br />
                  Let’s Get in Touch.
                </h1>
                <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-700 leading-relaxed">
                  Have questions about your Schengen Visa application? Our team is ready to assist you at every step with expert guidance, clear next steps, and personalised support.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="scale-in" delay={150}>
              <div className="mt-16 max-w-4xl">
                <div className="rounded-[40px] border border-brand-gold/20 bg-brand-cream/95 p-8 shadow-[0_25px_80px_rgba(15,33,72,0.06)] backdrop-blur-sm">
                  <form className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-semibold text-brand-navy mb-2">
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="Full Name"
                          className="w-full rounded-xl border border-brand-gold/30 bg-brand-cream/70 px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-brand-navy mb-2">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Email"
                          className="w-full rounded-xl border border-brand-gold/30 bg-brand-cream/70 px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-brand-navy mb-2">
                          Phone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
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
                              className="h-4 w-4 appearance-none rounded-full border border-brand-gold/60 bg-white checked:bg-brand-gold checked:border-brand-gold checked:ring-2 checked:ring-white checked:ring-inset focus:outline-none transition-all duration-200 cursor-pointer"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="inline-flex items-center justify-center rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 px-8 py-3 text-sm font-bold text-white shadow-md cursor-pointer">
                        Book Consultation
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
