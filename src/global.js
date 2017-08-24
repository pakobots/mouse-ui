import {HttpClient} from 'aurelia-fetch-client';

let http = new HttpClient();

export default {
  robot : {
    connection: undefined,
    meta: undefined
  },
  ble : {
    enabled: false,
    service: undefined,
    connection: undefined
  },
  wifi : {
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
  getCapabilities() {},
  getLocalIP() {
    return new Promise((resolve, reject) => {
      window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      let noop = () => {};
      let pc = new RTCPeerConnection({iceServers: []});
      pc.createDataChannel("");
      pc.createOffer(pc.setLocalDescription.bind(pc), noop);
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
          return resolve('no ice');
        }
        let ip = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
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
    let bots = botList
      ? botList
      : [];
    if (!this.ble.enabled) {
      return Promise.resolve(botList);
    }
    return this.ble.service.scan(bots);
  },
  scanWifi(botList) {
    let bots = botList
      ? botList
      : [];
    let ip = this.wifi.ip.substr(0, this.wifi.ip.lastIndexOf('\.') + 1);
    let promises = [];
    for (let i = 0; i < 255; i++) {
      promises.push(this.chkIP(ip + i, bots));
    }
    return Promise.all(promises).then((data) => {
      return data.filter((item) => item != undefined);
    }).catch((err) => {
      console.log(err);
    });
  }
}
