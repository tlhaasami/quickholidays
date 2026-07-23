import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

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
  title: "Quick Holidays Ltd | Schengen Visa Specialists",
  description: "Get your Schengen visa handled properly with clear costs, honest advice, and our full Accountability Promise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bevan:ital@0;1&family=Boldonse&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-ivory text-ink font-sans antialiased min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  );
}
