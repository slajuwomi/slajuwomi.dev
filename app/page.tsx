import { GalleryHorizontalEnd } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Signature } from "@/components/signature";
import {
  currentRole,
  education,
  previousRoles,
  projects,
} from "@/lib/site-data";

export default function Home() {
  return (
    <div className="space-y-7 text-base text-stone-600 dark:text-stone-400">
      <h1 className="sr-only">About Stephen Lajuwomi</h1>

      <DiamondRow>
        <div className="flex flex-wrap items-center gap-2">
          <span>{currentRole.role}</span>
          <LogoAsset
            src={currentRole.logo}
            alt={`${currentRole.company} logo`}
            pendingLabel="DIG logo pending"
          />
          <ExternalTextLink href={currentRole.companyUrl}>
            {currentRole.company}
          </ExternalTextLink>
        </div>
      </DiamondRow>

      <DiamondRow>
        <div className="flex flex-wrap items-center gap-2">
          <span>{education.degree}</span>
          <LogoAsset
            src={education.logo}
            alt={`${education.school} logo`}
            pendingLabel="HSU logo pending"
          />
          <ExternalTextLink href={education.schoolUrl}>
            {education.school}
          </ExternalTextLink>
          <span className="text-stone-500">({education.year})</span>
        </div>
      </DiamondRow>

      <DiamondRow>
        <div>
          <p className="font-medium italic text-stone-700 dark:text-stone-300">
            what i&apos;ve been building:
          </p>
          <ul className="mt-3 space-y-3 pl-5">
            {projects.map((project) => (
              <li key={project.slug} className="relative">
                <span className="absolute -left-5 text-stone-500" aria-hidden="true">
                  ↳
                </span>
                <ExternalTextLink href={project.githubUrl}>
                  {project.name}
                </ExternalTextLink>
                <span> {project.description.toLowerCase()}</span>
              </li>
            ))}
          </ul>
        </div>
      </DiamondRow>

      <DiamondRow>
        <div>
          <p className="font-medium italic text-stone-700 dark:text-stone-300">
            previously:
          </p>
          <ul className="mt-3 space-y-3 pl-5">
            {previousRoles.map((item) => (
              <li key={`${item.company}-${item.role}`} className="relative">
                <span className="absolute -left-5 text-stone-500" aria-hidden="true">
                  ↳
                </span>
                <span className="font-medium text-stone-700 dark:text-stone-300">
                  {item.role}
                </span>{" "}
                at {item.company}
                <span className="block text-sm text-stone-500">{item.dates}</span>
              </li>
            ))}
          </ul>
        </div>
      </DiamondRow>

      <Link
        href="/projects"
        className="flex items-center justify-center gap-2 rounded-lg border border-stone-400 bg-stone-50 px-6 py-4 text-center text-stone-600 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] dark:border-stone-600 dark:bg-stone-900 dark:text-stone-400"
      >
        see what i&apos;ve built
        <GalleryHorizontalEnd size={17} strokeWidth={1.5} />
      </Link>

      <Signature />
    </div>
  );
}

function DiamondRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="group flex items-start gap-4 transition-transform duration-200 hover:translate-x-1">
      <span
        aria-hidden="true"
        className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-stone-800 transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110 dark:bg-stone-200"
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function ExternalTextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="sweep-link font-medium text-stone-700 transition-colors hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
    >
      {children}
    </a>
  );
}

function LogoAsset({
  src,
  alt,
  pendingLabel,
}: {
  src: string | null;
  alt: string;
  pendingLabel: string;
}) {
  if (!src) {
    // This label makes the missing real asset clear without inventing a logo.
    return (
      <span className="rounded border border-dashed border-stone-300 px-1.5 py-0.5 text-xs text-stone-500 dark:border-stone-700">
        {pendingLabel}
      </span>
    );
  }

  return <Image src={src} alt={alt} width={22} height={22} />;
}
