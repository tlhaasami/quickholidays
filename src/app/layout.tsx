import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { DockWrapper } from "@/components/DockWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://www.quickholidays.co.uk"
      : "http://localhost:3000"
  ),
  title: "Quick Holidays Ltd | Schengen Visa Specialists",
  description: "Get your Schengen visa handled properly with clear costs, honest advice, and our full Accountability Promise.",
  icons: {
    icon: "/logos/logo.svg",
    shortcut: "/logos/logo.svg",
    apple: "/logos/logo.svg",
  },
  openGraph: {
    title: "Quick Holidays Ltd | Schengen Visa Specialists",
    description: "Get your Schengen visa handled properly with clear costs, honest advice, and our full Accountability Promise.",
    url: "https://www.quickholidays.co.uk",
    siteName: "Quick Holidays",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Quick Holidays - Schengen Visa Specialists for UK Residents",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quick Holidays Ltd | Schengen Visa Specialists",
    description: "Get your Schengen visa handled properly with clear costs, honest advice, and our full Accountability Promise.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bevan:ital@0;1&family=Boldonse&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-surface-ivory text-ink font-sans antialiased min-h-screen">
        <Navbar />
        <main>{children}</main>
        <FloatingWhatsApp />
        <DockWrapper />
      </body>
    </html>
  );
}
