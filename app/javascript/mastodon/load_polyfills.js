function needsPolyfills() {
  return !window.Intl || !window.Promise || !Object.assign ||
    !Number.isNaN || !Array.prototype.includes;
}

function loadPolyfills() {
  return import('./polyfills');
}

export {
  needsPolyfills,
  loadPolyfills
}
