(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

//
//    ACTION CREATORS
//

const undo = _ => ({
  type: "undo"
});

/* eslint-env jasmine */

describe("Action", () => {
  describe("undo", () => {
    it("returns the correct action type", () => {
      const action = undo();
      expect(action.type).toEqual("undo");
    });
  });
});

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

/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
var _isArray$1 = Array.isArray || function _isArray$1(val) {
  return (val != null &&
          val.length >= 0 &&
          Object.prototype.toString.call(val) === '[object Array]');
};

/**
 * An optimized, private array `slice` implementation.
 *
 * @private
 * @param {Arguments|Array} args The array or arguments object to consider.
 * @param {Number} [from=0] The array index to slice from, inclusive.
 * @param {Number} [to=args.length] The array index to slice to, exclusive.
 * @return {Array} A new, sliced array.
 * @example
 *
 *      _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
 *
 *      var firstThreeArgs = function(a, b, c, d) {
 *        return _slice(arguments, 0, 3);
 *      };
 *      firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
 */
var _slice$1 = function _slice$1(args, from, to) {
  switch (arguments.length) {
    case 1: return _slice$1(args, 0, args.length);
    case 2: return _slice$1(args, from, args.length);
    default:
      var list = [];
      var idx = 0;
      var len = Math.max(0, Math.min(args.length, to) - from);
      while (idx < len) {
        list[idx] = args[from + idx];
        idx += 1;
      }
      return list;
  }
};

var _isArray = _isArray$1;
var _slice = _slice$1;


/**
 * Similar to hasMethod, this checks whether a function has a [methodname]
 * function. If it isn't an array it will execute that function otherwise it
 * will default to the ramda implementation.
 *
 * @private
 * @param {Function} fn ramda implemtation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */
var _checkForMethod$1 = function _checkForMethod$1(methodname, fn) {
  return function() {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    return (_isArray(obj) || typeof obj[methodname] !== 'function') ?
      fn.apply(this, arguments) :
      obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
  };
};

var _isPlaceholder$2 = function _isPlaceholder$2(a) {
  return a != null &&
         typeof a === 'object' &&
         a['@@functional/placeholder'] === true;
};

var _isPlaceholder$1 = _isPlaceholder$2;


/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
var _curry1$1 = function _curry1$1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder$1(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
};

var _curry1$3 = _curry1$1;
var _isPlaceholder$4 = _isPlaceholder$2;


/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
var _curry2$1 = function _curry2$1(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder$4(a) ? f2
             : _curry1$3(function(_b) { return fn(a, _b); });
      default:
        return _isPlaceholder$4(a) && _isPlaceholder$4(b) ? f2
             : _isPlaceholder$4(a) ? _curry1$3(function(_a) { return fn(_a, b); })
             : _isPlaceholder$4(b) ? _curry1$3(function(_b) { return fn(a, _b); })
             : fn(a, b);
    }
  };
};

var _curry1 = _curry1$1;
var _curry2 = _curry2$1;
var _isPlaceholder = _isPlaceholder$2;


/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
var _curry3$1 = function _curry3$1(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;
      case 1:
        return _isPlaceholder(a) ? f3
             : _curry2(function(_b, _c) { return fn(a, _b, _c); });
      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3
             : _isPlaceholder(a) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
             : _isPlaceholder(b) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
             : _curry1(function(_c) { return fn(a, b, _c); });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3
             : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function(_a, _b) { return fn(_a, _b, c); })
             : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function(_a, _c) { return fn(_a, b, _c); })
             : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function(_b, _c) { return fn(a, _b, _c); })
             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b, c); })
             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b, c); })
             : _isPlaceholder(c) ? _curry1(function(_c) { return fn(a, b, _c); })
             : fn(a, b, c);
    }
  };
};

var _checkForMethod = _checkForMethod$1;
var _curry3 = _curry3$1;


/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * Dispatches to the `slice` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */
var slice = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));

var _curry3$3 = _curry3$1;


/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the result of applying the given function to
 * the focused value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> (a -> a) -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.prop, R.lensIndex, R.lensProp
 * @example
 *
 *      var headLens = R.lensIndex(0);
 *
 *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
 */
var over = (function() {
  // `Identity` is a functor that holds a single value, where `map` simply
  // transforms the held value with the provided function.
  var Identity = function(x) {
    return {value: x, map: function(f) { return Identity(f(x)); }};
  };

  return _curry3$3(function over(lens, f, x) {
    // The value returned by the getter function is first transformed with `f`,
    // then set as the value of an `Identity`. This is then mapped over with the
    // setter function of the lens.
    return lens(function(y) { return Identity(f(y)); })(x).value;
  });
}());

var _curry1$4 = _curry1$1;


/**
 * Returns a function that always returns the given value. Note that for
 * non-primitives the value returned is a reference to the original value.
 *
 * This function is known as `const`, `constant`, or `K` (for K combinator) in
 * other languages and libraries.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      var t = R.always('Tee');
 *      t(); //=> 'Tee'
 */
var always$1 = _curry1$4(function always$1(val) {
  return function() {
    return val;
  };
});

var _curry3$4 = _curry3$1;
var always = always$1;
var over$1 = over;


/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the given value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> a -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.prop, R.lensIndex, R.lensProp
 * @example
 *
 *      var xLens = R.lensProp('x');
 *
 *      R.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}
 *      R.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}
 */
var set = _curry3$4(function set(lens, v, x) {
  return over$1(lens, always(v), x);
});

var _arity$1 = function _arity$1(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0: return function() { return fn.apply(this, arguments); };
    case 1: return function(a0) { return fn.apply(this, arguments); };
    case 2: return function(a0, a1) { return fn.apply(this, arguments); };
    case 3: return function(a0, a1, a2) { return fn.apply(this, arguments); };
    case 4: return function(a0, a1, a2, a3) { return fn.apply(this, arguments); };
    case 5: return function(a0, a1, a2, a3, a4) { return fn.apply(this, arguments); };
    case 6: return function(a0, a1, a2, a3, a4, a5) { return fn.apply(this, arguments); };
    case 7: return function(a0, a1, a2, a3, a4, a5, a6) { return fn.apply(this, arguments); };
    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) { return fn.apply(this, arguments); };
    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) { return fn.apply(this, arguments); };
    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) { return fn.apply(this, arguments); };
    default: throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
};

var _pipe$1 = function _pipe$1(f, g) {
  return function() {
    return g.call(this, f.apply(this, arguments));
  };
};

var _xwrap$1 = (function() {
  function XWrap(fn) {
    this.f = fn;
  }
  XWrap.prototype['@@transducer/init'] = function() {
    throw new Error('init not implemented on XWrap');
  };
  XWrap.prototype['@@transducer/result'] = function(acc) { return acc; };
  XWrap.prototype['@@transducer/step'] = function(acc, x) {
    return this.f(acc, x);
  };

  return function _xwrap$1(fn) { return new XWrap(fn); };
}());

var _arity$3 = _arity$1;
var _curry2$3 = _curry2$1;


/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      var log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 */
var bind$1 = _curry2$3(function bind$1(fn, thisObj) {
  return _arity$3(fn.length, function() {
    return fn.apply(thisObj, arguments);
  });
});

var _isString$1 = function _isString$1(x) {
  return Object.prototype.toString.call(x) === '[object String]';
};

var _curry1$5 = _curry1$1;
var _isArray$3 = _isArray$1;
var _isString = _isString$1;


/**
 * Tests whether or not an object is similar to an array.
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      R.isArrayLike([]); //=> true
 *      R.isArrayLike(true); //=> false
 *      R.isArrayLike({}); //=> false
 *      R.isArrayLike({length: 10}); //=> false
 *      R.isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */
var isArrayLike$1 = _curry1$5(function isArrayLike$1(x) {
  if (_isArray$3(x)) { return true; }
  if (!x) { return false; }
  if (typeof x !== 'object') { return false; }
  if (_isString(x)) { return false; }
  if (x.nodeType === 1) { return !!x.length; }
  if (x.length === 0) { return true; }
  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }
  return false;
});

var _xwrap = _xwrap$1;
var bind = bind$1;
var isArrayLike = isArrayLike$1;


var _reduce$1 = (function() {
  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf['@@transducer/step'](acc, list[idx]);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      idx += 1;
    }
    return xf['@@transducer/result'](acc);
  }

  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf['@@transducer/step'](acc, step.value);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      step = iter.next();
    }
    return xf['@@transducer/result'](acc);
  }

  function _methodReduce(xf, acc, obj) {
    return xf['@@transducer/result'](obj.reduce(bind(xf['@@transducer/step'], xf), acc));
  }

  var symIterator = (typeof Symbol !== 'undefined') ? Symbol.iterator : '@@iterator';
  return function _reduce$1(fn, acc, list) {
    if (typeof fn === 'function') {
      fn = _xwrap(fn);
    }
    if (isArrayLike(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list.reduce === 'function') {
      return _methodReduce(fn, acc, list);
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === 'function') {
      return _iterableReduce(fn, acc, list);
    }
    throw new TypeError('reduce: list must be array or iterable');
  };
}());

var _curry3$5 = _curry3$1;
var _reduce = _reduce$1;


/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * `R.reduced` to shortcut the iteration.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex
 * @example
 *
 *      var numbers = [1, 2, 3];
 *      var plus = (a, b) => a + b;
 *
 *      R.reduce(plus, 10, numbers); //=> 16
 */
var reduce$1 = _curry3$5(_reduce);

var _checkForMethod$3 = _checkForMethod$1;
var slice$1 = slice;


/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * Dispatches to the `slice` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.head, R.init, R.last
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */
var tail$1 = _checkForMethod$3('tail', slice$1(1, Infinity));

var _arity = _arity$1;
var _pipe = _pipe$1;
var reduce = reduce$1;
var tail = tail$1;


/**
 * Performs left-to-right function composition. The leftmost function may have
 * any arity; the remaining functions must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * **Note:** The result of pipe is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      var f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 */
var pipe = function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }
  return _arity(arguments[0].length,
                reduce(_pipe, arguments[0], tail(arguments)));
};

var _curry2$4 = _curry2$1;


/**
 * Returns a function that when supplied an object returns the indicated
 * property of that object, if it exists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig s -> {s: a} -> a | Undefined
 * @param {String} p The property name
 * @param {Object} obj The object to query
 * @return {*} The value at `obj.p`.
 * @see R.path
 * @example
 *
 *      R.prop('x', {x: 100}); //=> 100
 *      R.prop('x', {}); //=> undefined
 */
var prop$1 = _curry2$4(function prop$1(p, obj) { return obj[p]; });

var _isTransformer$1 = function _isTransformer$1(obj) {
  return typeof obj['@@transducer/step'] === 'function';
};

var _isArray$4 = _isArray$1;
var _isTransformer = _isTransformer$1;
var _slice$3 = _slice$1;


/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with [methodname], it will execute that
 * function (functor case). Otherwise, if it is a transformer, uses transducer
 * [xf] to return a new transformer (transducer case). Otherwise, it will
 * default to executing [fn].
 *
 * @private
 * @param {String} methodname property to check for a custom implementation
 * @param {Function} xf transducer to initialize if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */
var _dispatchable$1 = function _dispatchable$1(methodname, xf, fn) {
  return function() {
    var length = arguments.length;
    if (length === 0) {
      return fn();
    }
    var obj = arguments[length - 1];
    if (!_isArray$4(obj)) {
      var args = _slice$3(arguments, 0, length - 1);
      if (typeof obj[methodname] === 'function') {
        return obj[methodname].apply(obj, args);
      }
      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }
    return fn.apply(this, arguments);
  };
};

var _map$1 = function _map$1(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);
  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }
  return result;
};

var _xfBase$1 = {
  init: function() {
    return this.xf['@@transducer/init']();
  },
  result: function(result) {
    return this.xf['@@transducer/result'](result);
  }
};

var _curry2$7 = _curry2$1;
var _xfBase = _xfBase$1;


var _xmap$1 = (function() {
  function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XMap.prototype['@@transducer/init'] = _xfBase.init;
  XMap.prototype['@@transducer/result'] = _xfBase.result;
  XMap.prototype['@@transducer/step'] = function(result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
  };

  return _curry2$7(function _xmap$1(f, xf) { return new XMap(f, xf); });
}());

var _arity$5 = _arity$1;
var _isPlaceholder$5 = _isPlaceholder$2;


/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */
var _curryN$1 = function _curryN$1(length, received, fn) {
  return function() {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;
    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;
      if (combinedIdx < received.length &&
          (!_isPlaceholder$5(received[combinedIdx]) ||
           argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }
      combined[combinedIdx] = result;
      if (!_isPlaceholder$5(result)) {
        left -= 1;
      }
      combinedIdx += 1;
    }
    return left <= 0 ? fn.apply(this, combined)
                     : _arity$5(left, _curryN$1(length, combined, fn));
  };
};

var _arity$4 = _arity$1;
var _curry1$6 = _curry1$1;
var _curry2$8 = _curry2$1;
var _curryN = _curryN$1;


/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value `R.__` may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is `R.__`, the
 * following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      var sumArgs = (...args) => R.sum(args);
 *
 *      var curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
var curryN$1 = _curry2$8(function curryN$1(length, fn) {
  if (length === 1) {
    return _curry1$6(fn);
  }
  return _arity$4(length, _curryN(length, [], fn));
});

var _has$1 = function _has$1(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

var _has$3 = _has$1;


var _isArguments$1 = (function() {
  var toString = Object.prototype.toString;
  return toString.call(arguments) === '[object Arguments]' ?
    function _isArguments$1(x) { return toString.call(x) === '[object Arguments]'; } :
    function _isArguments$1(x) { return _has$3('callee', x); };
}());

var _curry1$7 = _curry1$1;
var _has = _has$1;
var _isArguments = _isArguments$1;


/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */
var keys$1 = (function() {
  // cover IE < 9 keys issues
  var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString',
                            'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  // Safari bug
  var hasArgsEnumBug = (function() {
    'use strict';
    return arguments.propertyIsEnumerable('length');
  }());

  var contains = function contains(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };

  return typeof Object.keys === 'function' && !hasArgsEnumBug ?
    _curry1$7(function keys$1(obj) {
      return Object(obj) !== obj ? [] : Object.keys(obj);
    }) :
    _curry1$7(function keys$1(obj) {
      if (Object(obj) !== obj) {
        return [];
      }
      var prop, nIdx;
      var ks = [];
      var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
      for (prop in obj) {
        if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
          ks[ks.length] = prop;
        }
      }
      if (hasEnumBug) {
        nIdx = nonEnumerableProps.length - 1;
        while (nIdx >= 0) {
          prop = nonEnumerableProps[nIdx];
          if (_has(prop, obj) && !contains(ks, prop)) {
            ks[ks.length] = prop;
          }
          nIdx -= 1;
        }
      }
      return ks;
    });
}());

var _curry2$6 = _curry2$1;
var _dispatchable = _dispatchable$1;
var _map = _map$1;
var _reduce$3 = _reduce$1;
var _xmap = _xmap$1;
var curryN = curryN$1;
var keys = keys$1;


/**
 * Takes a function and
 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
 * applies the function to each of the functor's values, and returns
 * a functor of the same shape.
 *
 * Ramda provides suitable `map` implementations for `Array` and `Object`,
 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
 *
 * Dispatches to the `map` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * Also treats functions as functors and will compose them together.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => (a -> b) -> f a -> f b
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {Array} list The list to be iterated over.
 * @return {Array} The new list.
 * @see R.transduce, R.addIndex
 * @example
 *
 *      var double = x => x * 2;
 *
 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 */
var map$1 = _curry2$6(_dispatchable('map', _xmap, function map$1(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case '[object Function]':
      return curryN(functor.length, function() {
        return fn.call(this, functor.apply(this, arguments));
      });
    case '[object Object]':
      return _reduce$3(function(acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys(functor));
    default:
      return _map(fn, functor);
  }
}));

var _curry2$5 = _curry2$1;
var map = map$1;


/**
 * Returns a lens for the given getter and setter functions. The getter "gets"
 * the value of the focus; the setter "sets" the value of the focus. The setter
 * should not mutate the data structure.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
 * @param {Function} getter
 * @param {Function} setter
 * @return {Lens}
 * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
 * @example
 *
 *      var xLens = R.lens(R.prop('x'), R.assoc('x'));
 *
 *      R.view(xLens, {x: 1, y: 2});            //=> 1
 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
 */
var lens$1 = _curry2$5(function lens$1(getter, setter) {
  return function(toFunctorFn) {
    return function(target) {
      return map(
        function(focus) {
          return setter(focus, target);
        },
        toFunctorFn(getter(target))
      );
    };
  };
});

var _curry1$8 = _curry1$1;
var curryN$3 = curryN$1;


