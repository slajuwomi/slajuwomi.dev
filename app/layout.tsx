import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
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

const themeScript = `
  (() => {
    let savedTheme = null;

    try {
      savedTheme = localStorage.getItem("theme");
    } catch {
      // System preference still works when browser storage is unavailable.
    }

    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : systemPrefersDark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* This runs before paint so the stored theme never flashes incorrectly. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${GeistSans.className} min-h-full antialiased`}>
        <main className="site-canvas">
          <div className="site-column">
            <SiteChrome>{children}</SiteChrome>
          </div>
        </main>
      </body>
    </html>
  );
}
