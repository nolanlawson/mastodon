import Mastodon from 'mastodon/containers/mastodon';
import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.css';
import '../styles/application.scss';

window.jQuery = window.$ = require('jquery');
window.Perf = require('react-addons-perf');

require('jquery-ujs');
require.context('../images/', true);

const customContext = require.context('../../assets/stylesheets/', false);

if (customContext.keys().indexOf('./custom.scss') !== -1) {
  customContext('./custom.scss');
}

function onReady(callback) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

function setupMastodon() {
  onReady(() => {
    const mountNode = document.getElementById('mastodon');
    const props = JSON.parse(mountNode.getAttribute('data-props'));

    ReactDOM.render(<Mastodon {...props} />, mountNode);
  });
}

if (!window.Intl || !Number.isNaN) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js',
    'number.isnan'],
    setupMastodon, 'polyfills');
} else {
  setupMastodon();
}
