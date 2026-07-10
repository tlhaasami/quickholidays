import Image from "next/image";
import Link from "next/link";
import { logoBottom } from "@/constants/data";

export default function Footer() {
  return (
    <footer className="relative bg-brand-dark text-slate-300 overflow-hidden pt-16 pb-8 border-t border-white/5">
      {/* Decorative radial lighting background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(204,163,82,0.05),transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-5 text-left space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src={logoBottom}
                alt="Quick Holidays Footer Logo"
                className="h-16 w-auto object-contain filter brightness-0 invert"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              We provide specialist Schengen Tourist Visa consultation for UK residents, offering
              expert guidance, application preparation, appointment assistance, and documentation
              support through a fast, transparent, and stress-free process.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 text-left space-y-6">
            <h4 className="text-white text-base font-bold tracking-wide">Quick Links</h4>
            <ul className="space-y-3.5 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">
                  Visa Process
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="md:col-span-4 text-left space-y-6">
            <h4 className="text-white text-base font-bold tracking-wide">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-slate-800 p-2 rounded-lg text-brand-gold">
                  {/* Envelope SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email</p>
                  <a href="mailto:info@quickholidays.co.uk" className="hover:text-brand-gold transition-colors font-medium">
                    info@quickholidays.co.uk
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-slate-800 p-2 rounded-lg text-brand-gold">
                  {/* Map Pin SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Location</p>
                  <span className="font-medium">
                    124 City Road, London, EC1V 2NX, United Kingdom
                  </span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom copyright and layout */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Quick Holidays. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#services" className="hover:text-slate-400">
              Privacy Policy
            </Link>
            <Link href="#services" className="hover:text-slate-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
