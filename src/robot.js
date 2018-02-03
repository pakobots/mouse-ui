import {
  HttpClient
} from 'aurelia-fetch-client';
let http = new HttpClient();

export default class Robot {
  constructor(baseURL) {
    this.url = baseURL;
  }

  name() {
    return this.device.name;
  }

  speed(leftPwr, rightPwr) {
    if (leftPwr == 0 && rightPwr == 0) {
      return http.fetch(this.url + '/motor/stop');
    }
    console.log('speed left rev', leftPwr, 'right rev', rightPwr);
    //Intentionally swapping these because we want them opposite when turning on the joystick.
    return http.fetch(this.url + '/motor/speed/' + rightPwr + '/' + leftPwr);
  }

  stop() {
    return http.fetch(this.url + '/motor/stop');
  }

  forward(fwd) {
    console.log('forward', fwd);
    return http.fetch(this.url + '/motor/' + (fwd ?
      'forward' :
      'backward'));
  }

  light(color, on) {
    // return http.fetch(this.url+'/light/blue/on');
    return http.fetch(this.url + '/light/' + color + '/' + (on ?
      'on' :
      'off'));
  }
}
