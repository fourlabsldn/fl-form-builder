/* eslint-disable no-use-before-define*/

import assert from 'fl-assert';
import utils from './utils/utils';
const cssPrefix = 'fl-fb-FormComponent';

// This will create the wrapper for the element to be shown in the
// form builder. It will take care of the show/hide config buttons
// as well as the delete and move buttons.
// It will take care of informing the component when any relevant action is
// performed, such as the required button being toggled on/off
// Use it as such
//
//  const shell = new ComponentShell()
//  shell.attachedComponent(comp);
//  shell.setContent(comp.importState(state));
//  shell.onDelete = myFunc;

export default class ComponentShell {
  constructor() {
    this.state = {
      html: buildHtml(),
      attachedComponent: null,
      onDelete: () => null,
    };
    Object.preventExtensions(this);

    // Listen to UI events from root.
    const events = [
      'requiredSwitchChange',
      'configHide',
      'configShow',
      'componentDeleted',
    ];
    events.forEach(eName => {
      this.state.html.root.addEventListener(eName, (e) => this.trigger(eName, e));
    });
  }

  trigger(eventName, e) { // eslint-disable-line complexity
    if (!this.attachedComponent) {
      return;
    }
    switch (eventName) {
    case 'requiredSwitchChange':
      this.attachedComponent.setRequired(e.target.checked);
      break;
    case 'configHide':
      this.attachedComponent.onConfigClose();
      break;
    case 'configShow':
      this.attachedComponent.onConfigOpen();
      break;
    case 'componentDeleted':
      this.attachedComponent.onDelete();
      this.state.onDelete();
      break;
    default:
      assert(false, `Unexpected event: ${eventName}`);
    }
  }

  attachComponent(component) {
    assert(component, 'No component provided');
    this.state.attachedComponent = component;
    this.state.html.componentTypeField.innerHTML = component.getInfo().type;
  }

  setContent({ main, config }) {
    this.state.componentMain.innerHTMl = '';
    this.state.componentMain.appendChild(main);

    this.state.componentConfig.innerHTMl = '';
    this.state.componentConfig.appendChild(config);
  }
}

/**
 * @method createShell
 * @param  {ComponentInterface} component
 * @return {HTMLElement} frag HTML element ready to be added to the list.
 */
function buildHtml() {
  // We will put everything in these two keys
  const html = {
    componentMain: null,
    componentConfig: null,
    root: document.createElement('div'),
    componentTypeField: null,
  };
  Object.preventExtensions(html);


  // -- Main content --
  html.componentMain = document.createElement('div');
  html.componentMain.classList.add(`${cssPrefix}-content`);
  html.root.appendChild(html.componentMain);


  // -- Configuration --
  const config = document.createElement('div');
  const configurationCssClass = `${cssPrefix}-configuration`;
  config.classList.add(configurationCssClass);
  html.root.appendChild(config);

  html.componentConfig = document.createElement('div');
  html.componentConfig.classList.add('${cssPrefix}-configuration-options');
  config.appendChild(configurationButtons);

  const configurationButtons = document.createElement('div');
  configurationButtons.classList.add(`${cssPrefix}-configuration-buttons`);
  config.appendChild(configurationButtons);

  const requiredSwitch = utils.createSwitch('Required', 'fl-fb');
  requiredSwitch.classList.add(`${configurationCssClass}-switch-required`);

  requiredSwitch.addEventListener('change', (e) => {
    utils.fireEvent(e.target, 'requiredSwitchChange');
  });

  configurationButtons.appendChild(requiredSwitch);

  html.componentTypeField = document.createElement('span');
  html.componentTypeField.classList.add(`${configurationCssClass}-elementName`);
  html.componentTypeField.innerHTML = 'Type not set';
  configurationButtons.appendChild(html.componentTypeField);

  const okBtn = document.createElement('button');
  okBtn.classList.add(
    `${configurationCssClass}-btn-ok`,
    'btn', // Bootstrap
    'btn-sm',
    'btn-default',
    'glyphicon', // Font-awesome
    'glyphicon-ok'
  );
  okBtn.type = 'button';
  okBtn.addEventListener('click', () => {
    showConfig(false, html);
    utils.fireEvent(okBtn, 'configHide');
  });
  configurationButtons.appendChild(okBtn);

  // -- Sidebar --
  const sidebar = document.createElement('div');
  const sidebarCssClass = `${cssPrefix}-sidebar`;
  sidebar.classList.add(sidebarCssClass);
  html.root.appendChild(sidebar);

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add(
    'glyphicon',
    'glyphicon-trash'
  );
  deleteBtn.type = 'button';
  deleteBtn.addEventListener('click', () => {
    utils.fireEvent(deleteBtn, 'componentDeleted');
    html.root.remove();
  });
  addSidebarButton('delete', deleteBtn, sidebar);

  const showConfigBtn = document.createElement('button');
  showConfigBtn.type = 'button';
  showConfigBtn.classList.add(
    'glyphicon', // Font-awesome
    'glyphicon-cog'
  );
  showConfigBtn.title = 'Configure form group';
  this.addSidebarButton('config', showConfigBtn, sidebar);

  showConfigBtn.addEventListener('click', () => {
    showConfig(true, html);
    utils.fireEvent(okBtn, 'configHide');
  });

  return html;
}

/**
 * @method showConfig
 * @param  {Boolean} show
 * @return {void}
 */
function showConfig(show, shellHtml) {
  if (show) {
    // show
    shellHtml.main.classList.add(`${cssPrefix}--configuration-visible`);

    // hide on clickOut
    utils.onClickOut(
      [shellHtml.main, shellHtml.config],
      () => {
        const ComponentWasNotDeleted = shellHtml.root.parentElement;
        if (ComponentWasNotDeleted) {
          showConfig(false, shellHtml);
        }
      }
    );
  } else {
    // hide
    shellHtml.main.classList.remove(`${cssPrefix}--configuration-visible`);
  }
}

function addSidebarButton(elementName, button, sidebar) {
  const className = elementName ?
    `${this.cssPrefix}-sidebar-btn-${elementName}` :
    `${this.cssPrefix}-sidebar-btn`;
  button.classList.add(className);
  sidebar.insertBefore(button, sidebar.children[0]);
}
