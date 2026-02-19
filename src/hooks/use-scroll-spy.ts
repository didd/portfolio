import { useEffect, useState } from "react";

/**
 * Tracks the currently visible page section by scroll position and keeps
 * the URL hash in sync.
 *
 * A 1px-tall IntersectionObserver slice sits just below the nav bar. The
 * deepest section (by `ids` order) intersecting that slice is "active".
 * A second observer on <footer> forces the last section active when the
 * user reaches the bottom of the page.
 *
 * @param ids     Ordered element ids to spy on (top → bottom, document order).
 *                Pass a stable reference (module constant or `useMemo`) to
 *                avoid recreating observers on every render.
 * @param navRef  Ref to the sticky nav — its height offsets the observer so
 *                sections behind the nav are never falsely counted as visible.
 *                Falls back to 80px when not yet attached.
 *
 * @returns The active section id, or `null` when none is in the slice.
 *
 * @example
 * const activeId = useScrollSpy(["about", "pricing", "contact"], navRef);
 * // use activeId to highlight the matching nav link
 */
export function useScrollSpy(
  ids: string[],
  navRef: React.RefObject<HTMLElement | null>,
) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    const navHeight = navRef.current?.offsetHeight ?? 80;
    const lastId = ids[ids.length - 1];
    const footer = document.querySelector("footer");

    const indexById = new Map(ids.map((id, i) => [id, i]));
    const inView = new Set<string>();
    let footerVisible = false;

    const pick = () => {
      // Footer visible → force last section active
      if (footerVisible) {
        setActiveId(lastId);
        const nextHash = `#${lastId}`;
        if (window.location.hash !== nextHash) {
          window.history.replaceState(null, "", nextHash);
        }
        return;
      }

      if (inView.size === 0) {
        setActiveId(null);
        if (window.location.hash) {
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}`,
          );
        }
        return;
      }

      let bestId: string | null = null;
      let bestIdx = -1;
      for (const id of inView) {
        const idx = indexById.get(id) ?? -1;
        if (idx > bestIdx) {
          bestIdx = idx;
          bestId = id;
        }
      }

      setActiveId(bestId);
      if (bestId) {
        const nextHash = `#${bestId}`;
        if (window.location.hash !== nextHash) {
          window.history.replaceState(null, "", nextHash);
        }
      }
    };

    // Section observer
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;
          if (entry.isIntersecting) {
            inView.add(id);
          } else {
            inView.delete(id);
          }
        }
        pick();
      },
      {
        root: null,
        rootMargin: `-${navHeight}px 0px -${window.innerHeight - navHeight - 1}px 0px`,
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));

    // Footer observer — when footer is visible, user is at the bottom
    let footerObserver: IntersectionObserver | null = null;

    if (footer) {
      footerObserver = new IntersectionObserver(
        (entries) => {
          footerVisible = entries[0]?.isIntersecting ?? false;
          pick();
        },
        { root: null, threshold: 0 },
      );
      footerObserver.observe(footer);
    }

    return () => {
      observer.disconnect();
      footerObserver?.disconnect();
    };
  }, [ids, navRef]);

  return activeId;
}
