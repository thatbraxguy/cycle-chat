/* eslint-disable */
var path = require('path');

module.exports = {
  entry: {
    client: './index',
  },

  output: {
    path: path.resolve('build'),
    filename: 'js/[name].js',
    publicPath: '/static/',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|build)/,
        loader: 'babel-loader',
      },
    ],
  },
};
