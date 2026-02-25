import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-6 py-16 md:py-24">
      <section className="w-full rounded-2xl border border-p-border/60 bg-p-bg/80 px-8 py-12 text-center shadow-[0_2px_16px_rgba(0,0,0,0.04)] md:px-12 md:py-16">
        <p className="font-mono text-[0.68rem] tracking-[0.14em] text-p-accent uppercase">
          404
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-p-text md:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-p-text3 md:text-base">
          The page you requested does not exist or may have moved.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            data-analytics="not-found-home"
            className="inline-flex items-center rounded-full border border-p-border px-4 py-2 text-sm text-p-text transition-colors duration-200 hover:border-p-accent/40 hover:text-p-accent"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
