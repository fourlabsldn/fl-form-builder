import utils from './utils/utils.js';

/**
 * Parent class for form components
 * @abstract
 * @class FormComponent
 */
export default function FormComponent() {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }
}

FormComponent.prototype.init = function init(name) {
  if (typeof name !== 'string') {
    throw new Error(`FormComponent: ${name} is not a valid "name" parameter.`);
  }

  // Create wrapper element
  this.element = document.createElement('div');
  this.element.classList.add('fl-component', 'col-md-12', 'form-group');

  // Create div where content will go
  this.content = document.createElement('div');
  this.content.classList.add('fl-form-content');
  this.element.appendChild(this.content);

  // Create a title
  const title = document.createElement('h3');
  title.innerText = 'Add a title';
  title.classList.add('fl-editable');
  this.title = title;
  this.content.appendChild(title);

  this.name = name;
  this.isRequired = false;
  this.createControls();
};

/**
 * Creates the config box
 * @method createControls
 * @return {void}
 */
FormComponent.prototype.createControls = function createControls() {
  // Create side control bar -----------------------------
  const controls = document.createElement('div');
  controls.classList.add('fl-component-side-control');

  const moreConfigBtn = document.createElement('button');
  moreConfigBtn.setAttribute('type', 'button');
  moreConfigBtn.classList.add('glyphicon', 'glyphicon-cog');
  moreConfigBtn.title = 'Configure form group';
  controls.appendChild(moreConfigBtn);

  moreConfigBtn.addEventListener('click', () => {
    this.configToggle();
  });

  // Create configuration box -----------------------------
  const configBox = document.createElement('div');
  configBox.classList.add('fl-component-config');
  this.configBox = configBox;

  // Component-specific content wrapper
  const configContent = document.createElement('div');
  configContent.classList.add('full-width');
  this.configContent = configContent;
  configBox.appendChild(configContent);

  // Bottom buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('col-sm-12');

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.setAttribute('name', 'delete');
  deleteBtn.classList.add(
    'btn',
    'btn-danger',
    'btn-sm',
    'fl-bottom-btn',
    'glyphicon',
    'glyphicon-trash'
  );
  deleteBtn.addEventListener('click', () => {
    const ev = new CustomEvent('removeComponent', {
      detail: { comp: this },
      bubbles: true,
      cancelable: true,
    });

    this.element.dispatchEvent(ev);
  });

  buttonsContainer.appendChild(deleteBtn);

  const okBtn = document.createElement('button');
  okBtn.setAttribute('type', 'button');
  okBtn.setAttribute('name', 'ok');
  okBtn.classList.add('btn', 'btn-default', 'btn-sm', 'fl-bottom-btn', 'glyphicon', 'glyphicon-ok');
  okBtn.addEventListener('click', () => {
    this.saveConfig();
    this.configToggle();
  });

  buttonsContainer.appendChild(okBtn);
  const requiredLabel = document.createElement('label');
  requiredLabel.innerText = 'Required';

  // Switch for whether the field is required or not.
  const requiredSwitch = document.createElement('div');
  requiredSwitch.classList.add('switch');

  const switchInput = document.createElement('input');
  switchInput.classList.add('cmn-toggle', 'cmn-toggle-round');
  switchInput.setAttribute('type', 'checkbox');
  switchInput.id = `cmn-toggle-${Date.now()}`;
  switchInput.addEventListener('change', (e) => {
    const checked = e.target.checked;
    this.required(checked);
  });

  this.requiredSwitch = switchInput;
  requiredSwitch.appendChild(switchInput);

  const switchLabel = document.createElement('label');
  switchLabel.setAttribute('for', switchInput.id);
  requiredSwitch.appendChild(switchLabel);

  requiredLabel.appendChild(requiredSwitch);
  buttonsContainer.appendChild(requiredLabel);

  configBox.appendChild(buttonsContainer);

  this.element.appendChild(configBox);
  this.element.appendChild(controls);

  // If it adds options, let's create the option adding field.
  if (typeof this.addOption === 'function') {
    this.createAddOptionField();
  }
};

/**
 * Toggle the configuration mode for the component
 * @method configToggle
 * @param  {boolean} showHide
 * @return {void}
 */
