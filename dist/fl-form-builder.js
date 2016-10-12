define(['react', 'react-dom'], function (React, ReactDOM) { 'use strict';

var __commonjs_global = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports, __commonjs_global), module.exports; }

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
  RenderConfigMode: React.PropTypes.func, // React render function
  RenderFormMode: React.PropTypes.func };

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

var isObjectLike = __commonjs(function (module) {
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;
});

var require$$1 = (isObjectLike && typeof isObjectLike === 'object' && 'default' in isObjectLike ? isObjectLike['default'] : isObjectLike);

var isSymbol = __commonjs(function (module) {
var isObjectLike = require$$1;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;
});

var require$$0$4 = (isSymbol && typeof isSymbol === 'object' && 'default' in isSymbol ? isSymbol['default'] : isSymbol);

var isObject = __commonjs(function (module) {
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;
});

var require$$0$5 = (isObject && typeof isObject === 'object' && 'default' in isObject ? isObject['default'] : isObject);

var toNumber = __commonjs(function (module) {
var isObject = require$$0$5,
    isSymbol = require$$0$4;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;
});

var require$$0$3 = (toNumber && typeof toNumber === 'object' && 'default' in toNumber ? toNumber['default'] : toNumber);

var toFinite = __commonjs(function (module) {
var toNumber = require$$0$3;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;
});

var require$$0$2 = (toFinite && typeof toFinite === 'object' && 'default' in toFinite ? toFinite['default'] : toFinite);

var toInteger = __commonjs(function (module) {
var toFinite = require$$0$2;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;
});

var require$$0$1 = (toInteger && typeof toInteger === 'object' && 'default' in toInteger ? toInteger['default'] : toInteger);

var _strictIndexOf = __commonjs(function (module) {
/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;
});

var require$$0$10 = (_strictIndexOf && typeof _strictIndexOf === 'object' && 'default' in _strictIndexOf ? _strictIndexOf['default'] : _strictIndexOf);

var _baseIsNaN = __commonjs(function (module) {
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;
});

var require$$1$1 = (_baseIsNaN && typeof _baseIsNaN === 'object' && 'default' in _baseIsNaN ? _baseIsNaN['default'] : _baseIsNaN);

var _baseFindIndex = __commonjs(function (module) {
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;
});

var require$$2 = (_baseFindIndex && typeof _baseFindIndex === 'object' && 'default' in _baseFindIndex ? _baseFindIndex['default'] : _baseFindIndex);

var _baseIndexOf = __commonjs(function (module) {
var baseFindIndex = require$$2,
    baseIsNaN = require$$1$1,
    strictIndexOf = require$$0$10;

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;
});

var require$$0$9 = (_baseIndexOf && typeof _baseIndexOf === 'object' && 'default' in _baseIndexOf ? _baseIndexOf['default'] : _baseIndexOf);

var _arrayIncludes = __commonjs(function (module) {
var baseIndexOf = require$$0$9;

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;
});

var require$$0$8 = (_arrayIncludes && typeof _arrayIncludes === 'object' && 'default' in _arrayIncludes ? _arrayIncludes['default'] : _arrayIncludes);

var _arrayEach = __commonjs(function (module) {
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;
});

var require$$1$2 = (_arrayEach && typeof _arrayEach === 'object' && 'default' in _arrayEach ? _arrayEach['default'] : _arrayEach);

var _updateWrapDetails = __commonjs(function (module) {
var arrayEach = require$$1$2,
    arrayIncludes = require$$0$8;

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64,
    ARY_FLAG = 128,
    REARG_FLAG = 256,
    FLIP_FLAG = 512;

/** Used to associate wrap methods with their bit flags. */
var wrapFlags = [
  ['ary', ARY_FLAG],
  ['bind', BIND_FLAG],
  ['bindKey', BIND_KEY_FLAG],
  ['curry', CURRY_FLAG],
  ['curryRight', CURRY_RIGHT_FLAG],
  ['flip', FLIP_FLAG],
  ['partial', PARTIAL_FLAG],
  ['partialRight', PARTIAL_RIGHT_FLAG],
  ['rearg', REARG_FLAG]
];

/**
 * Updates wrapper `details` based on `bitmask` flags.
 *
 * @private
 * @returns {Array} details The details to modify.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Array} Returns `details`.
 */
function updateWrapDetails(details, bitmask) {
  arrayEach(wrapFlags, function(pair) {
    var value = '_.' + pair[0];
    if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}

module.exports = updateWrapDetails;
});

var require$$0$7 = (_updateWrapDetails && typeof _updateWrapDetails === 'object' && 'default' in _updateWrapDetails ? _updateWrapDetails['default'] : _updateWrapDetails);

var _shortOut = __commonjs(function (module) {
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 500,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;
});

var require$$0$11 = (_shortOut && typeof _shortOut === 'object' && 'default' in _shortOut ? _shortOut['default'] : _shortOut);

var identity = __commonjs(function (module) {
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;
});

var require$$1$5 = (identity && typeof identity === 'object' && 'default' in identity ? identity['default'] : identity);

var _getValue = __commonjs(function (module) {
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;
});

var require$$0$12 = (_getValue && typeof _getValue === 'object' && 'default' in _getValue ? _getValue['default'] : _getValue);

var _toSource = __commonjs(function (module) {
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;
});

var require$$0$13 = (_toSource && typeof _toSource === 'object' && 'default' in _toSource ? _toSource['default'] : _toSource);

var _freeGlobal = __commonjs(function (module, exports, global) {
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;
});

var require$$0$16 = (_freeGlobal && typeof _freeGlobal === 'object' && 'default' in _freeGlobal ? _freeGlobal['default'] : _freeGlobal);

var _root = __commonjs(function (module) {
var freeGlobal = require$$0$16;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;
});

var require$$0$15 = (_root && typeof _root === 'object' && 'default' in _root ? _root['default'] : _root);

var _coreJsData = __commonjs(function (module) {
var root = require$$0$15;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;
});

var require$$0$14 = (_coreJsData && typeof _coreJsData === 'object' && 'default' in _coreJsData ? _coreJsData['default'] : _coreJsData);

var _isMasked = __commonjs(function (module) {
var coreJsData = require$$0$14;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;
});

var require$$2$1 = (_isMasked && typeof _isMasked === 'object' && 'default' in _isMasked ? _isMasked['default'] : _isMasked);

var isFunction = __commonjs(function (module) {
var isObject = require$$0$5;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag || tag == proxyTag;
}

module.exports = isFunction;
});

var require$$3 = (isFunction && typeof isFunction === 'object' && 'default' in isFunction ? isFunction['default'] : isFunction);

var _baseIsNative = __commonjs(function (module) {
var isFunction = require$$3,
    isMasked = require$$2$1,
    isObject = require$$0$5,
    toSource = require$$0$13;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;
});

var require$$1$8 = (_baseIsNative && typeof _baseIsNative === 'object' && 'default' in _baseIsNative ? _baseIsNative['default'] : _baseIsNative);

var _getNative = __commonjs(function (module) {
var baseIsNative = require$$1$8,
    getValue = require$$0$12;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;
});

var require$$1$7 = (_getNative && typeof _getNative === 'object' && 'default' in _getNative ? _getNative['default'] : _getNative);

var _defineProperty = __commonjs(function (module) {
var getNative = require$$1$7;

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;
});

var require$$1$6 = (_defineProperty && typeof _defineProperty === 'object' && 'default' in _defineProperty ? _defineProperty['default'] : _defineProperty);

var constant = __commonjs(function (module) {
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;
});

var require$$2$2 = (constant && typeof constant === 'object' && 'default' in constant ? constant['default'] : constant);

var _baseSetToString = __commonjs(function (module) {
var constant = require$$2$2,
    defineProperty = require$$1$6,
    identity = require$$1$5;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;
});

var require$$1$4 = (_baseSetToString && typeof _baseSetToString === 'object' && 'default' in _baseSetToString ? _baseSetToString['default'] : _baseSetToString);

var _setToString = __commonjs(function (module) {
var baseSetToString = require$$1$4,
    shortOut = require$$0$11;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;
});

var require$$1$3 = (_setToString && typeof _setToString === 'object' && 'default' in _setToString ? _setToString['default'] : _setToString);

var _insertWrapDetails = __commonjs(function (module) {
/** Used to match wrap detail comments. */
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;

/**
 * Inserts wrapper `details` in a comment at the top of the `source` body.
 *
 * @private
 * @param {string} source The source to modify.
 * @returns {Array} details The details to insert.
 * @returns {string} Returns the modified source.
 */
function insertWrapDetails(source, details) {
  var length = details.length;
  if (!length) {
    return source;
  }
  var lastIndex = length - 1;
  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
  details = details.join(length > 2 ? ', ' : ' ');
  return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
}

module.exports = insertWrapDetails;
});

var require$$2$3 = (_insertWrapDetails && typeof _insertWrapDetails === 'object' && 'default' in _insertWrapDetails ? _insertWrapDetails['default'] : _insertWrapDetails);

var _getWrapDetails = __commonjs(function (module) {
/** Used to match wrap detail comments. */
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;

/**
 * Extracts wrapper details from the `source` body comment.
 *
 * @private
 * @param {string} source The source to inspect.
 * @returns {Array} Returns the wrapper details.
 */
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}

module.exports = getWrapDetails;
});

