"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { NavSection } from "@/types/nav";
import { Button } from "./ui/button";

type NavProps = {
  sections: NavSection[];
};

export function Nav({ sections }: NavProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const sectionIds = useMemo(
    () => sections.map((s) => s.hash.slice(1)),
    [sections],
  );
  const activeId = useScrollSpy(sectionIds, navRef);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    if (mobileOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
      e.preventDefault();
      setMobileOpen(false);

      const el = document.querySelector(hash);
      if (!el) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });

      if (el instanceof HTMLElement) {
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }

      window.history.pushState(null, "", hash);
    },
    [],
  );

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Primary navigation"
        className="fixed top-0 left-0 right-0 z-200 flex items-center justify-between px-6 md:px-12 py-[1.2rem] bg-p-bg/90 backdrop-blur-lg border-b border-p-border"
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center size-8 border border-p-border2 font-mono text-[0.7rem] font-bold text-p-accent no-underline hover:border-p-accent transition-colors duration-200"
          aria-label="Go to homepage"
        >
          DT
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-10 list-none">
          {sections.map((item) => {
            const id = item.hash.slice(1);
            const isActive = activeId === id;

            return (
              <li key={item.label}>
                <Link
                  href={item.hash}
                  onClick={(e) => handleNavClick(e, item.hash)}
                  aria-current={isActive ? "true" : undefined}
                  className={`text-[0.73rem] font-medium tracking-widest uppercase no-underline transition-colors duration-200 ${
                    isActive
                      ? "text-p-accent"
                      : "text-p-text2 hover:text-p-text"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            aria-pressed={theme === "dark"}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </Button>

          <Button
            onClick={() => setMobileOpen((prev) => !prev)}
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-9999 bg-p-bg2 md:hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-6 py-[1.2rem] border-b border-p-border">
            <span className="font-serif text-[1.05rem] text-p-text">
              Didd <span className="text-p-accent">Tuni</span>
            </span>
            <Button
              onClick={() => setMobileOpen(false)}
              variant="outline"
              size="icon"
              aria-label="Close menu"
            >
              <X size={16} />
            </Button>
          </div>

          <ul className="flex flex-col items-center justify-center flex-1 gap-10 list-none">
            {sections.map((item) => {
              const id = item.hash.slice(1);
              const isActive = activeId === id;

              return (
                <li key={item.label}>
                  <Link
                    href={item.hash}
                    onClick={(e) => handleNavClick(e, item.hash)}
                    aria-current={isActive ? "true" : undefined}
                    className={`text-lg font-medium tracking-widest uppercase no-underline transition-colors duration-200 ${
                      isActive
                        ? "text-p-accent"
                        : "text-p-text2 hover:text-p-text"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
