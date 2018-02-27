import webpack from 'webpack'
import path from 'path'

const name = 'AzureSASAuthDynamicValue'

const production = process.env.NODE_ENV === 'production'

const config = {
  target: 'web',
  entry: [
    'crypto-js',
    './src/AzureSASAuthDynamicValue.js'
  ],
  output:{
    path: path.join(__dirname,
      './build/uk.co.garethknowles.PawExtensions.AzureSASAuthDynamicValue'),
    pathInfo: true,
    publicPath: '/build/',
    filename: name+'.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
        ],
        test: /\.jsx?$/,
      }
    ]
  }
}
module.exports = config
