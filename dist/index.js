define(['react', 'react-dom'], function (React, ReactDOM) { 'use strict';

React = 'default' in React ? React['default'] : React;
ReactDOM = 'default' in ReactDOM ? ReactDOM['default'] : ReactDOM;

// Bug checking function that will throw an error whenever
// the condition sent to it is evaluated to false
/**
 * Processes the message and outputs the correct message if the condition
 * is false. Otherwise it outputs null.
 * @api private
 * @method processCondition
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return {String | null}  - Error message if there is an error, nul otherwise.
 */
function processCondition(condition, errorMessage) {
  if (!condition) {
    var completeErrorMessage = '';
    var re = /at ([^\s]+)\s\(/g;
    var stackTrace = new Error().stack;
    var stackFunctions = [];

    var funcName = re.exec(stackTrace);
    while (funcName && funcName[1]) {
      stackFunctions.push(funcName[1]);
      funcName = re.exec(stackTrace);
    }

    // Number 0 is processCondition itself,
    // Number 1 is assert,
    // Number 2 is the caller function.
    if (stackFunctions[2]) {
      completeErrorMessage = stackFunctions[2] + ': ' + completeErrorMessage;
    }

    completeErrorMessage += errorMessage;
    return completeErrorMessage;
  }

  return null;
}

/**
 * Throws an error if the boolean passed to it evaluates to false.
 * To be used like this:
 * 		assert(myDate !== undefined, "Date cannot be undefined.");
 * @api public
 * @method assert
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return void
 */
function assert(condition, errorMessage) {
  var error = processCondition(condition, errorMessage);
  if (typeof error === 'string') {
    throw new Error(error);
  }
}

/**
 * Logs a warning if the boolean passed to it evaluates to false.
 * To be used like this:
 * 		assert.warn(myDate !== undefined, "No date provided.");
 * @api public
 * @method warn
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return void
 */
assert.warn = function warn(condition, errorMessage) {
  var error = processCondition(condition, errorMessage);
  if (typeof error === 'string') {
    console.warn(error);
  }
};

//
//
//     Singleton
//
//

var listeners = {};

function on(eventName, func) {
  listeners[eventName] = listeners[eventName] ? listeners[eventName].concat([func]) : [func];
}

function trigger(eventName, data) {
  assert.warn(listeners[eventName], 'No one listening to "' + eventName + '."');
  listeners[eventName].forEach(function (f) {
    return f(data);
  });
}

var EventHub = {
  on: on,
  trigger: trigger
};

var FieldCreatorPropType = {
  info: React.PropTypes.shape({
    type: React.PropTypes.string,
    group: React.PropTypes.string,
    displayName: React.PropTypes.string
  }),
  initialState: React.PropTypes.func,
  RenderConfigMode: React.PropTypes.func,
  RenderFormMode: React.PropTypes.func
};

var ButtonDropdownOption = function ButtonDropdownOption(_ref) {
  var description = _ref.description;
  return React.createElement(
    'li',
    null,
    React.createElement(
      'a',
      {
        href: '#',
        onClick: function onClick() {
          return EventHub.trigger('createField', description.type);
        }
      },
      description.displayName
    )
  );
};

ButtonDropdownOption.propTypes = {
  description: React.PropTypes.shape({
    type: React.PropTypes.string,
    displayName: React.PropTypes.string,
    group: React.PropTypes.string
  })
};

var ButtonGroupDropdown = function ButtonGroupDropdown(_ref2) {
  var groupName = _ref2.groupName;
  var groupButtons = _ref2.groupButtons;

  return React.createElement(
    'div',
    { className: 'fb-ControlBar-dropdown dropdown' },
    React.createElement(
      'button',
      { className: 'btn btn-default dropdown-toggle', 'data-toggle': 'dropdown' },
      groupName,
      React.createElement('span', { className: 'caret' })
    ),
    React.createElement(
      'ul',
      { className: 'dropdown-menu' },
      groupButtons.map(function (fieldDescription) {
        return React.createElement(ButtonDropdownOption, { description: fieldDescription });
      })
    )
  );
};
ButtonGroupDropdown.propTypes = {
  groupName: React.PropTypes.string,
  groupButtons: React.PropTypes.array
};

var getDescrition = function getDescrition(typeConstructor) {
  return {
    type: typeConstructor.info.type,
    displayName: typeConstructor.info.displayName,
    group: typeConstructor.info.group
  };
};

var toGroups = function toGroups(groups, description) {
  // Add to group array if it exists. Create it if it doesn't
  groups[description.group] = groups[description.group] // eslint-disable-line no-param-reassign
  ? groups[description.group].concat([description]) : [description];

  return groups;
};

var ControlBar = function ControlBar(_ref3) {
  var fieldTypes = _ref3.fieldTypes;

  var fieldGroups = fieldTypes.map(getDescrition).reduce(toGroups, {});

  var buttonGroups = Object.keys(fieldGroups).map(function (groupName) {
    return React.createElement(ButtonGroupDropdown, {
      groupName: groupName,
      groupButtons: fieldGroups[groupName]
    });
  });

  return React.createElement(
    'div',
    { className: 'fb-ControlBar' },
    buttonGroups,
    React.createElement(
      'button',
      { className: 'btn btn-primary' },
      ' Undo '
    )
  );
};

ControlBar.propTypes = {
  fieldTypes: React.PropTypes.arrayOf(FieldCreatorPropType)
};

var isValidFieldState = function isValidFieldState(state) {
  return typeof state.id === 'number' && typeof state.type === 'string' && typeof state.group === 'string';
};

var Field = function Field(_ref) {
  var fieldState = _ref.fieldState;
  var fieldConstructor = _ref.fieldConstructor;

  assert(isValidFieldState(fieldState), 'Invalid field state: ' + fieldState);

  return React.createElement(
    'div',
    { className: 'fb-Field' },
    React.createElement(
      'div',
      { className: 'fb-Field-main' },
      JSON.stringify(fieldState)
    ),
    React.createElement(
      'div',
      { className: 'fb-Field-config' },
      JSON.stringify(fieldConstructor)
    )
  );
};

Field.propTypes = {
  fieldState: React.PropTypes.object,
  fieldConstructor: React.PropTypes.object
};

var Fields = function Fields(props) {
  var fieldStates = props.fieldStates;
  var fieldTypes = props.fieldTypes;


  return React.createElement(
    'div',
    null,
    fieldStates.forEach(function (compState) {
      return React.createElement(Field, {
        fieldState: compState,
        fieldConstructor: fieldTypes[compState.type]
      });
    })
  );
};

Fields.propTypes = {
  fieldStates: React.PropTypes.array,
  fieldTypes: React.PropTypes.array
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var FormBuilder$2 = function (_React$Component) {
  inherits(FormBuilder, _React$Component);

  function FormBuilder(props) {
    classCallCheck(this, FormBuilder);

    var _this = possibleConstructorReturn(this, (FormBuilder.__proto__ || Object.getPrototypeOf(FormBuilder)).call(this, props));

    _this.state = {
      fieldTypes: props.fieldTypes, // TODO: Add validation here
      fieldStates: []
    };

    _this.createField = _this.createField.bind(_this);
    _this.deleteField = _this.deleteField.bind(_this);
    _this.addFieldType = _this.addFieldType.bind(_this);

    EventHub.on('createField', _this.createField);
    EventHub.on('deleteField', _this.deleteField);
    return _this;
  }

  createClass(FormBuilder, [{
    key: 'createField',
    value: function createField(fieldType) {
      var typeConstructor = this.state.fieldTypes.find(function (f) {
        return f.info.type === fieldType;
      });

      assert(typeConstructor, 'Field "' + fieldType + '" does not exist.');

      var initialState = typeConstructor.initialState();
      initialState.id = Date.now();

      var fieldStates = this.state.fieldStates.concat([initialState]);
      this.setState({ fieldStates: fieldStates });
    }
  }, {
    key: 'deleteField',
    value: function deleteField(fieldState) {
      var fieldStates = this.state.fieldStates.filter(function (state) {
        return state.id !== fieldState.id;
      });

      assert(fieldStates.length < this.state.fieldStates, 'Something weird happened. The field didn\'t seem to be part of the existing states');
      this.setState({ fieldStates: fieldStates });
    }
  }, {
    key: 'addFieldType',
    value: function addFieldType(newType) {
      assert(!this.state.fieldTypes.find(function (f) {
        return f.info.type === newType.info.type;
      }), 'The field type ' + newType.info.type + ' already exists');

      var fieldTypes = this.state.fieldTypes.concat([newType]);

      this.setState({ fieldTypes: fieldTypes });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state;
      var fieldTypes = _state.fieldTypes;
      var fieldStates = _state.fieldStates;


      return React.createElement(
        'div',
        { className: 'fl-FormBuilder' },
        React.createElement(ControlBar, { fieldTypes: fieldTypes }),
        React.createElement(Fields, { fieldStates: fieldStates, fieldTypes: fieldTypes })
      );
    }
  }]);
  return FormBuilder;
}(React.Component);

FormBuilder$2.propTypes = {
  fieldTypes: React.PropTypes.arrayOf(FieldCreatorPropType)
};

var typeInfo = {
  type: 'TextField',
  group: 'Text Components',
  displayName: 'Text field'
};

var initialState = function initialState() {
  var componentFields = {
    // Compulsory fields
    required: false,
    // Component specific fields
    title: 'Add a title',
    placeholder: 'Add a placeholder'
  };

  return Object.assign({}, typeInfo, componentFields);
};

// When configuration is open, this is what is going to be displayed
/**
 * @method RenderConfigMode
 * @param  {Object} state : State
 * @param  {Function} update : State -> void // Will trigger a re-render
 */
var RenderConfigMode = function RenderConfigMode(_ref) {
  var state = _ref.state;
  var update = _ref.update;

  return React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      null,
      ' Config Mode '
    ),
    React.createElement(
      'label',
      null,
      'Type a placeholder',
      React.createElement('input', { type: 'text' })
    )
  );
};

var RenderFormMode = function RenderFormMode(_ref2) {
  var state = _ref2.state;
  var update = _ref2.update;

  return React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      null,
      ' My Title '
    ),
    React.createElement('input', { type: 'text' })
  );
};

var TextBox = {
  info: typeInfo,
  initialState: initialState,
  RenderConfigMode: RenderConfigMode,
  RenderFormMode: RenderFormMode
};

/* globals xController */
//
// Field Types
function FormBuilder(container) {
  var components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  assert(container && container.nodeName, 'Invalid contianer: ' + container + '. Container must be an HTML element.');

  var defaultTypes = [TextBox];

  var customFieldTypes = components.concat(defaultTypes);

  ReactDOM.render(React.createElement(FormBuilder$2, { fieldTypes: customFieldTypes }), container);

  this.exportState = function () {
    throw new Error('Not working');
  };
}

return FormBuilder;

});

//# sourceMappingURL=index.js.map
