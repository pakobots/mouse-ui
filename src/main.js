// we want font-awesome to load as soon as possible to show the fa-spinner
import 'css-toggle-switch/dist/toggle-switch.css';
import 'font-awesome/css/font-awesome.css';
import '../static/css/styles.css';
import global from './global';
import BT from './bt';
import 'babel-polyfill';

let p = !cordovaLoaded ? undefined : new Promise((resolve, reject) => {
  document.addEventListener("deviceready", () => {
    console.log('cordova ready');
    if (window['ble']) {
      let bots = [];
      global.ble.enabled = true;
      global.ble.service = new BT(window.ble);
      console.log('we have bluetooth');
    }
    if (window['networkinterface'] && navigator) {
      let state = navigator.connection.type;
      global.wifi.enabled = (state == Connection.WIFI || state == Connection.ETHERNET);
      if (global.wifi.enabled) {
        networkinterface.getWiFiIPAddress((ip) => {
          console.log('we have wifi');
          global.wifi.ip = ip;
          resolve();
        });
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  }, false);
}).then();

export async function configure(aurelia) {
  aurelia.use.standardConfiguration().developmentLogging();
  await aurelia.start();
  if (cordovaLoaded) {
    await p;
  } else {
    await global.getLocalIP();
  }
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}
