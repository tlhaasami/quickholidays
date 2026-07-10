import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F2148] flex items-center justify-center px-4 font-sans select-none relative overflow-hidden">
      
      {/* Decorative gold vector circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 space-y-8">
        
        {/* Error Code Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold tracking-widest uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          Error Status
        </div>

        {/* Big numbers */}
        <h1 className="font-serif text-8xl sm:text-9xl font-extrabold text-white tracking-tight drop-shadow-md">
          404
        </h1>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
            Page Not Found or Restricted
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
            The page you requested does not exist or requires subdomain privileges to access. If you are a client looking for Schengen Visa help, please navigate back.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-gold hover:bg-brand-gold-dark text-[#0F2148] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 px-8 py-3 text-sm font-bold shadow-md cursor-pointer"
          >
            Go Back Home
          </Link>
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 px-8 py-3 text-sm font-bold cursor-pointer"
          >
            Contact Us
          </Link>
        </div>

      </div>
    </div>
  );
}
