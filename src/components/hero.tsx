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
  { number: "87", sup: "%", label: "CI/CD Faster", sub: "// CircleCI" },
  { number: "1.2", sup: "s", label: "LCP Improved", sub: "// Core Web Vitals" },
  {
    number: "100",
    sup: "k+",
    label: "Standards Synced",
    sub: "// BSI Enterprise",
  },
  {
    number: "7",
    sup: "+",
    label: "Nonprofits Onboarded",
    sub: "// Soulful Platform",
  },
];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="min-h-screen grid grid-cols-1 lg:grid-cols-[55%_45%] pt-16 border-b border-p-border"
    >
      {/* Left */}
      <div className="flex flex-col justify-center px-6 py-14 md:px-12 md:py-20 lg:border-r border-p-border">
        <div className="animate-fade-up animate-fade-up-1 font-mono text-[0.68rem] text-p-accent tracking-[0.18em] uppercase mb-7 flex items-center gap-3">
          <span aria-hidden="true" className="w-8 h-px bg-p-accent shrink-0" />
          Open to contract &amp; full-time roles
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
          <Button className="h-12 w-40" asChild>
            <a href="#projects">View My Work</a>
          </Button>
          <Button variant="outline" className="h-12 w-40" asChild>
            <a href="mailto:didd.tuni@gmail.com">Get in Touch</a>
          </Button>
        </div>
      </div>

      {/* Right */}
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

        <div className="mt-6 flex items-center gap-3 px-5 py-4 border border-p-border2 bg-p-bg">
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
    </section>
  );
}
