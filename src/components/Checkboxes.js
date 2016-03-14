/*globals FormComponent*/
/**
 * @class Checkboxes
 * @extends FormComponent
 */
function Checkboxes(name) {
  if (!(this instanceof Checkboxes)) {
    return new Checkboxes();
  }

  this.init = function init(name) {
    if (!name) {
      throw new Error('Checkboxes.init(): No "name" parameter provided.');
    }

    this.name = name;
  };

  FormComponent.apply(this); //Inheritance part
  this.init(name);
}

/**
 * Adds one checkbox to a group of checkboxes.
 * @method add
 * @param {String} value  value that will be sent on form submit
 * @param {String} legend
 */
Checkboxes.prototype.add = function add(value, legend) {
  if (!value) {
    throw new Error('Checkboxes.add(): No value parameter provided.');
  }

  var newBox = document.createElement('input');
  newBox.type = 'checkbox';
  newBox.name = this.name;
  newBox.value = value;

  var legendNode = document.createTextNode(legend);
  var label = document.createElement('label');
  label.appendChild(newBox);
  label.appendChild(legendNode);
  this.container.appendChild(label);
};
