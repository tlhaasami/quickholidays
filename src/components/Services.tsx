import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/constants/data";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      {/* Services Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-16">
        <div className="max-w-2xl text-left">
          <span className="text-sm font-bold tracking-widest text-brand-gold uppercase block mb-3">
            Our Services
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
            Comprehensive
            <br />
            Schengen Visa Services
          </h2>
        </div>
        <div className="max-w-xl text-left">
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 lg:mb-0">
            Our specialist team provides expert guidance and end-to-end support for Schengen Tourist
            Visa applications. From consultation and documentation to appointment assistance and
            submission, we ensure every application is prepared with accuracy, efficiency, and
            confidence.
          </p>
          <div className="mt-4">
            <Link
              href="#consultation"
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-navy/95 transition-all duration-200 hover:scale-[1.02] group"
            >
              Explore all Services
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {SERVICES.map((service, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-white rounded-2xl p-6 shadow-[0_4px_25px_-4px_rgba(15,33,72,0.05)] border border-brand-navy/5 transition-all duration-350 hover:-translate-y-2 hover:shadow-[0_12px_30px_-6px_rgba(15,33,72,0.1)] hover:border-brand-gold/20"
          >
            {/* Service Icon */}
            <div className="mb-6 bg-brand-cream/60 p-3 w-14 h-14 flex items-center justify-center rounded-xl border border-brand-navy/5">
              <Image
                src={service.icon}
                alt={service.title}
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
            </div>
            {/* Service Title */}
            <h3 className="text-base font-bold text-brand-navy leading-snug mb-3">
              {service.title}
            </h3>
            {/* Service Description */}
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-auto">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