FormComponent.prototype.configToggle = function configToggle(showHide) {
  showHide = showHide || !this.configShowing; // eslint-disable-line no-param-reassign
  if (showHide) {
    this.showConfig();
  } else {
    this.hideConfig();
  }
};

/**
 * Hides the config box and make the content non-editable
 * @method hideConfig
 * @return {void}
 */
FormComponent.prototype.hideConfig = function hideConfig() {
  if (!this.configBox) {
    throw new Error('FormComponent.configToggle(): No configBox initialised');
  } else if (!this.configShowing) {
    return;
  }

  this.element.classList.remove('fl-form-config-visible');
  this.configShowing = false;

  const editables = this.element.querySelectorAll('.fl-editable');
  const placeholderMessage = 'Set a placeholder text.';

  [].forEach.call(editables, (el) => {
    el.setAttribute('contenteditable', false);

    // Show message to input placeholder text if there is no placeholder already
    // in place. Remove the message if placeholder wasn't set.
    if (el.nodeName === 'TEXTAREA' || (el.nodeName === 'INPUT' && el.type === 'text')) {
      const placeholderText = el.getAttribute('placeholder');
      const value = el.value;

      if (value) {
        el.setAttribute('placeholder', value);
      } else if (placeholderText === placeholderMessage) {
        el.removeAttribute('placeholder');
      }

      el.value = ''; // eslint-disable-line no-param-reassign
    }
  });
};

/**
 * Displays the configuration box and makes appropriate fields editable.
 * @method showConfig
 * @return {void}
 */
FormComponent.prototype.showConfig = function showConfing() {
  if (!this.configBox) {
    throw new Error('FormComponent.showConfing(): No configBox initialised');
  } else if (this.configShowing) {
    return;
  }

  // Show config box and change configShowing value
  this.element.classList.add('fl-form-config-visible');
  this.configShowing = true;

  // Make appropriate elements editable.
  const editables = this.element.querySelectorAll('.fl-editable');
  const placeholderMessage = 'Set a placeholder text.';
  [].forEach.call(editables, (el) => {
    el.setAttribute('contenteditable', true);

    // Show message to input placeholder text if there is no placeholder already
    // in place. Remove the message if placeholder wasn't set.
    if (el.nodeName === 'TEXTAREA' || (el.nodeName === 'INPUT' && el.type === 'text')) {
      const placeholderText = el.getAttribute('placeholder');
      const newContent = placeholderText || placeholderMessage;
      el.setAttribute('placeholder', newContent);
      el.value = ''; // eslint-disable-line no-param-reassign
    }
  });

  // Focus on the appropriate element
  const focusElement = this.focusElement || this.configBox.querySelector('switch');
  if (focusElement) {
    // NOTE: There is a bug that for some reason it doesn't focus if you just
    // call focus() straight away. setTimeout solves it.
    // see http:// goo.gl/UjKOk5
    setTimeout(() => { focusElement.focus(); }, 15);
  }

  // Set a listener to hide the configuration when the user clicks somewhere else.
  const listenerTarget = document.body;
  const useCapture = true;
  listenerTarget.addEventListener('mousedown', function clickOutOfComponent(e) {
    const func = clickOutOfComponent;
    const clickX = e.clientX;
    const clickY = e.clientY;

    // If clicked outside of the component.
    if (!this.isAtPoint(clickX, clickY)) {
      listenerTarget.removeEventListener('mousedown', func, useCapture);
      this.hideConfig();
    }
  }, useCapture);
};

/**
 * Checks whether a point is inside a component or outside of it.
 * @method isAtPoint
 * @param  {integer}  x
 * @param  {integer}  y
 * @return {Boolean}   Whether point is inside component or not
 */
FormComponent.prototype.isAtPoint = function isAtPoint(x, y) {
  const configPosition = this.configBox.getBoundingClientRect();
  const componentPosition = this.element.getBoundingClientRect();

  const top = componentPosition.top;
  const bottom = configPosition.bottom;
  const right = Math.max(configPosition.right, componentPosition.right);
  const left = Math.min(configPosition.left, componentPosition.left);

  // If point is outside of the component
  if (x < left || right < x || y < top || bottom < y) {
    return false;
  }
  return true;
};

