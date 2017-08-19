export default class BT {
  constructor(bt) {
    this.bt = bt;
    this.scanning = false;
  }

  tx(connection, info) {
    return new Promise((resolve, reject) => {
      this.bt.writeWithoutResponse(connection.id, '00ff', 'ff01', this.str2ab(info), (success) => {
        resolve(success);
      }, (err) => {
        reject(err);
      });
    });
  }

  tx_blind(connection, info) {
    this.bt.writeWithoutResponse(connection.id, '00ff', 'ff01', this.str2ab(info), (success) => {
      console.log('sent in the blind', info);
    }, (err) => {
      console.log('write err', err);
    });
  }

  disconnect(device) {
    this.bt.disconnect(device.id, (success) => {
      console.log('disconnected');
    }, (err) => {
      console.log('error disconnecting', err);
    });
  }

  connect(device) {
    if (this.scanning) {
      return this.scanStop().then(() => {
        return this.connect(device);
      });
    }
    console.log('connecting to device', device);
    return new Promise((resolve, reject) => {
      this.bt.connect(device.id, (connection) => {
        setTimeout(() => {
          resolve(connection);
        }, 10);
      }, (err) => {
        reject(err);
      });
    });
    // return new Promise((resolve, reject) => {
    //   this.bt.connectToDevice(device, () => {
    //     console.log('connected to device', device);
    //
    //     let svc = this.bt.getService(device, '000000FF-0000-1000-8000-008005F9B34FB');
    //     //"fb349b5f8000-0080-0010-0000-abcd0000"
    //     console.log('"000000ff-0000-1000-8000-008005f9b34fb"', svc);
    //     resolve(device);
    //   }, () => {
    //     console.log('disconnected from device', device.name);
    //     if (disconnected) {
    //       disconnected();
    //     }
    //   }, (err) => {
    //     console.log(err);
    //     reject(err);
    //   })
    // });
  }

  scan(listOfBots) {
    console.log('scanning for bluetooth devices');
    let uniq = {};
    let bots = listOfBots
      ? listOfBots
      : [];

    if (this.scanning) {
      console.log('already scanning');
      return Promise.resolve(listOfBots);
    }

    return new Promise((resolve, reject) => {
      let timeout = setTimeout(() => {
        resolve(bots);
        this.scanStop();
      }, 3000);

      this.scanning = true;
      this.bt.startScan([], (device) => {
        console.log(device);
        bots.push({name: device.name, mode: 'bt', ip: device.id, device: device});
      }, (err) => {
        console.log(err);
        clearTimeout(timeout);
        return this.scanStop();
      });

      // this.bt.startScan((device) => {
      //   console.log(device);
      //   if (!uniq[device.address]) {
      //     uniq[device.address] = 1;
      //     if (device.name == 'SPEC_BOT_1') {
      //       console.log('adding device', device.name);
      //       bots.push(device);
      //     }
      //   }
      // }, (err) => {
      //   console.log(err);
      //   reject(err);
      //   clearTimeout(timeout);
      //   this.bt.stopScan();
      // });
    }).then(() => {
      this.scanning = false;
    });
  }

  scanStop() {
    return new Promise((resolve, reject) => {
      this.bt.stopScan(() => {
        console.log('stopped scanning');
        resolve();
      }, (err) => {
        console.log(err);
        reject();
      });
    }).then(() => {
      this.scanning = false;
    });
  }

  str2ab(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  ab2str(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }
}
