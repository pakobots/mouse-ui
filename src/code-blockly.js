let Blockly = require('scratch-blocks/dist/horizontal');
window.Blockly = Blockly;
let js = require('scratch-blocks/javascript_compressed');

export class Code {
  constructor() {
    this.workspace = null;
    this.fakeDragStack = [];
    this.spaghettiXml = `<block type="control_repeat">
        <value name="TIMES">
          <shadow type="math_whole_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <statement name="SUBSTACK"></statement>
        <next></next>
     </block>`;

    this.toolbox = `
     <xml>
     <category name="Control">




       <block type="control_repeat">
           <value name="TIMES">
             <shadow type="math_whole_number">
               <field name="NUM">10</field>
             </shadow>
           </value>
           <statement name="SUBSTACK"></statement>
           <next></next>
        </block>
        </category>
        <category name="Logic">
          <block type="control_repeat">
              <value name="TIMES">
                <shadow type="math_whole_number">
                  <field name="NUM">10</field>
                </shadow>
              </value>
              <statement name="SUBSTACK"></statement>
              <next></next>
           </block>
        </category>
      </xml>
     `;
  }

  attached() {
    var soundsEnabled = null;
    // if (sessionStorage) {
    //   // Restore sounds state.
    //   soundsEnabled = sessionStorage.getItem('soundsEnabled');
    //   if (soundsEnabled === null) {
    //     soundsEnabled = true;
    //   } else {
    //     soundsEnabled = (soundsEnabled === 'true');
    //   }
    // } else {
    //   soundsEnabled = true;
    // }
    // this.setSoundsEnabled(soundsEnabled);
    // Setup blocks
    // Parse the URL arguments.
    var match = location.search.match(/dir=([^&]+)/);
    var rtl = match && match[1] == 'rtl';
    // document.forms.options.elements.dir.selectedIndex = Number(rtl);
    var toolbox = this.getToolboxElement();
    // document.forms.options.elements.toolbox.selectedIndex = toolbox
    //   ? 1
    //   : 0;
    // match = location.search.match(/side=([^&]+)/);
    // var side = match
    //   ? match[1]
    //   : 'start';
    // document.forms.options.elements.side.value = side;

    this.workspace = Blockly.inject('blocklyDiv', {
      comments: false,
      disable: false,
      collapse: false,
      media: 'media/',
      readOnly: false,
      rtl: rtl,
      scrollbars: true,
      toolbox: this.toolbox,
      trashcan: true,
      horizontalLayout: false,
      toolboxPosition: 'start',
      sounds: soundsEnabled,
      grid: {
        spacing: 16,
        length: 1,
        colour: '#aaa',
        snap: false
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 4,
        minScale: 0.25,
        scaleSpeed: 1.1
      },
      colours: {
        fieldShadow: 'rgba(255, 255, 255, 0.3)',
        dragShadowOpacity: 0.6
      }
    });

    this.workspace.addChangeListener(() => {
      let code = Blockly.JavaScript.workspaceToCode(this.workspace);
      console.log(code);
    });

    Blockly.JavaScript.control_repeat = function(block) {
      var code = 'console.log(\'cool beans\');';
      return [code, Blockly.JavaScript.ORDER_MEMBER];
    };
  }

