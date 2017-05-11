function needsPolyfills() {
  return !window.Intl || !window.Promise || !Object.assign ||
    !Array.prototype.includes;
}

function loadPolyfills() {
  return Promise.all([
    import('intl'),
    import('intl/local-data/jsonp/en.js')
  ]);
}

export {
  needsPolyfills,
  loadPolyfills
}
