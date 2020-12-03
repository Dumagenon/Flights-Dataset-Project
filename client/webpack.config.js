const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NADE_ENV === 'development';

const fileName = (ext) => `[name].${ext}`;

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: "development",
  entry: {
    main: ['@babel/polyfill', './js/index.js']
  },
  output: {
    filename: `./js/${fileName('js')}`,
    path: path.resolve(__dirname, 'build')
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 5000,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  plugins: [
    new HTMLPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: !isDev
      }
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `./css/${fileName('css')}`
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.js$/,
        exclude: /node-modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  }
}