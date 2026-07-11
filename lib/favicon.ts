export type Theme = "light" | "dark";

// Paths for each theme — light = dark "S" on white, dark = white "S" on black.
const faviconSets = {
  light: {
    ico: "/favicon/light/favicon.ico",
    png16: "/favicon/light/favicon-16x16.png",
    png32: "/favicon/light/favicon-32x32.png",
    apple: "/favicon/light/apple-touch-icon.png",
  },
  dark: {
    ico: "/favicon/dark/favicon.ico",
    png16: "/favicon/dark/favicon-16x16.png",
    png32: "/favicon/dark/favicon-32x32.png",
    apple: "/favicon/dark/apple-touch-icon.png",
  },
} as const;

/**
 * Swap every favicon <link> to match the active theme.
 * We set hrefs directly (instead of prefers-color-scheme media queries)
 * so the site's manual theme toggle stays in sync with the tab icon.
 */
export function applyFavicon(theme: Theme) {
  const set = faviconSets[theme];

  const update = (id: string, href: string) => {
    const link = document.getElementById(id) as HTMLLinkElement | null;
    if (link) link.href = href;
  };

  update("favicon-ico", set.ico);
  update("favicon-16", set.png16);
  update("favicon-32", set.png32);
  update("favicon-apple", set.apple);
}
