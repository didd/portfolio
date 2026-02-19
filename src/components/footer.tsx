export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-p-border px-6 md:px-12 py-7 flex flex-col md:flex-row justify-between items-center gap-3 text-center"
    >
      <div className="text-[0.72rem] text-p-text3">
        © 2026 <span className="text-p-accent">Didd Tuni</span> · Addis Ababa,
        Ethiopia
      </div>
      <div className="font-mono text-[0.62rem] text-p-text3 tracking-[0.08em]">
        <a
          href="mailto:didd.tuni@gmail.com"
          className="text-p-text3 no-underline hover:text-p-accent transition-colors duration-200"
        >
          didd.tuni@gmail.com
        </a>
        {" · Built with Next.js + Tailwind"}
      </div>
    </footer>
  );
}
