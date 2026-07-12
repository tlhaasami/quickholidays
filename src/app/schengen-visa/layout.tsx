import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schengen Tourist Visa Process | Quick Holidays Ltd",
  description: "Apply for your Schengen Tourist Visa with confidence. We offer expert guidance, checklist preparation, and personalized support for UK residents.",
};

export default function SchengenVisaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
