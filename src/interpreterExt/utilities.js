export default (interpreter, scope, log, err) => {

    let wrapper = (text) => {
        return alert(arguments.length ? text : '');
    };
    let logger = (text) => {
        console.log(text);
        log(text);
    }
    let delay = (seconds) => {
        var start = Date.now() + ((seconds < 20 ? seconds : 20) * 1000);
        while (start > Date.now()) {
        }
    }

    let cnsle = interpreter.createNativeFunction(() => { }, false);
    interpreter.setProperty(scope, 'console', cnsle);
    interpreter.setProperty(cnsle, 'log', interpreter.createNativeFunction(logger, false), interpreter.NONENUMERABLE_DESCRIPTOR);
    interpreter.setProperty(scope, 'alert', interpreter.createNativeFunction(wrapper));
    interpreter.setProperty(scope, 'delay', interpreter.createNativeFunction(delay));

}