var require$$3$1 = (_getWrapDetails && typeof _getWrapDetails === 'object' && 'default' in _getWrapDetails ? _getWrapDetails['default'] : _getWrapDetails);

var _setWrapToString = __commonjs(function (module) {
var getWrapDetails = require$$3$1,
    insertWrapDetails = require$$2$3,
    setToString = require$$1$3,
    updateWrapDetails = require$$0$7;

/**
 * Sets the `toString` method of `wrapper` to mimic the source of `reference`
 * with wrapper details in a comment at the top of the source body.
 *
 * @private
 * @param {Function} wrapper The function to modify.
 * @param {Function} reference The reference function.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @returns {Function} Returns `wrapper`.
 */
function setWrapToString(wrapper, reference, bitmask) {
  var source = (reference + '');
  return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
}

module.exports = setWrapToString;
});

var require$$0$6 = (_setWrapToString && typeof _setWrapToString === 'object' && 'default' in _setWrapToString ? _setWrapToString['default'] : _setWrapToString);

var _WeakMap = __commonjs(function (module) {
var getNative = require$$1$7,
    root = require$$0$15;

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;
});

var require$$0$17 = (_WeakMap && typeof _WeakMap === 'object' && 'default' in _WeakMap ? _WeakMap['default'] : _WeakMap);

var _metaMap = __commonjs(function (module) {
var WeakMap = require$$0$17;

/** Used to store function metadata. */
var metaMap = WeakMap && new WeakMap;

module.exports = metaMap;
});

var require$$1$11 = (_metaMap && typeof _metaMap === 'object' && 'default' in _metaMap ? _metaMap['default'] : _metaMap);

var _baseSetData = __commonjs(function (module) {
var identity = require$$1$5,
    metaMap = require$$1$11;

/**
 * The base implementation of `setData` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var baseSetData = !metaMap ? identity : function(func, data) {
  metaMap.set(func, data);
  return func;
};

module.exports = baseSetData;
});

var require$$1$10 = (_baseSetData && typeof _baseSetData === 'object' && 'default' in _baseSetData ? _baseSetData['default'] : _baseSetData);

var _setData = __commonjs(function (module) {
var baseSetData = require$$1$10,
    shortOut = require$$0$11;

/**
 * Sets metadata for `func`.
 *
 * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
 * period of time, it will trip its breaker and transition to an identity
 * function to avoid garbage collection pauses in V8. See
 * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
 * for more details.
 *
 * @private
 * @param {Function} func The function to associate metadata with.
 * @param {*} data The metadata.
 * @returns {Function} Returns `func`.
 */
var setData = shortOut(baseSetData);

module.exports = setData;
});

var require$$1$9 = (_setData && typeof _setData === 'object' && 'default' in _setData ? _setData['default'] : _setData);

var _replaceHolders = __commonjs(function (module) {
/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/**
 * Replaces all `placeholder` elements in `array` with an internal placeholder
 * and returns an array of their indexes.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {*} placeholder The placeholder to replace.
 * @returns {Array} Returns the new array of placeholder indexes.
 */
function replaceHolders(array, placeholder) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value === placeholder || value === PLACEHOLDER) {
      array[index] = PLACEHOLDER;
      result[resIndex++] = index;
    }
  }
  return result;
}

module.exports = replaceHolders;
});

var require$$1$12 = (_replaceHolders && typeof _replaceHolders === 'object' && 'default' in _replaceHolders ? _replaceHolders['default'] : _replaceHolders);

var _composeArgsRight = __commonjs(function (module) {
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This function is like `composeArgs` except that the arguments composition
 * is tailored for `_.partialRight`.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to append to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersIndex = -1,
      holdersLength = holders.length,
      rightIndex = -1,
      rightLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(rangeLength + rightLength),
      isUncurried = !isCurried;

  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }
  var offset = argsIndex;
  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }
  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }
  return result;
}

module.exports = composeArgsRight;
});

var require$$7 = (_composeArgsRight && typeof _composeArgsRight === 'object' && 'default' in _composeArgsRight ? _composeArgsRight['default'] : _composeArgsRight);

var _composeArgs = __commonjs(function (module) {
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array that is the composition of partially applied arguments,
 * placeholders, and provided arguments into a single array of arguments.
 *
 * @private
 * @param {Array} args The provided arguments.
 * @param {Array} partials The arguments to prepend to those provided.
 * @param {Array} holders The `partials` placeholder indexes.
 * @params {boolean} [isCurried] Specify composing for a curried function.
 * @returns {Array} Returns the new array of composed arguments.
 */
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersLength = holders.length,
      leftIndex = -1,
      leftLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(leftLength + rangeLength),
      isUncurried = !isCurried;

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }
  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }
  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }
  return result;
}

module.exports = composeArgs;
});

var require$$8 = (_composeArgs && typeof _composeArgs === 'object' && 'default' in _composeArgs ? _composeArgs['default'] : _composeArgs);

var _mergeData = __commonjs(function (module) {
var composeArgs = require$$8,
    composeArgsRight = require$$7,
    replaceHolders = require$$1$12;

/** Used as the internal argument placeholder. */
var PLACEHOLDER = '__lodash_placeholder__';

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    ARY_FLAG = 128,
    REARG_FLAG = 256;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Merges the function metadata of `source` into `data`.
 *
 * Merging metadata reduces the number of wrappers used to invoke a function.
 * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
 * may be applied regardless of execution order. Methods like `_.ary` and
 * `_.rearg` modify function arguments, making the order in which they are
 * executed important, preventing the merging of metadata. However, we make
 * an exception for a safe combined case where curried functions have `_.ary`
 * and or `_.rearg` applied.
 *
 * @private
 * @param {Array} data The destination metadata.
 * @param {Array} source The source metadata.
 * @returns {Array} Returns `data`.
 */
function mergeData(data, source) {
  var bitmask = data[1],
      srcBitmask = source[1],
      newBitmask = bitmask | srcBitmask,
      isCommon = newBitmask < (BIND_FLAG | BIND_KEY_FLAG | ARY_FLAG);

  var isCombo =
    ((srcBitmask == ARY_FLAG) && (bitmask == CURRY_FLAG)) ||
    ((srcBitmask == ARY_FLAG) && (bitmask == REARG_FLAG) && (data[7].length <= source[8])) ||
    ((srcBitmask == (ARY_FLAG | REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == CURRY_FLAG));

  // Exit early if metadata can't be merged.
  if (!(isCommon || isCombo)) {
    return data;
  }
  // Use source `thisArg` if available.
  if (srcBitmask & BIND_FLAG) {
    data[2] = source[2];
    // Set when currying a bound function.
    newBitmask |= bitmask & BIND_FLAG ? 0 : CURRY_BOUND_FLAG;
  }
  // Compose partial arguments.
  var value = source[3];
  if (value) {
    var partials = data[3];
    data[3] = partials ? composeArgs(partials, value, source[4]) : value;
    data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
  }
  // Compose partial right arguments.
  value = source[5];
  if (value) {
    partials = data[5];
    data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
    data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
  }
  // Use source `argPos` if available.
  value = source[7];
  if (value) {
    data[7] = value;
  }
  // Use source `ary` if it's smaller.
  if (srcBitmask & ARY_FLAG) {
    data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
  }
  // Use source `arity` if one is not provided.
  if (data[9] == null) {
    data[9] = source[9];
  }
  // Use source `func` and merge bitmasks.
  data[0] = source[0];
  data[1] = newBitmask;

  return data;
}

module.exports = mergeData;
});

var require$$3$2 = (_mergeData && typeof _mergeData === 'object' && 'default' in _mergeData ? _mergeData['default'] : _mergeData);

var noop = __commonjs(function (module) {
/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;
});

var require$$0$18 = (noop && typeof noop === 'object' && 'default' in noop ? noop['default'] : noop);

var _getData = __commonjs(function (module) {
var metaMap = require$$1$11,
    noop = require$$0$18;

/**
 * Gets metadata for `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {*} Returns the metadata for `func`.
 */
var getData = !metaMap ? noop : function(func) {
  return metaMap.get(func);
};

module.exports = getData;
});

var require$$2$4 = (_getData && typeof _getData === 'object' && 'default' in _getData ? _getData['default'] : _getData);

var _baseCreate = __commonjs(function (module) {
var isObject = require$$0$5;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;
});

var require$$1$14 = (_baseCreate && typeof _baseCreate === 'object' && 'default' in _baseCreate ? _baseCreate['default'] : _baseCreate);

var _createCtor = __commonjs(function (module) {
var baseCreate = require$$1$14,
    isObject = require$$0$5;

/**
 * Creates a function that produces an instance of `Ctor` regardless of
 * whether it was invoked as part of a `new` expression or by `call` or `apply`.
 *
 * @private
 * @param {Function} Ctor The constructor to wrap.
 * @returns {Function} Returns the new wrapped function.
 */
function createCtor(Ctor) {
  return function() {
    // Use a `switch` statement to work with class constructors. See
    // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
    // for more details.
    var args = arguments;
    switch (args.length) {
      case 0: return new Ctor;
      case 1: return new Ctor(args[0]);
      case 2: return new Ctor(args[0], args[1]);
      case 3: return new Ctor(args[0], args[1], args[2]);
      case 4: return new Ctor(args[0], args[1], args[2], args[3]);
      case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
      case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }
    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);

    // Mimic the constructor's `return` behavior.
    // See https://es5.github.io/#x13.2.2 for more details.
    return isObject(result) ? result : thisBinding;
  };
}

module.exports = createCtor;
});

