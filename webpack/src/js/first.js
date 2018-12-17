import show from './show.js';
import { add } from './util.js';
show('Webpack');

console.log(add(1, 2));

document.addEventListener('click', () => {
  // code split(dynamic import);
  // console.log(import(/* webpackChunkName: "show" */  './util.js')['minus'](1, 2));
});

// accept hmr update propagation;
if (module.hot) {
  module.hot.accept(['./show.js'], () => {
    console.log('Receive update...');
    // re-render components;
  });
}
