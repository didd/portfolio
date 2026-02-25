import { Linkedin, Mail } from "lucide-react";

type Reference = {
  quote: string;
  name: string;
  role: string;
  company: string;
  companyStatus?: "previous";
  linkedin?: string;
  twitter?: string;
  email?: string;
  emailUponRequest?: boolean;
};

const references: Reference[] = [
  {
    quote:
      "Didd distinguished himself as a high-performing engineer with exceptional technical aptitude. He possesses a sharp level of understanding that allows him to grasp complex architectural requirements almost immediately. He is a start-to-finish engineer who can take a vague concept and transform it into a production-ready feature with minimal supervision.",
    name: "Marius Darila",
    role: "Senior Software Engineer",
    company: "AKASHA Foundation",
    companyStatus: "previous",
    linkedin: "https://www.linkedin.com/in/marius-d-8706506a",
  },
  {
    quote:
      "Didd stands out as a strong, capable engineer who quickly understands complex problems and works with a high level of independence. He approaches tasks thoughtfully, cares about quality, and follows through to completion — not just aiming to make things work, but to make them work well and remain maintainable over time.",
    name: "Z Ξ R O",
    role: "Executive Director",
    company: "AKASHA Foundation",
    twitter: "https://x.com/AKASHAZERO",
    emailUponRequest: true,
  },
  {
    quote:
      "Didd is an exceptional Senior Software Engineer with a rare ability to bridge design and implementation seamlessly. He consistently takes the time to deeply understand design intent and translates it into high-quality, precise implementations, always with great attention to detail and strong engineering standards.",
    name: "Basma Alghanim",
    role: "Lead Product Designer",
    company: "AKASHA Foundation",
    companyStatus: "previous",
    linkedin: "https://www.linkedin.com/in/basmagh",
  },
  {
    quote:
      "He has an exceptional ability to design robust foundational architecture, deeply understand complex product requirements, and translate them into clean, effective code. In high-stakes situations involving critical clients who required complex customisations within extremely tight timelines, Didd consistently delivered — going above and beyond without compromising quality or security.",
    name: "Wahid A. Kamalian",
    role: "Managing Partner",
    company: "Amaly Legacy",
    linkedin: "https://www.linkedin.com/in/wahid-a-kamalian",
  },
  {
    quote:
      "I can definitely recommend him as a full-stack developer that pays attention to details. He onboarded to our existing codebase quickly and was able to ship changes with minimum guidance. Didd is the type of person that is easy to communicate with and collaborate with.",
    name: "Gregory Komissarov",
    role: "Former CTO",
    company: "SOAX",
    companyStatus: "previous",
    linkedin: "https://linkedin.com/in/gregorykomissarov",
  },
];

const STAGGER_DELAYS = [
  "animate-fade-up-1",
  "animate-fade-up-2",
  "animate-fade-up-3",
  "animate-fade-up-4",
] as const;

const getStagger = (index: number) =>
  STAGGER_DELAYS[index % STAGGER_DELAYS.length];

function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 1227"
      fill="currentColor"
      className={className}
    >
      <path d="M714.163 519.284 1160.89 0h-105.53L667.137 451.321 357.328 0H0l468.492 681.821L0 1226.37h105.537L515.228 750.167l327.444 476.203H1200L714.137 519.284h.026zM568.706 688.482l-47.293-67.724L145.88 83.21h162.564l303.061 433.914 47.293 67.724 396.612 567.732H892.847L568.706 688.508v-.026z" />
    </svg>
  );
}

