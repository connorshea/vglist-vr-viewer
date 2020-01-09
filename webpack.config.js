/* eslint-env node, es6 */

const path = require('path');
const webpack = require('webpack');

// TODO: Replace this with something that isn't dumb as hell.
const PLUGINS = [
  new webpack.DefinePlugin({
    VGLIST_API_TOKEN: JSON.stringify(process.env.VGLIST_API_KEY)
  })
];

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  entry: './index.js',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    globalObject: 'this',
    path: __dirname + '/dist',
    filename: process.env.NODE_ENV === 'production' ? 'stupid-vglist-vr-viewer.min.js' : 'stupid-vglist-vr-viewer.js',
    libraryTarget: 'umd'
  },
  plugins: PLUGINS,
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      }
    ]
  },
  watchOptions: {
    aggregateTimeout: 300,
    ignored: ['node_modules', 'dist']
  },
  resolve: {
    modules: [path.join(__dirname, 'node_modules')]
  }
};
