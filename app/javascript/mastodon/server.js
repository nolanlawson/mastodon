import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, Route } from 'react-router'
import UI from './features/ui';
import configureStore from './store/configureStore';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import messages from './locales/en.json';
import initialState from './initial_state';
import { hydrateStore } from './actions/store';

export const store = configureStore();
const hydrateAction = hydrateStore(initialState);
store.dispatch(hydrateAction);

const html = ReactDOMServer.renderToString(
  <IntlProvider locale='en' messages={messages}>
    <Provider store={store}>
      <StaticRouter basename='/web' locastion='/web' context={{}}>
        <Route path='/' component={UI} />
      </StaticRouter>
    </Provider>
  </IntlProvider>
);

console.log(html);
process.exit(0);
