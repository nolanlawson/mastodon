// Various caching strategies to make entry.js easier to read. Partially
// inspired by https://github.com/GoogleChrome/sw-toolbox

const VERSION = '1.0.0'; // if necessary, we can increment this
const CACHE_KEY = `mastodon-sw-v${VERSION}`;

const fetchListeners = [];

function openCache() {
  return caches.open(CACHE_KEY);
}

// generic request listener
function onRequest(method, regex, invoke) {
  fetchListeners.push({ method, regex, invoke });
}

// "offline-first" strategy - try to fetch from the cache, then fall
// back to the network, then cache afterwards
function cacheFirst(method, regex) {
  onRequest(
    method,
    regex,
    event => {
      const request = event.request;
      event.respondWith(openCache().then(cache => {
        return cache.match(request).then(cacheResponse => {
          if (cacheResponse) {
            return cacheResponse;
          }
          return fetch(request).then(fetchResponse => {
            // cache as a side effect, not meant to block response
            cache.put(request.clone(), fetchResponse.clone());
            return fetchResponse;
          });
        });
      }));
    }
  );
}

// do both a network request and a cache request, so that the cache
// is always updated when we're offline
function cacheFirstAndUpdateAfter(method, regex) {
  onRequest(
    method,
    regex,
    event => {
      const request = event.request;
      // do network request and then cache as a side effect,
      // don't block the response
      const fetchPromise = fetch(request);
      fetchPromise.then(fetchResponse => {
        cache.put(request.clone(), fetchResponse.clone());
      });

      event.respondWith(openCache().then(cache => {
        return cache.match(request);
      }).then(cacheResponse => {
        return cacheResponse || fetchPromise;
      }));
    }
  );
}

// precache all URLs on 'install' event
function precache(urls) {
  self.addEventListener('install', event => {
    event.waitUntil(openCache().then(function (cache) {
      return Promise.all(urls.map(url => {
        return fetch(url, {
          credentials: 'include'
        }).then(response => {
          return cache.put(new Request(response.url), response);
        });
      }));
    }));
  });
}

// delete everything in the cache matching a particular regex
function deleteAllFromCacheMatching(regex) {
  return openCache().then(cache => {
    return cache.keys().then(keys => {
      /* eslint-disable consistent-return */
      return Promise.all(keys.map(request => {
        if (regex.test(new URL(request.url).pathname)) {
          return cache.delete(request);
        }
      }));
    });
  });
}

self.addEventListener('fetch', event => {
  const { url, method } = event.request;
  const urlObject = new URL(url);
  const path = urlObject.pathname;

  for (let listener of fetchListeners) {
    if (listener.method === method && listener.regex.test(path)) {
      listener.invoke(event);
      break;
    }
  }
});

export {
  cacheFirst,
  cacheFirstAndUpdateAfter,
  onRequest,
  precache,
  deleteAllFromCacheMatching
}
