define(['react'], function (React) { 'use strict';

var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

React = 'default' in React ? React['default'] : React;

//
//
//    THIS IS THE PRECOMPILED VERSION ON THIS FILE
//
//    LOOK INTO DIST FOLDER FOR COMPILED VERSION TE BE
//
//    INCLUDED IN THE BROWSER
//

var typeInfo = {
  // Compulsory
  primitiveType: 'Dropdown',
  type: 'ImageCards',
  displayName: 'Image Cards',
  group: 'Custom Components',
  required: false,

  // Component specific fields
  title: 'My image component',
  images: ['http://ingridwu.dmmdmcfatter.com/wp-content/uploads/2015/01/placeholder.png'],

  newImageText: ''
};

// For Text Fields the initialState function will only return an object.
var initialState = function initialState() {
  return Object.assign({}, typeInfo);
};

// When configuration is open, this is what is going to be displayed
/**
 * @method RenderConfigMode
 * @param  {Object} state : State
 * @param  {Function} update : State -> void // Will trigger a re-render
 */
var RenderEditor = function RenderEditor(_ref) {
  var state = _ref.state;
  var update = _ref.update;

  var updateNewImageText = function updateNewImageText(event) {
    var text = event.target.value;
    var newState = Object.assign({}, state, { newImageText: text });

    update(newState);
  };

  var addNewImage = function addNewImage(event) {
    if (event.key !== 'Enter') {
      return;
    }
    var text = event.target.value;
    var newState = Object.assign({}, state, { newImageText: '',
      images: state.images.concat([text])
    });

    update(newState);
  };

  return React.createElement(
    'div',
    null,
    state.images.map(function (img) {
      return React.createElement('img', { alt: img, className: 'ImageCards-card', src: img });
    }),
    !state.configShowing ? null : React.createElement(
      'div',
      { className: 'fl-fb-Field-config' },
      React.createElement('input', {
        type: 'text',
        value: state.newImageText,
        onChange: updateNewImageText,
        onKeyDown: addNewImage
      })
    )
  );
};

var ImageCards = {
  info: typeInfo,
  initialState: initialState,
  RenderEditor: RenderEditor
};

return ImageCards;

});

//# sourceMappingURL=ImageCards.js.map
