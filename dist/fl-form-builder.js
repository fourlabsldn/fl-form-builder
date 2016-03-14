/**
 * Parent class for form components
 * @class FormComponent
 */
function FormComponent() {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }

  this.container = this.createElement('div');
}

FormComponent.prototype.destroy = function destroy() {
  this.container.remove();
};

/**
 * Singleton to create form components
 * @class FormFabric
 * @param {HTMLElement} el Where the fabric will be put.
 */
function FormFabric(el) {
  if (!(this instanceof FormFabric)) {
    return new FormFabric(el);
  }

  /**
   * @function createOptionsDropdown
   * @return {HTMLElement} The dropdown menu
   */
  function createOptionsDropdown() {
    var select = document.createElement('select');
    var options = [
      'Radio button',
      'Checkbox',
      'Text field',
      'Text area',
      'Dropdown',
    ];

    options.forEach(function (option) {
      var op = document.createElement('option');
      op.setAttribute('value', option);
      op.innerText = option;
      select.appendChild(op);
    });

    return select;
  }

  this.init = function init() {
    var addBtn = document.createElement('button');
    addBtn.innerText = 'Add';
    var options = createOptionsDropdown();

    el.appendChild(addBtn);
    el.appendChild(options);
  };

  this.init();
}

xController(function flFormBuilder(xDivEl) {
  xDivEl.innerText = "I'm working, bitches!";

});


module.exports = function () {
  function Aconst() {
    this.test = ['a', 'b'];
  }

  Aconst.prototype.list = function list() {
    this.test.forEach(function (each) {
      console.log(each);
    });
  };

  function AChild() {
    Aconst.apply(this);
    this.name = 'achild';
  }

  AChild.prototype.testIt = function () {
    console.log('The name is ', this.name);
  };

  return {
    Aconst: Aconst,
    AChild: AChild,
  };
};
