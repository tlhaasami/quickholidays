import Image from "next/image";
import { whyChooseUsBg, WHY_CHOOSE_US_POINTS } from "@/constants/data";

export default function WhyChooseUs() {
  return (
    <section id="about" className="relative text-white overflow-hidden py-24 sm:py-32">
      {/* Full-width Background Image */}
      <div className="absolute inset-0 z-0 select-none">
        <Image
          src={whyChooseUsBg}
          alt="Why Choose Quick Holidays Background - Passport and Clipboard"
          fill
          className="object-cover select-none"
          priority
        />
        {/* Subtle dark overlay for mobile readability */}
        <div className="absolute inset-0 bg-brand-navy/30 lg:bg-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text and Points Checklist (Spans 6 columns) */}
          <div className="lg:col-span-6 text-left">
            <span className="text-sm font-bold tracking-widest text-brand-gold uppercase block mb-3">
              Why Choose Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-bold text-white leading-tight mb-8">
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
                  {/* Solid Gold Circle Checkmark Icon with Navy check */}
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-brand-gold text-brand-navy">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3.5}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  {/* Point Text */}
                  <span className="text-white text-base sm:text-[17px] font-medium leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Empty on Desktop to show the background image passport/globe */}
          <div className="hidden lg:block lg:col-span-6" />

        </div>
      </div>
    </section>
  );
}
