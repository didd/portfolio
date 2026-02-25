import { Tag } from "@/components/ui/tag";
import { ContactLinks } from "./contact-links";

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
      
      <div className="px-6 md:px-12 max-w-350 mx-auto mb-2">
        <div className="flex items-baseline gap-6">
          <span
            aria-hidden="true"
            className="font-mono text-[0.65rem] text-p-accent tracking-[0.15em] uppercase whitespace-nowrap"
          >
            {"//"} 04 — Let&apos;s Work Together
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

          <ContactLinks />
        </div>

        
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
