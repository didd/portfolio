import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { PageContent } from "@/components/page-content";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { CompanyLogoRail } from "@/components/company-logo-rail";
import { References } from "@/components/references";

const PAGE_SECTIONS = [
  { label: "Work", hash: "#projects", Component: Projects },
  { label: "About", hash: "#about", Component: About },
  { label: "References", hash: "#references", Component: References },
  { label: "Contact", hash: "#contact", Component: Contact },
];

export default function Home() {
  return (
    <ThemeProvider>
      <AnalyticsProvider />
      <PageContent>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-999 focus:bg-p-accent focus:text-p-bg focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to main content
        </a>
        <Nav
          sections={PAGE_SECTIONS.map(({ label, hash }) => ({ label, hash }))}
        />
        <main id="main-content">
          <Hero />
          <CompanyLogoRail />
          {PAGE_SECTIONS.map(({ hash, Component }) => (
            <section key={hash} id={hash.slice(1)} className="scroll-mt-18.5">
              <Component />
            </section>
          ))}
        </main>

        <Footer />
      </PageContent>
    </ThemeProvider>
  );
}
