import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
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

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon/dark/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/dark/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/dark/favicon-32x32.png"
        />
        <link rel="apple-touch-icon" href="/favicon/dark/apple-touch-icon.png" />
      </head>
      <body className={`${robotoMono.className} min-h-full antialiased`}>
        <main className="site-canvas">
          <div className="site-column">
            <SiteChrome>{children}</SiteChrome>
          </div>
        </main>
      </body>
    </html>
  );
}
