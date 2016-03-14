/**
 * Parent class for form components
 * @class FormComponent
 */
function FormComponent() {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }

  this.element = this.createElement('div');
}

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
  var els = this.element.children;
  els.forEach(function (el) {
    el.setAttribute('required', true);
  });
};

/*globals RadioBtns, Checkboxes, TextBox, TextArea, Dropdown*/

/**
 * Singleton to create form components
 * @class FormFabric
 * @param {HTMLElement} el Where the fabric will be put.
 */
function FormFabric() {
  if (!(this instanceof FormFabric)) {
    return new FormFabric();
  }

  this.element = document.createElement('div');
  var formComponents = [
    { desc: 'Radio buttons', constr: RadioBtns },
    { desc: 'Checkboxes', constr: Checkboxes },
    { desc: 'Text box', constr: TextBox },
    { desc: 'Text area', constr: TextArea },
    { desc: 'Dropdown', constr: Dropdown },
  ];

  /**
   * @function createOptionsDropdown
   * @return {HTMLElement} The dropdown menu
   */
  function createOptionsDropdown() {
    var select = document.createElement('select');

    formComponents.forEach(function (component, idx) {
      var op = document.createElement('option');
      op.setAttribute('value', idx);
      op.innerText = component.desc;
      select.appendChild(op);
    });

    return select;
  }

  this.init = function init() {
    var options = createOptionsDropdown();

    var addBtn = document.createElement('button');
    addBtn.innerText = 'Add';
    addBtn.addEventListener('click', function () {
      var idx = options.selectedIndex;
      console.log('Create a ', formComponents[idx].desc);
    });

    this.element.appendChild(addBtn);
    this.element.appendChild(options);
  };

  this.init();
}

/*globals FormComponent*/

/**
 * @class Checkboxes
 * @extends FormComponent
 */
function Checkboxes(name) {
  if (!(this instanceof Checkboxes)) { return new Checkboxes(); }

  FormComponent.apply(this); //Inheritance part
  this.init(name);
}

Checkboxes.prototype.init = function init(name) {
  if (typeof name !== 'string') {
    throw new Error('Checkboxes.init(): ' + name + ' is not a valid "name" parameter.');
  }

  this.name = name + '[]';
  this.required = false;
};

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
  this.element.appendChild(label);
};

/**
 * Sets checkboxes as required. Only does that if there is only one checkbox.
 * @override @method required
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
  return this.element.childElementCount;
};

/**
 * @method getBoxes
 * @return {Array} collection of checkbox HTMLElements
 */
Checkboxes.prototype.getBoxes = function () {
  return [].slice.call(this.element.children);
};

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

/*globals FormComponent*/

/**
 * @class RadioBtns
 * @extends FormComponent
 */
function RadioBtns() {
  if (!(this instanceof RadioBtns)) { return new RadioBtns(); }

  FormComponent.apply(this); //Inheritance part
  this.init();
}

RadioBtns.prototype.init = function init() {

}

/*globals FormComponent*/

/**
 * @class TextArea
 * @extends FormComponent
 */
function TextArea() {
  if (!(this instanceof TextArea)) { return new TextArea(); }

  FormComponent.apply(this); //Inheritance part
  this.init();
}

TextArea.prototype.init = function init() {

}

/*globals FormComponent*/

/**
 * @class TextBox
 * @extends FormComponent
 */
function TextBox() {
  if (!(this instanceof TextBox)) { return new TextBox(); }

  FormComponent.apply(this); //Inheritance part
  this.init();
}

TextBox.prototype.init = function init() {

}

/*globals FormFabric, xController*/

xController(function flFormBuilder(xDivEl) {
  xDivEl.innerText = "I'm working!";

  var fabric = new FormFabric();
  xDivEl.appendChild(fabric.element);
});