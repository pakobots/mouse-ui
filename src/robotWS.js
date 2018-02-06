import {
  HttpClient
} from 'aurelia-fetch-client';
let http = new HttpClient();

export default class RobotWS {
  constructor(txURL, rxURL, device, connectedCallback) {
    this.comm = false;
    this.tx = undefined;
    this.rx = undefined;
    this.txURL = txURL;
    this.rxURL = rxURL;
    this.device = device;
  }

  _send(cmd) {
    if (!this.comm) {
      return;
    }
    this.tx.send(cmd);
  }

  _recv(data) {
    console.log(data);
  }

  connect(url) {
    if (this.rxURL) {
      this.rx = new WebSocket(this.rxURL);
      this.rx.addEventListener('message', this._recv);
    }

    this.tx = new WebSocket(url ? url : this.txURL);
    return new Promise((resolve, reject) => {
      this.tx.addEventListener('open', () => {
        this.comm = true;
        console.log('we are ready to send messages');
        resolve();
      });

      this.tx.addEventListener('error', (data) => {
        console.log('websocket error', data);
        reject(data);
      });

      this.tx.addEventListener('close', (data) => {
        console.log('websocket closed!!');
        reject(data);
      });
    });
  }

  close() {
    if (this.tx) {
      this.tx.close();
    }
    if (this.rx) {
      this.rx.close();
    }
    return Promise.resolve();
  }

  name() {
    return this.device.name;
  }

  setName(name){
    this.device.name = name;
    return this._send('N'+name);
  }

  setWifi(ssid, pass) {
    return this._send('W' + ssid + '|' + pass);
  }

  speed(leftPwr, rightPwr) {
    if (leftPwr == 0 && rightPwr == 0) {
      this._send('MS');
    }
    console.log('speed left rev', leftPwr, 'right rev', rightPwr);
    //Intentionally swapping these because we want them opposite when turning on the joystick.
    this._send('S' + rightPwr + '|' + leftPwr);
  }


  color(red, green, blue) {
    this._send('C' + red + '|' + green + '|' + blue);
  }

  stop() {
    this._send('MS');
  }

  forward(fwd) {
    this._send('M' + (fwd ?
      'F' :
      'B'));
  }

  light(color, on) {
    this._send('L' + color.toUpperCase() + (on ?
      '1' :
      '0'));
  }
}
