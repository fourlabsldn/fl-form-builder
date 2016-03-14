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
    if (typeof name !== 'string') {
      throw new Error('Checkboxes.init(): ' + name + ' is not a valid "name" parameter.');
    }

    this.name = name + '[]';
    this.required = false;
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
  } else if (this.required && this.countBoxes() > 1) {
    console.error('Checkboxes: To be "required" there can only be one checkbox in the group');
  }

  var newBox = document.createElement('input');
  newBox.setAttribute('type', 'checkbox');
  newBox.setAttribute('name', this.name);
  newBox.setAttribute('value', value);
  if (this.required) { newBox.setAttribute('required', true); }

  var legendNode = document.createTextNode(legend);
  var label = document.createElement('label');
  label.appendChild(newBox);
  label.appendChild(legendNode);
  this.container.appendChild(label);
};

/**
 * Sets checkboxes as required. Only does that if there is only one checkbox.
 * @method required
 * @param  {boolean} isRequired
 * @return {Boolean}      Whether required was set or not.
 */
Checkboxes.prototype.required = function required(isRequired) {
  if (this.countBoxes() > 1 && isRequired) {
    console.error('Checkboxes: To be "required" there can only be one checkbox in the group');
    return false;
  }

  this.required = isRequired;
  var boxes = this.getBoxes();
  if (boxes[0]) { boxes[0].setAttribute('required', isRequired); }

  return true;
};

/**
 * @method countBoxes
 * @return {integer} Amount of checkboxes in the component
 */
Checkboxes.prototype.countBoxes = function () {
  return this.container.childElementCount;
};

/**
 * @method getBoxes
 * @return {Array} collection of checkbox HTMLElements
 */
Checkboxes.prototype.getBoxes = function () {
  return [].slice.call(this.container.children);
};
