"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoTop } from "@/constants/data";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomeActive = pathname === "/";
  const isSchengenActive = pathname === "/schengen-visa";
  const isAboutActive = pathname === "/about";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-white/95 backdrop-blur-md shadow-xl py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src={logoTop}
                alt="Quick Holidays Logo"
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Center Navigation Links (Capsule shape on Desktop) */}
          <nav className="hidden md:flex items-center justify-center bg-white shadow-[0_4px_20px_-4px_rgba(15,33,72,0.08)] border border-brand-gold rounded-full px-8 py-3">
            <div className="flex items-center space-x-8 text-sm font-medium">
              <Link
                href="/"
                className={`transition-colors duration-200 ${
                  isHomeActive
                    ? "text-brand-gold font-semibold"
                    : "text-slate-600 hover:text-brand-navy"
                }`}
              >
                Home
              </Link>
              <Link
                href="/schengen-visa"
                className={`transition-colors duration-200 ${
                  isSchengenActive
                    ? "text-brand-gold font-semibold"
                    : "text-slate-600 hover:text-brand-navy"
                }`}
              >
                Schengen Visa
              </Link>
              <Link
                href="/about"
                className={`transition-colors duration-200 ${
                  isAboutActive
                    ? "text-brand-gold font-semibold"
                    : "text-slate-600 hover:text-brand-navy"
                }`}
              >
                About Us
              </Link>
              <Link
                href="/#consultation"
                className="text-slate-600 hover:text-brand-navy transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex">
            <Link
              href="/#consultation"
              className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-navy/95 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Free Consultancy
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-brand-navy hover:bg-brand-navy/5 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${isOpen ? "block animate-fadeIn" : "hidden"} md:hidden bg-white border-t border-brand-navy/5`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-4 py-4 pb-6">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block rounded-md px-3 py-2 text-base ${
              isHomeActive
                ? "font-semibold text-brand-gold bg-brand-cream/50"
                : "font-medium text-slate-600 hover:bg-brand-cream/30 hover:text-brand-navy"
            }`}
          >
            Home
          </Link>
          <Link
            href="/schengen-visa"
            onClick={() => setIsOpen(false)}
            className={`block rounded-md px-3 py-2 text-base ${
              isSchengenActive
                ? "font-semibold text-brand-gold bg-brand-cream/50"
                : "font-medium text-slate-600 hover:bg-brand-cream/30 hover:text-brand-navy"
            }`}
          >
            Schengen Visa
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className={`block rounded-md px-3 py-2 text-base ${
              isAboutActive
                ? "font-semibold text-brand-gold bg-brand-cream/50"
                : "font-medium text-slate-600 hover:bg-brand-cream/30 hover:text-brand-navy"
            }`}
          >
            About Us
          </Link>
          <Link
            href="/#consultation"
            onClick={() => setIsOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-brand-cream/30 hover:text-brand-navy"
          >
            Contact Us
          </Link>
          <div className="pt-4 border-t border-brand-navy/5">
            <Link
              href="/#consultation"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-brand-navy px-4 py-2.5 text-base font-semibold text-white shadow-md hover:bg-brand-navy/90"
            >
              Get Free Consultancy
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
