const LAYOUT_BREAKPOINT = 1024;

export function isMobile(width) {
  return width <= LAYOUT_BREAKPOINT;
};

const iOS = typeof navigator !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

export function isIOS() {
  return iOS;
};
