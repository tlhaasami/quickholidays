import Image from "next/image";
import Link from "next/link";
import { heroBg, STATS } from "@/constants/data";

export default function Hero() {
  return (
    <section className="relative w-full bg-brand-cream">
      {/* Overflow wrapper for desktop background alignment and mobile stacked layout */}
      <div className="relative w-full overflow-hidden">
        {/* Background Image on Desktop (Right side absolute, no shade/transparency) */}
        <div className="absolute right-0 top-0 bottom-0 h-full w-[55%] z-0 select-none lg:block hidden">
          <Image
            src={heroBg}
            alt="Schengen Visa Background - St. Peter's Basilica Rome"
            fill
            className="object-cover object-right select-none"
            priority
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20 md:pt-36 md:pb-28 lg:pt-40 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-5 text-left z-10">
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-tight text-brand-navy leading-[1.05] mb-6">
                Schengen Visa
                <br />
                Specialist
              </h1>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-lg mb-8">
                We simplify the Schengen visa process for UK residents through expert guidance,
                meticulous application preparation, and personalized support making every journey to
                Europe seamless, confident, and stress-free.
              </p>
            </div>

            {/* Mobile Image Column (Visible only on mobile/tablet, uncropped, no overlay) */}
            <div className="lg:hidden relative w-full h-[300px] sm:h-[420px] md:h-[480px] z-0 select-none">
              <Image
                src={heroBg}
                alt="Schengen Visa Background - St. Peter's Basilica Rome"
                fill
                className="object-contain object-center select-none"
                priority
              />
            </div>

          </div>
        </div>
      </div>

      {/* Floating Statistics Banner (Centered on the bottom border) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-gold rounded-[24px] sm:rounded-full py-6 px-6 sm:px-12 shadow-lg shadow-brand-gold/25 border border-white/20">
          <div className="grid grid-cols-1 gap-6 divide-y divide-brand-navy/10 sm:grid-cols-3 sm:gap-0 sm:divide-y-0 sm:divide-x">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-start sm:justify-center gap-5 py-2 sm:py-0 sm:px-6 transition-all duration-300 hover:scale-[1.03]"
              >
                {/* Stat Icon - Large size, directly on the gold banner background */}
                <div className="flex-shrink-0">
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                {/* Stat Text - Dark Navy */}
                <div className="text-left text-brand-navy">
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold opacity-90 mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
