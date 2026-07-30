import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { COUNTRIES } from "@/constants";
import { TypeformForm } from "@/components/TypeformForm";
import { ClientTracker } from "./ClientTracker";

// Generate Static Params for Next.js build-time prerendering
export async function generateStaticParams() {
  return COUNTRIES.map((c) => ({
    country: c.slug,
  }));
}

// Generate dynamic Metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ country: string }> 
}): Promise<Metadata> {
  const { country } = await params;
  const match = COUNTRIES.find((c) => c.slug === country);
  const name = match ? match.name : country.toUpperCase();
  return {
    title: `${name} Schengen Visa from the UK — Fees & How It Works | Quick Holidays`,
    description: `${name} short-stay visa for non-UK nationals living in the UK: embassy fee, our process, and honest timelines.`,
    openGraph: {
      title: `${name} Schengen Visa from the UK — Fees & How It Works | Quick Holidays`,
      description: `${name} short-stay visa for non-UK nationals living in the UK: embassy fee, our process, and honest timelines.`,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${name} Schengen Visa - Quick Holidays`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} Schengen Visa from the UK | Quick Holidays`,
      description: `${name} short-stay visa for non-UK nationals living in the UK: embassy fee, our process, and honest timelines.`,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function CountryPage({ 
  params 
}: { 
  params: Promise<{ country: string }> 
}) {
  const { country } = await params;
  const match = COUNTRIES.find((c) => c.slug === country);
  
  if (!match) {
    return (
      <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white flex flex-col items-center justify-center p-8 transition-colors duration-300">
        <h1 className="font-serif text-3xl mb-4">Country Not Found</h1>
        <Link href="/schengen-visa" className="text-primary underline">Return to selector</Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-32 pb-24 px-8 sm:px-16 md:px-24 transition-colors duration-300">
      {/* Injects client-side ViewContent analytics tracking */}
      <ClientTracker countryName={match.name} />

      <div className="max-w-5xl mx-auto text-left">
        
        {/* Intro Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-zinc-200 dark:border-white/10 pb-8 mb-12">
          <div className="space-y-3">
            <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Schengen Visa Guide</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              {match.name} Schengen Visa from the UK
            </h1>
            <p className="font-sans text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-xl">
              Applying for a {match.name} short-stay (tourist) visa as a non-UK national living in the UK? Here's what it costs, and how we handle it with you.
            </p>
          </div>
          <Image 
            src={match.flag} 
            alt={`${match.name} Flag`} 
            width={96}
            height={64}
            className="w-24 h-16 object-cover rounded-md border border-zinc-200 dark:border-white/10 filter drop-shadow-lg shrink-0 self-start sm:self-center"
          />
        </div>

        {/* Costs Table */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-6 text-zinc-900 dark:text-white">Service Options & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch w-full text-left">
            {[
              {
                name: "Complete Visa Service",
                originalPrice: "£270",
                price: "£175",
                period: "per applicant",
                depositNote: "£45 case deposit to start • £130 balance after slot is secured",
                description: "Everything handled. Start to finish. Nothing left for you to figure out. This is our premium, end-to-end service designed for maximum peace of mind. We take over the entire process so you can focus on planning your trip, knowing every detail is managed by professionals.",
                features: [
                  "Consultation: Cost, checklist, and assessment provided before you pay.",
                  "Custom Document Checklist: Built perfectly for your exact situation and profile.",
                  "Professional Cover Letter: Written for you to present a compelling and accurate itinerary to the embassy.",
                  "Visa Application Forms: Completed for you to ensure zero errors.",
                  "Travel Insurance: Sorted and guaranteed to meet Schengen requirements.",
                  "Appointment Booking & Confirmation: Your appointment is booked and confirmed, with your letter ready.",
                  <span>Flight & Hotel: Guidance on cheapest options <strong className="text-primary font-semibold">(booking costs paid by you directly)</strong>.</span>,
                  "Tracked to Decision Day: Continuous monitoring of your application status."
                ],
                footerNote: "One price. Every step covered.",
                buttonText: "Book Complete Service",
                buttonHref: `/contact-us?plan=complete&destination=${match.slug}`,
                popular: true
              },
              {
                name: "Documentation Service",
                originalPrice: "£145",
                price: "£95",
                period: "per applicant",
                description: "Your paperwork, done right — you handle the appointment yourself. This package is ideal if you already have an appointment booked or prefer to manage the portal yourself, but want the assurance that your file is flawless.",
                features: [
                  "Document Checklist: Built precisely for your personal and financial profile.",
                  "Professional Cover Letter: Expertly written for you.",
                  "Travel Insurance: Sorted for your exact travel dates.",
                  <span>Flight & Hotel: Guidance on cheapest options <strong className="text-primary font-semibold">(booking costs paid by you directly)</strong>.</span>
                ],
                notIncluded: [
                  "Appointment booking & confirmation",
                  "Visa application form completion",
                  "Tracked to Decision Day status monitoring",
                  "Pre-payment eligibility consultation"
                ],
                buttonText: "Book Documentation Service",
                buttonHref: `/contact-us?plan=documentation&destination=${match.slug}`,
                popular: false
              },
              {
                name: "Appointment Booking Service",
                originalPrice: "£145",
                price: "£95",
                period: "per applicant",
                description: "Already have your documents ready? This is for you. Appointment slots disappear in seconds. With this service, our processing team uses their continuous monitoring systems to secure your spot without the headache.",
                features: [
                  "Appointment Booking: Secured and confirmed at your preferred centre.",
                  "Visa Application Form: Completed for you accurately."
                ],
                notIncluded: [
                  "Custom Document Checklist",
                  "Professional Cover Letter",
                  "Travel Insurance sorted",
                  "Flight & Hotel booking guidance",
                  "Tracked to Decision Day status monitoring",
                  "Pre-payment eligibility consultation"
                ],
                buttonText: "Book Appointment Booking",
                buttonHref: `/contact-us?plan=appointment&destination=${match.slug}`,
                popular: false
              }
            ].map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 relative ${
                  tier.popular
                    ? "bg-zinc-50 dark:bg-zinc-900/60 border-primary shadow-2xl scale-100 z-10"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-white/10"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] tracking-widest font-sans font-bold uppercase py-1 px-3 rounded-full shadow-lg">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="font-sans text-zinc-500 dark:text-zinc-400 text-xs mb-4 font-light leading-relaxed">
                    {tier.description}
                  </p>
                  
                  {tier.depositNote && (
                    <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-sans font-semibold px-3 py-1.5 rounded-lg mb-4 leading-normal">
                      {tier.depositNote}
                    </div>
                  )}

                  <div className="flex items-baseline gap-1.5 mb-4">
                    {tier.originalPrice && (
                      <span className="line-through text-zinc-400 dark:text-zinc-500 text-base font-normal mr-1">
                        {tier.originalPrice}
                      </span>
                    )}
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
                      {tier.price}
                    </span>
                    <span className="font-sans text-zinc-500 dark:text-zinc-400 text-xs font-light ml-0.5">
                      / {tier.period}
                    </span>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs font-light text-zinc-700 dark:text-zinc-300">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary shrink-0 mt-0.5">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.notIncluded && (
                    <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-white/5 mb-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-2">What is NOT Included:</span>
                      <ul className="space-y-2">
                        {tier.notIncluded.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 line-through">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500 shrink-0">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {tier.footerNote && (
                    <p className="font-sans text-[11px] italic text-zinc-550 dark:text-zinc-400 mb-6 font-light">
                      {tier.footerNote}
                    </p>
                  )}
                </div>
                <Link
                  href={tier.buttonHref}
                  className={`w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl font-sans text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
                    tier.popular
                      ? "text-black bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary"
                      : "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10"
                  }`}
                >
                  {tier.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Embassy Fees Block */}
        <div className="bg-amber-500/5 border border-primary/20 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl text-left">
            <h4 className="font-serif text-lg font-semibold text-zinc-900 dark:text-white">Mandatory Embassy Visa Fees</h4>
            <p className="font-sans text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              In addition to our service fees, all Schengen embassies charge a mandatory visa fee. The standard fee is <strong>€90 (approx. £78)</strong> for adults and <strong>€45 (approx. £39)</strong> for children aged 6–12 (free for children under 6). This is paid directly to the embassy visa application center (VFS/TLS) at your biometrics appointment.
            </p>
          </div>
          <div className="bg-primary/10 border border-primary/20 px-4 py-2.5 rounded-xl text-center shrink-0 self-start sm:self-center">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-primary">Standard Fee</span>
            <span className="font-serif text-2xl font-bold text-primary">€90 / €45</span>
          </div>
        </div>

        {/* Embassy Variations Note */}
        <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 p-6 rounded-xl mb-16">
          <p className="font-sans text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            <strong>Embassy Variations:</strong> Documents and processing times can vary slightly by embassy. We'll confirm your exact checklist and a realistic timeline at your consultation — before you pay anything.
          </p>
        </div>

        {/* Embedded Qualifying Enquiry Form */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-semibold mb-3 text-zinc-900 dark:text-white">Ready to start your {match.name} application?</h2>
            <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 font-light">
              Book a consultation and we'll confirm your exact checklist, your costs, and a realistic timeline — before you pay anything.
            </p>
          </div>
          <TypeformForm defaultDestination={match.slug} />
        </div>

        {/* FAQ Snippet (3 Cards) */}
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-6 text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/40 p-6 rounded-xl">
              <h4 className="font-sans font-bold text-sm text-zinc-900 dark:text-white mb-2">How long does it take?</h4>
              <p className="font-sans text-zinc-650 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                Typically around 15 calendar days after your biometrics date, but embassies get busy — especially May to August. We recommend starting 6-8 weeks before travel.
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/40 p-6 rounded-xl">
              <h4 className="font-sans font-bold text-sm text-zinc-900 dark:text-white mb-2">What if my visa is refused?</h4>
              <p className="font-sans text-zinc-650 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                If the refusal is caused by a documented error on our side, we refund our service fee in full under our Accountability Promise. We stand behind our document checks.
              </p>
            </div>
            <div className="border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/40 p-6 rounded-xl">
              <h4 className="font-sans font-bold text-sm text-zinc-900 dark:text-white mb-2">What happens at my biometrics appointment?</h4>
              <p className="font-sans text-zinc-650 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                You will submit your printed forms, passport, BRP, travel insurance certificate, and other supporting documents, and have your biometrics taken. Your passport will be retained for visa stamping.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
