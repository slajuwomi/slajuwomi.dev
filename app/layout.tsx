import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { CrystallineBackground } from "@/components/crystalline-background";
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

    // Match the tab icon to the resolved theme before first paint.
    // (Manual toggle can't rely on prefers-color-scheme media queries alone.)
    const base = theme === "dark" ? "/favicon/dark" : "/favicon/light";
    const setHref = (id, file) => {
      const link = document.getElementById(id);
      if (link) link.href = base + "/" + file;
    };
    setHref("favicon-ico", "favicon.ico");
    setHref("favicon-16", "favicon-16x16.png");
    setHref("favicon-32", "favicon-32x32.png");
    setHref("favicon-apple", "apple-touch-icon.png");
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
        {/* Default to the light set; the theme script swaps to dark when needed. */}
        <link id="favicon-ico" rel="icon" href="/favicon/light/favicon.ico" sizes="any" />
        <link
          id="favicon-16"
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/light/favicon-16x16.png"
        />
        <link
          id="favicon-32"
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/light/favicon-32x32.png"
        />
        <link
          id="favicon-apple"
          rel="apple-touch-icon"
          href="/favicon/light/apple-touch-icon.png"
        />
        {/* This runs before paint so the stored theme never flashes incorrectly. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${GeistSans.className} min-h-full antialiased`}>
        <main className="site-canvas">
          <CrystallineBackground />
          <div className="site-column">
            <SiteChrome>{children}</SiteChrome>
          </div>
        </main>
      </body>
    </html>
  );
}