  getToolboxElement() {
    var match = location.search.match(/toolbox=([^&]+)/);
    return document.getElementById('toolbox-' + (match
      ? match[1]
      : 'categories'));
  }
  toXml() {
    var output = document.getElementById('importExport');
    var xml = Blockly.Xml.workspaceToDom(this.workspace);
    output.value = Blockly.Xml.domToPrettyText(xml);
    output.focus();
    output.select();
    taChange();
  }
  fromXml() {
    var input = document.getElementById('importExport');
    var xml = Blockly.Xml.textToDom(input.value);
    Blockly.Xml.domToWorkspace(this.workspace, xml);
    taChange();
  }
  // Disable the "Import from XML" button if the XML is invalid.
  // Preserve text between page reloads.
  taChange() {
    var textarea = document.getElementById('importExport');
    if (sessionStorage) {
      sessionStorage.setItem('textarea', textarea.value);
    }
    var valid = true;
    try {
      Blockly.Xml.textToDom(textarea.value);
    } catch (e) {
      valid = false;
    }
    document.getElementById('import').disabled = !valid;
  }
  logEvents(state) {
    var checkbox = document.getElementById('logCheck');
    checkbox.checked = state;
    if (sessionStorage) {
      sessionStorage.setItem('logEvents', state
        ? 'checked'
        : '');
    }
    if (state) {
      this.workspace.addChangeListener(logger);
    } else {
      this.workspace.removeChangeListener(logger);
    }
  }
  logFlyoutEvents(state) {
    var checkbox = document.getElementById('logFlyoutCheck');
    checkbox.checked = state;
    if (sessionStorage) {
      sessionStorage.setItem('logFlyoutEvents', state
        ? 'checked'
        : '');
    }
    var flyoutWorkspace = (this.workspace.flyout_)
      ? this.workspace.flyout_.workspace_
      : this.workspace.toolbox_.flyout_.workspace_;
    if (state) {
      flyoutWorkspace.addChangeListener(logger);
    } else {
      flyoutWorkspace.removeChangeListener(logger);
    }
  }
  logger(e) {
    console.log(e);
  }
  glowBlock() {
    if (Blockly.selected) {
      this.workspace.glowBlock(Blockly.selected.id, true);
    }
  }
  unglowBlock() {
    if (Blockly.selected) {
      this.workspace.glowBlock(Blockly.selected.id, false);
    }
  }
  glowStack() {
    if (Blockly.selected) {
      this.workspace.glowStack(Blockly.selected.id, true);
    }
  }
  unglowStack() {
    if (Blockly.selected) {
      this.workspace.glowStack(Blockly.selected.id, false);
    }
  }
  sprinkles(n) {
    var prototypes = [];
    var toolbox = this.workspace.options.languageTree;
    if (!toolbox) {
      console.error('Toolbox not found; add a toolbox element to the DOM.');
      return;
    }
    var blocks = toolbox.getElementsByTagName('block');
    for (var i = 0; i < n; i++) {
      var blockXML = blocks[Math.floor(Math.random() * blocks.length)];
      var block = Blockly.Xml.domToBlock(blockXML, this.workspace);
      block.initSvg();
      block.moveBy(Math.round(Math.random() * 450 + 40), Math.round(Math.random() * 600 + 40));
    }
  }

  spaghetti(n) {
    var xml = this.spaghettiXml;
    for (var i = 0; i < n; i++) {
      xml = xml.replace(/(<(statement|next)( name="SUBSTACK")?>)<\//g, '$1' + this.spaghettiXml + '</');
    }
    xml = '<xml xmlns="http://www.w3.org/1999/xhtml">' + xml + '</xml>';
    var dom = Blockly.Xml.textToDom(xml);
    console.log(dom);
    console.time('Spaghetti domToWorkspace');
    Blockly.Xml.domToWorkspace(this.workspace, dom);
    console.timeEnd('Spaghetti domToWorkspace');
  }

  setSoundsEnabled(state) {
    var checkbox = document.getElementById('soundsEnabled');
    checkbox.checked = (state)
      ? 'checked'
      : '';
    if (sessionStorage) {
      sessionStorage.setItem('soundsEnabled', state);
    }
  }
  fakeDrag(id, dx, dy, opt_workspace) {
    var ws = opt_workspace || Blockly.getMainWorkspace();
    var blockToDrag = ws.getBlockById(id);
    if (!blockToDrag) {
      this.fakeDragWrapper();
      return;
    }
    var blockTop = blockToDrag.svgGroup_.getBoundingClientRect().top;
    var blockLeft = blockToDrag.svgGroup_.getBoundingClientRect().left;
    // Click somewhere on the block.
    var mouseDownEvent = new MouseEvent('mousedown', {
      clientX: blockLeft + 5,
      clientY: blockTop + 5
    });
    blockToDrag.onMouseDown_(mouseDownEvent);
    // Throw in a move for good measure.
    setTimeout(() => {
      var mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: blockLeft + dx,
        clientY: blockTop + dy
      });
      blockToDrag.onMouseMove_(mouseMoveEvent);
      // Drop at dx, dy.
      setTimeout(() => {
        var mouseUpEvent = new MouseEvent('mouseup', {
          clientX: blockLeft + dx,
          clientY: blockTop + dy
        });
        blockToDrag.onMouseUp_(mouseUpEvent);
        setTimeout(this.fakeDragWrapper(), 100);
      }, 30);
    }, 30);
  }

  fakeDragWrapper() {
    var dragInfo = fakeDragStack.pop();
    if (dragInfo) {
      this.fakeDrag(dragInfo.id, dragInfo.dx, dragInfo.dy, dragInfo.workspace);
    }
  }

  fakeManyDrags() {
    var blockList = this.workspace.getAllBlocks();
    for (var i = 0; i < 2 * blockList.length; i++) {
      fakeDragStack.push({
        id: blockList[Math.round(Math.random() * (blockList.length - 1))].id,
        // Move some blocks up and to the left, but mostly down and to the right.
        dx: Math.round((Math.random() - 0.25) * 200),
        dy: Math.round((Math.random() - 0.25) * 200),
        workspace: this.workspace
      });
    }
    this.fakeDragWrapper();
  }
}
