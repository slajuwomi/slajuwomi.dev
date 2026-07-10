"use client";

import { ExternalLink, GitFork, Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/site-data";

export function ProjectSearch({ projects }: { projects: readonly Project[] }) {
  const [query, setQuery] = useState("");
  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return projects;
    }

    return projects.filter((project) =>
      [project.name, project.description, ...project.tags]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [projects, query]);

  return (
    <div className="space-y-6">
      <label className="relative block">
        <span className="sr-only">Search projects</span>
        <Search
          size={16}
          strokeWidth={1.5}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-stone-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search projects"
          className="w-full rounded-lg border border-stone-300 bg-stone-50 py-2.5 pr-3 pl-10 text-sm text-stone-700 outline-none placeholder:text-stone-500 focus:border-stone-500 dark:border-stone-700 dark:bg-neutral-900 dark:text-stone-200 dark:focus:border-stone-500"
        />
      </label>

      {filteredProjects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 px-5 py-10 text-center text-sm text-stone-500 dark:border-stone-700">
          No projects match “{query}”.
        </div>
      ) : (
        <div className="space-y-7">
          {filteredProjects.map((project) => (
            <article
              key={project.slug}
              className="group overflow-hidden rounded-lg bg-neutral-100 shadow-md transition-shadow hover:shadow-lg dark:bg-neutral-900"
            >
              <div className="relative h-[250px] overflow-hidden transition-[height] duration-500 group-hover:h-[275px]">
                <Image
                  src={project.image ?? "/assets/project-media-pending.svg"}
                  alt={
                    project.image
                      ? project.imageAlt
                      : `Real project media pending for ${project.name}`
                  }
                  fill
                  sizes="(min-width: 768px) 500px, calc(100vw - 48px)"
                  className="object-cover"
                />
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-start gap-3">
                  <h2 className="mr-auto text-2xl font-medium text-stone-800 dark:text-stone-200">
                    {project.name}
                  </h2>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.name} source code`}
                    className="rounded-md p-1 text-stone-500 transition-transform hover:scale-110 hover:text-stone-800 dark:hover:text-stone-200"
                  >
                    <GitFork size={19} strokeWidth={1.5} />
                  </a>
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.name} demo`}
                      className="rounded-md p-1 text-stone-500 transition-transform hover:scale-110 hover:text-stone-800 dark:hover:text-stone-200"
                    >
                      <ExternalLink size={19} strokeWidth={1.5} />
                    </a>
                  ) : null}
                </div>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">
                  {project.description}
                </p>
                <p className="text-xs text-stone-500">{project.tags.join(" / ")}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
