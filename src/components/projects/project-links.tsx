import { ArrowUpRight } from "lucide-react";

type ProjectLinksProps = {
  links: { label: string; href: string; dim?: boolean }[];
};

export function ProjectLinks({ links }: ProjectLinksProps) {
  return (
    <nav aria-label="Project links" className="flex flex-wrap gap-x-5 gap-y-2">
      {links.map((link) => {
        const isExternal = link.href.startsWith("http");
        return (
          <a
            key={`${link.href}-${link.label}`}
            href={link.href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            aria-label={
              isExternal ? `${link.label} (opens in new tab)` : undefined
            }
            className={`text-[0.7rem] font-medium tracking-[0.08em] uppercase no-underline flex items-center gap-1.5 transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-p-bg
              ${
                link.dim
                  ? "text-p-text3 hover:text-p-text2"
                  : "text-p-accent hover:text-p-accent2"
              }`}
          >
            <ArrowUpRight aria-hidden="true" className="size-3" />
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
