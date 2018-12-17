const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = function(env = {}, argv) {
  console.log(env);
  console.log(argv);
  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
  ];
  // passed here by "webpack --env.production"；
  const isProduction = env['production'];

  if (isProduction) {
    plugins.push(
      new UglifyJsPlugin()
    );
  }

  return {
    entry: './src/js/main.js',
    plugins: plugins,
    mode: isProduction ? 'production' : 'none',
    devtool: isProduction ? undefined : 'source-map',
    output: {
      filename: '[name]_[hash:8].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            }, 'css-loader'
          ],
        }
      ]
    }
  };
};

/*
module.exports = function(env = {}, argv) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        // ...
      })
    }, 5000);
  })
}
*/

/* 
// multiple export;
module.exports = [
  // with pure Object;
  {
    // ...
  },
  // with function;
  function() {
    return {
      // ...
    }
  },
  // with async function;
  function() {
    return Promise();
  }
];
// It's better for building NPM-library (CommonJS、UMD ...)
*/
