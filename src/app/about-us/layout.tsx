import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Schengen Visa Specialists | Quick Holidays Ltd",
  description: "Learn about Quick Holidays Ltd, a trusted UK Schengen Visa Specialist. We simplify the application process through expert consultation and dedicated support.",
};

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
