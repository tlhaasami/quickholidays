import Image from "next/image";
import { whyChooseUsBg, WHY_CHOOSE_US_POINTS } from "@/constants/data";

export default function WhyChooseUs() {
  return (
    <section id="about" className="relative bg-brand-dark text-white overflow-hidden py-20 sm:py-28">
      {/* Visual background details */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(204,163,82,0.1),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-5 text-left">
            <span className="text-sm font-bold tracking-widest text-brand-gold uppercase block mb-3 animate-pulse">
              Why Choose Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
              A Team You
              <br />
              Can Trust
            </h2>
            
            {/* Checklist */}
            <ul className="space-y-6">
              {WHY_CHOOSE_US_POINTS.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-4 group transition-all duration-300 hover:translate-x-1"
                >
                  {/* Gold Checked Icon */}
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  {/* Point Text */}
                  <span className="text-slate-200 text-sm sm:text-base font-medium">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-7 w-full h-[320px] sm:h-[450px] lg:h-[500px] relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 group">
            <Image
              src={whyChooseUsBg}
              alt="Why Choose Quick Holidays - Consultation Form and Passport"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark glass overlay effect on hover */}
            <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-brand-dark/0 transition-all duration-300" />
          </div>

        </div>
      </div>
    </section>
  );
}
