var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    main: [
      './demo/index'
    ]
  },
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  resolve: {
    alias: {
      'path': 'path-webpack'
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          cacheDirectory: true
        },
        include: path.join(__dirname, '..'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules'
      }
    ]
  }
}
