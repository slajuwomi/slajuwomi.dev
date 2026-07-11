"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import {
  BookOpen,
  BriefcaseBusiness,
  CodeXml,
  Github,
  Home,
  Linkedin,
  Mail,
  Moon,
  Sun,
  Twitter,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { site } from "@/lib/site-data";

type Theme = "light" | "dark";

const navigation = [
  { label: "about", href: "/", icon: Home },
  { label: "projects", href: "/projects", icon: BriefcaseBusiness },
  { label: "writing", href: "/writing", icon: BookOpen },
] as const;

// Match Martin Sit's footer: Lucide brand/utility icons instead of generic shapes.
const externalLinks = [
  { label: "x", href: site.social.twitter, icon: Twitter },
  { label: "linkedin", href: site.social.linkedin, icon: Linkedin },
  { label: "github", href: site.social.github, icon: Github },
  { label: "email", href: `mailto:${site.email}`, icon: Mail },
  { label: "source", href: site.repositoryUrl, icon: CodeXml },
] as const;

function getCurrentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const theme = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("themechange", onStoreChange);
      return () => window.removeEventListener("themechange", onStoreChange);
    },
    getCurrentTheme,
    () => "light",
  );

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    // Notify React because the theme source lives on the document element.
    window.dispatchEvent(new Event("themechange"));
  }, []);

  useEffect(() => {
    const openPalette = (event: KeyboardEvent) => {
      // The palette is a desktop shortcut, so narrow viewports ignore it.
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k" &&
        window.matchMedia("(min-width: 768px)").matches
      ) {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", openPalette);
    return () => window.removeEventListener("keydown", openPalette);
  }, []);

  const runCommand = useCallback((action: () => void) => {
    setPaletteOpen(false);
    action();
  }, []);

  return (
    <>
      <header className="flex flex-wrap items-center gap-3 text-sm sm:flex-nowrap">
        <Link
          href="/"
          className="mr-auto whitespace-nowrap font-semibold text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
        >
          stephen lajuwomi
        </Link>

        <nav
          aria-label="Primary navigation"
          className="order-3 flex w-full items-center justify-between gap-3 border-t border-stone-200 pt-3 sm:order-none sm:w-auto sm:justify-start sm:border-0 sm:pt-0 dark:border-stone-800"
        >
          {navigation.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`transition-colors hover:text-stone-800 dark:hover:text-stone-200 ${
                  active ? "font-medium text-stone-800 dark:text-stone-200" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-md p-1.5 text-stone-500 transition-transform hover:scale-110 hover:text-stone-800 active:scale-95 dark:hover:text-stone-200"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* The larger, high-contrast keycaps keep the shortcut readable at a glance. */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="hidden items-center gap-1.5 rounded-[9px] border border-stone-300 bg-stone-100 px-1.5 py-1 text-stone-600 shadow-sm transition-[border-color,background-color,transform] duration-200 hover:border-stone-400 hover:bg-stone-200 active:scale-[0.98] md:flex dark:border-stone-700 dark:bg-[#292727] dark:text-stone-200 dark:shadow-black/20 dark:hover:border-stone-600 dark:hover:bg-[#302e2e]"
          aria-label="Open command palette"
        >
          {/* A fixed square gives the command symbol the same visual weight as K. */}
          <kbd className="flex size-6.5 items-center justify-center rounded-md border border-stone-300 bg-white font-sans text-sm leading-none font-medium text-stone-800 shadow-sm dark:border-stone-600 dark:bg-[#494646] dark:text-stone-100 dark:shadow-black/25">
            ⌘
          </kbd>
          <span className="text-sm leading-none font-medium text-stone-500 dark:text-stone-400" aria-hidden="true">
            +
          </span>
          {/* Matching dimensions make the two-key shortcut feel balanced. */}
          <kbd className="flex size-6.5 items-center justify-center rounded-md border border-stone-300 bg-white font-sans text-sm leading-none font-medium text-stone-800 shadow-sm dark:border-stone-600 dark:bg-[#494646] dark:text-stone-100 dark:shadow-black/25">
            K
          </kbd>
        </button>
      </header>

      <div className="pt-8">{children}</div>

      <footer className="mt-4 flex flex-col gap-4 border-t border-stone-200 pt-4 text-xs text-stone-500 dark:border-stone-800">
        <div className="flex items-center gap-4">
          {externalLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              title={label}
              className="transition-transform hover:scale-110 hover:text-stone-800 active:scale-95 dark:hover:text-stone-200"
            >
              <Icon size={16} strokeWidth={1.5} />
            </a>
          ))}
        </div>
        <p>© {new Date().getFullYear()} Stephen Lajuwomi</p>
      </footer>

      <Dialog.Root open={paletteOpen} onOpenChange={setPaletteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed top-[18%] left-1/2 hidden w-[calc(100%-2rem)] max-w-[500px] -translate-x-1/2 overflow-hidden rounded-xl border border-stone-200 bg-stone-50 shadow-xl md:block dark:border-stone-700 dark:bg-neutral-900"
          >
            <Dialog.Title className="sr-only">Command palette</Dialog.Title>
            <Dialog.Close className="absolute top-3 right-3 rounded-md p-1 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200">
              <X size={16} />
              <span className="sr-only">Close command palette</span>
            </Dialog.Close>
            <Command className="text-sm text-stone-600 dark:text-stone-300">
              <Command.Input
                autoFocus
                placeholder="Search commands"
                className="w-full border-b border-stone-200 bg-transparent px-4 py-3 pr-10 outline-none placeholder:text-stone-400 dark:border-stone-700"
              />
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="px-3 py-6 text-center text-stone-500">
                  No command found.
                </Command.Empty>
                <Command.Group
                  heading="Navigation"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-stone-400"
                >
                  {navigation.map(({ label, href, icon: Icon }) => (
                    <Command.Item
                      key={href}
                      onSelect={() => runCommand(() => router.push(href))}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 data-[selected=true]:bg-stone-200 dark:data-[selected=true]:bg-stone-800"
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      {label}
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group
                  heading="Links"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-stone-400"
                >
                  {externalLinks.map(({ label, href, icon: Icon }) => (
                    <Command.Item
                      key={label}
                      onSelect={() =>
                        runCommand(() => {
                          window.location.href = href;
                        })
                      }
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 data-[selected=true]:bg-stone-200 dark:data-[selected=true]:bg-stone-800"
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      {label}
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group
                  heading="Other"
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-stone-400"
                >
                  <Command.Item
                    onSelect={() => runCommand(toggleTheme)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 data-[selected=true]:bg-stone-200 dark:data-[selected=true]:bg-stone-800"
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    toggle theme
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
