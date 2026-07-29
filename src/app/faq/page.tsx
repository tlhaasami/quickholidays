"use client";

import React from "react";
import { motion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import Link from "next/link";

interface FAQItem {
  q: string;
  a: React.ReactNode;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

export default function FAQ() {
  const siteConfig = useSiteConfig();
  const faqData: FAQCategory[] = [
    {
      category: "Trust & Company Verification",
      items: [
        {
          q: "Is Quick Holidays Ltd a registered company in the UK?",
          a: `Yes, Quick Holidays Ltd is registered in England & Wales, Company House Number ${siteConfig.companyNumber}. You can search our registration record directly on the official UK government registry. We recommend always verifying company credentials before making any payments online.`
        },
        {
          q: "Do you guarantee that my visa will be approved?",
          a: "No agency can guarantee visa approval, as decision-making power lies solely with the embassies. However, we guarantee the accuracy of our checklists, compilation quality, and application support. If an embassy rejects your visa due to an error we made in checking or preparing your paperwork, we refund our service fee in full under our Accountability Promise."
        },
        {
          q: "Are my passport and documents kept secure?",
          a: "Yes, we prioritize document security. We handle all checks digitally via secure servers and never store physical documents unless explicitly requested. Your passport remains in your possession throughout the preparation stage. During biometrics at the visa center, you hand it directly to TLScontact or VFS Global."
        },
        {
          q: "Where is your physical office located?",
          a: `Our registered physical office is located at ${siteConfig.address}. While we handle all consulting services digitally, you can consult with our team online, by email, phone, or WhatsApp.`
        }
      ]
    },
    {
      category: "The Visa Process",
      items: [
        {
          q: "How long does a Schengen visa take to be processed?",
          a: "Embassies typically take 15 calendar days from your biometrics appointment to return a decision. However, this can stretch to 30 or 45 days during peak travel periods. Finding an appointment slot itself can take additional time, which is why we suggest initiating your case 6–8 weeks before departure."
        },
        {
          q: "What happens during the biometrics appointment?",
          a: "You attend the designated visa center (VFS Global or TLScontact in London, Manchester, or Edinburgh) in person. They will review your prepared application pack (provided by us), collect your biometrics (fingerprints and photo), and retain your passport for delivery to the embassy."
        },
        {
          q: "Can I apply if I have had a Schengen visa refusal before?",
          a: "Yes, you can reapply after a refusal. We specialize in assessing the reasons for previous visa rejections, strengthening your documentation layout, and draft clarifying cover letters to address the embassy's specific concerns."
        }
      ]
    },
    {
      category: "Fees and Payments",
      items: [
        {
          q: "What is the breakdown of Schengen visa fees?",
          a: (
            <span>
              A standard application incurs: (1) Embassy fee (set at €90 for adults by EU law, paid in person at the embassy or visa center during your appointment), (2) Outsourcing partner booking fee (typically £30–£45 paid directly to VFS/TLS during confirmation), and (3) Our fixed consultancy service fee (see our full{" "}
              <Link href="/pricing" className="text-primary hover:underline">
                pricing structures
              </Link>
              ). We do not bundle these fees; everything is transparently itemized so you know exactly what is paid to whom.
            </span>
          )
        },
        {
          q: "What is included in the Complete Visa Service fee?",
          a: "Our Complete Visa Service (£175 total; split as a £45 case deposit to open your file and a £130 balance paid after your slot is confirmed) includes: (1) Free consultation and checklist assessment, (2) A custom document checklist tailored to your profile, (3) A professional cover letter written for you, (4) Fully completed official application forms, (5) Travel insurance sorted to meet Schengen rules, (6) Automated slot tracking and appointment booking, and (7) Case tracking to Decision Day."
        },
        {
          q: "How does the Accountability Promise refund process work?",
          a: "If your visa is rejected, we review the embassy's official refusal letter. If the reason points to an error or omission on our part (e.g. incorrect form box ticked or missing checklist item we verified as ready), we initiate a refund of our service fee in full within 5 working days."
        }
      ]
    },
    {
      category: "Documents",
      items: [
        {
          q: "What are the core documents required for a Schengen visa?",
          a: "Common requirements include: (1) UK Resident Permit (BRP) valid for 3+ months beyond your return date, (2) Travel insurance, (3) Employment details (payslips, tax return, employer letter), (4) UK bank statements (showing sufficient funds to cover your trip), (5) Flights and hotel reservations, and (6) A detailed cover letter. Your custom checklist will outline these based on your exact situation."
        },
        {
          q: "Will the embassy keep my passport?",
          a: "Yes, the visa application center retains your passport during processing so the embassy can stamp the physical visa inside. You can choose to have it couriered back to you or collect it from the center once a decision has been made."
        }
      ]
    }
  ];

  // Compile schema structure for SEO
  const schemaQuestions = faqData.flatMap((cat) => cat.items).map((item) => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.a
    }
  }));

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": schemaQuestions
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-32 pb-24 px-8 sm:px-16 md:px-24 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Schema Script Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />

        {/* Intro */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl font-medium tracking-tight mb-4 text-zinc-900 dark:text-white"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light max-w-xl mx-auto"
          >
            Answers to your queries about UK residence rules, fees, timelines, and document checklists.
          </motion.p>
        </div>

        {/* Categorized FAQs */}
        <div className="space-y-12">
          {faqData.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-white/10 pb-2 text-left">
                {cat.category}
              </h2>
                <Accordion type="multiple" className="w-full space-y-3">
                  {cat.items.map((item, itemIdx) => (
                    <AccordionItem
                      key={item.q}
                      value={`${catIdx}-${itemIdx}`}
                      className="border-b border-zinc-200 dark:border-white/10"
                    >
                      <AccordionTrigger className="hover:underline font-sans font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 py-4">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-zinc-650 dark:text-zinc-400 font-sans text-sm font-light leading-relaxed pb-4 pt-1">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
