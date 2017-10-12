import global from './global';

export class DisconnectView {
  constructor() {
    this.robot = global.robot.connection;
  }

  attached() {
    this.robot.close().then(() => {
      console.log('ready to scan. robot disconnected');
      global.robot.connection = undefined;
      setTimeout(() => {
        location.hash = '#/scan';
      }, 1000);
    }).catch((err)=>{
      console.log(err);
    });
  }
}
