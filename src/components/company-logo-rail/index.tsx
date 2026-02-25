const companies = [
  { name: "TheoremOne", role: "Sr. Frontend Engineer" },
  { name: "BSI", role: "Sr. Frontend Engineer" },
  { name: "SOAX", role: "Full Stack Engineer" },
  { name: "Amaly Legacy", role: "Sr. Software Engineer" },
  { name: "AKASHA Foundation", role: "Sr. Frontend Engineer" },
  { name: "Ethiopian Airlines", role: "Full Stack Engineer" },
] as const;

const staggerClass = [
  "animate-fade-up-1",
  "animate-fade-up-2",
  "animate-fade-up-3",
  "animate-fade-up-4",
] as const;

export function CompanyLogoRail() {
  return (
    <section
      aria-label="Companies I've worked with"
      className="border-b border-p-border/70 bg-linear-to-b from-p-bg to-p-bg2/30 dark:from-p-bg dark:to-p-bg"
    >
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="mb-6 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-px w-10 bg-p-border2/80 dark:bg-white/15"
          />
          <p className="text-[10px] uppercase tracking-[0.3em] text-p-text2 dark:text-white/50">
            Companies I&apos;ve worked with
          </p>
        </div>

        <ul className="flex flex-wrap justify-center gap-2.5 lg:gap-x-3 lg:gap-y-3">
          {companies.map((company, index) => (
            <CompanyPill
              key={company.name}
              name={company.name}
              role={company.role}
              stagger={staggerClass[index % 4]}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function CompanyPill({
  name,
  role,
  stagger,
}: {
  name: string;
  role: string;
  stagger: string;
}) {
  return (
    <li className="list-none">
      <div
        className={`
          inline-flex items-center gap-3 rounded-full px-5 py-2.5
          animate-fade-up ${stagger}
          border border-p-border/40 bg-white/20 backdrop-blur-sm
          shadow-[0_1px_2px_rgba(0,0,0,0.04)]
          transition-all duration-300 ease-out
          hover:border-p-border2/80 hover:bg-white/40 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:scale-[1.02]
          dark:border-white/[0.07] dark:bg-white/3 dark:backdrop-blur-md
          dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.03)]
          dark:hover:border-white/[0.14] dark:hover:bg-white/6 dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
        `}
      >
        <span className="text-[0.84rem] font-semibold tracking-tight whitespace-nowrap text-p-text dark:text-white/90">
          {name}
        </span>

        <span
          aria-hidden="true"
          className="hidden h-4 w-px rounded-full bg-p-border2/40 dark:bg-white/12 lg:block"
        />

        <span className="hidden text-[0.7rem] font-light tracking-wide whitespace-nowrap text-p-text3/60 dark:text-white/35 lg:block">
          {role}
        </span>
      </div>
    </li>
  );
}
