"use client";

import { Button } from "@/components/ui/button";
import { HeroImage } from "./hero-image";

const metrics = [
  {
    number: "87",
    sup: "%",
    label: "CI/CD Faster",
    sub: "// Pipeline Optimization",
  },
  {
    number: "33",
    sup: "+",
    label: "UI Components",
    sub: "// WCAG · Open Source",
  },
  {
    number: "1.2",
    sup: "s",
    label: "LCP Reduced",
    sub: "// Virtualized Feeds",
  },
  {
    number: "100",
    sup: "k+",
    label: "Standards Synced",
    sub: "// BSI Enterprise",
  },
];

export function Hero() {
  return (
    <div className="xl:flex xl:h-[calc(100svh)] xl:flex-col pt-16">
      <section
        aria-labelledby="hero-heading"
        className="grid grid-cols-1 border-b border-p-border xl:flex-1 xl:min-h-0 xl:grid-cols-[55%_45%]"
      >
        <div className="flex flex-col justify-center px-6 py-14 md:px-12 md:py-20 xl:h-full xl:border-r xl:border-p-border">
          <div className="animate-fade-up animate-fade-up-1 mb-7 flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-p-accent">
            <span
              aria-hidden="true"
              className="h-px w-8 shrink-0 bg-p-accent"
            />
            Design Systems · Performance · Full-Stack Architecture
          </div>

          <h1
            id="hero-heading"
            className="animate-fade-up animate-fade-up-2 mb-3 font-sans text-[clamp(3rem,5.5vw,5rem)] font-bold leading-none tracking-tight"
          >
            Didd Tuni
          </h1>

          <h2 className="animate-fade-up animate-fade-up-2 mb-8 font-mono text-[clamp(1.1rem,1.8vw,1.4rem)] tracking-[0.04em] text-p-text2">
            Senior Software Engineer
          </h2>

          <p className="animate-fade-up animate-fade-up-3 mb-10 max-w-[60ch] text-base leading-[1.75] text-p-text2">
            15 years building production software, with 7+ years focused on
            React/TypeScript at scale. I ship{" "}
            <strong className="font-medium text-p-text">design systems</strong>,{" "}
            <strong className="font-medium text-p-text">
              performance-critical frontends
            </strong>
            , and{" "}
            <strong className="font-medium text-p-text">
              full-stack platforms
            </strong>{" "}
            for distributed, async-first teams.
          </p>

          <div className="animate-fade-up animate-fade-up-4 flex flex-wrap gap-4">
            <Button
              className="h-12 w-40"
              asChild
              data-analytics="hero-view-work"
            >
              <a href="#projects">View My Work</a>
            </Button>

            <Button
              variant="outline"
              className="h-12 w-40"
              asChild
              data-analytics="hero-get-in-touch"
            >
              <a href="mailto:contact@diddtuni.dev">Get in Touch</a>
            </Button>
          </div>

          <div className="animate-fade-up animate-fade-up-4 mt-8 flex w-fit items-center gap-3 border border-p-border2 bg-p-bg2 px-5 py-4">
            <div
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-p-green shadow-[0_0_0_0_rgba(74,222,128,0.5)] animate-ping-green"
            />
            <div className="text-[0.78rem] text-p-text2">
              <strong className="font-medium text-p-text">Available now</strong>{" "}
              — Remote via US-registered LLC, US/EU/UAE time zones
            </div>
          </div>
        </div>

        <HeroImage />
      </section>

      <div
        role="list"
        aria-label="Key metrics"
        className="grid grid-cols-2 gap-px border-b border-p-border bg-p-border lg:grid-cols-4 xl:shrink-0"
      >
        {metrics.map((m, i) => (
          <div
            key={m.label}
            role="listitem"
            className="group relative bg-p-bg2 px-6 py-8 transition-colors duration-200 hover:bg-p-bg3"
          >
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[2px] bg-p-accent origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
            />

            <div
              aria-hidden="true"
              className="mb-3 font-mono text-[0.55rem] text-p-text3 tracking-[0.15em] uppercase opacity-50"
            >
              {String(i + 1).padStart(2, "0")}
            </div>

            <div className="mb-1 font-serif text-[2.8rem] leading-none text-p-text tracking-tight">
              {m.number}
              <sup className="ml-0.5 align-super text-[1rem] font-sans font-medium text-p-accent">
                {m.sup}
              </sup>
            </div>

            <div className="mb-1.5 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-p-text2">
              {m.label}
            </div>

            <div
              aria-hidden="true"
              className="font-mono text-[0.6rem] text-p-accent opacity-60"
            >
              {m.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
