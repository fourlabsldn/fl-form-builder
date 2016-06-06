import utils from './utils/utils.js';

export default function FormBody() {
  'use strict';

  if (!(this instanceof FormBody)) {
    return new FormBody();
  }

  let form;
  let submitBtn;
  const components = [];

  function getAllComponents() {
    const comps = form.querySelectorAll('.fl-component');
    return [].slice.call(comps);
  }

  function addReorderButton(comp) {
    const controls = comp.element.querySelector('.fl-component-side-control');
    if (!controls) {
      throw new Error('FormBody.addReorderButton(): No side control bar defined');
    }

    const dragBtn = document.createElement('i');
    dragBtn.classList.add('glyphicon', 'glyphicon-menu-hamburger');
    dragBtn.setAttribute('draggable', true);
    dragBtn.title = 'Drag to reorder';

    dragBtn.addEventListener('dragstart', (e) => {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      comp.element.classList.add('fl-dragging');

      // Take care of moving and reordering
      const elements = getAllComponents();
      utils.trackReorderDrag(e, comp.element, elements);
    });

    const throttleDelay = 50;
    dragBtn.addEventListener('dragend', () => {
      setTimeout(() => {
        comp.element.classList.remove('fl-dragging');
      }, throttleDelay + 200);
    });

    // prepend to side control bar
    if (controls.children.length > 0) {
      controls.insertBefore(dragBtn, controls.children[0]);
    } else {
      controls.appendChild(dragBtn);
    }
  }

  this.addComponent = function addComponent(comp) {
    if (!form) {
      console.error('FormBody: Form not initialised.');
      return;
    } else if (!comp) {
      console.error('FormBody: No element to be added included.');
      return;
    }
    addReorderButton(comp);
    components.push(comp);
    form.insertBefore(comp.element, submitBtn);
    comp.configToggle(true);
  };

  this.removeComponent = function removeComponent(comp) {
    const compIndex = components.indexOf(comp);
    if (compIndex < 0) {
      throw new Error('FormBody.removeComponent(): ' +
          'Component being destroyed is not registered in FormBody.');
    }

    components.splice(compIndex, 1);
    comp.destroy();
  };

  this.init = () => {
    form = document.createElement('form');
    form.classList.add('form-horizontal', 'fl-form-body');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Submit button clicked.');

      // Reorder components array according to their vertical position
      components.sort((com1, com2) => {
        return com1.element.getBoundingClientRect().top >
               com2.element.getBoundingClientRect().top;
      });

      //  NOTE: Components are prepared to expose the appropriate values
      //  when stringified. To export them they need to be stringified.
      const readyToExport = JSON.stringify(components);
      console.dir(JSON.parse(readyToExport));

      // For now let's emmit an event with the result.
      const ev = new CustomEvent('formSubmitted',
        { detail: {	json: readyToExport },
          bubbles: true,
          cancelable: true,
        });

      this.dispatchEvent(ev);
    });


    // Listen to new components being created
    form.addEventListener('addComponent', (e) => {
      if (!e.detail) {
        throw new Error('No data in "newElement" event.');
      }

      this.addComponent(e.detail.comp);
    });

    // Listen to delete buttons being pressed
    form.addEventListener('removeComponent', (e) => {
      if (!e.detail) {
        throw new Error('No data in "removeElement" event.');
      }

      this.removeComponent(e.detail.comp);
    });

    submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.classList.add('btn', 'col-sm-12');
    form.appendChild(submitBtn);
    this.element = form;
  };

  this.init();
}
