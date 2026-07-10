import Image from "next/image";
import Link from "next/link";
import { DESTINATIONS } from "@/constants/data";

export default function Destinations() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      {/* Header and CTA */}
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
            href="#consultation"
            className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-navy/95 transition-all duration-200 hover:scale-[1.02]"
          >
            View All Destinations
          </Link>
        </div>
      </div>

      {/* Destinations Grid (5 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {DESTINATIONS.map((dest, idx) => (
          <div
            key={idx}
            className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-[0_4px_25px_-4px_rgba(15,33,72,0.05)] group cursor-pointer border border-brand-navy/5"
          >
            {/* Destination Image */}
            <Image
              src={dest.image}
              alt={`${dest.name} Travel Destination`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />
            
            {/* Visual gradient overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent group-hover:from-brand-navy/90 group-hover:via-brand-navy/30 transition-all duration-300" />

            {/* Destination Name text overlay at bottom-left */}
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-sm group-hover:translate-x-1 transition-transform duration-300">
                {dest.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
