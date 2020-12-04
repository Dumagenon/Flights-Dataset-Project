const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NADE_ENV === 'development';

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: ['@babel/polyfill', './index.js'],
    sw: './sw.js'
  },
  output: {
    filename: `./js/[name].js`,
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    alias: {
      '@service': path.resolve(__dirname, 'src/services'),
      '@component': path.resolve(__dirname, 'src/components')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
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
    new CleanWebpackPlugin(),
    new HTMLPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: `./css/[name].css`
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
        exclude: /(node-modules|sw\.js)/,
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
