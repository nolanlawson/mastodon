#!/usr/bin/env node

import ReactDOMServer from 'react-dom/server';
import app from '../app/javascript/mastodon/containers/mastodon';

const string = ReactDOMServer.renderToString(app);
console.log(string);
