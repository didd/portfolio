import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/utils/reduce-motion";
import { scrollToSection } from "@/utils/scroll-to-section";

type ScrollSpyWindow = Window & {
  __portfolioInitialHash__?: string;
};

/**
 * Tracks which page section is currently visible using a 1px IntersectionObserver
 * slice below the sticky nav. Syncs the URL hash. Returns a lock function that
 * disables spying during programmatic scroll (nav clicks).
 */
export function useScrollSpy(
  ids: string[],
  navRef: React.RefObject<HTMLElement | null>,
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const lockedIdRef = useRef<string | null>(null);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pickRef = useRef<() => void>(() => {});

  const lock = useCallback((id: string) => {
    lockedIdRef.current = id;
    setActiveId(id);

    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);

    // Safety release after smooth scroll completes
    lockTimeoutRef.current = setTimeout(() => {
      lockedIdRef.current = null;
      lockTimeoutRef.current = null;
      pickRef.current();
    }, 1200);
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

    const pick = (navHeight: number) => {
      // Locked — skip all spy logic
      if (lockedIdRef.current) return;

      let nextId: string | null = null;

      if (bottomVisible) {
        nextId = lastId;
      } else {
        const sliceY = navHeight + 1;

        for (const el of elements) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= sliceY && rect.bottom > sliceY) {
            nextId = el.id;
          }
        }
      }

      setActiveId(nextId);
      syncHash(nextId);
    };

    const getNavHeight = () => navRef.current?.offsetHeight ?? 80;

    // Expose pick for the safety timeout
    pickRef.current = () => pick(getNavHeight());

    const releaseLock = (navHeight: number) => {
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = setTimeout(() => {
        lockedIdRef.current = null;
        lockTimeoutRef.current = null;
        pick(navHeight);
      }, 1200);
    };

    const scrollToHash = (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      const navHeight = getNavHeight();
      lockedIdRef.current = id;
      setActiveId(id);

      scrollToSection(
        target,
        navHeight,
        prefersReducedMotion() ? "auto" : "smooth",
      );

      releaseLock(navHeight);
    };

    const buildObservers = (navHeight: number) => {
      sectionObserver?.disconnect();
      triggerObserver?.disconnect();
      bottomObserver?.disconnect();

      const onIntersect = () => pick(navHeight);

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
          pick(navHeight);
        },
        { threshold: 0 },
      );
      bottomObserver.observe(bottomSentinel);

      pick(navHeight);
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
      lockedIdRef.current = initialHashId;
      initialScrollFrame = window.requestAnimationFrame(() => {
        syncHash(initialId);
        scrollToHash(initialId);
      });
    }

    const handleHashChange = () => {
      const nextId = window.location.hash.slice(1);
      if (!nextId || !ids.includes(nextId)) return;

      scrollToHash(nextId);
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
      bottomSentinel.remove();
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, [ids, navRef]);

  return { activeId, lock };
}
