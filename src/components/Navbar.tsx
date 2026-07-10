"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoTop } from "@/constants/data";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [activeHash, setActiveHash] = useState("#add-user");
  const pathname = usePathname();

  const handleAdminLinkClick = (hash: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveHash(hash);
    
    if (hash === "#add-user") {
      // Scroll to the very top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll to the target element with an offset to avoid being covered by navbar
      const target = document.querySelector(hash);
      if (target) {
        const offset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdminSubdomain(window.location.hostname.startsWith("admin."));
    }
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setIsAdminAuthenticated(localStorage.getItem("admin_auth") === "true");
    };
    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, [pathname]);

  useEffect(() => {
    const isDashboard = pathname ? (
      pathname.startsWith("/agent-dashboard") || 
      pathname.startsWith("/processing-dashboard") || 
      pathname.startsWith("/admin")
    ) : false;
    const shouldHide = isDashboard || isAdminSubdomain;

    if (shouldHide) {
      document.body.classList.add("no-header-padding");
    } else {
      document.body.classList.remove("no-header-padding");
    }

    return () => {
      document.body.classList.remove("no-header-padding");
    };
  }, [pathname, isAdminSubdomain]);

  const isAdminPath = pathname ? pathname.startsWith("/admin") : false;
  const isAdminLogin = (isAdminSubdomain || isAdminPath) && !isAdminAuthenticated;
  const isAdminDashboard = (isAdminSubdomain || isAdminPath) && isAdminAuthenticated;
  const isDashboardPage = pathname ? (pathname.startsWith("/agent-dashboard") || pathname.startsWith("/processing-dashboard") || pathname.startsWith("/admin")) : false;
  const isHomeActive = pathname === "/" && !isAdminDashboard && !isAdminLogin;
  const isSchengenActive = pathname === "/schengen-visa";
  const isAboutActive = pathname === "/about-us";
  const isContactActive = pathname === "/contact-us";
  const isLoginActive = pathname === "/login";

  const navRef = useRef<HTMLDivElement | null>(null);
  const [highlightStyle, setHighlightStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useEffect(() => {
    const updateHighlight = () => {
      const nav = navRef.current;
      if (!nav) return;
      
      let activeLink: HTMLElement | null = null;
      
      if (isAdminDashboard) {
        // If on admin subdomain and authenticated, find active link by hash
        const selector = `a[href="${activeHash}"]`;
        activeLink = nav.querySelector(selector) as HTMLElement | null;
      } else if (!isAdminLogin) {
        // Otherwise use standard path routing
        const selector = `a[href="${pathname}"]`;
        activeLink = nav.querySelector(selector) as HTMLElement | null;
      } else {
        setHighlightStyle((s) => ({ ...s, opacity: 0 }));
        return;
      }

      if (!activeLink) {
        setHighlightStyle((s) => ({ ...s, opacity: 0 }));
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      const left = linkRect.left - navRect.left + nav.scrollLeft - 6; // small offset to include padding
      const width = linkRect.width + 12; // extend pill beyond text a bit
      setHighlightStyle({ left: Math.max(4, left - 8), width: width + 16, opacity: 1 });
    };

    // update on mount, route change, and resize
    updateHighlight();
    window.addEventListener("resize", updateHighlight);
    return () => window.removeEventListener("resize", updateHighlight);
  }, [pathname, isAdminDashboard, isAdminLogin, activeHash]);

  if (isDashboardPage || isAdminSubdomain) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-white/95 backdrop-blur-md shadow-xl h-(--header-height)">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center h-full justify-between gap-4">
          
          {/* Logo */}
          <div className="shrink-0">
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
          <nav ref={navRef} className="hidden md:flex items-center justify-center rounded-full px-8 py-3 relative">
            {/* Moving highlight pill (desktop only) */}
            <span
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white border border-brand-gold shadow-md pointer-events-none transition-all duration-300"
              style={{
                left: highlightStyle.left,
                width: highlightStyle.width,
                opacity: highlightStyle.opacity,
                height: `calc(100% - 10px)`,
              }}
            />
            <div className="flex items-center space-x-10 text-sm font-medium relative z-10">
              {isAdminDashboard ? (
                <>
                  <a
                    href="#add-user"
                    onClick={(e) => handleAdminLinkClick("#add-user", e)}
                    className={`nav-link inline-flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
                      activeHash === "#add-user"
                        ? "text-brand-gold font-semibold animate-pulseFast"
                        : "text-slate-600 hover:text-brand-gold hover:scale-[1.03]"
                    }`}
                  >
                    Add User
                  </a>
                  <a
                    href="#pending-requests"
                    onClick={(e) => handleAdminLinkClick("#pending-requests", e)}
                    className={`nav-link inline-flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
                      activeHash === "#pending-requests"
                        ? "text-brand-gold font-semibold animate-pulseFast"
                        : "text-slate-600 hover:text-brand-gold hover:scale-[1.03]"
                    }`}
                  >
                    Pending Requests
                  </a>
                  <a
                    href="#approved-accounts"
                    onClick={(e) => handleAdminLinkClick("#approved-accounts", e)}
                    className={`nav-link inline-flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
                      activeHash === "#approved-accounts"
                        ? "text-brand-gold font-semibold animate-pulseFast"
                        : "text-slate-600 hover:text-brand-gold hover:scale-[1.03]"
                    }`}
                  >
                    Approved Accounts
                  </a>
                </>
              ) : isAdminLogin ? (
                null
              ) : (
                <>
                  <Link
                    href="/"
                    className={`nav-link inline-flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
                      isHomeActive
                        ? "text-brand-gold font-semibold"
                        : "text-slate-600 hover:text-brand-gold hover:scale-[1.03]"
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/schengen-visa"
                    className={`nav-link inline-flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
                      isSchengenActive
                        ? "text-brand-gold font-semibold"
                        : "text-slate-600 hover:text-brand-gold hover:scale-[1.03]"
                    }`}
                  >
                    Schengen Visa
                  </Link>
                  <Link
                    href="/about-us"
                    className={`nav-link inline-flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
                      isAboutActive
                        ? "text-brand-gold font-semibold"
                        : "text-slate-600 hover:text-brand-gold hover:scale-[1.03]"
                    }`}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact-us"
                    className={`nav-link inline-flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
                      isContactActive
                        ? "text-brand-gold font-semibold"
                        : "text-slate-600 hover:text-brand-gold hover:scale-[1.03]"
                    }`}
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/login"
                    className={`nav-link inline-flex items-center px-3 py-1.5 rounded-md transition-all duration-200 ${
                      isLoginActive
                        ? "text-brand-gold font-semibold"
                        : "text-slate-600 hover:text-brand-gold hover:scale-[1.03]"
                    }`}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex">
            {isAdminDashboard ? (
              <button
                onClick={() => {
                  localStorage.removeItem("admin_auth");
                  window.location.reload();
                }}
                className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] hover:scale-[1.04] transition-all duration-300 cursor-pointer"
              >
                Log Out
              </button>
            ) : isAdminLogin ? (
              <a
                href={isAdminSubdomain ? "http://localhost:3000" : "/"}
                className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] hover:scale-[1.04] transition-all duration-300"
              >
                Back to Site
              </a>
            ) : (
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] hover:scale-[1.04] transition-all duration-300"
              >
                Get Free Consultancy
              </Link>
            )}
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
          {isAdminDashboard ? (
            <>
              <a
                href="#add-user"
                onClick={(e) => {
                  setIsOpen(false);
                  handleAdminLinkClick("#add-user", e);
                }}
                className={`block rounded-md px-3 py-2 text-base ${
                  activeHash === "#add-user"
                    ? "font-semibold text-brand-gold bg-brand-cream/50"
                    : "font-medium text-slate-600 hover:bg-brand-cream/30 hover:text-brand-navy"
                }`}
              >
                Add User
              </a>
              <a
                href="#pending-requests"
                onClick={(e) => {
                  setIsOpen(false);
                  handleAdminLinkClick("#pending-requests", e);
                }}
                className={`block rounded-md px-3 py-2 text-base ${
                  activeHash === "#pending-requests"
                    ? "font-semibold text-brand-gold bg-brand-cream/50"
                    : "font-medium text-slate-600 hover:bg-brand-cream/30 hover:text-brand-navy"
                }`}
              >
                Pending Requests
              </a>
              <a
                href="#approved-accounts"
                onClick={(e) => {
                  setIsOpen(false);
                  handleAdminLinkClick("#approved-accounts", e);
                }}
                className={`block rounded-md px-3 py-2 text-base ${
                  activeHash === "#approved-accounts"
                    ? "font-semibold text-brand-gold bg-brand-cream/50"
                    : "font-medium text-slate-600 hover:bg-brand-cream/30 hover:text-brand-navy"
                }`}
              >
                Approved Accounts
              </a>
              <div className="pt-4 border-t border-brand-navy/5">
                <button
                  onClick={() => {
                    localStorage.removeItem("admin_auth");
                    window.location.reload();
                  }}
                  className="flex w-full items-center justify-center rounded-full bg-brand-navy px-4 py-2.5 text-base font-bold text-white shadow-md hover:bg-brand-gold hover:text-brand-navy transition-all animate-pulseFast"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : isAdminLogin ? (
            <div className="pt-4">
              <a
                href={isAdminSubdomain ? "http://localhost:3000" : "/"}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-brand-navy px-4 py-2.5 text-base font-bold text-white shadow-md hover:bg-brand-gold hover:text-brand-navy transition-all"
              >
                Back to Site
              </a>
            </div>
          ) : (
            <>
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
                href="/about-us"
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
                href="/contact-us"
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2 text-base ${
                  isContactActive
                    ? "font-semibold text-brand-gold bg-brand-cream/50"
                    : "font-medium text-slate-600 hover:bg-brand-cream/30 hover:text-brand-navy"
                }`}
              >
                Contact Us
              </Link>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className={`block rounded-md px-3 py-2 text-base ${
                  isLoginActive
                    ? "font-semibold text-brand-gold bg-brand-cream/50"
                    : "font-medium text-slate-600 hover:bg-brand-cream/30 hover:text-brand-navy"
                }`}
              >
                Login
              </Link>
              <div className="pt-4 border-t border-brand-navy/5">
                <Link
                  href="/contact-us"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-brand-navy px-4 py-2.5 text-base font-bold text-white shadow-md hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] hover:scale-[1.02] transition-all duration-300"
                >
                  Get Free Consultancy
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
