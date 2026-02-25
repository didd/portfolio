"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "./globe";

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
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    if (!isImageOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsImageOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isImageOpen]);

  return (
    <section
      aria-labelledby="hero-heading"
      className="min-h-screen grid grid-cols-1 lg:grid-cols-[55%_45%] pt-16 border-b border-p-border"
    >
      <div className="flex flex-col justify-center px-6 py-14 md:px-12 md:py-20 lg:border-r border-p-border">
        <button
          type="button"
          onClick={() => setIsImageOpen(true)}
          className="group animate-fade-up animate-fade-up-1 mb-8 inline-flex w-fit flex-col items-center gap-2 text-center rounded-lg transition-all hover:text-p-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-accent focus-visible:ring-offset-2 focus-visible:ring-offset-p-bg"
          aria-label="Open larger portfolio photo"
        >
          <div className="relative h-24 w-36 md:h-28 md:w-42 shrink-0 overflow-hidden rounded-lg border border-p-border2">
            <Image
              src="/images/didd-tuni.JPG"
              alt="Didd Tuni"
              fill
              quality={100}
              sizes="(min-width: 768px) 168px, 144px"
              className="object-cover object-[50%_24%] transition-transform duration-300 group-hover:scale-[1.03]"
              priority
            />
          </div>

          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-p-text3">
            View portrait
          </span>
        </button>

        <div className="animate-fade-up animate-fade-up-1 font-mono text-[0.68rem] text-p-accent tracking-[0.18em] uppercase mb-7 flex items-center gap-3">
          <span aria-hidden="true" className="w-8 h-px bg-p-accent shrink-0" />
          Design Systems · Performance · Full-Stack Architecture
        </div>

        <h1
          id="hero-heading"
          className="animate-fade-up animate-fade-up-2 font-sans text-[clamp(3rem,5.5vw,5rem)] font-bold leading-none tracking-tight mb-3"
        >
          Didd Tuni
        </h1>

        <h2 className="animate-fade-up animate-fade-up-2 font-mono text-[clamp(1.1rem,1.8vw,1.4rem)] text-p-text2 tracking-[0.04em] mb-8">
          Senior Frontend Engineer
        </h2>

        <p className="animate-fade-up animate-fade-up-3 text-base text-p-text2 max-w-120 leading-[1.75] mb-10">
          15 years building high-performance React/TypeScript applications
          across Web3, enterprise SaaS, nonprofit tech, and fintech.
          Specializing in{" "}
          <strong className="text-p-text font-medium">design systems</strong>,{" "}
          <strong className="text-p-text font-medium">
            performance engineering
          </strong>
          , and{" "}
          <strong className="text-p-text font-medium">
            full-stack architecture
          </strong>{" "}
          across co-located and distributed teams in fintech, transportation,
          aviation, Web3, and e-commerce.
        </p>

        <div className="animate-fade-up animate-fade-up-4 flex gap-4 flex-wrap">
          <Button className="h-12 w-40" asChild data-analytics="hero-view-work">
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

        <div className="animate-fade-up animate-fade-up-4 mt-8 flex items-center gap-3 px-5 py-4 border border-p-border2 bg-p-bg2 w-fit">
          <div
            aria-hidden="true"
            className="size-1.75 rounded-full bg-p-green shrink-0 shadow-[0_0_0_0_rgba(74,222,128,0.5)] animate-ping-green"
          />
          <div className="text-[0.78rem] text-p-text2">
            <strong className="text-p-text font-medium">Available now</strong> —
            Remote, US/EU time zones
          </div>
        </div>
      </div>

      
      <div className="flex flex-col justify-center px-6 py-14 md:px-12 md:py-20 bg-p-bg2">
        <Globe />

        <div
          role="list"
          aria-label="Key metrics"
          className="grid grid-cols-2 gap-px bg-p-border border border-p-border"
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              role="listitem"
              className="bg-p-bg2 px-6 py-7 hover:bg-p-bg3 transition-colors duration-200"
            >
              <div className="font-serif text-[2.5rem] text-p-text leading-none mb-0.5">
                {m.number}
                <sup className="text-[1.1rem] text-p-accent align-super">
                  {m.sup}
                </sup>
              </div>
              <div className="text-[0.7rem] text-p-text3 tracking-[0.08em] uppercase font-medium">
                {m.label}
              </div>
              <div
                aria-hidden="true"
                className="font-mono text-[0.62rem] text-p-accent mt-1.5 opacity-70"
              >
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isImageOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio image preview"
          className="fixed inset-0 z-1200 bg-black/80 p-4 md:p-8 cursor-zoom-out"
          onClick={() => setIsImageOpen(false)}
        >
          <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
            <div
              className="relative max-h-full w-full overflow-hidden rounded-xl border border-white/20 bg-black"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsImageOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-md border border-white/30 bg-black/65 px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label="Close image preview"
              >
                Close
              </button>

              <Image
                src="/images/didd-tuni.JPG"
                alt="Didd Tuni portrait"
                width={1800}
                height={1200}
                className="h-auto max-h-[85vh] w-auto max-w-full object-contain mx-auto"
                priority={false}
              />

              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md bg-black/55 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-white/85">
                Press Esc to close
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
