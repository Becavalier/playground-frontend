const loaderUtils = require('loader-utils');
module.exports = function(source) {
  // source: the file content that compiler passed to the current loader;
  
  // get the options passed to this loader throught "webpack.config.js";
  const options = loaderUtils.getOptions(this);

  /*
    // return with an async call;
    var callback = this.async();
  */
  /*
    this.callback(
      err: Error | null,
      content: string | Buffer,
      sourceMap?: SourceMap,
      abstractSyntaxTree?: AST
    );
  */
  // this.callback(null, source, sourceMaps);

  // disable the cache;
  this.cacheable(true);

  const versionStr = `;console.log('[${options.label || 'myLoader'}] emit from myLoader... ${this.resourcePath}-${new Date().getTime()}');`;
  return `${source}${versionStr}` ;
};
// if the load hope the binary data;
// module.exports.raw = true;
