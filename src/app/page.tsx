import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import Destinations from "@/components/Destinations";
import ConsultationForm from "@/components/ConsultationForm";

export default function Home() {
  return (
    <div className="bg-brand-cream text-slate-800 font-sans min-h-screen">
      <main className="flex-grow">
        <Hero />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <Destinations />
        <ConsultationForm />
      </main>
    </div>
  );
}

