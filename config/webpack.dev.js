const webpackMerge = require('webpack-merge');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const baseConfig = require('./webpack.base');

const config = {
  mode: 'development',
  stats: 'errors-only',
  devServer: {
    open: true,
    host: 'localhost',
    port: 9000,
    hot: true,
    compress: true,
    historyApiFallback: true,
    devMiddleware: { writeToDisk: true },
  },
  plugins: [new ReactRefreshWebpackPlugin()].filter(Boolean),
  optimization: {
    runtimeChunk: 'single',
  },
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000,
    ignored: /node_modules/,
  },
  // devtool: 'source-map',
};
const mergedConfig = webpackMerge.merge(baseConfig, config);
module.exports = mergedConfig;
