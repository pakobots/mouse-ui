import global from './global';
import Robot from './robot';
import RobotWS from './robotWS';
import RobotBT from './robotBT';

export class Scan {
  constructor() {
    this.bots = [];
    this.scanning = false;
    this.robot = global.robot;
    // this.scanWifi();
    this.scan();
    this.icons = [
      'img/robots/png/battery.png',
      'img/robots/png/cpu.png',
      'img/robots/png/robot-10.png',
      'img/robots/png/robot-12.png',
      'img/robots/png/robot-14.png',
      'img/robots/png/robot-16.png',
      'img/robots/png/robot-18.png',
      'img/robots/png/robot-1.png',
      'img/robots/png/robot-2.png',
      'img/robots/png/robot-4.png',
      'img/robots/png/robot-6.png',
      'img/robots/png/robot-8.png',
      'img/robots/png/robot.png',
      'img/robots/png/brain.png',
      'img/robots/png/engine.png',
      'img/robots/png/robot-11.png',
      'img/robots/png/robot-13.png',
      'img/robots/png/robot-15.png',
      'img/robots/png/robot-17.png',
      'img/robots/png/robot-19.png',
      'img/robots/png/robot-20.png',
      'img/robots/png/robot-3.png',
      'img/robots/png/robot-5.png',
      'img/robots/png/robot-7.png',
      'img/robots/png/robot-9.png',
      'img/robots/png/satellite.png'
    ];
  }

  connect(bot) {
    this.robot.meta = bot;
    this.robot.connection = undefined;
    if (bot.mode == 'wifi') {
      this.robot.connection = new RobotWS('ws:' + bot.ip + ':9998');
    }else{
      this.robot.connection = new RobotBT(bot.device);
    }
    this.robot.connection.connect().then((connection)=>{
      location.hash='#/drive';
    });
  }

  connectCancel() {
    this.robot.meta = undefined;
  }

  randomIcon() {
    return this.icons[Math.floor(Math.random() * this.icons.length)]
  }

  scan() {
    this.scanning = true;
    this.bots = [];
    return Promise.all([
      global.scanWifi(this.bots),
      global.scanBT(this.bots)
    ]).catch((err) => {
      console.log(err);
    }).then(() => {
      this.scanning = false;
    })
  }

  attached() {
    if (global.robot.connection) {
      global.robot.connection.close();
    }
    global.robot.connection = undefined;
    global.robot.meta = undefined;
  }
}
