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

const importState = newFieldsState => ({
  type: "importState",
  newFieldsState
});

const createField = fieldType => ({
  type: "createField",
  fieldType
});

const fieldCreated = createdFieldState => ({
  type: "fieldCreated",
  createdFieldState
});

/* eslint-env jasmine */

describe("Action", () => {
  describe("undo", () => {
    it("returns the correct action type", () => {
      const action = undo();
      expect(action.type).toEqual("undo");
    });
  });

  describe("importState", () => {
    const mockStateToImport = ["a", "b"];

    it("returns the correct action type", () => {
      const action = importState(mockStateToImport);
      expect(action.type).toEqual("importState");
    });

    it("Creates the correct variables", () => {
      const action = importState(mockStateToImport);
      expect(action.newFieldsState).toEqual(mockStateToImport);
    });
  });

  describe("createField", () => {
    const fieldType = "testField";

    it("returns the correct action type", () => {
      const action = createField(fieldType);
      expect(action.type).toEqual("createField");
    });

    it("Creates the correct variables", () => {
      const action = createField(fieldType);
      expect(action.fieldType).toEqual(fieldType);
    });
  });

  describe("fieldCreated", () => {
    const createdFieldState = {};

    it("returns the correct action type", () => {
      const action = fieldCreated(createdFieldState);
      expect(action.type).toEqual("fieldCreated");
    });

    it("Creates the correct variables", () => {
      const action = fieldCreated(createdFieldState);
      expect(action.createdFieldState).toEqual(createdFieldState);
    });
  });
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
// This middleware will just add the property "async dispatch"
// to actions with the "async" propperty set to true
const asyncDispatchMiddleware = store => next => action => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch = seamlessImmutable(action).merge({ asyncDispatch });

  next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
};

/* eslint-env jasmine */
const fakeAction = { type: "fake action" };

describe("The asyncDispatchMiddleware", () => {
  it("calls next with asyncDispatch property", done => {
    const next = returnedAction => {
      expect(returnedAction.asyncDispatch).not.toEqual(undefined);
      expect(typeof returnedAction.asyncDispatch).toEqual("function");
      done();
    };

    asyncDispatchMiddleware("fakeStore")(next)(fakeAction);
  });

  it("asyncDispatch triggers a store dispatch", done => {
    const fakeAsyncAction = { type: "fakeAsyncAction" };

    const fakeStore = {
      dispatch: action => {
        expect(action.type).toEqual(fakeAsyncAction.type);
        done();
      }
    };

    const next = returnedAction => returnedAction.asyncDispatch(fakeAsyncAction);

    asyncDispatchMiddleware(fakeStore)(next)(fakeAction);
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

/**
 * Private `concat` function to merge two array-like objects.
 *
 * @private
 * @param {Array|Arguments} [set1=[]] An array-like object.
 * @param {Array|Arguments} [set2=[]] An array-like object.
 * @return {Array} A new, merged array.
 * @example
 *
 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 */
var _concat$2 = function _concat$2(set1, set2) {
  set1 = set1 || [];
  set2 = set2 || [];
  var idx;
  var len1 = set1.length;
  var len2 = set2.length;
  var result = [];

  idx = 0;
  while (idx < len1) {
    result[result.length] = set1[idx];
    idx += 1;
  }
  idx = 0;
  while (idx < len2) {
    result[result.length] = set2[idx];
    idx += 1;
  }
  return result;
};

var _concat$1 = _concat$2;
var _curry2$4 = _curry2$1;


/**
 * Returns a new list with the given element at the front, followed by the
 * contents of the list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The item to add to the head of the output list.
 * @param {Array} list The array to add to the tail of the output list.
 * @return {Array} A new array.
 * @see R.append
 * @example
 *
 *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
 */
var prepend = _curry2$4(function prepend(el, list) {
  return _concat$1([el], list);
});

var _curry2$5 = _curry2$1;


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
var prop$1 = _curry2$5(function prop$1(p, obj) { return obj[p]; });

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

var _map$2 = function _map$2(fn, functor) {
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

var _curry2$8 = _curry2$1;
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

  return _curry2$8(function _xmap$1(f, xf) { return new XMap(f, xf); });
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
var _curry2$9 = _curry2$1;
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
var curryN$1 = _curry2$9(function curryN$1(length, fn) {
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

var _curry2$7 = _curry2$1;
var _dispatchable = _dispatchable$1;
var _map$1 = _map$2;
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
var map$1 = _curry2$7(_dispatchable('map', _xmap, function map$1(fn, functor) {
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
      return _map$1(fn, functor);
  }
}));

var _curry2$6 = _curry2$1;
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
var lens$1 = _curry2$6(function lens$1(getter, setter) {
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

/* eslint-disable new-cap */

const updateAt = curry$1((keyArray, newVal, obj) => {
  const deepNewVal = keyArray.reduceRight((result, key) => ({ [key]: result }), newVal);

  return seamlessImmutable(obj).merge(deepNewVal, { deep: true });
});

// State lenses
const StateLenses = {
  fieldTypes: lens$1(prop$1("fieldTypes"), updateAt(["fieldTypes"])),
  fieldsState: lens$1(prop$1("fieldsState"), updateAt(["fieldsState"])),
  fieldsStateHistory: lens$1(prop$1("fieldsStateHistory"), updateAt(["fieldsStateHistory"]))
};

// _ => String
const createId = _ => Date.now().toString();

// State -> [fieldsState] -> State
const pushHistoryState = curry$1((state, newHistoryState) => pipe(
// Add current state to history
over(StateLenses.fieldsStateHistory, prepend(state.fieldsState)),
// Make new State the current
set(StateLenses.fieldsState, newHistoryState))(state));

// State -> State
const hideConfigs = state => set(StateLenses.fieldsState, state.fieldsState.map(s => Object.assign({}, s, { configShowing: false })), state);

const lastHistoryState = state => state.fieldsStateHistory[0] || [];

const undo$1 = (state, _) => pipe(
// Make last history last state the current one
set(StateLenses.fieldsState, lastHistoryState(state)),
// Remove last history state from the history array
over(StateLenses.fieldsStateHistory, slice(1, Infinity)))(state);

var _identity$1 = function _identity$1(x) { return x; };

var _curry1$9 = _curry1$1;
var _identity = _identity$1;


/**
 * A function that does nothing but return the parameter supplied to it. Good
 * as a default or placeholder function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> a
 * @param {*} x The value to return.
 * @return {*} The input value, `x`.
 * @example
 *
 *      R.identity(1); //=> 1
 *
 *      var obj = {};
 *      R.identity(obj) === obj; //=> true
 */
var identity = _curry1$9(_identity);

var _curry2$10 = _curry2$1;


/**
 * Retrieve the value at a given path.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @sig [String] -> {k: v} -> v | Undefined
 * @param {Array} path The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path`.
 * @see R.prop
 * @example
 *
 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
 */
var path = _curry2$10(function path(paths, obj) {
  var val = obj;
  var idx = 0;
  while (idx < paths.length) {
    if (val == null) {
      return;
    }
    val = val[paths[idx]];
    idx += 1;
  }
  return val;
});

var _concat$4 = _concat$2;
var _curry2$12 = _curry2$1;
var _reduce$4 = _reduce$1;
var map$5 = map$1;


/**
 * ap applies a list of functions to a list of values.
 *
 * Dispatches to the `ap` method of the second argument, if present. Also
 * treats curried functions as applicatives.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig [a -> b] -> [a] -> [b]
 * @sig Apply f => f (a -> b) -> f a -> f b
 * @param {Array} fns An array of functions
 * @param {Array} vs An array of values
 * @return {Array} An array of results of applying each of `fns` to all of `vs` in turn.
 * @example
 *
 *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
 */
var ap$1 = _curry2$12(function ap$1(applicative, fn) {
  return (
    typeof applicative.ap === 'function' ?
      applicative.ap(fn) :
    typeof applicative === 'function' ?
      function(x) { return applicative(x)(fn(x)); } :
    // else
      _reduce$4(function(acc, f) { return _concat$4(acc, map$5(f, fn)); }, [], applicative)
  );
});

var _curry3$7 = _curry3$1;


/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * Similar to `reduce`, except moves through the input list from the right to
 * the left.
 *
 * The iterator function receives two values: *(acc, value)*
 *
 * Note: `R.reduceRight` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a,b -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.addIndex
 * @example
 *
 *      var pairs = [ ['a', 1], ['b', 2], ['c', 3] ];
 *      var flattenPairs = (acc, pair) => acc.concat(pair);
 *
 *      R.reduceRight(flattenPairs, [], pairs); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
 */
var reduceRight$1 = _curry3$7(function reduceRight$1(fn, acc, list) {
  var idx = list.length - 1;
  while (idx >= 0) {
    acc = fn(acc, list[idx]);
    idx -= 1;
  }
  return acc;
});

var _curry2$11 = _curry2$1;
var ap = ap$1;
var map$4 = map$1;
var prepend$1 = prepend;
var reduceRight = reduceRight$1;


/**
 * Transforms a [Traversable](https://github.com/fantasyland/fantasy-land#traversable)
 * of [Applicative](https://github.com/fantasyland/fantasy-land#applicative) into an
 * Applicative of Traversable.
 *
 * Dispatches to the `sequence` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
 * @param {Function} of
 * @param {*} traversable
 * @return {*}
 * @see R.traverse
 * @example
 *
 *      R.sequence(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])
 *      R.sequence(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
 *
 *      R.sequence(R.of, Just([1, 2, 3])); //=> [Just(1), Just(2), Just(3)]
 *      R.sequence(R.of, Nothing());       //=> [Nothing()]
 */
var sequence$1 = _curry2$11(function sequence$1(of, traversable) {
  return typeof traversable.sequence === 'function' ?
    traversable.sequence(of) :
    reduceRight(function(acc, x) { return ap(map$4(prepend$1, x), acc); },
                of([]),
                traversable);
});

var _curry3$6 = _curry3$1;
var map$3 = map$1;
var sequence = sequence$1;


/**
 * Maps an [Applicative](https://github.com/fantasyland/fantasy-land#applicative)-returning
 * function over a [Traversable](https://github.com/fantasyland/fantasy-land#traversable),
 * then uses [`sequence`](#sequence) to transform the resulting Traversable of Applicative
 * into an Applicative of Traversable.
 *
 * Dispatches to the `sequence` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
 * @param {Function} of
 * @param {Function} f
 * @param {*} traversable
 * @return {*}
 * @see R.sequence
 * @example
 *
 *      // Returns `Nothing` if the given divisor is `0`
 *      safeDiv = n => d => d === 0 ? Nothing() : Just(n / d)
 *
 *      R.traverse(Maybe.of, safeDiv(10), [2, 4, 5]); //=> Just([5, 2.5, 2])
 *      R.traverse(Maybe.of, safeDiv(10), [2, 0, 5]); //=> Nothing
 */
var traverse = _curry3$6(function traverse(of, f, traversable) {
  return sequence(of, map$3(f, traversable));
});

var _arrayFromIterator$1 = function _arrayFromIterator$1(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
};

var _functionName$1 = function _functionName$1(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
};

var _curry2$14 = _curry2$1;


/**
 * Returns true if its arguments are identical, false otherwise. Values are
 * identical if they reference the same memory. `NaN` is identical to `NaN`;
 * `0` and `-0` are not identical.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      var o = {};
 *      R.identical(o, o); //=> true
 *      R.identical(1, 1); //=> true
 *      R.identical(1, '1'); //=> false
 *      R.identical([], []); //=> false
 *      R.identical(0, -0); //=> false
 *      R.identical(NaN, NaN); //=> true
 */
var identical$1 = _curry2$14(function identical$1(a, b) {
  // SameValue algorithm
  if (a === b) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
});

var _curry1$10 = _curry1$1;


/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 */
var type$1 = _curry1$10(function type$1(val) {
  return val === null      ? 'Null'      :
         val === undefined ? 'Undefined' :
         Object.prototype.toString.call(val).slice(8, -1);
});

var _arrayFromIterator = _arrayFromIterator$1;
var _functionName = _functionName$1;
var _has$4 = _has$1;
var identical = identical$1;
var keys$3 = keys$1;
var type = type$1;


var _equals$1 = function _equals$1(a, b, stackA, stackB) {
  if (identical(a, b)) {
    return true;
  }

  if (type(a) !== type(b)) {
    return false;
  }

  if (a == null || b == null) {
    return false;
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) &&
           typeof b.equals === 'function' && b.equals(a);
  }

  switch (type(a)) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' &&
          _functionName(a.constructor) === 'Promise') {
        return a === b;
      }
      break;
    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && identical(a.valueOf(), b.valueOf()))) {
        return false;
      }
      break;
    case 'Date':
      if (!identical(a.valueOf(), b.valueOf())) {
        return false;
      }
      break;
    case 'Error':
      return a.name === b.name && a.message === b.message;
    case 'RegExp':
      if (!(a.source === b.source &&
            a.global === b.global &&
            a.ignoreCase === b.ignoreCase &&
            a.multiline === b.multiline &&
            a.sticky === b.sticky &&
            a.unicode === b.unicode)) {
        return false;
      }
      break;
    case 'Map':
    case 'Set':
      if (!_equals$1(_arrayFromIterator(a.entries()), _arrayFromIterator(b.entries()), stackA, stackB)) {
        return false;
      }
      break;
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
      break;
    case 'ArrayBuffer':
      break;
    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = keys$3(a);
  if (keysA.length !== keys$3(b).length) {
    return false;
  }

  var idx = stackA.length - 1;
  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }
    idx -= 1;
  }

  stackA.push(a);
  stackB.push(b);
  idx = keysA.length - 1;
  while (idx >= 0) {
    var key = keysA[idx];
    if (!(_has$4(key, b) && _equals$1(b[key], a[key], stackA, stackB))) {
      return false;
    }
    idx -= 1;
  }
  stackA.pop();
  stackB.pop();
  return true;
};

var _curry2$13 = _curry2$1;
var _equals = _equals$1;


/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      var a = {}; a.v = a;
 *      var b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */
var equals = _curry2$13(function equals(a, b) {
  return _equals(a, b, [], []);
});

// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * @module lib/either
 */
var either = Either$1;

// -- Aliases ----------------------------------------------------------
var clone         = Object.create;
var unimplemented = function(){ throw new Error('Not implemented.') };
var noop          = function(){ return this                         };


// -- Implementation ---------------------------------------------------

/**
 * The `Either(a, b)` structure represents the logical disjunction between `a`
 * and `b`. In other words, `Either` may contain either a value of type `a` or
 * a value of type `b`, at any given time. This particular implementation is
 * biased on the right value (`b`), thus projections will take the right value
 * over the left one.
 *
 * This class models two different cases: `Left a` and `Right b`, and can hold
 * one of the cases at any given time. The projections are, none the less,
 * biased for the `Right` case, thus a common use case for this structure is to
 * hold the results of computations that may fail, when you want to store
 * additional information on the failure (instead of throwing an exception).
 *
 * Furthermore, the values of `Either(a, b)` can be combined and manipulated by
 * using the expressive monadic operations. This allows safely sequencing
 * operations that may fail, and safely composing values that you don't know
 * whether they're present or not, failing early (returning a `Left a`) if any
 * of the operations fail.
 *
 * While this class can certainly model input validations, the [Validation][]
 * structure lends itself better to that use case, since it can naturally
 * aggregate failures — monads shortcut on the first failure.
 *
 * [Validation]: https://github.com/folktale/data.validation
 *
 *
 * @class
 * @summary
 * Either[α, β] <: Applicative[β]
 *               , Functor[β]
 *               , Chain[β]
 *               , Show
 *               , Eq
 */
function Either$1() { }

Left.prototype = clone(Either$1.prototype);
function Left(a) {
  this.value = a;
}

Right.prototype = clone(Either$1.prototype);
function Right(a) {
  this.value = a;
}

// -- Constructors -----------------------------------------------------

/**
 * Constructs a new `Either[α, β]` structure holding a `Left` value. This
 * usually represents a failure due to the right-bias of this structure.
 *
 * @summary a → Either[α, β]
 */
Either$1.Left = function(a) {
  return new Left(a)
};
Either$1.prototype.Left = Either$1.Left;

/**
 * Constructs a new `Either[α, β]` structure holding a `Right` value. This
 * usually represents a successful value due to the right bias of this
 * structure.
 *
 * @summary β → Either[α, β]
 */
Either$1.Right = function(a) {
  return new Right(a)
};
Either$1.prototype.Right = Either$1.Right;


// -- Conversions ------------------------------------------------------

/**
 * Constructs a new `Either[α, β]` structure from a nullable type.
 *
 * Takes the `Left` case if the value is `null` or `undefined`. Takes the
 * `Right` case otherwise.
 *
 * @summary α → Either[α, α]
 */
Either$1.fromNullable = function(a) {
  return a != null?       new Right(a)
  :      /* otherwise */  new Left(a)
};
Either$1.prototype.fromNullable = Either$1.fromNullable;

/**
 * Constructs a new `Either[α, β]` structure from a `Validation[α, β]` type.
 *
 * @summary Validation[α, β] → Either[α, β]
 */
Either$1.fromValidation = function(a) {
  return a.fold(Either$1.Left, Either$1.Right)
};

/**
 * Executes a synchronous computation that may throw and converts it to an
 * Either type.
 *
 * @summary (α₁, α₂, ..., αₙ -> β :: throws γ) -> (α₁, α₂, ..., αₙ -> Either[γ, β])
 */
Either$1.try = function(f) {
  return function() {
    try {
      return new Right(f.apply(null, arguments))
    } catch(e) {
      return new Left(e)
    }
  }
};


// -- Predicates -------------------------------------------------------

/**
 * True if the `Either[α, β]` contains a `Left` value.
 *
 * @summary Boolean
 */
Either$1.prototype.isLeft = false;
Left.prototype.isLeft   = true;

/**
 * True if the `Either[α, β]` contains a `Right` value.
 *
 * @summary Boolean
 */
Either$1.prototype.isRight = false;
Right.prototype.isRight  = true;


// -- Applicative ------------------------------------------------------

/**
 * Creates a new `Either[α, β]` instance holding the `Right` value `b`.
 *
 * `b` can be any value, including `null`, `undefined` or another
 * `Either[α, β]` structure.
 *
 * @summary β → Either[α, β]
 */
Either$1.of = function(a) {
  return new Right(a)
};
Either$1.prototype.of = Either$1.of;


/**
 * Applies the function inside the `Right` case of the `Either[α, β]` structure
 * to another applicative type.
 *
 * The `Either[α, β]` should contain a function value, otherwise a `TypeError`
 * is thrown.
 *
 * @method
 * @summary (@Either[α, β → γ], f:Applicative[_]) => f[β] → f[γ]
 */
Either$1.prototype.ap = unimplemented;

Left.prototype.ap = function(b) {
  return this
};

Right.prototype.ap = function(b) {
  return b.map(this.value)
};


// -- Functor ----------------------------------------------------------

/**
 * Transforms the `Right` value of the `Either[α, β]` structure using a regular
 * unary function.
 *
 * @method
 * @summary (@Either[α, β]) => (β → γ) → Either[α, γ]
 */
Either$1.prototype.map = unimplemented;
Left.prototype.map   = noop;

Right.prototype.map = function(f) {
  return this.of(f(this.value))
};


// -- Chain ------------------------------------------------------------

/**
 * Transforms the `Right` value of the `Either[α, β]` structure using an unary
 * function to monads.
 *
 * @method
 * @summary (@Either[α, β], m:Monad[_]) => (β → m[γ]) → m[γ]
 */
Either$1.prototype.chain = unimplemented;
Left.prototype.chain   = noop;

Right.prototype.chain = function(f) {
  return f(this.value)
};


// -- Show -------------------------------------------------------------

/**
 * Returns a textual representation of the `Either[α, β]` structure.
 *
 * @method
 * @summary (@Either[α, β]) => Void → String
 */
Either$1.prototype.toString = unimplemented;

Left.prototype.toString = function() {
  return 'Either.Left(' + this.value + ')'
};

Right.prototype.toString = function() {
  return 'Either.Right(' + this.value + ')'
};


// -- Eq ---------------------------------------------------------------

/**
 * Tests if an `Either[α, β]` structure is equal to another `Either[α, β]`
 * structure.
 *
 * @method
 * @summary (@Either[α, β]) => Either[α, β] → Boolean
 */
Either$1.prototype.isEqual = unimplemented;

Left.prototype.isEqual = function(a) {
  return a.isLeft && (a.value === this.value)
};

Right.prototype.isEqual = function(a) {
  return a.isRight && (a.value === this.value)
};


// -- Extracting and recovering ----------------------------------------

/**
 * Extracts the `Right` value out of the `Either[α, β]` structure, if it
 * exists. Otherwise throws a `TypeError`.
 *
 * @method
 * @summary (@Either[α, β]) => Void → β         :: partial, throws
 * @see {@link module:lib/either~Either#getOrElse} — A getter that can handle failures.
 * @see {@link module:lib/either~Either#merge} — The convergence of both values.
 * @throws {TypeError} if the structure has no `Right` value.
 */
Either$1.prototype.get = unimplemented;

Left.prototype.get = function() {
  throw new TypeError("Can't extract the value of a Left(a).")
};

Right.prototype.get = function() {
  return this.value
};


/**
 * Extracts the `Right` value out of the `Either[α, β]` structure. If the
 * structure doesn't have a `Right` value, returns the given default.
 *
 * @method
 * @summary (@Either[α, β]) => β → β
 */
Either$1.prototype.getOrElse = unimplemented;

Left.prototype.getOrElse = function(a) {
  return a
};

Right.prototype.getOrElse = function(_) {
  return this.value
};


/**
 * Transforms a `Left` value into a new `Either[α, β]` structure. Does nothing
 * if the structure contain a `Right` value.
 *
 * @method
 * @summary (@Either[α, β]) => (α → Either[γ, β]) → Either[γ, β]
 */
Either$1.prototype.orElse = unimplemented;
Right.prototype.orElse  = noop;

Left.prototype.orElse = function(f) {
  return f(this.value)
};


/**
 * Returns the value of whichever side of the disjunction that is present.
 *
 * @summary (@Either[α, α]) => Void → α
 */
Either$1.prototype.merge = function() {
  return this.value
};


// -- Folds and Extended Transformations -------------------------------

/**
 * Applies a function to each case in this data structure.
 *
 * @method
 * @summary (@Either[α, β]) => (α → γ), (β → γ) → γ
 */
Either$1.prototype.fold = unimplemented;

Left.prototype.fold = function(f, _) {
  return f(this.value)
};

Right.prototype.fold = function(_, g) {
  return g(this.value)
};

/**
 * Catamorphism.
 * 
 * @method
 * @summary (@Either[α, β]) => { Left: α → γ, Right: β → γ } → γ
 */
Either$1.prototype.cata = unimplemented;

Left.prototype.cata = function(pattern) {
  return pattern.Left(this.value)
};

Right.prototype.cata = function(pattern) {
  return pattern.Right(this.value)
};


/**
 * Swaps the disjunction values.
 *
 * @method
 * @summary (@Either[α, β]) => Void → Either[β, α]
 */
Either$1.prototype.swap = unimplemented;

Left.prototype.swap = function() {
  return this.Right(this.value)
};

Right.prototype.swap = function() {
  return this.Left(this.value)
};


/**
 * Maps both sides of the disjunction.
 *
 * @method
 * @summary (@Either[α, β]) => (α → γ), (β → δ) → Either[γ, δ]
 */
Either$1.prototype.bimap = unimplemented;

Left.prototype.bimap = function(f, _) {
  return this.Left(f(this.value))
};

Right.prototype.bimap = function(_, g) {
  return this.Right(g(this.value))
};


/**
 * Maps the left side of the disjunction.
 *
 * @method
 * @summary (@Either[α, β]) => (α → γ) → Either[γ, β]
 */
Either$1.prototype.leftMap = unimplemented;
Right.prototype.leftMap  = noop;

Left.prototype.leftMap = function(f) {
  return this.Left(f(this.value))
};

// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var index = either;

/*  weak */
/* eslint-disable new-cap */
// [a] => Either String [a]
const isArray = arr => Array.isArray(arr) ? index.Right(arr) : index.Left(`Invalid states sent with importState. Expected Array but received ${ typeof arr }`); // eslint-disable-line max-len

const fieldTypeIsValid = curry$1((validTypes, field) => validTypes.find(equals(field.type)) ? index.Right(field) : index.Left(`Invalid field type ${ field.type }`));

const validFieldTypes = curry$1((validTypes, fieldsState) => traverse(index.of, fieldTypeIsValid(validTypes), fieldsState));

// [a] -> [a] -> Either String [a]
const validateFieldsState = curry$1((fieldsState, state) => index.of(fieldsState).chain(isArray).chain(validFieldTypes(state.fieldTypes.map(path(["info", "type"])))));

// Add required properties that are not managed by the field
// component but by the FormBuilder component itself, so may
// not be there.
// [a] => [a]
const addRequiredProperties = fieldStates => fieldStates.map(s => Object.assign({
  configShowing: false,
  id: createId(),
  required: false
}, s));

// If there are any problems with the import, the same state
// will be returned
var importState$1 = ((state, { newFieldsState }) => validateFieldsState(newFieldsState, state).map(addRequiredProperties).map(pushHistoryState(state)).bimap(console.error, identity).getOrElse(state));

var _reduced$1 = function _reduced$1(x) {
  return x && x['@@transducer/reduced'] ? x :
    {
      '@@transducer/value': x,
      '@@transducer/reduced': true
    };
};

var _curry2$16 = _curry2$1;
var _reduced = _reduced$1;
var _xfBase$3 = _xfBase$1;


var _xfind$1 = (function() {
  function XFind(f, xf) {
    this.xf = xf;
    this.f = f;
    this.found = false;
  }
  XFind.prototype['@@transducer/init'] = _xfBase$3.init;
  XFind.prototype['@@transducer/result'] = function(result) {
    if (!this.found) {
      result = this.xf['@@transducer/step'](result, void 0);
    }
    return this.xf['@@transducer/result'](result);
  };
  XFind.prototype['@@transducer/step'] = function(result, input) {
    if (this.f(input)) {
      this.found = true;
      result = _reduced(this.xf['@@transducer/step'](result, input));
    }
    return result;
  };

  return _curry2$16(function _xfind$1(f, xf) { return new XFind(f, xf); });
}());

var _curry2$15 = _curry2$1;
var _dispatchable$3 = _dispatchable$1;
var _xfind = _xfind$1;


/**
 * Returns the first element of the list which matches the predicate, or
 * `undefined` if no element matches.
 *
 * Dispatches to the `find` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> a | undefined
 * @param {Function} fn The predicate function used to determine if the element is the
 *        desired one.
 * @param {Array} list The array to consider.
 * @return {Object} The element found, or `undefined`.
 * @see R.transduce
 * @example
 *
 *      var xs = [{a: 1}, {a: 2}, {a: 3}];
 *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
 *      R.find(R.propEq('a', 4))(xs); //=> undefined
 */
var find = _curry2$15(_dispatchable$3('find', _xfind, function find(fn, list) {
  var idx = 0;
  var len = list.length;
  while (idx < len) {
    if (fn(list[idx])) {
      return list[idx];
    }
    idx += 1;
  }
}));

/**
 * A helper for delaying the execution of a function.
 * @private
 * @summary (Any... -> Any) -> Void
 */
var delayed = typeof setImmediate !== 'undefined'?  setImmediate
            : typeof process !== 'undefined'?       process.nextTick
            : /* otherwise */                       setTimeout;

/**
 * @module lib/task
 */
var task = Task$1;

// -- Implementation ---------------------------------------------------

/**
 * The `Task[α, β]` structure represents values that depend on time. This
 * allows one to model time-based effects explicitly, such that one can have
 * full knowledge of when they're dealing with delayed computations, latency,
 * or anything that can not be computed immediately.
 *
 * A common use for this structure is to replace the usual Continuation-Passing
 * Style form of programming, in order to be able to compose and sequence
 * time-dependent effects using the generic and powerful monadic operations.
 *
 * @class
 * @summary
 * ((α → Void), (β → Void) → Void), (Void → Void) → Task[α, β]
 *
 * Task[α, β] <: Chain[β]
 *               , Monad[β]
 *               , Functor[β]
 *               , Applicative[β]
 *               , Semigroup[β]
 *               , Monoid[β]
 *               , Show
 */
function Task$1(computation, cleanup) {
  this.fork = computation;

  this.cleanup = cleanup || function() {};
}

/**
 * Constructs a new `Task[α, β]` containing the single value `β`.
 *
 * `β` can be any value, including `null`, `undefined`, or another
 * `Task[α, β]` structure.
 *
 * @summary β → Task[α, β]
 */
Task$1.prototype.of = function _of(b) {
  return new Task$1(function(_, resolve) {
    return resolve(b);
  });
};

Task$1.of = Task$1.prototype.of;

/**
 * Constructs a new `Task[α, β]` containing the single value `α`.
 *
 * `α` can be any value, including `null`, `undefined`, or another
 * `Task[α, β]` structure.
 *
 * @summary α → Task[α, β]
 */
Task$1.prototype.rejected = function _rejected(a) {
  return new Task$1(function(reject) {
    return reject(a);
  });
};

Task$1.rejected = Task$1.prototype.rejected;

// -- Functor ----------------------------------------------------------

/**
 * Transforms the successful value of the `Task[α, β]` using a regular unary
 * function.
 *
 * @summary @Task[α, β] => (β → γ) → Task[α, γ]
 */
Task$1.prototype.map = function _map(f) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return reject(a);
    }, function(b) {
      return resolve(f(b));
    });
  }, cleanup);
};

// -- Chain ------------------------------------------------------------

/**
 * Transforms the succesful value of the `Task[α, β]` using a function to a
 * monad.
 *
 * @summary @Task[α, β] => (β → Task[α, γ]) → Task[α, γ]
 */
Task$1.prototype.chain = function _chain(f) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return reject(a);
    }, function(b) {
      return f(b).fork(reject, resolve);
    });
  }, cleanup);
};

// -- Apply ------------------------------------------------------------

/**
 * Applys the successful value of the `Task[α, (β → γ)]` to the successful
 * value of the `Task[α, β]`
 *
 * @summary @Task[α, (β → γ)] => Task[α, β] → Task[α, γ]
 */

Task$1.prototype.ap = function _ap(that) {
  var forkThis = this.fork;
  var forkThat = that.fork;
  var cleanupThis = this.cleanup;
  var cleanupThat = that.cleanup;

  function cleanupBoth(state) {
    cleanupThis(state[0]);
    cleanupThat(state[1]);
  }

  return new Task$1(function(reject, resolve) {
    var func, funcLoaded = false;
    var val, valLoaded = false;
    var rejected = false;
    var allState;

    var thisState = forkThis(guardReject, guardResolve(function(x) {
      funcLoaded = true;
      func = x;
    }));

    var thatState = forkThat(guardReject, guardResolve(function(x) {
      valLoaded = true;
      val = x;
    }));

    function guardResolve(setter) {
      return function(x) {
        if (rejected) {
          return;
        }

        setter(x);
        if (funcLoaded && valLoaded) {
          delayed(function(){ cleanupBoth(allState); });
          return resolve(func(val));
        } else {
          return x;
        }
      }
    }

    function guardReject(x) {
      if (!rejected) {
        rejected = true;
        return reject(x);
      }
    }

    return allState = [thisState, thatState];
  }, cleanupBoth);
};

// -- Semigroup ------------------------------------------------------------

/**
 * Selects the earlier of the two tasks `Task[α, β]`
 *
 * @summary @Task[α, β] => Task[α, β] → Task[α, β]
 */

Task$1.prototype.concat = function _concat(that) {
  var forkThis = this.fork;
  var forkThat = that.fork;
  var cleanupThis = this.cleanup;
  var cleanupThat = that.cleanup;

  function cleanupBoth(state) {
    cleanupThis(state[0]);
    cleanupThat(state[1]);
  }

  return new Task$1(function(reject, resolve) {
    var done = false;
    var allState;
    var thisState = forkThis(guard(reject), guard(resolve));
    var thatState = forkThat(guard(reject), guard(resolve));

    return allState = [thisState, thatState];

    function guard(f) {
      return function(x) {
        if (!done) {
          done = true;
          delayed(function(){ cleanupBoth(allState); });
          return f(x);
        }
      };
    }
  }, cleanupBoth);

};

// -- Monoid ------------------------------------------------------------

/**
 * Returns a Task that will never resolve
 *
 * @summary Void → Task[α, _]
 */
Task$1.empty = function _empty() {
  return new Task$1(function() {});
};

Task$1.prototype.empty = Task$1.empty;

// -- Show -------------------------------------------------------------

/**
 * Returns a textual representation of the `Task[α, β]`
 *
 * @summary @Task[α, β] => Void → String
 */
Task$1.prototype.toString = function _toString() {
  return 'Task';
};

// -- Extracting and recovering ----------------------------------------

/**
 * Transforms a failure value into a new `Task[α, β]`. Does nothing if the
 * structure already contains a successful value.
 *
 * @summary @Task[α, β] => (α → Task[γ, β]) → Task[γ, β]
 */
Task$1.prototype.orElse = function _orElse(f) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return f(a).fork(reject, resolve);
    }, function(b) {
      return resolve(b);
    });
  }, cleanup);
};

// -- Folds and extended transformations -------------------------------

/**
 * Catamorphism. Takes two functions, applies the leftmost one to the failure
 * value, and the rightmost one to the successful value, depending on which one
 * is present.
 *
 * @summary @Task[α, β] => (α → γ), (β → γ) → Task[δ, γ]
 */
Task$1.prototype.fold = function _fold(f, g) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return resolve(f(a));
    }, function(b) {
      return resolve(g(b));
    });
  }, cleanup);
};

/**
 * Catamorphism.
 *
 * @summary @Task[α, β] => { Rejected: α → γ, Resolved: β → γ } → Task[δ, γ]
 */
Task$1.prototype.cata = function _cata(pattern) {
  return this.fold(pattern.Rejected, pattern.Resolved);
};

/**
 * Swaps the disjunction values.
 *
 * @summary @Task[α, β] => Void → Task[β, α]
 */
Task$1.prototype.swap = function _swap() {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return resolve(a);
    }, function(b) {
      return reject(b);
    });
  }, cleanup);
};

/**
 * Maps both sides of the disjunction.
 *
 * @summary @Task[α, β] => (α → γ), (β → δ) → Task[γ, δ]
 */
Task$1.prototype.bimap = function _bimap(f, g) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return reject(f(a));
    }, function(b) {
      return resolve(g(b));
    });
  }, cleanup);
};

/**
 * Maps the left side of the disjunction (failure).
 *
 * @summary @Task[α, β] => (α → γ) → Task[γ, β]
 */
Task$1.prototype.rejectedMap = function _rejectedMap(f) {
  var fork = this.fork;
  var cleanup = this.cleanup;

  return new Task$1(function(reject, resolve) {
    return fork(function(a) {
      return reject(f(a));
    }, function(b) {
      return resolve(b);
    });
  }, cleanup);
};

var index$1 = task;

// State -> String -> Either String Function
const typeConstructor = (state, fieldType) => {
  return index.of(state).map(prop$1("fieldTypes")).map(find(v => v.info.type === fieldType)).chain(index.fromNullable).bimap(_ => `Field "${ fieldType }" does not exist.`, identity);
};

// { initialState: Function } -> Task String Object
const createField$1 = constr => new index$1((reject, resolve) => {
  // Make sure the promise is only resolved once
  let called = false;
  const fieldState = constr.initialState();

  if (!(fieldState instanceof Promise)) {
    resolve(fieldState);
  } else {
    fieldState.then(v => {
      if (called) {
        return;
      }
      called = true;
      resolve(v);
    }).catch(v => {
      if (called) {
        throw v;
      }
      called = true;
      reject(v);
    });
  }
});

// Object -> Object
const insertRequiredProps = field => seamlessImmutable(field).merge({
  id: createId(),
  configShowing: true
}, {
  deep: true
});

const createFieldAsynchronously = (state, fieldType, asyncDispatch) => typeConstructor(state, fieldType).map(createField$1) // Either String (Task String Object)
.leftMap(index$1.rejected).merge() // Task String Object
.map(insertRequiredProps).fork( // execute task
err => console.error("Task rejected", err), pipe(fieldCreated, asyncDispatch));

// This is an async action. When it is finished it will trigger the
// field created action
var createField$2 = ((state, { fieldType, asyncDispatch }) => {
  createFieldAsynchronously(state, fieldType, asyncDispatch);
  return state;
});

var _concat$5 = _concat$2;
var _curry2$17 = _curry2$1;


/**
 * Returns a new list containing the contents of the given list, followed by
 * the given element.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The element to add to the end of the new list.
 * @param {Array} list The list whose contents will be added to the beginning of the output
 *        list.
 * @return {Array} A new list containing the contents of the old list followed by `el`.
 * @see R.prepend
 * @example
 *
 *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
 *      R.append('tests', []); //=> ['tests']
 *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
 */
var append = _curry2$17(function append(el, list) {
  return _concat$5(list, [el]);
});

// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * @module lib/maybe
 */
var maybe = Maybe$1;

// -- Aliases ----------------------------------------------------------
var clone$1         = Object.create;
var unimplemented$1 = function(){ throw new Error('Not implemented.') };
var noop$1          = function(){ return this                         };

// -- Implementation ---------------------------------------------------

/**
 * A structure for values that may not be present, or computations that may
 * fail. `Maybe(a)` explicitly models the effects that are implicit in
 * `Nullable` types, thus has none of the problems associated with
 * `null` or `undefined` — like `NullPointerExceptions`.
 *
 * The class models two different cases:
 *
 *  + `Just a` — represents a `Maybe(a)` that contains a value. `a` may
 *     be any value, including `null` or `undefined`.
 *
 *  + `Nothing` — represents a `Maybe(a)` that has no values. Or a
 *     failure that needs no additional information.
 *
 * Common uses of this structure includes modelling values that may or may
 * not be present in a collection, thus instead of needing a
 * `collection.has(a)`, the `collection.get(a)` operation gives you all
 * the information you need — `collection.get(a).is-nothing` being
 * equivalent to `collection.has(a)`; Similarly the same reasoning may
 * be applied to computations that may fail to provide a value, e.g.:
 * `collection.find(predicate)` can safely return a `Maybe(a)` instance,
 * even if the collection contains nullable values.
 *
 * Furthermore, the values of `Maybe(a)` can be combined and manipulated
 * by using the expressive monadic operations. This allows safely
 * sequencing operations that may fail, and safely composing values that
 * you don't know whether they're present or not, failing early
 * (returning a `Nothing`) if any of the operations fail.
 *
 * If one wants to store additional information about failures, the
 * [Either][] and [Validation][] structures provide such a capability, and
 * should be used instead of the `Maybe(a)` structure.
 *
 * [Either]: https://github.com/folktale/data.either
 * [Validation]: https://github.com/folktale/data.validation
 *
 *
 * @class
 */
function Maybe$1() {}

// The case for successful values
Just.prototype = clone$1(Maybe$1.prototype);
function Just(a){
  this.value = a;
}

// The case for failure values
Nothing.prototype = clone$1(Maybe$1.prototype);
function Nothing(){}


// -- Constructors -----------------------------------------------------

/**
 * Constructs a new `Maybe[α]` structure with an absent value. Commonly used
 * to represent a failure.
 *
 * @summary Void → Maybe[α]
 */
Maybe$1.Nothing = function() {
  return new Nothing
};
Maybe$1.prototype.Nothing = Maybe$1.Nothing;

/**
 * Constructs a new `Maybe[α]` structure that holds the single value
 * `α`. Commonly used to represent a success.
 *
 * `α` can be any value, including `null`, `undefined` or another
 * `Maybe[α]` structure.
 *
 * @summary α → Maybe[α]
 */
Maybe$1.Just = function(a) {
  return new Just(a)
};
Maybe$1.prototype.Just = Maybe$1.Just;


// -- Conversions ------------------------------------------------------

/**
 * Constructs a new `Maybe[α]` structure from a nullable type.
 *
 * If the value is either `null` or `undefined`, this function returns a
 * `Nothing`, otherwise the value is wrapped in a `Just(α)`.
 *
 * @summary α → Maybe[α]
 */
Maybe$1.fromNullable = function(a) {
  return a != null?       new Just(a)
  :      /* otherwise */  new Nothing
};
Maybe$1.prototype.fromNullable = Maybe$1.fromNullable;

/**
 * Constructs a new `Maybe[β]` structure from an `Either[α, β]` type.
 *
 * The left side of the `Either` becomes `Nothing`, and the right side
 * is wrapped in a `Just(β)`.
 *
 * @summary Either[α, β] → Maybe[β]
 */
Maybe$1.fromEither = function(a) {
  return a.fold(Maybe$1.Nothing, Maybe$1.Just)
};
Maybe$1.prototype.fromEither = Maybe$1.fromEither;

/**
 * Constructs a new `Maybe[β]` structure from a `Validation[α, β]` type.
 *
 * The failure side of the `Validation` becomes `Nothing`, and the right
 * side is wrapped in a `Just(β)`.
 *
 * @method
 * @summary Validation[α, β] → Maybe[β]
 */
Maybe$1.fromValidation           = Maybe$1.fromEither;
Maybe$1.prototype.fromValidation = Maybe$1.fromEither;


// -- Predicates -------------------------------------------------------

/**
 * True if the `Maybe[α]` structure contains a failure (i.e.: `Nothing`).
 *
 * @summary Boolean
 */
Maybe$1.prototype.isNothing   = false;
Nothing.prototype.isNothing = true;


/**
 * True if the `Maybe[α]` structure contains a single value (i.e.: `Just(α)`).
 *
 * @summary Boolean
 */
Maybe$1.prototype.isJust = false;
Just.prototype.isJust  = true;


// -- Applicative ------------------------------------------------------

/**
 * Creates a new `Maybe[α]` structure holding the single value `α`.
 *
 * `α` can be any value, including `null`, `undefined`, or another
 * `Maybe[α]` structure.
 *
 * @summary α → Maybe[α]
 */
Maybe$1.of = function(a) {
  return new Just(a)
};
Maybe$1.prototype.of = Maybe$1.of;


/**
 * Applies the function inside the `Maybe[α]` structure to another
 * applicative type.
 *
 * The `Maybe[α]` structure should contain a function value, otherwise a
 * `TypeError` is thrown.
 *
 * @method
 * @summary (@Maybe[α → β], f:Applicative[_]) => f[α] → f[β]
 */
Maybe$1.prototype.ap = unimplemented$1;

Nothing.prototype.ap = noop$1;

Just.prototype.ap = function(b) {
  return b.map(this.value)
};




// -- Functor ----------------------------------------------------------

/**
 * Transforms the value of the `Maybe[α]` structure using a regular unary
 * function.
 *
 * @method
 * @summary @Maybe[α] => (α → β) → Maybe[β]
 */
Maybe$1.prototype.map   = unimplemented$1;
Nothing.prototype.map = noop$1;

Just.prototype.map = function(f) {
  return this.of(f(this.value))
};


// -- Chain ------------------------------------------------------------

/**
 * Transforms the value of the `Maybe[α]` structure using an unary function
 * to monads.
 *
 * @method
 * @summary (@Maybe[α], m:Monad[_]) => (α → m[β]) → m[β]
 */
Maybe$1.prototype.chain   = unimplemented$1;
Nothing.prototype.chain = noop$1;

Just.prototype.chain = function(f) {
  return f(this.value)
};


// -- Show -------------------------------------------------------------

/**
 * Returns a textual representation of the `Maybe[α]` structure.
 *
 * @method
 * @summary @Maybe[α] => Void → String
 */
Maybe$1.prototype.toString = unimplemented$1;

Nothing.prototype.toString = function() {
  return 'Maybe.Nothing'
};

Just.prototype.toString = function() {
  return 'Maybe.Just(' + this.value + ')'
};


// -- Eq ---------------------------------------------------------------

/**
 * Tests if a `Maybe[α]` structure is equal to another `Maybe[α]` structure.
 *
 * @method
 * @summary @Maybe[α] => Maybe[α] → Boolean
 */
Maybe$1.prototype.isEqual = unimplemented$1;

Nothing.prototype.isEqual = function(b) {
  return b.isNothing
};

Just.prototype.isEqual = function(b) {
  return b.isJust
  &&     b.value === this.value
};


// -- Extracting and recovering ----------------------------------------

/**
 * Extracts the value out of the `Maybe[α]` structure, if it
 * exists. Otherwise throws a `TypeError`.
 *
 * @method
 * @summary @Maybe[α] => Void → a,      :: partial, throws
 * @see {@link module:lib/maybe~Maybe#getOrElse} — A getter that can handle failures
 * @throws {TypeError} if the structure has no value (`Nothing`).
 */
Maybe$1.prototype.get = unimplemented$1;

Nothing.prototype.get = function() {
  throw new TypeError("Can't extract the value of a Nothing.")
};

Just.prototype.get = function() {
  return this.value
};


/**
 * Extracts the value out of the `Maybe[α]` structure. If there is no value,
 * returns the given default.
 *
 * @method
 * @summary @Maybe[α] => α → α
 */
Maybe$1.prototype.getOrElse = unimplemented$1;

Nothing.prototype.getOrElse = function(a) {
  return a
};

Just.prototype.getOrElse = function(_) {
  return this.value
};


/**
 * Transforms a failure into a new `Maybe[α]` structure. Does nothing if the
 * structure already contains a value.
 *
 * @method
 * @summary @Maybe[α] => (Void → Maybe[α]) → Maybe[α]
 */
Maybe$1.prototype.orElse = unimplemented$1;

Nothing.prototype.orElse = function(f) {
  return f()
};

Just.prototype.orElse = function(_) {
  return this
};


/**
 * Catamorphism.
 * 
 * @method
 * @summary @Maybe[α] => { Nothing: Void → β, Just: α → β } → β
 */
Maybe$1.prototype.cata = unimplemented$1;

Nothing.prototype.cata = function(pattern) {
  return pattern.Nothing()
};

Just.prototype.cata = function(pattern) {
  return pattern.Just(this.value);
};


/**
 * JSON serialisation
 *
 * @method
 * @summary @Maybe[α] => Void → Object
 */
Maybe$1.prototype.toJSON = unimplemented$1;

Nothing.prototype.toJSON = function() {
  return { '#type': 'folktale:Maybe.Nothing' }
};

Just.prototype.toJSON = function() {
  return { '#type': 'folktale:Maybe.Just'
         , value: this.value }
};

// Copyright (c) 2013-2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var index$2 = maybe;

// State -> Object -> State
const historyStateWithNewField = curry$1((state, newField) => pipe(hideConfigs, over(StateLenses.fieldsState, append(newField)))(state));

var fieldCreated$1 = ((state, { createdFieldState }) => index$2.fromNullable(createdFieldState).map(historyStateWithNewField(state)).map(prop$1("fieldsState")).map(pushHistoryState(state)).getOrElse(state));

/* eslint-disable no-nested-ternary */
const actionHandlers = {
  undo: undo$1,
  importState: importState$1,
  createField: createField$2,
  fieldCreated: fieldCreated$1
};

const isExpectedAction = a => a && a.type && actionHandlers[a.type];
const isReduxAction = a => a && a.type && a.type.includes("@@redux");

const update = (state, action) => isExpectedAction(action) ? actionHandlers[action.type](state, action) : isReduxAction(action) ? state : assert(false, `Invalid action type: ${ action.type }`);

/* eslint-env jasmine */

const currentFieldsState = ["current"];
const oldFieldsState = ["old"];
const mockState = {
  fieldTypes: [],
  fieldsState: currentFieldsState,
  fieldsStateHistory: [oldFieldsState]
};

const emptyMockState = {
  fieldTypes: [],
  fieldsState: [],
  fieldsStateHistory: []
};

const emptyHistoryMockState = {
  fieldTypes: [],
  fieldsState: currentFieldsState,
  fieldsStateHistory: []
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

  it("doesn't modify the state if there aren't more history states to undo", () => {
    const modifiedState = update(emptyMockState, undo());
    expect(modifiedState).toEqual(emptyMockState);
  });

  it("set's the current state to empty if there are no more history states", () => {
    const modifiedState = update(emptyHistoryMockState, undo());
    expect(modifiedState.fieldsState.length).toEqual(0);
  });
});

/* eslint-env jasmine */
/* eslint-disable quote-props */

const typesArray = [{
  "info": {
    "type": "RadioButtons"
  }
}, {
  "info": {
    "type": "Checkboxes"
  }
}, {
  "info": {
    "type": "Dropdown"
  }
}, {
  "info": {
    "type": "TextBox"
  }
}, {
  "info": {
    "type": "EmailBox"
  }
}, {
  "info": {
    "type": "TelephoneBox"
  }
}, {
  "info": {
    "type": "NumberBox"
  }
}, {
  "info": {
    "type": "TextArea"
  }
}, {
  "info": {
    "type": "DateField"
  }
}];

const mockCurrentState = ["a", "b"];
const mockHistory = [];
const mockState$1 = {
  fieldTypes: typesArray,
  fieldsState: mockCurrentState,
  fieldsStateHistory: mockHistory
};

const newValidState = [{
  "type": "Checkboxes",
  "displayName": "Checkboxes",
  "group": "Options Components",
  "htmlInputType": "checkbox",
  "title": "Add a title",
  "options": [{
    "caption": "Insert an option"
  }],
  "newOptionCaption": ""
}];

const newInvalidState = [{
  "type": "Invalid type",
  "displayName": "Checkboxes",
  "group": "Options Components",
  "htmlInputType": "checkbox",
  "title": "Add a title",
  "options": [{
    "caption": "Insert an option"
  }],
  "newOptionCaption": ""
}];

describe("Update.importState", () => {
  it("Returns an unchanged array if the new state is invalid", () => {
    expect(update(mockState$1, importState({}))).toEqual(mockState$1);
    expect(update(mockState$1, importState(null))).toEqual(mockState$1);
  });

  it("Returns an unchanged array if the a field's type is not in fieldTypes", () => {
    expect(update(mockState$1, importState(newInvalidState))).toEqual(mockState$1);
  });

  it("Sends the last current state to the history", () => {
    const updated = update(mockState$1, importState(newValidState));
    expect(updated.fieldsStateHistory[0].toString()).toEqual(mockCurrentState.toString());
    expect(updated.fieldsStateHistory.length).toEqual(mockHistory.length + 1);
  });

  it("Sets the new state as current", () => {
    const updated = update(mockState$1, importState(newValidState));
    expect(updated.fieldsState[0].type).toEqual(newValidState[0].type);
    expect(updated.fieldsState[0].type).not.toEqual(undefined);
    expect(updated.fieldsState[0].displayName).toEqual(newValidState[0].displayName);
    expect(updated.fieldsState[0].displayName).not.toEqual(undefined);
    expect(updated.fieldsState[0].group).toEqual(newValidState[0].group);
    expect(updated.fieldsState[0].group).not.toEqual(undefined);
  });
});

/* eslint-env jasmine */
/* eslint-disable quote-props */

const promiseTypeInstance = { type: "promise-instance" };
const promiseType = {
  info: { type: "PromiseType" },
  initialState: () => Promise.resolve(promiseTypeInstance)
};

const syncTypeInstance = { type: "sync-instance" };
const syncType = {
  info: { type: "SyncType" },
  initialState: () => syncTypeInstance
};

const typesArray$1 = [promiseType, syncType];
const mockCurrentState$1 = ["a", "b"];
const mockHistory$1 = [];
const mockState$2 = {
  fieldTypes: typesArray$1,
  fieldsState: mockCurrentState$1,
  fieldsStateHistory: mockHistory$1
};

describe("Update.createField", () => {
  it("creates fields asynchronously", done => {
    const asyncDispatch = v => {
      expect(v).not.toEqual(undefined);
      done();
    };

    const asyncAcion = Object.assign({ asyncDispatch }, createField(syncType.info.type));

    update(mockState$2, asyncAcion);
  });

  it("returns a 'fieldCreated' action when field is created", done => {
    const asyncDispatch = action => {
      expect(action.type).toEqual("fieldCreated");
      done();
    };

    const asyncAcion = Object.assign({ asyncDispatch }, createField(syncType.info.type));

    update(mockState$2, asyncAcion);
  });

  it("creates types with constructors that return a plain object", done => {
    const asyncDispatch = action => {
      expect(action.createdFieldState).not.toEqual(undefined);
      expect(action.createdFieldState.type).toEqual(syncTypeInstance.type);
      done();
    };

    const asyncAcion = Object.assign({ asyncDispatch }, createField(syncType.info.type));

    update(mockState$2, asyncAcion);
  });

  it("creates types with constructors that return a promise", done => {
    const asyncDispatch = action => {
      expect(action.createdFieldState).not.toEqual(undefined);
      expect(action.createdFieldState.type).toEqual(promiseTypeInstance.type);
      done();
    };

    const asyncAcion = Object.assign({ asyncDispatch }, createField(promiseType.info.type));

    update(mockState$2, asyncAcion);
  });

  it("adds required fields to instance", done => {
    const asyncDispatch = action => {
      expect(action.createdFieldState.id).not.toEqual(undefined);
      expect(typeof action.createdFieldState.configShowing).toEqual("boolean");
      done();
    };

    const asyncAcion = Object.assign({ asyncDispatch }, createField(promiseType.info.type));

    update(mockState$2, asyncAcion);
  });

  it("does not create a field if type is not in model.fieldTypes", done => {
    const asyncDispatch = jasmine.createSpy("asyncDispatch");

    const asyncAcion = Object.assign({ asyncDispatch }, createField("non-existing-type"));

    update(mockState$2, asyncAcion);

    setTimeout(() => {
      expect(asyncDispatch).not.toHaveBeenCalled();done();
    }, 50);
  });
});

/* eslint-env jasmine */
/* eslint-disable quote-props */

const createdFieldState = { type: "fictitious-instance" };
const mockCurrentState$2 = ["a", "b"];
const mockHistory$2 = [];
const mockState$3 = {
  fieldTypes: [{ info: { type: "fictitious-instance" } }],
  fieldsState: mockCurrentState$2,
  fieldsStateHistory: mockHistory$2
};

const fieldCreatedAction = fieldCreated(createdFieldState);
const newState = update(mockState$3, fieldCreatedAction);

describe("Update.fieldCreated", () => {
  it("outputs a field with the new state included", () => {
    expect(newState.fieldsState.length).toEqual(mockState$3.fieldsState.length + 1);
    expect(newState.fieldsState.find(v => v.type === createdFieldState.type)).not.toEqual(undefined);
  });

  it("sends the current state to history", () => {
    expect(newState.fieldsStateHistory[0][0]).toEqual(mockCurrentState$2[0]);
    expect(newState.fieldsStateHistory[0][1]).toEqual(mockCurrentState$2[1]);
  });

  it("Returns the current state if no new field is given to it", () => {
    const sameState = update(mockState$3, fieldCreated(null));
    expect(sameState.fieldTypes.length).toEqual(mockState$3.fieldTypes.length);
    expect(sameState.fieldsState.length).toEqual(mockState$3.fieldsState.length);
    expect(sameState.fieldsStateHistory.length).toEqual(mockState$3.fieldsStateHistory.length);
  });

  it("does not break the state after creating one object", () => {
    const changed1 = update(mockState$3, fieldCreated(createdFieldState));
    const changed2 = update(changed1, fieldCreated(createdFieldState));
    const changed3 = update(changed2, fieldCreated(createdFieldState));
    expect(changed3.fieldTypes.length).toEqual(mockState$3.fieldTypes.length);
    expect(changed3.fieldsState.length).toEqual(mockCurrentState$2.length + 3);
    expect(changed3.fieldsStateHistory.length).toEqual(3);
  });
});

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL2pzL0FjdGlvbnMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy9hY3Rpb25zLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvc2VhbWxlc3MtaW1tdXRhYmxlL3NyYy9zZWFtbGVzcy1pbW11dGFibGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy91dGlscy9hc3luY0Rpc3BhdGNoTWlkZGxld2FyZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3V0aWxzLmFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZmwtYXNzZXJ0L2Rpc3QvYXNzZXJ0LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc0FycmF5LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19zbGljZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fY2hlY2tGb3JNZXRob2QuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lzUGxhY2Vob2xkZXIuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2N1cnJ5MS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fY3VycnkyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jdXJyeTMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2xpY2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvb3Zlci5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9hbHdheXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2V0LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19hcml0eS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fcGlwZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feHdyYXAuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvYmluZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9faXNTdHJpbmcuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaXNBcnJheUxpa2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3JlZHVjZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9yZWR1Y2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvdGFpbC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9waXBlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jb25jYXQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvcHJlcGVuZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9wcm9wLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc1RyYW5zZm9ybWVyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19kaXNwYXRjaGFibGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX21hcC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feGZCYXNlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL194bWFwLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jdXJyeU4uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvY3VycnlOLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19oYXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lzQXJndW1lbnRzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2tleXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvbWFwLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2xlbnMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvY3VycnkuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvdXRpbHMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvdW5kby5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9faWRlbnRpdHkuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaWRlbnRpdHkuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvcGF0aC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9hcC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9yZWR1Y2VSaWdodC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9zZXF1ZW5jZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy90cmF2ZXJzZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fYXJyYXlGcm9tSXRlcmF0b3IuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2Z1bmN0aW9uTmFtZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pZGVudGljYWwuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvdHlwZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fZXF1YWxzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2VxdWFscy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL2RhdGEuZWl0aGVyL2xpYi9laXRoZXIuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLmVpdGhlci9saWIvaW5kZXguanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvaW1wb3J0U3RhdGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3JlZHVjZWQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3hmaW5kLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ZpbmQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLnRhc2svbGliL3Rhc2suanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLnRhc2svbGliL2luZGV4LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL2NyZWF0ZUZpZWxkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2FwcGVuZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL2RhdGEubWF5YmUvbGliL21heWJlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZGF0YS5tYXliZS9saWIvaW5kZXguanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvZmllbGRDcmVhdGVkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL2luZGV4LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvdGVzdHMvdXBkYXRlL3VuZG8uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy91cGRhdGUvaW1wb3J0U3RhdGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy91cGRhdGUvY3JlYXRlRmllbGQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy91cGRhdGUvZmllbGRDcmVhdGVkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vXG4vLyAgICBBQ1RJT04gQ1JFQVRPUlNcbi8vXG5cbmV4cG9ydCBjb25zdCB1bmRvID0gXyA9PlxuKHtcbiAgdHlwZTogXCJ1bmRvXCIsXG59KTtcblxuZXhwb3J0IGNvbnN0IGltcG9ydFN0YXRlID0gbmV3RmllbGRzU3RhdGUgPT5cbih7XG4gIHR5cGU6IFwiaW1wb3J0U3RhdGVcIixcbiAgbmV3RmllbGRzU3RhdGUsXG59KTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUZpZWxkID0gZmllbGRUeXBlID0+XG4oe1xuICB0eXBlOiBcImNyZWF0ZUZpZWxkXCIsXG4gIGZpZWxkVHlwZSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZmllbGRDcmVhdGVkID0gY3JlYXRlZEZpZWxkU3RhdGUgPT5cbih7XG4gIHR5cGU6IFwiZmllbGRDcmVhdGVkXCIsXG4gIGNyZWF0ZWRGaWVsZFN0YXRlLFxufSk7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHtcbiAgdW5kbyxcbiAgaW1wb3J0U3RhdGUsXG4gIGNyZWF0ZUZpZWxkLFxuICBmaWVsZENyZWF0ZWQsXG59IGZyb20gXCIuLi9qcy9BY3Rpb25zXCI7XG5cbmRlc2NyaWJlKFwiQWN0aW9uXCIsICgpID0+IHtcbiAgZGVzY3JpYmUoXCJ1bmRvXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gdW5kbygpO1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwidW5kb1wiKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJpbXBvcnRTdGF0ZVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1N0YXRlVG9JbXBvcnQgPSBbXCJhXCIsIFwiYlwiXTtcblxuICAgIGl0KFwicmV0dXJucyB0aGUgY29ycmVjdCBhY3Rpb24gdHlwZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSBpbXBvcnRTdGF0ZShtb2NrU3RhdGVUb0ltcG9ydCk7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJpbXBvcnRTdGF0ZVwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiQ3JlYXRlcyB0aGUgY29ycmVjdCB2YXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gaW1wb3J0U3RhdGUobW9ja1N0YXRlVG9JbXBvcnQpO1xuICAgICAgZXhwZWN0KGFjdGlvbi5uZXdGaWVsZHNTdGF0ZSkudG9FcXVhbChtb2NrU3RhdGVUb0ltcG9ydCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiY3JlYXRlRmllbGRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGZpZWxkVHlwZSA9IFwidGVzdEZpZWxkXCI7XG5cbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gY3JlYXRlRmllbGQoZmllbGRUeXBlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChcImNyZWF0ZUZpZWxkXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJDcmVhdGVzIHRoZSBjb3JyZWN0IHZhcmlhYmxlc1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSBjcmVhdGVGaWVsZChmaWVsZFR5cGUpO1xuICAgICAgZXhwZWN0KGFjdGlvbi5maWVsZFR5cGUpLnRvRXF1YWwoZmllbGRUeXBlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJmaWVsZENyZWF0ZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGNyZWF0ZWRGaWVsZFN0YXRlID0ge307XG5cbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gZmllbGRDcmVhdGVkKGNyZWF0ZWRGaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChcImZpZWxkQ3JlYXRlZFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiQ3JlYXRlcyB0aGUgY29ycmVjdCB2YXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gZmllbGRDcmVhdGVkKGNyZWF0ZWRGaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUpLnRvRXF1YWwoY3JlYXRlZEZpZWxkU3RhdGUpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIiwiKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gaW1tdXRhYmxlSW5pdChjb25maWcpIHtcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi92MTUuMC4xL3NyYy9pc29tb3JwaGljL2NsYXNzaWMvZWxlbWVudC9SZWFjdEVsZW1lbnQuanMjTDIxXG4gIHZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3IgJiYgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpO1xuICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFX0ZBTExCQUNLID0gMHhlYWM3O1xuXG4gIHZhciBnbG9iYWxDb25maWcgPSB7XG4gICAgdXNlX3N0YXRpYzogZmFsc2VcbiAgfTtcbiAgaWYgKGlzT2JqZWN0KGNvbmZpZykpIHtcbiAgICAgIGlmIChjb25maWcudXNlX3N0YXRpYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZ2xvYmFsQ29uZmlnLnVzZV9zdGF0aWMgPSBCb29sZWFuKGNvbmZpZy51c2Vfc3RhdGljKTtcbiAgICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KGRhdGEpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmXG4gICAgICAhQXJyYXkuaXNBcnJheShkYXRhKSAmJlxuICAgICAgZGF0YSAhPT0gbnVsbFxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KG9iaikge1xuICAgICAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgICAgaWYgKCFwcm90b3R5cGUpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKHByb3RvdHlwZSk7XG4gICAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRQcm9wZXJ0eVRvKHRhcmdldCwgbWV0aG9kTmFtZSwgdmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBtZXRob2ROYW1lLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJhblByb3BlcnR5KHRhcmdldCwgbWV0aG9kTmFtZSkge1xuICAgIGFkZFByb3BlcnR5VG8odGFyZ2V0LCBtZXRob2ROYW1lLCBmdW5jdGlvbigpIHtcbiAgICAgIHRocm93IG5ldyBJbW11dGFibGVFcnJvcihcIlRoZSBcIiArIG1ldGhvZE5hbWUgK1xuICAgICAgICBcIiBtZXRob2QgY2Fubm90IGJlIGludm9rZWQgb24gYW4gSW1tdXRhYmxlIGRhdGEgc3RydWN0dXJlLlwiKTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBpbW11dGFiaWxpdHlUYWcgPSBcIl9faW1tdXRhYmxlX2ludmFyaWFudHNfaG9sZFwiO1xuXG4gIGZ1bmN0aW9uIGFkZEltbXV0YWJpbGl0eVRhZyh0YXJnZXQpIHtcbiAgICBhZGRQcm9wZXJ0eVRvKHRhcmdldCwgaW1tdXRhYmlsaXR5VGFnLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzSW1tdXRhYmxlKHRhcmdldCkge1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0ID09PSBudWxsIHx8IEJvb2xlYW4oXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBpbW11dGFiaWxpdHlUYWcpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJbiBKYXZhU2NyaXB0LCBvbmx5IG9iamVjdHMgYXJlIGV2ZW4gcG90ZW50aWFsbHkgbXV0YWJsZS5cbiAgICAgIC8vIHN0cmluZ3MsIG51bWJlcnMsIG51bGwsIGFuZCB1bmRlZmluZWQgYXJlIGFsbCBuYXR1cmFsbHkgaW1tdXRhYmxlLlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNFcXVhbChhLCBiKSB7XG4gICAgLy8gQXZvaWQgZmFsc2UgcG9zaXRpdmVzIGR1ZSB0byAoTmFOICE9PSBOYU4pIGV2YWx1YXRpbmcgdG8gdHJ1ZVxuICAgIHJldHVybiAoYSA9PT0gYiB8fCAoYSAhPT0gYSAmJiBiICE9PSBiKSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc01lcmdhYmxlT2JqZWN0KHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXQgIT09IG51bGwgJiYgdHlwZW9mIHRhcmdldCA9PT0gXCJvYmplY3RcIiAmJiAhKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkgJiYgISh0YXJnZXQgaW5zdGFuY2VvZiBEYXRlKTtcbiAgfVxuXG4gIHZhciBtdXRhdGluZ09iamVjdE1ldGhvZHMgPSBbXG4gICAgXCJzZXRQcm90b3R5cGVPZlwiXG4gIF07XG5cbiAgdmFyIG5vbk11dGF0aW5nT2JqZWN0TWV0aG9kcyA9IFtcbiAgICBcImtleXNcIlxuICBdO1xuXG4gIHZhciBtdXRhdGluZ0FycmF5TWV0aG9kcyA9IG11dGF0aW5nT2JqZWN0TWV0aG9kcy5jb25jYXQoW1xuICAgIFwicHVzaFwiLCBcInBvcFwiLCBcInNvcnRcIiwgXCJzcGxpY2VcIiwgXCJzaGlmdFwiLCBcInVuc2hpZnRcIiwgXCJyZXZlcnNlXCJcbiAgXSk7XG5cbiAgdmFyIG5vbk11dGF0aW5nQXJyYXlNZXRob2RzID0gbm9uTXV0YXRpbmdPYmplY3RNZXRob2RzLmNvbmNhdChbXG4gICAgXCJtYXBcIiwgXCJmaWx0ZXJcIiwgXCJzbGljZVwiLCBcImNvbmNhdFwiLCBcInJlZHVjZVwiLCBcInJlZHVjZVJpZ2h0XCJcbiAgXSk7XG5cbiAgdmFyIG11dGF0aW5nRGF0ZU1ldGhvZHMgPSBtdXRhdGluZ09iamVjdE1ldGhvZHMuY29uY2F0KFtcbiAgICBcInNldERhdGVcIiwgXCJzZXRGdWxsWWVhclwiLCBcInNldEhvdXJzXCIsIFwic2V0TWlsbGlzZWNvbmRzXCIsIFwic2V0TWludXRlc1wiLCBcInNldE1vbnRoXCIsIFwic2V0U2Vjb25kc1wiLFxuICAgIFwic2V0VGltZVwiLCBcInNldFVUQ0RhdGVcIiwgXCJzZXRVVENGdWxsWWVhclwiLCBcInNldFVUQ0hvdXJzXCIsIFwic2V0VVRDTWlsbGlzZWNvbmRzXCIsIFwic2V0VVRDTWludXRlc1wiLFxuICAgIFwic2V0VVRDTW9udGhcIiwgXCJzZXRVVENTZWNvbmRzXCIsIFwic2V0WWVhclwiXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIEltbXV0YWJsZUVycm9yKG1lc3NhZ2UpIHtcbiAgICB2YXIgZXJyICAgICAgID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIC8vIFRPRE86IENvbnNpZGVyIGBPYmplY3Quc2V0UHJvdG90eXBlT2YoZXJyLCBJbW11dGFibGVFcnJvcik7YFxuICAgIGVyci5fX3Byb3RvX18gPSBJbW11dGFibGVFcnJvcjtcblxuICAgIHJldHVybiBlcnI7XG4gIH1cbiAgSW1tdXRhYmxlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG4gIGZ1bmN0aW9uIG1ha2VJbW11dGFibGUob2JqLCBiYW5uZWRNZXRob2RzKSB7XG4gICAgLy8gVGFnIGl0IHNvIHdlIGNhbiBxdWlja2x5IHRlbGwgaXQncyBpbW11dGFibGUgbGF0ZXIuXG4gICAgYWRkSW1tdXRhYmlsaXR5VGFnKG9iaik7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAvLyBNYWtlIGFsbCBtdXRhdGluZyBtZXRob2RzIHRocm93IGV4Y2VwdGlvbnMuXG4gICAgICBmb3IgKHZhciBpbmRleCBpbiBiYW5uZWRNZXRob2RzKSB7XG4gICAgICAgIGlmIChiYW5uZWRNZXRob2RzLmhhc093blByb3BlcnR5KGluZGV4KSkge1xuICAgICAgICAgIGJhblByb3BlcnR5KG9iaiwgYmFubmVkTWV0aG9kc1tpbmRleF0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEZyZWV6ZSBpdCBhbmQgcmV0dXJuIGl0LlxuICAgICAgT2JqZWN0LmZyZWV6ZShvYmopO1xuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlTWV0aG9kUmV0dXJuSW1tdXRhYmxlKG9iaiwgbWV0aG9kTmFtZSkge1xuICAgIHZhciBjdXJyZW50TWV0aG9kID0gb2JqW21ldGhvZE5hbWVdO1xuXG4gICAgYWRkUHJvcGVydHlUbyhvYmosIG1ldGhvZE5hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIEltbXV0YWJsZShjdXJyZW50TWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBhcnJheVNldChpZHgsIHZhbHVlLCBjb25maWcpIHtcbiAgICB2YXIgZGVlcCAgICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcuZGVlcDtcblxuICAgIGlmIChpZHggaW4gdGhpcykge1xuICAgICAgaWYgKGRlZXAgJiYgdGhpc1tpZHhdICE9PSB2YWx1ZSAmJiBpc01lcmdhYmxlT2JqZWN0KHZhbHVlKSAmJiBpc01lcmdhYmxlT2JqZWN0KHRoaXNbaWR4XSkpIHtcbiAgICAgICAgdmFsdWUgPSBJbW11dGFibGUubWVyZ2UodGhpc1tpZHhdLCB2YWx1ZSwge2RlZXA6IHRydWUsIG1vZGU6ICdyZXBsYWNlJ30pO1xuICAgICAgfVxuICAgICAgaWYgKGlzRXF1YWwodGhpc1tpZHhdLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG11dGFibGUgPSBhc011dGFibGVBcnJheS5jYWxsKHRoaXMpO1xuICAgIG11dGFibGVbaWR4XSA9IEltbXV0YWJsZSh2YWx1ZSk7XG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGVBcnJheShtdXRhYmxlKTtcbiAgfVxuXG4gIHZhciBpbW11dGFibGVFbXB0eUFycmF5ID0gSW1tdXRhYmxlKFtdKTtcblxuICBmdW5jdGlvbiBhcnJheVNldEluKHB0aCwgdmFsdWUsIGNvbmZpZykge1xuICAgIHZhciBoZWFkID0gcHRoWzBdO1xuXG4gICAgaWYgKHB0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBhcnJheVNldC5jYWxsKHRoaXMsIGhlYWQsIHZhbHVlLCBjb25maWcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGFpbCA9IHB0aC5zbGljZSgxKTtcbiAgICAgIHZhciB0aGlzSGVhZCA9IHRoaXNbaGVhZF07XG4gICAgICB2YXIgbmV3VmFsdWU7XG5cbiAgICAgIGlmICh0eXBlb2YodGhpc0hlYWQpID09PSBcIm9iamVjdFwiICYmIHRoaXNIZWFkICE9PSBudWxsKSB7XG4gICAgICAgIC8vIE1pZ2h0ICh2YWxpZGx5KSBiZSBvYmplY3Qgb3IgYXJyYXlcbiAgICAgICAgbmV3VmFsdWUgPSBJbW11dGFibGUuc2V0SW4odGhpc0hlYWQsIHRhaWwsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXh0SGVhZCA9IHRhaWxbMF07XG4gICAgICAgIC8vIElmIHRoZSBuZXh0IHBhdGggcGFydCBpcyBhIG51bWJlciwgdGhlbiB3ZSBhcmUgc2V0dGluZyBpbnRvIGFuIGFycmF5LCBlbHNlIGFuIG9iamVjdC5cbiAgICAgICAgaWYgKG5leHRIZWFkICE9PSAnJyAmJiBpc0Zpbml0ZShuZXh0SGVhZCkpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGFycmF5U2V0SW4uY2FsbChpbW11dGFibGVFbXB0eUFycmF5LCB0YWlsLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBvYmplY3RTZXRJbi5jYWxsKGltbXV0YWJsZUVtcHR5T2JqZWN0LCB0YWlsLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGhlYWQgaW4gdGhpcyAmJiB0aGlzSGVhZCA9PT0gbmV3VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHZhciBtdXRhYmxlID0gYXNNdXRhYmxlQXJyYXkuY2FsbCh0aGlzKTtcbiAgICAgIG11dGFibGVbaGVhZF0gPSBuZXdWYWx1ZTtcbiAgICAgIHJldHVybiBtYWtlSW1tdXRhYmxlQXJyYXkobXV0YWJsZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWFrZUltbXV0YWJsZUFycmF5KGFycmF5KSB7XG4gICAgLy8gRG9uJ3QgY2hhbmdlIHRoZWlyIGltcGxlbWVudGF0aW9ucywgYnV0IHdyYXAgdGhlc2UgZnVuY3Rpb25zIHRvIG1ha2Ugc3VyZVxuICAgIC8vIHRoZXkgYWx3YXlzIHJldHVybiBhbiBpbW11dGFibGUgdmFsdWUuXG4gICAgZm9yICh2YXIgaW5kZXggaW4gbm9uTXV0YXRpbmdBcnJheU1ldGhvZHMpIHtcbiAgICAgIGlmIChub25NdXRhdGluZ0FycmF5TWV0aG9kcy5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcbiAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBub25NdXRhdGluZ0FycmF5TWV0aG9kc1tpbmRleF07XG4gICAgICAgIG1ha2VNZXRob2RSZXR1cm5JbW11dGFibGUoYXJyYXksIG1ldGhvZE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZ2xvYmFsQ29uZmlnLnVzZV9zdGF0aWMpIHtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwiZmxhdE1hcFwiLCAgZmxhdE1hcCk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGFycmF5LCBcImFzT2JqZWN0XCIsIGFzT2JqZWN0KTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwiYXNNdXRhYmxlXCIsIGFzTXV0YWJsZUFycmF5KTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwic2V0XCIsIGFycmF5U2V0KTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwic2V0SW5cIiwgYXJyYXlTZXRJbik7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGFycmF5LCBcInVwZGF0ZVwiLCB1cGRhdGUpO1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJ1cGRhdGVJblwiLCB1cGRhdGVJbik7XG4gICAgfVxuXG4gICAgZm9yKHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycmF5W2ldID0gSW1tdXRhYmxlKGFycmF5W2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZShhcnJheSwgbXV0YXRpbmdBcnJheU1ldGhvZHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZUltbXV0YWJsZURhdGUoZGF0ZSkge1xuICAgIGlmICghZ2xvYmFsQ29uZmlnLnVzZV9zdGF0aWMpIHtcbiAgICAgIGFkZFByb3BlcnR5VG8oZGF0ZSwgXCJhc011dGFibGVcIiwgYXNNdXRhYmxlRGF0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGUoZGF0ZSwgbXV0YXRpbmdEYXRlTWV0aG9kcyk7XG4gIH1cblxuICBmdW5jdGlvbiBhc011dGFibGVEYXRlKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLmdldFRpbWUoKSk7XG4gIH1cblxuICAvKipcbiAgICogRWZmZWN0aXZlbHkgcGVyZm9ybXMgYSBtYXAoKSBvdmVyIHRoZSBlbGVtZW50cyBpbiB0aGUgYXJyYXksIHVzaW5nIHRoZVxuICAgKiBwcm92aWRlZCBpdGVyYXRvciwgZXhjZXB0IHRoYXQgd2hlbmV2ZXIgdGhlIGl0ZXJhdG9yIHJldHVybnMgYW4gYXJyYXksIHRoYXRcbiAgICogYXJyYXkncyBlbGVtZW50cyBhcmUgYWRkZWQgdG8gdGhlIGZpbmFsIHJlc3VsdCBpbnN0ZWFkIG9mIHRoZSBhcnJheSBpdHNlbGYuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdG9yIC0gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBpbnZva2VkIG9uIGVhY2ggZWxlbWVudCBpbiB0aGUgYXJyYXkuIEl0IHdpbGwgcmVjZWl2ZSB0aHJlZSBhcmd1bWVudHM6IHRoZSBjdXJyZW50IHZhbHVlLCB0aGUgY3VycmVudCBpbmRleCwgYW5kIHRoZSBjdXJyZW50IG9iamVjdC5cbiAgICovXG4gIGZ1bmN0aW9uIGZsYXRNYXAoaXRlcmF0b3IpIHtcbiAgICAvLyBDYWxsaW5nIC5mbGF0TWFwKCkgd2l0aCBubyBhcmd1bWVudHMgaXMgYSBuby1vcC4gRG9uJ3QgYm90aGVyIGNsb25pbmcuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBbXSxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIGluZGV4O1xuXG4gICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgaXRlcmF0b3JSZXN1bHQgPSBpdGVyYXRvcih0aGlzW2luZGV4XSwgaW5kZXgsIHRoaXMpO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVyYXRvclJlc3VsdCkpIHtcbiAgICAgICAgLy8gQ29uY2F0ZW5hdGUgQXJyYXkgcmVzdWx0cyBpbnRvIHRoZSByZXR1cm4gdmFsdWUgd2UncmUgYnVpbGRpbmcgdXAuXG4gICAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgaXRlcmF0b3JSZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSGFuZGxlIG5vbi1BcnJheSByZXN1bHRzIHRoZSBzYW1lIHdheSBtYXAoKSBkb2VzLlxuICAgICAgICByZXN1bHQucHVzaChpdGVyYXRvclJlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGVBcnJheShyZXN1bHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gSW1tdXRhYmxlIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBnaXZlbiBrZXlzIGluY2x1ZGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5fSBrZXlzVG9SZW1vdmUgLSBBIGxpc3Qgb2Ygc3RyaW5ncyByZXByZXNlbnRpbmcgdGhlIGtleXMgdG8gZXhjbHVkZSBpbiB0aGUgcmV0dXJuIHZhbHVlLiBJbnN0ZWFkIG9mIHByb3ZpZGluZyBhIHNpbmdsZSBhcnJheSwgdGhpcyBtZXRob2QgY2FuIGFsc28gYmUgY2FsbGVkIGJ5IHBhc3NpbmcgbXVsdGlwbGUgc3RyaW5ncyBhcyBzZXBhcmF0ZSBhcmd1bWVudHMuXG4gICAqL1xuICBmdW5jdGlvbiB3aXRob3V0KHJlbW92ZSkge1xuICAgIC8vIENhbGxpbmcgLndpdGhvdXQoKSB3aXRoIG5vIGFyZ3VtZW50cyBpcyBhIG5vLW9wLiBEb24ndCBib3RoZXIgY2xvbmluZy5cbiAgICBpZiAodHlwZW9mIHJlbW92ZSA9PT0gXCJ1bmRlZmluZWRcIiAmJiBhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHJlbW92ZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAvLyBJZiB3ZSB3ZXJlbid0IGdpdmVuIGFuIGFycmF5LCB1c2UgdGhlIGFyZ3VtZW50cyBsaXN0LlxuICAgICAgdmFyIGtleXNUb1JlbW92ZUFycmF5ID0gKEFycmF5LmlzQXJyYXkocmVtb3ZlKSkgP1xuICAgICAgICAgcmVtb3ZlLnNsaWNlKCkgOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAvLyBDb252ZXJ0IG51bWVyaWMga2V5cyB0byBzdHJpbmdzIHNpbmNlIHRoYXQncyBob3cgdGhleSdsbFxuICAgICAgLy8gY29tZSBmcm9tIHRoZSBlbnVtZXJhdGlvbiBvZiB0aGUgb2JqZWN0LlxuICAgICAga2V5c1RvUmVtb3ZlQXJyYXkuZm9yRWFjaChmdW5jdGlvbihlbCwgaWR4LCBhcnIpIHtcbiAgICAgICAgaWYodHlwZW9mKGVsKSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIGFycltpZHhdID0gZWwudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJlbW92ZSA9IGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgIHJldHVybiBrZXlzVG9SZW1vdmVBcnJheS5pbmRleE9mKGtleSkgIT09IC0xO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gaW5zdGFudGlhdGVFbXB0eU9iamVjdCh0aGlzKTtcblxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzKSB7XG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHJlbW92ZSh0aGlzW2tleV0sIGtleSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdGhpc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KHJlc3VsdCk7XG4gIH1cblxuICBmdW5jdGlvbiBhc011dGFibGVBcnJheShvcHRzKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdLCBpLCBsZW5ndGg7XG5cbiAgICBpZihvcHRzICYmIG9wdHMuZGVlcCkge1xuICAgICAgZm9yKGkgPSAwLCBsZW5ndGggPSB0aGlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGFzRGVlcE11dGFibGUodGhpc1tpXSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IoaSA9IDAsIGxlbmd0aCA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0LnB1c2godGhpc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFZmZlY3RpdmVseSBwZXJmb3JtcyBhIFttYXBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L21hcCkgb3ZlciB0aGUgZWxlbWVudHMgaW4gdGhlIGFycmF5LCBleHBlY3RpbmcgdGhhdCB0aGUgaXRlcmF0b3IgZnVuY3Rpb25cbiAgICogd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgdHdvIGVsZW1lbnRzIC0gdGhlIGZpcnN0IHJlcHJlc2VudGluZyBhIGtleSwgdGhlIG90aGVyXG4gICAqIGEgdmFsdWUuIFRoZW4gcmV0dXJucyBhbiBJbW11dGFibGUgT2JqZWN0IGNvbnN0cnVjdGVkIG9mIHRob3NlIGtleXMgYW5kIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gaXRlcmF0b3IgLSBBIGZ1bmN0aW9uIHdoaWNoIHNob3VsZCByZXR1cm4gYW4gYXJyYXkgb2YgdHdvIGVsZW1lbnRzIC0gdGhlIGZpcnN0IHJlcHJlc2VudGluZyB0aGUgZGVzaXJlZCBrZXksIHRoZSBvdGhlciB0aGUgZGVzaXJlZCB2YWx1ZS5cbiAgICovXG4gIGZ1bmN0aW9uIGFzT2JqZWN0KGl0ZXJhdG9yKSB7XG4gICAgLy8gSWYgbm8gaXRlcmF0b3Igd2FzIHByb3ZpZGVkLCBhc3N1bWUgdGhlIGlkZW50aXR5IGZ1bmN0aW9uXG4gICAgLy8gKHN1Z2dlc3RpbmcgdGhpcyBhcnJheSBpcyBhbHJlYWR5IGEgbGlzdCBvZiBrZXkvdmFsdWUgcGFpcnMuKVxuICAgIGlmICh0eXBlb2YgaXRlcmF0b3IgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgaXRlcmF0b3IgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgaW5kZXg7XG5cbiAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBwYWlyICA9IGl0ZXJhdG9yKHRoaXNbaW5kZXhdLCBpbmRleCwgdGhpcyksXG4gICAgICAgICAga2V5ICAgPSBwYWlyWzBdLFxuICAgICAgICAgIHZhbHVlID0gcGFpclsxXTtcblxuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZU9iamVjdChyZXN1bHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNEZWVwTXV0YWJsZShvYmopIHtcbiAgICBpZiAoXG4gICAgICAoIW9iaikgfHxcbiAgICAgICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgfHxcbiAgICAgICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGltbXV0YWJpbGl0eVRhZykpIHx8XG4gICAgICAob2JqIGluc3RhbmNlb2YgRGF0ZSlcbiAgICApIHsgcmV0dXJuIG9iajsgfVxuICAgIHJldHVybiBJbW11dGFibGUuYXNNdXRhYmxlKG9iaiwge2RlZXA6IHRydWV9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHF1aWNrQ29weShzcmMsIGRlc3QpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzcmMsIGtleSkpIHtcbiAgICAgICAgZGVzdFtrZXldID0gc3JjW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlc3Q7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBJbW11dGFibGUgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHByb3BlcnRpZXMgYW5kIHZhbHVlcyBvZiBib3RoXG4gICAqIHRoaXMgb2JqZWN0IGFuZCB0aGUgcHJvdmlkZWQgb2JqZWN0LCBwcmlvcml0aXppbmcgdGhlIHByb3ZpZGVkIG9iamVjdCdzXG4gICAqIHZhbHVlcyB3aGVuZXZlciB0aGUgc2FtZSBrZXkgaXMgcHJlc2VudCBpbiBib3RoIG9iamVjdHMuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvdGhlciAtIFRoZSBvdGhlciBvYmplY3QgdG8gbWVyZ2UuIE11bHRpcGxlIG9iamVjdHMgY2FuIGJlIHBhc3NlZCBhcyBhbiBhcnJheS4gSW4gc3VjaCBhIGNhc2UsIHRoZSBsYXRlciBhbiBvYmplY3QgYXBwZWFycyBpbiB0aGF0IGxpc3QsIHRoZSBoaWdoZXIgaXRzIHByaW9yaXR5LlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIC0gT3B0aW9uYWwgY29uZmlnIG9iamVjdCB0aGF0IGNvbnRhaW5zIHNldHRpbmdzLiBTdXBwb3J0ZWQgc2V0dGluZ3MgYXJlOiB7ZGVlcDogdHJ1ZX0gZm9yIGRlZXAgbWVyZ2UgYW5kIHttZXJnZXI6IG1lcmdlckZ1bmN9IHdoZXJlIG1lcmdlckZ1bmMgaXMgYSBmdW5jdGlvblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCB0YWtlcyBhIHByb3BlcnR5IGZyb20gYm90aCBvYmplY3RzLiBJZiBhbnl0aGluZyBpcyByZXR1cm5lZCBpdCBvdmVycmlkZXMgdGhlIG5vcm1hbCBtZXJnZSBiZWhhdmlvdXIuXG4gICAqL1xuICBmdW5jdGlvbiBtZXJnZShvdGhlciwgY29uZmlnKSB7XG4gICAgLy8gQ2FsbGluZyAubWVyZ2UoKSB3aXRoIG5vIGFyZ3VtZW50cyBpcyBhIG5vLW9wLiBEb24ndCBib3RoZXIgY2xvbmluZy5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKG90aGVyID09PSBudWxsIHx8ICh0eXBlb2Ygb3RoZXIgIT09IFwib2JqZWN0XCIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW1tdXRhYmxlI21lcmdlIGNhbiBvbmx5IGJlIGludm9rZWQgd2l0aCBvYmplY3RzIG9yIGFycmF5cywgbm90IFwiICsgSlNPTi5zdHJpbmdpZnkob3RoZXIpKTtcbiAgICB9XG5cbiAgICB2YXIgcmVjZWl2ZWRBcnJheSA9IChBcnJheS5pc0FycmF5KG90aGVyKSksXG4gICAgICAgIGRlZXAgICAgICAgICAgPSBjb25maWcgJiYgY29uZmlnLmRlZXAsXG4gICAgICAgIG1vZGUgICAgICAgICAgPSBjb25maWcgJiYgY29uZmlnLm1vZGUgfHwgJ21lcmdlJyxcbiAgICAgICAgbWVyZ2VyICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcubWVyZ2VyLFxuICAgICAgICByZXN1bHQ7XG5cbiAgICAvLyBVc2UgdGhlIGdpdmVuIGtleSB0byBleHRyYWN0IGEgdmFsdWUgZnJvbSB0aGUgZ2l2ZW4gb2JqZWN0LCB0aGVuIHBsYWNlXG4gICAgLy8gdGhhdCB2YWx1ZSBpbiB0aGUgcmVzdWx0IG9iamVjdCB1bmRlciB0aGUgc2FtZSBrZXkuIElmIHRoYXQgcmVzdWx0ZWRcbiAgICAvLyBpbiBhIGNoYW5nZSBmcm9tIHRoaXMgb2JqZWN0J3MgdmFsdWUgYXQgdGhhdCBrZXksIHNldCBhbnlDaGFuZ2VzID0gdHJ1ZS5cbiAgICBmdW5jdGlvbiBhZGRUb1Jlc3VsdChjdXJyZW50T2JqLCBvdGhlck9iaiwga2V5KSB7XG4gICAgICB2YXIgaW1tdXRhYmxlVmFsdWUgPSBJbW11dGFibGUob3RoZXJPYmpba2V5XSk7XG4gICAgICB2YXIgbWVyZ2VyUmVzdWx0ID0gbWVyZ2VyICYmIG1lcmdlcihjdXJyZW50T2JqW2tleV0sIGltbXV0YWJsZVZhbHVlLCBjb25maWcpO1xuICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRPYmpba2V5XTtcblxuICAgICAgaWYgKChyZXN1bHQgIT09IHVuZGVmaW5lZCkgfHxcbiAgICAgICAgKG1lcmdlclJlc3VsdCAhPT0gdW5kZWZpbmVkKSB8fFxuICAgICAgICAoIWN1cnJlbnRPYmouaGFzT3duUHJvcGVydHkoa2V5KSkgfHxcbiAgICAgICAgIWlzRXF1YWwoaW1tdXRhYmxlVmFsdWUsIGN1cnJlbnRWYWx1ZSkpIHtcblxuICAgICAgICB2YXIgbmV3VmFsdWU7XG5cbiAgICAgICAgaWYgKG1lcmdlclJlc3VsdCkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gbWVyZ2VyUmVzdWx0O1xuICAgICAgICB9IGVsc2UgaWYgKGRlZXAgJiYgaXNNZXJnYWJsZU9iamVjdChjdXJyZW50VmFsdWUpICYmIGlzTWVyZ2FibGVPYmplY3QoaW1tdXRhYmxlVmFsdWUpKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBJbW11dGFibGUubWVyZ2UoY3VycmVudFZhbHVlLCBpbW11dGFibGVWYWx1ZSwgY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGltbXV0YWJsZVZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0VxdWFsKGN1cnJlbnRWYWx1ZSwgbmV3VmFsdWUpIHx8ICFjdXJyZW50T2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIE1ha2UgYSBzaGFsbG93IGNsb25lIG9mIHRoZSBjdXJyZW50IG9iamVjdC5cbiAgICAgICAgICAgIHJlc3VsdCA9IHF1aWNrQ29weShjdXJyZW50T2JqLCBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KGN1cnJlbnRPYmopKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXN1bHRba2V5XSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJEcm9wcGVkS2V5cyhjdXJyZW50T2JqLCBvdGhlck9iaikge1xuICAgICAgZm9yICh2YXIga2V5IGluIGN1cnJlbnRPYmopIHtcbiAgICAgICAgaWYgKCFvdGhlck9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBNYWtlIGEgc2hhbGxvdyBjbG9uZSBvZiB0aGUgY3VycmVudCBvYmplY3QuXG4gICAgICAgICAgICByZXN1bHQgPSBxdWlja0NvcHkoY3VycmVudE9iaiwgaW5zdGFudGlhdGVFbXB0eU9iamVjdChjdXJyZW50T2JqKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGV0ZSByZXN1bHRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBrZXk7XG5cbiAgICAvLyBBY2hpZXZlIHByaW9yaXRpemF0aW9uIGJ5IG92ZXJyaWRpbmcgcHJldmlvdXMgdmFsdWVzIHRoYXQgZ2V0IGluIHRoZSB3YXkuXG4gICAgaWYgKCFyZWNlaXZlZEFycmF5KSB7XG4gICAgICAvLyBUaGUgbW9zdCBjb21tb24gdXNlIGNhc2U6IGp1c3QgbWVyZ2Ugb25lIG9iamVjdCBpbnRvIHRoZSBleGlzdGluZyBvbmUuXG4gICAgICBmb3IgKGtleSBpbiBvdGhlcikge1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvdGhlciwga2V5KSkge1xuICAgICAgICAgIGFkZFRvUmVzdWx0KHRoaXMsIG90aGVyLCBrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobW9kZSA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgIGNsZWFyRHJvcHBlZEtleXModGhpcywgb3RoZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBhbHNvIGFjY2VwdCBhbiBBcnJheVxuICAgICAgZm9yICh2YXIgaW5kZXggPSAwLCBsZW5ndGggPSBvdGhlci5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBvdGhlckZyb21BcnJheSA9IG90aGVyW2luZGV4XTtcblxuICAgICAgICBmb3IgKGtleSBpbiBvdGhlckZyb21BcnJheSkge1xuICAgICAgICAgIGlmIChvdGhlckZyb21BcnJheS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBhZGRUb1Jlc3VsdChyZXN1bHQgIT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRoaXMsIG90aGVyRnJvbUFycmF5LCBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb2JqZWN0UmVwbGFjZSh2YWx1ZSwgY29uZmlnKSB7XG4gICAgdmFyIGRlZXAgICAgICAgICAgPSBjb25maWcgJiYgY29uZmlnLmRlZXA7XG5cbiAgICAvLyBDYWxsaW5nIC5yZXBsYWNlKCkgd2l0aCBubyBhcmd1bWVudHMgaXMgYSBuby1vcC4gRG9uJ3QgYm90aGVyIGNsb25pbmcuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbW11dGFibGUjcmVwbGFjZSBjYW4gb25seSBiZSBpbnZva2VkIHdpdGggb2JqZWN0cyBvciBhcnJheXMsIG5vdCBcIiArIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEltbXV0YWJsZS5tZXJnZSh0aGlzLCB2YWx1ZSwge2RlZXA6IGRlZXAsIG1vZGU6ICdyZXBsYWNlJ30pO1xuICB9XG5cbiAgdmFyIGltbXV0YWJsZUVtcHR5T2JqZWN0ID0gSW1tdXRhYmxlKHt9KTtcblxuICBmdW5jdGlvbiBvYmplY3RTZXRJbihwYXRoLCB2YWx1ZSwgY29uZmlnKSB7XG4gICAgaWYgKCEocGF0aCBpbnN0YW5jZW9mIEFycmF5KSB8fCBwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoZSBmaXJzdCBhcmd1bWVudCB0byBJbW11dGFibGUjc2V0SW4gbXVzdCBiZSBhbiBhcnJheSBjb250YWluaW5nIGF0IGxlYXN0IG9uZSBcXFwia2V5XFxcIiBzdHJpbmcuXCIpO1xuICAgIH1cblxuICAgIHZhciBoZWFkID0gcGF0aFswXTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBvYmplY3RTZXQuY2FsbCh0aGlzLCBoZWFkLCB2YWx1ZSwgY29uZmlnKTtcbiAgICB9XG5cbiAgICB2YXIgdGFpbCA9IHBhdGguc2xpY2UoMSk7XG4gICAgdmFyIG5ld1ZhbHVlO1xuICAgIHZhciB0aGlzSGVhZCA9IHRoaXNbaGVhZF07XG5cbiAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShoZWFkKSAmJiB0eXBlb2YodGhpc0hlYWQpID09PSBcIm9iamVjdFwiICYmIHRoaXNIZWFkICE9PSBudWxsKSB7XG4gICAgICAvLyBNaWdodCAodmFsaWRseSkgYmUgb2JqZWN0IG9yIGFycmF5XG4gICAgICBuZXdWYWx1ZSA9IEltbXV0YWJsZS5zZXRJbih0aGlzSGVhZCwgdGFpbCwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdWYWx1ZSA9IG9iamVjdFNldEluLmNhbGwoaW1tdXRhYmxlRW1wdHlPYmplY3QsIHRhaWwsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShoZWFkKSAmJiB0aGlzSGVhZCA9PT0gbmV3VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBtdXRhYmxlID0gcXVpY2tDb3B5KHRoaXMsIGluc3RhbnRpYXRlRW1wdHlPYmplY3QodGhpcykpO1xuICAgIG11dGFibGVbaGVhZF0gPSBuZXdWYWx1ZTtcbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZU9iamVjdChtdXRhYmxlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9iamVjdFNldChwcm9wZXJ0eSwgdmFsdWUsIGNvbmZpZykge1xuICAgIHZhciBkZWVwICAgICAgICAgID0gY29uZmlnICYmIGNvbmZpZy5kZWVwO1xuXG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICBpZiAoZGVlcCAmJiB0aGlzW3Byb3BlcnR5XSAhPT0gdmFsdWUgJiYgaXNNZXJnYWJsZU9iamVjdCh2YWx1ZSkgJiYgaXNNZXJnYWJsZU9iamVjdCh0aGlzW3Byb3BlcnR5XSkpIHtcbiAgICAgICAgdmFsdWUgPSBJbW11dGFibGUubWVyZ2UodGhpc1twcm9wZXJ0eV0sIHZhbHVlLCB7ZGVlcDogdHJ1ZSwgbW9kZTogJ3JlcGxhY2UnfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNFcXVhbCh0aGlzW3Byb3BlcnR5XSwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBtdXRhYmxlID0gcXVpY2tDb3B5KHRoaXMsIGluc3RhbnRpYXRlRW1wdHlPYmplY3QodGhpcykpO1xuICAgIG11dGFibGVbcHJvcGVydHldID0gSW1tdXRhYmxlKHZhbHVlKTtcbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZU9iamVjdChtdXRhYmxlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZShwcm9wZXJ0eSwgdXBkYXRlcikge1xuICAgIHZhciByZXN0QXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGluaXRpYWxWYWwgPSB0aGlzW3Byb3BlcnR5XTtcbiAgICByZXR1cm4gSW1tdXRhYmxlLnNldCh0aGlzLCBwcm9wZXJ0eSwgdXBkYXRlci5hcHBseShpbml0aWFsVmFsLCBbaW5pdGlhbFZhbF0uY29uY2F0KHJlc3RBcmdzKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW5QYXRoKG9iaiwgcGF0aCkge1xuICAgIC8qanNoaW50IGVxbnVsbDp0cnVlICovXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aDsgb2JqICE9IG51bGwgJiYgaSA8IGw7IGkrKykge1xuICAgICAgb2JqID0gb2JqW3BhdGhbaV1dO1xuICAgIH1cblxuICAgIHJldHVybiAoaSAmJiBpID09IGwpID8gb2JqIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlSW4ocGF0aCwgdXBkYXRlcikge1xuICAgIHZhciByZXN0QXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGluaXRpYWxWYWwgPSBnZXRJblBhdGgodGhpcywgcGF0aCk7XG5cbiAgICByZXR1cm4gSW1tdXRhYmxlLnNldEluKHRoaXMsIHBhdGgsIHVwZGF0ZXIuYXBwbHkoaW5pdGlhbFZhbCwgW2luaXRpYWxWYWxdLmNvbmNhdChyZXN0QXJncykpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzTXV0YWJsZU9iamVjdChvcHRzKSB7XG4gICAgdmFyIHJlc3VsdCA9IGluc3RhbnRpYXRlRW1wdHlPYmplY3QodGhpcyksIGtleTtcblxuICAgIGlmKG9wdHMgJiYgb3B0cy5kZWVwKSB7XG4gICAgICBmb3IgKGtleSBpbiB0aGlzKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IGFzRGVlcE11dGFibGUodGhpc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGtleSBpbiB0aGlzKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBDcmVhdGVzIHBsYWluIG9iamVjdCB0byBiZSB1c2VkIGZvciBjbG9uaW5nXG4gIGZ1bmN0aW9uIGluc3RhbnRpYXRlUGxhaW5PYmplY3QoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLy8gRmluYWxpemVzIGFuIG9iamVjdCB3aXRoIGltbXV0YWJsZSBtZXRob2RzLCBmcmVlemVzIGl0LCBhbmQgcmV0dXJucyBpdC5cbiAgZnVuY3Rpb24gbWFrZUltbXV0YWJsZU9iamVjdChvYmopIHtcbiAgICBpZiAoIWdsb2JhbENvbmZpZy51c2Vfc3RhdGljKSB7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJtZXJnZVwiLCBtZXJnZSk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJyZXBsYWNlXCIsIG9iamVjdFJlcGxhY2UpO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwid2l0aG91dFwiLCB3aXRob3V0KTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcImFzTXV0YWJsZVwiLCBhc011dGFibGVPYmplY3QpO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwic2V0XCIsIG9iamVjdFNldCk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJzZXRJblwiLCBvYmplY3RTZXRJbik7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJ1cGRhdGVcIiwgdXBkYXRlKTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcInVwZGF0ZUluXCIsIHVwZGF0ZUluKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZShvYmosIG11dGF0aW5nT2JqZWN0TWV0aG9kcyk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGEgdmFsaWQgcmVhY3QgZWxlbWVudFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi92MTUuMC4xL3NyYy9pc29tb3JwaGljL2NsYXNzaWMvZWxlbWVudC9SZWFjdEVsZW1lbnQuanMjTDMyNlxuICBmdW5jdGlvbiBpc1JlYWN0RWxlbWVudChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgb2JqICE9PSBudWxsICYmXG4gICAgICAgICAgIChvYmouJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRV9GQUxMQkFDSyB8fCBvYmouJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZpbGVPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBGaWxlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICBvYmogaW5zdGFuY2VvZiBGaWxlO1xuICB9XG5cbiAgZnVuY3Rpb24gSW1tdXRhYmxlKG9iaiwgb3B0aW9ucywgc3RhY2tSZW1haW5pbmcpIHtcbiAgICBpZiAoaXNJbW11dGFibGUob2JqKSB8fCBpc1JlYWN0RWxlbWVudChvYmopIHx8IGlzRmlsZU9iamVjdChvYmopKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICByZXR1cm4gbWFrZUltbXV0YWJsZUFycmF5KG9iai5zbGljZSgpKTtcbiAgICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHJldHVybiBtYWtlSW1tdXRhYmxlRGF0ZShuZXcgRGF0ZShvYmouZ2V0VGltZSgpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERvbid0IGZyZWV6ZSB0aGUgb2JqZWN0IHdlIHdlcmUgZ2l2ZW47IG1ha2UgYSBjbG9uZSBhbmQgdXNlIHRoYXQuXG4gICAgICB2YXIgcHJvdG90eXBlID0gb3B0aW9ucyAmJiBvcHRpb25zLnByb3RvdHlwZTtcbiAgICAgIHZhciBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0ID1cbiAgICAgICAgKCFwcm90b3R5cGUgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlKSA/XG4gICAgICAgICAgaW5zdGFudGlhdGVQbGFpbk9iamVjdCA6IChmdW5jdGlvbigpIHsgcmV0dXJuIE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTsgfSk7XG4gICAgICB2YXIgY2xvbmUgPSBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KCk7XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgLypqc2hpbnQgZXFudWxsOnRydWUgKi9cbiAgICAgICAgaWYgKHN0YWNrUmVtYWluaW5nID09IG51bGwpIHtcbiAgICAgICAgICBzdGFja1JlbWFpbmluZyA9IDY0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFja1JlbWFpbmluZyA8PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEltbXV0YWJsZUVycm9yKFwiQXR0ZW1wdCB0byBjb25zdHJ1Y3QgSW1tdXRhYmxlIGZyb20gYSBkZWVwbHkgbmVzdGVkIG9iamVjdCB3YXMgZGV0ZWN0ZWQuXCIgK1xuICAgICAgICAgICAgXCIgSGF2ZSB5b3UgdHJpZWQgdG8gd3JhcCBhbiBvYmplY3Qgd2l0aCBjaXJjdWxhciByZWZlcmVuY2VzIChlLmcuIFJlYWN0IGVsZW1lbnQpP1wiICtcbiAgICAgICAgICAgIFwiIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcnRmZWxkbWFuL3NlYW1sZXNzLWltbXV0YWJsZS93aWtpL0RlZXBseS1uZXN0ZWQtb2JqZWN0LXdhcy1kZXRlY3RlZCBmb3IgZGV0YWlscy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgc3RhY2tSZW1haW5pbmcgLT0gMTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkpIHtcbiAgICAgICAgICBjbG9uZVtrZXldID0gSW1tdXRhYmxlKG9ialtrZXldLCB1bmRlZmluZWQsIHN0YWNrUmVtYWluaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWFrZUltbXV0YWJsZU9iamVjdChjbG9uZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gV3JhcHBlciB0byBhbGxvdyB0aGUgdXNlIG9mIG9iamVjdCBtZXRob2RzIGFzIHN0YXRpYyBtZXRob2RzIG9mIEltbXV0YWJsZS5cbiAgZnVuY3Rpb24gdG9TdGF0aWMoZm4pIHtcbiAgICBmdW5jdGlvbiBzdGF0aWNXcmFwcGVyKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgc2VsZiA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgIHJldHVybiBmbi5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGljV3JhcHBlcjtcbiAgfVxuXG4gIC8vIFdyYXBwZXIgdG8gYWxsb3cgdGhlIHVzZSBvZiBvYmplY3QgbWV0aG9kcyBhcyBzdGF0aWMgbWV0aG9kcyBvZiBJbW11dGFibGUuXG4gIC8vIHdpdGggdGhlIGFkZGl0aW9uYWwgY29uZGl0aW9uIG9mIGNob29zaW5nIHdoaWNoIGZ1bmN0aW9uIHRvIGNhbGwgZGVwZW5kaW5nXG4gIC8vIGlmIGFyZ3VtZW50IGlzIGFuIGFycmF5IG9yIGFuIG9iamVjdC5cbiAgZnVuY3Rpb24gdG9TdGF0aWNPYmplY3RPckFycmF5KGZuT2JqZWN0LCBmbkFycmF5KSB7XG4gICAgZnVuY3Rpb24gc3RhdGljV3JhcHBlcigpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgdmFyIHNlbGYgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxmKSkge1xuICAgICAgICAgIHJldHVybiBmbkFycmF5LmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZm5PYmplY3QuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRpY1dyYXBwZXI7XG4gIH1cblxuICAvLyBXcmFwcGVyIHRvIGFsbG93IHRoZSB1c2Ugb2Ygb2JqZWN0IG1ldGhvZHMgYXMgc3RhdGljIG1ldGhvZHMgb2YgSW1tdXRhYmxlLlxuICAvLyB3aXRoIHRoZSBhZGRpdGlvbmFsIGNvbmRpdGlvbiBvZiBjaG9vc2luZyB3aGljaCBmdW5jdGlvbiB0byBjYWxsIGRlcGVuZGluZ1xuICAvLyBpZiBhcmd1bWVudCBpcyBhbiBhcnJheSBvciBhbiBvYmplY3Qgb3IgYSBkYXRlLlxuICBmdW5jdGlvbiB0b1N0YXRpY09iamVjdE9yRGF0ZU9yQXJyYXkoZm5PYmplY3QsIGZuQXJyYXksIGZuRGF0ZSkge1xuICAgIGZ1bmN0aW9uIHN0YXRpY1dyYXBwZXIoKSB7XG4gICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIHZhciBzZWxmID0gYXJncy5zaGlmdCgpO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZikpIHtcbiAgICAgICAgICByZXR1cm4gZm5BcnJheS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoc2VsZiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICByZXR1cm4gZm5EYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZm5PYmplY3QuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRpY1dyYXBwZXI7XG4gIH1cblxuICAvLyBFeHBvcnQgdGhlIGxpYnJhcnlcbiAgSW1tdXRhYmxlLmZyb20gICAgICAgICAgID0gSW1tdXRhYmxlO1xuICBJbW11dGFibGUuaXNJbW11dGFibGUgICAgPSBpc0ltbXV0YWJsZTtcbiAgSW1tdXRhYmxlLkltbXV0YWJsZUVycm9yID0gSW1tdXRhYmxlRXJyb3I7XG4gIEltbXV0YWJsZS5tZXJnZSAgICAgICAgICA9IHRvU3RhdGljKG1lcmdlKTtcbiAgSW1tdXRhYmxlLnJlcGxhY2UgICAgICAgID0gdG9TdGF0aWMob2JqZWN0UmVwbGFjZSk7XG4gIEltbXV0YWJsZS53aXRob3V0ICAgICAgICA9IHRvU3RhdGljKHdpdGhvdXQpO1xuICBJbW11dGFibGUuYXNNdXRhYmxlICAgICAgPSB0b1N0YXRpY09iamVjdE9yRGF0ZU9yQXJyYXkoYXNNdXRhYmxlT2JqZWN0LCBhc011dGFibGVBcnJheSwgYXNNdXRhYmxlRGF0ZSk7XG4gIEltbXV0YWJsZS5zZXQgICAgICAgICAgICA9IHRvU3RhdGljT2JqZWN0T3JBcnJheShvYmplY3RTZXQsIGFycmF5U2V0KTtcbiAgSW1tdXRhYmxlLnNldEluICAgICAgICAgID0gdG9TdGF0aWNPYmplY3RPckFycmF5KG9iamVjdFNldEluLCBhcnJheVNldEluKTtcbiAgSW1tdXRhYmxlLnVwZGF0ZSAgICAgICAgID0gdG9TdGF0aWModXBkYXRlKTtcbiAgSW1tdXRhYmxlLnVwZGF0ZUluICAgICAgID0gdG9TdGF0aWModXBkYXRlSW4pO1xuICBJbW11dGFibGUuZmxhdE1hcCAgICAgICAgPSB0b1N0YXRpYyhmbGF0TWFwKTtcbiAgSW1tdXRhYmxlLmFzT2JqZWN0ICAgICAgID0gdG9TdGF0aWMoYXNPYmplY3QpO1xuICBpZiAoIWdsb2JhbENvbmZpZy51c2Vfc3RhdGljKSB7XG4gICAgICBJbW11dGFibGUuc3RhdGljID0gaW1tdXRhYmxlSW5pdCh7XG4gICAgICAgICAgdXNlX3N0YXRpYzogdHJ1ZVxuICAgICAgfSk7XG4gIH1cblxuICBPYmplY3QuZnJlZXplKEltbXV0YWJsZSk7XG5cbiAgcmV0dXJuIEltbXV0YWJsZTtcbn1cblxuICB2YXIgSW1tdXRhYmxlID0gaW1tdXRhYmxlSW5pdCgpO1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBJbW11dGFibGU7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gSW1tdXRhYmxlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgZXhwb3J0cy5JbW11dGFibGUgPSBJbW11dGFibGU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikge1xuICAgIHdpbmRvdy5JbW11dGFibGUgPSBJbW11dGFibGU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIikge1xuICAgIGdsb2JhbC5JbW11dGFibGUgPSBJbW11dGFibGU7XG4gIH1cbn0pKCk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gXCJzZWFtbGVzcy1pbW11dGFibGVcIjtcblxuLy8gVGhpcyBtaWRkbGV3YXJlIHdpbGwganVzdCBhZGQgdGhlIHByb3BlcnR5IFwiYXN5bmMgZGlzcGF0Y2hcIlxuLy8gdG8gYWN0aW9ucyB3aXRoIHRoZSBcImFzeW5jXCIgcHJvcHBlcnR5IHNldCB0byB0cnVlXG5jb25zdCBhc3luY0Rpc3BhdGNoTWlkZGxld2FyZSA9IHN0b3JlID0+IG5leHQgPT4gYWN0aW9uID0+IHtcbiAgbGV0IHN5bmNBY3Rpdml0eUZpbmlzaGVkID0gZmFsc2U7XG4gIGxldCBhY3Rpb25RdWV1ZSA9IFtdO1xuXG4gIGZ1bmN0aW9uIGZsdXNoUXVldWUoKSB7XG4gICAgYWN0aW9uUXVldWUuZm9yRWFjaChhID0+IHN0b3JlLmRpc3BhdGNoKGEpKTsgLy8gZmx1c2ggcXVldWVcbiAgICBhY3Rpb25RdWV1ZSA9IFtdO1xuICB9XG5cbiAgZnVuY3Rpb24gYXN5bmNEaXNwYXRjaChhc3luY0FjdGlvbikge1xuICAgIGFjdGlvblF1ZXVlID0gYWN0aW9uUXVldWUuY29uY2F0KFthc3luY0FjdGlvbl0pO1xuXG4gICAgaWYgKHN5bmNBY3Rpdml0eUZpbmlzaGVkKSB7XG4gICAgICBmbHVzaFF1ZXVlKCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYWN0aW9uV2l0aEFzeW5jRGlzcGF0Y2ggPVxuICAgICAgSW1tdXRhYmxlKGFjdGlvbikubWVyZ2UoeyBhc3luY0Rpc3BhdGNoIH0pO1xuXG4gIG5leHQoYWN0aW9uV2l0aEFzeW5jRGlzcGF0Y2gpO1xuICBzeW5jQWN0aXZpdHlGaW5pc2hlZCA9IHRydWU7XG4gIGZsdXNoUXVldWUoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5pbXBvcnQgYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmUgZnJvbSBcIi4uL2pzL3V0aWxzL2FzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlXCI7XG5cbmNvbnN0IGZha2VBY3Rpb24gPSB7IHR5cGU6IFwiZmFrZSBhY3Rpb25cIiB9O1xuXG5kZXNjcmliZShcIlRoZSBhc3luY0Rpc3BhdGNoTWlkZGxld2FyZVwiLCAoKSA9PiB7XG4gIGl0KFwiY2FsbHMgbmV4dCB3aXRoIGFzeW5jRGlzcGF0Y2ggcHJvcGVydHlcIiwgKGRvbmUpID0+IHtcbiAgICBjb25zdCBuZXh0ID0gcmV0dXJuZWRBY3Rpb24gPT4ge1xuICAgICAgZXhwZWN0KHJldHVybmVkQWN0aW9uLmFzeW5jRGlzcGF0Y2gpLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICBleHBlY3QodHlwZW9mIHJldHVybmVkQWN0aW9uLmFzeW5jRGlzcGF0Y2gpLnRvRXF1YWwoXCJmdW5jdGlvblwiKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmUoXCJmYWtlU3RvcmVcIikobmV4dCkoZmFrZUFjdGlvbik7XG4gIH0pO1xuXG5cbiAgaXQoXCJhc3luY0Rpc3BhdGNoIHRyaWdnZXJzIGEgc3RvcmUgZGlzcGF0Y2hcIiwgKGRvbmUpID0+IHtcbiAgICBjb25zdCBmYWtlQXN5bmNBY3Rpb24gPSB7IHR5cGU6IFwiZmFrZUFzeW5jQWN0aW9uXCIgfTtcblxuICAgIGNvbnN0IGZha2VTdG9yZSA9IHtcbiAgICAgIGRpc3BhdGNoOiBhY3Rpb24gPT4ge1xuICAgICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoZmFrZUFzeW5jQWN0aW9uLnR5cGUpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBuZXh0ID0gcmV0dXJuZWRBY3Rpb24gPT5cbiAgICAgIHJldHVybmVkQWN0aW9uLmFzeW5jRGlzcGF0Y2goZmFrZUFzeW5jQWN0aW9uKTtcblxuICAgIGFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlKGZha2VTdG9yZSkobmV4dCkoZmFrZUFjdGlvbik7XG4gIH0pO1xufSk7XG4iLCIvLyBCdWcgY2hlY2tpbmcgZnVuY3Rpb24gdGhhdCB3aWxsIHRocm93IGFuIGVycm9yIHdoZW5ldmVyXG4vLyB0aGUgY29uZGl0aW9uIHNlbnQgdG8gaXQgaXMgZXZhbHVhdGVkIHRvIGZhbHNlXG4vKipcbiAqIFByb2Nlc3NlcyB0aGUgbWVzc2FnZSBhbmQgb3V0cHV0cyB0aGUgY29ycmVjdCBtZXNzYWdlIGlmIHRoZSBjb25kaXRpb25cbiAqIGlzIGZhbHNlLiBPdGhlcndpc2UgaXQgb3V0cHV0cyBudWxsLlxuICogQGFwaSBwcml2YXRlXG4gKiBAbWV0aG9kIHByb2Nlc3NDb25kaXRpb25cbiAqIEBwYXJhbSAge0Jvb2xlYW59IGNvbmRpdGlvbiAtIFJlc3VsdCBvZiB0aGUgZXZhbHVhdGVkIGNvbmRpdGlvblxuICogQHBhcmFtICB7U3RyaW5nfSBlcnJvck1lc3NhZ2UgLSBNZXNzYWdlIGV4cGxhaW5pZyB0aGUgZXJyb3IgaW4gY2FzZSBpdCBpcyB0aHJvd25cbiAqIEByZXR1cm4ge1N0cmluZyB8IG51bGx9ICAtIEVycm9yIG1lc3NhZ2UgaWYgdGhlcmUgaXMgYW4gZXJyb3IsIG51bCBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NDb25kaXRpb24oY29uZGl0aW9uLCBlcnJvck1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgY29tcGxldGVFcnJvck1lc3NhZ2UgPSAnJztcbiAgICB2YXIgcmUgPSAvYXQgKFteXFxzXSspXFxzXFwoL2c7XG4gICAgdmFyIHN0YWNrVHJhY2UgPSBuZXcgRXJyb3IoKS5zdGFjaztcbiAgICB2YXIgc3RhY2tGdW5jdGlvbnMgPSBbXTtcblxuICAgIHZhciBmdW5jTmFtZSA9IHJlLmV4ZWMoc3RhY2tUcmFjZSk7XG4gICAgd2hpbGUgKGZ1bmNOYW1lICYmIGZ1bmNOYW1lWzFdKSB7XG4gICAgICBzdGFja0Z1bmN0aW9ucy5wdXNoKGZ1bmNOYW1lWzFdKTtcbiAgICAgIGZ1bmNOYW1lID0gcmUuZXhlYyhzdGFja1RyYWNlKTtcbiAgICB9XG5cbiAgICAvLyBOdW1iZXIgMCBpcyBwcm9jZXNzQ29uZGl0aW9uIGl0c2VsZixcbiAgICAvLyBOdW1iZXIgMSBpcyBhc3NlcnQsXG4gICAgLy8gTnVtYmVyIDIgaXMgdGhlIGNhbGxlciBmdW5jdGlvbi5cbiAgICBpZiAoc3RhY2tGdW5jdGlvbnNbMl0pIHtcbiAgICAgIGNvbXBsZXRlRXJyb3JNZXNzYWdlID0gc3RhY2tGdW5jdGlvbnNbMl0gKyAnOiAnICsgY29tcGxldGVFcnJvck1lc3NhZ2U7XG4gICAgfVxuXG4gICAgY29tcGxldGVFcnJvck1lc3NhZ2UgKz0gZXJyb3JNZXNzYWdlO1xuICAgIHJldHVybiBjb21wbGV0ZUVycm9yTWVzc2FnZTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgYm9vbGVhbiBwYXNzZWQgdG8gaXQgZXZhbHVhdGVzIHRvIGZhbHNlLlxuICogVG8gYmUgdXNlZCBsaWtlIHRoaXM6XG4gKiBcdFx0YXNzZXJ0KG15RGF0ZSAhPT0gdW5kZWZpbmVkLCBcIkRhdGUgY2Fubm90IGJlIHVuZGVmaW5lZC5cIik7XG4gKiBAYXBpIHB1YmxpY1xuICogQG1ldGhvZCBhc3NlcnRcbiAqIEBwYXJhbSAge0Jvb2xlYW59IGNvbmRpdGlvbiAtIFJlc3VsdCBvZiB0aGUgZXZhbHVhdGVkIGNvbmRpdGlvblxuICogQHBhcmFtICB7U3RyaW5nfSBlcnJvck1lc3NhZ2UgLSBNZXNzYWdlIGV4cGxhaW5pZyB0aGUgZXJyb3IgaW4gY2FzZSBpdCBpcyB0aHJvd25cbiAqIEByZXR1cm4gdm9pZFxuICovXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBlcnJvck1lc3NhZ2UpIHtcbiAgdmFyIGVycm9yID0gcHJvY2Vzc0NvbmRpdGlvbihjb25kaXRpb24sIGVycm9yTWVzc2FnZSk7XG4gIGlmICh0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgfVxufVxuXG4vKipcbiAqIExvZ3MgYSB3YXJuaW5nIGlmIHRoZSBib29sZWFuIHBhc3NlZCB0byBpdCBldmFsdWF0ZXMgdG8gZmFsc2UuXG4gKiBUbyBiZSB1c2VkIGxpa2UgdGhpczpcbiAqIFx0XHRhc3NlcnQud2FybihteURhdGUgIT09IHVuZGVmaW5lZCwgXCJObyBkYXRlIHByb3ZpZGVkLlwiKTtcbiAqIEBhcGkgcHVibGljXG4gKiBAbWV0aG9kIHdhcm5cbiAqIEBwYXJhbSAge0Jvb2xlYW59IGNvbmRpdGlvbiAtIFJlc3VsdCBvZiB0aGUgZXZhbHVhdGVkIGNvbmRpdGlvblxuICogQHBhcmFtICB7U3RyaW5nfSBlcnJvck1lc3NhZ2UgLSBNZXNzYWdlIGV4cGxhaW5pZyB0aGUgZXJyb3IgaW4gY2FzZSBpdCBpcyB0aHJvd25cbiAqIEByZXR1cm4gdm9pZFxuICovXG5hc3NlcnQud2FybiA9IGZ1bmN0aW9uIHdhcm4oY29uZGl0aW9uLCBlcnJvck1lc3NhZ2UpIHtcbiAgdmFyIGVycm9yID0gcHJvY2Vzc0NvbmRpdGlvbihjb25kaXRpb24sIGVycm9yTWVzc2FnZSk7XG4gIGlmICh0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYXNzZXJ0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lJaXdpYzI5MWNtTmxjeUk2V3lKaGMzTmxjblF1YW5NaVhTd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeThnUW5WbklHTm9aV05yYVc1bklHWjFibU4wYVc5dUlIUm9ZWFFnZDJsc2JDQjBhSEp2ZHlCaGJpQmxjbkp2Y2lCM2FHVnVaWFpsY2x4dUx5OGdkR2hsSUdOdmJtUnBkR2x2YmlCelpXNTBJSFJ2SUdsMElHbHpJR1YyWVd4MVlYUmxaQ0IwYnlCbVlXeHpaVnh1THlvcVhHNGdLaUJRY205alpYTnpaWE1nZEdobElHMWxjM05oWjJVZ1lXNWtJRzkxZEhCMWRITWdkR2hsSUdOdmNuSmxZM1FnYldWemMyRm5aU0JwWmlCMGFHVWdZMjl1WkdsMGFXOXVYRzRnS2lCcGN5Qm1ZV3h6WlM0Z1QzUm9aWEozYVhObElHbDBJRzkxZEhCMWRITWdiblZzYkM1Y2JpQXFJRUJoY0drZ2NISnBkbUYwWlZ4dUlDb2dRRzFsZEdodlpDQndjbTlqWlhOelEyOXVaR2wwYVc5dVhHNGdLaUJBY0dGeVlXMGdJSHRDYjI5c1pXRnVmU0JqYjI1a2FYUnBiMjRnTFNCU1pYTjFiSFFnYjJZZ2RHaGxJR1YyWVd4MVlYUmxaQ0JqYjI1a2FYUnBiMjVjYmlBcUlFQndZWEpoYlNBZ2UxTjBjbWx1WjMwZ1pYSnliM0pOWlhOellXZGxJQzBnVFdWemMyRm5aU0JsZUhCc1lXbHVhV2NnZEdobElHVnljbTl5SUdsdUlHTmhjMlVnYVhRZ2FYTWdkR2h5YjNkdVhHNGdLaUJBY21WMGRYSnVJSHRUZEhKcGJtY2dmQ0J1ZFd4c2ZTQWdMU0JGY25KdmNpQnRaWE56WVdkbElHbG1JSFJvWlhKbElHbHpJR0Z1SUdWeWNtOXlMQ0J1ZFd3Z2IzUm9aWEozYVhObExseHVJQ292WEc1bWRXNWpkR2x2YmlCd2NtOWpaWE56UTI5dVpHbDBhVzl1S0dOdmJtUnBkR2x2Yml3Z1pYSnliM0pOWlhOellXZGxLU0I3WEc0Z0lHbG1JQ2doWTI5dVpHbDBhVzl1S1NCN1hHNGdJQ0FnYkdWMElHTnZiWEJzWlhSbFJYSnliM0pOWlhOellXZGxJRDBnSnljN1hHNGdJQ0FnWTI5dWMzUWdjbVVnUFNBdllYUWdLRnRlWEZ4elhTc3BYRnh6WEZ3b0wyYzdYRzRnSUNBZ1kyOXVjM1FnYzNSaFkydFVjbUZqWlNBOUlHNWxkeUJGY25KdmNpZ3BMbk4wWVdOck8xeHVJQ0FnSUdOdmJuTjBJSE4wWVdOclJuVnVZM1JwYjI1eklEMGdXMTA3WEc1Y2JpQWdJQ0JzWlhRZ1puVnVZMDVoYldVZ1BTQnlaUzVsZUdWaktITjBZV05yVkhKaFkyVXBPMXh1SUNBZ0lIZG9hV3hsSUNobWRXNWpUbUZ0WlNBbUppQm1kVzVqVG1GdFpWc3hYU2tnZTF4dUlDQWdJQ0FnYzNSaFkydEdkVzVqZEdsdmJuTXVjSFZ6YUNobWRXNWpUbUZ0WlZzeFhTazdYRzRnSUNBZ0lDQm1kVzVqVG1GdFpTQTlJSEpsTG1WNFpXTW9jM1JoWTJ0VWNtRmpaU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnVG5WdFltVnlJREFnYVhNZ2NISnZZMlZ6YzBOdmJtUnBkR2x2YmlCcGRITmxiR1lzWEc0Z0lDQWdMeThnVG5WdFltVnlJREVnYVhNZ1lYTnpaWEowTEZ4dUlDQWdJQzh2SUU1MWJXSmxjaUF5SUdseklIUm9aU0JqWVd4c1pYSWdablZ1WTNScGIyNHVYRzRnSUNBZ2FXWWdLSE4wWVdOclJuVnVZM1JwYjI1eld6SmRLU0I3WEc0Z0lDQWdJQ0JqYjIxd2JHVjBaVVZ5Y205eVRXVnpjMkZuWlNBOUlHQWtlM04wWVdOclJuVnVZM1JwYjI1eld6SmRmVG9nSkh0amIyMXdiR1YwWlVWeWNtOXlUV1Z6YzJGblpYMWdPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHTnZiWEJzWlhSbFJYSnliM0pOWlhOellXZGxJQ3M5SUdWeWNtOXlUV1Z6YzJGblpUdGNiaUFnSUNCeVpYUjFjbTRnWTI5dGNHeGxkR1ZGY25KdmNrMWxjM05oWjJVN1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z2JuVnNiRHRjYm4xY2JseHVMeW9xWEc0Z0tpQlVhSEp2ZDNNZ1lXNGdaWEp5YjNJZ2FXWWdkR2hsSUdKdmIyeGxZVzRnY0dGemMyVmtJSFJ2SUdsMElHVjJZV3gxWVhSbGN5QjBieUJtWVd4elpTNWNiaUFxSUZSdklHSmxJSFZ6WldRZ2JHbHJaU0IwYUdsek9seHVJQ29nWEhSY2RHRnpjMlZ5ZENodGVVUmhkR1VnSVQwOUlIVnVaR1ZtYVc1bFpDd2dYQ0pFWVhSbElHTmhibTV2ZENCaVpTQjFibVJsWm1sdVpXUXVYQ0lwTzF4dUlDb2dRR0Z3YVNCd2RXSnNhV05jYmlBcUlFQnRaWFJvYjJRZ1lYTnpaWEowWEc0Z0tpQkFjR0Z5WVcwZ0lIdENiMjlzWldGdWZTQmpiMjVrYVhScGIyNGdMU0JTWlhOMWJIUWdiMllnZEdobElHVjJZV3gxWVhSbFpDQmpiMjVrYVhScGIyNWNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnWlhKeWIzSk5aWE56WVdkbElDMGdUV1Z6YzJGblpTQmxlSEJzWVdsdWFXY2dkR2hsSUdWeWNtOXlJR2x1SUdOaGMyVWdhWFFnYVhNZ2RHaHliM2R1WEc0Z0tpQkFjbVYwZFhKdUlIWnZhV1JjYmlBcUwxeHVablZ1WTNScGIyNGdZWE56WlhKMEtHTnZibVJwZEdsdmJpd2daWEp5YjNKTlpYTnpZV2RsS1NCN1hHNGdJR052Ym5OMElHVnljbTl5SUQwZ2NISnZZMlZ6YzBOdmJtUnBkR2x2YmloamIyNWthWFJwYjI0c0lHVnljbTl5VFdWemMyRm5aU2s3WEc0Z0lHbG1JQ2gwZVhCbGIyWWdaWEp5YjNJZ1BUMDlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtHVnljbTl5S1R0Y2JpQWdmVnh1ZlZ4dVhHNHZLaXBjYmlBcUlFeHZaM01nWVNCM1lYSnVhVzVuSUdsbUlIUm9aU0JpYjI5c1pXRnVJSEJoYzNObFpDQjBieUJwZENCbGRtRnNkV0YwWlhNZ2RHOGdabUZzYzJVdVhHNGdLaUJVYnlCaVpTQjFjMlZrSUd4cGEyVWdkR2hwY3pwY2JpQXFJRngwWEhSaGMzTmxjblF1ZDJGeWJpaHRlVVJoZEdVZ0lUMDlJSFZ1WkdWbWFXNWxaQ3dnWENKT2J5QmtZWFJsSUhCeWIzWnBaR1ZrTGx3aUtUdGNiaUFxSUVCaGNHa2djSFZpYkdsalhHNGdLaUJBYldWMGFHOWtJSGRoY201Y2JpQXFJRUJ3WVhKaGJTQWdlMEp2YjJ4bFlXNTlJR052Ym1ScGRHbHZiaUF0SUZKbGMzVnNkQ0J2WmlCMGFHVWdaWFpoYkhWaGRHVmtJR052Ym1ScGRHbHZibHh1SUNvZ1FIQmhjbUZ0SUNCN1UzUnlhVzVuZlNCbGNuSnZjazFsYzNOaFoyVWdMU0JOWlhOellXZGxJR1Y0Y0d4aGFXNXBaeUIwYUdVZ1pYSnliM0lnYVc0Z1kyRnpaU0JwZENCcGN5QjBhSEp2ZDI1Y2JpQXFJRUJ5WlhSMWNtNGdkbTlwWkZ4dUlDb3ZYRzVoYzNObGNuUXVkMkZ5YmlBOUlHWjFibU4wYVc5dUlIZGhjbTRvWTI5dVpHbDBhVzl1TENCbGNuSnZjazFsYzNOaFoyVXBJSHRjYmlBZ1kyOXVjM1FnWlhKeWIzSWdQU0J3Y205alpYTnpRMjl1WkdsMGFXOXVLR052Ym1ScGRHbHZiaXdnWlhKeWIzSk5aWE56WVdkbEtUdGNiaUFnYVdZZ0tIUjVjR1Z2WmlCbGNuSnZjaUE5UFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNCamIyNXpiMnhsTG5kaGNtNG9aWEp5YjNJcE8xeHVJQ0I5WEc1OU8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQmhjM05sY25RN1hHNGlYU3dpWm1sc1pTSTZJbUZ6YzJWeWRDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSXZjMjkxY21ObEx5SjlcbiIsIi8qKlxuICogVGVzdHMgd2hldGhlciBvciBub3QgYW4gb2JqZWN0IGlzIGFuIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgb2JqZWN0IHRvIHRlc3QuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgYHZhbGAgaXMgYW4gYXJyYXksIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIF9pc0FycmF5KFtdKTsgLy89PiB0cnVlXG4gKiAgICAgIF9pc0FycmF5KG51bGwpOyAvLz0+IGZhbHNlXG4gKiAgICAgIF9pc0FycmF5KHt9KTsgLy89PiBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gX2lzQXJyYXkodmFsKSB7XG4gIHJldHVybiAodmFsICE9IG51bGwgJiZcbiAgICAgICAgICB2YWwubGVuZ3RoID49IDAgJiZcbiAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJyk7XG59O1xuIiwiLyoqXG4gKiBBbiBvcHRpbWl6ZWQsIHByaXZhdGUgYXJyYXkgYHNsaWNlYCBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcmd1bWVudHN8QXJyYXl9IGFyZ3MgVGhlIGFycmF5IG9yIGFyZ3VtZW50cyBvYmplY3QgdG8gY29uc2lkZXIuXG4gKiBAcGFyYW0ge051bWJlcn0gW2Zyb209MF0gVGhlIGFycmF5IGluZGV4IHRvIHNsaWNlIGZyb20sIGluY2x1c2l2ZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbdG89YXJncy5sZW5ndGhdIFRoZSBhcnJheSBpbmRleCB0byBzbGljZSB0bywgZXhjbHVzaXZlLlxuICogQHJldHVybiB7QXJyYXl9IEEgbmV3LCBzbGljZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgX3NsaWNlKFsxLCAyLCAzLCA0LCA1XSwgMSwgMyk7IC8vPT4gWzIsIDNdXG4gKlxuICogICAgICB2YXIgZmlyc3RUaHJlZUFyZ3MgPSBmdW5jdGlvbihhLCBiLCBjLCBkKSB7XG4gKiAgICAgICAgcmV0dXJuIF9zbGljZShhcmd1bWVudHMsIDAsIDMpO1xuICogICAgICB9O1xuICogICAgICBmaXJzdFRocmVlQXJncygxLCAyLCAzLCA0KTsgLy89PiBbMSwgMiwgM11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfc2xpY2UoYXJncywgZnJvbSwgdG8pIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gX3NsaWNlKGFyZ3MsIDAsIGFyZ3MubGVuZ3RoKTtcbiAgICBjYXNlIDI6IHJldHVybiBfc2xpY2UoYXJncywgZnJvbSwgYXJncy5sZW5ndGgpO1xuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbGlzdCA9IFtdO1xuICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICB2YXIgbGVuID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oYXJncy5sZW5ndGgsIHRvKSAtIGZyb20pO1xuICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICBsaXN0W2lkeF0gPSBhcmdzW2Zyb20gKyBpZHhdO1xuICAgICAgICBpZHggKz0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaXN0O1xuICB9XG59O1xuIiwidmFyIF9pc0FycmF5ID0gcmVxdWlyZSgnLi9faXNBcnJheScpO1xudmFyIF9zbGljZSA9IHJlcXVpcmUoJy4vX3NsaWNlJyk7XG5cblxuLyoqXG4gKiBTaW1pbGFyIHRvIGhhc01ldGhvZCwgdGhpcyBjaGVja3Mgd2hldGhlciBhIGZ1bmN0aW9uIGhhcyBhIFttZXRob2RuYW1lXVxuICogZnVuY3Rpb24uIElmIGl0IGlzbid0IGFuIGFycmF5IGl0IHdpbGwgZXhlY3V0ZSB0aGF0IGZ1bmN0aW9uIG90aGVyd2lzZSBpdFxuICogd2lsbCBkZWZhdWx0IHRvIHRoZSByYW1kYSBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gcmFtZGEgaW1wbGVtdGF0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kbmFtZSBwcm9wZXJ0eSB0byBjaGVjayBmb3IgYSBjdXN0b20gaW1wbGVtZW50YXRpb25cbiAqIEByZXR1cm4ge09iamVjdH0gV2hhdGV2ZXIgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbWV0aG9kIGlzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jaGVja0Zvck1ldGhvZChtZXRob2RuYW1lLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZuKCk7XG4gICAgfVxuICAgIHZhciBvYmogPSBhcmd1bWVudHNbbGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIChfaXNBcnJheShvYmopIHx8IHR5cGVvZiBvYmpbbWV0aG9kbmFtZV0gIT09ICdmdW5jdGlvbicpID9cbiAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOlxuICAgICAgb2JqW21ldGhvZG5hbWVdLmFwcGx5KG9iaiwgX3NsaWNlKGFyZ3VtZW50cywgMCwgbGVuZ3RoIC0gMSkpO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2lzUGxhY2Vob2xkZXIoYSkge1xuICByZXR1cm4gYSAhPSBudWxsICYmXG4gICAgICAgICB0eXBlb2YgYSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgIGFbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlO1xufTtcbiIsInZhciBfaXNQbGFjZWhvbGRlciA9IHJlcXVpcmUoJy4vX2lzUGxhY2Vob2xkZXInKTtcblxuXG4vKipcbiAqIE9wdGltaXplZCBpbnRlcm5hbCBvbmUtYXJpdHkgY3VycnkgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jdXJyeTEoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGYxKGEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCBfaXNQbGFjZWhvbGRlcihhKSkge1xuICAgICAgcmV0dXJuIGYxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59O1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL19jdXJyeTEnKTtcbnZhciBfaXNQbGFjZWhvbGRlciA9IHJlcXVpcmUoJy4vX2lzUGxhY2Vob2xkZXInKTtcblxuXG4vKipcbiAqIE9wdGltaXplZCBpbnRlcm5hbCB0d28tYXJpdHkgY3VycnkgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jdXJyeTIoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGYyKGEsIGIpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIGYyO1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gX2lzUGxhY2Vob2xkZXIoYSkgPyBmMlxuICAgICAgICAgICAgIDogX2N1cnJ5MShmdW5jdGlvbihfYikgeyByZXR1cm4gZm4oYSwgX2IpOyB9KTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihiKSA/IGYyXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihhKSA/IF9jdXJyeTEoZnVuY3Rpb24oX2EpIHsgcmV0dXJuIGZuKF9hLCBiKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGIpID8gX2N1cnJ5MShmdW5jdGlvbihfYikgeyByZXR1cm4gZm4oYSwgX2IpOyB9KVxuICAgICAgICAgICAgIDogZm4oYSwgYik7XG4gICAgfVxuICB9O1xufTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9fY3VycnkxJyk7XG52YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vX2N1cnJ5MicpO1xudmFyIF9pc1BsYWNlaG9sZGVyID0gcmVxdWlyZSgnLi9faXNQbGFjZWhvbGRlcicpO1xuXG5cbi8qKlxuICogT3B0aW1pemVkIGludGVybmFsIHRocmVlLWFyaXR5IGN1cnJ5IGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY3VycnkzKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmMyhhLCBiLCBjKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBmMztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpID8gZjNcbiAgICAgICAgICAgICA6IF9jdXJyeTIoZnVuY3Rpb24oX2IsIF9jKSB7IHJldHVybiBmbihhLCBfYiwgX2MpOyB9KTtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpID8gZjNcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGEpID8gX2N1cnJ5MihmdW5jdGlvbihfYSwgX2MpIHsgcmV0dXJuIGZuKF9hLCBiLCBfYyk7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTIoZnVuY3Rpb24oX2IsIF9jKSB7IHJldHVybiBmbihhLCBfYiwgX2MpOyB9KVxuICAgICAgICAgICAgIDogX2N1cnJ5MShmdW5jdGlvbihfYykgeyByZXR1cm4gZm4oYSwgYiwgX2MpOyB9KTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihiKSAmJiBfaXNQbGFjZWhvbGRlcihjKSA/IGYzXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTIoZnVuY3Rpb24oX2EsIF9iKSB7IHJldHVybiBmbihfYSwgX2IsIGMpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYSkgJiYgX2lzUGxhY2Vob2xkZXIoYykgPyBfY3VycnkyKGZ1bmN0aW9uKF9hLCBfYykgeyByZXR1cm4gZm4oX2EsIGIsIF9jKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGIpICYmIF9pc1BsYWNlaG9sZGVyKGMpID8gX2N1cnJ5MihmdW5jdGlvbihfYiwgX2MpIHsgcmV0dXJuIGZuKGEsIF9iLCBfYyk7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihhKSA/IF9jdXJyeTEoZnVuY3Rpb24oX2EpIHsgcmV0dXJuIGZuKF9hLCBiLCBjKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGIpID8gX2N1cnJ5MShmdW5jdGlvbihfYikgeyByZXR1cm4gZm4oYSwgX2IsIGMpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYykgPyBfY3VycnkxKGZ1bmN0aW9uKF9jKSB7IHJldHVybiBmbihhLCBiLCBfYyk7IH0pXG4gICAgICAgICAgICAgOiBmbihhLCBiLCBjKTtcbiAgICB9XG4gIH07XG59O1xuIiwidmFyIF9jaGVja0Zvck1ldGhvZCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2NoZWNrRm9yTWV0aG9kJyk7XG52YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgZWxlbWVudHMgb2YgdGhlIGdpdmVuIGxpc3Qgb3Igc3RyaW5nIChvciBvYmplY3Qgd2l0aCBhIGBzbGljZWBcbiAqIG1ldGhvZCkgZnJvbSBgZnJvbUluZGV4YCAoaW5jbHVzaXZlKSB0byBgdG9JbmRleGAgKGV4Y2x1c2l2ZSkuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYHNsaWNlYCBtZXRob2Qgb2YgdGhlIHRoaXJkIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuNFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBbYV0gLT4gW2FdXG4gKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gU3RyaW5nIC0+IFN0cmluZ1xuICogQHBhcmFtIHtOdW1iZXJ9IGZyb21JbmRleCBUaGUgc3RhcnQgaW5kZXggKGluY2x1c2l2ZSkuXG4gKiBAcGFyYW0ge051bWJlcn0gdG9JbmRleCBUaGUgZW5kIGluZGV4IChleGNsdXNpdmUpLlxuICogQHBhcmFtIHsqfSBsaXN0XG4gKiBAcmV0dXJuIHsqfVxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuc2xpY2UoMSwgMywgWydhJywgJ2InLCAnYycsICdkJ10pOyAgICAgICAgLy89PiBbJ2InLCAnYyddXG4gKiAgICAgIFIuc2xpY2UoMSwgSW5maW5pdHksIFsnYScsICdiJywgJ2MnLCAnZCddKTsgLy89PiBbJ2InLCAnYycsICdkJ11cbiAqICAgICAgUi5zbGljZSgwLCAtMSwgWydhJywgJ2InLCAnYycsICdkJ10pOyAgICAgICAvLz0+IFsnYScsICdiJywgJ2MnXVxuICogICAgICBSLnNsaWNlKC0zLCAtMSwgWydhJywgJ2InLCAnYycsICdkJ10pOyAgICAgIC8vPT4gWydiJywgJ2MnXVxuICogICAgICBSLnNsaWNlKDAsIDMsICdyYW1kYScpOyAgICAgICAgICAgICAgICAgICAgIC8vPT4gJ3JhbSdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkzKF9jaGVja0Zvck1ldGhvZCgnc2xpY2UnLCBmdW5jdGlvbiBzbGljZShmcm9tSW5kZXgsIHRvSW5kZXgsIGxpc3QpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGxpc3QsIGZyb21JbmRleCwgdG9JbmRleCk7XG59KSk7XG4iLCJ2YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVzdWx0IG9mIFwic2V0dGluZ1wiIHRoZSBwb3J0aW9uIG9mIHRoZSBnaXZlbiBkYXRhIHN0cnVjdHVyZVxuICogZm9jdXNlZCBieSB0aGUgZ2l2ZW4gbGVucyB0byB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIHRoZSBnaXZlbiBmdW5jdGlvbiB0b1xuICogdGhlIGZvY3VzZWQgdmFsdWUuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMTYuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHR5cGVkZWZuIExlbnMgcyBhID0gRnVuY3RvciBmID0+IChhIC0+IGYgYSkgLT4gcyAtPiBmIHNcbiAqIEBzaWcgTGVucyBzIGEgLT4gKGEgLT4gYSkgLT4gcyAtPiBzXG4gKiBAcGFyYW0ge0xlbnN9IGxlbnNcbiAqIEBwYXJhbSB7Kn0gdlxuICogQHBhcmFtIHsqfSB4XG4gKiBAcmV0dXJuIHsqfVxuICogQHNlZSBSLnByb3AsIFIubGVuc0luZGV4LCBSLmxlbnNQcm9wXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIGhlYWRMZW5zID0gUi5sZW5zSW5kZXgoMCk7XG4gKlxuICogICAgICBSLm92ZXIoaGVhZExlbnMsIFIudG9VcHBlciwgWydmb28nLCAnYmFyJywgJ2JheiddKTsgLy89PiBbJ0ZPTycsICdiYXInLCAnYmF6J11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIC8vIGBJZGVudGl0eWAgaXMgYSBmdW5jdG9yIHRoYXQgaG9sZHMgYSBzaW5nbGUgdmFsdWUsIHdoZXJlIGBtYXBgIHNpbXBseVxuICAvLyB0cmFuc2Zvcm1zIHRoZSBoZWxkIHZhbHVlIHdpdGggdGhlIHByb3ZpZGVkIGZ1bmN0aW9uLlxuICB2YXIgSWRlbnRpdHkgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHt2YWx1ZTogeCwgbWFwOiBmdW5jdGlvbihmKSB7IHJldHVybiBJZGVudGl0eShmKHgpKTsgfX07XG4gIH07XG5cbiAgcmV0dXJuIF9jdXJyeTMoZnVuY3Rpb24gb3ZlcihsZW5zLCBmLCB4KSB7XG4gICAgLy8gVGhlIHZhbHVlIHJldHVybmVkIGJ5IHRoZSBnZXR0ZXIgZnVuY3Rpb24gaXMgZmlyc3QgdHJhbnNmb3JtZWQgd2l0aCBgZmAsXG4gICAgLy8gdGhlbiBzZXQgYXMgdGhlIHZhbHVlIG9mIGFuIGBJZGVudGl0eWAuIFRoaXMgaXMgdGhlbiBtYXBwZWQgb3ZlciB3aXRoIHRoZVxuICAgIC8vIHNldHRlciBmdW5jdGlvbiBvZiB0aGUgbGVucy5cbiAgICByZXR1cm4gbGVucyhmdW5jdGlvbih5KSB7IHJldHVybiBJZGVudGl0eShmKHkpKTsgfSkoeCkudmFsdWU7XG4gIH0pO1xufSgpKTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBhbHdheXMgcmV0dXJucyB0aGUgZ2l2ZW4gdmFsdWUuIE5vdGUgdGhhdCBmb3JcbiAqIG5vbi1wcmltaXRpdmVzIHRoZSB2YWx1ZSByZXR1cm5lZCBpcyBhIHJlZmVyZW5jZSB0byB0aGUgb3JpZ2luYWwgdmFsdWUuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyBrbm93biBhcyBgY29uc3RgLCBgY29uc3RhbnRgLCBvciBgS2AgKGZvciBLIGNvbWJpbmF0b3IpIGluXG4gKiBvdGhlciBsYW5ndWFnZXMgYW5kIGxpYnJhcmllcy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyBhIC0+ICgqIC0+IGEpXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gd3JhcCBpbiBhIGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBGdW5jdGlvbiA6OiAqIC0+IHZhbC5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgdCA9IFIuYWx3YXlzKCdUZWUnKTtcbiAqICAgICAgdCgpOyAvLz0+ICdUZWUnXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MShmdW5jdGlvbiBhbHdheXModmFsKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9O1xufSk7XG4iLCJ2YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xudmFyIGFsd2F5cyA9IHJlcXVpcmUoJy4vYWx3YXlzJyk7XG52YXIgb3ZlciA9IHJlcXVpcmUoJy4vb3ZlcicpO1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVzdWx0IG9mIFwic2V0dGluZ1wiIHRoZSBwb3J0aW9uIG9mIHRoZSBnaXZlbiBkYXRhIHN0cnVjdHVyZVxuICogZm9jdXNlZCBieSB0aGUgZ2l2ZW4gbGVucyB0byB0aGUgZ2l2ZW4gdmFsdWUuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMTYuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHR5cGVkZWZuIExlbnMgcyBhID0gRnVuY3RvciBmID0+IChhIC0+IGYgYSkgLT4gcyAtPiBmIHNcbiAqIEBzaWcgTGVucyBzIGEgLT4gYSAtPiBzIC0+IHNcbiAqIEBwYXJhbSB7TGVuc30gbGVuc1xuICogQHBhcmFtIHsqfSB2XG4gKiBAcGFyYW0geyp9IHhcbiAqIEByZXR1cm4geyp9XG4gKiBAc2VlIFIucHJvcCwgUi5sZW5zSW5kZXgsIFIubGVuc1Byb3BcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgeExlbnMgPSBSLmxlbnNQcm9wKCd4Jyk7XG4gKlxuICogICAgICBSLnNldCh4TGVucywgNCwge3g6IDEsIHk6IDJ9KTsgIC8vPT4ge3g6IDQsIHk6IDJ9XG4gKiAgICAgIFIuc2V0KHhMZW5zLCA4LCB7eDogMSwgeTogMn0pOyAgLy89PiB7eDogOCwgeTogMn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkzKGZ1bmN0aW9uIHNldChsZW5zLCB2LCB4KSB7XG4gIHJldHVybiBvdmVyKGxlbnMsIGFsd2F5cyh2KSwgeCk7XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2FyaXR5KG4sIGZuKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIHN3aXRjaCAobikge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhMCkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhMCwgYTEpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMikgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMykgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDU6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSA2OiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMiwgYTMsIGE0LCBhNSkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDc6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNikgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDg6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSA5OiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDEwOiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCwgYTkpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCB0byBfYXJpdHkgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIG5vIGdyZWF0ZXIgdGhhbiB0ZW4nKTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3BpcGUoZiwgZykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGcuY2FsbCh0aGlzLCBmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBYV3JhcChmbikge1xuICAgIHRoaXMuZiA9IGZuO1xuICB9XG4gIFhXcmFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW5pdCBub3QgaW1wbGVtZW50ZWQgb24gWFdyYXAnKTtcbiAgfTtcbiAgWFdyYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbihhY2MpIHsgcmV0dXJuIGFjYzsgfTtcbiAgWFdyYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24oYWNjLCB4KSB7XG4gICAgcmV0dXJuIHRoaXMuZihhY2MsIHgpO1xuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiBfeHdyYXAoZm4pIHsgcmV0dXJuIG5ldyBYV3JhcChmbik7IH07XG59KCkpO1xuIiwidmFyIF9hcml0eSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2FyaXR5Jyk7XG52YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xuXG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXMgYm91bmQgdG8gYSBjb250ZXh0LlxuICogTm90ZTogYFIuYmluZGAgZG9lcyBub3QgcHJvdmlkZSB0aGUgYWRkaXRpb25hbCBhcmd1bWVudC1iaW5kaW5nIGNhcGFiaWxpdGllcyBvZlxuICogW0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9iaW5kKS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC42LjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHNpZyAoKiAtPiAqKSAtPiB7Kn0gLT4gKCogLT4gKilcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBiaW5kIHRvIGNvbnRleHRcbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzT2JqIFRoZSBjb250ZXh0IHRvIGJpbmQgYGZuYCB0b1xuICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCB3aWxsIGV4ZWN1dGUgaW4gdGhlIGNvbnRleHQgb2YgYHRoaXNPYmpgLlxuICogQHNlZSBSLnBhcnRpYWxcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgbG9nID0gUi5iaW5kKGNvbnNvbGUubG9nLCBjb25zb2xlKTtcbiAqICAgICAgUi5waXBlKFIuYXNzb2MoJ2EnLCAyKSwgUi50YXAobG9nKSwgUi5hc3NvYygnYScsIDMpKSh7YTogMX0pOyAvLz0+IHthOiAzfVxuICogICAgICAvLyBsb2dzIHthOiAyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gYmluZChmbiwgdGhpc09iaikge1xuICByZXR1cm4gX2FyaXR5KGZuLmxlbmd0aCwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNPYmosIGFyZ3VtZW50cyk7XG4gIH0pO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9pc1N0cmluZyh4KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG52YXIgX2lzQXJyYXkgPSByZXF1aXJlKCcuL2ludGVybmFsL19pc0FycmF5Jyk7XG52YXIgX2lzU3RyaW5nID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9faXNTdHJpbmcnKTtcblxuXG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBpcyBzaW1pbGFyIHRvIGFuIGFycmF5LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjUuMFxuICogQGNhdGVnb3J5IFR5cGVcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnICogLT4gQm9vbGVhblxuICogQHBhcmFtIHsqfSB4IFRoZSBvYmplY3QgdG8gdGVzdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgeGAgaGFzIGEgbnVtZXJpYyBsZW5ndGggcHJvcGVydHkgYW5kIGV4dHJlbWUgaW5kaWNlcyBkZWZpbmVkOyBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmlzQXJyYXlMaWtlKFtdKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuaXNBcnJheUxpa2UodHJ1ZSk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pc0FycmF5TGlrZSh7fSk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pc0FycmF5TGlrZSh7bGVuZ3RoOiAxMH0pOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuaXNBcnJheUxpa2UoezA6ICd6ZXJvJywgOTogJ25pbmUnLCBsZW5ndGg6IDEwfSk7IC8vPT4gdHJ1ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTEoZnVuY3Rpb24gaXNBcnJheUxpa2UoeCkge1xuICBpZiAoX2lzQXJyYXkoeCkpIHsgcmV0dXJuIHRydWU7IH1cbiAgaWYgKCF4KSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAodHlwZW9mIHggIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoX2lzU3RyaW5nKHgpKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoeC5ub2RlVHlwZSA9PT0gMSkgeyByZXR1cm4gISF4Lmxlbmd0aDsgfVxuICBpZiAoeC5sZW5ndGggPT09IDApIHsgcmV0dXJuIHRydWU7IH1cbiAgaWYgKHgubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB4Lmhhc093blByb3BlcnR5KDApICYmIHguaGFzT3duUHJvcGVydHkoeC5sZW5ndGggLSAxKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59KTtcbiIsInZhciBfeHdyYXAgPSByZXF1aXJlKCcuL194d3JhcCcpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuLi9iaW5kJyk7XG52YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pc0FycmF5TGlrZScpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBfYXJyYXlSZWR1Y2UoeGYsIGFjYywgbGlzdCkge1xuICAgIHZhciBpZHggPSAwO1xuICAgIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcbiAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICBhY2MgPSB4ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShhY2MsIGxpc3RbaWR4XSk7XG4gICAgICBpZiAoYWNjICYmIGFjY1snQEB0cmFuc2R1Y2VyL3JlZHVjZWQnXSkge1xuICAgICAgICBhY2MgPSBhY2NbJ0BAdHJhbnNkdWNlci92YWx1ZSddO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlkeCArPSAxO1xuICAgIH1cbiAgICByZXR1cm4geGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShhY2MpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2l0ZXJhYmxlUmVkdWNlKHhmLCBhY2MsIGl0ZXIpIHtcbiAgICB2YXIgc3RlcCA9IGl0ZXIubmV4dCgpO1xuICAgIHdoaWxlICghc3RlcC5kb25lKSB7XG4gICAgICBhY2MgPSB4ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShhY2MsIHN0ZXAudmFsdWUpO1xuICAgICAgaWYgKGFjYyAmJiBhY2NbJ0BAdHJhbnNkdWNlci9yZWR1Y2VkJ10pIHtcbiAgICAgICAgYWNjID0gYWNjWydAQHRyYW5zZHVjZXIvdmFsdWUnXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBzdGVwID0gaXRlci5uZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiB4ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKGFjYyk7XG4gIH1cblxuICBmdW5jdGlvbiBfbWV0aG9kUmVkdWNlKHhmLCBhY2MsIG9iaikge1xuICAgIHJldHVybiB4ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKG9iai5yZWR1Y2UoYmluZCh4ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSwgeGYpLCBhY2MpKTtcbiAgfVxuXG4gIHZhciBzeW1JdGVyYXRvciA9ICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJykgPyBTeW1ib2wuaXRlcmF0b3IgOiAnQEBpdGVyYXRvcic7XG4gIHJldHVybiBmdW5jdGlvbiBfcmVkdWNlKGZuLCBhY2MsIGxpc3QpIHtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmbiA9IF94d3JhcChmbik7XG4gICAgfVxuICAgIGlmIChpc0FycmF5TGlrZShsaXN0KSkge1xuICAgICAgcmV0dXJuIF9hcnJheVJlZHVjZShmbiwgYWNjLCBsaXN0KTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsaXN0LnJlZHVjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIF9tZXRob2RSZWR1Y2UoZm4sIGFjYywgbGlzdCk7XG4gICAgfVxuICAgIGlmIChsaXN0W3N5bUl0ZXJhdG9yXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gX2l0ZXJhYmxlUmVkdWNlKGZuLCBhY2MsIGxpc3Rbc3ltSXRlcmF0b3JdKCkpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxpc3QubmV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIF9pdGVyYWJsZVJlZHVjZShmbiwgYWNjLCBsaXN0KTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncmVkdWNlOiBsaXN0IG11c3QgYmUgYXJyYXkgb3IgaXRlcmFibGUnKTtcbiAgfTtcbn0oKSk7XG4iLCJ2YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xudmFyIF9yZWR1Y2UgPSByZXF1aXJlKCcuL2ludGVybmFsL19yZWR1Y2UnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBzaW5nbGUgaXRlbSBieSBpdGVyYXRpbmcgdGhyb3VnaCB0aGUgbGlzdCwgc3VjY2Vzc2l2ZWx5IGNhbGxpbmdcbiAqIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBhbmQgcGFzc2luZyBpdCBhbiBhY2N1bXVsYXRvciB2YWx1ZSBhbmQgdGhlIGN1cnJlbnRcbiAqIHZhbHVlIGZyb20gdGhlIGFycmF5LCBhbmQgdGhlbiBwYXNzaW5nIHRoZSByZXN1bHQgdG8gdGhlIG5leHQgY2FsbC5cbiAqXG4gKiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gcmVjZWl2ZXMgdHdvIHZhbHVlczogKihhY2MsIHZhbHVlKSouIEl0IG1heSB1c2VcbiAqIGBSLnJlZHVjZWRgIHRvIHNob3J0Y3V0IHRoZSBpdGVyYXRpb24uXG4gKlxuICogTm90ZTogYFIucmVkdWNlYCBkb2VzIG5vdCBza2lwIGRlbGV0ZWQgb3IgdW5hc3NpZ25lZCBpbmRpY2VzIChzcGFyc2VcbiAqIGFycmF5cyksIHVubGlrZSB0aGUgbmF0aXZlIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2QuIEZvciBtb3JlIGRldGFpbHNcbiAqIG9uIHRoaXMgYmVoYXZpb3IsIHNlZTpcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3JlZHVjZSNEZXNjcmlwdGlvblxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGByZWR1Y2VgIG1ldGhvZCBvZiB0aGUgdGhpcmQgYXJndW1lbnQsIGlmIHByZXNlbnQuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyAoKGEsIGIpIC0+IGEpIC0+IGEgLT4gW2JdIC0+IGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBpdGVyYXRvciBmdW5jdGlvbi4gUmVjZWl2ZXMgdHdvIHZhbHVlcywgdGhlIGFjY3VtdWxhdG9yIGFuZCB0aGVcbiAqICAgICAgICBjdXJyZW50IGVsZW1lbnQgZnJvbSB0aGUgYXJyYXkuXG4gKiBAcGFyYW0geyp9IGFjYyBUaGUgYWNjdW11bGF0b3IgdmFsdWUuXG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEByZXR1cm4geyp9IFRoZSBmaW5hbCwgYWNjdW11bGF0ZWQgdmFsdWUuXG4gKiBAc2VlIFIucmVkdWNlZCwgUi5hZGRJbmRleFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBudW1iZXJzID0gWzEsIDIsIDNdO1xuICogICAgICB2YXIgcGx1cyA9IChhLCBiKSA9PiBhICsgYjtcbiAqXG4gKiAgICAgIFIucmVkdWNlKHBsdXMsIDEwLCBudW1iZXJzKTsgLy89PiAxNlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTMoX3JlZHVjZSk7XG4iLCJ2YXIgX2NoZWNrRm9yTWV0aG9kID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY2hlY2tGb3JNZXRob2QnKTtcbnZhciBzbGljZSA9IHJlcXVpcmUoJy4vc2xpY2UnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYWxsIGJ1dCB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgZ2l2ZW4gbGlzdCBvciBzdHJpbmcgKG9yIG9iamVjdFxuICogd2l0aCBhIGB0YWlsYCBtZXRob2QpLlxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGBzbGljZWAgbWV0aG9kIG9mIHRoZSBmaXJzdCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIFthXSAtPiBbYV1cbiAqIEBzaWcgU3RyaW5nIC0+IFN0cmluZ1xuICogQHBhcmFtIHsqfSBsaXN0XG4gKiBAcmV0dXJuIHsqfVxuICogQHNlZSBSLmhlYWQsIFIuaW5pdCwgUi5sYXN0XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi50YWlsKFsxLCAyLCAzXSk7ICAvLz0+IFsyLCAzXVxuICogICAgICBSLnRhaWwoWzEsIDJdKTsgICAgIC8vPT4gWzJdXG4gKiAgICAgIFIudGFpbChbMV0pOyAgICAgICAgLy89PiBbXVxuICogICAgICBSLnRhaWwoW10pOyAgICAgICAgIC8vPT4gW11cbiAqXG4gKiAgICAgIFIudGFpbCgnYWJjJyk7ICAvLz0+ICdiYydcbiAqICAgICAgUi50YWlsKCdhYicpOyAgIC8vPT4gJ2InXG4gKiAgICAgIFIudGFpbCgnYScpOyAgICAvLz0+ICcnXG4gKiAgICAgIFIudGFpbCgnJyk7ICAgICAvLz0+ICcnXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2NoZWNrRm9yTWV0aG9kKCd0YWlsJywgc2xpY2UoMSwgSW5maW5pdHkpKTtcbiIsInZhciBfYXJpdHkgPSByZXF1aXJlKCcuL2ludGVybmFsL19hcml0eScpO1xudmFyIF9waXBlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fcGlwZScpO1xudmFyIHJlZHVjZSA9IHJlcXVpcmUoJy4vcmVkdWNlJyk7XG52YXIgdGFpbCA9IHJlcXVpcmUoJy4vdGFpbCcpO1xuXG5cbi8qKlxuICogUGVyZm9ybXMgbGVmdC10by1yaWdodCBmdW5jdGlvbiBjb21wb3NpdGlvbi4gVGhlIGxlZnRtb3N0IGZ1bmN0aW9uIG1heSBoYXZlXG4gKiBhbnkgYXJpdHk7IHRoZSByZW1haW5pbmcgZnVuY3Rpb25zIG11c3QgYmUgdW5hcnkuXG4gKlxuICogSW4gc29tZSBsaWJyYXJpZXMgdGhpcyBmdW5jdGlvbiBpcyBuYW1lZCBgc2VxdWVuY2VgLlxuICpcbiAqICoqTm90ZToqKiBUaGUgcmVzdWx0IG9mIHBpcGUgaXMgbm90IGF1dG9tYXRpY2FsbHkgY3VycmllZC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyAoKChhLCBiLCAuLi4sIG4pIC0+IG8pLCAobyAtPiBwKSwgLi4uLCAoeCAtPiB5KSwgKHkgLT4geikpIC0+ICgoYSwgYiwgLi4uLCBuKSAtPiB6KVxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3Rpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBzZWUgUi5jb21wb3NlXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIGYgPSBSLnBpcGUoTWF0aC5wb3csIFIubmVnYXRlLCBSLmluYyk7XG4gKlxuICogICAgICBmKDMsIDQpOyAvLyAtKDNeNCkgKyAxXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGlwZSgpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3BpcGUgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIGFyZ3VtZW50Jyk7XG4gIH1cbiAgcmV0dXJuIF9hcml0eShhcmd1bWVudHNbMF0ubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHJlZHVjZShfcGlwZSwgYXJndW1lbnRzWzBdLCB0YWlsKGFyZ3VtZW50cykpKTtcbn07XG4iLCIvKipcbiAqIFByaXZhdGUgYGNvbmNhdGAgZnVuY3Rpb24gdG8gbWVyZ2UgdHdvIGFycmF5LWxpa2Ugb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxBcmd1bWVudHN9IFtzZXQxPVtdXSBBbiBhcnJheS1saWtlIG9iamVjdC5cbiAqIEBwYXJhbSB7QXJyYXl8QXJndW1lbnRzfSBbc2V0Mj1bXV0gQW4gYXJyYXktbGlrZSBvYmplY3QuXG4gKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcsIG1lcmdlZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBfY29uY2F0KFs0LCA1LCA2XSwgWzEsIDIsIDNdKTsgLy89PiBbNCwgNSwgNiwgMSwgMiwgM11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY29uY2F0KHNldDEsIHNldDIpIHtcbiAgc2V0MSA9IHNldDEgfHwgW107XG4gIHNldDIgPSBzZXQyIHx8IFtdO1xuICB2YXIgaWR4O1xuICB2YXIgbGVuMSA9IHNldDEubGVuZ3RoO1xuICB2YXIgbGVuMiA9IHNldDIubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgaWR4ID0gMDtcbiAgd2hpbGUgKGlkeCA8IGxlbjEpIHtcbiAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBzZXQxW2lkeF07XG4gICAgaWR4ICs9IDE7XG4gIH1cbiAgaWR4ID0gMDtcbiAgd2hpbGUgKGlkeCA8IGxlbjIpIHtcbiAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBzZXQyW2lkeF07XG4gICAgaWR4ICs9IDE7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgX2NvbmNhdCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2NvbmNhdCcpO1xudmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBuZXcgbGlzdCB3aXRoIHRoZSBnaXZlbiBlbGVtZW50IGF0IHRoZSBmcm9udCwgZm9sbG93ZWQgYnkgdGhlXG4gKiBjb250ZW50cyBvZiB0aGUgbGlzdC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIGEgLT4gW2FdIC0+IFthXVxuICogQHBhcmFtIHsqfSBlbCBUaGUgaXRlbSB0byBhZGQgdG8gdGhlIGhlYWQgb2YgdGhlIG91dHB1dCBsaXN0LlxuICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gYWRkIHRvIHRoZSB0YWlsIG9mIHRoZSBvdXRwdXQgbGlzdC5cbiAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBhcnJheS5cbiAqIEBzZWUgUi5hcHBlbmRcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnByZXBlbmQoJ2ZlZScsIFsnZmknLCAnZm8nLCAnZnVtJ10pOyAvLz0+IFsnZmVlJywgJ2ZpJywgJ2ZvJywgJ2Z1bSddXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBwcmVwZW5kKGVsLCBsaXN0KSB7XG4gIHJldHVybiBfY29uY2F0KFtlbF0sIGxpc3QpO1xufSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2hlbiBzdXBwbGllZCBhbiBvYmplY3QgcmV0dXJucyB0aGUgaW5kaWNhdGVkXG4gKiBwcm9wZXJ0eSBvZiB0aGF0IG9iamVjdCwgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHNpZyBzIC0+IHtzOiBhfSAtPiBhIHwgVW5kZWZpbmVkXG4gKiBAcGFyYW0ge1N0cmluZ30gcCBUaGUgcHJvcGVydHkgbmFtZVxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHF1ZXJ5XG4gKiBAcmV0dXJuIHsqfSBUaGUgdmFsdWUgYXQgYG9iai5wYC5cbiAqIEBzZWUgUi5wYXRoXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5wcm9wKCd4Jywge3g6IDEwMH0pOyAvLz0+IDEwMFxuICogICAgICBSLnByb3AoJ3gnLCB7fSk7IC8vPT4gdW5kZWZpbmVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBwcm9wKHAsIG9iaikgeyByZXR1cm4gb2JqW3BdOyB9KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2lzVHJhbnNmb3JtZXIob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqWydAQHRyYW5zZHVjZXIvc3RlcCddID09PSAnZnVuY3Rpb24nO1xufTtcbiIsInZhciBfaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzQXJyYXknKTtcbnZhciBfaXNUcmFuc2Zvcm1lciA9IHJlcXVpcmUoJy4vX2lzVHJhbnNmb3JtZXInKTtcbnZhciBfc2xpY2UgPSByZXF1aXJlKCcuL19zbGljZScpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgZGlzcGF0Y2hlcyB3aXRoIGRpZmZlcmVudCBzdHJhdGVnaWVzIGJhc2VkIG9uIHRoZVxuICogb2JqZWN0IGluIGxpc3QgcG9zaXRpb24gKGxhc3QgYXJndW1lbnQpLiBJZiBpdCBpcyBhbiBhcnJheSwgZXhlY3V0ZXMgW2ZuXS5cbiAqIE90aGVyd2lzZSwgaWYgaXQgaGFzIGEgZnVuY3Rpb24gd2l0aCBbbWV0aG9kbmFtZV0sIGl0IHdpbGwgZXhlY3V0ZSB0aGF0XG4gKiBmdW5jdGlvbiAoZnVuY3RvciBjYXNlKS4gT3RoZXJ3aXNlLCBpZiBpdCBpcyBhIHRyYW5zZm9ybWVyLCB1c2VzIHRyYW5zZHVjZXJcbiAqIFt4Zl0gdG8gcmV0dXJuIGEgbmV3IHRyYW5zZm9ybWVyICh0cmFuc2R1Y2VyIGNhc2UpLiBPdGhlcndpc2UsIGl0IHdpbGxcbiAqIGRlZmF1bHQgdG8gZXhlY3V0aW5nIFtmbl0uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RuYW1lIHByb3BlcnR5IHRvIGNoZWNrIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0geGYgdHJhbnNkdWNlciB0byBpbml0aWFsaXplIGlmIG9iamVjdCBpcyB0cmFuc2Zvcm1lclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gZGVmYXVsdCByYW1kYSBpbXBsZW1lbnRhdGlvblxuICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCBkaXNwYXRjaGVzIG9uIG9iamVjdCBpbiBsaXN0IHBvc2l0aW9uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2Rpc3BhdGNoYWJsZShtZXRob2RuYW1lLCB4ZiwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmbigpO1xuICAgIH1cbiAgICB2YXIgb2JqID0gYXJndW1lbnRzW2xlbmd0aCAtIDFdO1xuICAgIGlmICghX2lzQXJyYXkob2JqKSkge1xuICAgICAgdmFyIGFyZ3MgPSBfc2xpY2UoYXJndW1lbnRzLCAwLCBsZW5ndGggLSAxKTtcbiAgICAgIGlmICh0eXBlb2Ygb2JqW21ldGhvZG5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBvYmpbbWV0aG9kbmFtZV0uYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIGlmIChfaXNUcmFuc2Zvcm1lcihvYmopKSB7XG4gICAgICAgIHZhciB0cmFuc2R1Y2VyID0geGYuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgIHJldHVybiB0cmFuc2R1Y2VyKG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX21hcChmbiwgZnVuY3Rvcikge1xuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGZ1bmN0b3IubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuKTtcbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIHJlc3VsdFtpZHhdID0gZm4oZnVuY3RvcltpZHhdKTtcbiAgICBpZHggKz0gMTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL2luaXQnXSgpO1xuICB9LFxuICByZXN1bHQ6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ocmVzdWx0KTtcbiAgfVxufTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9fY3VycnkyJyk7XG52YXIgX3hmQmFzZSA9IHJlcXVpcmUoJy4vX3hmQmFzZScpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBYTWFwKGYsIHhmKSB7XG4gICAgdGhpcy54ZiA9IHhmO1xuICAgIHRoaXMuZiA9IGY7XG4gIH1cbiAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBfeGZCYXNlLmluaXQ7XG4gIFhNYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBfeGZCYXNlLnJlc3VsdDtcbiAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbihyZXN1bHQsIGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCB0aGlzLmYoaW5wdXQpKTtcbiAgfTtcblxuICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeG1hcChmLCB4ZikgeyByZXR1cm4gbmV3IFhNYXAoZiwgeGYpOyB9KTtcbn0oKSk7XG4iLCJ2YXIgX2FyaXR5ID0gcmVxdWlyZSgnLi9fYXJpdHknKTtcbnZhciBfaXNQbGFjZWhvbGRlciA9IHJlcXVpcmUoJy4vX2lzUGxhY2Vob2xkZXInKTtcblxuXG4vKipcbiAqIEludGVybmFsIGN1cnJ5TiBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIFRoZSBhcml0eSBvZiB0aGUgY3VycmllZCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7QXJyYXl9IHJlY2VpdmVkIEFuIGFycmF5IG9mIGFyZ3VtZW50cyByZWNlaXZlZCB0aHVzIGZhci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY3VycnlOKGxlbmd0aCwgcmVjZWl2ZWQsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29tYmluZWQgPSBbXTtcbiAgICB2YXIgYXJnc0lkeCA9IDA7XG4gICAgdmFyIGxlZnQgPSBsZW5ndGg7XG4gICAgdmFyIGNvbWJpbmVkSWR4ID0gMDtcbiAgICB3aGlsZSAoY29tYmluZWRJZHggPCByZWNlaXZlZC5sZW5ndGggfHwgYXJnc0lkeCA8IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAoY29tYmluZWRJZHggPCByZWNlaXZlZC5sZW5ndGggJiZcbiAgICAgICAgICAoIV9pc1BsYWNlaG9sZGVyKHJlY2VpdmVkW2NvbWJpbmVkSWR4XSkgfHxcbiAgICAgICAgICAgYXJnc0lkeCA+PSBhcmd1bWVudHMubGVuZ3RoKSkge1xuICAgICAgICByZXN1bHQgPSByZWNlaXZlZFtjb21iaW5lZElkeF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBhcmd1bWVudHNbYXJnc0lkeF07XG4gICAgICAgIGFyZ3NJZHggKz0gMTtcbiAgICAgIH1cbiAgICAgIGNvbWJpbmVkW2NvbWJpbmVkSWR4XSA9IHJlc3VsdDtcbiAgICAgIGlmICghX2lzUGxhY2Vob2xkZXIocmVzdWx0KSkge1xuICAgICAgICBsZWZ0IC09IDE7XG4gICAgICB9XG4gICAgICBjb21iaW5lZElkeCArPSAxO1xuICAgIH1cbiAgICByZXR1cm4gbGVmdCA8PSAwID8gZm4uYXBwbHkodGhpcywgY29tYmluZWQpXG4gICAgICAgICAgICAgICAgICAgICA6IF9hcml0eShsZWZ0LCBfY3VycnlOKGxlbmd0aCwgY29tYmluZWQsIGZuKSk7XG4gIH07XG59O1xuIiwidmFyIF9hcml0eSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2FyaXR5Jyk7XG52YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MScpO1xudmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfY3VycnlOID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnlOJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgY3VycmllZCBlcXVpdmFsZW50IG9mIHRoZSBwcm92aWRlZCBmdW5jdGlvbiwgd2l0aCB0aGUgc3BlY2lmaWVkXG4gKiBhcml0eS4gVGhlIGN1cnJpZWQgZnVuY3Rpb24gaGFzIHR3byB1bnVzdWFsIGNhcGFiaWxpdGllcy4gRmlyc3QsIGl0c1xuICogYXJndW1lbnRzIG5lZWRuJ3QgYmUgcHJvdmlkZWQgb25lIGF0IGEgdGltZS4gSWYgYGdgIGlzIGBSLmN1cnJ5TigzLCBmKWAsIHRoZVxuICogZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICpcbiAqICAgLSBgZygxKSgyKSgzKWBcbiAqICAgLSBgZygxKSgyLCAzKWBcbiAqICAgLSBgZygxLCAyKSgzKWBcbiAqICAgLSBgZygxLCAyLCAzKWBcbiAqXG4gKiBTZWNvbmRseSwgdGhlIHNwZWNpYWwgcGxhY2Vob2xkZXIgdmFsdWUgYFIuX19gIG1heSBiZSB1c2VkIHRvIHNwZWNpZnlcbiAqIFwiZ2Fwc1wiLCBhbGxvd2luZyBwYXJ0aWFsIGFwcGxpY2F0aW9uIG9mIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMsXG4gKiByZWdhcmRsZXNzIG9mIHRoZWlyIHBvc2l0aW9ucy4gSWYgYGdgIGlzIGFzIGFib3ZlIGFuZCBgX2AgaXMgYFIuX19gLCB0aGVcbiAqIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAqXG4gKiAgIC0gYGcoMSwgMiwgMylgXG4gKiAgIC0gYGcoXywgMiwgMykoMSlgXG4gKiAgIC0gYGcoXywgXywgMykoMSkoMilgXG4gKiAgIC0gYGcoXywgXywgMykoMSwgMilgXG4gKiAgIC0gYGcoXywgMikoMSkoMylgXG4gKiAgIC0gYGcoXywgMikoMSwgMylgXG4gKiAgIC0gYGcoXywgMikoXywgMykoMSlgXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuNS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgTnVtYmVyIC0+ICgqIC0+IGEpIC0+ICgqIC0+IGEpXG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIFRoZSBhcml0eSBmb3IgdGhlIHJldHVybmVkIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3LCBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHNlZSBSLmN1cnJ5XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIHN1bUFyZ3MgPSAoLi4uYXJncykgPT4gUi5zdW0oYXJncyk7XG4gKlxuICogICAgICB2YXIgY3VycmllZEFkZEZvdXJOdW1iZXJzID0gUi5jdXJyeU4oNCwgc3VtQXJncyk7XG4gKiAgICAgIHZhciBmID0gY3VycmllZEFkZEZvdXJOdW1iZXJzKDEsIDIpO1xuICogICAgICB2YXIgZyA9IGYoMyk7XG4gKiAgICAgIGcoNCk7IC8vPT4gMTBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGN1cnJ5TihsZW5ndGgsIGZuKSB7XG4gIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gX2N1cnJ5MShmbik7XG4gIH1cbiAgcmV0dXJuIF9hcml0eShsZW5ndGgsIF9jdXJyeU4obGVuZ3RoLCBbXSwgZm4pKTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfaGFzKHByb3AsIG9iaikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59O1xuIiwidmFyIF9oYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJndW1lbnRzKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXScgP1xuICAgIGZ1bmN0aW9uIF9pc0FyZ3VtZW50cyh4KSB7IHJldHVybiB0b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcmd1bWVudHNdJzsgfSA6XG4gICAgZnVuY3Rpb24gX2lzQXJndW1lbnRzKHgpIHsgcmV0dXJuIF9oYXMoJ2NhbGxlZScsIHgpOyB9O1xufSgpKTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG52YXIgX2hhcyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2hhcycpO1xudmFyIF9pc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2lzQXJndW1lbnRzJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgbGlzdCBjb250YWluaW5nIHRoZSBuYW1lcyBvZiBhbGwgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgb2ZcbiAqIHRoZSBzdXBwbGllZCBvYmplY3QuXG4gKiBOb3RlIHRoYXQgdGhlIG9yZGVyIG9mIHRoZSBvdXRwdXQgYXJyYXkgaXMgbm90IGd1YXJhbnRlZWQgdG8gYmUgY29uc2lzdGVudFxuICogYWNyb3NzIGRpZmZlcmVudCBKUyBwbGF0Zm9ybXMuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAc2lnIHtrOiB2fSAtPiBba11cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBleHRyYWN0IHByb3BlcnRpZXMgZnJvbVxuICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIHRoZSBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmtleXMoe2E6IDEsIGI6IDIsIGM6IDN9KTsgLy89PiBbJ2EnLCAnYicsICdjJ11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIC8vIGNvdmVyIElFIDwgOSBrZXlzIGlzc3Vlc1xuICB2YXIgaGFzRW51bUJ1ZyA9ICEoe3RvU3RyaW5nOiBudWxsfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG4gIHZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbJ2NvbnN0cnVjdG9yJywgJ3ZhbHVlT2YnLCAnaXNQcm90b3R5cGVPZicsICd0b1N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2hhc093blByb3BlcnR5JywgJ3RvTG9jYWxlU3RyaW5nJ107XG4gIC8vIFNhZmFyaSBidWdcbiAgdmFyIGhhc0FyZ3NFbnVtQnVnID0gKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICByZXR1cm4gYXJndW1lbnRzLnByb3BlcnR5SXNFbnVtZXJhYmxlKCdsZW5ndGgnKTtcbiAgfSgpKTtcblxuICB2YXIgY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyhsaXN0LCBpdGVtKSB7XG4gICAgdmFyIGlkeCA9IDA7XG4gICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICBpZiAobGlzdFtpZHhdID09PSBpdGVtKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWR4ICs9IDE7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZXR1cm4gdHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nICYmICFoYXNBcmdzRW51bUJ1ZyA/XG4gICAgX2N1cnJ5MShmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdChvYmopICE9PSBvYmogPyBbXSA6IE9iamVjdC5rZXlzKG9iaik7XG4gICAgfSkgOlxuICAgIF9jdXJyeTEoZnVuY3Rpb24ga2V5cyhvYmopIHtcbiAgICAgIGlmIChPYmplY3Qob2JqKSAhPT0gb2JqKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wLCBuSWR4O1xuICAgICAgdmFyIGtzID0gW107XG4gICAgICB2YXIgY2hlY2tBcmdzTGVuZ3RoID0gaGFzQXJnc0VudW1CdWcgJiYgX2lzQXJndW1lbnRzKG9iaik7XG4gICAgICBmb3IgKHByb3AgaW4gb2JqKSB7XG4gICAgICAgIGlmIChfaGFzKHByb3AsIG9iaikgJiYgKCFjaGVja0FyZ3NMZW5ndGggfHwgcHJvcCAhPT0gJ2xlbmd0aCcpKSB7XG4gICAgICAgICAga3Nba3MubGVuZ3RoXSA9IHByb3A7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChoYXNFbnVtQnVnKSB7XG4gICAgICAgIG5JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoIC0gMTtcbiAgICAgICAgd2hpbGUgKG5JZHggPj0gMCkge1xuICAgICAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbklkeF07XG4gICAgICAgICAgaWYgKF9oYXMocHJvcCwgb2JqKSAmJiAhY29udGFpbnMoa3MsIHByb3ApKSB7XG4gICAgICAgICAgICBrc1trcy5sZW5ndGhdID0gcHJvcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbklkeCAtPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4ga3M7XG4gICAgfSk7XG59KCkpO1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfZGlzcGF0Y2hhYmxlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fZGlzcGF0Y2hhYmxlJyk7XG52YXIgX21hcCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX21hcCcpO1xudmFyIF9yZWR1Y2UgPSByZXF1aXJlKCcuL2ludGVybmFsL19yZWR1Y2UnKTtcbnZhciBfeG1hcCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX3htYXAnKTtcbnZhciBjdXJyeU4gPSByZXF1aXJlKCcuL2N1cnJ5TicpO1xudmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuXG4vKipcbiAqIFRha2VzIGEgZnVuY3Rpb24gYW5kXG4gKiBhIFtmdW5jdG9yXShodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWxhbmQvZmFudGFzeS1sYW5kI2Z1bmN0b3IpLFxuICogYXBwbGllcyB0aGUgZnVuY3Rpb24gdG8gZWFjaCBvZiB0aGUgZnVuY3RvcidzIHZhbHVlcywgYW5kIHJldHVybnNcbiAqIGEgZnVuY3RvciBvZiB0aGUgc2FtZSBzaGFwZS5cbiAqXG4gKiBSYW1kYSBwcm92aWRlcyBzdWl0YWJsZSBgbWFwYCBpbXBsZW1lbnRhdGlvbnMgZm9yIGBBcnJheWAgYW5kIGBPYmplY3RgLFxuICogc28gdGhpcyBmdW5jdGlvbiBtYXkgYmUgYXBwbGllZCB0byBgWzEsIDIsIDNdYCBvciBge3g6IDEsIHk6IDIsIHo6IDN9YC5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgbWFwYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gKlxuICogQWxzbyB0cmVhdHMgZnVuY3Rpb25zIGFzIGZ1bmN0b3JzIGFuZCB3aWxsIGNvbXBvc2UgdGhlbSB0b2dldGhlci5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIEZ1bmN0b3IgZiA9PiAoYSAtPiBiKSAtPiBmIGEgLT4gZiBiXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGV2ZXJ5IGVsZW1lbnQgb2YgdGhlIGlucHV0IGBsaXN0YC5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gYmUgaXRlcmF0ZWQgb3Zlci5cbiAqIEByZXR1cm4ge0FycmF5fSBUaGUgbmV3IGxpc3QuXG4gKiBAc2VlIFIudHJhbnNkdWNlLCBSLmFkZEluZGV4XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIGRvdWJsZSA9IHggPT4geCAqIDI7XG4gKlxuICogICAgICBSLm1hcChkb3VibGUsIFsxLCAyLCAzXSk7IC8vPT4gWzIsIDQsIDZdXG4gKlxuICogICAgICBSLm1hcChkb3VibGUsIHt4OiAxLCB5OiAyLCB6OiAzfSk7IC8vPT4ge3g6IDIsIHk6IDQsIHo6IDZ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdtYXAnLCBfeG1hcCwgZnVuY3Rpb24gbWFwKGZuLCBmdW5jdG9yKSB7XG4gIHN3aXRjaCAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0b3IpKSB7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOlxuICAgICAgcmV0dXJuIGN1cnJ5TihmdW5jdG9yLmxlbmd0aCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGZ1bmN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgICB9KTtcbiAgICBjYXNlICdbb2JqZWN0IE9iamVjdF0nOlxuICAgICAgcmV0dXJuIF9yZWR1Y2UoZnVuY3Rpb24oYWNjLCBrZXkpIHtcbiAgICAgICAgYWNjW2tleV0gPSBmbihmdW5jdG9yW2tleV0pO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30sIGtleXMoZnVuY3RvcikpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gX21hcChmbiwgZnVuY3Rvcik7XG4gIH1cbn0pKTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG52YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBsZW5zIGZvciB0aGUgZ2l2ZW4gZ2V0dGVyIGFuZCBzZXR0ZXIgZnVuY3Rpb25zLiBUaGUgZ2V0dGVyIFwiZ2V0c1wiXG4gKiB0aGUgdmFsdWUgb2YgdGhlIGZvY3VzOyB0aGUgc2V0dGVyIFwic2V0c1wiIHRoZSB2YWx1ZSBvZiB0aGUgZm9jdXMuIFRoZSBzZXR0ZXJcbiAqIHNob3VsZCBub3QgbXV0YXRlIHRoZSBkYXRhIHN0cnVjdHVyZS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC44LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBMZW5zIHMgYSA9IEZ1bmN0b3IgZiA9PiAoYSAtPiBmIGEpIC0+IHMgLT4gZiBzXG4gKiBAc2lnIChzIC0+IGEpIC0+ICgoYSwgcykgLT4gcykgLT4gTGVucyBzIGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGdldHRlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gc2V0dGVyXG4gKiBAcmV0dXJuIHtMZW5zfVxuICogQHNlZSBSLnZpZXcsIFIuc2V0LCBSLm92ZXIsIFIubGVuc0luZGV4LCBSLmxlbnNQcm9wXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIHhMZW5zID0gUi5sZW5zKFIucHJvcCgneCcpLCBSLmFzc29jKCd4JykpO1xuICpcbiAqICAgICAgUi52aWV3KHhMZW5zLCB7eDogMSwgeTogMn0pOyAgICAgICAgICAgIC8vPT4gMVxuICogICAgICBSLnNldCh4TGVucywgNCwge3g6IDEsIHk6IDJ9KTsgICAgICAgICAgLy89PiB7eDogNCwgeTogMn1cbiAqICAgICAgUi5vdmVyKHhMZW5zLCBSLm5lZ2F0ZSwge3g6IDEsIHk6IDJ9KTsgIC8vPT4ge3g6IC0xLCB5OiAyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gbGVucyhnZXR0ZXIsIHNldHRlcikge1xuICByZXR1cm4gZnVuY3Rpb24odG9GdW5jdG9yRm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICByZXR1cm4gbWFwKFxuICAgICAgICBmdW5jdGlvbihmb2N1cykge1xuICAgICAgICAgIHJldHVybiBzZXR0ZXIoZm9jdXMsIHRhcmdldCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRvRnVuY3RvckZuKGdldHRlcih0YXJnZXQpKVxuICAgICAgKTtcbiAgICB9O1xuICB9O1xufSk7XG4iLCJ2YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MScpO1xudmFyIGN1cnJ5TiA9IHJlcXVpcmUoJy4vY3VycnlOJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgY3VycmllZCBlcXVpdmFsZW50IG9mIHRoZSBwcm92aWRlZCBmdW5jdGlvbi4gVGhlIGN1cnJpZWQgZnVuY3Rpb25cbiAqIGhhcyB0d28gdW51c3VhbCBjYXBhYmlsaXRpZXMuIEZpcnN0LCBpdHMgYXJndW1lbnRzIG5lZWRuJ3QgYmUgcHJvdmlkZWQgb25lXG4gKiBhdCBhIHRpbWUuIElmIGBmYCBpcyBhIHRlcm5hcnkgZnVuY3Rpb24gYW5kIGBnYCBpcyBgUi5jdXJyeShmKWAsIHRoZVxuICogZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICpcbiAqICAgLSBgZygxKSgyKSgzKWBcbiAqICAgLSBgZygxKSgyLCAzKWBcbiAqICAgLSBgZygxLCAyKSgzKWBcbiAqICAgLSBgZygxLCAyLCAzKWBcbiAqXG4gKiBTZWNvbmRseSwgdGhlIHNwZWNpYWwgcGxhY2Vob2xkZXIgdmFsdWUgYFIuX19gIG1heSBiZSB1c2VkIHRvIHNwZWNpZnlcbiAqIFwiZ2Fwc1wiLCBhbGxvd2luZyBwYXJ0aWFsIGFwcGxpY2F0aW9uIG9mIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMsXG4gKiByZWdhcmRsZXNzIG9mIHRoZWlyIHBvc2l0aW9ucy4gSWYgYGdgIGlzIGFzIGFib3ZlIGFuZCBgX2AgaXMgYFIuX19gLCB0aGVcbiAqIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAqXG4gKiAgIC0gYGcoMSwgMiwgMylgXG4gKiAgIC0gYGcoXywgMiwgMykoMSlgXG4gKiAgIC0gYGcoXywgXywgMykoMSkoMilgXG4gKiAgIC0gYGcoXywgXywgMykoMSwgMilgXG4gKiAgIC0gYGcoXywgMikoMSkoMylgXG4gKiAgIC0gYGcoXywgMikoMSwgMylgXG4gKiAgIC0gYGcoXywgMikoXywgMykoMSlgXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgKCogLT4gYSkgLT4gKCogLT4gYSlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldywgY3VycmllZCBmdW5jdGlvbi5cbiAqIEBzZWUgUi5jdXJyeU5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgYWRkRm91ck51bWJlcnMgPSAoYSwgYiwgYywgZCkgPT4gYSArIGIgKyBjICsgZDtcbiAqXG4gKiAgICAgIHZhciBjdXJyaWVkQWRkRm91ck51bWJlcnMgPSBSLmN1cnJ5KGFkZEZvdXJOdW1iZXJzKTtcbiAqICAgICAgdmFyIGYgPSBjdXJyaWVkQWRkRm91ck51bWJlcnMoMSwgMik7XG4gKiAgICAgIHZhciBnID0gZigzKTtcbiAqICAgICAgZyg0KTsgLy89PiAxMFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTEoZnVuY3Rpb24gY3VycnkoZm4pIHtcbiAgcmV0dXJuIGN1cnJ5Tihmbi5sZW5ndGgsIGZuKTtcbn0pO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gXCJzZWFtbGVzcy1pbW11dGFibGVcIjtcbmltcG9ydCB7IGN1cnJ5LCBsZW5zLCBwcm9wLCBwcmVwZW5kLCBvdmVyLCBzZXQsIHBpcGUgfSBmcm9tIFwicmFtZGFcIjtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUF0ID0gY3VycnkoKGtleUFycmF5LCBuZXdWYWwsIG9iaikgPT4ge1xuICBjb25zdCBkZWVwTmV3VmFsID0ga2V5QXJyYXkucmVkdWNlUmlnaHQoXG4gICAgKHJlc3VsdCwga2V5KSA9PiAoeyBba2V5XTogcmVzdWx0IH0pXG4gICAgLCBuZXdWYWxcbiAgKTtcblxuICByZXR1cm4gSW1tdXRhYmxlKG9iaikubWVyZ2UoZGVlcE5ld1ZhbCwgeyBkZWVwOiB0cnVlIH0pO1xufSk7XG5cbi8vIFN0YXRlIGxlbnNlc1xuZXhwb3J0IGNvbnN0IFN0YXRlTGVuc2VzID0ge1xuICBmaWVsZFR5cGVzOiBsZW5zKHByb3AoXCJmaWVsZFR5cGVzXCIpLCB1cGRhdGVBdChbXCJmaWVsZFR5cGVzXCJdKSksXG4gIGZpZWxkc1N0YXRlOiBsZW5zKHByb3AoXCJmaWVsZHNTdGF0ZVwiKSwgdXBkYXRlQXQoW1wiZmllbGRzU3RhdGVcIl0pKSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBsZW5zKHByb3AoXCJmaWVsZHNTdGF0ZUhpc3RvcnlcIiksIHVwZGF0ZUF0KFtcImZpZWxkc1N0YXRlSGlzdG9yeVwiXSkpLFxufTtcblxuLy8gXyA9PiBTdHJpbmdcbmV4cG9ydCBjb25zdCBjcmVhdGVJZCA9IF8gPT5cbiAgRGF0ZS5ub3coKS50b1N0cmluZygpO1xuXG4vLyBTdGF0ZSAtPiBbZmllbGRzU3RhdGVdIC0+IFN0YXRlXG5leHBvcnQgY29uc3QgcHVzaEhpc3RvcnlTdGF0ZSA9IGN1cnJ5KChzdGF0ZSwgbmV3SGlzdG9yeVN0YXRlKSA9PiBwaXBlKFxuICAvLyBBZGQgY3VycmVudCBzdGF0ZSB0byBoaXN0b3J5XG4gIG92ZXIoU3RhdGVMZW5zZXMuZmllbGRzU3RhdGVIaXN0b3J5LCBwcmVwZW5kKHN0YXRlLmZpZWxkc1N0YXRlKSksXG4gIC8vIE1ha2UgbmV3IFN0YXRlIHRoZSBjdXJyZW50XG4gIHNldChTdGF0ZUxlbnNlcy5maWVsZHNTdGF0ZSwgbmV3SGlzdG9yeVN0YXRlKVxuKShzdGF0ZSkpO1xuXG5cbi8vIFN0YXRlIC0+IFN0YXRlXG5leHBvcnQgY29uc3QgaGlkZUNvbmZpZ3MgPSBzdGF0ZSA9PlxuICBzZXQoXG4gICAgU3RhdGVMZW5zZXMuZmllbGRzU3RhdGUsXG4gICAgc3RhdGUuZmllbGRzU3RhdGUubWFwKHMgPT4gT2JqZWN0LmFzc2lnbih7fSwgcywgeyBjb25maWdTaG93aW5nOiBmYWxzZSB9KSksXG4gICAgc3RhdGVcbiAgKTtcbiIsImltcG9ydCB7IFN0YXRlTGVuc2VzIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IHNldCwgb3Zlciwgc2xpY2UsIHBpcGUgfSBmcm9tIFwicmFtZGFcIjtcblxuY29uc3QgbGFzdEhpc3RvcnlTdGF0ZSA9IHN0YXRlID0+XG4gIHN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeVswXSB8fCBbXTtcblxuY29uc3QgdW5kbyA9IChzdGF0ZSwgXykgPT4gcGlwZShcbiAgLy8gTWFrZSBsYXN0IGhpc3RvcnkgbGFzdCBzdGF0ZSB0aGUgY3VycmVudCBvbmVcbiAgc2V0KFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlLCBsYXN0SGlzdG9yeVN0YXRlKHN0YXRlKSksXG4gIC8vIFJlbW92ZSBsYXN0IGhpc3Rvcnkgc3RhdGUgZnJvbSB0aGUgaGlzdG9yeSBhcnJheVxuICBvdmVyKFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlSGlzdG9yeSwgc2xpY2UoMSwgSW5maW5pdHkpKVxuKShzdGF0ZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHVuZG87XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9pZGVudGl0eSh4KSB7IHJldHVybiB4OyB9O1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTEnKTtcbnZhciBfaWRlbnRpdHkgPSByZXF1aXJlKCcuL2ludGVybmFsL19pZGVudGl0eScpO1xuXG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGRvZXMgbm90aGluZyBidXQgcmV0dXJuIHRoZSBwYXJhbWV0ZXIgc3VwcGxpZWQgdG8gaXQuIEdvb2RcbiAqIGFzIGEgZGVmYXVsdCBvciBwbGFjZWhvbGRlciBmdW5jdGlvbi5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyBhIC0+IGFcbiAqIEBwYXJhbSB7Kn0geCBUaGUgdmFsdWUgdG8gcmV0dXJuLlxuICogQHJldHVybiB7Kn0gVGhlIGlucHV0IHZhbHVlLCBgeGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5pZGVudGl0eSgxKTsgLy89PiAxXG4gKlxuICogICAgICB2YXIgb2JqID0ge307XG4gKiAgICAgIFIuaWRlbnRpdHkob2JqKSA9PT0gb2JqOyAvLz0+IHRydWVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkxKF9pZGVudGl0eSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xuXG5cbi8qKlxuICogUmV0cmlldmUgdGhlIHZhbHVlIGF0IGEgZ2l2ZW4gcGF0aC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4yLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcgW1N0cmluZ10gLT4ge2s6IHZ9IC0+IHYgfCBVbmRlZmluZWRcbiAqIEBwYXJhbSB7QXJyYXl9IHBhdGggVGhlIHBhdGggdG8gdXNlLlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHJldHJpZXZlIHRoZSBuZXN0ZWQgcHJvcGVydHkgZnJvbS5cbiAqIEByZXR1cm4geyp9IFRoZSBkYXRhIGF0IGBwYXRoYC5cbiAqIEBzZWUgUi5wcm9wXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5wYXRoKFsnYScsICdiJ10sIHthOiB7YjogMn19KTsgLy89PiAyXG4gKiAgICAgIFIucGF0aChbJ2EnLCAnYiddLCB7Yzoge2I6IDJ9fSk7IC8vPT4gdW5kZWZpbmVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBwYXRoKHBhdGhzLCBvYmopIHtcbiAgdmFyIHZhbCA9IG9iajtcbiAgdmFyIGlkeCA9IDA7XG4gIHdoaWxlIChpZHggPCBwYXRocy5sZW5ndGgpIHtcbiAgICBpZiAodmFsID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFsID0gdmFsW3BhdGhzW2lkeF1dO1xuICAgIGlkeCArPSAxO1xuICB9XG4gIHJldHVybiB2YWw7XG59KTtcbiIsInZhciBfY29uY2F0ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY29uY2F0Jyk7XG52YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIF9yZWR1Y2UgPSByZXF1aXJlKCcuL2ludGVybmFsL19yZWR1Y2UnKTtcbnZhciBtYXAgPSByZXF1aXJlKCcuL21hcCcpO1xuXG5cbi8qKlxuICogYXAgYXBwbGllcyBhIGxpc3Qgb2YgZnVuY3Rpb25zIHRvIGEgbGlzdCBvZiB2YWx1ZXMuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYGFwYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC4gQWxzb1xuICogdHJlYXRzIGN1cnJpZWQgZnVuY3Rpb25zIGFzIGFwcGxpY2F0aXZlcy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4zLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyBbYSAtPiBiXSAtPiBbYV0gLT4gW2JdXG4gKiBAc2lnIEFwcGx5IGYgPT4gZiAoYSAtPiBiKSAtPiBmIGEgLT4gZiBiXG4gKiBAcGFyYW0ge0FycmF5fSBmbnMgQW4gYXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcGFyYW0ge0FycmF5fSB2cyBBbiBhcnJheSBvZiB2YWx1ZXNcbiAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiByZXN1bHRzIG9mIGFwcGx5aW5nIGVhY2ggb2YgYGZuc2AgdG8gYWxsIG9mIGB2c2AgaW4gdHVybi5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmFwKFtSLm11bHRpcGx5KDIpLCBSLmFkZCgzKV0sIFsxLDIsM10pOyAvLz0+IFsyLCA0LCA2LCA0LCA1LCA2XVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gYXAoYXBwbGljYXRpdmUsIGZuKSB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIGFwcGxpY2F0aXZlLmFwID09PSAnZnVuY3Rpb24nID9cbiAgICAgIGFwcGxpY2F0aXZlLmFwKGZuKSA6XG4gICAgdHlwZW9mIGFwcGxpY2F0aXZlID09PSAnZnVuY3Rpb24nID9cbiAgICAgIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGFwcGxpY2F0aXZlKHgpKGZuKHgpKTsgfSA6XG4gICAgLy8gZWxzZVxuICAgICAgX3JlZHVjZShmdW5jdGlvbihhY2MsIGYpIHsgcmV0dXJuIF9jb25jYXQoYWNjLCBtYXAoZiwgZm4pKTsgfSwgW10sIGFwcGxpY2F0aXZlKVxuICApO1xufSk7XG4iLCJ2YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIHNpbmdsZSBpdGVtIGJ5IGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBsaXN0LCBzdWNjZXNzaXZlbHkgY2FsbGluZ1xuICogdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIGFuZCBwYXNzaW5nIGl0IGFuIGFjY3VtdWxhdG9yIHZhbHVlIGFuZCB0aGUgY3VycmVudFxuICogdmFsdWUgZnJvbSB0aGUgYXJyYXksIGFuZCB0aGVuIHBhc3NpbmcgdGhlIHJlc3VsdCB0byB0aGUgbmV4dCBjYWxsLlxuICpcbiAqIFNpbWlsYXIgdG8gYHJlZHVjZWAsIGV4Y2VwdCBtb3ZlcyB0aHJvdWdoIHRoZSBpbnB1dCBsaXN0IGZyb20gdGhlIHJpZ2h0IHRvXG4gKiB0aGUgbGVmdC5cbiAqXG4gKiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gcmVjZWl2ZXMgdHdvIHZhbHVlczogKihhY2MsIHZhbHVlKSpcbiAqXG4gKiBOb3RlOiBgUi5yZWR1Y2VSaWdodGAgZG9lcyBub3Qgc2tpcCBkZWxldGVkIG9yIHVuYXNzaWduZWQgaW5kaWNlcyAoc3BhcnNlXG4gKiBhcnJheXMpLCB1bmxpa2UgdGhlIG5hdGl2ZSBgQXJyYXkucHJvdG90eXBlLnJlZHVjZWAgbWV0aG9kLiBGb3IgbW9yZSBkZXRhaWxzXG4gKiBvbiB0aGlzIGJlaGF2aW9yLCBzZWU6XG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9yZWR1Y2VSaWdodCNEZXNjcmlwdGlvblxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgKGEsYiAtPiBhKSAtPiBhIC0+IFtiXSAtPiBhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24uIFJlY2VpdmVzIHR3byB2YWx1ZXMsIHRoZSBhY2N1bXVsYXRvciBhbmQgdGhlXG4gKiAgICAgICAgY3VycmVudCBlbGVtZW50IGZyb20gdGhlIGFycmF5LlxuICogQHBhcmFtIHsqfSBhY2MgVGhlIGFjY3VtdWxhdG9yIHZhbHVlLlxuICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcmV0dXJuIHsqfSBUaGUgZmluYWwsIGFjY3VtdWxhdGVkIHZhbHVlLlxuICogQHNlZSBSLmFkZEluZGV4XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIHBhaXJzID0gWyBbJ2EnLCAxXSwgWydiJywgMl0sIFsnYycsIDNdIF07XG4gKiAgICAgIHZhciBmbGF0dGVuUGFpcnMgPSAoYWNjLCBwYWlyKSA9PiBhY2MuY29uY2F0KHBhaXIpO1xuICpcbiAqICAgICAgUi5yZWR1Y2VSaWdodChmbGF0dGVuUGFpcnMsIFtdLCBwYWlycyk7IC8vPT4gWyAnYycsIDMsICdiJywgMiwgJ2EnLCAxIF1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkzKGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGZuLCBhY2MsIGxpc3QpIHtcbiAgdmFyIGlkeCA9IGxpc3QubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgYWNjID0gZm4oYWNjLCBsaXN0W2lkeF0pO1xuICAgIGlkeCAtPSAxO1xuICB9XG4gIHJldHVybiBhY2M7XG59KTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG52YXIgYXAgPSByZXF1aXJlKCcuL2FwJyk7XG52YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAnKTtcbnZhciBwcmVwZW5kID0gcmVxdWlyZSgnLi9wcmVwZW5kJyk7XG52YXIgcmVkdWNlUmlnaHQgPSByZXF1aXJlKCcuL3JlZHVjZVJpZ2h0Jyk7XG5cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIGEgW1RyYXZlcnNhYmxlXShodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWxhbmQvZmFudGFzeS1sYW5kI3RyYXZlcnNhYmxlKVxuICogb2YgW0FwcGxpY2F0aXZlXShodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWxhbmQvZmFudGFzeS1sYW5kI2FwcGxpY2F0aXZlKSBpbnRvIGFuXG4gKiBBcHBsaWNhdGl2ZSBvZiBUcmF2ZXJzYWJsZS5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgc2VxdWVuY2VgIG1ldGhvZCBvZiB0aGUgc2Vjb25kIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE5LjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIChBcHBsaWNhdGl2ZSBmLCBUcmF2ZXJzYWJsZSB0KSA9PiAoYSAtPiBmIGEpIC0+IHQgKGYgYSkgLT4gZiAodCBhKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb2ZcbiAqIEBwYXJhbSB7Kn0gdHJhdmVyc2FibGVcbiAqIEByZXR1cm4geyp9XG4gKiBAc2VlIFIudHJhdmVyc2VcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnNlcXVlbmNlKE1heWJlLm9mLCBbSnVzdCgxKSwgSnVzdCgyKSwgSnVzdCgzKV0pOyAgIC8vPT4gSnVzdChbMSwgMiwgM10pXG4gKiAgICAgIFIuc2VxdWVuY2UoTWF5YmUub2YsIFtKdXN0KDEpLCBKdXN0KDIpLCBOb3RoaW5nKCldKTsgLy89PiBOb3RoaW5nKClcbiAqXG4gKiAgICAgIFIuc2VxdWVuY2UoUi5vZiwgSnVzdChbMSwgMiwgM10pKTsgLy89PiBbSnVzdCgxKSwgSnVzdCgyKSwgSnVzdCgzKV1cbiAqICAgICAgUi5zZXF1ZW5jZShSLm9mLCBOb3RoaW5nKCkpOyAgICAgICAvLz0+IFtOb3RoaW5nKCldXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBzZXF1ZW5jZShvZiwgdHJhdmVyc2FibGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB0cmF2ZXJzYWJsZS5zZXF1ZW5jZSA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgdHJhdmVyc2FibGUuc2VxdWVuY2Uob2YpIDpcbiAgICByZWR1Y2VSaWdodChmdW5jdGlvbihhY2MsIHgpIHsgcmV0dXJuIGFwKG1hcChwcmVwZW5kLCB4KSwgYWNjKTsgfSxcbiAgICAgICAgICAgICAgICBvZihbXSksXG4gICAgICAgICAgICAgICAgdHJhdmVyc2FibGUpO1xufSk7XG4iLCJ2YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xudmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwJyk7XG52YXIgc2VxdWVuY2UgPSByZXF1aXJlKCcuL3NlcXVlbmNlJyk7XG5cblxuLyoqXG4gKiBNYXBzIGFuIFtBcHBsaWNhdGl2ZV0oaHR0cHM6Ly9naXRodWIuY29tL2ZhbnRhc3lsYW5kL2ZhbnRhc3ktbGFuZCNhcHBsaWNhdGl2ZSktcmV0dXJuaW5nXG4gKiBmdW5jdGlvbiBvdmVyIGEgW1RyYXZlcnNhYmxlXShodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWxhbmQvZmFudGFzeS1sYW5kI3RyYXZlcnNhYmxlKSxcbiAqIHRoZW4gdXNlcyBbYHNlcXVlbmNlYF0oI3NlcXVlbmNlKSB0byB0cmFuc2Zvcm0gdGhlIHJlc3VsdGluZyBUcmF2ZXJzYWJsZSBvZiBBcHBsaWNhdGl2ZVxuICogaW50byBhbiBBcHBsaWNhdGl2ZSBvZiBUcmF2ZXJzYWJsZS5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgc2VxdWVuY2VgIG1ldGhvZCBvZiB0aGUgdGhpcmQgYXJndW1lbnQsIGlmIHByZXNlbnQuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMTkuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgKEFwcGxpY2F0aXZlIGYsIFRyYXZlcnNhYmxlIHQpID0+IChhIC0+IGYgYSkgLT4gKGEgLT4gZiBiKSAtPiB0IGEgLT4gZiAodCBiKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb2ZcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZcbiAqIEBwYXJhbSB7Kn0gdHJhdmVyc2FibGVcbiAqIEByZXR1cm4geyp9XG4gKiBAc2VlIFIuc2VxdWVuY2VcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICAvLyBSZXR1cm5zIGBOb3RoaW5nYCBpZiB0aGUgZ2l2ZW4gZGl2aXNvciBpcyBgMGBcbiAqICAgICAgc2FmZURpdiA9IG4gPT4gZCA9PiBkID09PSAwID8gTm90aGluZygpIDogSnVzdChuIC8gZClcbiAqXG4gKiAgICAgIFIudHJhdmVyc2UoTWF5YmUub2YsIHNhZmVEaXYoMTApLCBbMiwgNCwgNV0pOyAvLz0+IEp1c3QoWzUsIDIuNSwgMl0pXG4gKiAgICAgIFIudHJhdmVyc2UoTWF5YmUub2YsIHNhZmVEaXYoMTApLCBbMiwgMCwgNV0pOyAvLz0+IE5vdGhpbmdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkzKGZ1bmN0aW9uIHRyYXZlcnNlKG9mLCBmLCB0cmF2ZXJzYWJsZSkge1xuICByZXR1cm4gc2VxdWVuY2Uob2YsIG1hcChmLCB0cmF2ZXJzYWJsZSkpO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9hcnJheUZyb21JdGVyYXRvcihpdGVyKSB7XG4gIHZhciBsaXN0ID0gW107XG4gIHZhciBuZXh0O1xuICB3aGlsZSAoIShuZXh0ID0gaXRlci5uZXh0KCkpLmRvbmUpIHtcbiAgICBsaXN0LnB1c2gobmV4dC52YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGxpc3Q7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZnVuY3Rpb25OYW1lKGYpIHtcbiAgLy8gU3RyaW5nKHggPT4geCkgZXZhbHVhdGVzIHRvIFwieCA9PiB4XCIsIHNvIHRoZSBwYXR0ZXJuIG1heSBub3QgbWF0Y2guXG4gIHZhciBtYXRjaCA9IFN0cmluZyhmKS5tYXRjaCgvXmZ1bmN0aW9uIChcXHcqKS8pO1xuICByZXR1cm4gbWF0Y2ggPT0gbnVsbCA/ICcnIDogbWF0Y2hbMV07XG59O1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcblxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBpdHMgYXJndW1lbnRzIGFyZSBpZGVudGljYWwsIGZhbHNlIG90aGVyd2lzZS4gVmFsdWVzIGFyZVxuICogaWRlbnRpY2FsIGlmIHRoZXkgcmVmZXJlbmNlIHRoZSBzYW1lIG1lbW9yeS4gYE5hTmAgaXMgaWRlbnRpY2FsIHRvIGBOYU5gO1xuICogYDBgIGFuZCBgLTBgIGFyZSBub3QgaWRlbnRpY2FsLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE1LjBcbiAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICogQHNpZyBhIC0+IGEgLT4gQm9vbGVhblxuICogQHBhcmFtIHsqfSBhXG4gKiBAcGFyYW0geyp9IGJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIG8gPSB7fTtcbiAqICAgICAgUi5pZGVudGljYWwobywgbyk7IC8vPT4gdHJ1ZVxuICogICAgICBSLmlkZW50aWNhbCgxLCAxKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuaWRlbnRpY2FsKDEsICcxJyk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pZGVudGljYWwoW10sIFtdKTsgLy89PiBmYWxzZVxuICogICAgICBSLmlkZW50aWNhbCgwLCAtMCk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pZGVudGljYWwoTmFOLCBOYU4pOyAvLz0+IHRydWVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGlkZW50aWNhbChhLCBiKSB7XG4gIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgaWYgKGEgPT09IGIpIHsgLy8gU3RlcHMgMS01LCA3LTEwXG4gICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gIH0gZWxzZSB7XG4gICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICByZXR1cm4gYSAhPT0gYSAmJiBiICE9PSBiO1xuICB9XG59KTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG5cblxuLyoqXG4gKiBHaXZlcyBhIHNpbmdsZS13b3JkIHN0cmluZyBkZXNjcmlwdGlvbiBvZiB0aGUgKG5hdGl2ZSkgdHlwZSBvZiBhIHZhbHVlLFxuICogcmV0dXJuaW5nIHN1Y2ggYW5zd2VycyBhcyAnT2JqZWN0JywgJ051bWJlcicsICdBcnJheScsIG9yICdOdWxsJy4gRG9lcyBub3RcbiAqIGF0dGVtcHQgdG8gZGlzdGluZ3Vpc2ggdXNlciBPYmplY3QgdHlwZXMgYW55IGZ1cnRoZXIsIHJlcG9ydGluZyB0aGVtIGFsbCBhc1xuICogJ09iamVjdCcuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuOC4wXG4gKiBAY2F0ZWdvcnkgVHlwZVxuICogQHNpZyAoKiAtPiB7Kn0pIC0+IFN0cmluZ1xuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnR5cGUoe30pOyAvLz0+IFwiT2JqZWN0XCJcbiAqICAgICAgUi50eXBlKDEpOyAvLz0+IFwiTnVtYmVyXCJcbiAqICAgICAgUi50eXBlKGZhbHNlKTsgLy89PiBcIkJvb2xlYW5cIlxuICogICAgICBSLnR5cGUoJ3MnKTsgLy89PiBcIlN0cmluZ1wiXG4gKiAgICAgIFIudHlwZShudWxsKTsgLy89PiBcIk51bGxcIlxuICogICAgICBSLnR5cGUoW10pOyAvLz0+IFwiQXJyYXlcIlxuICogICAgICBSLnR5cGUoL1tBLXpdLyk7IC8vPT4gXCJSZWdFeHBcIlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTEoZnVuY3Rpb24gdHlwZSh2YWwpIHtcbiAgcmV0dXJuIHZhbCA9PT0gbnVsbCAgICAgID8gJ051bGwnICAgICAgOlxuICAgICAgICAgdmFsID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6XG4gICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKS5zbGljZSg4LCAtMSk7XG59KTtcbiIsInZhciBfYXJyYXlGcm9tSXRlcmF0b3IgPSByZXF1aXJlKCcuL19hcnJheUZyb21JdGVyYXRvcicpO1xudmFyIF9mdW5jdGlvbk5hbWUgPSByZXF1aXJlKCcuL19mdW5jdGlvbk5hbWUnKTtcbnZhciBfaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgaWRlbnRpY2FsID0gcmVxdWlyZSgnLi4vaWRlbnRpY2FsJyk7XG52YXIga2V5cyA9IHJlcXVpcmUoJy4uL2tleXMnKTtcbnZhciB0eXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2VxdWFscyhhLCBiLCBzdGFja0EsIHN0YWNrQikge1xuICBpZiAoaWRlbnRpY2FsKGEsIGIpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZShhKSAhPT0gdHlwZShiKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgYi5lcXVhbHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZW9mIGEuZXF1YWxzID09PSAnZnVuY3Rpb24nICYmIGEuZXF1YWxzKGIpICYmXG4gICAgICAgICAgIHR5cGVvZiBiLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyAmJiBiLmVxdWFscyhhKTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZShhKSkge1xuICAgIGNhc2UgJ0FyZ3VtZW50cyc6XG4gICAgY2FzZSAnQXJyYXknOlxuICAgIGNhc2UgJ09iamVjdCc6XG4gICAgICBpZiAodHlwZW9mIGEuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICBfZnVuY3Rpb25OYW1lKGEuY29uc3RydWN0b3IpID09PSAnUHJvbWlzZScpIHtcbiAgICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdCb29sZWFuJzpcbiAgICBjYXNlICdOdW1iZXInOlxuICAgIGNhc2UgJ1N0cmluZyc6XG4gICAgICBpZiAoISh0eXBlb2YgYSA9PT0gdHlwZW9mIGIgJiYgaWRlbnRpY2FsKGEudmFsdWVPZigpLCBiLnZhbHVlT2YoKSkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgaWYgKCFpZGVudGljYWwoYS52YWx1ZU9mKCksIGIudmFsdWVPZigpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdFcnJvcic6XG4gICAgICByZXR1cm4gYS5uYW1lID09PSBiLm5hbWUgJiYgYS5tZXNzYWdlID09PSBiLm1lc3NhZ2U7XG4gICAgY2FzZSAnUmVnRXhwJzpcbiAgICAgIGlmICghKGEuc291cmNlID09PSBiLnNvdXJjZSAmJlxuICAgICAgICAgICAgYS5nbG9iYWwgPT09IGIuZ2xvYmFsICYmXG4gICAgICAgICAgICBhLmlnbm9yZUNhc2UgPT09IGIuaWdub3JlQ2FzZSAmJlxuICAgICAgICAgICAgYS5tdWx0aWxpbmUgPT09IGIubXVsdGlsaW5lICYmXG4gICAgICAgICAgICBhLnN0aWNreSA9PT0gYi5zdGlja3kgJiZcbiAgICAgICAgICAgIGEudW5pY29kZSA9PT0gYi51bmljb2RlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdNYXAnOlxuICAgIGNhc2UgJ1NldCc6XG4gICAgICBpZiAoIV9lcXVhbHMoX2FycmF5RnJvbUl0ZXJhdG9yKGEuZW50cmllcygpKSwgX2FycmF5RnJvbUl0ZXJhdG9yKGIuZW50cmllcygpKSwgc3RhY2tBLCBzdGFja0IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0ludDhBcnJheSc6XG4gICAgY2FzZSAnVWludDhBcnJheSc6XG4gICAgY2FzZSAnVWludDhDbGFtcGVkQXJyYXknOlxuICAgIGNhc2UgJ0ludDE2QXJyYXknOlxuICAgIGNhc2UgJ1VpbnQxNkFycmF5JzpcbiAgICBjYXNlICdJbnQzMkFycmF5JzpcbiAgICBjYXNlICdVaW50MzJBcnJheSc6XG4gICAgY2FzZSAnRmxvYXQzMkFycmF5JzpcbiAgICBjYXNlICdGbG9hdDY0QXJyYXknOlxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQXJyYXlCdWZmZXInOlxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIFZhbHVlcyBvZiBvdGhlciB0eXBlcyBhcmUgb25seSBlcXVhbCBpZiBpZGVudGljYWwuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIga2V5c0EgPSBrZXlzKGEpO1xuICBpZiAoa2V5c0EubGVuZ3RoICE9PSBrZXlzKGIpLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBpZHggPSBzdGFja0EubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgaWYgKHN0YWNrQVtpZHhdID09PSBhKSB7XG4gICAgICByZXR1cm4gc3RhY2tCW2lkeF0gPT09IGI7XG4gICAgfVxuICAgIGlkeCAtPSAxO1xuICB9XG5cbiAgc3RhY2tBLnB1c2goYSk7XG4gIHN0YWNrQi5wdXNoKGIpO1xuICBpZHggPSBrZXlzQS5sZW5ndGggLSAxO1xuICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICB2YXIga2V5ID0ga2V5c0FbaWR4XTtcbiAgICBpZiAoIShfaGFzKGtleSwgYikgJiYgX2VxdWFscyhiW2tleV0sIGFba2V5XSwgc3RhY2tBLCBzdGFja0IpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZHggLT0gMTtcbiAgfVxuICBzdGFja0EucG9wKCk7XG4gIHN0YWNrQi5wb3AoKTtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfZXF1YWxzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fZXF1YWxzJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiBpdHMgYXJndW1lbnRzIGFyZSBlcXVpdmFsZW50LCBgZmFsc2VgIG90aGVyd2lzZS4gSGFuZGxlc1xuICogY3ljbGljYWwgZGF0YSBzdHJ1Y3R1cmVzLlxuICpcbiAqIERpc3BhdGNoZXMgc3ltbWV0cmljYWxseSB0byB0aGUgYGVxdWFsc2AgbWV0aG9kcyBvZiBib3RoIGFyZ3VtZW50cywgaWZcbiAqIHByZXNlbnQuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMTUuMFxuICogQGNhdGVnb3J5IFJlbGF0aW9uXG4gKiBAc2lnIGEgLT4gYiAtPiBCb29sZWFuXG4gKiBAcGFyYW0geyp9IGFcbiAqIEBwYXJhbSB7Kn0gYlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmVxdWFscygxLCAxKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuZXF1YWxzKDEsICcxJyk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5lcXVhbHMoWzEsIDIsIDNdLCBbMSwgMiwgM10pOyAvLz0+IHRydWVcbiAqXG4gKiAgICAgIHZhciBhID0ge307IGEudiA9IGE7XG4gKiAgICAgIHZhciBiID0ge307IGIudiA9IGI7XG4gKiAgICAgIFIuZXF1YWxzKGEsIGIpOyAvLz0+IHRydWVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gIHJldHVybiBfZXF1YWxzKGEsIGIsIFtdLCBbXSk7XG59KTtcbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMy0yMDE0IFF1aWxkcmVlbiBNb3R0YSA8cXVpbGRyZWVuQGdtYWlsLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuLy8gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbi8vICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbi8vIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4vLyBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuLy8gYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbi8vIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4vLyBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuLy8gRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuLy8gTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuLy8gTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLyoqXG4gKiBAbW9kdWxlIGxpYi9laXRoZXJcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBFaXRoZXJcblxuLy8gLS0gQWxpYXNlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY2xvbmUgICAgICAgICA9IE9iamVjdC5jcmVhdGVcbnZhciB1bmltcGxlbWVudGVkID0gZnVuY3Rpb24oKXsgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQuJykgfVxudmFyIG5vb3AgICAgICAgICAgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpcyAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cblxuLy8gLS0gSW1wbGVtZW50YXRpb24gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVGhlIGBFaXRoZXIoYSwgYilgIHN0cnVjdHVyZSByZXByZXNlbnRzIHRoZSBsb2dpY2FsIGRpc2p1bmN0aW9uIGJldHdlZW4gYGFgXG4gKiBhbmQgYGJgLiBJbiBvdGhlciB3b3JkcywgYEVpdGhlcmAgbWF5IGNvbnRhaW4gZWl0aGVyIGEgdmFsdWUgb2YgdHlwZSBgYWAgb3JcbiAqIGEgdmFsdWUgb2YgdHlwZSBgYmAsIGF0IGFueSBnaXZlbiB0aW1lLiBUaGlzIHBhcnRpY3VsYXIgaW1wbGVtZW50YXRpb24gaXNcbiAqIGJpYXNlZCBvbiB0aGUgcmlnaHQgdmFsdWUgKGBiYCksIHRodXMgcHJvamVjdGlvbnMgd2lsbCB0YWtlIHRoZSByaWdodCB2YWx1ZVxuICogb3ZlciB0aGUgbGVmdCBvbmUuXG4gKlxuICogVGhpcyBjbGFzcyBtb2RlbHMgdHdvIGRpZmZlcmVudCBjYXNlczogYExlZnQgYWAgYW5kIGBSaWdodCBiYCwgYW5kIGNhbiBob2xkXG4gKiBvbmUgb2YgdGhlIGNhc2VzIGF0IGFueSBnaXZlbiB0aW1lLiBUaGUgcHJvamVjdGlvbnMgYXJlLCBub25lIHRoZSBsZXNzLFxuICogYmlhc2VkIGZvciB0aGUgYFJpZ2h0YCBjYXNlLCB0aHVzIGEgY29tbW9uIHVzZSBjYXNlIGZvciB0aGlzIHN0cnVjdHVyZSBpcyB0b1xuICogaG9sZCB0aGUgcmVzdWx0cyBvZiBjb21wdXRhdGlvbnMgdGhhdCBtYXkgZmFpbCwgd2hlbiB5b3Ugd2FudCB0byBzdG9yZVxuICogYWRkaXRpb25hbCBpbmZvcm1hdGlvbiBvbiB0aGUgZmFpbHVyZSAoaW5zdGVhZCBvZiB0aHJvd2luZyBhbiBleGNlcHRpb24pLlxuICpcbiAqIEZ1cnRoZXJtb3JlLCB0aGUgdmFsdWVzIG9mIGBFaXRoZXIoYSwgYilgIGNhbiBiZSBjb21iaW5lZCBhbmQgbWFuaXB1bGF0ZWQgYnlcbiAqIHVzaW5nIHRoZSBleHByZXNzaXZlIG1vbmFkaWMgb3BlcmF0aW9ucy4gVGhpcyBhbGxvd3Mgc2FmZWx5IHNlcXVlbmNpbmdcbiAqIG9wZXJhdGlvbnMgdGhhdCBtYXkgZmFpbCwgYW5kIHNhZmVseSBjb21wb3NpbmcgdmFsdWVzIHRoYXQgeW91IGRvbid0IGtub3dcbiAqIHdoZXRoZXIgdGhleSdyZSBwcmVzZW50IG9yIG5vdCwgZmFpbGluZyBlYXJseSAocmV0dXJuaW5nIGEgYExlZnQgYWApIGlmIGFueVxuICogb2YgdGhlIG9wZXJhdGlvbnMgZmFpbC5cbiAqXG4gKiBXaGlsZSB0aGlzIGNsYXNzIGNhbiBjZXJ0YWlubHkgbW9kZWwgaW5wdXQgdmFsaWRhdGlvbnMsIHRoZSBbVmFsaWRhdGlvbl1bXVxuICogc3RydWN0dXJlIGxlbmRzIGl0c2VsZiBiZXR0ZXIgdG8gdGhhdCB1c2UgY2FzZSwgc2luY2UgaXQgY2FuIG5hdHVyYWxseVxuICogYWdncmVnYXRlIGZhaWx1cmVzIOKAlCBtb25hZHMgc2hvcnRjdXQgb24gdGhlIGZpcnN0IGZhaWx1cmUuXG4gKlxuICogW1ZhbGlkYXRpb25dOiBodHRwczovL2dpdGh1Yi5jb20vZm9sa3RhbGUvZGF0YS52YWxpZGF0aW9uXG4gKlxuICpcbiAqIEBjbGFzc1xuICogQHN1bW1hcnlcbiAqIEVpdGhlclvOsSwgzrJdIDw6IEFwcGxpY2F0aXZlW86yXVxuICogICAgICAgICAgICAgICAsIEZ1bmN0b3JbzrJdXG4gKiAgICAgICAgICAgICAgICwgQ2hhaW5bzrJdXG4gKiAgICAgICAgICAgICAgICwgU2hvd1xuICogICAgICAgICAgICAgICAsIEVxXG4gKi9cbmZ1bmN0aW9uIEVpdGhlcigpIHsgfVxuXG5MZWZ0LnByb3RvdHlwZSA9IGNsb25lKEVpdGhlci5wcm90b3R5cGUpXG5mdW5jdGlvbiBMZWZ0KGEpIHtcbiAgdGhpcy52YWx1ZSA9IGFcbn1cblxuUmlnaHQucHJvdG90eXBlID0gY2xvbmUoRWl0aGVyLnByb3RvdHlwZSlcbmZ1bmN0aW9uIFJpZ2h0KGEpIHtcbiAgdGhpcy52YWx1ZSA9IGFcbn1cblxuLy8gLS0gQ29uc3RydWN0b3JzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZSBob2xkaW5nIGEgYExlZnRgIHZhbHVlLiBUaGlzXG4gKiB1c3VhbGx5IHJlcHJlc2VudHMgYSBmYWlsdXJlIGR1ZSB0byB0aGUgcmlnaHQtYmlhcyBvZiB0aGlzIHN0cnVjdHVyZS5cbiAqXG4gKiBAc3VtbWFyeSBhIOKGkiBFaXRoZXJbzrEsIM6yXVxuICovXG5FaXRoZXIuTGVmdCA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIG5ldyBMZWZ0KGEpXG59XG5FaXRoZXIucHJvdG90eXBlLkxlZnQgPSBFaXRoZXIuTGVmdFxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUgaG9sZGluZyBhIGBSaWdodGAgdmFsdWUuIFRoaXNcbiAqIHVzdWFsbHkgcmVwcmVzZW50cyBhIHN1Y2Nlc3NmdWwgdmFsdWUgZHVlIHRvIHRoZSByaWdodCBiaWFzIG9mIHRoaXNcbiAqIHN0cnVjdHVyZS5cbiAqXG4gKiBAc3VtbWFyeSDOsiDihpIgRWl0aGVyW86xLCDOsl1cbiAqL1xuRWl0aGVyLlJpZ2h0ID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gbmV3IFJpZ2h0KGEpXG59XG5FaXRoZXIucHJvdG90eXBlLlJpZ2h0ID0gRWl0aGVyLlJpZ2h0XG5cblxuLy8gLS0gQ29udmVyc2lvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZSBmcm9tIGEgbnVsbGFibGUgdHlwZS5cbiAqXG4gKiBUYWtlcyB0aGUgYExlZnRgIGNhc2UgaWYgdGhlIHZhbHVlIGlzIGBudWxsYCBvciBgdW5kZWZpbmVkYC4gVGFrZXMgdGhlXG4gKiBgUmlnaHRgIGNhc2Ugb3RoZXJ3aXNlLlxuICpcbiAqIEBzdW1tYXJ5IM6xIOKGkiBFaXRoZXJbzrEsIM6xXVxuICovXG5FaXRoZXIuZnJvbU51bGxhYmxlID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYSAhPSBudWxsPyAgICAgICBuZXcgUmlnaHQoYSlcbiAgOiAgICAgIC8qIG90aGVyd2lzZSAqLyAgbmV3IExlZnQoYSlcbn1cbkVpdGhlci5wcm90b3R5cGUuZnJvbU51bGxhYmxlID0gRWl0aGVyLmZyb21OdWxsYWJsZVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUgZnJvbSBhIGBWYWxpZGF0aW9uW86xLCDOsl1gIHR5cGUuXG4gKlxuICogQHN1bW1hcnkgVmFsaWRhdGlvblvOsSwgzrJdIOKGkiBFaXRoZXJbzrEsIM6yXVxuICovXG5FaXRoZXIuZnJvbVZhbGlkYXRpb24gPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBhLmZvbGQoRWl0aGVyLkxlZnQsIEVpdGhlci5SaWdodClcbn1cblxuLyoqXG4gKiBFeGVjdXRlcyBhIHN5bmNocm9ub3VzIGNvbXB1dGF0aW9uIHRoYXQgbWF5IHRocm93IGFuZCBjb252ZXJ0cyBpdCB0byBhblxuICogRWl0aGVyIHR5cGUuXG4gKlxuICogQHN1bW1hcnkgKM6x4oKBLCDOseKCgiwgLi4uLCDOseKCmSAtPiDOsiA6OiB0aHJvd3MgzrMpIC0+ICjOseKCgSwgzrHigoIsIC4uLiwgzrHigpkgLT4gRWl0aGVyW86zLCDOsl0pXG4gKi9cbkVpdGhlci50cnkgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIG5ldyBSaWdodChmLmFwcGx5KG51bGwsIGFyZ3VtZW50cykpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICByZXR1cm4gbmV3IExlZnQoZSlcbiAgICB9XG4gIH1cbn1cblxuXG4vLyAtLSBQcmVkaWNhdGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcnVlIGlmIHRoZSBgRWl0aGVyW86xLCDOsl1gIGNvbnRhaW5zIGEgYExlZnRgIHZhbHVlLlxuICpcbiAqIEBzdW1tYXJ5IEJvb2xlYW5cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5pc0xlZnQgPSBmYWxzZVxuTGVmdC5wcm90b3R5cGUuaXNMZWZ0ICAgPSB0cnVlXG5cbi8qKlxuICogVHJ1ZSBpZiB0aGUgYEVpdGhlclvOsSwgzrJdYCBjb250YWlucyBhIGBSaWdodGAgdmFsdWUuXG4gKlxuICogQHN1bW1hcnkgQm9vbGVhblxuICovXG5FaXRoZXIucHJvdG90eXBlLmlzUmlnaHQgPSBmYWxzZVxuUmlnaHQucHJvdG90eXBlLmlzUmlnaHQgID0gdHJ1ZVxuXG5cbi8vIC0tIEFwcGxpY2F0aXZlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEVpdGhlclvOsSwgzrJdYCBpbnN0YW5jZSBob2xkaW5nIHRoZSBgUmlnaHRgIHZhbHVlIGBiYC5cbiAqXG4gKiBgYmAgY2FuIGJlIGFueSB2YWx1ZSwgaW5jbHVkaW5nIGBudWxsYCwgYHVuZGVmaW5lZGAgb3IgYW5vdGhlclxuICogYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrIg4oaSIEVpdGhlclvOsSwgzrJdXG4gKi9cbkVpdGhlci5vZiA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIG5ldyBSaWdodChhKVxufVxuRWl0aGVyLnByb3RvdHlwZS5vZiA9IEVpdGhlci5vZlxuXG5cbi8qKlxuICogQXBwbGllcyB0aGUgZnVuY3Rpb24gaW5zaWRlIHRoZSBgUmlnaHRgIGNhc2Ugb2YgdGhlIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlXG4gKiB0byBhbm90aGVyIGFwcGxpY2F0aXZlIHR5cGUuXG4gKlxuICogVGhlIGBFaXRoZXJbzrEsIM6yXWAgc2hvdWxkIGNvbnRhaW4gYSBmdW5jdGlvbiB2YWx1ZSwgb3RoZXJ3aXNlIGEgYFR5cGVFcnJvcmBcbiAqIGlzIHRocm93bi5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrIg4oaSIM6zXSwgZjpBcHBsaWNhdGl2ZVtfXSkgPT4gZlvOsl0g4oaSIGZbzrNdXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuYXAgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLmFwID0gZnVuY3Rpb24oYikge1xuICByZXR1cm4gdGhpc1xufVxuXG5SaWdodC5wcm90b3R5cGUuYXAgPSBmdW5jdGlvbihiKSB7XG4gIHJldHVybiBiLm1hcCh0aGlzLnZhbHVlKVxufVxuXG5cbi8vIC0tIEZ1bmN0b3IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIGBSaWdodGAgdmFsdWUgb2YgdGhlIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIHVzaW5nIGEgcmVndWxhclxuICogdW5hcnkgZnVuY3Rpb24uXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gKM6yIOKGkiDOsykg4oaSIEVpdGhlclvOsSwgzrNdXG4gKi9cbkVpdGhlci5wcm90b3R5cGUubWFwID0gdW5pbXBsZW1lbnRlZFxuTGVmdC5wcm90b3R5cGUubWFwICAgPSBub29wXG5cblJpZ2h0LnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiB0aGlzLm9mKGYodGhpcy52YWx1ZSkpXG59XG5cblxuLy8gLS0gQ2hhaW4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgYFJpZ2h0YCB2YWx1ZSBvZiB0aGUgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUgdXNpbmcgYW4gdW5hcnlcbiAqIGZ1bmN0aW9uIHRvIG1vbmFkcy5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdLCBtOk1vbmFkW19dKSA9PiAozrIg4oaSIG1bzrNdKSDihpIgbVvOs11cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5jaGFpbiA9IHVuaW1wbGVtZW50ZWRcbkxlZnQucHJvdG90eXBlLmNoYWluICAgPSBub29wXG5cblJpZ2h0LnByb3RvdHlwZS5jaGFpbiA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGYodGhpcy52YWx1ZSlcbn1cblxuXG4vLyAtLSBTaG93IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gVm9pZCDihpIgU3RyaW5nXG4gKi9cbkVpdGhlci5wcm90b3R5cGUudG9TdHJpbmcgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnRWl0aGVyLkxlZnQoJyArIHRoaXMudmFsdWUgKyAnKSdcbn1cblxuUmlnaHQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnRWl0aGVyLlJpZ2h0KCcgKyB0aGlzLnZhbHVlICsgJyknXG59XG5cblxuLy8gLS0gRXEgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVGVzdHMgaWYgYW4gYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUgaXMgZXF1YWwgdG8gYW5vdGhlciBgRWl0aGVyW86xLCDOsl1gXG4gKiBzdHJ1Y3R1cmUuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gRWl0aGVyW86xLCDOsl0g4oaSIEJvb2xlYW5cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5pc0VxdWFsID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5pc0VxdWFsID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYS5pc0xlZnQgJiYgKGEudmFsdWUgPT09IHRoaXMudmFsdWUpXG59XG5cblJpZ2h0LnByb3RvdHlwZS5pc0VxdWFsID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYS5pc1JpZ2h0ICYmIChhLnZhbHVlID09PSB0aGlzLnZhbHVlKVxufVxuXG5cbi8vIC0tIEV4dHJhY3RpbmcgYW5kIHJlY292ZXJpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSBgUmlnaHRgIHZhbHVlIG91dCBvZiB0aGUgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUsIGlmIGl0XG4gKiBleGlzdHMuIE90aGVyd2lzZSB0aHJvd3MgYSBgVHlwZUVycm9yYC5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiBWb2lkIOKGkiDOsiAgICAgICAgIDo6IHBhcnRpYWwsIHRocm93c1xuICogQHNlZSB7QGxpbmsgbW9kdWxlOmxpYi9laXRoZXJ+RWl0aGVyI2dldE9yRWxzZX0g4oCUIEEgZ2V0dGVyIHRoYXQgY2FuIGhhbmRsZSBmYWlsdXJlcy5cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpsaWIvZWl0aGVyfkVpdGhlciNtZXJnZX0g4oCUIFRoZSBjb252ZXJnZW5jZSBvZiBib3RoIHZhbHVlcy5cbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gaWYgdGhlIHN0cnVjdHVyZSBoYXMgbm8gYFJpZ2h0YCB2YWx1ZS5cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5nZXQgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2FuJ3QgZXh0cmFjdCB0aGUgdmFsdWUgb2YgYSBMZWZ0KGEpLlwiKVxufVxuXG5SaWdodC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnZhbHVlXG59XG5cblxuLyoqXG4gKiBFeHRyYWN0cyB0aGUgYFJpZ2h0YCB2YWx1ZSBvdXQgb2YgdGhlIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlLiBJZiB0aGVcbiAqIHN0cnVjdHVyZSBkb2Vzbid0IGhhdmUgYSBgUmlnaHRgIHZhbHVlLCByZXR1cm5zIHRoZSBnaXZlbiBkZWZhdWx0LlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+IM6yIOKGkiDOslxuICovXG5FaXRoZXIucHJvdG90eXBlLmdldE9yRWxzZSA9IHVuaW1wbGVtZW50ZWRcblxuTGVmdC5wcm90b3R5cGUuZ2V0T3JFbHNlID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYVxufVxuXG5SaWdodC5wcm90b3R5cGUuZ2V0T3JFbHNlID0gZnVuY3Rpb24oXykge1xuICByZXR1cm4gdGhpcy52YWx1ZVxufVxuXG5cbi8qKlxuICogVHJhbnNmb3JtcyBhIGBMZWZ0YCB2YWx1ZSBpbnRvIGEgbmV3IGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlLiBEb2VzIG5vdGhpbmdcbiAqIGlmIHRoZSBzdHJ1Y3R1cmUgY29udGFpbiBhIGBSaWdodGAgdmFsdWUuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gKM6xIOKGkiBFaXRoZXJbzrMsIM6yXSkg4oaSIEVpdGhlclvOsywgzrJdXG4gKi9cbkVpdGhlci5wcm90b3R5cGUub3JFbHNlID0gdW5pbXBsZW1lbnRlZFxuUmlnaHQucHJvdG90eXBlLm9yRWxzZSAgPSBub29wXG5cbkxlZnQucHJvdG90eXBlLm9yRWxzZSA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGYodGhpcy52YWx1ZSlcbn1cblxuXG4vKipcbiAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHdoaWNoZXZlciBzaWRlIG9mIHRoZSBkaXNqdW5jdGlvbiB0aGF0IGlzIHByZXNlbnQuXG4gKlxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6xXSkgPT4gVm9pZCDihpIgzrFcbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy52YWx1ZVxufVxuXG5cbi8vIC0tIEZvbGRzIGFuZCBFeHRlbmRlZCBUcmFuc2Zvcm1hdGlvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIEFwcGxpZXMgYSBmdW5jdGlvbiB0byBlYWNoIGNhc2UgaW4gdGhpcyBkYXRhIHN0cnVjdHVyZS5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiAozrEg4oaSIM6zKSwgKM6yIOKGkiDOsykg4oaSIM6zXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuZm9sZCA9IHVuaW1wbGVtZW50ZWRcblxuTGVmdC5wcm90b3R5cGUuZm9sZCA9IGZ1bmN0aW9uKGYsIF8pIHtcbiAgcmV0dXJuIGYodGhpcy52YWx1ZSlcbn1cblxuUmlnaHQucHJvdG90eXBlLmZvbGQgPSBmdW5jdGlvbihfLCBnKSB7XG4gIHJldHVybiBnKHRoaXMudmFsdWUpXG59XG5cbi8qKlxuICogQ2F0YW1vcnBoaXNtLlxuICogXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiB7IExlZnQ6IM6xIOKGkiDOsywgUmlnaHQ6IM6yIOKGkiDOsyB9IOKGkiDOs1xuICovXG5FaXRoZXIucHJvdG90eXBlLmNhdGEgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLmNhdGEgPSBmdW5jdGlvbihwYXR0ZXJuKSB7XG4gIHJldHVybiBwYXR0ZXJuLkxlZnQodGhpcy52YWx1ZSlcbn1cblxuUmlnaHQucHJvdG90eXBlLmNhdGEgPSBmdW5jdGlvbihwYXR0ZXJuKSB7XG4gIHJldHVybiBwYXR0ZXJuLlJpZ2h0KHRoaXMudmFsdWUpXG59XG5cblxuLyoqXG4gKiBTd2FwcyB0aGUgZGlzanVuY3Rpb24gdmFsdWVzLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+IFZvaWQg4oaSIEVpdGhlclvOsiwgzrFdXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuc3dhcCA9IHVuaW1wbGVtZW50ZWRcblxuTGVmdC5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5SaWdodCh0aGlzLnZhbHVlKVxufVxuXG5SaWdodC5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5MZWZ0KHRoaXMudmFsdWUpXG59XG5cblxuLyoqXG4gKiBNYXBzIGJvdGggc2lkZXMgb2YgdGhlIGRpc2p1bmN0aW9uLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+ICjOsSDihpIgzrMpLCAozrIg4oaSIM60KSDihpIgRWl0aGVyW86zLCDOtF1cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5iaW1hcCA9IHVuaW1wbGVtZW50ZWRcblxuTGVmdC5wcm90b3R5cGUuYmltYXAgPSBmdW5jdGlvbihmLCBfKSB7XG4gIHJldHVybiB0aGlzLkxlZnQoZih0aGlzLnZhbHVlKSlcbn1cblxuUmlnaHQucHJvdG90eXBlLmJpbWFwID0gZnVuY3Rpb24oXywgZykge1xuICByZXR1cm4gdGhpcy5SaWdodChnKHRoaXMudmFsdWUpKVxufVxuXG5cbi8qKlxuICogTWFwcyB0aGUgbGVmdCBzaWRlIG9mIHRoZSBkaXNqdW5jdGlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiAozrEg4oaSIM6zKSDihpIgRWl0aGVyW86zLCDOsl1cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5sZWZ0TWFwID0gdW5pbXBsZW1lbnRlZFxuUmlnaHQucHJvdG90eXBlLmxlZnRNYXAgID0gbm9vcFxuXG5MZWZ0LnByb3RvdHlwZS5sZWZ0TWFwID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gdGhpcy5MZWZ0KGYodGhpcy52YWx1ZSkpXG59XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNCBRdWlsZHJlZW4gTW90dGEgPHF1aWxkcmVlbkBnbWFpbC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbi8vIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4vLyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4vLyBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuLy8gcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbi8vIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4vLyBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuLy8gaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbi8vIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbi8vIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbi8vIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbi8vIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9laXRoZXInKSIsIi8qIEBmbG93IHdlYWsgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmltcG9ydCB7IHB1c2hIaXN0b3J5U3RhdGUsIGNyZWF0ZUlkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IGN1cnJ5LCBlcXVhbHMsIHRyYXZlcnNlLCBpZGVudGl0eSwgcGF0aCB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IEVpdGhlciBmcm9tIFwiZGF0YS5laXRoZXJcIjtcblxuLy8gW2FdID0+IEVpdGhlciBTdHJpbmcgW2FdXG5jb25zdCBpc0FycmF5ID0gYXJyID0+XG4gIEFycmF5LmlzQXJyYXkoYXJyKVxuICAgID8gRWl0aGVyLlJpZ2h0KGFycilcbiAgICA6IEVpdGhlci5MZWZ0KGBJbnZhbGlkIHN0YXRlcyBzZW50IHdpdGggaW1wb3J0U3RhdGUuIEV4cGVjdGVkIEFycmF5IGJ1dCByZWNlaXZlZCAke3R5cGVvZiBhcnJ9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxuXG5jb25zdCBmaWVsZFR5cGVJc1ZhbGlkID0gY3VycnkoKHZhbGlkVHlwZXMsIGZpZWxkKSA9PlxuICB2YWxpZFR5cGVzLmZpbmQoZXF1YWxzKGZpZWxkLnR5cGUpKVxuICAgID8gRWl0aGVyLlJpZ2h0KGZpZWxkKVxuICAgIDogRWl0aGVyLkxlZnQoYEludmFsaWQgZmllbGQgdHlwZSAke2ZpZWxkLnR5cGV9YClcbik7XG5cbmNvbnN0IHZhbGlkRmllbGRUeXBlcyA9IGN1cnJ5KCh2YWxpZFR5cGVzLCBmaWVsZHNTdGF0ZSkgPT5cbiAgdHJhdmVyc2UoRWl0aGVyLm9mLCBmaWVsZFR5cGVJc1ZhbGlkKHZhbGlkVHlwZXMpLCBmaWVsZHNTdGF0ZSlcbik7XG5cblxuLy8gW2FdIC0+IFthXSAtPiBFaXRoZXIgU3RyaW5nIFthXVxuY29uc3QgdmFsaWRhdGVGaWVsZHNTdGF0ZSA9IGN1cnJ5KChmaWVsZHNTdGF0ZSwgc3RhdGUpID0+XG4gIEVpdGhlci5vZihmaWVsZHNTdGF0ZSlcbiAgICAuY2hhaW4oaXNBcnJheSlcbiAgICAuY2hhaW4odmFsaWRGaWVsZFR5cGVzKHN0YXRlLmZpZWxkVHlwZXMubWFwKHBhdGgoW1wiaW5mb1wiLFwidHlwZVwiXSkpKSlcbik7XG5cblxuLy8gQWRkIHJlcXVpcmVkIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IG1hbmFnZWQgYnkgdGhlIGZpZWxkXG4vLyBjb21wb25lbnQgYnV0IGJ5IHRoZSBGb3JtQnVpbGRlciBjb21wb25lbnQgaXRzZWxmLCBzbyBtYXlcbi8vIG5vdCBiZSB0aGVyZS5cbi8vIFthXSA9PiBbYV1cbmNvbnN0IGFkZFJlcXVpcmVkUHJvcGVydGllcyA9IGZpZWxkU3RhdGVzID0+XG4gIGZpZWxkU3RhdGVzXG4gICAgLm1hcChzID0+IE9iamVjdC5hc3NpZ24oXG4gICAgICB7XG4gICAgICAgIGNvbmZpZ1Nob3dpbmc6IGZhbHNlLFxuICAgICAgICBpZDogY3JlYXRlSWQoKSxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgfSwgc1xuICAgICkpO1xuXG5cbi8vIElmIHRoZXJlIGFyZSBhbnkgcHJvYmxlbXMgd2l0aCB0aGUgaW1wb3J0LCB0aGUgc2FtZSBzdGF0ZVxuLy8gd2lsbCBiZSByZXR1cm5lZFxuZXhwb3J0IGRlZmF1bHQgKHN0YXRlLCB7IG5ld0ZpZWxkc1N0YXRlIH0pID0+XG4gIHZhbGlkYXRlRmllbGRzU3RhdGUobmV3RmllbGRzU3RhdGUsIHN0YXRlKVxuICAgIC5tYXAoYWRkUmVxdWlyZWRQcm9wZXJ0aWVzKVxuICAgIC5tYXAocHVzaEhpc3RvcnlTdGF0ZShzdGF0ZSkpXG4gICAgLmJpbWFwKGNvbnNvbGUuZXJyb3IsIGlkZW50aXR5KVxuICAgIC5nZXRPckVsc2Uoc3RhdGUpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfcmVkdWNlZCh4KSB7XG4gIHJldHVybiB4ICYmIHhbJ0BAdHJhbnNkdWNlci9yZWR1Y2VkJ10gPyB4IDpcbiAgICB7XG4gICAgICAnQEB0cmFuc2R1Y2VyL3ZhbHVlJzogeCxcbiAgICAgICdAQHRyYW5zZHVjZXIvcmVkdWNlZCc6IHRydWVcbiAgICB9O1xufTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9fY3VycnkyJyk7XG52YXIgX3JlZHVjZWQgPSByZXF1aXJlKCcuL19yZWR1Y2VkJyk7XG52YXIgX3hmQmFzZSA9IHJlcXVpcmUoJy4vX3hmQmFzZScpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBYRmluZChmLCB4Zikge1xuICAgIHRoaXMueGYgPSB4ZjtcbiAgICB0aGlzLmYgPSBmO1xuICAgIHRoaXMuZm91bmQgPSBmYWxzZTtcbiAgfVxuICBYRmluZC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBfeGZCYXNlLmluaXQ7XG4gIFhGaW5kLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLmZvdW5kKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgdm9pZCAwKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShyZXN1bHQpO1xuICB9O1xuICBYRmluZC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbihyZXN1bHQsIGlucHV0KSB7XG4gICAgaWYgKHRoaXMuZihpbnB1dCkpIHtcbiAgICAgIHRoaXMuZm91bmQgPSB0cnVlO1xuICAgICAgcmVzdWx0ID0gX3JlZHVjZWQodGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGlucHV0KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3hmaW5kKGYsIHhmKSB7IHJldHVybiBuZXcgWEZpbmQoZiwgeGYpOyB9KTtcbn0oKSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIF9kaXNwYXRjaGFibGUgPSByZXF1aXJlKCcuL2ludGVybmFsL19kaXNwYXRjaGFibGUnKTtcbnZhciBfeGZpbmQgPSByZXF1aXJlKCcuL2ludGVybmFsL194ZmluZCcpO1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgbGlzdCB3aGljaCBtYXRjaGVzIHRoZSBwcmVkaWNhdGUsIG9yXG4gKiBgdW5kZWZpbmVkYCBpZiBubyBlbGVtZW50IG1hdGNoZXMuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYGZpbmRgIG1ldGhvZCBvZiB0aGUgc2Vjb25kIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBhIHwgdW5kZWZpbmVkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJlZGljYXRlIGZ1bmN0aW9uIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoZSBlbGVtZW50IGlzIHRoZVxuICogICAgICAgIGRlc2lyZWQgb25lLlxuICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBlbGVtZW50IGZvdW5kLCBvciBgdW5kZWZpbmVkYC5cbiAqIEBzZWUgUi50cmFuc2R1Y2VcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgeHMgPSBbe2E6IDF9LCB7YTogMn0sIHthOiAzfV07XG4gKiAgICAgIFIuZmluZChSLnByb3BFcSgnYScsIDIpKSh4cyk7IC8vPT4ge2E6IDJ9XG4gKiAgICAgIFIuZmluZChSLnByb3BFcSgnYScsIDQpKSh4cyk7IC8vPT4gdW5kZWZpbmVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdmaW5kJywgX3hmaW5kLCBmdW5jdGlvbiBmaW5kKGZuLCBsaXN0KSB7XG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XG4gIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICBpZiAoZm4obGlzdFtpZHhdKSkge1xuICAgICAgcmV0dXJuIGxpc3RbaWR4XTtcbiAgICB9XG4gICAgaWR4ICs9IDE7XG4gIH1cbn0pKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiAqIEEgaGVscGVyIGZvciBkZWxheWluZyB0aGUgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uXG4gKiBAcHJpdmF0ZVxuICogQHN1bW1hcnkgKEFueS4uLiAtPiBBbnkpIC0+IFZvaWRcbiAqL1xudmFyIGRlbGF5ZWQgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJz8gIHNldEltbWVkaWF0ZVxuICAgICAgICAgICAgOiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCc/ICAgICAgIHByb2Nlc3MubmV4dFRpY2tcbiAgICAgICAgICAgIDogLyogb3RoZXJ3aXNlICovICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0XG5cbi8qKlxuICogQG1vZHVsZSBsaWIvdGFza1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IFRhc2s7XG5cbi8vIC0tIEltcGxlbWVudGF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRoZSBgVGFza1vOsSwgzrJdYCBzdHJ1Y3R1cmUgcmVwcmVzZW50cyB2YWx1ZXMgdGhhdCBkZXBlbmQgb24gdGltZS4gVGhpc1xuICogYWxsb3dzIG9uZSB0byBtb2RlbCB0aW1lLWJhc2VkIGVmZmVjdHMgZXhwbGljaXRseSwgc3VjaCB0aGF0IG9uZSBjYW4gaGF2ZVxuICogZnVsbCBrbm93bGVkZ2Ugb2Ygd2hlbiB0aGV5J3JlIGRlYWxpbmcgd2l0aCBkZWxheWVkIGNvbXB1dGF0aW9ucywgbGF0ZW5jeSxcbiAqIG9yIGFueXRoaW5nIHRoYXQgY2FuIG5vdCBiZSBjb21wdXRlZCBpbW1lZGlhdGVseS5cbiAqXG4gKiBBIGNvbW1vbiB1c2UgZm9yIHRoaXMgc3RydWN0dXJlIGlzIHRvIHJlcGxhY2UgdGhlIHVzdWFsIENvbnRpbnVhdGlvbi1QYXNzaW5nXG4gKiBTdHlsZSBmb3JtIG9mIHByb2dyYW1taW5nLCBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGNvbXBvc2UgYW5kIHNlcXVlbmNlXG4gKiB0aW1lLWRlcGVuZGVudCBlZmZlY3RzIHVzaW5nIHRoZSBnZW5lcmljIGFuZCBwb3dlcmZ1bCBtb25hZGljIG9wZXJhdGlvbnMuXG4gKlxuICogQGNsYXNzXG4gKiBAc3VtbWFyeVxuICogKCjOsSDihpIgVm9pZCksICjOsiDihpIgVm9pZCkg4oaSIFZvaWQpLCAoVm9pZCDihpIgVm9pZCkg4oaSIFRhc2tbzrEsIM6yXVxuICpcbiAqIFRhc2tbzrEsIM6yXSA8OiBDaGFpblvOsl1cbiAqICAgICAgICAgICAgICAgLCBNb25hZFvOsl1cbiAqICAgICAgICAgICAgICAgLCBGdW5jdG9yW86yXVxuICogICAgICAgICAgICAgICAsIEFwcGxpY2F0aXZlW86yXVxuICogICAgICAgICAgICAgICAsIFNlbWlncm91cFvOsl1cbiAqICAgICAgICAgICAgICAgLCBNb25vaWRbzrJdXG4gKiAgICAgICAgICAgICAgICwgU2hvd1xuICovXG5mdW5jdGlvbiBUYXNrKGNvbXB1dGF0aW9uLCBjbGVhbnVwKSB7XG4gIHRoaXMuZm9yayA9IGNvbXB1dGF0aW9uO1xuXG4gIHRoaXMuY2xlYW51cCA9IGNsZWFudXAgfHwgZnVuY3Rpb24oKSB7fTtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBUYXNrW86xLCDOsl1gIGNvbnRhaW5pbmcgdGhlIHNpbmdsZSB2YWx1ZSBgzrJgLlxuICpcbiAqIGDOsmAgY2FuIGJlIGFueSB2YWx1ZSwgaW5jbHVkaW5nIGBudWxsYCwgYHVuZGVmaW5lZGAsIG9yIGFub3RoZXJcbiAqIGBUYXNrW86xLCDOsl1gIHN0cnVjdHVyZS5cbiAqXG4gKiBAc3VtbWFyeSDOsiDihpIgVGFza1vOsSwgzrJdXG4gKi9cblRhc2sucHJvdG90eXBlLm9mID0gZnVuY3Rpb24gX29mKGIpIHtcbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKF8sIHJlc29sdmUpIHtcbiAgICByZXR1cm4gcmVzb2x2ZShiKTtcbiAgfSk7XG59O1xuXG5UYXNrLm9mID0gVGFzay5wcm90b3R5cGUub2Y7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgVGFza1vOsSwgzrJdYCBjb250YWluaW5nIHRoZSBzaW5nbGUgdmFsdWUgYM6xYC5cbiAqXG4gKiBgzrFgIGNhbiBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAsIGB1bmRlZmluZWRgLCBvciBhbm90aGVyXG4gKiBgVGFza1vOsSwgzrJdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrEg4oaSIFRhc2tbzrEsIM6yXVxuICovXG5UYXNrLnByb3RvdHlwZS5yZWplY3RlZCA9IGZ1bmN0aW9uIF9yZWplY3RlZChhKSB7XG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QpIHtcbiAgICByZXR1cm4gcmVqZWN0KGEpO1xuICB9KTtcbn07XG5cblRhc2sucmVqZWN0ZWQgPSBUYXNrLnByb3RvdHlwZS5yZWplY3RlZDtcblxuLy8gLS0gRnVuY3RvciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgc3VjY2Vzc2Z1bCB2YWx1ZSBvZiB0aGUgYFRhc2tbzrEsIM6yXWAgdXNpbmcgYSByZWd1bGFyIHVuYXJ5XG4gKiBmdW5jdGlvbi5cbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+ICjOsiDihpIgzrMpIOKGkiBUYXNrW86xLCDOs11cbiAqL1xuVGFzay5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gX21hcChmKSB7XG4gIHZhciBmb3JrID0gdGhpcy5mb3JrO1xuICB2YXIgY2xlYW51cCA9IHRoaXMuY2xlYW51cDtcblxuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlKSB7XG4gICAgcmV0dXJuIGZvcmsoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIHJlamVjdChhKTtcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShmKGIpKTtcbiAgICB9KTtcbiAgfSwgY2xlYW51cCk7XG59O1xuXG4vLyAtLSBDaGFpbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSBzdWNjZXNmdWwgdmFsdWUgb2YgdGhlIGBUYXNrW86xLCDOsl1gIHVzaW5nIGEgZnVuY3Rpb24gdG8gYVxuICogbW9uYWQuXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiAozrIg4oaSIFRhc2tbzrEsIM6zXSkg4oaSIFRhc2tbzrEsIM6zXVxuICovXG5UYXNrLnByb3RvdHlwZS5jaGFpbiA9IGZ1bmN0aW9uIF9jaGFpbihmKSB7XG4gIHZhciBmb3JrID0gdGhpcy5mb3JrO1xuICB2YXIgY2xlYW51cCA9IHRoaXMuY2xlYW51cDtcblxuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlKSB7XG4gICAgcmV0dXJuIGZvcmsoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIHJlamVjdChhKTtcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gZihiKS5mb3JrKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLy8gLS0gQXBwbHkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQXBwbHlzIHRoZSBzdWNjZXNzZnVsIHZhbHVlIG9mIHRoZSBgVGFza1vOsSwgKM6yIOKGkiDOsyldYCB0byB0aGUgc3VjY2Vzc2Z1bFxuICogdmFsdWUgb2YgdGhlIGBUYXNrW86xLCDOsl1gXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsICjOsiDihpIgzrMpXSA9PiBUYXNrW86xLCDOsl0g4oaSIFRhc2tbzrEsIM6zXVxuICovXG5cblRhc2sucHJvdG90eXBlLmFwID0gZnVuY3Rpb24gX2FwKHRoYXQpIHtcbiAgdmFyIGZvcmtUaGlzID0gdGhpcy5mb3JrO1xuICB2YXIgZm9ya1RoYXQgPSB0aGF0LmZvcms7XG4gIHZhciBjbGVhbnVwVGhpcyA9IHRoaXMuY2xlYW51cDtcbiAgdmFyIGNsZWFudXBUaGF0ID0gdGhhdC5jbGVhbnVwO1xuXG4gIGZ1bmN0aW9uIGNsZWFudXBCb3RoKHN0YXRlKSB7XG4gICAgY2xlYW51cFRoaXMoc3RhdGVbMF0pO1xuICAgIGNsZWFudXBUaGF0KHN0YXRlWzFdKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICB2YXIgZnVuYywgZnVuY0xvYWRlZCA9IGZhbHNlO1xuICAgIHZhciB2YWwsIHZhbExvYWRlZCA9IGZhbHNlO1xuICAgIHZhciByZWplY3RlZCA9IGZhbHNlO1xuICAgIHZhciBhbGxTdGF0ZTtcblxuICAgIHZhciB0aGlzU3RhdGUgPSBmb3JrVGhpcyhndWFyZFJlamVjdCwgZ3VhcmRSZXNvbHZlKGZ1bmN0aW9uKHgpIHtcbiAgICAgIGZ1bmNMb2FkZWQgPSB0cnVlO1xuICAgICAgZnVuYyA9IHg7XG4gICAgfSkpO1xuXG4gICAgdmFyIHRoYXRTdGF0ZSA9IGZvcmtUaGF0KGd1YXJkUmVqZWN0LCBndWFyZFJlc29sdmUoZnVuY3Rpb24oeCkge1xuICAgICAgdmFsTG9hZGVkID0gdHJ1ZTtcbiAgICAgIHZhbCA9IHg7XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gZ3VhcmRSZXNvbHZlKHNldHRlcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0dGVyKHgpO1xuICAgICAgICBpZiAoZnVuY0xvYWRlZCAmJiB2YWxMb2FkZWQpIHtcbiAgICAgICAgICBkZWxheWVkKGZ1bmN0aW9uKCl7IGNsZWFudXBCb3RoKGFsbFN0YXRlKSB9KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShmdW5jKHZhbCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ3VhcmRSZWplY3QoeCkge1xuICAgICAgaWYgKCFyZWplY3RlZCkge1xuICAgICAgICByZWplY3RlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiByZWplY3QoeCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFsbFN0YXRlID0gW3RoaXNTdGF0ZSwgdGhhdFN0YXRlXTtcbiAgfSwgY2xlYW51cEJvdGgpO1xufTtcblxuLy8gLS0gU2VtaWdyb3VwIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFNlbGVjdHMgdGhlIGVhcmxpZXIgb2YgdGhlIHR3byB0YXNrcyBgVGFza1vOsSwgzrJdYFxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCDOsl0gPT4gVGFza1vOsSwgzrJdIOKGkiBUYXNrW86xLCDOsl1cbiAqL1xuXG5UYXNrLnByb3RvdHlwZS5jb25jYXQgPSBmdW5jdGlvbiBfY29uY2F0KHRoYXQpIHtcbiAgdmFyIGZvcmtUaGlzID0gdGhpcy5mb3JrO1xuICB2YXIgZm9ya1RoYXQgPSB0aGF0LmZvcms7XG4gIHZhciBjbGVhbnVwVGhpcyA9IHRoaXMuY2xlYW51cDtcbiAgdmFyIGNsZWFudXBUaGF0ID0gdGhhdC5jbGVhbnVwO1xuXG4gIGZ1bmN0aW9uIGNsZWFudXBCb3RoKHN0YXRlKSB7XG4gICAgY2xlYW51cFRoaXMoc3RhdGVbMF0pO1xuICAgIGNsZWFudXBUaGF0KHN0YXRlWzFdKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgIHZhciBhbGxTdGF0ZTtcbiAgICB2YXIgdGhpc1N0YXRlID0gZm9ya1RoaXMoZ3VhcmQocmVqZWN0KSwgZ3VhcmQocmVzb2x2ZSkpO1xuICAgIHZhciB0aGF0U3RhdGUgPSBmb3JrVGhhdChndWFyZChyZWplY3QpLCBndWFyZChyZXNvbHZlKSk7XG5cbiAgICByZXR1cm4gYWxsU3RhdGUgPSBbdGhpc1N0YXRlLCB0aGF0U3RhdGVdO1xuXG4gICAgZnVuY3Rpb24gZ3VhcmQoZikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgaWYgKCFkb25lKSB7XG4gICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgZGVsYXllZChmdW5jdGlvbigpeyBjbGVhbnVwQm90aChhbGxTdGF0ZSkgfSlcbiAgICAgICAgICByZXR1cm4gZih4KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH0sIGNsZWFudXBCb3RoKTtcblxufTtcblxuLy8gLS0gTW9ub2lkIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFJldHVybnMgYSBUYXNrIHRoYXQgd2lsbCBuZXZlciByZXNvbHZlXG4gKlxuICogQHN1bW1hcnkgVm9pZCDihpIgVGFza1vOsSwgX11cbiAqL1xuVGFzay5lbXB0eSA9IGZ1bmN0aW9uIF9lbXB0eSgpIHtcbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKCkge30pO1xufTtcblxuVGFzay5wcm90b3R5cGUuZW1wdHkgPSBUYXNrLmVtcHR5O1xuXG4vLyAtLSBTaG93IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYFRhc2tbzrEsIM6yXWBcbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+IFZvaWQg4oaSIFN0cmluZ1xuICovXG5UYXNrLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIF90b1N0cmluZygpIHtcbiAgcmV0dXJuICdUYXNrJztcbn07XG5cbi8vIC0tIEV4dHJhY3RpbmcgYW5kIHJlY292ZXJpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRyYW5zZm9ybXMgYSBmYWlsdXJlIHZhbHVlIGludG8gYSBuZXcgYFRhc2tbzrEsIM6yXWAuIERvZXMgbm90aGluZyBpZiB0aGVcbiAqIHN0cnVjdHVyZSBhbHJlYWR5IGNvbnRhaW5zIGEgc3VjY2Vzc2Z1bCB2YWx1ZS5cbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+ICjOsSDihpIgVGFza1vOsywgzrJdKSDihpIgVGFza1vOsywgzrJdXG4gKi9cblRhc2sucHJvdG90eXBlLm9yRWxzZSA9IGZ1bmN0aW9uIF9vckVsc2UoZikge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiBmKGEpLmZvcmsocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShiKTtcbiAgICB9KTtcbiAgfSwgY2xlYW51cCk7XG59O1xuXG4vLyAtLSBGb2xkcyBhbmQgZXh0ZW5kZWQgdHJhbnNmb3JtYXRpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDYXRhbW9ycGhpc20uIFRha2VzIHR3byBmdW5jdGlvbnMsIGFwcGxpZXMgdGhlIGxlZnRtb3N0IG9uZSB0byB0aGUgZmFpbHVyZVxuICogdmFsdWUsIGFuZCB0aGUgcmlnaHRtb3N0IG9uZSB0byB0aGUgc3VjY2Vzc2Z1bCB2YWx1ZSwgZGVwZW5kaW5nIG9uIHdoaWNoIG9uZVxuICogaXMgcHJlc2VudC5cbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+ICjOsSDihpIgzrMpLCAozrIg4oaSIM6zKSDihpIgVGFza1vOtCwgzrNdXG4gKi9cblRhc2sucHJvdG90eXBlLmZvbGQgPSBmdW5jdGlvbiBfZm9sZChmLCBnKSB7XG4gIHZhciBmb3JrID0gdGhpcy5mb3JrO1xuICB2YXIgY2xlYW51cCA9IHRoaXMuY2xlYW51cDtcblxuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlKSB7XG4gICAgcmV0dXJuIGZvcmsoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIHJlc29sdmUoZihhKSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIHJlc29sdmUoZyhiKSk7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLyoqXG4gKiBDYXRhbW9ycGhpc20uXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiB7IFJlamVjdGVkOiDOsSDihpIgzrMsIFJlc29sdmVkOiDOsiDihpIgzrMgfSDihpIgVGFza1vOtCwgzrNdXG4gKi9cblRhc2sucHJvdG90eXBlLmNhdGEgPSBmdW5jdGlvbiBfY2F0YShwYXR0ZXJuKSB7XG4gIHJldHVybiB0aGlzLmZvbGQocGF0dGVybi5SZWplY3RlZCwgcGF0dGVybi5SZXNvbHZlZCk7XG59O1xuXG4vKipcbiAqIFN3YXBzIHRoZSBkaXNqdW5jdGlvbiB2YWx1ZXMuXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiBWb2lkIOKGkiBUYXNrW86yLCDOsV1cbiAqL1xuVGFzay5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uIF9zd2FwKCkge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGEpO1xuICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiByZWplY3QoYik7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLyoqXG4gKiBNYXBzIGJvdGggc2lkZXMgb2YgdGhlIGRpc2p1bmN0aW9uLlxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCDOsl0gPT4gKM6xIOKGkiDOsyksICjOsiDihpIgzrQpIOKGkiBUYXNrW86zLCDOtF1cbiAqL1xuVGFzay5wcm90b3R5cGUuYmltYXAgPSBmdW5jdGlvbiBfYmltYXAoZiwgZykge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZWplY3QoZihhKSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIHJlc29sdmUoZyhiKSk7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLyoqXG4gKiBNYXBzIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIGRpc2p1bmN0aW9uIChmYWlsdXJlKS5cbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+ICjOsSDihpIgzrMpIOKGkiBUYXNrW86zLCDOsl1cbiAqL1xuVGFzay5wcm90b3R5cGUucmVqZWN0ZWRNYXAgPSBmdW5jdGlvbiBfcmVqZWN0ZWRNYXAoZikge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZWplY3QoZihhKSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIHJlc29sdmUoYik7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi90YXNrJyk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5pbXBvcnQgeyBwcm9wLCBmaW5kLCBpZGVudGl0eSwgcGlwZSB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IHsgY3JlYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IEVpdGhlciBmcm9tIFwiZGF0YS5laXRoZXJcIjtcbmltcG9ydCBUYXNrIGZyb20gXCJkYXRhLnRhc2tcIjtcbmltcG9ydCBJbW11dGFibGUgZnJvbSBcInNlYW1sZXNzLWltbXV0YWJsZVwiO1xuaW1wb3J0IHsgZmllbGRDcmVhdGVkIH0gZnJvbSBcIi4uL0FjdGlvbnNcIjtcblxuLy8gU3RhdGUgLT4gU3RyaW5nIC0+IEVpdGhlciBTdHJpbmcgRnVuY3Rpb25cbmNvbnN0IHR5cGVDb25zdHJ1Y3RvciA9IChzdGF0ZSwgZmllbGRUeXBlKSA9PiB7XG4gIHJldHVybiBFaXRoZXIub2Yoc3RhdGUpXG4gICAgLm1hcChwcm9wKFwiZmllbGRUeXBlc1wiKSlcbiAgICAubWFwKGZpbmQodiA9PiB2LmluZm8udHlwZSA9PT0gZmllbGRUeXBlKSlcbiAgICAuY2hhaW4oRWl0aGVyLmZyb21OdWxsYWJsZSlcbiAgICAuYmltYXAoXyA9PiBgRmllbGQgXCIke2ZpZWxkVHlwZX1cIiBkb2VzIG5vdCBleGlzdC5gLCBpZGVudGl0eSk7XG59O1xuXG4vLyB7IGluaXRpYWxTdGF0ZTogRnVuY3Rpb24gfSAtPiBUYXNrIFN0cmluZyBPYmplY3RcbmNvbnN0IGNyZWF0ZUZpZWxkID0gY29uc3RyID0+XG4gIG5ldyBUYXNrKChyZWplY3QsIHJlc29sdmUpID0+IHtcbiAgICAvLyBNYWtlIHN1cmUgdGhlIHByb21pc2UgaXMgb25seSByZXNvbHZlZCBvbmNlXG4gICAgbGV0IGNhbGxlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGZpZWxkU3RhdGUgPSBjb25zdHIuaW5pdGlhbFN0YXRlKCk7XG5cbiAgICBpZiAoIShmaWVsZFN0YXRlIGluc3RhbmNlb2YgUHJvbWlzZSkpIHtcbiAgICAgIHJlc29sdmUoZmllbGRTdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpZWxkU3RhdGVcbiAgICAgIC50aGVuKHYgPT4ge1xuICAgICAgICBpZiAoY2FsbGVkKSB7IHJldHVybjsgfVxuICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHYpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCh2ID0+IHtcbiAgICAgICAgaWYgKGNhbGxlZCkgeyB0aHJvdyB2OyB9XG4gICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgIHJlamVjdCh2KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbi8vIE9iamVjdCAtPiBPYmplY3RcbmNvbnN0IGluc2VydFJlcXVpcmVkUHJvcHMgPSBmaWVsZCA9PlxuICBJbW11dGFibGUoZmllbGQpLm1lcmdlKHtcbiAgICBpZDogY3JlYXRlSWQoKSxcbiAgICBjb25maWdTaG93aW5nOiB0cnVlLFxuICB9LCB7XG4gICAgZGVlcDogdHJ1ZSxcbiAgfSk7XG5cbmNvbnN0IGNyZWF0ZUZpZWxkQXN5bmNocm9ub3VzbHkgPSAoc3RhdGUsIGZpZWxkVHlwZSwgYXN5bmNEaXNwYXRjaCkgPT5cbiAgdHlwZUNvbnN0cnVjdG9yKHN0YXRlLCBmaWVsZFR5cGUpXG4gIC5tYXAoY3JlYXRlRmllbGQpIC8vIEVpdGhlciBTdHJpbmcgKFRhc2sgU3RyaW5nIE9iamVjdClcbiAgLmxlZnRNYXAoVGFzay5yZWplY3RlZClcbiAgLm1lcmdlKCkgLy8gVGFzayBTdHJpbmcgT2JqZWN0XG4gIC5tYXAoaW5zZXJ0UmVxdWlyZWRQcm9wcylcbiAgLmZvcmsoIC8vIGV4ZWN1dGUgdGFza1xuICAgIGVyciA9PiBjb25zb2xlLmVycm9yKFwiVGFzayByZWplY3RlZFwiLCBlcnIpLFxuICAgIHBpcGUoZmllbGRDcmVhdGVkLCBhc3luY0Rpc3BhdGNoKVxuICApO1xuXG4vLyBUaGlzIGlzIGFuIGFzeW5jIGFjdGlvbi4gV2hlbiBpdCBpcyBmaW5pc2hlZCBpdCB3aWxsIHRyaWdnZXIgdGhlXG4vLyBmaWVsZCBjcmVhdGVkIGFjdGlvblxuZXhwb3J0IGRlZmF1bHQgKHN0YXRlLCB7IGZpZWxkVHlwZSwgYXN5bmNEaXNwYXRjaCB9KSA9PiB7XG4gIGNyZWF0ZUZpZWxkQXN5bmNocm9ub3VzbHkoc3RhdGUsIGZpZWxkVHlwZSwgYXN5bmNEaXNwYXRjaCk7XG4gIHJldHVybiBzdGF0ZTtcbn07XG4iLCJ2YXIgX2NvbmNhdCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2NvbmNhdCcpO1xudmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gbGlzdCwgZm9sbG93ZWQgYnlcbiAqIHRoZSBnaXZlbiBlbGVtZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgYSAtPiBbYV0gLT4gW2FdXG4gKiBAcGFyYW0geyp9IGVsIFRoZSBlbGVtZW50IHRvIGFkZCB0byB0aGUgZW5kIG9mIHRoZSBuZXcgbGlzdC5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3Qgd2hvc2UgY29udGVudHMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBvdXRwdXRcbiAqICAgICAgICBsaXN0LlxuICogQHJldHVybiB7QXJyYXl9IEEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgY29udGVudHMgb2YgdGhlIG9sZCBsaXN0IGZvbGxvd2VkIGJ5IGBlbGAuXG4gKiBAc2VlIFIucHJlcGVuZFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuYXBwZW5kKCd0ZXN0cycsIFsnd3JpdGUnLCAnbW9yZSddKTsgLy89PiBbJ3dyaXRlJywgJ21vcmUnLCAndGVzdHMnXVxuICogICAgICBSLmFwcGVuZCgndGVzdHMnLCBbXSk7IC8vPT4gWyd0ZXN0cyddXG4gKiAgICAgIFIuYXBwZW5kKFsndGVzdHMnXSwgWyd3cml0ZScsICdtb3JlJ10pOyAvLz0+IFsnd3JpdGUnLCAnbW9yZScsIFsndGVzdHMnXV1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGFwcGVuZChlbCwgbGlzdCkge1xuICByZXR1cm4gX2NvbmNhdChsaXN0LCBbZWxdKTtcbn0pO1xuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTQgUXVpbGRyZWVuIE1vdHRhIDxxdWlsZHJlZW5AZ21haWwuY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4vLyBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuLy8gKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuLy8gaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbi8vIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4vLyBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuLy8gc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbi8vIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4vLyBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4vLyBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4vLyBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4vLyBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vKipcbiAqIEBtb2R1bGUgbGliL21heWJlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gTWF5YmVcblxuLy8gLS0gQWxpYXNlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY2xvbmUgICAgICAgICA9IE9iamVjdC5jcmVhdGVcbnZhciB1bmltcGxlbWVudGVkID0gZnVuY3Rpb24oKXsgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQuJykgfVxudmFyIG5vb3AgICAgICAgICAgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpcyAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbi8vIC0tIEltcGxlbWVudGF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIEEgc3RydWN0dXJlIGZvciB2YWx1ZXMgdGhhdCBtYXkgbm90IGJlIHByZXNlbnQsIG9yIGNvbXB1dGF0aW9ucyB0aGF0IG1heVxuICogZmFpbC4gYE1heWJlKGEpYCBleHBsaWNpdGx5IG1vZGVscyB0aGUgZWZmZWN0cyB0aGF0IGFyZSBpbXBsaWNpdCBpblxuICogYE51bGxhYmxlYCB0eXBlcywgdGh1cyBoYXMgbm9uZSBvZiB0aGUgcHJvYmxlbXMgYXNzb2NpYXRlZCB3aXRoXG4gKiBgbnVsbGAgb3IgYHVuZGVmaW5lZGAg4oCUIGxpa2UgYE51bGxQb2ludGVyRXhjZXB0aW9uc2AuXG4gKlxuICogVGhlIGNsYXNzIG1vZGVscyB0d28gZGlmZmVyZW50IGNhc2VzOlxuICpcbiAqICArIGBKdXN0IGFgIOKAlCByZXByZXNlbnRzIGEgYE1heWJlKGEpYCB0aGF0IGNvbnRhaW5zIGEgdmFsdWUuIGBhYCBtYXlcbiAqICAgICBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAuXG4gKlxuICogICsgYE5vdGhpbmdgIOKAlCByZXByZXNlbnRzIGEgYE1heWJlKGEpYCB0aGF0IGhhcyBubyB2YWx1ZXMuIE9yIGFcbiAqICAgICBmYWlsdXJlIHRoYXQgbmVlZHMgbm8gYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqXG4gKiBDb21tb24gdXNlcyBvZiB0aGlzIHN0cnVjdHVyZSBpbmNsdWRlcyBtb2RlbGxpbmcgdmFsdWVzIHRoYXQgbWF5IG9yIG1heVxuICogbm90IGJlIHByZXNlbnQgaW4gYSBjb2xsZWN0aW9uLCB0aHVzIGluc3RlYWQgb2YgbmVlZGluZyBhXG4gKiBgY29sbGVjdGlvbi5oYXMoYSlgLCB0aGUgYGNvbGxlY3Rpb24uZ2V0KGEpYCBvcGVyYXRpb24gZ2l2ZXMgeW91IGFsbFxuICogdGhlIGluZm9ybWF0aW9uIHlvdSBuZWVkIOKAlCBgY29sbGVjdGlvbi5nZXQoYSkuaXMtbm90aGluZ2AgYmVpbmdcbiAqIGVxdWl2YWxlbnQgdG8gYGNvbGxlY3Rpb24uaGFzKGEpYDsgU2ltaWxhcmx5IHRoZSBzYW1lIHJlYXNvbmluZyBtYXlcbiAqIGJlIGFwcGxpZWQgdG8gY29tcHV0YXRpb25zIHRoYXQgbWF5IGZhaWwgdG8gcHJvdmlkZSBhIHZhbHVlLCBlLmcuOlxuICogYGNvbGxlY3Rpb24uZmluZChwcmVkaWNhdGUpYCBjYW4gc2FmZWx5IHJldHVybiBhIGBNYXliZShhKWAgaW5zdGFuY2UsXG4gKiBldmVuIGlmIHRoZSBjb2xsZWN0aW9uIGNvbnRhaW5zIG51bGxhYmxlIHZhbHVlcy5cbiAqXG4gKiBGdXJ0aGVybW9yZSwgdGhlIHZhbHVlcyBvZiBgTWF5YmUoYSlgIGNhbiBiZSBjb21iaW5lZCBhbmQgbWFuaXB1bGF0ZWRcbiAqIGJ5IHVzaW5nIHRoZSBleHByZXNzaXZlIG1vbmFkaWMgb3BlcmF0aW9ucy4gVGhpcyBhbGxvd3Mgc2FmZWx5XG4gKiBzZXF1ZW5jaW5nIG9wZXJhdGlvbnMgdGhhdCBtYXkgZmFpbCwgYW5kIHNhZmVseSBjb21wb3NpbmcgdmFsdWVzIHRoYXRcbiAqIHlvdSBkb24ndCBrbm93IHdoZXRoZXIgdGhleSdyZSBwcmVzZW50IG9yIG5vdCwgZmFpbGluZyBlYXJseVxuICogKHJldHVybmluZyBhIGBOb3RoaW5nYCkgaWYgYW55IG9mIHRoZSBvcGVyYXRpb25zIGZhaWwuXG4gKlxuICogSWYgb25lIHdhbnRzIHRvIHN0b3JlIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gYWJvdXQgZmFpbHVyZXMsIHRoZVxuICogW0VpdGhlcl1bXSBhbmQgW1ZhbGlkYXRpb25dW10gc3RydWN0dXJlcyBwcm92aWRlIHN1Y2ggYSBjYXBhYmlsaXR5LCBhbmRcbiAqIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIGBNYXliZShhKWAgc3RydWN0dXJlLlxuICpcbiAqIFtFaXRoZXJdOiBodHRwczovL2dpdGh1Yi5jb20vZm9sa3RhbGUvZGF0YS5laXRoZXJcbiAqIFtWYWxpZGF0aW9uXTogaHR0cHM6Ly9naXRodWIuY29tL2ZvbGt0YWxlL2RhdGEudmFsaWRhdGlvblxuICpcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gTWF5YmUoKSB7fVxuXG4vLyBUaGUgY2FzZSBmb3Igc3VjY2Vzc2Z1bCB2YWx1ZXNcbkp1c3QucHJvdG90eXBlID0gY2xvbmUoTWF5YmUucHJvdG90eXBlKVxuZnVuY3Rpb24gSnVzdChhKXtcbiAgdGhpcy52YWx1ZSA9IGFcbn1cblxuLy8gVGhlIGNhc2UgZm9yIGZhaWx1cmUgdmFsdWVzXG5Ob3RoaW5nLnByb3RvdHlwZSA9IGNsb25lKE1heWJlLnByb3RvdHlwZSlcbmZ1bmN0aW9uIE5vdGhpbmcoKXt9XG5cblxuLy8gLS0gQ29uc3RydWN0b3JzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgd2l0aCBhbiBhYnNlbnQgdmFsdWUuIENvbW1vbmx5IHVzZWRcbiAqIHRvIHJlcHJlc2VudCBhIGZhaWx1cmUuXG4gKlxuICogQHN1bW1hcnkgVm9pZCDihpIgTWF5YmVbzrFdXG4gKi9cbk1heWJlLk5vdGhpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBOb3RoaW5nXG59XG5NYXliZS5wcm90b3R5cGUuTm90aGluZyA9IE1heWJlLk5vdGhpbmdcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBNYXliZVvOsV1gIHN0cnVjdHVyZSB0aGF0IGhvbGRzIHRoZSBzaW5nbGUgdmFsdWVcbiAqIGDOsWAuIENvbW1vbmx5IHVzZWQgdG8gcmVwcmVzZW50IGEgc3VjY2Vzcy5cbiAqXG4gKiBgzrFgIGNhbiBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAsIGB1bmRlZmluZWRgIG9yIGFub3RoZXJcbiAqIGBNYXliZVvOsV1gIHN0cnVjdHVyZS5cbiAqXG4gKiBAc3VtbWFyeSDOsSDihpIgTWF5YmVbzrFdXG4gKi9cbk1heWJlLkp1c3QgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBuZXcgSnVzdChhKVxufVxuTWF5YmUucHJvdG90eXBlLkp1c3QgPSBNYXliZS5KdXN0XG5cblxuLy8gLS0gQ29udmVyc2lvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgZnJvbSBhIG51bGxhYmxlIHR5cGUuXG4gKlxuICogSWYgdGhlIHZhbHVlIGlzIGVpdGhlciBgbnVsbGAgb3IgYHVuZGVmaW5lZGAsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBhXG4gKiBgTm90aGluZ2AsIG90aGVyd2lzZSB0aGUgdmFsdWUgaXMgd3JhcHBlZCBpbiBhIGBKdXN0KM6xKWAuXG4gKlxuICogQHN1bW1hcnkgzrEg4oaSIE1heWJlW86xXVxuICovXG5NYXliZS5mcm9tTnVsbGFibGUgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBhICE9IG51bGw/ICAgICAgIG5ldyBKdXN0KGEpXG4gIDogICAgICAvKiBvdGhlcndpc2UgKi8gIG5ldyBOb3RoaW5nXG59XG5NYXliZS5wcm90b3R5cGUuZnJvbU51bGxhYmxlID0gTWF5YmUuZnJvbU51bGxhYmxlXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgTWF5YmVbzrJdYCBzdHJ1Y3R1cmUgZnJvbSBhbiBgRWl0aGVyW86xLCDOsl1gIHR5cGUuXG4gKlxuICogVGhlIGxlZnQgc2lkZSBvZiB0aGUgYEVpdGhlcmAgYmVjb21lcyBgTm90aGluZ2AsIGFuZCB0aGUgcmlnaHQgc2lkZVxuICogaXMgd3JhcHBlZCBpbiBhIGBKdXN0KM6yKWAuXG4gKlxuICogQHN1bW1hcnkgRWl0aGVyW86xLCDOsl0g4oaSIE1heWJlW86yXVxuICovXG5NYXliZS5mcm9tRWl0aGVyID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYS5mb2xkKE1heWJlLk5vdGhpbmcsIE1heWJlLkp1c3QpXG59XG5NYXliZS5wcm90b3R5cGUuZnJvbUVpdGhlciA9IE1heWJlLmZyb21FaXRoZXJcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBNYXliZVvOsl1gIHN0cnVjdHVyZSBmcm9tIGEgYFZhbGlkYXRpb25bzrEsIM6yXWAgdHlwZS5cbiAqXG4gKiBUaGUgZmFpbHVyZSBzaWRlIG9mIHRoZSBgVmFsaWRhdGlvbmAgYmVjb21lcyBgTm90aGluZ2AsIGFuZCB0aGUgcmlnaHRcbiAqIHNpZGUgaXMgd3JhcHBlZCBpbiBhIGBKdXN0KM6yKWAuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgVmFsaWRhdGlvblvOsSwgzrJdIOKGkiBNYXliZVvOsl1cbiAqL1xuTWF5YmUuZnJvbVZhbGlkYXRpb24gICAgICAgICAgID0gTWF5YmUuZnJvbUVpdGhlclxuTWF5YmUucHJvdG90eXBlLmZyb21WYWxpZGF0aW9uID0gTWF5YmUuZnJvbUVpdGhlclxuXG5cbi8vIC0tIFByZWRpY2F0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRydWUgaWYgdGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZSBjb250YWlucyBhIGZhaWx1cmUgKGkuZS46IGBOb3RoaW5nYCkuXG4gKlxuICogQHN1bW1hcnkgQm9vbGVhblxuICovXG5NYXliZS5wcm90b3R5cGUuaXNOb3RoaW5nICAgPSBmYWxzZVxuTm90aGluZy5wcm90b3R5cGUuaXNOb3RoaW5nID0gdHJ1ZVxuXG5cbi8qKlxuICogVHJ1ZSBpZiB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlIGNvbnRhaW5zIGEgc2luZ2xlIHZhbHVlIChpLmUuOiBgSnVzdCjOsSlgKS5cbiAqXG4gKiBAc3VtbWFyeSBCb29sZWFuXG4gKi9cbk1heWJlLnByb3RvdHlwZS5pc0p1c3QgPSBmYWxzZVxuSnVzdC5wcm90b3R5cGUuaXNKdXN0ICA9IHRydWVcblxuXG4vLyAtLSBBcHBsaWNhdGl2ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBNYXliZVvOsV1gIHN0cnVjdHVyZSBob2xkaW5nIHRoZSBzaW5nbGUgdmFsdWUgYM6xYC5cbiAqXG4gKiBgzrFgIGNhbiBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAsIGB1bmRlZmluZWRgLCBvciBhbm90aGVyXG4gKiBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrEg4oaSIE1heWJlW86xXVxuICovXG5NYXliZS5vZiA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIG5ldyBKdXN0KGEpXG59XG5NYXliZS5wcm90b3R5cGUub2YgPSBNYXliZS5vZlxuXG5cbi8qKlxuICogQXBwbGllcyB0aGUgZnVuY3Rpb24gaW5zaWRlIHRoZSBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgdG8gYW5vdGhlclxuICogYXBwbGljYXRpdmUgdHlwZS5cbiAqXG4gKiBUaGUgYE1heWJlW86xXWAgc3RydWN0dXJlIHNob3VsZCBjb250YWluIGEgZnVuY3Rpb24gdmFsdWUsIG90aGVyd2lzZSBhXG4gKiBgVHlwZUVycm9yYCBpcyB0aHJvd24uXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBNYXliZVvOsSDihpIgzrJdLCBmOkFwcGxpY2F0aXZlW19dKSA9PiBmW86xXSDihpIgZlvOsl1cbiAqL1xuTWF5YmUucHJvdG90eXBlLmFwID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5hcCA9IG5vb3BcblxuSnVzdC5wcm90b3R5cGUuYXAgPSBmdW5jdGlvbihiKSB7XG4gIHJldHVybiBiLm1hcCh0aGlzLnZhbHVlKVxufVxuXG5cblxuXG4vLyAtLSBGdW5jdG9yIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2YWx1ZSBvZiB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlIHVzaW5nIGEgcmVndWxhciB1bmFyeVxuICogZnVuY3Rpb24uXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgQE1heWJlW86xXSA9PiAozrEg4oaSIM6yKSDihpIgTWF5YmVbzrJdXG4gKi9cbk1heWJlLnByb3RvdHlwZS5tYXAgICA9IHVuaW1wbGVtZW50ZWRcbk5vdGhpbmcucHJvdG90eXBlLm1hcCA9IG5vb3BcblxuSnVzdC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gdGhpcy5vZihmKHRoaXMudmFsdWUpKVxufVxuXG5cbi8vIC0tIENoYWluIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHZhbHVlIG9mIHRoZSBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgdXNpbmcgYW4gdW5hcnkgZnVuY3Rpb25cbiAqIHRvIG1vbmFkcy5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQE1heWJlW86xXSwgbTpNb25hZFtfXSkgPT4gKM6xIOKGkiBtW86yXSkg4oaSIG1bzrJdXG4gKi9cbk1heWJlLnByb3RvdHlwZS5jaGFpbiAgID0gdW5pbXBsZW1lbnRlZFxuTm90aGluZy5wcm90b3R5cGUuY2hhaW4gPSBub29wXG5cbkp1c3QucHJvdG90eXBlLmNoYWluID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gZih0aGlzLnZhbHVlKVxufVxuXG5cbi8vIC0tIFNob3cgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFJldHVybnMgYSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgQE1heWJlW86xXSA9PiBWb2lkIOKGkiBTdHJpbmdcbiAqL1xuTWF5YmUucHJvdG90eXBlLnRvU3RyaW5nID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ01heWJlLk5vdGhpbmcnXG59XG5cbkp1c3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnTWF5YmUuSnVzdCgnICsgdGhpcy52YWx1ZSArICcpJ1xufVxuXG5cbi8vIC0tIEVxIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRlc3RzIGlmIGEgYE1heWJlW86xXWAgc3RydWN0dXJlIGlzIGVxdWFsIHRvIGFub3RoZXIgYE1heWJlW86xXWAgc3RydWN0dXJlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gTWF5YmVbzrFdIOKGkiBCb29sZWFuXG4gKi9cbk1heWJlLnByb3RvdHlwZS5pc0VxdWFsID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5pc0VxdWFsID0gZnVuY3Rpb24oYikge1xuICByZXR1cm4gYi5pc05vdGhpbmdcbn1cblxuSnVzdC5wcm90b3R5cGUuaXNFcXVhbCA9IGZ1bmN0aW9uKGIpIHtcbiAgcmV0dXJuIGIuaXNKdXN0XG4gICYmICAgICBiLnZhbHVlID09PSB0aGlzLnZhbHVlXG59XG5cblxuLy8gLS0gRXh0cmFjdGluZyBhbmQgcmVjb3ZlcmluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIHZhbHVlIG91dCBvZiB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlLCBpZiBpdFxuICogZXhpc3RzLiBPdGhlcndpc2UgdGhyb3dzIGEgYFR5cGVFcnJvcmAuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgQE1heWJlW86xXSA9PiBWb2lkIOKGkiBhLCAgICAgIDo6IHBhcnRpYWwsIHRocm93c1xuICogQHNlZSB7QGxpbmsgbW9kdWxlOmxpYi9tYXliZX5NYXliZSNnZXRPckVsc2V9IOKAlCBBIGdldHRlciB0aGF0IGNhbiBoYW5kbGUgZmFpbHVyZXNcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gaWYgdGhlIHN0cnVjdHVyZSBoYXMgbm8gdmFsdWUgKGBOb3RoaW5nYCkuXG4gKi9cbk1heWJlLnByb3RvdHlwZS5nZXQgPSB1bmltcGxlbWVudGVkXG5cbk5vdGhpbmcucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2FuJ3QgZXh0cmFjdCB0aGUgdmFsdWUgb2YgYSBOb3RoaW5nLlwiKVxufVxuXG5KdXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudmFsdWVcbn1cblxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSB2YWx1ZSBvdXQgb2YgdGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZS4gSWYgdGhlcmUgaXMgbm8gdmFsdWUsXG4gKiByZXR1cm5zIHRoZSBnaXZlbiBkZWZhdWx0LlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gzrEg4oaSIM6xXG4gKi9cbk1heWJlLnByb3RvdHlwZS5nZXRPckVsc2UgPSB1bmltcGxlbWVudGVkXG5cbk5vdGhpbmcucHJvdG90eXBlLmdldE9yRWxzZSA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGFcbn1cblxuSnVzdC5wcm90b3R5cGUuZ2V0T3JFbHNlID0gZnVuY3Rpb24oXykge1xuICByZXR1cm4gdGhpcy52YWx1ZVxufVxuXG5cbi8qKlxuICogVHJhbnNmb3JtcyBhIGZhaWx1cmUgaW50byBhIG5ldyBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUuIERvZXMgbm90aGluZyBpZiB0aGVcbiAqIHN0cnVjdHVyZSBhbHJlYWR5IGNvbnRhaW5zIGEgdmFsdWUuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgQE1heWJlW86xXSA9PiAoVm9pZCDihpIgTWF5YmVbzrFdKSDihpIgTWF5YmVbzrFdXG4gKi9cbk1heWJlLnByb3RvdHlwZS5vckVsc2UgPSB1bmltcGxlbWVudGVkXG5cbk5vdGhpbmcucHJvdG90eXBlLm9yRWxzZSA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGYoKVxufVxuXG5KdXN0LnByb3RvdHlwZS5vckVsc2UgPSBmdW5jdGlvbihfKSB7XG4gIHJldHVybiB0aGlzXG59XG5cblxuLyoqXG4gKiBDYXRhbW9ycGhpc20uXG4gKiBcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4geyBOb3RoaW5nOiBWb2lkIOKGkiDOsiwgSnVzdDogzrEg4oaSIM6yIH0g4oaSIM6yXG4gKi9cbk1heWJlLnByb3RvdHlwZS5jYXRhID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5jYXRhID0gZnVuY3Rpb24ocGF0dGVybikge1xuICByZXR1cm4gcGF0dGVybi5Ob3RoaW5nKClcbn1cblxuSnVzdC5wcm90b3R5cGUuY2F0YSA9IGZ1bmN0aW9uKHBhdHRlcm4pIHtcbiAgcmV0dXJuIHBhdHRlcm4uSnVzdCh0aGlzLnZhbHVlKTtcbn1cblxuXG4vKipcbiAqIEpTT04gc2VyaWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gVm9pZCDihpIgT2JqZWN0XG4gKi9cbk1heWJlLnByb3RvdHlwZS50b0pTT04gPSB1bmltcGxlbWVudGVkXG5cbk5vdGhpbmcucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4geyAnI3R5cGUnOiAnZm9sa3RhbGU6TWF5YmUuTm90aGluZycgfVxufVxuXG5KdXN0LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHsgJyN0eXBlJzogJ2ZvbGt0YWxlOk1heWJlLkp1c3QnXG4gICAgICAgICAsIHZhbHVlOiB0aGlzLnZhbHVlIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMy0yMDE0IFF1aWxkcmVlbiBNb3R0YSA8cXVpbGRyZWVuQGdtYWlsLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuLy8gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbi8vICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbi8vIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4vLyBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuLy8gYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbi8vIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4vLyBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuLy8gRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuLy8gTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuLy8gTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL21heWJlJykiLCJpbXBvcnQgeyBjdXJyeSwgcGlwZSwgcHJvcCwgb3ZlciwgYXBwZW5kIH0gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgeyBoaWRlQ29uZmlncywgU3RhdGVMZW5zZXMsIHB1c2hIaXN0b3J5U3RhdGUgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IE1heWJlIGZyb20gXCJkYXRhLm1heWJlXCI7XG5cbi8vIFN0YXRlIC0+IE9iamVjdCAtPiBTdGF0ZVxuY29uc3QgaGlzdG9yeVN0YXRlV2l0aE5ld0ZpZWxkID0gY3VycnkoKHN0YXRlLCBuZXdGaWVsZCkgPT4gcGlwZShcbiAgaGlkZUNvbmZpZ3MsXG4gIG92ZXIoU3RhdGVMZW5zZXMuZmllbGRzU3RhdGUsIGFwcGVuZChuZXdGaWVsZCkpXG4pKHN0YXRlKSk7XG5cbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBjcmVhdGVkRmllbGRTdGF0ZSB9KSA9PlxuICBNYXliZS5mcm9tTnVsbGFibGUoY3JlYXRlZEZpZWxkU3RhdGUpXG4gIC5tYXAoaGlzdG9yeVN0YXRlV2l0aE5ld0ZpZWxkKHN0YXRlKSlcbiAgLm1hcChwcm9wKFwiZmllbGRzU3RhdGVcIikpXG4gIC5tYXAocHVzaEhpc3RvcnlTdGF0ZShzdGF0ZSkpXG4gIC5nZXRPckVsc2Uoc3RhdGUpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbmVzdGVkLXRlcm5hcnkgKi9cbmltcG9ydCBhc3NlcnQgZnJvbSBcImZsLWFzc2VydFwiO1xuaW1wb3J0IHVuZG8gZnJvbSBcIi4vdW5kb1wiO1xuaW1wb3J0IGltcG9ydFN0YXRlIGZyb20gXCIuL2ltcG9ydFN0YXRlXCI7XG5pbXBvcnQgY3JlYXRlRmllbGQgZnJvbSBcIi4vY3JlYXRlRmllbGRcIjtcbmltcG9ydCBmaWVsZENyZWF0ZWQgZnJvbSBcIi4vZmllbGRDcmVhdGVkXCI7XG5cbmNvbnN0IGFjdGlvbkhhbmRsZXJzID0ge1xuICB1bmRvLFxuICBpbXBvcnRTdGF0ZSxcbiAgY3JlYXRlRmllbGQsXG4gIGZpZWxkQ3JlYXRlZCxcbn07XG5cbmNvbnN0IGlzRXhwZWN0ZWRBY3Rpb24gPSBhID0+IGEgJiYgYS50eXBlICYmIGFjdGlvbkhhbmRsZXJzW2EudHlwZV07XG5jb25zdCBpc1JlZHV4QWN0aW9uID0gYSA9PiBhICYmIGEudHlwZSAmJiBhLnR5cGUuaW5jbHVkZXMoXCJAQHJlZHV4XCIpO1xuXG5cbmNvbnN0IHVwZGF0ZSA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICBpc0V4cGVjdGVkQWN0aW9uKGFjdGlvbilcbiAgICA/IGFjdGlvbkhhbmRsZXJzW2FjdGlvbi50eXBlXShzdGF0ZSwgYWN0aW9uKVxuICA6IGlzUmVkdXhBY3Rpb24oYWN0aW9uKVxuICAgID8gc3RhdGVcbiAgOiBhc3NlcnQoZmFsc2UsIGBJbnZhbGlkIGFjdGlvbiB0eXBlOiAke2FjdGlvbi50eXBlfWApO1xuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGU7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHsgdW5kbyBhcyB1bmRvQWN0aW9uIH0gZnJvbSBcIi4uLy4uL2pzL0FjdGlvbnNcIjtcbmltcG9ydCB1cGRhdGUgZnJvbSBcIi4uLy4uL2pzL1VwZGF0ZVwiO1xuXG5jb25zdCBjdXJyZW50RmllbGRzU3RhdGUgPSBbXCJjdXJyZW50XCJdO1xuY29uc3Qgb2xkRmllbGRzU3RhdGUgPSBbXCJvbGRcIl07XG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFtdLFxuICBmaWVsZHNTdGF0ZTogY3VycmVudEZpZWxkc1N0YXRlLFxuICBmaWVsZHNTdGF0ZUhpc3Rvcnk6IFtvbGRGaWVsZHNTdGF0ZV0sXG59O1xuXG5jb25zdCBlbXB0eU1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW10sXG4gIGZpZWxkc1N0YXRlOiBbXSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBbXSxcbn07XG5cbmNvbnN0IGVtcHR5SGlzdG9yeU1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW10sXG4gIGZpZWxkc1N0YXRlOiBjdXJyZW50RmllbGRzU3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogW10sXG59O1xuXG5kZXNjcmliZShcIlVwZGF0ZS51bmRvXCIsICgpID0+IHtcbiAgaXQoXCJyZW1vdmVzIGZpcnN0IG9sZCBzdGF0ZSBmcm9tIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB1bmRvQWN0aW9uKCkpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gIH0pO1xuXG4gIGl0KFwic2V0cyBmaXJzdCBvbGQgc3RhdGUgYXMgY3VycmVudCBzdGF0ZVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIHVuZG9BY3Rpb24oKSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGUpLnRvRXF1YWwob2xkRmllbGRzU3RhdGUpO1xuICB9KTtcblxuICBpdChcImRvZXNuJ3QgbW9kaWZ5IHRoZSBzdGF0ZSBpZiB0aGVyZSBhcmVuJ3QgbW9yZSBoaXN0b3J5IHN0YXRlcyB0byB1bmRvXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RpZmllZFN0YXRlID0gdXBkYXRlKGVtcHR5TW9ja1N0YXRlLCB1bmRvQWN0aW9uKCkpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlKS50b0VxdWFsKGVtcHR5TW9ja1N0YXRlKTtcbiAgfSk7XG5cbiAgaXQoXCJzZXQncyB0aGUgY3VycmVudCBzdGF0ZSB0byBlbXB0eSBpZiB0aGVyZSBhcmUgbm8gbW9yZSBoaXN0b3J5IHN0YXRlc1wiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShlbXB0eUhpc3RvcnlNb2NrU3RhdGUsIHVuZG9BY3Rpb24oKSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKS50b0VxdWFsKDApO1xuICB9KTtcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5pbXBvcnQgeyBpbXBvcnRTdGF0ZSB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuY29uc3QgdHlwZXNBcnJheSA9IFt7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiUmFkaW9CdXR0b25zXCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiQ2hlY2tib3hlc1wiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIkRyb3Bkb3duXCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiVGV4dEJveFwiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIkVtYWlsQm94XCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiVGVsZXBob25lQm94XCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiTnVtYmVyQm94XCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiVGV4dEFyZWFcIixcbiAgfSxcbn0sIHtcbiAgXCJpbmZvXCI6IHtcbiAgICBcInR5cGVcIjogXCJEYXRlRmllbGRcIixcbiAgfSxcbn1dO1xuXG5jb25zdCBtb2NrQ3VycmVudFN0YXRlID0gW1wiYVwiLCBcImJcIl07XG5jb25zdCBtb2NrSGlzdG9yeSA9IFtdO1xuY29uc3QgbW9ja1N0YXRlID0ge1xuICBmaWVsZFR5cGVzOiB0eXBlc0FycmF5LFxuICBmaWVsZHNTdGF0ZTogbW9ja0N1cnJlbnRTdGF0ZSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBtb2NrSGlzdG9yeSxcbn07XG5cbmNvbnN0IG5ld1ZhbGlkU3RhdGUgPSBbe1xuICBcInR5cGVcIjogXCJDaGVja2JveGVzXCIsXG4gIFwiZGlzcGxheU5hbWVcIjogXCJDaGVja2JveGVzXCIsXG4gIFwiZ3JvdXBcIjogXCJPcHRpb25zIENvbXBvbmVudHNcIixcbiAgXCJodG1sSW5wdXRUeXBlXCI6IFwiY2hlY2tib3hcIixcbiAgXCJ0aXRsZVwiOiBcIkFkZCBhIHRpdGxlXCIsXG4gIFwib3B0aW9uc1wiOiBbe1xuICAgIFwiY2FwdGlvblwiOiBcIkluc2VydCBhbiBvcHRpb25cIixcbiAgfV0sXG4gIFwibmV3T3B0aW9uQ2FwdGlvblwiOiBcIlwiLFxufV07XG5cbmNvbnN0IG5ld0ludmFsaWRTdGF0ZSA9IFt7XG4gIFwidHlwZVwiOiBcIkludmFsaWQgdHlwZVwiLFxuICBcImRpc3BsYXlOYW1lXCI6IFwiQ2hlY2tib3hlc1wiLFxuICBcImdyb3VwXCI6IFwiT3B0aW9ucyBDb21wb25lbnRzXCIsXG4gIFwiaHRtbElucHV0VHlwZVwiOiBcImNoZWNrYm94XCIsXG4gIFwidGl0bGVcIjogXCJBZGQgYSB0aXRsZVwiLFxuICBcIm9wdGlvbnNcIjogW3tcbiAgICBcImNhcHRpb25cIjogXCJJbnNlcnQgYW4gb3B0aW9uXCIsXG4gIH1dLFxuICBcIm5ld09wdGlvbkNhcHRpb25cIjogXCJcIixcbn1dO1xuXG5kZXNjcmliZShcIlVwZGF0ZS5pbXBvcnRTdGF0ZVwiLCAoKSA9PiB7XG4gIGl0KFwiUmV0dXJucyBhbiB1bmNoYW5nZWQgYXJyYXkgaWYgdGhlIG5ldyBzdGF0ZSBpcyBpbnZhbGlkXCIsICgpID0+IHtcbiAgICBleHBlY3QodXBkYXRlKG1vY2tTdGF0ZSwgaW1wb3J0U3RhdGUoe30pKSkudG9FcXVhbChtb2NrU3RhdGUpO1xuICAgIGV4cGVjdCh1cGRhdGUobW9ja1N0YXRlLCBpbXBvcnRTdGF0ZShudWxsKSkpLnRvRXF1YWwobW9ja1N0YXRlKTtcbiAgfSk7XG5cbiAgaXQoXCJSZXR1cm5zIGFuIHVuY2hhbmdlZCBhcnJheSBpZiB0aGUgYSBmaWVsZCdzIHR5cGUgaXMgbm90IGluIGZpZWxkVHlwZXNcIiwgKCkgPT4ge1xuICAgIGV4cGVjdCh1cGRhdGUobW9ja1N0YXRlLCBpbXBvcnRTdGF0ZShuZXdJbnZhbGlkU3RhdGUpKSkudG9FcXVhbChtb2NrU3RhdGUpO1xuICB9KTtcblxuICBpdChcIlNlbmRzIHRoZSBsYXN0IGN1cnJlbnQgc3RhdGUgdG8gdGhlIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IHVwZGF0ZWQgPSB1cGRhdGUobW9ja1N0YXRlLCBpbXBvcnRTdGF0ZShuZXdWYWxpZFN0YXRlKSk7XG4gICAgZXhwZWN0KHVwZGF0ZWQuZmllbGRzU3RhdGVIaXN0b3J5WzBdLnRvU3RyaW5nKCkpLnRvRXF1YWwobW9ja0N1cnJlbnRTdGF0ZS50b1N0cmluZygpKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKG1vY2tIaXN0b3J5Lmxlbmd0aCArIDEpO1xuICB9KTtcblxuICBpdChcIlNldHMgdGhlIG5ldyBzdGF0ZSBhcyBjdXJyZW50XCIsICgpID0+IHtcbiAgICBjb25zdCB1cGRhdGVkID0gdXBkYXRlKG1vY2tTdGF0ZSwgaW1wb3J0U3RhdGUobmV3VmFsaWRTdGF0ZSkpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLnR5cGUpLnRvRXF1YWwobmV3VmFsaWRTdGF0ZVswXS50eXBlKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZVswXS50eXBlKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmRpc3BsYXlOYW1lKS50b0VxdWFsKG5ld1ZhbGlkU3RhdGVbMF0uZGlzcGxheU5hbWUpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmRpc3BsYXlOYW1lKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmdyb3VwKS50b0VxdWFsKG5ld1ZhbGlkU3RhdGVbMF0uZ3JvdXApO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmdyb3VwKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICB9KTtcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5pbXBvcnQgeyBjcmVhdGVGaWVsZCB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuY29uc3QgcHJvbWlzZVR5cGVJbnN0YW5jZSA9IHsgdHlwZTogXCJwcm9taXNlLWluc3RhbmNlXCIgfTtcbmNvbnN0IHByb21pc2VUeXBlID0ge1xuICBpbmZvOiB7IHR5cGU6IFwiUHJvbWlzZVR5cGVcIiB9LFxuICBpbml0aWFsU3RhdGU6ICgpID0+IFByb21pc2UucmVzb2x2ZShwcm9taXNlVHlwZUluc3RhbmNlKSxcbn07XG5cbmNvbnN0IHN5bmNUeXBlSW5zdGFuY2UgPSB7IHR5cGU6IFwic3luYy1pbnN0YW5jZVwiIH07XG5jb25zdCBzeW5jVHlwZSA9IHtcbiAgaW5mbzogeyB0eXBlOiBcIlN5bmNUeXBlXCIgfSxcbiAgaW5pdGlhbFN0YXRlOiAoKSA9PiBzeW5jVHlwZUluc3RhbmNlLFxufTtcblxuY29uc3QgdHlwZXNBcnJheSA9IFtwcm9taXNlVHlwZSwgc3luY1R5cGVdO1xuY29uc3QgbW9ja0N1cnJlbnRTdGF0ZSA9IFtcImFcIiwgXCJiXCJdO1xuY29uc3QgbW9ja0hpc3RvcnkgPSBbXTtcbmNvbnN0IG1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogdHlwZXNBcnJheSxcbiAgZmllbGRzU3RhdGU6IG1vY2tDdXJyZW50U3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbW9ja0hpc3RvcnksXG59O1xuXG5kZXNjcmliZShcIlVwZGF0ZS5jcmVhdGVGaWVsZFwiLCAoKSA9PiB7XG4gIGl0KFwiY3JlYXRlcyBmaWVsZHMgYXN5bmNocm9ub3VzbHlcIiwgZG9uZSA9PiB7XG4gICAgY29uc3QgYXN5bmNEaXNwYXRjaCA9IHYgPT4ge1xuICAgICAgZXhwZWN0KHYpLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFzeW5jQWNpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBhc3luY0Rpc3BhdGNoIH0sXG4gICAgICBjcmVhdGVGaWVsZChzeW5jVHlwZS5pbmZvLnR5cGUpXG4gICAgKTtcblxuICAgIHVwZGF0ZShtb2NrU3RhdGUsIGFzeW5jQWNpb24pO1xuICB9KTtcblxuICBpdChcInJldHVybnMgYSAnZmllbGRDcmVhdGVkJyBhY3Rpb24gd2hlbiBmaWVsZCBpcyBjcmVhdGVkXCIsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGFzeW5jRGlzcGF0Y2ggPSBhY3Rpb24gPT4ge1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwiZmllbGRDcmVhdGVkXCIpO1xuICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBhc3luY0FjaW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgYXN5bmNEaXNwYXRjaCB9LFxuICAgICAgY3JlYXRlRmllbGQoc3luY1R5cGUuaW5mby50eXBlKVxuICAgICk7XG5cbiAgICB1cGRhdGUobW9ja1N0YXRlLCBhc3luY0FjaW9uKTtcbiAgfSk7XG5cbiAgaXQoXCJjcmVhdGVzIHR5cGVzIHdpdGggY29uc3RydWN0b3JzIHRoYXQgcmV0dXJuIGEgcGxhaW4gb2JqZWN0XCIsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGFzeW5jRGlzcGF0Y2ggPSBhY3Rpb24gPT4ge1xuICAgICAgZXhwZWN0KGFjdGlvbi5jcmVhdGVkRmllbGRTdGF0ZSkubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgIGV4cGVjdChhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUudHlwZSkudG9FcXVhbChzeW5jVHlwZUluc3RhbmNlLnR5cGUpO1xuICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBhc3luY0FjaW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgYXN5bmNEaXNwYXRjaCB9LFxuICAgICAgY3JlYXRlRmllbGQoc3luY1R5cGUuaW5mby50eXBlKVxuICAgICk7XG5cbiAgICB1cGRhdGUobW9ja1N0YXRlLCBhc3luY0FjaW9uKTtcbiAgfSk7XG5cbiAgaXQoXCJjcmVhdGVzIHR5cGVzIHdpdGggY29uc3RydWN0b3JzIHRoYXQgcmV0dXJuIGEgcHJvbWlzZVwiLCBkb25lID0+IHtcbiAgICBjb25zdCBhc3luY0Rpc3BhdGNoID0gYWN0aW9uID0+IHtcbiAgICAgIGV4cGVjdChhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUpLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICBleHBlY3QoYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlLnR5cGUpLnRvRXF1YWwocHJvbWlzZVR5cGVJbnN0YW5jZS50eXBlKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgYXN5bmNBY2lvbiA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7IGFzeW5jRGlzcGF0Y2ggfSxcbiAgICAgIGNyZWF0ZUZpZWxkKHByb21pc2VUeXBlLmluZm8udHlwZSlcbiAgICApO1xuXG4gICAgdXBkYXRlKG1vY2tTdGF0ZSwgYXN5bmNBY2lvbik7XG4gIH0pO1xuXG4gIGl0KFwiYWRkcyByZXF1aXJlZCBmaWVsZHMgdG8gaW5zdGFuY2VcIiwgZG9uZSA9PiB7XG4gICAgY29uc3QgYXN5bmNEaXNwYXRjaCA9IGFjdGlvbiA9PiB7XG4gICAgICBleHBlY3QoYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlLmlkKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgICAgZXhwZWN0KHR5cGVvZiBhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUuY29uZmlnU2hvd2luZykudG9FcXVhbChcImJvb2xlYW5cIik7XG4gICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFzeW5jQWNpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBhc3luY0Rpc3BhdGNoIH0sXG4gICAgICBjcmVhdGVGaWVsZChwcm9taXNlVHlwZS5pbmZvLnR5cGUpXG4gICAgKTtcblxuICAgIHVwZGF0ZShtb2NrU3RhdGUsIGFzeW5jQWNpb24pO1xuICB9KTtcblxuICBpdChcImRvZXMgbm90IGNyZWF0ZSBhIGZpZWxkIGlmIHR5cGUgaXMgbm90IGluIG1vZGVsLmZpZWxkVHlwZXNcIiwgZG9uZSA9PiB7XG4gICAgY29uc3QgYXN5bmNEaXNwYXRjaCA9IGphc21pbmUuY3JlYXRlU3B5KFwiYXN5bmNEaXNwYXRjaFwiKTtcblxuICAgIGNvbnN0IGFzeW5jQWNpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBhc3luY0Rpc3BhdGNoIH0sXG4gICAgICBjcmVhdGVGaWVsZChcIm5vbi1leGlzdGluZy10eXBlXCIpXG4gICAgKTtcblxuICAgIHVwZGF0ZShtb2NrU3RhdGUsIGFzeW5jQWNpb24pO1xuXG4gICAgc2V0VGltZW91dChcbiAgICAgICgpID0+IHsgZXhwZWN0KGFzeW5jRGlzcGF0Y2gpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7IGRvbmUoKTsgfSxcbiAgICAgIDUwXG4gICAgKTtcbiAgfSk7XG59KTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuaW1wb3J0IHsgZmllbGRDcmVhdGVkIH0gZnJvbSBcIi4uLy4uL2pzL0FjdGlvbnNcIjtcbmltcG9ydCB1cGRhdGUgZnJvbSBcIi4uLy4uL2pzL1VwZGF0ZVwiO1xuXG5jb25zdCBjcmVhdGVkRmllbGRTdGF0ZSA9IHsgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIgfTtcbmNvbnN0IG1vY2tDdXJyZW50U3RhdGUgPSBbXCJhXCIsIFwiYlwiXTtcbmNvbnN0IG1vY2tIaXN0b3J5ID0gW107XG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFt7IGluZm86IHsgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIgfSB9XSxcbiAgZmllbGRzU3RhdGU6IG1vY2tDdXJyZW50U3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbW9ja0hpc3RvcnksXG59O1xuXG5jb25zdCBmaWVsZENyZWF0ZWRBY3Rpb24gPSBmaWVsZENyZWF0ZWQoY3JlYXRlZEZpZWxkU3RhdGUpO1xuY29uc3QgbmV3U3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCBmaWVsZENyZWF0ZWRBY3Rpb24pO1xuXG5kZXNjcmliZShcIlVwZGF0ZS5maWVsZENyZWF0ZWRcIiwgKCkgPT4ge1xuICBpdChcIm91dHB1dHMgYSBmaWVsZCB3aXRoIHRoZSBuZXcgc3RhdGUgaW5jbHVkZWRcIiwgKCkgPT4ge1xuICAgIGV4cGVjdChuZXdTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCArIDEpO1xuICAgIGV4cGVjdChcbiAgICAgIG5ld1N0YXRlLmZpZWxkc1N0YXRlXG4gICAgICAuZmluZCh2ID0+IHYudHlwZSA9PT0gY3JlYXRlZEZpZWxkU3RhdGUudHlwZSlcbiAgICApLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGl0KFwic2VuZHMgdGhlIGN1cnJlbnQgc3RhdGUgdG8gaGlzdG9yeVwiLCAoKSA9PiB7XG4gICAgZXhwZWN0KG5ld1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeVswXVswXSkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlWzBdKTtcbiAgICBleHBlY3QobmV3U3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdWzFdKS50b0VxdWFsKG1vY2tDdXJyZW50U3RhdGVbMV0pO1xuICB9KTtcblxuICBpdChcIlJldHVybnMgdGhlIGN1cnJlbnQgc3RhdGUgaWYgbm8gbmV3IGZpZWxkIGlzIGdpdmVuIHRvIGl0XCIsICgpID0+IHtcbiAgICBjb25zdCBzYW1lU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCBmaWVsZENyZWF0ZWQobnVsbCkpO1xuICAgIGV4cGVjdChzYW1lU3RhdGUuZmllbGRUeXBlcy5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkVHlwZXMubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpO1xuICB9KTtcblxuICBpdChcImRvZXMgbm90IGJyZWFrIHRoZSBzdGF0ZSBhZnRlciBjcmVhdGluZyBvbmUgb2JqZWN0XCIsICgpID0+IHtcbiAgICBjb25zdCBjaGFuZ2VkMSA9IHVwZGF0ZShtb2NrU3RhdGUsIGZpZWxkQ3JlYXRlZChjcmVhdGVkRmllbGRTdGF0ZSkpO1xuICAgIGNvbnN0IGNoYW5nZWQyID0gdXBkYXRlKGNoYW5nZWQxLCBmaWVsZENyZWF0ZWQoY3JlYXRlZEZpZWxkU3RhdGUpKTtcbiAgICBjb25zdCBjaGFuZ2VkMyA9IHVwZGF0ZShjaGFuZ2VkMiwgZmllbGRDcmVhdGVkKGNyZWF0ZWRGaWVsZFN0YXRlKSk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkVHlwZXMubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZFR5cGVzLmxlbmd0aCk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlLmxlbmd0aCArIDMpO1xuICAgIGV4cGVjdChjaGFuZ2VkMy5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKDMpO1xuICB9KTtcbn0pO1xuIl0sIm5hbWVzIjpbInVuZG8iLCJfIiwiaW1wb3J0U3RhdGUiLCJuZXdGaWVsZHNTdGF0ZSIsImNyZWF0ZUZpZWxkIiwiZmllbGRUeXBlIiwiZmllbGRDcmVhdGVkIiwiY3JlYXRlZEZpZWxkU3RhdGUiLCJkZXNjcmliZSIsImFjdGlvbiIsInR5cGUiLCJ0b0VxdWFsIiwibW9ja1N0YXRlVG9JbXBvcnQiLCJnbG9iYWwiLCJhc3luY0Rpc3BhdGNoTWlkZGxld2FyZSIsInN0b3JlIiwibmV4dCIsInN5bmNBY3Rpdml0eUZpbmlzaGVkIiwiYWN0aW9uUXVldWUiLCJmbHVzaFF1ZXVlIiwiZm9yRWFjaCIsImEiLCJkaXNwYXRjaCIsImFzeW5jRGlzcGF0Y2giLCJhc3luY0FjdGlvbiIsImNvbmNhdCIsImFjdGlvbldpdGhBc3luY0Rpc3BhdGNoIiwiSW1tdXRhYmxlIiwibWVyZ2UiLCJmYWtlQWN0aW9uIiwiZG9uZSIsInJldHVybmVkQWN0aW9uIiwibm90IiwidW5kZWZpbmVkIiwiZmFrZUFzeW5jQWN0aW9uIiwiZmFrZVN0b3JlIiwiX2lzQXJyYXkiLCJfc2xpY2UiLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMCIsIl9jaGVja0Zvck1ldGhvZCIsIl9pc1BsYWNlaG9sZGVyIiwiX2N1cnJ5MSIsIl9jdXJyeTIiLCJyZXF1aXJlJCQyIiwiX2N1cnJ5MyIsImFsd2F5cyIsIm92ZXIiLCJfYXJpdHkiLCJfcGlwZSIsIl94d3JhcCIsImJpbmQiLCJfaXNTdHJpbmciLCJpc0FycmF5TGlrZSIsIl9yZWR1Y2UiLCJzbGljZSIsInJlcXVpcmUkJDMiLCJfY29uY2F0IiwicHJvcCIsIl9pc1RyYW5zZm9ybWVyIiwiX2Rpc3BhdGNoYWJsZSIsIl9tYXAiLCJfeG1hcCIsIl9jdXJyeU4iLCJjdXJyeU4iLCJfaGFzIiwiX2lzQXJndW1lbnRzIiwia2V5cyIsInJlcXVpcmUkJDYiLCJyZXF1aXJlJCQ1IiwicmVxdWlyZSQkNCIsIm1hcCIsImxlbnMiLCJjdXJyeSIsInVwZGF0ZUF0IiwiX2RlZmF1bHQiLCJrZXlBcnJheSIsIm5ld1ZhbCIsIm9iaiIsImRlZXBOZXdWYWwiLCJyZWR1Y2VSaWdodCIsInJlc3VsdCIsImtleSIsImRlZXAiLCJTdGF0ZUxlbnNlcyIsIl9kZWZhdWx0MiIsIl9kZWZhdWx0MyIsImNyZWF0ZUlkIiwiRGF0ZSIsIm5vdyIsInRvU3RyaW5nIiwicHVzaEhpc3RvcnlTdGF0ZSIsInN0YXRlIiwibmV3SGlzdG9yeVN0YXRlIiwiX2RlZmF1bHQ0IiwiX2RlZmF1bHQ1IiwiZmllbGRzU3RhdGVIaXN0b3J5IiwiX2RlZmF1bHQ2IiwiZmllbGRzU3RhdGUiLCJfZGVmYXVsdDciLCJoaWRlQ29uZmlncyIsInMiLCJPYmplY3QiLCJhc3NpZ24iLCJjb25maWdTaG93aW5nIiwibGFzdEhpc3RvcnlTdGF0ZSIsIkluZmluaXR5IiwiX2lkZW50aXR5IiwiYXAiLCJwcmVwZW5kIiwic2VxdWVuY2UiLCJfYXJyYXlGcm9tSXRlcmF0b3IiLCJfZnVuY3Rpb25OYW1lIiwiaWRlbnRpY2FsIiwiX2VxdWFscyIsIkVpdGhlciIsImlzQXJyYXkiLCJhcnIiLCJBcnJheSIsIlJpZ2h0IiwiTGVmdCIsImZpZWxkVHlwZUlzVmFsaWQiLCJ2YWxpZFR5cGVzIiwiZmllbGQiLCJmaW5kIiwidmFsaWRGaWVsZFR5cGVzIiwib2YiLCJ2YWxpZGF0ZUZpZWxkc1N0YXRlIiwiY2hhaW4iLCJmaWVsZFR5cGVzIiwiYWRkUmVxdWlyZWRQcm9wZXJ0aWVzIiwiZmllbGRTdGF0ZXMiLCJiaW1hcCIsImNvbnNvbGUiLCJlcnJvciIsImdldE9yRWxzZSIsIl9yZWR1Y2VkIiwiX3hmQmFzZSIsIl94ZmluZCIsIlRhc2siLCJ0eXBlQ29uc3RydWN0b3IiLCJ2IiwiaW5mbyIsImZyb21OdWxsYWJsZSIsImNvbnN0ciIsInJlamVjdCIsInJlc29sdmUiLCJjYWxsZWQiLCJmaWVsZFN0YXRlIiwiaW5pdGlhbFN0YXRlIiwiUHJvbWlzZSIsInRoZW4iLCJjYXRjaCIsImluc2VydFJlcXVpcmVkUHJvcHMiLCJjcmVhdGVGaWVsZEFzeW5jaHJvbm91c2x5IiwibGVmdE1hcCIsInJlamVjdGVkIiwiZm9yayIsImVyciIsIk1heWJlIiwiY2xvbmUiLCJ1bmltcGxlbWVudGVkIiwibm9vcCIsImhpc3RvcnlTdGF0ZVdpdGhOZXdGaWVsZCIsIm5ld0ZpZWxkIiwiYWN0aW9uSGFuZGxlcnMiLCJpc0V4cGVjdGVkQWN0aW9uIiwiaXNSZWR1eEFjdGlvbiIsImluY2x1ZGVzIiwidXBkYXRlIiwiYXNzZXJ0IiwiY3VycmVudEZpZWxkc1N0YXRlIiwib2xkRmllbGRzU3RhdGUiLCJtb2NrU3RhdGUiLCJlbXB0eU1vY2tTdGF0ZSIsImVtcHR5SGlzdG9yeU1vY2tTdGF0ZSIsIm1vZGlmaWVkU3RhdGUiLCJ1bmRvQWN0aW9uIiwibGVuZ3RoIiwidHlwZXNBcnJheSIsIm1vY2tDdXJyZW50U3RhdGUiLCJtb2NrSGlzdG9yeSIsIm5ld1ZhbGlkU3RhdGUiLCJuZXdJbnZhbGlkU3RhdGUiLCJ1cGRhdGVkIiwiZGlzcGxheU5hbWUiLCJncm91cCIsInByb21pc2VUeXBlSW5zdGFuY2UiLCJwcm9taXNlVHlwZSIsInN5bmNUeXBlSW5zdGFuY2UiLCJzeW5jVHlwZSIsImFzeW5jQWNpb24iLCJpZCIsImphc21pbmUiLCJjcmVhdGVTcHkiLCJ0b0hhdmVCZWVuQ2FsbGVkIiwiZmllbGRDcmVhdGVkQWN0aW9uIiwibmV3U3RhdGUiLCJzYW1lU3RhdGUiLCJjaGFuZ2VkMSIsImNoYW5nZWQyIiwiY2hhbmdlZDMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBSUEsQUFBTyxNQUFNQSxPQUFPQyxNQUNuQjtRQUNPO0NBRlksQ0FBYjs7QUFLUCxBQUFPLE1BQU1DLGNBQWNDLG1CQUMxQjtRQUNPLGFBRFA7O0NBRDBCLENBQXBCOztBQU1QLEFBQU8sTUFBTUMsY0FBY0MsY0FDMUI7UUFDTyxhQURQOztDQUQwQixDQUFwQjs7QUFNUCxBQUFPLE1BQU1DLGVB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QUFFO2VBQzNDLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7ZUFDdkUsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztlQUN2RSxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQ3hEO1FBQ0UsT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFO2VBQ2hFLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2VBQzVGLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2VBQzVGLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFF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LE9BQU8sV0FBVyxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2hFLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNsRSxLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3RFLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM5RSxLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2xGLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3RGLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxFQUFFLEVB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