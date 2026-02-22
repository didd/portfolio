"use client";

import { useMemo, useState } from "react";
import { BadgeVariant, Project } from "@/types/projects";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { ProjectCodeBlocks } from "./project-code-blocks";
import { Tag } from "@/components/ui/tag";
import { ProjectLinks } from "./project-links";
import { cn } from "@/lib/utils";

const badgeColors: Record<BadgeVariant, string> = {
  oss: "text-p-green",
  enterprise: "text-p-blue",
  perf: "text-p-red",
  full: "text-p-accent",
};

type ProjectCardProps = {
  index: number;
  total: number;
  project: Project;
  className?: string;
};

export function ProjectCard({
  index,
  total,
  project,
  className = "",
}: ProjectCardProps) {
  const [showAllImpact, setShowAllImpact] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const titleId = `project-title-${project.id}`;
  const impactToggleId = `project-impact-toggle-${project.id}`;
  const codeToggleId = `project-code-toggle-${project.id}`;
  const codeSectionId = `project-code-section-${project.id}`;
  const num = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  const initialImpactCount = 2;
  const hasExtraImpact = project.impact.length > initialImpactCount;

  const visibleImpact = useMemo(() => {
    if (showAllImpact) return project.impact;
    return project.impact.slice(0, initialImpactCount);
  }, [project.impact, showAllImpact]);

  const hiddenImpactCount = Math.max(
    project.impact.length - initialImpactCount,
    0,
  );

  const hasCode = Boolean(project.code?.length);

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "project-card relative overflow-hidden bg-p-bg px-6 py-8 md:px-12 md:py-11 hover:bg-p-bg2 transition-colors duration-300",
        className,
      )}
    >
      <div className="mb-6 flex items-start justify-between">
        <span className="font-mono text-[0.6rem] tracking-widest text-p-text3">
          {num}
        </span>

        <span
          aria-label={`Project type: ${project.badge.label}`}
          className={cn(
            "px-2.5 py-0.5 text-[0.6rem] font-semibold tracking-[0.12em] uppercase border border-current",
            badgeColors[project.badge.variant],
          )}
        >
          {project.badge.label}
        </span>
      </div>

      <h3
        id={titleId}
        className="mb-1.5 font-serif text-[1.6rem] leading-[1.15] tracking-tight text-p-text"
      >
        {project.title}
      </h3>

      <div className="mb-5 text-[0.72rem] font-medium tracking-[0.04em] text-p-text3">
        {project.role}
      </div>

      <p className="mb-6 text-[0.9rem] leading-[1.7] text-p-text2">
        {project.problem}
      </p>

      <ul role="list" className="mb-3 flex list-none flex-col gap-[0.45rem]">
        {visibleImpact.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-[0.82rem] leading-normal text-p-text2"
          >
            <ArrowRight
              aria-hidden="true"
              className="mt-[0.15em] size-3 shrink-0 text-p-accent"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {hasExtraImpact && (
        <button
          id={impactToggleId}
          type="button"
          onClick={() => setShowAllImpact((v) => !v)}
          className="mb-6 inline-flex items-center gap-1.5 text-[0.65rem] font-mono tracking-[0.14em] uppercase text-p-text3 hover:text-p-text2 transition-colors"
          aria-expanded={showAllImpact}
        >
          {showAllImpact ? (
            <>
              <ChevronUp className="size-3" aria-hidden="true" />
              Hide extra impact
            </>
          ) : (
            <>
              <ChevronDown className="size-3" aria-hidden="true" />+
              {hiddenImpactCount} more impact
            </>
          )}
        </button>
      )}

      {hasCode && (
        <div className="mb-6">
          <button
            id={codeToggleId}
            type="button"
            onClick={() => setShowCode((v) => !v)}
            aria-expanded={showCode}
            aria-controls={codeSectionId}
            className="inline-flex items-center gap-1.5 text-[0.65rem] font-mono tracking-[0.14em] uppercase text-p-text3 hover:text-p-text2 transition-colors"
          >
            {showCode ? (
              <>
                <ChevronUp className="size-3" aria-hidden="true" />
                Hide code snippet
              </>
            ) : (
              <>
                <ChevronDown className="size-3" aria-hidden="true" />
                View code snippet
              </>
            )}
          </button>
        </div>
      )}

      {hasCode && showCode && (
        <div id={codeSectionId} className="mb-7">
          <ProjectCodeBlocks projectId={project.id} code={project.code} />
        </div>
      )}

      <div className="mb-7 border-t border-p-border/60 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>

      <ProjectLinks links={project.links} />
    </article>
  );
}
