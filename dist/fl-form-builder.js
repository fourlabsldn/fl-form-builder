/**
 * Parent class for form components
 * @abstract
 * @class FormComponent
 */
function FormComponent(name) {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }

  if (typeof name !== 'string') {
    throw new Error('FormComponent: ' + name + ' is not a valid "name" parameter.');
  }

  this.element = this.createElement('div');
  this.element.classList.add('fl-form-component');
  this.name = name;
  this.init(name);
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

FormComponent.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.add('placeholder', 'Insert an option');
  this.placeHolder.setAttribute('disabled', true);
};

FormComponent.prototype.removePlaceHolder = function removePlaceHolder() {
  this.placeHolder.remove();
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
}

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
Checkboxes.prototype.init = function init(name) {
  this.name = name + '[]';
  this.required = false;
};

/**
 * Adds one checkbox to a group of checkboxes.
 * @method add
 * @param {String} value  value that will be sent on form submit
 * @param {String} legend [optional]
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
  newBox.classList.add('fl-check-box');

  if (this.required) { newBox.setAttribute('required', true); }

  var legendNode = document.createTextNode(legend || value);
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

/**
 * @override addPlaceHolder
 */
Checkboxes.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.add('placeholder', 'Check a box');
};

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
  this.wrapper = document.createElement('select');
  this.wrapper.setAttribute('name', name);
  this.wrapper.classList.add('fl-dropdown');

  this.element.appendChild(this.wrapper);

  this.addPlaceHolder();
};

/**
 * Adds a new option to the dropdown
 * @method add
 * @param {String} value
 * @param {String} legend [optional]
 * @return {HTMLElement} the option created
 */
Dropdown.prototype.add = function add(value, legend) {
  if (!value) {
    throw new Error('Dropdown.add(): ' + value + ' is not a valid "value" value.');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  var newOp = document.createElement('option');
  newOp.setAttribute(value, value);
  newOp.innerText = legend || value;
  this.wrapper.appendChild(newOp);
  return newOp;
};

Dropdown.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.add('placeholder', 'Select an option');
  this.placeHolder.setAttribute('disabled', true);
  this.placeHolder.setAttribute('selected', true);
};

/*globals FormComponent*/

/**
 * @class RadioBtns
 * @extends FormComponent
 */
function RadioBtns(name) {
  if (!(this instanceof RadioBtns)) { return new RadioBtns(); }

  FormComponent.apply(this); //Inheritance part
}

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
RadioBtns.prototype.init = function init(name) {
  //Add placeholder
  this.addPlaceHolder();
};

/**
 * @method add
 * @param {String} value
 * @param {String} legend [optional]
 * @return HTMLElement the element added
 */
RadioBtns.prototype.add = function add(value, legend) {
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
  newRadio.innerText = legend || value;

  this.element.appendChild(newRadio);
  return newRadio;
};

/*globals FormComponent*/

/**
 * @class TextArea
 * @extends FormComponent
 */
function TextArea(name) {
  if (!(this instanceof TextArea)) { return new TextArea(); }

  FormComponent.apply(this); //Inheritance part
}

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextArea.prototype.init = function init(name) {
  var area = document.createElement('textarea');
  ara.setAttribute('name', name);
  area.setAttribute('rows', 5);
  area.classList.add('fl-text-area');
  this.element.appendChild(area);
};

/*globals FormComponent*/

/**
 * @class TextBox
 * @extends FormComponent
 */
function TextBox(name) {
  if (!(this instanceof TextBox)) { return new TextBox(); }

  FormComponent.apply(this); //Inheritance part
}

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextBox.prototype.init = function init(name) {
  var box = document.createElement('input');
  box.setAttribute('type', 'text');
  box.setAttribute('name', name);
  box.classList.add('fl-text-box');
};

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextBox.prototype.init = function init(name) {

};

/*globals FormFabric, xController*/

xController(function flFormBuilder(xDivEl) {
  xDivEl.innerText = "I'm working!";

  var fabric = new FormFabric();
  xDivEl.appendChild(fabric.element);
});
