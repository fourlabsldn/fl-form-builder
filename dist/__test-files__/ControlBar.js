(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global.FormBuilder = factory(global.React));
}(this, (function (React) { 'use strict';

React = 'default' in React ? React['default'] : React;

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

  if (!listeners[eventName]) {
    return;
  }

  listeners[eventName].forEach(function (f) {
    return f(data);
  });
}

var EventHub = {
  on: on,
  trigger: trigger
};

// This works as the interface for the FieldCreator Type
var FieldCreatorPropType = {
  info: React.PropTypes.shape({
    type: React.PropTypes.string,
    group: React.PropTypes.string,
    displayName: React.PropTypes.string
  }),
  initialState: React.PropTypes.func,
  RenderEditor: React.PropTypes.func };

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
    { className: 'btn-group' },
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
    { className: 'fl-fb-ControlBar' },
    React.createElement(
      'div',
      { className: 'btn-group' },
      buttonGroups
    ),
    React.createElement(
      'button',
      {
        className: 'btn btn-primary',
        onClick: function onClick() {
          return EventHub.trigger('undoBtnPressed');
        }
      },
      ' Undo '
    )
  );
};

ControlBar.propTypes = {
  fieldTypes: React.PropTypes.arrayOf(FieldCreatorPropType)
};

return ControlBar;

})));

//# sourceMappingURL=ControlBar.js.map
