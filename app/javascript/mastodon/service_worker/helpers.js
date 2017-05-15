// Various caching strategies to make entry.js easier to read. Partially
// inspired by https://github.com/GoogleChrome/sw-toolbox

const VERSION = '1.0.0'; // if necessary, we can increment this
const CACHE_KEY = `mastodon-sw-v${VERSION}`;

// taken from https://github.com/GoogleChrome/sw-toolbox/blob/master/lib/options.js
const SUCCESS_RESPONSES = /^0|([123]\d\d)|(40[14567])|410$/

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
          // redirect: 'follow' is due to http://stackoverflow.com/a/40277730/680742
          return fetch(request, {redirect: 'follow'}).then(fetchResponse => {
            if (SUCCESS_RESPONSES.test(fetchResponse.status)) {
              // cache as a side effect, not meant to block response
              cache.put(request.clone(), fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      }));
    }
  );
}

// "offline-last" strategy – go to the network first, then try the
// cache if the network fails
function networkFirst(method, regex) {
  onRequest(
    method,
    regex,
    event => {
      const request = event.request;
      event.respondWith(fetch(request, {redirect: 'follow'}).then(fetchResponse => {
        if (!SUCCESS_RESPONSES.test(fetchResponse.status)) {
          throw new Error(`Bad response: ${fetchResponse.status}`);
        }

        // cache the response as a side effect, don't block
        openCache().then(cache => {
          cache.put(request.clone(), fetchResponse);
        });

        return fetchResponse.clone();
      }).catch(fetchError => {
        // fetch() error, falling back to cache
        return openCache().then(cache => {
          return cache.match(request).then(cacheResponse => {
            if (cacheResponse) {
              return cacheResponse;
            }
            throw fetchError;
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

      // start fetching immediately
      const fetchPromise = fetch(request, {redirect: 'follow'});

      event.respondWith(openCache().then(cache => {
        // cache as a side effect, don't block the response
        fetchPromise.then(fetchResponse => {
          if (SUCCESS_RESPONSES.test(fetchResponse.status)) {
            cache.put(request.clone(), fetchResponse.clone());
          }
        });

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
        /* eslint-disable consistent-return */
        return fetch(url, {
          credentials: 'include',
          redirect: 'follow'
        }).then(response => {
          if (SUCCESS_RESPONSES.test(response.status)) {
            return cache.put(new Request(response.url), response);
          }
        });
      }));
    }));
  });
}

// delete everything in the cache matching a particular path or paths
// (string or array of strings)
function deleteAllFromCacheMatching(paths) {

  if (!Array.isArray(paths)) {
    paths = [paths];
  }

  return openCache().then(cache => {
    return Promise.all(paths.map(path => {
      return cache.matchAll(path).then(responses => {
        return Promise.all(responses.map(response => cache.delete(response)));
      });
    }));
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
  networkFirst,
  onRequest,
  precache,
  deleteAllFromCacheMatching
}
