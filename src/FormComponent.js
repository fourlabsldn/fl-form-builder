/*globals utils*/
'use strict'; //jshint ignore:line

/**
 * Parent class for form components
 * @abstract
 * @class FormComponent
 */
function FormComponent() {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }
}

FormComponent.prototype.init = function init(name) {
  if (typeof name !== 'string') {
    throw new Error('FormComponent: ' + name + ' is not a valid "name" parameter.');
  }

  //Create wrapper element
  this.element = document.createElement('div');
  this.element.classList.add('fl-component');
  this.element.classList.add('col-md-12');
  this.element.classList.add('form-group');

  //Create div where content will go
  this.content = document.createElement('div');
  this.content.classList.add('fl-form-content');
  this.element.appendChild(this.content);

  //Create a title
  var title = document.createElement('h3');
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

  //Create side control bar -----------------------------
  var controls = document.createElement('div');
  controls.classList.add('fl-component-side-control');

  var moreConfigBtn = document.createElement('button');
  moreConfigBtn.setAttribute('type', 'button');
  moreConfigBtn.classList.add('glyphicon');
  moreConfigBtn.classList.add('glyphicon-cog');
  controls.appendChild(moreConfigBtn);

  var _this = this;
  moreConfigBtn.addEventListener('click', function () {
    _this.configToggle();
  });

  //Create configuration box -----------------------------
  var configBox = document.createElement('div');
  configBox.classList.add('fl-component-config');
  this.configBox = configBox;

  //Component-specific content wrapper
  var configContent = document.createElement('div');
  configContent.classList.add('full-width');
  this.configContent = configContent;
  configBox.appendChild(configContent);

  //Bottom buttons container
  var buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('col-sm-12');

  var deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.setAttribute('name', 'delete');
  deleteBtn.classList.add('btn');
  deleteBtn.classList.add('btn-danger');
  deleteBtn.classList.add('btn-sm');
  deleteBtn.classList.add('fl-bottom-btn');
  deleteBtn.classList.add('glyphicon');
  deleteBtn.classList.add('glyphicon-trash');
  deleteBtn.addEventListener('click', function () {
    var ev = new CustomEvent('removeComponent', {
      detail: { comp: _this },
      bubbles: true,
      cancelable: true,
    });

    _this.element.dispatchEvent(ev);
  });

  buttonsContainer.appendChild(deleteBtn);

  var okBtn = document.createElement('button');
  okBtn.setAttribute('type', 'button');
  okBtn.setAttribute('name', 'ok');
  okBtn.classList.add('btn', 'btn-default', 'btn-sm', 'fl-bottom-btn', 'glyphicon', 'glyphicon-ok');
  okBtn.addEventListener('click', function () {
    _this.saveConfig();
    _this.configToggle();
  });

  buttonsContainer.appendChild(okBtn);
  var requiredLabel = document.createElement('label');
  requiredLabel.innerText = 'Required';

  //Switch for whether the field is required or not.
  var requiredSwitch = document.createElement('div');
  requiredSwitch.classList.add('switch');

  var switchInput = document.createElement('input');
  switchInput.classList.add('cmn-toggle', 'cmn-toggle-round');
  switchInput.setAttribute('type', 'checkbox');
  switchInput.id = 'cmn-toggle-' + Date.now();
  switchInput.addEventListener('change', function (e) {
    var checked = e.target.checked;
    _this.required(checked);
  });

  this.requiredSwitch = switchInput;
  requiredSwitch.appendChild(switchInput);

  var switchLabel = document.createElement('label');
  switchLabel.setAttribute('for', switchInput.id);
  requiredSwitch.appendChild(switchLabel);

  requiredLabel.appendChild(requiredSwitch);
  buttonsContainer.appendChild(requiredLabel);

  configBox.appendChild(buttonsContainer);

  this.element.appendChild(configBox);
  this.element.appendChild(controls);

  //If it adds options, let's create the option adding field.
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
  showHide = showHide || !this.configShowing;
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

  var editables = this.element.querySelectorAll('.fl-editable');
  var placeholderMessage = 'Set a placeholder text.';

  [].forEach.call(editables, function (el) {
    el.setAttribute('contenteditable', false);

    //Show message to input placeholder text if there is no placeholder already
    //in place. Remove the message if placeholder wasn't set.
    if (el.nodeName === 'TEXTAREA' || (el.nodeName === 'INPUT' && el.type === 'text')) {
      var placeholderText = el.getAttribute('placeholder');
      var value = el.value;

      if (value) {
        el.setAttribute('placeholder', value);
      }else if (placeholderText ===  placeholderMessage) {
        el.removeAttribute('placeholder');
      }

      el.value = '';
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

  //Show config box and change configShowing value
  this.element.classList.add('fl-form-config-visible');
  this.configShowing = true;

  //Make appropriate elements editable.
  var editables = this.element.querySelectorAll('.fl-editable');
  var placeholderMessage = 'Set a placeholder text.';
  [].forEach.call(editables, function (el) {
    el.setAttribute('contenteditable', true);

    //Show message to input placeholder text if there is no placeholder already
    //in place. Remove the message if placeholder wasn't set.
    if (el.nodeName === 'TEXTAREA' || (el.nodeName === 'INPUT' && el.type === 'text')) {
      var placeholderText = el.getAttribute('placeholder');
      var newContent = (placeholderText) ? placeholderText : placeholderMessage;
      el.setAttribute('placeholder', newContent);
      el.value = '';
    }
  });

  //Focus on the appropriate element
  var focusElement = this.focusElement || this.configBox.querySelector('switch');
  if (focusElement) {
    //NOTE: There is a bug that for some reason it doesn't focus if you just
    //call focus() straight away. setTimeout solves it.
    //see http://goo.gl/UjKOk5
    setTimeout(function () { focusElement.focus(); }, 15);
  }

  //Set a listener to hide the configuration when the user clicks somewhere else.
  var _this = this;
  var listenerTarget = document.body;
  var useCapture = true;
  listenerTarget.addEventListener('mousedown', function clickOutOfComponent(e) {
    var func = clickOutOfComponent;
    var clickX = e.clientX;
    var clickY = e.clientY;

    //If clicked outside of the component.
    if (!_this.isAtPoint(clickX, clickY)) {
      listenerTarget.removeEventListener('mousedown', func, useCapture);
      _this.hideConfig();
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
  var configPosition = this.configBox.getBoundingClientRect();
  var componentPosition = this.element.getBoundingClientRect();

  var top = componentPosition.top;
  var bottom = configPosition.bottom;
  var right = Math.max(configPosition.right, componentPosition.right);
  var left = Math.min(configPosition.left, componentPosition.left);

  //If point is outside of the component
  if (x < left || right < x || y < top || bottom < y) {
    return false;
  } else {
    return true;
  }
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

  var _this = this;
  if (typeof this.removeOption === 'function') {
    var removeBtn = document.createElement('i');
    removeBtn.setAttribute('name', 'remove');
    removeBtn.classList.add('glyphicon', 'glyphicon-minus-sign', 'fl-grey-btn');
    removeBtn.addEventListener('click', function () {
      _this.removeOption();
    });

    this.configContent.appendChild(removeBtn);
  }

  var addBtn = document.createElement('i');
  addBtn.setAttribute('name', 'add');
  addBtn.classList.add('glyphicon', 'glyphicon-plus-sign', 'fl-grey-btn');
  this.configContent.appendChild(addBtn);

  var legend = document.createElement('input');
  legend.setAttribute('placeholder', 'Type a new option');
  legend.setAttribute('type', 'text');
  this.focusElement = legend;
  this.configContent.appendChild(legend);

  addBtn.addEventListener('click', function () {

    //Blink red and return if no value was provided
    if (!legend.value.trim()) {
      utils.blinkRed(legend);

      return;
    }

    _this.addOption(legend.value);
    legend.value = '';
  });

  legend.addEventListener('keypress', function (e) {
    if (e.which === 13) {
      var click = new Event('click');
      addBtn.dispatchEvent(click);
      e.preventDefault();
      return false; // returning false will prevent the event from bubbling up.
    } else {
      return true;
    }
  });
};

//To be implemented by child clases
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

  var inputs = this.content.querySelectorAll('input');
  var textAreas = this.content.querySelectorAll('textarea');
  var selects = this.content.querySelectorAll('select');
  inputs = [].slice.call(inputs);
  textAreas = [].slice.call(textAreas);
  selects = [].slice.call(selects);

  var els = [].concat.call(inputs, textAreas, selects);

  if (isRequired) {
    els.forEach(function (el) { el.setAttribute('required', true); });
  } else {
    els.forEach(function (el) { el.removeAttribute('required'); });
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
  var allContent = this.content.children;
  var elements = [];
  [].forEach.call(allContent, function (el) {
    if (el.nodeName !== 'H3') { elements.push(el); }
  });

  return elements;
};

//Method to be called by JSON.stringify
//This method is augmented in the relevant classes.
FormComponent.prototype.toJSON = function toJSON() {
  var json = {};

  if (this.title && this.title.innerText) {
    json.title = this.title.innerText;
  }

  json.componentType = this.componentType;
  json.required = this.isRequired || false;

  json.content = [];
  var contentEls = this.getElements();
  contentEls = [].slice.call(contentEls);
  contentEls.forEach(function (el) {
    var elJson = {};
    elJson.nodeName = el.nodeName.toLowerCase();
    elJson.type = el.getAttribute('type') || undefined;
    elJson.name = el.getAttribute('name') || undefined;
    elJson.placeholder = el.getAttribute('placeholder') || undefined;
    elJson.label = el.innerText || el.innerHTML;
    json.content.push(elJson);
  });

  return json;
};
