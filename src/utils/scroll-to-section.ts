export function getScrollTopForSection(
  element: HTMLElement,
  navHeight: number,
) {
  const rawTop = Math.max(
    0,
    window.scrollY + element.getBoundingClientRect().top - navHeight,
  );

  const maxScrollTop = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );

  return Math.min(rawTop, maxScrollTop);
}

export function scrollToSection(
  element: HTMLElement,
  navHeight: number,
  behavior: ScrollBehavior,
) {
  window.scrollTo({
    top: getScrollTopForSection(element, navHeight),
    behavior,
  });
}
