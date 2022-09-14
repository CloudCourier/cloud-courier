const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 美化终端构建时的进度条样式
const path = require('path');
const { getPlugins } = require('./utils/plugin');
const resolveConfig = require('./utils/resolve');
const variable = require('./utils/variable');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const { IS_DEV, SRC_PATH, IS_PRO, DIST_PATH } = variable;
const main = {
  entry: {
    index: path.join(SRC_PATH, 'index.tsx'),
  },
  output: {
    path: DIST_PATH,
    filename: 'js/[name].bundle.js',
    // publicPath: getCDNPath(),
    publicPath: 'auto',
    chunkFilename: IS_DEV ? 'js/[name].chunk.js' : 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  cache: {
    type: 'memory',
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js|jsx)$/,
        include: [SRC_PATH],
        exclude: [/node_modules/, /public/, /(.|_)min\.js$/, /\.worker|.script\.(js|ts)$/],
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3,
            },
          },
          'babel-loader?cacheDirectory=true',
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/i,
        include: [SRC_PATH],
        exclude: /node_modules/,
        use: [
          IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[local]-[contenthash:5]',
              },
              sourceMap: !IS_PRO,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 100kb
          },
        },
      },
    ],
  },
  plugins: getPlugins().concat([new ReactRefreshWebpackPlugin()].filter(Boolean)),
  resolve: resolveConfig,
  mode: 'development',
  stats: 'errors-only',
  optimization: {
    runtimeChunk: 'single',
  },
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000,
    ignored: /node_modules/,
  },
};
const worker = {
  entry: path.join(SRC_PATH, './worker/shared.worker.ts'),
  output: {
    chunkFilename: IS_DEV ? 'js/[name].chunk.js' : 'js/[name].[contenthash:8].chunk.js',
    filename: 'shared.worker.js',
    path: `${DIST_PATH}/worker`,
    clean: true,
  },
  target: 'webworker',
  devtool: 'source-map',
  mode: IS_DEV ? 'development' : 'production',
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.ts', '.tsx'],
    plugins: [],
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.worker\.(js|ts)$/,
        include: [SRC_PATH],
        exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3,
            },
          },
          'babel-loader?cacheDirectory=true',
        ],
      },
    ],
  },
};
const script = {
  entry: path.join(SRC_PATH, './scripts/deploy.script.js'),
  output: {
    filename: 'deployscript.js',
    path: `${DIST_PATH}/scripts`,
    clean: true,
  },
  stats: 'errors-only',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.script\.(js|ts)$/,
        include: [SRC_PATH],
        exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
        use: ['babel-loader?cacheDirectory=true'],
      },
    ],
  },
};
module.exports = [main, worker, script];
