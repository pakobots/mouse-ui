import global from './global';

export class NavBar {
  constructor() {
    this.robot = global.robot;
  }

  lnk(link) {
    if (!global.robot.connection) {
      return;
    }
    location.hash = link;
  }

  chk(wantToGo, mayHaveToHitFirst) {
    if (global.robot.connection) {
      return location.hash = mayHaveToHitFirst;
    }
    location.hash = wantToGo;
  }
}
