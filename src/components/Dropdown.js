/*globals FormComponent*/

/**
 * @class Dropdown
 * @extends FormComponent
 */
function Dropdown(name) {
  if (!(this instanceof Dropdown)) { return new Dropdown(); }

  FormComponent.apply(this); //Inheritance part
}

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
Dropdown.prototype.init = function init(name) {
  var select = document.createElement('select');
  select.setAttribute('name', name);

  //Create an initial placeholder option
  var placeHolder = document.createElement('option');
  placeHolder.innerText = 'Select an option';
  placeHolder.setAttribute('value', '');
  placeHolder.setAttribute('disabled', true);
  placeHolder.setAttribute('selected', true);

  select.appendChild(placeHolder);
  this.element.appendChild(select);
};

/**
 * Adds a new option to the dropdown
 * @method add
 * @param {String} value
 * @param {String} legend [optional]
 */
Dropdown.prototype.add = function add(value, legend) {
  if (!value) {
    throw new Error('Dropdown.add(): ' + value + ' is not a valid "value" value.');
  }

  var newOp = document.createElement('option');
  newOp.setAttribute(value, value);
  newOp.innerText = legend || value;
};
