import global from 'global';
import interpreter from '../static/neilfraser/interpreter';
import acorn from '../static/neilfraser/acorn';
import utilities from './interpreterExt/utilities';
import pako from './interpreterExt/pako';

//not cool, but....
window.acorn = acorn;

export default class CodeMonaco {
  constructor() {
    this.editor = {};
    this.interpreterExtensions = this.interpreterExtensions.bind(this);
    this.log = this.log.bind(this);
    this.errors = this.errors.bind(this);
    this.play = this.play.bind(this);
    this.terp = undefined;
    this.running = false;
    this.paused = false;
    this.view = 'console';
  }

  interpreterExtensions(interpreter, scope) {
    utilities(interpreter, scope, this.log, this.errors);
    pako(interpreter, scope, this.log, this.errors, global.robot.connection);
  }

  log(message) {
    this.consoleWindow.value = message + '\n' + this.consoleWindow.value;
  }

  errors(message) {
    this.errorWindow.value = message + '\n' + this.errorWindow.value;
  }

  setupInterpreter(destroy) {
    if (this.terp && !destroy) {
      return;
    }
    let acorn = interpreter;
    try {
      this.terp = new interpreter.Interpreter(this.editor.getValue(), this.interpreterExtensions);
    } catch (err) {
      this.errors(err.message);
    }
  }

  setupRunningInterval() {
    this.running = true;
    this.paused = false;
    let interval = setInterval(() => {
      try {
        if (!this.terp.step()) {
          this.running = false;
          this.terp = undefined;
        }
        if (!this.running || this.paused) {
          return clearInterval(interval);
        }
      } catch (err) {
        this.errors(err.message);
        this.running = false;
        clearInterval(interval);
      }
    }, 1);
  }

  step() {
    this.setupInterpreter();
    if (this.running) {
      this.running = false;
    }
    if (!this.terp.step()) {
      this.terp = undefined;
    } else {
      let node = this.terp.stateStack[this.terp.stateStack.length - 1].node;
      console.log(this.terp.stateStack[this.terp.stateStack.length - 1]);
    }
  }

  pause() {
    if (!this.running && !this.terp) {
      return;
    }
    if (this.paused) {
      return this.setupRunningInterval();
    }
    this.paused = true;
  }

  play() {
    if (this.running) {
      this.running = false;
      return;
    }
    this.setupInterpreter(true);
    this.setupRunningInterval();
  }

  attached() {
    let createDependencyProposals = () => {
      // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
      // here you could do a server side lookup
      return [{
        label: 'pako',
        kind: monaco.languages.CompletionItemKind.Module,
        documentation: "Control object used to send commands to the locally connected bot.",
        insertText: 'pako.'
      },
      {
        label: 'pako.color',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Set the color of the light in hex. ex: #FFFFFF",
        insertText: { value: "pako.color(${1|'#,'#FFFFFF','#000000', '#FF0000', '#FF00FF', '#0000FF'|})" }
      },
      {
        label: 'pako.name',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Retrieve the name of the connected bot",
        insertText: 'pako.name()'
      },
      {
        label: 'pako.stop',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Stop the motors",
        insertText: 'pako.stop()'
      },
      {
        label: 'pako.fwd',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Set the direction of the motors",
        insertText: { value: 'pako.fwd(${1|true,false|})' }
      },
      {
        label: 'pako.speed',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Set the speed of the bot by percentage",
        insertText: { value: 'pako.speed(${1:percent_left},${2:percent_right})' }
      },
      {
        label: 'delay',
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: "Delay the script in seconds",
        insertText: { value: 'delay(${1:delay_in_seconds})' }
      }
      ];
    }


    monacoEditor.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        return createDependencyProposals();
      }
    });
    this.editor = monacoEditor.editor.create(this.editorWindow, {
      value: `//Turning of all lights
pako.color('#000000');
delay(1);

//Show color
pako.color('#00FF00');
delay(1);

//Show another color
pako.color('#FF0000');

//Log a big thank you
console.log('Thx for the fun, ' + pako.name());`,
      language: 'javascript'
    });

    let play = this.play;
    this.editor.addAction({
      // An unique identifier of the contributed action.
      id: 'pako-code-exec',

      // A label of the action that will be presented to the user.
      label: 'Play Script',

      // An optional array of keybindings for the action.
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10,
        // chord
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K, monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_M)
      ],

      // A precondition for this action.
      precondition: null,

      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: null,

      contextMenuGroupId: 'navigation',

      contextMenuOrder: 1.5,

      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run: function (ed) {
        play();
        return null;
      }
    });

    //not cool
    setTimeout(() => {
      this.editor.layout();
    }, 500);
  }
}
