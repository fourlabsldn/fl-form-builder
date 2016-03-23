/*globals FormComponent, utils*/
'use strict'; //jshint ignore:line

/**
 * @class Checkboxes
 * @extends FormComponent
 */
function Checkboxes(name) {
  if (!(this instanceof Checkboxes)) { return new Checkboxes(); }

  this.init(name);
}

Checkboxes.prototype = new FormComponent(); //Inheritance part
Checkboxes.prototype.componentType = 'Checkboxes';
/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
Checkboxes.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  this.name = name + '[]';
  this.addPlaceHolder();
};

/**
 * Adds one checkbox to a group of checkboxes.
 * @method add
 * @param {String} value  value that will be sent on form submit
 * @param {String} legend [optional]
 */
Checkboxes.prototype.addOption = function addOption(value, legend) {
  if (!value) {
    throw new Error('Checkboxes.addOption(): No value parameter provided.');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  if (this.isRequired && this.getElements().length > 0) {
    this.required(false);
  }

  var newBox = document.createElement('input');
  newBox.setAttribute('type', 'checkbox');
  newBox.setAttribute('name', this.name);
  newBox.setAttribute('value', value);
  newBox.classList.add('fl-check-box');

  if (this.isRequired) { newBox.setAttribute('required', true); }

  var legendNode = document.createElement('span');
  legendNode.innerText = legend || value;
  legendNode.classList.add('fl-editable');

  //Let's already make it contenteditable as the config box is currently open.
  legendNode.setAttribute('contenteditable', true);

  var label = document.createElement('label');
  label.appendChild(newBox);
  label.appendChild(legendNode);
  this.content.appendChild(label);
  return label;
};

/**
 * @method removeOption
 * @return {void}
 */
Checkboxes.prototype.removeOption = function removeOption() {
  var boxes = this.getElements();
  var atLeastOneBox = (boxes.length > 0);
  if (!atLeastOneBox || this.placeHolder) {
    utils.blinkRed(this.content);
    return;
  }

  var lastEl = boxes.pop();
  lastEl.remove();
};
/**
 * Sets checkboxes as required. Only does that if there is only one checkbox.
 * @override @method required
 * @param  {boolean} isRequired
 * @return {Boolean}      Whether required was set or not.
 */
Checkboxes.prototype.required = function required(isRequired) {
  if (this.isRequired === isRequired) {
    return true;
  } else if (!this.requiredSwitch) {
    throw new Error('Checkboxes.required(): No required button in place.');
  } else if (this.getElements().length > 1 && isRequired) {
    console.error('Checkboxes: To be "required" there can only ' +
                  'be one checkbox in the group.');
    this.requiredSwitch.checked = false;
    return false;
  }

  this.isRequired = isRequired;
  var boxes = this.content.querySelectorAll('input');
  if (isRequired) {
    [].forEach.call(boxes, function (box) {
      box.setAttribute('required', true);
    });
  } else {
    [].forEach.call(boxes, function (box) {
      box.removeAttribute('required');
    });
  }

  this.requiredSwitch.checked = isRequired;
  return true;
};

/**
 * @override addPlaceHolder
 */
Checkboxes.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.addOption('placeholder', 'Check a box');
};