var require$$1$13 = (_createCtor && typeof _createCtor === 'object' && 'default' in _createCtor ? _createCtor['default'] : _createCtor);

var _apply = __commonjs(function (module) {
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;
});

var require$$6 = (_apply && typeof _apply === 'object' && 'default' in _apply ? _apply['default'] : _apply);

var _createPartial = __commonjs(function (module) {
var apply = require$$6,
    createCtor = require$$1$13,
    root = require$$0$15;

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the `this` binding
 * of `thisArg` and `partials` prepended to the arguments it receives.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} partials The arguments to prepend to those provided to
 *  the new function.
 * @returns {Function} Returns the new wrapped function.
 */
function createPartial(func, bitmask, thisArg, partials) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtor(func);

  function wrapper() {
    var argsIndex = -1,
        argsLength = arguments.length,
        leftIndex = -1,
        leftLength = partials.length,
        args = Array(leftLength + argsLength),
        fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

    while (++leftIndex < leftLength) {
      args[leftIndex] = partials[leftIndex];
    }
    while (argsLength--) {
      args[leftIndex++] = arguments[++argsIndex];
    }
    return apply(fn, isBind ? thisArg : this, args);
  }
  return wrapper;
}

module.exports = createPartial;
});

var require$$5 = (_createPartial && typeof _createPartial === 'object' && 'default' in _createPartial ? _createPartial['default'] : _createPartial);

var _isIndex = __commonjs(function (module) {
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;
});

var require$$0$19 = (_isIndex && typeof _isIndex === 'object' && 'default' in _isIndex ? _isIndex['default'] : _isIndex);

var _copyArray = __commonjs(function (module) {
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;
});

var require$$0$20 = (_copyArray && typeof _copyArray === 'object' && 'default' in _copyArray ? _copyArray['default'] : _copyArray);

var _reorder = __commonjs(function (module) {
var copyArray = require$$0$20,
    isIndex = require$$0$19;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * Reorder `array` according to the specified indexes where the element at
 * the first index is assigned as the first element, the element at
 * the second index is assigned as the second element, and so on.
 *
 * @private
 * @param {Array} array The array to reorder.
 * @param {Array} indexes The arranged array indexes.
 * @returns {Array} Returns `array`.
 */
function reorder(array, indexes) {
  var arrLength = array.length,
      length = nativeMin(indexes.length, arrLength),
      oldArray = copyArray(array);

  while (length--) {
    var index = indexes[length];
    array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
  }
  return array;
}

module.exports = reorder;
});

var require$$2$5 = (_reorder && typeof _reorder === 'object' && 'default' in _reorder ? _reorder['default'] : _reorder);

var _getHolder = __commonjs(function (module) {
/**
 * Gets the argument placeholder value for `func`.
 *
 * @private
 * @param {Function} func The function to inspect.
 * @returns {*} Returns the placeholder value.
 */
function getHolder(func) {
  var object = func;
  return object.placeholder;
}

module.exports = getHolder;
});

var require$$2$6 = (_getHolder && typeof _getHolder === 'object' && 'default' in _getHolder ? _getHolder['default'] : _getHolder);

var _baseLodash = __commonjs(function (module) {
/**
 * The function whose prototype chain sequence wrappers inherit from.
 *
 * @private
 */
function baseLodash() {
  // No operation performed.
}

module.exports = baseLodash;
});

var require$$0$23 = (_baseLodash && typeof _baseLodash === 'object' && 'default' in _baseLodash ? _baseLodash['default'] : _baseLodash);

var _LodashWrapper = __commonjs(function (module) {
var baseCreate = require$$1$14,
    baseLodash = require$$0$23;

/**
 * The base constructor for creating `lodash` wrapper objects.
 *
 * @private
 * @param {*} value The value to wrap.
 * @param {boolean} [chainAll] Enable explicit method chain sequences.
 */
function LodashWrapper(value, chainAll) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__chain__ = !!chainAll;
  this.__index__ = 0;
  this.__values__ = undefined;
}

LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;

module.exports = LodashWrapper;
});

var require$$1$15 = (_LodashWrapper && typeof _LodashWrapper === 'object' && 'default' in _LodashWrapper ? _LodashWrapper['default'] : _LodashWrapper);

var _LazyWrapper = __commonjs(function (module) {
var baseCreate = require$$1$14,
    baseLodash = require$$0$23;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
 *
 * @private
 * @constructor
 * @param {*} value The value to wrap.
 */
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}

// Ensure `LazyWrapper` is an instance of `baseLodash`.
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;

module.exports = LazyWrapper;
});

var require$$2$8 = (_LazyWrapper && typeof _LazyWrapper === 'object' && 'default' in _LazyWrapper ? _LazyWrapper['default'] : _LazyWrapper);

var _wrapperClone = __commonjs(function (module) {
var LazyWrapper = require$$2$8,
    LodashWrapper = require$$1$15,
    copyArray = require$$0$20;

/**
 * Creates a clone of `wrapper`.
 *
 * @private
 * @param {Object} wrapper The wrapper to clone.
 * @returns {Object} Returns the cloned wrapper.
 */
function wrapperClone(wrapper) {
  if (wrapper instanceof LazyWrapper) {
    return wrapper.clone();
  }
  var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
  result.__actions__ = copyArray(wrapper.__actions__);
  result.__index__  = wrapper.__index__;
  result.__values__ = wrapper.__values__;
  return result;
}

module.exports = wrapperClone;
});

var require$$0$22 = (_wrapperClone && typeof _wrapperClone === 'object' && 'default' in _wrapperClone ? _wrapperClone['default'] : _wrapperClone);

var isArray = __commonjs(function (module) {
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;
});

var require$$2$9 = (isArray && typeof isArray === 'object' && 'default' in isArray ? isArray['default'] : isArray);

var wrapperLodash = __commonjs(function (module) {
var LazyWrapper = require$$2$8,
    LodashWrapper = require$$1$15,
    baseLodash = require$$0$23,
    isArray = require$$2$9,
    isObjectLike = require$$1,
    wrapperClone = require$$0$22;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates a `lodash` object which wraps `value` to enable implicit method
 * chain sequences. Methods that operate on and return arrays, collections,
 * and functions can be chained together. Methods that retrieve a single value
 * or may return a primitive value will automatically end the chain sequence
 * and return the unwrapped value. Otherwise, the value must be unwrapped
 * with `_#value`.
 *
 * Explicit chain sequences, which must be unwrapped with `_#value`, may be
 * enabled using `_.chain`.
 *
 * The execution of chained methods is lazy, that is, it's deferred until
 * `_#value` is implicitly or explicitly called.
 *
 * Lazy evaluation allows several methods to support shortcut fusion.
 * Shortcut fusion is an optimization to merge iteratee calls; this avoids
 * the creation of intermediate arrays and can greatly reduce the number of
 * iteratee executions. Sections of a chain sequence qualify for shortcut
 * fusion if the section is applied to an array of at least `200` elements
 * and any iteratees accept only one argument. The heuristic for whether a
 * section qualifies for shortcut fusion is subject to change.
 *
 * Chaining is supported in custom builds as long as the `_#value` method is
 * directly or indirectly included in the build.
 *
 * In addition to lodash methods, wrappers have `Array` and `String` methods.
 *
 * The wrapper `Array` methods are:
 * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
 *
 * The wrapper `String` methods are:
 * `replace` and `split`
 *
 * The wrapper methods that support shortcut fusion are:
 * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
 * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
 * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
 *
 * The chainable wrapper methods are:
 * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
 * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
 * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
 * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
 * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
 * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
 * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
 * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
 * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
 * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
 * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
 * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
 * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
 * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
 * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
 * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
 * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
 * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
 * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
 * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
 * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
 * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
 * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
 * `zipObject`, `zipObjectDeep`, and `zipWith`
 *
 * The wrapper methods that are **not** chainable by default are:
 * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
 * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
 * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
 * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
 * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
 * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
 * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
 * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
 * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
 * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
 * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
 * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
 * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
 * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
 * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
 * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
 * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
 * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
 * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
 * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
 * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
 * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
 * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
 * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
 * `upperFirst`, `value`, and `words`
 *
 * @name _
 * @constructor
 * @category Seq
 * @param {*} value The value to wrap in a `lodash` instance.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var wrapped = _([1, 2, 3]);
 *
 * // Returns an unwrapped value.
 * wrapped.reduce(_.add);
 * // => 6
 *
 * // Returns a wrapped value.
 * var squares = wrapped.map(square);
 *
 * _.isArray(squares);
 * // => false
 *
 * _.isArray(squares.value());
 * // => true
 */
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }
    if (hasOwnProperty.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }
  return new LodashWrapper(value);
}

