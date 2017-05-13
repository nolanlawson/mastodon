// Note: You must restart bin/webpack-dev-server for changes to take effect

/* eslint global-require: 0 */

const webpack = require('webpack')
const merge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const sharedConfig = require('./shared.js')
const { publicPath } = require('./configuration.js')
const fs = require('fs')
const path = require('path')
const emojiFiles = fs.readdirSync(path.join(__dirname, '../../public/emoji'))

module.exports = merge(sharedConfig, {

  devtool: 'source-map', // separate sourcemap file, suitable for production

  output: { filename: '[name]-[chunkhash].js' },

  plugins: [
    /*new webpack.optimize.UglifyJsPlugin({
      compress: true,
      mangle: true,

      output: {
        comments: false
      },

      sourceMap: true
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|svg|eot|ttf|woff|woff2)$/
    }),*/
    new OfflinePlugin({
      entry: 'app/javascript/mastodon/sw.js',
      publicPath: publicPath,
      // these resources are fetched ahead of time
      externals: [
        '/web/timelines/home',
        '/web/getting-started',
      ].concat(emojiFiles.map(filename => `/emoji/${filename}`)),
      caches: {
        main: [':rest:'],
        // these are precached in addition to webpack assets
        additional: [
          '/web/timelines/home',
          '/web/getting-started'
        ],
        // "optional" means these are only cached when actually fetched
        // :externals: means all externals minus the "additional" ones
        optional: [':externals:']
      },
      // sw.js must be served from the root to avoid scope issues
      ServiceWorker: {
        output: '../sw.js',
        publicPath: '/sw.js',
        // credentials (cookies) are required to access HTML files
        prefetchRequest: {
          credentials: 'include'
        }
      }
    })
  ]
})
