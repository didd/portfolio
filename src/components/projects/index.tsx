"use client";

import { projects } from "@/data/projects";
import { ProjectCard } from "./project-card";

export function Projects() {
  return (
    <section aria-labelledby="projects-heading">
      <div className="mx-auto max-w-350 px-6 md:px-12">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-p-accent whitespace-nowrap">
            {"//"} 01 — Selected Work
          </span>
          <h2
            id="projects-heading"
            className="font-serif text-[clamp(1.8rem,3vw,2.75rem)] leading-[1.05] tracking-tight"
          >
            Projects that <em className="text-p-accent italic">shipped</em>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px border-y border-p-border bg-p-border lg:grid-cols-2">
        {projects.map((project, idx) => {
          const isLast = idx === projects.length - 1;
          const isOddCount = projects.length % 2 === 1;
          const shouldSpanFullRowOnLg = isLast && isOddCount;

          return (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              total={projects.length}
              className={shouldSpanFullRowOnLg ? "lg:col-span-2" : ""}
            />
          );
        })}
      </div>
    </section>
  );
}
