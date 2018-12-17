// use "webpack --config ./webpack.config.js"

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
// const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const HappyPack = require('happypack');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const myPlugin = require('./myPlugin/index.js');

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

module.exports = {
  // base url;
  context: path.resolve(__dirname, '.'),
  // entry: './main.js',
  entry: { 
    first: './src/js/first.js',
    second: './src/js/second.js'
  },
  mode: 'production',
  output: {
    filename: '[name]_[hash:8].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    crossOriginLoading: 'anonymous',
    // libraryTarget: 'var',  // used for export libraries;
    // library: '',
  },
  // regard module as every single source file;
  module: {
    rules: [
      // raw-loader \ svg-inline-loader(compress)
      {
        test: /\.svg$/,
        use: ['svg-inline-loader']
      },
      // file-loader \ url-loader
      {
        test: /\.js$/,
        include: [/src\/js/],
        loader: 'eslint-loader',
        // set the sequence to the top;
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        use: 'happypack/loader?id=babel',
        parser: {
          amd: true,
          commonjs: true,
          system: true,
          harmony: true,
          requireInclude: true,
          requireEnsure: true,
          requireContext: true,
          browserify: true,
          requireJs: true
        }
      },
      {
        test: /\.css$/,
        // Loader execution order: tail -> front;
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          }, 
          {
            loader: 'happypack/loader?id=styles'
          }
        ],
        // enforce: 'post'  // set the execution order of this loader to the last;
        // include: '',
        // exclude: ''
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'myLoader',
          options: {
            label: 'YHSPY'
          }
        }],
        include: [path.resolve(__dirname, './src')],
        enforce: 'post',
      }
    ],
    // noParse: /jquery|chartjs/
    noParse: content => {
      // content: the path of every module;
      return /react\.min\.js$/.test(content);
    }
  },
  resolve: {
    // frequenty using;
    alias:{
      components: './src/components/',
      // directly using the minimum version (without tree-shaking);
      react: path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
    },
    /*
    alias: [{
      name: 'components',
      alias: './src/components/',
      onlyModule: true  // only used on standalone "components", not "components/path/...";
    }] */
    // mainFields: ["browser", "module", "main"] // -> web / webworker
    // mainFields: ["module", "main"] // -> web // -> others
    mainFields: ['jsnext:main', 'browser', 'main'],
    extensions: ['.js', '.json'],  // default import extension (require('./data') -> data.js/data.json);
    modules:['node_modules'],  // directories for searching modules;
    descriptionFiles: ['package.json'],
    enforceExtension: false,
    enforceModuleExtension: false
  },
  plugins: [
    new myPlugin({
      label: 'YHSPY'
    }),
    // DefinePlugin / EnvironmentPlugin / uglifyjs-webpack-plugin(for pure ES6);
    new ModuleConcatenationPlugin(),
    new NamedModulesPlugin(),
    new ParallelUglifyPlugin({
      exclude: /node_modules/,
      include: /src/,
      uglifyJS: {
        output: {
          beautify: false,
          comments: false,
        },
        compress: {
          warnings: false,
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true
        }
      },
    }),
    new HappyPack({
      debug: true,
      verbose: true,
      id: 'babel',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      debug: true,
      verbose: true,
      id: 'styles',
      loaders: [{
        loader: 'css-loader',
        query: {}
      }],
      threadPool: happyThreadPool
    }),
    /*
    new DllReferencePlugin({
      // 描述 react 动态链接库的文件内容
      manifest: require('./dist/lodash.manifest.json'),
    }),
    */
    // imagemin-webpack-plugin / webpack-spritesmith
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'sw.js'),
    }),
    // plugin instance (configurations in its constructor);
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    // work with "hot: true";
    new webpack.HotModuleReplacementPlugin(),
    // for multiple entries, multiple html files;
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['first'],
      template: 'index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['second'],
      template: 'index.html',
      filename: 'second.html'
    })
  ],
  // for webpack-dev-server, same as command-line;
  devServer: {
    hot: true,
    // http://localhost:8080/webpack-dev-server/
    inline: true, // true: client(big bundle size), false: iframe;
    historyApiFallback: false, // all routes redirect to the "entry", used for SPA;
    // contentBase: '', // base directory of the test server;
    headers: {
      'X-foo': 'bar'
    },
    // host: '0.0.0.0', // used for all current LAN users;
    // disableHostCheck: true, // required with the previous param;
    port: 8080,
    // allowedHosts: [], // avaliable host;
    // https: {},
    // https: true,
    clientLogLevel: 'info',
    compress: true,  // enable gzip?
    open: true,  // open the browser automatically when compiling complete;
    // openPage: '.'
  },
  profile: true, // capture the performance info from webpack;
  performance: { 
    hints: false, // give warnings when find out performance problem;
    maxAssetSize: 200000,
    maxEntrypointSize: 400000,
    assetFilter: function(assetFilename) { // filter target files;
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
    splitChunks: {
      chunks: 'all',
      minSize: 10000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  stats: { // control the log printing from the browser console;
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },
  cache: false, // enable cache?
  // source-map / cheap-module-eval-source-map / hidden-source-map;
  devtool: 'cheap-module-eval-source-map',
  target: 'web', //  web / node / async-node / webworker / electron-main / electron-renderer;
  watch: false,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 500
  },
  externals: {
    // jquery: 'jQuery'
  },
  resolveLoader: {
    modules: ['node_modules','./'],
  }  // used for local loader;
};
