// we want font-awesome to load as soon as possible to show the fa-spinner
import 'css-toggle-switch/dist/toggle-switch.css';
import 'font-awesome/css/font-awesome.css';
import '../static/css/styles.css';
import global from './global';
import BT from './bt';
import 'babel-polyfill';

document.addEventListener("deviceready", () => {
  // let cnt = 0;
  // if (window['evothings'] && window.evothings['ble']) {
  if (window['ble']) {
    let bots = [];
    global.ble.enabled = true;
    // global.ble.service = new BT(window.evothings.ble);
    global.ble.service = new BT(window.ble);
    // global.ble.service.scan(bots).then((data) => {
    //   if(!data || data.length ==0){
    //     throw new Error('Unable to find a bot');
    //   }
    //   return global.ble.service.connect(data[0]);
    // }).then((connection) => {
    //   global.ble.connection = connection;
    //   console.log(connection);
    //   return global.ble.service.tx(connection,'LR1');
    // }).then(()=>{
    //   setTimeout(()=>{
    //     global.ble.service.disconnect(global.ble.connection);
    //   },2000);
    // }).catch((err) => {
    //   console.log(err);
    // });
  }
}, false);

export async function configure(aurelia) {
  aurelia.use.standardConfiguration().developmentLogging();

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  await aurelia.start();
  await global.getLocalIP();
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}
