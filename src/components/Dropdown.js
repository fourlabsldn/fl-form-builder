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
Dropdown.prototype.init = function init() {
  var select = document.createElement('select');

  //Create an initial placeholder option
  var placeHolder = document.createElement('option');
  placeHolder.innerText = 'Select an option';
  placeHolder.setAttribute('value', '');
  placeHolder.setAttribute('disabled', true);
  placeHolder.setAttribute('selected', true);

  select.appendChild(placeHolder);
  this.element.appendChild(select);
};


Dropdown.prototype.add = function add(value, legend) {
  var newOp = document.createElement('option')
}
