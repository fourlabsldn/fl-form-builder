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
