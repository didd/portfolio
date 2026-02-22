import Image from "next/image";

type LogoItem = {
  name: string;
  src: string;
  width: number;
  height: number;
  shortLabel?: string;
  stageWidthClass: string;
  stageHeightClass: string;
  imageClassName?: string;
  darkImageClassName?: string;
  colSpanClass?: string;
};

const logos: readonly LogoItem[] = [
  {
    name: "TheoremOne",
    shortLabel: "TheoremOne",
    src: "/logos/theorem-one.svg",
    width: 184,
    height: 22,
    stageWidthClass: "w-[145px]",
    stageHeightClass: "h-6",
    darkImageClassName: "dark:invert dark:brightness-110",
  },
  {
    name: "BSI",
    shortLabel: "BSI",
    src: "/logos/bsi.svg",
    width: 401,
    height: 249,
    stageWidthClass: "w-[70px]",
    stageHeightClass: "h-6",
    darkImageClassName: "dark:invert dark:brightness-110",
  },
  {
    name: "SOAX",
    shortLabel: "SOAX",
    src: "/logos/soax.svg",
    width: 138,
    height: 28,
    stageWidthClass: "w-[112px]",
    stageHeightClass: "h-6",
    darkImageClassName: "dark:invert dark:brightness-110",
  },
  {
    name: "Amaly Legacy",
    shortLabel: "Amaly Legacy",
    src: "/logos/amaly-legacy.png",
    width: 474,
    height: 94,
    stageWidthClass: "w-[140px] sm:w-[220px]",
    stageHeightClass: "h-8 sm:h-10",
    colSpanClass: "sm:col-span-2 lg:col-span-2",
    imageClassName: "object-contain",
    darkImageClassName: "dark:brightness-110",
  },
  {
    name: "AKASHA Foundation",
    shortLabel: "AKASHA",
    src: "/logos/akasha.svg",
    width: 26,
    height: 25,
    stageWidthClass: "w-[42px]",
    stageHeightClass: "h-9",
    darkImageClassName: "dark:invert dark:brightness-110",
  },
  {
    name: "Ethiopian Airlines",
    shortLabel: "Ethiopian Airlines",
    src: "/logos/ethiopian-airlines.svg",
    width: 570,
    height: 240,
    stageWidthClass: "w-[176px]",
    stageHeightClass: "h-9",
    imageClassName: "scale-110",
    darkImageClassName: "dark:brightness-125 dark:contrast-125",
  },
] as const;

export default function CompanyLogoRail() {
  return (
    <section className="border-b border-p-border/70 bg-linear-to-b from-p-bg to-p-bg2/30 dark:from-p-bg dark:to-p-bg">
      <div className="mx-auto max-w-7xl px-5 pt-8 pb-6 md:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-p-border2/80 dark:bg-white/15" />
            <p className="text-[10px] uppercase tracking-[0.25em] text-p-text2 dark:text-white/70">
              Companies I&apos;ve worked with
            </p>
          </div>
          <p className="hidden text-[8px] uppercase tracking-[0.12em] text-p-text3/50 dark:text-white/40 sm:block">
            Identification only
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {logos.map((logo, index) => (
            <li
              key={logo.name}
              className={["list-none min-w-0", logo.colSpanClass ?? ""].join(
                " ",
              )}
            >
              <div
                className={[
                  "animate-fade-up",
                  index % 4 === 0
                    ? "animate-fade-up-1"
                    : index % 4 === 1
                      ? "animate-fade-up-2"
                      : index % 4 === 2
                        ? "animate-fade-up-3"
                        : "animate-fade-up-4",
                  "group relative flex h-20 min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl px-2 sm:px-3",
                  "border border-p-border/70 bg-white/55",
                  "shadow-[0_1px_0_rgba(0,0,0,0.03)]",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-p-border2 hover:bg-white/70",
                  "dark:border-white/10 dark:bg-white/2",
                  "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
                  "dark:hover:border-white/15 dark:hover:bg-white/3",
                ].join(" ")}
                aria-label={logo.name}
                title={logo.name}
              >
                <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-white/70 dark:bg-white/10" />

                <div
                  className={[
                    "relative flex min-w-0 max-w-full items-center justify-center",
                    logo.stageWidthClass,
                    logo.stageHeightClass,
                  ].join(" ")}
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={logo.width}
                    height={logo.height}
                    className={[
                      "h-full w-full max-h-full max-w-full select-none object-contain",
                      logo.imageClassName ?? "",
                      logo.darkImageClassName ?? "",
                    ].join(" ")}
                    draggable={false}
                    unoptimized={logo.src.endsWith(".png")}
                  />
                </div>

                <span className="text-center text-[9px] uppercase tracking-[0.16em] text-p-text3 transition-colors group-hover:text-p-text2 dark:text-white/55 dark:group-hover:text-white/70">
                  {logo.shortLabel ?? logo.name}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[9px] uppercase tracking-[0.12em] text-p-text3/55 dark:text-white/35 sm:hidden">
          Identification only
        </p>
      </div>
    </section>
  );
}
