var xDivTester = (function xDivTester() {
  'use strict';
  var controller;

  //Will capture all calls to xController
  window.xController = function xController(func) {
    if (controller) {
      throw new Error('xDivTester(): There is already x-div controller in place.' +
      ' Run xDivTester.reset() to unload current controller');
    }

    controller = func;
  };

  return {
    reset: function reset() {
      controller = null;
    },

    callWith: function callWith(el) {
      if (typeof el !== 'object' || !el.setAttribute) {
        throw new Error('xDivTester.callWith(): Element provided is not a valid HTMLElement');
      }

      if (!controller) {
        throw new Error('xDivTester.callWith(): No x-div controller initialised.');
      }

      controller.call(el, el);
    }
  };
}());
