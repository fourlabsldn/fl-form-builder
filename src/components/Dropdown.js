/*globals FormComponent, utils*/
'use strict'; //jshint ignore:line

/**
 * @class Dropdown
 * @extends FormComponent
 */
function Dropdown(name) {
  if (!(this instanceof Dropdown)) { return new Dropdown(); }

  this.init(name);
}

Dropdown.prototype = new FormComponent(); //Inheritance part
Dropdown.prototype.componentType = 'Dropdown';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
Dropdown.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  var labelEl = document.createElement('div');
  labelEl.classList.add('full-width');
  this.selector = document.createElement('select');
  this.selector.setAttribute('name', name);
  this.selector.classList.add('fl-dropdown');
  this.selector.classList.add('form-control');
  labelEl.appendChild(this.selector);

  this.content.appendChild(labelEl);
  this.addPlaceHolder();
};

/**
 * Adds a new option to the dropdown
 * @method add
 * @param {String} value
 * @param {String} legend [optional]
 * @return {HTMLElement} the option created
 */
Dropdown.prototype.addOption = function addOption(value, legend) {
  if (!value) {
    throw new Error('Dropdown.addOption(): ' + value + ' is not a valid "value" value.');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  var newOp = document.createElement('option');
  newOp.innerText = legend || value;
  this.selector.appendChild(newOp);
  return newOp;
};

/**
 * @method removeOption
 * @return {void}
 */
Dropdown.prototype.removeOption = function removeOption() {
  var options = this.getElements();
  var hasAtLeastOneOption = options.length > 0;
  if (!hasAtLeastOneOption || this.placeHolder) {
    utils.blinkRed(this.selector);
    return;
  }

  var selectedIndex = this.selector.selectedIndex;
  var index = (selectedIndex >= 0) ? selectedIndex : 0;
  var optionToBeRemoved = this.selector.children[index];
  optionToBeRemoved.remove();
};

/**
 * Adds a placeholder and saves it in this.placeHolder
 * @method @override addPlaceHolder
 */
Dropdown.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.addOption('placeholder', 'Select an option');
  this.placeHolder.setAttribute('disabled', true);
  this.placeHolder.setAttribute('selected', true);
};

/**
 * Hides the config panel and makes the selectable a dropdown again
 * @method @override hideConfig
 * @return {void}
 */
Dropdown.prototype.hideConfig = function hideConfig() {
  this.constructor.prototype.hideConfig.call(this);

  if (!this.selector) {
    console.error('Dropdown.hideConfig(): Selector not specified');
    return;
  }

  //Make selector not multiple
  this.selector.removeAttribute('multiple');
};

/**
 * Shows the config panes and allows the selection of multiple elements
 * @method @override showConfig
 * @return {void}
 */
Dropdown.prototype.showConfig = function showConfig() {
  this.constructor.prototype.showConfig.call(this);

  if (!this.selector) {
    console.error('Dropdown.showConfig(): Selector not specified');
    return;
  }

  //Make selector multiple;
  this.selector.setAttribute('multiple', true);
};

/**
 * @method @override getElements
 * @return {HTMLElement}
 */
Dropdown.prototype.getElements = function getElements() {
  var allOptions = this.content.querySelectorAll('option');
  return [].slice.call(allOptions);
};
