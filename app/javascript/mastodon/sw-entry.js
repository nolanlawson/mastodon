// This is used as the "entry" for the service worker, i.e.
// additional code that is not generated by the offline-plugin

self.addEventListener('fetch', event => {
  const { url, method } = event.request;
  console.log('foo');
  if (method === 'POST' && /\/auth\/sign_out$/.test(url)) {
    console.log('bar');
    return caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        return caches.open(key).then(cache => {
          console.log('baz');
          return Promise.all([
            cache.delete(new URL(url.toString().replace(/\/auth\/sign_out$/, '/web/getting-started'))),
            cache.delete(new URL(url.toString().replace(/\/auth\/sign_out$/, '/web/timelines/home')))
          ]);
        });
      }));
    }).then(() => {
      return fetch(event.request);
    });
  } else {
    return fetch(event.request);
  }
})
