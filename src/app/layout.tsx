import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { headers } from "next/headers";


const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quick Holidays Ltd",
  description: "We simplify the Schengen visa process for UK residents through expert guidance, meticulous application preparation, and personalized support making every journey to Europe seamless, confident, and stress-free.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Quick Holidays",
  "alternateName": "Quick Holidays Ltd",
  "url": "https://quickholidays.co.uk",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://quickholidays.co.uk/schengen-visa?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Quick Holidays Ltd",
  "url": "https://quickholidays.co.uk",
  "logo": "https://quickholidays.co.uk/icon.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+448000584673",
    "contactType": "customer service",
    "email": "info@quickholidays.co.uk",
    "areaServed": "GB",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://www.facebook.com",
    "https://www.instagram.com",
    "https://www.linkedin.com"
  ]
};

const navigationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "SiteNavigationElement",
      "position": 1,
      "name": "Home",
      "url": "https://quickholidays.co.uk"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 2,
      "name": "Visa Process",
      "url": "https://quickholidays.co.uk/schengen-visa"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 3,
      "name": "Our Services",
      "url": "https://quickholidays.co.uk/services"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 4,
      "name": "About Us",
      "url": "https://quickholidays.co.uk/about-us"
    },
    {
      "@type": "SiteNavigationElement",
      "position": 5,
      "name": "Contact Us",
      "url": "https://quickholidays.co.uk/contact-us"
    }
  ]
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const isDashboard =
    pathname.startsWith("/admin") ||
    pathname.includes("/agent-dashboard") ||
    pathname.startsWith("/processing-dashboard");

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-brand-cream text-slate-800">
        {!isDashboard && <Navbar />}
        <main className="grow">{children}</main>
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}

