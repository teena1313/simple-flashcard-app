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

const myrouter = "http://76.138.149.125:8088";
// const myrouter = "http://localhost:8088";
// const myrouter = "https://notecard-bcknd-chdmgkeuhahdczh7.westus-01.azurewebsites.net";
const mytarget = "https://proud-bush-0ea3e931e.2.azurestaticapps.net";
// const mytarget = "http://localhost:8080"

const config = {
  mode: 'development',
  devtool: 'source-map',

  devServer: {
    static: path.join(__dirname, '../dist'),
    port: "8080",
    host: "proud-bush-0ea3e931e.2.azurestaticapps.net",
    // host: '0.0.0.0',
    // allowedHosts: ['https://proud-bush-0ea3e931e.2.azurestaticapps.net'],
    historyApiFallback: true,
    headers: {
      'Cache-Control': 'no-store',
    },
    proxy: {
       '/api': {
            target: mytarget,
            router: () => myrouter,
            changeOrigin: true,
            logLevel: 'debug'
       }
    },
    onBeforeSetupMiddleware(devServer){
      devServer.app.use('/', function (req, res,next) {
          console.log(`from ${req.ip} - ${req.method} - ${req.originalUrl}`);
          next();
      });
    }
  },

  infrastructureLogging: {
    debug: [name => name.includes('webpack-dev-server')],
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
