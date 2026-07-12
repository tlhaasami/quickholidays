import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Book Schengen Visa Consultation | Quick Holidays Ltd",
  description: "Get in touch with our Schengen visa experts. Reach us via phone, email, or WhatsApp to start your application process smoothly.",
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
