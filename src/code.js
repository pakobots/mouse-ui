import {
  js_beautify as beautiful
} from 'js-beautify';

import global from 'global';

let cmReady = Promise.resolve();

//LAME LAME LAME LAME
(() => {
  let ugly = ['lib/codemirror.js',
    'addon/fold/xml-fold.js',
    'addon/edit/matchbrackets.js',
    'addon/edit/matchtags.js',
    'addon/fold/foldcode.js',
    'addon/fold/foldgutter.js',
    'addon/fold/brace-fold.js',
    'addon/fold/comment-fold.js',
    'addon/lint/lint.js',
    'addon/lint/javascript-lint.js',
    'addon/hint/show-hint.js',
    // 'tern/acorn/dist/acorn.js',
    // 'tern/acorn/dist/acorn_loose.js',
    // 'tern/acorn/dist/walk.js',
    // 'tern/doc/demo/polyfill.js',
    // 'tern/lib/signal.js',
    // 'tern/lib/tern.js',
    // 'tern/lib/def.js',
    // 'tern/lib/comment.js',
    // 'tern/lib/infer.js',
    // 'tern/plugin/doc_comment.js',
    // 'addon/tern/tern.js',
    'mode/javascript/javascript.js'
  ];
  let promises = [];

  for (let u of ugly) {
    let s = document.createElement('script');
    s.setAttribute('src', 'cm/' + u);
    cmReady = cmReady.then(() => {
      return new Promise((resolve, reject) => {
        document.head.appendChild(s);
        s.onload = () => {
          resolve();
        }
        s.onerror = () => {
          reject();
        }
      })
    });
  }
})();


export class Code {
  constructor() {
    this.showEditor = false;
    this.execute = this.execute.bind(this);
    this.console = console;
  }

  execute(cm) {
    let bot = this.robot;

    try {
      eval(cm.getValue());
    } catch (e) {
      console.log(e);
    }
  }

  attached() {
    this.robot = global.robot.connection;

    cmReady.then(() => {
      this.editor.value = beautiful(this.editor.value, {
        indent_size: 2,
        indent_char: ' '
      })

      let editor = CodeMirror.fromTextArea(this.editor, {
        lineNumbers: true,
        mode: 'javascript',
        lineWrapping: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
      });

      editor.setOption("extraKeys", {
        Tab: (cm) => {
          var spaces = Array(cm.getOption('indentUnit') + 1).join(" ");
          cm.replaceSelection(spaces);
        },
        'Ctrl-B': (cm) => {
          cm.setValue(beautiful(cm.getValue(), {
            indent_size: 2,
            indent_char: ' '
          }));
        },
        'Ctrl-L': this.execute
      });

      this.showEditor = true;
      console.log(editor);
    });
  }
}
