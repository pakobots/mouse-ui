// we want font-awesome to load as soon as possible to show the fa-spinner
import 'css-toggle-switch/dist/toggle-switch.css';
import 'font-awesome/css/font-awesome.css';
import '../static/css/styles.css';
import global from './global';
import BT from './bt';
import 'babel-polyfill';

document.addEventListener("deviceready", () => {
  if (window['ble']) {
    let bots = [];
    global.ble.enabled = true;
    global.ble.service = new BT(window.ble);
  }
}, false);

export async function configure(aurelia) {
  aurelia.use.standardConfiguration().developmentLogging();

  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  await aurelia.start();
  await global.getLocalIP();
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}
