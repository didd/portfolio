import Link from "next/link";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-p-border px-6 md:px-12 py-7 flex flex-col md:flex-row justify-between items-center gap-3 text-center"
    >
      <div className="text-[0.72rem] text-p-text3">
        © 2026 <span className="text-p-accent">Didd Tuni</span> · Addis Ababa,
        Ethiopia & Dubai, United Arab Emirates
      </div>
      <div className="font-mono text-[0.62rem] text-p-text3 tracking-[0.08em]">
        <a
          href="mailto:contact@diddtuni.dev"
          data-analytics="footer-email"
          className="text-p-text3 no-underline hover:text-p-accent transition-colors duration-200"
        >
          contact@diddtuni.dev
        </a>
        {" · "}
        <Link
          href="/privacy"
          data-analytics="footer-privacy"
          className="text-p-text3 no-underline hover:text-p-accent transition-colors duration-200"
        >
          Privacy
        </Link>
        {" · Built with Next.js + Tailwind"}
      </div>
    </footer>
  );
}
