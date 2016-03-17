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

  function getTopOfAllComponents() {
    var tops = [];
    var comps = getAllComponents();
    comps.forEach(function (comp) {
      var top = comp.getBoundingClientRect().top;
      tops.push(top);
    });

    return tops;
  }

  function resetElementsTranslation() {
    var comps = getAllComponents();
    comps.forEach(function (comp) {
      comp.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  function rearrangeForDrag(tops, els, mainEl, mainElInitialTop) {
    var mainBottom = mainEl.getBoundingClientRect().bottom;
    var mainTop = mainEl.getBoundingClientRect().top;
    var mainSize = mainEl.clientHeight;

    var movedUp = (mainTop < mainElInitialTop);

    var i;
    if (movedUp) {
      i = 0;
      while (tops[i]) {
        if (mainTop < tops[i + 1] && tops[i] < mainElInitialTop) {
          els[i].style.transform = 'translate3d(0, ' + mainSize + 'px, 0)';
        } else {
          els[i].style.transform = 'translate3d(0, 0, 0)';
        }

        i++;
      }
    } else { //moving down
      i = 0;
      while (tops[i]) {
        if (mainTop > tops[i] && tops[i] > mainElInitialTop) {
          els[i].style.transform = 'translate3d(0, -' + mainSize + 'px, 0)';
        } else {
          els[i].style.transform = 'translate3d(0, 0, 0)';
        }

        i++;
      }
    }
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

    comp.dragvars = {};
    dragBtn.addEventListener('dragstart', function (e) {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      comp.element.classList.add('fl-dragging');
      comp.element.dataset.yStart = e.pageY;

      comp.dragvars.initialTop = comp.element.getBoundingClientRect().top;
      comp.dragvars.elements = getAllComponents();
      comp.dragvars.tops = getTopOfAllComponents();
    });

    var throttleDelay = 50;
    dragBtn.addEventListener('dragend', function (e) {
      setTimeout(function () {
        // var topStart = comp.element.getBoundingClientRect().top;
        // form.appendChild(comp.element);
        // var topAfterMoving = comp.element.getBoundingClientRect().top;
        // var diff = topAfterMoving - topStart;

        resetElementsTranslation();
        comp.element.style.transform = 'translate3d(0, 0, 0)';
        comp.element.dataset.yStart = e.pageY;
        comp.dragvars.initialTop = null;
      }, throttleDelay);

      setTimeout(function () {
        comp.element.classList.remove('fl-dragging');
      }, throttleDelay + 200);
    });

    dragBtn.addEventListener('drag', utils.throttle(throttleDelay, function dragging(e) {
      console.log('dragging');

      rearrangeForDrag(
        comp.dragvars.tops,
        comp.dragvars.elements,
        comp.element,
        comp.dragvars.initialTop);

      var yStart = comp.element.dataset.yStart;
      var currY = e.pageY;
      if (currY === 0) { return; } //correct weird behaviour when mouse goes up

      var diff = currY - yStart;
      comp.element.style.transform = 'translate3d(0, ' + diff + 'px, 0)';
    }));

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
