import { Tag } from "@/components/ui/tag";
import { ArrowUpRight } from "lucide-react";

const contactRows = [
  {
    label: "Email",
    value: "didd.tuni@gmail.com",
    href: "mailto:didd.tuni@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/didd",
    href: "https://github.com/didd",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/didd",
    href: "https://linkedin.com/in/didd",
  },
  { label: "Phone", value: "+251-911-367-174", href: null },
];

const prefTags = [
  "Remote",
  "US / EU Time Zones",
  "Contract or Full-time",
  "React / TypeScript",
  "Design Systems",
  "Fintech / SaaS / Web3",
  "Senior IC or Tech Lead",
];

export function Contact() {
  return (
    <section aria-labelledby="contact-heading">
      {/* Section header */}
      <div className="px-6 md:px-12 max-w-350 mx-auto mb-2">
        <div className="flex items-baseline gap-6">
          <span
            aria-hidden="true"
            className="font-mono text-[0.65rem] text-p-accent tracking-[0.15em] uppercase whitespace-nowrap"
          >
            {"//"} 03 — Let&apos;s Work Together
          </span>
          <h2
            id="contact-heading"
            className="font-serif text-[clamp(1.8rem,3vw,2.75rem)] leading-[1.1] tracking-tight"
          >
            <span className="whitespace-nowrap">Ready when</span>{" "}
            <span className="block sm:inline">
              <em className="italic text-p-accent">you are</em>
            </span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-p-border">
        {/* Left */}
        <div className="px-6 py-14 md:px-12 md:py-24 lg:border-r border-p-border">
          <h3 className="font-serif text-[clamp(1.8rem,3vw,2.75rem)] leading-[1.1] tracking-tight mb-5">
            Get in <em className="italic text-p-accent">touch</em>
          </h3>

          <p className="text-[0.95rem] text-p-text2 leading-[1.75] mb-10">
            I&apos;m open to senior frontend and full-stack contract or
            full-time roles, particularly with teams building complex React
            applications, design systems, or performance-critical platforms.
            Remote across US/EU time zones.
          </p>

          <dl
            aria-label="Contact information"
            className="flex flex-col gap-px bg-p-border border border-p-border rounded-2xl lg:rounded-none overflow-hidden"
          >
            {contactRows.map((row) => {
              const isExternal = row.href?.startsWith("http");

              return (
                <div
                  key={row.label}
                  className="group flex items-center px-5 py-[1.1rem] bg-p-bg2 gap-4 hover:bg-p-bg3 transition-colors duration-200"
                >
                  <dt className="text-[0.62rem] font-semibold tracking-widest uppercase text-p-text3 min-w-18">
                    {row.label}
                  </dt>

                  <dd className="text-[0.85rem] text-p-text flex-1 m-0">
                    {row.href ? (
                      <a
                        href={row.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        aria-label={
                          isExternal
                            ? `${row.label}: ${row.value} (opens in new tab)`
                            : `${row.label}: ${row.value}`
                        }
                        className="text-p-text no-underline hover:text-p-accent transition-colors duration-200"
                      >
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>

                  <span
                    aria-hidden="true"
                    className="text-p-accent flex items-center"
                  >
                    {row.href ? (
                      <a
                        href={row.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        aria-label={
                          isExternal
                            ? `Open ${row.label}: ${row.value} (opens in new tab)`
                            : `Open ${row.label}: ${row.value}`
                        }
                        className="inline-flex items-center justify-center rounded-md p-1 hover:bg-p-accent/10 transition-colors duration-200"
                      >
                        <ArrowUpRight className="size-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <span className="text-p-text3">—</span>
                    )}
                  </span>
                </div>
              );
            })}
          </dl>
        </div>

        {/* Right */}
        <div className="px-6 py-14 md:px-12 md:py-24 bg-p-bg2 flex flex-col justify-center">
          <h3 className="font-serif text-[1.75rem] text-p-text mb-4 leading-[1.2]">
            What I&apos;m looking for
          </h3>

          <p className="text-[0.88rem] text-p-text2 leading-[1.75] mb-8">
            Senior Frontend or Full Stack Engineer roles on teams that care
            about code quality, accessibility, and performance. I thrive in
            distributed environments, bring architectural thinking alongside IC
            execution, and have a track record of mentoring and cross-functional
            collaboration.
          </p>

          <ul
            role="list"
            aria-label="Work preferences"
            className="flex flex-wrap gap-2 list-none"
          >
            {prefTags.map((tag) => (
              <li key={tag}>
                <Tag variant="outline">{tag}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
