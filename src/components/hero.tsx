"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const metrics = [
  {
    number: "15",
    sup: "yr",
    label: "Engineering",
    sub: "// React / TypeScript",
  },
  { number: "33", sup: "+", label: "UI Components", sub: "// Open Source" },
  {
    number: "1.2",
    sup: "s",
    label: "LCP Improved",
    sub: "// Core Web Vitals",
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
    <>
      <section
        aria-labelledby="hero-heading"
        className="grid min-h-screen grid-cols-1 border-b border-p-border pt-16 lg:grid-cols-[55%_45%]"
      >
        <div className="flex flex-col justify-center px-6 py-14 md:px-12 md:py-20 lg:border-r lg:border-p-border">
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
            Senior Frontend Engineer
          </h2>

          <p className="animate-fade-up animate-fade-up-3 mb-10 max-w-[60ch] text-base leading-[1.75] text-p-text2">
            15 years building high-performance React/TypeScript applications
            across Web3, enterprise SaaS, nonprofit tech, and fintech.
            Specializing in{" "}
            <strong className="font-medium text-p-text">design systems</strong>,{" "}
            <strong className="font-medium text-p-text">
              performance engineering
            </strong>
            , and{" "}
            <strong className="font-medium text-p-text">
              full-stack architecture
            </strong>{" "}
            across co-located and distributed teams in fintech, transportation,
            aviation, Web3, and e-commerce.
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
              — Remote, US/EU/UAE time zones
            </div>
          </div>
        </div>

        <div className="animate-fade-up animate-fade-up-1 relative min-h-[60vh] overflow-hidden bg-p-bg2 lg:min-h-0">
          <Image
            src="/images/didd-tuni.JPG"
            alt="Didd Tuni — Senior Frontend Engineer"
            fill
            priority
            quality={95}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-[center_20%]"
          />

          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.04)]" />
        </div>
      </section>

      <div
        role="list"
        aria-label="Key metrics"
        className="grid grid-cols-2 gap-px border-b border-p-border bg-p-border lg:grid-cols-4"
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            role="listitem"
            className="bg-p-bg2 px-6 py-7 transition-colors duration-200 hover:bg-p-bg3"
          >
            <div className="mb-0.5 font-serif text-[2.5rem] leading-none text-p-text">
              {m.number}
              <sup className="align-super text-[1.1rem] text-p-accent">
                {m.sup}
              </sup>
            </div>
            <div className="text-[0.7rem] uppercase tracking-[0.08em] text-p-text3">
              {m.label}
            </div>
            <div
              aria-hidden="true"
              className="mt-1.5 font-mono text-[0.62rem] text-p-accent opacity-70"
            >
              {m.sub}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
