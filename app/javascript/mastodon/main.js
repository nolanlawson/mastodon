import * as WebPushSubscription from './web_push_subscription';
import Mastodon from './containers/mastodon';
import React from 'react';
import ReactDOM from 'react-dom';
import ready from './ready';
import { start, stop } from './performance';

function main() {
  start('main()');

  if (window.history && history.replaceState) {
    const { pathname, search, hash } = window.location;
    const path = pathname + search + hash;
    if (!(/^\/web[$/]/).test(path)) {
      history.replaceState(null, document.title, `/web${path}`);
    }
  }

  ready(() => {
    const mountNode = document.getElementById('mastodon');
    const props = JSON.parse(mountNode.getAttribute('data-props'));

    ReactDOM.render(<Mastodon {...props} />, mountNode);
    if (process.env.NODE_ENV === 'production') {
      // avoid offline in dev mode because it's harder to debug
      import('offline-plugin/runtime').then((offlinePlugin) => {
        offlinePlugin.install();
      });
      WebPushSubscription.register();
    }
    stop('main()');
  });
}

export default main;
