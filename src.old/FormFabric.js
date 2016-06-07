import RadioBtns from './components/RadioBtns';
import Checkboxes from './components/Checkboxes';
import TextBox from './components/TextBox';
import TextArea from './components/TextArea';
import Dropdown from './components/Dropdown';


/**
 * Singleton to create form components
 * @class FormFabric
 * @param {HTMLElement} el Where the fabric will be put.
 */
export default function FormFabric(formBody) {
  'use strict';

  if (!(this instanceof FormFabric)) {
    return new FormFabric();
  }

  const formComponents = [
    { desc: 'Radio buttons', constr: RadioBtns, class: 'glyphicon glyphicon-ok-circle' },
    { desc: 'Checkboxes', constr: Checkboxes, class: 'glyphicon glyphicon-check' },
    { desc: 'Dropdown', constr: Dropdown, class: 'glyphicon glyphicon-collapse-down' },
    { desc: 'Text box', constr: TextBox, class: 'glyphicon glyphicon-text-width' },
    { desc: 'Text area', constr: TextArea, class: 'glyphicon glyphicon-text-height' },
  ];

  function createElement(Constr, fBody) {
    const name = `Temp name ${Math.floor(Math.random() * 1000)}`;
    const comp = new Constr(name);
    const ev = new CustomEvent('addComponent',
      {
        detail: {	comp },
        bubbles: true,
        cancelable: true,
      });

    fBody.dispatchEvent(ev);
  }

  /**
   * @function createOptionsDropdown
   * @return {HTMLElement} The dropdown menu
   */
  function createOptions() {
    const frag = document.createDocumentFragment();
    formComponents.forEach((component, idx) => {
      const op = document.createElement('button');
      op.setAttribute('value', idx);
      op.className = component.class;
      op.name = component.desc;
      op.title = component.desc;
      op.classList.add('btn', 'btn-default');
      op.addEventListener('click', () => {
        const index = op.value;
        createElement(formComponents[index].constr, formBody);
      });

      frag.appendChild(op);
    });

    return frag;
  }

  this.init = function init() {
    this.element = document.createElement('div');
    this.element.classList.add('fl-form-fabric');
    const options = createOptions();
    this.element.appendChild(options);
  };

  this.init(formBody);
}
