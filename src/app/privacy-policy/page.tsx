import type { Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Privacy Policy | Quick Holidays Ltd",
  description: "Read our privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brand-cream text-slate-800 font-sans min-h-screen pt-20">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold mb-3">
              Legal
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-brand-navy">
              Privacy Policy
            </h1>
            <p className="mt-4 text-slate-600">
              Last Updated: July 2026
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150}>
          <div className="bg-white rounded-[32px] border border-brand-gold/15 p-8 sm:p-12 shadow-[0_20px_50px_rgba(15,33,72,0.04)] space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-brand-navy font-serif">1. Introduction</h2>
              <p>
                At Quick Holidays Ltd, we are committed to protecting your privacy and personal data. This privacy policy explains how we collect, use, process, and protect your personal information when you use our Schengen visa consultation services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-brand-navy font-serif">2. Information We Collect</h2>
              <p>
                To assist you with your Schengen visa application, we may collect the following types of information:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Contact details (e.g., name, email address, phone number, physical address).</li>
                <li>Travel history and passport information.</li>
                <li>Employment status, financial information, and UK residency status.</li>
                <li>Any other supporting documentation required for visa applications.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-brand-navy font-serif">3. How We Use Your Information</h2>
              <p>
                We use your personal data to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Provide expert visa consultation and application reviews.</li>
                <li>Help you prepare supporting documentation.</li>
                <li>Assist in scheduling visa appointments.</li>
                <li>Communicate updates regarding your application status.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-brand-navy font-serif">4. Data Security & Storage</h2>
              <p>
                We implement industry-standard security measures to prevent unauthorized access, alteration, disclosure, or destruction of your personal information. Your documents are handled securely and deleted or archived in compliance with UK GDPR regulations after your service is completed.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-brand-navy font-serif">5. Contact Us</h2>
              <p>
                If you have any questions or concerns about this privacy policy, please contact us at:
              </p>
              <p className="font-semibold text-brand-navy">
                Quick Holidays Ltd<br />
                Email: info@quickholidays.co.uk<br />
                Phone: +448000584673<br />
                Address: Office 25 Innovation Park, Edge Lane, Liverpool, England, L7 9NJ
              </p>
            </section>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