// Ensure wrappers are instances of `baseLodash`.
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;

module.exports = lodash;
});

var require$$0$21 = (wrapperLodash && typeof wrapperLodash === 'object' && 'default' in wrapperLodash ? wrapperLodash['default'] : wrapperLodash);

var _realNames = __commonjs(function (module) {
/** Used to lookup unminified function names. */
var realNames = {};

module.exports = realNames;
});

var require$$0$24 = (_realNames && typeof _realNames === 'object' && 'default' in _realNames ? _realNames['default'] : _realNames);

var _getFuncName = __commonjs(function (module) {
var realNames = require$$0$24;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the name of `func`.
 *
 * @private
 * @param {Function} func The function to query.
 * @returns {string} Returns the function name.
 */
function getFuncName(func) {
  var result = (func.name + ''),
      array = realNames[result],
      length = hasOwnProperty.call(realNames, result) ? array.length : 0;

  while (length--) {
    var data = array[length],
        otherFunc = data.func;
    if (otherFunc == null || otherFunc == func) {
      return data.name;
    }
  }
  return result;
}

module.exports = getFuncName;
});

var require$$1$16 = (_getFuncName && typeof _getFuncName === 'object' && 'default' in _getFuncName ? _getFuncName['default'] : _getFuncName);

var _isLaziable = __commonjs(function (module) {
var LazyWrapper = require$$2$8,
    getData = require$$2$4,
    getFuncName = require$$1$16,
    lodash = require$$0$21;

/**
 * Checks if `func` has a lazy counterpart.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
 *  else `false`.
 */
function isLaziable(func) {
  var funcName = getFuncName(func),
      other = lodash[funcName];

  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
    return false;
  }
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}

module.exports = isLaziable;
});

var require$$2$7 = (_isLaziable && typeof _isLaziable === 'object' && 'default' in _isLaziable ? _isLaziable['default'] : _isLaziable);

var _createRecurry = __commonjs(function (module) {
var isLaziable = require$$2$7,
    setData = require$$1$9,
    setWrapToString = require$$0$6;

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_BOUND_FLAG = 4,
    CURRY_FLAG = 8,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64;

/**
 * Creates a function that wraps `func` to continue currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {Function} wrapFunc The function to create the `func` wrapper.
 * @param {*} placeholder The placeholder value.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
  var isCurry = bitmask & CURRY_FLAG,
      newHolders = isCurry ? holders : undefined,
      newHoldersRight = isCurry ? undefined : holders,
      newPartials = isCurry ? partials : undefined,
      newPartialsRight = isCurry ? undefined : partials;

  bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
  bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

  if (!(bitmask & CURRY_BOUND_FLAG)) {
    bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
  }
  var newData = [
    func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
    newHoldersRight, argPos, ary, arity
  ];

  var result = wrapFunc.apply(undefined, newData);
  if (isLaziable(func)) {
    setData(result, newData);
  }
  result.placeholder = placeholder;
  return setWrapToString(result, func, bitmask);
}

module.exports = createRecurry;
});

var require$$3$3 = (_createRecurry && typeof _createRecurry === 'object' && 'default' in _createRecurry ? _createRecurry['default'] : _createRecurry);

var _countHolders = __commonjs(function (module) {
/**
 * Gets the number of `placeholder` occurrences in `array`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} placeholder The placeholder to search for.
 * @returns {number} Returns the placeholder count.
 */
function countHolders(array, placeholder) {
  var length = array.length,
      result = 0;

  while (length--) {
    if (array[length] === placeholder) {
      ++result;
    }
  }
  return result;
}

module.exports = countHolders;
});

var require$$6$1 = (_countHolders && typeof _countHolders === 'object' && 'default' in _countHolders ? _countHolders['default'] : _countHolders);

