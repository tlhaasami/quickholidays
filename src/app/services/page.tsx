import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  return (
    <div className="bg-brand-cream text-slate-800 font-sans min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-brand-navy font-serif mb-4">Our Services</h1>
          <p className="text-slate-600 max-w-md mx-auto">
            This page is currently under development. Please check back soon!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
