import global from 'global';

import {
    HttpClient
} from 'aurelia-fetch-client';

let http = new HttpClient();

export default class APIView {
    constructor() {
        this.ip = 'UNKNOWN';
        this.robot = undefined;
        if (global.robot && global.robot.connection) {
            this.robot = global.robot.connection;
            if (this.robot.device.ip) {
                this.ip = this.robot.device.ip;
            }
        }
    }

    cmd(uri) {
        http.fetch('http://' + this.ip + uri).then((res) => {
            if (!res.status == 200) {
                alert('Error sending command:' + res.statusText);
            }
        });
    }
}
