/*globals FormComponent*/

/**
 * @class Dropdown
 * @extends FormComponent
 */
function Dropdown() {
  if (!(this instanceof Dropdown)) { return new Dropdown(); }

  FormComponent.apply(this); //Inheritance part
  this.init();
}

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
