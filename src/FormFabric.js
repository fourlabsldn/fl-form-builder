/*globals RadioBtns, Checkboxes, TextBox, TextArea, Dropdown*/

/**
 * Singleton to create form components
 * @class FormFabric
 * @param {HTMLElement} el Where the fabric will be put.
 */
function FormFabric(formBody) {
  'use strict';

  if (!(this instanceof FormFabric)) {
    return new FormFabric();
  }

  var formComponents = [
    { desc: 'Radio buttons', constr: RadioBtns, class: 'glyphicon glyphicon-ok-circle' },
    { desc: 'Checkboxes', constr: Checkboxes, class: 'glyphicon glyphicon-check' },
    { desc: 'Dropdown', constr: Dropdown, class: 'glyphicon glyphicon-collapse-down' },
    { desc: 'Text box', constr: TextBox, class: 'glyphicon glyphicon-text-width' },
    { desc: 'Text area', constr: TextArea, class: 'glyphicon glyphicon-text-height' },
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
  function createOptions() {
    var frag = document.createDocumentFragment();
    formComponents.forEach(function (component, idx) {
      var op = document.createElement('button');
      op.setAttribute('value', idx);
      op.className = component.class;
      op.name = component.desc;
      op.classList.add('btn');
      op.classList.add('btn-default');
      op.addEventListener('click', function () {
        var idx = op.value;
        createElement(formComponents[idx].constr, formBody);
      });

      frag.appendChild(op);
    });

    return frag;
  }

  this.init = function init() {
    this.element = document.createElement('div');
    this.element.classList.add('fl-form-fabric');
    var options = createOptions();
    this.element.appendChild(options);
  };

  this.init(formBody);
}
