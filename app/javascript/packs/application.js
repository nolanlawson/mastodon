import main from '../mastodon/main';

if (!window.Intl || !Object.assign || !Number.isNaN ||
    !window.Symbol || !window.Promise || !Array.prototype.includes) {
  // load polyfills dynamically
  require.ensure(['../mastodon/polyfills'], main);
} else {
  main();
}
