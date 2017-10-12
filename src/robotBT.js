import global from './global';

export default class RobotBT {
  constructor(device) {
    this.bt = global.ble.service;
    this.device = device;
  }

  _send(cmd) {
    if (!this.connection) {
      return;
    }
    this.bt.tx_blind(this.connection, cmd);
  }

  connect() {
    console.log('bt impl', this.bt);
    return this.bt.connect(this.device).then((connection) => {
      global.ble.connection = connection;
      this.connection = connection;
      console.log('connected to bot', connection);
    }).catch((err) => {
      console.log('error connecting to device', this.device, err);
    });
  }

  close() {
    return this.bt.disconnect(this.device);
  }

  name() {
    return {name: this.device.name};
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
