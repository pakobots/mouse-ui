import {HttpClient} from 'aurelia-fetch-client';
let http = new HttpClient();

export default class RobotWS {
  constructor(url, connectedCallback) {
    this.comm = false;
    this.ws = undefined;
    this.url = url;
  }

  _send(cmd) {
    if (!this.comm) {
      return;
    }
    this.ws.send(cmd);
  }

  connect(url) {
    this.ws = new WebSocket(url ? url : this.url);

    this.ws.addEventListener('message', (data) => {
      // console.log(data);
    });

    return new Promise((resolve,reject)=>{
      this.ws.addEventListener('open', () => {
        this.comm = true;
        console.log('we are ready to send messages');
        resolve();
      });

      this.ws.addEventListener('error', (data) => {
        console.log('websocket error', data);
        reject(data);
      });

      this.ws.addEventListener('close', () => {
        console.log('websocket closed');
        reject(data);
      });
    });
  }

  close(){
    this.ws.close();
    return Promise.resolve();
  }

  name() {
    return http.fetch(this.url + '/robot/name').then((data) => data.json());
  }

  speed(leftPwr, rightPwr) {
    if (leftPwr == 0 && rightPwr == 0) {
      this._send('MS');
    }
    console.log('speed left rev', leftPwr, 'right rev', rightPwr);
    //Intentionally swapping these because we want them opposite when turning on the joystick.
    this._send('S' + rightPwr + '|' + leftPwr);
  }

  stop() {
    this._send('MS');
  }

  forward(fwd) {
    this._send('M' + (fwd
      ? 'F'
      : 'B'));
  }

  light(color, on) {
    this._send('L' + color.toUpperCase() + (on
      ? '1'
      : '0'));
  }
}