/**
 * Creates an input field in the configContent which will call this.add with
 * its content value
 * @method createAddOptionField
 * @param {String} placeHolderText    text to show in the input field
 * @param {Function} removeFunction    function to be called when removing an option
 * @return {HTMLElement} The cretated element
 */
FormComponent.prototype.createAddOptionField =
function createAddOptionField() {
  if (typeof this.removeOption === 'function') {
    const removeBtn = document.createElement('i');
    removeBtn.setAttribute('name', 'remove');
    removeBtn.classList.add('glyphicon', 'glyphicon-minus-sign', 'fl-grey-btn');
    removeBtn.title = 'Remove last option';
    removeBtn.addEventListener('click', () => {
      this.removeOption();
    });

    this.configContent.appendChild(removeBtn);
  }

  const addBtn = document.createElement('i');
  addBtn.setAttribute('name', 'add');
  addBtn.classList.add('glyphicon', 'glyphicon-plus-sign', 'fl-grey-btn');
  addBtn.title = 'Add this option';
  this.configContent.appendChild(addBtn);

  const legend = document.createElement('input');
  legend.setAttribute('placeholder', 'Type a new option');
  legend.setAttribute('type', 'text');
  this.focusElement = legend;
  this.configContent.appendChild(legend);

  addBtn.addEventListener('click', () => {
    // Blink red and return if no value was provided
    if (!legend.value.trim()) {
      utils.blinkRed(legend);

      return;
    }

    this.addOption(legend.value);
    legend.value = '';
  });

  legend.addEventListener('keypress', (e) => {
    if (e.which === 13) {
      const click = new Event('click');
      addBtn.dispatchEvent(click);
      e.preventDefault();
      return false; //  returning false will prevent the event from bubbling up.
    }
    return true;
  });
};

// To be implemented by child clases
FormComponent.prototype.saveConfig = function saveConfig() {

};

FormComponent.prototype.destroy = function destroy() {
  this.element.remove();
};

/**
 * Sets checkboxes as required. Only does that if there is only one checkbox.
 * @method required
 * @param  {boolean} isRequired
 * @return {Boolean}      Whether required was set or not.
 */
FormComponent.prototype.required = function required(isRequired) {
  if (this.isRequired === isRequired) { return true; }

  let inputs = this.content.querySelectorAll('input');
  let textAreas = this.content.querySelectorAll('textarea');
  let selects = this.content.querySelectorAll('select');
  inputs = [].slice.call(inputs);
  textAreas = [].slice.call(textAreas);
  selects = [].slice.call(selects);

  const els = [].concat.call(inputs, textAreas, selects);

  if (isRequired) {
    els.forEach((el) => { el.setAttribute('required', true); });
  } else {
    els.forEach((el) => { el.removeAttribute('required'); });
  }

  this.isRequired = isRequired;
  return true;
};

FormComponent.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.addOption('placeholder', 'Insert an option');
  this.placeHolder.setAttribute('disabled', true);
};

FormComponent.prototype.removePlaceHolder = function removePlaceHolder() {
  this.placeHolder.remove();
  this.placeHolder = null;
};

FormComponent.prototype.getElements = function getElements() {
  const allContent = this.content.children;
  const elements = [];
  [].forEach.call(allContent, (el) => {
    if (el.nodeName !== 'H3') { elements.push(el); }
  });

  return elements;
};

// Method to be called by JSON.stringify
// This method is augmented in the relevant classes.
FormComponent.prototype.toJSON = function toJSON() {
  const json = {};

  if (this.title && this.title.innerText) {
    json.title = this.title.innerText;
  }

  json.componentType = this.componentType;
  json.required = this.isRequired || false;

  json.content = [];
  let contentEls = this.getElements();
  contentEls = [].slice.call(contentEls);
  contentEls.forEach((el) => {
    const elJson = {};
    elJson.nodeName = el.nodeName.toLowerCase();
    elJson.type = el.getAttribute('type') || undefined;
    elJson.name = el.getAttribute('name') || undefined;
    elJson.placeholder = el.getAttribute('placeholder') || undefined;
    elJson.label = el.innerText || el.innerHTML;
    json.content.push(elJson);
  });

  return json;
};
