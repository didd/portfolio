import { Project } from "@/types/projects";

export const projects = [
  {
    id: "akasha-ui",
    badge: { label: "Open Source", variant: "oss" },
    title: "AKASHA UI Component Library",
    role: "Senior Frontend Engineer · Sep 2022 – Jan 2026 · AKASHA Foundation (Web3 / Ethereum)",
    problem:
      "AKASHA World — a decentralized social platform on Ethereum — required a scalable component system for its microfrontend architecture. The existing library relied on monolithic components with rigid APIs (18+ prop buttons, deeply nested conditional branches, twind string concatenation) — making customization brittle and extending functionality costly. I redesigned the system around composable, compound component patterns built on shadcn/ui and Radix primitives.",
    impact: [
      "Led development of 33 React components — 20 custom domain primitives and 13 extended shadcn/ui foundations — using Compound Component patterns, Radix UI primitives, Tailwind CSS, and TypeScript",
      "Adopted across 8 microfrontend apps within AKASHA World's single-spa platform, reducing UI development time by ~30% and eliminating cross-app visual drift",
      "Built the Next.js documentation site with live previews, interactive examples, and a CLI installation workflow — developers can browse, test, and install components directly into their projects",
      "Designed theming layer using CSS variables and Tailwind config, allowing 8 apps to maintain distinct visual identities from a single component source",
    ],
    stack: [
      "React",
      "TypeScript",
      "shadcn/ui",
      "Tailwind CSS",
      "Radix UI",
      "Compound Components",
      "single-spa",
      "Next.js",
    ],
    links: [
      { label: "Documentation", href: "https://akasha-ui.pages.dev" },
      { label: "GitHub", href: "https://github.com/AKASHAorg/akasha-ui" },
      {
        label: "AKASHA World Preview",
        href: "https://next.akasha-world-framework.pages.dev",
      },
    ],
  },
  {
    id: "scroll-restoration",
    badge: { label: "Performance", variant: "perf" },
    title: "Virtualized Feed Scroll Restoration",
    role: "Senior Frontend Engineer · AKASHA Foundation · Technical Deep-Dive",
    problem:
      "Infinite scroll feeds with dynamic content heights caused scroll-jump on navigation and degraded LCP. Browser-native scroll restoration doesn't work with virtualized lists — items aren't in the DOM on remount — so I engineered a custom persistence and restore layer from scratch.",
    impact: [
      "Reduced Largest Contentful Paint by 1.2s through virtualized rendering and scroll position persistence",
      "Eliminated scroll-jump regressions on back-navigation across all virtualized feeds",
      "Implemented reference-item + offset-delta persistence — stores scroll config in sessionStorage on unmount, restores exact position on remount via cached measurements",
      "Added mobile-specific measurement path that reuses cached sizes on backward scroll, preventing ResizeObserver layout thrash mid-scroll",
      "Supports both window and element scroll contexts with automatic virtualizer detection",
    ],
    stack: [
      "TanStack Virtual",
      "ResizeObserver",
      "React",
      "TypeScript",
      "sessionStorage",
    ],
    links: [
      {
        label: "Preview",
        href: "https://akasha-ui.pages.dev/docs/components/infinite-scroll",
      },
      {
        label: "Source (akasha-core)",
        href: "https://github.com/AKASHAorg/akasha-ui/blob/main/registry/default/ui/infinite-scroll.tsx",
        dim: true,
      },
    ],
    code: [
      {
        label: "// infinite-scroll.tsx — mobile-aware measurement",
        language: "tsx",
        content: `// On mobile: reuse cached size when scrolling backward
// prevents layout thrash from ResizeObserver firing mid-scroll
measureElement: isMobile
  ? (element, entry, instance) => {
      const dataIndex = instance.indexFromElement(element);
      if (
        instance.scrollDirection === "backward" &&
        instance.measurementsCache?.[dataIndex]
      ) {
        return instance.measurementsCache[dataIndex].size;
      }
      return measureElement(element, entry, instance);
    }
  : measureElement`,
      },
      {
        label: "// infinite-scroll.tsx — scroll restoration on remount",
        language: "tsx",
        content: `// Restore measurements cache so virtualizer knows item sizes
// before rendering — eliminates flash of wrong-sized items
React.useEffect(() => {
  if (isWindowVirtualizer(virtualizer)) {
    virtualizer.setOptions({
      ...virtualizer.options,
      initialMeasurementsCache: getInitialMeasurementsCache({
        scrollConfigStorageKey,
      }),
    });
  }
}, [scrollConfigStorageKey, virtualizer]);

// Compensate for dynamic header height changes between navigations
React.useLayoutEffect(() => {
  const headerHeight = getHeaderHeight({
    scrollConfigStorageKey,
    lastScrollRestorationKey,
  });
  if (headerHeight) {
    headerRef.current?.setAttribute(
      'style', \`--min-height: \${headerHeight}px\`
    );
  }
}, [headerRef, lastScrollRestorationKey, scrollConfigStorageKey]);`,
      },
    ],
  },
  {
    id: "soulful",
    badge: { label: "Full Stack", variant: "full" },
    title: "Soulful — Global Fundraising Platform",
    role: "Senior Software Engineer (Part-time consulting) · Apr 2022 – Present · Amaly Legacy",
    problem:
      "Nonprofits globally struggled to process multi-currency donations, manage legacy giving across jurisdictions, and connect donor analytics end-to-end. I architected the platform from the ground up — Onion Architecture backend, embeddable frontend widget, payment orchestration — establishing the technical foundation the team continues to build on.",
    impact: [
      "Architected the full platform stack: Next.js, Nx, NestJS, AWS EKS — Onion Architecture with Domain / Use Case / Infrastructure layer separation across 62 modules",
      "Orchestrated 5 payment gateways (Stripe, PayPal, Telr, Flutterwave, Crypto) with unified handling for one-time, recurring, refunds, and webhook reconciliation",
      "Designed a FundraiseUp-style embeddable widget system with drag-and-drop configuration — full branding and payment customization, adopted by 7+ organizations",
      "Wired end-to-end analytics and donor communication: Stripe, Brevo, GA, Meta Pixel, Plaid (KYC), Zapier",
      "Set up GitHub Actions CI/CD for AWS ECR/EKS/S3 — deployment velocity increased 47%",
    ],
    stack: [
      "Next.js",
      "NestJS",
      "Nx",
      "GraphQL",
      "Prisma",
      "MongoDB",
      "AWS EKS",
      "Docker",
      "Stripe",
      "Brevo",
      "GitHub Actions",
    ],
    links: [
      { label: "Live Product", href: "https://www.amalylegacy.com/soulful" },
    ],
  },
  {
    id: "bsi-knowledge",
    badge: { label: "Enterprise", variant: "enterprise" },
    title: "BSI Knowledge — Standards Platform",
    role: "Senior Frontend Engineer · Mar 2021 – May 2022 · TheoremOne (client: British Standards Institution)",
    problem:
      "The UK's National Standards Body needed to transition from individual subscriptions to enterprise-wide access — syncing 100,000+ standards in real time across 50+ global organizations, with role-based access control, version tracking, and Shopify-gated content management.",
    impact: [
      "Implemented real-time sync of 100,000+ standards across 50+ enterprise organizations using Next.js and TanStack Query",
      "Shipped 'My Collection' — a library management system adopted by 50+ orgs that reduced compliance audit prep time by 40% through automated version monitoring and RBAC",
      "Developed Shopify paywall admin interface from scratch in Next.js for content access rule management across the digital standards library",
      "Built subscription management system handling organizations, users, modules, and collections with full validation via React Hook Form",
      "Ran 12+ code reviews weekly and mentored 2 junior engineers through pair programming across an 8-person team",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "TanStack Query",
      "React Hook Form",
      "Shopify",
      "REST APIs",
    ],
    links: [
      { label: "Live Product", href: "https://knowledge.bsigroup.com" },
      { label: "Architecture on request", href: "#contact", dim: true },
    ],
  },
] satisfies Project[];
