import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quick Holidays Ltd",
  description: "Hello World Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
