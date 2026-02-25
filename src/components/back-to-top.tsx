"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { prefersReducedMotion } from "@/utils/reduce-motion";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const reduceMotion = prefersReducedMotion();
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      data-analytics="back-to-top"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-200 inline-flex items-center justify-center size-10 rounded-lg border border-p-border bg-p-bg hover:bg-p-bg2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-accent/40"
    >
      <ChevronUp className="size-4 text-p-text" />
    </button>
  );
}
