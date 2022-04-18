const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 美化终端构建时的进度条样式
const path = require('path');
const { getPlugins } = require('./utils/plugin');
const resolveConfig = require('./utils/resolve');
const variable = require('./utils/variable');

const { IS_DEV, SRC_PATH, IS_PRO, DIST_PATH } = variable;
module.exports = {
  entry: {
    index: path.join(SRC_PATH, 'index.tsx'),
    work: path.join(SRC_PATH, './utils/shared.work.js'),
  },
  output: {
    path: DIST_PATH,
    filename: IS_DEV ? 'js/[name].bundle.js' : 'js/[name].[contenthash:8].bundle.js',
    // publicPath: getCDNPath(),
    chunkFilename: IS_DEV ? 'js/[name].chunk.js' : 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  cache: { type: 'memory' },
  module: {
    rules: [
      {
        test: /\.(tsx?|js|jsx)$/,
        include: [SRC_PATH],
        exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
        use: [
          'cache-loader',
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
        exclude: /node_modules/, // 取消匹配node_modules里面的文件
        use: [
          IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                auto: /\.module\.\w+$/i,
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
  plugins: getPlugins(),
  resolve: resolveConfig,
};
