import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { schengenVisaBg, flagPlaceholder, SCHENGEN_DESTINATIONS } from "@/constants/data";

export default function SchengenVisaPage() {
  const checklist = [
    {
      title: "Fastest Process",
      desc: "Efficient application designed to save you time.",
    },
    {
      title: "Stress-Free Experience",
      desc: "We handle the details so you can apply with confidence.",
    },
    {
      title: "Highest Visa Approval",
      desc: "Every application is prepared with precision and care.",
    },
    {
      title: "Expert Support",
      desc: "Dedicated Schengen specialists guiding you every step.",
    },
  ];

  return (
    <div className="bg-brand-cream text-slate-800 font-sans min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-brand-cream min-h-[90vh] flex items-center">
          {/* Backdrop Image */}
          <div className="absolute inset-0 z-0 select-none overflow-hidden">
            <Image
              src={schengenVisaBg}
              alt="Schengen Visa Background"
              fill
              className="object-cover object-center select-none scale-[1.02] origin-top"
              priority
            />
            {/* Soft bottom fade-to-cream gradient */}
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 bg-gradient-to-t from-brand-cream via-brand-cream/80 to-transparent pointer-events-none z-10" />
            {/* Soft overlay to make text highly readable */}
            <div className="absolute inset-0 bg-brand-cream/15 z-0" />
          </div>

          {/* Hero Content Grid */}
          <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="max-w-2xl text-left space-y-6">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-gold block">
                Schengen Tourist Visa
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-navy leading-[1.1] font-serif">
                Apply Your <br />
                Schengen Visa
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We specialize exclusively in Schengen Tourist Visa applications for UK residents. Choose your destination and let our dedicated specialists guide you through every stage of the application with expert support, accurate preparation, and a fast, stress-free process.
              </p>

              {/* Checklist list style */}
              <div className="pt-4 space-y-4 max-w-lg">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    {/* Tiny gold dot bullet */}
                    <div className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-brand-gold" />
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Destination Chooser Grid */}
        <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
            <div className="text-left space-y-3.5 md:max-w-md">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-gold block">
                We're Here To Help
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight leading-[1.15]">
                Choose Your <br />
                Destination
              </h2>
            </div>
            <div className="md:max-w-xl text-left">
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed border-l-2 border-brand-gold/30 pl-6">
                We provide expert consultation and application support for Schengen Tourist Visas across all Schengen member countries. Select your destination and begin your application with confidence.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {SCHENGEN_DESTINATIONS.map((dest, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-between bg-white rounded-[24px] p-8 border-[1.5px] border-slate-100 shadow-[0_4px_20px_rgba(15,33,72,0.03)] text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(15,33,72,0.08)] hover:border-brand-gold group"
              >
                {/* Flag Area */}
                <div className="relative w-24 h-16 mb-6 overflow-hidden rounded-lg border border-slate-100 shadow-sm flex items-center justify-center bg-slate-50">
                  <Image
                    src={dest.flag}
                    alt={`${dest.name} Flag`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Country Name */}
                <h3 className="text-base font-bold text-brand-navy tracking-tight mb-2">
                  {dest.name}
                </h3>

                {/* Arrow Button */}
                <div className="mt-4 flex items-center justify-center w-10 h-10 rounded-full border border-brand-gold/60 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
