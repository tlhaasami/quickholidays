"use client";

import React from "react";
import { motion } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";
import { WobbleCard } from "@/components/ui/wobble-card";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function AboutUs() {
  const siteConfig = useSiteConfig();

  const team = [
    {
      name: "Sophia",
      role: "Senior Visa Consultant",
      description: "Specializes in complex student and skilled worker applications. Praised by clients for her patience and responsiveness.",
      quote: "Sophia was patient and understanding with all my queries."
    },
    {
      name: "Nile",
      role: "Biometrics and Slot Specialist",
      description: "Manages appointment tracking and consulate schedules. Known for sticking with clients through biometrics day.",
      quote: "Nile was with me even on the day of my biometrics."
    },
    {
      name: "Emma",
      role: "Document Audit Coordinator",
      description: "Directs file preparation, checklists, and application drafts. Client review verdict: 'Emma needs a raise!'",
      quote: " seamless process, staff were supportive. Emma needs a raise!"
    },
    {
      name: "Anaya",
      role: "Schengen Slot Tracker",
      description: "Monitors TLScontact and VFS Global portals. Secured appointments in under 7 days for prior-refusal cases.",
      quote: "Anaya was great help, got my appointment within a week!"
    },
    {
      name: "Jenny",
      role: "Family Visa Specialist",
      description: "Coordinates multi-applicant cases for families, spouses, and dependents. Ensures zero document checks are missed.",
      quote: "Jenny handled all the documentation smoothly and made it stress-free."
    },
    {
      name: "Lisa",
      role: "Customer Success Lead",
      description: "Ensures every client gets a clear go/no-go assessment during their free consultation.",
      quote: "I am very happy with your service, really appreciate it, Lisa."
    }
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-20 pb-32 px-6 sm:px-12 md:px-24 transition-colors duration-300">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-primary font-sans text-xs font-bold uppercase tracking-widest block mb-3"
          >
            Our Philosophy
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-6 text-zinc-900 dark:text-white leading-tight"
          >
            We started this because<br />
            <Highlighter action="underline" color="#CCA352" strokeWidth={2.5} isView={true}>
              we'd been through it.
            </Highlighter>
          </motion.h1>
        </div>

        {/* Founder Story Block */}
        <WobbleCard 
          containerClassName="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 mb-20 shadow-2xl" 
          className="p-8 sm:p-12 text-zinc-700 dark:text-zinc-250 font-serif text-lg sm:text-xl leading-relaxed space-y-6"
        >
          <p>
            Our founder, Talha, came to the UK on a skilled worker visa. The first time he applied for a Schengen visa, he was refused because of a minor document check omission by a high-priced agency that vanished as soon as the rejection letter arrived. He lost his booking deposit, his vacation was cancelled, and he had no recourse.
          </p>
          <p>
            It felt incredibly frustrating and unfair. You spend months planning a holiday, pay high upfront consulting fees, only to be left in the dark when something goes wrong. We built <span className="text-primary font-semibold">Quick Holidays</span> to change this.
          </p>
          <p className="font-sans text-sm sm:text-base italic text-zinc-500 dark:text-zinc-400 font-light">
            "No consultancy can sell you a guaranteed visa; anyone who says otherwise is lying to you. We focus on absolute document accuracy, constant monitoring for appointment slots, and real accountability."
          </p>
        </WobbleCard>

        {/* What We Do Differently */}
        <div className="mb-20">
          <h2 className="font-serif text-2xl sm:text-3xl text-zinc-900 dark:text-white font-medium mb-8 border-b border-zinc-200 dark:border-white/10 pb-3">
            What we do differently
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-2xl">
              <h3 className="font-serif text-lg sm:text-xl text-zinc-900 dark:text-white mb-3">We tell you the truth first</h3>
              <p className="font-sans text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 font-light leading-relaxed">
                If your application is likely to be refused due to your current BRP validity, savings, or circumstances, we'll tell you directly during the free consultation — before you pay us a single penny. We'd rather lose a booking than waste your time and embassy fees.
              </p>
            </div>
            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-2xl">
              <h3 className="font-serif text-lg sm:text-xl text-zinc-900 dark:text-white mb-3">We write our promises down</h3>
              <p className="font-sans text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 font-light leading-relaxed">
                Our Accountability Promise and Refund Policy are linked directly on the homepage. If a refusal is caused by an administrative check error on our part, we refund your consulting fees in full within 5 working days. No excuses.
              </p>
            </div>
            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-2xl">
              <h3 className="font-serif text-lg sm:text-xl text-zinc-900 dark:text-white mb-3">We are a registered business</h3>
              <p className="font-sans text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 font-light leading-relaxed">
                Quick Holidays Ltd is an officially registered company in England and Wales (Company No. {siteConfig.companyNumber}). Our physical address is Office 25 Innovation Park, Edge Lane, Liverpool, L7 9NJ. We recommend you verify us on Companies House before you book.
              </p>
            </div>
          </div>
        </div>

        {/* Who We Help */}
        <div className="mb-20">
          <h2 className="font-serif text-2xl sm:text-3xl text-zinc-900 dark:text-white font-medium mb-6 border-b border-zinc-200 dark:border-white/10 pb-3">
            Who we help
          </h2>
          <p className="font-sans text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-light leading-relaxed max-w-3xl mb-4">
            We specialize specifically in helping **non-UK nationals living in the UK** secure European tourist (Schengen) visas. 
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm text-zinc-700 dark:text-zinc-300 font-light">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>BRP (Biometric Residence Permit) holders</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>Skilled Worker / Tier 2 visa holders</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>Spouse and dependent visa holders</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>International students (Tier 4 visa holders)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>Applicants who have faced a prior visa refusal</span>
            </li>
          </ul>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="font-serif text-2xl sm:text-3xl text-zinc-900 dark:text-white font-medium mb-3">
            Meet the team
          </h2>
          <p className="font-sans text-sm sm:text-base text-zinc-650 dark:text-zinc-400 font-light leading-relaxed mb-8 max-w-2xl">
            You'll work with a named consultant from consultation to passport return — not a support ticket system. Here are the people named by our clients:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div 
                key={member.name} 
                className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {/* Circle avatar placeholder with initials */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-sm font-bold border border-primary/20">
                      {member.name[0]}
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold text-zinc-900 dark:text-white leading-tight">
                        {member.name}
                      </h4>
                      <span className="text-[9px] font-sans text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mt-0.5">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-zinc-650 dark:text-zinc-400 font-light leading-relaxed mb-4">
                    {member.description}
                  </p>
                </div>
                
                <div className="border-t border-zinc-200 dark:border-white/5 pt-3 mt-2">
                  <span className="text-xs font-sans italic text-zinc-650 dark:text-zinc-300 block leading-relaxed">
                    &ldquo;{member.quote}&rdquo;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Link */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-zinc-200 dark:border-white/10 pt-8 text-center text-zinc-500 font-sans text-sm font-light"
        >
          Quick Holidays Ltd is registered in England and Wales, Company No. {siteConfig.companyNumber}. You can check our official business status by viewing our record at{" "}
          <a
            href={`https://find-and-update.company-information.service.gov.uk/company/${siteConfig.companyNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-zinc-900 dark:hover:text-white underline transition-colors font-semibold"
          >
            Companies House →
          </a>
        </motion.div>

      </div>
    </div>
  );
}
