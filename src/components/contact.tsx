import { Tag } from "@/components/ui/tag";

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
            Ready when <em className="italic text-p-accent">you are</em>
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
            className="flex flex-col gap-px bg-p-border border border-p-border"
          >
            {contactRows.map((row) => {
              const isExternal = row.href?.startsWith("http");

              return (
                <div
                  key={row.label}
                  className="flex items-center px-5 py-[1.1rem] bg-p-bg2 gap-4"
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
                    className="text-[0.9rem] text-p-accent"
                  >
                    {row.href ? "↗" : "—"}
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