var _createHybrid = __commonjs(function (module) {
var composeArgs = require$$8,
    composeArgsRight = require$$7,
    countHolders = require$$6$1,
    createCtor = require$$1$13,
    createRecurry = require$$3$3,
    getHolder = require$$2$6,
    reorder = require$$2$5,
    replaceHolders = require$$1$12,
    root = require$$0$15;

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    ARY_FLAG = 128,
    FLIP_FLAG = 512;

/**
 * Creates a function that wraps `func` to invoke it with optional `this`
 * binding of `thisArg`, partial application, and currying.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to prepend to those provided to
 *  the new function.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [partialsRight] The arguments to append to those provided
 *  to the new function.
 * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
  var isAry = bitmask & ARY_FLAG,
      isBind = bitmask & BIND_FLAG,
      isBindKey = bitmask & BIND_KEY_FLAG,
      isCurried = bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG),
      isFlip = bitmask & FLIP_FLAG,
      Ctor = isBindKey ? undefined : createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length;

    while (index--) {
      args[index] = arguments[index];
    }
    if (isCurried) {
      var placeholder = getHolder(wrapper),
          holdersCount = countHolders(args, placeholder);
    }
    if (partials) {
      args = composeArgs(args, partials, holders, isCurried);
    }
    if (partialsRight) {
      args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
    }
    length -= holdersCount;
    if (isCurried && length < arity) {
      var newHolders = replaceHolders(args, placeholder);
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, thisArg,
        args, newHolders, argPos, ary, arity - length
      );
    }
    var thisBinding = isBind ? thisArg : this,
        fn = isBindKey ? thisBinding[func] : func;

    length = args.length;
    if (argPos) {
      args = reorder(args, argPos);
    } else if (isFlip && length > 1) {
      args.reverse();
    }
    if (isAry && ary < length) {
      args.length = ary;
    }
    if (this && this !== root && this instanceof wrapper) {
      fn = Ctor || createCtor(fn);
    }
    return fn.apply(thisBinding, args);
  }
  return wrapper;
}

module.exports = createHybrid;
});

var require$$4 = (_createHybrid && typeof _createHybrid === 'object' && 'default' in _createHybrid ? _createHybrid['default'] : _createHybrid);

var _createCurry = __commonjs(function (module) {
var apply = require$$6,
    createCtor = require$$1$13,
    createHybrid = require$$4,
    createRecurry = require$$3$3,
    getHolder = require$$2$6,
    replaceHolders = require$$1$12,
    root = require$$0$15;

/**
 * Creates a function that wraps `func` to enable currying.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {number} arity The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createCurry(func, bitmask, arity) {
  var Ctor = createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return apply(fn, this, args);
  }
  return wrapper;
}

module.exports = createCurry;
});

var require$$7$1 = (_createCurry && typeof _createCurry === 'object' && 'default' in _createCurry ? _createCurry['default'] : _createCurry);

var _createBind = __commonjs(function (module) {
var createCtor = require$$1$13,
    root = require$$0$15;

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1;

/**
 * Creates a function that wraps `func` to invoke it with the optional `this`
 * binding of `thisArg`.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createBind(func, bitmask, thisArg) {
  var isBind = bitmask & BIND_FLAG,
      Ctor = createCtor(func);

  function wrapper() {
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return fn.apply(isBind ? thisArg : this, arguments);
  }
  return wrapper;
}

module.exports = createBind;
});

var require$$8$1 = (_createBind && typeof _createBind === 'object' && 'default' in _createBind ? _createBind['default'] : _createBind);

var _createWrap = __commonjs(function (module) {
var baseSetData = require$$1$10,
    createBind = require$$8$1,
    createCurry = require$$7$1,
    createHybrid = require$$4,
    createPartial = require$$5,
    getData = require$$2$4,
    mergeData = require$$3$2,
    setData = require$$1$9,
    setWrapToString = require$$0$6,
    toInteger = require$$0$1;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to compose bitmasks for function metadata. */
var BIND_FLAG = 1,
    BIND_KEY_FLAG = 2,
    CURRY_FLAG = 8,
    CURRY_RIGHT_FLAG = 16,
    PARTIAL_FLAG = 32,
    PARTIAL_RIGHT_FLAG = 64;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that either curries or invokes `func` with optional
 * `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to wrap.
 * @param {number} bitmask The bitmask flags.
 *  The bitmask may be composed of the following flags:
 *     1 - `_.bind`
 *     2 - `_.bindKey`
 *     4 - `_.curry` or `_.curryRight` of a bound function
 *     8 - `_.curry`
 *    16 - `_.curryRight`
 *    32 - `_.partial`
 *    64 - `_.partialRight`
 *   128 - `_.rearg`
 *   256 - `_.ary`
 *   512 - `_.flip`
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {Array} [partials] The arguments to be partially applied.
 * @param {Array} [holders] The `partials` placeholder indexes.
 * @param {Array} [argPos] The argument positions of the new function.
 * @param {number} [ary] The arity cap of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new wrapped function.
 */
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
  var isBindKey = bitmask & BIND_KEY_FLAG;
  if (!isBindKey && typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var length = partials ? partials.length : 0;
  if (!length) {
    bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
    partials = holders = undefined;
  }
  ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
  arity = arity === undefined ? arity : toInteger(arity);
  length -= holders ? holders.length : 0;

  if (bitmask & PARTIAL_RIGHT_FLAG) {
    var partialsRight = partials,
        holdersRight = holders;

    partials = holders = undefined;
  }
  var data = isBindKey ? undefined : getData(func);

  var newData = [
    func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
    argPos, ary, arity
  ];

  if (data) {
    mergeData(newData, data);
  }
  func = newData[0];
  bitmask = newData[1];
  thisArg = newData[2];
  partials = newData[3];
  holders = newData[4];
  arity = newData[9] = newData[9] == null
    ? (isBindKey ? 0 : func.length)
    : nativeMax(newData[9] - length, 0);

  if (!arity && bitmask & (CURRY_FLAG | CURRY_RIGHT_FLAG)) {
    bitmask &= ~(CURRY_FLAG | CURRY_RIGHT_FLAG);
  }
  if (!bitmask || bitmask == BIND_FLAG) {
    var result = createBind(func, bitmask, thisArg);
  } else if (bitmask == CURRY_FLAG || bitmask == CURRY_RIGHT_FLAG) {
    result = createCurry(func, bitmask, arity);
  } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !holders.length) {
    result = createPartial(func, bitmask, thisArg, partials);
  } else {
    result = createHybrid.apply(undefined, newData);
  }
  var setter = data ? baseSetData : setData;
  return setWrapToString(setter(result, newData), func, bitmask);
}

module.exports = createWrap;
});

var require$$0 = (_createWrap && typeof _createWrap === 'object' && 'default' in _createWrap ? _createWrap['default'] : _createWrap);

var curry = __commonjs(function (module) {
var createWrap = require$$0;

/** Used to compose bitmasks for function metadata. */
var CURRY_FLAG = 8;

/**
 * Creates a function that accepts arguments of `func` and either invokes
 * `func` returning its result, if at least `arity` number of arguments have
 * been provided, or returns a function that accepts the remaining `func`
 * arguments, and so on. The arity of `func` may be specified if `func.length`
 * is not sufficient.
 *
 * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
 * may be used as a placeholder for provided arguments.
 *
 * **Note:** This method doesn't set the "length" property of curried functions.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Function
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var abc = function(a, b, c) {
 *   return [a, b, c];
 * };
 *
 * var curried = _.curry(abc);
 *
 * curried(1)(2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2)(3);
 * // => [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // => [1, 2, 3]
 *
 * // Curried with placeholders.
 * curried(1)(_, 3)(2);
 * // => [1, 2, 3]
 */
function curry(func, arity, guard) {
  arity = guard ? undefined : arity;
  var result = createWrap(func, CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
  result.placeholder = curry.placeholder;
  return result;
}

// Assign default placeholders.
curry.placeholder = {};

module.exports = curry;
});

var _curry = (curry && typeof curry === 'object' && 'default' in curry ? curry['default'] : curry);

/**
 * @function throttle
 * @param  {integer}   FuncDelay
 * @param  {Function} callback
 * @return {Function}                  the throttled function
 */
function throttle(FuncDelay, callback) {
  var lastCall = +new Date();
  var delay = FuncDelay;
  var params = void 0;
  var context = {};
  var calledDuringDelay = false;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var now = +new Date();
    var diff = now - lastCall;
    var timeToEndOfDelay = void 0;

    params = args;

    if (diff > delay) {
      callback.apply(context, params); // Call function with latest parameters
      calledDuringDelay = false;
      lastCall = now;
    } else if (!calledDuringDelay) {
      // If it wasn't called yet, call it when there is enough delay.
      timeToEndOfDelay = delay - diff;

      setTimeout(function () {
        callback.apply(context, params); // Call function with latest parameters
      }, timeToEndOfDelay);

      calledDuringDelay = true;
      lastCall = now + timeToEndOfDelay;
    } // Otherwise do nothing.
  };
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
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





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

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

/**
 * Will take care of the dragging and reordering a list for one drag.
 * @function trackReorderDrag
 * @param  {event} paramE        The dragstart event, from which this should be called.
 * @param  {HTMLElement} paramEl       The main Element being dragged
 * @param  {Array<HTMLElement>} paramElements Array of elements to be tracked.
 * @return {void}
 */
function trackReorderDrag(paramE, paramEl, paramElements) {
  function setTranslation(el, val) {
    el.style.transform = 'translate3d(0, ' + val + 'px, 0)'; //  eslint-disable-line no-param-reassign
  }

  /**
   * @function resetElementsPositions
   * @param {Array<HTMLElement>} els Elements being tracked
   */
  function resetElementsPositions(els) {
    els.forEach(function (el) {
      setTranslation(el, 0);
    });
  }

  /**
   * @function calculateElementHeight
   * @param  {Array<HTMLElement>} els    Elements ordered by vertical position
   * @param  {Integer} elIndex
   * @return {void}
   */
  function calculateElementHeight(els, elIndex) {
    var spaceOccupied = void 0;

    // If not the last element
    if (elIndex < els.length - 1) {
      var elTop = els[elIndex].getBoundingClientRect().top;
      var nextElTop = els[elIndex + 1].getBoundingClientRect().top;
      spaceOccupied = nextElTop - elTop;
    } else {
      // let's estimate the general vertical distance between elements by
      // subtracting the size of the first element from the distance between
      // its top and the next element.
      var firstElSpaceOccupied = els[1].getBoundingClientRect().top - els[0].getBoundingClientRect().top;
      var verticalDistance = firstElSpaceOccupied - els[0].clientHeight;
      var height = els[elIndex].clientHeight;
      spaceOccupied = height + verticalDistance;
    }

    return spaceOccupied;
  }

  /**
   * @function createDragMover
   * @param  {Array<HTMLElement>} els
   * @param  {Array<Integer>} tops        Initial tops
   * @param  {Integer} targetIndex Index of element being dragged around
   * @return {function}             The function to translate elements in the
   *                                  list to make room for the dragged element
   */
  function createDragMover(els, tops, targetIndex) {
    var target = els[targetIndex];
    var targetInitialTop = tops[targetIndex];
    var targetHeight = calculateElementHeight(els, targetIndex);
    return function doDragMove() {
      var targetTop = target.getBoundingClientRect().top;
      var movedUp = targetTop < targetInitialTop;

      var i = void 0;
      for (i = 0; i < tops.length; i++) {
        if (i === targetIndex) {
          continue;
        } else if (!movedUp && targetTop > tops[i] && tops[i] > targetInitialTop) {
          setTranslation(els[i], -targetHeight);
        } else if (movedUp && targetTop < tops[i + 1] && tops[i] < targetInitialTop) {
          setTranslation(els[i], targetHeight);
        } else {
          setTranslation(els[i], 0);
        }
      }
    };
  }

  function createDragListener(els, tops, targetIndex, initialY) {
    var target = els[targetIndex];
    var doDragMove = createDragMover(els, tops, targetIndex);
    var shouldStopListening = void 0;
    function dragListener(e) {
      if (shouldStopListening) {
        return;
      }

      doDragMove();
      var newY = e.pageY;
      if (newY === 0) {
        return;
      } // correct weird behaviour when mouse goes up

      var diff = newY - initialY;
      setTranslation(target, diff);
    }

    dragListener.stop = function () {
      shouldStopListening = true;
    };

    return dragListener;
  }

  function getElementsCurrentTop(els) {
    var tops = [];
    els.forEach(function (el) {
      tops.push(el.getBoundingClientRect().top);
    });

    return tops;
  }

  // function adjustElementsToTops(els, tops) {
  //   const currentTops = getElementsCurrentTop(els);
  //   els.forEach(function (el, i) {
  //     const diff =  currentTops[i] - tops[i];
  //     setTranslation(el, diff);
  //   });
  // }

  function insertTargetInRightPlace(els, initialTops, targetIndex) {
    var target = els[targetIndex];
    var topsBeforeInsertion = getElementsCurrentTop(els);
    var targetTop = topsBeforeInsertion[targetIndex];
    var i = 0;

    // Pass by all elements that are above the target
    while (topsBeforeInsertion[i] && topsBeforeInsertion[i] < targetTop || i === targetIndex) {
      i++;
    }

    // Take away transitions from all elements and save them
    var initialTransitions = [];
    els.forEach(function (anEl) {
      initialTransitions.push(anEl.style.transition);
      anEl.style.transition = 'none'; // eslint-disable-line no-param-reassign
    });

    // Put everyone at translate3d(0,0,0) without transitions
    resetElementsPositions(els);

    // Add the element in the appropriate place. This will displace everyone else.
    var parent = els[i] ? els[i].parentElement : els[els.length - 1].parentElement;
    if (!parent || !parent.appendChild) {
      throw new Error('trackReorderDrag(): No parent found in element list.');
    } else if (els[i]) {
      parent.insertBefore(target, els[i]);
    } else {
      var lastEl = els[els.length - 1];
      parent.insertBefore(target, lastEl);
      parent.insertBefore(lastEl, target);
    }

    // Now let's translate it to where it was just before it was repositioned
    // All without transitions. It will seem like it never left that spot.
    var futureTop = target.getBoundingClientRect().top;
    var displacement = targetTop - futureTop;
    setTranslation(target, displacement);

    // Let's add a timeout to get the last place in the UI queue and let the
    // CSS renderer to process the fact that all these elements do not have
    // transitions and should appear wherever their coordinates say immediately.
    setTimeout(function () {
      // Restore all transitions
      els.forEach(function (anEl, k) {
        anEl.style.transition = initialTransitions[k]; // eslint-disable-line no-param-reassign
      });

      // Now transition the target can transition smoothly from where it
      // was dropped to its final position at translate value 0.
      setTranslation(target, 0);
    }, 15);

    //  adjustElementsToTops(els, topsBeforeInsertion);
  }

  function init(e, el, elements) {
    if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) !== 'object') {
      throw new Error('trackReorderDrag(): Invalid parameter');
    }

    // Reorder elements
    elements.sort(function (el1, el2) {
      return el1.getBoundingClientRect().top > el2.getBoundingClientRect().top;
    });

    // Set initial states
    var initialTops = [];
    elements.forEach(function (element) {
      initialTops.push(element.getBoundingClientRect().top);
    });

    var elIndex = elements.indexOf(el);

    // Create throttled drag listener
    var initialY = e.pageY;
    var dragListener = createDragListener(elements, initialTops, elIndex, initialY);
    var throttledDragListener = throttle(50, dragListener);

    // Listen to drags
    var eventTarget = e.target;
    eventTarget.addEventListener('drag', throttledDragListener);
    eventTarget.addEventListener('dragend', function dragEndListener() {
      dragListener.stop();
      insertTargetInRightPlace(elements, initialTops, elIndex);
      eventTarget.removeEventListener('drag', throttledDragListener);
      eventTarget.removeEventListener('dragend', dragEndListener);
    });
  }

  init(paramE, paramEl, paramElements);
}

function addListenerOnce(eventName, el, f) {
  function triggerAndRemove(event) {
    f(event);
    el.removeEventListener(eventName, triggerAndRemove);
  }

  el.addEventListener(eventName, triggerAndRemove);
}

// =========== Handle drag

function getParentField(el) {
  if (!el || !el.parentNode) {
    return el;
  }
  return el.classList.contains('fl-fb-Field') ? el : getParentField(el.parentNode);
}

var onDragStart = function onDragStart(event) {
  var e = event.nativeEvent;
  // hide any dragging image
  e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);

  var mainField = getParentField(e.target);
  var trackedFields = Array.from(mainField.parentElement.children);

  if (trackedFields.length < 2) {
    return;
  }
  mainField.classList.add('fl-fb-Field--dragging');
  trackReorderDrag(e, mainField, trackedFields);

  // Post dragging
  addListenerOnce('dragend', mainField, function () {
    // remove dragging class after animation finishes
    setTimeout(function () {
      return mainField.classList.remove('fl-fb-Field--dragging');
    }, 250);

    var reorderedIds = Array.from(trackedFields).sort(function (el1, el2) {
      return el1.getBoundingClientRect().top > el2.getBoundingClientRect().top;
    }).map(function (f) {
      return f.dataset.id;
    });

    EventHub.trigger('fieldsReorder', reorderedIds);
  });
};

// =========== END OF Handle drag

var updateField$1 = function updateField$1(newState) {
  EventHub.trigger('updateField', newState);
};

var deleteField$1 = function deleteField$1(fieldState) {
  EventHub.trigger('deleteField', fieldState);
};

var toggleConfig = function toggleConfig(fieldState) {
  var newFieldState = Object.assign({}, fieldState, { configShowing: !fieldState.configShowing });
  updateField$1(newFieldState);
};

var toggleRequired = function toggleRequired(fieldState) {
  var newFieldState = Object.assign({}, fieldState, { required: !fieldState.required });
  updateField$1(newFieldState);
};

var isValidFieldState = function isValidFieldState(state) {
  return typeof state.id === 'number' && typeof state.type === 'string' && typeof state.group === 'string' && typeof state.configShowing === 'boolean';
};

var Sidebar = function Sidebar(_ref) {
  var fieldState = _ref.fieldState;
  return React.createElement(
    'div',
    { className: 'fl-fb-Field-sidebar' },
    React.createElement('button', {
      className: 'glyphicon glyphicon-menu-hamburger fl-fb-Field-sidebar-btn',
      onDragStart: onDragStart,
      draggable: 'true'
    }),
    React.createElement('button', {
      className: 'glyphicon glyphicon-cog fl-fb-Field-sidebar-btn-config',
      onClick: function onClick() {
        return toggleConfig(fieldState);
      }
    }),
    React.createElement('button', {
      className: 'glyphicon glyphicon-trash fl-fb-Field-sidebar-btn-delete',
      onClick: function onClick() {
        return deleteField$1(fieldState);
      }
    })
  );
};

var ConfigBar = function ConfigBar(_ref2) {
  var fieldState = _ref2.fieldState;
  return React.createElement(
    'div',
    { className: 'fl-fb-Field-configuration' },
    React.createElement(
      'div',
      { className: 'fl-fb-Field-configuration-buttons' },
      React.createElement(
        'label',
        {
          className: 'fl-fb-Field-configuration-switch-required',
          onMouseDown: function onMouseDown() {
            return toggleRequired(fieldState);
          }
        },
        'Required',
        React.createElement(
          'div',
          { className: 'fl-fb-ui-switch' },
          React.createElement('input', {
            className: 'fl-fb-ui-switch-toggle fl-fb-ui-switch-toggle-round',
            type: 'checkbox',
            id: 'fl-fb-ui-switch-' + fieldState.id,
            checked: fieldState.required
          }),
          React.createElement(
            'label',
            { htmlFor: 'fl-fb-ui-switch-' + fieldState.id },
            ' '
          )
        )
      ),
      React.createElement(
        'span',
        { className: 'fl-fb-Field-configuration-elementName' },
        fieldState.displayName
      ),
      React.createElement('button', {
        className: 'fl-fb-Field-configuration-btn-ok btn btn-sm btn-default glyphicon glyphicon-ok',
        onClick: function onClick() {
          return toggleConfig(fieldState);
        },
        type: 'button'
      })
    )
  );
};

var Field = function Field(_ref3) {
  var fieldState = _ref3.fieldState;
  var fieldConstructor = _ref3.fieldConstructor;

  assert(isValidFieldState(fieldState), 'Invalid field state: ' + fieldState);

  var fieldComponent = fieldState.configShowing ? fieldConstructor.RenderConfigMode : fieldConstructor.RenderFormMode;

  var topClasses = fieldState.configShowing ? 'fl-fb-Field fl-fb-Field--configuration-visible' : 'fl-fb-Field';

  return React.createElement(
    'div',
    { className: topClasses, 'data-id': fieldState.id },
    React.createElement(
      'div',
      { className: 'fl-fb-Field-content' },
      React.createElement(fieldComponent, { state: fieldState, update: updateField$1 })
    ),
    React.createElement(Sidebar, { fieldState: fieldState }),
    React.createElement(ConfigBar, { fieldState: fieldState })
  );
};

Field.propTypes = {
  fieldState: React.PropTypes.object,
  fieldConstructor: React.PropTypes.object
};

var getTypeConstructor = _curry(function (typeConstructors, type) {
  return typeConstructors.find(function (t) {
    return t.info.type === type;
  });
});

var Fields = function Fields(props) {
  var fieldStates = props.fieldStates;
  var fieldTypes = props.fieldTypes;


  return React.createElement(
    'div',
    { className: 'fl-fb-Fields' },
    fieldStates.map(function (compState) {
      return React.createElement(Field, {
        key: compState.id,
        fieldState: compState,
        fieldConstructor: getTypeConstructor(fieldTypes, compState.type)
      });
    })
  );
};

Fields.propTypes = {
  fieldStates: React.PropTypes.array,
  fieldTypes: React.PropTypes.arrayOf(FieldCreatorPropType)
};

var FormBuilder$2 = function (_React$Component) {
  inherits(FormBuilder, _React$Component);

  function FormBuilder(props) {
    classCallCheck(this, FormBuilder);

    var _this = possibleConstructorReturn(this, (FormBuilder.__proto__ || Object.getPrototypeOf(FormBuilder)).call(this, props));

    _this.state = {
      fieldTypes: props.fieldTypes, // TODO: Add validation here
      fieldStates: [],
      fieldStatesHistory: [] };

    // array of fieldStates
    _this.createField = _this.createField.bind(_this);
    _this.deleteField = _this.deleteField.bind(_this);
    _this.addFieldType = _this.addFieldType.bind(_this);
    _this.updateField = _this.updateField.bind(_this);
    _this.pushHistoryState = _this.pushHistoryState.bind(_this);
    _this.pullHistoryState = _this.pullHistoryState.bind(_this);
    _this.reorderFields = _this.reorderFields.bind(_this);

    EventHub.on('createField', _this.createField);
    EventHub.on('deleteField', _this.deleteField);
    EventHub.on('updateField', _this.updateField);
    EventHub.on('undoBtnPressed', _this.pullHistoryState);
    EventHub.on('fieldsReorder', _this.reorderFields);

    // Expose function to export state.
    props.exportState(function () {
      return _this.state.fieldStates;
    });
    return _this;
  }

  // ==================== FIELDS HANDLING  ===========================

  createClass(FormBuilder, [{
    key: 'createField',
    value: function createField(fieldType) {
      var typeConstructor = this.state.fieldTypes.find(function (f) {
        return f.info.type === fieldType;
      });

      assert(typeConstructor, 'Field "' + fieldType + '" does not exist.');

      var initialState = typeConstructor.initialState();
      initialState.id = Date.now();
      initialState.configShowing = true;

      // Make all other fields have config hidden
      var otherFieldsStates = this.state.fieldStates.map(function (s) {
        return Object.assign({}, s, { configShowing: false });
      });

      var fieldStates = otherFieldsStates.concat([initialState]);
      this.pushHistoryState(fieldStates);
    }
  }, {
    key: 'deleteField',
    value: function deleteField(fieldState) {
      var fieldStates = this.state.fieldStates.filter(function (state) {
        return state.id !== fieldState.id;
      });

      assert(fieldStates.length < this.state.fieldStates.length, 'Something weird happened.\n       Field with ID ' + fieldState.is + ' didn\'t seem to be part of the existing states');

      this.pushHistoryState(fieldStates);
    }
  }, {
    key: 'updateField',
    value: function updateField(fieldState) {
      var stateIndex = this.state.fieldStates.findIndex(function (s) {
        return s.id === fieldState.id;
      });

      assert(stateIndex !== -1, 'Field with id ' + fieldState.id + ' is not in field states');

      var fieldStates = Array.from(this.state.fieldStates);
      fieldStates[stateIndex] = fieldState;
      this.pushHistoryState(fieldStates);
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
    key: 'reorderFields',
    value: function reorderFields(newFieldsIdOrder) {
      var _this2 = this;

      var fieldStates = newFieldsIdOrder.map(function (id) {
        return _this2.state.fieldStates.find(function (s) {
          return s.id.toString() === id;
        });
      });

      assert(fieldStates.indexOf(undefined) === -1, 'There are ids that do not correspond to any fieldState.');

      console.log('New order:', fieldStates.map(function (s) {
        return s.id;
      }).join(', '));

      this.pushHistoryState(fieldStates);
    }
    // ==================== HISTORY HANDLING  ===========================

  }, {
    key: 'pushHistoryState',
    value: function pushHistoryState(fieldStates) {
      // Add active state to head and set new state as active
      var currentFieldStates = this.state.fieldStates;
      var fieldStatesHistory = [currentFieldStates].concat(this.state.fieldStatesHistory);
      this.setState({
        fieldStatesHistory: fieldStatesHistory,
        fieldStates: fieldStates
      });
    }
  }, {
    key: 'pullHistoryState',
    value: function pullHistoryState() {
      // Remove head
      var fieldStatesHistory = this.state.fieldStatesHistory.slice(1);
      // Head is now the active state
      var fieldStates = this.state.fieldStatesHistory[0] || [];
      this.setState({
        fieldStatesHistory: fieldStatesHistory,
        fieldStates: fieldStates
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state;
      var fieldTypes = _state.fieldTypes;
      var fieldStates = _state.fieldStates;


      return React.createElement(
        'div',
        { className: 'fl-fb' },
        React.createElement(ControlBar, { fieldTypes: fieldTypes }),
        React.createElement(Fields, { fieldStates: fieldStates, fieldTypes: fieldTypes })
      );
    }
  }]);
  return FormBuilder;
}(React.Component);

FormBuilder$2.propTypes = {
  fieldTypes: React.PropTypes.arrayOf(FieldCreatorPropType),
  exportState: React.PropTypes.func
};

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

function buildOptionsFieldConstructor(typeInfo) {
  // These are the fields that will end up being
  // changed on updates
  var componentFields = {
    // Compulsory fields
    required: false,
    // Component specific fields
    title: 'Add a title',
    options: ['Insert an option'],

    // states needed to handle UI
    newOptionText: ''
  };

  // For Text Fields the initialState function will only return an object.
  var initialState = function initialState() {
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

    var removeOption = function removeOption() {
      // Remove last option
      var options = state.options.slice(0, state.options.length - 1);
      var newState = overshadow(state, { options: options });
      update(newState);
    };

    var addOption = function addOption() {
      if (!state.newOptionText.trim()) {
        return;
      }

      var options = state.options.filter(function (o) {
        return !initialState().options.includes(o);
      }) // Remove default option
      .concat([state.newOptionText]); // Add new option
      var newOptionText = '';
      var newState = overshadow(state, { options: options, newOptionText: newOptionText });
      update(newState);
    };

    var updateOption = _curry(function (optionIndex, event) {
      var value = event.target.value;
      var options = Array.from(state.options);
      options[optionIndex] = value;

      var newState = overshadow(state, { options: options });
      update(newState);
    });

    var removeIfOptionIsNull = _curry(function (optionIndex, event) {
      var value = event.target.value;
      if (value) {
        return;
      }
      var optionsBefore = state.options.slice(0, optionIndex);
      var optionsAfter = state.options.slice(optionIndex + 1, state.options.length);
      var options = optionsBefore.concat(optionsAfter);
      var newState = overshadow(state, { options: options });
      update(newState);
    });

    var updateProperty = _curry(function (propName, event) {
      var value = event.target.value;
      var newValue = value || initialState()[propName];
      var newState = overshadow(state, defineProperty({}, propName, newValue));
      update(newState);
    });

    var ifEnterPressed = _curry(function (f, e) {
      if (event.key === 'Enter') {
        f(e);
      }
    });

    return React.createElement(
      'div',
      null,
      React.createElement(
        'h2',
        null,
        React.createElement('input', {
          type: 'text',
          className: 'fl-fb-Field-editable',
          onChange: updateProperty('title'),
          defaultValue: state.title
        })
      ),
      state.options.map(function (optionText, optionIndex) {
        return React.createElement(
          'div',
          { className: 'fl-fb-Field-option' },
          React.createElement('input', { type: state.htmlInputType }),
          React.createElement('input', {
            type: 'text',
            className: 'fl-fb-Field-option-text fl-fb-Field-editable',
            value: optionText,
            onKeyPress: ifEnterPressed(removeIfOptionIsNull(optionIndex)),
            onChange: updateOption(optionIndex)
          })
        );
      }),
      React.createElement(
        'div',
        { className: 'fl-fb-Field-config' },
        React.createElement('button', { onMouseDown: removeOption, className: 'glyphicon-minus-sign glyphicon fl-fb-Field-config-btn' }),
        React.createElement('button', { onMouseDown: addOption, className: 'glyphicon-plus-sign glyphicon fl-fb-Field-config-btn' }),
        React.createElement('input', {
          className: 'fl-fb-Field-config-input',
          type: 'text',
          value: state.newOptionText,
          placeholder: 'Type a new option',
          onChange: updateProperty('newOptionText'),
          onKeyPress: ifEnterPressed(addOption)
        })
      )
    );
  };

  var RenderFormMode = function RenderFormMode(_ref2) {
    var state = _ref2.state;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'h2',
        null,
        state.title
      ),
      state.options.map(function (optionText) {
        return React.createElement(
          'div',
          { className: 'fl-fb-Field-option' },
          React.createElement('input', { type: state.htmlInputType }),
          React.createElement(
            'span',
            { className: 'fl-fb-Field-option-text' },
            ' ',
            optionText,
            ' '
          )
        );
      })
    );
  };

  var OptionsField = {
    info: typeInfo,
    initialState: initialState,
    RenderConfigMode: RenderConfigMode,
    RenderFormMode: RenderFormMode
  };

  return OptionsField;
}

var typeInfo = {
  // Compulsory
  type: 'RadioButtons',
  displayName: 'Radio Button',
  group: 'Options Components',

  // Field type specific
  htmlInputType: 'radio'
};

var RadioButtons = buildOptionsFieldConstructor(typeInfo);

var typeInfo$1 = {
  // Compulsory
  type: 'Checkboxes',
  displayName: 'Checkboxes',
  group: 'Options Components',

  // Field type specific
  htmlInputType: 'checkbox'
};

var RadioButtons$2 = buildOptionsFieldConstructor(typeInfo$1);

var typeInfo$2 = {
  // Compulsory
  type: 'Dropdown',
  displayName: 'Dropdown',
  group: 'Options Components'
};

// These are the fields that will end up being
// changed on updates
var componentFields = {
  // Compulsory fields
  required: false,
  // Component specific fields
  title: 'Add a title',
  options: ['Insert an option'],

  // states needed to handle UI
  newOptionText: ''
};

// For Text Fields the initialState function will only return an object.
var initialState = function initialState() {
  return Object.assign({}, typeInfo$2, componentFields);
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

  var removeOption = function removeOption() {
    // Remove last option
    var options = state.options.slice(0, state.options.length - 1);
    var newState = overshadow(state, { options: options });
    update(newState);
  };

  var addOption = function addOption() {
    if (!state.newOptionText.trim()) {
      return;
    }

    var options = state.options.filter(function (o) {
      return !initialState().options.includes(o);
    }) // Remove default option
    .concat([state.newOptionText]); // Add new option
    var newOptionText = '';
    var newState = overshadow(state, { options: options, newOptionText: newOptionText });
    update(newState);
  };

  var updateOption = _curry(function (optionIndex, event) {
    var value = event.target.value;
    var options = Array.from(state.options);
    options[optionIndex] = value;

    var newState = overshadow(state, { options: options });
    update(newState);
  });

  var removeIfOptionIsNull = _curry(function (optionIndex, event) {
    var value = event.target.value;
    if (value) {
      return;
    }
    var optionsBefore = state.options.slice(0, optionIndex);
    var optionsAfter = state.options.slice(optionIndex + 1, state.options.length);
    var options = optionsBefore.concat(optionsAfter);
    var newState = overshadow(state, { options: options });
    update(newState);
  });

  var updateProperty = _curry(function (propName, event) {
    var value = event.target.value;
    var newValue = value || initialState()[propName];
    var newState = overshadow(state, defineProperty({}, propName, newValue));
    update(newState);
  });

  var ifEnterPressed = _curry(function (f, e) {
    if (event.key === 'Enter') {
      f(e);
    }
  });

  return React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      null,
      React.createElement('input', {
        type: 'text',
        className: 'fl-fb-Field-editable',
        onChange: updateProperty('title'),
        defaultValue: state.title
      })
    ),
    React.createElement(
      'div',
      { className: 'form-control', style: { height: 'auto' } },
      state.options.map(function (optionText, optionIndex) {
        return React.createElement(
          'div',
          { className: 'fl-fb-Field-option' },
          React.createElement('input', {
            className: 'fl-fb-Field-editable',
            type: 'text',
            value: optionText,
            onKeyPress: ifEnterPressed(removeIfOptionIsNull(optionIndex)),
            onChange: updateOption(optionIndex)
          })
        );
      })
    ),
    React.createElement(
      'div',
      { className: 'fl-fb-Field-config' },
      React.createElement('button', { onMouseDown: removeOption, className: 'glyphicon-minus-sign glyphicon fl-fb-Field-config-btn' }),
      React.createElement('button', { onMouseDown: addOption, className: 'glyphicon-plus-sign glyphicon fl-fb-Field-config-btn' }),
      React.createElement('input', {
        type: 'text',
        className: 'fl-fb-Field-config-input',
        placeholder: 'Type a new option',
        value: state.newOptionText,
        onChange: updateProperty('newOptionText'),
        onKeyPress: ifEnterPressed(addOption)
      })
    )
  );
};

var RenderFormMode = function RenderFormMode(_ref2) {
  var state = _ref2.state;

  return React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      null,
      state.title
    ),
    React.createElement(
      'select',
      { className: 'form-control' },
      state.options.map(function (optionText) {
        return React.createElement(
          'option',
          null,
          ' ',
          optionText,
          ' '
        );
      })
    )
  );
};

var Dropdown = {
  info: typeInfo$2,
  initialState: initialState,
  RenderConfigMode: RenderConfigMode,
  RenderFormMode: RenderFormMode
};

/**
 *
 *
 * This is a group of functions to build a Text Field Constructor.
 * It is not supposed to be used as a FieldConstructor, but used to build one.
 *
 *
 */

// ========== UTILS =================== //

var updateField$2 = _curry(function (update, state, initialState, fieldName, event) {
  var value = event.target.value;
  // Update or fallback to default value
  var newValue = value || initialState[fieldName];
  var newState = overshadow(state, defineProperty({}, fieldName, newValue));
  update(newState);
});

// ========== END OF UTILS ============ //

var templateTypeInfo = {
  // Compulsory
  type: 'TextField',
  group: 'Text Components',
  displayName: 'Text field',

  // Field type specific
  htmlInputType: 'text',
  htmlElement: 'input'
};

// These are the fields that will end up being
// changed on updates
var componentFields$1 = {
  // Compulsory fields
  required: false,
  // Component specific fields
  title: 'Add a title',
  placeholder: 'Add a placeholder'
};

// For Text Fields the initialState function will only return an object.
var createInitialState = function createInitialState(typeSpecific, componentSpecific) {
  return function () {
    return Object.assign({}, typeSpecific, componentSpecific);
  };
};

// When configuration is open, this is what is going to be displayed
/**
 * @method RenderConfigMode
 * @param  {Object} state : State
 * @param  {Function} update : State -> void // Will trigger a re-render
 */
var createRenderConfigMode = _curry(function (initialState, _ref) {
  var state = _ref.state;
  var update = _ref.update;

  return React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      null,
      React.createElement('input', {
        type: 'text',
        className: 'fl-fb-Field-editable',
        onChange: updateField$2(update, state, initialState, 'title'),
        defaultValue: state.title
      })
    ),
    React.createElement(state.htmlElement, {
      type: 'text',
      className: 'form-control',
      defaultValue: state.placeholder,
      onChange: updateField$2(update, state, initialState, 'placeholder')
    })
  );
});

var RenderFormMode$1 = function RenderFormMode$1(_ref2) {
  var state = _ref2.state;

  return React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      null,
      state.title
    ),
    React.createElement(state.htmlElement, {
      type: state.htmlInputType,
      className: 'form-control',
      placeholder: state.placeholder
    })
  );
};

function buildTextFieldConstructor(customTypeInfo) {
  var typeInfo = overshadow(templateTypeInfo, customTypeInfo);

  var initialState = createInitialState(typeInfo, componentFields$1);

  var RenderConfigMode = createRenderConfigMode(initialState());

  var FieldConstructor = {
    info: typeInfo,
    initialState: initialState,
    RenderConfigMode: RenderConfigMode,
    RenderFormMode: RenderFormMode$1
  };

  return FieldConstructor;
}

var TextBox = buildTextFieldConstructor({
  type: 'TextBox',
  displayName: 'Text Box',
  htmlInputType: 'text'
});

var TextBox$2 = buildTextFieldConstructor({
  type: 'TextArea',
  displayName: 'Text Area',
  htmlElement: 'textarea'
});

var EmailBox = buildTextFieldConstructor({
  type: 'EmailBox',
  displayName: 'Email Box',
  htmlInputType: 'email'
});

var TextBox$3 = buildTextFieldConstructor({
  type: 'NumberBox',
  displayName: 'Number Box',
  htmlInputType: 'number'
});

var TextBox$4 = buildTextFieldConstructor({
  type: 'TelephoneBox',
  displayName: 'Telephone Box',
  htmlInputType: 'tel'
});

/* globals xController */
//
// Field Types
function FormBuilder(container) {
  var components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  assert(container && container.nodeName, 'Invalid contianer: ' + container + '. Container must be an HTML element.');

  var defaultTypes = [RadioButtons, RadioButtons$2, Dropdown, TextBox, EmailBox, TextBox$4, TextBox$3, TextBox$2];

  var customFieldTypes = components.concat(defaultTypes);

  var exportFunc = void 0;
  ReactDOM.render(React.createElement(FormBuilder$2, {
    fieldTypes: customFieldTypes,
    exportState: function exportState(f) {
      return exportFunc = f;
    }
  }), container);

  this.exportState = function () {
    return exportFunc();
  };
}

return FormBuilder;

});

//# sourceMappingURL=fl-form-builder.js.map
