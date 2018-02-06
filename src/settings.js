import global from 'global';

export default class SettingsView {
  constructor() {
    if (!global.robot.connection) {
      return location.hash = '';
    }
    this.robot = global.robot.connection;
    this.robot.speed(0, 0);
    this.robot.color(0, 0, 0);
    this.wifiPass = '';
    this.wifiSSID = '';
    this.name = this.robot.name();
    this.color = {
      red: 0,
      blue: 0,
      green: 0
    }
    this.motor = {
      right: 0,
      left: 0
    }
  }

  detached() {
    if (this.robot) {
      this.robot.speed(0, 0);
      this.robot.color(0, 0, 0);
    }
  }

  setName() {
    this.robot.setName(this.name);
  }

  setWifi() {
    console.log('set wifi');
    this.robot.setWifi(this.wifiSSID, this.wifiPass);
  }

  motor(right) {
    let motor = right ? 'right' : 'left';
    this.motor[motor] = this.motor[motor] ? 0 : 100;
    this.robot.speed(this.motor.left, this.motor.right);
  }

  light(color, on) {
    this.color[color] = this.color[color] ? 0 : 0xFF;
    this.robot.color(this.color.red, this.color.green, this.color.blue);
  }
}
