(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.FormBuilder = factory());
}(this, (function () { 'use strict';

var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

function addListenerOnce(eventName, el, f) {
  function triggerAndRemove(event) {
    f(event);
    el.removeEventListener(eventName, triggerAndRemove);
  }

  el.addEventListener(eventName, triggerAndRemove);
}

return addListenerOnce;

})));

//# sourceMappingURL=addListenerOnce.js.map
