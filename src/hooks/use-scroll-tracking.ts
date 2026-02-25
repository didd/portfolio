"use client";

import { useEffect } from "react";
import { trackScrollDepth } from "@/lib/analytics";

/**
 * Track portfolio section visibility using IntersectionObserver
 * Monitors when users reach major sections: projects (25%), about (50%), references (75%), contact (100%)
 * More performant than scroll events - only fires when sections enter/exit viewport
 *
 * Helps measure:
 * - How many visitors explore beyond the hero section
 * - Engagement depth through your portfolio
 * - Interest in specific sections (projects, testimonials, contact)
 */
export function useScrollTracking(): void {
  useEffect(() => {
    // Track which depth milestones we've already reported
    // Prevents duplicate events if user scrolls up and down
    const trackedMilestones = new Set<number>();

    /**
     * IntersectionObserver callback - fires when sections enter/exit viewport
     * Calculates approximate scroll depth based on which sections are visible
     */
    const handleIntersection = (entries: IntersectionObserverEntry[]): void => {
      // Find the deepest section currently visible in viewport
      let maxDepth = 0;

      entries.forEach((entry: IntersectionObserverEntry) => {
        if (!entry.isIntersecting) return;

        const sectionId = entry.target.id;
        const sectionDepth = getSectionDepth(sectionId);
        if (sectionDepth > maxDepth) {
          maxDepth = sectionDepth;
        }
      });

      // Track the milestone if it's new
      if (maxDepth > 0 && !trackedMilestones.has(maxDepth)) {
        trackedMilestones.add(maxDepth);
        trackScrollDepth(maxDepth);
      }
    };

    /**
     * Map portfolio section IDs to scroll depth percentages
     * Helps track user engagement through your portfolio sections
     */
    const getSectionDepth = (sectionId: string): number => {
      const depthMap: Record<string, number> = {
        projects: 25, // First section after hero
        about: 50, // Mid-portfolio
        references: 75, // Near end (testimonials)
        contact: 100, // Bottom (call-to-action)
      };
      return depthMap[sectionId] || 0;
    };

    // Create observer to watch portfolio sections
    // threshold: [0] means fire when any part of section enters viewport
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0,
      rootMargin: "-50% 0px",
    });

    // Observe all portfolio section elements
    const sections = document.querySelectorAll(
      "#projects, #about, #references, #contact",
    );

    sections.forEach((section: Element) => {
      observer.observe(section);
    });

    // Cleanup: stop observing on unmount
    return (): void => {
      sections.forEach((section: Element) => {
        observer.unobserve(section);
      });
      observer.disconnect();
    };
  }, []);
}
