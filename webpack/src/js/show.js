import styles from '../styles/main.css';
import { max } from 'lodash-es';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

let show = content => {
  window.document.getElementById('app').innerText = 'Hi,' + content + max([1, 2, 3]);
};

// register service-worker;
if ('serviceWorker' in navigator) {
  const registration = runtime.register();
  registration.then(result => {
    console.log(result);
  });
}

export default show;
 