export default (interpreter, scope, log, err, connection) => {
    let pako = interpreter.createNativeFunction(() => { }, false);
    interpreter.setProperty(scope, 'pako', pako);

    if (connection) {
        interpreter.setProperty(pako, 'color', interpreter.createNativeFunction((color) => {
            let red = parseInt(color.substr(1, 2), 16);
            let green = parseInt(color.substr(3, 2), 16);
            let blue = parseInt(color.substr(5, 2), 16);
            connection.color(red, green, blue);
        }, false));
        interpreter.setProperty(pako, 'speed', interpreter.createNativeFunction(connection.speed, false));
        interpreter.setProperty(pako, 'fwd', interpreter.createNativeFunction(connection.forward, false));
        interpreter.setProperty(pako, 'stop', interpreter.createNativeFunction(connection.stop, false));
        interpreter.setProperty(pako, 'name', interpreter.createNativeFunction(() => {
            return connection.name();
        }, false));
    } else {
        let notConnected = () => {
            log('Robot Not Connected!!');
            return '';
        }
        interpreter.setProperty(pako, 'color', interpreter.createNativeFunction(notConnected, false));
        interpreter.setProperty(pako, 'speed', interpreter.createNativeFunction(notConnected, false));
        interpreter.setProperty(pako, 'fwd', interpreter.createNativeFunction(notConnected, false));
        interpreter.setProperty(pako, 'stop', interpreter.createNativeFunction(notConnected, false));
        interpreter.setProperty(pako, 'name', interpreter.createNativeFunction(notConnected, false));
    }
}