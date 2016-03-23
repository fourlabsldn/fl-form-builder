/*globals FormComponent, utils*/
'use strict'; //jshint ignore: line

/**
 * @class RadioBtns
 * @extends FormComponent
 */
function RadioBtns(name) {
  if (!(this instanceof RadioBtns)) { return new RadioBtns(); }

  this.init(name);
}

RadioBtns.prototype = new FormComponent(); //Inheritance part
RadioBtns.prototype.componentType = 'RadioBtns';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
RadioBtns.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.
  this.addPlaceHolder();
};

/**
 * @method add
 * @param {String} value
 * @param {String} legend [optional]
 * @return HTMLElement the element added
 */
RadioBtns.prototype.addOption = function addOption(value, legend) {
  if (!value) {
    throw new Error('RadioBtns.add(): ' + value + ' is not a valid "value" parameter');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  var newRadio = document.createElement('input');
  newRadio.setAttribute('type', 'radio');
  newRadio.setAttribute('name', this.name);
  newRadio.setAttribute('value', value);
  newRadio.classList.add('fl-radio-btn');

  //FIXME: Radio button labels allow you to delete the radio btn. Fix that.
  var newLabel = document.createElement('label');

  var legendNode = document.createElement('span');
  legendNode.innerText = legend || value;
  legendNode.classList.add('fl-editable');
  legendNode.setAttribute('contenteditable', true);

  newLabel.appendChild(newRadio);
  newLabel.appendChild(legendNode);

  this.content.appendChild(newLabel);
  return newLabel;
};

/**
 * @method removeOption
 * @return {void}
 */
RadioBtns.prototype.removeOption = function removeOption() {
  var radioBtns = this.getElements();
  var atLeastOneBtn = (radioBtns.length > 0);
  if (!atLeastOneBtn || this.placeHolder) {
    utils.blinkRed(this.content);
    return;
  }

  var lastEl = radioBtns.pop();
  lastEl.remove();
};
