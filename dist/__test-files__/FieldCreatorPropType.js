(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global.FormBuilder = factory(global.React));
}(this, (function (React) { 'use strict';

var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

React = 'default' in React ? React['default'] : React;

// This works as the interface for the FieldCreator Type
var FieldCreatorPropType = {
  info: React.PropTypes.shape({
    type: React.PropTypes.string,
    group: React.PropTypes.string,
    displayName: React.PropTypes.string
  }),
  initialState: React.PropTypes.func,
  RenderEditor: React.PropTypes.func };

return FieldCreatorPropType;

})));

//# sourceMappingURL=FieldCreatorPropType.js.map
