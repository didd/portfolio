import { Tag } from "@/components/ui/tag";

const timeline = [
  {
    period: "APR 2022 – PRESENT",
    role: "Senior Software Engineer",
    company: "Amaly Legacy — Soulful Fundraising Platform",
  },
  {
    period: "SEP 2022 – JAN 2026",
    role: "Senior Frontend Engineer",
    company: "AKASHA Foundation — Web3 / Open Source",
  },
  {
    period: "OCT 2021 – JUL 2023",
    role: "Full Stack Engineer (Part-time)",
    company: "SOAX — Proxy & Data Platform",
  },
  {
    period: "MAR 2021 – MAY 2022",
    role: "Senior Frontend Engineer",
    company: "TheoremOne — Client: BSI",
  },
  {
    period: "JAN 2018 – FEB 2020",
    role: "Chief Technology Officer",
    company: "Lineation Technology Development",
  },
  {
    period: "JAN 2014 – MAR 2021",
    role: "Software Engineer (Consulting)",
    company: "Independent — incl. Namogoo (Series C, $40M+)",
  },
  {
    period: "SEP 2011 – NOV 2013",
    role: "Full Stack Engineer",
    company: "Ethiopian Airlines",
  },
];

const skills: { category: string; items: string[] }[] = [
  {
    category: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "TanStack Router",
      "TanStack Virtual",
      "Apollo Client",
      "Redux",
      "Zustand",
      "React Hook Form",
      "Styled Components",
      "Accessibility (a11y)",
      "Sass",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "GraphQL",
      "REST APIs",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Prisma",
    ],
  },
  {
    category: "DevOps & Infrastructure",
    items: [
      "Docker",
      "AWS EKS",
      "AWS S3 / RDS",
      "GCP",
      "GitHub Actions",
      "CircleCI",
      "GitLab CI",
      "Nginx",
    ],
  },
  {
    category: "Testing & Build",
    items: [
      "Jest",
      "Cypress",
      "Playwright",
      "React Testing Library",
      "Vitest",
      "Nx",
      "Turborepo",
      "Webpack",
      "Vite",
    ],
  },
  {
    category: "Architecture",
    items: [
      "Microfrontend / Module Federation",
      "Domain-Driven Design",
      "Onion Architecture",
      "Event Sourcing",
      "Clean Architecture",
      "Agile / Scrum",
    ],
  },
  {
    category: "Open Source",
    items: ["AKASHA UI (33+ components)", "AKASHA Core (Web3 framework)"],
  },
];

export function About() {
  return (
    <section
      aria-labelledby="about-heading"
      className="border-b border-p-border"
    >
      {/* Section header */}
      <div className="px-6 md:px-12 max-w-350 mx-auto mb-2">
        <div className="flex items-baseline gap-6">
          <span
            aria-hidden="true"
            className="font-mono text-[0.65rem] text-p-accent tracking-[0.15em] uppercase whitespace-nowrap"
          >
            {"//"} 02 — Background
          </span>
          <h2
            id="about-heading"
            className="font-serif text-[clamp(1.8rem,3vw,2.75rem)] leading-[1.1] tracking-tight"
          >
            Built on <em className="italic text-p-accent">15 years</em> of
            shipping
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-p-border">
        {/* Left — bio & timeline */}
        <div className="px-6 py-14 md:px-12 md:py-24 lg:border-r border-p-border">
          <div aria-label="Bio">
            <p className="text-[0.95rem] text-p-text2 leading-[1.8] mb-5">
              I&apos;m a{" "}
              <strong className="text-p-text font-medium">
                Senior Frontend &amp; Full Stack Engineer
              </strong>{" "}
              based in Addis Ababa, Ethiopia, operating globally via B2B
              contract through Didd Tuni LLC (U.S.-registered, Delaware). I work
              across US/EU time zones with distributed teams.
            </p>
            <p className="text-[0.95rem] text-p-text2 leading-[1.8] mb-5">
              My work spans{" "}
              <strong className="text-p-text font-medium">
                open-source design systems
              </strong>
              ,{" "}
              <strong className="text-p-text font-medium">
                enterprise platforms
              </strong>
              , and{" "}
              <strong className="text-p-text font-medium">
                full-stack architecture
              </strong>{" "}
              — from authoring 33+ components adopted in production across 8
              Web3 apps, to architecting a fundraising platform serving
              nonprofits globally.
            </p>
            <p className="text-[0.95rem] text-p-text2 leading-[1.8] mb-5">
              I&apos;ve led engineering teams, mentored engineers, and scaled a
              team from 0 to 8 as CTO at an early-stage startup. I care about{" "}
              <strong className="text-p-text font-medium">accessibility</strong>
              , <strong className="text-p-text font-medium">performance</strong>
              , and code that the next engineer can reason about.
            </p>
          </div>

          {/* Timeline */}
          <ol
            aria-label="Career timeline"
            className="mt-10 flex flex-col border-l border-p-border2 list-none"
          >
            {timeline.map((item) => (
              <li
                key={item.period}
                className="relative pl-7 py-5 border-b border-p-border hover:bg-white/1 transition-colors duration-200"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-1 top-[1.6rem] size-1.75 rounded-full bg-p-accent border-2 border-p-bg"
                />
                <time className="font-mono text-[0.6rem] text-p-text3 tracking-widest mb-1 block">
                  {item.period}
                </time>
                <div className="text-[0.88rem] font-medium text-p-text mb-0.5">
                  {item.role}
                </div>
                <div className="text-[0.78rem] text-p-text3">
                  {item.company}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Right — skills */}
        <div
          aria-label="Technical skills"
          className="px-6 py-14 md:px-12 md:py-24 bg-p-bg2"
        >
          {skills.map((section, i) => (
            <div
              key={section.category}
              role="group"
              aria-label={section.category}
            >
              <h4
                className={`font-mono text-[0.62rem] text-p-accent tracking-[0.14em] uppercase mb-3.5 ${i > 0 ? "mt-7" : ""}`}
              >
                <span aria-hidden="true">{"// "}</span>
                {section.category}
              </h4>
              <ul role="list" className="flex flex-wrap gap-1.5 mb-2 list-none">
                {section.items.map((skill) => (
                  <li key={skill}>
                    <Tag variant="outline">{skill}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