/**
 * Returns a curried equivalent of the provided function. The curried function
 * has two unusual capabilities. First, its arguments needn't be provided one
 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value `R.__` may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is `R.__`, the
 * following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN
 * @example
 *
 *      var addFourNumbers = (a, b, c, d) => a + b + c + d;
 *
 *      var curriedAddFourNumbers = R.curry(addFourNumbers);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
var curry$1 = _curry1$8(function curry$1(fn) {
  return curryN$3(fn.length, fn);
});

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var seamlessImmutable = createCommonjsModule(function (module, exports) {
(function() {
  "use strict";

function immutableInit(config) {

  // https://github.com/facebook/react/blob/v15.0.1/src/isomorphic/classic/element/ReactElement.js#L21
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element');
  var REACT_ELEMENT_TYPE_FALLBACK = 0xeac7;

  var globalConfig = {
    use_static: false
  };
  if (isObject(config)) {
      if (config.use_static !== undefined) {
          globalConfig.use_static = Boolean(config.use_static);
      }
  }

  function isObject(data) {
    return (
      typeof data === 'object' &&
      !Array.isArray(data) &&
      data !== null
    );
  }

  function instantiateEmptyObject(obj) {
      var prototype = Object.getPrototypeOf(obj);
      if (!prototype) {
          return {};
      } else {
          return Object.create(prototype);
      }
  }

  function addPropertyTo(target, methodName, value) {
    Object.defineProperty(target, methodName, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });
  }

  function banProperty(target, methodName) {
    addPropertyTo(target, methodName, function() {
      throw new ImmutableError("The " + methodName +
        " method cannot be invoked on an Immutable data structure.");
    });
  }

  var immutabilityTag = "__immutable_invariants_hold";

  function addImmutabilityTag(target) {
    addPropertyTo(target, immutabilityTag, true);
  }

  function isImmutable(target) {
    if (typeof target === "object") {
      return target === null || Boolean(
        Object.getOwnPropertyDescriptor(target, immutabilityTag)
      );
    } else {
      // In JavaScript, only objects are even potentially mutable.
      // strings, numbers, null, and undefined are all naturally immutable.
      return true;
    }
  }

  function isEqual(a, b) {
    // Avoid false positives due to (NaN !== NaN) evaluating to true
    return (a === b || (a !== a && b !== b));
  }

  function isMergableObject(target) {
    return target !== null && typeof target === "object" && !(Array.isArray(target)) && !(target instanceof Date);
  }

  var mutatingObjectMethods = [
    "setPrototypeOf"
  ];

  var nonMutatingObjectMethods = [
    "keys"
  ];

  var mutatingArrayMethods = mutatingObjectMethods.concat([
    "push", "pop", "sort", "splice", "shift", "unshift", "reverse"
  ]);

  var nonMutatingArrayMethods = nonMutatingObjectMethods.concat([
    "map", "filter", "slice", "concat", "reduce", "reduceRight"
  ]);

  var mutatingDateMethods = mutatingObjectMethods.concat([
    "setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes", "setMonth", "setSeconds",
    "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes",
    "setUTCMonth", "setUTCSeconds", "setYear"
  ]);

  function ImmutableError(message) {
    var err       = new Error(message);
    // TODO: Consider `Object.setPrototypeOf(err, ImmutableError);`
    err.__proto__ = ImmutableError;

    return err;
  }
  ImmutableError.prototype = Error.prototype;

  function makeImmutable(obj, bannedMethods) {
    // Tag it so we can quickly tell it's immutable later.
    addImmutabilityTag(obj);

    {
      // Make all mutating methods throw exceptions.
      for (var index in bannedMethods) {
        if (bannedMethods.hasOwnProperty(index)) {
          banProperty(obj, bannedMethods[index]);
        }
      }

      // Freeze it and return it.
      Object.freeze(obj);
    }

    return obj;
  }

  function makeMethodReturnImmutable(obj, methodName) {
    var currentMethod = obj[methodName];

    addPropertyTo(obj, methodName, function() {
      return Immutable(currentMethod.apply(obj, arguments));
    });
  }

  function arraySet(idx, value, config) {
    var deep          = config && config.deep;

    if (idx in this) {
      if (deep && this[idx] !== value && isMergableObject(value) && isMergableObject(this[idx])) {
        value = Immutable.merge(this[idx], value, {deep: true, mode: 'replace'});
      }
      if (isEqual(this[idx], value)) {
        return this;
      }
    }

    var mutable = asMutableArray.call(this);
    mutable[idx] = Immutable(value);
    return makeImmutableArray(mutable);
  }

  var immutableEmptyArray = Immutable([]);

  function arraySetIn(pth, value, config) {
    var head = pth[0];

    if (pth.length === 1) {
      return arraySet.call(this, head, value, config);
    } else {
      var tail = pth.slice(1);
      var thisHead = this[head];
      var newValue;

      if (typeof(thisHead) === "object" && thisHead !== null) {
        // Might (validly) be object or array
        newValue = Immutable.setIn(thisHead, tail, value);
      } else {
        var nextHead = tail[0];
        // If the next path part is a number, then we are setting into an array, else an object.
        if (nextHead !== '' && isFinite(nextHead)) {
          newValue = arraySetIn.call(immutableEmptyArray, tail, value);
        } else {
          newValue = objectSetIn.call(immutableEmptyObject, tail, value);
        }
      }

      if (head in this && thisHead === newValue) {
        return this;
      }

      var mutable = asMutableArray.call(this);
      mutable[head] = newValue;
      return makeImmutableArray(mutable);
    }
  }

  function makeImmutableArray(array) {
    // Don't change their implementations, but wrap these functions to make sure
    // they always return an immutable value.
    for (var index in nonMutatingArrayMethods) {
      if (nonMutatingArrayMethods.hasOwnProperty(index)) {
        var methodName = nonMutatingArrayMethods[index];
        makeMethodReturnImmutable(array, methodName);
      }
    }

    if (!globalConfig.use_static) {
      addPropertyTo(array, "flatMap",  flatMap);
      addPropertyTo(array, "asObject", asObject);
      addPropertyTo(array, "asMutable", asMutableArray);
      addPropertyTo(array, "set", arraySet);
      addPropertyTo(array, "setIn", arraySetIn);
      addPropertyTo(array, "update", update);
      addPropertyTo(array, "updateIn", updateIn);
    }

    for(var i = 0, length = array.length; i < length; i++) {
      array[i] = Immutable(array[i]);
    }

    return makeImmutable(array, mutatingArrayMethods);
  }

  function makeImmutableDate(date) {
    if (!globalConfig.use_static) {
      addPropertyTo(date, "asMutable", asMutableDate);
    }

    return makeImmutable(date, mutatingDateMethods);
  }

  function asMutableDate() {
    return new Date(this.getTime());
  }

  /**
   * Effectively performs a map() over the elements in the array, using the
   * provided iterator, except that whenever the iterator returns an array, that
   * array's elements are added to the final result instead of the array itself.
   *
   * @param {function} iterator - The iterator function that will be invoked on each element in the array. It will receive three arguments: the current value, the current index, and the current object.
   */
  function flatMap(iterator) {
    // Calling .flatMap() with no arguments is a no-op. Don't bother cloning.
    if (arguments.length === 0) {
      return this;
    }

    var result = [],
        length = this.length,
        index;

    for (index = 0; index < length; index++) {
      var iteratorResult = iterator(this[index], index, this);

      if (Array.isArray(iteratorResult)) {
        // Concatenate Array results into the return value we're building up.
        result.push.apply(result, iteratorResult);
      } else {
        // Handle non-Array results the same way map() does.
        result.push(iteratorResult);
      }
    }

    return makeImmutableArray(result);
  }

  /**
   * Returns an Immutable copy of the object without the given keys included.
   *
   * @param {array} keysToRemove - A list of strings representing the keys to exclude in the return value. Instead of providing a single array, this method can also be called by passing multiple strings as separate arguments.
   */
  function without(remove) {
    // Calling .without() with no arguments is a no-op. Don't bother cloning.
    if (typeof remove === "undefined" && arguments.length === 0) {
      return this;
    }

    if (typeof remove !== "function") {
      // If we weren't given an array, use the arguments list.
      var keysToRemoveArray = (Array.isArray(remove)) ?
         remove.slice() : Array.prototype.slice.call(arguments);

      // Convert numeric keys to strings since that's how they'll
      // come from the enumeration of the object.
      keysToRemoveArray.forEach(function(el, idx, arr) {
        if(typeof(el) === "number") {
          arr[idx] = el.toString();
        }
      });

      remove = function(val, key) {
        return keysToRemoveArray.indexOf(key) !== -1;
      };
    }

    var result = instantiateEmptyObject(this);

    for (var key in this) {
      if (this.hasOwnProperty(key) && remove(this[key], key) === false) {
        result[key] = this[key];
      }
    }

    return makeImmutableObject(result);
  }

  function asMutableArray(opts) {
    var result = [], i, length;

    if(opts && opts.deep) {
      for(i = 0, length = this.length; i < length; i++) {
        result.push(asDeepMutable(this[i]));
      }
    } else {
      for(i = 0, length = this.length; i < length; i++) {
        result.push(this[i]);
      }
    }

    return result;
  }

  /**
   * Effectively performs a [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) over the elements in the array, expecting that the iterator function
   * will return an array of two elements - the first representing a key, the other
   * a value. Then returns an Immutable Object constructed of those keys and values.
   *
   * @param {function} iterator - A function which should return an array of two elements - the first representing the desired key, the other the desired value.
   */
  function asObject(iterator) {
    // If no iterator was provided, assume the identity function
    // (suggesting this array is already a list of key/value pairs.)
    if (typeof iterator !== "function") {
      iterator = function(value) { return value; };
    }

    var result = {},
        length = this.length,
        index;

    for (index = 0; index < length; index++) {
      var pair  = iterator(this[index], index, this),
          key   = pair[0],
          value = pair[1];

      result[key] = value;
    }

    return makeImmutableObject(result);
  }

  function asDeepMutable(obj) {
    if (
      (!obj) ||
      (typeof obj !== 'object') ||
      (!Object.getOwnPropertyDescriptor(obj, immutabilityTag)) ||
      (obj instanceof Date)
    ) { return obj; }
    return Immutable.asMutable(obj, {deep: true});
  }

  function quickCopy(src, dest) {
    for (var key in src) {
      if (Object.getOwnPropertyDescriptor(src, key)) {
        dest[key] = src[key];
      }
    }

    return dest;
  }

  /**
   * Returns an Immutable Object containing the properties and values of both
   * this object and the provided object, prioritizing the provided object's
   * values whenever the same key is present in both objects.
   *
   * @param {object} other - The other object to merge. Multiple objects can be passed as an array. In such a case, the later an object appears in that list, the higher its priority.
   * @param {object} config - Optional config object that contains settings. Supported settings are: {deep: true} for deep merge and {merger: mergerFunc} where mergerFunc is a function
   *                          that takes a property from both objects. If anything is returned it overrides the normal merge behaviour.
   */
  function merge(other, config) {
    // Calling .merge() with no arguments is a no-op. Don't bother cloning.
    if (arguments.length === 0) {
      return this;
    }

    if (other === null || (typeof other !== "object")) {
      throw new TypeError("Immutable#merge can only be invoked with objects or arrays, not " + JSON.stringify(other));
    }

    var receivedArray = (Array.isArray(other)),
        deep          = config && config.deep,
        mode          = config && config.mode || 'merge',
        merger        = config && config.merger,
        result;

    // Use the given key to extract a value from the given object, then place
    // that value in the result object under the same key. If that resulted
    // in a change from this object's value at that key, set anyChanges = true.
    function addToResult(currentObj, otherObj, key) {
      var immutableValue = Immutable(otherObj[key]);
      var mergerResult = merger && merger(currentObj[key], immutableValue, config);
      var currentValue = currentObj[key];

      if ((result !== undefined) ||
        (mergerResult !== undefined) ||
        (!currentObj.hasOwnProperty(key)) ||
        !isEqual(immutableValue, currentValue)) {

        var newValue;

        if (mergerResult) {
          newValue = mergerResult;
        } else if (deep && isMergableObject(currentValue) && isMergableObject(immutableValue)) {
          newValue = Immutable.merge(currentValue, immutableValue, config);
        } else {
          newValue = immutableValue;
        }

        if (!isEqual(currentValue, newValue) || !currentObj.hasOwnProperty(key)) {
          if (result === undefined) {
            // Make a shallow clone of the current object.
            result = quickCopy(currentObj, instantiateEmptyObject(currentObj));
          }

          result[key] = newValue;
        }
      }
    }

    function clearDroppedKeys(currentObj, otherObj) {
      for (var key in currentObj) {
        if (!otherObj.hasOwnProperty(key)) {
          if (result === undefined) {
            // Make a shallow clone of the current object.
            result = quickCopy(currentObj, instantiateEmptyObject(currentObj));
          }
          delete result[key];
        }
      }
    }

    var key;

    // Achieve prioritization by overriding previous values that get in the way.
    if (!receivedArray) {
      // The most common use case: just merge one object into the existing one.
      for (key in other) {
        if (Object.getOwnPropertyDescriptor(other, key)) {
          addToResult(this, other, key);
        }
      }
      if (mode === 'replace') {
        clearDroppedKeys(this, other);
      }
    } else {
      // We also accept an Array
      for (var index = 0, length = other.length; index < length; index++) {
        var otherFromArray = other[index];

        for (key in otherFromArray) {
          if (otherFromArray.hasOwnProperty(key)) {
            addToResult(result !== undefined ? result : this, otherFromArray, key);
          }
        }
      }
    }

    if (result === undefined) {
      return this;
    } else {
      return makeImmutableObject(result);
    }
  }

  function objectReplace(value, config) {
    var deep          = config && config.deep;

    // Calling .replace() with no arguments is a no-op. Don't bother cloning.
    if (arguments.length === 0) {
      return this;
    }

    if (value === null || typeof value !== "object") {
      throw new TypeError("Immutable#replace can only be invoked with objects or arrays, not " + JSON.stringify(value));
    }

    return Immutable.merge(this, value, {deep: deep, mode: 'replace'});
  }

  var immutableEmptyObject = Immutable({});

  function objectSetIn(path, value, config) {
    if (!(path instanceof Array) || path.length === 0) {
      throw new TypeError("The first argument to Immutable#setIn must be an array containing at least one \"key\" string.");
    }

    var head = path[0];
    if (path.length === 1) {
      return objectSet.call(this, head, value, config);
    }

    var tail = path.slice(1);
    var newValue;
    var thisHead = this[head];

    if (this.hasOwnProperty(head) && typeof(thisHead) === "object" && thisHead !== null) {
      // Might (validly) be object or array
      newValue = Immutable.setIn(thisHead, tail, value);
    } else {
      newValue = objectSetIn.call(immutableEmptyObject, tail, value);
    }

    if (this.hasOwnProperty(head) && thisHead === newValue) {
      return this;
    }

    var mutable = quickCopy(this, instantiateEmptyObject(this));
    mutable[head] = newValue;
    return makeImmutableObject(mutable);
  }

  function objectSet(property, value, config) {
    var deep          = config && config.deep;

    if (this.hasOwnProperty(property)) {
      if (deep && this[property] !== value && isMergableObject(value) && isMergableObject(this[property])) {
        value = Immutable.merge(this[property], value, {deep: true, mode: 'replace'});
      }
      if (isEqual(this[property], value)) {
        return this;
      }
    }

    var mutable = quickCopy(this, instantiateEmptyObject(this));
    mutable[property] = Immutable(value);
    return makeImmutableObject(mutable);
  }

  function update(property, updater) {
    var restArgs = Array.prototype.slice.call(arguments, 2);
    var initialVal = this[property];
    return Immutable.set(this, property, updater.apply(initialVal, [initialVal].concat(restArgs)));
  }

  function getInPath(obj, path) {
    /*jshint eqnull:true */
    for (var i = 0, l = path.length; obj != null && i < l; i++) {
      obj = obj[path[i]];
    }

    return (i && i == l) ? obj : undefined;
  }

  function updateIn(path, updater) {
    var restArgs = Array.prototype.slice.call(arguments, 2);
    var initialVal = getInPath(this, path);

    return Immutable.setIn(this, path, updater.apply(initialVal, [initialVal].concat(restArgs)));
  }

  function asMutableObject(opts) {
    var result = instantiateEmptyObject(this), key;

    if(opts && opts.deep) {
      for (key in this) {
        if (this.hasOwnProperty(key)) {
          result[key] = asDeepMutable(this[key]);
        }
      }
    } else {
      for (key in this) {
        if (this.hasOwnProperty(key)) {
          result[key] = this[key];
        }
      }
    }

    return result;
  }

  // Creates plain object to be used for cloning
  function instantiatePlainObject() {
    return {};
  }

  // Finalizes an object with immutable methods, freezes it, and returns it.
  function makeImmutableObject(obj) {
    if (!globalConfig.use_static) {
      addPropertyTo(obj, "merge", merge);
      addPropertyTo(obj, "replace", objectReplace);
      addPropertyTo(obj, "without", without);
      addPropertyTo(obj, "asMutable", asMutableObject);
      addPropertyTo(obj, "set", objectSet);
      addPropertyTo(obj, "setIn", objectSetIn);
      addPropertyTo(obj, "update", update);
      addPropertyTo(obj, "updateIn", updateIn);
    }

    return makeImmutable(obj, mutatingObjectMethods);
  }

  // Returns true if object is a valid react element
  // https://github.com/facebook/react/blob/v15.0.1/src/isomorphic/classic/element/ReactElement.js#L326
  function isReactElement(obj) {
    return typeof obj === 'object' &&
           obj !== null &&
           (obj.$$typeof === REACT_ELEMENT_TYPE_FALLBACK || obj.$$typeof === REACT_ELEMENT_TYPE);
  }

  function isFileObject(obj) {
    return typeof File !== 'undefined' &&
           obj instanceof File;
  }

  function Immutable(obj, options, stackRemaining) {
    if (isImmutable(obj) || isReactElement(obj) || isFileObject(obj)) {
      return obj;
    } else if (Array.isArray(obj)) {
      return makeImmutableArray(obj.slice());
    } else if (obj instanceof Date) {
      return makeImmutableDate(new Date(obj.getTime()));
    } else {
      // Don't freeze the object we were given; make a clone and use that.
      var prototype = options && options.prototype;
      var instantiateEmptyObject =
        (!prototype || prototype === Object.prototype) ?
          instantiatePlainObject : (function() { return Object.create(prototype); });
      var clone = instantiateEmptyObject();

      {
        /*jshint eqnull:true */
        if (stackRemaining == null) {
          stackRemaining = 64;
        }
        if (stackRemaining <= 0) {
          throw new ImmutableError("Attempt to construct Immutable from a deeply nested object was detected." +
            " Have you tried to wrap an object with circular references (e.g. React element)?" +
            " See https://github.com/rtfeldman/seamless-immutable/wiki/Deeply-nested-object-was-detected for details.");
        }
        stackRemaining -= 1;
      }

      for (var key in obj) {
        if (Object.getOwnPropertyDescriptor(obj, key)) {
          clone[key] = Immutable(obj[key], undefined, stackRemaining);
        }
      }

      return makeImmutableObject(clone);
    }
  }

  // Wrapper to allow the use of object methods as static methods of Immutable.
  function toStatic(fn) {
    function staticWrapper() {
      var args = [].slice.call(arguments);
      var self = args.shift();
      return fn.apply(self, args);
    }

    return staticWrapper;
  }

  // Wrapper to allow the use of object methods as static methods of Immutable.
  // with the additional condition of choosing which function to call depending
  // if argument is an array or an object.
  function toStaticObjectOrArray(fnObject, fnArray) {
    function staticWrapper() {
      var args = [].slice.call(arguments);
      var self = args.shift();
      if (Array.isArray(self)) {
          return fnArray.apply(self, args);
      } else {
          return fnObject.apply(self, args);
      }
    }

    return staticWrapper;
  }

  // Wrapper to allow the use of object methods as static methods of Immutable.
  // with the additional condition of choosing which function to call depending
  // if argument is an array or an object or a date.
  function toStaticObjectOrDateOrArray(fnObject, fnArray, fnDate) {
    function staticWrapper() {
      var args = [].slice.call(arguments);
      var self = args.shift();
      if (Array.isArray(self)) {
          return fnArray.apply(self, args);
      } else if (self instanceof Date) {
          return fnDate.apply(self, args);
      } else {
          return fnObject.apply(self, args);
      }
    }

    return staticWrapper;
  }

  // Export the library
  Immutable.from           = Immutable;
  Immutable.isImmutable    = isImmutable;
  Immutable.ImmutableError = ImmutableError;
  Immutable.merge          = toStatic(merge);
  Immutable.replace        = toStatic(objectReplace);
  Immutable.without        = toStatic(without);
  Immutable.asMutable      = toStaticObjectOrDateOrArray(asMutableObject, asMutableArray, asMutableDate);
  Immutable.set            = toStaticObjectOrArray(objectSet, arraySet);
  Immutable.setIn          = toStaticObjectOrArray(objectSetIn, arraySetIn);
  Immutable.update         = toStatic(update);
  Immutable.updateIn       = toStatic(updateIn);
  Immutable.flatMap        = toStatic(flatMap);
  Immutable.asObject       = toStatic(asObject);
  if (!globalConfig.use_static) {
      Immutable.static = immutableInit({
          use_static: true
      });
  }

  Object.freeze(Immutable);

  return Immutable;
}

  var Immutable = immutableInit();
  /* istanbul ignore if */
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return Immutable;
    });
  } else if (typeof module === "object") {
    module.exports = Immutable;
  } else if (typeof exports === "object") {
    exports.Immutable = Immutable;
  } else if (typeof window === "object") {
    window.Immutable = Immutable;
  } else if (typeof commonjsGlobal === "object") {
    commonjsGlobal.Immutable = Immutable;
  }
})();
});

/* eslint-disable new-cap */

const updateAt = curry$1((keyArray, newVal, obj) => {
  const deepNewVal = keyArray.reduceRight((result, key) => ({ [key]: result }), newVal);

  return seamlessImmutable(obj).merge(deepNewVal, { deep: true });
});

// State lenses
const StateLenses = {
  fieldTypes: lens$1(prop$1('fieldTypes'), updateAt(['fieldTypes'])),
  fieldsState: lens$1(prop$1('fieldsState'), updateAt(['fieldsState'])),
  fieldsStateHistory: lens$1(prop$1('fieldsStateHistory'), updateAt(['fieldsStateHistory']))
};

const undo$1 = (state, _) => pipe(
// Make last history last state the current one
set(StateLenses.fieldsState, state.fieldsStateHistory[0]),
// Remove last history state from the history array
over(StateLenses.fieldsStateHistory, slice(1, Infinity)))(state);

/* eslint-disable no-nested-ternary */
const actionHandlers = {
  undo: undo$1
};

const isExpectedAction = a => a && a.type && actionHandlers[a.type];
const isReduxAction = a => a && a.type && a.type.includes('@@redux');

const update = (state, action) => isExpectedAction(action) ? actionHandlers[action.type](state, action) : isReduxAction(action) ? state : assert(false, `Invalid action type: ${ action.type }`);

/* eslint-env jasmine */

const currentFieldsState = ["current"];
const oldFieldsState = ["old"];
const mockState = {
  fieldTypes: [],
  fieldsState: currentFieldsState,
  fieldsStateHistory: [oldFieldsState]
};

