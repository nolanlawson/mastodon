let theLocale;

function setLocale(locale) {
  theLocale = locale;
}

function getLocale() {
  return theLocale;
}

export {
  setLocale,
  getLocale
}
