function FormBody() {
  if (!(this instanceof FormBody)) {
    return new FormBody();
  }

  var form;
  var submitBtn;
  var components = [];

  this.addComponent = function addComponent(comp) {
    if (!form) {
      console.error('FormBody: Form not initialised.');
      return;
    } else if (!comp) {
      console.error('FormBody: No element to be added included.');
      return;
    } else {
      components.push(comp);
      form.insertBefore(comp.element, submitBtn);
    }
  };

  this.init = function () {
    form = document.createElement('form');
    form.classList.add('form-horizontal');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Submit button clicked.');
      console.dir(components);
    });

    var _this = this;
    form.addEventListener('newElement', function (e) {
      if (!e.detail) {
        console.error('No data in "newElement" event.');
        return;
      }

      _this.addComponent(e.detail.comp);
    });

    submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.classList.add('btn');
    submitBtn.classList.add('col-sm-12');
    form.appendChild(submitBtn);
    this.element = form;
  };

  this.init();
}

/**
 * Parent class for form components
 * @abstract
 * @class FormComponent
 */
function FormComponent() {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }
}

FormComponent.prototype.init = function init(name) {
  if (typeof name !== 'string') {
    throw new Error('FormComponent: ' + name + ' is not a valid "name" parameter.');
  }

  this.element = document.createElement('div');
  this.element.classList.add('fl-form-component');
  this.element.classList.add('col-md-11');
  this.element.classList.add('form-group');
  this.name = name;
};

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
function FormFabric(formBody) {
  if (!(this instanceof FormFabric)) {
    return new FormFabric();
  }

  var formComponents = [
    { desc: 'Radio buttons', constr: RadioBtns },
    { desc: 'Checkboxes', constr: Checkboxes },
    { desc: 'Text box', constr: TextBox },
    { desc: 'Text area', constr: TextArea },
    { desc: 'Dropdown', constr: Dropdown },
  ];

  function createElement(Constr, formBody) {
    var name = 'Temp name' + (Math.floor(Math.random() * 1000));
    var comp = new Constr(name);
    var ev = new CustomEvent('newElement',
      {
        detail: {	comp: comp },
        bubbles: true,
        cancelable: true,
      });

    formBody.dispatchEvent(ev);
  }

  /**
   * @function createOptionsDropdown
   * @return {HTMLElement} The dropdown menu
   */
  function createOptionsDropdown() {
    var select = document.createElement('select');
    select.classList.add('form-control');
    select.style.display = 'inline';
    select.style.minWidth = '0';
    select.style.maxWidth = '200px';

    formComponents.forEach(function (component, idx) {
      var op = document.createElement('option');
      op.setAttribute('value', idx);
      op.innerText = component.desc;
      select.appendChild(op);
    });

    return select;
  }

  this.init = function init() {
    this.element = document.createElement('div');
    this.element.classList.add('fl-form-fabric');
    var options = createOptionsDropdown();

    var addBtn = document.createElement('button');
    addBtn.classList.add('btn');
    addBtn.innerText = 'Add';
    addBtn.addEventListener('click', function () {
      var idx = options.selectedIndex;
      console.log('Create a ', formComponents[idx].desc);
      createElement(formComponents[idx].constr, formBody);
    });

    this.element.appendChild(addBtn);
    this.element.appendChild(options);
  };

  this.init(formBody);
}

/*globals FormComponent*/

/**
 * @class Checkboxes
 * @extends FormComponent
 */
function Checkboxes(name) {
  if (!(this instanceof Checkboxes)) { return new Checkboxes(); }

  this.init(name);
}

Checkboxes.prototype = new FormComponent(); //Inheritance part

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
Checkboxes.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.
  this.element.classList.add('checkbox');
  this.name = name + '[]';
  this.required = false;
  this.addPlaceHolder();
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

  this.init(name);
}

Dropdown.prototype = new FormComponent(); //Inheritance part

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
Dropdown.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  this.wrapper = document.createElement('select');
  this.wrapper.setAttribute('name', name);
  this.wrapper.classList.add('fl-dropdown');
  this.wrapper.classList.add('form-control');

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

  this.init(name);
}

RadioBtns.prototype = new FormComponent(); //Inheritance part

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
RadioBtns.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.
  this.element.classList.add('radio');

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

  var newLabel = document.createElement('label');
  var labelText = document.createTextNode(legend || value);
  newLabel.appendChild(newRadio);
  newLabel.appendChild(labelText);

  this.element.appendChild(newLabel);
  return newRadio;
};

/*globals FormComponent*/

/**
 * @class TextArea
 * @extends FormComponent
 */
function TextArea(name) {
  if (!(this instanceof TextArea)) { return new TextArea(); }

  this.init(name);
}

TextArea.prototype = new FormComponent(); //Inheritance part

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextArea.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.
  var labelEl = document.createElement('label');
  var labelText = document.createTextNode('Text Area ');
  this.labelText = labelText;
  labelEl.appendChild(labelText);

  var area = document.createElement('textarea');
  area.setAttribute('name', name);
  area.setAttribute('rows', 5);
  area.classList.add('fl-text-area');
  area.classList.add('form-control');
  labelEl.appendChild(area);

  this.element.appendChild(labelEl);
};

TextArea.prototype.setLabel = function setLabel(desc) {
  if (!desc || !this.labelText) { return; }

  this.labelText.innerText = desc;
};

/*globals FormComponent*/

/**
 * @class TextBox
 * @extends FormComponent
 */
function TextBox(name) {
  if (!(this instanceof TextBox)) { return new TextBox(); }

  this.init(name);
}

TextBox.prototype = new FormComponent(); //Inheritance part

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextBox.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  var labelEl = document.createElement('label');
  var labelText = document.createTextNode('Text ');
  this.labelText = labelText;
  labelEl.appendChild(labelText);

  var box = document.createElement('input');
  box.setAttribute('type', 'text');
  box.setAttribute('name', name);
  box.classList.add('fl-text-box');
  box.classList.add('form-control');
  labelEl.appendChild(box);

  this.element.appendChild(labelEl);
};

TextBox.prototype.setLabel = function setLabel(desc) {
  if (!desc || !this.labelText) { return; }

  this.labelText.innerText = desc;
};

/*globals FormFabric, FormBody, xController*/

xController(function flFormBuilder(xDivEl) {
  xDivEl.innerText = "I'm working!";

  var formBody = new FormBody();
  var fabric = new FormFabric(formBody.element);

  xDivEl.classList.add('container');
  xDivEl.appendChild(fabric.element);
  xDivEl.appendChild(formBody.element);
});
