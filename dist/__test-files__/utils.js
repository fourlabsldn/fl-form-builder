(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.FormBuilder = global.FormBuilder || {})));
}(this, (function (exports) { 'use strict';

var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

// Creates a new object with properties of the old one
// ovewritten by properties of the new object.
// No new properties of the new Object are added.
// overshadow Object -> Object -> Object
function overshadow(oldObj, newObj) {
  return Object.keys(oldObj).reduce(function (result, key) {
    // We want to use values from newObj even if the value is set to undefined,
    // but not use it if it is not set at all. That's why we use hasOwnProperty.
    result[key] = newObj.hasOwnProperty(key) ? newObj[key] : oldObj[key]; // eslint-disable-line no-param-reassign, max-len
    return result;
  }, {});
}

exports.overshadow = overshadow;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=utils.js.map
