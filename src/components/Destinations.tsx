"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { DESTINATIONS, mapStoredDestinations } from "@/constants/data";
import ScrollReveal from "@/components/ScrollReveal";

export default function Destinations() {
  const [destinations, setDestinations] = useState(DESTINATIONS);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("quick_holidays_destinations");
    if (stored) {
      try {
        setDestinations(mapStoredDestinations(JSON.parse(stored)));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (destinations.length === 0) return;
    const interval = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % destinations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [destinations.length]);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-20 sm:pb-28">
      {/* Header and CTA */}
      <ScrollReveal animation="fade-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="text-left">
            <span className="text-sm font-bold tracking-widest text-brand-gold uppercase block mb-3">
              Popular Destinations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
              Where Will You Go Next?
            </h2>
          </div>
          <div>
            <Link
              href="/schengen-visa"
              className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] hover:scale-[1.04] transition-all duration-300"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Destinations Grid (5 cards) - Visible on tablet/desktop */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {destinations.map((dest, idx) => (
          <ScrollReveal key={idx} animation="scale-in" delay={idx * 80} className="w-full">
            <div
              className="relative aspect-square w-full rounded-[24px] overflow-hidden shadow-md group cursor-pointer border border-brand-navy/5 transition-all duration-350 hover:-translate-y-2 hover:shadow-xl"
            >
              <Image
                src={dest.image}
                alt={`${dest.name} Travel Destination`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              
              {/* Visual gradient overlay to ensure text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent group-hover:from-brand-navy/90 group-hover:via-brand-navy/35 transition-all duration-300" />

              {/* Destination Name text overlay at bottom-left */}
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-sm group-hover:translate-x-1.5 transition-transform duration-300">
                  {dest.name}
                </h3>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Destinations Mobile Carousel (Auto-rotating, 70% width card) */}
      <div className="block sm:hidden text-center relative px-4">
        {destinations[mobileIndex] && (() => {
          const dest = destinations[mobileIndex];
          return (
            <ScrollReveal key={`mobile-dest-${dest.name}`} animation="scale-in" duration={450}>
              <div
                className="relative aspect-square w-[70%] mx-auto rounded-[24px] overflow-hidden shadow-md group cursor-pointer border border-brand-navy/5 transition-all duration-350"
              >
                <Image
                  src={dest.image}
                  alt={`${dest.name} Travel Destination`}
                  fill
                  sizes="70vw"
                  className="object-cover"
                />
                
                {/* Visual gradient overlay to ensure text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent" />

                {/* Destination Name text overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <h3 className="text-lg font-bold text-white tracking-wide drop-shadow-sm">
                    {dest.name}
                  </h3>
                </div>
              </div>
            </ScrollReveal>
          );
        })()}

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {destinations.map((_, i) => (
            <button
              key={i}
              onClick={() => setMobileIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === mobileIndex ? "w-6 bg-brand-gold" : "w-2.5 bg-brand-gold/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
