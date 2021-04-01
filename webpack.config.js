const EslintPlugin = require('eslint-webpack-plugin');
const path = require('path');
const serverlessWebpack = require('serverless-webpack');

module.exports = {
  entry: serverlessWebpack.lib.entries,
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [new EslintPlugin()],
  resolve: {
    alias: { graphql$: path.resolve(__dirname, './node_modules/graphql/index.js') },
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};
