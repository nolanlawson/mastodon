// This is used as the "entry" for the service worker, i.e.
// additional code that is not generated by the offline-plugin.
// In general, this code is used for resources that should be cached
// on-the-fly or that aren't part of the Webpack asset graph, because
// offline-plugin isn't very well-adapted to that use case.

const VERSION = '1'; // if necessary, we can increment this
const CACHE_KEY = `mastodon-sw-v${VERSION}`;

// precache these URLs so they're always guaranteed to work. one is the
// default homepage for desktop, the other is the one for manifest.json
const precacheUrls = [
  '/web/getting-started',
  '/web/timelines/home'
];

const webRegex = /^\/(web|settings)\//
const signOutRegex = /^\/auth\/sign_out/;
const emojiRegex = /^\/emoji\//

function getCache() {
  return caches.open(CACHE_KEY);
}

// "offline-first" strategy - try to fetch from the cache, then fall
// back to the network, then cache afterwards
function tryCacheThenFetch(request) {
  return getCache().then(cache => {
    return cache.match(request).then(cacheResponse => {
      if (cacheResponse) {
        return cacheResponse;
      }
      return fetch(request).then(fetchResponse => {
        // cache as a side effect, not meant to block response
        cache.put(request.clone(), fetchResponse.clone());
        return fetchResponse.clone();
      });
    });
  })
}

self.addEventListener('install', event => {
  // precache on install
  event.waitUntil(getCache().then(function (cache) {
    return Promise.all(precacheUrls.map(url => {
      return fetch(url, {
        credentials: 'include'
      }).then(response => {
        return cache.put(new Request(response.url), response);
      });
    }));
  }));
});

self.addEventListener('fetch', event => {
  const { url, method } = event.request;
  const urlObject = new URL(url);
  const path = urlObject.pathname;
  if (method === 'POST' && signOutRegex.test(path)) {
    // on sign out, clear any /web paths because we need to update the
    // csrf-token (whereas everything else is static, no harm in caching)
    getCache().then(cache => {
      cache.keys().then(keys => {
        keys.forEach(request => {
          if (webRegex.test(new URL(request.url).pathname)) {
            cache.delete(request);
          }
        });
      });
    });
  } else if (method === 'GET' &&
      (emojiRegex.test(path) || webRegex.test(path))) {
    // these resources can be cached on-the-fly as needed
    event.respondWith(tryCacheThenFetch(event.request));
  }
});
