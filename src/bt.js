let ADVERTISED_SERVICES = ['00006f62-6f72-6576-6f6c-736e616d7568'];

export default class BT {
  constructor(bt) {
    this.bt = bt;
    this.scanning = false;
    this.connection = undefined;
  }

  tx(connection, info) {
    if (!this.connection) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this.bt.writeWithoutResponse(connection.id, '00ff', 'ff01', this.str2ab(info), (success) => {
        resolve(success);
      }, (err) => {
        reject(err);
      });
    });
  }

  tx_blind(connection, info) {
    if (!this.connection) {
      return;
    }
    this.bt.writeWithoutResponse(connection.id, '00ff', 'ff01', this.str2ab(info), (success) => {
      console.log('sent in the blind', info);
    }, (err) => {
      console.log('write err', err);
    });
  }

  disconnect(device) {
    return new Promise((resolve, reject) => {
      this.bt.disconnect(device.id, (success) => {
        this.connection = undefined;
        console.log('disconnected');
        setTimeout(() => {
          resolve();
        }, 1000);
      }, (err) => {
        this.connection = undefined;
        console.log('error disconnecting', err);
        setTimeout(() => {
          resolve();
        }, 1000);
      });
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
        this.connection = device;
        setTimeout(() => {
          resolve(connection);
        }, 10);
      }, (err) => {
        reject(err);
      });
    });
  }

  scan(listOfBots) {
    console.log('scanning for bluetooth devices');
    let uniq = {};
    let bots = listOfBots ?
      listOfBots : [];

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
      this.bt.startScan(ADVERTISED_SERVICES, (device) => {
        console.log(device);
        bots.push({
          name: device.name,
          mode: 'bt',
          ip: device.id,
          device: device
        });
      }, (err) => {
        console.log(err);
        clearTimeout(timeout);
        return this.scanStop();
      });
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
