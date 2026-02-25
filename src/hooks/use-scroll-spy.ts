import { useCallback, useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const lastId = ids[ids.length - 1];
    let bottomVisible = false;

    let sectionObserver: IntersectionObserver | null = null;
    let triggerObserver: IntersectionObserver | null = null;
    let bottomObserver: IntersectionObserver | null = null;

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

      if (bottomVisible) {
        setActiveId(lastId);
        syncHash(lastId);
        return;
      }

      const sliceY = navHeight + 1;
      let bestId: string | null = null;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= sliceY && rect.bottom > sliceY) {
          bestId = el.id;
        }
      }

      setActiveId(bestId);
      syncHash(bestId);
    };

    const getNavHeight = () => navRef.current?.offsetHeight ?? 80;

    // Expose pick for the safety timeout
    pickRef.current = () => pick(getNavHeight());

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

    buildObservers(getNavHeight());

    return () => {
      sectionObserver?.disconnect();
      triggerObserver?.disconnect();
      bottomObserver?.disconnect();
      navResizeObserver.disconnect();
      bottomSentinel.remove();
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, [ids, navRef]);

  return { activeId, lock };
}
