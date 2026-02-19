import { BadgeVariant, Project } from "@/types/projects";
import { ArrowRight } from "lucide-react";
import { ProjectCodeBlocks } from "./project-code-blocks";
import { Tag } from "@/components/ui/tag";
import { ProjectLinks } from "./project-links";

const badgeColors: Record<BadgeVariant, string> = {
  oss: "text-p-green",
  enterprise: "text-p-blue",
  perf: "text-p-red",
  full: "text-p-accent",
};

export function ProjectCard({
  index,
  total,
  project,
}: {
  index: number;
  total: number;
  project: Project;
}) {
  const titleId = `project-title-${project.id}`;
  const num = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <article
      aria-labelledby={titleId}
      className="project-card relative overflow-hidden bg-p-bg px-6 py-8 md:px-12 md:py-11 hover:bg-p-bg2 transition-colors duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="font-mono text-[0.6rem] text-p-text3 tracking-widest">
          {num}
        </span>
        <span
          aria-label={`Project type: ${project.badge.label}`}
          className={`text-[0.6rem] font-semibold tracking-[0.12em] uppercase px-2.5 py-0.5 border border-current ${badgeColors[project.badge.variant]}`}
        >
          {project.badge.label}
        </span>
      </div>

      <h3
        id={titleId}
        className="font-serif text-[1.6rem] leading-[1.15] tracking-tight text-p-text mb-1.5"
      >
        {project.title}
      </h3>

      <div className="text-[0.72rem] text-p-text3 tracking-[0.04em] font-medium mb-5">
        {project.role}
      </div>

      <p className="text-[0.9rem] text-p-text2 leading-[1.7] mb-6">
        {project.problem}
      </p>

      <ul role="list" className="flex flex-col gap-[0.45rem] mb-7 list-none">
        {project.impact.map((item) => (
          <li
            key={item}
            className="text-[0.82rem] text-p-text2 flex items-start gap-2.5 leading-normal"
          >
            <ArrowRight
              aria-hidden="true"
              className="text-p-accent shrink-0 mt-[0.15em] size-3"
            />
            {item}
          </li>
        ))}
      </ul>

      <ProjectCodeBlocks projectId={project.id} code={project.code} />

      <div className="flex flex-wrap gap-1.5 mb-7">
        {project.stack.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <ProjectLinks links={project.links} />
    </article>
  );
}
