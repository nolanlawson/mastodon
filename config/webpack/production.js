// Note: You must restart bin/webpack-dev-server for changes to take effect

/* eslint global-require: 0 */

const webpack = require('webpack');
const merge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const sharedConfig = require('./shared.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ButternutWebpackPlugin = require('butternut-webpack-plugin').default;

module.exports = merge(sharedConfig, {

  devtool: 'source-map', // separate sourcemap file, suitable for production

  output: { filename: '[name]-[chunkhash].js' },

  plugins: [
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|svg|eot|ttf|woff|woff2)$/,
    }),
    new ButternutWebpackPlugin({
      check: true,
    }),
    new BundleAnalyzerPlugin({ // generates report.html and stats.json
      analyzerMode: 'static',
      generateStatsFile: true,
      openAnalyzer: false,
    }),
  ],
});