export function References() {
  return (
    <section
      aria-labelledby="references-heading"
      className="border-b border-p-border"
    >
      <div className="mx-auto mb-2 max-w-350 px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span
            aria-hidden="true"
            className="whitespace-nowrap font-mono text-[0.65rem] tracking-[0.15em] text-p-accent uppercase"
          >
            {"//"} 03 — References
          </span>
          <h2
            id="references-heading"
            className="font-serif text-[clamp(1.8rem,3vw,2.75rem)] leading-[1.1] tracking-tight"
          >
            Kind <em className="text-p-accent italic">words</em>
          </h2>
        </div>
      </div>

      <div className="border-t border-p-border bg-linear-to-b from-p-bg to-p-bg2/40 dark:from-p-bg dark:to-p-bg2/20">
        <div className="mx-auto max-w-4xl px-6 py-14 md:px-12 md:py-24">
          <div className="flex flex-col gap-6 md:gap-7">
            {references.map((ref, index) => {
              const contactType = ref.linkedin
                ? "linkedin"
                : ref.twitter
                  ? "twitter"
                  : ref.email
                    ? "email"
                    : null;
              const href =
                ref.linkedin ||
                ref.twitter ||
                (ref.email ? `mailto:${ref.email}` : undefined);

              return (
                <article
                  key={ref.name}
                  className={`
                  group relative
                  animate-fade-up ${getStagger(index)}
                  rounded-2xl border border-p-border/60 bg-p-bg/80 backdrop-blur-sm
                  px-6 py-8 md:px-10 md:py-10
                  shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                  transition-all duration-300 ease-out
                  hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]
                  dark:border-white/6 dark:bg-white/2
                  dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                `}
                >
                  <span
                    aria-hidden="true"
                    className="-mb-4 block select-none font-serif text-[3rem] leading-none text-p-accent/15"
                  >
                    &ldquo;
                  </span>

                  <blockquote className="m-0">
                    <p className="font-serif text-[1rem] leading-[1.85] text-p-text italic md:text-[1.12rem] dark:text-white/90">
                      {ref.quote}
                    </p>

                    <footer className="mt-6 flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 flex items-start gap-3">
                        <div
                          aria-hidden="true"
                          className="mt-2 h-px w-6 shrink-0 bg-p-accent/40 transition-all duration-300 group-hover:w-10"
                        />

                        <div className="min-w-0">
                          <cite className="block not-italic text-[0.84rem] font-semibold tracking-tight text-p-text dark:text-white/90">
                            {ref.name}
                          </cite>

                          <span className="mt-0.5 block text-[0.72rem] leading-relaxed text-p-text3/80 dark:text-white/50">
                            {ref.role} ·{" "}
                            {ref.companyStatus === "previous"
                              ? `Previously at ${ref.company}`
                              : ref.company}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        {href && contactType && (
                          <a
                            href={href}
                            target={
                              contactType === "email" ? undefined : "_blank"
                            }
                            rel={
                              contactType === "email"
                                ? undefined
                                : "noopener noreferrer"
                            }
                            aria-label={
                              contactType === "linkedin"
                                ? `${ref.name} on LinkedIn (opens in new tab)`
                                : contactType === "twitter"
                                  ? `${ref.name} on X (opens in new tab)`
                                  : `Email ${ref.name}`
                            }
                            title={
                              contactType === "linkedin"
                                ? "LinkedIn recommendation"
                                : contactType === "twitter"
                                  ? "X profile"
                                  : "Email reference"
                            }
                            data-analytics={`reference-${contactType === "twitter" ? "x" : contactType}-${ref.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className="
                            inline-flex h-8 shrink-0 items-center gap-1.5
                            rounded-full border border-p-border/50 bg-p-bg2/50 px-2.5
                            text-p-text3/75
                            transition-all duration-200
                            hover:border-p-accent/40 hover:bg-p-accent/5 hover:text-p-accent
                            dark:border-white/6 dark:bg-white/3 dark:text-white/45
                            dark:hover:border-white/15 dark:hover:text-white/80
                          "
                          >
                            {contactType === "linkedin" ? (
                              <Linkedin className="size-3.5" />
                            ) : contactType === "twitter" ? (
                              <XLogoIcon className="size-3.5" />
                            ) : (
                              <Mail className="size-3.5" />
                            )}
                            <span className="hidden text-[0.68rem] font-medium tracking-tight sm:inline">
                              {contactType === "linkedin"
                                ? "LinkedIn"
                                : contactType === "twitter"
                                  ? "Profile"
                                  : "Email"}
                            </span>
                          </a>
                        )}
                        {ref.emailUponRequest && (
                          <span className="text-right text-[0.66rem] leading-tight text-p-text3/75 dark:text-white/45">
                            Email upon request
                          </span>
                        )}
                      </div>
                    </footer>
                  </blockquote>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
