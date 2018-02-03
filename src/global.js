import {
  HttpClient
} from 'aurelia-fetch-client';

let http = new HttpClient();

export default {
  robot: {
    connection: undefined,
    meta: undefined
  },
  ble: {
    enabled: false,
    service: undefined,
    connection: undefined
  },
  wifi: {
    ip: undefined,
    enabled: false,
    ws: {
      enabled: false,
      port: 9998
    },
    http: {
      enabled: false,
      port: 80
    }
  },
  upgrade(){
    // http.fetch('http://localhost:8080/robot.bin').then((data)=>data.arrayBuffer()).then((data)=>{
    //   http.fetch('http://10.1.1.122/upgrade/'+data.byteLength,{
    //     method: 'post',
    //     body: data
    //   });
    // }).catch((err)=>{
    //   console.log(err);
    // });
  },
  getCapabilities() {},
  getLocalIP() {
    return new Promise((resolve, reject) => {
      window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      let noop = () => {};
      let pc = new RTCPeerConnection({
        iceServers: []
      });
      pc.createDataChannel("");
      pc.createOffer(pc.setLocalDescription.bind(pc), noop);
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
          return resolve('no ice');
        }
        let ip = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
        if (ip.indexOf('192.0.0') == 0) {
          ip = '192.168.4.300';
        }
        this.wifi.ip = ip;
        this.wifi.enabled = true;
        pc.onicecandidate = noop;
        resolve(ip);
      };
    });
  },
  chkIP(ip, botList) {
    return http.fetch('http://' + ip + ':' + this.wifi.http.port + '/robot/name').then((data) => {
      return data.json();
    }).then((data) => {
      data.ip = ip;
      data.mode = 'wifi';
      if (botList) {
        botList.push(data);
      }
      return data;
    }).catch((err) => {
      //NOOP expecting many failures.
      //console.log(err);
    });
  },
  scanBT(botList) {
    let bots = botList ?
      botList : [];
    if (!this.ble.enabled) {
      return Promise.resolve(bots);
    }
    return this.ble.service.scan(bots);
  },
  scanWifi(botList) {
    let bots = botList ?
      botList : [];
    if (!this.wifi.ip) {
      return this.getLocalIP().then((ip) => {
        if (ip) {
          return this.scanWifi(bots);
        }
        return bots;
      }).catch((err) => {
        console.log(err);
        return bots;
      });
    }

    let ip = this.wifi.ip.substr(0, this.wifi.ip.lastIndexOf('\.') + 1);
    let promises = [];

    if (this.wifi.ip.indexOf('192.168.4') == 0) {
      promises.push(this.chkIP('192.168.4.1', bots));
    } else {
      for (let i = 1; i < 250; i++) {
        promises.push(this.chkIP(ip + i, bots));
      }
    }
    return Promise.all(promises).then((data) => {
      return data.filter((item) => item != undefined);
    }).catch((err) => {
      console.log(err);
    });
  }
}
