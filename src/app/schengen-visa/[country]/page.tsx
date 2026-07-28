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
                description: "Everything handled. Start to finish. Nothing left for you to figure out. This is our premium, end-to-end service designed for maximum peace of mind.",
                features: [
                  "Consultation: Cost, checklist, and timeline assessment provided before you pay.",
                  "Custom Document Checklist: Built perfectly for your exact situation and profile.",
                  "Professional Cover Letter: Written for you to present a compelling and accurate itinerary to the embassy.",
                  "Visa Application Forms: Completed for you to ensure zero errors.",
                  "Travel Insurance: Sorted and guaranteed to meet Schengen requirements.",
                  "Appointment Booking & Confirmation: Your appointment is booked and confirmed, with your letter ready.",
                  "Flights and Hotels guidance: We help you find the cheapest refundable options — booked and paid directly by you. Not included in our fee.",
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
                description: "Your paperwork, done right — you handle the appointment yourself. Perfect if you already have an appointment booked.",
                features: [
                  "Document Checklist: Built precisely for your personal and financial profile.",
                  "Professional Cover Letter: Expertly written for you.",
                  "Travel Insurance: Sorted for your exact travel dates.",
                  "Flights and Hotels guidance: We help identify cheapest refundable options — booked and paid directly by you."
                ],
                notIncluded: [
                  "Appointment booking & confirmation",
                  "Visa application form completion",
                  "Tracked to Decision Day status monitoring",
                  "Consultation timeline assessment before you pay"
                ],
                buttonText: "Book Documentation",
                buttonHref: `/contact-us?plan=documentation&destination=${match.slug}`,
                popular: false
              },
              {
                name: "Appointment Booking Service",
                originalPrice: "£145",
                price: "£95",
                period: "per applicant",
                description: "Already have your documents ready? We secure your biometrics appointment and complete your application form.",
                features: [
                  "Appointment Booking: Secured and confirmed at your preferred centre.",
                  "Visa Application Form: Completed for you accurately."
                ],
                notIncluded: [
                  "Custom Document Checklist",
                  "Professional Cover Letter",
                  "Travel Insurance sorted",
                  "Flights and Hotels guidance",
                  "Tracked to Decision Day status monitoring"
                ],
                buttonText: "Book Appointment",
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
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs font-light text-zinc-700 dark:text-zinc-300">
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
                          <li key={item} className="flex items-center gap-2 text-xs text-zinc-505 dark:text-zinc-400 line-through">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500 shrink-0">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
              <h4 className="font-sans font-bold text-sm text-zinc-900 dark:text-white mb-2">Can you help with flights and hotels?</h4>
              <p className="font-sans text-zinc-650 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                Yes, we construct compliant flight itineraries and hotel bookings (refundable/pay-at-property) so you do not buy real tickets before obtaining approval.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
