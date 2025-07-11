const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const info = {
  TITLE: 'Flashcards'
}

// home
// const myrouter = "http://10.0.0.98:8088"

// exposed IP
const myrouter = "http://76.138.149.125:8088";
const mytarget = "http://localhost:8080";

const config = {
  mode: 'development',
  devtool: 'source-map',

  devServer: {
    static: path.join(__dirname, '../dist'),
    port: "8080",
    host: "0.0.0.0",
    historyApiFallback: true,
    headers: {
      'Cache-Control': 'no-store',
    },
    proxy: {
       '/api': {
            target: mytarget,
            router: () => myrouter,
            logLevel: 'debug'
       }
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            experimentalWatchApi: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(ico|png)$/i,
        use: ['file-loader'],
      },
    ]
  },

  resolve: {
    extensions: [
      '.tsx', '.ts', '.js', '.jsx', '.json'
    ]
  },

  entry: {
    main: './src/index.tsx'
  },

  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },

  plugins: [
    new ProgressBarPlugin({ width: 80 }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(["src/img/*"]),
    new MiniCssExtractPlugin({ filename: '[contenthash].css' }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: info.TITLE,
      chunks: ['main'],
      template: './src/index.html',
      templateParameters: { TITLE: info.TITLE }
    }),
    new webpack.DefinePlugin( {
      'process.env.CONFIG_ROUTER': JSON.stringify(myrouter),
      'process.env.CONFIG_TARGET': JSON.stringify(mytarget)
    })
  ],
}

module.exports = [ config ];

