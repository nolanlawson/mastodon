// This is used as the "entry" for the service worker, i.e.
// additional code that is not generated by the offline-plugin

const CACHE_KEY = 'mastodon-sw';

const precacheUrls = [
  '/web/getting-started',
  '/web/timelines/home'
];

//const webRegex = /^\/web\//
const signOutRegex = /^\/auth\/sign_out/;
const emojiRegex = /^\/emoji\//

const fetchOptions = {
  credentials: 'include'
};

function getCache() {
  return caches.open(CACHE_KEY);
}

self.addEventListener('install', event => {
  event.waitUntil(getCache().then(function (cache) {
    return Promise.all(precacheUrls.map(url => {
      return fetch(url, fetchOptions).then(response => {
        return cache.put(new Request(response.url), response);
      });
    }));
  }));
});

self.addEventListener('fetch', event => {
  const { url, method } = event.request;
  if (method === 'POST' && signOutRegex.test(url)) {
    // on sign out, clear any /web paths because we need to update the
    // csrf-token (whereas everything else is static, no harm in caching)
    getCache().then(cache => {
      webUrls.forEach(webUrl => {
        const fullUrl = new URL(url.toString())
        newUrl.pathname = webUrl;
        cache.delete(fullUrl);
      });
    });
  } else if (method === 'GET' && emojiRegex.test(new URL(url).pathname)) {
    event.respondWith(
      getCache().then(cache => {
        return cache.match(event.request).then(cacheResponse => {
          if (cacheResponse) {
            return cacheResponse;
          }
          return fetch(event.request, fetchOptions).then(fetchResponse => {
            // cache as a side effect, not meant to block response
            cache.put(event.request, fetchResponse);
            return fetchResponse;
          });
        });
      })
    );
  }
});
