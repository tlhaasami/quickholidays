import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Quick Holidays Ltd",
  description: "Read our terms and conditions to understand your rights and responsibilities when using our services.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-brand-cream text-slate-800 font-sans min-h-screen pt-20">
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-gold mb-3">
            Legal
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-brand-navy">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-slate-600">
            Last Updated: July 2026
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-brand-gold/15 p-8 sm:p-12 shadow-[0_20px_50px_rgba(15,33,72,0.04)] space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-serif">1. Services Provided</h2>
            <p>
              Quick Holidays Ltd provides professional Schengen visa consultation services, including documentation review, application preparation support, and appointment scheduling assistance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-serif">2. Disclaimer of Outcomes</h2>
            <p>
              While we make every effort to maximize the chances of a successful visa outcome, the final decision to grant or refuse a Schengen visa rests solely and exclusively with the respective Embassy, Consulate, or Visa Application Centre. Quick Holidays Ltd does not guarantee visa approval and is not liable for any applications that are refused.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-serif">3. Fees and Refunds</h2>
            <p>
              Our fees cover professional advice, consultation, and preparation services. Embassy/Consulate visa fees and appointment booking service fees are separate and non-refundable once the service is rendered. In the event of a visa refusal, our consultancy fees are generally non-refundable unless specified otherwise in a signed contract.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-serif">4. Client Responsibilities</h2>
            <p>
              Clients are responsible for providing complete, accurate, and genuine information and documentation in a timely manner. Quick Holidays Ltd accepts no liability for delays or rejections caused by inaccurate, missing, or fraudulent documents provided by the client.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-navy font-serif">5. Contact Us</h2>
            <p>
              For questions or clarifications regarding these terms, please contact:
            </p>
            <p className="font-semibold text-brand-navy">
              Quick Holidays Ltd<br />
              Email: info@quickholidays.co.uk<br />
              Phone: +448000584673<br />
              Address: 39 Stanley Street, Fairfield, Liverpool, L7 0JN
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
