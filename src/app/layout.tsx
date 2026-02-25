import type { Metadata } from "next";
import { playfairDisplay, inter, firaCode } from "./fonts";
import "./globals.css";
import { BackToTopButton } from "@/components/back-to-top";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "Didd Tuni — Senior Frontend Engineer",
  description:
    "Senior Frontend & Full Stack Engineer specializing in React architecture, design systems, and performance. 15 years building high-performance applications.",
  authors: [{ name: "Didd Tuni", url: "https://diddtuni.dev" }],
  creator: "Didd Tuni",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://diddtuni.dev",
    title: "Didd Tuni — Senior Frontend Engineer",
    description:
      "React architecture • Design systems • Performance optimization • Full-stack development",
    images: [
      {
        url: "https://diddtuni.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Didd Tuni - Senior Frontend Engineer",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Didd Tuni — Senior Frontend Engineer",
    description:
      "React architecture • Design systems • Performance optimization • Full-stack development",
    creator: "@didd_tuni",
    images: ["https://diddtuni.dev/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (localStorage.getItem('theme') === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ErrorBoundary>
          {children}
          <BackToTopButton />
        </ErrorBoundary>
      </body>
    </html>
  );
}
