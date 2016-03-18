/*globals utils*/

function FormBody() {
  if (!(this instanceof FormBody)) {
    return new FormBody();
  }

  var form;
  var submitBtn;
  var components = [];

  function getAllComponents() {
    var comps = form.querySelectorAll('.fl-component');
    return [].slice.call(comps);
  }

  function addReorderButton(comp) {
    var controls = comp.element.querySelector('.fl-component-side-control');
    if (!controls) {
      throw new Error('FormBody.addReorderButton(): No side control bar defined');
    }

    var dragBtn = document.createElement('i');
    dragBtn.classList.add('glyphicon');
    dragBtn.classList.add('glyphicon-menu-hamburger');
    dragBtn.setAttribute('draggable', true);

    dragBtn.addEventListener('dragstart', function (e) {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      comp.element.classList.add('fl-dragging');

      //Take care of moving and reordering
      var elements = getAllComponents();
      utils.trackReorderDrag(e, comp.element, elements);
    });

    var throttleDelay = 50;
    dragBtn.addEventListener('dragend', function (e) {
      setTimeout(function () {
        comp.element.classList.remove('fl-dragging');
      }, throttleDelay + 200);
    });

    //prepend to side control bar
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
    } else {
      addReorderButton(comp);
      components.push(comp);
      form.insertBefore(comp.element, submitBtn);
      comp.configToggle(true);
    }
  };

  this.init = function () {
    form = document.createElement('form');
    form.classList.add('form-horizontal');
    form.classList.add('fl-form-body');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Submit button clicked.');

      //Reorder components array according to their vertical position
      components.sort(function (com1, com2) {
        return com1.element.getBoundingClientRect().top >
               com2.element.getBoundingClientRect().top;
      });

      var string = JSON.stringify(components);
      var ob = JSON.parse(string);
      console.dir(ob);
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
