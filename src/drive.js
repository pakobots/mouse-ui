import Hammer from 'hammerjs';
import Robot from 'robotWS';
import JoyStick from 'nipplejs';
import global from 'global';

export class Drive {
  constructor() {}

  attached() {
    this.robot = global.robot.connection;
    let on = false;
    this.interval = setInterval(() => {
      on = !on;
      this.robot.light('B', on);
    }, 1000);
    this.setupMotor();
    this.setupLight();
    this.robot.speed(0, 0);
    this.debounce = 0;
  }

  detached() {
    clearInterval(this.interval);
    this.robot.speed(0, 0);
    console.log('detached drive');
  }

  setupLight() {
    let light = new Hammer(this.lightBtn);
    let rect = this.lightBtn.getBoundingClientRect();
    let x = Math.round(rect.left + rect.width / 2);
    let y = Math.round(rect.top + rect.height / 2);
    light.on('tap', (e) => {
      console.log(x - e.center.x, y - e.center.y);
    })
  }

  setupMotor() {
    let manager = JoyStick.create({
      zone: this.motorCtrl,
      color: '#333333',
      size: 200
    });
    let ready = true;
    let d = 0;
    let left = 0;
    let right = 0;
    manager.on('added', (el, nipple) => {
      nipple.on('move', (nip, data) => {
        d = data.angle.degree;
        left = data.distance;
        right = data.distance;
        if (d > 270 || d < 90) {
          left *= (d > 270 ?
            360 - d :
            d) / 90;
        } else if (d > 90 && d < 270) {
          right *= (d > 180 ?
            d - 180 :
            180 - d) / 90;
        }
        if (this.debounce > Date.now()) {
          return;
        }
        this.debounce = Date.now() + 100;
        this.robot.speed(Math.round(left), Math.round(right));
      });
      nipple.on('end', () => {
        this.robot.speed(0, 0);
        this.robot.stop();
      });
      nipple.on('plain:up', () => {
        this.robot.forward(true);
      });
      nipple.on('plain:down', () => {
        this.robot.forward(false);
      });
    });
  }
}
