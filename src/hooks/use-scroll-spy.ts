import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/utils/reduce-motion";
import {
  getScrollTopForSection,
  scrollToSection,
} from "@/utils/scroll-to-section";

type ScrollSpyWindow = Window & {
  __portfolioInitialHash__?: string;
};

type NavigateToId = (
  id: string,
  behavior?: ScrollBehavior,
  keepAligned?: boolean,
) => void;

/**
 * Tracks which page section is currently visible using a 1px IntersectionObserver
 * slice below the sticky nav. Syncs the URL hash and exposes a deterministic
 * section navigation helper that temporarily suspends spying while scrolling.
 */
export function useScrollSpy(
  ids: string[],
  navRef: React.RefObject<HTMLElement | null>,
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const navigatingIdRef = useRef<string | null>(null);
  const alignmentFrameRef = useRef<number | null>(null);
  const navigateRef = useRef<NavigateToId>(() => {});

  const clearAlignmentWatch = useCallback(() => {
    if (alignmentFrameRef.current) cancelAnimationFrame(alignmentFrameRef.current);
    alignmentFrameRef.current = null;
  }, []);

  const navigateToSection = useCallback((id: string) => {
    navigateRef.current(id, prefersReducedMotion() ? "auto" : "smooth", false);
  }, []);

  useLayoutEffect(() => {
    const scrollSpyWindow = window as ScrollSpyWindow;
    const initialHashId =
      scrollSpyWindow.__portfolioInitialHash__ ?? window.location.hash.slice(1);
    const hasInitialHash = Boolean(initialHashId) && ids.includes(initialHashId);
    delete scrollSpyWindow.__portfolioInitialHash__;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const lastId = ids[ids.length - 1];
    let bottomVisible = false;

    let sectionObserver: IntersectionObserver | null = null;
    let triggerObserver: IntersectionObserver | null = null;
    let bottomObserver: IntersectionObserver | null = null;
    let initialScrollFrame = 0;

    const syncHash = (id: string | null) => {
      if (!id) {
        if (window.location.hash) {
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}`,
          );
        }
        return;
      }
      const nextHash = `#${id}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, "", nextHash);
      }
    };

    const getNavHeight = () => navRef.current?.offsetHeight ?? 80;

    const getVisibleSectionId = (navHeight: number) => {
      if (bottomVisible) return lastId;

      const sliceY = navHeight + 1;

      for (let index = elements.length - 1; index >= 0; index -= 1) {
        const el = elements[index];
        const rect = el.getBoundingClientRect();
        if (rect.top <= sliceY && rect.bottom > sliceY) {
          return el.id;
        }
      }

      return null;
    };

    const syncActiveSection = (navHeight: number) => {
      if (navigatingIdRef.current) return;

      const nextId = getVisibleSectionId(navHeight);
      setActiveId(nextId);
      syncHash(nextId);
    };

    const watchAlignment = (
      id: string,
      target: HTMLElement,
      keepAligned: boolean,
    ) => {
      clearAlignmentWatch();

      const settle = () => {
        if (navigatingIdRef.current !== id) return;

        const currentNavHeight = getNavHeight();
        const currentTargetTop = getScrollTopForSection(target, currentNavHeight);

        if (keepAligned && Math.abs(window.scrollY - currentTargetTop) > 2) {
          window.scrollTo({ top: currentTargetTop, behavior: "auto" });
        }

        if (Math.abs(window.scrollY - currentTargetTop) <= 2) {
          navigatingIdRef.current = null;
          alignmentFrameRef.current = null;
          syncActiveSection(currentNavHeight);
          return;
        }

        alignmentFrameRef.current = requestAnimationFrame(settle);
      };

      alignmentFrameRef.current = requestAnimationFrame(settle);
    };

    const performNavigation: NavigateToId = (
      id,
      behavior = "auto",
      keepAligned = false,
    ) => {
      const target = document.getElementById(id);
      if (!target) return;

      const navHeight = getNavHeight();
      navigatingIdRef.current = id;
      setActiveId(id);

      scrollToSection(target, navHeight, behavior);

      watchAlignment(id, target, keepAligned);
    };

    navigateRef.current = performNavigation;

    const buildObservers = (navHeight: number) => {
      sectionObserver?.disconnect();
      triggerObserver?.disconnect();
      bottomObserver?.disconnect();

      const onIntersect = () => syncActiveSection(navHeight);

      sectionObserver = new IntersectionObserver(onIntersect, {
        rootMargin: `-${navHeight}px 0px -${window.innerHeight - navHeight - 1}px 0px`,
        threshold: 0,
      });

      triggerObserver = new IntersectionObserver(onIntersect, {
        threshold: 0,
      });

      elements.forEach((el) => {
        sectionObserver?.observe(el);
        triggerObserver?.observe(el);
      });

      bottomObserver = new IntersectionObserver(
        (entries) => {
          bottomVisible = entries[0]?.isIntersecting ?? false;
          syncActiveSection(navHeight);
        },
        { threshold: 0 },
      );
      bottomObserver.observe(bottomSentinel);

      syncActiveSection(navHeight);
    };

    const bottomSentinel = document.createElement("div");
    bottomSentinel.setAttribute("aria-hidden", "true");
    bottomSentinel.style.cssText =
      "position:relative;width:1px;height:1px;pointer-events:none;opacity:0";
    document.body.appendChild(bottomSentinel);

    const navEl = navRef.current;
    const navResizeObserver = new ResizeObserver(() =>
      buildObservers(getNavHeight()),
    );
    if (navEl) navResizeObserver.observe(navEl);

    if (hasInitialHash) {
      const initialId = initialHashId;
      navigatingIdRef.current = initialHashId;
      initialScrollFrame = window.requestAnimationFrame(() => {
        syncHash(initialId);
        performNavigation(initialId, "auto", true);
      });
    }

    const handleHashChange = () => {
      const nextId = window.location.hash.slice(1);
      if (!nextId || !ids.includes(nextId)) return;

      performNavigation(nextId, "auto", true);
    };

    window.addEventListener("hashchange", handleHashChange);

    buildObservers(getNavHeight());

    return () => {
      sectionObserver?.disconnect();
      triggerObserver?.disconnect();
      bottomObserver?.disconnect();
      navResizeObserver.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
      window.cancelAnimationFrame(initialScrollFrame);
      navigateRef.current = () => {};
      bottomSentinel.remove();
      clearAlignmentWatch();
    };
  }, [clearAlignmentWatch, ids, navRef]);

  return { activeId, navigateToSection };
}
