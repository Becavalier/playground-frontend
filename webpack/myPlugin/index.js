class myPlugin {
  constructor(options) {
    this.label = options.label || 'myPlugin';
  }
  
  apply(compiler) {
    // listen to the particular event;
    compiler.plugin('compilation', compilation => {
      console.log('Emit from myPlugin... ' + this.label);
    });
    compiler.plugin('done', (stats) => {
        console.log('Building done... ');
    });
    compiler.plugin('failed', (err) => {
        console.log('Building failed... ');
    });
  }
}
  
module.exports = myPlugin;
