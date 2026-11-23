import type { Metadata } from "next";
import { Crimson_Pro } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import { FerrofluidBackground } from "@/components/ferrofluid-background";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://slajuwomi.dev"),
  title: {
    default: "Stephen Lajuwomi",
    template: "%s | Stephen Lajuwomi",
  },
  description:
    "Stephen Lajuwomi is a software developer building practical web tools and learning in public.",
};

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-crimson-pro",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${crimsonPro.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon/portrait/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/portrait/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/portrait/favicon-32x32.png"
        />
        <link rel="apple-touch-icon" href="/favicon/portrait/apple-touch-icon.png" />
      </head>
      <body className="min-h-full antialiased">
        <FerrofluidBackground />
        <main className="site-canvas">
          <div className="site-column">
            <SiteChrome>{children}</SiteChrome>
          </div>
        </main>
      </body>
    </html>
  );
}
