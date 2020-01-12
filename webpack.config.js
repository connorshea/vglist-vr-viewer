/* eslint-env node, es6 */

const path = require('path');
const webpack = require('webpack');

// TODO: Replace this with something that isn't dumb as hell.
const PLUGINS = [
  new webpack.DefinePlugin({
    VGLIST_API_TOKEN: JSON.stringify(process.env.VGLIST_API_KEY),
    VGLIST_USER_EMAIL: JSON.stringify(process.env.VGLIST_USER_EMAIL)
  })
];

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  entry: {
    'vglist-vr-viewer': './index.js',
    'environment': './environment.js',
    'aframe': './aframe.js'
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  output: {
    globalObject: 'this',
    path: __dirname + '/dist',
    filename: process.env.NODE_ENV === 'production' ? '[name].min.js' : '[name].js',
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
