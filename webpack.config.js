var path = require('path')
var webpack = require('webpack')
var OpenBrowserPlugin = require('open-browser-webpack-plugin')

module.exports = {
  devtool: 'eval',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
    './demo/index'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:3001' })
  ],
  resolve: {
    alias: {
      'path': 'path-webpack'
    },
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    hot: true,
    contentBase: './www'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          cacheDirectory: true
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules'
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  }
}
