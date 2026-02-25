import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <section className="rounded-2xl border border-p-border/60 bg-p-bg/80 shadow-[0_2px_16px_rgba(0,0,0,0.04)] px-8 py-12 md:px-12 md:py-16">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-p-accent mb-6">
          Privacy Policy
        </h1>
        <p className="mb-4 text-p-text text-base">
          This portfolio website (`diddtuni.dev`) is operated by Didd Tuni.
          This page explains what data is collected, how it is used, and your
          choices.
        </p>
        <p className="mb-4 text-p-text3 text-sm">Last updated: February 24, 2026</p>
        <h2 className="font-serif text-xl text-p-accent mt-8 mb-2">
          What We Collect
        </h2>
        <ul className="list-disc ml-6 mb-4 text-p-text3">
          <li>
            Usage analytics through Google Analytics 4 (GA4), including page
            views, approximate location, device/browser details, and interaction
            events.
          </li>
          <li>
            Event tracking implemented in this codebase, including:
            `data-analytics` click events, `page_view`, scroll depth, and
            outbound link clicks.
          </li>
          <li>
            Information you intentionally send by email (for example, your email
            address and message content when contacting `contact@diddtuni.dev`).
          </li>
        </ul>
        <h2 className="font-serif text-xl text-p-accent mt-8 mb-2">
          How We Use Data
        </h2>
        <ul className="list-disc ml-6 mb-4 text-p-text3">
          <li>To understand portfolio engagement and improve the site.</li>
          <li>To measure traffic and interactions across sections/projects.</li>
          <li>To respond to direct contact requests.</li>
        </ul>
        <h2 className="font-serif text-xl text-p-accent mt-8 mb-2">
          Third-Party Services
        </h2>
        <ul className="list-disc ml-6 mb-4 text-p-text3">
          <li>
            Google Analytics 4 (GA4) is used for analytics. See{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener"
              className="text-p-accent underline"
            >
              Google&apos;s privacy policy
            </a>
            .
          </li>
          <li>
            External links (for example LinkedIn or X) are outside this site&apos;s
            control and follow their own privacy policies.
          </li>
        </ul>
        <h2 className="font-serif text-xl text-p-accent mt-8 mb-2">
          Your Rights
        </h2>
        <ul className="list-disc ml-6 mb-4 text-p-text3">
          <li>
            You can request deletion of correspondence you sent directly by
            emailing{" "}
            <a
              href="mailto:contact@diddtuni.dev"
              className="text-p-accent underline"
            >
              contact@diddtuni.dev
            </a>
            .
          </li>
          <li>
            You can limit analytics tracking through browser privacy settings,
            ad/tracker blocking tools, or Google Analytics opt-out tools.
          </li>
        </ul>
        <h2 className="font-serif text-xl text-p-accent mt-8 mb-2">Contact</h2>
        <p className="mb-8 text-p-text3">
          Questions about this policy can be sent to{" "}
          <a
            href="mailto:contact@diddtuni.dev"
            className="text-p-accent underline"
          >
            contact@diddtuni.dev
          </a>
          .
        </p>
        <hr className="my-8 border-p-border/30" />
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-p-accent mb-6">
          Disclaimer
        </h1>
        <p className="mb-4 text-p-text text-base">
          Testimonials and references are personal opinions of the quoted
          individuals. External links are provided for convenience and are not
          controlled by Didd Tuni.
        </p>
        <p className="mb-2 text-p-text3">
          This site is for informational purposes only. All content is provided
          &quot;as is&quot; without warranty of any kind.
        </p>
        <div className="mt-10 text-center">
          <Link href="/" className="text-p-accent underline font-medium">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
