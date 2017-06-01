#!/usr/bin/env node

const React = require('React');
const ReactDOMServer = require('react-dom/server');
const messages = require('../app/javascript/mastodon/locales/en.json');
const localeData = require('react-intl/locale-data/en.js');
const { setLocale } = require('../app/javascript/mastodon/locales');
setLocale(messages, localeData);

const Mastodon = require('../app/javascript/mastodon/containers/mastodon').default;

const string = ReactDOMServer.renderToString(<Mastodon locale="en" />);
console.log(string);
