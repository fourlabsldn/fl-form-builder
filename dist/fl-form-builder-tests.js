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

const toggleConfig = fieldState => ({
  type: "toggleConfig",
  fieldState
});

const toggleRequired = fieldState => ({
  type: "toggleRequired",
  fieldState
});

const deleteField = fieldState => ({
  type: "deleteField",
  fieldState
});

const updateField = newFieldState => ({
  type: "updateField",
  newFieldState
});

const reorderFields = newFieldsOrder => ({
  type: "reorderFields",
  newFieldsOrder
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

  describe("toggleConfig", () => {
    const fieldState = {};

    it("returns the correct action type", () => {
      const action = toggleConfig(fieldState);
      expect(action.type).toEqual("toggleConfig");
    });

    it("Creates the correct variables", () => {
      const action = toggleConfig(fieldState);
      expect(action.fieldState).toEqual(fieldState);
    });
  });

  describe("toggleRequired", () => {
    const fieldState = {};

    it("returns the correct action type", () => {
      const action = toggleRequired(fieldState);
      expect(action.type).toEqual("toggleRequired");
    });

    it("Creates the correct variables", () => {
      const action = toggleRequired(fieldState);
      expect(action.fieldState).toEqual(fieldState);
    });
  });

  describe("deleteField", () => {
    const fieldState = {};

    it("returns the correct action type", () => {
      const action = deleteField(fieldState);
      expect(action.type).toEqual("deleteField");
    });

    it("Creates the correct variables", () => {
      const action = deleteField(fieldState);
      expect(action.fieldState).toEqual(fieldState);
    });
  });

  describe("updateField", () => {
    const newFieldState = {};

    it("returns the correct action type", () => {
      const action = updateField(newFieldState);
      expect(action.type).toEqual("updateField");
    });

    it("Creates the correct variables", () => {
      const action = updateField(newFieldState);
      expect(action.newFieldState).toEqual(newFieldState);
    });
  });

  describe("reorderFields", () => {
    const newFieldsOrder = {};

    it("returns the correct action type", () => {
      const action = reorderFields(newFieldsOrder);
      expect(action.type).toEqual("reorderFields");
    });

    it("Creates the correct variables", () => {
      const action = reorderFields(newFieldsOrder);
      expect(action.newFieldsOrder).toEqual(newFieldsOrder);
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

// String -> String -> Object -> Either String Object
const propertyTypeCheck = curry$1((propertyName, type, obj) => typeof obj[propertyName] === type ? index.Right(obj) : index.Left(`Property 'required' cannot be of type ${ typeof obj.required }`));

// Checks that a field has its essential properties
// Object -> Either String Object
const validateField = fieldState => index.fromNullable(fieldState).leftMap(fs => `A field State cannot be empty ${ typeof fs }`).chain(propertyTypeCheck("required", "boolean")).chain(propertyTypeCheck("configShowing", "boolean")).chain(propertyTypeCheck("id", "string"));

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
var map$4 = map$1;


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
      _reduce$4(function(acc, f) { return _concat$4(acc, map$4(f, fn)); }, [], applicative)
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
var map$3 = map$1;
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
    reduceRight(function(acc, x) { return ap(map$3(prepend$1, x), acc); },
                of([]),
                traversable);
});

var _curry3$6 = _curry3$1;
var map$2 = map$1;
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
  return sequence(of, map$2(f, traversable));
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

const toggleConfig$1 = fieldState => seamlessImmutable(fieldState).set("configShowing", !fieldState.configShowing);

const replaceFieldState = curry$1((state, fieldState) => state.fieldsState.map(aField => aField.id === fieldState.id ? fieldState : aField));

var toggleConfig$2 = ((state, { fieldState }) => index$2.fromNullable(fieldState).map(toggleConfig$1).map(replaceFieldState(state)).map(pushHistoryState(state)).getOrElse(state));

const toggleRequired$1 = fieldState => seamlessImmutable(fieldState).set("required", !fieldState.required);

const replaceFieldState$1 = curry$1((state, fieldState) => state.fieldsState.map(aField => aField.id === fieldState.id ? fieldState : aField));

var toggleRequired$2 = ((state, { fieldState }) => index$2.fromNullable(fieldState).map(toggleRequired$1).map(replaceFieldState$1(state)).map(pushHistoryState(state)).getOrElse(state));

var _filter$1 = function _filter$1(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];

  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }
    idx += 1;
  }
  return result;
};

var _isObject$1 = function _isObject$1(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
};

var _curry2$19 = _curry2$1;
var _xfBase$4 = _xfBase$1;


var _xfilter$1 = (function() {
  function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
  }
  XFilter.prototype['@@transducer/init'] = _xfBase$4.init;
  XFilter.prototype['@@transducer/result'] = _xfBase$4.result;
  XFilter.prototype['@@transducer/step'] = function(result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return _curry2$19(function _xfilter$1(f, xf) { return new XFilter(f, xf); });
}());

var _curry2$18 = _curry2$1;
var _dispatchable$4 = _dispatchable$1;
var _filter = _filter$1;
var _isObject = _isObject$1;
var _reduce$5 = _reduce$1;
var _xfilter = _xfilter$1;
var keys$4 = keys$1;


/**
 * Takes a predicate and a "filterable", and returns a new filterable of the
 * same type containing the members of the given filterable which satisfy the
 * given predicate.
 *
 * Dispatches to the `filter` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array}
 * @see R.reject, R.transduce, R.addIndex
 * @example
 *
 *      var isEven = n => n % 2 === 0;
 *
 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */
var filter = _curry2$18(_dispatchable$4('filter', _xfilter, function(pred, filterable) {
  return (
    _isObject(filterable) ?
      _reduce$5(function(acc, key) {
        if (pred(filterable[key])) {
          acc[key] = filterable[key];
        }
        return acc;
      }, {}, keys$4(filterable)) :
    // else
      _filter(pred, filterable)
  );
}));

// State -> Object -> State
const historyStateWithoutField = curry$1((state, fieldState) => over(StateLenses.fieldsState, filter(fs => fs.id !== fieldState.id), state));

var deleteField$1 = ((state, { fieldState }) => index$2.fromNullable(fieldState).map(historyStateWithoutField(state)).map(prop$1("fieldsState")).map(pushHistoryState(state)).getOrElse(state));

// State -> Object -> State
const updateFieldState = curry$1((state, newFieldState) => over(StateLenses.fieldsState, map$1(fs => fs.id === newFieldState.id ? newFieldState : fs), state));

var updateField$1 = ((state, { newFieldState }) => validateField(newFieldState) // Either
.map(updateFieldState(state)).map(prop$1("fieldsState")).map(pushHistoryState(state)).leftMap(console.error).getOrElse(state));

var _curry2$20 = _curry2$1;
var _slice$4 = _slice$1;


/**
 * Returns a copy of the list, sorted according to the comparator function,
 * which should accept two values at a time and return a negative number if the
 * first value is smaller, a positive number if it's larger, and zero if they
 * are equal. Please note that this is a **copy** of the list. It does not
 * modify the original.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a,a -> Number) -> [a] -> [a]
 * @param {Function} comparator A sorting function :: a -> b -> Int
 * @param {Array} list The list to sort
 * @return {Array} a new array with its elements sorted by the comparator function.
 * @example
 *
 *      var diff = function(a, b) { return a - b; };
 *      R.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]
 */
var sort = _curry2$20(function sort(comparator, list) {
  return _slice$4(list).sort(comparator);
});

// State -> Object -> State
const historyStateWithNewOrder = curry$1((state, newOrder) => pipe(hideConfigs, over(StateLenses.fieldsState, sort((f1, f2) => newOrder.indexOf(f1.id) - newOrder.indexOf(f2.id))))(state));

var reorderFields$1 = ((state, { newFieldsOrder }) => (newFieldsOrder && Array.isArray(newFieldsOrder) ? index.Right(newFieldsOrder) : index.Left(`newFieldsOrder must be an array but received ${ typeof newFieldsOrder }`)).chain(o => o.length === state.fieldsState.length ? index.Right(o) : index.Left(`newFieldsOrder has ${ o.length } elements, but the current state has ${ state.fieldsState.length } elements`) // eslint-disable-line max-len
).chain(o => {
  const stateIds = state.fieldsState.map(prop$1("id"));
  const noMissingId = stateIds.reduce((acc, fId) => acc && o.includes(fId), true);
  return noMissingId ? index.Right(o) : index.Left("Not all ids in the new order are matched in the existing state ids.");
}).map(historyStateWithNewOrder(state)).map(prop$1("fieldsState")).map(pushHistoryState(state)).leftMap(err => console.error(`Unable to reorder: ${ err }`)).getOrElse(state));

/* eslint-disable no-nested-ternary */
const actionHandlers = {
  undo: undo$1,
  importState: importState$1,
  createField: createField$2,
  fieldCreated: fieldCreated$1,
  toggleConfig: toggleConfig$2,
  toggleRequired: toggleRequired$2,
  deleteField: deleteField$1,
  updateField: updateField$1,
  reorderFields: reorderFields$1
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
  it("outputs a state with the new field included", () => {
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

/* eslint-env jasmine */

const fieldStateConfigShowing = {
  id: 123,
  configShowing: true
};

const fieldStateConfigNotShowing = {
  id: 321,
  configShowing: false
};

const mockState$4 = {
  fieldTypes: [],
  fieldsState: [fieldStateConfigShowing, fieldStateConfigNotShowing],
  fieldsStateHistory: []
};

describe("Update.toggleConfig", () => {
  it("turns the config option to false when needed", () => {
    const modifiedState = update(mockState$4, toggleConfig(fieldStateConfigShowing));
    expect(modifiedState.fieldsState.find(f => f.id === fieldStateConfigShowing.id).configShowing).toEqual(false);
  });

  it("turns the config option to true when needed", () => {
    const modifiedState = update(mockState$4, toggleConfig(fieldStateConfigNotShowing));
    expect(modifiedState.fieldsState.find(f => f.id === fieldStateConfigShowing.id).configShowing).toEqual(true);
  });

  it("adds the last state to the history", () => {
    const modifiedState = update(mockState$4, toggleConfig(fieldStateConfigShowing));
    expect(modifiedState.fieldsStateHistory.length).toEqual(1);
    expect(modifiedState.fieldsStateHistory[0][0].id).toEqual(mockState$4.fieldsState[0].id);
    expect(modifiedState.fieldsStateHistory[0][1].id).toEqual(mockState$4.fieldsState[1].id);
  });
});

/* eslint-env jasmine */

const fieldStateIsRequired = {
  id: 123,
  required: true
};

const fieldStateIsNotRequired = {
  id: 321,
  required: false
};

const mockState$5 = {
  fieldTypes: [],
  fieldsState: [fieldStateIsRequired, fieldStateIsNotRequired],
  fieldsStateHistory: []
};

describe("Update.toggleRequired", () => {
  it("turns the required option to false when needed", () => {
    const modifiedState = update(mockState$5, toggleRequired(fieldStateIsRequired));
    expect(modifiedState.fieldsState.find(f => f.id === fieldStateIsRequired.id).required).toEqual(false);
  });

  it("turns the required option to true when needed", () => {
    const modifiedState = update(mockState$5, toggleRequired(fieldStateIsNotRequired));
    expect(modifiedState.fieldsState.find(f => f.id === fieldStateIsRequired.id).required).toEqual(true);
  });

  it("adds the last state to the history", () => {
    const modifiedState = update(mockState$5, toggleRequired(fieldStateIsRequired));
    expect(modifiedState.fieldsStateHistory.length).toEqual(1);
    expect(modifiedState.fieldsStateHistory[0][0].id).toEqual(mockState$5.fieldsState[0].id);
    expect(modifiedState.fieldsStateHistory[0][1].id).toEqual(mockState$5.fieldsState[1].id);
  });
});

/* eslint-env jasmine */
/* eslint-disable quote-props */

const toBeDeletedFieldState = { type: "fictitious-instance", id: 0 };
const mockCurrentState$3 = [toBeDeletedFieldState, { id: 1 }, { id: 2 }];
const mockHistory$3 = [];
const mockState$6 = {
  fieldTypes: [{ info: { type: "fictitious-instance" } }],
  fieldsState: mockCurrentState$3,
  fieldsStateHistory: mockHistory$3
};

const fieldDeleteAction = deleteField(toBeDeletedFieldState);
const newState$1 = update(mockState$6, fieldDeleteAction);

describe("Update.deleteField", () => {
  it("outputs a state without the field included", () => {
    expect(newState$1.fieldsState.length).toEqual(mockState$6.fieldsState.length - 1);
    expect(newState$1.fieldsState.find(v => v.id === toBeDeletedFieldState.id)).toEqual(undefined);
  });

  it("sends the current state to history", () => {
    const recentHistoryState = newState$1.fieldsStateHistory[0];
    expect(recentHistoryState.length).toEqual(mockCurrentState$3.length);
    expect(recentHistoryState[0].id).toEqual(mockCurrentState$3[0].id);
    expect(recentHistoryState[1].id).toEqual(mockCurrentState$3[1].id);
  });

  it("Returns the current state if no new field is given to it", () => {
    const sameState = update(mockState$6, deleteField(null));
    expect(sameState.fieldTypes.length).toEqual(mockState$6.fieldTypes.length);
    expect(sameState.fieldsState.length).toEqual(mockState$6.fieldsState.length);
    expect(sameState.fieldsStateHistory.length).toEqual(mockState$6.fieldsStateHistory.length);
  });

  it("does not break the state after deleting a field", () => {
    const mockField1 = Object.assign({}, toBeDeletedFieldState, { id: 5 });
    const mockField2 = Object.assign({}, toBeDeletedFieldState, { id: 6 });
    const mockField3 = Object.assign({}, toBeDeletedFieldState, { id: 7 });

    const mockState2 = Object.assign({}, mockState$6, {
      fieldsState: [mockField1, mockField2, mockField3]
    });
    const changed1 = update(mockState2, deleteField(mockField1));
    const changed2 = update(changed1, deleteField(mockField2));
    const changed3 = update(changed2, deleteField(mockField3));
    expect(changed3.fieldTypes.length).toEqual(mockState2.fieldTypes.length);
    expect(changed3.fieldsState.length).toEqual(mockState2.fieldsState.length - 3);
    expect(changed3.fieldsStateHistory.length).toEqual(3);
  });
});

/* eslint-env jasmine */
/* eslint-disable quote-props */

const oldFieldState = {
  type: "fictitious-instance",
  id: "0",
  configShowing: false,
  required: false,
  color: "blue"
};
const newFieldState = Object.assign({}, oldFieldState, { color: "green" });
const mockCurrentState$4 = [oldFieldState, { id: 1 }, { id: 2 }];
const mockHistory$4 = [];
const mockState$7 = {
  fieldTypes: [{ info: { type: "fictitious-instance" } }],
  fieldsState: mockCurrentState$4,
  fieldsStateHistory: mockHistory$4
};

const fieldUpdateAction = updateField(newFieldState);
const newState$2 = update(mockState$7, fieldUpdateAction);

describe("Update.updateField", () => {
  it("outputs a state the field updated", () => {
    expect(newState$2.fieldsState.length).toEqual(mockState$7.fieldsState.length);
    expect(newState$2.fieldsState.find(v => v.color === newFieldState.color)).not.toEqual(undefined);
  });

  it("outputs a state the updated field in the correct order", () => {
    expect(newState$2.fieldsState[0].id).toEqual(mockState$7.fieldsState[0].id);
    expect(newState$2.fieldsState[0].color).toEqual(newFieldState.color);
  });

  it("sends the current state to history", () => {
    const recentHistoryState = newState$2.fieldsStateHistory[0];
    expect(recentHistoryState.length).toEqual(mockCurrentState$4.length);
    expect(recentHistoryState[0].id).toEqual(mockCurrentState$4[0].id);
    expect(recentHistoryState[0].color).toEqual(mockCurrentState$4[0].color);
  });

  it("Returns the current state if an invalid field state is given to it", () => {
    const isSame = (state1, state2) => {
      expect(state1.fieldTypes.length).toEqual(state2.fieldTypes.length);
      expect(state1.fieldsState.length).toEqual(state2.fieldsState.length);
      expect(state1.fieldsState[0].color).toEqual(state2.fieldsState[0].color);
      expect(state1.fieldsState[0].id).toEqual(state2.fieldsState[0].id);
      expect(state1.fieldsStateHistory.length).toEqual(state2.fieldsStateHistory.length);
    };

    const sameState1 = update(mockState$7, updateField(null));
    isSame(mockState$7, sameState1);

    const sameState2 = update(mockState$7, updateField(Object.assign({}, newFieldState, { id: null })));
    isSame(mockState$7, sameState2);

    const sameState3 = update(mockState$7, updateField(Object.assign({}, newFieldState, { configShowing: null })));
    isSame(mockState$7, sameState3);

    const sameState4 = update(mockState$7, updateField(Object.assign({}, newFieldState, { required: null })));

    isSame(mockState$7, sameState4);
  });

  it("does not break the state after updating a field multiple times a field", () => {
    const mockField1 = Object.assign({}, oldFieldState, { color: "yellow" });
    const mockField2 = Object.assign({}, oldFieldState, { color: "orange" });
    const mockField3 = Object.assign({}, oldFieldState, { color: "purple" });

    const changed1 = update(mockState$7, updateField(mockField1));
    const changed2 = update(changed1, updateField(mockField2));
    const changed3 = update(changed2, updateField(mockField3));
    expect(changed3.fieldTypes.length).toEqual(mockState$7.fieldTypes.length);
    expect(changed3.fieldsState.length).toEqual(mockState$7.fieldsState.length);
    expect(changed3.fieldsState[0].id).toEqual(mockState$7.fieldsState[0].id);
    expect(changed3.fieldsState[0].color).toEqual(mockField3.color);
    expect(changed3.fieldsStateHistory.length).toEqual(3);
  });
});

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL2pzL0FjdGlvbnMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy9hY3Rpb25zLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvc2VhbWxlc3MtaW1tdXRhYmxlL3NyYy9zZWFtbGVzcy1pbW11dGFibGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy91dGlscy9hc3luY0Rpc3BhdGNoTWlkZGxld2FyZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3V0aWxzLmFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZmwtYXNzZXJ0L2Rpc3QvYXNzZXJ0LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc0FycmF5LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19zbGljZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fY2hlY2tGb3JNZXRob2QuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lzUGxhY2Vob2xkZXIuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2N1cnJ5MS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fY3VycnkyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jdXJyeTMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2xpY2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvb3Zlci5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9hbHdheXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2V0LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19hcml0eS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fcGlwZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feHdyYXAuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvYmluZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9faXNTdHJpbmcuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaXNBcnJheUxpa2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3JlZHVjZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9yZWR1Y2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvdGFpbC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9waXBlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jb25jYXQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvcHJlcGVuZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9wcm9wLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc1RyYW5zZm9ybWVyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19kaXNwYXRjaGFibGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX21hcC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feGZCYXNlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL194bWFwLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jdXJyeU4uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvY3VycnlOLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19oYXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lzQXJndW1lbnRzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2tleXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvbWFwLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2xlbnMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvY3VycnkuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLmVpdGhlci9saWIvZWl0aGVyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZGF0YS5laXRoZXIvbGliL2luZGV4LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL3V0aWxzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL3VuZG8uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lkZW50aXR5LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2lkZW50aXR5LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL3BhdGguanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvYXAuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvcmVkdWNlUmlnaHQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2VxdWVuY2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvdHJhdmVyc2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2FycmF5RnJvbUl0ZXJhdG9yLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19mdW5jdGlvbk5hbWUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaWRlbnRpY2FsLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL3R5cGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2VxdWFscy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9lcXVhbHMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvaW1wb3J0U3RhdGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3JlZHVjZWQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3hmaW5kLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ZpbmQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLnRhc2svbGliL3Rhc2suanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLnRhc2svbGliL2luZGV4LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL2NyZWF0ZUZpZWxkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2FwcGVuZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL2RhdGEubWF5YmUvbGliL21heWJlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZGF0YS5tYXliZS9saWIvaW5kZXguanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvZmllbGRDcmVhdGVkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL2ZpZWxkLnRvZ2dsZUNvbmZpZy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL2pzL1VwZGF0ZS9maWVsZC50b2dnbGVSZXF1aXJlZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fZmlsdGVyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc09iamVjdC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feGZpbHRlci5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9maWx0ZXIuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvZmllbGQuZGVsZXRlRmllbGQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvZmllbGQudXBkYXRlRmllbGQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc29ydC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL2pzL1VwZGF0ZS9yZW9yZGVyRmllbGRzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL2luZGV4LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvdGVzdHMvdXBkYXRlL3VuZG8uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy91cGRhdGUvaW1wb3J0U3RhdGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy91cGRhdGUvY3JlYXRlRmllbGQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy91cGRhdGUvZmllbGRDcmVhdGVkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvdGVzdHMvdXBkYXRlL2ZpZWxkLnRvZ2dsZUNvbmZpZy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3VwZGF0ZS9maWVsZC50b2dnbGVSZXF1aXJlZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3VwZGF0ZS9maWVsZC5kZWxldGVGaWVsZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3VwZGF0ZS9maWVsZC51cGRhdGVGaWVsZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvL1xuLy8gICAgQUNUSU9OIENSRUFUT1JTXG4vL1xuXG5leHBvcnQgY29uc3QgdW5kbyA9IF8gPT5cbih7XG4gIHR5cGU6IFwidW5kb1wiLFxufSk7XG5cbmV4cG9ydCBjb25zdCBpbXBvcnRTdGF0ZSA9IG5ld0ZpZWxkc1N0YXRlID0+XG4oe1xuICB0eXBlOiBcImltcG9ydFN0YXRlXCIsXG4gIG5ld0ZpZWxkc1N0YXRlLFxufSk7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVGaWVsZCA9IGZpZWxkVHlwZSA9PlxuKHtcbiAgdHlwZTogXCJjcmVhdGVGaWVsZFwiLFxuICBmaWVsZFR5cGUsXG59KTtcblxuZXhwb3J0IGNvbnN0IGZpZWxkQ3JlYXRlZCA9IGNyZWF0ZWRGaWVsZFN0YXRlID0+XG4oe1xuICB0eXBlOiBcImZpZWxkQ3JlYXRlZFwiLFxuICBjcmVhdGVkRmllbGRTdGF0ZSxcbn0pO1xuXG5leHBvcnQgY29uc3QgdG9nZ2xlQ29uZmlnID0gZmllbGRTdGF0ZSA9PlxuKHtcbiAgdHlwZTogXCJ0b2dnbGVDb25maWdcIixcbiAgZmllbGRTdGF0ZSxcbn0pO1xuXG5leHBvcnQgY29uc3QgdG9nZ2xlUmVxdWlyZWQgPSBmaWVsZFN0YXRlID0+XG4oe1xuICB0eXBlOiBcInRvZ2dsZVJlcXVpcmVkXCIsXG4gIGZpZWxkU3RhdGUsXG59KTtcblxuZXhwb3J0IGNvbnN0IGRlbGV0ZUZpZWxkID0gZmllbGRTdGF0ZSA9PlxuKHtcbiAgdHlwZTogXCJkZWxldGVGaWVsZFwiLFxuICBmaWVsZFN0YXRlLFxufSk7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVGaWVsZCA9IG5ld0ZpZWxkU3RhdGUgPT5cbih7XG4gIHR5cGU6IFwidXBkYXRlRmllbGRcIixcbiAgbmV3RmllbGRTdGF0ZSxcbn0pO1xuXG5leHBvcnQgY29uc3QgcmVvcmRlckZpZWxkcyA9IG5ld0ZpZWxkc09yZGVyID0+XG4oe1xuICB0eXBlOiBcInJlb3JkZXJGaWVsZHNcIixcbiAgbmV3RmllbGRzT3JkZXIsXG59KTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuXG5pbXBvcnQge1xuICB1bmRvLFxuICBpbXBvcnRTdGF0ZSxcbiAgY3JlYXRlRmllbGQsXG4gIGZpZWxkQ3JlYXRlZCxcbiAgdG9nZ2xlQ29uZmlnLFxuICB0b2dnbGVSZXF1aXJlZCxcbiAgZGVsZXRlRmllbGQsXG4gIHVwZGF0ZUZpZWxkLFxuICByZW9yZGVyRmllbGRzLFxufSBmcm9tIFwiLi4vanMvQWN0aW9uc1wiO1xuXG5kZXNjcmliZShcIkFjdGlvblwiLCAoKSA9PiB7XG4gIGRlc2NyaWJlKFwidW5kb1wiLCAoKSA9PiB7XG4gICAgaXQoXCJyZXR1cm5zIHRoZSBjb3JyZWN0IGFjdGlvbiB0eXBlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHVuZG8oKTtcbiAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChcInVuZG9cIik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiaW1wb3J0U3RhdGVcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tTdGF0ZVRvSW1wb3J0ID0gW1wiYVwiLCBcImJcIl07XG5cbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gaW1wb3J0U3RhdGUobW9ja1N0YXRlVG9JbXBvcnQpO1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwiaW1wb3J0U3RhdGVcIik7XG4gICAgfSk7XG5cbiAgICBpdChcIkNyZWF0ZXMgdGhlIGNvcnJlY3QgdmFyaWFibGVzXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGltcG9ydFN0YXRlKG1vY2tTdGF0ZVRvSW1wb3J0KTtcbiAgICAgIGV4cGVjdChhY3Rpb24ubmV3RmllbGRzU3RhdGUpLnRvRXF1YWwobW9ja1N0YXRlVG9JbXBvcnQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcImNyZWF0ZUZpZWxkXCIsICgpID0+IHtcbiAgICBjb25zdCBmaWVsZFR5cGUgPSBcInRlc3RGaWVsZFwiO1xuXG4gICAgaXQoXCJyZXR1cm5zIHRoZSBjb3JyZWN0IGFjdGlvbiB0eXBlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGNyZWF0ZUZpZWxkKGZpZWxkVHlwZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJjcmVhdGVGaWVsZFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiQ3JlYXRlcyB0aGUgY29ycmVjdCB2YXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gY3JlYXRlRmllbGQoZmllbGRUeXBlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24uZmllbGRUeXBlKS50b0VxdWFsKGZpZWxkVHlwZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiZmllbGRDcmVhdGVkXCIsICgpID0+IHtcbiAgICBjb25zdCBjcmVhdGVkRmllbGRTdGF0ZSA9IHt9O1xuXG4gICAgaXQoXCJyZXR1cm5zIHRoZSBjb3JyZWN0IGFjdGlvbiB0eXBlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGZpZWxkQ3JlYXRlZChjcmVhdGVkRmllbGRTdGF0ZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJmaWVsZENyZWF0ZWRcIik7XG4gICAgfSk7XG5cbiAgICBpdChcIkNyZWF0ZXMgdGhlIGNvcnJlY3QgdmFyaWFibGVzXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGZpZWxkQ3JlYXRlZChjcmVhdGVkRmllbGRTdGF0ZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlKS50b0VxdWFsKGNyZWF0ZWRGaWVsZFN0YXRlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJ0b2dnbGVDb25maWdcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGZpZWxkU3RhdGUgPSB7fTtcblxuICAgIGl0KFwicmV0dXJucyB0aGUgY29ycmVjdCBhY3Rpb24gdHlwZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSB0b2dnbGVDb25maWcoZmllbGRTdGF0ZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJ0b2dnbGVDb25maWdcIik7XG4gICAgfSk7XG5cbiAgICBpdChcIkNyZWF0ZXMgdGhlIGNvcnJlY3QgdmFyaWFibGVzXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHRvZ2dsZUNvbmZpZyhmaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24uZmllbGRTdGF0ZSkudG9FcXVhbChmaWVsZFN0YXRlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJ0b2dnbGVSZXF1aXJlZFwiLCAoKSA9PiB7XG4gICAgY29uc3QgZmllbGRTdGF0ZSA9IHt9O1xuXG4gICAgaXQoXCJyZXR1cm5zIHRoZSBjb3JyZWN0IGFjdGlvbiB0eXBlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHRvZ2dsZVJlcXVpcmVkKGZpZWxkU3RhdGUpO1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwidG9nZ2xlUmVxdWlyZWRcIik7XG4gICAgfSk7XG5cbiAgICBpdChcIkNyZWF0ZXMgdGhlIGNvcnJlY3QgdmFyaWFibGVzXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHRvZ2dsZVJlcXVpcmVkKGZpZWxkU3RhdGUpO1xuICAgICAgZXhwZWN0KGFjdGlvbi5maWVsZFN0YXRlKS50b0VxdWFsKGZpZWxkU3RhdGUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcImRlbGV0ZUZpZWxkXCIsICgpID0+IHtcbiAgICBjb25zdCBmaWVsZFN0YXRlID0ge307XG5cbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gZGVsZXRlRmllbGQoZmllbGRTdGF0ZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJkZWxldGVGaWVsZFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiQ3JlYXRlcyB0aGUgY29ycmVjdCB2YXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gZGVsZXRlRmllbGQoZmllbGRTdGF0ZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLmZpZWxkU3RhdGUpLnRvRXF1YWwoZmllbGRTdGF0ZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwidXBkYXRlRmllbGRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG5ld0ZpZWxkU3RhdGUgPSB7fTtcblxuICAgIGl0KFwicmV0dXJucyB0aGUgY29ycmVjdCBhY3Rpb24gdHlwZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSB1cGRhdGVGaWVsZChuZXdGaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChcInVwZGF0ZUZpZWxkXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJDcmVhdGVzIHRoZSBjb3JyZWN0IHZhcmlhYmxlc1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSB1cGRhdGVGaWVsZChuZXdGaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24ubmV3RmllbGRTdGF0ZSkudG9FcXVhbChuZXdGaWVsZFN0YXRlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJyZW9yZGVyRmllbGRzXCIsICgpID0+IHtcbiAgICBjb25zdCBuZXdGaWVsZHNPcmRlciA9IHt9O1xuXG4gICAgaXQoXCJyZXR1cm5zIHRoZSBjb3JyZWN0IGFjdGlvbiB0eXBlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHJlb3JkZXJGaWVsZHMobmV3RmllbGRzT3JkZXIpO1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwicmVvcmRlckZpZWxkc1wiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiQ3JlYXRlcyB0aGUgY29ycmVjdCB2YXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gcmVvcmRlckZpZWxkcyhuZXdGaWVsZHNPcmRlcik7XG4gICAgICBleHBlY3QoYWN0aW9uLm5ld0ZpZWxkc09yZGVyKS50b0VxdWFsKG5ld0ZpZWxkc09yZGVyKTtcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuIiwiKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gaW1tdXRhYmxlSW5pdChjb25maWcpIHtcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi92MTUuMC4xL3NyYy9pc29tb3JwaGljL2NsYXNzaWMvZWxlbWVudC9SZWFjdEVsZW1lbnQuanMjTDIxXG4gIHZhciBSRUFDVF9FTEVNRU5UX1RZUEUgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5mb3IgJiYgU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpO1xuICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFX0ZBTExCQUNLID0gMHhlYWM3O1xuXG4gIHZhciBnbG9iYWxDb25maWcgPSB7XG4gICAgdXNlX3N0YXRpYzogZmFsc2VcbiAgfTtcbiAgaWYgKGlzT2JqZWN0KGNvbmZpZykpIHtcbiAgICAgIGlmIChjb25maWcudXNlX3N0YXRpYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZ2xvYmFsQ29uZmlnLnVzZV9zdGF0aWMgPSBCb29sZWFuKGNvbmZpZy51c2Vfc3RhdGljKTtcbiAgICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzT2JqZWN0KGRhdGEpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmXG4gICAgICAhQXJyYXkuaXNBcnJheShkYXRhKSAmJlxuICAgICAgZGF0YSAhPT0gbnVsbFxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KG9iaikge1xuICAgICAgdmFyIHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgICAgaWYgKCFwcm90b3R5cGUpIHtcbiAgICAgICAgICByZXR1cm4ge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKHByb3RvdHlwZSk7XG4gICAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRQcm9wZXJ0eVRvKHRhcmdldCwgbWV0aG9kTmFtZSwgdmFsdWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBtZXRob2ROYW1lLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJhblByb3BlcnR5KHRhcmdldCwgbWV0aG9kTmFtZSkge1xuICAgIGFkZFByb3BlcnR5VG8odGFyZ2V0LCBtZXRob2ROYW1lLCBmdW5jdGlvbigpIHtcbiAgICAgIHRocm93IG5ldyBJbW11dGFibGVFcnJvcihcIlRoZSBcIiArIG1ldGhvZE5hbWUgK1xuICAgICAgICBcIiBtZXRob2QgY2Fubm90IGJlIGludm9rZWQgb24gYW4gSW1tdXRhYmxlIGRhdGEgc3RydWN0dXJlLlwiKTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBpbW11dGFiaWxpdHlUYWcgPSBcIl9faW1tdXRhYmxlX2ludmFyaWFudHNfaG9sZFwiO1xuXG4gIGZ1bmN0aW9uIGFkZEltbXV0YWJpbGl0eVRhZyh0YXJnZXQpIHtcbiAgICBhZGRQcm9wZXJ0eVRvKHRhcmdldCwgaW1tdXRhYmlsaXR5VGFnLCB0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzSW1tdXRhYmxlKHRhcmdldCkge1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0ID09PSBudWxsIHx8IEJvb2xlYW4oXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBpbW11dGFiaWxpdHlUYWcpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJbiBKYXZhU2NyaXB0LCBvbmx5IG9iamVjdHMgYXJlIGV2ZW4gcG90ZW50aWFsbHkgbXV0YWJsZS5cbiAgICAgIC8vIHN0cmluZ3MsIG51bWJlcnMsIG51bGwsIGFuZCB1bmRlZmluZWQgYXJlIGFsbCBuYXR1cmFsbHkgaW1tdXRhYmxlLlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNFcXVhbChhLCBiKSB7XG4gICAgLy8gQXZvaWQgZmFsc2UgcG9zaXRpdmVzIGR1ZSB0byAoTmFOICE9PSBOYU4pIGV2YWx1YXRpbmcgdG8gdHJ1ZVxuICAgIHJldHVybiAoYSA9PT0gYiB8fCAoYSAhPT0gYSAmJiBiICE9PSBiKSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc01lcmdhYmxlT2JqZWN0KHRhcmdldCkge1xuICAgIHJldHVybiB0YXJnZXQgIT09IG51bGwgJiYgdHlwZW9mIHRhcmdldCA9PT0gXCJvYmplY3RcIiAmJiAhKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkgJiYgISh0YXJnZXQgaW5zdGFuY2VvZiBEYXRlKTtcbiAgfVxuXG4gIHZhciBtdXRhdGluZ09iamVjdE1ldGhvZHMgPSBbXG4gICAgXCJzZXRQcm90b3R5cGVPZlwiXG4gIF07XG5cbiAgdmFyIG5vbk11dGF0aW5nT2JqZWN0TWV0aG9kcyA9IFtcbiAgICBcImtleXNcIlxuICBdO1xuXG4gIHZhciBtdXRhdGluZ0FycmF5TWV0aG9kcyA9IG11dGF0aW5nT2JqZWN0TWV0aG9kcy5jb25jYXQoW1xuICAgIFwicHVzaFwiLCBcInBvcFwiLCBcInNvcnRcIiwgXCJzcGxpY2VcIiwgXCJzaGlmdFwiLCBcInVuc2hpZnRcIiwgXCJyZXZlcnNlXCJcbiAgXSk7XG5cbiAgdmFyIG5vbk11dGF0aW5nQXJyYXlNZXRob2RzID0gbm9uTXV0YXRpbmdPYmplY3RNZXRob2RzLmNvbmNhdChbXG4gICAgXCJtYXBcIiwgXCJmaWx0ZXJcIiwgXCJzbGljZVwiLCBcImNvbmNhdFwiLCBcInJlZHVjZVwiLCBcInJlZHVjZVJpZ2h0XCJcbiAgXSk7XG5cbiAgdmFyIG11dGF0aW5nRGF0ZU1ldGhvZHMgPSBtdXRhdGluZ09iamVjdE1ldGhvZHMuY29uY2F0KFtcbiAgICBcInNldERhdGVcIiwgXCJzZXRGdWxsWWVhclwiLCBcInNldEhvdXJzXCIsIFwic2V0TWlsbGlzZWNvbmRzXCIsIFwic2V0TWludXRlc1wiLCBcInNldE1vbnRoXCIsIFwic2V0U2Vjb25kc1wiLFxuICAgIFwic2V0VGltZVwiLCBcInNldFVUQ0RhdGVcIiwgXCJzZXRVVENGdWxsWWVhclwiLCBcInNldFVUQ0hvdXJzXCIsIFwic2V0VVRDTWlsbGlzZWNvbmRzXCIsIFwic2V0VVRDTWludXRlc1wiLFxuICAgIFwic2V0VVRDTW9udGhcIiwgXCJzZXRVVENTZWNvbmRzXCIsIFwic2V0WWVhclwiXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIEltbXV0YWJsZUVycm9yKG1lc3NhZ2UpIHtcbiAgICB2YXIgZXJyICAgICAgID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIC8vIFRPRE86IENvbnNpZGVyIGBPYmplY3Quc2V0UHJvdG90eXBlT2YoZXJyLCBJbW11dGFibGVFcnJvcik7YFxuICAgIGVyci5fX3Byb3RvX18gPSBJbW11dGFibGVFcnJvcjtcblxuICAgIHJldHVybiBlcnI7XG4gIH1cbiAgSW1tdXRhYmxlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG4gIGZ1bmN0aW9uIG1ha2VJbW11dGFibGUob2JqLCBiYW5uZWRNZXRob2RzKSB7XG4gICAgLy8gVGFnIGl0IHNvIHdlIGNhbiBxdWlja2x5IHRlbGwgaXQncyBpbW11dGFibGUgbGF0ZXIuXG4gICAgYWRkSW1tdXRhYmlsaXR5VGFnKG9iaik7XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAvLyBNYWtlIGFsbCBtdXRhdGluZyBtZXRob2RzIHRocm93IGV4Y2VwdGlvbnMuXG4gICAgICBmb3IgKHZhciBpbmRleCBpbiBiYW5uZWRNZXRob2RzKSB7XG4gICAgICAgIGlmIChiYW5uZWRNZXRob2RzLmhhc093blByb3BlcnR5KGluZGV4KSkge1xuICAgICAgICAgIGJhblByb3BlcnR5KG9iaiwgYmFubmVkTWV0aG9kc1tpbmRleF0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEZyZWV6ZSBpdCBhbmQgcmV0dXJuIGl0LlxuICAgICAgT2JqZWN0LmZyZWV6ZShvYmopO1xuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlTWV0aG9kUmV0dXJuSW1tdXRhYmxlKG9iaiwgbWV0aG9kTmFtZSkge1xuICAgIHZhciBjdXJyZW50TWV0aG9kID0gb2JqW21ldGhvZE5hbWVdO1xuXG4gICAgYWRkUHJvcGVydHlUbyhvYmosIG1ldGhvZE5hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIEltbXV0YWJsZShjdXJyZW50TWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBhcnJheVNldChpZHgsIHZhbHVlLCBjb25maWcpIHtcbiAgICB2YXIgZGVlcCAgICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcuZGVlcDtcblxuICAgIGlmIChpZHggaW4gdGhpcykge1xuICAgICAgaWYgKGRlZXAgJiYgdGhpc1tpZHhdICE9PSB2YWx1ZSAmJiBpc01lcmdhYmxlT2JqZWN0KHZhbHVlKSAmJiBpc01lcmdhYmxlT2JqZWN0KHRoaXNbaWR4XSkpIHtcbiAgICAgICAgdmFsdWUgPSBJbW11dGFibGUubWVyZ2UodGhpc1tpZHhdLCB2YWx1ZSwge2RlZXA6IHRydWUsIG1vZGU6ICdyZXBsYWNlJ30pO1xuICAgICAgfVxuICAgICAgaWYgKGlzRXF1YWwodGhpc1tpZHhdLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG11dGFibGUgPSBhc011dGFibGVBcnJheS5jYWxsKHRoaXMpO1xuICAgIG11dGFibGVbaWR4XSA9IEltbXV0YWJsZSh2YWx1ZSk7XG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGVBcnJheShtdXRhYmxlKTtcbiAgfVxuXG4gIHZhciBpbW11dGFibGVFbXB0eUFycmF5ID0gSW1tdXRhYmxlKFtdKTtcblxuICBmdW5jdGlvbiBhcnJheVNldEluKHB0aCwgdmFsdWUsIGNvbmZpZykge1xuICAgIHZhciBoZWFkID0gcHRoWzBdO1xuXG4gICAgaWYgKHB0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBhcnJheVNldC5jYWxsKHRoaXMsIGhlYWQsIHZhbHVlLCBjb25maWcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGFpbCA9IHB0aC5zbGljZSgxKTtcbiAgICAgIHZhciB0aGlzSGVhZCA9IHRoaXNbaGVhZF07XG4gICAgICB2YXIgbmV3VmFsdWU7XG5cbiAgICAgIGlmICh0eXBlb2YodGhpc0hlYWQpID09PSBcIm9iamVjdFwiICYmIHRoaXNIZWFkICE9PSBudWxsKSB7XG4gICAgICAgIC8vIE1pZ2h0ICh2YWxpZGx5KSBiZSBvYmplY3Qgb3IgYXJyYXlcbiAgICAgICAgbmV3VmFsdWUgPSBJbW11dGFibGUuc2V0SW4odGhpc0hlYWQsIHRhaWwsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXh0SGVhZCA9IHRhaWxbMF07XG4gICAgICAgIC8vIElmIHRoZSBuZXh0IHBhdGggcGFydCBpcyBhIG51bWJlciwgdGhlbiB3ZSBhcmUgc2V0dGluZyBpbnRvIGFuIGFycmF5LCBlbHNlIGFuIG9iamVjdC5cbiAgICAgICAgaWYgKG5leHRIZWFkICE9PSAnJyAmJiBpc0Zpbml0ZShuZXh0SGVhZCkpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGFycmF5U2V0SW4uY2FsbChpbW11dGFibGVFbXB0eUFycmF5LCB0YWlsLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBvYmplY3RTZXRJbi5jYWxsKGltbXV0YWJsZUVtcHR5T2JqZWN0LCB0YWlsLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGhlYWQgaW4gdGhpcyAmJiB0aGlzSGVhZCA9PT0gbmV3VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHZhciBtdXRhYmxlID0gYXNNdXRhYmxlQXJyYXkuY2FsbCh0aGlzKTtcbiAgICAgIG11dGFibGVbaGVhZF0gPSBuZXdWYWx1ZTtcbiAgICAgIHJldHVybiBtYWtlSW1tdXRhYmxlQXJyYXkobXV0YWJsZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWFrZUltbXV0YWJsZUFycmF5KGFycmF5KSB7XG4gICAgLy8gRG9uJ3QgY2hhbmdlIHRoZWlyIGltcGxlbWVudGF0aW9ucywgYnV0IHdyYXAgdGhlc2UgZnVuY3Rpb25zIHRvIG1ha2Ugc3VyZVxuICAgIC8vIHRoZXkgYWx3YXlzIHJldHVybiBhbiBpbW11dGFibGUgdmFsdWUuXG4gICAgZm9yICh2YXIgaW5kZXggaW4gbm9uTXV0YXRpbmdBcnJheU1ldGhvZHMpIHtcbiAgICAgIGlmIChub25NdXRhdGluZ0FycmF5TWV0aG9kcy5oYXNPd25Qcm9wZXJ0eShpbmRleCkpIHtcbiAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBub25NdXRhdGluZ0FycmF5TWV0aG9kc1tpbmRleF07XG4gICAgICAgIG1ha2VNZXRob2RSZXR1cm5JbW11dGFibGUoYXJyYXksIG1ldGhvZE5hbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZ2xvYmFsQ29uZmlnLnVzZV9zdGF0aWMpIHtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwiZmxhdE1hcFwiLCAgZmxhdE1hcCk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGFycmF5LCBcImFzT2JqZWN0XCIsIGFzT2JqZWN0KTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwiYXNNdXRhYmxlXCIsIGFzTXV0YWJsZUFycmF5KTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwic2V0XCIsIGFycmF5U2V0KTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwic2V0SW5cIiwgYXJyYXlTZXRJbik7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGFycmF5LCBcInVwZGF0ZVwiLCB1cGRhdGUpO1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJ1cGRhdGVJblwiLCB1cGRhdGVJbik7XG4gICAgfVxuXG4gICAgZm9yKHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGFycmF5W2ldID0gSW1tdXRhYmxlKGFycmF5W2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZShhcnJheSwgbXV0YXRpbmdBcnJheU1ldGhvZHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZUltbXV0YWJsZURhdGUoZGF0ZSkge1xuICAgIGlmICghZ2xvYmFsQ29uZmlnLnVzZV9zdGF0aWMpIHtcbiAgICAgIGFkZFByb3BlcnR5VG8oZGF0ZSwgXCJhc011dGFibGVcIiwgYXNNdXRhYmxlRGF0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGUoZGF0ZSwgbXV0YXRpbmdEYXRlTWV0aG9kcyk7XG4gIH1cblxuICBmdW5jdGlvbiBhc011dGFibGVEYXRlKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLmdldFRpbWUoKSk7XG4gIH1cblxuICAvKipcbiAgICogRWZmZWN0aXZlbHkgcGVyZm9ybXMgYSBtYXAoKSBvdmVyIHRoZSBlbGVtZW50cyBpbiB0aGUgYXJyYXksIHVzaW5nIHRoZVxuICAgKiBwcm92aWRlZCBpdGVyYXRvciwgZXhjZXB0IHRoYXQgd2hlbmV2ZXIgdGhlIGl0ZXJhdG9yIHJldHVybnMgYW4gYXJyYXksIHRoYXRcbiAgICogYXJyYXkncyBlbGVtZW50cyBhcmUgYWRkZWQgdG8gdGhlIGZpbmFsIHJlc3VsdCBpbnN0ZWFkIG9mIHRoZSBhcnJheSBpdHNlbGYuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdG9yIC0gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBpbnZva2VkIG9uIGVhY2ggZWxlbWVudCBpbiB0aGUgYXJyYXkuIEl0IHdpbGwgcmVjZWl2ZSB0aHJlZSBhcmd1bWVudHM6IHRoZSBjdXJyZW50IHZhbHVlLCB0aGUgY3VycmVudCBpbmRleCwgYW5kIHRoZSBjdXJyZW50IG9iamVjdC5cbiAgICovXG4gIGZ1bmN0aW9uIGZsYXRNYXAoaXRlcmF0b3IpIHtcbiAgICAvLyBDYWxsaW5nIC5mbGF0TWFwKCkgd2l0aCBubyBhcmd1bWVudHMgaXMgYSBuby1vcC4gRG9uJ3QgYm90aGVyIGNsb25pbmcuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBbXSxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIGluZGV4O1xuXG4gICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgaXRlcmF0b3JSZXN1bHQgPSBpdGVyYXRvcih0aGlzW2luZGV4XSwgaW5kZXgsIHRoaXMpO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShpdGVyYXRvclJlc3VsdCkpIHtcbiAgICAgICAgLy8gQ29uY2F0ZW5hdGUgQXJyYXkgcmVzdWx0cyBpbnRvIHRoZSByZXR1cm4gdmFsdWUgd2UncmUgYnVpbGRpbmcgdXAuXG4gICAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgaXRlcmF0b3JSZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSGFuZGxlIG5vbi1BcnJheSByZXN1bHRzIHRoZSBzYW1lIHdheSBtYXAoKSBkb2VzLlxuICAgICAgICByZXN1bHQucHVzaChpdGVyYXRvclJlc3VsdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGVBcnJheShyZXN1bHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gSW1tdXRhYmxlIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBnaXZlbiBrZXlzIGluY2x1ZGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5fSBrZXlzVG9SZW1vdmUgLSBBIGxpc3Qgb2Ygc3RyaW5ncyByZXByZXNlbnRpbmcgdGhlIGtleXMgdG8gZXhjbHVkZSBpbiB0aGUgcmV0dXJuIHZhbHVlLiBJbnN0ZWFkIG9mIHByb3ZpZGluZyBhIHNpbmdsZSBhcnJheSwgdGhpcyBtZXRob2QgY2FuIGFsc28gYmUgY2FsbGVkIGJ5IHBhc3NpbmcgbXVsdGlwbGUgc3RyaW5ncyBhcyBzZXBhcmF0ZSBhcmd1bWVudHMuXG4gICAqL1xuICBmdW5jdGlvbiB3aXRob3V0KHJlbW92ZSkge1xuICAgIC8vIENhbGxpbmcgLndpdGhvdXQoKSB3aXRoIG5vIGFyZ3VtZW50cyBpcyBhIG5vLW9wLiBEb24ndCBib3RoZXIgY2xvbmluZy5cbiAgICBpZiAodHlwZW9mIHJlbW92ZSA9PT0gXCJ1bmRlZmluZWRcIiAmJiBhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHJlbW92ZSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAvLyBJZiB3ZSB3ZXJlbid0IGdpdmVuIGFuIGFycmF5LCB1c2UgdGhlIGFyZ3VtZW50cyBsaXN0LlxuICAgICAgdmFyIGtleXNUb1JlbW92ZUFycmF5ID0gKEFycmF5LmlzQXJyYXkocmVtb3ZlKSkgP1xuICAgICAgICAgcmVtb3ZlLnNsaWNlKCkgOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAvLyBDb252ZXJ0IG51bWVyaWMga2V5cyB0byBzdHJpbmdzIHNpbmNlIHRoYXQncyBob3cgdGhleSdsbFxuICAgICAgLy8gY29tZSBmcm9tIHRoZSBlbnVtZXJhdGlvbiBvZiB0aGUgb2JqZWN0LlxuICAgICAga2V5c1RvUmVtb3ZlQXJyYXkuZm9yRWFjaChmdW5jdGlvbihlbCwgaWR4LCBhcnIpIHtcbiAgICAgICAgaWYodHlwZW9mKGVsKSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgIGFycltpZHhdID0gZWwudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJlbW92ZSA9IGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgIHJldHVybiBrZXlzVG9SZW1vdmVBcnJheS5pbmRleE9mKGtleSkgIT09IC0xO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gaW5zdGFudGlhdGVFbXB0eU9iamVjdCh0aGlzKTtcblxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzKSB7XG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHJlbW92ZSh0aGlzW2tleV0sIGtleSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gdGhpc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KHJlc3VsdCk7XG4gIH1cblxuICBmdW5jdGlvbiBhc011dGFibGVBcnJheShvcHRzKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdLCBpLCBsZW5ndGg7XG5cbiAgICBpZihvcHRzICYmIG9wdHMuZGVlcCkge1xuICAgICAgZm9yKGkgPSAwLCBsZW5ndGggPSB0aGlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGFzRGVlcE11dGFibGUodGhpc1tpXSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IoaSA9IDAsIGxlbmd0aCA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0LnB1c2godGhpc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFZmZlY3RpdmVseSBwZXJmb3JtcyBhIFttYXBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L21hcCkgb3ZlciB0aGUgZWxlbWVudHMgaW4gdGhlIGFycmF5LCBleHBlY3RpbmcgdGhhdCB0aGUgaXRlcmF0b3IgZnVuY3Rpb25cbiAgICogd2lsbCByZXR1cm4gYW4gYXJyYXkgb2YgdHdvIGVsZW1lbnRzIC0gdGhlIGZpcnN0IHJlcHJlc2VudGluZyBhIGtleSwgdGhlIG90aGVyXG4gICAqIGEgdmFsdWUuIFRoZW4gcmV0dXJucyBhbiBJbW11dGFibGUgT2JqZWN0IGNvbnN0cnVjdGVkIG9mIHRob3NlIGtleXMgYW5kIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gaXRlcmF0b3IgLSBBIGZ1bmN0aW9uIHdoaWNoIHNob3VsZCByZXR1cm4gYW4gYXJyYXkgb2YgdHdvIGVsZW1lbnRzIC0gdGhlIGZpcnN0IHJlcHJlc2VudGluZyB0aGUgZGVzaXJlZCBrZXksIHRoZSBvdGhlciB0aGUgZGVzaXJlZCB2YWx1ZS5cbiAgICovXG4gIGZ1bmN0aW9uIGFzT2JqZWN0KGl0ZXJhdG9yKSB7XG4gICAgLy8gSWYgbm8gaXRlcmF0b3Igd2FzIHByb3ZpZGVkLCBhc3N1bWUgdGhlIGlkZW50aXR5IGZ1bmN0aW9uXG4gICAgLy8gKHN1Z2dlc3RpbmcgdGhpcyBhcnJheSBpcyBhbHJlYWR5IGEgbGlzdCBvZiBrZXkvdmFsdWUgcGFpcnMuKVxuICAgIGlmICh0eXBlb2YgaXRlcmF0b3IgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgaXRlcmF0b3IgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgaW5kZXg7XG5cbiAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBwYWlyICA9IGl0ZXJhdG9yKHRoaXNbaW5kZXhdLCBpbmRleCwgdGhpcyksXG4gICAgICAgICAga2V5ICAgPSBwYWlyWzBdLFxuICAgICAgICAgIHZhbHVlID0gcGFpclsxXTtcblxuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZU9iamVjdChyZXN1bHQpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNEZWVwTXV0YWJsZShvYmopIHtcbiAgICBpZiAoXG4gICAgICAoIW9iaikgfHxcbiAgICAgICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykgfHxcbiAgICAgICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGltbXV0YWJpbGl0eVRhZykpIHx8XG4gICAgICAob2JqIGluc3RhbmNlb2YgRGF0ZSlcbiAgICApIHsgcmV0dXJuIG9iajsgfVxuICAgIHJldHVybiBJbW11dGFibGUuYXNNdXRhYmxlKG9iaiwge2RlZXA6IHRydWV9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHF1aWNrQ29weShzcmMsIGRlc3QpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XG4gICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzcmMsIGtleSkpIHtcbiAgICAgICAgZGVzdFtrZXldID0gc3JjW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlc3Q7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBJbW11dGFibGUgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHByb3BlcnRpZXMgYW5kIHZhbHVlcyBvZiBib3RoXG4gICAqIHRoaXMgb2JqZWN0IGFuZCB0aGUgcHJvdmlkZWQgb2JqZWN0LCBwcmlvcml0aXppbmcgdGhlIHByb3ZpZGVkIG9iamVjdCdzXG4gICAqIHZhbHVlcyB3aGVuZXZlciB0aGUgc2FtZSBrZXkgaXMgcHJlc2VudCBpbiBib3RoIG9iamVjdHMuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvdGhlciAtIFRoZSBvdGhlciBvYmplY3QgdG8gbWVyZ2UuIE11bHRpcGxlIG9iamVjdHMgY2FuIGJlIHBhc3NlZCBhcyBhbiBhcnJheS4gSW4gc3VjaCBhIGNhc2UsIHRoZSBsYXRlciBhbiBvYmplY3QgYXBwZWFycyBpbiB0aGF0IGxpc3QsIHRoZSBoaWdoZXIgaXRzIHByaW9yaXR5LlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIC0gT3B0aW9uYWwgY29uZmlnIG9iamVjdCB0aGF0IGNvbnRhaW5zIHNldHRpbmdzLiBTdXBwb3J0ZWQgc2V0dGluZ3MgYXJlOiB7ZGVlcDogdHJ1ZX0gZm9yIGRlZXAgbWVyZ2UgYW5kIHttZXJnZXI6IG1lcmdlckZ1bmN9IHdoZXJlIG1lcmdlckZ1bmMgaXMgYSBmdW5jdGlvblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCB0YWtlcyBhIHByb3BlcnR5IGZyb20gYm90aCBvYmplY3RzLiBJZiBhbnl0aGluZyBpcyByZXR1cm5lZCBpdCBvdmVycmlkZXMgdGhlIG5vcm1hbCBtZXJnZSBiZWhhdmlvdXIuXG4gICAqL1xuICBmdW5jdGlvbiBtZXJnZShvdGhlciwgY29uZmlnKSB7XG4gICAgLy8gQ2FsbGluZyAubWVyZ2UoKSB3aXRoIG5vIGFyZ3VtZW50cyBpcyBhIG5vLW9wLiBEb24ndCBib3RoZXIgY2xvbmluZy5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKG90aGVyID09PSBudWxsIHx8ICh0eXBlb2Ygb3RoZXIgIT09IFwib2JqZWN0XCIpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW1tdXRhYmxlI21lcmdlIGNhbiBvbmx5IGJlIGludm9rZWQgd2l0aCBvYmplY3RzIG9yIGFycmF5cywgbm90IFwiICsgSlNPTi5zdHJpbmdpZnkob3RoZXIpKTtcbiAgICB9XG5cbiAgICB2YXIgcmVjZWl2ZWRBcnJheSA9IChBcnJheS5pc0FycmF5KG90aGVyKSksXG4gICAgICAgIGRlZXAgICAgICAgICAgPSBjb25maWcgJiYgY29uZmlnLmRlZXAsXG4gICAgICAgIG1vZGUgICAgICAgICAgPSBjb25maWcgJiYgY29uZmlnLm1vZGUgfHwgJ21lcmdlJyxcbiAgICAgICAgbWVyZ2VyICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcubWVyZ2VyLFxuICAgICAgICByZXN1bHQ7XG5cbiAgICAvLyBVc2UgdGhlIGdpdmVuIGtleSB0byBleHRyYWN0IGEgdmFsdWUgZnJvbSB0aGUgZ2l2ZW4gb2JqZWN0LCB0aGVuIHBsYWNlXG4gICAgLy8gdGhhdCB2YWx1ZSBpbiB0aGUgcmVzdWx0IG9iamVjdCB1bmRlciB0aGUgc2FtZSBrZXkuIElmIHRoYXQgcmVzdWx0ZWRcbiAgICAvLyBpbiBhIGNoYW5nZSBmcm9tIHRoaXMgb2JqZWN0J3MgdmFsdWUgYXQgdGhhdCBrZXksIHNldCBhbnlDaGFuZ2VzID0gdHJ1ZS5cbiAgICBmdW5jdGlvbiBhZGRUb1Jlc3VsdChjdXJyZW50T2JqLCBvdGhlck9iaiwga2V5KSB7XG4gICAgICB2YXIgaW1tdXRhYmxlVmFsdWUgPSBJbW11dGFibGUob3RoZXJPYmpba2V5XSk7XG4gICAgICB2YXIgbWVyZ2VyUmVzdWx0ID0gbWVyZ2VyICYmIG1lcmdlcihjdXJyZW50T2JqW2tleV0sIGltbXV0YWJsZVZhbHVlLCBjb25maWcpO1xuICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRPYmpba2V5XTtcblxuICAgICAgaWYgKChyZXN1bHQgIT09IHVuZGVmaW5lZCkgfHxcbiAgICAgICAgKG1lcmdlclJlc3VsdCAhPT0gdW5kZWZpbmVkKSB8fFxuICAgICAgICAoIWN1cnJlbnRPYmouaGFzT3duUHJvcGVydHkoa2V5KSkgfHxcbiAgICAgICAgIWlzRXF1YWwoaW1tdXRhYmxlVmFsdWUsIGN1cnJlbnRWYWx1ZSkpIHtcblxuICAgICAgICB2YXIgbmV3VmFsdWU7XG5cbiAgICAgICAgaWYgKG1lcmdlclJlc3VsdCkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gbWVyZ2VyUmVzdWx0O1xuICAgICAgICB9IGVsc2UgaWYgKGRlZXAgJiYgaXNNZXJnYWJsZU9iamVjdChjdXJyZW50VmFsdWUpICYmIGlzTWVyZ2FibGVPYmplY3QoaW1tdXRhYmxlVmFsdWUpKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBJbW11dGFibGUubWVyZ2UoY3VycmVudFZhbHVlLCBpbW11dGFibGVWYWx1ZSwgY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IGltbXV0YWJsZVZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0VxdWFsKGN1cnJlbnRWYWx1ZSwgbmV3VmFsdWUpIHx8ICFjdXJyZW50T2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIE1ha2UgYSBzaGFsbG93IGNsb25lIG9mIHRoZSBjdXJyZW50IG9iamVjdC5cbiAgICAgICAgICAgIHJlc3VsdCA9IHF1aWNrQ29weShjdXJyZW50T2JqLCBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KGN1cnJlbnRPYmopKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXN1bHRba2V5XSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJEcm9wcGVkS2V5cyhjdXJyZW50T2JqLCBvdGhlck9iaikge1xuICAgICAgZm9yICh2YXIga2V5IGluIGN1cnJlbnRPYmopIHtcbiAgICAgICAgaWYgKCFvdGhlck9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBNYWtlIGEgc2hhbGxvdyBjbG9uZSBvZiB0aGUgY3VycmVudCBvYmplY3QuXG4gICAgICAgICAgICByZXN1bHQgPSBxdWlja0NvcHkoY3VycmVudE9iaiwgaW5zdGFudGlhdGVFbXB0eU9iamVjdChjdXJyZW50T2JqKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGV0ZSByZXN1bHRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBrZXk7XG5cbiAgICAvLyBBY2hpZXZlIHByaW9yaXRpemF0aW9uIGJ5IG92ZXJyaWRpbmcgcHJldmlvdXMgdmFsdWVzIHRoYXQgZ2V0IGluIHRoZSB3YXkuXG4gICAgaWYgKCFyZWNlaXZlZEFycmF5KSB7XG4gICAgICAvLyBUaGUgbW9zdCBjb21tb24gdXNlIGNhc2U6IGp1c3QgbWVyZ2Ugb25lIG9iamVjdCBpbnRvIHRoZSBleGlzdGluZyBvbmUuXG4gICAgICBmb3IgKGtleSBpbiBvdGhlcikge1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvdGhlciwga2V5KSkge1xuICAgICAgICAgIGFkZFRvUmVzdWx0KHRoaXMsIG90aGVyLCBrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobW9kZSA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgIGNsZWFyRHJvcHBlZEtleXModGhpcywgb3RoZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBhbHNvIGFjY2VwdCBhbiBBcnJheVxuICAgICAgZm9yICh2YXIgaW5kZXggPSAwLCBsZW5ndGggPSBvdGhlci5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIHZhciBvdGhlckZyb21BcnJheSA9IG90aGVyW2luZGV4XTtcblxuICAgICAgICBmb3IgKGtleSBpbiBvdGhlckZyb21BcnJheSkge1xuICAgICAgICAgIGlmIChvdGhlckZyb21BcnJheS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBhZGRUb1Jlc3VsdChyZXN1bHQgIT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRoaXMsIG90aGVyRnJvbUFycmF5LCBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb2JqZWN0UmVwbGFjZSh2YWx1ZSwgY29uZmlnKSB7XG4gICAgdmFyIGRlZXAgICAgICAgICAgPSBjb25maWcgJiYgY29uZmlnLmRlZXA7XG5cbiAgICAvLyBDYWxsaW5nIC5yZXBsYWNlKCkgd2l0aCBubyBhcmd1bWVudHMgaXMgYSBuby1vcC4gRG9uJ3QgYm90aGVyIGNsb25pbmcuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsdWUgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbW11dGFibGUjcmVwbGFjZSBjYW4gb25seSBiZSBpbnZva2VkIHdpdGggb2JqZWN0cyBvciBhcnJheXMsIG5vdCBcIiArIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIEltbXV0YWJsZS5tZXJnZSh0aGlzLCB2YWx1ZSwge2RlZXA6IGRlZXAsIG1vZGU6ICdyZXBsYWNlJ30pO1xuICB9XG5cbiAgdmFyIGltbXV0YWJsZUVtcHR5T2JqZWN0ID0gSW1tdXRhYmxlKHt9KTtcblxuICBmdW5jdGlvbiBvYmplY3RTZXRJbihwYXRoLCB2YWx1ZSwgY29uZmlnKSB7XG4gICAgaWYgKCEocGF0aCBpbnN0YW5jZW9mIEFycmF5KSB8fCBwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlRoZSBmaXJzdCBhcmd1bWVudCB0byBJbW11dGFibGUjc2V0SW4gbXVzdCBiZSBhbiBhcnJheSBjb250YWluaW5nIGF0IGxlYXN0IG9uZSBcXFwia2V5XFxcIiBzdHJpbmcuXCIpO1xuICAgIH1cblxuICAgIHZhciBoZWFkID0gcGF0aFswXTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBvYmplY3RTZXQuY2FsbCh0aGlzLCBoZWFkLCB2YWx1ZSwgY29uZmlnKTtcbiAgICB9XG5cbiAgICB2YXIgdGFpbCA9IHBhdGguc2xpY2UoMSk7XG4gICAgdmFyIG5ld1ZhbHVlO1xuICAgIHZhciB0aGlzSGVhZCA9IHRoaXNbaGVhZF07XG5cbiAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShoZWFkKSAmJiB0eXBlb2YodGhpc0hlYWQpID09PSBcIm9iamVjdFwiICYmIHRoaXNIZWFkICE9PSBudWxsKSB7XG4gICAgICAvLyBNaWdodCAodmFsaWRseSkgYmUgb2JqZWN0IG9yIGFycmF5XG4gICAgICBuZXdWYWx1ZSA9IEltbXV0YWJsZS5zZXRJbih0aGlzSGVhZCwgdGFpbCwgdmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdWYWx1ZSA9IG9iamVjdFNldEluLmNhbGwoaW1tdXRhYmxlRW1wdHlPYmplY3QsIHRhaWwsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShoZWFkKSAmJiB0aGlzSGVhZCA9PT0gbmV3VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBtdXRhYmxlID0gcXVpY2tDb3B5KHRoaXMsIGluc3RhbnRpYXRlRW1wdHlPYmplY3QodGhpcykpO1xuICAgIG11dGFibGVbaGVhZF0gPSBuZXdWYWx1ZTtcbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZU9iamVjdChtdXRhYmxlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9iamVjdFNldChwcm9wZXJ0eSwgdmFsdWUsIGNvbmZpZykge1xuICAgIHZhciBkZWVwICAgICAgICAgID0gY29uZmlnICYmIGNvbmZpZy5kZWVwO1xuXG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICBpZiAoZGVlcCAmJiB0aGlzW3Byb3BlcnR5XSAhPT0gdmFsdWUgJiYgaXNNZXJnYWJsZU9iamVjdCh2YWx1ZSkgJiYgaXNNZXJnYWJsZU9iamVjdCh0aGlzW3Byb3BlcnR5XSkpIHtcbiAgICAgICAgdmFsdWUgPSBJbW11dGFibGUubWVyZ2UodGhpc1twcm9wZXJ0eV0sIHZhbHVlLCB7ZGVlcDogdHJ1ZSwgbW9kZTogJ3JlcGxhY2UnfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNFcXVhbCh0aGlzW3Byb3BlcnR5XSwgdmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBtdXRhYmxlID0gcXVpY2tDb3B5KHRoaXMsIGluc3RhbnRpYXRlRW1wdHlPYmplY3QodGhpcykpO1xuICAgIG11dGFibGVbcHJvcGVydHldID0gSW1tdXRhYmxlKHZhbHVlKTtcbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZU9iamVjdChtdXRhYmxlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZShwcm9wZXJ0eSwgdXBkYXRlcikge1xuICAgIHZhciByZXN0QXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGluaXRpYWxWYWwgPSB0aGlzW3Byb3BlcnR5XTtcbiAgICByZXR1cm4gSW1tdXRhYmxlLnNldCh0aGlzLCBwcm9wZXJ0eSwgdXBkYXRlci5hcHBseShpbml0aWFsVmFsLCBbaW5pdGlhbFZhbF0uY29uY2F0KHJlc3RBcmdzKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW5QYXRoKG9iaiwgcGF0aCkge1xuICAgIC8qanNoaW50IGVxbnVsbDp0cnVlICovXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aDsgb2JqICE9IG51bGwgJiYgaSA8IGw7IGkrKykge1xuICAgICAgb2JqID0gb2JqW3BhdGhbaV1dO1xuICAgIH1cblxuICAgIHJldHVybiAoaSAmJiBpID09IGwpID8gb2JqIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlSW4ocGF0aCwgdXBkYXRlcikge1xuICAgIHZhciByZXN0QXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGluaXRpYWxWYWwgPSBnZXRJblBhdGgodGhpcywgcGF0aCk7XG5cbiAgICByZXR1cm4gSW1tdXRhYmxlLnNldEluKHRoaXMsIHBhdGgsIHVwZGF0ZXIuYXBwbHkoaW5pdGlhbFZhbCwgW2luaXRpYWxWYWxdLmNvbmNhdChyZXN0QXJncykpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzTXV0YWJsZU9iamVjdChvcHRzKSB7XG4gICAgdmFyIHJlc3VsdCA9IGluc3RhbnRpYXRlRW1wdHlPYmplY3QodGhpcyksIGtleTtcblxuICAgIGlmKG9wdHMgJiYgb3B0cy5kZWVwKSB7XG4gICAgICBmb3IgKGtleSBpbiB0aGlzKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IGFzRGVlcE11dGFibGUodGhpc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGtleSBpbiB0aGlzKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvLyBDcmVhdGVzIHBsYWluIG9iamVjdCB0byBiZSB1c2VkIGZvciBjbG9uaW5nXG4gIGZ1bmN0aW9uIGluc3RhbnRpYXRlUGxhaW5PYmplY3QoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLy8gRmluYWxpemVzIGFuIG9iamVjdCB3aXRoIGltbXV0YWJsZSBtZXRob2RzLCBmcmVlemVzIGl0LCBhbmQgcmV0dXJucyBpdC5cbiAgZnVuY3Rpb24gbWFrZUltbXV0YWJsZU9iamVjdChvYmopIHtcbiAgICBpZiAoIWdsb2JhbENvbmZpZy51c2Vfc3RhdGljKSB7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJtZXJnZVwiLCBtZXJnZSk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJyZXBsYWNlXCIsIG9iamVjdFJlcGxhY2UpO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwid2l0aG91dFwiLCB3aXRob3V0KTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcImFzTXV0YWJsZVwiLCBhc011dGFibGVPYmplY3QpO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwic2V0XCIsIG9iamVjdFNldCk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJzZXRJblwiLCBvYmplY3RTZXRJbik7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJ1cGRhdGVcIiwgdXBkYXRlKTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcInVwZGF0ZUluXCIsIHVwZGF0ZUluKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZShvYmosIG11dGF0aW5nT2JqZWN0TWV0aG9kcyk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgaWYgb2JqZWN0IGlzIGEgdmFsaWQgcmVhY3QgZWxlbWVudFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi92MTUuMC4xL3NyYy9pc29tb3JwaGljL2NsYXNzaWMvZWxlbWVudC9SZWFjdEVsZW1lbnQuanMjTDMyNlxuICBmdW5jdGlvbiBpc1JlYWN0RWxlbWVudChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgb2JqICE9PSBudWxsICYmXG4gICAgICAgICAgIChvYmouJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRV9GQUxMQkFDSyB8fCBvYmouJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZpbGVPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBGaWxlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICBvYmogaW5zdGFuY2VvZiBGaWxlO1xuICB9XG5cbiAgZnVuY3Rpb24gSW1tdXRhYmxlKG9iaiwgb3B0aW9ucywgc3RhY2tSZW1haW5pbmcpIHtcbiAgICBpZiAoaXNJbW11dGFibGUob2JqKSB8fCBpc1JlYWN0RWxlbWVudChvYmopIHx8IGlzRmlsZU9iamVjdChvYmopKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICByZXR1cm4gbWFrZUltbXV0YWJsZUFycmF5KG9iai5zbGljZSgpKTtcbiAgICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHJldHVybiBtYWtlSW1tdXRhYmxlRGF0ZShuZXcgRGF0ZShvYmouZ2V0VGltZSgpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERvbid0IGZyZWV6ZSB0aGUgb2JqZWN0IHdlIHdlcmUgZ2l2ZW47IG1ha2UgYSBjbG9uZSBhbmQgdXNlIHRoYXQuXG4gICAgICB2YXIgcHJvdG90eXBlID0gb3B0aW9ucyAmJiBvcHRpb25zLnByb3RvdHlwZTtcbiAgICAgIHZhciBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0ID1cbiAgICAgICAgKCFwcm90b3R5cGUgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlKSA/XG4gICAgICAgICAgaW5zdGFudGlhdGVQbGFpbk9iamVjdCA6IChmdW5jdGlvbigpIHsgcmV0dXJuIE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTsgfSk7XG4gICAgICB2YXIgY2xvbmUgPSBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KCk7XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgLypqc2hpbnQgZXFudWxsOnRydWUgKi9cbiAgICAgICAgaWYgKHN0YWNrUmVtYWluaW5nID09IG51bGwpIHtcbiAgICAgICAgICBzdGFja1JlbWFpbmluZyA9IDY0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFja1JlbWFpbmluZyA8PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEltbXV0YWJsZUVycm9yKFwiQXR0ZW1wdCB0byBjb25zdHJ1Y3QgSW1tdXRhYmxlIGZyb20gYSBkZWVwbHkgbmVzdGVkIG9iamVjdCB3YXMgZGV0ZWN0ZWQuXCIgK1xuICAgICAgICAgICAgXCIgSGF2ZSB5b3UgdHJpZWQgdG8gd3JhcCBhbiBvYmplY3Qgd2l0aCBjaXJjdWxhciByZWZlcmVuY2VzIChlLmcuIFJlYWN0IGVsZW1lbnQpP1wiICtcbiAgICAgICAgICAgIFwiIFNlZSBodHRwczovL2dpdGh1Yi5jb20vcnRmZWxkbWFuL3NlYW1sZXNzLWltbXV0YWJsZS93aWtpL0RlZXBseS1uZXN0ZWQtb2JqZWN0LXdhcy1kZXRlY3RlZCBmb3IgZGV0YWlscy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgc3RhY2tSZW1haW5pbmcgLT0gMTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkpIHtcbiAgICAgICAgICBjbG9uZVtrZXldID0gSW1tdXRhYmxlKG9ialtrZXldLCB1bmRlZmluZWQsIHN0YWNrUmVtYWluaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWFrZUltbXV0YWJsZU9iamVjdChjbG9uZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gV3JhcHBlciB0byBhbGxvdyB0aGUgdXNlIG9mIG9iamVjdCBtZXRob2RzIGFzIHN0YXRpYyBtZXRob2RzIG9mIEltbXV0YWJsZS5cbiAgZnVuY3Rpb24gdG9TdGF0aWMoZm4pIHtcbiAgICBmdW5jdGlvbiBzdGF0aWNXcmFwcGVyKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgc2VsZiA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgIHJldHVybiBmbi5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGljV3JhcHBlcjtcbiAgfVxuXG4gIC8vIFdyYXBwZXIgdG8gYWxsb3cgdGhlIHVzZSBvZiBvYmplY3QgbWV0aG9kcyBhcyBzdGF0aWMgbWV0aG9kcyBvZiBJbW11dGFibGUuXG4gIC8vIHdpdGggdGhlIGFkZGl0aW9uYWwgY29uZGl0aW9uIG9mIGNob29zaW5nIHdoaWNoIGZ1bmN0aW9uIHRvIGNhbGwgZGVwZW5kaW5nXG4gIC8vIGlmIGFyZ3VtZW50IGlzIGFuIGFycmF5IG9yIGFuIG9iamVjdC5cbiAgZnVuY3Rpb24gdG9TdGF0aWNPYmplY3RPckFycmF5KGZuT2JqZWN0LCBmbkFycmF5KSB7XG4gICAgZnVuY3Rpb24gc3RhdGljV3JhcHBlcigpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgdmFyIHNlbGYgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxmKSkge1xuICAgICAgICAgIHJldHVybiBmbkFycmF5LmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZm5PYmplY3QuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRpY1dyYXBwZXI7XG4gIH1cblxuICAvLyBXcmFwcGVyIHRvIGFsbG93IHRoZSB1c2Ugb2Ygb2JqZWN0IG1ldGhvZHMgYXMgc3RhdGljIG1ldGhvZHMgb2YgSW1tdXRhYmxlLlxuICAvLyB3aXRoIHRoZSBhZGRpdGlvbmFsIGNvbmRpdGlvbiBvZiBjaG9vc2luZyB3aGljaCBmdW5jdGlvbiB0byBjYWxsIGRlcGVuZGluZ1xuICAvLyBpZiBhcmd1bWVudCBpcyBhbiBhcnJheSBvciBhbiBvYmplY3Qgb3IgYSBkYXRlLlxuICBmdW5jdGlvbiB0b1N0YXRpY09iamVjdE9yRGF0ZU9yQXJyYXkoZm5PYmplY3QsIGZuQXJyYXksIGZuRGF0ZSkge1xuICAgIGZ1bmN0aW9uIHN0YXRpY1dyYXBwZXIoKSB7XG4gICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIHZhciBzZWxmID0gYXJncy5zaGlmdCgpO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZikpIHtcbiAgICAgICAgICByZXR1cm4gZm5BcnJheS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH0gZWxzZSBpZiAoc2VsZiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICByZXR1cm4gZm5EYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZm5PYmplY3QuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRpY1dyYXBwZXI7XG4gIH1cblxuICAvLyBFeHBvcnQgdGhlIGxpYnJhcnlcbiAgSW1tdXRhYmxlLmZyb20gICAgICAgICAgID0gSW1tdXRhYmxlO1xuICBJbW11dGFibGUuaXNJbW11dGFibGUgICAgPSBpc0ltbXV0YWJsZTtcbiAgSW1tdXRhYmxlLkltbXV0YWJsZUVycm9yID0gSW1tdXRhYmxlRXJyb3I7XG4gIEltbXV0YWJsZS5tZXJnZSAgICAgICAgICA9IHRvU3RhdGljKG1lcmdlKTtcbiAgSW1tdXRhYmxlLnJlcGxhY2UgICAgICAgID0gdG9TdGF0aWMob2JqZWN0UmVwbGFjZSk7XG4gIEltbXV0YWJsZS53aXRob3V0ICAgICAgICA9IHRvU3RhdGljKHdpdGhvdXQpO1xuICBJbW11dGFibGUuYXNNdXRhYmxlICAgICAgPSB0b1N0YXRpY09iamVjdE9yRGF0ZU9yQXJyYXkoYXNNdXRhYmxlT2JqZWN0LCBhc011dGFibGVBcnJheSwgYXNNdXRhYmxlRGF0ZSk7XG4gIEltbXV0YWJsZS5zZXQgICAgICAgICAgICA9IHRvU3RhdGljT2JqZWN0T3JBcnJheShvYmplY3RTZXQsIGFycmF5U2V0KTtcbiAgSW1tdXRhYmxlLnNldEluICAgICAgICAgID0gdG9TdGF0aWNPYmplY3RPckFycmF5KG9iamVjdFNldEluLCBhcnJheVNldEluKTtcbiAgSW1tdXRhYmxlLnVwZGF0ZSAgICAgICAgID0gdG9TdGF0aWModXBkYXRlKTtcbiAgSW1tdXRhYmxlLnVwZGF0ZUluICAgICAgID0gdG9TdGF0aWModXBkYXRlSW4pO1xuICBJbW11dGFibGUuZmxhdE1hcCAgICAgICAgPSB0b1N0YXRpYyhmbGF0TWFwKTtcbiAgSW1tdXRhYmxlLmFzT2JqZWN0ICAgICAgID0gdG9TdGF0aWMoYXNPYmplY3QpO1xuICBpZiAoIWdsb2JhbENvbmZpZy51c2Vfc3RhdGljKSB7XG4gICAgICBJbW11dGFibGUuc3RhdGljID0gaW1tdXRhYmxlSW5pdCh7XG4gICAgICAgICAgdXNlX3N0YXRpYzogdHJ1ZVxuICAgICAgfSk7XG4gIH1cblxuICBPYmplY3QuZnJlZXplKEltbXV0YWJsZSk7XG5cbiAgcmV0dXJuIEltbXV0YWJsZTtcbn1cblxuICB2YXIgSW1tdXRhYmxlID0gaW1tdXRhYmxlSW5pdCgpO1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBJbW11dGFibGU7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gSW1tdXRhYmxlO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgZXhwb3J0cy5JbW11dGFibGUgPSBJbW11dGFibGU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikge1xuICAgIHdpbmRvdy5JbW11dGFibGUgPSBJbW11dGFibGU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIikge1xuICAgIGdsb2JhbC5JbW11dGFibGUgPSBJbW11dGFibGU7XG4gIH1cbn0pKCk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gXCJzZWFtbGVzcy1pbW11dGFibGVcIjtcblxuLy8gVGhpcyBtaWRkbGV3YXJlIHdpbGwganVzdCBhZGQgdGhlIHByb3BlcnR5IFwiYXN5bmMgZGlzcGF0Y2hcIlxuLy8gdG8gYWN0aW9ucyB3aXRoIHRoZSBcImFzeW5jXCIgcHJvcHBlcnR5IHNldCB0byB0cnVlXG5jb25zdCBhc3luY0Rpc3BhdGNoTWlkZGxld2FyZSA9IHN0b3JlID0+IG5leHQgPT4gYWN0aW9uID0+IHtcbiAgbGV0IHN5bmNBY3Rpdml0eUZpbmlzaGVkID0gZmFsc2U7XG4gIGxldCBhY3Rpb25RdWV1ZSA9IFtdO1xuXG4gIGZ1bmN0aW9uIGZsdXNoUXVldWUoKSB7XG4gICAgYWN0aW9uUXVldWUuZm9yRWFjaChhID0+IHN0b3JlLmRpc3BhdGNoKGEpKTsgLy8gZmx1c2ggcXVldWVcbiAgICBhY3Rpb25RdWV1ZSA9IFtdO1xuICB9XG5cbiAgZnVuY3Rpb24gYXN5bmNEaXNwYXRjaChhc3luY0FjdGlvbikge1xuICAgIGFjdGlvblF1ZXVlID0gYWN0aW9uUXVldWUuY29uY2F0KFthc3luY0FjdGlvbl0pO1xuXG4gICAgaWYgKHN5bmNBY3Rpdml0eUZpbmlzaGVkKSB7XG4gICAgICBmbHVzaFF1ZXVlKCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYWN0aW9uV2l0aEFzeW5jRGlzcGF0Y2ggPVxuICAgICAgSW1tdXRhYmxlKGFjdGlvbikubWVyZ2UoeyBhc3luY0Rpc3BhdGNoIH0pO1xuXG4gIG5leHQoYWN0aW9uV2l0aEFzeW5jRGlzcGF0Y2gpO1xuICBzeW5jQWN0aXZpdHlGaW5pc2hlZCA9IHRydWU7XG4gIGZsdXNoUXVldWUoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5pbXBvcnQgYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmUgZnJvbSBcIi4uL2pzL3V0aWxzL2FzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlXCI7XG5cbmNvbnN0IGZha2VBY3Rpb24gPSB7IHR5cGU6IFwiZmFrZSBhY3Rpb25cIiB9O1xuXG5kZXNjcmliZShcIlRoZSBhc3luY0Rpc3BhdGNoTWlkZGxld2FyZVwiLCAoKSA9PiB7XG4gIGl0KFwiY2FsbHMgbmV4dCB3aXRoIGFzeW5jRGlzcGF0Y2ggcHJvcGVydHlcIiwgKGRvbmUpID0+IHtcbiAgICBjb25zdCBuZXh0ID0gcmV0dXJuZWRBY3Rpb24gPT4ge1xuICAgICAgZXhwZWN0KHJldHVybmVkQWN0aW9uLmFzeW5jRGlzcGF0Y2gpLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICBleHBlY3QodHlwZW9mIHJldHVybmVkQWN0aW9uLmFzeW5jRGlzcGF0Y2gpLnRvRXF1YWwoXCJmdW5jdGlvblwiKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmUoXCJmYWtlU3RvcmVcIikobmV4dCkoZmFrZUFjdGlvbik7XG4gIH0pO1xuXG5cbiAgaXQoXCJhc3luY0Rpc3BhdGNoIHRyaWdnZXJzIGEgc3RvcmUgZGlzcGF0Y2hcIiwgKGRvbmUpID0+IHtcbiAgICBjb25zdCBmYWtlQXN5bmNBY3Rpb24gPSB7IHR5cGU6IFwiZmFrZUFzeW5jQWN0aW9uXCIgfTtcblxuICAgIGNvbnN0IGZha2VTdG9yZSA9IHtcbiAgICAgIGRpc3BhdGNoOiBhY3Rpb24gPT4ge1xuICAgICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoZmFrZUFzeW5jQWN0aW9uLnR5cGUpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCBuZXh0ID0gcmV0dXJuZWRBY3Rpb24gPT5cbiAgICAgIHJldHVybmVkQWN0aW9uLmFzeW5jRGlzcGF0Y2goZmFrZUFzeW5jQWN0aW9uKTtcblxuICAgIGFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlKGZha2VTdG9yZSkobmV4dCkoZmFrZUFjdGlvbik7XG4gIH0pO1xufSk7XG4iLCIvLyBCdWcgY2hlY2tpbmcgZnVuY3Rpb24gdGhhdCB3aWxsIHRocm93IGFuIGVycm9yIHdoZW5ldmVyXG4vLyB0aGUgY29uZGl0aW9uIHNlbnQgdG8gaXQgaXMgZXZhbHVhdGVkIHRvIGZhbHNlXG4vKipcbiAqIFByb2Nlc3NlcyB0aGUgbWVzc2FnZSBhbmQgb3V0cHV0cyB0aGUgY29ycmVjdCBtZXNzYWdlIGlmIHRoZSBjb25kaXRpb25cbiAqIGlzIGZhbHNlLiBPdGhlcndpc2UgaXQgb3V0cHV0cyBudWxsLlxuICogQGFwaSBwcml2YXRlXG4gKiBAbWV0aG9kIHByb2Nlc3NDb25kaXRpb25cbiAqIEBwYXJhbSAge0Jvb2xlYW59IGNvbmRpdGlvbiAtIFJlc3VsdCBvZiB0aGUgZXZhbHVhdGVkIGNvbmRpdGlvblxuICogQHBhcmFtICB7U3RyaW5nfSBlcnJvck1lc3NhZ2UgLSBNZXNzYWdlIGV4cGxhaW5pZyB0aGUgZXJyb3IgaW4gY2FzZSBpdCBpcyB0aHJvd25cbiAqIEByZXR1cm4ge1N0cmluZyB8IG51bGx9ICAtIEVycm9yIG1lc3NhZ2UgaWYgdGhlcmUgaXMgYW4gZXJyb3IsIG51bCBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NDb25kaXRpb24oY29uZGl0aW9uLCBlcnJvck1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgY29tcGxldGVFcnJvck1lc3NhZ2UgPSAnJztcbiAgICB2YXIgcmUgPSAvYXQgKFteXFxzXSspXFxzXFwoL2c7XG4gICAgdmFyIHN0YWNrVHJhY2UgPSBuZXcgRXJyb3IoKS5zdGFjaztcbiAgICB2YXIgc3RhY2tGdW5jdGlvbnMgPSBbXTtcblxuICAgIHZhciBmdW5jTmFtZSA9IHJlLmV4ZWMoc3RhY2tUcmFjZSk7XG4gICAgd2hpbGUgKGZ1bmNOYW1lICYmIGZ1bmNOYW1lWzFdKSB7XG4gICAgICBzdGFja0Z1bmN0aW9ucy5wdXNoKGZ1bmNOYW1lWzFdKTtcbiAgICAgIGZ1bmNOYW1lID0gcmUuZXhlYyhzdGFja1RyYWNlKTtcbiAgICB9XG5cbiAgICAvLyBOdW1iZXIgMCBpcyBwcm9jZXNzQ29uZGl0aW9uIGl0c2VsZixcbiAgICAvLyBOdW1iZXIgMSBpcyBhc3NlcnQsXG4gICAgLy8gTnVtYmVyIDIgaXMgdGhlIGNhbGxlciBmdW5jdGlvbi5cbiAgICBpZiAoc3RhY2tGdW5jdGlvbnNbMl0pIHtcbiAgICAgIGNvbXBsZXRlRXJyb3JNZXNzYWdlID0gc3RhY2tGdW5jdGlvbnNbMl0gKyAnOiAnICsgY29tcGxldGVFcnJvck1lc3NhZ2U7XG4gICAgfVxuXG4gICAgY29tcGxldGVFcnJvck1lc3NhZ2UgKz0gZXJyb3JNZXNzYWdlO1xuICAgIHJldHVybiBjb21wbGV0ZUVycm9yTWVzc2FnZTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgYm9vbGVhbiBwYXNzZWQgdG8gaXQgZXZhbHVhdGVzIHRvIGZhbHNlLlxuICogVG8gYmUgdXNlZCBsaWtlIHRoaXM6XG4gKiBcdFx0YXNzZXJ0KG15RGF0ZSAhPT0gdW5kZWZpbmVkLCBcIkRhdGUgY2Fubm90IGJlIHVuZGVmaW5lZC5cIik7XG4gKiBAYXBpIHB1YmxpY1xuICogQG1ldGhvZCBhc3NlcnRcbiAqIEBwYXJhbSAge0Jvb2xlYW59IGNvbmRpdGlvbiAtIFJlc3VsdCBvZiB0aGUgZXZhbHVhdGVkIGNvbmRpdGlvblxuICogQHBhcmFtICB7U3RyaW5nfSBlcnJvck1lc3NhZ2UgLSBNZXNzYWdlIGV4cGxhaW5pZyB0aGUgZXJyb3IgaW4gY2FzZSBpdCBpcyB0aHJvd25cbiAqIEByZXR1cm4gdm9pZFxuICovXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBlcnJvck1lc3NhZ2UpIHtcbiAgdmFyIGVycm9yID0gcHJvY2Vzc0NvbmRpdGlvbihjb25kaXRpb24sIGVycm9yTWVzc2FnZSk7XG4gIGlmICh0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycm9yKTtcbiAgfVxufVxuXG4vKipcbiAqIExvZ3MgYSB3YXJuaW5nIGlmIHRoZSBib29sZWFuIHBhc3NlZCB0byBpdCBldmFsdWF0ZXMgdG8gZmFsc2UuXG4gKiBUbyBiZSB1c2VkIGxpa2UgdGhpczpcbiAqIFx0XHRhc3NlcnQud2FybihteURhdGUgIT09IHVuZGVmaW5lZCwgXCJObyBkYXRlIHByb3ZpZGVkLlwiKTtcbiAqIEBhcGkgcHVibGljXG4gKiBAbWV0aG9kIHdhcm5cbiAqIEBwYXJhbSAge0Jvb2xlYW59IGNvbmRpdGlvbiAtIFJlc3VsdCBvZiB0aGUgZXZhbHVhdGVkIGNvbmRpdGlvblxuICogQHBhcmFtICB7U3RyaW5nfSBlcnJvck1lc3NhZ2UgLSBNZXNzYWdlIGV4cGxhaW5pZyB0aGUgZXJyb3IgaW4gY2FzZSBpdCBpcyB0aHJvd25cbiAqIEByZXR1cm4gdm9pZFxuICovXG5hc3NlcnQud2FybiA9IGZ1bmN0aW9uIHdhcm4oY29uZGl0aW9uLCBlcnJvck1lc3NhZ2UpIHtcbiAgdmFyIGVycm9yID0gcHJvY2Vzc0NvbmRpdGlvbihjb25kaXRpb24sIGVycm9yTWVzc2FnZSk7XG4gIGlmICh0eXBlb2YgZXJyb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYXNzZXJ0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lJaXdpYzI5MWNtTmxjeUk2V3lKaGMzTmxjblF1YW5NaVhTd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeThnUW5WbklHTm9aV05yYVc1bklHWjFibU4wYVc5dUlIUm9ZWFFnZDJsc2JDQjBhSEp2ZHlCaGJpQmxjbkp2Y2lCM2FHVnVaWFpsY2x4dUx5OGdkR2hsSUdOdmJtUnBkR2x2YmlCelpXNTBJSFJ2SUdsMElHbHpJR1YyWVd4MVlYUmxaQ0IwYnlCbVlXeHpaVnh1THlvcVhHNGdLaUJRY205alpYTnpaWE1nZEdobElHMWxjM05oWjJVZ1lXNWtJRzkxZEhCMWRITWdkR2hsSUdOdmNuSmxZM1FnYldWemMyRm5aU0JwWmlCMGFHVWdZMjl1WkdsMGFXOXVYRzRnS2lCcGN5Qm1ZV3h6WlM0Z1QzUm9aWEozYVhObElHbDBJRzkxZEhCMWRITWdiblZzYkM1Y2JpQXFJRUJoY0drZ2NISnBkbUYwWlZ4dUlDb2dRRzFsZEdodlpDQndjbTlqWlhOelEyOXVaR2wwYVc5dVhHNGdLaUJBY0dGeVlXMGdJSHRDYjI5c1pXRnVmU0JqYjI1a2FYUnBiMjRnTFNCU1pYTjFiSFFnYjJZZ2RHaGxJR1YyWVd4MVlYUmxaQ0JqYjI1a2FYUnBiMjVjYmlBcUlFQndZWEpoYlNBZ2UxTjBjbWx1WjMwZ1pYSnliM0pOWlhOellXZGxJQzBnVFdWemMyRm5aU0JsZUhCc1lXbHVhV2NnZEdobElHVnljbTl5SUdsdUlHTmhjMlVnYVhRZ2FYTWdkR2h5YjNkdVhHNGdLaUJBY21WMGRYSnVJSHRUZEhKcGJtY2dmQ0J1ZFd4c2ZTQWdMU0JGY25KdmNpQnRaWE56WVdkbElHbG1JSFJvWlhKbElHbHpJR0Z1SUdWeWNtOXlMQ0J1ZFd3Z2IzUm9aWEozYVhObExseHVJQ292WEc1bWRXNWpkR2x2YmlCd2NtOWpaWE56UTI5dVpHbDBhVzl1S0dOdmJtUnBkR2x2Yml3Z1pYSnliM0pOWlhOellXZGxLU0I3WEc0Z0lHbG1JQ2doWTI5dVpHbDBhVzl1S1NCN1hHNGdJQ0FnYkdWMElHTnZiWEJzWlhSbFJYSnliM0pOWlhOellXZGxJRDBnSnljN1hHNGdJQ0FnWTI5dWMzUWdjbVVnUFNBdllYUWdLRnRlWEZ4elhTc3BYRnh6WEZ3b0wyYzdYRzRnSUNBZ1kyOXVjM1FnYzNSaFkydFVjbUZqWlNBOUlHNWxkeUJGY25KdmNpZ3BMbk4wWVdOck8xeHVJQ0FnSUdOdmJuTjBJSE4wWVdOclJuVnVZM1JwYjI1eklEMGdXMTA3WEc1Y2JpQWdJQ0JzWlhRZ1puVnVZMDVoYldVZ1BTQnlaUzVsZUdWaktITjBZV05yVkhKaFkyVXBPMXh1SUNBZ0lIZG9hV3hsSUNobWRXNWpUbUZ0WlNBbUppQm1kVzVqVG1GdFpWc3hYU2tnZTF4dUlDQWdJQ0FnYzNSaFkydEdkVzVqZEdsdmJuTXVjSFZ6YUNobWRXNWpUbUZ0WlZzeFhTazdYRzRnSUNBZ0lDQm1kVzVqVG1GdFpTQTlJSEpsTG1WNFpXTW9jM1JoWTJ0VWNtRmpaU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnVG5WdFltVnlJREFnYVhNZ2NISnZZMlZ6YzBOdmJtUnBkR2x2YmlCcGRITmxiR1lzWEc0Z0lDQWdMeThnVG5WdFltVnlJREVnYVhNZ1lYTnpaWEowTEZ4dUlDQWdJQzh2SUU1MWJXSmxjaUF5SUdseklIUm9aU0JqWVd4c1pYSWdablZ1WTNScGIyNHVYRzRnSUNBZ2FXWWdLSE4wWVdOclJuVnVZM1JwYjI1eld6SmRLU0I3WEc0Z0lDQWdJQ0JqYjIxd2JHVjBaVVZ5Y205eVRXVnpjMkZuWlNBOUlHQWtlM04wWVdOclJuVnVZM1JwYjI1eld6SmRmVG9nSkh0amIyMXdiR1YwWlVWeWNtOXlUV1Z6YzJGblpYMWdPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHTnZiWEJzWlhSbFJYSnliM0pOWlhOellXZGxJQ3M5SUdWeWNtOXlUV1Z6YzJGblpUdGNiaUFnSUNCeVpYUjFjbTRnWTI5dGNHeGxkR1ZGY25KdmNrMWxjM05oWjJVN1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z2JuVnNiRHRjYm4xY2JseHVMeW9xWEc0Z0tpQlVhSEp2ZDNNZ1lXNGdaWEp5YjNJZ2FXWWdkR2hsSUdKdmIyeGxZVzRnY0dGemMyVmtJSFJ2SUdsMElHVjJZV3gxWVhSbGN5QjBieUJtWVd4elpTNWNiaUFxSUZSdklHSmxJSFZ6WldRZ2JHbHJaU0IwYUdsek9seHVJQ29nWEhSY2RHRnpjMlZ5ZENodGVVUmhkR1VnSVQwOUlIVnVaR1ZtYVc1bFpDd2dYQ0pFWVhSbElHTmhibTV2ZENCaVpTQjFibVJsWm1sdVpXUXVYQ0lwTzF4dUlDb2dRR0Z3YVNCd2RXSnNhV05jYmlBcUlFQnRaWFJvYjJRZ1lYTnpaWEowWEc0Z0tpQkFjR0Z5WVcwZ0lIdENiMjlzWldGdWZTQmpiMjVrYVhScGIyNGdMU0JTWlhOMWJIUWdiMllnZEdobElHVjJZV3gxWVhSbFpDQmpiMjVrYVhScGIyNWNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnWlhKeWIzSk5aWE56WVdkbElDMGdUV1Z6YzJGblpTQmxlSEJzWVdsdWFXY2dkR2hsSUdWeWNtOXlJR2x1SUdOaGMyVWdhWFFnYVhNZ2RHaHliM2R1WEc0Z0tpQkFjbVYwZFhKdUlIWnZhV1JjYmlBcUwxeHVablZ1WTNScGIyNGdZWE56WlhKMEtHTnZibVJwZEdsdmJpd2daWEp5YjNKTlpYTnpZV2RsS1NCN1hHNGdJR052Ym5OMElHVnljbTl5SUQwZ2NISnZZMlZ6YzBOdmJtUnBkR2x2YmloamIyNWthWFJwYjI0c0lHVnljbTl5VFdWemMyRm5aU2s3WEc0Z0lHbG1JQ2gwZVhCbGIyWWdaWEp5YjNJZ1BUMDlJQ2R6ZEhKcGJtY25LU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtHVnljbTl5S1R0Y2JpQWdmVnh1ZlZ4dVhHNHZLaXBjYmlBcUlFeHZaM01nWVNCM1lYSnVhVzVuSUdsbUlIUm9aU0JpYjI5c1pXRnVJSEJoYzNObFpDQjBieUJwZENCbGRtRnNkV0YwWlhNZ2RHOGdabUZzYzJVdVhHNGdLaUJVYnlCaVpTQjFjMlZrSUd4cGEyVWdkR2hwY3pwY2JpQXFJRngwWEhSaGMzTmxjblF1ZDJGeWJpaHRlVVJoZEdVZ0lUMDlJSFZ1WkdWbWFXNWxaQ3dnWENKT2J5QmtZWFJsSUhCeWIzWnBaR1ZrTGx3aUtUdGNiaUFxSUVCaGNHa2djSFZpYkdsalhHNGdLaUJBYldWMGFHOWtJSGRoY201Y2JpQXFJRUJ3WVhKaGJTQWdlMEp2YjJ4bFlXNTlJR052Ym1ScGRHbHZiaUF0SUZKbGMzVnNkQ0J2WmlCMGFHVWdaWFpoYkhWaGRHVmtJR052Ym1ScGRHbHZibHh1SUNvZ1FIQmhjbUZ0SUNCN1UzUnlhVzVuZlNCbGNuSnZjazFsYzNOaFoyVWdMU0JOWlhOellXZGxJR1Y0Y0d4aGFXNXBaeUIwYUdVZ1pYSnliM0lnYVc0Z1kyRnpaU0JwZENCcGN5QjBhSEp2ZDI1Y2JpQXFJRUJ5WlhSMWNtNGdkbTlwWkZ4dUlDb3ZYRzVoYzNObGNuUXVkMkZ5YmlBOUlHWjFibU4wYVc5dUlIZGhjbTRvWTI5dVpHbDBhVzl1TENCbGNuSnZjazFsYzNOaFoyVXBJSHRjYmlBZ1kyOXVjM1FnWlhKeWIzSWdQU0J3Y205alpYTnpRMjl1WkdsMGFXOXVLR052Ym1ScGRHbHZiaXdnWlhKeWIzSk5aWE56WVdkbEtUdGNiaUFnYVdZZ0tIUjVjR1Z2WmlCbGNuSnZjaUE5UFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNCamIyNXpiMnhsTG5kaGNtNG9aWEp5YjNJcE8xeHVJQ0I5WEc1OU8xeHVYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQmhjM05sY25RN1hHNGlYU3dpWm1sc1pTSTZJbUZ6YzJWeWRDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSXZjMjkxY21ObEx5SjlcbiIsIi8qKlxuICogVGVzdHMgd2hldGhlciBvciBub3QgYW4gb2JqZWN0IGlzIGFuIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgb2JqZWN0IHRvIHRlc3QuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgYHZhbGAgaXMgYW4gYXJyYXksIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIF9pc0FycmF5KFtdKTsgLy89PiB0cnVlXG4gKiAgICAgIF9pc0FycmF5KG51bGwpOyAvLz0+IGZhbHNlXG4gKiAgICAgIF9pc0FycmF5KHt9KTsgLy89PiBmYWxzZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gX2lzQXJyYXkodmFsKSB7XG4gIHJldHVybiAodmFsICE9IG51bGwgJiZcbiAgICAgICAgICB2YWwubGVuZ3RoID49IDAgJiZcbiAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJyk7XG59O1xuIiwiLyoqXG4gKiBBbiBvcHRpbWl6ZWQsIHByaXZhdGUgYXJyYXkgYHNsaWNlYCBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcmd1bWVudHN8QXJyYXl9IGFyZ3MgVGhlIGFycmF5IG9yIGFyZ3VtZW50cyBvYmplY3QgdG8gY29uc2lkZXIuXG4gKiBAcGFyYW0ge051bWJlcn0gW2Zyb209MF0gVGhlIGFycmF5IGluZGV4IHRvIHNsaWNlIGZyb20sIGluY2x1c2l2ZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbdG89YXJncy5sZW5ndGhdIFRoZSBhcnJheSBpbmRleCB0byBzbGljZSB0bywgZXhjbHVzaXZlLlxuICogQHJldHVybiB7QXJyYXl9IEEgbmV3LCBzbGljZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgX3NsaWNlKFsxLCAyLCAzLCA0LCA1XSwgMSwgMyk7IC8vPT4gWzIsIDNdXG4gKlxuICogICAgICB2YXIgZmlyc3RUaHJlZUFyZ3MgPSBmdW5jdGlvbihhLCBiLCBjLCBkKSB7XG4gKiAgICAgICAgcmV0dXJuIF9zbGljZShhcmd1bWVudHMsIDAsIDMpO1xuICogICAgICB9O1xuICogICAgICBmaXJzdFRocmVlQXJncygxLCAyLCAzLCA0KTsgLy89PiBbMSwgMiwgM11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfc2xpY2UoYXJncywgZnJvbSwgdG8pIHtcbiAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gX3NsaWNlKGFyZ3MsIDAsIGFyZ3MubGVuZ3RoKTtcbiAgICBjYXNlIDI6IHJldHVybiBfc2xpY2UoYXJncywgZnJvbSwgYXJncy5sZW5ndGgpO1xuICAgIGRlZmF1bHQ6XG4gICAgICB2YXIgbGlzdCA9IFtdO1xuICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICB2YXIgbGVuID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oYXJncy5sZW5ndGgsIHRvKSAtIGZyb20pO1xuICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICBsaXN0W2lkeF0gPSBhcmdzW2Zyb20gKyBpZHhdO1xuICAgICAgICBpZHggKz0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaXN0O1xuICB9XG59O1xuIiwidmFyIF9pc0FycmF5ID0gcmVxdWlyZSgnLi9faXNBcnJheScpO1xudmFyIF9zbGljZSA9IHJlcXVpcmUoJy4vX3NsaWNlJyk7XG5cblxuLyoqXG4gKiBTaW1pbGFyIHRvIGhhc01ldGhvZCwgdGhpcyBjaGVja3Mgd2hldGhlciBhIGZ1bmN0aW9uIGhhcyBhIFttZXRob2RuYW1lXVxuICogZnVuY3Rpb24uIElmIGl0IGlzbid0IGFuIGFycmF5IGl0IHdpbGwgZXhlY3V0ZSB0aGF0IGZ1bmN0aW9uIG90aGVyd2lzZSBpdFxuICogd2lsbCBkZWZhdWx0IHRvIHRoZSByYW1kYSBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gcmFtZGEgaW1wbGVtdGF0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kbmFtZSBwcm9wZXJ0eSB0byBjaGVjayBmb3IgYSBjdXN0b20gaW1wbGVtZW50YXRpb25cbiAqIEByZXR1cm4ge09iamVjdH0gV2hhdGV2ZXIgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbWV0aG9kIGlzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jaGVja0Zvck1ldGhvZChtZXRob2RuYW1lLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZuKCk7XG4gICAgfVxuICAgIHZhciBvYmogPSBhcmd1bWVudHNbbGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIChfaXNBcnJheShvYmopIHx8IHR5cGVvZiBvYmpbbWV0aG9kbmFtZV0gIT09ICdmdW5jdGlvbicpID9cbiAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOlxuICAgICAgb2JqW21ldGhvZG5hbWVdLmFwcGx5KG9iaiwgX3NsaWNlKGFyZ3VtZW50cywgMCwgbGVuZ3RoIC0gMSkpO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2lzUGxhY2Vob2xkZXIoYSkge1xuICByZXR1cm4gYSAhPSBudWxsICYmXG4gICAgICAgICB0eXBlb2YgYSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgIGFbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlO1xufTtcbiIsInZhciBfaXNQbGFjZWhvbGRlciA9IHJlcXVpcmUoJy4vX2lzUGxhY2Vob2xkZXInKTtcblxuXG4vKipcbiAqIE9wdGltaXplZCBpbnRlcm5hbCBvbmUtYXJpdHkgY3VycnkgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jdXJyeTEoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGYxKGEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCBfaXNQbGFjZWhvbGRlcihhKSkge1xuICAgICAgcmV0dXJuIGYxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59O1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL19jdXJyeTEnKTtcbnZhciBfaXNQbGFjZWhvbGRlciA9IHJlcXVpcmUoJy4vX2lzUGxhY2Vob2xkZXInKTtcblxuXG4vKipcbiAqIE9wdGltaXplZCBpbnRlcm5hbCB0d28tYXJpdHkgY3VycnkgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jdXJyeTIoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGYyKGEsIGIpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIGYyO1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gX2lzUGxhY2Vob2xkZXIoYSkgPyBmMlxuICAgICAgICAgICAgIDogX2N1cnJ5MShmdW5jdGlvbihfYikgeyByZXR1cm4gZm4oYSwgX2IpOyB9KTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihiKSA/IGYyXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihhKSA/IF9jdXJyeTEoZnVuY3Rpb24oX2EpIHsgcmV0dXJuIGZuKF9hLCBiKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGIpID8gX2N1cnJ5MShmdW5jdGlvbihfYikgeyByZXR1cm4gZm4oYSwgX2IpOyB9KVxuICAgICAgICAgICAgIDogZm4oYSwgYik7XG4gICAgfVxuICB9O1xufTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9fY3VycnkxJyk7XG52YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vX2N1cnJ5MicpO1xudmFyIF9pc1BsYWNlaG9sZGVyID0gcmVxdWlyZSgnLi9faXNQbGFjZWhvbGRlcicpO1xuXG5cbi8qKlxuICogT3B0aW1pemVkIGludGVybmFsIHRocmVlLWFyaXR5IGN1cnJ5IGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY3VycnkzKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmMyhhLCBiLCBjKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBmMztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpID8gZjNcbiAgICAgICAgICAgICA6IF9jdXJyeTIoZnVuY3Rpb24oX2IsIF9jKSB7IHJldHVybiBmbihhLCBfYiwgX2MpOyB9KTtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpID8gZjNcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGEpID8gX2N1cnJ5MihmdW5jdGlvbihfYSwgX2MpIHsgcmV0dXJuIGZuKF9hLCBiLCBfYyk7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTIoZnVuY3Rpb24oX2IsIF9jKSB7IHJldHVybiBmbihhLCBfYiwgX2MpOyB9KVxuICAgICAgICAgICAgIDogX2N1cnJ5MShmdW5jdGlvbihfYykgeyByZXR1cm4gZm4oYSwgYiwgX2MpOyB9KTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihiKSAmJiBfaXNQbGFjZWhvbGRlcihjKSA/IGYzXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTIoZnVuY3Rpb24oX2EsIF9iKSB7IHJldHVybiBmbihfYSwgX2IsIGMpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYSkgJiYgX2lzUGxhY2Vob2xkZXIoYykgPyBfY3VycnkyKGZ1bmN0aW9uKF9hLCBfYykgeyByZXR1cm4gZm4oX2EsIGIsIF9jKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGIpICYmIF9pc1BsYWNlaG9sZGVyKGMpID8gX2N1cnJ5MihmdW5jdGlvbihfYiwgX2MpIHsgcmV0dXJuIGZuKGEsIF9iLCBfYyk7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihhKSA/IF9jdXJyeTEoZnVuY3Rpb24oX2EpIHsgcmV0dXJuIGZuKF9hLCBiLCBjKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGIpID8gX2N1cnJ5MShmdW5jdGlvbihfYikgeyByZXR1cm4gZm4oYSwgX2IsIGMpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYykgPyBfY3VycnkxKGZ1bmN0aW9uKF9jKSB7IHJldHVybiBmbihhLCBiLCBfYyk7IH0pXG4gICAgICAgICAgICAgOiBmbihhLCBiLCBjKTtcbiAgICB9XG4gIH07XG59O1xuIiwidmFyIF9jaGVja0Zvck1ldGhvZCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2NoZWNrRm9yTWV0aG9kJyk7XG52YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgZWxlbWVudHMgb2YgdGhlIGdpdmVuIGxpc3Qgb3Igc3RyaW5nIChvciBvYmplY3Qgd2l0aCBhIGBzbGljZWBcbiAqIG1ldGhvZCkgZnJvbSBgZnJvbUluZGV4YCAoaW5jbHVzaXZlKSB0byBgdG9JbmRleGAgKGV4Y2x1c2l2ZSkuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYHNsaWNlYCBtZXRob2Qgb2YgdGhlIHRoaXJkIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuNFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBbYV0gLT4gW2FdXG4gKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gU3RyaW5nIC0+IFN0cmluZ1xuICogQHBhcmFtIHtOdW1iZXJ9IGZyb21JbmRleCBUaGUgc3RhcnQgaW5kZXggKGluY2x1c2l2ZSkuXG4gKiBAcGFyYW0ge051bWJlcn0gdG9JbmRleCBUaGUgZW5kIGluZGV4IChleGNsdXNpdmUpLlxuICogQHBhcmFtIHsqfSBsaXN0XG4gKiBAcmV0dXJuIHsqfVxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuc2xpY2UoMSwgMywgWydhJywgJ2InLCAnYycsICdkJ10pOyAgICAgICAgLy89PiBbJ2InLCAnYyddXG4gKiAgICAgIFIuc2xpY2UoMSwgSW5maW5pdHksIFsnYScsICdiJywgJ2MnLCAnZCddKTsgLy89PiBbJ2InLCAnYycsICdkJ11cbiAqICAgICAgUi5zbGljZSgwLCAtMSwgWydhJywgJ2InLCAnYycsICdkJ10pOyAgICAgICAvLz0+IFsnYScsICdiJywgJ2MnXVxuICogICAgICBSLnNsaWNlKC0zLCAtMSwgWydhJywgJ2InLCAnYycsICdkJ10pOyAgICAgIC8vPT4gWydiJywgJ2MnXVxuICogICAgICBSLnNsaWNlKDAsIDMsICdyYW1kYScpOyAgICAgICAgICAgICAgICAgICAgIC8vPT4gJ3JhbSdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkzKF9jaGVja0Zvck1ldGhvZCgnc2xpY2UnLCBmdW5jdGlvbiBzbGljZShmcm9tSW5kZXgsIHRvSW5kZXgsIGxpc3QpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGxpc3QsIGZyb21JbmRleCwgdG9JbmRleCk7XG59KSk7XG4iLCJ2YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVzdWx0IG9mIFwic2V0dGluZ1wiIHRoZSBwb3J0aW9uIG9mIHRoZSBnaXZlbiBkYXRhIHN0cnVjdHVyZVxuICogZm9jdXNlZCBieSB0aGUgZ2l2ZW4gbGVucyB0byB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIHRoZSBnaXZlbiBmdW5jdGlvbiB0b1xuICogdGhlIGZvY3VzZWQgdmFsdWUuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMTYuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHR5cGVkZWZuIExlbnMgcyBhID0gRnVuY3RvciBmID0+IChhIC0+IGYgYSkgLT4gcyAtPiBmIHNcbiAqIEBzaWcgTGVucyBzIGEgLT4gKGEgLT4gYSkgLT4gcyAtPiBzXG4gKiBAcGFyYW0ge0xlbnN9IGxlbnNcbiAqIEBwYXJhbSB7Kn0gdlxuICogQHBhcmFtIHsqfSB4XG4gKiBAcmV0dXJuIHsqfVxuICogQHNlZSBSLnByb3AsIFIubGVuc0luZGV4LCBSLmxlbnNQcm9wXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIGhlYWRMZW5zID0gUi5sZW5zSW5kZXgoMCk7XG4gKlxuICogICAgICBSLm92ZXIoaGVhZExlbnMsIFIudG9VcHBlciwgWydmb28nLCAnYmFyJywgJ2JheiddKTsgLy89PiBbJ0ZPTycsICdiYXInLCAnYmF6J11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIC8vIGBJZGVudGl0eWAgaXMgYSBmdW5jdG9yIHRoYXQgaG9sZHMgYSBzaW5nbGUgdmFsdWUsIHdoZXJlIGBtYXBgIHNpbXBseVxuICAvLyB0cmFuc2Zvcm1zIHRoZSBoZWxkIHZhbHVlIHdpdGggdGhlIHByb3ZpZGVkIGZ1bmN0aW9uLlxuICB2YXIgSWRlbnRpdHkgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHt2YWx1ZTogeCwgbWFwOiBmdW5jdGlvbihmKSB7IHJldHVybiBJZGVudGl0eShmKHgpKTsgfX07XG4gIH07XG5cbiAgcmV0dXJuIF9jdXJyeTMoZnVuY3Rpb24gb3ZlcihsZW5zLCBmLCB4KSB7XG4gICAgLy8gVGhlIHZhbHVlIHJldHVybmVkIGJ5IHRoZSBnZXR0ZXIgZnVuY3Rpb24gaXMgZmlyc3QgdHJhbnNmb3JtZWQgd2l0aCBgZmAsXG4gICAgLy8gdGhlbiBzZXQgYXMgdGhlIHZhbHVlIG9mIGFuIGBJZGVudGl0eWAuIFRoaXMgaXMgdGhlbiBtYXBwZWQgb3ZlciB3aXRoIHRoZVxuICAgIC8vIHNldHRlciBmdW5jdGlvbiBvZiB0aGUgbGVucy5cbiAgICByZXR1cm4gbGVucyhmdW5jdGlvbih5KSB7IHJldHVybiBJZGVudGl0eShmKHkpKTsgfSkoeCkudmFsdWU7XG4gIH0pO1xufSgpKTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBhbHdheXMgcmV0dXJucyB0aGUgZ2l2ZW4gdmFsdWUuIE5vdGUgdGhhdCBmb3JcbiAqIG5vbi1wcmltaXRpdmVzIHRoZSB2YWx1ZSByZXR1cm5lZCBpcyBhIHJlZmVyZW5jZSB0byB0aGUgb3JpZ2luYWwgdmFsdWUuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBpcyBrbm93biBhcyBgY29uc3RgLCBgY29uc3RhbnRgLCBvciBgS2AgKGZvciBLIGNvbWJpbmF0b3IpIGluXG4gKiBvdGhlciBsYW5ndWFnZXMgYW5kIGxpYnJhcmllcy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyBhIC0+ICgqIC0+IGEpXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gd3JhcCBpbiBhIGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBGdW5jdGlvbiA6OiAqIC0+IHZhbC5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgdCA9IFIuYWx3YXlzKCdUZWUnKTtcbiAqICAgICAgdCgpOyAvLz0+ICdUZWUnXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MShmdW5jdGlvbiBhbHdheXModmFsKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9O1xufSk7XG4iLCJ2YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xudmFyIGFsd2F5cyA9IHJlcXVpcmUoJy4vYWx3YXlzJyk7XG52YXIgb3ZlciA9IHJlcXVpcmUoJy4vb3ZlcicpO1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVzdWx0IG9mIFwic2V0dGluZ1wiIHRoZSBwb3J0aW9uIG9mIHRoZSBnaXZlbiBkYXRhIHN0cnVjdHVyZVxuICogZm9jdXNlZCBieSB0aGUgZ2l2ZW4gbGVucyB0byB0aGUgZ2l2ZW4gdmFsdWUuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMTYuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHR5cGVkZWZuIExlbnMgcyBhID0gRnVuY3RvciBmID0+IChhIC0+IGYgYSkgLT4gcyAtPiBmIHNcbiAqIEBzaWcgTGVucyBzIGEgLT4gYSAtPiBzIC0+IHNcbiAqIEBwYXJhbSB7TGVuc30gbGVuc1xuICogQHBhcmFtIHsqfSB2XG4gKiBAcGFyYW0geyp9IHhcbiAqIEByZXR1cm4geyp9XG4gKiBAc2VlIFIucHJvcCwgUi5sZW5zSW5kZXgsIFIubGVuc1Byb3BcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgeExlbnMgPSBSLmxlbnNQcm9wKCd4Jyk7XG4gKlxuICogICAgICBSLnNldCh4TGVucywgNCwge3g6IDEsIHk6IDJ9KTsgIC8vPT4ge3g6IDQsIHk6IDJ9XG4gKiAgICAgIFIuc2V0KHhMZW5zLCA4LCB7eDogMSwgeTogMn0pOyAgLy89PiB7eDogOCwgeTogMn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkzKGZ1bmN0aW9uIHNldChsZW5zLCB2LCB4KSB7XG4gIHJldHVybiBvdmVyKGxlbnMsIGFsd2F5cyh2KSwgeCk7XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2FyaXR5KG4sIGZuKSB7XG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIHN3aXRjaCAobikge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmN0aW9uKCkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhMCkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhMCwgYTEpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMikgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMykgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDU6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSA2OiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMiwgYTMsIGE0LCBhNSkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDc6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNikgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDg6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgY2FzZSA5OiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDEwOiByZXR1cm4gZnVuY3Rpb24oYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCwgYTkpIHsgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCB0byBfYXJpdHkgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIG5vIGdyZWF0ZXIgdGhhbiB0ZW4nKTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3BpcGUoZiwgZykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGcuY2FsbCh0aGlzLCBmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBYV3JhcChmbikge1xuICAgIHRoaXMuZiA9IGZuO1xuICB9XG4gIFhXcmFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW5pdCBub3QgaW1wbGVtZW50ZWQgb24gWFdyYXAnKTtcbiAgfTtcbiAgWFdyYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbihhY2MpIHsgcmV0dXJuIGFjYzsgfTtcbiAgWFdyYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24oYWNjLCB4KSB7XG4gICAgcmV0dXJuIHRoaXMuZihhY2MsIHgpO1xuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbiBfeHdyYXAoZm4pIHsgcmV0dXJuIG5ldyBYV3JhcChmbik7IH07XG59KCkpO1xuIiwidmFyIF9hcml0eSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2FyaXR5Jyk7XG52YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xuXG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXMgYm91bmQgdG8gYSBjb250ZXh0LlxuICogTm90ZTogYFIuYmluZGAgZG9lcyBub3QgcHJvdmlkZSB0aGUgYWRkaXRpb25hbCBhcmd1bWVudC1iaW5kaW5nIGNhcGFiaWxpdGllcyBvZlxuICogW0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9iaW5kKS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC42LjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHNpZyAoKiAtPiAqKSAtPiB7Kn0gLT4gKCogLT4gKilcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBiaW5kIHRvIGNvbnRleHRcbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzT2JqIFRoZSBjb250ZXh0IHRvIGJpbmQgYGZuYCB0b1xuICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCB3aWxsIGV4ZWN1dGUgaW4gdGhlIGNvbnRleHQgb2YgYHRoaXNPYmpgLlxuICogQHNlZSBSLnBhcnRpYWxcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgbG9nID0gUi5iaW5kKGNvbnNvbGUubG9nLCBjb25zb2xlKTtcbiAqICAgICAgUi5waXBlKFIuYXNzb2MoJ2EnLCAyKSwgUi50YXAobG9nKSwgUi5hc3NvYygnYScsIDMpKSh7YTogMX0pOyAvLz0+IHthOiAzfVxuICogICAgICAvLyBsb2dzIHthOiAyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gYmluZChmbiwgdGhpc09iaikge1xuICByZXR1cm4gX2FyaXR5KGZuLmxlbmd0aCwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNPYmosIGFyZ3VtZW50cyk7XG4gIH0pO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9pc1N0cmluZyh4KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xufTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG52YXIgX2lzQXJyYXkgPSByZXF1aXJlKCcuL2ludGVybmFsL19pc0FycmF5Jyk7XG52YXIgX2lzU3RyaW5nID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9faXNTdHJpbmcnKTtcblxuXG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBpcyBzaW1pbGFyIHRvIGFuIGFycmF5LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjUuMFxuICogQGNhdGVnb3J5IFR5cGVcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnICogLT4gQm9vbGVhblxuICogQHBhcmFtIHsqfSB4IFRoZSBvYmplY3QgdG8gdGVzdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgeGAgaGFzIGEgbnVtZXJpYyBsZW5ndGggcHJvcGVydHkgYW5kIGV4dHJlbWUgaW5kaWNlcyBkZWZpbmVkOyBgZmFsc2VgIG90aGVyd2lzZS5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmlzQXJyYXlMaWtlKFtdKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuaXNBcnJheUxpa2UodHJ1ZSk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pc0FycmF5TGlrZSh7fSk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pc0FycmF5TGlrZSh7bGVuZ3RoOiAxMH0pOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuaXNBcnJheUxpa2UoezA6ICd6ZXJvJywgOTogJ25pbmUnLCBsZW5ndGg6IDEwfSk7IC8vPT4gdHJ1ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTEoZnVuY3Rpb24gaXNBcnJheUxpa2UoeCkge1xuICBpZiAoX2lzQXJyYXkoeCkpIHsgcmV0dXJuIHRydWU7IH1cbiAgaWYgKCF4KSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAodHlwZW9mIHggIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoX2lzU3RyaW5nKHgpKSB7IHJldHVybiBmYWxzZTsgfVxuICBpZiAoeC5ub2RlVHlwZSA9PT0gMSkgeyByZXR1cm4gISF4Lmxlbmd0aDsgfVxuICBpZiAoeC5sZW5ndGggPT09IDApIHsgcmV0dXJuIHRydWU7IH1cbiAgaWYgKHgubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB4Lmhhc093blByb3BlcnR5KDApICYmIHguaGFzT3duUHJvcGVydHkoeC5sZW5ndGggLSAxKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59KTtcbiIsInZhciBfeHdyYXAgPSByZXF1aXJlKCcuL194d3JhcCcpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuLi9iaW5kJyk7XG52YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pc0FycmF5TGlrZScpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBfYXJyYXlSZWR1Y2UoeGYsIGFjYywgbGlzdCkge1xuICAgIHZhciBpZHggPSAwO1xuICAgIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcbiAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICBhY2MgPSB4ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShhY2MsIGxpc3RbaWR4XSk7XG4gICAgICBpZiAoYWNjICYmIGFjY1snQEB0cmFuc2R1Y2VyL3JlZHVjZWQnXSkge1xuICAgICAgICBhY2MgPSBhY2NbJ0BAdHJhbnNkdWNlci92YWx1ZSddO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlkeCArPSAxO1xuICAgIH1cbiAgICByZXR1cm4geGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShhY2MpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2l0ZXJhYmxlUmVkdWNlKHhmLCBhY2MsIGl0ZXIpIHtcbiAgICB2YXIgc3RlcCA9IGl0ZXIubmV4dCgpO1xuICAgIHdoaWxlICghc3RlcC5kb25lKSB7XG4gICAgICBhY2MgPSB4ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShhY2MsIHN0ZXAudmFsdWUpO1xuICAgICAgaWYgKGFjYyAmJiBhY2NbJ0BAdHJhbnNkdWNlci9yZWR1Y2VkJ10pIHtcbiAgICAgICAgYWNjID0gYWNjWydAQHRyYW5zZHVjZXIvdmFsdWUnXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBzdGVwID0gaXRlci5uZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiB4ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKGFjYyk7XG4gIH1cblxuICBmdW5jdGlvbiBfbWV0aG9kUmVkdWNlKHhmLCBhY2MsIG9iaikge1xuICAgIHJldHVybiB4ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKG9iai5yZWR1Y2UoYmluZCh4ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSwgeGYpLCBhY2MpKTtcbiAgfVxuXG4gIHZhciBzeW1JdGVyYXRvciA9ICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJykgPyBTeW1ib2wuaXRlcmF0b3IgOiAnQEBpdGVyYXRvcic7XG4gIHJldHVybiBmdW5jdGlvbiBfcmVkdWNlKGZuLCBhY2MsIGxpc3QpIHtcbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBmbiA9IF94d3JhcChmbik7XG4gICAgfVxuICAgIGlmIChpc0FycmF5TGlrZShsaXN0KSkge1xuICAgICAgcmV0dXJuIF9hcnJheVJlZHVjZShmbiwgYWNjLCBsaXN0KTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsaXN0LnJlZHVjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIF9tZXRob2RSZWR1Y2UoZm4sIGFjYywgbGlzdCk7XG4gICAgfVxuICAgIGlmIChsaXN0W3N5bUl0ZXJhdG9yXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gX2l0ZXJhYmxlUmVkdWNlKGZuLCBhY2MsIGxpc3Rbc3ltSXRlcmF0b3JdKCkpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxpc3QubmV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIF9pdGVyYWJsZVJlZHVjZShmbiwgYWNjLCBsaXN0KTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncmVkdWNlOiBsaXN0IG11c3QgYmUgYXJyYXkgb3IgaXRlcmFibGUnKTtcbiAgfTtcbn0oKSk7XG4iLCJ2YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xudmFyIF9yZWR1Y2UgPSByZXF1aXJlKCcuL2ludGVybmFsL19yZWR1Y2UnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBzaW5nbGUgaXRlbSBieSBpdGVyYXRpbmcgdGhyb3VnaCB0aGUgbGlzdCwgc3VjY2Vzc2l2ZWx5IGNhbGxpbmdcbiAqIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBhbmQgcGFzc2luZyBpdCBhbiBhY2N1bXVsYXRvciB2YWx1ZSBhbmQgdGhlIGN1cnJlbnRcbiAqIHZhbHVlIGZyb20gdGhlIGFycmF5LCBhbmQgdGhlbiBwYXNzaW5nIHRoZSByZXN1bHQgdG8gdGhlIG5leHQgY2FsbC5cbiAqXG4gKiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gcmVjZWl2ZXMgdHdvIHZhbHVlczogKihhY2MsIHZhbHVlKSouIEl0IG1heSB1c2VcbiAqIGBSLnJlZHVjZWRgIHRvIHNob3J0Y3V0IHRoZSBpdGVyYXRpb24uXG4gKlxuICogTm90ZTogYFIucmVkdWNlYCBkb2VzIG5vdCBza2lwIGRlbGV0ZWQgb3IgdW5hc3NpZ25lZCBpbmRpY2VzIChzcGFyc2VcbiAqIGFycmF5cyksIHVubGlrZSB0aGUgbmF0aXZlIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2QuIEZvciBtb3JlIGRldGFpbHNcbiAqIG9uIHRoaXMgYmVoYXZpb3IsIHNlZTpcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3JlZHVjZSNEZXNjcmlwdGlvblxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGByZWR1Y2VgIG1ldGhvZCBvZiB0aGUgdGhpcmQgYXJndW1lbnQsIGlmIHByZXNlbnQuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyAoKGEsIGIpIC0+IGEpIC0+IGEgLT4gW2JdIC0+IGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBpdGVyYXRvciBmdW5jdGlvbi4gUmVjZWl2ZXMgdHdvIHZhbHVlcywgdGhlIGFjY3VtdWxhdG9yIGFuZCB0aGVcbiAqICAgICAgICBjdXJyZW50IGVsZW1lbnQgZnJvbSB0aGUgYXJyYXkuXG4gKiBAcGFyYW0geyp9IGFjYyBUaGUgYWNjdW11bGF0b3IgdmFsdWUuXG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEByZXR1cm4geyp9IFRoZSBmaW5hbCwgYWNjdW11bGF0ZWQgdmFsdWUuXG4gKiBAc2VlIFIucmVkdWNlZCwgUi5hZGRJbmRleFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBudW1iZXJzID0gWzEsIDIsIDNdO1xuICogICAgICB2YXIgcGx1cyA9IChhLCBiKSA9PiBhICsgYjtcbiAqXG4gKiAgICAgIFIucmVkdWNlKHBsdXMsIDEwLCBudW1iZXJzKTsgLy89PiAxNlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTMoX3JlZHVjZSk7XG4iLCJ2YXIgX2NoZWNrRm9yTWV0aG9kID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY2hlY2tGb3JNZXRob2QnKTtcbnZhciBzbGljZSA9IHJlcXVpcmUoJy4vc2xpY2UnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYWxsIGJ1dCB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgZ2l2ZW4gbGlzdCBvciBzdHJpbmcgKG9yIG9iamVjdFxuICogd2l0aCBhIGB0YWlsYCBtZXRob2QpLlxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGBzbGljZWAgbWV0aG9kIG9mIHRoZSBmaXJzdCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIFthXSAtPiBbYV1cbiAqIEBzaWcgU3RyaW5nIC0+IFN0cmluZ1xuICogQHBhcmFtIHsqfSBsaXN0XG4gKiBAcmV0dXJuIHsqfVxuICogQHNlZSBSLmhlYWQsIFIuaW5pdCwgUi5sYXN0XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi50YWlsKFsxLCAyLCAzXSk7ICAvLz0+IFsyLCAzXVxuICogICAgICBSLnRhaWwoWzEsIDJdKTsgICAgIC8vPT4gWzJdXG4gKiAgICAgIFIudGFpbChbMV0pOyAgICAgICAgLy89PiBbXVxuICogICAgICBSLnRhaWwoW10pOyAgICAgICAgIC8vPT4gW11cbiAqXG4gKiAgICAgIFIudGFpbCgnYWJjJyk7ICAvLz0+ICdiYydcbiAqICAgICAgUi50YWlsKCdhYicpOyAgIC8vPT4gJ2InXG4gKiAgICAgIFIudGFpbCgnYScpOyAgICAvLz0+ICcnXG4gKiAgICAgIFIudGFpbCgnJyk7ICAgICAvLz0+ICcnXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2NoZWNrRm9yTWV0aG9kKCd0YWlsJywgc2xpY2UoMSwgSW5maW5pdHkpKTtcbiIsInZhciBfYXJpdHkgPSByZXF1aXJlKCcuL2ludGVybmFsL19hcml0eScpO1xudmFyIF9waXBlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fcGlwZScpO1xudmFyIHJlZHVjZSA9IHJlcXVpcmUoJy4vcmVkdWNlJyk7XG52YXIgdGFpbCA9IHJlcXVpcmUoJy4vdGFpbCcpO1xuXG5cbi8qKlxuICogUGVyZm9ybXMgbGVmdC10by1yaWdodCBmdW5jdGlvbiBjb21wb3NpdGlvbi4gVGhlIGxlZnRtb3N0IGZ1bmN0aW9uIG1heSBoYXZlXG4gKiBhbnkgYXJpdHk7IHRoZSByZW1haW5pbmcgZnVuY3Rpb25zIG11c3QgYmUgdW5hcnkuXG4gKlxuICogSW4gc29tZSBsaWJyYXJpZXMgdGhpcyBmdW5jdGlvbiBpcyBuYW1lZCBgc2VxdWVuY2VgLlxuICpcbiAqICoqTm90ZToqKiBUaGUgcmVzdWx0IG9mIHBpcGUgaXMgbm90IGF1dG9tYXRpY2FsbHkgY3VycmllZC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyAoKChhLCBiLCAuLi4sIG4pIC0+IG8pLCAobyAtPiBwKSwgLi4uLCAoeCAtPiB5KSwgKHkgLT4geikpIC0+ICgoYSwgYiwgLi4uLCBuKSAtPiB6KVxuICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3Rpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBzZWUgUi5jb21wb3NlXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIGYgPSBSLnBpcGUoTWF0aC5wb3csIFIubmVnYXRlLCBSLmluYyk7XG4gKlxuICogICAgICBmKDMsIDQpOyAvLyAtKDNeNCkgKyAxXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcGlwZSgpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3BpcGUgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIGFyZ3VtZW50Jyk7XG4gIH1cbiAgcmV0dXJuIF9hcml0eShhcmd1bWVudHNbMF0ubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHJlZHVjZShfcGlwZSwgYXJndW1lbnRzWzBdLCB0YWlsKGFyZ3VtZW50cykpKTtcbn07XG4iLCIvKipcbiAqIFByaXZhdGUgYGNvbmNhdGAgZnVuY3Rpb24gdG8gbWVyZ2UgdHdvIGFycmF5LWxpa2Ugb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxBcmd1bWVudHN9IFtzZXQxPVtdXSBBbiBhcnJheS1saWtlIG9iamVjdC5cbiAqIEBwYXJhbSB7QXJyYXl8QXJndW1lbnRzfSBbc2V0Mj1bXV0gQW4gYXJyYXktbGlrZSBvYmplY3QuXG4gKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcsIG1lcmdlZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBfY29uY2F0KFs0LCA1LCA2XSwgWzEsIDIsIDNdKTsgLy89PiBbNCwgNSwgNiwgMSwgMiwgM11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY29uY2F0KHNldDEsIHNldDIpIHtcbiAgc2V0MSA9IHNldDEgfHwgW107XG4gIHNldDIgPSBzZXQyIHx8IFtdO1xuICB2YXIgaWR4O1xuICB2YXIgbGVuMSA9IHNldDEubGVuZ3RoO1xuICB2YXIgbGVuMiA9IHNldDIubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgaWR4ID0gMDtcbiAgd2hpbGUgKGlkeCA8IGxlbjEpIHtcbiAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBzZXQxW2lkeF07XG4gICAgaWR4ICs9IDE7XG4gIH1cbiAgaWR4ID0gMDtcbiAgd2hpbGUgKGlkeCA8IGxlbjIpIHtcbiAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBzZXQyW2lkeF07XG4gICAgaWR4ICs9IDE7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgX2NvbmNhdCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2NvbmNhdCcpO1xudmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBuZXcgbGlzdCB3aXRoIHRoZSBnaXZlbiBlbGVtZW50IGF0IHRoZSBmcm9udCwgZm9sbG93ZWQgYnkgdGhlXG4gKiBjb250ZW50cyBvZiB0aGUgbGlzdC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIGEgLT4gW2FdIC0+IFthXVxuICogQHBhcmFtIHsqfSBlbCBUaGUgaXRlbSB0byBhZGQgdG8gdGhlIGhlYWQgb2YgdGhlIG91dHB1dCBsaXN0LlxuICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gYWRkIHRvIHRoZSB0YWlsIG9mIHRoZSBvdXRwdXQgbGlzdC5cbiAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBhcnJheS5cbiAqIEBzZWUgUi5hcHBlbmRcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnByZXBlbmQoJ2ZlZScsIFsnZmknLCAnZm8nLCAnZnVtJ10pOyAvLz0+IFsnZmVlJywgJ2ZpJywgJ2ZvJywgJ2Z1bSddXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBwcmVwZW5kKGVsLCBsaXN0KSB7XG4gIHJldHVybiBfY29uY2F0KFtlbF0sIGxpc3QpO1xufSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2hlbiBzdXBwbGllZCBhbiBvYmplY3QgcmV0dXJucyB0aGUgaW5kaWNhdGVkXG4gKiBwcm9wZXJ0eSBvZiB0aGF0IG9iamVjdCwgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHNpZyBzIC0+IHtzOiBhfSAtPiBhIHwgVW5kZWZpbmVkXG4gKiBAcGFyYW0ge1N0cmluZ30gcCBUaGUgcHJvcGVydHkgbmFtZVxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHF1ZXJ5XG4gKiBAcmV0dXJuIHsqfSBUaGUgdmFsdWUgYXQgYG9iai5wYC5cbiAqIEBzZWUgUi5wYXRoXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5wcm9wKCd4Jywge3g6IDEwMH0pOyAvLz0+IDEwMFxuICogICAgICBSLnByb3AoJ3gnLCB7fSk7IC8vPT4gdW5kZWZpbmVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBwcm9wKHAsIG9iaikgeyByZXR1cm4gb2JqW3BdOyB9KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2lzVHJhbnNmb3JtZXIob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqWydAQHRyYW5zZHVjZXIvc3RlcCddID09PSAnZnVuY3Rpb24nO1xufTtcbiIsInZhciBfaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzQXJyYXknKTtcbnZhciBfaXNUcmFuc2Zvcm1lciA9IHJlcXVpcmUoJy4vX2lzVHJhbnNmb3JtZXInKTtcbnZhciBfc2xpY2UgPSByZXF1aXJlKCcuL19zbGljZScpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgZGlzcGF0Y2hlcyB3aXRoIGRpZmZlcmVudCBzdHJhdGVnaWVzIGJhc2VkIG9uIHRoZVxuICogb2JqZWN0IGluIGxpc3QgcG9zaXRpb24gKGxhc3QgYXJndW1lbnQpLiBJZiBpdCBpcyBhbiBhcnJheSwgZXhlY3V0ZXMgW2ZuXS5cbiAqIE90aGVyd2lzZSwgaWYgaXQgaGFzIGEgZnVuY3Rpb24gd2l0aCBbbWV0aG9kbmFtZV0sIGl0IHdpbGwgZXhlY3V0ZSB0aGF0XG4gKiBmdW5jdGlvbiAoZnVuY3RvciBjYXNlKS4gT3RoZXJ3aXNlLCBpZiBpdCBpcyBhIHRyYW5zZm9ybWVyLCB1c2VzIHRyYW5zZHVjZXJcbiAqIFt4Zl0gdG8gcmV0dXJuIGEgbmV3IHRyYW5zZm9ybWVyICh0cmFuc2R1Y2VyIGNhc2UpLiBPdGhlcndpc2UsIGl0IHdpbGxcbiAqIGRlZmF1bHQgdG8gZXhlY3V0aW5nIFtmbl0uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RuYW1lIHByb3BlcnR5IHRvIGNoZWNrIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0geGYgdHJhbnNkdWNlciB0byBpbml0aWFsaXplIGlmIG9iamVjdCBpcyB0cmFuc2Zvcm1lclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gZGVmYXVsdCByYW1kYSBpbXBsZW1lbnRhdGlvblxuICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCBkaXNwYXRjaGVzIG9uIG9iamVjdCBpbiBsaXN0IHBvc2l0aW9uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2Rpc3BhdGNoYWJsZShtZXRob2RuYW1lLCB4ZiwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmbigpO1xuICAgIH1cbiAgICB2YXIgb2JqID0gYXJndW1lbnRzW2xlbmd0aCAtIDFdO1xuICAgIGlmICghX2lzQXJyYXkob2JqKSkge1xuICAgICAgdmFyIGFyZ3MgPSBfc2xpY2UoYXJndW1lbnRzLCAwLCBsZW5ndGggLSAxKTtcbiAgICAgIGlmICh0eXBlb2Ygb2JqW21ldGhvZG5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBvYmpbbWV0aG9kbmFtZV0uYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIGlmIChfaXNUcmFuc2Zvcm1lcihvYmopKSB7XG4gICAgICAgIHZhciB0cmFuc2R1Y2VyID0geGYuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgIHJldHVybiB0cmFuc2R1Y2VyKG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX21hcChmbiwgZnVuY3Rvcikge1xuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGZ1bmN0b3IubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuKTtcbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIHJlc3VsdFtpZHhdID0gZm4oZnVuY3RvcltpZHhdKTtcbiAgICBpZHggKz0gMTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL2luaXQnXSgpO1xuICB9LFxuICByZXN1bHQ6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ocmVzdWx0KTtcbiAgfVxufTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9fY3VycnkyJyk7XG52YXIgX3hmQmFzZSA9IHJlcXVpcmUoJy4vX3hmQmFzZScpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBYTWFwKGYsIHhmKSB7XG4gICAgdGhpcy54ZiA9IHhmO1xuICAgIHRoaXMuZiA9IGY7XG4gIH1cbiAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBfeGZCYXNlLmluaXQ7XG4gIFhNYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBfeGZCYXNlLnJlc3VsdDtcbiAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbihyZXN1bHQsIGlucHV0KSB7XG4gICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCB0aGlzLmYoaW5wdXQpKTtcbiAgfTtcblxuICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeG1hcChmLCB4ZikgeyByZXR1cm4gbmV3IFhNYXAoZiwgeGYpOyB9KTtcbn0oKSk7XG4iLCJ2YXIgX2FyaXR5ID0gcmVxdWlyZSgnLi9fYXJpdHknKTtcbnZhciBfaXNQbGFjZWhvbGRlciA9IHJlcXVpcmUoJy4vX2lzUGxhY2Vob2xkZXInKTtcblxuXG4vKipcbiAqIEludGVybmFsIGN1cnJ5TiBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIFRoZSBhcml0eSBvZiB0aGUgY3VycmllZCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7QXJyYXl9IHJlY2VpdmVkIEFuIGFycmF5IG9mIGFyZ3VtZW50cyByZWNlaXZlZCB0aHVzIGZhci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfY3VycnlOKGxlbmd0aCwgcmVjZWl2ZWQsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29tYmluZWQgPSBbXTtcbiAgICB2YXIgYXJnc0lkeCA9IDA7XG4gICAgdmFyIGxlZnQgPSBsZW5ndGg7XG4gICAgdmFyIGNvbWJpbmVkSWR4ID0gMDtcbiAgICB3aGlsZSAoY29tYmluZWRJZHggPCByZWNlaXZlZC5sZW5ndGggfHwgYXJnc0lkeCA8IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBpZiAoY29tYmluZWRJZHggPCByZWNlaXZlZC5sZW5ndGggJiZcbiAgICAgICAgICAoIV9pc1BsYWNlaG9sZGVyKHJlY2VpdmVkW2NvbWJpbmVkSWR4XSkgfHxcbiAgICAgICAgICAgYXJnc0lkeCA+PSBhcmd1bWVudHMubGVuZ3RoKSkge1xuICAgICAgICByZXN1bHQgPSByZWNlaXZlZFtjb21iaW5lZElkeF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgPSBhcmd1bWVudHNbYXJnc0lkeF07XG4gICAgICAgIGFyZ3NJZHggKz0gMTtcbiAgICAgIH1cbiAgICAgIGNvbWJpbmVkW2NvbWJpbmVkSWR4XSA9IHJlc3VsdDtcbiAgICAgIGlmICghX2lzUGxhY2Vob2xkZXIocmVzdWx0KSkge1xuICAgICAgICBsZWZ0IC09IDE7XG4gICAgICB9XG4gICAgICBjb21iaW5lZElkeCArPSAxO1xuICAgIH1cbiAgICByZXR1cm4gbGVmdCA8PSAwID8gZm4uYXBwbHkodGhpcywgY29tYmluZWQpXG4gICAgICAgICAgICAgICAgICAgICA6IF9hcml0eShsZWZ0LCBfY3VycnlOKGxlbmd0aCwgY29tYmluZWQsIGZuKSk7XG4gIH07XG59O1xuIiwidmFyIF9hcml0eSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2FyaXR5Jyk7XG52YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MScpO1xudmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfY3VycnlOID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnlOJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgY3VycmllZCBlcXVpdmFsZW50IG9mIHRoZSBwcm92aWRlZCBmdW5jdGlvbiwgd2l0aCB0aGUgc3BlY2lmaWVkXG4gKiBhcml0eS4gVGhlIGN1cnJpZWQgZnVuY3Rpb24gaGFzIHR3byB1bnVzdWFsIGNhcGFiaWxpdGllcy4gRmlyc3QsIGl0c1xuICogYXJndW1lbnRzIG5lZWRuJ3QgYmUgcHJvdmlkZWQgb25lIGF0IGEgdGltZS4gSWYgYGdgIGlzIGBSLmN1cnJ5TigzLCBmKWAsIHRoZVxuICogZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICpcbiAqICAgLSBgZygxKSgyKSgzKWBcbiAqICAgLSBgZygxKSgyLCAzKWBcbiAqICAgLSBgZygxLCAyKSgzKWBcbiAqICAgLSBgZygxLCAyLCAzKWBcbiAqXG4gKiBTZWNvbmRseSwgdGhlIHNwZWNpYWwgcGxhY2Vob2xkZXIgdmFsdWUgYFIuX19gIG1heSBiZSB1c2VkIHRvIHNwZWNpZnlcbiAqIFwiZ2Fwc1wiLCBhbGxvd2luZyBwYXJ0aWFsIGFwcGxpY2F0aW9uIG9mIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMsXG4gKiByZWdhcmRsZXNzIG9mIHRoZWlyIHBvc2l0aW9ucy4gSWYgYGdgIGlzIGFzIGFib3ZlIGFuZCBgX2AgaXMgYFIuX19gLCB0aGVcbiAqIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAqXG4gKiAgIC0gYGcoMSwgMiwgMylgXG4gKiAgIC0gYGcoXywgMiwgMykoMSlgXG4gKiAgIC0gYGcoXywgXywgMykoMSkoMilgXG4gKiAgIC0gYGcoXywgXywgMykoMSwgMilgXG4gKiAgIC0gYGcoXywgMikoMSkoMylgXG4gKiAgIC0gYGcoXywgMikoMSwgMylgXG4gKiAgIC0gYGcoXywgMikoXywgMykoMSlgXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuNS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgTnVtYmVyIC0+ICgqIC0+IGEpIC0+ICgqIC0+IGEpXG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIFRoZSBhcml0eSBmb3IgdGhlIHJldHVybmVkIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3LCBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHNlZSBSLmN1cnJ5XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIHN1bUFyZ3MgPSAoLi4uYXJncykgPT4gUi5zdW0oYXJncyk7XG4gKlxuICogICAgICB2YXIgY3VycmllZEFkZEZvdXJOdW1iZXJzID0gUi5jdXJyeU4oNCwgc3VtQXJncyk7XG4gKiAgICAgIHZhciBmID0gY3VycmllZEFkZEZvdXJOdW1iZXJzKDEsIDIpO1xuICogICAgICB2YXIgZyA9IGYoMyk7XG4gKiAgICAgIGcoNCk7IC8vPT4gMTBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGN1cnJ5TihsZW5ndGgsIGZuKSB7XG4gIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gX2N1cnJ5MShmbik7XG4gIH1cbiAgcmV0dXJuIF9hcml0eShsZW5ndGgsIF9jdXJyeU4obGVuZ3RoLCBbXSwgZm4pKTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfaGFzKHByb3AsIG9iaikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59O1xuIiwidmFyIF9oYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJndW1lbnRzKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXScgP1xuICAgIGZ1bmN0aW9uIF9pc0FyZ3VtZW50cyh4KSB7IHJldHVybiB0b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcmd1bWVudHNdJzsgfSA6XG4gICAgZnVuY3Rpb24gX2lzQXJndW1lbnRzKHgpIHsgcmV0dXJuIF9oYXMoJ2NhbGxlZScsIHgpOyB9O1xufSgpKTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG52YXIgX2hhcyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2hhcycpO1xudmFyIF9pc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2lzQXJndW1lbnRzJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgbGlzdCBjb250YWluaW5nIHRoZSBuYW1lcyBvZiBhbGwgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgb2ZcbiAqIHRoZSBzdXBwbGllZCBvYmplY3QuXG4gKiBOb3RlIHRoYXQgdGhlIG9yZGVyIG9mIHRoZSBvdXRwdXQgYXJyYXkgaXMgbm90IGd1YXJhbnRlZWQgdG8gYmUgY29uc2lzdGVudFxuICogYWNyb3NzIGRpZmZlcmVudCBKUyBwbGF0Zm9ybXMuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAc2lnIHtrOiB2fSAtPiBba11cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBleHRyYWN0IHByb3BlcnRpZXMgZnJvbVxuICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIHRoZSBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmtleXMoe2E6IDEsIGI6IDIsIGM6IDN9KTsgLy89PiBbJ2EnLCAnYicsICdjJ11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIC8vIGNvdmVyIElFIDwgOSBrZXlzIGlzc3Vlc1xuICB2YXIgaGFzRW51bUJ1ZyA9ICEoe3RvU3RyaW5nOiBudWxsfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG4gIHZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbJ2NvbnN0cnVjdG9yJywgJ3ZhbHVlT2YnLCAnaXNQcm90b3R5cGVPZicsICd0b1N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2hhc093blByb3BlcnR5JywgJ3RvTG9jYWxlU3RyaW5nJ107XG4gIC8vIFNhZmFyaSBidWdcbiAgdmFyIGhhc0FyZ3NFbnVtQnVnID0gKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICByZXR1cm4gYXJndW1lbnRzLnByb3BlcnR5SXNFbnVtZXJhYmxlKCdsZW5ndGgnKTtcbiAgfSgpKTtcblxuICB2YXIgY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyhsaXN0LCBpdGVtKSB7XG4gICAgdmFyIGlkeCA9IDA7XG4gICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICBpZiAobGlzdFtpZHhdID09PSBpdGVtKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaWR4ICs9IDE7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZXR1cm4gdHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nICYmICFoYXNBcmdzRW51bUJ1ZyA/XG4gICAgX2N1cnJ5MShmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgICAgcmV0dXJuIE9iamVjdChvYmopICE9PSBvYmogPyBbXSA6IE9iamVjdC5rZXlzKG9iaik7XG4gICAgfSkgOlxuICAgIF9jdXJyeTEoZnVuY3Rpb24ga2V5cyhvYmopIHtcbiAgICAgIGlmIChPYmplY3Qob2JqKSAhPT0gb2JqKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wLCBuSWR4O1xuICAgICAgdmFyIGtzID0gW107XG4gICAgICB2YXIgY2hlY2tBcmdzTGVuZ3RoID0gaGFzQXJnc0VudW1CdWcgJiYgX2lzQXJndW1lbnRzKG9iaik7XG4gICAgICBmb3IgKHByb3AgaW4gb2JqKSB7XG4gICAgICAgIGlmIChfaGFzKHByb3AsIG9iaikgJiYgKCFjaGVja0FyZ3NMZW5ndGggfHwgcHJvcCAhPT0gJ2xlbmd0aCcpKSB7XG4gICAgICAgICAga3Nba3MubGVuZ3RoXSA9IHByb3A7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChoYXNFbnVtQnVnKSB7XG4gICAgICAgIG5JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoIC0gMTtcbiAgICAgICAgd2hpbGUgKG5JZHggPj0gMCkge1xuICAgICAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbklkeF07XG4gICAgICAgICAgaWYgKF9oYXMocHJvcCwgb2JqKSAmJiAhY29udGFpbnMoa3MsIHByb3ApKSB7XG4gICAgICAgICAgICBrc1trcy5sZW5ndGhdID0gcHJvcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgbklkeCAtPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4ga3M7XG4gICAgfSk7XG59KCkpO1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfZGlzcGF0Y2hhYmxlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fZGlzcGF0Y2hhYmxlJyk7XG52YXIgX21hcCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX21hcCcpO1xudmFyIF9yZWR1Y2UgPSByZXF1aXJlKCcuL2ludGVybmFsL19yZWR1Y2UnKTtcbnZhciBfeG1hcCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX3htYXAnKTtcbnZhciBjdXJyeU4gPSByZXF1aXJlKCcuL2N1cnJ5TicpO1xudmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuXG4vKipcbiAqIFRha2VzIGEgZnVuY3Rpb24gYW5kXG4gKiBhIFtmdW5jdG9yXShodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWxhbmQvZmFudGFzeS1sYW5kI2Z1bmN0b3IpLFxuICogYXBwbGllcyB0aGUgZnVuY3Rpb24gdG8gZWFjaCBvZiB0aGUgZnVuY3RvcidzIHZhbHVlcywgYW5kIHJldHVybnNcbiAqIGEgZnVuY3RvciBvZiB0aGUgc2FtZSBzaGFwZS5cbiAqXG4gKiBSYW1kYSBwcm92aWRlcyBzdWl0YWJsZSBgbWFwYCBpbXBsZW1lbnRhdGlvbnMgZm9yIGBBcnJheWAgYW5kIGBPYmplY3RgLFxuICogc28gdGhpcyBmdW5jdGlvbiBtYXkgYmUgYXBwbGllZCB0byBgWzEsIDIsIDNdYCBvciBge3g6IDEsIHk6IDIsIHo6IDN9YC5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgbWFwYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gKlxuICogQWxzbyB0cmVhdHMgZnVuY3Rpb25zIGFzIGZ1bmN0b3JzIGFuZCB3aWxsIGNvbXBvc2UgdGhlbSB0b2dldGhlci5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIEZ1bmN0b3IgZiA9PiAoYSAtPiBiKSAtPiBmIGEgLT4gZiBiXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGV2ZXJ5IGVsZW1lbnQgb2YgdGhlIGlucHV0IGBsaXN0YC5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gYmUgaXRlcmF0ZWQgb3Zlci5cbiAqIEByZXR1cm4ge0FycmF5fSBUaGUgbmV3IGxpc3QuXG4gKiBAc2VlIFIudHJhbnNkdWNlLCBSLmFkZEluZGV4XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIGRvdWJsZSA9IHggPT4geCAqIDI7XG4gKlxuICogICAgICBSLm1hcChkb3VibGUsIFsxLCAyLCAzXSk7IC8vPT4gWzIsIDQsIDZdXG4gKlxuICogICAgICBSLm1hcChkb3VibGUsIHt4OiAxLCB5OiAyLCB6OiAzfSk7IC8vPT4ge3g6IDIsIHk6IDQsIHo6IDZ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdtYXAnLCBfeG1hcCwgZnVuY3Rpb24gbWFwKGZuLCBmdW5jdG9yKSB7XG4gIHN3aXRjaCAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0b3IpKSB7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOlxuICAgICAgcmV0dXJuIGN1cnJ5TihmdW5jdG9yLmxlbmd0aCwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGZ1bmN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgICB9KTtcbiAgICBjYXNlICdbb2JqZWN0IE9iamVjdF0nOlxuICAgICAgcmV0dXJuIF9yZWR1Y2UoZnVuY3Rpb24oYWNjLCBrZXkpIHtcbiAgICAgICAgYWNjW2tleV0gPSBmbihmdW5jdG9yW2tleV0pO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30sIGtleXMoZnVuY3RvcikpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gX21hcChmbiwgZnVuY3Rvcik7XG4gIH1cbn0pKTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG52YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBsZW5zIGZvciB0aGUgZ2l2ZW4gZ2V0dGVyIGFuZCBzZXR0ZXIgZnVuY3Rpb25zLiBUaGUgZ2V0dGVyIFwiZ2V0c1wiXG4gKiB0aGUgdmFsdWUgb2YgdGhlIGZvY3VzOyB0aGUgc2V0dGVyIFwic2V0c1wiIHRoZSB2YWx1ZSBvZiB0aGUgZm9jdXMuIFRoZSBzZXR0ZXJcbiAqIHNob3VsZCBub3QgbXV0YXRlIHRoZSBkYXRhIHN0cnVjdHVyZS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC44LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBMZW5zIHMgYSA9IEZ1bmN0b3IgZiA9PiAoYSAtPiBmIGEpIC0+IHMgLT4gZiBzXG4gKiBAc2lnIChzIC0+IGEpIC0+ICgoYSwgcykgLT4gcykgLT4gTGVucyBzIGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGdldHRlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gc2V0dGVyXG4gKiBAcmV0dXJuIHtMZW5zfVxuICogQHNlZSBSLnZpZXcsIFIuc2V0LCBSLm92ZXIsIFIubGVuc0luZGV4LCBSLmxlbnNQcm9wXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIHhMZW5zID0gUi5sZW5zKFIucHJvcCgneCcpLCBSLmFzc29jKCd4JykpO1xuICpcbiAqICAgICAgUi52aWV3KHhMZW5zLCB7eDogMSwgeTogMn0pOyAgICAgICAgICAgIC8vPT4gMVxuICogICAgICBSLnNldCh4TGVucywgNCwge3g6IDEsIHk6IDJ9KTsgICAgICAgICAgLy89PiB7eDogNCwgeTogMn1cbiAqICAgICAgUi5vdmVyKHhMZW5zLCBSLm5lZ2F0ZSwge3g6IDEsIHk6IDJ9KTsgIC8vPT4ge3g6IC0xLCB5OiAyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gbGVucyhnZXR0ZXIsIHNldHRlcikge1xuICByZXR1cm4gZnVuY3Rpb24odG9GdW5jdG9yRm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICByZXR1cm4gbWFwKFxuICAgICAgICBmdW5jdGlvbihmb2N1cykge1xuICAgICAgICAgIHJldHVybiBzZXR0ZXIoZm9jdXMsIHRhcmdldCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRvRnVuY3RvckZuKGdldHRlcih0YXJnZXQpKVxuICAgICAgKTtcbiAgICB9O1xuICB9O1xufSk7XG4iLCJ2YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MScpO1xudmFyIGN1cnJ5TiA9IHJlcXVpcmUoJy4vY3VycnlOJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgY3VycmllZCBlcXVpdmFsZW50IG9mIHRoZSBwcm92aWRlZCBmdW5jdGlvbi4gVGhlIGN1cnJpZWQgZnVuY3Rpb25cbiAqIGhhcyB0d28gdW51c3VhbCBjYXBhYmlsaXRpZXMuIEZpcnN0LCBpdHMgYXJndW1lbnRzIG5lZWRuJ3QgYmUgcHJvdmlkZWQgb25lXG4gKiBhdCBhIHRpbWUuIElmIGBmYCBpcyBhIHRlcm5hcnkgZnVuY3Rpb24gYW5kIGBnYCBpcyBgUi5jdXJyeShmKWAsIHRoZVxuICogZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICpcbiAqICAgLSBgZygxKSgyKSgzKWBcbiAqICAgLSBgZygxKSgyLCAzKWBcbiAqICAgLSBgZygxLCAyKSgzKWBcbiAqICAgLSBgZygxLCAyLCAzKWBcbiAqXG4gKiBTZWNvbmRseSwgdGhlIHNwZWNpYWwgcGxhY2Vob2xkZXIgdmFsdWUgYFIuX19gIG1heSBiZSB1c2VkIHRvIHNwZWNpZnlcbiAqIFwiZ2Fwc1wiLCBhbGxvd2luZyBwYXJ0aWFsIGFwcGxpY2F0aW9uIG9mIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMsXG4gKiByZWdhcmRsZXNzIG9mIHRoZWlyIHBvc2l0aW9ucy4gSWYgYGdgIGlzIGFzIGFib3ZlIGFuZCBgX2AgaXMgYFIuX19gLCB0aGVcbiAqIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAqXG4gKiAgIC0gYGcoMSwgMiwgMylgXG4gKiAgIC0gYGcoXywgMiwgMykoMSlgXG4gKiAgIC0gYGcoXywgXywgMykoMSkoMilgXG4gKiAgIC0gYGcoXywgXywgMykoMSwgMilgXG4gKiAgIC0gYGcoXywgMikoMSkoMylgXG4gKiAgIC0gYGcoXywgMikoMSwgMylgXG4gKiAgIC0gYGcoXywgMikoXywgMykoMSlgXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgKCogLT4gYSkgLT4gKCogLT4gYSlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldywgY3VycmllZCBmdW5jdGlvbi5cbiAqIEBzZWUgUi5jdXJyeU5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgYWRkRm91ck51bWJlcnMgPSAoYSwgYiwgYywgZCkgPT4gYSArIGIgKyBjICsgZDtcbiAqXG4gKiAgICAgIHZhciBjdXJyaWVkQWRkRm91ck51bWJlcnMgPSBSLmN1cnJ5KGFkZEZvdXJOdW1iZXJzKTtcbiAqICAgICAgdmFyIGYgPSBjdXJyaWVkQWRkRm91ck51bWJlcnMoMSwgMik7XG4gKiAgICAgIHZhciBnID0gZigzKTtcbiAqICAgICAgZyg0KTsgLy89PiAxMFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTEoZnVuY3Rpb24gY3VycnkoZm4pIHtcbiAgcmV0dXJuIGN1cnJ5Tihmbi5sZW5ndGgsIGZuKTtcbn0pO1xuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTQgUXVpbGRyZWVuIE1vdHRhIDxxdWlsZHJlZW5AZ21haWwuY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4vLyBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuLy8gKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuLy8gaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbi8vIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4vLyBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuLy8gc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbi8vIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4vLyBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4vLyBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4vLyBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4vLyBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vKipcbiAqIEBtb2R1bGUgbGliL2VpdGhlclxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEVpdGhlclxuXG4vLyAtLSBBbGlhc2VzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjbG9uZSAgICAgICAgID0gT2JqZWN0LmNyZWF0ZVxudmFyIHVuaW1wbGVtZW50ZWQgPSBmdW5jdGlvbigpeyB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZC4nKSB9XG52YXIgbm9vcCAgICAgICAgICA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG4vLyAtLSBJbXBsZW1lbnRhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUaGUgYEVpdGhlcihhLCBiKWAgc3RydWN0dXJlIHJlcHJlc2VudHMgdGhlIGxvZ2ljYWwgZGlzanVuY3Rpb24gYmV0d2VlbiBgYWBcbiAqIGFuZCBgYmAuIEluIG90aGVyIHdvcmRzLCBgRWl0aGVyYCBtYXkgY29udGFpbiBlaXRoZXIgYSB2YWx1ZSBvZiB0eXBlIGBhYCBvclxuICogYSB2YWx1ZSBvZiB0eXBlIGBiYCwgYXQgYW55IGdpdmVuIHRpbWUuIFRoaXMgcGFydGljdWxhciBpbXBsZW1lbnRhdGlvbiBpc1xuICogYmlhc2VkIG9uIHRoZSByaWdodCB2YWx1ZSAoYGJgKSwgdGh1cyBwcm9qZWN0aW9ucyB3aWxsIHRha2UgdGhlIHJpZ2h0IHZhbHVlXG4gKiBvdmVyIHRoZSBsZWZ0IG9uZS5cbiAqXG4gKiBUaGlzIGNsYXNzIG1vZGVscyB0d28gZGlmZmVyZW50IGNhc2VzOiBgTGVmdCBhYCBhbmQgYFJpZ2h0IGJgLCBhbmQgY2FuIGhvbGRcbiAqIG9uZSBvZiB0aGUgY2FzZXMgYXQgYW55IGdpdmVuIHRpbWUuIFRoZSBwcm9qZWN0aW9ucyBhcmUsIG5vbmUgdGhlIGxlc3MsXG4gKiBiaWFzZWQgZm9yIHRoZSBgUmlnaHRgIGNhc2UsIHRodXMgYSBjb21tb24gdXNlIGNhc2UgZm9yIHRoaXMgc3RydWN0dXJlIGlzIHRvXG4gKiBob2xkIHRoZSByZXN1bHRzIG9mIGNvbXB1dGF0aW9ucyB0aGF0IG1heSBmYWlsLCB3aGVuIHlvdSB3YW50IHRvIHN0b3JlXG4gKiBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIG9uIHRoZSBmYWlsdXJlIChpbnN0ZWFkIG9mIHRocm93aW5nIGFuIGV4Y2VwdGlvbikuXG4gKlxuICogRnVydGhlcm1vcmUsIHRoZSB2YWx1ZXMgb2YgYEVpdGhlcihhLCBiKWAgY2FuIGJlIGNvbWJpbmVkIGFuZCBtYW5pcHVsYXRlZCBieVxuICogdXNpbmcgdGhlIGV4cHJlc3NpdmUgbW9uYWRpYyBvcGVyYXRpb25zLiBUaGlzIGFsbG93cyBzYWZlbHkgc2VxdWVuY2luZ1xuICogb3BlcmF0aW9ucyB0aGF0IG1heSBmYWlsLCBhbmQgc2FmZWx5IGNvbXBvc2luZyB2YWx1ZXMgdGhhdCB5b3UgZG9uJ3Qga25vd1xuICogd2hldGhlciB0aGV5J3JlIHByZXNlbnQgb3Igbm90LCBmYWlsaW5nIGVhcmx5IChyZXR1cm5pbmcgYSBgTGVmdCBhYCkgaWYgYW55XG4gKiBvZiB0aGUgb3BlcmF0aW9ucyBmYWlsLlxuICpcbiAqIFdoaWxlIHRoaXMgY2xhc3MgY2FuIGNlcnRhaW5seSBtb2RlbCBpbnB1dCB2YWxpZGF0aW9ucywgdGhlIFtWYWxpZGF0aW9uXVtdXG4gKiBzdHJ1Y3R1cmUgbGVuZHMgaXRzZWxmIGJldHRlciB0byB0aGF0IHVzZSBjYXNlLCBzaW5jZSBpdCBjYW4gbmF0dXJhbGx5XG4gKiBhZ2dyZWdhdGUgZmFpbHVyZXMg4oCUIG1vbmFkcyBzaG9ydGN1dCBvbiB0aGUgZmlyc3QgZmFpbHVyZS5cbiAqXG4gKiBbVmFsaWRhdGlvbl06IGh0dHBzOi8vZ2l0aHViLmNvbS9mb2xrdGFsZS9kYXRhLnZhbGlkYXRpb25cbiAqXG4gKlxuICogQGNsYXNzXG4gKiBAc3VtbWFyeVxuICogRWl0aGVyW86xLCDOsl0gPDogQXBwbGljYXRpdmVbzrJdXG4gKiAgICAgICAgICAgICAgICwgRnVuY3RvclvOsl1cbiAqICAgICAgICAgICAgICAgLCBDaGFpblvOsl1cbiAqICAgICAgICAgICAgICAgLCBTaG93XG4gKiAgICAgICAgICAgICAgICwgRXFcbiAqL1xuZnVuY3Rpb24gRWl0aGVyKCkgeyB9XG5cbkxlZnQucHJvdG90eXBlID0gY2xvbmUoRWl0aGVyLnByb3RvdHlwZSlcbmZ1bmN0aW9uIExlZnQoYSkge1xuICB0aGlzLnZhbHVlID0gYVxufVxuXG5SaWdodC5wcm90b3R5cGUgPSBjbG9uZShFaXRoZXIucHJvdG90eXBlKVxuZnVuY3Rpb24gUmlnaHQoYSkge1xuICB0aGlzLnZhbHVlID0gYVxufVxuXG4vLyAtLSBDb25zdHJ1Y3RvcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIGhvbGRpbmcgYSBgTGVmdGAgdmFsdWUuIFRoaXNcbiAqIHVzdWFsbHkgcmVwcmVzZW50cyBhIGZhaWx1cmUgZHVlIHRvIHRoZSByaWdodC1iaWFzIG9mIHRoaXMgc3RydWN0dXJlLlxuICpcbiAqIEBzdW1tYXJ5IGEg4oaSIEVpdGhlclvOsSwgzrJdXG4gKi9cbkVpdGhlci5MZWZ0ID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gbmV3IExlZnQoYSlcbn1cbkVpdGhlci5wcm90b3R5cGUuTGVmdCA9IEVpdGhlci5MZWZ0XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZSBob2xkaW5nIGEgYFJpZ2h0YCB2YWx1ZS4gVGhpc1xuICogdXN1YWxseSByZXByZXNlbnRzIGEgc3VjY2Vzc2Z1bCB2YWx1ZSBkdWUgdG8gdGhlIHJpZ2h0IGJpYXMgb2YgdGhpc1xuICogc3RydWN0dXJlLlxuICpcbiAqIEBzdW1tYXJ5IM6yIOKGkiBFaXRoZXJbzrEsIM6yXVxuICovXG5FaXRoZXIuUmlnaHQgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBuZXcgUmlnaHQoYSlcbn1cbkVpdGhlci5wcm90b3R5cGUuUmlnaHQgPSBFaXRoZXIuUmlnaHRcblxuXG4vLyAtLSBDb252ZXJzaW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIGZyb20gYSBudWxsYWJsZSB0eXBlLlxuICpcbiAqIFRha2VzIHRoZSBgTGVmdGAgY2FzZSBpZiB0aGUgdmFsdWUgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLiBUYWtlcyB0aGVcbiAqIGBSaWdodGAgY2FzZSBvdGhlcndpc2UuXG4gKlxuICogQHN1bW1hcnkgzrEg4oaSIEVpdGhlclvOsSwgzrFdXG4gKi9cbkVpdGhlci5mcm9tTnVsbGFibGUgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBhICE9IG51bGw/ICAgICAgIG5ldyBSaWdodChhKVxuICA6ICAgICAgLyogb3RoZXJ3aXNlICovICBuZXcgTGVmdChhKVxufVxuRWl0aGVyLnByb3RvdHlwZS5mcm9tTnVsbGFibGUgPSBFaXRoZXIuZnJvbU51bGxhYmxlXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZSBmcm9tIGEgYFZhbGlkYXRpb25bzrEsIM6yXWAgdHlwZS5cbiAqXG4gKiBAc3VtbWFyeSBWYWxpZGF0aW9uW86xLCDOsl0g4oaSIEVpdGhlclvOsSwgzrJdXG4gKi9cbkVpdGhlci5mcm9tVmFsaWRhdGlvbiA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGEuZm9sZChFaXRoZXIuTGVmdCwgRWl0aGVyLlJpZ2h0KVxufVxuXG4vKipcbiAqIEV4ZWN1dGVzIGEgc3luY2hyb25vdXMgY29tcHV0YXRpb24gdGhhdCBtYXkgdGhyb3cgYW5kIGNvbnZlcnRzIGl0IHRvIGFuXG4gKiBFaXRoZXIgdHlwZS5cbiAqXG4gKiBAc3VtbWFyeSAozrHigoEsIM6x4oKCLCAuLi4sIM6x4oKZIC0+IM6yIDo6IHRocm93cyDOsykgLT4gKM6x4oKBLCDOseKCgiwgLi4uLCDOseKCmSAtPiBFaXRoZXJbzrMsIM6yXSlcbiAqL1xuRWl0aGVyLnRyeSA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gbmV3IFJpZ2h0KGYuYXBwbHkobnVsbCwgYXJndW1lbnRzKSlcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIHJldHVybiBuZXcgTGVmdChlKVxuICAgIH1cbiAgfVxufVxuXG5cbi8vIC0tIFByZWRpY2F0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRydWUgaWYgdGhlIGBFaXRoZXJbzrEsIM6yXWAgY29udGFpbnMgYSBgTGVmdGAgdmFsdWUuXG4gKlxuICogQHN1bW1hcnkgQm9vbGVhblxuICovXG5FaXRoZXIucHJvdG90eXBlLmlzTGVmdCA9IGZhbHNlXG5MZWZ0LnByb3RvdHlwZS5pc0xlZnQgICA9IHRydWVcblxuLyoqXG4gKiBUcnVlIGlmIHRoZSBgRWl0aGVyW86xLCDOsl1gIGNvbnRhaW5zIGEgYFJpZ2h0YCB2YWx1ZS5cbiAqXG4gKiBAc3VtbWFyeSBCb29sZWFuXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuaXNSaWdodCA9IGZhbHNlXG5SaWdodC5wcm90b3R5cGUuaXNSaWdodCAgPSB0cnVlXG5cblxuLy8gLS0gQXBwbGljYXRpdmUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgRWl0aGVyW86xLCDOsl1gIGluc3RhbmNlIGhvbGRpbmcgdGhlIGBSaWdodGAgdmFsdWUgYGJgLlxuICpcbiAqIGBiYCBjYW4gYmUgYW55IHZhbHVlLCBpbmNsdWRpbmcgYG51bGxgLCBgdW5kZWZpbmVkYCBvciBhbm90aGVyXG4gKiBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZS5cbiAqXG4gKiBAc3VtbWFyeSDOsiDihpIgRWl0aGVyW86xLCDOsl1cbiAqL1xuRWl0aGVyLm9mID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gbmV3IFJpZ2h0KGEpXG59XG5FaXRoZXIucHJvdG90eXBlLm9mID0gRWl0aGVyLm9mXG5cblxuLyoqXG4gKiBBcHBsaWVzIHRoZSBmdW5jdGlvbiBpbnNpZGUgdGhlIGBSaWdodGAgY2FzZSBvZiB0aGUgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmVcbiAqIHRvIGFub3RoZXIgYXBwbGljYXRpdmUgdHlwZS5cbiAqXG4gKiBUaGUgYEVpdGhlclvOsSwgzrJdYCBzaG91bGQgY29udGFpbiBhIGZ1bmN0aW9uIHZhbHVlLCBvdGhlcndpc2UgYSBgVHlwZUVycm9yYFxuICogaXMgdGhyb3duLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsiDihpIgzrNdLCBmOkFwcGxpY2F0aXZlW19dKSA9PiBmW86yXSDihpIgZlvOs11cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5hcCA9IHVuaW1wbGVtZW50ZWRcblxuTGVmdC5wcm90b3R5cGUuYXAgPSBmdW5jdGlvbihiKSB7XG4gIHJldHVybiB0aGlzXG59XG5cblJpZ2h0LnByb3RvdHlwZS5hcCA9IGZ1bmN0aW9uKGIpIHtcbiAgcmV0dXJuIGIubWFwKHRoaXMudmFsdWUpXG59XG5cblxuLy8gLS0gRnVuY3RvciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgYFJpZ2h0YCB2YWx1ZSBvZiB0aGUgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUgdXNpbmcgYSByZWd1bGFyXG4gKiB1bmFyeSBmdW5jdGlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiAozrIg4oaSIM6zKSDihpIgRWl0aGVyW86xLCDOs11cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5tYXAgPSB1bmltcGxlbWVudGVkXG5MZWZ0LnByb3RvdHlwZS5tYXAgICA9IG5vb3BcblxuUmlnaHQucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIHRoaXMub2YoZih0aGlzLnZhbHVlKSlcbn1cblxuXG4vLyAtLSBDaGFpbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSBgUmlnaHRgIHZhbHVlIG9mIHRoZSBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZSB1c2luZyBhbiB1bmFyeVxuICogZnVuY3Rpb24gdG8gbW9uYWRzLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0sIG06TW9uYWRbX10pID0+ICjOsiDihpIgbVvOs10pIOKGkiBtW86zXVxuICovXG5FaXRoZXIucHJvdG90eXBlLmNoYWluID0gdW5pbXBsZW1lbnRlZFxuTGVmdC5wcm90b3R5cGUuY2hhaW4gICA9IG5vb3BcblxuUmlnaHQucHJvdG90eXBlLmNoYWluID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gZih0aGlzLnZhbHVlKVxufVxuXG5cbi8vIC0tIFNob3cgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFJldHVybnMgYSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZS5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiBWb2lkIOKGkiBTdHJpbmdcbiAqL1xuRWl0aGVyLnByb3RvdHlwZS50b1N0cmluZyA9IHVuaW1wbGVtZW50ZWRcblxuTGVmdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdFaXRoZXIuTGVmdCgnICsgdGhpcy52YWx1ZSArICcpJ1xufVxuXG5SaWdodC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdFaXRoZXIuUmlnaHQoJyArIHRoaXMudmFsdWUgKyAnKSdcbn1cblxuXG4vLyAtLSBFcSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUZXN0cyBpZiBhbiBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZSBpcyBlcXVhbCB0byBhbm90aGVyIGBFaXRoZXJbzrEsIM6yXWBcbiAqIHN0cnVjdHVyZS5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiBFaXRoZXJbzrEsIM6yXSDihpIgQm9vbGVhblxuICovXG5FaXRoZXIucHJvdG90eXBlLmlzRXF1YWwgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLmlzRXF1YWwgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBhLmlzTGVmdCAmJiAoYS52YWx1ZSA9PT0gdGhpcy52YWx1ZSlcbn1cblxuUmlnaHQucHJvdG90eXBlLmlzRXF1YWwgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBhLmlzUmlnaHQgJiYgKGEudmFsdWUgPT09IHRoaXMudmFsdWUpXG59XG5cblxuLy8gLS0gRXh0cmFjdGluZyBhbmQgcmVjb3ZlcmluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIGBSaWdodGAgdmFsdWUgb3V0IG9mIHRoZSBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZSwgaWYgaXRcbiAqIGV4aXN0cy4gT3RoZXJ3aXNlIHRocm93cyBhIGBUeXBlRXJyb3JgLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+IFZvaWQg4oaSIM6yICAgICAgICAgOjogcGFydGlhbCwgdGhyb3dzXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6bGliL2VpdGhlcn5FaXRoZXIjZ2V0T3JFbHNlfSDigJQgQSBnZXR0ZXIgdGhhdCBjYW4gaGFuZGxlIGZhaWx1cmVzLlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOmxpYi9laXRoZXJ+RWl0aGVyI21lcmdlfSDigJQgVGhlIGNvbnZlcmdlbmNlIG9mIGJvdGggdmFsdWVzLlxuICogQHRocm93cyB7VHlwZUVycm9yfSBpZiB0aGUgc3RydWN0dXJlIGhhcyBubyBgUmlnaHRgIHZhbHVlLlxuICovXG5FaXRoZXIucHJvdG90eXBlLmdldCA9IHVuaW1wbGVtZW50ZWRcblxuTGVmdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW4ndCBleHRyYWN0IHRoZSB2YWx1ZSBvZiBhIExlZnQoYSkuXCIpXG59XG5cblJpZ2h0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudmFsdWVcbn1cblxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSBgUmlnaHRgIHZhbHVlIG91dCBvZiB0aGUgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUuIElmIHRoZVxuICogc3RydWN0dXJlIGRvZXNuJ3QgaGF2ZSBhIGBSaWdodGAgdmFsdWUsIHJldHVybnMgdGhlIGdpdmVuIGRlZmF1bHQuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gzrIg4oaSIM6yXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuZ2V0T3JFbHNlID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5nZXRPckVsc2UgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBhXG59XG5cblJpZ2h0LnByb3RvdHlwZS5nZXRPckVsc2UgPSBmdW5jdGlvbihfKSB7XG4gIHJldHVybiB0aGlzLnZhbHVlXG59XG5cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIGEgYExlZnRgIHZhbHVlIGludG8gYSBuZXcgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUuIERvZXMgbm90aGluZ1xuICogaWYgdGhlIHN0cnVjdHVyZSBjb250YWluIGEgYFJpZ2h0YCB2YWx1ZS5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiAozrEg4oaSIEVpdGhlclvOsywgzrJdKSDihpIgRWl0aGVyW86zLCDOsl1cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5vckVsc2UgPSB1bmltcGxlbWVudGVkXG5SaWdodC5wcm90b3R5cGUub3JFbHNlICA9IG5vb3BcblxuTGVmdC5wcm90b3R5cGUub3JFbHNlID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gZih0aGlzLnZhbHVlKVxufVxuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmFsdWUgb2Ygd2hpY2hldmVyIHNpZGUgb2YgdGhlIGRpc2p1bmN0aW9uIHRoYXQgaXMgcHJlc2VudC5cbiAqXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrFdKSA9PiBWb2lkIOKGkiDOsVxuICovXG5FaXRoZXIucHJvdG90eXBlLm1lcmdlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnZhbHVlXG59XG5cblxuLy8gLS0gRm9sZHMgYW5kIEV4dGVuZGVkIFRyYW5zZm9ybWF0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQXBwbGllcyBhIGZ1bmN0aW9uIHRvIGVhY2ggY2FzZSBpbiB0aGlzIGRhdGEgc3RydWN0dXJlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+ICjOsSDihpIgzrMpLCAozrIg4oaSIM6zKSDihpIgzrNcbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5mb2xkID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5mb2xkID0gZnVuY3Rpb24oZiwgXykge1xuICByZXR1cm4gZih0aGlzLnZhbHVlKVxufVxuXG5SaWdodC5wcm90b3R5cGUuZm9sZCA9IGZ1bmN0aW9uKF8sIGcpIHtcbiAgcmV0dXJuIGcodGhpcy52YWx1ZSlcbn1cblxuLyoqXG4gKiBDYXRhbW9ycGhpc20uXG4gKiBcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+IHsgTGVmdDogzrEg4oaSIM6zLCBSaWdodDogzrIg4oaSIM6zIH0g4oaSIM6zXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuY2F0YSA9IHVuaW1wbGVtZW50ZWRcblxuTGVmdC5wcm90b3R5cGUuY2F0YSA9IGZ1bmN0aW9uKHBhdHRlcm4pIHtcbiAgcmV0dXJuIHBhdHRlcm4uTGVmdCh0aGlzLnZhbHVlKVxufVxuXG5SaWdodC5wcm90b3R5cGUuY2F0YSA9IGZ1bmN0aW9uKHBhdHRlcm4pIHtcbiAgcmV0dXJuIHBhdHRlcm4uUmlnaHQodGhpcy52YWx1ZSlcbn1cblxuXG4vKipcbiAqIFN3YXBzIHRoZSBkaXNqdW5jdGlvbiB2YWx1ZXMuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gVm9pZCDihpIgRWl0aGVyW86yLCDOsV1cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5zd2FwID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5zd2FwID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLlJpZ2h0KHRoaXMudmFsdWUpXG59XG5cblJpZ2h0LnByb3RvdHlwZS5zd2FwID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLkxlZnQodGhpcy52YWx1ZSlcbn1cblxuXG4vKipcbiAqIE1hcHMgYm90aCBzaWRlcyBvZiB0aGUgZGlzanVuY3Rpb24uXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gKM6xIOKGkiDOsyksICjOsiDihpIgzrQpIOKGkiBFaXRoZXJbzrMsIM60XVxuICovXG5FaXRoZXIucHJvdG90eXBlLmJpbWFwID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5iaW1hcCA9IGZ1bmN0aW9uKGYsIF8pIHtcbiAgcmV0dXJuIHRoaXMuTGVmdChmKHRoaXMudmFsdWUpKVxufVxuXG5SaWdodC5wcm90b3R5cGUuYmltYXAgPSBmdW5jdGlvbihfLCBnKSB7XG4gIHJldHVybiB0aGlzLlJpZ2h0KGcodGhpcy52YWx1ZSkpXG59XG5cblxuLyoqXG4gKiBNYXBzIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIGRpc2p1bmN0aW9uLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+ICjOsSDihpIgzrMpIOKGkiBFaXRoZXJbzrMsIM6yXVxuICovXG5FaXRoZXIucHJvdG90eXBlLmxlZnRNYXAgPSB1bmltcGxlbWVudGVkXG5SaWdodC5wcm90b3R5cGUubGVmdE1hcCAgPSBub29wXG5cbkxlZnQucHJvdG90eXBlLmxlZnRNYXAgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiB0aGlzLkxlZnQoZih0aGlzLnZhbHVlKSlcbn1cbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMy0yMDE0IFF1aWxkcmVlbiBNb3R0YSA8cXVpbGRyZWVuQGdtYWlsLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuLy8gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbi8vICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbi8vIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4vLyBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuLy8gYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbi8vIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4vLyBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuLy8gRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuLy8gTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuLy8gTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2VpdGhlcicpIiwiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuXG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gXCJzZWFtbGVzcy1pbW11dGFibGVcIjtcbmltcG9ydCB7IGN1cnJ5LCBsZW5zLCBwcm9wLCBwcmVwZW5kLCBvdmVyLCBzZXQsIHBpcGUgfSBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCBFaXRoZXIgZnJvbSBcImRhdGEuZWl0aGVyXCI7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVBdCA9IGN1cnJ5KChrZXlBcnJheSwgbmV3VmFsLCBvYmopID0+IHtcbiAgY29uc3QgZGVlcE5ld1ZhbCA9IGtleUFycmF5LnJlZHVjZVJpZ2h0KFxuICAgIChyZXN1bHQsIGtleSkgPT4gKHsgW2tleV06IHJlc3VsdCB9KVxuICAgICwgbmV3VmFsXG4gICk7XG5cbiAgcmV0dXJuIEltbXV0YWJsZShvYmopLm1lcmdlKGRlZXBOZXdWYWwsIHsgZGVlcDogdHJ1ZSB9KTtcbn0pO1xuXG4vLyBTdGF0ZSBsZW5zZXNcbmV4cG9ydCBjb25zdCBTdGF0ZUxlbnNlcyA9IHtcbiAgZmllbGRUeXBlczogbGVucyhwcm9wKFwiZmllbGRUeXBlc1wiKSwgdXBkYXRlQXQoW1wiZmllbGRUeXBlc1wiXSkpLFxuICBmaWVsZHNTdGF0ZTogbGVucyhwcm9wKFwiZmllbGRzU3RhdGVcIiksIHVwZGF0ZUF0KFtcImZpZWxkc1N0YXRlXCJdKSksXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbGVucyhwcm9wKFwiZmllbGRzU3RhdGVIaXN0b3J5XCIpLCB1cGRhdGVBdChbXCJmaWVsZHNTdGF0ZUhpc3RvcnlcIl0pKSxcbn07XG5cbi8vIF8gPT4gU3RyaW5nXG5leHBvcnQgY29uc3QgY3JlYXRlSWQgPSBfID0+XG4gIERhdGUubm93KCkudG9TdHJpbmcoKTtcblxuLy8gU3RhdGUgLT4gW2ZpZWxkc1N0YXRlXSAtPiBTdGF0ZVxuZXhwb3J0IGNvbnN0IHB1c2hIaXN0b3J5U3RhdGUgPSBjdXJyeSgoc3RhdGUsIG5ld0hpc3RvcnlTdGF0ZSkgPT4gcGlwZShcbiAgLy8gQWRkIGN1cnJlbnQgc3RhdGUgdG8gaGlzdG9yeVxuICBvdmVyKFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlSGlzdG9yeSwgcHJlcGVuZChzdGF0ZS5maWVsZHNTdGF0ZSkpLFxuICAvLyBNYWtlIG5ldyBTdGF0ZSB0aGUgY3VycmVudFxuICBzZXQoU3RhdGVMZW5zZXMuZmllbGRzU3RhdGUsIG5ld0hpc3RvcnlTdGF0ZSlcbikoc3RhdGUpKTtcblxuXG4vLyBTdGF0ZSAtPiBTdGF0ZVxuZXhwb3J0IGNvbnN0IGhpZGVDb25maWdzID0gc3RhdGUgPT5cbiAgc2V0KFxuICAgIFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlLFxuICAgIHN0YXRlLmZpZWxkc1N0YXRlLm1hcChzID0+IE9iamVjdC5hc3NpZ24oe30sIHMsIHsgY29uZmlnU2hvd2luZzogZmFsc2UgfSkpLFxuICAgIHN0YXRlXG4gICk7XG5cblxuLy8gU3RyaW5nIC0+IFN0cmluZyAtPiBPYmplY3QgLT4gRWl0aGVyIFN0cmluZyBPYmplY3RcbmNvbnN0IHByb3BlcnR5VHlwZUNoZWNrID0gY3VycnkoKHByb3BlcnR5TmFtZSwgdHlwZSwgb2JqKSA9PlxuICB0eXBlb2Ygb2JqW3Byb3BlcnR5TmFtZV0gPT09IHR5cGVcbiAgICA/IEVpdGhlci5SaWdodChvYmopXG4gICAgOiBFaXRoZXIuTGVmdChgUHJvcGVydHkgJ3JlcXVpcmVkJyBjYW5ub3QgYmUgb2YgdHlwZSAke3R5cGVvZiBvYmoucmVxdWlyZWR9YClcbik7XG5cbi8vIENoZWNrcyB0aGF0IGEgZmllbGQgaGFzIGl0cyBlc3NlbnRpYWwgcHJvcGVydGllc1xuLy8gT2JqZWN0IC0+IEVpdGhlciBTdHJpbmcgT2JqZWN0XG5leHBvcnQgY29uc3QgdmFsaWRhdGVGaWVsZCA9IGZpZWxkU3RhdGUgPT5cbiAgRWl0aGVyLmZyb21OdWxsYWJsZShmaWVsZFN0YXRlKVxuICAgIC5sZWZ0TWFwKGZzID0+IGBBIGZpZWxkIFN0YXRlIGNhbm5vdCBiZSBlbXB0eSAke3R5cGVvZiBmc31gKVxuICAgIC5jaGFpbihwcm9wZXJ0eVR5cGVDaGVjayhcInJlcXVpcmVkXCIsIFwiYm9vbGVhblwiKSlcbiAgICAuY2hhaW4ocHJvcGVydHlUeXBlQ2hlY2soXCJjb25maWdTaG93aW5nXCIsIFwiYm9vbGVhblwiKSlcbiAgICAuY2hhaW4ocHJvcGVydHlUeXBlQ2hlY2soXCJpZFwiLCBcInN0cmluZ1wiKSk7XG4iLCJpbXBvcnQgeyBTdGF0ZUxlbnNlcyB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBzZXQsIG92ZXIsIHNsaWNlLCBwaXBlIH0gZnJvbSBcInJhbWRhXCI7XG5cbmNvbnN0IGxhc3RIaXN0b3J5U3RhdGUgPSBzdGF0ZSA9PlxuICBzdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnlbMF0gfHwgW107XG5cbmNvbnN0IHVuZG8gPSAoc3RhdGUsIF8pID0+IHBpcGUoXG4gIC8vIE1ha2UgbGFzdCBoaXN0b3J5IGxhc3Qgc3RhdGUgdGhlIGN1cnJlbnQgb25lXG4gIHNldChTdGF0ZUxlbnNlcy5maWVsZHNTdGF0ZSwgbGFzdEhpc3RvcnlTdGF0ZShzdGF0ZSkpLFxuICAvLyBSZW1vdmUgbGFzdCBoaXN0b3J5IHN0YXRlIGZyb20gdGhlIGhpc3RvcnkgYXJyYXlcbiAgb3ZlcihTdGF0ZUxlbnNlcy5maWVsZHNTdGF0ZUhpc3RvcnksIHNsaWNlKDEsIEluZmluaXR5KSlcbikoc3RhdGUpO1xuXG5leHBvcnQgZGVmYXVsdCB1bmRvO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfaWRlbnRpdHkoeCkgeyByZXR1cm4geDsgfTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG52YXIgX2lkZW50aXR5ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9faWRlbnRpdHknKTtcblxuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBkb2VzIG5vdGhpbmcgYnV0IHJldHVybiB0aGUgcGFyYW1ldGVyIHN1cHBsaWVkIHRvIGl0LiBHb29kXG4gKiBhcyBhIGRlZmF1bHQgb3IgcGxhY2Vob2xkZXIgZnVuY3Rpb24uXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgYSAtPiBhXG4gKiBAcGFyYW0geyp9IHggVGhlIHZhbHVlIHRvIHJldHVybi5cbiAqIEByZXR1cm4geyp9IFRoZSBpbnB1dCB2YWx1ZSwgYHhgLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuaWRlbnRpdHkoMSk7IC8vPT4gMVxuICpcbiAqICAgICAgdmFyIG9iaiA9IHt9O1xuICogICAgICBSLmlkZW50aXR5KG9iaikgPT09IG9iajsgLy89PiB0cnVlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MShfaWRlbnRpdHkpO1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcblxuXG4vKipcbiAqIFJldHJpZXZlIHRoZSB2YWx1ZSBhdCBhIGdpdmVuIHBhdGguXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMi4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAc2lnIFtTdHJpbmddIC0+IHtrOiB2fSAtPiB2IHwgVW5kZWZpbmVkXG4gKiBAcGFyYW0ge0FycmF5fSBwYXRoIFRoZSBwYXRoIHRvIHVzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byByZXRyaWV2ZSB0aGUgbmVzdGVkIHByb3BlcnR5IGZyb20uXG4gKiBAcmV0dXJuIHsqfSBUaGUgZGF0YSBhdCBgcGF0aGAuXG4gKiBAc2VlIFIucHJvcFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIucGF0aChbJ2EnLCAnYiddLCB7YToge2I6IDJ9fSk7IC8vPT4gMlxuICogICAgICBSLnBhdGgoWydhJywgJ2InXSwge2M6IHtiOiAyfX0pOyAvLz0+IHVuZGVmaW5lZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gcGF0aChwYXRocywgb2JqKSB7XG4gIHZhciB2YWwgPSBvYmo7XG4gIHZhciBpZHggPSAwO1xuICB3aGlsZSAoaWR4IDwgcGF0aHMubGVuZ3RoKSB7XG4gICAgaWYgKHZhbCA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhbCA9IHZhbFtwYXRoc1tpZHhdXTtcbiAgICBpZHggKz0gMTtcbiAgfVxuICByZXR1cm4gdmFsO1xufSk7XG4iLCJ2YXIgX2NvbmNhdCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2NvbmNhdCcpO1xudmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfcmVkdWNlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fcmVkdWNlJyk7XG52YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAnKTtcblxuXG4vKipcbiAqIGFwIGFwcGxpZXMgYSBsaXN0IG9mIGZ1bmN0aW9ucyB0byBhIGxpc3Qgb2YgdmFsdWVzLlxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGBhcGAgbWV0aG9kIG9mIHRoZSBzZWNvbmQgYXJndW1lbnQsIGlmIHByZXNlbnQuIEFsc29cbiAqIHRyZWF0cyBjdXJyaWVkIGZ1bmN0aW9ucyBhcyBhcHBsaWNhdGl2ZXMuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMy4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgW2EgLT4gYl0gLT4gW2FdIC0+IFtiXVxuICogQHNpZyBBcHBseSBmID0+IGYgKGEgLT4gYikgLT4gZiBhIC0+IGYgYlxuICogQHBhcmFtIHtBcnJheX0gZm5zIEFuIGFycmF5IG9mIGZ1bmN0aW9uc1xuICogQHBhcmFtIHtBcnJheX0gdnMgQW4gYXJyYXkgb2YgdmFsdWVzXG4gKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgcmVzdWx0cyBvZiBhcHBseWluZyBlYWNoIG9mIGBmbnNgIHRvIGFsbCBvZiBgdnNgIGluIHR1cm4uXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5hcChbUi5tdWx0aXBseSgyKSwgUi5hZGQoMyldLCBbMSwyLDNdKTsgLy89PiBbMiwgNCwgNiwgNCwgNSwgNl1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGFwKGFwcGxpY2F0aXZlLCBmbikge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiBhcHBsaWNhdGl2ZS5hcCA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICBhcHBsaWNhdGl2ZS5hcChmbikgOlxuICAgIHR5cGVvZiBhcHBsaWNhdGl2ZSA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICBmdW5jdGlvbih4KSB7IHJldHVybiBhcHBsaWNhdGl2ZSh4KShmbih4KSk7IH0gOlxuICAgIC8vIGVsc2VcbiAgICAgIF9yZWR1Y2UoZnVuY3Rpb24oYWNjLCBmKSB7IHJldHVybiBfY29uY2F0KGFjYywgbWFwKGYsIGZuKSk7IH0sIFtdLCBhcHBsaWNhdGl2ZSlcbiAgKTtcbn0pO1xuIiwidmFyIF9jdXJyeTMgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTMnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBzaW5nbGUgaXRlbSBieSBpdGVyYXRpbmcgdGhyb3VnaCB0aGUgbGlzdCwgc3VjY2Vzc2l2ZWx5IGNhbGxpbmdcbiAqIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBhbmQgcGFzc2luZyBpdCBhbiBhY2N1bXVsYXRvciB2YWx1ZSBhbmQgdGhlIGN1cnJlbnRcbiAqIHZhbHVlIGZyb20gdGhlIGFycmF5LCBhbmQgdGhlbiBwYXNzaW5nIHRoZSByZXN1bHQgdG8gdGhlIG5leHQgY2FsbC5cbiAqXG4gKiBTaW1pbGFyIHRvIGByZWR1Y2VgLCBleGNlcHQgbW92ZXMgdGhyb3VnaCB0aGUgaW5wdXQgbGlzdCBmcm9tIHRoZSByaWdodCB0b1xuICogdGhlIGxlZnQuXG4gKlxuICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJlY2VpdmVzIHR3byB2YWx1ZXM6ICooYWNjLCB2YWx1ZSkqXG4gKlxuICogTm90ZTogYFIucmVkdWNlUmlnaHRgIGRvZXMgbm90IHNraXAgZGVsZXRlZCBvciB1bmFzc2lnbmVkIGluZGljZXMgKHNwYXJzZVxuICogYXJyYXlzKSwgdW5saWtlIHRoZSBuYXRpdmUgYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlsc1xuICogb24gdGhpcyBiZWhhdmlvciwgc2VlOlxuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvcmVkdWNlUmlnaHQjRGVzY3JpcHRpb25cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIChhLGIgLT4gYSkgLT4gYSAtPiBbYl0gLT4gYVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLiBSZWNlaXZlcyB0d28gdmFsdWVzLCB0aGUgYWNjdW11bGF0b3IgYW5kIHRoZVxuICogICAgICAgIGN1cnJlbnQgZWxlbWVudCBmcm9tIHRoZSBhcnJheS5cbiAqIEBwYXJhbSB7Kn0gYWNjIFRoZSBhY2N1bXVsYXRvciB2YWx1ZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHJldHVybiB7Kn0gVGhlIGZpbmFsLCBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqIEBzZWUgUi5hZGRJbmRleFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBwYWlycyA9IFsgWydhJywgMV0sIFsnYicsIDJdLCBbJ2MnLCAzXSBdO1xuICogICAgICB2YXIgZmxhdHRlblBhaXJzID0gKGFjYywgcGFpcikgPT4gYWNjLmNvbmNhdChwYWlyKTtcbiAqXG4gKiAgICAgIFIucmVkdWNlUmlnaHQoZmxhdHRlblBhaXJzLCBbXSwgcGFpcnMpOyAvLz0+IFsgJ2MnLCAzLCAnYicsIDIsICdhJywgMSBdXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MyhmdW5jdGlvbiByZWR1Y2VSaWdodChmbiwgYWNjLCBsaXN0KSB7XG4gIHZhciBpZHggPSBsaXN0Lmxlbmd0aCAtIDE7XG4gIHdoaWxlIChpZHggPj0gMCkge1xuICAgIGFjYyA9IGZuKGFjYywgbGlzdFtpZHhdKTtcbiAgICBpZHggLT0gMTtcbiAgfVxuICByZXR1cm4gYWNjO1xufSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIGFwID0gcmVxdWlyZSgnLi9hcCcpO1xudmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwJyk7XG52YXIgcHJlcGVuZCA9IHJlcXVpcmUoJy4vcHJlcGVuZCcpO1xudmFyIHJlZHVjZVJpZ2h0ID0gcmVxdWlyZSgnLi9yZWR1Y2VSaWdodCcpO1xuXG5cbi8qKlxuICogVHJhbnNmb3JtcyBhIFtUcmF2ZXJzYWJsZV0oaHR0cHM6Ly9naXRodWIuY29tL2ZhbnRhc3lsYW5kL2ZhbnRhc3ktbGFuZCN0cmF2ZXJzYWJsZSlcbiAqIG9mIFtBcHBsaWNhdGl2ZV0oaHR0cHM6Ly9naXRodWIuY29tL2ZhbnRhc3lsYW5kL2ZhbnRhc3ktbGFuZCNhcHBsaWNhdGl2ZSkgaW50byBhblxuICogQXBwbGljYXRpdmUgb2YgVHJhdmVyc2FibGUuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYHNlcXVlbmNlYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xOS4wXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyAoQXBwbGljYXRpdmUgZiwgVHJhdmVyc2FibGUgdCkgPT4gKGEgLT4gZiBhKSAtPiB0IChmIGEpIC0+IGYgKHQgYSlcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9mXG4gKiBAcGFyYW0geyp9IHRyYXZlcnNhYmxlXG4gKiBAcmV0dXJuIHsqfVxuICogQHNlZSBSLnRyYXZlcnNlXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5zZXF1ZW5jZShNYXliZS5vZiwgW0p1c3QoMSksIEp1c3QoMiksIEp1c3QoMyldKTsgICAvLz0+IEp1c3QoWzEsIDIsIDNdKVxuICogICAgICBSLnNlcXVlbmNlKE1heWJlLm9mLCBbSnVzdCgxKSwgSnVzdCgyKSwgTm90aGluZygpXSk7IC8vPT4gTm90aGluZygpXG4gKlxuICogICAgICBSLnNlcXVlbmNlKFIub2YsIEp1c3QoWzEsIDIsIDNdKSk7IC8vPT4gW0p1c3QoMSksIEp1c3QoMiksIEp1c3QoMyldXG4gKiAgICAgIFIuc2VxdWVuY2UoUi5vZiwgTm90aGluZygpKTsgICAgICAgLy89PiBbTm90aGluZygpXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gc2VxdWVuY2Uob2YsIHRyYXZlcnNhYmxlKSB7XG4gIHJldHVybiB0eXBlb2YgdHJhdmVyc2FibGUuc2VxdWVuY2UgPT09ICdmdW5jdGlvbicgP1xuICAgIHRyYXZlcnNhYmxlLnNlcXVlbmNlKG9mKSA6XG4gICAgcmVkdWNlUmlnaHQoZnVuY3Rpb24oYWNjLCB4KSB7IHJldHVybiBhcChtYXAocHJlcGVuZCwgeCksIGFjYyk7IH0sXG4gICAgICAgICAgICAgICAgb2YoW10pLFxuICAgICAgICAgICAgICAgIHRyYXZlcnNhYmxlKTtcbn0pO1xuIiwidmFyIF9jdXJyeTMgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTMnKTtcbnZhciBtYXAgPSByZXF1aXJlKCcuL21hcCcpO1xudmFyIHNlcXVlbmNlID0gcmVxdWlyZSgnLi9zZXF1ZW5jZScpO1xuXG5cbi8qKlxuICogTWFwcyBhbiBbQXBwbGljYXRpdmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9mYW50YXN5bGFuZC9mYW50YXN5LWxhbmQjYXBwbGljYXRpdmUpLXJldHVybmluZ1xuICogZnVuY3Rpb24gb3ZlciBhIFtUcmF2ZXJzYWJsZV0oaHR0cHM6Ly9naXRodWIuY29tL2ZhbnRhc3lsYW5kL2ZhbnRhc3ktbGFuZCN0cmF2ZXJzYWJsZSksXG4gKiB0aGVuIHVzZXMgW2BzZXF1ZW5jZWBdKCNzZXF1ZW5jZSkgdG8gdHJhbnNmb3JtIHRoZSByZXN1bHRpbmcgVHJhdmVyc2FibGUgb2YgQXBwbGljYXRpdmVcbiAqIGludG8gYW4gQXBwbGljYXRpdmUgb2YgVHJhdmVyc2FibGUuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYHNlcXVlbmNlYCBtZXRob2Qgb2YgdGhlIHRoaXJkIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE5LjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIChBcHBsaWNhdGl2ZSBmLCBUcmF2ZXJzYWJsZSB0KSA9PiAoYSAtPiBmIGEpIC0+IChhIC0+IGYgYikgLT4gdCBhIC0+IGYgKHQgYilcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9mXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmXG4gKiBAcGFyYW0geyp9IHRyYXZlcnNhYmxlXG4gKiBAcmV0dXJuIHsqfVxuICogQHNlZSBSLnNlcXVlbmNlXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgLy8gUmV0dXJucyBgTm90aGluZ2AgaWYgdGhlIGdpdmVuIGRpdmlzb3IgaXMgYDBgXG4gKiAgICAgIHNhZmVEaXYgPSBuID0+IGQgPT4gZCA9PT0gMCA/IE5vdGhpbmcoKSA6IEp1c3QobiAvIGQpXG4gKlxuICogICAgICBSLnRyYXZlcnNlKE1heWJlLm9mLCBzYWZlRGl2KDEwKSwgWzIsIDQsIDVdKTsgLy89PiBKdXN0KFs1LCAyLjUsIDJdKVxuICogICAgICBSLnRyYXZlcnNlKE1heWJlLm9mLCBzYWZlRGl2KDEwKSwgWzIsIDAsIDVdKTsgLy89PiBOb3RoaW5nXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MyhmdW5jdGlvbiB0cmF2ZXJzZShvZiwgZiwgdHJhdmVyc2FibGUpIHtcbiAgcmV0dXJuIHNlcXVlbmNlKG9mLCBtYXAoZiwgdHJhdmVyc2FibGUpKTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfYXJyYXlGcm9tSXRlcmF0b3IoaXRlcikge1xuICB2YXIgbGlzdCA9IFtdO1xuICB2YXIgbmV4dDtcbiAgd2hpbGUgKCEobmV4dCA9IGl0ZXIubmV4dCgpKS5kb25lKSB7XG4gICAgbGlzdC5wdXNoKG5leHQudmFsdWUpO1xuICB9XG4gIHJldHVybiBsaXN0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2Z1bmN0aW9uTmFtZShmKSB7XG4gIC8vIFN0cmluZyh4ID0+IHgpIGV2YWx1YXRlcyB0byBcInggPT4geFwiLCBzbyB0aGUgcGF0dGVybiBtYXkgbm90IG1hdGNoLlxuICB2YXIgbWF0Y2ggPSBTdHJpbmcoZikubWF0Y2goL15mdW5jdGlvbiAoXFx3KikvKTtcbiAgcmV0dXJuIG1hdGNoID09IG51bGwgPyAnJyA6IG1hdGNoWzFdO1xufTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgaXRzIGFyZ3VtZW50cyBhcmUgaWRlbnRpY2FsLCBmYWxzZSBvdGhlcndpc2UuIFZhbHVlcyBhcmVcbiAqIGlkZW50aWNhbCBpZiB0aGV5IHJlZmVyZW5jZSB0aGUgc2FtZSBtZW1vcnkuIGBOYU5gIGlzIGlkZW50aWNhbCB0byBgTmFOYDtcbiAqIGAwYCBhbmQgYC0wYCBhcmUgbm90IGlkZW50aWNhbC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xNS4wXG4gKiBAY2F0ZWdvcnkgUmVsYXRpb25cbiAqIEBzaWcgYSAtPiBhIC0+IEJvb2xlYW5cbiAqIEBwYXJhbSB7Kn0gYVxuICogQHBhcmFtIHsqfSBiXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBvID0ge307XG4gKiAgICAgIFIuaWRlbnRpY2FsKG8sIG8pOyAvLz0+IHRydWVcbiAqICAgICAgUi5pZGVudGljYWwoMSwgMSk7IC8vPT4gdHJ1ZVxuICogICAgICBSLmlkZW50aWNhbCgxLCAnMScpOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuaWRlbnRpY2FsKFtdLCBbXSk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pZGVudGljYWwoMCwgLTApOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuaWRlbnRpY2FsKE5hTiwgTmFOKTsgLy89PiB0cnVlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBpZGVudGljYWwoYSwgYikge1xuICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gIGlmIChhID09PSBiKSB7IC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICB9IGVsc2Uge1xuICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgcmV0dXJuIGEgIT09IGEgJiYgYiAhPT0gYjtcbiAgfVxufSk7XG4iLCJ2YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MScpO1xuXG5cbi8qKlxuICogR2l2ZXMgYSBzaW5nbGUtd29yZCBzdHJpbmcgZGVzY3JpcHRpb24gb2YgdGhlIChuYXRpdmUpIHR5cGUgb2YgYSB2YWx1ZSxcbiAqIHJldHVybmluZyBzdWNoIGFuc3dlcnMgYXMgJ09iamVjdCcsICdOdW1iZXInLCAnQXJyYXknLCBvciAnTnVsbCcuIERvZXMgbm90XG4gKiBhdHRlbXB0IHRvIGRpc3Rpbmd1aXNoIHVzZXIgT2JqZWN0IHR5cGVzIGFueSBmdXJ0aGVyLCByZXBvcnRpbmcgdGhlbSBhbGwgYXNcbiAqICdPYmplY3QnLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjguMFxuICogQGNhdGVnb3J5IFR5cGVcbiAqIEBzaWcgKCogLT4geyp9KSAtPiBTdHJpbmdcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi50eXBlKHt9KTsgLy89PiBcIk9iamVjdFwiXG4gKiAgICAgIFIudHlwZSgxKTsgLy89PiBcIk51bWJlclwiXG4gKiAgICAgIFIudHlwZShmYWxzZSk7IC8vPT4gXCJCb29sZWFuXCJcbiAqICAgICAgUi50eXBlKCdzJyk7IC8vPT4gXCJTdHJpbmdcIlxuICogICAgICBSLnR5cGUobnVsbCk7IC8vPT4gXCJOdWxsXCJcbiAqICAgICAgUi50eXBlKFtdKTsgLy89PiBcIkFycmF5XCJcbiAqICAgICAgUi50eXBlKC9bQS16XS8pOyAvLz0+IFwiUmVnRXhwXCJcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkxKGZ1bmN0aW9uIHR5cGUodmFsKSB7XG4gIHJldHVybiB2YWwgPT09IG51bGwgICAgICA/ICdOdWxsJyAgICAgIDpcbiAgICAgICAgIHZhbCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOlxuICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkuc2xpY2UoOCwgLTEpO1xufSk7XG4iLCJ2YXIgX2FycmF5RnJvbUl0ZXJhdG9yID0gcmVxdWlyZSgnLi9fYXJyYXlGcm9tSXRlcmF0b3InKTtcbnZhciBfZnVuY3Rpb25OYW1lID0gcmVxdWlyZSgnLi9fZnVuY3Rpb25OYW1lJyk7XG52YXIgX2hhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIGlkZW50aWNhbCA9IHJlcXVpcmUoJy4uL2lkZW50aWNhbCcpO1xudmFyIGtleXMgPSByZXF1aXJlKCcuLi9rZXlzJyk7XG52YXIgdHlwZSA9IHJlcXVpcmUoJy4uL3R5cGUnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9lcXVhbHMoYSwgYiwgc3RhY2tBLCBzdGFja0IpIHtcbiAgaWYgKGlkZW50aWNhbChhLCBiKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGUoYSkgIT09IHR5cGUoYikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYS5lcXVhbHMgPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIGIuZXF1YWxzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyAmJiBhLmVxdWFscyhiKSAmJlxuICAgICAgICAgICB0eXBlb2YgYi5lcXVhbHMgPT09ICdmdW5jdGlvbicgJiYgYi5lcXVhbHMoYSk7XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUoYSkpIHtcbiAgICBjYXNlICdBcmd1bWVudHMnOlxuICAgIGNhc2UgJ0FycmF5JzpcbiAgICBjYXNlICdPYmplY3QnOlxuICAgICAgaWYgKHR5cGVvZiBhLmNvbnN0cnVjdG9yID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgX2Z1bmN0aW9uTmFtZShhLmNvbnN0cnVjdG9yKSA9PT0gJ1Byb21pc2UnKSB7XG4gICAgICAgIHJldHVybiBhID09PSBiO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQm9vbGVhbic6XG4gICAgY2FzZSAnTnVtYmVyJzpcbiAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgaWYgKCEodHlwZW9mIGEgPT09IHR5cGVvZiBiICYmIGlkZW50aWNhbChhLnZhbHVlT2YoKSwgYi52YWx1ZU9mKCkpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdEYXRlJzpcbiAgICAgIGlmICghaWRlbnRpY2FsKGEudmFsdWVPZigpLCBiLnZhbHVlT2YoKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnRXJyb3InOlxuICAgICAgcmV0dXJuIGEubmFtZSA9PT0gYi5uYW1lICYmIGEubWVzc2FnZSA9PT0gYi5tZXNzYWdlO1xuICAgIGNhc2UgJ1JlZ0V4cCc6XG4gICAgICBpZiAoIShhLnNvdXJjZSA9PT0gYi5zb3VyY2UgJiZcbiAgICAgICAgICAgIGEuZ2xvYmFsID09PSBiLmdsb2JhbCAmJlxuICAgICAgICAgICAgYS5pZ25vcmVDYXNlID09PSBiLmlnbm9yZUNhc2UgJiZcbiAgICAgICAgICAgIGEubXVsdGlsaW5lID09PSBiLm11bHRpbGluZSAmJlxuICAgICAgICAgICAgYS5zdGlja3kgPT09IGIuc3RpY2t5ICYmXG4gICAgICAgICAgICBhLnVuaWNvZGUgPT09IGIudW5pY29kZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTWFwJzpcbiAgICBjYXNlICdTZXQnOlxuICAgICAgaWYgKCFfZXF1YWxzKF9hcnJheUZyb21JdGVyYXRvcihhLmVudHJpZXMoKSksIF9hcnJheUZyb21JdGVyYXRvcihiLmVudHJpZXMoKSksIHN0YWNrQSwgc3RhY2tCKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdJbnQ4QXJyYXknOlxuICAgIGNhc2UgJ1VpbnQ4QXJyYXknOlxuICAgIGNhc2UgJ1VpbnQ4Q2xhbXBlZEFycmF5JzpcbiAgICBjYXNlICdJbnQxNkFycmF5JzpcbiAgICBjYXNlICdVaW50MTZBcnJheSc6XG4gICAgY2FzZSAnSW50MzJBcnJheSc6XG4gICAgY2FzZSAnVWludDMyQXJyYXknOlxuICAgIGNhc2UgJ0Zsb2F0MzJBcnJheSc6XG4gICAgY2FzZSAnRmxvYXQ2NEFycmF5JzpcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0FycmF5QnVmZmVyJzpcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyBWYWx1ZXMgb2Ygb3RoZXIgdHlwZXMgYXJlIG9ubHkgZXF1YWwgaWYgaWRlbnRpY2FsLlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGtleXNBID0ga2V5cyhhKTtcbiAgaWYgKGtleXNBLmxlbmd0aCAhPT0ga2V5cyhiKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaWR4ID0gc3RhY2tBLmxlbmd0aCAtIDE7XG4gIHdoaWxlIChpZHggPj0gMCkge1xuICAgIGlmIChzdGFja0FbaWR4XSA9PT0gYSkge1xuICAgICAgcmV0dXJuIHN0YWNrQltpZHhdID09PSBiO1xuICAgIH1cbiAgICBpZHggLT0gMTtcbiAgfVxuXG4gIHN0YWNrQS5wdXNoKGEpO1xuICBzdGFja0IucHVzaChiKTtcbiAgaWR4ID0ga2V5c0EubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgdmFyIGtleSA9IGtleXNBW2lkeF07XG4gICAgaWYgKCEoX2hhcyhrZXksIGIpICYmIF9lcXVhbHMoYltrZXldLCBhW2tleV0sIHN0YWNrQSwgc3RhY2tCKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWR4IC09IDE7XG4gIH1cbiAgc3RhY2tBLnBvcCgpO1xuICBzdGFja0IucG9wKCk7XG4gIHJldHVybiB0cnVlO1xufTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG52YXIgX2VxdWFscyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2VxdWFscycpO1xuXG5cbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgaWYgaXRzIGFyZ3VtZW50cyBhcmUgZXF1aXZhbGVudCwgYGZhbHNlYCBvdGhlcndpc2UuIEhhbmRsZXNcbiAqIGN5Y2xpY2FsIGRhdGEgc3RydWN0dXJlcy5cbiAqXG4gKiBEaXNwYXRjaGVzIHN5bW1ldHJpY2FsbHkgdG8gdGhlIGBlcXVhbHNgIG1ldGhvZHMgb2YgYm90aCBhcmd1bWVudHMsIGlmXG4gKiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE1LjBcbiAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICogQHNpZyBhIC0+IGIgLT4gQm9vbGVhblxuICogQHBhcmFtIHsqfSBhXG4gKiBAcGFyYW0geyp9IGJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5lcXVhbHMoMSwgMSk7IC8vPT4gdHJ1ZVxuICogICAgICBSLmVxdWFscygxLCAnMScpOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuZXF1YWxzKFsxLCAyLCAzXSwgWzEsIDIsIDNdKTsgLy89PiB0cnVlXG4gKlxuICogICAgICB2YXIgYSA9IHt9OyBhLnYgPSBhO1xuICogICAgICB2YXIgYiA9IHt9OyBiLnYgPSBiO1xuICogICAgICBSLmVxdWFscyhhLCBiKTsgLy89PiB0cnVlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICByZXR1cm4gX2VxdWFscyhhLCBiLCBbXSwgW10pO1xufSk7XG4iLCIvKiBAZmxvdyB3ZWFrICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5pbXBvcnQgeyBwdXNoSGlzdG9yeVN0YXRlLCBjcmVhdGVJZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBjdXJyeSwgZXF1YWxzLCB0cmF2ZXJzZSwgaWRlbnRpdHksIHBhdGggfSBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCBFaXRoZXIgZnJvbSBcImRhdGEuZWl0aGVyXCI7XG5cbi8vIFthXSA9PiBFaXRoZXIgU3RyaW5nIFthXVxuY29uc3QgaXNBcnJheSA9IGFyciA9PlxuICBBcnJheS5pc0FycmF5KGFycilcbiAgICA/IEVpdGhlci5SaWdodChhcnIpXG4gICAgOiBFaXRoZXIuTGVmdChgSW52YWxpZCBzdGF0ZXMgc2VudCB3aXRoIGltcG9ydFN0YXRlLiBFeHBlY3RlZCBBcnJheSBidXQgcmVjZWl2ZWQgJHt0eXBlb2YgYXJyfWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1sZW5cblxuY29uc3QgZmllbGRUeXBlSXNWYWxpZCA9IGN1cnJ5KCh2YWxpZFR5cGVzLCBmaWVsZCkgPT5cbiAgdmFsaWRUeXBlcy5maW5kKGVxdWFscyhmaWVsZC50eXBlKSlcbiAgICA/IEVpdGhlci5SaWdodChmaWVsZClcbiAgICA6IEVpdGhlci5MZWZ0KGBJbnZhbGlkIGZpZWxkIHR5cGUgJHtmaWVsZC50eXBlfWApXG4pO1xuXG5jb25zdCB2YWxpZEZpZWxkVHlwZXMgPSBjdXJyeSgodmFsaWRUeXBlcywgZmllbGRzU3RhdGUpID0+XG4gIHRyYXZlcnNlKEVpdGhlci5vZiwgZmllbGRUeXBlSXNWYWxpZCh2YWxpZFR5cGVzKSwgZmllbGRzU3RhdGUpXG4pO1xuXG5cbi8vIFthXSAtPiBbYV0gLT4gRWl0aGVyIFN0cmluZyBbYV1cbmNvbnN0IHZhbGlkYXRlRmllbGRzU3RhdGUgPSBjdXJyeSgoZmllbGRzU3RhdGUsIHN0YXRlKSA9PlxuICBFaXRoZXIub2YoZmllbGRzU3RhdGUpXG4gICAgLmNoYWluKGlzQXJyYXkpXG4gICAgLmNoYWluKHZhbGlkRmllbGRUeXBlcyhzdGF0ZS5maWVsZFR5cGVzLm1hcChwYXRoKFtcImluZm9cIixcInR5cGVcIl0pKSkpXG4pO1xuXG5cbi8vIEFkZCByZXF1aXJlZCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBtYW5hZ2VkIGJ5IHRoZSBmaWVsZFxuLy8gY29tcG9uZW50IGJ1dCBieSB0aGUgRm9ybUJ1aWxkZXIgY29tcG9uZW50IGl0c2VsZiwgc28gbWF5XG4vLyBub3QgYmUgdGhlcmUuXG4vLyBbYV0gPT4gW2FdXG5jb25zdCBhZGRSZXF1aXJlZFByb3BlcnRpZXMgPSBmaWVsZFN0YXRlcyA9PlxuICBmaWVsZFN0YXRlc1xuICAgIC5tYXAocyA9PiBPYmplY3QuYXNzaWduKFxuICAgICAge1xuICAgICAgICBjb25maWdTaG93aW5nOiBmYWxzZSxcbiAgICAgICAgaWQ6IGNyZWF0ZUlkKCksXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIH0sIHNcbiAgICApKTtcblxuXG4vLyBJZiB0aGVyZSBhcmUgYW55IHByb2JsZW1zIHdpdGggdGhlIGltcG9ydCwgdGhlIHNhbWUgc3RhdGVcbi8vIHdpbGwgYmUgcmV0dXJuZWRcbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBuZXdGaWVsZHNTdGF0ZSB9KSA9PlxuICB2YWxpZGF0ZUZpZWxkc1N0YXRlKG5ld0ZpZWxkc1N0YXRlLCBzdGF0ZSlcbiAgICAubWFwKGFkZFJlcXVpcmVkUHJvcGVydGllcylcbiAgICAubWFwKHB1c2hIaXN0b3J5U3RhdGUoc3RhdGUpKVxuICAgIC5iaW1hcChjb25zb2xlLmVycm9yLCBpZGVudGl0eSlcbiAgICAuZ2V0T3JFbHNlKHN0YXRlKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX3JlZHVjZWQoeCkge1xuICByZXR1cm4geCAmJiB4WydAQHRyYW5zZHVjZXIvcmVkdWNlZCddID8geCA6XG4gICAge1xuICAgICAgJ0BAdHJhbnNkdWNlci92YWx1ZSc6IHgsXG4gICAgICAnQEB0cmFuc2R1Y2VyL3JlZHVjZWQnOiB0cnVlXG4gICAgfTtcbn07XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vX2N1cnJ5MicpO1xudmFyIF9yZWR1Y2VkID0gcmVxdWlyZSgnLi9fcmVkdWNlZCcpO1xudmFyIF94ZkJhc2UgPSByZXF1aXJlKCcuL194ZkJhc2UnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gWEZpbmQoZiwgeGYpIHtcbiAgICB0aGlzLnhmID0geGY7XG4gICAgdGhpcy5mID0gZjtcbiAgICB0aGlzLmZvdW5kID0gZmFsc2U7XG4gIH1cbiAgWEZpbmQucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICBYRmluZC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgIGlmICghdGhpcy5mb3VuZCkge1xuICAgICAgcmVzdWx0ID0gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIHZvaWQgMCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ocmVzdWx0KTtcbiAgfTtcbiAgWEZpbmQucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24ocmVzdWx0LCBpbnB1dCkge1xuICAgIGlmICh0aGlzLmYoaW5wdXQpKSB7XG4gICAgICB0aGlzLmZvdW5kID0gdHJ1ZTtcbiAgICAgIHJlc3VsdCA9IF9yZWR1Y2VkKHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCBpbnB1dCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94ZmluZChmLCB4ZikgeyByZXR1cm4gbmV3IFhGaW5kKGYsIHhmKTsgfSk7XG59KCkpO1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfZGlzcGF0Y2hhYmxlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fZGlzcGF0Y2hhYmxlJyk7XG52YXIgX3hmaW5kID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9feGZpbmQnKTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGxpc3Qgd2hpY2ggbWF0Y2hlcyB0aGUgcHJlZGljYXRlLCBvclxuICogYHVuZGVmaW5lZGAgaWYgbm8gZWxlbWVudCBtYXRjaGVzLlxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGBmaW5kYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gYSB8IHVuZGVmaW5lZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB1c2VkIHRvIGRldGVybWluZSBpZiB0aGUgZWxlbWVudCBpcyB0aGVcbiAqICAgICAgICBkZXNpcmVkIG9uZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgZWxlbWVudCBmb3VuZCwgb3IgYHVuZGVmaW5lZGAuXG4gKiBAc2VlIFIudHJhbnNkdWNlXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIHhzID0gW3thOiAxfSwge2E6IDJ9LCB7YTogM31dO1xuICogICAgICBSLmZpbmQoUi5wcm9wRXEoJ2EnLCAyKSkoeHMpOyAvLz0+IHthOiAyfVxuICogICAgICBSLmZpbmQoUi5wcm9wRXEoJ2EnLCA0KSkoeHMpOyAvLz0+IHVuZGVmaW5lZFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZmluZCcsIF94ZmluZCwgZnVuY3Rpb24gZmluZChmbiwgbGlzdCkge1xuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgaWYgKGZuKGxpc3RbaWR4XSkpIHtcbiAgICAgIHJldHVybiBsaXN0W2lkeF07XG4gICAgfVxuICAgIGlkeCArPSAxO1xuICB9XG59KSk7XG4iLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4gKiBBIGhlbHBlciBmb3IgZGVsYXlpbmcgdGhlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uLlxuICogQHByaXZhdGVcbiAqIEBzdW1tYXJ5IChBbnkuLi4gLT4gQW55KSAtPiBWb2lkXG4gKi9cbnZhciBkZWxheWVkID0gdHlwZW9mIHNldEltbWVkaWF0ZSAhPT0gJ3VuZGVmaW5lZCc/ICBzZXRJbW1lZGlhdGVcbiAgICAgICAgICAgIDogdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnPyAgICAgICBwcm9jZXNzLm5leHRUaWNrXG4gICAgICAgICAgICA6IC8qIG90aGVyd2lzZSAqLyAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dFxuXG4vKipcbiAqIEBtb2R1bGUgbGliL3Rhc2tcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBUYXNrO1xuXG4vLyAtLSBJbXBsZW1lbnRhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUaGUgYFRhc2tbzrEsIM6yXWAgc3RydWN0dXJlIHJlcHJlc2VudHMgdmFsdWVzIHRoYXQgZGVwZW5kIG9uIHRpbWUuIFRoaXNcbiAqIGFsbG93cyBvbmUgdG8gbW9kZWwgdGltZS1iYXNlZCBlZmZlY3RzIGV4cGxpY2l0bHksIHN1Y2ggdGhhdCBvbmUgY2FuIGhhdmVcbiAqIGZ1bGwga25vd2xlZGdlIG9mIHdoZW4gdGhleSdyZSBkZWFsaW5nIHdpdGggZGVsYXllZCBjb21wdXRhdGlvbnMsIGxhdGVuY3ksXG4gKiBvciBhbnl0aGluZyB0aGF0IGNhbiBub3QgYmUgY29tcHV0ZWQgaW1tZWRpYXRlbHkuXG4gKlxuICogQSBjb21tb24gdXNlIGZvciB0aGlzIHN0cnVjdHVyZSBpcyB0byByZXBsYWNlIHRoZSB1c3VhbCBDb250aW51YXRpb24tUGFzc2luZ1xuICogU3R5bGUgZm9ybSBvZiBwcm9ncmFtbWluZywgaW4gb3JkZXIgdG8gYmUgYWJsZSB0byBjb21wb3NlIGFuZCBzZXF1ZW5jZVxuICogdGltZS1kZXBlbmRlbnQgZWZmZWN0cyB1c2luZyB0aGUgZ2VuZXJpYyBhbmQgcG93ZXJmdWwgbW9uYWRpYyBvcGVyYXRpb25zLlxuICpcbiAqIEBjbGFzc1xuICogQHN1bW1hcnlcbiAqICgozrEg4oaSIFZvaWQpLCAozrIg4oaSIFZvaWQpIOKGkiBWb2lkKSwgKFZvaWQg4oaSIFZvaWQpIOKGkiBUYXNrW86xLCDOsl1cbiAqXG4gKiBUYXNrW86xLCDOsl0gPDogQ2hhaW5bzrJdXG4gKiAgICAgICAgICAgICAgICwgTW9uYWRbzrJdXG4gKiAgICAgICAgICAgICAgICwgRnVuY3RvclvOsl1cbiAqICAgICAgICAgICAgICAgLCBBcHBsaWNhdGl2ZVvOsl1cbiAqICAgICAgICAgICAgICAgLCBTZW1pZ3JvdXBbzrJdXG4gKiAgICAgICAgICAgICAgICwgTW9ub2lkW86yXVxuICogICAgICAgICAgICAgICAsIFNob3dcbiAqL1xuZnVuY3Rpb24gVGFzayhjb21wdXRhdGlvbiwgY2xlYW51cCkge1xuICB0aGlzLmZvcmsgPSBjb21wdXRhdGlvbjtcblxuICB0aGlzLmNsZWFudXAgPSBjbGVhbnVwIHx8IGZ1bmN0aW9uKCkge307XG59XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgVGFza1vOsSwgzrJdYCBjb250YWluaW5nIHRoZSBzaW5nbGUgdmFsdWUgYM6yYC5cbiAqXG4gKiBgzrJgIGNhbiBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAsIGB1bmRlZmluZWRgLCBvciBhbm90aGVyXG4gKiBgVGFza1vOsSwgzrJdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrIg4oaSIFRhc2tbzrEsIM6yXVxuICovXG5UYXNrLnByb3RvdHlwZS5vZiA9IGZ1bmN0aW9uIF9vZihiKSB7XG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihfLCByZXNvbHZlKSB7XG4gICAgcmV0dXJuIHJlc29sdmUoYik7XG4gIH0pO1xufTtcblxuVGFzay5vZiA9IFRhc2sucHJvdG90eXBlLm9mO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYFRhc2tbzrEsIM6yXWAgY29udGFpbmluZyB0aGUgc2luZ2xlIHZhbHVlIGDOsWAuXG4gKlxuICogYM6xYCBjYW4gYmUgYW55IHZhbHVlLCBpbmNsdWRpbmcgYG51bGxgLCBgdW5kZWZpbmVkYCwgb3IgYW5vdGhlclxuICogYFRhc2tbzrEsIM6yXWAgc3RydWN0dXJlLlxuICpcbiAqIEBzdW1tYXJ5IM6xIOKGkiBUYXNrW86xLCDOsl1cbiAqL1xuVGFzay5wcm90b3R5cGUucmVqZWN0ZWQgPSBmdW5jdGlvbiBfcmVqZWN0ZWQoYSkge1xuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0KSB7XG4gICAgcmV0dXJuIHJlamVjdChhKTtcbiAgfSk7XG59O1xuXG5UYXNrLnJlamVjdGVkID0gVGFzay5wcm90b3R5cGUucmVqZWN0ZWQ7XG5cbi8vIC0tIEZ1bmN0b3IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHN1Y2Nlc3NmdWwgdmFsdWUgb2YgdGhlIGBUYXNrW86xLCDOsl1gIHVzaW5nIGEgcmVndWxhciB1bmFyeVxuICogZnVuY3Rpb24uXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiAozrIg4oaSIM6zKSDihpIgVGFza1vOsSwgzrNdXG4gKi9cblRhc2sucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIF9tYXAoZikge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZWplY3QoYSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIHJlc29sdmUoZihiKSk7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLy8gLS0gQ2hhaW4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgc3VjY2VzZnVsIHZhbHVlIG9mIHRoZSBgVGFza1vOsSwgzrJdYCB1c2luZyBhIGZ1bmN0aW9uIHRvIGFcbiAqIG1vbmFkLlxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCDOsl0gPT4gKM6yIOKGkiBUYXNrW86xLCDOs10pIOKGkiBUYXNrW86xLCDOs11cbiAqL1xuVGFzay5wcm90b3R5cGUuY2hhaW4gPSBmdW5jdGlvbiBfY2hhaW4oZikge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZWplY3QoYSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIGYoYikuZm9yayhyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9LCBjbGVhbnVwKTtcbn07XG5cbi8vIC0tIEFwcGx5IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIEFwcGx5cyB0aGUgc3VjY2Vzc2Z1bCB2YWx1ZSBvZiB0aGUgYFRhc2tbzrEsICjOsiDihpIgzrMpXWAgdG8gdGhlIHN1Y2Nlc3NmdWxcbiAqIHZhbHVlIG9mIHRoZSBgVGFza1vOsSwgzrJdYFxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCAozrIg4oaSIM6zKV0gPT4gVGFza1vOsSwgzrJdIOKGkiBUYXNrW86xLCDOs11cbiAqL1xuXG5UYXNrLnByb3RvdHlwZS5hcCA9IGZ1bmN0aW9uIF9hcCh0aGF0KSB7XG4gIHZhciBmb3JrVGhpcyA9IHRoaXMuZm9yaztcbiAgdmFyIGZvcmtUaGF0ID0gdGhhdC5mb3JrO1xuICB2YXIgY2xlYW51cFRoaXMgPSB0aGlzLmNsZWFudXA7XG4gIHZhciBjbGVhbnVwVGhhdCA9IHRoYXQuY2xlYW51cDtcblxuICBmdW5jdGlvbiBjbGVhbnVwQm90aChzdGF0ZSkge1xuICAgIGNsZWFudXBUaGlzKHN0YXRlWzBdKTtcbiAgICBjbGVhbnVwVGhhdChzdGF0ZVsxXSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlKSB7XG4gICAgdmFyIGZ1bmMsIGZ1bmNMb2FkZWQgPSBmYWxzZTtcbiAgICB2YXIgdmFsLCB2YWxMb2FkZWQgPSBmYWxzZTtcbiAgICB2YXIgcmVqZWN0ZWQgPSBmYWxzZTtcbiAgICB2YXIgYWxsU3RhdGU7XG5cbiAgICB2YXIgdGhpc1N0YXRlID0gZm9ya1RoaXMoZ3VhcmRSZWplY3QsIGd1YXJkUmVzb2x2ZShmdW5jdGlvbih4KSB7XG4gICAgICBmdW5jTG9hZGVkID0gdHJ1ZTtcbiAgICAgIGZ1bmMgPSB4O1xuICAgIH0pKTtcblxuICAgIHZhciB0aGF0U3RhdGUgPSBmb3JrVGhhdChndWFyZFJlamVjdCwgZ3VhcmRSZXNvbHZlKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHZhbExvYWRlZCA9IHRydWU7XG4gICAgICB2YWwgPSB4O1xuICAgIH0pKTtcblxuICAgIGZ1bmN0aW9uIGd1YXJkUmVzb2x2ZShzZXR0ZXIpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldHRlcih4KTtcbiAgICAgICAgaWYgKGZ1bmNMb2FkZWQgJiYgdmFsTG9hZGVkKSB7XG4gICAgICAgICAgZGVsYXllZChmdW5jdGlvbigpeyBjbGVhbnVwQm90aChhbGxTdGF0ZSkgfSk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoZnVuYyh2YWwpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4geDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGd1YXJkUmVqZWN0KHgpIHtcbiAgICAgIGlmICghcmVqZWN0ZWQpIHtcbiAgICAgICAgcmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVqZWN0KHgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhbGxTdGF0ZSA9IFt0aGlzU3RhdGUsIHRoYXRTdGF0ZV07XG4gIH0sIGNsZWFudXBCb3RoKTtcbn07XG5cbi8vIC0tIFNlbWlncm91cCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBTZWxlY3RzIHRoZSBlYXJsaWVyIG9mIHRoZSB0d28gdGFza3MgYFRhc2tbzrEsIM6yXWBcbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+IFRhc2tbzrEsIM6yXSDihpIgVGFza1vOsSwgzrJdXG4gKi9cblxuVGFzay5wcm90b3R5cGUuY29uY2F0ID0gZnVuY3Rpb24gX2NvbmNhdCh0aGF0KSB7XG4gIHZhciBmb3JrVGhpcyA9IHRoaXMuZm9yaztcbiAgdmFyIGZvcmtUaGF0ID0gdGhhdC5mb3JrO1xuICB2YXIgY2xlYW51cFRoaXMgPSB0aGlzLmNsZWFudXA7XG4gIHZhciBjbGVhbnVwVGhhdCA9IHRoYXQuY2xlYW51cDtcblxuICBmdW5jdGlvbiBjbGVhbnVwQm90aChzdGF0ZSkge1xuICAgIGNsZWFudXBUaGlzKHN0YXRlWzBdKTtcbiAgICBjbGVhbnVwVGhhdChzdGF0ZVsxXSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlKSB7XG4gICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICB2YXIgYWxsU3RhdGU7XG4gICAgdmFyIHRoaXNTdGF0ZSA9IGZvcmtUaGlzKGd1YXJkKHJlamVjdCksIGd1YXJkKHJlc29sdmUpKTtcbiAgICB2YXIgdGhhdFN0YXRlID0gZm9ya1RoYXQoZ3VhcmQocmVqZWN0KSwgZ3VhcmQocmVzb2x2ZSkpO1xuXG4gICAgcmV0dXJuIGFsbFN0YXRlID0gW3RoaXNTdGF0ZSwgdGhhdFN0YXRlXTtcblxuICAgIGZ1bmN0aW9uIGd1YXJkKGYpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgIGRlbGF5ZWQoZnVuY3Rpb24oKXsgY2xlYW51cEJvdGgoYWxsU3RhdGUpIH0pXG4gICAgICAgICAgcmV0dXJuIGYoeCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9LCBjbGVhbnVwQm90aCk7XG5cbn07XG5cbi8vIC0tIE1vbm9pZCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBSZXR1cm5zIGEgVGFzayB0aGF0IHdpbGwgbmV2ZXIgcmVzb2x2ZVxuICpcbiAqIEBzdW1tYXJ5IFZvaWQg4oaSIFRhc2tbzrEsIF9dXG4gKi9cblRhc2suZW1wdHkgPSBmdW5jdGlvbiBfZW1wdHkoKSB7XG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbigpIHt9KTtcbn07XG5cblRhc2sucHJvdG90eXBlLmVtcHR5ID0gVGFzay5lbXB0eTtcblxuLy8gLS0gU2hvdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogUmV0dXJucyBhIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGBUYXNrW86xLCDOsl1gXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiBWb2lkIOKGkiBTdHJpbmdcbiAqL1xuVGFzay5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiBfdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnVGFzayc7XG59O1xuXG4vLyAtLSBFeHRyYWN0aW5nIGFuZCByZWNvdmVyaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIGEgZmFpbHVyZSB2YWx1ZSBpbnRvIGEgbmV3IGBUYXNrW86xLCDOsl1gLiBEb2VzIG5vdGhpbmcgaWYgdGhlXG4gKiBzdHJ1Y3R1cmUgYWxyZWFkeSBjb250YWlucyBhIHN1Y2Nlc3NmdWwgdmFsdWUuXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiAozrEg4oaSIFRhc2tbzrMsIM6yXSkg4oaSIFRhc2tbzrMsIM6yXVxuICovXG5UYXNrLnByb3RvdHlwZS5vckVsc2UgPSBmdW5jdGlvbiBfb3JFbHNlKGYpIHtcbiAgdmFyIGZvcmsgPSB0aGlzLmZvcms7XG4gIHZhciBjbGVhbnVwID0gdGhpcy5jbGVhbnVwO1xuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICByZXR1cm4gZm9yayhmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gZihhKS5mb3JrKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIHJlc29sdmUoYik7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLy8gLS0gRm9sZHMgYW5kIGV4dGVuZGVkIHRyYW5zZm9ybWF0aW9ucyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ2F0YW1vcnBoaXNtLiBUYWtlcyB0d28gZnVuY3Rpb25zLCBhcHBsaWVzIHRoZSBsZWZ0bW9zdCBvbmUgdG8gdGhlIGZhaWx1cmVcbiAqIHZhbHVlLCBhbmQgdGhlIHJpZ2h0bW9zdCBvbmUgdG8gdGhlIHN1Y2Nlc3NmdWwgdmFsdWUsIGRlcGVuZGluZyBvbiB3aGljaCBvbmVcbiAqIGlzIHByZXNlbnQuXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiAozrEg4oaSIM6zKSwgKM6yIOKGkiDOsykg4oaSIFRhc2tbzrQsIM6zXVxuICovXG5UYXNrLnByb3RvdHlwZS5mb2xkID0gZnVuY3Rpb24gX2ZvbGQoZiwgZykge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGYoYSkpO1xuICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGcoYikpO1xuICAgIH0pO1xuICB9LCBjbGVhbnVwKTtcbn07XG5cbi8qKlxuICogQ2F0YW1vcnBoaXNtLlxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCDOsl0gPT4geyBSZWplY3RlZDogzrEg4oaSIM6zLCBSZXNvbHZlZDogzrIg4oaSIM6zIH0g4oaSIFRhc2tbzrQsIM6zXVxuICovXG5UYXNrLnByb3RvdHlwZS5jYXRhID0gZnVuY3Rpb24gX2NhdGEocGF0dGVybikge1xuICByZXR1cm4gdGhpcy5mb2xkKHBhdHRlcm4uUmVqZWN0ZWQsIHBhdHRlcm4uUmVzb2x2ZWQpO1xufTtcblxuLyoqXG4gKiBTd2FwcyB0aGUgZGlzanVuY3Rpb24gdmFsdWVzLlxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCDOsl0gPT4gVm9pZCDihpIgVGFza1vOsiwgzrFdXG4gKi9cblRhc2sucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbiBfc3dhcCgpIHtcbiAgdmFyIGZvcmsgPSB0aGlzLmZvcms7XG4gIHZhciBjbGVhbnVwID0gdGhpcy5jbGVhbnVwO1xuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICByZXR1cm4gZm9yayhmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShhKTtcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KGIpO1xuICAgIH0pO1xuICB9LCBjbGVhbnVwKTtcbn07XG5cbi8qKlxuICogTWFwcyBib3RoIHNpZGVzIG9mIHRoZSBkaXNqdW5jdGlvbi5cbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+ICjOsSDihpIgzrMpLCAozrIg4oaSIM60KSDihpIgVGFza1vOsywgzrRdXG4gKi9cblRhc2sucHJvdG90eXBlLmJpbWFwID0gZnVuY3Rpb24gX2JpbWFwKGYsIGcpIHtcbiAgdmFyIGZvcmsgPSB0aGlzLmZvcms7XG4gIHZhciBjbGVhbnVwID0gdGhpcy5jbGVhbnVwO1xuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICByZXR1cm4gZm9yayhmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KGYoYSkpO1xuICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGcoYikpO1xuICAgIH0pO1xuICB9LCBjbGVhbnVwKTtcbn07XG5cbi8qKlxuICogTWFwcyB0aGUgbGVmdCBzaWRlIG9mIHRoZSBkaXNqdW5jdGlvbiAoZmFpbHVyZSkuXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiAozrEg4oaSIM6zKSDihpIgVGFza1vOsywgzrJdXG4gKi9cblRhc2sucHJvdG90eXBlLnJlamVjdGVkTWFwID0gZnVuY3Rpb24gX3JlamVjdGVkTWFwKGYpIHtcbiAgdmFyIGZvcmsgPSB0aGlzLmZvcms7XG4gIHZhciBjbGVhbnVwID0gdGhpcy5jbGVhbnVwO1xuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICByZXR1cm4gZm9yayhmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KGYoYSkpO1xuICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGIpO1xuICAgIH0pO1xuICB9LCBjbGVhbnVwKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vdGFzaycpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuaW1wb3J0IHsgcHJvcCwgZmluZCwgaWRlbnRpdHksIHBpcGUgfSBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCB7IGNyZWF0ZUlkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBFaXRoZXIgZnJvbSBcImRhdGEuZWl0aGVyXCI7XG5pbXBvcnQgVGFzayBmcm9tIFwiZGF0YS50YXNrXCI7XG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gXCJzZWFtbGVzcy1pbW11dGFibGVcIjtcbmltcG9ydCB7IGZpZWxkQ3JlYXRlZCB9IGZyb20gXCIuLi9BY3Rpb25zXCI7XG5cbi8vIFN0YXRlIC0+IFN0cmluZyAtPiBFaXRoZXIgU3RyaW5nIEZ1bmN0aW9uXG5jb25zdCB0eXBlQ29uc3RydWN0b3IgPSAoc3RhdGUsIGZpZWxkVHlwZSkgPT4ge1xuICByZXR1cm4gRWl0aGVyLm9mKHN0YXRlKVxuICAgIC5tYXAocHJvcChcImZpZWxkVHlwZXNcIikpXG4gICAgLm1hcChmaW5kKHYgPT4gdi5pbmZvLnR5cGUgPT09IGZpZWxkVHlwZSkpXG4gICAgLmNoYWluKEVpdGhlci5mcm9tTnVsbGFibGUpXG4gICAgLmJpbWFwKF8gPT4gYEZpZWxkIFwiJHtmaWVsZFR5cGV9XCIgZG9lcyBub3QgZXhpc3QuYCwgaWRlbnRpdHkpO1xufTtcblxuLy8geyBpbml0aWFsU3RhdGU6IEZ1bmN0aW9uIH0gLT4gVGFzayBTdHJpbmcgT2JqZWN0XG5jb25zdCBjcmVhdGVGaWVsZCA9IGNvbnN0ciA9PlxuICBuZXcgVGFzaygocmVqZWN0LCByZXNvbHZlKSA9PiB7XG4gICAgLy8gTWFrZSBzdXJlIHRoZSBwcm9taXNlIGlzIG9ubHkgcmVzb2x2ZWQgb25jZVxuICAgIGxldCBjYWxsZWQgPSBmYWxzZTtcbiAgICBjb25zdCBmaWVsZFN0YXRlID0gY29uc3RyLmluaXRpYWxTdGF0ZSgpO1xuXG4gICAgaWYgKCEoZmllbGRTdGF0ZSBpbnN0YW5jZW9mIFByb21pc2UpKSB7XG4gICAgICByZXNvbHZlKGZpZWxkU3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWVsZFN0YXRlXG4gICAgICAudGhlbih2ID0+IHtcbiAgICAgICAgaWYgKGNhbGxlZCkgeyByZXR1cm47IH1cbiAgICAgICAgY2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZSh2KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2godiA9PiB7XG4gICAgICAgIGlmIChjYWxsZWQpIHsgdGhyb3cgdjsgfVxuICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICByZWplY3Qodik7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuXG4vLyBPYmplY3QgLT4gT2JqZWN0XG5jb25zdCBpbnNlcnRSZXF1aXJlZFByb3BzID0gZmllbGQgPT5cbiAgSW1tdXRhYmxlKGZpZWxkKS5tZXJnZSh7XG4gICAgaWQ6IGNyZWF0ZUlkKCksXG4gICAgY29uZmlnU2hvd2luZzogdHJ1ZSxcbiAgfSwge1xuICAgIGRlZXA6IHRydWUsXG4gIH0pO1xuXG5jb25zdCBjcmVhdGVGaWVsZEFzeW5jaHJvbm91c2x5ID0gKHN0YXRlLCBmaWVsZFR5cGUsIGFzeW5jRGlzcGF0Y2gpID0+XG4gIHR5cGVDb25zdHJ1Y3RvcihzdGF0ZSwgZmllbGRUeXBlKVxuICAubWFwKGNyZWF0ZUZpZWxkKSAvLyBFaXRoZXIgU3RyaW5nIChUYXNrIFN0cmluZyBPYmplY3QpXG4gIC5sZWZ0TWFwKFRhc2sucmVqZWN0ZWQpXG4gIC5tZXJnZSgpIC8vIFRhc2sgU3RyaW5nIE9iamVjdFxuICAubWFwKGluc2VydFJlcXVpcmVkUHJvcHMpXG4gIC5mb3JrKCAvLyBleGVjdXRlIHRhc2tcbiAgICBlcnIgPT4gY29uc29sZS5lcnJvcihcIlRhc2sgcmVqZWN0ZWRcIiwgZXJyKSxcbiAgICBwaXBlKGZpZWxkQ3JlYXRlZCwgYXN5bmNEaXNwYXRjaClcbiAgKTtcblxuLy8gVGhpcyBpcyBhbiBhc3luYyBhY3Rpb24uIFdoZW4gaXQgaXMgZmluaXNoZWQgaXQgd2lsbCB0cmlnZ2VyIHRoZVxuLy8gZmllbGQgY3JlYXRlZCBhY3Rpb25cbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBmaWVsZFR5cGUsIGFzeW5jRGlzcGF0Y2ggfSkgPT4ge1xuICBjcmVhdGVGaWVsZEFzeW5jaHJvbm91c2x5KHN0YXRlLCBmaWVsZFR5cGUsIGFzeW5jRGlzcGF0Y2gpO1xuICByZXR1cm4gc3RhdGU7XG59O1xuIiwidmFyIF9jb25jYXQgPSByZXF1aXJlKCcuL2ludGVybmFsL19jb25jYXQnKTtcbnZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgY29udGVudHMgb2YgdGhlIGdpdmVuIGxpc3QsIGZvbGxvd2VkIGJ5XG4gKiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIGEgLT4gW2FdIC0+IFthXVxuICogQHBhcmFtIHsqfSBlbCBUaGUgZWxlbWVudCB0byBhZGQgdG8gdGhlIGVuZCBvZiB0aGUgbmV3IGxpc3QuXG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHdob3NlIGNvbnRlbnRzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgb3V0cHV0XG4gKiAgICAgICAgbGlzdC5cbiAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBvbGQgbGlzdCBmb2xsb3dlZCBieSBgZWxgLlxuICogQHNlZSBSLnByZXBlbmRcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmFwcGVuZCgndGVzdHMnLCBbJ3dyaXRlJywgJ21vcmUnXSk7IC8vPT4gWyd3cml0ZScsICdtb3JlJywgJ3Rlc3RzJ11cbiAqICAgICAgUi5hcHBlbmQoJ3Rlc3RzJywgW10pOyAvLz0+IFsndGVzdHMnXVxuICogICAgICBSLmFwcGVuZChbJ3Rlc3RzJ10sIFsnd3JpdGUnLCAnbW9yZSddKTsgLy89PiBbJ3dyaXRlJywgJ21vcmUnLCBbJ3Rlc3RzJ11dXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBhcHBlbmQoZWwsIGxpc3QpIHtcbiAgcmV0dXJuIF9jb25jYXQobGlzdCwgW2VsXSk7XG59KTtcbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMy0yMDE0IFF1aWxkcmVlbiBNb3R0YSA8cXVpbGRyZWVuQGdtYWlsLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuLy8gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbi8vICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbi8vIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4vLyBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuLy8gYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbi8vIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4vLyBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuLy8gRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuLy8gTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuLy8gTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLyoqXG4gKiBAbW9kdWxlIGxpYi9tYXliZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IE1heWJlXG5cbi8vIC0tIEFsaWFzZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNsb25lICAgICAgICAgPSBPYmplY3QuY3JlYXRlXG52YXIgdW5pbXBsZW1lbnRlZCA9IGZ1bmN0aW9uKCl7IHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkLicpIH1cbnZhciBub29wICAgICAgICAgID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXMgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4vLyAtLSBJbXBsZW1lbnRhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBBIHN0cnVjdHVyZSBmb3IgdmFsdWVzIHRoYXQgbWF5IG5vdCBiZSBwcmVzZW50LCBvciBjb21wdXRhdGlvbnMgdGhhdCBtYXlcbiAqIGZhaWwuIGBNYXliZShhKWAgZXhwbGljaXRseSBtb2RlbHMgdGhlIGVmZmVjdHMgdGhhdCBhcmUgaW1wbGljaXQgaW5cbiAqIGBOdWxsYWJsZWAgdHlwZXMsIHRodXMgaGFzIG5vbmUgb2YgdGhlIHByb2JsZW1zIGFzc29jaWF0ZWQgd2l0aFxuICogYG51bGxgIG9yIGB1bmRlZmluZWRgIOKAlCBsaWtlIGBOdWxsUG9pbnRlckV4Y2VwdGlvbnNgLlxuICpcbiAqIFRoZSBjbGFzcyBtb2RlbHMgdHdvIGRpZmZlcmVudCBjYXNlczpcbiAqXG4gKiAgKyBgSnVzdCBhYCDigJQgcmVwcmVzZW50cyBhIGBNYXliZShhKWAgdGhhdCBjb250YWlucyBhIHZhbHVlLiBgYWAgbWF5XG4gKiAgICAgYmUgYW55IHZhbHVlLCBpbmNsdWRpbmcgYG51bGxgIG9yIGB1bmRlZmluZWRgLlxuICpcbiAqICArIGBOb3RoaW5nYCDigJQgcmVwcmVzZW50cyBhIGBNYXliZShhKWAgdGhhdCBoYXMgbm8gdmFsdWVzLiBPciBhXG4gKiAgICAgZmFpbHVyZSB0aGF0IG5lZWRzIG5vIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKlxuICogQ29tbW9uIHVzZXMgb2YgdGhpcyBzdHJ1Y3R1cmUgaW5jbHVkZXMgbW9kZWxsaW5nIHZhbHVlcyB0aGF0IG1heSBvciBtYXlcbiAqIG5vdCBiZSBwcmVzZW50IGluIGEgY29sbGVjdGlvbiwgdGh1cyBpbnN0ZWFkIG9mIG5lZWRpbmcgYVxuICogYGNvbGxlY3Rpb24uaGFzKGEpYCwgdGhlIGBjb2xsZWN0aW9uLmdldChhKWAgb3BlcmF0aW9uIGdpdmVzIHlvdSBhbGxcbiAqIHRoZSBpbmZvcm1hdGlvbiB5b3UgbmVlZCDigJQgYGNvbGxlY3Rpb24uZ2V0KGEpLmlzLW5vdGhpbmdgIGJlaW5nXG4gKiBlcXVpdmFsZW50IHRvIGBjb2xsZWN0aW9uLmhhcyhhKWA7IFNpbWlsYXJseSB0aGUgc2FtZSByZWFzb25pbmcgbWF5XG4gKiBiZSBhcHBsaWVkIHRvIGNvbXB1dGF0aW9ucyB0aGF0IG1heSBmYWlsIHRvIHByb3ZpZGUgYSB2YWx1ZSwgZS5nLjpcbiAqIGBjb2xsZWN0aW9uLmZpbmQocHJlZGljYXRlKWAgY2FuIHNhZmVseSByZXR1cm4gYSBgTWF5YmUoYSlgIGluc3RhbmNlLFxuICogZXZlbiBpZiB0aGUgY29sbGVjdGlvbiBjb250YWlucyBudWxsYWJsZSB2YWx1ZXMuXG4gKlxuICogRnVydGhlcm1vcmUsIHRoZSB2YWx1ZXMgb2YgYE1heWJlKGEpYCBjYW4gYmUgY29tYmluZWQgYW5kIG1hbmlwdWxhdGVkXG4gKiBieSB1c2luZyB0aGUgZXhwcmVzc2l2ZSBtb25hZGljIG9wZXJhdGlvbnMuIFRoaXMgYWxsb3dzIHNhZmVseVxuICogc2VxdWVuY2luZyBvcGVyYXRpb25zIHRoYXQgbWF5IGZhaWwsIGFuZCBzYWZlbHkgY29tcG9zaW5nIHZhbHVlcyB0aGF0XG4gKiB5b3UgZG9uJ3Qga25vdyB3aGV0aGVyIHRoZXkncmUgcHJlc2VudCBvciBub3QsIGZhaWxpbmcgZWFybHlcbiAqIChyZXR1cm5pbmcgYSBgTm90aGluZ2ApIGlmIGFueSBvZiB0aGUgb3BlcmF0aW9ucyBmYWlsLlxuICpcbiAqIElmIG9uZSB3YW50cyB0byBzdG9yZSBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIGFib3V0IGZhaWx1cmVzLCB0aGVcbiAqIFtFaXRoZXJdW10gYW5kIFtWYWxpZGF0aW9uXVtdIHN0cnVjdHVyZXMgcHJvdmlkZSBzdWNoIGEgY2FwYWJpbGl0eSwgYW5kXG4gKiBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkIG9mIHRoZSBgTWF5YmUoYSlgIHN0cnVjdHVyZS5cbiAqXG4gKiBbRWl0aGVyXTogaHR0cHM6Ly9naXRodWIuY29tL2ZvbGt0YWxlL2RhdGEuZWl0aGVyXG4gKiBbVmFsaWRhdGlvbl06IGh0dHBzOi8vZ2l0aHViLmNvbS9mb2xrdGFsZS9kYXRhLnZhbGlkYXRpb25cbiAqXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIE1heWJlKCkge31cblxuLy8gVGhlIGNhc2UgZm9yIHN1Y2Nlc3NmdWwgdmFsdWVzXG5KdXN0LnByb3RvdHlwZSA9IGNsb25lKE1heWJlLnByb3RvdHlwZSlcbmZ1bmN0aW9uIEp1c3QoYSl7XG4gIHRoaXMudmFsdWUgPSBhXG59XG5cbi8vIFRoZSBjYXNlIGZvciBmYWlsdXJlIHZhbHVlc1xuTm90aGluZy5wcm90b3R5cGUgPSBjbG9uZShNYXliZS5wcm90b3R5cGUpXG5mdW5jdGlvbiBOb3RoaW5nKCl7fVxuXG5cbi8vIC0tIENvbnN0cnVjdG9ycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYE1heWJlW86xXWAgc3RydWN0dXJlIHdpdGggYW4gYWJzZW50IHZhbHVlLiBDb21tb25seSB1c2VkXG4gKiB0byByZXByZXNlbnQgYSBmYWlsdXJlLlxuICpcbiAqIEBzdW1tYXJ5IFZvaWQg4oaSIE1heWJlW86xXVxuICovXG5NYXliZS5Ob3RoaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgTm90aGluZ1xufVxuTWF5YmUucHJvdG90eXBlLk5vdGhpbmcgPSBNYXliZS5Ob3RoaW5nXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgdGhhdCBob2xkcyB0aGUgc2luZ2xlIHZhbHVlXG4gKiBgzrFgLiBDb21tb25seSB1c2VkIHRvIHJlcHJlc2VudCBhIHN1Y2Nlc3MuXG4gKlxuICogYM6xYCBjYW4gYmUgYW55IHZhbHVlLCBpbmNsdWRpbmcgYG51bGxgLCBgdW5kZWZpbmVkYCBvciBhbm90aGVyXG4gKiBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrEg4oaSIE1heWJlW86xXVxuICovXG5NYXliZS5KdXN0ID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gbmV3IEp1c3QoYSlcbn1cbk1heWJlLnByb3RvdHlwZS5KdXN0ID0gTWF5YmUuSnVzdFxuXG5cbi8vIC0tIENvbnZlcnNpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYE1heWJlW86xXWAgc3RydWN0dXJlIGZyb20gYSBudWxsYWJsZSB0eXBlLlxuICpcbiAqIElmIHRoZSB2YWx1ZSBpcyBlaXRoZXIgYG51bGxgIG9yIGB1bmRlZmluZWRgLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgYVxuICogYE5vdGhpbmdgLCBvdGhlcndpc2UgdGhlIHZhbHVlIGlzIHdyYXBwZWQgaW4gYSBgSnVzdCjOsSlgLlxuICpcbiAqIEBzdW1tYXJ5IM6xIOKGkiBNYXliZVvOsV1cbiAqL1xuTWF5YmUuZnJvbU51bGxhYmxlID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYSAhPSBudWxsPyAgICAgICBuZXcgSnVzdChhKVxuICA6ICAgICAgLyogb3RoZXJ3aXNlICovICBuZXcgTm90aGluZ1xufVxuTWF5YmUucHJvdG90eXBlLmZyb21OdWxsYWJsZSA9IE1heWJlLmZyb21OdWxsYWJsZVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYE1heWJlW86yXWAgc3RydWN0dXJlIGZyb20gYW4gYEVpdGhlclvOsSwgzrJdYCB0eXBlLlxuICpcbiAqIFRoZSBsZWZ0IHNpZGUgb2YgdGhlIGBFaXRoZXJgIGJlY29tZXMgYE5vdGhpbmdgLCBhbmQgdGhlIHJpZ2h0IHNpZGVcbiAqIGlzIHdyYXBwZWQgaW4gYSBgSnVzdCjOsilgLlxuICpcbiAqIEBzdW1tYXJ5IEVpdGhlclvOsSwgzrJdIOKGkiBNYXliZVvOsl1cbiAqL1xuTWF5YmUuZnJvbUVpdGhlciA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGEuZm9sZChNYXliZS5Ob3RoaW5nLCBNYXliZS5KdXN0KVxufVxuTWF5YmUucHJvdG90eXBlLmZyb21FaXRoZXIgPSBNYXliZS5mcm9tRWl0aGVyXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgTWF5YmVbzrJdYCBzdHJ1Y3R1cmUgZnJvbSBhIGBWYWxpZGF0aW9uW86xLCDOsl1gIHR5cGUuXG4gKlxuICogVGhlIGZhaWx1cmUgc2lkZSBvZiB0aGUgYFZhbGlkYXRpb25gIGJlY29tZXMgYE5vdGhpbmdgLCBhbmQgdGhlIHJpZ2h0XG4gKiBzaWRlIGlzIHdyYXBwZWQgaW4gYSBgSnVzdCjOsilgLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IFZhbGlkYXRpb25bzrEsIM6yXSDihpIgTWF5YmVbzrJdXG4gKi9cbk1heWJlLmZyb21WYWxpZGF0aW9uICAgICAgICAgICA9IE1heWJlLmZyb21FaXRoZXJcbk1heWJlLnByb3RvdHlwZS5mcm9tVmFsaWRhdGlvbiA9IE1heWJlLmZyb21FaXRoZXJcblxuXG4vLyAtLSBQcmVkaWNhdGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcnVlIGlmIHRoZSBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgY29udGFpbnMgYSBmYWlsdXJlIChpLmUuOiBgTm90aGluZ2ApLlxuICpcbiAqIEBzdW1tYXJ5IEJvb2xlYW5cbiAqL1xuTWF5YmUucHJvdG90eXBlLmlzTm90aGluZyAgID0gZmFsc2Vcbk5vdGhpbmcucHJvdG90eXBlLmlzTm90aGluZyA9IHRydWVcblxuXG4vKipcbiAqIFRydWUgaWYgdGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZSBjb250YWlucyBhIHNpbmdsZSB2YWx1ZSAoaS5lLjogYEp1c3QozrEpYCkuXG4gKlxuICogQHN1bW1hcnkgQm9vbGVhblxuICovXG5NYXliZS5wcm90b3R5cGUuaXNKdXN0ID0gZmFsc2Vcbkp1c3QucHJvdG90eXBlLmlzSnVzdCAgPSB0cnVlXG5cblxuLy8gLS0gQXBwbGljYXRpdmUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgaG9sZGluZyB0aGUgc2luZ2xlIHZhbHVlIGDOsWAuXG4gKlxuICogYM6xYCBjYW4gYmUgYW55IHZhbHVlLCBpbmNsdWRpbmcgYG51bGxgLCBgdW5kZWZpbmVkYCwgb3IgYW5vdGhlclxuICogYE1heWJlW86xXWAgc3RydWN0dXJlLlxuICpcbiAqIEBzdW1tYXJ5IM6xIOKGkiBNYXliZVvOsV1cbiAqL1xuTWF5YmUub2YgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBuZXcgSnVzdChhKVxufVxuTWF5YmUucHJvdG90eXBlLm9mID0gTWF5YmUub2ZcblxuXG4vKipcbiAqIEFwcGxpZXMgdGhlIGZ1bmN0aW9uIGluc2lkZSB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlIHRvIGFub3RoZXJcbiAqIGFwcGxpY2F0aXZlIHR5cGUuXG4gKlxuICogVGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZSBzaG91bGQgY29udGFpbiBhIGZ1bmN0aW9uIHZhbHVlLCBvdGhlcndpc2UgYVxuICogYFR5cGVFcnJvcmAgaXMgdGhyb3duLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChATWF5YmVbzrEg4oaSIM6yXSwgZjpBcHBsaWNhdGl2ZVtfXSkgPT4gZlvOsV0g4oaSIGZbzrJdXG4gKi9cbk1heWJlLnByb3RvdHlwZS5hcCA9IHVuaW1wbGVtZW50ZWRcblxuTm90aGluZy5wcm90b3R5cGUuYXAgPSBub29wXG5cbkp1c3QucHJvdG90eXBlLmFwID0gZnVuY3Rpb24oYikge1xuICByZXR1cm4gYi5tYXAodGhpcy52YWx1ZSlcbn1cblxuXG5cblxuLy8gLS0gRnVuY3RvciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgdmFsdWUgb2YgdGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZSB1c2luZyBhIHJlZ3VsYXIgdW5hcnlcbiAqIGZ1bmN0aW9uLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gKM6xIOKGkiDOsikg4oaSIE1heWJlW86yXVxuICovXG5NYXliZS5wcm90b3R5cGUubWFwICAgPSB1bmltcGxlbWVudGVkXG5Ob3RoaW5nLnByb3RvdHlwZS5tYXAgPSBub29wXG5cbkp1c3QucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIHRoaXMub2YoZih0aGlzLnZhbHVlKSlcbn1cblxuXG4vLyAtLSBDaGFpbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2YWx1ZSBvZiB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlIHVzaW5nIGFuIHVuYXJ5IGZ1bmN0aW9uXG4gKiB0byBtb25hZHMuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBNYXliZVvOsV0sIG06TW9uYWRbX10pID0+ICjOsSDihpIgbVvOsl0pIOKGkiBtW86yXVxuICovXG5NYXliZS5wcm90b3R5cGUuY2hhaW4gICA9IHVuaW1wbGVtZW50ZWRcbk5vdGhpbmcucHJvdG90eXBlLmNoYWluID0gbm9vcFxuXG5KdXN0LnByb3RvdHlwZS5jaGFpbiA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGYodGhpcy52YWx1ZSlcbn1cblxuXG4vLyAtLSBTaG93IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gVm9pZCDihpIgU3RyaW5nXG4gKi9cbk1heWJlLnByb3RvdHlwZS50b1N0cmluZyA9IHVuaW1wbGVtZW50ZWRcblxuTm90aGluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdNYXliZS5Ob3RoaW5nJ1xufVxuXG5KdXN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ01heWJlLkp1c3QoJyArIHRoaXMudmFsdWUgKyAnKSdcbn1cblxuXG4vLyAtLSBFcSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUZXN0cyBpZiBhIGBNYXliZVvOsV1gIHN0cnVjdHVyZSBpcyBlcXVhbCB0byBhbm90aGVyIGBNYXliZVvOsV1gIHN0cnVjdHVyZS5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSBATWF5YmVbzrFdID0+IE1heWJlW86xXSDihpIgQm9vbGVhblxuICovXG5NYXliZS5wcm90b3R5cGUuaXNFcXVhbCA9IHVuaW1wbGVtZW50ZWRcblxuTm90aGluZy5wcm90b3R5cGUuaXNFcXVhbCA9IGZ1bmN0aW9uKGIpIHtcbiAgcmV0dXJuIGIuaXNOb3RoaW5nXG59XG5cbkp1c3QucHJvdG90eXBlLmlzRXF1YWwgPSBmdW5jdGlvbihiKSB7XG4gIHJldHVybiBiLmlzSnVzdFxuICAmJiAgICAgYi52YWx1ZSA9PT0gdGhpcy52YWx1ZVxufVxuXG5cbi8vIC0tIEV4dHJhY3RpbmcgYW5kIHJlY292ZXJpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSB2YWx1ZSBvdXQgb2YgdGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZSwgaWYgaXRcbiAqIGV4aXN0cy4gT3RoZXJ3aXNlIHRocm93cyBhIGBUeXBlRXJyb3JgLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gVm9pZCDihpIgYSwgICAgICA6OiBwYXJ0aWFsLCB0aHJvd3NcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpsaWIvbWF5YmV+TWF5YmUjZ2V0T3JFbHNlfSDigJQgQSBnZXR0ZXIgdGhhdCBjYW4gaGFuZGxlIGZhaWx1cmVzXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IGlmIHRoZSBzdHJ1Y3R1cmUgaGFzIG5vIHZhbHVlIChgTm90aGluZ2ApLlxuICovXG5NYXliZS5wcm90b3R5cGUuZ2V0ID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbid0IGV4dHJhY3QgdGhlIHZhbHVlIG9mIGEgTm90aGluZy5cIilcbn1cblxuSnVzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnZhbHVlXG59XG5cblxuLyoqXG4gKiBFeHRyYWN0cyB0aGUgdmFsdWUgb3V0IG9mIHRoZSBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUuIElmIHRoZXJlIGlzIG5vIHZhbHVlLFxuICogcmV0dXJucyB0aGUgZ2l2ZW4gZGVmYXVsdC5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSBATWF5YmVbzrFdID0+IM6xIOKGkiDOsVxuICovXG5NYXliZS5wcm90b3R5cGUuZ2V0T3JFbHNlID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5nZXRPckVsc2UgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBhXG59XG5cbkp1c3QucHJvdG90eXBlLmdldE9yRWxzZSA9IGZ1bmN0aW9uKF8pIHtcbiAgcmV0dXJuIHRoaXMudmFsdWVcbn1cblxuXG4vKipcbiAqIFRyYW5zZm9ybXMgYSBmYWlsdXJlIGludG8gYSBuZXcgYE1heWJlW86xXWAgc3RydWN0dXJlLiBEb2VzIG5vdGhpbmcgaWYgdGhlXG4gKiBzdHJ1Y3R1cmUgYWxyZWFkeSBjb250YWlucyBhIHZhbHVlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gKFZvaWQg4oaSIE1heWJlW86xXSkg4oaSIE1heWJlW86xXVxuICovXG5NYXliZS5wcm90b3R5cGUub3JFbHNlID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5vckVsc2UgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBmKClcbn1cblxuSnVzdC5wcm90b3R5cGUub3JFbHNlID0gZnVuY3Rpb24oXykge1xuICByZXR1cm4gdGhpc1xufVxuXG5cbi8qKlxuICogQ2F0YW1vcnBoaXNtLlxuICogXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSBATWF5YmVbzrFdID0+IHsgTm90aGluZzogVm9pZCDihpIgzrIsIEp1c3Q6IM6xIOKGkiDOsiB9IOKGkiDOslxuICovXG5NYXliZS5wcm90b3R5cGUuY2F0YSA9IHVuaW1wbGVtZW50ZWRcblxuTm90aGluZy5wcm90b3R5cGUuY2F0YSA9IGZ1bmN0aW9uKHBhdHRlcm4pIHtcbiAgcmV0dXJuIHBhdHRlcm4uTm90aGluZygpXG59XG5cbkp1c3QucHJvdG90eXBlLmNhdGEgPSBmdW5jdGlvbihwYXR0ZXJuKSB7XG4gIHJldHVybiBwYXR0ZXJuLkp1c3QodGhpcy52YWx1ZSk7XG59XG5cblxuLyoqXG4gKiBKU09OIHNlcmlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSBATWF5YmVbzrFdID0+IFZvaWQg4oaSIE9iamVjdFxuICovXG5NYXliZS5wcm90b3R5cGUudG9KU09OID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHsgJyN0eXBlJzogJ2ZvbGt0YWxlOk1heWJlLk5vdGhpbmcnIH1cbn1cblxuSnVzdC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7ICcjdHlwZSc6ICdmb2xrdGFsZTpNYXliZS5KdXN0J1xuICAgICAgICAgLCB2YWx1ZTogdGhpcy52YWx1ZSB9XG59XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNCBRdWlsZHJlZW4gTW90dGEgPHF1aWxkcmVlbkBnbWFpbC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbi8vIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4vLyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4vLyBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuLy8gcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbi8vIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4vLyBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuLy8gaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbi8vIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbi8vIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbi8vIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbi8vIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tYXliZScpIiwiaW1wb3J0IHsgY3VycnksIHBpcGUsIHByb3AsIG92ZXIsIGFwcGVuZCB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IHsgaGlkZUNvbmZpZ3MsIFN0YXRlTGVuc2VzLCBwdXNoSGlzdG9yeVN0YXRlIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBNYXliZSBmcm9tIFwiZGF0YS5tYXliZVwiO1xuXG4vLyBTdGF0ZSAtPiBPYmplY3QgLT4gU3RhdGVcbmNvbnN0IGhpc3RvcnlTdGF0ZVdpdGhOZXdGaWVsZCA9IGN1cnJ5KChzdGF0ZSwgbmV3RmllbGQpID0+IHBpcGUoXG4gIGhpZGVDb25maWdzLFxuICBvdmVyKFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlLCBhcHBlbmQobmV3RmllbGQpKVxuKShzdGF0ZSkpO1xuXG5leHBvcnQgZGVmYXVsdCAoc3RhdGUsIHsgY3JlYXRlZEZpZWxkU3RhdGUgfSkgPT5cbiAgTWF5YmUuZnJvbU51bGxhYmxlKGNyZWF0ZWRGaWVsZFN0YXRlKVxuICAubWFwKGhpc3RvcnlTdGF0ZVdpdGhOZXdGaWVsZChzdGF0ZSkpXG4gIC5tYXAocHJvcChcImZpZWxkc1N0YXRlXCIpKVxuICAubWFwKHB1c2hIaXN0b3J5U3RhdGUoc3RhdGUpKVxuICAuZ2V0T3JFbHNlKHN0YXRlKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmltcG9ydCB7IGN1cnJ5IH0gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgTWF5YmUgZnJvbSBcImRhdGEubWF5YmVcIjtcbmltcG9ydCBJbW11dGFibGUgZnJvbSBcInNlYW1sZXNzLWltbXV0YWJsZVwiO1xuaW1wb3J0IHsgcHVzaEhpc3RvcnlTdGF0ZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmNvbnN0IHRvZ2dsZUNvbmZpZyA9IGZpZWxkU3RhdGUgPT5cbiAgSW1tdXRhYmxlKGZpZWxkU3RhdGUpLnNldChcImNvbmZpZ1Nob3dpbmdcIiwgIWZpZWxkU3RhdGUuY29uZmlnU2hvd2luZyk7XG5cbmNvbnN0IHJlcGxhY2VGaWVsZFN0YXRlID0gY3VycnkoKHN0YXRlLCBmaWVsZFN0YXRlKSA9PlxuICBzdGF0ZVxuICAgIC5maWVsZHNTdGF0ZVxuICAgIC5tYXAoYUZpZWxkID0+IGFGaWVsZC5pZCA9PT0gZmllbGRTdGF0ZS5pZFxuICAgICAgPyBmaWVsZFN0YXRlXG4gICAgICA6IGFGaWVsZFxuICAgIClcbik7XG5cbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBmaWVsZFN0YXRlIH0pID0+XG4gIE1heWJlLmZyb21OdWxsYWJsZShmaWVsZFN0YXRlKVxuICAubWFwKHRvZ2dsZUNvbmZpZylcbiAgLm1hcChyZXBsYWNlRmllbGRTdGF0ZShzdGF0ZSkpXG4gIC5tYXAocHVzaEhpc3RvcnlTdGF0ZShzdGF0ZSkpXG4gIC5nZXRPckVsc2Uoc3RhdGUpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuaW1wb3J0IHsgY3VycnkgfSBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCBNYXliZSBmcm9tIFwiZGF0YS5tYXliZVwiO1xuaW1wb3J0IEltbXV0YWJsZSBmcm9tIFwic2VhbWxlc3MtaW1tdXRhYmxlXCI7XG5pbXBvcnQgeyBwdXNoSGlzdG9yeVN0YXRlIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuY29uc3QgdG9nZ2xlUmVxdWlyZWQgPSBmaWVsZFN0YXRlID0+XG4gIEltbXV0YWJsZShmaWVsZFN0YXRlKS5zZXQoXCJyZXF1aXJlZFwiLCAhZmllbGRTdGF0ZS5yZXF1aXJlZCk7XG5cbmNvbnN0IHJlcGxhY2VGaWVsZFN0YXRlID0gY3VycnkoKHN0YXRlLCBmaWVsZFN0YXRlKSA9PlxuICBzdGF0ZVxuICAgIC5maWVsZHNTdGF0ZVxuICAgIC5tYXAoYUZpZWxkID0+IGFGaWVsZC5pZCA9PT0gZmllbGRTdGF0ZS5pZFxuICAgICAgPyBmaWVsZFN0YXRlXG4gICAgICA6IGFGaWVsZFxuICAgIClcbik7XG5cbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBmaWVsZFN0YXRlIH0pID0+XG4gIE1heWJlLmZyb21OdWxsYWJsZShmaWVsZFN0YXRlKVxuICAubWFwKHRvZ2dsZVJlcXVpcmVkKVxuICAubWFwKHJlcGxhY2VGaWVsZFN0YXRlKHN0YXRlKSlcbiAgLm1hcChwdXNoSGlzdG9yeVN0YXRlKHN0YXRlKSlcbiAgLmdldE9yRWxzZShzdGF0ZSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9maWx0ZXIoZm4sIGxpc3QpIHtcbiAgdmFyIGlkeCA9IDA7XG4gIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICBpZiAoZm4obGlzdFtpZHhdKSkge1xuICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gbGlzdFtpZHhdO1xuICAgIH1cbiAgICBpZHggKz0gMTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2lzT2JqZWN0KHgpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59O1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL19jdXJyeTInKTtcbnZhciBfeGZCYXNlID0gcmVxdWlyZSgnLi9feGZCYXNlJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFhGaWx0ZXIoZiwgeGYpIHtcbiAgICB0aGlzLnhmID0geGY7XG4gICAgdGhpcy5mID0gZjtcbiAgfVxuICBYRmlsdGVyLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgWEZpbHRlci5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IF94ZkJhc2UucmVzdWx0O1xuICBYRmlsdGVyLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy5mKGlucHV0KSA/IHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCBpbnB1dCkgOiByZXN1bHQ7XG4gIH07XG5cbiAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3hmaWx0ZXIoZiwgeGYpIHsgcmV0dXJuIG5ldyBYRmlsdGVyKGYsIHhmKTsgfSk7XG59KCkpO1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfZGlzcGF0Y2hhYmxlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fZGlzcGF0Y2hhYmxlJyk7XG52YXIgX2ZpbHRlciA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2ZpbHRlcicpO1xudmFyIF9pc09iamVjdCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2lzT2JqZWN0Jyk7XG52YXIgX3JlZHVjZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX3JlZHVjZScpO1xudmFyIF94ZmlsdGVyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9feGZpbHRlcicpO1xudmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuXG4vKipcbiAqIFRha2VzIGEgcHJlZGljYXRlIGFuZCBhIFwiZmlsdGVyYWJsZVwiLCBhbmQgcmV0dXJucyBhIG5ldyBmaWx0ZXJhYmxlIG9mIHRoZVxuICogc2FtZSB0eXBlIGNvbnRhaW5pbmcgdGhlIG1lbWJlcnMgb2YgdGhlIGdpdmVuIGZpbHRlcmFibGUgd2hpY2ggc2F0aXNmeSB0aGVcbiAqIGdpdmVuIHByZWRpY2F0ZS5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgZmlsdGVyYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyBGaWx0ZXJhYmxlIGYgPT4gKGEgLT4gQm9vbGVhbikgLT4gZiBhIC0+IGYgYVxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZFxuICogQHBhcmFtIHtBcnJheX0gZmlsdGVyYWJsZVxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAc2VlIFIucmVqZWN0LCBSLnRyYW5zZHVjZSwgUi5hZGRJbmRleFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBpc0V2ZW4gPSBuID0+IG4gJSAyID09PSAwO1xuICpcbiAqICAgICAgUi5maWx0ZXIoaXNFdmVuLCBbMSwgMiwgMywgNF0pOyAvLz0+IFsyLCA0XVxuICpcbiAqICAgICAgUi5maWx0ZXIoaXNFdmVuLCB7YTogMSwgYjogMiwgYzogMywgZDogNH0pOyAvLz0+IHtiOiAyLCBkOiA0fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZmlsdGVyJywgX3hmaWx0ZXIsIGZ1bmN0aW9uKHByZWQsIGZpbHRlcmFibGUpIHtcbiAgcmV0dXJuIChcbiAgICBfaXNPYmplY3QoZmlsdGVyYWJsZSkgP1xuICAgICAgX3JlZHVjZShmdW5jdGlvbihhY2MsIGtleSkge1xuICAgICAgICBpZiAocHJlZChmaWx0ZXJhYmxlW2tleV0pKSB7XG4gICAgICAgICAgYWNjW2tleV0gPSBmaWx0ZXJhYmxlW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9LCBrZXlzKGZpbHRlcmFibGUpKSA6XG4gICAgLy8gZWxzZVxuICAgICAgX2ZpbHRlcihwcmVkLCBmaWx0ZXJhYmxlKVxuICApO1xufSkpO1xuIiwiaW1wb3J0IHsgY3VycnksIHByb3AsIG92ZXIsIGZpbHRlciB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IHsgU3RhdGVMZW5zZXMsIHB1c2hIaXN0b3J5U3RhdGUgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IE1heWJlIGZyb20gXCJkYXRhLm1heWJlXCI7XG5cbi8vIFN0YXRlIC0+IE9iamVjdCAtPiBTdGF0ZVxuY29uc3QgaGlzdG9yeVN0YXRlV2l0aG91dEZpZWxkID0gY3VycnkoKHN0YXRlLCBmaWVsZFN0YXRlKSA9PlxuICBvdmVyKFxuICAgIFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlLFxuICAgIGZpbHRlcihmcyA9PiBmcy5pZCAhPT0gZmllbGRTdGF0ZS5pZCksXG4gICAgc3RhdGVcbiAgKVxuKTtcblxuZXhwb3J0IGRlZmF1bHQgKHN0YXRlLCB7IGZpZWxkU3RhdGUgfSkgPT5cbiAgTWF5YmUuZnJvbU51bGxhYmxlKGZpZWxkU3RhdGUpXG4gIC5tYXAoaGlzdG9yeVN0YXRlV2l0aG91dEZpZWxkKHN0YXRlKSlcbiAgLm1hcChwcm9wKFwiZmllbGRzU3RhdGVcIikpXG4gIC5tYXAocHVzaEhpc3RvcnlTdGF0ZShzdGF0ZSkpXG4gIC5nZXRPckVsc2Uoc3RhdGUpO1xuIiwiaW1wb3J0IHsgY3VycnksIHByb3AsIG92ZXIsIG1hcCB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IHsgU3RhdGVMZW5zZXMsIHB1c2hIaXN0b3J5U3RhdGUsIHZhbGlkYXRlRmllbGQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG4vLyBTdGF0ZSAtPiBPYmplY3QgLT4gU3RhdGVcbmNvbnN0IHVwZGF0ZUZpZWxkU3RhdGUgPSBjdXJyeSgoc3RhdGUsIG5ld0ZpZWxkU3RhdGUpID0+XG4gIG92ZXIoXG4gICAgU3RhdGVMZW5zZXMuZmllbGRzU3RhdGUsXG4gICAgbWFwKGZzID0+IGZzLmlkID09PSBuZXdGaWVsZFN0YXRlLmlkID8gbmV3RmllbGRTdGF0ZSA6IGZzKSxcbiAgICBzdGF0ZVxuICApXG4pO1xuXG5leHBvcnQgZGVmYXVsdCAoc3RhdGUsIHsgbmV3RmllbGRTdGF0ZSB9KSA9PlxuICB2YWxpZGF0ZUZpZWxkKG5ld0ZpZWxkU3RhdGUpIC8vIEVpdGhlclxuICAubWFwKHVwZGF0ZUZpZWxkU3RhdGUoc3RhdGUpKVxuICAubWFwKHByb3AoXCJmaWVsZHNTdGF0ZVwiKSlcbiAgLm1hcChwdXNoSGlzdG9yeVN0YXRlKHN0YXRlKSlcbiAgLmxlZnRNYXAoY29uc29sZS5lcnJvcilcbiAgLmdldE9yRWxzZShzdGF0ZSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIF9zbGljZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX3NsaWNlJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgbGlzdCwgc29ydGVkIGFjY29yZGluZyB0byB0aGUgY29tcGFyYXRvciBmdW5jdGlvbixcbiAqIHdoaWNoIHNob3VsZCBhY2NlcHQgdHdvIHZhbHVlcyBhdCBhIHRpbWUgYW5kIHJldHVybiBhIG5lZ2F0aXZlIG51bWJlciBpZiB0aGVcbiAqIGZpcnN0IHZhbHVlIGlzIHNtYWxsZXIsIGEgcG9zaXRpdmUgbnVtYmVyIGlmIGl0J3MgbGFyZ2VyLCBhbmQgemVybyBpZiB0aGV5XG4gKiBhcmUgZXF1YWwuIFBsZWFzZSBub3RlIHRoYXQgdGhpcyBpcyBhICoqY29weSoqIG9mIHRoZSBsaXN0LiBJdCBkb2VzIG5vdFxuICogbW9kaWZ5IHRoZSBvcmlnaW5hbC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIChhLGEgLT4gTnVtYmVyKSAtPiBbYV0gLT4gW2FdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJhdG9yIEEgc29ydGluZyBmdW5jdGlvbiA6OiBhIC0+IGIgLT4gSW50XG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIHNvcnRcbiAqIEByZXR1cm4ge0FycmF5fSBhIG5ldyBhcnJheSB3aXRoIGl0cyBlbGVtZW50cyBzb3J0ZWQgYnkgdGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIGRpZmYgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhIC0gYjsgfTtcbiAqICAgICAgUi5zb3J0KGRpZmYsIFs0LDIsNyw1XSk7IC8vPT4gWzIsIDQsIDUsIDddXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBzb3J0KGNvbXBhcmF0b3IsIGxpc3QpIHtcbiAgcmV0dXJuIF9zbGljZShsaXN0KS5zb3J0KGNvbXBhcmF0b3IpO1xufSk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5pbXBvcnQgeyBjdXJyeSwgcGlwZSwgcHJvcCwgb3Zlciwgc29ydCB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IHsgaGlkZUNvbmZpZ3MsIFN0YXRlTGVuc2VzLCBwdXNoSGlzdG9yeVN0YXRlIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBFaXRoZXIgZnJvbSBcImRhdGEuZWl0aGVyXCI7XG5cbi8vIFN0YXRlIC0+IE9iamVjdCAtPiBTdGF0ZVxuY29uc3QgaGlzdG9yeVN0YXRlV2l0aE5ld09yZGVyID0gY3VycnkoKHN0YXRlLCBuZXdPcmRlcikgPT4gcGlwZShcbiAgaGlkZUNvbmZpZ3MsXG4gIG92ZXIoXG4gICAgU3RhdGVMZW5zZXMuZmllbGRzU3RhdGUsXG4gICAgc29ydCgoZjEsIGYyKSA9PiBuZXdPcmRlci5pbmRleE9mKGYxLmlkKSAtIG5ld09yZGVyLmluZGV4T2YoZjIuaWQpKVxuICApXG4pKHN0YXRlKSk7XG5cbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBuZXdGaWVsZHNPcmRlciB9KSA9PlxuICAobmV3RmllbGRzT3JkZXIgJiYgQXJyYXkuaXNBcnJheShuZXdGaWVsZHNPcmRlcilcbiAgICA/IEVpdGhlci5SaWdodChuZXdGaWVsZHNPcmRlcilcbiAgICA6IEVpdGhlci5MZWZ0KGBuZXdGaWVsZHNPcmRlciBtdXN0IGJlIGFuIGFycmF5IGJ1dCByZWNlaXZlZCAke3R5cGVvZiBuZXdGaWVsZHNPcmRlcn1gKVxuICApXG4gIC5jaGFpbihvID0+XG4gICAgby5sZW5ndGggPT09IHN0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aFxuICAgICAgPyBFaXRoZXIuUmlnaHQobylcbiAgICAgIDogRWl0aGVyLkxlZnQoYG5ld0ZpZWxkc09yZGVyIGhhcyAke28ubGVuZ3RofSBlbGVtZW50cywgYnV0IHRoZSBjdXJyZW50IHN0YXRlIGhhcyAke3N0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aH0gZWxlbWVudHNgKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1sZW5cbiAgKVxuICAuY2hhaW4obyA9PiB7XG4gICAgY29uc3Qgc3RhdGVJZHMgPSBzdGF0ZS5maWVsZHNTdGF0ZS5tYXAocHJvcChcImlkXCIpKTtcbiAgICBjb25zdCBub01pc3NpbmdJZCA9IHN0YXRlSWRzLnJlZHVjZSgoYWNjLCBmSWQpID0+IGFjYyAmJiBvLmluY2x1ZGVzKGZJZCksIHRydWUpO1xuICAgIHJldHVybiBub01pc3NpbmdJZFxuICAgICAgPyBFaXRoZXIuUmlnaHQobylcbiAgICAgIDogRWl0aGVyLkxlZnQoXCJOb3QgYWxsIGlkcyBpbiB0aGUgbmV3IG9yZGVyIGFyZSBtYXRjaGVkIGluIHRoZSBleGlzdGluZyBzdGF0ZSBpZHMuXCIpO1xuICB9KVxuICAubWFwKGhpc3RvcnlTdGF0ZVdpdGhOZXdPcmRlcihzdGF0ZSkpXG4gIC5tYXAocHJvcChcImZpZWxkc1N0YXRlXCIpKVxuICAubWFwKHB1c2hIaXN0b3J5U3RhdGUoc3RhdGUpKVxuICAubGVmdE1hcChlcnIgPT4gY29uc29sZS5lcnJvcihgVW5hYmxlIHRvIHJlb3JkZXI6ICR7ZXJyfWApKVxuICAuZ2V0T3JFbHNlKHN0YXRlKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLW5lc3RlZC10ZXJuYXJ5ICovXG5pbXBvcnQgYXNzZXJ0IGZyb20gXCJmbC1hc3NlcnRcIjtcbmltcG9ydCB1bmRvIGZyb20gXCIuL3VuZG9cIjtcbmltcG9ydCBpbXBvcnRTdGF0ZSBmcm9tIFwiLi9pbXBvcnRTdGF0ZVwiO1xuaW1wb3J0IGNyZWF0ZUZpZWxkIGZyb20gXCIuL2NyZWF0ZUZpZWxkXCI7XG5pbXBvcnQgZmllbGRDcmVhdGVkIGZyb20gXCIuL2ZpZWxkQ3JlYXRlZFwiO1xuaW1wb3J0IHRvZ2dsZUNvbmZpZyBmcm9tIFwiLi9maWVsZC50b2dnbGVDb25maWdcIjtcbmltcG9ydCB0b2dnbGVSZXF1aXJlZCBmcm9tIFwiLi9maWVsZC50b2dnbGVSZXF1aXJlZFwiO1xuaW1wb3J0IGRlbGV0ZUZpZWxkIGZyb20gXCIuL2ZpZWxkLmRlbGV0ZUZpZWxkXCI7XG5pbXBvcnQgdXBkYXRlRmllbGQgZnJvbSBcIi4vZmllbGQudXBkYXRlRmllbGRcIjtcbmltcG9ydCByZW9yZGVyRmllbGRzIGZyb20gXCIuL3Jlb3JkZXJGaWVsZHNcIjtcblxuY29uc3QgYWN0aW9uSGFuZGxlcnMgPSB7XG4gIHVuZG8sXG4gIGltcG9ydFN0YXRlLFxuICBjcmVhdGVGaWVsZCxcbiAgZmllbGRDcmVhdGVkLFxuICB0b2dnbGVDb25maWcsXG4gIHRvZ2dsZVJlcXVpcmVkLFxuICBkZWxldGVGaWVsZCxcbiAgdXBkYXRlRmllbGQsXG4gIHJlb3JkZXJGaWVsZHMsXG59O1xuXG5jb25zdCBpc0V4cGVjdGVkQWN0aW9uID0gYSA9PiBhICYmIGEudHlwZSAmJiBhY3Rpb25IYW5kbGVyc1thLnR5cGVdO1xuY29uc3QgaXNSZWR1eEFjdGlvbiA9IGEgPT4gYSAmJiBhLnR5cGUgJiYgYS50eXBlLmluY2x1ZGVzKFwiQEByZWR1eFwiKTtcblxuXG5jb25zdCB1cGRhdGUgPSAoc3RhdGUsIGFjdGlvbikgPT5cbiAgaXNFeHBlY3RlZEFjdGlvbihhY3Rpb24pXG4gICAgPyBhY3Rpb25IYW5kbGVyc1thY3Rpb24udHlwZV0oc3RhdGUsIGFjdGlvbilcbiAgOiBpc1JlZHV4QWN0aW9uKGFjdGlvbilcbiAgICA/IHN0YXRlXG4gIDogYXNzZXJ0KGZhbHNlLCBgSW52YWxpZCBhY3Rpb24gdHlwZTogJHthY3Rpb24udHlwZX1gKTtcblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmltcG9ydCB7IHVuZG8gYXMgdW5kb0FjdGlvbiB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuY29uc3QgY3VycmVudEZpZWxkc1N0YXRlID0gW1wiY3VycmVudFwiXTtcbmNvbnN0IG9sZEZpZWxkc1N0YXRlID0gW1wib2xkXCJdO1xuY29uc3QgbW9ja1N0YXRlID0ge1xuICBmaWVsZFR5cGVzOiBbXSxcbiAgZmllbGRzU3RhdGU6IGN1cnJlbnRGaWVsZHNTdGF0ZSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBbb2xkRmllbGRzU3RhdGVdLFxufTtcblxuY29uc3QgZW1wdHlNb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFtdLFxuICBmaWVsZHNTdGF0ZTogW10sXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogW10sXG59O1xuXG5jb25zdCBlbXB0eUhpc3RvcnlNb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFtdLFxuICBmaWVsZHNTdGF0ZTogY3VycmVudEZpZWxkc1N0YXRlLFxuICBmaWVsZHNTdGF0ZUhpc3Rvcnk6IFtdLFxufTtcblxuZGVzY3JpYmUoXCJVcGRhdGUudW5kb1wiLCAoKSA9PiB7XG4gIGl0KFwicmVtb3ZlcyBmaXJzdCBvbGQgc3RhdGUgZnJvbSBoaXN0b3J5XCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RpZmllZFN0YXRlID0gdXBkYXRlKG1vY2tTdGF0ZSwgdW5kb0FjdGlvbigpKTtcbiAgICBleHBlY3QobW9kaWZpZWRTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKDApO1xuICB9KTtcblxuICBpdChcInNldHMgZmlyc3Qgb2xkIHN0YXRlIGFzIGN1cnJlbnQgc3RhdGVcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB1bmRvQWN0aW9uKCkpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlKS50b0VxdWFsKG9sZEZpZWxkc1N0YXRlKTtcbiAgfSk7XG5cbiAgaXQoXCJkb2Vzbid0IG1vZGlmeSB0aGUgc3RhdGUgaWYgdGhlcmUgYXJlbid0IG1vcmUgaGlzdG9yeSBzdGF0ZXMgdG8gdW5kb1wiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShlbXB0eU1vY2tTdGF0ZSwgdW5kb0FjdGlvbigpKTtcbiAgICBleHBlY3QobW9kaWZpZWRTdGF0ZSkudG9FcXVhbChlbXB0eU1vY2tTdGF0ZSk7XG4gIH0pO1xuXG4gIGl0KFwic2V0J3MgdGhlIGN1cnJlbnQgc3RhdGUgdG8gZW1wdHkgaWYgdGhlcmUgYXJlIG5vIG1vcmUgaGlzdG9yeSBzdGF0ZXNcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUoZW1wdHlIaXN0b3J5TW9ja1N0YXRlLCB1bmRvQWN0aW9uKCkpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgfSk7XG59KTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuaW1wb3J0IHsgaW1wb3J0U3RhdGUgfSBmcm9tIFwiLi4vLi4vanMvQWN0aW9uc1wiO1xuaW1wb3J0IHVwZGF0ZSBmcm9tIFwiLi4vLi4vanMvVXBkYXRlXCI7XG5cbmNvbnN0IHR5cGVzQXJyYXkgPSBbe1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIlJhZGlvQnV0dG9uc1wiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIkNoZWNrYm94ZXNcIixcbiAgfSxcbn0sIHtcbiAgXCJpbmZvXCI6IHtcbiAgICBcInR5cGVcIjogXCJEcm9wZG93blwiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIlRleHRCb3hcIixcbiAgfSxcbn0sIHtcbiAgXCJpbmZvXCI6IHtcbiAgICBcInR5cGVcIjogXCJFbWFpbEJveFwiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIlRlbGVwaG9uZUJveFwiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIk51bWJlckJveFwiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIlRleHRBcmVhXCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiRGF0ZUZpZWxkXCIsXG4gIH0sXG59XTtcblxuY29uc3QgbW9ja0N1cnJlbnRTdGF0ZSA9IFtcImFcIiwgXCJiXCJdO1xuY29uc3QgbW9ja0hpc3RvcnkgPSBbXTtcbmNvbnN0IG1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogdHlwZXNBcnJheSxcbiAgZmllbGRzU3RhdGU6IG1vY2tDdXJyZW50U3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbW9ja0hpc3RvcnksXG59O1xuXG5jb25zdCBuZXdWYWxpZFN0YXRlID0gW3tcbiAgXCJ0eXBlXCI6IFwiQ2hlY2tib3hlc1wiLFxuICBcImRpc3BsYXlOYW1lXCI6IFwiQ2hlY2tib3hlc1wiLFxuICBcImdyb3VwXCI6IFwiT3B0aW9ucyBDb21wb25lbnRzXCIsXG4gIFwiaHRtbElucHV0VHlwZVwiOiBcImNoZWNrYm94XCIsXG4gIFwidGl0bGVcIjogXCJBZGQgYSB0aXRsZVwiLFxuICBcIm9wdGlvbnNcIjogW3tcbiAgICBcImNhcHRpb25cIjogXCJJbnNlcnQgYW4gb3B0aW9uXCIsXG4gIH1dLFxuICBcIm5ld09wdGlvbkNhcHRpb25cIjogXCJcIixcbn1dO1xuXG5jb25zdCBuZXdJbnZhbGlkU3RhdGUgPSBbe1xuICBcInR5cGVcIjogXCJJbnZhbGlkIHR5cGVcIixcbiAgXCJkaXNwbGF5TmFtZVwiOiBcIkNoZWNrYm94ZXNcIixcbiAgXCJncm91cFwiOiBcIk9wdGlvbnMgQ29tcG9uZW50c1wiLFxuICBcImh0bWxJbnB1dFR5cGVcIjogXCJjaGVja2JveFwiLFxuICBcInRpdGxlXCI6IFwiQWRkIGEgdGl0bGVcIixcbiAgXCJvcHRpb25zXCI6IFt7XG4gICAgXCJjYXB0aW9uXCI6IFwiSW5zZXJ0IGFuIG9wdGlvblwiLFxuICB9XSxcbiAgXCJuZXdPcHRpb25DYXB0aW9uXCI6IFwiXCIsXG59XTtcblxuZGVzY3JpYmUoXCJVcGRhdGUuaW1wb3J0U3RhdGVcIiwgKCkgPT4ge1xuICBpdChcIlJldHVybnMgYW4gdW5jaGFuZ2VkIGFycmF5IGlmIHRoZSBuZXcgc3RhdGUgaXMgaW52YWxpZFwiLCAoKSA9PiB7XG4gICAgZXhwZWN0KHVwZGF0ZShtb2NrU3RhdGUsIGltcG9ydFN0YXRlKHt9KSkpLnRvRXF1YWwobW9ja1N0YXRlKTtcbiAgICBleHBlY3QodXBkYXRlKG1vY2tTdGF0ZSwgaW1wb3J0U3RhdGUobnVsbCkpKS50b0VxdWFsKG1vY2tTdGF0ZSk7XG4gIH0pO1xuXG4gIGl0KFwiUmV0dXJucyBhbiB1bmNoYW5nZWQgYXJyYXkgaWYgdGhlIGEgZmllbGQncyB0eXBlIGlzIG5vdCBpbiBmaWVsZFR5cGVzXCIsICgpID0+IHtcbiAgICBleHBlY3QodXBkYXRlKG1vY2tTdGF0ZSwgaW1wb3J0U3RhdGUobmV3SW52YWxpZFN0YXRlKSkpLnRvRXF1YWwobW9ja1N0YXRlKTtcbiAgfSk7XG5cbiAgaXQoXCJTZW5kcyB0aGUgbGFzdCBjdXJyZW50IHN0YXRlIHRvIHRoZSBoaXN0b3J5XCIsICgpID0+IHtcbiAgICBjb25zdCB1cGRhdGVkID0gdXBkYXRlKG1vY2tTdGF0ZSwgaW1wb3J0U3RhdGUobmV3VmFsaWRTdGF0ZSkpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlSGlzdG9yeVswXS50b1N0cmluZygpKS50b0VxdWFsKG1vY2tDdXJyZW50U3RhdGUudG9TdHJpbmcoKSk7XG4gICAgZXhwZWN0KHVwZGF0ZWQuZmllbGRzU3RhdGVIaXN0b3J5Lmxlbmd0aCkudG9FcXVhbChtb2NrSGlzdG9yeS5sZW5ndGggKyAxKTtcbiAgfSk7XG5cbiAgaXQoXCJTZXRzIHRoZSBuZXcgc3RhdGUgYXMgY3VycmVudFwiLCAoKSA9PiB7XG4gICAgY29uc3QgdXBkYXRlZCA9IHVwZGF0ZShtb2NrU3RhdGUsIGltcG9ydFN0YXRlKG5ld1ZhbGlkU3RhdGUpKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZVswXS50eXBlKS50b0VxdWFsKG5ld1ZhbGlkU3RhdGVbMF0udHlwZSk7XG4gICAgZXhwZWN0KHVwZGF0ZWQuZmllbGRzU3RhdGVbMF0udHlwZSkubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZVswXS5kaXNwbGF5TmFtZSkudG9FcXVhbChuZXdWYWxpZFN0YXRlWzBdLmRpc3BsYXlOYW1lKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZVswXS5kaXNwbGF5TmFtZSkubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZVswXS5ncm91cCkudG9FcXVhbChuZXdWYWxpZFN0YXRlWzBdLmdyb3VwKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZVswXS5ncm91cCkubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgfSk7XG59KTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuaW1wb3J0IHsgY3JlYXRlRmllbGQgfSBmcm9tIFwiLi4vLi4vanMvQWN0aW9uc1wiO1xuaW1wb3J0IHVwZGF0ZSBmcm9tIFwiLi4vLi4vanMvVXBkYXRlXCI7XG5cbmNvbnN0IHByb21pc2VUeXBlSW5zdGFuY2UgPSB7IHR5cGU6IFwicHJvbWlzZS1pbnN0YW5jZVwiIH07XG5jb25zdCBwcm9taXNlVHlwZSA9IHtcbiAgaW5mbzogeyB0eXBlOiBcIlByb21pc2VUeXBlXCIgfSxcbiAgaW5pdGlhbFN0YXRlOiAoKSA9PiBQcm9taXNlLnJlc29sdmUocHJvbWlzZVR5cGVJbnN0YW5jZSksXG59O1xuXG5jb25zdCBzeW5jVHlwZUluc3RhbmNlID0geyB0eXBlOiBcInN5bmMtaW5zdGFuY2VcIiB9O1xuY29uc3Qgc3luY1R5cGUgPSB7XG4gIGluZm86IHsgdHlwZTogXCJTeW5jVHlwZVwiIH0sXG4gIGluaXRpYWxTdGF0ZTogKCkgPT4gc3luY1R5cGVJbnN0YW5jZSxcbn07XG5cbmNvbnN0IHR5cGVzQXJyYXkgPSBbcHJvbWlzZVR5cGUsIHN5bmNUeXBlXTtcbmNvbnN0IG1vY2tDdXJyZW50U3RhdGUgPSBbXCJhXCIsIFwiYlwiXTtcbmNvbnN0IG1vY2tIaXN0b3J5ID0gW107XG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IHR5cGVzQXJyYXksXG4gIGZpZWxkc1N0YXRlOiBtb2NrQ3VycmVudFN0YXRlLFxuICBmaWVsZHNTdGF0ZUhpc3Rvcnk6IG1vY2tIaXN0b3J5LFxufTtcblxuZGVzY3JpYmUoXCJVcGRhdGUuY3JlYXRlRmllbGRcIiwgKCkgPT4ge1xuICBpdChcImNyZWF0ZXMgZmllbGRzIGFzeW5jaHJvbm91c2x5XCIsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGFzeW5jRGlzcGF0Y2ggPSB2ID0+IHtcbiAgICAgIGV4cGVjdCh2KS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBhc3luY0FjaW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgYXN5bmNEaXNwYXRjaCB9LFxuICAgICAgY3JlYXRlRmllbGQoc3luY1R5cGUuaW5mby50eXBlKVxuICAgICk7XG5cbiAgICB1cGRhdGUobW9ja1N0YXRlLCBhc3luY0FjaW9uKTtcbiAgfSk7XG5cbiAgaXQoXCJyZXR1cm5zIGEgJ2ZpZWxkQ3JlYXRlZCcgYWN0aW9uIHdoZW4gZmllbGQgaXMgY3JlYXRlZFwiLCBkb25lID0+IHtcbiAgICBjb25zdCBhc3luY0Rpc3BhdGNoID0gYWN0aW9uID0+IHtcbiAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChcImZpZWxkQ3JlYXRlZFwiKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgYXN5bmNBY2lvbiA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7IGFzeW5jRGlzcGF0Y2ggfSxcbiAgICAgIGNyZWF0ZUZpZWxkKHN5bmNUeXBlLmluZm8udHlwZSlcbiAgICApO1xuXG4gICAgdXBkYXRlKG1vY2tTdGF0ZSwgYXN5bmNBY2lvbik7XG4gIH0pO1xuXG4gIGl0KFwiY3JlYXRlcyB0eXBlcyB3aXRoIGNvbnN0cnVjdG9ycyB0aGF0IHJldHVybiBhIHBsYWluIG9iamVjdFwiLCBkb25lID0+IHtcbiAgICBjb25zdCBhc3luY0Rpc3BhdGNoID0gYWN0aW9uID0+IHtcbiAgICAgIGV4cGVjdChhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUpLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICBleHBlY3QoYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlLnR5cGUpLnRvRXF1YWwoc3luY1R5cGVJbnN0YW5jZS50eXBlKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgYXN5bmNBY2lvbiA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7IGFzeW5jRGlzcGF0Y2ggfSxcbiAgICAgIGNyZWF0ZUZpZWxkKHN5bmNUeXBlLmluZm8udHlwZSlcbiAgICApO1xuXG4gICAgdXBkYXRlKG1vY2tTdGF0ZSwgYXN5bmNBY2lvbik7XG4gIH0pO1xuXG4gIGl0KFwiY3JlYXRlcyB0eXBlcyB3aXRoIGNvbnN0cnVjdG9ycyB0aGF0IHJldHVybiBhIHByb21pc2VcIiwgZG9uZSA9PiB7XG4gICAgY29uc3QgYXN5bmNEaXNwYXRjaCA9IGFjdGlvbiA9PiB7XG4gICAgICBleHBlY3QoYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgICAgZXhwZWN0KGFjdGlvbi5jcmVhdGVkRmllbGRTdGF0ZS50eXBlKS50b0VxdWFsKHByb21pc2VUeXBlSW5zdGFuY2UudHlwZSk7XG4gICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFzeW5jQWNpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBhc3luY0Rpc3BhdGNoIH0sXG4gICAgICBjcmVhdGVGaWVsZChwcm9taXNlVHlwZS5pbmZvLnR5cGUpXG4gICAgKTtcblxuICAgIHVwZGF0ZShtb2NrU3RhdGUsIGFzeW5jQWNpb24pO1xuICB9KTtcblxuICBpdChcImFkZHMgcmVxdWlyZWQgZmllbGRzIHRvIGluc3RhbmNlXCIsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGFzeW5jRGlzcGF0Y2ggPSBhY3Rpb24gPT4ge1xuICAgICAgZXhwZWN0KGFjdGlvbi5jcmVhdGVkRmllbGRTdGF0ZS5pZCkubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgIGV4cGVjdCh0eXBlb2YgYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlLmNvbmZpZ1Nob3dpbmcpLnRvRXF1YWwoXCJib29sZWFuXCIpO1xuICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBhc3luY0FjaW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgYXN5bmNEaXNwYXRjaCB9LFxuICAgICAgY3JlYXRlRmllbGQocHJvbWlzZVR5cGUuaW5mby50eXBlKVxuICAgICk7XG5cbiAgICB1cGRhdGUobW9ja1N0YXRlLCBhc3luY0FjaW9uKTtcbiAgfSk7XG5cbiAgaXQoXCJkb2VzIG5vdCBjcmVhdGUgYSBmaWVsZCBpZiB0eXBlIGlzIG5vdCBpbiBtb2RlbC5maWVsZFR5cGVzXCIsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGFzeW5jRGlzcGF0Y2ggPSBqYXNtaW5lLmNyZWF0ZVNweShcImFzeW5jRGlzcGF0Y2hcIik7XG5cbiAgICBjb25zdCBhc3luY0FjaW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgYXN5bmNEaXNwYXRjaCB9LFxuICAgICAgY3JlYXRlRmllbGQoXCJub24tZXhpc3RpbmctdHlwZVwiKVxuICAgICk7XG5cbiAgICB1cGRhdGUobW9ja1N0YXRlLCBhc3luY0FjaW9uKTtcblxuICAgIHNldFRpbWVvdXQoXG4gICAgICAoKSA9PiB7IGV4cGVjdChhc3luY0Rpc3BhdGNoKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpOyBkb25lKCk7IH0sXG4gICAgICA1MFxuICAgICk7XG4gIH0pO1xufSk7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmltcG9ydCB7IGZpZWxkQ3JlYXRlZCB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuY29uc3QgY3JlYXRlZEZpZWxkU3RhdGUgPSB7IHR5cGU6IFwiZmljdGl0aW91cy1pbnN0YW5jZVwiIH07XG5jb25zdCBtb2NrQ3VycmVudFN0YXRlID0gW1wiYVwiLCBcImJcIl07XG5jb25zdCBtb2NrSGlzdG9yeSA9IFtdO1xuY29uc3QgbW9ja1N0YXRlID0ge1xuICBmaWVsZFR5cGVzOiBbeyBpbmZvOiB7IHR5cGU6IFwiZmljdGl0aW91cy1pbnN0YW5jZVwiIH0gfV0sXG4gIGZpZWxkc1N0YXRlOiBtb2NrQ3VycmVudFN0YXRlLFxuICBmaWVsZHNTdGF0ZUhpc3Rvcnk6IG1vY2tIaXN0b3J5LFxufTtcblxuY29uc3QgZmllbGRDcmVhdGVkQWN0aW9uID0gZmllbGRDcmVhdGVkKGNyZWF0ZWRGaWVsZFN0YXRlKTtcbmNvbnN0IG5ld1N0YXRlID0gdXBkYXRlKG1vY2tTdGF0ZSwgZmllbGRDcmVhdGVkQWN0aW9uKTtcblxuZGVzY3JpYmUoXCJVcGRhdGUuZmllbGRDcmVhdGVkXCIsICgpID0+IHtcbiAgaXQoXCJvdXRwdXRzIGEgc3RhdGUgd2l0aCB0aGUgbmV3IGZpZWxkIGluY2x1ZGVkXCIsICgpID0+IHtcbiAgICBleHBlY3QobmV3U3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGggKyAxKTtcbiAgICBleHBlY3QoXG4gICAgICBuZXdTdGF0ZS5maWVsZHNTdGF0ZVxuICAgICAgLmZpbmQodiA9PiB2LnR5cGUgPT09IGNyZWF0ZWRGaWVsZFN0YXRlLnR5cGUpXG4gICAgKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICB9KTtcblxuICBpdChcInNlbmRzIHRoZSBjdXJyZW50IHN0YXRlIHRvIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGV4cGVjdChuZXdTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnlbMF1bMF0pLnRvRXF1YWwobW9ja0N1cnJlbnRTdGF0ZVswXSk7XG4gICAgZXhwZWN0KG5ld1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeVswXVsxXSkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlWzFdKTtcbiAgfSk7XG5cbiAgaXQoXCJSZXR1cm5zIHRoZSBjdXJyZW50IHN0YXRlIGlmIG5vIG5ldyBmaWVsZCBpcyBnaXZlbiB0byBpdFwiLCAoKSA9PiB7XG4gICAgY29uc3Qgc2FtZVN0YXRlID0gdXBkYXRlKG1vY2tTdGF0ZSwgZmllbGRDcmVhdGVkKG51bGwpKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkVHlwZXMubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZFR5cGVzLmxlbmd0aCk7XG4gICAgZXhwZWN0KHNhbWVTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCk7XG4gICAgZXhwZWN0KHNhbWVTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKTtcbiAgfSk7XG5cbiAgaXQoXCJkb2VzIG5vdCBicmVhayB0aGUgc3RhdGUgYWZ0ZXIgY3JlYXRpbmcgb25lIG9iamVjdFwiLCAoKSA9PiB7XG4gICAgY29uc3QgY2hhbmdlZDEgPSB1cGRhdGUobW9ja1N0YXRlLCBmaWVsZENyZWF0ZWQoY3JlYXRlZEZpZWxkU3RhdGUpKTtcbiAgICBjb25zdCBjaGFuZ2VkMiA9IHVwZGF0ZShjaGFuZ2VkMSwgZmllbGRDcmVhdGVkKGNyZWF0ZWRGaWVsZFN0YXRlKSk7XG4gICAgY29uc3QgY2hhbmdlZDMgPSB1cGRhdGUoY2hhbmdlZDIsIGZpZWxkQ3JlYXRlZChjcmVhdGVkRmllbGRTdGF0ZSkpO1xuICAgIGV4cGVjdChjaGFuZ2VkMy5maWVsZFR5cGVzLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRUeXBlcy5sZW5ndGgpO1xuICAgIGV4cGVjdChjaGFuZ2VkMy5maWVsZHNTdGF0ZS5sZW5ndGgpLnRvRXF1YWwobW9ja0N1cnJlbnRTdGF0ZS5sZW5ndGggKyAzKTtcbiAgICBleHBlY3QoY2hhbmdlZDMuZmllbGRzU3RhdGVIaXN0b3J5Lmxlbmd0aCkudG9FcXVhbCgzKTtcbiAgfSk7XG59KTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuXG5pbXBvcnQgeyB0b2dnbGVDb25maWcgfSBmcm9tIFwiLi4vLi4vanMvQWN0aW9uc1wiO1xuaW1wb3J0IHVwZGF0ZSBmcm9tIFwiLi4vLi4vanMvVXBkYXRlXCI7XG5cblxuY29uc3QgZmllbGRTdGF0ZUNvbmZpZ1Nob3dpbmcgPSB7XG4gIGlkOiAxMjMsXG4gIGNvbmZpZ1Nob3dpbmc6IHRydWUsXG59O1xuXG5jb25zdCBmaWVsZFN0YXRlQ29uZmlnTm90U2hvd2luZyA9IHtcbiAgaWQ6IDMyMSxcbiAgY29uZmlnU2hvd2luZzogZmFsc2UsXG59O1xuXG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFtdLFxuICBmaWVsZHNTdGF0ZTogW2ZpZWxkU3RhdGVDb25maWdTaG93aW5nLCBmaWVsZFN0YXRlQ29uZmlnTm90U2hvd2luZ10sXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogW10sXG59O1xuXG5kZXNjcmliZShcIlVwZGF0ZS50b2dnbGVDb25maWdcIiwgKCkgPT4ge1xuICBpdChcInR1cm5zIHRoZSBjb25maWcgb3B0aW9uIHRvIGZhbHNlIHdoZW4gbmVlZGVkXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RpZmllZFN0YXRlID0gdXBkYXRlKG1vY2tTdGF0ZSwgdG9nZ2xlQ29uZmlnKGZpZWxkU3RhdGVDb25maWdTaG93aW5nKSk7XG4gICAgZXhwZWN0KFxuICAgICAgbW9kaWZpZWRTdGF0ZS5maWVsZHNTdGF0ZVxuICAgICAgLmZpbmQoZiA9PiBmLmlkID09PSBmaWVsZFN0YXRlQ29uZmlnU2hvd2luZy5pZClcbiAgICAgIC5jb25maWdTaG93aW5nXG4gICAgKS50b0VxdWFsKGZhbHNlKTtcbiAgfSk7XG5cbiAgaXQoXCJ0dXJucyB0aGUgY29uZmlnIG9wdGlvbiB0byB0cnVlIHdoZW4gbmVlZGVkXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RpZmllZFN0YXRlID0gdXBkYXRlKG1vY2tTdGF0ZSwgdG9nZ2xlQ29uZmlnKGZpZWxkU3RhdGVDb25maWdOb3RTaG93aW5nKSk7XG4gICAgZXhwZWN0KFxuICAgICAgbW9kaWZpZWRTdGF0ZS5maWVsZHNTdGF0ZVxuICAgICAgLmZpbmQoZiA9PiBmLmlkID09PSBmaWVsZFN0YXRlQ29uZmlnU2hvd2luZy5pZClcbiAgICAgIC5jb25maWdTaG93aW5nXG4gICAgKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICBpdChcImFkZHMgdGhlIGxhc3Qgc3RhdGUgdG8gdGhlIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB0b2dnbGVDb25maWcoZmllbGRTdGF0ZUNvbmZpZ1Nob3dpbmcpKTtcbiAgICBleHBlY3QobW9kaWZpZWRTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeVswXVswXS5pZCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGVbMF0uaWQpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeVswXVsxXS5pZCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGVbMV0uaWQpO1xuICB9KTtcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmltcG9ydCB7IHRvZ2dsZVJlcXVpcmVkIH0gZnJvbSBcIi4uLy4uL2pzL0FjdGlvbnNcIjtcbmltcG9ydCB1cGRhdGUgZnJvbSBcIi4uLy4uL2pzL1VwZGF0ZVwiO1xuXG5cbmNvbnN0IGZpZWxkU3RhdGVJc1JlcXVpcmVkID0ge1xuICBpZDogMTIzLFxuICByZXF1aXJlZDogdHJ1ZSxcbn07XG5cbmNvbnN0IGZpZWxkU3RhdGVJc05vdFJlcXVpcmVkID0ge1xuICBpZDogMzIxLFxuICByZXF1aXJlZDogZmFsc2UsXG59O1xuXG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFtdLFxuICBmaWVsZHNTdGF0ZTogW2ZpZWxkU3RhdGVJc1JlcXVpcmVkLCBmaWVsZFN0YXRlSXNOb3RSZXF1aXJlZF0sXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogW10sXG59O1xuXG5kZXNjcmliZShcIlVwZGF0ZS50b2dnbGVSZXF1aXJlZFwiLCAoKSA9PiB7XG4gIGl0KFwidHVybnMgdGhlIHJlcXVpcmVkIG9wdGlvbiB0byBmYWxzZSB3aGVuIG5lZWRlZFwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIHRvZ2dsZVJlcXVpcmVkKGZpZWxkU3RhdGVJc1JlcXVpcmVkKSk7XG4gICAgZXhwZWN0KFxuICAgICAgbW9kaWZpZWRTdGF0ZS5maWVsZHNTdGF0ZVxuICAgICAgLmZpbmQoZiA9PiBmLmlkID09PSBmaWVsZFN0YXRlSXNSZXF1aXJlZC5pZClcbiAgICAgIC5yZXF1aXJlZFxuICAgICkudG9FcXVhbChmYWxzZSk7XG4gIH0pO1xuXG4gIGl0KFwidHVybnMgdGhlIHJlcXVpcmVkIG9wdGlvbiB0byB0cnVlIHdoZW4gbmVlZGVkXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RpZmllZFN0YXRlID0gdXBkYXRlKG1vY2tTdGF0ZSwgdG9nZ2xlUmVxdWlyZWQoZmllbGRTdGF0ZUlzTm90UmVxdWlyZWQpKTtcbiAgICBleHBlY3QoXG4gICAgICBtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlXG4gICAgICAuZmluZChmID0+IGYuaWQgPT09IGZpZWxkU3RhdGVJc1JlcXVpcmVkLmlkKVxuICAgICAgLnJlcXVpcmVkXG4gICAgKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICBpdChcImFkZHMgdGhlIGxhc3Qgc3RhdGUgdG8gdGhlIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB0b2dnbGVSZXF1aXJlZChmaWVsZFN0YXRlSXNSZXF1aXJlZCkpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdWzBdLmlkKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZVswXS5pZCk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdWzFdLmlkKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZVsxXS5pZCk7XG4gIH0pO1xufSk7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmltcG9ydCB7IGRlbGV0ZUZpZWxkIH0gZnJvbSBcIi4uLy4uL2pzL0FjdGlvbnNcIjtcbmltcG9ydCB1cGRhdGUgZnJvbSBcIi4uLy4uL2pzL1VwZGF0ZVwiO1xuXG5jb25zdCB0b0JlRGVsZXRlZEZpZWxkU3RhdGUgPSB7IHR5cGU6IFwiZmljdGl0aW91cy1pbnN0YW5jZVwiLCBpZDogMCB9O1xuY29uc3QgbW9ja0N1cnJlbnRTdGF0ZSA9IFt0b0JlRGVsZXRlZEZpZWxkU3RhdGUsIHsgaWQ6IDEgfSwgeyBpZDogMiB9XTtcbmNvbnN0IG1vY2tIaXN0b3J5ID0gW107XG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFt7IGluZm86IHsgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIgfSB9XSxcbiAgZmllbGRzU3RhdGU6IG1vY2tDdXJyZW50U3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbW9ja0hpc3RvcnksXG59O1xuXG5jb25zdCBmaWVsZERlbGV0ZUFjdGlvbiA9IGRlbGV0ZUZpZWxkKHRvQmVEZWxldGVkRmllbGRTdGF0ZSk7XG5jb25zdCBuZXdTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIGZpZWxkRGVsZXRlQWN0aW9uKTtcblxuZGVzY3JpYmUoXCJVcGRhdGUuZGVsZXRlRmllbGRcIiwgKCkgPT4ge1xuICBpdChcIm91dHB1dHMgYSBzdGF0ZSB3aXRob3V0IHRoZSBmaWVsZCBpbmNsdWRlZFwiLCAoKSA9PiB7XG4gICAgZXhwZWN0KG5ld1N0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoIC0gMSk7XG4gICAgZXhwZWN0KFxuICAgICAgbmV3U3RhdGUuZmllbGRzU3RhdGVcbiAgICAgIC5maW5kKHYgPT4gdi5pZCA9PT0gdG9CZURlbGV0ZWRGaWVsZFN0YXRlLmlkKVxuICAgICkudG9FcXVhbCh1bmRlZmluZWQpO1xuICB9KTtcblxuICBpdChcInNlbmRzIHRoZSBjdXJyZW50IHN0YXRlIHRvIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IHJlY2VudEhpc3RvcnlTdGF0ZSA9IG5ld1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeVswXTtcbiAgICBleHBlY3QocmVjZW50SGlzdG9yeVN0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlLmxlbmd0aCk7XG4gICAgZXhwZWN0KHJlY2VudEhpc3RvcnlTdGF0ZVswXS5pZCkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlWzBdLmlkKTtcbiAgICBleHBlY3QocmVjZW50SGlzdG9yeVN0YXRlWzFdLmlkKS50b0VxdWFsKG1vY2tDdXJyZW50U3RhdGVbMV0uaWQpO1xuICB9KTtcblxuICBpdChcIlJldHVybnMgdGhlIGN1cnJlbnQgc3RhdGUgaWYgbm8gbmV3IGZpZWxkIGlzIGdpdmVuIHRvIGl0XCIsICgpID0+IHtcbiAgICBjb25zdCBzYW1lU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCBkZWxldGVGaWVsZChudWxsKSk7XG4gICAgZXhwZWN0KHNhbWVTdGF0ZS5maWVsZFR5cGVzLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRUeXBlcy5sZW5ndGgpO1xuICAgIGV4cGVjdChzYW1lU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGgpO1xuICAgIGV4cGVjdChzYW1lU3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5Lmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5Lmxlbmd0aCk7XG4gIH0pO1xuXG4gIGl0KFwiZG9lcyBub3QgYnJlYWsgdGhlIHN0YXRlIGFmdGVyIGRlbGV0aW5nIGEgZmllbGRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tGaWVsZDEgPSBPYmplY3QuYXNzaWduKHt9LCB0b0JlRGVsZXRlZEZpZWxkU3RhdGUsIHsgaWQ6IDUgfSk7XG4gICAgY29uc3QgbW9ja0ZpZWxkMiA9IE9iamVjdC5hc3NpZ24oe30sIHRvQmVEZWxldGVkRmllbGRTdGF0ZSwgeyBpZDogNiB9KTtcbiAgICBjb25zdCBtb2NrRmllbGQzID0gT2JqZWN0LmFzc2lnbih7fSwgdG9CZURlbGV0ZWRGaWVsZFN0YXRlLCB7IGlkOiA3IH0pO1xuXG4gICAgY29uc3QgbW9ja1N0YXRlMiA9IE9iamVjdC5hc3NpZ24oe30sIG1vY2tTdGF0ZSwge1xuICAgICAgZmllbGRzU3RhdGU6IFtcbiAgICAgICAgbW9ja0ZpZWxkMSxcbiAgICAgICAgbW9ja0ZpZWxkMixcbiAgICAgICAgbW9ja0ZpZWxkMyxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3QgY2hhbmdlZDEgPSB1cGRhdGUobW9ja1N0YXRlMiwgZGVsZXRlRmllbGQobW9ja0ZpZWxkMSkpO1xuICAgIGNvbnN0IGNoYW5nZWQyID0gdXBkYXRlKGNoYW5nZWQxLCBkZWxldGVGaWVsZChtb2NrRmllbGQyKSk7XG4gICAgY29uc3QgY2hhbmdlZDMgPSB1cGRhdGUoY2hhbmdlZDIsIGRlbGV0ZUZpZWxkKG1vY2tGaWVsZDMpKTtcbiAgICBleHBlY3QoY2hhbmdlZDMuZmllbGRUeXBlcy5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlMi5maWVsZFR5cGVzLmxlbmd0aCk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUyLmZpZWxkc1N0YXRlLmxlbmd0aCAtIDMpO1xuICAgIGV4cGVjdChjaGFuZ2VkMy5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKDMpO1xuICB9KTtcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5pbXBvcnQgeyB1cGRhdGVGaWVsZCB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuY29uc3Qgb2xkRmllbGRTdGF0ZSA9IHtcbiAgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIsXG4gIGlkOiBcIjBcIixcbiAgY29uZmlnU2hvd2luZzogZmFsc2UsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgY29sb3I6IFwiYmx1ZVwiLFxufTtcbmNvbnN0IG5ld0ZpZWxkU3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBvbGRGaWVsZFN0YXRlLCB7IGNvbG9yOiBcImdyZWVuXCIgfSk7XG5jb25zdCBtb2NrQ3VycmVudFN0YXRlID0gW29sZEZpZWxkU3RhdGUsIHsgaWQ6IDEgfSwgeyBpZDogMiB9XTtcbmNvbnN0IG1vY2tIaXN0b3J5ID0gW107XG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFt7IGluZm86IHsgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIgfSB9XSxcbiAgZmllbGRzU3RhdGU6IG1vY2tDdXJyZW50U3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbW9ja0hpc3RvcnksXG59O1xuXG5jb25zdCBmaWVsZFVwZGF0ZUFjdGlvbiA9IHVwZGF0ZUZpZWxkKG5ld0ZpZWxkU3RhdGUpO1xuY29uc3QgbmV3U3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCBmaWVsZFVwZGF0ZUFjdGlvbik7XG5cbmRlc2NyaWJlKFwiVXBkYXRlLnVwZGF0ZUZpZWxkXCIsICgpID0+IHtcbiAgaXQoXCJvdXRwdXRzIGEgc3RhdGUgdGhlIGZpZWxkIHVwZGF0ZWRcIiwgKCkgPT4ge1xuICAgIGV4cGVjdChuZXdTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCk7XG4gICAgZXhwZWN0KFxuICAgICAgbmV3U3RhdGUuZmllbGRzU3RhdGVcbiAgICAgIC5maW5kKHYgPT4gdi5jb2xvciA9PT0gbmV3RmllbGRTdGF0ZS5jb2xvcilcbiAgICApLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGl0KFwib3V0cHV0cyBhIHN0YXRlIHRoZSB1cGRhdGVkIGZpZWxkIGluIHRoZSBjb3JyZWN0IG9yZGVyXCIsICgpID0+IHtcbiAgICBleHBlY3QobmV3U3RhdGUuZmllbGRzU3RhdGVbMF0uaWQpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlWzBdLmlkKTtcbiAgICBleHBlY3QobmV3U3RhdGUuZmllbGRzU3RhdGVbMF0uY29sb3IpLnRvRXF1YWwobmV3RmllbGRTdGF0ZS5jb2xvcik7XG4gIH0pO1xuXG4gIGl0KFwic2VuZHMgdGhlIGN1cnJlbnQgc3RhdGUgdG8gaGlzdG9yeVwiLCAoKSA9PiB7XG4gICAgY29uc3QgcmVjZW50SGlzdG9yeVN0YXRlID0gbmV3U3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdO1xuICAgIGV4cGVjdChyZWNlbnRIaXN0b3J5U3RhdGUubGVuZ3RoKS50b0VxdWFsKG1vY2tDdXJyZW50U3RhdGUubGVuZ3RoKTtcbiAgICBleHBlY3QocmVjZW50SGlzdG9yeVN0YXRlWzBdLmlkKS50b0VxdWFsKG1vY2tDdXJyZW50U3RhdGVbMF0uaWQpO1xuICAgIGV4cGVjdChyZWNlbnRIaXN0b3J5U3RhdGVbMF0uY29sb3IpLnRvRXF1YWwobW9ja0N1cnJlbnRTdGF0ZVswXS5jb2xvcik7XG4gIH0pO1xuXG4gIGl0KFwiUmV0dXJucyB0aGUgY3VycmVudCBzdGF0ZSBpZiBhbiBpbnZhbGlkIGZpZWxkIHN0YXRlIGlzIGdpdmVuIHRvIGl0XCIsICgpID0+IHtcbiAgICBjb25zdCBpc1NhbWUgPSAoc3RhdGUxLCBzdGF0ZTIpID0+IHtcbiAgICAgIGV4cGVjdChzdGF0ZTEuZmllbGRUeXBlcy5sZW5ndGgpLnRvRXF1YWwoc3RhdGUyLmZpZWxkVHlwZXMubGVuZ3RoKTtcbiAgICAgIGV4cGVjdChzdGF0ZTEuZmllbGRzU3RhdGUubGVuZ3RoKS50b0VxdWFsKHN0YXRlMi5maWVsZHNTdGF0ZS5sZW5ndGgpO1xuICAgICAgZXhwZWN0KHN0YXRlMS5maWVsZHNTdGF0ZVswXS5jb2xvcikudG9FcXVhbChzdGF0ZTIuZmllbGRzU3RhdGVbMF0uY29sb3IpO1xuICAgICAgZXhwZWN0KHN0YXRlMS5maWVsZHNTdGF0ZVswXS5pZCkudG9FcXVhbChzdGF0ZTIuZmllbGRzU3RhdGVbMF0uaWQpO1xuICAgICAgZXhwZWN0KHN0YXRlMS5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKHN0YXRlMi5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2FtZVN0YXRlMSA9IHVwZGF0ZShtb2NrU3RhdGUsIHVwZGF0ZUZpZWxkKG51bGwpKTtcbiAgICBpc1NhbWUobW9ja1N0YXRlLCBzYW1lU3RhdGUxKTtcblxuICAgIGNvbnN0IHNhbWVTdGF0ZTIgPSB1cGRhdGUoXG4gICAgICBtb2NrU3RhdGUsXG4gICAgICB1cGRhdGVGaWVsZChPYmplY3QuYXNzaWduKHt9LCBuZXdGaWVsZFN0YXRlLCB7IGlkOiBudWxsIH0pKVxuICAgICk7XG4gICAgaXNTYW1lKG1vY2tTdGF0ZSwgc2FtZVN0YXRlMik7XG5cbiAgICBjb25zdCBzYW1lU3RhdGUzID0gdXBkYXRlKFxuICAgICAgbW9ja1N0YXRlLFxuICAgICAgdXBkYXRlRmllbGQoT2JqZWN0LmFzc2lnbih7fSwgbmV3RmllbGRTdGF0ZSwgeyBjb25maWdTaG93aW5nOiBudWxsIH0pKVxuICAgICk7XG4gICAgaXNTYW1lKG1vY2tTdGF0ZSwgc2FtZVN0YXRlMyk7XG5cbiAgICBjb25zdCBzYW1lU3RhdGU0ID0gdXBkYXRlKFxuICAgICAgbW9ja1N0YXRlLFxuICAgICAgdXBkYXRlRmllbGQoT2JqZWN0LmFzc2lnbih7fSwgbmV3RmllbGRTdGF0ZSwgeyByZXF1aXJlZDogbnVsbCB9KSlcbiAgICApO1xuXG4gICAgaXNTYW1lKG1vY2tTdGF0ZSwgc2FtZVN0YXRlNCk7XG4gIH0pO1xuXG4gIGl0KFwiZG9lcyBub3QgYnJlYWsgdGhlIHN0YXRlIGFmdGVyIHVwZGF0aW5nIGEgZmllbGQgbXVsdGlwbGUgdGltZXMgYSBmaWVsZFwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9ja0ZpZWxkMSA9IE9iamVjdC5hc3NpZ24oe30sIG9sZEZpZWxkU3RhdGUsIHsgY29sb3I6IFwieWVsbG93XCIgfSk7XG4gICAgY29uc3QgbW9ja0ZpZWxkMiA9IE9iamVjdC5hc3NpZ24oe30sIG9sZEZpZWxkU3RhdGUsIHsgY29sb3I6IFwib3JhbmdlXCIgfSk7XG4gICAgY29uc3QgbW9ja0ZpZWxkMyA9IE9iamVjdC5hc3NpZ24oe30sIG9sZEZpZWxkU3RhdGUsIHsgY29sb3I6IFwicHVycGxlXCIgfSk7XG5cbiAgICBjb25zdCBjaGFuZ2VkMSA9IHVwZGF0ZShtb2NrU3RhdGUsIHVwZGF0ZUZpZWxkKG1vY2tGaWVsZDEpKTtcbiAgICBjb25zdCBjaGFuZ2VkMiA9IHVwZGF0ZShjaGFuZ2VkMSwgdXBkYXRlRmllbGQobW9ja0ZpZWxkMikpO1xuICAgIGNvbnN0IGNoYW5nZWQzID0gdXBkYXRlKGNoYW5nZWQyLCB1cGRhdGVGaWVsZChtb2NrRmllbGQzKSk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkVHlwZXMubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZFR5cGVzLmxlbmd0aCk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKTtcbiAgICBleHBlY3QoY2hhbmdlZDMuZmllbGRzU3RhdGVbMF0uaWQpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlWzBdLmlkKTtcbiAgICBleHBlY3QoY2hhbmdlZDMuZmllbGRzU3RhdGVbMF0uY29sb3IpLnRvRXF1YWwobW9ja0ZpZWxkMy5jb2xvcik7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoMyk7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsidW5kbyIsIl8iLCJpbXBvcnRTdGF0ZSIsIm5ld0ZpZWxkc1N0YXRlIiwiY3JlYXRlRmllbGQiLCJmaWVsZFR5cGUiLCJmaWVsZENyZWF0ZWQiLCJjcmVhdGVkRmllbGRTdGF0ZSIsInRvZ2dsZUNvbmZpZyIsImZpZWxkU3RhdGUiLCJ0b2dnbGVSZXF1aXJlZCIsImRlbGV0ZUZpZWxkIiwidXBkYXRlRmllbGQiLCJuZXdGaWVsZFN0YXRlIiwicmVvcmRlckZpZWxkcyIsIm5ld0ZpZWxkc09yZGVyIiwiZGVzY3JpYmUiLCJhY3Rpb24iLCJ0eXBlIiwidG9FcXVhbCIsIm1vY2tTdGF0ZVRvSW1wb3J0IiwiZ2xvYmFsIiwiYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmUiLCJzdG9yZSIsIm5leHQiLCJzeW5jQWN0aXZpdHlGaW5pc2hlZCIsImFjdGlvblF1ZXVlIiwiZmx1c2hRdWV1ZSIsImZvckVhY2giLCJhIiwiZGlzcGF0Y2giLCJhc3luY0Rpc3BhdGNoIiwiYXN5bmNBY3Rpb24iLCJjb25jYXQiLCJhY3Rpb25XaXRoQXN5bmNEaXNwYXRjaCIsIkltbXV0YWJsZSIsIm1lcmdlIiwiZmFrZUFjdGlvbiIsImRvbmUiLCJyZXR1cm5lZEFjdGlvbiIsIm5vdCIsInVuZGVmaW5lZCIsImZha2VBc3luY0FjdGlvbiIsImZha2VTdG9yZSIsIl9pc0FycmF5IiwiX3NsaWNlIiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDAiLCJfY2hlY2tGb3JNZXRob2QiLCJfaXNQbGFjZWhvbGRlciIsIl9jdXJyeTEiLCJfY3VycnkyIiwicmVxdWlyZSQkMiIsIl9jdXJyeTMiLCJhbHdheXMiLCJvdmVyIiwiX2FyaXR5IiwiX3BpcGUiLCJfeHdyYXAiLCJiaW5kIiwiX2lzU3RyaW5nIiwiaXNBcnJheUxpa2UiLCJfcmVkdWNlIiwic2xpY2UiLCJyZXF1aXJlJCQzIiwiX2NvbmNhdCIsInByb3AiLCJfaXNUcmFuc2Zvcm1lciIsIl9kaXNwYXRjaGFibGUiLCJfbWFwIiwiX3htYXAiLCJfY3VycnlOIiwiY3VycnlOIiwiX2hhcyIsIl9pc0FyZ3VtZW50cyIsImtleXMiLCJyZXF1aXJlJCQ2IiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDQiLCJtYXAiLCJsZW5zIiwiY3VycnkiLCJFaXRoZXIiLCJ1cGRhdGVBdCIsIl9kZWZhdWx0Iiwia2V5QXJyYXkiLCJuZXdWYWwiLCJvYmoiLCJkZWVwTmV3VmFsIiwicmVkdWNlUmlnaHQiLCJyZXN1bHQiLCJrZXkiLCJkZWVwIiwiU3RhdGVMZW5zZXMiLCJfZGVmYXVsdDIiLCJfZGVmYXVsdDMiLCJjcmVhdGVJZCIsIkRhdGUiLCJub3ciLCJ0b1N0cmluZyIsInB1c2hIaXN0b3J5U3RhdGUiLCJzdGF0ZSIsIm5ld0hpc3RvcnlTdGF0ZSIsIl9kZWZhdWx0NCIsIl9kZWZhdWx0NSIsImZpZWxkc1N0YXRlSGlzdG9yeSIsIl9kZWZhdWx0NiIsImZpZWxkc1N0YXRlIiwiX2RlZmF1bHQ3IiwiaGlkZUNvbmZpZ3MiLCJzIiwiT2JqZWN0IiwiYXNzaWduIiwiY29uZmlnU2hvd2luZyIsInByb3BlcnR5VHlwZUNoZWNrIiwicHJvcGVydHlOYW1lIiwiUmlnaHQiLCJMZWZ0IiwicmVxdWlyZWQiLCJ2YWxpZGF0ZUZpZWxkIiwiZnJvbU51bGxhYmxlIiwibGVmdE1hcCIsImZzIiwiY2hhaW4iLCJsYXN0SGlzdG9yeVN0YXRlIiwiSW5maW5pdHkiLCJfaWRlbnRpdHkiLCJhcCIsInByZXBlbmQiLCJzZXF1ZW5jZSIsIl9hcnJheUZyb21JdGVyYXRvciIsIl9mdW5jdGlvbk5hbWUiLCJpZGVudGljYWwiLCJfZXF1YWxzIiwiaXNBcnJheSIsImFyciIsIkFycmF5IiwiZmllbGRUeXBlSXNWYWxpZCIsInZhbGlkVHlwZXMiLCJmaWVsZCIsImZpbmQiLCJ2YWxpZEZpZWxkVHlwZXMiLCJvZiIsInZhbGlkYXRlRmllbGRzU3RhdGUiLCJmaWVsZFR5cGVzIiwiYWRkUmVxdWlyZWRQcm9wZXJ0aWVzIiwiZmllbGRTdGF0ZXMiLCJiaW1hcCIsImNvbnNvbGUiLCJlcnJvciIsImdldE9yRWxzZSIsIl9yZWR1Y2VkIiwiX3hmQmFzZSIsIl94ZmluZCIsIlRhc2siLCJ0eXBlQ29uc3RydWN0b3IiLCJ2IiwiaW5mbyIsImNvbnN0ciIsInJlamVjdCIsInJlc29sdmUiLCJjYWxsZWQiLCJpbml0aWFsU3RhdGUiLCJQcm9taXNlIiwidGhlbiIsImNhdGNoIiwiaW5zZXJ0UmVxdWlyZWRQcm9wcyIsImNyZWF0ZUZpZWxkQXN5bmNocm9ub3VzbHkiLCJyZWplY3RlZCIsImZvcmsiLCJlcnIiLCJNYXliZSIsImNsb25lIiwidW5pbXBsZW1lbnRlZCIsIm5vb3AiLCJoaXN0b3J5U3RhdGVXaXRoTmV3RmllbGQiLCJuZXdGaWVsZCIsInNldCIsInJlcGxhY2VGaWVsZFN0YXRlIiwiYUZpZWxkIiwiaWQiLCJfZmlsdGVyIiwiX2lzT2JqZWN0IiwiX3hmaWx0ZXIiLCJoaXN0b3J5U3RhdGVXaXRob3V0RmllbGQiLCJ1cGRhdGVGaWVsZFN0YXRlIiwiaGlzdG9yeVN0YXRlV2l0aE5ld09yZGVyIiwibmV3T3JkZXIiLCJmMSIsImYyIiwiaW5kZXhPZiIsIm8iLCJsZW5ndGgiLCJzdGF0ZUlkcyIsIm5vTWlzc2luZ0lkIiwicmVkdWNlIiwiYWNjIiwiZklkIiwiaW5jbHVkZXMiLCJhY3Rpb25IYW5kbGVycyIsImlzRXhwZWN0ZWRBY3Rpb24iLCJpc1JlZHV4QWN0aW9uIiwidXBkYXRlIiwiYXNzZXJ0IiwiY3VycmVudEZpZWxkc1N0YXRlIiwib2xkRmllbGRzU3RhdGUiLCJtb2NrU3RhdGUiLCJlbXB0eU1vY2tTdGF0ZSIsImVtcHR5SGlzdG9yeU1vY2tTdGF0ZSIsIm1vZGlmaWVkU3RhdGUiLCJ1bmRvQWN0aW9uIiwidHlwZXNBcnJheSIsIm1vY2tDdXJyZW50U3RhdGUiLCJtb2NrSGlzdG9yeSIsIm5ld1ZhbGlkU3RhdGUiLCJuZXdJbnZhbGlkU3RhdGUiLCJ1cGRhdGVkIiwiZGlzcGxheU5hbWUiLCJncm91cCIsInByb21pc2VUeXBlSW5zdGFuY2UiLCJwcm9taXNlVHlwZSIsInN5bmNUeXBlSW5zdGFuY2UiLCJzeW5jVHlwZSIsImFzeW5jQWNpb24iLCJqYXNtaW5lIiwiY3JlYXRlU3B5IiwidG9IYXZlQmVlbkNhbGxlZCIsImZpZWxkQ3JlYXRlZEFjdGlvbiIsIm5ld1N0YXRlIiwic2FtZVN0YXRlIiwiY2hhbmdlZDEiLCJjaGFuZ2VkMiIsImNoYW5nZWQzIiwiZmllbGRTdGF0ZUNvbmZpZ1Nob3dpbmciLCJmaWVsZFN0YXRlQ29uZmlnTm90U2hvd2luZyIsImYiLCJmaWVsZFN0YXRlSXNSZXF1aXJlZCIsImZpZWxkU3RhdGVJc05vdFJlcXVpcmVkIiwidG9CZURlbGV0ZWRGaWVsZFN0YXRlIiwiZmllbGREZWxldGVBY3Rpb24iLCJyZWNlbnRIaXN0b3J5U3RhdGUiLCJtb2NrRmllbGQxIiwibW9ja0ZpZWxkMiIsIm1vY2tGaWVsZDMiLCJtb2NrU3RhdGUyIiwib2xkRmllbGRTdGF0ZSIsImNvbG9yIiwiZmllbGRVcGRhdGVBY3Rpb24iLCJpc1NhbWUiLCJzdGF0ZTEiLCJzdGF0ZTIiLCJzYW1lU3RhdGUxIiwic2FtZVN0YXRlMiIsInNhbWVTdGF0ZTMiLCJzYW1lU3RhdGU0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUlBLEFBQU8sTUFBTUEsT0FBT0MsTUFDbkI7UUFDTztDQUZZLENBQWI7O0FBS1AsQUFBTyxNQUFNQyxjQUFjQyxtQkFDMUI7UUFDTyxhQURQOztDQUQwQixDQUFwQjs7QUFNUCxBQUFPLE1BQU1DLGNBQWNDLGNBQzFCO1FBQ08sYUFEUDs7Q0FEMEIsQ0FBcEI7O0FBTVAsQUFBTyxNQUFNQyxlQUFlQyxzQkFDM0I7UUFDTyxjQURQOztDQUQyQixDQUFyQjs7QUFNUCxBQUFPLE1BQU1DLGVBQWVDLGVBQzNCO1FBQ08sY0FEUDs7Q0FEMkIsQ0FBckI7O0FBTVAsQUFBTyxNQUFNQyxpQkFBaUJELGVBQzdCO1FBQ08sZ0JBRFA7O0NBRDZCLENBQXZCOztBQU1QLEFBQU8sTUFBTUUsY0FBY0YsZUFDMUI7UUFDTyxhQURQOztDQUQwQixDQUFwQjs7QUFNUCxBQUFP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RUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzlFLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbEYsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDdEYsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzFGLEtBQUssQ0FBQyxFQUFFLE9BQU8sU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUYsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbEcsS0FBSyxFQUFF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