import type { Metadata } from "next";
import { ProjectSearch } from "@/components/project-search";
import { projects, site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of software projects built by Stephen Lajuwomi.",
};

export default function ProjectsPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-stone-800 dark:text-stone-200">
          projects
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          a few things i&apos;ve built and learned from.
        </p>
      </div>

      <ProjectSearch projects={projects} />

      <p className="text-sm text-stone-500">
        the rest are on{" "}
        <a
          href={site.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="sweep-link font-medium text-stone-700 dark:text-stone-300"
        >
          github
        </a>
        .
      </p>
    </section>
  );
}
