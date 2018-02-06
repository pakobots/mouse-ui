import JoyStick from 'nipplejs';
import global from 'global';

export class Drive {
  constructor() {
    this.colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#f39c12', '#d35400', '#c0392b', '#000000'];
  }

  attached() {
    this.robot = global.robot.connection;
    if (!this.robot) {
      location.hash = '#/scan';
      return;
    }
    this.robot.speed(0, 0);
    this.debounce = 0;
    this.manager = JoyStick.create({
      zone: this.motorCtrl,
      color: '#333333',
      size: 200,
      position: {
        top: '50%',
        left: '50%'
      }
    });

    let nipple = this.manager.get(0);
    if (nipple) {
      this.motorJoystick(nipple);
    } else {
      this.manager.on('added', (el, nipple) => {
        this.motorJoystick(nipple);
      });
    }
  }

  detached() {
    clearInterval(this.interval);
    if (this.robot) {
      this.robot.speed(0, 0);
      this.manager.destroy();
    }
  }

  setColor(color) {
    switch (color) {
      case '#2ecc71':
        color = '#00FF00';
        break;
      case '#ecf0f1':
        color = '#FFFFFF';
        break;
      case '#e74c3d':
        color = '#FF0000';
        break;
      case '#3498db':
        color = '#0000FF';
        break;
    }
    let red = parseInt(color.substr(1, 2), 16);
    let green = parseInt(color.substr(3, 2), 16);
    let blue = parseInt(color.substr(5, 2), 16);
    this.robot.color(red, green, blue);
  }

  motorJoystick(nipple) {
    let d = 0;
    let left = 0;
    let right = 0;
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
      this.debounce = Date.now() + 75;
      this.robot.speed(Math.round(left), Math.round(right));
    });
    nipple.on('end', () => {
      this.robot.speed(0, 0);
      this.robot.stop();
    });
    nipple.on('plain:up', () => {
      console.log('forward');
      this.robot.forward(true);
    });
    nipple.on('plain:down', () => {
      console.log('reverse');
      this.robot.forward(false);
    });
  }
}
