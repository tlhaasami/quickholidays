import Image from "next/image";
import Link from "next/link";
import { heroBg, STATS } from "@/constants/data";

export default function Hero() {
  return (
    <section className="relative w-full">
      {/* Main Hero Container */}
      <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[680px] w-full flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBg}
            alt="Schengen Visa Background - St. Peter's Basilica Rome"
            fill
            className="object-cover object-[center_right] md:object-right-bottom select-none"
            priority
          />
          {/* Subtle gradient overlay to make text readable on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-cream via-brand-cream/80 to-transparent md:from-brand-cream/95 md:via-brand-cream/70 md:to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-xl md:max-w-2xl text-left">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-navy leading-[1.1] mb-6">
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
        </div>
      </div>

      {/* Floating Statistics Banner */}
      <div className="relative z-20 -mt-10 sm:-mt-12 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-gold rounded-[24px] sm:rounded-full py-6 px-6 sm:px-12 shadow-lg shadow-brand-gold/25 border border-white/20">
          <div className="grid grid-cols-1 gap-6 divide-y divide-white/20 sm:grid-cols-3 sm:gap-0 sm:divide-y-0 sm:divide-x">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-start sm:justify-center gap-4 py-2 sm:py-0 sm:px-6 transition-all duration-300 hover:scale-[1.03]"
              >
                {/* Stat Icon */}
                <div className="flex-shrink-0 bg-white/20 p-2.5 rounded-full border border-white/10 shadow-inner">
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain filter brightness-0 invert"
                  />
                </div>
                {/* Stat Text */}
                <div className="text-left text-white">
                  <div className="text-3xl font-extrabold tracking-tight leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium opacity-90 mt-1">
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
