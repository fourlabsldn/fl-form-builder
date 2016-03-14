// ===================================
//      WEB COMPONENT
// ===================================

(function () {
  'use strict';

  // Create our 'x-div' Web Component Prototype
  var xProto = Object.create(HTMLElement.prototype);

  //Create methods for its lifecycle
  xProto.attachedCallback = function () {

    var scriptEl = document.createElement('script');

    if (!this.dataset.controller) {
      console.error('No controller specified for x-div.');
      return;
    }

    scriptEl.src = this.dataset.controller + '.js';
    scriptEl.async = true;
    this.appendChild(scriptEl);
  };

  //Register the Element
  document.registerElement('x-div', {
    prototype: xProto,
  });
}());

// ===================================
//      Controller
// ===================================

// Calls a function and gives it an element to act on.
function xController(func) {
  'use strict';

  var execute = function () {
    func.call(document.currentScript.parentElement, document.currentScript.parentElement);
  };

  // For document.currentScript.parentElement to give us the right element
  // it must be called from within the function.
  execute.call(func);
}
