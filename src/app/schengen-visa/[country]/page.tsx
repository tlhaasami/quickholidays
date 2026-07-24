import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-8">
        <h1 className="font-serif text-3xl mb-4">Country Not Found</h1>
        <Link href="/schengen-visa" className="text-primary underline">Return to selector</Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pt-32 pb-24 px-8 sm:px-16 md:px-24">
      {/* Injects client-side ViewContent analytics tracking */}
      <ClientTracker countryName={match.name} />

      <div className="max-w-4xl mx-auto text-left">
        
        {/* Intro Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/10 pb-8 mb-12">
          <div className="space-y-3">
            <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">Schengen Visa Guide</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-white">
              {match.name} Schengen Visa from the UK
            </h1>
            <p className="font-sans text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-xl">
              Applying for a {match.name} short-stay (tourist) visa as a non-UK national living in the UK? Here's what it costs, and how we handle it with you.
            </p>
          </div>
          <img 
            src={match.flag} 
            alt={`${match.name} Flag`} 
            className="w-24 h-16 object-cover rounded-md border border-white/10 filter drop-shadow-lg shrink-0 self-start sm:self-center"
          />
        </div>

        {/* Costs Table */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-6 text-white">Costs Breakdown</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left border-collapse font-sans text-sm">
              <thead>
                <tr className="bg-zinc-950 border-b border-white/10 text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="px-6 py-4">Cost Item</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                <tr>
                  <td className="px-6 py-4 font-semibold text-white">Embassy Fee (Adult)</td>
                  <td className="px-6 py-4 text-primary font-bold">€90</td>
                  <td className="px-6 py-4 font-light text-zinc-400">Set by EU regulation. Children 6-12: €45; under 6: free. Same across all Schengen countries.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-white">Our Service Fee</td>
                  <td className="px-6 py-4 text-primary font-bold">£290</td>
                  <td className="px-6 py-4 font-light text-zinc-400">Fixed, agreed in writing before we start. Covers the full QuickVisa Assurance Process.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-white">Deposit to Begin</td>
                  <td className="px-6 py-4 text-primary font-bold">£150</td>
                  <td className="px-6 py-4 font-light text-zinc-400">Starts your case: assessment, checklist, appointment search. Balance due once biometrics slot confirmed.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Embassy Variations Note */}
        <div className="bg-zinc-950 border border-white/5 p-6 rounded-xl mb-16">
          <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed">
            <strong>Embassy Variations:</strong> Documents and processing times can vary slightly by embassy. We'll confirm your exact checklist and a realistic timeline at your free consultation — before you pay anything.
          </p>
        </div>

        {/* Embedded Qualifying Enquiry Form */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-semibold mb-3 text-white">Ready to start your {match.name} application?</h2>
            <p className="font-sans text-sm text-zinc-400 font-light">
              Book a free consultation and we'll confirm your exact checklist, your costs, and a realistic timeline — before you pay anything.
            </p>
          </div>
          <TypeformForm defaultDestination={match.slug} />
        </div>

        {/* FAQ Snippet (3 Cards) */}
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-6 text-white">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/5 bg-zinc-950/40 p-6 rounded-xl">
              <h4 className="font-sans font-bold text-sm text-white mb-2">How long does it take?</h4>
              <p className="font-sans text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                Typically around 15 calendar days after your biometrics date, but embassies get busy — especially May to August. We recommend starting 6-8 weeks before travel.
              </p>
            </div>
            <div className="border border-white/5 bg-zinc-950/40 p-6 rounded-xl">
              <h4 className="font-sans font-bold text-sm text-white mb-2">What if my visa is refused?</h4>
              <p className="font-sans text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                If the refusal is caused by a documented error on our side, we refund our service fee in full under our Accountability Promise. We stand behind our document checks.
              </p>
            </div>
            <div className="border border-white/5 bg-zinc-950/40 p-6 rounded-xl">
              <h4 className="font-sans font-bold text-sm text-white mb-2">Can you help with flights and hotels?</h4>
              <p className="font-sans text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                Yes, we construct compliant flight itineraries and hotel bookings (refundable/pay-at-property) so you do not buy real tickets before obtaining approval.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
