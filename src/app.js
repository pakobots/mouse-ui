import {PLATFORM} from 'aurelia-pal';

export class App {
  configureRouter(config, router) {
    config.title = 'Pako Bots';
    config.map([
      {
        route: [
          '', 'scan'
        ],
        name: 'scan',
        moduleId: PLATFORM.moduleName('./scan'),
        nav: true,
        title: 'Scanning'
      }, {
        route: 'code',
        name: 'code',
        moduleId: PLATFORM.moduleName('./code'),
        nav: true,
        title: 'Code'
      }, {
        route: 'drive',
        name: 'drive',
        moduleId: PLATFORM.moduleName('./drive'),
        nav: true,
        title: 'Drive'
      }, {
        route: 'about',
        name: 'about',
        moduleId: PLATFORM.moduleName('./about'),
        nav: true,
        title: 'About'
      }
    ]);

    this.router = router;
  }
}
