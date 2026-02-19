"use client";

import { projects } from "@/data/projects";
import { ProjectCard } from "./project-card";

export function Projects() {
  return (
    <section aria-labelledby="projects-heading">
      <div className="px-6 md:px-12 max-w-350 mx-auto">
        <div className="flex items-baseline gap-6 mb-2">
          <span className="font-mono text-[0.65rem] text-p-accent tracking-[0.15em] uppercase whitespace-nowrap">
            {"//"} 01 — Selected Work
          </span>
          <h2
            id="projects-heading"
            className="font-serif text-[clamp(1.8rem,3vw,2.75rem)] leading-[1.1] tracking-tight"
          >
            Projects that <em className="italic text-p-accent">shipped</em>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-p-border border-y border-p-border">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={idx}
            total={projects.length}
          />
        ))}
      </div>
    </section>
  );
}
