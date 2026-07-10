import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/constants/data";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12 sm:pb-16">
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
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-brand-navy/95 transition-all duration-200 hover:scale-[1.02] group"
            >
              Explore all Services
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 text-brand-gold transition-transform group-hover:translate-x-1"
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
            className="flex flex-col items-center text-center bg-white rounded-[24px] pt-8 pb-6 px-6 border-[1.5px] border-slate-100 shadow-[0_4px_20px_rgba(15,33,72,0.03)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(15,33,72,0.08)] hover:border-brand-gold"
          >
            {/* Service Icon - Centered and uniform size */}
            <div className="mb-6 relative w-16 h-16 select-none flex items-center justify-center">
              <Image
                src={service.icon}
                alt={service.title}
                fill
                className="object-contain object-center select-none"
              />
            </div>
            {/* Service Title - serif styling to match main header */}
            <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-navy leading-snug mb-3 min-h-[56px] flex items-center justify-center">
              {service.title}
            </h3>
            {/* Service Description */}
            <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mt-2">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
