'use strict'

const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const utils = require('./utils')
const projectRoot = path.resolve(__dirname, '../')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/index.js'],
    vendor: ['vue', 'vue-router', 'vuex', 'jquery']
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: isProduction ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.json', '.coffee'],
    alias: {
      // https://github.com/vuejs/vue/wiki/Vue-2.0-RC-Starter-Resources
      vue: 'vue/dist/vue',
      package: path.resolve(__dirname, '../package.json'),
      config: path.resolve(__dirname, '../config'),
      src: path.resolve(__dirname, '../src'),
      assets: path.resolve(__dirname, '../src/static'),
      components: path.resolve(__dirname, '../src/components'),
      views: path.resolve(__dirname, '../src/views'),
      // third-party
      // vue-addon
      // 'vuex-store': path.resolve(__dirname, '../src/store'),
      'neo4j-driver-alias': 'neo4j-driver/lib/browser/neo4j-web.min.js',
    }
  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        exclude: /node_modules/,
        loader: 'coffee-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      vue: {
        loaders: utils.cssLoaders({
          sourceMap: isProduction,
          extract: isProduction
        }),
        postcss: [
          require('autoprefixer')({
            browsers: ['last 3 versions']
          })
        ]
      }
    })
  ]
}
