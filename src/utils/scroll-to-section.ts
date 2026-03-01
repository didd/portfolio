export function getScrollTopForSection(
  element: HTMLElement,
  navHeight: number,
) {
  return Math.max(
    0,
    window.scrollY + element.getBoundingClientRect().top - navHeight,
  );
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