describe("Update.undo", () => {
  it("removes first old state from history", () => {
    const modifiedState = update(mockState, undo());
    expect(modifiedState.fieldsStateHistory.length).toEqual(0);
  });

  it("sets first old state as current state", () => {
    const modifiedState = update(mockState, undo());
    expect(modifiedState.fieldsState).toEqual(oldFieldsState);
  });
});

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL2pzL0FjdGlvbnMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy9hY3Rpb25zLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZmwtYXNzZXJ0L2Rpc3QvYXNzZXJ0LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc0FycmF5LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19zbGljZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fY2hlY2tGb3JNZXRob2QuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lzUGxhY2Vob2xkZXIuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2N1cnJ5MS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fY3VycnkyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jdXJyeTMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2xpY2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvb3Zlci5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9hbHdheXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2V0LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19hcml0eS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fcGlwZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feHdyYXAuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvYmluZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9faXNTdHJpbmcuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaXNBcnJheUxpa2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3JlZHVjZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9yZWR1Y2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvdGFpbC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9waXBlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL3Byb3AuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lzVHJhbnNmb3JtZXIuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2Rpc3BhdGNoYWJsZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fbWFwLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL194ZkJhc2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3htYXAuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2N1cnJ5Ti5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9jdXJyeU4uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2hhcy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9faXNBcmd1bWVudHMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMva2V5cy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9tYXAuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvbGVucy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9jdXJyeS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3NlYW1sZXNzLWltbXV0YWJsZS9zcmMvc2VhbWxlc3MtaW1tdXRhYmxlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL3V0aWxzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL3VuZG8uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvaW5kZXguanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy91cGRhdGUudW5kby5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvL1xuLy8gICAgQUNUSU9OIENSRUFUT1JTXG4vL1xuXG5leHBvcnQgY29uc3QgdW5kbyA9IF8gPT5cbih7XG4gIHR5cGU6IFwidW5kb1wiLFxufSk7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHsgdW5kbyB9IGZyb20gXCIuLi9qcy9BY3Rpb25zXCI7XG5cbmRlc2NyaWJlKFwiQWN0aW9uXCIsICgpID0+IHtcbiAgZGVzY3JpYmUoXCJ1bmRvXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gdW5kbygpO1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwidW5kb1wiKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiIsIi8vIEJ1ZyBjaGVja2luZyBmdW5jdGlvbiB0aGF0IHdpbGwgdGhyb3cgYW4gZXJyb3Igd2hlbmV2ZXJcbi8vIHRoZSBjb25kaXRpb24gc2VudCB0byBpdCBpcyBldmFsdWF0ZWQgdG8gZmFsc2Vcbi8qKlxuICogUHJvY2Vzc2VzIHRoZSBtZXNzYWdlIGFuZCBvdXRwdXRzIHRoZSBjb3JyZWN0IG1lc3NhZ2UgaWYgdGhlIGNvbmRpdGlvblxuICogaXMgZmFsc2UuIE90aGVyd2lzZSBpdCBvdXRwdXRzIG51bGwuXG4gKiBAYXBpIHByaXZhdGVcbiAqIEBtZXRob2QgcHJvY2Vzc0NvbmRpdGlvblxuICogQHBhcmFtICB7Qm9vbGVhbn0gY29uZGl0aW9uIC0gUmVzdWx0IG9mIHRoZSBldmFsdWF0ZWQgY29uZGl0aW9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGVycm9yTWVzc2FnZSAtIE1lc3NhZ2UgZXhwbGFpbmlnIHRoZSBlcnJvciBpbiBjYXNlIGl0IGlzIHRocm93blxuICogQHJldHVybiB7U3RyaW5nIHwgbnVsbH0gIC0gRXJyb3IgbWVzc2FnZSBpZiB0aGVyZSBpcyBhbiBlcnJvciwgbnVsIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc0NvbmRpdGlvbihjb25kaXRpb24sIGVycm9yTWVzc2FnZSkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBjb21wbGV0ZUVycm9yTWVzc2FnZSA9ICcnO1xuICAgIHZhciByZSA9IC9hdCAoW15cXHNdKylcXHNcXCgvZztcbiAgICB2YXIgc3RhY2tUcmFjZSA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICAgIHZhciBzdGFja0Z1bmN0aW9ucyA9IFtdO1xuXG4gICAgdmFyIGZ1bmNOYW1lID0gcmUuZXhlYyhzdGFja1RyYWNlKTtcbiAgICB3aGlsZSAoZnVuY05hbWUgJiYgZnVuY05hbWVbMV0pIHtcbiAgICAgIHN0YWNrRnVuY3Rpb25zLnB1c2goZnVuY05hbWVbMV0pO1xuICAgICAgZnVuY05hbWUgPSByZS5leGVjKHN0YWNrVHJhY2UpO1xuICAgIH1cblxuICAgIC8vIE51bWJlciAwIGlzIHByb2Nlc3NDb25kaXRpb24gaXRzZWxmLFxuICAgIC8vIE51bWJlciAxIGlzIGFzc2VydCxcbiAgICAvLyBOdW1iZXIgMiBpcyB0aGUgY2FsbGVyIGZ1bmN0aW9uLlxuICAgIGlmIChzdGFja0Z1bmN0aW9uc1syXSkge1xuICAgICAgY29tcGxldGVFcnJvck1lc3NhZ2UgPSBzdGFja0Z1bmN0aW9uc1syXSArICc6ICcgKyBjb21wbGV0ZUVycm9yTWVzc2FnZTtcbiAgICB9XG5cbiAgICBjb21wbGV0ZUVycm9yTWVzc2FnZSArPSBlcnJvck1lc3NhZ2U7XG4gICAgcmV0dXJuIGNvbXBsZXRlRXJyb3JNZXNzYWdlO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBib29sZWFuIHBhc3NlZCB0byBpdCBldmFsdWF0ZXMgdG8gZmFsc2UuXG4gKiBUbyBiZSB1c2VkIGxpa2UgdGhpczpcbiAqIFx0XHRhc3NlcnQobXlEYXRlICE9PSB1bmRlZmluZWQsIFwiRGF0ZSBjYW5ub3QgYmUgdW5kZWZpbmVkLlwiKTtcbiAqIEBhcGkgcHVibGljXG4gKiBAbWV0aG9kIGFzc2VydFxuICogQHBhcmFtICB7Qm9vbGVhbn0gY29uZGl0aW9uIC0gUmVzdWx0IG9mIHRoZSBldmFsdWF0ZWQgY29uZGl0aW9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGVycm9yTWVzc2FnZSAtIE1lc3NhZ2UgZXhwbGFpbmlnIHRoZSBlcnJvciBpbiBjYXNlIGl0IGlzIHRocm93blxuICogQHJldHVybiB2b2lkXG4gKi9cbmZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIGVycm9yTWVzc2FnZSkge1xuICB2YXIgZXJyb3IgPSBwcm9jZXNzQ29uZGl0aW9uKGNvbmRpdGlvbiwgZXJyb3JNZXNzYWdlKTtcbiAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICB9XG59XG5cbi8qKlxuICogTG9ncyBhIHdhcm5pbmcgaWYgdGhlIGJvb2xlYW4gcGFzc2VkIHRvIGl0IGV2YWx1YXRlcyB0byBmYWxzZS5cbiAqIFRvIGJlIHVzZWQgbGlrZSB0aGlzOlxuICogXHRcdGFzc2VydC53YXJuKG15RGF0ZSAhPT0gdW5kZWZpbmVkLCBcIk5vIGRhdGUgcHJvdmlkZWQuXCIpO1xuICogQGFwaSBwdWJsaWNcbiAqIEBtZXRob2Qgd2FyblxuICogQHBhcmFtICB7Qm9vbGVhbn0gY29uZGl0aW9uIC0gUmVzdWx0IG9mIHRoZSBldmFsdWF0ZWQgY29uZGl0aW9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGVycm9yTWVzc2FnZSAtIE1lc3NhZ2UgZXhwbGFpbmlnIHRoZSBlcnJvciBpbiBjYXNlIGl0IGlzIHRocm93blxuICogQHJldHVybiB2b2lkXG4gKi9cbmFzc2VydC53YXJuID0gZnVuY3Rpb24gd2Fybihjb25kaXRpb24sIGVycm9yTWVzc2FnZSkge1xuICB2YXIgZXJyb3IgPSBwcm9jZXNzQ29uZGl0aW9uKGNvbmRpdGlvbiwgZXJyb3JNZXNzYWdlKTtcbiAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zb2xlLndhcm4oZXJyb3IpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhc3NlcnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaUlpd2ljMjkxY21ObGN5STZXeUpoYzNObGNuUXVhbk1pWFN3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5OGdRblZuSUdOb1pXTnJhVzVuSUdaMWJtTjBhVzl1SUhSb1lYUWdkMmxzYkNCMGFISnZkeUJoYmlCbGNuSnZjaUIzYUdWdVpYWmxjbHh1THk4Z2RHaGxJR052Ym1ScGRHbHZiaUJ6Wlc1MElIUnZJR2wwSUdseklHVjJZV3gxWVhSbFpDQjBieUJtWVd4elpWeHVMeW9xWEc0Z0tpQlFjbTlqWlhOelpYTWdkR2hsSUcxbGMzTmhaMlVnWVc1a0lHOTFkSEIxZEhNZ2RHaGxJR052Y25KbFkzUWdiV1Z6YzJGblpTQnBaaUIwYUdVZ1kyOXVaR2wwYVc5dVhHNGdLaUJwY3lCbVlXeHpaUzRnVDNSb1pYSjNhWE5sSUdsMElHOTFkSEIxZEhNZ2JuVnNiQzVjYmlBcUlFQmhjR2tnY0hKcGRtRjBaVnh1SUNvZ1FHMWxkR2h2WkNCd2NtOWpaWE56UTI5dVpHbDBhVzl1WEc0Z0tpQkFjR0Z5WVcwZ0lIdENiMjlzWldGdWZTQmpiMjVrYVhScGIyNGdMU0JTWlhOMWJIUWdiMllnZEdobElHVjJZV3gxWVhSbFpDQmpiMjVrYVhScGIyNWNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnWlhKeWIzSk5aWE56WVdkbElDMGdUV1Z6YzJGblpTQmxlSEJzWVdsdWFXY2dkR2hsSUdWeWNtOXlJR2x1SUdOaGMyVWdhWFFnYVhNZ2RHaHliM2R1WEc0Z0tpQkFjbVYwZFhKdUlIdFRkSEpwYm1jZ2ZDQnVkV3hzZlNBZ0xTQkZjbkp2Y2lCdFpYTnpZV2RsSUdsbUlIUm9aWEpsSUdseklHRnVJR1Z5Y205eUxDQnVkV3dnYjNSb1pYSjNhWE5sTGx4dUlDb3ZYRzVtZFc1amRHbHZiaUJ3Y205alpYTnpRMjl1WkdsMGFXOXVLR052Ym1ScGRHbHZiaXdnWlhKeWIzSk5aWE56WVdkbEtTQjdYRzRnSUdsbUlDZ2hZMjl1WkdsMGFXOXVLU0I3WEc0Z0lDQWdiR1YwSUdOdmJYQnNaWFJsUlhKeWIzSk5aWE56WVdkbElEMGdKeWM3WEc0Z0lDQWdZMjl1YzNRZ2NtVWdQU0F2WVhRZ0tGdGVYRnh6WFNzcFhGeHpYRndvTDJjN1hHNGdJQ0FnWTI5dWMzUWdjM1JoWTJ0VWNtRmpaU0E5SUc1bGR5QkZjbkp2Y2lncExuTjBZV05yTzF4dUlDQWdJR052Ym5OMElITjBZV05yUm5WdVkzUnBiMjV6SUQwZ1cxMDdYRzVjYmlBZ0lDQnNaWFFnWm5WdVkwNWhiV1VnUFNCeVpTNWxlR1ZqS0hOMFlXTnJWSEpoWTJVcE8xeHVJQ0FnSUhkb2FXeGxJQ2htZFc1alRtRnRaU0FtSmlCbWRXNWpUbUZ0WlZzeFhTa2dlMXh1SUNBZ0lDQWdjM1JoWTJ0R2RXNWpkR2x2Ym5NdWNIVnphQ2htZFc1alRtRnRaVnN4WFNrN1hHNGdJQ0FnSUNCbWRXNWpUbUZ0WlNBOUlISmxMbVY0WldNb2MzUmhZMnRVY21GalpTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdUblZ0WW1WeUlEQWdhWE1nY0hKdlkyVnpjME52Ym1ScGRHbHZiaUJwZEhObGJHWXNYRzRnSUNBZ0x5OGdUblZ0WW1WeUlERWdhWE1nWVhOelpYSjBMRnh1SUNBZ0lDOHZJRTUxYldKbGNpQXlJR2x6SUhSb1pTQmpZV3hzWlhJZ1puVnVZM1JwYjI0dVhHNGdJQ0FnYVdZZ0tITjBZV05yUm5WdVkzUnBiMjV6V3pKZEtTQjdYRzRnSUNBZ0lDQmpiMjF3YkdWMFpVVnljbTl5VFdWemMyRm5aU0E5SUdBa2UzTjBZV05yUm5WdVkzUnBiMjV6V3pKZGZUb2dKSHRqYjIxd2JHVjBaVVZ5Y205eVRXVnpjMkZuWlgxZ08xeHVJQ0FnSUgxY2JseHVJQ0FnSUdOdmJYQnNaWFJsUlhKeWIzSk5aWE56WVdkbElDczlJR1Z5Y205eVRXVnpjMkZuWlR0Y2JpQWdJQ0J5WlhSMWNtNGdZMjl0Y0d4bGRHVkZjbkp2Y2sxbGMzTmhaMlU3WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnYm5Wc2JEdGNibjFjYmx4dUx5b3FYRzRnS2lCVWFISnZkM01nWVc0Z1pYSnliM0lnYVdZZ2RHaGxJR0p2YjJ4bFlXNGdjR0Z6YzJWa0lIUnZJR2wwSUdWMllXeDFZWFJsY3lCMGJ5Qm1ZV3h6WlM1Y2JpQXFJRlJ2SUdKbElIVnpaV1FnYkdsclpTQjBhR2x6T2x4dUlDb2dYSFJjZEdGemMyVnlkQ2h0ZVVSaGRHVWdJVDA5SUhWdVpHVm1hVzVsWkN3Z1hDSkVZWFJsSUdOaGJtNXZkQ0JpWlNCMWJtUmxabWx1WldRdVhDSXBPMXh1SUNvZ1FHRndhU0J3ZFdKc2FXTmNiaUFxSUVCdFpYUm9iMlFnWVhOelpYSjBYRzRnS2lCQWNHRnlZVzBnSUh0Q2IyOXNaV0Z1ZlNCamIyNWthWFJwYjI0Z0xTQlNaWE4xYkhRZ2IyWWdkR2hsSUdWMllXeDFZWFJsWkNCamIyNWthWFJwYjI1Y2JpQXFJRUJ3WVhKaGJTQWdlMU4wY21sdVozMGdaWEp5YjNKTlpYTnpZV2RsSUMwZ1RXVnpjMkZuWlNCbGVIQnNZV2x1YVdjZ2RHaGxJR1Z5Y205eUlHbHVJR05oYzJVZ2FYUWdhWE1nZEdoeWIzZHVYRzRnS2lCQWNtVjBkWEp1SUhadmFXUmNiaUFxTDF4dVpuVnVZM1JwYjI0Z1lYTnpaWEowS0dOdmJtUnBkR2x2Yml3Z1pYSnliM0pOWlhOellXZGxLU0I3WEc0Z0lHTnZibk4wSUdWeWNtOXlJRDBnY0hKdlkyVnpjME52Ym1ScGRHbHZiaWhqYjI1a2FYUnBiMjRzSUdWeWNtOXlUV1Z6YzJGblpTazdYRzRnSUdsbUlDaDBlWEJsYjJZZ1pYSnliM0lnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0dWeWNtOXlLVHRjYmlBZ2ZWeHVmVnh1WEc0dktpcGNiaUFxSUV4dlozTWdZU0IzWVhKdWFXNW5JR2xtSUhSb1pTQmliMjlzWldGdUlIQmhjM05sWkNCMGJ5QnBkQ0JsZG1Gc2RXRjBaWE1nZEc4Z1ptRnNjMlV1WEc0Z0tpQlVieUJpWlNCMWMyVmtJR3hwYTJVZ2RHaHBjenBjYmlBcUlGeDBYSFJoYzNObGNuUXVkMkZ5YmlodGVVUmhkR1VnSVQwOUlIVnVaR1ZtYVc1bFpDd2dYQ0pPYnlCa1lYUmxJSEJ5YjNacFpHVmtMbHdpS1R0Y2JpQXFJRUJoY0drZ2NIVmliR2xqWEc0Z0tpQkFiV1YwYUc5a0lIZGhjbTVjYmlBcUlFQndZWEpoYlNBZ2UwSnZiMnhsWVc1OUlHTnZibVJwZEdsdmJpQXRJRkpsYzNWc2RDQnZaaUIwYUdVZ1pYWmhiSFZoZEdWa0lHTnZibVJwZEdsdmJseHVJQ29nUUhCaGNtRnRJQ0I3VTNSeWFXNW5mU0JsY25KdmNrMWxjM05oWjJVZ0xTQk5aWE56WVdkbElHVjRjR3hoYVc1cFp5QjBhR1VnWlhKeWIzSWdhVzRnWTJGelpTQnBkQ0JwY3lCMGFISnZkMjVjYmlBcUlFQnlaWFIxY200Z2RtOXBaRnh1SUNvdlhHNWhjM05sY25RdWQyRnliaUE5SUdaMWJtTjBhVzl1SUhkaGNtNG9ZMjl1WkdsMGFXOXVMQ0JsY25KdmNrMWxjM05oWjJVcElIdGNiaUFnWTI5dWMzUWdaWEp5YjNJZ1BTQndjbTlqWlhOelEyOXVaR2wwYVc5dUtHTnZibVJwZEdsdmJpd2daWEp5YjNKTlpYTnpZV2RsS1R0Y2JpQWdhV1lnS0hSNWNHVnZaaUJsY25KdmNpQTlQVDBnSjNOMGNtbHVaeWNwSUh0Y2JpQWdJQ0JqYjI1emIyeGxMbmRoY200b1pYSnliM0lwTzF4dUlDQjlYRzU5TzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCaGMzTmxjblE3WEc0aVhTd2labWxzWlNJNkltRnpjMlZ5ZEM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJdmMyOTFjbU5sTHlKOVxuIiwiLyoqXG4gKiBUZXN0cyB3aGV0aGVyIG9yIG5vdCBhbiBvYmplY3QgaXMgYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSBvYmplY3QgdG8gdGVzdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgdmFsYCBpcyBhbiBhcnJheSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgX2lzQXJyYXkoW10pOyAvLz0+IHRydWVcbiAqICAgICAgX2lzQXJyYXkobnVsbCk7IC8vPT4gZmFsc2VcbiAqICAgICAgX2lzQXJyYXkoe30pOyAvLz0+IGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBfaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuICh2YWwgIT0gbnVsbCAmJlxuICAgICAgICAgIHZhbC5sZW5ndGggPj0gMCAmJlxuICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nKTtcbn07XG4iLCIvKipcbiAqIEFuIG9wdGltaXplZCwgcHJpdmF0ZSBhcnJheSBgc2xpY2VgIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FyZ3VtZW50c3xBcnJheX0gYXJncyBUaGUgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdCB0byBjb25zaWRlci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbZnJvbT0wXSBUaGUgYXJyYXkgaW5kZXggdG8gc2xpY2UgZnJvbSwgaW5jbHVzaXZlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFt0bz1hcmdzLmxlbmd0aF0gVGhlIGFycmF5IGluZGV4IHRvIHNsaWNlIHRvLCBleGNsdXNpdmUuXG4gKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcsIHNsaWNlZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBfc2xpY2UoWzEsIDIsIDMsIDQsIDVdLCAxLCAzKTsgLy89PiBbMiwgM11cbiAqXG4gKiAgICAgIHZhciBmaXJzdFRocmVlQXJncyA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcbiAqICAgICAgICByZXR1cm4gX3NsaWNlKGFyZ3VtZW50cywgMCwgMyk7XG4gKiAgICAgIH07XG4gKiAgICAgIGZpcnN0VGhyZWVBcmdzKDEsIDIsIDMsIDQpOyAvLz0+IFsxLCAyLCAzXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9zbGljZShhcmdzLCBmcm9tLCB0bykge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBfc2xpY2UoYXJncywgMCwgYXJncy5sZW5ndGgpO1xuICAgIGNhc2UgMjogcmV0dXJuIF9zbGljZShhcmdzLCBmcm9tLCBhcmdzLmxlbmd0aCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBsaXN0ID0gW107XG4gICAgICB2YXIgaWR4ID0gMDtcbiAgICAgIHZhciBsZW4gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihhcmdzLmxlbmd0aCwgdG8pIC0gZnJvbSk7XG4gICAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICAgIGxpc3RbaWR4XSA9IGFyZ3NbZnJvbSArIGlkeF07XG4gICAgICAgIGlkeCArPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3Q7XG4gIH1cbn07XG4iLCJ2YXIgX2lzQXJyYXkgPSByZXF1aXJlKCcuL19pc0FycmF5Jyk7XG52YXIgX3NsaWNlID0gcmVxdWlyZSgnLi9fc2xpY2UnKTtcblxuXG4vKipcbiAqIFNpbWlsYXIgdG8gaGFzTWV0aG9kLCB0aGlzIGNoZWNrcyB3aGV0aGVyIGEgZnVuY3Rpb24gaGFzIGEgW21ldGhvZG5hbWVdXG4gKiBmdW5jdGlvbi4gSWYgaXQgaXNuJ3QgYW4gYXJyYXkgaXQgd2lsbCBleGVjdXRlIHRoYXQgZnVuY3Rpb24gb3RoZXJ3aXNlIGl0XG4gKiB3aWxsIGRlZmF1bHQgdG8gdGhlIHJhbWRhIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiByYW1kYSBpbXBsZW10YXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RuYW1lIHByb3BlcnR5IHRvIGNoZWNrIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICogQHJldHVybiB7T2JqZWN0fSBXaGF0ZXZlciB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBtZXRob2QgaXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2NoZWNrRm9yTWV0aG9kKG1ldGhvZG5hbWUsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZm4oKTtcbiAgICB9XG4gICAgdmFyIG9iaiA9IGFyZ3VtZW50c1tsZW5ndGggLSAxXTtcbiAgICByZXR1cm4gKF9pc0FycmF5KG9iaikgfHwgdHlwZW9mIG9ialttZXRob2RuYW1lXSAhPT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSA6XG4gICAgICBvYmpbbWV0aG9kbmFtZV0uYXBwbHkob2JqLCBfc2xpY2UoYXJndW1lbnRzLCAwLCBsZW5ndGggLSAxKSk7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfaXNQbGFjZWhvbGRlcihhKSB7XG4gIHJldHVybiBhICE9IG51bGwgJiZcbiAgICAgICAgIHR5cGVvZiBhID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWU7XG59O1xuIiwidmFyIF9pc1BsYWNlaG9sZGVyID0gcmVxdWlyZSgnLi9faXNQbGFjZWhvbGRlcicpO1xuXG5cbi8qKlxuICogT3B0aW1pemVkIGludGVybmFsIG9uZS1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGN1cnJpZWQgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2N1cnJ5MShmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZjEoYSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IF9pc1BsYWNlaG9sZGVyKGEpKSB7XG4gICAgICByZXR1cm4gZjE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcbn07XG4iLCJ2YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vX2N1cnJ5MScpO1xudmFyIF9pc1BsYWNlaG9sZGVyID0gcmVxdWlyZSgnLi9faXNQbGFjZWhvbGRlcicpO1xuXG5cbi8qKlxuICogT3B0aW1pemVkIGludGVybmFsIHR3by1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGN1cnJpZWQgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2N1cnJ5Mihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZjIoYSwgYikge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gZjI7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiBfaXNQbGFjZWhvbGRlcihhKSA/IGYyXG4gICAgICAgICAgICAgOiBfY3VycnkxKGZ1bmN0aW9uKF9iKSB7IHJldHVybiBmbihhLCBfYik7IH0pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpID8gZjJcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGEpID8gX2N1cnJ5MShmdW5jdGlvbihfYSkgeyByZXR1cm4gZm4oX2EsIGIpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYikgPyBfY3VycnkxKGZ1bmN0aW9uKF9iKSB7IHJldHVybiBmbihhLCBfYik7IH0pXG4gICAgICAgICAgICAgOiBmbihhLCBiKTtcbiAgICB9XG4gIH07XG59O1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL19jdXJyeTEnKTtcbnZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9fY3VycnkyJyk7XG52YXIgX2lzUGxhY2Vob2xkZXIgPSByZXF1aXJlKCcuL19pc1BsYWNlaG9sZGVyJyk7XG5cblxuLyoqXG4gKiBPcHRpbWl6ZWQgaW50ZXJuYWwgdGhyZWUtYXJpdHkgY3VycnkgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jdXJyeTMoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGYzKGEsIGIsIGMpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIGYzO1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gX2lzUGxhY2Vob2xkZXIoYSkgPyBmM1xuICAgICAgICAgICAgIDogX2N1cnJ5MihmdW5jdGlvbihfYiwgX2MpIHsgcmV0dXJuIGZuKGEsIF9iLCBfYyk7IH0pO1xuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gX2lzUGxhY2Vob2xkZXIoYSkgJiYgX2lzUGxhY2Vob2xkZXIoYikgPyBmM1xuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYSkgPyBfY3VycnkyKGZ1bmN0aW9uKF9hLCBfYykgeyByZXR1cm4gZm4oX2EsIGIsIF9jKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGIpID8gX2N1cnJ5MihmdW5jdGlvbihfYiwgX2MpIHsgcmV0dXJuIGZuKGEsIF9iLCBfYyk7IH0pXG4gICAgICAgICAgICAgOiBfY3VycnkxKGZ1bmN0aW9uKF9jKSB7IHJldHVybiBmbihhLCBiLCBfYyk7IH0pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpICYmIF9pc1BsYWNlaG9sZGVyKGMpID8gZjNcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpID8gX2N1cnJ5MihmdW5jdGlvbihfYSwgX2IpIHsgcmV0dXJuIGZuKF9hLCBfYiwgYyk7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihjKSA/IF9jdXJyeTIoZnVuY3Rpb24oX2EsIF9jKSB7IHJldHVybiBmbihfYSwgYiwgX2MpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYikgJiYgX2lzUGxhY2Vob2xkZXIoYykgPyBfY3VycnkyKGZ1bmN0aW9uKF9iLCBfYykgeyByZXR1cm4gZm4oYSwgX2IsIF9jKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGEpID8gX2N1cnJ5MShmdW5jdGlvbihfYSkgeyByZXR1cm4gZm4oX2EsIGIsIGMpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYikgPyBfY3VycnkxKGZ1bmN0aW9uKF9iKSB7IHJldHVybiBmbihhLCBfYiwgYyk7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihjKSA/IF9jdXJyeTEoZnVuY3Rpb24oX2MpIHsgcmV0dXJuIGZuKGEsIGIsIF9jKTsgfSlcbiAgICAgICAgICAgICA6IGZuKGEsIGIsIGMpO1xuICAgIH1cbiAgfTtcbn07XG4iLCJ2YXIgX2NoZWNrRm9yTWV0aG9kID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY2hlY2tGb3JNZXRob2QnKTtcbnZhciBfY3VycnkzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkzJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gbGlzdCBvciBzdHJpbmcgKG9yIG9iamVjdCB3aXRoIGEgYHNsaWNlYFxuICogbWV0aG9kKSBmcm9tIGBmcm9tSW5kZXhgIChpbmNsdXNpdmUpIHRvIGB0b0luZGV4YCAoZXhjbHVzaXZlKS5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgc2xpY2VgIG1ldGhvZCBvZiB0aGUgdGhpcmQgYXJndW1lbnQsIGlmIHByZXNlbnQuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS40XG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IFthXSAtPiBbYV1cbiAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBTdHJpbmcgLT4gU3RyaW5nXG4gKiBAcGFyYW0ge051bWJlcn0gZnJvbUluZGV4IFRoZSBzdGFydCBpbmRleCAoaW5jbHVzaXZlKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSB0b0luZGV4IFRoZSBlbmQgaW5kZXggKGV4Y2x1c2l2ZSkuXG4gKiBAcGFyYW0geyp9IGxpc3RcbiAqIEByZXR1cm4geyp9XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5zbGljZSgxLCAzLCBbJ2EnLCAnYicsICdjJywgJ2QnXSk7ICAgICAgICAvLz0+IFsnYicsICdjJ11cbiAqICAgICAgUi5zbGljZSgxLCBJbmZpbml0eSwgWydhJywgJ2InLCAnYycsICdkJ10pOyAvLz0+IFsnYicsICdjJywgJ2QnXVxuICogICAgICBSLnNsaWNlKDAsIC0xLCBbJ2EnLCAnYicsICdjJywgJ2QnXSk7ICAgICAgIC8vPT4gWydhJywgJ2InLCAnYyddXG4gKiAgICAgIFIuc2xpY2UoLTMsIC0xLCBbJ2EnLCAnYicsICdjJywgJ2QnXSk7ICAgICAgLy89PiBbJ2InLCAnYyddXG4gKiAgICAgIFIuc2xpY2UoMCwgMywgJ3JhbWRhJyk7ICAgICAgICAgICAgICAgICAgICAgLy89PiAncmFtJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTMoX2NoZWNrRm9yTWV0aG9kKCdzbGljZScsIGZ1bmN0aW9uIHNsaWNlKGZyb21JbmRleCwgdG9JbmRleCwgbGlzdCkge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobGlzdCwgZnJvbUluZGV4LCB0b0luZGV4KTtcbn0pKTtcbiIsInZhciBfY3VycnkzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkzJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSByZXN1bHQgb2YgXCJzZXR0aW5nXCIgdGhlIHBvcnRpb24gb2YgdGhlIGdpdmVuIGRhdGEgc3RydWN0dXJlXG4gKiBmb2N1c2VkIGJ5IHRoZSBnaXZlbiBsZW5zIHRvIHRoZSByZXN1bHQgb2YgYXBwbHlpbmcgdGhlIGdpdmVuIGZ1bmN0aW9uIHRvXG4gKiB0aGUgZm9jdXNlZCB2YWx1ZS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xNi4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAdHlwZWRlZm4gTGVucyBzIGEgPSBGdW5jdG9yIGYgPT4gKGEgLT4gZiBhKSAtPiBzIC0+IGYgc1xuICogQHNpZyBMZW5zIHMgYSAtPiAoYSAtPiBhKSAtPiBzIC0+IHNcbiAqIEBwYXJhbSB7TGVuc30gbGVuc1xuICogQHBhcmFtIHsqfSB2XG4gKiBAcGFyYW0geyp9IHhcbiAqIEByZXR1cm4geyp9XG4gKiBAc2VlIFIucHJvcCwgUi5sZW5zSW5kZXgsIFIubGVuc1Byb3BcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgaGVhZExlbnMgPSBSLmxlbnNJbmRleCgwKTtcbiAqXG4gKiAgICAgIFIub3ZlcihoZWFkTGVucywgUi50b1VwcGVyLCBbJ2ZvbycsICdiYXInLCAnYmF6J10pOyAvLz0+IFsnRk9PJywgJ2JhcicsICdiYXonXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgLy8gYElkZW50aXR5YCBpcyBhIGZ1bmN0b3IgdGhhdCBob2xkcyBhIHNpbmdsZSB2YWx1ZSwgd2hlcmUgYG1hcGAgc2ltcGx5XG4gIC8vIHRyYW5zZm9ybXMgdGhlIGhlbGQgdmFsdWUgd2l0aCB0aGUgcHJvdmlkZWQgZnVuY3Rpb24uXG4gIHZhciBJZGVudGl0eSA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4ge3ZhbHVlOiB4LCBtYXA6IGZ1bmN0aW9uKGYpIHsgcmV0dXJuIElkZW50aXR5KGYoeCkpOyB9fTtcbiAgfTtcblxuICByZXR1cm4gX2N1cnJ5MyhmdW5jdGlvbiBvdmVyKGxlbnMsIGYsIHgpIHtcbiAgICAvLyBUaGUgdmFsdWUgcmV0dXJuZWQgYnkgdGhlIGdldHRlciBmdW5jdGlvbiBpcyBmaXJzdCB0cmFuc2Zvcm1lZCB3aXRoIGBmYCxcbiAgICAvLyB0aGVuIHNldCBhcyB0aGUgdmFsdWUgb2YgYW4gYElkZW50aXR5YC4gVGhpcyBpcyB0aGVuIG1hcHBlZCBvdmVyIHdpdGggdGhlXG4gICAgLy8gc2V0dGVyIGZ1bmN0aW9uIG9mIHRoZSBsZW5zLlxuICAgIHJldHVybiBsZW5zKGZ1bmN0aW9uKHkpIHsgcmV0dXJuIElkZW50aXR5KGYoeSkpOyB9KSh4KS52YWx1ZTtcbiAgfSk7XG59KCkpO1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTEnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGFsd2F5cyByZXR1cm5zIHRoZSBnaXZlbiB2YWx1ZS4gTm90ZSB0aGF0IGZvclxuICogbm9uLXByaW1pdGl2ZXMgdGhlIHZhbHVlIHJldHVybmVkIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGtub3duIGFzIGBjb25zdGAsIGBjb25zdGFudGAsIG9yIGBLYCAoZm9yIEsgY29tYmluYXRvcikgaW5cbiAqIG90aGVyIGxhbmd1YWdlcyBhbmQgbGlicmFyaWVzLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAc2lnIGEgLT4gKCogLT4gYSlcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB3cmFwIGluIGEgZnVuY3Rpb25cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIEZ1bmN0aW9uIDo6ICogLT4gdmFsLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciB0ID0gUi5hbHdheXMoJ1RlZScpO1xuICogICAgICB0KCk7IC8vPT4gJ1RlZSdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkxKGZ1bmN0aW9uIGFsd2F5cyh2YWwpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWw7XG4gIH07XG59KTtcbiIsInZhciBfY3VycnkzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkzJyk7XG52YXIgYWx3YXlzID0gcmVxdWlyZSgnLi9hbHdheXMnKTtcbnZhciBvdmVyID0gcmVxdWlyZSgnLi9vdmVyJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSByZXN1bHQgb2YgXCJzZXR0aW5nXCIgdGhlIHBvcnRpb24gb2YgdGhlIGdpdmVuIGRhdGEgc3RydWN0dXJlXG4gKiBmb2N1c2VkIGJ5IHRoZSBnaXZlbiBsZW5zIHRvIHRoZSBnaXZlbiB2YWx1ZS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xNi4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAdHlwZWRlZm4gTGVucyBzIGEgPSBGdW5jdG9yIGYgPT4gKGEgLT4gZiBhKSAtPiBzIC0+IGYgc1xuICogQHNpZyBMZW5zIHMgYSAtPiBhIC0+IHMgLT4gc1xuICogQHBhcmFtIHtMZW5zfSBsZW5zXG4gKiBAcGFyYW0geyp9IHZcbiAqIEBwYXJhbSB7Kn0geFxuICogQHJldHVybiB7Kn1cbiAqIEBzZWUgUi5wcm9wLCBSLmxlbnNJbmRleCwgUi5sZW5zUHJvcFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciB4TGVucyA9IFIubGVuc1Byb3AoJ3gnKTtcbiAqXG4gKiAgICAgIFIuc2V0KHhMZW5zLCA0LCB7eDogMSwgeTogMn0pOyAgLy89PiB7eDogNCwgeTogMn1cbiAqICAgICAgUi5zZXQoeExlbnMsIDgsIHt4OiAxLCB5OiAyfSk7ICAvLz0+IHt4OiA4LCB5OiAyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTMoZnVuY3Rpb24gc2V0KGxlbnMsIHYsIHgpIHtcbiAgcmV0dXJuIG92ZXIobGVucywgYWx3YXlzKHYpLCB4KTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfYXJpdHkobiwgZm4pIHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgc3dpdGNoIChuKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEwKSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyKSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzKSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgNTogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzLCBhNCkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDY6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQsIGE1KSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgNzogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2KSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgODogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNykgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDk6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4KSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgMTA6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IHRvIF9hcml0eSBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIgbm8gZ3JlYXRlciB0aGFuIHRlbicpO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfcGlwZShmLCBnKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZy5jYWxsKHRoaXMsIGYuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFhXcmFwKGZuKSB7XG4gICAgdGhpcy5mID0gZm47XG4gIH1cbiAgWFdyYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbml0IG5vdCBpbXBsZW1lbnRlZCBvbiBYV3JhcCcpO1xuICB9O1xuICBYV3JhcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uKGFjYykgeyByZXR1cm4gYWNjOyB9O1xuICBYV3JhcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbihhY2MsIHgpIHtcbiAgICByZXR1cm4gdGhpcy5mKGFjYywgeCk7XG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIF94d3JhcChmbikgeyByZXR1cm4gbmV3IFhXcmFwKGZuKTsgfTtcbn0oKSk7XG4iLCJ2YXIgX2FyaXR5ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fYXJpdHknKTtcbnZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG5cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyBib3VuZCB0byBhIGNvbnRleHQuXG4gKiBOb3RlOiBgUi5iaW5kYCBkb2VzIG5vdCBwcm92aWRlIHRoZSBhZGRpdGlvbmFsIGFyZ3VtZW50LWJpbmRpbmcgY2FwYWJpbGl0aWVzIG9mXG4gKiBbRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL2JpbmQpLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjYuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAc2lnICgqIC0+ICopIC0+IHsqfSAtPiAoKiAtPiAqKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGJpbmQgdG8gY29udGV4dFxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNPYmogVGhlIGNvbnRleHQgdG8gYmluZCBgZm5gIHRvXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0aGF0IHdpbGwgZXhlY3V0ZSBpbiB0aGUgY29udGV4dCBvZiBgdGhpc09iamAuXG4gKiBAc2VlIFIucGFydGlhbFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBsb2cgPSBSLmJpbmQoY29uc29sZS5sb2csIGNvbnNvbGUpO1xuICogICAgICBSLnBpcGUoUi5hc3NvYygnYScsIDIpLCBSLnRhcChsb2cpLCBSLmFzc29jKCdhJywgMykpKHthOiAxfSk7IC8vPT4ge2E6IDN9XG4gKiAgICAgIC8vIGxvZ3Mge2E6IDJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBiaW5kKGZuLCB0aGlzT2JqKSB7XG4gIHJldHVybiBfYXJpdHkoZm4ubGVuZ3RoLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc09iaiwgYXJndW1lbnRzKTtcbiAgfSk7XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2lzU3RyaW5nKHgpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG59O1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTEnKTtcbnZhciBfaXNBcnJheSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2lzQXJyYXknKTtcbnZhciBfaXNTdHJpbmcgPSByZXF1aXJlKCcuL2ludGVybmFsL19pc1N0cmluZycpO1xuXG5cbi8qKlxuICogVGVzdHMgd2hldGhlciBvciBub3QgYW4gb2JqZWN0IGlzIHNpbWlsYXIgdG8gYW4gYXJyYXkuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuNS4wXG4gKiBAY2F0ZWdvcnkgVHlwZVxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgKiAtPiBCb29sZWFuXG4gKiBAcGFyYW0geyp9IHggVGhlIG9iamVjdCB0byB0ZXN0LlxuICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGB4YCBoYXMgYSBudW1lcmljIGxlbmd0aCBwcm9wZXJ0eSBhbmQgZXh0cmVtZSBpbmRpY2VzIGRlZmluZWQ7IGBmYWxzZWAgb3RoZXJ3aXNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuaXNBcnJheUxpa2UoW10pOyAvLz0+IHRydWVcbiAqICAgICAgUi5pc0FycmF5TGlrZSh0cnVlKTsgLy89PiBmYWxzZVxuICogICAgICBSLmlzQXJyYXlMaWtlKHt9KTsgLy89PiBmYWxzZVxuICogICAgICBSLmlzQXJyYXlMaWtlKHtsZW5ndGg6IDEwfSk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pc0FycmF5TGlrZSh7MDogJ3plcm8nLCA5OiAnbmluZScsIGxlbmd0aDogMTB9KTsgLy89PiB0cnVlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MShmdW5jdGlvbiBpc0FycmF5TGlrZSh4KSB7XG4gIGlmIChfaXNBcnJheSh4KSkgeyByZXR1cm4gdHJ1ZTsgfVxuICBpZiAoIXgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmICh0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChfaXNTdHJpbmcoeCkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmICh4Lm5vZGVUeXBlID09PSAxKSB7IHJldHVybiAhIXgubGVuZ3RoOyB9XG4gIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdHJ1ZTsgfVxuICBpZiAoeC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHguaGFzT3duUHJvcGVydHkoMCkgJiYgeC5oYXNPd25Qcm9wZXJ0eSh4Lmxlbmd0aCAtIDEpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn0pO1xuIiwidmFyIF94d3JhcCA9IHJlcXVpcmUoJy4vX3h3cmFwJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4uL2JpbmQnKTtcbnZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2lzQXJyYXlMaWtlJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIF9hcnJheVJlZHVjZSh4ZiwgYWNjLCBsaXN0KSB7XG4gICAgdmFyIGlkeCA9IDA7XG4gICAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xuICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgIGFjYyA9IHhmWydAQHRyYW5zZHVjZXIvc3RlcCddKGFjYywgbGlzdFtpZHhdKTtcbiAgICAgIGlmIChhY2MgJiYgYWNjWydAQHRyYW5zZHVjZXIvcmVkdWNlZCddKSB7XG4gICAgICAgIGFjYyA9IGFjY1snQEB0cmFuc2R1Y2VyL3ZhbHVlJ107XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWR4ICs9IDE7XG4gICAgfVxuICAgIHJldHVybiB4ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKGFjYyk7XG4gIH1cblxuICBmdW5jdGlvbiBfaXRlcmFibGVSZWR1Y2UoeGYsIGFjYywgaXRlcikge1xuICAgIHZhciBzdGVwID0gaXRlci5uZXh0KCk7XG4gICAgd2hpbGUgKCFzdGVwLmRvbmUpIHtcbiAgICAgIGFjYyA9IHhmWydAQHRyYW5zZHVjZXIvc3RlcCddKGFjYywgc3RlcC52YWx1ZSk7XG4gICAgICBpZiAoYWNjICYmIGFjY1snQEB0cmFuc2R1Y2VyL3JlZHVjZWQnXSkge1xuICAgICAgICBhY2MgPSBhY2NbJ0BAdHJhbnNkdWNlci92YWx1ZSddO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHN0ZXAgPSBpdGVyLm5leHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10oYWNjKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tZXRob2RSZWR1Y2UoeGYsIGFjYywgb2JqKSB7XG4gICAgcmV0dXJuIHhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ob2JqLnJlZHVjZShiaW5kKHhmWydAQHRyYW5zZHVjZXIvc3RlcCddLCB4ZiksIGFjYykpO1xuICB9XG5cbiAgdmFyIHN5bUl0ZXJhdG9yID0gKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnKSA/IFN5bWJvbC5pdGVyYXRvciA6ICdAQGl0ZXJhdG9yJztcbiAgcmV0dXJuIGZ1bmN0aW9uIF9yZWR1Y2UoZm4sIGFjYywgbGlzdCkge1xuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZuID0gX3h3cmFwKGZuKTtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXlMaWtlKGxpc3QpKSB7XG4gICAgICByZXR1cm4gX2FycmF5UmVkdWNlKGZuLCBhY2MsIGxpc3QpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxpc3QucmVkdWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gX21ldGhvZFJlZHVjZShmbiwgYWNjLCBsaXN0KTtcbiAgICB9XG4gICAgaWYgKGxpc3Rbc3ltSXRlcmF0b3JdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBfaXRlcmFibGVSZWR1Y2UoZm4sIGFjYywgbGlzdFtzeW1JdGVyYXRvcl0oKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGlzdC5uZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gX2l0ZXJhYmxlUmVkdWNlKGZuLCBhY2MsIGxpc3QpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2U6IGxpc3QgbXVzdCBiZSBhcnJheSBvciBpdGVyYWJsZScpO1xuICB9O1xufSgpKTtcbiIsInZhciBfY3VycnkzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkzJyk7XG52YXIgX3JlZHVjZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX3JlZHVjZScpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIHNpbmdsZSBpdGVtIGJ5IGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBsaXN0LCBzdWNjZXNzaXZlbHkgY2FsbGluZ1xuICogdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIGFuZCBwYXNzaW5nIGl0IGFuIGFjY3VtdWxhdG9yIHZhbHVlIGFuZCB0aGUgY3VycmVudFxuICogdmFsdWUgZnJvbSB0aGUgYXJyYXksIGFuZCB0aGVuIHBhc3NpbmcgdGhlIHJlc3VsdCB0byB0aGUgbmV4dCBjYWxsLlxuICpcbiAqIFRoZSBpdGVyYXRvciBmdW5jdGlvbiByZWNlaXZlcyB0d28gdmFsdWVzOiAqKGFjYywgdmFsdWUpKi4gSXQgbWF5IHVzZVxuICogYFIucmVkdWNlZGAgdG8gc2hvcnRjdXQgdGhlIGl0ZXJhdGlvbi5cbiAqXG4gKiBOb3RlOiBgUi5yZWR1Y2VgIGRvZXMgbm90IHNraXAgZGVsZXRlZCBvciB1bmFzc2lnbmVkIGluZGljZXMgKHNwYXJzZVxuICogYXJyYXlzKSwgdW5saWtlIHRoZSBuYXRpdmUgYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlsc1xuICogb24gdGhpcyBiZWhhdmlvciwgc2VlOlxuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvcmVkdWNlI0Rlc2NyaXB0aW9uXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYHJlZHVjZWAgbWV0aG9kIG9mIHRoZSB0aGlyZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnICgoYSwgYikgLT4gYSkgLT4gYSAtPiBbYl0gLT4gYVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLiBSZWNlaXZlcyB0d28gdmFsdWVzLCB0aGUgYWNjdW11bGF0b3IgYW5kIHRoZVxuICogICAgICAgIGN1cnJlbnQgZWxlbWVudCBmcm9tIHRoZSBhcnJheS5cbiAqIEBwYXJhbSB7Kn0gYWNjIFRoZSBhY2N1bXVsYXRvciB2YWx1ZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHJldHVybiB7Kn0gVGhlIGZpbmFsLCBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqIEBzZWUgUi5yZWR1Y2VkLCBSLmFkZEluZGV4XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIG51bWJlcnMgPSBbMSwgMiwgM107XG4gKiAgICAgIHZhciBwbHVzID0gKGEsIGIpID0+IGEgKyBiO1xuICpcbiAqICAgICAgUi5yZWR1Y2UocGx1cywgMTAsIG51bWJlcnMpOyAvLz0+IDE2XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MyhfcmVkdWNlKTtcbiIsInZhciBfY2hlY2tGb3JNZXRob2QgPSByZXF1aXJlKCcuL2ludGVybmFsL19jaGVja0Zvck1ldGhvZCcpO1xudmFyIHNsaWNlID0gcmVxdWlyZSgnLi9zbGljZScpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhbGwgYnV0IHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBnaXZlbiBsaXN0IG9yIHN0cmluZyAob3Igb2JqZWN0XG4gKiB3aXRoIGEgYHRhaWxgIG1ldGhvZCkuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYHNsaWNlYCBtZXRob2Qgb2YgdGhlIGZpcnN0IGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgW2FdIC0+IFthXVxuICogQHNpZyBTdHJpbmcgLT4gU3RyaW5nXG4gKiBAcGFyYW0geyp9IGxpc3RcbiAqIEByZXR1cm4geyp9XG4gKiBAc2VlIFIuaGVhZCwgUi5pbml0LCBSLmxhc3RcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnRhaWwoWzEsIDIsIDNdKTsgIC8vPT4gWzIsIDNdXG4gKiAgICAgIFIudGFpbChbMSwgMl0pOyAgICAgLy89PiBbMl1cbiAqICAgICAgUi50YWlsKFsxXSk7ICAgICAgICAvLz0+IFtdXG4gKiAgICAgIFIudGFpbChbXSk7ICAgICAgICAgLy89PiBbXVxuICpcbiAqICAgICAgUi50YWlsKCdhYmMnKTsgIC8vPT4gJ2JjJ1xuICogICAgICBSLnRhaWwoJ2FiJyk7ICAgLy89PiAnYidcbiAqICAgICAgUi50YWlsKCdhJyk7ICAgIC8vPT4gJydcbiAqICAgICAgUi50YWlsKCcnKTsgICAgIC8vPT4gJydcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY2hlY2tGb3JNZXRob2QoJ3RhaWwnLCBzbGljZSgxLCBJbmZpbml0eSkpO1xuIiwidmFyIF9hcml0eSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2FyaXR5Jyk7XG52YXIgX3BpcGUgPSByZXF1aXJlKCcuL2ludGVybmFsL19waXBlJyk7XG52YXIgcmVkdWNlID0gcmVxdWlyZSgnLi9yZWR1Y2UnKTtcbnZhciB0YWlsID0gcmVxdWlyZSgnLi90YWlsJyk7XG5cblxuLyoqXG4gKiBQZXJmb3JtcyBsZWZ0LXRvLXJpZ2h0IGZ1bmN0aW9uIGNvbXBvc2l0aW9uLiBUaGUgbGVmdG1vc3QgZnVuY3Rpb24gbWF5IGhhdmVcbiAqIGFueSBhcml0eTsgdGhlIHJlbWFpbmluZyBmdW5jdGlvbnMgbXVzdCBiZSB1bmFyeS5cbiAqXG4gKiBJbiBzb21lIGxpYnJhcmllcyB0aGlzIGZ1bmN0aW9uIGlzIG5hbWVkIGBzZXF1ZW5jZWAuXG4gKlxuICogKipOb3RlOioqIFRoZSByZXN1bHQgb2YgcGlwZSBpcyBub3QgYXV0b21hdGljYWxseSBjdXJyaWVkLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAc2lnICgoKGEsIGIsIC4uLiwgbikgLT4gbyksIChvIC0+IHApLCAuLi4sICh4IC0+IHkpLCAoeSAtPiB6KSkgLT4gKChhLCBiLCAuLi4sIG4pIC0+IHopXG4gKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBmdW5jdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQHNlZSBSLmNvbXBvc2VcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgZiA9IFIucGlwZShNYXRoLnBvdywgUi5uZWdhdGUsIFIuaW5jKTtcbiAqXG4gKiAgICAgIGYoMywgNCk7IC8vIC0oM140KSArIDFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwaXBlKCkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcigncGlwZSByZXF1aXJlcyBhdCBsZWFzdCBvbmUgYXJndW1lbnQnKTtcbiAgfVxuICByZXR1cm4gX2FyaXR5KGFyZ3VtZW50c1swXS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcmVkdWNlKF9waXBlLCBhcmd1bWVudHNbMF0sIHRhaWwoYXJndW1lbnRzKSkpO1xufTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aGVuIHN1cHBsaWVkIGFuIG9iamVjdCByZXR1cm5zIHRoZSBpbmRpY2F0ZWRcbiAqIHByb3BlcnR5IG9mIHRoYXQgb2JqZWN0LCBpZiBpdCBleGlzdHMuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAc2lnIHMgLT4ge3M6IGF9IC0+IGEgfCBVbmRlZmluZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBwIFRoZSBwcm9wZXJ0eSBuYW1lXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcXVlcnlcbiAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZSBhdCBgb2JqLnBgLlxuICogQHNlZSBSLnBhdGhcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnByb3AoJ3gnLCB7eDogMTAwfSk7IC8vPT4gMTAwXG4gKiAgICAgIFIucHJvcCgneCcsIHt9KTsgLy89PiB1bmRlZmluZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIHByb3AocCwgb2JqKSB7IHJldHVybiBvYmpbcF07IH0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfaXNUcmFuc2Zvcm1lcihvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmpbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPT09ICdmdW5jdGlvbic7XG59O1xuIiwidmFyIF9pc0FycmF5ID0gcmVxdWlyZSgnLi9faXNBcnJheScpO1xudmFyIF9pc1RyYW5zZm9ybWVyID0gcmVxdWlyZSgnLi9faXNUcmFuc2Zvcm1lcicpO1xudmFyIF9zbGljZSA9IHJlcXVpcmUoJy4vX3NsaWNlJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBkaXNwYXRjaGVzIHdpdGggZGlmZmVyZW50IHN0cmF0ZWdpZXMgYmFzZWQgb24gdGhlXG4gKiBvYmplY3QgaW4gbGlzdCBwb3NpdGlvbiAobGFzdCBhcmd1bWVudCkuIElmIGl0IGlzIGFuIGFycmF5LCBleGVjdXRlcyBbZm5dLlxuICogT3RoZXJ3aXNlLCBpZiBpdCBoYXMgYSBmdW5jdGlvbiB3aXRoIFttZXRob2RuYW1lXSwgaXQgd2lsbCBleGVjdXRlIHRoYXRcbiAqIGZ1bmN0aW9uIChmdW5jdG9yIGNhc2UpLiBPdGhlcndpc2UsIGlmIGl0IGlzIGEgdHJhbnNmb3JtZXIsIHVzZXMgdHJhbnNkdWNlclxuICogW3hmXSB0byByZXR1cm4gYSBuZXcgdHJhbnNmb3JtZXIgKHRyYW5zZHVjZXIgY2FzZSkuIE90aGVyd2lzZSwgaXQgd2lsbFxuICogZGVmYXVsdCB0byBleGVjdXRpbmcgW2ZuXS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZG5hbWUgcHJvcGVydHkgdG8gY2hlY2sgZm9yIGEgY3VzdG9tIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB4ZiB0cmFuc2R1Y2VyIHRvIGluaXRpYWxpemUgaWYgb2JqZWN0IGlzIHRyYW5zZm9ybWVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBkZWZhdWx0IHJhbWRhIGltcGxlbWVudGF0aW9uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0aGF0IGRpc3BhdGNoZXMgb24gb2JqZWN0IGluIGxpc3QgcG9zaXRpb25cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZGlzcGF0Y2hhYmxlKG1ldGhvZG5hbWUsIHhmLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZuKCk7XG4gICAgfVxuICAgIHZhciBvYmogPSBhcmd1bWVudHNbbGVuZ3RoIC0gMV07XG4gICAgaWYgKCFfaXNBcnJheShvYmopKSB7XG4gICAgICB2YXIgYXJncyA9IF9zbGljZShhcmd1bWVudHMsIDAsIGxlbmd0aCAtIDEpO1xuICAgICAgaWYgKHR5cGVvZiBvYmpbbWV0aG9kbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG9ialttZXRob2RuYW1lXS5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgfVxuICAgICAgaWYgKF9pc1RyYW5zZm9ybWVyKG9iaikpIHtcbiAgICAgICAgdmFyIHRyYW5zZHVjZXIgPSB4Zi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgcmV0dXJuIHRyYW5zZHVjZXIob2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfbWFwKGZuLCBmdW5jdG9yKSB7XG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gZnVuY3Rvci5sZW5ndGg7XG4gIHZhciByZXN1bHQgPSBBcnJheShsZW4pO1xuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgcmVzdWx0W2lkeF0gPSBmbihmdW5jdG9yW2lkeF0pO1xuICAgIGlkeCArPSAxO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvaW5pdCddKCk7XG4gIH0sXG4gIHJlc3VsdDogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShyZXN1bHQpO1xuICB9XG59O1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL19jdXJyeTInKTtcbnZhciBfeGZCYXNlID0gcmVxdWlyZSgnLi9feGZCYXNlJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFhNYXAoZiwgeGYpIHtcbiAgICB0aGlzLnhmID0geGY7XG4gICAgdGhpcy5mID0gZjtcbiAgfVxuICBYTWFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IF94ZkJhc2UucmVzdWx0O1xuICBYTWFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIHRoaXMuZihpbnB1dCkpO1xuICB9O1xuXG4gIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94bWFwKGYsIHhmKSB7IHJldHVybiBuZXcgWE1hcChmLCB4Zik7IH0pO1xufSgpKTtcbiIsInZhciBfYXJpdHkgPSByZXF1aXJlKCcuL19hcml0eScpO1xudmFyIF9pc1BsYWNlaG9sZGVyID0gcmVxdWlyZSgnLi9faXNQbGFjZWhvbGRlcicpO1xuXG5cbi8qKlxuICogSW50ZXJuYWwgY3VycnlOIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIGFyaXR5IG9mIHRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtBcnJheX0gcmVjZWl2ZWQgQW4gYXJyYXkgb2YgYXJndW1lbnRzIHJlY2VpdmVkIHRodXMgZmFyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jdXJyeU4obGVuZ3RoLCByZWNlaXZlZCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb21iaW5lZCA9IFtdO1xuICAgIHZhciBhcmdzSWR4ID0gMDtcbiAgICB2YXIgbGVmdCA9IGxlbmd0aDtcbiAgICB2YXIgY29tYmluZWRJZHggPSAwO1xuICAgIHdoaWxlIChjb21iaW5lZElkeCA8IHJlY2VpdmVkLmxlbmd0aCB8fCBhcmdzSWR4IDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmIChjb21iaW5lZElkeCA8IHJlY2VpdmVkLmxlbmd0aCAmJlxuICAgICAgICAgICghX2lzUGxhY2Vob2xkZXIocmVjZWl2ZWRbY29tYmluZWRJZHhdKSB8fFxuICAgICAgICAgICBhcmdzSWR4ID49IGFyZ3VtZW50cy5sZW5ndGgpKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlY2VpdmVkW2NvbWJpbmVkSWR4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGFyZ3VtZW50c1thcmdzSWR4XTtcbiAgICAgICAgYXJnc0lkeCArPSAxO1xuICAgICAgfVxuICAgICAgY29tYmluZWRbY29tYmluZWRJZHhdID0gcmVzdWx0O1xuICAgICAgaWYgKCFfaXNQbGFjZWhvbGRlcihyZXN1bHQpKSB7XG4gICAgICAgIGxlZnQgLT0gMTtcbiAgICAgIH1cbiAgICAgIGNvbWJpbmVkSWR4ICs9IDE7XG4gICAgfVxuICAgIHJldHVybiBsZWZ0IDw9IDAgPyBmbi5hcHBseSh0aGlzLCBjb21iaW5lZClcbiAgICAgICAgICAgICAgICAgICAgIDogX2FyaXR5KGxlZnQsIF9jdXJyeU4obGVuZ3RoLCBjb21iaW5lZCwgZm4pKTtcbiAgfTtcbn07XG4iLCJ2YXIgX2FyaXR5ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fYXJpdHknKTtcbnZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG52YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIF9jdXJyeU4gPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeU4nKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBjdXJyaWVkIGVxdWl2YWxlbnQgb2YgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uLCB3aXRoIHRoZSBzcGVjaWZpZWRcbiAqIGFyaXR5LiBUaGUgY3VycmllZCBmdW5jdGlvbiBoYXMgdHdvIHVudXN1YWwgY2FwYWJpbGl0aWVzLiBGaXJzdCwgaXRzXG4gKiBhcmd1bWVudHMgbmVlZG4ndCBiZSBwcm92aWRlZCBvbmUgYXQgYSB0aW1lLiBJZiBgZ2AgaXMgYFIuY3VycnlOKDMsIGYpYCwgdGhlXG4gKiBmb2xsb3dpbmcgYXJlIGVxdWl2YWxlbnQ6XG4gKlxuICogICAtIGBnKDEpKDIpKDMpYFxuICogICAtIGBnKDEpKDIsIDMpYFxuICogICAtIGBnKDEsIDIpKDMpYFxuICogICAtIGBnKDEsIDIsIDMpYFxuICpcbiAqIFNlY29uZGx5LCB0aGUgc3BlY2lhbCBwbGFjZWhvbGRlciB2YWx1ZSBgUi5fX2AgbWF5IGJlIHVzZWQgdG8gc3BlY2lmeVxuICogXCJnYXBzXCIsIGFsbG93aW5nIHBhcnRpYWwgYXBwbGljYXRpb24gb2YgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyxcbiAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgcG9zaXRpb25zLiBJZiBgZ2AgaXMgYXMgYWJvdmUgYW5kIGBfYCBpcyBgUi5fX2AsIHRoZVxuICogZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICpcbiAqICAgLSBgZygxLCAyLCAzKWBcbiAqICAgLSBgZyhfLCAyLCAzKSgxKWBcbiAqICAgLSBgZyhfLCBfLCAzKSgxKSgyKWBcbiAqICAgLSBgZyhfLCBfLCAzKSgxLCAyKWBcbiAqICAgLSBgZyhfLCAyKSgxKSgzKWBcbiAqICAgLSBgZyhfLCAyKSgxLCAzKWBcbiAqICAgLSBgZyhfLCAyKShfLCAzKSgxKWBcbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC41LjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyBOdW1iZXIgLT4gKCogLT4gYSkgLT4gKCogLT4gYSlcbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIGFyaXR5IGZvciB0aGUgcmV0dXJuZWQgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcsIGN1cnJpZWQgZnVuY3Rpb24uXG4gKiBAc2VlIFIuY3VycnlcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgc3VtQXJncyA9ICguLi5hcmdzKSA9PiBSLnN1bShhcmdzKTtcbiAqXG4gKiAgICAgIHZhciBjdXJyaWVkQWRkRm91ck51bWJlcnMgPSBSLmN1cnJ5Tig0LCBzdW1BcmdzKTtcbiAqICAgICAgdmFyIGYgPSBjdXJyaWVkQWRkRm91ck51bWJlcnMoMSwgMik7XG4gKiAgICAgIHZhciBnID0gZigzKTtcbiAqICAgICAgZyg0KTsgLy89PiAxMFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gY3VycnlOKGxlbmd0aCwgZm4pIHtcbiAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBfY3VycnkxKGZuKTtcbiAgfVxuICByZXR1cm4gX2FyaXR5KGxlbmd0aCwgX2N1cnJ5TihsZW5ndGgsIFtdLCBmbikpO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9oYXMocHJvcCwgb2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn07XG4iLCJ2YXIgX2hhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcmd1bWVudHMpID09PSAnW29iamVjdCBBcmd1bWVudHNdJyA/XG4gICAgZnVuY3Rpb24gX2lzQXJndW1lbnRzKHgpIHsgcmV0dXJuIHRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nOyB9IDpcbiAgICBmdW5jdGlvbiBfaXNBcmd1bWVudHMoeCkgeyByZXR1cm4gX2hhcygnY2FsbGVlJywgeCk7IH07XG59KCkpO1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTEnKTtcbnZhciBfaGFzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9faGFzJyk7XG52YXIgX2lzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9faXNBcmd1bWVudHMnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBsaXN0IGNvbnRhaW5pbmcgdGhlIG5hbWVzIG9mIGFsbCB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBvZlxuICogdGhlIHN1cHBsaWVkIG9iamVjdC5cbiAqIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIG91dHB1dCBhcnJheSBpcyBub3QgZ3VhcmFudGVlZCB0byBiZSBjb25zaXN0ZW50XG4gKiBhY3Jvc3MgZGlmZmVyZW50IEpTIHBsYXRmb3Jtcy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcge2s6IHZ9IC0+IFtrXVxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgcHJvcGVydGllcyBmcm9tXG4gKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgdGhlIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIua2V5cyh7YTogMSwgYjogMiwgYzogM30pOyAvLz0+IFsnYScsICdiJywgJ2MnXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgLy8gY292ZXIgSUUgPCA5IGtleXMgaXNzdWVzXG4gIHZhciBoYXNFbnVtQnVnID0gISh7dG9TdHJpbmc6IG51bGx9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFsnY29uc3RydWN0b3InLCAndmFsdWVPZicsICdpc1Byb3RvdHlwZU9mJywgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTtcbiAgLy8gU2FmYXJpIGJ1Z1xuICB2YXIgaGFzQXJnc0VudW1CdWcgPSAoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHJldHVybiBhcmd1bWVudHMucHJvcGVydHlJc0VudW1lcmFibGUoJ2xlbmd0aCcpO1xuICB9KCkpO1xuXG4gIHZhciBjb250YWlucyA9IGZ1bmN0aW9uIGNvbnRhaW5zKGxpc3QsIGl0ZW0pIHtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgIGlmIChsaXN0W2lkeF0gPT09IGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZHggKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHJldHVybiB0eXBlb2YgT2JqZWN0LmtleXMgPT09ICdmdW5jdGlvbicgJiYgIWhhc0FyZ3NFbnVtQnVnID9cbiAgICBfY3VycnkxKGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgICByZXR1cm4gT2JqZWN0KG9iaikgIT09IG9iaiA/IFtdIDogT2JqZWN0LmtleXMob2JqKTtcbiAgICB9KSA6XG4gICAgX2N1cnJ5MShmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgICAgaWYgKE9iamVjdChvYmopICE9PSBvYmopIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgdmFyIHByb3AsIG5JZHg7XG4gICAgICB2YXIga3MgPSBbXTtcbiAgICAgIHZhciBjaGVja0FyZ3NMZW5ndGggPSBoYXNBcmdzRW51bUJ1ZyAmJiBfaXNBcmd1bWVudHMob2JqKTtcbiAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKF9oYXMocHJvcCwgb2JqKSAmJiAoIWNoZWNrQXJnc0xlbmd0aCB8fCBwcm9wICE9PSAnbGVuZ3RoJykpIHtcbiAgICAgICAgICBrc1trcy5sZW5ndGhdID0gcHJvcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGhhc0VudW1CdWcpIHtcbiAgICAgICAgbklkeCA9IG5vbkVudW1lcmFibGVQcm9wcy5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAobklkeCA+PSAwKSB7XG4gICAgICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tuSWR4XTtcbiAgICAgICAgICBpZiAoX2hhcyhwcm9wLCBvYmopICYmICFjb250YWlucyhrcywgcHJvcCkpIHtcbiAgICAgICAgICAgIGtzW2tzLmxlbmd0aF0gPSBwcm9wO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuSWR4IC09IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBrcztcbiAgICB9KTtcbn0oKSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIF9kaXNwYXRjaGFibGUgPSByZXF1aXJlKCcuL2ludGVybmFsL19kaXNwYXRjaGFibGUnKTtcbnZhciBfbWFwID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fbWFwJyk7XG52YXIgX3JlZHVjZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX3JlZHVjZScpO1xudmFyIF94bWFwID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9feG1hcCcpO1xudmFyIGN1cnJ5TiA9IHJlcXVpcmUoJy4vY3VycnlOJyk7XG52YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG5cbi8qKlxuICogVGFrZXMgYSBmdW5jdGlvbiBhbmRcbiAqIGEgW2Z1bmN0b3JdKGh0dHBzOi8vZ2l0aHViLmNvbS9mYW50YXN5bGFuZC9mYW50YXN5LWxhbmQjZnVuY3RvciksXG4gKiBhcHBsaWVzIHRoZSBmdW5jdGlvbiB0byBlYWNoIG9mIHRoZSBmdW5jdG9yJ3MgdmFsdWVzLCBhbmQgcmV0dXJuc1xuICogYSBmdW5jdG9yIG9mIHRoZSBzYW1lIHNoYXBlLlxuICpcbiAqIFJhbWRhIHByb3ZpZGVzIHN1aXRhYmxlIGBtYXBgIGltcGxlbWVudGF0aW9ucyBmb3IgYEFycmF5YCBhbmQgYE9iamVjdGAsXG4gKiBzbyB0aGlzIGZ1bmN0aW9uIG1heSBiZSBhcHBsaWVkIHRvIGBbMSwgMiwgM11gIG9yIGB7eDogMSwgeTogMiwgejogM31gLlxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGBtYXBgIG1ldGhvZCBvZiB0aGUgc2Vjb25kIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAqXG4gKiBBbHNvIHRyZWF0cyBmdW5jdGlvbnMgYXMgZnVuY3RvcnMgYW5kIHdpbGwgY29tcG9zZSB0aGVtIHRvZ2V0aGVyLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgRnVuY3RvciBmID0+IChhIC0+IGIpIC0+IGYgYSAtPiBmIGJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gZXZlcnkgZWxlbWVudCBvZiB0aGUgaW5wdXQgYGxpc3RgLlxuICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBiZSBpdGVyYXRlZCBvdmVyLlxuICogQHJldHVybiB7QXJyYXl9IFRoZSBuZXcgbGlzdC5cbiAqIEBzZWUgUi50cmFuc2R1Y2UsIFIuYWRkSW5kZXhcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgZG91YmxlID0geCA9PiB4ICogMjtcbiAqXG4gKiAgICAgIFIubWFwKGRvdWJsZSwgWzEsIDIsIDNdKTsgLy89PiBbMiwgNCwgNl1cbiAqXG4gKiAgICAgIFIubWFwKGRvdWJsZSwge3g6IDEsIHk6IDIsIHo6IDN9KTsgLy89PiB7eDogMiwgeTogNCwgejogNn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKF9kaXNwYXRjaGFibGUoJ21hcCcsIF94bWFwLCBmdW5jdGlvbiBtYXAoZm4sIGZ1bmN0b3IpIHtcbiAgc3dpdGNoIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZnVuY3RvcikpIHtcbiAgICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6XG4gICAgICByZXR1cm4gY3VycnlOKGZ1bmN0b3IubGVuZ3RoLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZnVuY3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgIH0pO1xuICAgIGNhc2UgJ1tvYmplY3QgT2JqZWN0XSc6XG4gICAgICByZXR1cm4gX3JlZHVjZShmdW5jdGlvbihhY2MsIGtleSkge1xuICAgICAgICBhY2Nba2V5XSA9IGZuKGZ1bmN0b3Jba2V5XSk7XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSwga2V5cyhmdW5jdG9yKSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBfbWFwKGZuLCBmdW5jdG9yKTtcbiAgfVxufSkpO1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBtYXAgPSByZXF1aXJlKCcuL21hcCcpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGxlbnMgZm9yIHRoZSBnaXZlbiBnZXR0ZXIgYW5kIHNldHRlciBmdW5jdGlvbnMuIFRoZSBnZXR0ZXIgXCJnZXRzXCJcbiAqIHRoZSB2YWx1ZSBvZiB0aGUgZm9jdXM7IHRoZSBzZXR0ZXIgXCJzZXRzXCIgdGhlIHZhbHVlIG9mIHRoZSBmb2N1cy4gVGhlIHNldHRlclxuICogc2hvdWxkIG5vdCBtdXRhdGUgdGhlIGRhdGEgc3RydWN0dXJlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjguMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHR5cGVkZWZuIExlbnMgcyBhID0gRnVuY3RvciBmID0+IChhIC0+IGYgYSkgLT4gcyAtPiBmIHNcbiAqIEBzaWcgKHMgLT4gYSkgLT4gKChhLCBzKSAtPiBzKSAtPiBMZW5zIHMgYVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZ2V0dGVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzZXR0ZXJcbiAqIEByZXR1cm4ge0xlbnN9XG4gKiBAc2VlIFIudmlldywgUi5zZXQsIFIub3ZlciwgUi5sZW5zSW5kZXgsIFIubGVuc1Byb3BcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgeExlbnMgPSBSLmxlbnMoUi5wcm9wKCd4JyksIFIuYXNzb2MoJ3gnKSk7XG4gKlxuICogICAgICBSLnZpZXcoeExlbnMsIHt4OiAxLCB5OiAyfSk7ICAgICAgICAgICAgLy89PiAxXG4gKiAgICAgIFIuc2V0KHhMZW5zLCA0LCB7eDogMSwgeTogMn0pOyAgICAgICAgICAvLz0+IHt4OiA0LCB5OiAyfVxuICogICAgICBSLm92ZXIoeExlbnMsIFIubmVnYXRlLCB7eDogMSwgeTogMn0pOyAgLy89PiB7eDogLTEsIHk6IDJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBsZW5zKGdldHRlciwgc2V0dGVyKSB7XG4gIHJldHVybiBmdW5jdGlvbih0b0Z1bmN0b3JGbikge1xuICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIHJldHVybiBtYXAoXG4gICAgICAgIGZ1bmN0aW9uKGZvY3VzKSB7XG4gICAgICAgICAgcmV0dXJuIHNldHRlcihmb2N1cywgdGFyZ2V0KTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9GdW5jdG9yRm4oZ2V0dGVyKHRhcmdldCkpXG4gICAgICApO1xuICAgIH07XG4gIH07XG59KTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG52YXIgY3VycnlOID0gcmVxdWlyZSgnLi9jdXJyeU4nKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBjdXJyaWVkIGVxdWl2YWxlbnQgb2YgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uLiBUaGUgY3VycmllZCBmdW5jdGlvblxuICogaGFzIHR3byB1bnVzdWFsIGNhcGFiaWxpdGllcy4gRmlyc3QsIGl0cyBhcmd1bWVudHMgbmVlZG4ndCBiZSBwcm92aWRlZCBvbmVcbiAqIGF0IGEgdGltZS4gSWYgYGZgIGlzIGEgdGVybmFyeSBmdW5jdGlvbiBhbmQgYGdgIGlzIGBSLmN1cnJ5KGYpYCwgdGhlXG4gKiBmb2xsb3dpbmcgYXJlIGVxdWl2YWxlbnQ6XG4gKlxuICogICAtIGBnKDEpKDIpKDMpYFxuICogICAtIGBnKDEpKDIsIDMpYFxuICogICAtIGBnKDEsIDIpKDMpYFxuICogICAtIGBnKDEsIDIsIDMpYFxuICpcbiAqIFNlY29uZGx5LCB0aGUgc3BlY2lhbCBwbGFjZWhvbGRlciB2YWx1ZSBgUi5fX2AgbWF5IGJlIHVzZWQgdG8gc3BlY2lmeVxuICogXCJnYXBzXCIsIGFsbG93aW5nIHBhcnRpYWwgYXBwbGljYXRpb24gb2YgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyxcbiAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgcG9zaXRpb25zLiBJZiBgZ2AgaXMgYXMgYWJvdmUgYW5kIGBfYCBpcyBgUi5fX2AsIHRoZVxuICogZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICpcbiAqICAgLSBgZygxLCAyLCAzKWBcbiAqICAgLSBgZyhfLCAyLCAzKSgxKWBcbiAqICAgLSBgZyhfLCBfLCAzKSgxKSgyKWBcbiAqICAgLSBgZyhfLCBfLCAzKSgxLCAyKWBcbiAqICAgLSBgZyhfLCAyKSgxKSgzKWBcbiAqICAgLSBgZyhfLCAyKSgxLCAzKWBcbiAqICAgLSBgZyhfLCAyKShfLCAzKSgxKWBcbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyAoKiAtPiBhKSAtPiAoKiAtPiBhKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3LCBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHNlZSBSLmN1cnJ5TlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBhZGRGb3VyTnVtYmVycyA9IChhLCBiLCBjLCBkKSA9PiBhICsgYiArIGMgKyBkO1xuICpcbiAqICAgICAgdmFyIGN1cnJpZWRBZGRGb3VyTnVtYmVycyA9IFIuY3VycnkoYWRkRm91ck51bWJlcnMpO1xuICogICAgICB2YXIgZiA9IGN1cnJpZWRBZGRGb3VyTnVtYmVycygxLCAyKTtcbiAqICAgICAgdmFyIGcgPSBmKDMpO1xuICogICAgICBnKDQpOyAvLz0+IDEwXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MShmdW5jdGlvbiBjdXJyeShmbikge1xuICByZXR1cm4gY3VycnlOKGZuLmxlbmd0aCwgZm4pO1xufSk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBpbW11dGFibGVJbml0KGNvbmZpZykge1xuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL3YxNS4wLjEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjFcbiAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvciAmJiBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50Jyk7XG4gIHZhciBSRUFDVF9FTEVNRU5UX1RZUEVfRkFMTEJBQ0sgPSAweGVhYzc7XG5cbiAgdmFyIGdsb2JhbENvbmZpZyA9IHtcbiAgICB1c2Vfc3RhdGljOiBmYWxzZVxuICB9O1xuICBpZiAoaXNPYmplY3QoY29uZmlnKSkge1xuICAgICAgaWYgKGNvbmZpZy51c2Vfc3RhdGljICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBnbG9iYWxDb25maWcudXNlX3N0YXRpYyA9IEJvb2xlYW4oY29uZmlnLnVzZV9zdGF0aWMpO1xuICAgICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNPYmplY3QoZGF0YSkge1xuICAgIHJldHVybiAoXG4gICAgICB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICFBcnJheS5pc0FycmF5KGRhdGEpICYmXG4gICAgICBkYXRhICE9PSBudWxsXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc3RhbnRpYXRlRW1wdHlPYmplY3Qob2JqKSB7XG4gICAgICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgICBpZiAoIXByb3RvdHlwZSkge1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTtcbiAgICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFByb3BlcnR5VG8odGFyZ2V0LCBtZXRob2ROYW1lLCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG1ldGhvZE5hbWUsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYmFuUHJvcGVydHkodGFyZ2V0LCBtZXRob2ROYW1lKSB7XG4gICAgYWRkUHJvcGVydHlUbyh0YXJnZXQsIG1ldGhvZE5hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IEltbXV0YWJsZUVycm9yKFwiVGhlIFwiICsgbWV0aG9kTmFtZSArXG4gICAgICAgIFwiIG1ldGhvZCBjYW5ub3QgYmUgaW52b2tlZCBvbiBhbiBJbW11dGFibGUgZGF0YSBzdHJ1Y3R1cmUuXCIpO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIGltbXV0YWJpbGl0eVRhZyA9IFwiX19pbW11dGFibGVfaW52YXJpYW50c19ob2xkXCI7XG5cbiAgZnVuY3Rpb24gYWRkSW1tdXRhYmlsaXR5VGFnKHRhcmdldCkge1xuICAgIGFkZFByb3BlcnR5VG8odGFyZ2V0LCBpbW11dGFiaWxpdHlUYWcsIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNJbW11dGFibGUodGFyZ2V0KSB7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHJldHVybiB0YXJnZXQgPT09IG51bGwgfHwgQm9vbGVhbihcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGltbXV0YWJpbGl0eVRhZylcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEluIEphdmFTY3JpcHQsIG9ubHkgb2JqZWN0cyBhcmUgZXZlbiBwb3RlbnRpYWxseSBtdXRhYmxlLlxuICAgICAgLy8gc3RyaW5ncywgbnVtYmVycywgbnVsbCwgYW5kIHVuZGVmaW5lZCBhcmUgYWxsIG5hdHVyYWxseSBpbW11dGFibGUuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc0VxdWFsKGEsIGIpIHtcbiAgICAvLyBBdm9pZCBmYWxzZSBwb3NpdGl2ZXMgZHVlIHRvIChOYU4gIT09IE5hTikgZXZhbHVhdGluZyB0byB0cnVlXG4gICAgcmV0dXJuIChhID09PSBiIHx8IChhICE9PSBhICYmIGIgIT09IGIpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTWVyZ2FibGVPYmplY3QodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRhcmdldCAhPT0gbnVsbCAmJiB0eXBlb2YgdGFyZ2V0ID09PSBcIm9iamVjdFwiICYmICEoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSAmJiAhKHRhcmdldCBpbnN0YW5jZW9mIERhdGUpO1xuICB9XG5cbiAgdmFyIG11dGF0aW5nT2JqZWN0TWV0aG9kcyA9IFtcbiAgICBcInNldFByb3RvdHlwZU9mXCJcbiAgXTtcblxuICB2YXIgbm9uTXV0YXRpbmdPYmplY3RNZXRob2RzID0gW1xuICAgIFwia2V5c1wiXG4gIF07XG5cbiAgdmFyIG11dGF0aW5nQXJyYXlNZXRob2RzID0gbXV0YXRpbmdPYmplY3RNZXRob2RzLmNvbmNhdChbXG4gICAgXCJwdXNoXCIsIFwicG9wXCIsIFwic29ydFwiLCBcInNwbGljZVwiLCBcInNoaWZ0XCIsIFwidW5zaGlmdFwiLCBcInJldmVyc2VcIlxuICBdKTtcblxuICB2YXIgbm9uTXV0YXRpbmdBcnJheU1ldGhvZHMgPSBub25NdXRhdGluZ09iamVjdE1ldGhvZHMuY29uY2F0KFtcbiAgICBcIm1hcFwiLCBcImZpbHRlclwiLCBcInNsaWNlXCIsIFwiY29uY2F0XCIsIFwicmVkdWNlXCIsIFwicmVkdWNlUmlnaHRcIlxuICBdKTtcblxuICB2YXIgbXV0YXRpbmdEYXRlTWV0aG9kcyA9IG11dGF0aW5nT2JqZWN0TWV0aG9kcy5jb25jYXQoW1xuICAgIFwic2V0RGF0ZVwiLCBcInNldEZ1bGxZZWFyXCIsIFwic2V0SG91cnNcIiwgXCJzZXRNaWxsaXNlY29uZHNcIiwgXCJzZXRNaW51dGVzXCIsIFwic2V0TW9udGhcIiwgXCJzZXRTZWNvbmRzXCIsXG4gICAgXCJzZXRUaW1lXCIsIFwic2V0VVRDRGF0ZVwiLCBcInNldFVUQ0Z1bGxZZWFyXCIsIFwic2V0VVRDSG91cnNcIiwgXCJzZXRVVENNaWxsaXNlY29uZHNcIiwgXCJzZXRVVENNaW51dGVzXCIsXG4gICAgXCJzZXRVVENNb250aFwiLCBcInNldFVUQ1NlY29uZHNcIiwgXCJzZXRZZWFyXCJcbiAgXSk7XG5cbiAgZnVuY3Rpb24gSW1tdXRhYmxlRXJyb3IobWVzc2FnZSkge1xuICAgIHZhciBlcnIgICAgICAgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgLy8gVE9ETzogQ29uc2lkZXIgYE9iamVjdC5zZXRQcm90b3R5cGVPZihlcnIsIEltbXV0YWJsZUVycm9yKTtgXG4gICAgZXJyLl9fcHJvdG9fXyA9IEltbXV0YWJsZUVycm9yO1xuXG4gICAgcmV0dXJuIGVycjtcbiAgfVxuICBJbW11dGFibGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gbWFrZUltbXV0YWJsZShvYmosIGJhbm5lZE1ldGhvZHMpIHtcbiAgICAvLyBUYWcgaXQgc28gd2UgY2FuIHF1aWNrbHkgdGVsbCBpdCdzIGltbXV0YWJsZSBsYXRlci5cbiAgICBhZGRJbW11dGFiaWxpdHlUYWcob2JqKTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIC8vIE1ha2UgYWxsIG11dGF0aW5nIG1ldGhvZHMgdGhyb3cgZXhjZXB0aW9ucy5cbiAgICAgIGZvciAodmFyIGluZGV4IGluIGJhbm5lZE1ldGhvZHMpIHtcbiAgICAgICAgaWYgKGJhbm5lZE1ldGhvZHMuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XG4gICAgICAgICAgYmFuUHJvcGVydHkob2JqLCBiYW5uZWRNZXRob2RzW2luZGV4XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRnJlZXplIGl0IGFuZCByZXR1cm4gaXQuXG4gICAgICBPYmplY3QuZnJlZXplKG9iaik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VNZXRob2RSZXR1cm5JbW11dGFibGUob2JqLCBtZXRob2ROYW1lKSB7XG4gICAgdmFyIGN1cnJlbnRNZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XG5cbiAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgbWV0aG9kTmFtZSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gSW1tdXRhYmxlKGN1cnJlbnRNZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5U2V0KGlkeCwgdmFsdWUsIGNvbmZpZykge1xuICAgIHZhciBkZWVwICAgICAgICAgID0gY29uZmlnICYmIGNvbmZpZy5kZWVwO1xuXG4gICAgaWYgKGlkeCBpbiB0aGlzKSB7XG4gICAgICBpZiAoZGVlcCAmJiB0aGlzW2lkeF0gIT09IHZhbHVlICYmIGlzTWVyZ2FibGVPYmplY3QodmFsdWUpICYmIGlzTWVyZ2FibGVPYmplY3QodGhpc1tpZHhdKSkge1xuICAgICAgICB2YWx1ZSA9IEltbXV0YWJsZS5tZXJnZSh0aGlzW2lkeF0sIHZhbHVlLCB7ZGVlcDogdHJ1ZSwgbW9kZTogJ3JlcGxhY2UnfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNFcXVhbCh0aGlzW2lkeF0sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbXV0YWJsZSA9IGFzTXV0YWJsZUFycmF5LmNhbGwodGhpcyk7XG4gICAgbXV0YWJsZVtpZHhdID0gSW1tdXRhYmxlKHZhbHVlKTtcbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZUFycmF5KG11dGFibGUpO1xuICB9XG5cbiAgdmFyIGltbXV0YWJsZUVtcHR5QXJyYXkgPSBJbW11dGFibGUoW10pO1xuXG4gIGZ1bmN0aW9uIGFycmF5U2V0SW4ocHRoLCB2YWx1ZSwgY29uZmlnKSB7XG4gICAgdmFyIGhlYWQgPSBwdGhbMF07XG5cbiAgICBpZiAocHRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGFycmF5U2V0LmNhbGwodGhpcywgaGVhZCwgdmFsdWUsIGNvbmZpZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB0YWlsID0gcHRoLnNsaWNlKDEpO1xuICAgICAgdmFyIHRoaXNIZWFkID0gdGhpc1toZWFkXTtcbiAgICAgIHZhciBuZXdWYWx1ZTtcblxuICAgICAgaWYgKHR5cGVvZih0aGlzSGVhZCkgPT09IFwib2JqZWN0XCIgJiYgdGhpc0hlYWQgIT09IG51bGwpIHtcbiAgICAgICAgLy8gTWlnaHQgKHZhbGlkbHkpIGJlIG9iamVjdCBvciBhcnJheVxuICAgICAgICBuZXdWYWx1ZSA9IEltbXV0YWJsZS5zZXRJbih0aGlzSGVhZCwgdGFpbCwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5leHRIZWFkID0gdGFpbFswXTtcbiAgICAgICAgLy8gSWYgdGhlIG5leHQgcGF0aCBwYXJ0IGlzIGEgbnVtYmVyLCB0aGVuIHdlIGFyZSBzZXR0aW5nIGludG8gYW4gYXJyYXksIGVsc2UgYW4gb2JqZWN0LlxuICAgICAgICBpZiAobmV4dEhlYWQgIT09ICcnICYmIGlzRmluaXRlKG5leHRIZWFkKSkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gYXJyYXlTZXRJbi5jYWxsKGltbXV0YWJsZUVtcHR5QXJyYXksIHRhaWwsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IG9iamVjdFNldEluLmNhbGwoaW1tdXRhYmxlRW1wdHlPYmplY3QsIHRhaWwsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaGVhZCBpbiB0aGlzICYmIHRoaXNIZWFkID09PSBuZXdWYWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIG11dGFibGUgPSBhc011dGFibGVBcnJheS5jYWxsKHRoaXMpO1xuICAgICAgbXV0YWJsZVtoZWFkXSA9IG5ld1ZhbHVlO1xuICAgICAgcmV0dXJuIG1ha2VJbW11dGFibGVBcnJheShtdXRhYmxlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlSW1tdXRhYmxlQXJyYXkoYXJyYXkpIHtcbiAgICAvLyBEb24ndCBjaGFuZ2UgdGhlaXIgaW1wbGVtZW50YXRpb25zLCBidXQgd3JhcCB0aGVzZSBmdW5jdGlvbnMgdG8gbWFrZSBzdXJlXG4gICAgLy8gdGhleSBhbHdheXMgcmV0dXJuIGFuIGltbXV0YWJsZSB2YWx1ZS5cbiAgICBmb3IgKHZhciBpbmRleCBpbiBub25NdXRhdGluZ0FycmF5TWV0aG9kcykge1xuICAgICAgaWYgKG5vbk11dGF0aW5nQXJyYXlNZXRob2RzLmhhc093blByb3BlcnR5KGluZGV4KSkge1xuICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IG5vbk11dGF0aW5nQXJyYXlNZXRob2RzW2luZGV4XTtcbiAgICAgICAgbWFrZU1ldGhvZFJldHVybkltbXV0YWJsZShhcnJheSwgbWV0aG9kTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFnbG9iYWxDb25maWcudXNlX3N0YXRpYykge1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJmbGF0TWFwXCIsICBmbGF0TWFwKTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwiYXNPYmplY3RcIiwgYXNPYmplY3QpO1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJhc011dGFibGVcIiwgYXNNdXRhYmxlQXJyYXkpO1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJzZXRcIiwgYXJyYXlTZXQpO1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJzZXRJblwiLCBhcnJheVNldEluKTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwidXBkYXRlXCIsIHVwZGF0ZSk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGFycmF5LCBcInVwZGF0ZUluXCIsIHVwZGF0ZUluKTtcbiAgICB9XG5cbiAgICBmb3IodmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYXJyYXlbaV0gPSBJbW11dGFibGUoYXJyYXlbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlKGFycmF5LCBtdXRhdGluZ0FycmF5TWV0aG9kcyk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlSW1tdXRhYmxlRGF0ZShkYXRlKSB7XG4gICAgaWYgKCFnbG9iYWxDb25maWcudXNlX3N0YXRpYykge1xuICAgICAgYWRkUHJvcGVydHlUbyhkYXRlLCBcImFzTXV0YWJsZVwiLCBhc011dGFibGVEYXRlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZShkYXRlLCBtdXRhdGluZ0RhdGVNZXRob2RzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzTXV0YWJsZURhdGUoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMuZ2V0VGltZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFZmZlY3RpdmVseSBwZXJmb3JtcyBhIG1hcCgpIG92ZXIgdGhlIGVsZW1lbnRzIGluIHRoZSBhcnJheSwgdXNpbmcgdGhlXG4gICAqIHByb3ZpZGVkIGl0ZXJhdG9yLCBleGNlcHQgdGhhdCB3aGVuZXZlciB0aGUgaXRlcmF0b3IgcmV0dXJucyBhbiBhcnJheSwgdGhhdFxuICAgKiBhcnJheSdzIGVsZW1lbnRzIGFyZSBhZGRlZCB0byB0aGUgZmluYWwgcmVzdWx0IGluc3RlYWQgb2YgdGhlIGFycmF5IGl0c2VsZi5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gaXRlcmF0b3IgLSBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgb24gZWFjaCBlbGVtZW50IGluIHRoZSBhcnJheS4gSXQgd2lsbCByZWNlaXZlIHRocmVlIGFyZ3VtZW50czogdGhlIGN1cnJlbnQgdmFsdWUsIHRoZSBjdXJyZW50IGluZGV4LCBhbmQgdGhlIGN1cnJlbnQgb2JqZWN0LlxuICAgKi9cbiAgZnVuY3Rpb24gZmxhdE1hcChpdGVyYXRvcikge1xuICAgIC8vIENhbGxpbmcgLmZsYXRNYXAoKSB3aXRoIG5vIGFyZ3VtZW50cyBpcyBhIG5vLW9wLiBEb24ndCBib3RoZXIgY2xvbmluZy5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgaW5kZXg7XG5cbiAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBpdGVyYXRvclJlc3VsdCA9IGl0ZXJhdG9yKHRoaXNbaW5kZXhdLCBpbmRleCwgdGhpcyk7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZXJhdG9yUmVzdWx0KSkge1xuICAgICAgICAvLyBDb25jYXRlbmF0ZSBBcnJheSByZXN1bHRzIGludG8gdGhlIHJldHVybiB2YWx1ZSB3ZSdyZSBidWlsZGluZyB1cC5cbiAgICAgICAgcmVzdWx0LnB1c2guYXBwbHkocmVzdWx0LCBpdGVyYXRvclJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBIYW5kbGUgbm9uLUFycmF5IHJlc3VsdHMgdGhlIHNhbWUgd2F5IG1hcCgpIGRvZXMuXG4gICAgICAgIHJlc3VsdC5wdXNoKGl0ZXJhdG9yUmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZUFycmF5KHJlc3VsdCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBJbW11dGFibGUgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGdpdmVuIGtleXMgaW5jbHVkZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXl9IGtleXNUb1JlbW92ZSAtIEEgbGlzdCBvZiBzdHJpbmdzIHJlcHJlc2VudGluZyB0aGUga2V5cyB0byBleGNsdWRlIGluIHRoZSByZXR1cm4gdmFsdWUuIEluc3RlYWQgb2YgcHJvdmlkaW5nIGEgc2luZ2xlIGFycmF5LCB0aGlzIG1ldGhvZCBjYW4gYWxzbyBiZSBjYWxsZWQgYnkgcGFzc2luZyBtdWx0aXBsZSBzdHJpbmdzIGFzIHNlcGFyYXRlIGFyZ3VtZW50cy5cbiAgICovXG4gIGZ1bmN0aW9uIHdpdGhvdXQocmVtb3ZlKSB7XG4gICAgLy8gQ2FsbGluZyAud2l0aG91dCgpIHdpdGggbm8gYXJndW1lbnRzIGlzIGEgbm8tb3AuIERvbid0IGJvdGhlciBjbG9uaW5nLlxuICAgIGlmICh0eXBlb2YgcmVtb3ZlID09PSBcInVuZGVmaW5lZFwiICYmIGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcmVtb3ZlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIC8vIElmIHdlIHdlcmVuJ3QgZ2l2ZW4gYW4gYXJyYXksIHVzZSB0aGUgYXJndW1lbnRzIGxpc3QuXG4gICAgICB2YXIga2V5c1RvUmVtb3ZlQXJyYXkgPSAoQXJyYXkuaXNBcnJheShyZW1vdmUpKSA/XG4gICAgICAgICByZW1vdmUuc2xpY2UoKSA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgIC8vIENvbnZlcnQgbnVtZXJpYyBrZXlzIHRvIHN0cmluZ3Mgc2luY2UgdGhhdCdzIGhvdyB0aGV5J2xsXG4gICAgICAvLyBjb21lIGZyb20gdGhlIGVudW1lcmF0aW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICBrZXlzVG9SZW1vdmVBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGVsLCBpZHgsIGFycikge1xuICAgICAgICBpZih0eXBlb2YoZWwpID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgYXJyW2lkeF0gPSBlbC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmVtb3ZlID0gZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleXNUb1JlbW92ZUFycmF5LmluZGV4T2Yoa2V5KSAhPT0gLTE7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KHRoaXMpO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMpIHtcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkgJiYgcmVtb3ZlKHRoaXNba2V5XSwga2V5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGVPYmplY3QocmVzdWx0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzTXV0YWJsZUFycmF5KG9wdHMpIHtcbiAgICB2YXIgcmVzdWx0ID0gW10sIGksIGxlbmd0aDtcblxuICAgIGlmKG9wdHMgJiYgb3B0cy5kZWVwKSB7XG4gICAgICBmb3IoaSA9IDAsIGxlbmd0aCA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0LnB1c2goYXNEZWVwTXV0YWJsZSh0aGlzW2ldKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcihpID0gMCwgbGVuZ3RoID0gdGhpcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEVmZmVjdGl2ZWx5IHBlcmZvcm1zIGEgW21hcF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbWFwKSBvdmVyIHRoZSBlbGVtZW50cyBpbiB0aGUgYXJyYXksIGV4cGVjdGluZyB0aGF0IHRoZSBpdGVyYXRvciBmdW5jdGlvblxuICAgKiB3aWxsIHJldHVybiBhbiBhcnJheSBvZiB0d28gZWxlbWVudHMgLSB0aGUgZmlyc3QgcmVwcmVzZW50aW5nIGEga2V5LCB0aGUgb3RoZXJcbiAgICogYSB2YWx1ZS4gVGhlbiByZXR1cm5zIGFuIEltbXV0YWJsZSBPYmplY3QgY29uc3RydWN0ZWQgb2YgdGhvc2Uga2V5cyBhbmQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRvciAtIEEgZnVuY3Rpb24gd2hpY2ggc2hvdWxkIHJldHVybiBhbiBhcnJheSBvZiB0d28gZWxlbWVudHMgLSB0aGUgZmlyc3QgcmVwcmVzZW50aW5nIHRoZSBkZXNpcmVkIGtleSwgdGhlIG90aGVyIHRoZSBkZXNpcmVkIHZhbHVlLlxuICAgKi9cbiAgZnVuY3Rpb24gYXNPYmplY3QoaXRlcmF0b3IpIHtcbiAgICAvLyBJZiBubyBpdGVyYXRvciB3YXMgcHJvdmlkZWQsIGFzc3VtZSB0aGUgaWRlbnRpdHkgZnVuY3Rpb25cbiAgICAvLyAoc3VnZ2VzdGluZyB0aGlzIGFycmF5IGlzIGFscmVhZHkgYSBsaXN0IG9mIGtleS92YWx1ZSBwYWlycy4pXG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBpdGVyYXRvciA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0ge30sXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBpbmRleDtcblxuICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIHBhaXIgID0gaXRlcmF0b3IodGhpc1tpbmRleF0sIGluZGV4LCB0aGlzKSxcbiAgICAgICAgICBrZXkgICA9IHBhaXJbMF0sXG4gICAgICAgICAgdmFsdWUgPSBwYWlyWzFdO1xuXG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KHJlc3VsdCk7XG4gIH1cblxuICBmdW5jdGlvbiBhc0RlZXBNdXRhYmxlKG9iaikge1xuICAgIGlmIChcbiAgICAgICghb2JqKSB8fFxuICAgICAgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB8fFxuICAgICAgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgaW1tdXRhYmlsaXR5VGFnKSkgfHxcbiAgICAgIChvYmogaW5zdGFuY2VvZiBEYXRlKVxuICAgICkgeyByZXR1cm4gb2JqOyB9XG4gICAgcmV0dXJuIEltbXV0YWJsZS5hc011dGFibGUob2JqLCB7ZGVlcDogdHJ1ZX0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcXVpY2tDb3B5KHNyYywgZGVzdCkge1xuICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNyYywga2V5KSkge1xuICAgICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVzdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEltbXV0YWJsZSBPYmplY3QgY29udGFpbmluZyB0aGUgcHJvcGVydGllcyBhbmQgdmFsdWVzIG9mIGJvdGhcbiAgICogdGhpcyBvYmplY3QgYW5kIHRoZSBwcm92aWRlZCBvYmplY3QsIHByaW9yaXRpemluZyB0aGUgcHJvdmlkZWQgb2JqZWN0J3NcbiAgICogdmFsdWVzIHdoZW5ldmVyIHRoZSBzYW1lIGtleSBpcyBwcmVzZW50IGluIGJvdGggb2JqZWN0cy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IG90aGVyIC0gVGhlIG90aGVyIG9iamVjdCB0byBtZXJnZS4gTXVsdGlwbGUgb2JqZWN0cyBjYW4gYmUgcGFzc2VkIGFzIGFuIGFycmF5LiBJbiBzdWNoIGEgY2FzZSwgdGhlIGxhdGVyIGFuIG9iamVjdCBhcHBlYXJzIGluIHRoYXQgbGlzdCwgdGhlIGhpZ2hlciBpdHMgcHJpb3JpdHkuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgLSBPcHRpb25hbCBjb25maWcgb2JqZWN0IHRoYXQgY29udGFpbnMgc2V0dGluZ3MuIFN1cHBvcnRlZCBzZXR0aW5ncyBhcmU6IHtkZWVwOiB0cnVlfSBmb3IgZGVlcCBtZXJnZSBhbmQge21lcmdlcjogbWVyZ2VyRnVuY30gd2hlcmUgbWVyZ2VyRnVuYyBpcyBhIGZ1bmN0aW9uXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0IHRha2VzIGEgcHJvcGVydHkgZnJvbSBib3RoIG9iamVjdHMuIElmIGFueXRoaW5nIGlzIHJldHVybmVkIGl0IG92ZXJyaWRlcyB0aGUgbm9ybWFsIG1lcmdlIGJlaGF2aW91ci5cbiAgICovXG4gIGZ1bmN0aW9uIG1lcmdlKG90aGVyLCBjb25maWcpIHtcbiAgICAvLyBDYWxsaW5nIC5tZXJnZSgpIHdpdGggbm8gYXJndW1lbnRzIGlzIGEgbm8tb3AuIERvbid0IGJvdGhlciBjbG9uaW5nLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAob3RoZXIgPT09IG51bGwgfHwgKHR5cGVvZiBvdGhlciAhPT0gXCJvYmplY3RcIikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbW11dGFibGUjbWVyZ2UgY2FuIG9ubHkgYmUgaW52b2tlZCB3aXRoIG9iamVjdHMgb3IgYXJyYXlzLCBub3QgXCIgKyBKU09OLnN0cmluZ2lmeShvdGhlcikpO1xuICAgIH1cblxuICAgIHZhciByZWNlaXZlZEFycmF5ID0gKEFycmF5LmlzQXJyYXkob3RoZXIpKSxcbiAgICAgICAgZGVlcCAgICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcuZGVlcCxcbiAgICAgICAgbW9kZSAgICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcubW9kZSB8fCAnbWVyZ2UnLFxuICAgICAgICBtZXJnZXIgICAgICAgID0gY29uZmlnICYmIGNvbmZpZy5tZXJnZXIsXG4gICAgICAgIHJlc3VsdDtcblxuICAgIC8vIFVzZSB0aGUgZ2l2ZW4ga2V5IHRvIGV4dHJhY3QgYSB2YWx1ZSBmcm9tIHRoZSBnaXZlbiBvYmplY3QsIHRoZW4gcGxhY2VcbiAgICAvLyB0aGF0IHZhbHVlIGluIHRoZSByZXN1bHQgb2JqZWN0IHVuZGVyIHRoZSBzYW1lIGtleS4gSWYgdGhhdCByZXN1bHRlZFxuICAgIC8vIGluIGEgY2hhbmdlIGZyb20gdGhpcyBvYmplY3QncyB2YWx1ZSBhdCB0aGF0IGtleSwgc2V0IGFueUNoYW5nZXMgPSB0cnVlLlxuICAgIGZ1bmN0aW9uIGFkZFRvUmVzdWx0KGN1cnJlbnRPYmosIG90aGVyT2JqLCBrZXkpIHtcbiAgICAgIHZhciBpbW11dGFibGVWYWx1ZSA9IEltbXV0YWJsZShvdGhlck9ialtrZXldKTtcbiAgICAgIHZhciBtZXJnZXJSZXN1bHQgPSBtZXJnZXIgJiYgbWVyZ2VyKGN1cnJlbnRPYmpba2V5XSwgaW1tdXRhYmxlVmFsdWUsIGNvbmZpZyk7XG4gICAgICB2YXIgY3VycmVudFZhbHVlID0gY3VycmVudE9ialtrZXldO1xuXG4gICAgICBpZiAoKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB8fFxuICAgICAgICAobWVyZ2VyUmVzdWx0ICE9PSB1bmRlZmluZWQpIHx8XG4gICAgICAgICghY3VycmVudE9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB8fFxuICAgICAgICAhaXNFcXVhbChpbW11dGFibGVWYWx1ZSwgY3VycmVudFZhbHVlKSkge1xuXG4gICAgICAgIHZhciBuZXdWYWx1ZTtcblxuICAgICAgICBpZiAobWVyZ2VyUmVzdWx0KSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBtZXJnZXJSZXN1bHQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVlcCAmJiBpc01lcmdhYmxlT2JqZWN0KGN1cnJlbnRWYWx1ZSkgJiYgaXNNZXJnYWJsZU9iamVjdChpbW11dGFibGVWYWx1ZSkpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IEltbXV0YWJsZS5tZXJnZShjdXJyZW50VmFsdWUsIGltbXV0YWJsZVZhbHVlLCBjb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1ZhbHVlID0gaW1tdXRhYmxlVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzRXF1YWwoY3VycmVudFZhbHVlLCBuZXdWYWx1ZSkgfHwgIWN1cnJlbnRPYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gTWFrZSBhIHNoYWxsb3cgY2xvbmUgb2YgdGhlIGN1cnJlbnQgb2JqZWN0LlxuICAgICAgICAgICAgcmVzdWx0ID0gcXVpY2tDb3B5KGN1cnJlbnRPYmosIGluc3RhbnRpYXRlRW1wdHlPYmplY3QoY3VycmVudE9iaikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdFtrZXldID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckRyb3BwZWRLZXlzKGN1cnJlbnRPYmosIG90aGVyT2JqKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gY3VycmVudE9iaikge1xuICAgICAgICBpZiAoIW90aGVyT2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIE1ha2UgYSBzaGFsbG93IGNsb25lIG9mIHRoZSBjdXJyZW50IG9iamVjdC5cbiAgICAgICAgICAgIHJlc3VsdCA9IHF1aWNrQ29weShjdXJyZW50T2JqLCBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KGN1cnJlbnRPYmopKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsZXRlIHJlc3VsdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGtleTtcblxuICAgIC8vIEFjaGlldmUgcHJpb3JpdGl6YXRpb24gYnkgb3ZlcnJpZGluZyBwcmV2aW91cyB2YWx1ZXMgdGhhdCBnZXQgaW4gdGhlIHdheS5cbiAgICBpZiAoIXJlY2VpdmVkQXJyYXkpIHtcbiAgICAgIC8vIFRoZSBtb3N0IGNvbW1vbiB1c2UgY2FzZToganVzdCBtZXJnZSBvbmUgb2JqZWN0IGludG8gdGhlIGV4aXN0aW5nIG9uZS5cbiAgICAgIGZvciAoa2V5IGluIG90aGVyKSB7XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG90aGVyLCBrZXkpKSB7XG4gICAgICAgICAgYWRkVG9SZXN1bHQodGhpcywgb3RoZXIsIGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtb2RlID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgY2xlYXJEcm9wcGVkS2V5cyh0aGlzLCBvdGhlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIGFsc28gYWNjZXB0IGFuIEFycmF5XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IG90aGVyLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIG90aGVyRnJvbUFycmF5ID0gb3RoZXJbaW5kZXhdO1xuXG4gICAgICAgIGZvciAoa2V5IGluIG90aGVyRnJvbUFycmF5KSB7XG4gICAgICAgICAgaWYgKG90aGVyRnJvbUFycmF5Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGFkZFRvUmVzdWx0KHJlc3VsdCAhPT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdGhpcywgb3RoZXJGcm9tQXJyYXksIGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG1ha2VJbW11dGFibGVPYmplY3QocmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RSZXBsYWNlKHZhbHVlLCBjb25maWcpIHtcbiAgICB2YXIgZGVlcCAgICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcuZGVlcDtcblxuICAgIC8vIENhbGxpbmcgLnJlcGxhY2UoKSB3aXRoIG5vIGFyZ3VtZW50cyBpcyBhIG5vLW9wLiBEb24ndCBib3RoZXIgY2xvbmluZy5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkltbXV0YWJsZSNyZXBsYWNlIGNhbiBvbmx5IGJlIGludm9rZWQgd2l0aCBvYmplY3RzIG9yIGFycmF5cywgbm90IFwiICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSW1tdXRhYmxlLm1lcmdlKHRoaXMsIHZhbHVlLCB7ZGVlcDogZGVlcCwgbW9kZTogJ3JlcGxhY2UnfSk7XG4gIH1cblxuICB2YXIgaW1tdXRhYmxlRW1wdHlPYmplY3QgPSBJbW11dGFibGUoe30pO1xuXG4gIGZ1bmN0aW9uIG9iamVjdFNldEluKHBhdGgsIHZhbHVlLCBjb25maWcpIHtcbiAgICBpZiAoIShwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHx8IHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIGZpcnN0IGFyZ3VtZW50IHRvIEltbXV0YWJsZSNzZXRJbiBtdXN0IGJlIGFuIGFycmF5IGNvbnRhaW5pbmcgYXQgbGVhc3Qgb25lIFxcXCJrZXlcXFwiIHN0cmluZy5cIik7XG4gICAgfVxuXG4gICAgdmFyIGhlYWQgPSBwYXRoWzBdO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIG9iamVjdFNldC5jYWxsKHRoaXMsIGhlYWQsIHZhbHVlLCBjb25maWcpO1xuICAgIH1cblxuICAgIHZhciB0YWlsID0gcGF0aC5zbGljZSgxKTtcbiAgICB2YXIgbmV3VmFsdWU7XG4gICAgdmFyIHRoaXNIZWFkID0gdGhpc1toZWFkXTtcblxuICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGhlYWQpICYmIHR5cGVvZih0aGlzSGVhZCkgPT09IFwib2JqZWN0XCIgJiYgdGhpc0hlYWQgIT09IG51bGwpIHtcbiAgICAgIC8vIE1pZ2h0ICh2YWxpZGx5KSBiZSBvYmplY3Qgb3IgYXJyYXlcbiAgICAgIG5ld1ZhbHVlID0gSW1tdXRhYmxlLnNldEluKHRoaXNIZWFkLCB0YWlsLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1ZhbHVlID0gb2JqZWN0U2V0SW4uY2FsbChpbW11dGFibGVFbXB0eU9iamVjdCwgdGFpbCwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGhlYWQpICYmIHRoaXNIZWFkID09PSBuZXdWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIG11dGFibGUgPSBxdWlja0NvcHkodGhpcywgaW5zdGFudGlhdGVFbXB0eU9iamVjdCh0aGlzKSk7XG4gICAgbXV0YWJsZVtoZWFkXSA9IG5ld1ZhbHVlO1xuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KG11dGFibGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gb2JqZWN0U2V0KHByb3BlcnR5LCB2YWx1ZSwgY29uZmlnKSB7XG4gICAgdmFyIGRlZXAgICAgICAgICAgPSBjb25maWcgJiYgY29uZmlnLmRlZXA7XG5cbiAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgIGlmIChkZWVwICYmIHRoaXNbcHJvcGVydHldICE9PSB2YWx1ZSAmJiBpc01lcmdhYmxlT2JqZWN0KHZhbHVlKSAmJiBpc01lcmdhYmxlT2JqZWN0KHRoaXNbcHJvcGVydHldKSkge1xuICAgICAgICB2YWx1ZSA9IEltbXV0YWJsZS5tZXJnZSh0aGlzW3Byb3BlcnR5XSwgdmFsdWUsIHtkZWVwOiB0cnVlLCBtb2RlOiAncmVwbGFjZSd9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0VxdWFsKHRoaXNbcHJvcGVydHldLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG11dGFibGUgPSBxdWlja0NvcHkodGhpcywgaW5zdGFudGlhdGVFbXB0eU9iamVjdCh0aGlzKSk7XG4gICAgbXV0YWJsZVtwcm9wZXJ0eV0gPSBJbW11dGFibGUodmFsdWUpO1xuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KG11dGFibGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKHByb3BlcnR5LCB1cGRhdGVyKSB7XG4gICAgdmFyIHJlc3RBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaW5pdGlhbFZhbCA9IHRoaXNbcHJvcGVydHldO1xuICAgIHJldHVybiBJbW11dGFibGUuc2V0KHRoaXMsIHByb3BlcnR5LCB1cGRhdGVyLmFwcGx5KGluaXRpYWxWYWwsIFtpbml0aWFsVmFsXS5jb25jYXQocmVzdEFyZ3MpKSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJblBhdGgob2JqLCBwYXRoKSB7XG4gICAgLypqc2hpbnQgZXFudWxsOnRydWUgKi9cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGgubGVuZ3RoOyBvYmogIT0gbnVsbCAmJiBpIDwgbDsgaSsrKSB7XG4gICAgICBvYmogPSBvYmpbcGF0aFtpXV07XG4gICAgfVxuXG4gICAgcmV0dXJuIChpICYmIGkgPT0gbCkgPyBvYmogOiB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVJbihwYXRoLCB1cGRhdGVyKSB7XG4gICAgdmFyIHJlc3RBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaW5pdGlhbFZhbCA9IGdldEluUGF0aCh0aGlzLCBwYXRoKTtcblxuICAgIHJldHVybiBJbW11dGFibGUuc2V0SW4odGhpcywgcGF0aCwgdXBkYXRlci5hcHBseShpbml0aWFsVmFsLCBbaW5pdGlhbFZhbF0uY29uY2F0KHJlc3RBcmdzKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNNdXRhYmxlT2JqZWN0KG9wdHMpIHtcbiAgICB2YXIgcmVzdWx0ID0gaW5zdGFudGlhdGVFbXB0eU9iamVjdCh0aGlzKSwga2V5O1xuXG4gICAgaWYob3B0cyAmJiBvcHRzLmRlZXApIHtcbiAgICAgIGZvciAoa2V5IGluIHRoaXMpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gYXNEZWVwTXV0YWJsZSh0aGlzW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoa2V5IGluIHRoaXMpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpc1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIENyZWF0ZXMgcGxhaW4gb2JqZWN0IHRvIGJlIHVzZWQgZm9yIGNsb25pbmdcbiAgZnVuY3Rpb24gaW5zdGFudGlhdGVQbGFpbk9iamVjdCgpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvLyBGaW5hbGl6ZXMgYW4gb2JqZWN0IHdpdGggaW1tdXRhYmxlIG1ldGhvZHMsIGZyZWV6ZXMgaXQsIGFuZCByZXR1cm5zIGl0LlxuICBmdW5jdGlvbiBtYWtlSW1tdXRhYmxlT2JqZWN0KG9iaikge1xuICAgIGlmICghZ2xvYmFsQ29uZmlnLnVzZV9zdGF0aWMpIHtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcIm1lcmdlXCIsIG1lcmdlKTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcInJlcGxhY2VcIiwgb2JqZWN0UmVwbGFjZSk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJ3aXRob3V0XCIsIHdpdGhvdXQpO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwiYXNNdXRhYmxlXCIsIGFzTXV0YWJsZU9iamVjdCk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJzZXRcIiwgb2JqZWN0U2V0KTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcInNldEluXCIsIG9iamVjdFNldEluKTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcInVwZGF0ZVwiLCB1cGRhdGUpO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwidXBkYXRlSW5cIiwgdXBkYXRlSW4pO1xuICAgIH1cblxuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlKG9iaiwgbXV0YXRpbmdPYmplY3RNZXRob2RzKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgYSB2YWxpZCByZWFjdCBlbGVtZW50XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL3YxNS4wLjEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMzI2XG4gIGZ1bmN0aW9uIGlzUmVhY3RFbGVtZW50KG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICBvYmogIT09IG51bGwgJiZcbiAgICAgICAgICAgKG9iai4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFX0ZBTExCQUNLIHx8IG9iai4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRmlsZU9iamVjdChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIEZpbGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgIG9iaiBpbnN0YW5jZW9mIEZpbGU7XG4gIH1cblxuICBmdW5jdGlvbiBJbW11dGFibGUob2JqLCBvcHRpb25zLCBzdGFja1JlbWFpbmluZykge1xuICAgIGlmIChpc0ltbXV0YWJsZShvYmopIHx8IGlzUmVhY3RFbGVtZW50KG9iaikgfHwgaXNGaWxlT2JqZWN0KG9iaikpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgIHJldHVybiBtYWtlSW1tdXRhYmxlQXJyYXkob2JqLnNsaWNlKCkpO1xuICAgIH0gZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuIG1ha2VJbW11dGFibGVEYXRlKG5ldyBEYXRlKG9iai5nZXRUaW1lKCkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRG9uJ3QgZnJlZXplIHRoZSBvYmplY3Qgd2Ugd2VyZSBnaXZlbjsgbWFrZSBhIGNsb25lIGFuZCB1c2UgdGhhdC5cbiAgICAgIHZhciBwcm90b3R5cGUgPSBvcHRpb25zICYmIG9wdGlvbnMucHJvdG90eXBlO1xuICAgICAgdmFyIGluc3RhbnRpYXRlRW1wdHlPYmplY3QgPVxuICAgICAgICAoIXByb3RvdHlwZSB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGUpID9cbiAgICAgICAgICBpbnN0YW50aWF0ZVBsYWluT2JqZWN0IDogKGZ1bmN0aW9uKCkgeyByZXR1cm4gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpOyB9KTtcbiAgICAgIHZhciBjbG9uZSA9IGluc3RhbnRpYXRlRW1wdHlPYmplY3QoKTtcblxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgICAvKmpzaGludCBlcW51bGw6dHJ1ZSAqL1xuICAgICAgICBpZiAoc3RhY2tSZW1haW5pbmcgPT0gbnVsbCkge1xuICAgICAgICAgIHN0YWNrUmVtYWluaW5nID0gNjQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YWNrUmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgSW1tdXRhYmxlRXJyb3IoXCJBdHRlbXB0IHRvIGNvbnN0cnVjdCBJbW11dGFibGUgZnJvbSBhIGRlZXBseSBuZXN0ZWQgb2JqZWN0IHdhcyBkZXRlY3RlZC5cIiArXG4gICAgICAgICAgICBcIiBIYXZlIHlvdSB0cmllZCB0byB3cmFwIGFuIG9iamVjdCB3aXRoIGNpcmN1bGFyIHJlZmVyZW5jZXMgKGUuZy4gUmVhY3QgZWxlbWVudCk/XCIgK1xuICAgICAgICAgICAgXCIgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9ydGZlbGRtYW4vc2VhbWxlc3MtaW1tdXRhYmxlL3dpa2kvRGVlcGx5LW5lc3RlZC1vYmplY3Qtd2FzLWRldGVjdGVkIGZvciBkZXRhaWxzLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBzdGFja1JlbWFpbmluZyAtPSAxO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSkge1xuICAgICAgICAgIGNsb25lW2tleV0gPSBJbW11dGFibGUob2JqW2tleV0sIHVuZGVmaW5lZCwgc3RhY2tSZW1haW5pbmcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KGNsb25lKTtcbiAgICB9XG4gIH1cblxuICAvLyBXcmFwcGVyIHRvIGFsbG93IHRoZSB1c2Ugb2Ygb2JqZWN0IG1ldGhvZHMgYXMgc3RhdGljIG1ldGhvZHMgb2YgSW1tdXRhYmxlLlxuICBmdW5jdGlvbiB0b1N0YXRpYyhmbikge1xuICAgIGZ1bmN0aW9uIHN0YXRpY1dyYXBwZXIoKSB7XG4gICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIHZhciBzZWxmID0gYXJncy5zaGlmdCgpO1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0aWNXcmFwcGVyO1xuICB9XG5cbiAgLy8gV3JhcHBlciB0byBhbGxvdyB0aGUgdXNlIG9mIG9iamVjdCBtZXRob2RzIGFzIHN0YXRpYyBtZXRob2RzIG9mIEltbXV0YWJsZS5cbiAgLy8gd2l0aCB0aGUgYWRkaXRpb25hbCBjb25kaXRpb24gb2YgY2hvb3Npbmcgd2hpY2ggZnVuY3Rpb24gdG8gY2FsbCBkZXBlbmRpbmdcbiAgLy8gaWYgYXJndW1lbnQgaXMgYW4gYXJyYXkgb3IgYW4gb2JqZWN0LlxuICBmdW5jdGlvbiB0b1N0YXRpY09iamVjdE9yQXJyYXkoZm5PYmplY3QsIGZuQXJyYXkpIHtcbiAgICBmdW5jdGlvbiBzdGF0aWNXcmFwcGVyKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgc2VsZiA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNlbGYpKSB7XG4gICAgICAgICAgcmV0dXJuIGZuQXJyYXkuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmbk9iamVjdC5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGljV3JhcHBlcjtcbiAgfVxuXG4gIC8vIFdyYXBwZXIgdG8gYWxsb3cgdGhlIHVzZSBvZiBvYmplY3QgbWV0aG9kcyBhcyBzdGF0aWMgbWV0aG9kcyBvZiBJbW11dGFibGUuXG4gIC8vIHdpdGggdGhlIGFkZGl0aW9uYWwgY29uZGl0aW9uIG9mIGNob29zaW5nIHdoaWNoIGZ1bmN0aW9uIHRvIGNhbGwgZGVwZW5kaW5nXG4gIC8vIGlmIGFyZ3VtZW50IGlzIGFuIGFycmF5IG9yIGFuIG9iamVjdCBvciBhIGRhdGUuXG4gIGZ1bmN0aW9uIHRvU3RhdGljT2JqZWN0T3JEYXRlT3JBcnJheShmbk9iamVjdCwgZm5BcnJheSwgZm5EYXRlKSB7XG4gICAgZnVuY3Rpb24gc3RhdGljV3JhcHBlcigpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgdmFyIHNlbGYgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxmKSkge1xuICAgICAgICAgIHJldHVybiBmbkFycmF5LmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfSBlbHNlIGlmIChzZWxmIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgIHJldHVybiBmbkRhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmbk9iamVjdC5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGljV3JhcHBlcjtcbiAgfVxuXG4gIC8vIEV4cG9ydCB0aGUgbGlicmFyeVxuICBJbW11dGFibGUuZnJvbSAgICAgICAgICAgPSBJbW11dGFibGU7XG4gIEltbXV0YWJsZS5pc0ltbXV0YWJsZSAgICA9IGlzSW1tdXRhYmxlO1xuICBJbW11dGFibGUuSW1tdXRhYmxlRXJyb3IgPSBJbW11dGFibGVFcnJvcjtcbiAgSW1tdXRhYmxlLm1lcmdlICAgICAgICAgID0gdG9TdGF0aWMobWVyZ2UpO1xuICBJbW11dGFibGUucmVwbGFjZSAgICAgICAgPSB0b1N0YXRpYyhvYmplY3RSZXBsYWNlKTtcbiAgSW1tdXRhYmxlLndpdGhvdXQgICAgICAgID0gdG9TdGF0aWMod2l0aG91dCk7XG4gIEltbXV0YWJsZS5hc011dGFibGUgICAgICA9IHRvU3RhdGljT2JqZWN0T3JEYXRlT3JBcnJheShhc011dGFibGVPYmplY3QsIGFzTXV0YWJsZUFycmF5LCBhc011dGFibGVEYXRlKTtcbiAgSW1tdXRhYmxlLnNldCAgICAgICAgICAgID0gdG9TdGF0aWNPYmplY3RPckFycmF5KG9iamVjdFNldCwgYXJyYXlTZXQpO1xuICBJbW11dGFibGUuc2V0SW4gICAgICAgICAgPSB0b1N0YXRpY09iamVjdE9yQXJyYXkob2JqZWN0U2V0SW4sIGFycmF5U2V0SW4pO1xuICBJbW11dGFibGUudXBkYXRlICAgICAgICAgPSB0b1N0YXRpYyh1cGRhdGUpO1xuICBJbW11dGFibGUudXBkYXRlSW4gICAgICAgPSB0b1N0YXRpYyh1cGRhdGVJbik7XG4gIEltbXV0YWJsZS5mbGF0TWFwICAgICAgICA9IHRvU3RhdGljKGZsYXRNYXApO1xuICBJbW11dGFibGUuYXNPYmplY3QgICAgICAgPSB0b1N0YXRpYyhhc09iamVjdCk7XG4gIGlmICghZ2xvYmFsQ29uZmlnLnVzZV9zdGF0aWMpIHtcbiAgICAgIEltbXV0YWJsZS5zdGF0aWMgPSBpbW11dGFibGVJbml0KHtcbiAgICAgICAgICB1c2Vfc3RhdGljOiB0cnVlXG4gICAgICB9KTtcbiAgfVxuXG4gIE9iamVjdC5mcmVlemUoSW1tdXRhYmxlKTtcblxuICByZXR1cm4gSW1tdXRhYmxlO1xufVxuXG4gIHZhciBJbW11dGFibGUgPSBpbW11dGFibGVJbml0KCk7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIEltbXV0YWJsZTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJbW11dGFibGU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBleHBvcnRzLkltbXV0YWJsZSA9IEltbXV0YWJsZTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSB7XG4gICAgd2luZG93LkltbXV0YWJsZSA9IEltbXV0YWJsZTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiKSB7XG4gICAgZ2xvYmFsLkltbXV0YWJsZSA9IEltbXV0YWJsZTtcbiAgfVxufSkoKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cblxuaW1wb3J0IEltbXV0YWJsZSBmcm9tICdzZWFtbGVzcy1pbW11dGFibGUnO1xuaW1wb3J0IHsgY3VycnksIGxlbnMsIHByb3AgfSBmcm9tICdyYW1kYSc7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVBdCA9IGN1cnJ5KChrZXlBcnJheSwgbmV3VmFsLCBvYmopID0+IHtcbiAgY29uc3QgZGVlcE5ld1ZhbCA9IGtleUFycmF5LnJlZHVjZVJpZ2h0KFxuICAgIChyZXN1bHQsIGtleSkgPT4gKHsgW2tleV06IHJlc3VsdCB9KVxuICAgICwgbmV3VmFsXG4gICk7XG5cbiAgcmV0dXJuIEltbXV0YWJsZShvYmopLm1lcmdlKGRlZXBOZXdWYWwsIHsgZGVlcDogdHJ1ZSB9KTtcbn0pO1xuXG4vLyBTdGF0ZSBsZW5zZXNcbmV4cG9ydCBjb25zdCBTdGF0ZUxlbnNlcyA9IHtcbiAgZmllbGRUeXBlczogbGVucyhwcm9wKCdmaWVsZFR5cGVzJyksIHVwZGF0ZUF0KFsnZmllbGRUeXBlcyddKSksXG4gIGZpZWxkc1N0YXRlOiBsZW5zKHByb3AoJ2ZpZWxkc1N0YXRlJyksIHVwZGF0ZUF0KFsnZmllbGRzU3RhdGUnXSkpLFxuICBmaWVsZHNTdGF0ZUhpc3Rvcnk6IGxlbnMocHJvcCgnZmllbGRzU3RhdGVIaXN0b3J5JyksIHVwZGF0ZUF0KFsnZmllbGRzU3RhdGVIaXN0b3J5J10pKSxcbn07XG4iLCJpbXBvcnQgeyBTdGF0ZUxlbnNlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBzZXQsIG92ZXIsIHNsaWNlLCBwaXBlIH0gZnJvbSBcInJhbWRhXCI7XG5cblxuY29uc3QgdW5kbyA9IChzdGF0ZSwgXykgPT4gcGlwZShcbiAgLy8gTWFrZSBsYXN0IGhpc3RvcnkgbGFzdCBzdGF0ZSB0aGUgY3VycmVudCBvbmVcbiAgc2V0KFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlLCBzdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnlbMF0pLFxuICAvLyBSZW1vdmUgbGFzdCBoaXN0b3J5IHN0YXRlIGZyb20gdGhlIGhpc3RvcnkgYXJyYXlcbiAgb3ZlcihTdGF0ZUxlbnNlcy5maWVsZHNTdGF0ZUhpc3RvcnksIHNsaWNlKDEsIEluZmluaXR5KSlcbikoc3RhdGUpO1xuXG5leHBvcnQgZGVmYXVsdCB1bmRvO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbmVzdGVkLXRlcm5hcnkgKi9cbmltcG9ydCBhc3NlcnQgZnJvbSAnZmwtYXNzZXJ0JztcbmltcG9ydCB1bmRvIGZyb20gJy4vdW5kbyc7XG5cbmNvbnN0IGFjdGlvbkhhbmRsZXJzID0ge1xuICB1bmRvLFxufTtcblxuY29uc3QgaXNFeHBlY3RlZEFjdGlvbiA9IGEgPT4gYSAmJiBhLnR5cGUgJiYgYWN0aW9uSGFuZGxlcnNbYS50eXBlXTtcbmNvbnN0IGlzUmVkdXhBY3Rpb24gPSBhID0+IGEgJiYgYS50eXBlICYmIGEudHlwZS5pbmNsdWRlcygnQEByZWR1eCcpO1xuXG5cbmNvbnN0IHVwZGF0ZSA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICBpc0V4cGVjdGVkQWN0aW9uKGFjdGlvbilcbiAgICA/IGFjdGlvbkhhbmRsZXJzW2FjdGlvbi50eXBlXShzdGF0ZSwgYWN0aW9uKVxuICA6IGlzUmVkdXhBY3Rpb24oYWN0aW9uKVxuICAgID8gc3RhdGVcbiAgOiBhc3NlcnQoZmFsc2UsIGBJbnZhbGlkIGFjdGlvbiB0eXBlOiAke2FjdGlvbi50eXBlfWApO1xuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGU7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHsgdW5kbyBhcyB1bmRvQWN0aW9uIH0gZnJvbSBcIi4uL2pzL0FjdGlvbnNcIjtcbmltcG9ydCB1cGRhdGUgZnJvbSBcIi4uL2pzL1VwZGF0ZVwiO1xuXG5jb25zdCBjdXJyZW50RmllbGRzU3RhdGUgPSBbXCJjdXJyZW50XCJdO1xuY29uc3Qgb2xkRmllbGRzU3RhdGUgPSBbXCJvbGRcIl07XG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFtdLFxuICBmaWVsZHNTdGF0ZTogY3VycmVudEZpZWxkc1N0YXRlLFxuICBmaWVsZHNTdGF0ZUhpc3Rvcnk6IFtvbGRGaWVsZHNTdGF0ZV0sXG59O1xuXG5kZXNjcmliZShcIlVwZGF0ZS51bmRvXCIsICgpID0+IHtcbiAgaXQoXCJyZW1vdmVzIGZpcnN0IG9sZCBzdGF0ZSBmcm9tIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB1bmRvQWN0aW9uKCkpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gIH0pO1xuXG4gIGl0KFwic2V0cyBmaXJzdCBvbGQgc3RhdGUgYXMgY3VycmVudCBzdGF0ZVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIHVuZG9BY3Rpb24oKSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGUpLnRvRXF1YWwob2xkRmllbGRzU3RhdGUpO1xuICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbInVuZG8iLCJfIiwiZGVzY3JpYmUiLCJhY3Rpb24iLCJ0eXBlIiwidG9FcXVhbCIsIl9pc0FycmF5IiwiX3NsaWNlIiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDAiLCJfY2hlY2tGb3JNZXRob2QiLCJfaXNQbGFjZWhvbGRlciIsIl9jdXJyeTEiLCJfY3VycnkyIiwicmVxdWlyZSQkMiIsIl9jdXJyeTMiLCJhbHdheXMiLCJvdmVyIiwiX2FyaXR5IiwiX3BpcGUiLCJfeHdyYXAiLCJiaW5kIiwiX2lzU3RyaW5nIiwiaXNBcnJheUxpa2UiLCJfcmVkdWNlIiwic2xpY2UiLCJyZXF1aXJlJCQzIiwicHJvcCIsIl9pc1RyYW5zZm9ybWVyIiwiX2Rpc3BhdGNoYWJsZSIsIl9tYXAiLCJfeG1hcCIsIl9jdXJyeU4iLCJjdXJyeU4iLCJfaGFzIiwiX2lzQXJndW1lbnRzIiwia2V5cyIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNCIsIm1hcCIsImxlbnMiLCJjdXJyeSIsImdsb2JhbCIsInVwZGF0ZUF0IiwiX2RlZmF1bHQiLCJrZXlBcnJheSIsIm5ld1ZhbCIsIm9iaiIsImRlZXBOZXdWYWwiLCJyZWR1Y2VSaWdodCIsInJlc3VsdCIsImtleSIsIkltbXV0YWJsZSIsIm1lcmdlIiwiZGVlcCIsIlN0YXRlTGVuc2VzIiwiX2RlZmF1bHQyIiwiX2RlZmF1bHQzIiwic3RhdGUiLCJmaWVsZHNTdGF0ZSIsImZpZWxkc1N0YXRlSGlzdG9yeSIsIl9kZWZhdWx0NCIsIkluZmluaXR5IiwiYWN0aW9uSGFuZGxlcnMiLCJpc0V4cGVjdGVkQWN0aW9uIiwiYSIsImlzUmVkdXhBY3Rpb24iLCJpbmNsdWRlcyIsInVwZGF0ZSIsImFzc2VydCIsImN1cnJlbnRGaWVsZHNTdGF0ZSIsIm9sZEZpZWxkc1N0YXRlIiwibW9ja1N0YXRlIiwibW9kaWZpZWRTdGF0ZSIsInVuZG9BY3Rpb24iLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBSUEsQUFBTyxNQUFNQSxPQUFPQyxNQUNuQjtRQUNPO0NBRlksQ0FBYjs7QUNKUDs7QUFFQSxBQUVBQyxTQUFTLFFBQVQsRUFBbUIsTUFBTTtXQUNkLE1BQVQsRUFBaUIsTUFBTTtPQUNsQixpQ0FBSCxFQUFzQyxNQUFNO1lBQ3BDQyxTQUFTSCxNQUFmO2FBQ09HLE9BQU9DLElBQWQsRUFBb0JDLE9BQXBCLENBQTRCLE1BQTVCO0tBRkY7R0FERjtDQURGOztBQ0pBOzs7Ozs7Ozs7OztBQVdBLFNBQVMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRTtFQUNqRCxJQUFJLENBQUMsU0FBUyxFQUFFO0lBQ2QsSUFBSSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7SUFDOUIsSUFBSSxFQUFFLEdBQUcsa0JBQWtCLENBQUM7SUFDNUIsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbkMsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDOztJQUV4QixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25DLE9BQU8sUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUM5QixjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ2pDLFFBQVEsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ2hDOzs7OztJQUtELElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO01BQ3JCLG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsb0JBQW9CLENBQUM7S0FDeEU7O0lBRUQsb0JBQW9CLElBQUksWUFBWSxDQUFDO0lBQ3JDLE9BQU8sb0JBQW9CLENBQUM7R0FDN0I7O0VBRUQsT0FBTyxJQUFJLENBQUM7Q0FDYjs7Ozs7Ozs7Ozs7O0FBWUQsU0FBUyxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRTtFQUN2QyxJQUFJLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7RUFDdEQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7SUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN4QjtDQUNGOzs7Ozs7Ozs7Ozs7QUFZRCxNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUU7RUFDbkQsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0VBQ3RELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO0lBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDckI7Q0FDRixDQUFDLEFBRUYsQUFBc0IsQUFDdEI7O0FDekVBOzs7Ozs7Ozs7Ozs7QUFZQSxjQUFjLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxTQUFTQyxVQUFRLENBQUMsR0FBRyxFQUFFO0VBQ3ZELFFBQVEsR0FBRyxJQUFJLElBQUk7VUFDWCxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUM7VUFDZixNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssZ0JBQWdCLEVBQUU7Q0FDbkUsQ0FBQzs7QUNoQkY7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLFlBQWMsR0FBRyxTQUFTQyxRQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7RUFDL0MsUUFBUSxTQUFTLENBQUMsTUFBTTtJQUN0QixLQUFLLENBQUMsRUFBRSxPQUFPQSxRQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUMsS0FBSyxDQUFDLEVBQUUsT0FBT0EsUUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9DO01BQ0UsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO01BQ2QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO01BQ1osSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO01BQ3hELE9BQU8sR0FBRyxHQUFHLEdBQUcsRUFBRTtRQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztRQUM3QixHQUFHLElBQUksQ0FBQyxDQUFDO09BQ1Y7TUFDRCxPQUFPLElBQUksQ0FBQztHQUNmO0NBQ0YsQ0FBQzs7QUMvQkYsSUFBSSxRQUFRLEdBQUdDLFVBQXFCLENBQUM7QUFDckMsSUFBSSxNQUFNLEdBQUdDLFFBQW1CLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFhakMscUJBQWMsR0FBRyxTQUFTQyxpQkFBZSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUU7RUFDeEQsT0FBTyxXQUFXO0lBQ2hCLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFDOUIsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQ2hCLE9BQU8sRUFBRSxFQUFFLENBQUM7S0FDYjtJQUNELElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxVQUFVO01BQzVELEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQztNQUN6QixHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNoRSxDQUFDO0NBQ0gsQ0FBQzs7QUN6QkYsb0JBQWMsR0FBRyxTQUFTQyxnQkFBYyxDQUFDLENBQUMsRUFBRTtFQUMxQyxPQUFPLENBQUMsSUFBSSxJQUFJO1NBQ1QsT0FBTyxDQUFDLEtBQUssUUFBUTtTQUNyQixDQUFDLENBQUMsMEJBQTBCLENBQUMsS0FBSyxJQUFJLENBQUM7Q0FDL0MsQ0FBQzs7QUNKRixJQUFJQSxnQkFBYyxHQUFHRixnQkFBMkIsQ0FBQzs7Ozs7Ozs7Ozs7QUFXakQsYUFBYyxHQUFHLFNBQVNHLFNBQU8sQ0FBQyxFQUFFLEVBQUU7RUFDcEMsT0FBTyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDcEIsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSUQsZ0JBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUMvQyxPQUFPLEVBQUUsQ0FBQztLQUNYLE1BQU07TUFDTCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ2xDO0dBQ0YsQ0FBQztDQUNILENBQUM7O0FDbkJGLElBQUlDLFNBQU8sR0FBR0osU0FBb0IsQ0FBQztBQUNuQyxJQUFJRyxnQkFBYyxHQUFHRixnQkFBMkIsQ0FBQzs7Ozs7Ozs7Ozs7QUFXakQsYUFBYyxHQUFHLFNBQVNJLFNBQU8sQ0FBQyxFQUFFLEVBQUU7RUFDcEMsT0FBTyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0lBQ3ZCLFFBQVEsU0FBUyxDQUFDLE1BQU07TUFDdEIsS0FBSyxDQUFDO1FBQ0osT0FBTyxFQUFFLENBQUM7TUFDWixLQUFLLENBQUM7UUFDSixPQUFPRixnQkFBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUU7ZUFDdEJDLFNBQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUNyRDtRQUNFLE9BQU9ELGdCQUFjLENBQUMsQ0FBQyxDQUFDLElBQUlBLGdCQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRTtlQUMzQ0EsZ0JBQWMsQ0FBQyxDQUFDLENBQUMsR0FBR0MsU0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztlQUMvREQsZ0JBQWMsQ0FBQyxDQUFDLENBQUMsR0FBR0MsU0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztlQUMvRCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ25CO0dBQ0YsQ0FBQztDQUNILENBQUM7O0FDM0JGLElBQUksT0FBTyxHQUFHRSxTQUFvQixDQUFDO0FBQ25DLElBQUksT0FBTyxHQUFHTixTQUFvQixDQUFDO0FBQ25DLElBQUksY0FBYyxHQUFHQyxnQkFBMkIsQ0FBQzs7Ozs7Ozs7Ozs7QUFXakQsYUFBYyxHQUFHLFNBQVNNLFNBQU8sQ0FBQyxFQUFFLEVBQUU7RUFDcEMsT0FBTyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtJQUMxQixRQUFRLFNBQVMsQ0FBQyxNQUFNO01BQ3RCLEtBQUssQ0FBQztRQUNKLE9BQU8sRUFBRSxDQUFDO01BQ1osS0FBSyxDQUFDO1FBQ0osT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRTtlQUN0QixPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUM3RCxLQUFLLENBQUM7UUFDSixPQUFPLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRTtlQUMzQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2VBQ3ZFLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7ZUFDdkUsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUN4RDtRQUNFLE9BQU8sY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRTtlQUNoRSxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztlQUM1RixjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztlQUM1RixjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztlQUM1RixjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7ZUFDbEUsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2VBQ2xFLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztlQUNsRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN0QjtHQUNGLENBQUM7Q0FDSCxDQUFDOztBQ3JDRixJQUFJLGVBQWUsR0FBR1AsaUJBQXFDLENBQUM7QUFDNUQsSUFBSSxPQUFPLEdBQUdDLFNBQTZCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCNUMsU0FBYyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLFNBQVMsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO0VBQ3pGLE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7Q0FDN0QsQ0FBQyxDQUFDLENBQUM7O0FDOUJKLElBQUlNLFNBQU8sR0FBR04sU0FBNkIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCNUMsUUFBYyxJQUFJLFdBQVc7OztFQUczQixJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsRUFBRTtJQUN6QixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztHQUNoRSxDQUFDOztFQUVGLE9BQU9NLFNBQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTs7OztJQUl2QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztHQUM5RCxDQUFDLENBQUM7Q0FDSixFQUFFLENBQUMsQ0FBQzs7QUN0Q0wsSUFBSUgsU0FBTyxHQUFHSCxTQUE2QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0I1QyxZQUFjLEdBQUdHLFNBQU8sQ0FBQyxTQUFTSSxRQUFNLENBQUMsR0FBRyxFQUFFO0VBQzVDLE9BQU8sV0FBVztJQUNoQixPQUFPLEdBQUcsQ0FBQztHQUNaLENBQUM7Q0FDSCxDQUFDLENBQUM7O0FDMUJILElBQUlELFNBQU8sR0FBR0QsU0FBNkIsQ0FBQztBQUM1QyxJQUFJLE1BQU0sR0FBR04sUUFBbUIsQ0FBQztBQUNqQyxJQUFJUyxNQUFJLEdBQUdSLElBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QjdCLE9BQWMsR0FBR00sU0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0VBQ2hELE9BQU9FLE1BQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0NBQ2pDLENBQUMsQ0FBQzs7QUM3QkgsWUFBYyxHQUFHLFNBQVNDLFFBQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFOztFQUV0QyxRQUFRLENBQUM7SUFDUCxLQUFLLENBQUMsRUFBRSxPQUFPLFdBQVcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNoRSxLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbEUsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN0RSxLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMxRSxLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNsRixLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN0RixLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDMUYsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM5RixLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNsRyxLQUFLLEVBQUUsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdkcsU0FBUyxNQUFNLElBQUksS0FBSyxDQUFD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