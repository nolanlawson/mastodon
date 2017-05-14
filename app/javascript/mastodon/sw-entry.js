// This is used as the "entry" for the service worker, i.e.
// additional code that is not generated by the offline-plugin

const CACHE_KEY = 'mastodon-sw';

const webUrls = [
  '/web/getting-started',
  '/web/timelines/home'
];

const signOutRegex = /\/auth\/sign_out$/;
const emojiRegex = '/emoji\/(^\.)\.(png|svg)$'

function getCache() {
  return caches.open(CACHE_KEY);
}

self.addEventListener('install', event => {
  event.waitUntil(getCache().then(cache => {
    return cache.addAll(webUrls);
  }));
});

self.addEventListener('fetch', event => {
  const { url, method } = event.request;
  if (method === 'POST' && signOutRegex.test(url)) {
    // on sign out, clear any /web paths because we need to update the
    // csrf-token (whereas everything else is static, no harm in caching)
    getCache().then(cache => {
      webUrls.forEach(webUrl => {
        const fullUrl = new URL(url.toString().replace(signOutRegex, webUrl));
        cache.delete(fullUrl);
      });
    });
  } else if (method === 'GET' && emojiRegex.test(url)) {
    event.respondWith(
      caches.match(event.request).then(r => r || fetch(event.request))
    );
  }
});
