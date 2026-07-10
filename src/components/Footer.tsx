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

          {/* Column 1: Brand Info (Horizontal layout on desktop: Logo left, description & socials right) */}
          <div className="md:col-span-7 flex flex-col sm:flex-row items-start gap-8 text-left">
            <Link href="/" className="flex-shrink-0 inline-block">
              <Image
                src={logoBottom}
                alt="Quick Holidays Footer Logo"
                className="h-[120px] w-auto object-contain"
              />
            </Link>
            <div className="space-y-6">
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                We provide specialist Schengen Tourist Visa consultation for UK residents, offering
                expert guidance, application preparation, appointment assistance, and documentation
                support through a fast, transparent, and stress-free process.
              </p>

              {/* Social Media Links with brand colors */}
              <div className="flex gap-4 pt-2">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/448000584673"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366] text-white hover:scale-110 hover:opacity-90 transition-transform duration-200"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.9 9.9 0 00-6.974-2.879c-5.439 0-9.867 4.372-9.87 9.802 0 1.73.473 3.41 1.37 4.915l-.972 3.548 3.666-.972zm9.294-4.882c-.3-.15-1.771-.875-2.046-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-1.206-.6-2.012-1.125-2.771-2.428-.15-.25-.15-.435-.02-.596.12-.14.275-.325.412-.49.137-.165.18-.275.27-.45.09-.18.04-.33-.02-.48-.06-.15-.675-1.625-.925-2.225-.244-.589-.496-.51-.676-.51-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.11 4.525.714.31 1.27.495 1.7.635.717.229 1.37.196 1.885.12.574-.085 1.771-.725 2.021-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0077B5] text-white hover:scale-110 hover:opacity-90 transition-transform duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E1306C] text-white hover:scale-110 hover:opacity-90 transition-transform duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1877F2] text-white hover:scale-110 hover:opacity-90 transition-transform duration-200"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-2 text-left space-y-6">
            <h4 className="text-white text-base font-bold tracking-wide">Quick Links</h4>
            <ul className="space-y-3.5 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/schengen-visa" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">
                  Visa Process
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-gold hover:translate-x-1 transition-all duration-200 inline-block">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="md:col-span-3 text-left space-y-6">
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
