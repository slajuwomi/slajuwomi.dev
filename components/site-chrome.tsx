"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { site } from "@/lib/site-data";

const navigation = [
  { label: "About", href: "/" },
  { label: "Writing", href: "/writing" },
] as const;

const footerLinks = [
  { label: "GitHub", href: site.social.github },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "X", href: site.social.twitter },
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <header className="site-header">
        <Link href="/" className="site-name">
          Stephen Lajuwomi
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="site-route">{children}</div>

      <footer className="site-footer">
        {footerLinks.map((item) => (
          <a
            key={item.label}
            className="footer-link"
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.label}
          </a>
        ))}
      </footer>
    </>
  );
}
