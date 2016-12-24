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
const propertyTypeCheck = curry$1((propertyName, type, obj) => typeof obj[propertyName] === type ? index.Right(obj) : index.Left(`Property '${ propertyName }' cannot be of type ${ typeof obj[propertyName] }`));

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

/* eslint-env jasmine */
/* eslint-disable quote-props */

const templateField = {
  type: "fictitious-instance",
  required: false,
  configShowing: false,
  id: "0"
};
const field1 = Object.assign({}, templateField, { id: "1" });
const field2 = Object.assign({}, templateField, { id: "2" });
const field3 = Object.assign({}, templateField, { id: "3" });
const mockCurrentState$5 = [field1, field2, field3];
const mockHistory$5 = [];
const mockState$8 = {
  fieldTypes: [{ info: { type: "fictitious-instance" } }],
  fieldsState: mockCurrentState$5,
  fieldsStateHistory: mockHistory$5
};

const newOrder = ["2", "3", "1"];
const reorderFieldsAction = reorderFields(newOrder);
const newState$3 = update(mockState$8, reorderFieldsAction);

describe("Update.reorderFields", () => {
  it("outputs a state with fields in the new order", () => {
    expect(newState$3.fieldsState.length).toEqual(mockState$8.fieldsState.length);
    expect(newState$3.fieldsState[0].id).toEqual(newOrder[0]);
    expect(newState$3.fieldsState[1].id).toEqual(newOrder[1]);
    expect(newState$3.fieldsState[2].id).toEqual(newOrder[2]);
  });

  it("sends the current state to history", () => {
    expect(newState$3.fieldsStateHistory[0][0].id).toEqual(mockCurrentState$5[0].id);
    expect(newState$3.fieldsStateHistory[0][1].id).toEqual(mockCurrentState$5[1].id);
    expect(newState$3.fieldsStateHistory[0][2].id).toEqual(mockCurrentState$5[2].id);
  });

  it("Returns the current state if any field id is missing", () => {
    const sameState = update(mockState$8, reorderFields(["1", "2"]));
    expect(sameState.fieldTypes.length).toEqual(mockState$8.fieldTypes.length);
    expect(sameState.fieldsState[0].id).toEqual(mockState$8.fieldsState[0].id);
    expect(sameState.fieldsState[1].id).toEqual(mockState$8.fieldsState[1].id);
    expect(sameState.fieldsState[2].id).toEqual(mockState$8.fieldsState[2].id);
    expect(sameState.fieldsState.length).toEqual(mockState$8.fieldsState.length);
    expect(sameState.fieldsStateHistory.length).toEqual(mockState$8.fieldsStateHistory.length);
  });

  it("Returns the current state if the reorder array has more elements than it should", () => {
    const sameState = update(mockState$8, reorderFields(["1", "2", "3", "4"]));
    expect(sameState.fieldTypes.length).toEqual(mockState$8.fieldTypes.length);
    expect(sameState.fieldsState[0].id).toEqual(mockState$8.fieldsState[0].id);
    expect(sameState.fieldsState[1].id).toEqual(mockState$8.fieldsState[1].id);
    expect(sameState.fieldsState[2].id).toEqual(mockState$8.fieldsState[2].id);
    expect(sameState.fieldsState.length).toEqual(mockState$8.fieldsState.length);
    expect(sameState.fieldsStateHistory.length).toEqual(mockState$8.fieldsStateHistory.length);
  });

  it("does not break the state after creating one object", () => {
    const changed1 = update(mockState$8, reorderFields(["1", "2", "3"]));
    const changed2 = update(changed1, reorderFields(["3", "1", "2"]));
    const changed3 = update(changed2, reorderFields(["3", "2", "1"]));
    expect(changed3.fieldTypes.length).toEqual(mockState$8.fieldTypes.length);
    expect(changed3.fieldsState.length).toEqual(mockCurrentState$5.length);
    expect(changed3.fieldsStateHistory.length).toEqual(3);
    expect(changed3.fieldsState[0].id).toEqual("3");
    expect(changed3.fieldsState[1].id).toEqual("2");
    expect(changed3.fieldsState[2].id).toEqual("1");
  });
});

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL2pzL0FjdGlvbnMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy9hY3Rpb25zLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvc2VhbWxlc3MtaW1tdXRhYmxlL3NyYy9zZWFtbGVzcy1pbW11dGFibGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy91dGlscy9hc3luY0Rpc3BhdGNoTWlkZGxld2FyZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3V0aWxzLmFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZmwtYXNzZXJ0L2Rpc3QvYXNzZXJ0LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc0FycmF5LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19zbGljZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fY2hlY2tGb3JNZXRob2QuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lzUGxhY2Vob2xkZXIuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2N1cnJ5MS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fY3VycnkyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jdXJyeTMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2xpY2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvb3Zlci5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9hbHdheXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2V0LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19hcml0eS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fcGlwZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feHdyYXAuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvYmluZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9faXNTdHJpbmcuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaXNBcnJheUxpa2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3JlZHVjZS5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9yZWR1Y2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvdGFpbC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9waXBlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jb25jYXQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvcHJlcGVuZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9wcm9wLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc1RyYW5zZm9ybWVyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19kaXNwYXRjaGFibGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX21hcC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feGZCYXNlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL194bWFwLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19jdXJyeU4uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvY3VycnlOLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19oYXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lzQXJndW1lbnRzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2tleXMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvbWFwLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2xlbnMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvY3VycnkuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLmVpdGhlci9saWIvZWl0aGVyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZGF0YS5laXRoZXIvbGliL2luZGV4LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL3V0aWxzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL3VuZG8uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2lkZW50aXR5LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2lkZW50aXR5LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL3BhdGguanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvYXAuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvcmVkdWNlUmlnaHQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc2VxdWVuY2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvdHJhdmVyc2UuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2FycmF5RnJvbUl0ZXJhdG9yLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19mdW5jdGlvbk5hbWUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaWRlbnRpY2FsLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL3R5cGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX2VxdWFscy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9lcXVhbHMuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvaW1wb3J0U3RhdGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3JlZHVjZWQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvaW50ZXJuYWwvX3hmaW5kLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ZpbmQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLnRhc2svbGliL3Rhc2suanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9kYXRhLnRhc2svbGliL2luZGV4LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL2NyZWF0ZUZpZWxkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2FwcGVuZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL2RhdGEubWF5YmUvbGliL21heWJlLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvZGF0YS5tYXliZS9saWIvaW5kZXguanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvZmllbGRDcmVhdGVkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL2ZpZWxkLnRvZ2dsZUNvbmZpZy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL2pzL1VwZGF0ZS9maWVsZC50b2dnbGVSZXF1aXJlZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9fZmlsdGVyLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9ub2RlX21vZHVsZXMvcmFtZGEvc3JjL2ludGVybmFsL19pc09iamVjdC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9pbnRlcm5hbC9feGZpbHRlci5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvbm9kZV9tb2R1bGVzL3JhbWRhL3NyYy9maWx0ZXIuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvZmllbGQuZGVsZXRlRmllbGQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy9qcy9VcGRhdGUvZmllbGQudXBkYXRlRmllbGQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL25vZGVfbW9kdWxlcy9yYW1kYS9zcmMvc29ydC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL2pzL1VwZGF0ZS9yZW9yZGVyRmllbGRzLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvanMvVXBkYXRlL2luZGV4LmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvdGVzdHMvdXBkYXRlL3VuZG8uanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy91cGRhdGUvaW1wb3J0U3RhdGUuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy91cGRhdGUvY3JlYXRlRmllbGQuanMiLCIvaG9tZS9tYXJjZWxvL1Byb2dyYW1zL0ZvdXJMYWJzL0NvbXBvbmVudHMvZmwtZm9ybS1idWlsZGVyL3NyYy90ZXN0cy91cGRhdGUvZmllbGRDcmVhdGVkLmpzIiwiL2hvbWUvbWFyY2Vsby9Qcm9ncmFtcy9Gb3VyTGFicy9Db21wb25lbnRzL2ZsLWZvcm0tYnVpbGRlci9zcmMvdGVzdHMvdXBkYXRlL2ZpZWxkLnRvZ2dsZUNvbmZpZy5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3VwZGF0ZS9maWVsZC50b2dnbGVSZXF1aXJlZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3VwZGF0ZS9maWVsZC5kZWxldGVGaWVsZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3VwZGF0ZS9maWVsZC51cGRhdGVGaWVsZC5qcyIsIi9ob21lL21hcmNlbG8vUHJvZ3JhbXMvRm91ckxhYnMvQ29tcG9uZW50cy9mbC1mb3JtLWJ1aWxkZXIvc3JjL3Rlc3RzL3VwZGF0ZS9yZW9yZGVyRmllbGRzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vXG4vLyAgICBBQ1RJT04gQ1JFQVRPUlNcbi8vXG5cbmV4cG9ydCBjb25zdCB1bmRvID0gXyA9PlxuKHtcbiAgdHlwZTogXCJ1bmRvXCIsXG59KTtcblxuZXhwb3J0IGNvbnN0IGltcG9ydFN0YXRlID0gbmV3RmllbGRzU3RhdGUgPT5cbih7XG4gIHR5cGU6IFwiaW1wb3J0U3RhdGVcIixcbiAgbmV3RmllbGRzU3RhdGUsXG59KTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUZpZWxkID0gZmllbGRUeXBlID0+XG4oe1xuICB0eXBlOiBcImNyZWF0ZUZpZWxkXCIsXG4gIGZpZWxkVHlwZSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZmllbGRDcmVhdGVkID0gY3JlYXRlZEZpZWxkU3RhdGUgPT5cbih7XG4gIHR5cGU6IFwiZmllbGRDcmVhdGVkXCIsXG4gIGNyZWF0ZWRGaWVsZFN0YXRlLFxufSk7XG5cbmV4cG9ydCBjb25zdCB0b2dnbGVDb25maWcgPSBmaWVsZFN0YXRlID0+XG4oe1xuICB0eXBlOiBcInRvZ2dsZUNvbmZpZ1wiLFxuICBmaWVsZFN0YXRlLFxufSk7XG5cbmV4cG9ydCBjb25zdCB0b2dnbGVSZXF1aXJlZCA9IGZpZWxkU3RhdGUgPT5cbih7XG4gIHR5cGU6IFwidG9nZ2xlUmVxdWlyZWRcIixcbiAgZmllbGRTdGF0ZSxcbn0pO1xuXG5leHBvcnQgY29uc3QgZGVsZXRlRmllbGQgPSBmaWVsZFN0YXRlID0+XG4oe1xuICB0eXBlOiBcImRlbGV0ZUZpZWxkXCIsXG4gIGZpZWxkU3RhdGUsXG59KTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUZpZWxkID0gbmV3RmllbGRTdGF0ZSA9PlxuKHtcbiAgdHlwZTogXCJ1cGRhdGVGaWVsZFwiLFxuICBuZXdGaWVsZFN0YXRlLFxufSk7XG5cbmV4cG9ydCBjb25zdCByZW9yZGVyRmllbGRzID0gbmV3RmllbGRzT3JkZXIgPT5cbih7XG4gIHR5cGU6IFwicmVvcmRlckZpZWxkc1wiLFxuICBuZXdGaWVsZHNPcmRlcixcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmltcG9ydCB7XG4gIHVuZG8sXG4gIGltcG9ydFN0YXRlLFxuICBjcmVhdGVGaWVsZCxcbiAgZmllbGRDcmVhdGVkLFxuICB0b2dnbGVDb25maWcsXG4gIHRvZ2dsZVJlcXVpcmVkLFxuICBkZWxldGVGaWVsZCxcbiAgdXBkYXRlRmllbGQsXG4gIHJlb3JkZXJGaWVsZHMsXG59IGZyb20gXCIuLi9qcy9BY3Rpb25zXCI7XG5cbmRlc2NyaWJlKFwiQWN0aW9uXCIsICgpID0+IHtcbiAgZGVzY3JpYmUoXCJ1bmRvXCIsICgpID0+IHtcbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gdW5kbygpO1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwidW5kb1wiKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJpbXBvcnRTdGF0ZVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1N0YXRlVG9JbXBvcnQgPSBbXCJhXCIsIFwiYlwiXTtcblxuICAgIGl0KFwicmV0dXJucyB0aGUgY29ycmVjdCBhY3Rpb24gdHlwZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSBpbXBvcnRTdGF0ZShtb2NrU3RhdGVUb0ltcG9ydCk7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJpbXBvcnRTdGF0ZVwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiQ3JlYXRlcyB0aGUgY29ycmVjdCB2YXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gaW1wb3J0U3RhdGUobW9ja1N0YXRlVG9JbXBvcnQpO1xuICAgICAgZXhwZWN0KGFjdGlvbi5uZXdGaWVsZHNTdGF0ZSkudG9FcXVhbChtb2NrU3RhdGVUb0ltcG9ydCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiY3JlYXRlRmllbGRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGZpZWxkVHlwZSA9IFwidGVzdEZpZWxkXCI7XG5cbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gY3JlYXRlRmllbGQoZmllbGRUeXBlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChcImNyZWF0ZUZpZWxkXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJDcmVhdGVzIHRoZSBjb3JyZWN0IHZhcmlhYmxlc1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSBjcmVhdGVGaWVsZChmaWVsZFR5cGUpO1xuICAgICAgZXhwZWN0KGFjdGlvbi5maWVsZFR5cGUpLnRvRXF1YWwoZmllbGRUeXBlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJmaWVsZENyZWF0ZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGNyZWF0ZWRGaWVsZFN0YXRlID0ge307XG5cbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gZmllbGRDcmVhdGVkKGNyZWF0ZWRGaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChcImZpZWxkQ3JlYXRlZFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiQ3JlYXRlcyB0aGUgY29ycmVjdCB2YXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gZmllbGRDcmVhdGVkKGNyZWF0ZWRGaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUpLnRvRXF1YWwoY3JlYXRlZEZpZWxkU3RhdGUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcInRvZ2dsZUNvbmZpZ1wiLCAoKSA9PiB7XG4gICAgY29uc3QgZmllbGRTdGF0ZSA9IHt9O1xuXG4gICAgaXQoXCJyZXR1cm5zIHRoZSBjb3JyZWN0IGFjdGlvbiB0eXBlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHRvZ2dsZUNvbmZpZyhmaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChcInRvZ2dsZUNvbmZpZ1wiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiQ3JlYXRlcyB0aGUgY29ycmVjdCB2YXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gdG9nZ2xlQ29uZmlnKGZpZWxkU3RhdGUpO1xuICAgICAgZXhwZWN0KGFjdGlvbi5maWVsZFN0YXRlKS50b0VxdWFsKGZpZWxkU3RhdGUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcInRvZ2dsZVJlcXVpcmVkXCIsICgpID0+IHtcbiAgICBjb25zdCBmaWVsZFN0YXRlID0ge307XG5cbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gdG9nZ2xlUmVxdWlyZWQoZmllbGRTdGF0ZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJ0b2dnbGVSZXF1aXJlZFwiKTtcbiAgICB9KTtcblxuICAgIGl0KFwiQ3JlYXRlcyB0aGUgY29ycmVjdCB2YXJpYWJsZXNcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gdG9nZ2xlUmVxdWlyZWQoZmllbGRTdGF0ZSk7XG4gICAgICBleHBlY3QoYWN0aW9uLmZpZWxkU3RhdGUpLnRvRXF1YWwoZmllbGRTdGF0ZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiZGVsZXRlRmllbGRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGZpZWxkU3RhdGUgPSB7fTtcblxuICAgIGl0KFwicmV0dXJucyB0aGUgY29ycmVjdCBhY3Rpb24gdHlwZVwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSBkZWxldGVGaWVsZChmaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChcImRlbGV0ZUZpZWxkXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJDcmVhdGVzIHRoZSBjb3JyZWN0IHZhcmlhYmxlc1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSBkZWxldGVGaWVsZChmaWVsZFN0YXRlKTtcbiAgICAgIGV4cGVjdChhY3Rpb24uZmllbGRTdGF0ZSkudG9FcXVhbChmaWVsZFN0YXRlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJ1cGRhdGVGaWVsZFwiLCAoKSA9PiB7XG4gICAgY29uc3QgbmV3RmllbGRTdGF0ZSA9IHt9O1xuXG4gICAgaXQoXCJyZXR1cm5zIHRoZSBjb3JyZWN0IGFjdGlvbiB0eXBlXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHVwZGF0ZUZpZWxkKG5ld0ZpZWxkU3RhdGUpO1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwidXBkYXRlRmllbGRcIik7XG4gICAgfSk7XG5cbiAgICBpdChcIkNyZWF0ZXMgdGhlIGNvcnJlY3QgdmFyaWFibGVzXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHVwZGF0ZUZpZWxkKG5ld0ZpZWxkU3RhdGUpO1xuICAgICAgZXhwZWN0KGFjdGlvbi5uZXdGaWVsZFN0YXRlKS50b0VxdWFsKG5ld0ZpZWxkU3RhdGUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZShcInJlb3JkZXJGaWVsZHNcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG5ld0ZpZWxkc09yZGVyID0ge307XG5cbiAgICBpdChcInJldHVybnMgdGhlIGNvcnJlY3QgYWN0aW9uIHR5cGVcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgYWN0aW9uID0gcmVvcmRlckZpZWxkcyhuZXdGaWVsZHNPcmRlcik7XG4gICAgICBleHBlY3QoYWN0aW9uLnR5cGUpLnRvRXF1YWwoXCJyZW9yZGVyRmllbGRzXCIpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJDcmVhdGVzIHRoZSBjb3JyZWN0IHZhcmlhYmxlc1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb24gPSByZW9yZGVyRmllbGRzKG5ld0ZpZWxkc09yZGVyKTtcbiAgICAgIGV4cGVjdChhY3Rpb24ubmV3RmllbGRzT3JkZXIpLnRvRXF1YWwobmV3RmllbGRzT3JkZXIpO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBpbW11dGFibGVJbml0KGNvbmZpZykge1xuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL3YxNS4wLjEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjFcbiAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLmZvciAmJiBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50Jyk7XG4gIHZhciBSRUFDVF9FTEVNRU5UX1RZUEVfRkFMTEJBQ0sgPSAweGVhYzc7XG5cbiAgdmFyIGdsb2JhbENvbmZpZyA9IHtcbiAgICB1c2Vfc3RhdGljOiBmYWxzZVxuICB9O1xuICBpZiAoaXNPYmplY3QoY29uZmlnKSkge1xuICAgICAgaWYgKGNvbmZpZy51c2Vfc3RhdGljICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBnbG9iYWxDb25maWcudXNlX3N0YXRpYyA9IEJvb2xlYW4oY29uZmlnLnVzZV9zdGF0aWMpO1xuICAgICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNPYmplY3QoZGF0YSkge1xuICAgIHJldHVybiAoXG4gICAgICB0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICFBcnJheS5pc0FycmF5KGRhdGEpICYmXG4gICAgICBkYXRhICE9PSBudWxsXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc3RhbnRpYXRlRW1wdHlPYmplY3Qob2JqKSB7XG4gICAgICB2YXIgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG4gICAgICBpZiAoIXByb3RvdHlwZSkge1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTtcbiAgICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFByb3BlcnR5VG8odGFyZ2V0LCBtZXRob2ROYW1lLCB2YWx1ZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG1ldGhvZE5hbWUsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYmFuUHJvcGVydHkodGFyZ2V0LCBtZXRob2ROYW1lKSB7XG4gICAgYWRkUHJvcGVydHlUbyh0YXJnZXQsIG1ldGhvZE5hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgbmV3IEltbXV0YWJsZUVycm9yKFwiVGhlIFwiICsgbWV0aG9kTmFtZSArXG4gICAgICAgIFwiIG1ldGhvZCBjYW5ub3QgYmUgaW52b2tlZCBvbiBhbiBJbW11dGFibGUgZGF0YSBzdHJ1Y3R1cmUuXCIpO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIGltbXV0YWJpbGl0eVRhZyA9IFwiX19pbW11dGFibGVfaW52YXJpYW50c19ob2xkXCI7XG5cbiAgZnVuY3Rpb24gYWRkSW1tdXRhYmlsaXR5VGFnKHRhcmdldCkge1xuICAgIGFkZFByb3BlcnR5VG8odGFyZ2V0LCBpbW11dGFiaWxpdHlUYWcsIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNJbW11dGFibGUodGFyZ2V0KSB7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHJldHVybiB0YXJnZXQgPT09IG51bGwgfHwgQm9vbGVhbihcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGltbXV0YWJpbGl0eVRhZylcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEluIEphdmFTY3JpcHQsIG9ubHkgb2JqZWN0cyBhcmUgZXZlbiBwb3RlbnRpYWxseSBtdXRhYmxlLlxuICAgICAgLy8gc3RyaW5ncywgbnVtYmVycywgbnVsbCwgYW5kIHVuZGVmaW5lZCBhcmUgYWxsIG5hdHVyYWxseSBpbW11dGFibGUuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc0VxdWFsKGEsIGIpIHtcbiAgICAvLyBBdm9pZCBmYWxzZSBwb3NpdGl2ZXMgZHVlIHRvIChOYU4gIT09IE5hTikgZXZhbHVhdGluZyB0byB0cnVlXG4gICAgcmV0dXJuIChhID09PSBiIHx8IChhICE9PSBhICYmIGIgIT09IGIpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTWVyZ2FibGVPYmplY3QodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRhcmdldCAhPT0gbnVsbCAmJiB0eXBlb2YgdGFyZ2V0ID09PSBcIm9iamVjdFwiICYmICEoQXJyYXkuaXNBcnJheSh0YXJnZXQpKSAmJiAhKHRhcmdldCBpbnN0YW5jZW9mIERhdGUpO1xuICB9XG5cbiAgdmFyIG11dGF0aW5nT2JqZWN0TWV0aG9kcyA9IFtcbiAgICBcInNldFByb3RvdHlwZU9mXCJcbiAgXTtcblxuICB2YXIgbm9uTXV0YXRpbmdPYmplY3RNZXRob2RzID0gW1xuICAgIFwia2V5c1wiXG4gIF07XG5cbiAgdmFyIG11dGF0aW5nQXJyYXlNZXRob2RzID0gbXV0YXRpbmdPYmplY3RNZXRob2RzLmNvbmNhdChbXG4gICAgXCJwdXNoXCIsIFwicG9wXCIsIFwic29ydFwiLCBcInNwbGljZVwiLCBcInNoaWZ0XCIsIFwidW5zaGlmdFwiLCBcInJldmVyc2VcIlxuICBdKTtcblxuICB2YXIgbm9uTXV0YXRpbmdBcnJheU1ldGhvZHMgPSBub25NdXRhdGluZ09iamVjdE1ldGhvZHMuY29uY2F0KFtcbiAgICBcIm1hcFwiLCBcImZpbHRlclwiLCBcInNsaWNlXCIsIFwiY29uY2F0XCIsIFwicmVkdWNlXCIsIFwicmVkdWNlUmlnaHRcIlxuICBdKTtcblxuICB2YXIgbXV0YXRpbmdEYXRlTWV0aG9kcyA9IG11dGF0aW5nT2JqZWN0TWV0aG9kcy5jb25jYXQoW1xuICAgIFwic2V0RGF0ZVwiLCBcInNldEZ1bGxZZWFyXCIsIFwic2V0SG91cnNcIiwgXCJzZXRNaWxsaXNlY29uZHNcIiwgXCJzZXRNaW51dGVzXCIsIFwic2V0TW9udGhcIiwgXCJzZXRTZWNvbmRzXCIsXG4gICAgXCJzZXRUaW1lXCIsIFwic2V0VVRDRGF0ZVwiLCBcInNldFVUQ0Z1bGxZZWFyXCIsIFwic2V0VVRDSG91cnNcIiwgXCJzZXRVVENNaWxsaXNlY29uZHNcIiwgXCJzZXRVVENNaW51dGVzXCIsXG4gICAgXCJzZXRVVENNb250aFwiLCBcInNldFVUQ1NlY29uZHNcIiwgXCJzZXRZZWFyXCJcbiAgXSk7XG5cbiAgZnVuY3Rpb24gSW1tdXRhYmxlRXJyb3IobWVzc2FnZSkge1xuICAgIHZhciBlcnIgICAgICAgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgLy8gVE9ETzogQ29uc2lkZXIgYE9iamVjdC5zZXRQcm90b3R5cGVPZihlcnIsIEltbXV0YWJsZUVycm9yKTtgXG4gICAgZXJyLl9fcHJvdG9fXyA9IEltbXV0YWJsZUVycm9yO1xuXG4gICAgcmV0dXJuIGVycjtcbiAgfVxuICBJbW11dGFibGVFcnJvci5wcm90b3R5cGUgPSBFcnJvci5wcm90b3R5cGU7XG5cbiAgZnVuY3Rpb24gbWFrZUltbXV0YWJsZShvYmosIGJhbm5lZE1ldGhvZHMpIHtcbiAgICAvLyBUYWcgaXQgc28gd2UgY2FuIHF1aWNrbHkgdGVsbCBpdCdzIGltbXV0YWJsZSBsYXRlci5cbiAgICBhZGRJbW11dGFiaWxpdHlUYWcob2JqKTtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgIC8vIE1ha2UgYWxsIG11dGF0aW5nIG1ldGhvZHMgdGhyb3cgZXhjZXB0aW9ucy5cbiAgICAgIGZvciAodmFyIGluZGV4IGluIGJhbm5lZE1ldGhvZHMpIHtcbiAgICAgICAgaWYgKGJhbm5lZE1ldGhvZHMuaGFzT3duUHJvcGVydHkoaW5kZXgpKSB7XG4gICAgICAgICAgYmFuUHJvcGVydHkob2JqLCBiYW5uZWRNZXRob2RzW2luZGV4XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRnJlZXplIGl0IGFuZCByZXR1cm4gaXQuXG4gICAgICBPYmplY3QuZnJlZXplKG9iaik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VNZXRob2RSZXR1cm5JbW11dGFibGUob2JqLCBtZXRob2ROYW1lKSB7XG4gICAgdmFyIGN1cnJlbnRNZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XG5cbiAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgbWV0aG9kTmFtZSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gSW1tdXRhYmxlKGN1cnJlbnRNZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5U2V0KGlkeCwgdmFsdWUsIGNvbmZpZykge1xuICAgIHZhciBkZWVwICAgICAgICAgID0gY29uZmlnICYmIGNvbmZpZy5kZWVwO1xuXG4gICAgaWYgKGlkeCBpbiB0aGlzKSB7XG4gICAgICBpZiAoZGVlcCAmJiB0aGlzW2lkeF0gIT09IHZhbHVlICYmIGlzTWVyZ2FibGVPYmplY3QodmFsdWUpICYmIGlzTWVyZ2FibGVPYmplY3QodGhpc1tpZHhdKSkge1xuICAgICAgICB2YWx1ZSA9IEltbXV0YWJsZS5tZXJnZSh0aGlzW2lkeF0sIHZhbHVlLCB7ZGVlcDogdHJ1ZSwgbW9kZTogJ3JlcGxhY2UnfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNFcXVhbCh0aGlzW2lkeF0sIHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbXV0YWJsZSA9IGFzTXV0YWJsZUFycmF5LmNhbGwodGhpcyk7XG4gICAgbXV0YWJsZVtpZHhdID0gSW1tdXRhYmxlKHZhbHVlKTtcbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZUFycmF5KG11dGFibGUpO1xuICB9XG5cbiAgdmFyIGltbXV0YWJsZUVtcHR5QXJyYXkgPSBJbW11dGFibGUoW10pO1xuXG4gIGZ1bmN0aW9uIGFycmF5U2V0SW4ocHRoLCB2YWx1ZSwgY29uZmlnKSB7XG4gICAgdmFyIGhlYWQgPSBwdGhbMF07XG5cbiAgICBpZiAocHRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGFycmF5U2V0LmNhbGwodGhpcywgaGVhZCwgdmFsdWUsIGNvbmZpZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB0YWlsID0gcHRoLnNsaWNlKDEpO1xuICAgICAgdmFyIHRoaXNIZWFkID0gdGhpc1toZWFkXTtcbiAgICAgIHZhciBuZXdWYWx1ZTtcblxuICAgICAgaWYgKHR5cGVvZih0aGlzSGVhZCkgPT09IFwib2JqZWN0XCIgJiYgdGhpc0hlYWQgIT09IG51bGwpIHtcbiAgICAgICAgLy8gTWlnaHQgKHZhbGlkbHkpIGJlIG9iamVjdCBvciBhcnJheVxuICAgICAgICBuZXdWYWx1ZSA9IEltbXV0YWJsZS5zZXRJbih0aGlzSGVhZCwgdGFpbCwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5leHRIZWFkID0gdGFpbFswXTtcbiAgICAgICAgLy8gSWYgdGhlIG5leHQgcGF0aCBwYXJ0IGlzIGEgbnVtYmVyLCB0aGVuIHdlIGFyZSBzZXR0aW5nIGludG8gYW4gYXJyYXksIGVsc2UgYW4gb2JqZWN0LlxuICAgICAgICBpZiAobmV4dEhlYWQgIT09ICcnICYmIGlzRmluaXRlKG5leHRIZWFkKSkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gYXJyYXlTZXRJbi5jYWxsKGltbXV0YWJsZUVtcHR5QXJyYXksIHRhaWwsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IG9iamVjdFNldEluLmNhbGwoaW1tdXRhYmxlRW1wdHlPYmplY3QsIHRhaWwsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaGVhZCBpbiB0aGlzICYmIHRoaXNIZWFkID09PSBuZXdWYWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIG11dGFibGUgPSBhc011dGFibGVBcnJheS5jYWxsKHRoaXMpO1xuICAgICAgbXV0YWJsZVtoZWFkXSA9IG5ld1ZhbHVlO1xuICAgICAgcmV0dXJuIG1ha2VJbW11dGFibGVBcnJheShtdXRhYmxlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlSW1tdXRhYmxlQXJyYXkoYXJyYXkpIHtcbiAgICAvLyBEb24ndCBjaGFuZ2UgdGhlaXIgaW1wbGVtZW50YXRpb25zLCBidXQgd3JhcCB0aGVzZSBmdW5jdGlvbnMgdG8gbWFrZSBzdXJlXG4gICAgLy8gdGhleSBhbHdheXMgcmV0dXJuIGFuIGltbXV0YWJsZSB2YWx1ZS5cbiAgICBmb3IgKHZhciBpbmRleCBpbiBub25NdXRhdGluZ0FycmF5TWV0aG9kcykge1xuICAgICAgaWYgKG5vbk11dGF0aW5nQXJyYXlNZXRob2RzLmhhc093blByb3BlcnR5KGluZGV4KSkge1xuICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IG5vbk11dGF0aW5nQXJyYXlNZXRob2RzW2luZGV4XTtcbiAgICAgICAgbWFrZU1ldGhvZFJldHVybkltbXV0YWJsZShhcnJheSwgbWV0aG9kTmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFnbG9iYWxDb25maWcudXNlX3N0YXRpYykge1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJmbGF0TWFwXCIsICBmbGF0TWFwKTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwiYXNPYmplY3RcIiwgYXNPYmplY3QpO1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJhc011dGFibGVcIiwgYXNNdXRhYmxlQXJyYXkpO1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJzZXRcIiwgYXJyYXlTZXQpO1xuICAgICAgYWRkUHJvcGVydHlUbyhhcnJheSwgXCJzZXRJblwiLCBhcnJheVNldEluKTtcbiAgICAgIGFkZFByb3BlcnR5VG8oYXJyYXksIFwidXBkYXRlXCIsIHVwZGF0ZSk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKGFycmF5LCBcInVwZGF0ZUluXCIsIHVwZGF0ZUluKTtcbiAgICB9XG5cbiAgICBmb3IodmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYXJyYXlbaV0gPSBJbW11dGFibGUoYXJyYXlbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlKGFycmF5LCBtdXRhdGluZ0FycmF5TWV0aG9kcyk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlSW1tdXRhYmxlRGF0ZShkYXRlKSB7XG4gICAgaWYgKCFnbG9iYWxDb25maWcudXNlX3N0YXRpYykge1xuICAgICAgYWRkUHJvcGVydHlUbyhkYXRlLCBcImFzTXV0YWJsZVwiLCBhc011dGFibGVEYXRlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZShkYXRlLCBtdXRhdGluZ0RhdGVNZXRob2RzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzTXV0YWJsZURhdGUoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMuZ2V0VGltZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFZmZlY3RpdmVseSBwZXJmb3JtcyBhIG1hcCgpIG92ZXIgdGhlIGVsZW1lbnRzIGluIHRoZSBhcnJheSwgdXNpbmcgdGhlXG4gICAqIHByb3ZpZGVkIGl0ZXJhdG9yLCBleGNlcHQgdGhhdCB3aGVuZXZlciB0aGUgaXRlcmF0b3IgcmV0dXJucyBhbiBhcnJheSwgdGhhdFxuICAgKiBhcnJheSdzIGVsZW1lbnRzIGFyZSBhZGRlZCB0byB0aGUgZmluYWwgcmVzdWx0IGluc3RlYWQgb2YgdGhlIGFycmF5IGl0c2VsZi5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gaXRlcmF0b3IgLSBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGludm9rZWQgb24gZWFjaCBlbGVtZW50IGluIHRoZSBhcnJheS4gSXQgd2lsbCByZWNlaXZlIHRocmVlIGFyZ3VtZW50czogdGhlIGN1cnJlbnQgdmFsdWUsIHRoZSBjdXJyZW50IGluZGV4LCBhbmQgdGhlIGN1cnJlbnQgb2JqZWN0LlxuICAgKi9cbiAgZnVuY3Rpb24gZmxhdE1hcChpdGVyYXRvcikge1xuICAgIC8vIENhbGxpbmcgLmZsYXRNYXAoKSB3aXRoIG5vIGFyZ3VtZW50cyBpcyBhIG5vLW9wLiBEb24ndCBib3RoZXIgY2xvbmluZy5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgaW5kZXg7XG5cbiAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBpdGVyYXRvclJlc3VsdCA9IGl0ZXJhdG9yKHRoaXNbaW5kZXhdLCBpbmRleCwgdGhpcyk7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZXJhdG9yUmVzdWx0KSkge1xuICAgICAgICAvLyBDb25jYXRlbmF0ZSBBcnJheSByZXN1bHRzIGludG8gdGhlIHJldHVybiB2YWx1ZSB3ZSdyZSBidWlsZGluZyB1cC5cbiAgICAgICAgcmVzdWx0LnB1c2guYXBwbHkocmVzdWx0LCBpdGVyYXRvclJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBIYW5kbGUgbm9uLUFycmF5IHJlc3VsdHMgdGhlIHNhbWUgd2F5IG1hcCgpIGRvZXMuXG4gICAgICAgIHJlc3VsdC5wdXNoKGl0ZXJhdG9yUmVzdWx0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWFrZUltbXV0YWJsZUFycmF5KHJlc3VsdCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBJbW11dGFibGUgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGdpdmVuIGtleXMgaW5jbHVkZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXl9IGtleXNUb1JlbW92ZSAtIEEgbGlzdCBvZiBzdHJpbmdzIHJlcHJlc2VudGluZyB0aGUga2V5cyB0byBleGNsdWRlIGluIHRoZSByZXR1cm4gdmFsdWUuIEluc3RlYWQgb2YgcHJvdmlkaW5nIGEgc2luZ2xlIGFycmF5LCB0aGlzIG1ldGhvZCBjYW4gYWxzbyBiZSBjYWxsZWQgYnkgcGFzc2luZyBtdWx0aXBsZSBzdHJpbmdzIGFzIHNlcGFyYXRlIGFyZ3VtZW50cy5cbiAgICovXG4gIGZ1bmN0aW9uIHdpdGhvdXQocmVtb3ZlKSB7XG4gICAgLy8gQ2FsbGluZyAud2l0aG91dCgpIHdpdGggbm8gYXJndW1lbnRzIGlzIGEgbm8tb3AuIERvbid0IGJvdGhlciBjbG9uaW5nLlxuICAgIGlmICh0eXBlb2YgcmVtb3ZlID09PSBcInVuZGVmaW5lZFwiICYmIGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcmVtb3ZlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIC8vIElmIHdlIHdlcmVuJ3QgZ2l2ZW4gYW4gYXJyYXksIHVzZSB0aGUgYXJndW1lbnRzIGxpc3QuXG4gICAgICB2YXIga2V5c1RvUmVtb3ZlQXJyYXkgPSAoQXJyYXkuaXNBcnJheShyZW1vdmUpKSA/XG4gICAgICAgICByZW1vdmUuc2xpY2UoKSA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgIC8vIENvbnZlcnQgbnVtZXJpYyBrZXlzIHRvIHN0cmluZ3Mgc2luY2UgdGhhdCdzIGhvdyB0aGV5J2xsXG4gICAgICAvLyBjb21lIGZyb20gdGhlIGVudW1lcmF0aW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICBrZXlzVG9SZW1vdmVBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGVsLCBpZHgsIGFycikge1xuICAgICAgICBpZih0eXBlb2YoZWwpID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgYXJyW2lkeF0gPSBlbC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmVtb3ZlID0gZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleXNUb1JlbW92ZUFycmF5LmluZGV4T2Yoa2V5KSAhPT0gLTE7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KHRoaXMpO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMpIHtcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkgJiYgcmVtb3ZlKHRoaXNba2V5XSwga2V5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ha2VJbW11dGFibGVPYmplY3QocmVzdWx0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzTXV0YWJsZUFycmF5KG9wdHMpIHtcbiAgICB2YXIgcmVzdWx0ID0gW10sIGksIGxlbmd0aDtcblxuICAgIGlmKG9wdHMgJiYgb3B0cy5kZWVwKSB7XG4gICAgICBmb3IoaSA9IDAsIGxlbmd0aCA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0LnB1c2goYXNEZWVwTXV0YWJsZSh0aGlzW2ldKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcihpID0gMCwgbGVuZ3RoID0gdGhpcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEVmZmVjdGl2ZWx5IHBlcmZvcm1zIGEgW21hcF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbWFwKSBvdmVyIHRoZSBlbGVtZW50cyBpbiB0aGUgYXJyYXksIGV4cGVjdGluZyB0aGF0IHRoZSBpdGVyYXRvciBmdW5jdGlvblxuICAgKiB3aWxsIHJldHVybiBhbiBhcnJheSBvZiB0d28gZWxlbWVudHMgLSB0aGUgZmlyc3QgcmVwcmVzZW50aW5nIGEga2V5LCB0aGUgb3RoZXJcbiAgICogYSB2YWx1ZS4gVGhlbiByZXR1cm5zIGFuIEltbXV0YWJsZSBPYmplY3QgY29uc3RydWN0ZWQgb2YgdGhvc2Uga2V5cyBhbmQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRvciAtIEEgZnVuY3Rpb24gd2hpY2ggc2hvdWxkIHJldHVybiBhbiBhcnJheSBvZiB0d28gZWxlbWVudHMgLSB0aGUgZmlyc3QgcmVwcmVzZW50aW5nIHRoZSBkZXNpcmVkIGtleSwgdGhlIG90aGVyIHRoZSBkZXNpcmVkIHZhbHVlLlxuICAgKi9cbiAgZnVuY3Rpb24gYXNPYmplY3QoaXRlcmF0b3IpIHtcbiAgICAvLyBJZiBubyBpdGVyYXRvciB3YXMgcHJvdmlkZWQsIGFzc3VtZSB0aGUgaWRlbnRpdHkgZnVuY3Rpb25cbiAgICAvLyAoc3VnZ2VzdGluZyB0aGlzIGFycmF5IGlzIGFscmVhZHkgYSBsaXN0IG9mIGtleS92YWx1ZSBwYWlycy4pXG4gICAgaWYgKHR5cGVvZiBpdGVyYXRvciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBpdGVyYXRvciA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0ge30sXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBpbmRleDtcblxuICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIHBhaXIgID0gaXRlcmF0b3IodGhpc1tpbmRleF0sIGluZGV4LCB0aGlzKSxcbiAgICAgICAgICBrZXkgICA9IHBhaXJbMF0sXG4gICAgICAgICAgdmFsdWUgPSBwYWlyWzFdO1xuXG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KHJlc3VsdCk7XG4gIH1cblxuICBmdW5jdGlvbiBhc0RlZXBNdXRhYmxlKG9iaikge1xuICAgIGlmIChcbiAgICAgICghb2JqKSB8fFxuICAgICAgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB8fFxuICAgICAgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgaW1tdXRhYmlsaXR5VGFnKSkgfHxcbiAgICAgIChvYmogaW5zdGFuY2VvZiBEYXRlKVxuICAgICkgeyByZXR1cm4gb2JqOyB9XG4gICAgcmV0dXJuIEltbXV0YWJsZS5hc011dGFibGUob2JqLCB7ZGVlcDogdHJ1ZX0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcXVpY2tDb3B5KHNyYywgZGVzdCkge1xuICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNyYywga2V5KSkge1xuICAgICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVzdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIEltbXV0YWJsZSBPYmplY3QgY29udGFpbmluZyB0aGUgcHJvcGVydGllcyBhbmQgdmFsdWVzIG9mIGJvdGhcbiAgICogdGhpcyBvYmplY3QgYW5kIHRoZSBwcm92aWRlZCBvYmplY3QsIHByaW9yaXRpemluZyB0aGUgcHJvdmlkZWQgb2JqZWN0J3NcbiAgICogdmFsdWVzIHdoZW5ldmVyIHRoZSBzYW1lIGtleSBpcyBwcmVzZW50IGluIGJvdGggb2JqZWN0cy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IG90aGVyIC0gVGhlIG90aGVyIG9iamVjdCB0byBtZXJnZS4gTXVsdGlwbGUgb2JqZWN0cyBjYW4gYmUgcGFzc2VkIGFzIGFuIGFycmF5LiBJbiBzdWNoIGEgY2FzZSwgdGhlIGxhdGVyIGFuIG9iamVjdCBhcHBlYXJzIGluIHRoYXQgbGlzdCwgdGhlIGhpZ2hlciBpdHMgcHJpb3JpdHkuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgLSBPcHRpb25hbCBjb25maWcgb2JqZWN0IHRoYXQgY29udGFpbnMgc2V0dGluZ3MuIFN1cHBvcnRlZCBzZXR0aW5ncyBhcmU6IHtkZWVwOiB0cnVlfSBmb3IgZGVlcCBtZXJnZSBhbmQge21lcmdlcjogbWVyZ2VyRnVuY30gd2hlcmUgbWVyZ2VyRnVuYyBpcyBhIGZ1bmN0aW9uXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0IHRha2VzIGEgcHJvcGVydHkgZnJvbSBib3RoIG9iamVjdHMuIElmIGFueXRoaW5nIGlzIHJldHVybmVkIGl0IG92ZXJyaWRlcyB0aGUgbm9ybWFsIG1lcmdlIGJlaGF2aW91ci5cbiAgICovXG4gIGZ1bmN0aW9uIG1lcmdlKG90aGVyLCBjb25maWcpIHtcbiAgICAvLyBDYWxsaW5nIC5tZXJnZSgpIHdpdGggbm8gYXJndW1lbnRzIGlzIGEgbm8tb3AuIERvbid0IGJvdGhlciBjbG9uaW5nLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBpZiAob3RoZXIgPT09IG51bGwgfHwgKHR5cGVvZiBvdGhlciAhPT0gXCJvYmplY3RcIikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbW11dGFibGUjbWVyZ2UgY2FuIG9ubHkgYmUgaW52b2tlZCB3aXRoIG9iamVjdHMgb3IgYXJyYXlzLCBub3QgXCIgKyBKU09OLnN0cmluZ2lmeShvdGhlcikpO1xuICAgIH1cblxuICAgIHZhciByZWNlaXZlZEFycmF5ID0gKEFycmF5LmlzQXJyYXkob3RoZXIpKSxcbiAgICAgICAgZGVlcCAgICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcuZGVlcCxcbiAgICAgICAgbW9kZSAgICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcubW9kZSB8fCAnbWVyZ2UnLFxuICAgICAgICBtZXJnZXIgICAgICAgID0gY29uZmlnICYmIGNvbmZpZy5tZXJnZXIsXG4gICAgICAgIHJlc3VsdDtcblxuICAgIC8vIFVzZSB0aGUgZ2l2ZW4ga2V5IHRvIGV4dHJhY3QgYSB2YWx1ZSBmcm9tIHRoZSBnaXZlbiBvYmplY3QsIHRoZW4gcGxhY2VcbiAgICAvLyB0aGF0IHZhbHVlIGluIHRoZSByZXN1bHQgb2JqZWN0IHVuZGVyIHRoZSBzYW1lIGtleS4gSWYgdGhhdCByZXN1bHRlZFxuICAgIC8vIGluIGEgY2hhbmdlIGZyb20gdGhpcyBvYmplY3QncyB2YWx1ZSBhdCB0aGF0IGtleSwgc2V0IGFueUNoYW5nZXMgPSB0cnVlLlxuICAgIGZ1bmN0aW9uIGFkZFRvUmVzdWx0KGN1cnJlbnRPYmosIG90aGVyT2JqLCBrZXkpIHtcbiAgICAgIHZhciBpbW11dGFibGVWYWx1ZSA9IEltbXV0YWJsZShvdGhlck9ialtrZXldKTtcbiAgICAgIHZhciBtZXJnZXJSZXN1bHQgPSBtZXJnZXIgJiYgbWVyZ2VyKGN1cnJlbnRPYmpba2V5XSwgaW1tdXRhYmxlVmFsdWUsIGNvbmZpZyk7XG4gICAgICB2YXIgY3VycmVudFZhbHVlID0gY3VycmVudE9ialtrZXldO1xuXG4gICAgICBpZiAoKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB8fFxuICAgICAgICAobWVyZ2VyUmVzdWx0ICE9PSB1bmRlZmluZWQpIHx8XG4gICAgICAgICghY3VycmVudE9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB8fFxuICAgICAgICAhaXNFcXVhbChpbW11dGFibGVWYWx1ZSwgY3VycmVudFZhbHVlKSkge1xuXG4gICAgICAgIHZhciBuZXdWYWx1ZTtcblxuICAgICAgICBpZiAobWVyZ2VyUmVzdWx0KSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBtZXJnZXJSZXN1bHQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVlcCAmJiBpc01lcmdhYmxlT2JqZWN0KGN1cnJlbnRWYWx1ZSkgJiYgaXNNZXJnYWJsZU9iamVjdChpbW11dGFibGVWYWx1ZSkpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IEltbXV0YWJsZS5tZXJnZShjdXJyZW50VmFsdWUsIGltbXV0YWJsZVZhbHVlLCBjb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld1ZhbHVlID0gaW1tdXRhYmxlVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzRXF1YWwoY3VycmVudFZhbHVlLCBuZXdWYWx1ZSkgfHwgIWN1cnJlbnRPYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gTWFrZSBhIHNoYWxsb3cgY2xvbmUgb2YgdGhlIGN1cnJlbnQgb2JqZWN0LlxuICAgICAgICAgICAgcmVzdWx0ID0gcXVpY2tDb3B5KGN1cnJlbnRPYmosIGluc3RhbnRpYXRlRW1wdHlPYmplY3QoY3VycmVudE9iaikpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdFtrZXldID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckRyb3BwZWRLZXlzKGN1cnJlbnRPYmosIG90aGVyT2JqKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gY3VycmVudE9iaikge1xuICAgICAgICBpZiAoIW90aGVyT2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIE1ha2UgYSBzaGFsbG93IGNsb25lIG9mIHRoZSBjdXJyZW50IG9iamVjdC5cbiAgICAgICAgICAgIHJlc3VsdCA9IHF1aWNrQ29weShjdXJyZW50T2JqLCBpbnN0YW50aWF0ZUVtcHR5T2JqZWN0KGN1cnJlbnRPYmopKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsZXRlIHJlc3VsdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGtleTtcblxuICAgIC8vIEFjaGlldmUgcHJpb3JpdGl6YXRpb24gYnkgb3ZlcnJpZGluZyBwcmV2aW91cyB2YWx1ZXMgdGhhdCBnZXQgaW4gdGhlIHdheS5cbiAgICBpZiAoIXJlY2VpdmVkQXJyYXkpIHtcbiAgICAgIC8vIFRoZSBtb3N0IGNvbW1vbiB1c2UgY2FzZToganVzdCBtZXJnZSBvbmUgb2JqZWN0IGludG8gdGhlIGV4aXN0aW5nIG9uZS5cbiAgICAgIGZvciAoa2V5IGluIG90aGVyKSB7XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG90aGVyLCBrZXkpKSB7XG4gICAgICAgICAgYWRkVG9SZXN1bHQodGhpcywgb3RoZXIsIGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtb2RlID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgY2xlYXJEcm9wcGVkS2V5cyh0aGlzLCBvdGhlcik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdlIGFsc28gYWNjZXB0IGFuIEFycmF5XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IG90aGVyLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIG90aGVyRnJvbUFycmF5ID0gb3RoZXJbaW5kZXhdO1xuXG4gICAgICAgIGZvciAoa2V5IGluIG90aGVyRnJvbUFycmF5KSB7XG4gICAgICAgICAgaWYgKG90aGVyRnJvbUFycmF5Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGFkZFRvUmVzdWx0KHJlc3VsdCAhPT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdGhpcywgb3RoZXJGcm9tQXJyYXksIGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG1ha2VJbW11dGFibGVPYmplY3QocmVzdWx0KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvYmplY3RSZXBsYWNlKHZhbHVlLCBjb25maWcpIHtcbiAgICB2YXIgZGVlcCAgICAgICAgICA9IGNvbmZpZyAmJiBjb25maWcuZGVlcDtcblxuICAgIC8vIENhbGxpbmcgLnJlcGxhY2UoKSB3aXRoIG5vIGFyZ3VtZW50cyBpcyBhIG5vLW9wLiBEb24ndCBib3RoZXIgY2xvbmluZy5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkltbXV0YWJsZSNyZXBsYWNlIGNhbiBvbmx5IGJlIGludm9rZWQgd2l0aCBvYmplY3RzIG9yIGFycmF5cywgbm90IFwiICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gSW1tdXRhYmxlLm1lcmdlKHRoaXMsIHZhbHVlLCB7ZGVlcDogZGVlcCwgbW9kZTogJ3JlcGxhY2UnfSk7XG4gIH1cblxuICB2YXIgaW1tdXRhYmxlRW1wdHlPYmplY3QgPSBJbW11dGFibGUoe30pO1xuXG4gIGZ1bmN0aW9uIG9iamVjdFNldEluKHBhdGgsIHZhbHVlLCBjb25maWcpIHtcbiAgICBpZiAoIShwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHx8IHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiVGhlIGZpcnN0IGFyZ3VtZW50IHRvIEltbXV0YWJsZSNzZXRJbiBtdXN0IGJlIGFuIGFycmF5IGNvbnRhaW5pbmcgYXQgbGVhc3Qgb25lIFxcXCJrZXlcXFwiIHN0cmluZy5cIik7XG4gICAgfVxuXG4gICAgdmFyIGhlYWQgPSBwYXRoWzBdO1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIG9iamVjdFNldC5jYWxsKHRoaXMsIGhlYWQsIHZhbHVlLCBjb25maWcpO1xuICAgIH1cblxuICAgIHZhciB0YWlsID0gcGF0aC5zbGljZSgxKTtcbiAgICB2YXIgbmV3VmFsdWU7XG4gICAgdmFyIHRoaXNIZWFkID0gdGhpc1toZWFkXTtcblxuICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGhlYWQpICYmIHR5cGVvZih0aGlzSGVhZCkgPT09IFwib2JqZWN0XCIgJiYgdGhpc0hlYWQgIT09IG51bGwpIHtcbiAgICAgIC8vIE1pZ2h0ICh2YWxpZGx5KSBiZSBvYmplY3Qgb3IgYXJyYXlcbiAgICAgIG5ld1ZhbHVlID0gSW1tdXRhYmxlLnNldEluKHRoaXNIZWFkLCB0YWlsLCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1ZhbHVlID0gb2JqZWN0U2V0SW4uY2FsbChpbW11dGFibGVFbXB0eU9iamVjdCwgdGFpbCwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGhlYWQpICYmIHRoaXNIZWFkID09PSBuZXdWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIG11dGFibGUgPSBxdWlja0NvcHkodGhpcywgaW5zdGFudGlhdGVFbXB0eU9iamVjdCh0aGlzKSk7XG4gICAgbXV0YWJsZVtoZWFkXSA9IG5ld1ZhbHVlO1xuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KG11dGFibGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gb2JqZWN0U2V0KHByb3BlcnR5LCB2YWx1ZSwgY29uZmlnKSB7XG4gICAgdmFyIGRlZXAgICAgICAgICAgPSBjb25maWcgJiYgY29uZmlnLmRlZXA7XG5cbiAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgIGlmIChkZWVwICYmIHRoaXNbcHJvcGVydHldICE9PSB2YWx1ZSAmJiBpc01lcmdhYmxlT2JqZWN0KHZhbHVlKSAmJiBpc01lcmdhYmxlT2JqZWN0KHRoaXNbcHJvcGVydHldKSkge1xuICAgICAgICB2YWx1ZSA9IEltbXV0YWJsZS5tZXJnZSh0aGlzW3Byb3BlcnR5XSwgdmFsdWUsIHtkZWVwOiB0cnVlLCBtb2RlOiAncmVwbGFjZSd9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0VxdWFsKHRoaXNbcHJvcGVydHldLCB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG11dGFibGUgPSBxdWlja0NvcHkodGhpcywgaW5zdGFudGlhdGVFbXB0eU9iamVjdCh0aGlzKSk7XG4gICAgbXV0YWJsZVtwcm9wZXJ0eV0gPSBJbW11dGFibGUodmFsdWUpO1xuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KG11dGFibGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKHByb3BlcnR5LCB1cGRhdGVyKSB7XG4gICAgdmFyIHJlc3RBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaW5pdGlhbFZhbCA9IHRoaXNbcHJvcGVydHldO1xuICAgIHJldHVybiBJbW11dGFibGUuc2V0KHRoaXMsIHByb3BlcnR5LCB1cGRhdGVyLmFwcGx5KGluaXRpYWxWYWwsIFtpbml0aWFsVmFsXS5jb25jYXQocmVzdEFyZ3MpKSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJblBhdGgob2JqLCBwYXRoKSB7XG4gICAgLypqc2hpbnQgZXFudWxsOnRydWUgKi9cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGgubGVuZ3RoOyBvYmogIT0gbnVsbCAmJiBpIDwgbDsgaSsrKSB7XG4gICAgICBvYmogPSBvYmpbcGF0aFtpXV07XG4gICAgfVxuXG4gICAgcmV0dXJuIChpICYmIGkgPT0gbCkgPyBvYmogOiB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVJbihwYXRoLCB1cGRhdGVyKSB7XG4gICAgdmFyIHJlc3RBcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaW5pdGlhbFZhbCA9IGdldEluUGF0aCh0aGlzLCBwYXRoKTtcblxuICAgIHJldHVybiBJbW11dGFibGUuc2V0SW4odGhpcywgcGF0aCwgdXBkYXRlci5hcHBseShpbml0aWFsVmFsLCBbaW5pdGlhbFZhbF0uY29uY2F0KHJlc3RBcmdzKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNNdXRhYmxlT2JqZWN0KG9wdHMpIHtcbiAgICB2YXIgcmVzdWx0ID0gaW5zdGFudGlhdGVFbXB0eU9iamVjdCh0aGlzKSwga2V5O1xuXG4gICAgaWYob3B0cyAmJiBvcHRzLmRlZXApIHtcbiAgICAgIGZvciAoa2V5IGluIHRoaXMpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gYXNEZWVwTXV0YWJsZSh0aGlzW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAoa2V5IGluIHRoaXMpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpc1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8vIENyZWF0ZXMgcGxhaW4gb2JqZWN0IHRvIGJlIHVzZWQgZm9yIGNsb25pbmdcbiAgZnVuY3Rpb24gaW5zdGFudGlhdGVQbGFpbk9iamVjdCgpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvLyBGaW5hbGl6ZXMgYW4gb2JqZWN0IHdpdGggaW1tdXRhYmxlIG1ldGhvZHMsIGZyZWV6ZXMgaXQsIGFuZCByZXR1cm5zIGl0LlxuICBmdW5jdGlvbiBtYWtlSW1tdXRhYmxlT2JqZWN0KG9iaikge1xuICAgIGlmICghZ2xvYmFsQ29uZmlnLnVzZV9zdGF0aWMpIHtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcIm1lcmdlXCIsIG1lcmdlKTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcInJlcGxhY2VcIiwgb2JqZWN0UmVwbGFjZSk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJ3aXRob3V0XCIsIHdpdGhvdXQpO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwiYXNNdXRhYmxlXCIsIGFzTXV0YWJsZU9iamVjdCk7XG4gICAgICBhZGRQcm9wZXJ0eVRvKG9iaiwgXCJzZXRcIiwgb2JqZWN0U2V0KTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcInNldEluXCIsIG9iamVjdFNldEluKTtcbiAgICAgIGFkZFByb3BlcnR5VG8ob2JqLCBcInVwZGF0ZVwiLCB1cGRhdGUpO1xuICAgICAgYWRkUHJvcGVydHlUbyhvYmosIFwidXBkYXRlSW5cIiwgdXBkYXRlSW4pO1xuICAgIH1cblxuICAgIHJldHVybiBtYWtlSW1tdXRhYmxlKG9iaiwgbXV0YXRpbmdPYmplY3RNZXRob2RzKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBvYmplY3QgaXMgYSB2YWxpZCByZWFjdCBlbGVtZW50XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL3YxNS4wLjEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMzI2XG4gIGZ1bmN0aW9uIGlzUmVhY3RFbGVtZW50KG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICBvYmogIT09IG51bGwgJiZcbiAgICAgICAgICAgKG9iai4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFX0ZBTExCQUNLIHx8IG9iai4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRmlsZU9iamVjdChvYmopIHtcbiAgICByZXR1cm4gdHlwZW9mIEZpbGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgIG9iaiBpbnN0YW5jZW9mIEZpbGU7XG4gIH1cblxuICBmdW5jdGlvbiBJbW11dGFibGUob2JqLCBvcHRpb25zLCBzdGFja1JlbWFpbmluZykge1xuICAgIGlmIChpc0ltbXV0YWJsZShvYmopIHx8IGlzUmVhY3RFbGVtZW50KG9iaikgfHwgaXNGaWxlT2JqZWN0KG9iaikpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgIHJldHVybiBtYWtlSW1tdXRhYmxlQXJyYXkob2JqLnNsaWNlKCkpO1xuICAgIH0gZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuIG1ha2VJbW11dGFibGVEYXRlKG5ldyBEYXRlKG9iai5nZXRUaW1lKCkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRG9uJ3QgZnJlZXplIHRoZSBvYmplY3Qgd2Ugd2VyZSBnaXZlbjsgbWFrZSBhIGNsb25lIGFuZCB1c2UgdGhhdC5cbiAgICAgIHZhciBwcm90b3R5cGUgPSBvcHRpb25zICYmIG9wdGlvbnMucHJvdG90eXBlO1xuICAgICAgdmFyIGluc3RhbnRpYXRlRW1wdHlPYmplY3QgPVxuICAgICAgICAoIXByb3RvdHlwZSB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGUpID9cbiAgICAgICAgICBpbnN0YW50aWF0ZVBsYWluT2JqZWN0IDogKGZ1bmN0aW9uKCkgeyByZXR1cm4gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpOyB9KTtcbiAgICAgIHZhciBjbG9uZSA9IGluc3RhbnRpYXRlRW1wdHlPYmplY3QoKTtcblxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xuICAgICAgICAvKmpzaGludCBlcW51bGw6dHJ1ZSAqL1xuICAgICAgICBpZiAoc3RhY2tSZW1haW5pbmcgPT0gbnVsbCkge1xuICAgICAgICAgIHN0YWNrUmVtYWluaW5nID0gNjQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YWNrUmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgSW1tdXRhYmxlRXJyb3IoXCJBdHRlbXB0IHRvIGNvbnN0cnVjdCBJbW11dGFibGUgZnJvbSBhIGRlZXBseSBuZXN0ZWQgb2JqZWN0IHdhcyBkZXRlY3RlZC5cIiArXG4gICAgICAgICAgICBcIiBIYXZlIHlvdSB0cmllZCB0byB3cmFwIGFuIG9iamVjdCB3aXRoIGNpcmN1bGFyIHJlZmVyZW5jZXMgKGUuZy4gUmVhY3QgZWxlbWVudCk/XCIgK1xuICAgICAgICAgICAgXCIgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9ydGZlbGRtYW4vc2VhbWxlc3MtaW1tdXRhYmxlL3dpa2kvRGVlcGx5LW5lc3RlZC1vYmplY3Qtd2FzLWRldGVjdGVkIGZvciBkZXRhaWxzLlwiKTtcbiAgICAgICAgfVxuICAgICAgICBzdGFja1JlbWFpbmluZyAtPSAxO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSkge1xuICAgICAgICAgIGNsb25lW2tleV0gPSBJbW11dGFibGUob2JqW2tleV0sIHVuZGVmaW5lZCwgc3RhY2tSZW1haW5pbmcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtYWtlSW1tdXRhYmxlT2JqZWN0KGNsb25lKTtcbiAgICB9XG4gIH1cblxuICAvLyBXcmFwcGVyIHRvIGFsbG93IHRoZSB1c2Ugb2Ygb2JqZWN0IG1ldGhvZHMgYXMgc3RhdGljIG1ldGhvZHMgb2YgSW1tdXRhYmxlLlxuICBmdW5jdGlvbiB0b1N0YXRpYyhmbikge1xuICAgIGZ1bmN0aW9uIHN0YXRpY1dyYXBwZXIoKSB7XG4gICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIHZhciBzZWxmID0gYXJncy5zaGlmdCgpO1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0aWNXcmFwcGVyO1xuICB9XG5cbiAgLy8gV3JhcHBlciB0byBhbGxvdyB0aGUgdXNlIG9mIG9iamVjdCBtZXRob2RzIGFzIHN0YXRpYyBtZXRob2RzIG9mIEltbXV0YWJsZS5cbiAgLy8gd2l0aCB0aGUgYWRkaXRpb25hbCBjb25kaXRpb24gb2YgY2hvb3Npbmcgd2hpY2ggZnVuY3Rpb24gdG8gY2FsbCBkZXBlbmRpbmdcbiAgLy8gaWYgYXJndW1lbnQgaXMgYW4gYXJyYXkgb3IgYW4gb2JqZWN0LlxuICBmdW5jdGlvbiB0b1N0YXRpY09iamVjdE9yQXJyYXkoZm5PYmplY3QsIGZuQXJyYXkpIHtcbiAgICBmdW5jdGlvbiBzdGF0aWNXcmFwcGVyKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgc2VsZiA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHNlbGYpKSB7XG4gICAgICAgICAgcmV0dXJuIGZuQXJyYXkuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmbk9iamVjdC5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGljV3JhcHBlcjtcbiAgfVxuXG4gIC8vIFdyYXBwZXIgdG8gYWxsb3cgdGhlIHVzZSBvZiBvYmplY3QgbWV0aG9kcyBhcyBzdGF0aWMgbWV0aG9kcyBvZiBJbW11dGFibGUuXG4gIC8vIHdpdGggdGhlIGFkZGl0aW9uYWwgY29uZGl0aW9uIG9mIGNob29zaW5nIHdoaWNoIGZ1bmN0aW9uIHRvIGNhbGwgZGVwZW5kaW5nXG4gIC8vIGlmIGFyZ3VtZW50IGlzIGFuIGFycmF5IG9yIGFuIG9iamVjdCBvciBhIGRhdGUuXG4gIGZ1bmN0aW9uIHRvU3RhdGljT2JqZWN0T3JEYXRlT3JBcnJheShmbk9iamVjdCwgZm5BcnJheSwgZm5EYXRlKSB7XG4gICAgZnVuY3Rpb24gc3RhdGljV3JhcHBlcigpIHtcbiAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgdmFyIHNlbGYgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxmKSkge1xuICAgICAgICAgIHJldHVybiBmbkFycmF5LmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfSBlbHNlIGlmIChzZWxmIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgIHJldHVybiBmbkRhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmbk9iamVjdC5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGljV3JhcHBlcjtcbiAgfVxuXG4gIC8vIEV4cG9ydCB0aGUgbGlicmFyeVxuICBJbW11dGFibGUuZnJvbSAgICAgICAgICAgPSBJbW11dGFibGU7XG4gIEltbXV0YWJsZS5pc0ltbXV0YWJsZSAgICA9IGlzSW1tdXRhYmxlO1xuICBJbW11dGFibGUuSW1tdXRhYmxlRXJyb3IgPSBJbW11dGFibGVFcnJvcjtcbiAgSW1tdXRhYmxlLm1lcmdlICAgICAgICAgID0gdG9TdGF0aWMobWVyZ2UpO1xuICBJbW11dGFibGUucmVwbGFjZSAgICAgICAgPSB0b1N0YXRpYyhvYmplY3RSZXBsYWNlKTtcbiAgSW1tdXRhYmxlLndpdGhvdXQgICAgICAgID0gdG9TdGF0aWMod2l0aG91dCk7XG4gIEltbXV0YWJsZS5hc011dGFibGUgICAgICA9IHRvU3RhdGljT2JqZWN0T3JEYXRlT3JBcnJheShhc011dGFibGVPYmplY3QsIGFzTXV0YWJsZUFycmF5LCBhc011dGFibGVEYXRlKTtcbiAgSW1tdXRhYmxlLnNldCAgICAgICAgICAgID0gdG9TdGF0aWNPYmplY3RPckFycmF5KG9iamVjdFNldCwgYXJyYXlTZXQpO1xuICBJbW11dGFibGUuc2V0SW4gICAgICAgICAgPSB0b1N0YXRpY09iamVjdE9yQXJyYXkob2JqZWN0U2V0SW4sIGFycmF5U2V0SW4pO1xuICBJbW11dGFibGUudXBkYXRlICAgICAgICAgPSB0b1N0YXRpYyh1cGRhdGUpO1xuICBJbW11dGFibGUudXBkYXRlSW4gICAgICAgPSB0b1N0YXRpYyh1cGRhdGVJbik7XG4gIEltbXV0YWJsZS5mbGF0TWFwICAgICAgICA9IHRvU3RhdGljKGZsYXRNYXApO1xuICBJbW11dGFibGUuYXNPYmplY3QgICAgICAgPSB0b1N0YXRpYyhhc09iamVjdCk7XG4gIGlmICghZ2xvYmFsQ29uZmlnLnVzZV9zdGF0aWMpIHtcbiAgICAgIEltbXV0YWJsZS5zdGF0aWMgPSBpbW11dGFibGVJbml0KHtcbiAgICAgICAgICB1c2Vfc3RhdGljOiB0cnVlXG4gICAgICB9KTtcbiAgfVxuXG4gIE9iamVjdC5mcmVlemUoSW1tdXRhYmxlKTtcblxuICByZXR1cm4gSW1tdXRhYmxlO1xufVxuXG4gIHZhciBJbW11dGFibGUgPSBpbW11dGFibGVJbml0KCk7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIEltbXV0YWJsZTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJbW11dGFibGU7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBleHBvcnRzLkltbXV0YWJsZSA9IEltbXV0YWJsZTtcbiAgfSBlbHNlIGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSB7XG4gICAgd2luZG93LkltbXV0YWJsZSA9IEltbXV0YWJsZTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiKSB7XG4gICAgZ2xvYmFsLkltbXV0YWJsZSA9IEltbXV0YWJsZTtcbiAgfVxufSkoKTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmltcG9ydCBJbW11dGFibGUgZnJvbSBcInNlYW1sZXNzLWltbXV0YWJsZVwiO1xuXG4vLyBUaGlzIG1pZGRsZXdhcmUgd2lsbCBqdXN0IGFkZCB0aGUgcHJvcGVydHkgXCJhc3luYyBkaXNwYXRjaFwiXG4vLyB0byBhY3Rpb25zIHdpdGggdGhlIFwiYXN5bmNcIiBwcm9wcGVydHkgc2V0IHRvIHRydWVcbmNvbnN0IGFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlID0gc3RvcmUgPT4gbmV4dCA9PiBhY3Rpb24gPT4ge1xuICBsZXQgc3luY0FjdGl2aXR5RmluaXNoZWQgPSBmYWxzZTtcbiAgbGV0IGFjdGlvblF1ZXVlID0gW107XG5cbiAgZnVuY3Rpb24gZmx1c2hRdWV1ZSgpIHtcbiAgICBhY3Rpb25RdWV1ZS5mb3JFYWNoKGEgPT4gc3RvcmUuZGlzcGF0Y2goYSkpOyAvLyBmbHVzaCBxdWV1ZVxuICAgIGFjdGlvblF1ZXVlID0gW107XG4gIH1cblxuICBmdW5jdGlvbiBhc3luY0Rpc3BhdGNoKGFzeW5jQWN0aW9uKSB7XG4gICAgYWN0aW9uUXVldWUgPSBhY3Rpb25RdWV1ZS5jb25jYXQoW2FzeW5jQWN0aW9uXSk7XG5cbiAgICBpZiAoc3luY0FjdGl2aXR5RmluaXNoZWQpIHtcbiAgICAgIGZsdXNoUXVldWUoKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBhY3Rpb25XaXRoQXN5bmNEaXNwYXRjaCA9XG4gICAgICBJbW11dGFibGUoYWN0aW9uKS5tZXJnZSh7IGFzeW5jRGlzcGF0Y2ggfSk7XG5cbiAgbmV4dChhY3Rpb25XaXRoQXN5bmNEaXNwYXRjaCk7XG4gIHN5bmNBY3Rpdml0eUZpbmlzaGVkID0gdHJ1ZTtcbiAgZmx1c2hRdWV1ZSgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmU7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cbmltcG9ydCBhc3luY0Rpc3BhdGNoTWlkZGxld2FyZSBmcm9tIFwiLi4vanMvdXRpbHMvYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmVcIjtcblxuY29uc3QgZmFrZUFjdGlvbiA9IHsgdHlwZTogXCJmYWtlIGFjdGlvblwiIH07XG5cbmRlc2NyaWJlKFwiVGhlIGFzeW5jRGlzcGF0Y2hNaWRkbGV3YXJlXCIsICgpID0+IHtcbiAgaXQoXCJjYWxscyBuZXh0IHdpdGggYXN5bmNEaXNwYXRjaCBwcm9wZXJ0eVwiLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IG5leHQgPSByZXR1cm5lZEFjdGlvbiA9PiB7XG4gICAgICBleHBlY3QocmV0dXJuZWRBY3Rpb24uYXN5bmNEaXNwYXRjaCkubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgIGV4cGVjdCh0eXBlb2YgcmV0dXJuZWRBY3Rpb24uYXN5bmNEaXNwYXRjaCkudG9FcXVhbChcImZ1bmN0aW9uXCIpO1xuICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICBhc3luY0Rpc3BhdGNoTWlkZGxld2FyZShcImZha2VTdG9yZVwiKShuZXh0KShmYWtlQWN0aW9uKTtcbiAgfSk7XG5cblxuICBpdChcImFzeW5jRGlzcGF0Y2ggdHJpZ2dlcnMgYSBzdG9yZSBkaXNwYXRjaFwiLCAoZG9uZSkgPT4ge1xuICAgIGNvbnN0IGZha2VBc3luY0FjdGlvbiA9IHsgdHlwZTogXCJmYWtlQXN5bmNBY3Rpb25cIiB9O1xuXG4gICAgY29uc3QgZmFrZVN0b3JlID0ge1xuICAgICAgZGlzcGF0Y2g6IGFjdGlvbiA9PiB7XG4gICAgICAgIGV4cGVjdChhY3Rpb24udHlwZSkudG9FcXVhbChmYWtlQXN5bmNBY3Rpb24udHlwZSk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IG5leHQgPSByZXR1cm5lZEFjdGlvbiA9PlxuICAgICAgcmV0dXJuZWRBY3Rpb24uYXN5bmNEaXNwYXRjaChmYWtlQXN5bmNBY3Rpb24pO1xuXG4gICAgYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmUoZmFrZVN0b3JlKShuZXh0KShmYWtlQWN0aW9uKTtcbiAgfSk7XG59KTtcbiIsIi8vIEJ1ZyBjaGVja2luZyBmdW5jdGlvbiB0aGF0IHdpbGwgdGhyb3cgYW4gZXJyb3Igd2hlbmV2ZXJcbi8vIHRoZSBjb25kaXRpb24gc2VudCB0byBpdCBpcyBldmFsdWF0ZWQgdG8gZmFsc2Vcbi8qKlxuICogUHJvY2Vzc2VzIHRoZSBtZXNzYWdlIGFuZCBvdXRwdXRzIHRoZSBjb3JyZWN0IG1lc3NhZ2UgaWYgdGhlIGNvbmRpdGlvblxuICogaXMgZmFsc2UuIE90aGVyd2lzZSBpdCBvdXRwdXRzIG51bGwuXG4gKiBAYXBpIHByaXZhdGVcbiAqIEBtZXRob2QgcHJvY2Vzc0NvbmRpdGlvblxuICogQHBhcmFtICB7Qm9vbGVhbn0gY29uZGl0aW9uIC0gUmVzdWx0IG9mIHRoZSBldmFsdWF0ZWQgY29uZGl0aW9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGVycm9yTWVzc2FnZSAtIE1lc3NhZ2UgZXhwbGFpbmlnIHRoZSBlcnJvciBpbiBjYXNlIGl0IGlzIHRocm93blxuICogQHJldHVybiB7U3RyaW5nIHwgbnVsbH0gIC0gRXJyb3IgbWVzc2FnZSBpZiB0aGVyZSBpcyBhbiBlcnJvciwgbnVsIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc0NvbmRpdGlvbihjb25kaXRpb24sIGVycm9yTWVzc2FnZSkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBjb21wbGV0ZUVycm9yTWVzc2FnZSA9ICcnO1xuICAgIHZhciByZSA9IC9hdCAoW15cXHNdKylcXHNcXCgvZztcbiAgICB2YXIgc3RhY2tUcmFjZSA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICAgIHZhciBzdGFja0Z1bmN0aW9ucyA9IFtdO1xuXG4gICAgdmFyIGZ1bmNOYW1lID0gcmUuZXhlYyhzdGFja1RyYWNlKTtcbiAgICB3aGlsZSAoZnVuY05hbWUgJiYgZnVuY05hbWVbMV0pIHtcbiAgICAgIHN0YWNrRnVuY3Rpb25zLnB1c2goZnVuY05hbWVbMV0pO1xuICAgICAgZnVuY05hbWUgPSByZS5leGVjKHN0YWNrVHJhY2UpO1xuICAgIH1cblxuICAgIC8vIE51bWJlciAwIGlzIHByb2Nlc3NDb25kaXRpb24gaXRzZWxmLFxuICAgIC8vIE51bWJlciAxIGlzIGFzc2VydCxcbiAgICAvLyBOdW1iZXIgMiBpcyB0aGUgY2FsbGVyIGZ1bmN0aW9uLlxuICAgIGlmIChzdGFja0Z1bmN0aW9uc1syXSkge1xuICAgICAgY29tcGxldGVFcnJvck1lc3NhZ2UgPSBzdGFja0Z1bmN0aW9uc1syXSArICc6ICcgKyBjb21wbGV0ZUVycm9yTWVzc2FnZTtcbiAgICB9XG5cbiAgICBjb21wbGV0ZUVycm9yTWVzc2FnZSArPSBlcnJvck1lc3NhZ2U7XG4gICAgcmV0dXJuIGNvbXBsZXRlRXJyb3JNZXNzYWdlO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBib29sZWFuIHBhc3NlZCB0byBpdCBldmFsdWF0ZXMgdG8gZmFsc2UuXG4gKiBUbyBiZSB1c2VkIGxpa2UgdGhpczpcbiAqIFx0XHRhc3NlcnQobXlEYXRlICE9PSB1bmRlZmluZWQsIFwiRGF0ZSBjYW5ub3QgYmUgdW5kZWZpbmVkLlwiKTtcbiAqIEBhcGkgcHVibGljXG4gKiBAbWV0aG9kIGFzc2VydFxuICogQHBhcmFtICB7Qm9vbGVhbn0gY29uZGl0aW9uIC0gUmVzdWx0IG9mIHRoZSBldmFsdWF0ZWQgY29uZGl0aW9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGVycm9yTWVzc2FnZSAtIE1lc3NhZ2UgZXhwbGFpbmlnIHRoZSBlcnJvciBpbiBjYXNlIGl0IGlzIHRocm93blxuICogQHJldHVybiB2b2lkXG4gKi9cbmZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIGVycm9yTWVzc2FnZSkge1xuICB2YXIgZXJyb3IgPSBwcm9jZXNzQ29uZGl0aW9uKGNvbmRpdGlvbiwgZXJyb3JNZXNzYWdlKTtcbiAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICB9XG59XG5cbi8qKlxuICogTG9ncyBhIHdhcm5pbmcgaWYgdGhlIGJvb2xlYW4gcGFzc2VkIHRvIGl0IGV2YWx1YXRlcyB0byBmYWxzZS5cbiAqIFRvIGJlIHVzZWQgbGlrZSB0aGlzOlxuICogXHRcdGFzc2VydC53YXJuKG15RGF0ZSAhPT0gdW5kZWZpbmVkLCBcIk5vIGRhdGUgcHJvdmlkZWQuXCIpO1xuICogQGFwaSBwdWJsaWNcbiAqIEBtZXRob2Qgd2FyblxuICogQHBhcmFtICB7Qm9vbGVhbn0gY29uZGl0aW9uIC0gUmVzdWx0IG9mIHRoZSBldmFsdWF0ZWQgY29uZGl0aW9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGVycm9yTWVzc2FnZSAtIE1lc3NhZ2UgZXhwbGFpbmlnIHRoZSBlcnJvciBpbiBjYXNlIGl0IGlzIHRocm93blxuICogQHJldHVybiB2b2lkXG4gKi9cbmFzc2VydC53YXJuID0gZnVuY3Rpb24gd2Fybihjb25kaXRpb24sIGVycm9yTWVzc2FnZSkge1xuICB2YXIgZXJyb3IgPSBwcm9jZXNzQ29uZGl0aW9uKGNvbmRpdGlvbiwgZXJyb3JNZXNzYWdlKTtcbiAgaWYgKHR5cGVvZiBlcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zb2xlLndhcm4oZXJyb3IpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhc3NlcnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaUlpd2ljMjkxY21ObGN5STZXeUpoYzNObGNuUXVhbk1pWFN3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5OGdRblZuSUdOb1pXTnJhVzVuSUdaMWJtTjBhVzl1SUhSb1lYUWdkMmxzYkNCMGFISnZkeUJoYmlCbGNuSnZjaUIzYUdWdVpYWmxjbHh1THk4Z2RHaGxJR052Ym1ScGRHbHZiaUJ6Wlc1MElIUnZJR2wwSUdseklHVjJZV3gxWVhSbFpDQjBieUJtWVd4elpWeHVMeW9xWEc0Z0tpQlFjbTlqWlhOelpYTWdkR2hsSUcxbGMzTmhaMlVnWVc1a0lHOTFkSEIxZEhNZ2RHaGxJR052Y25KbFkzUWdiV1Z6YzJGblpTQnBaaUIwYUdVZ1kyOXVaR2wwYVc5dVhHNGdLaUJwY3lCbVlXeHpaUzRnVDNSb1pYSjNhWE5sSUdsMElHOTFkSEIxZEhNZ2JuVnNiQzVjYmlBcUlFQmhjR2tnY0hKcGRtRjBaVnh1SUNvZ1FHMWxkR2h2WkNCd2NtOWpaWE56UTI5dVpHbDBhVzl1WEc0Z0tpQkFjR0Z5WVcwZ0lIdENiMjlzWldGdWZTQmpiMjVrYVhScGIyNGdMU0JTWlhOMWJIUWdiMllnZEdobElHVjJZV3gxWVhSbFpDQmpiMjVrYVhScGIyNWNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnWlhKeWIzSk5aWE56WVdkbElDMGdUV1Z6YzJGblpTQmxlSEJzWVdsdWFXY2dkR2hsSUdWeWNtOXlJR2x1SUdOaGMyVWdhWFFnYVhNZ2RHaHliM2R1WEc0Z0tpQkFjbVYwZFhKdUlIdFRkSEpwYm1jZ2ZDQnVkV3hzZlNBZ0xTQkZjbkp2Y2lCdFpYTnpZV2RsSUdsbUlIUm9aWEpsSUdseklHRnVJR1Z5Y205eUxDQnVkV3dnYjNSb1pYSjNhWE5sTGx4dUlDb3ZYRzVtZFc1amRHbHZiaUJ3Y205alpYTnpRMjl1WkdsMGFXOXVLR052Ym1ScGRHbHZiaXdnWlhKeWIzSk5aWE56WVdkbEtTQjdYRzRnSUdsbUlDZ2hZMjl1WkdsMGFXOXVLU0I3WEc0Z0lDQWdiR1YwSUdOdmJYQnNaWFJsUlhKeWIzSk5aWE56WVdkbElEMGdKeWM3WEc0Z0lDQWdZMjl1YzNRZ2NtVWdQU0F2WVhRZ0tGdGVYRnh6WFNzcFhGeHpYRndvTDJjN1hHNGdJQ0FnWTI5dWMzUWdjM1JoWTJ0VWNtRmpaU0E5SUc1bGR5QkZjbkp2Y2lncExuTjBZV05yTzF4dUlDQWdJR052Ym5OMElITjBZV05yUm5WdVkzUnBiMjV6SUQwZ1cxMDdYRzVjYmlBZ0lDQnNaWFFnWm5WdVkwNWhiV1VnUFNCeVpTNWxlR1ZqS0hOMFlXTnJWSEpoWTJVcE8xeHVJQ0FnSUhkb2FXeGxJQ2htZFc1alRtRnRaU0FtSmlCbWRXNWpUbUZ0WlZzeFhTa2dlMXh1SUNBZ0lDQWdjM1JoWTJ0R2RXNWpkR2x2Ym5NdWNIVnphQ2htZFc1alRtRnRaVnN4WFNrN1hHNGdJQ0FnSUNCbWRXNWpUbUZ0WlNBOUlISmxMbVY0WldNb2MzUmhZMnRVY21GalpTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdUblZ0WW1WeUlEQWdhWE1nY0hKdlkyVnpjME52Ym1ScGRHbHZiaUJwZEhObGJHWXNYRzRnSUNBZ0x5OGdUblZ0WW1WeUlERWdhWE1nWVhOelpYSjBMRnh1SUNBZ0lDOHZJRTUxYldKbGNpQXlJR2x6SUhSb1pTQmpZV3hzWlhJZ1puVnVZM1JwYjI0dVhHNGdJQ0FnYVdZZ0tITjBZV05yUm5WdVkzUnBiMjV6V3pKZEtTQjdYRzRnSUNBZ0lDQmpiMjF3YkdWMFpVVnljbTl5VFdWemMyRm5aU0E5SUdBa2UzTjBZV05yUm5WdVkzUnBiMjV6V3pKZGZUb2dKSHRqYjIxd2JHVjBaVVZ5Y205eVRXVnpjMkZuWlgxZ08xeHVJQ0FnSUgxY2JseHVJQ0FnSUdOdmJYQnNaWFJsUlhKeWIzSk5aWE56WVdkbElDczlJR1Z5Y205eVRXVnpjMkZuWlR0Y2JpQWdJQ0J5WlhSMWNtNGdZMjl0Y0d4bGRHVkZjbkp2Y2sxbGMzTmhaMlU3WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnYm5Wc2JEdGNibjFjYmx4dUx5b3FYRzRnS2lCVWFISnZkM01nWVc0Z1pYSnliM0lnYVdZZ2RHaGxJR0p2YjJ4bFlXNGdjR0Z6YzJWa0lIUnZJR2wwSUdWMllXeDFZWFJsY3lCMGJ5Qm1ZV3h6WlM1Y2JpQXFJRlJ2SUdKbElIVnpaV1FnYkdsclpTQjBhR2x6T2x4dUlDb2dYSFJjZEdGemMyVnlkQ2h0ZVVSaGRHVWdJVDA5SUhWdVpHVm1hVzVsWkN3Z1hDSkVZWFJsSUdOaGJtNXZkQ0JpWlNCMWJtUmxabWx1WldRdVhDSXBPMXh1SUNvZ1FHRndhU0J3ZFdKc2FXTmNiaUFxSUVCdFpYUm9iMlFnWVhOelpYSjBYRzRnS2lCQWNHRnlZVzBnSUh0Q2IyOXNaV0Z1ZlNCamIyNWthWFJwYjI0Z0xTQlNaWE4xYkhRZ2IyWWdkR2hsSUdWMllXeDFZWFJsWkNCamIyNWthWFJwYjI1Y2JpQXFJRUJ3WVhKaGJTQWdlMU4wY21sdVozMGdaWEp5YjNKTlpYTnpZV2RsSUMwZ1RXVnpjMkZuWlNCbGVIQnNZV2x1YVdjZ2RHaGxJR1Z5Y205eUlHbHVJR05oYzJVZ2FYUWdhWE1nZEdoeWIzZHVYRzRnS2lCQWNtVjBkWEp1SUhadmFXUmNiaUFxTDF4dVpuVnVZM1JwYjI0Z1lYTnpaWEowS0dOdmJtUnBkR2x2Yml3Z1pYSnliM0pOWlhOellXZGxLU0I3WEc0Z0lHTnZibk4wSUdWeWNtOXlJRDBnY0hKdlkyVnpjME52Ym1ScGRHbHZiaWhqYjI1a2FYUnBiMjRzSUdWeWNtOXlUV1Z6YzJGblpTazdYRzRnSUdsbUlDaDBlWEJsYjJZZ1pYSnliM0lnUFQwOUlDZHpkSEpwYm1jbktTQjdYRzRnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0dWeWNtOXlLVHRjYmlBZ2ZWeHVmVnh1WEc0dktpcGNiaUFxSUV4dlozTWdZU0IzWVhKdWFXNW5JR2xtSUhSb1pTQmliMjlzWldGdUlIQmhjM05sWkNCMGJ5QnBkQ0JsZG1Gc2RXRjBaWE1nZEc4Z1ptRnNjMlV1WEc0Z0tpQlVieUJpWlNCMWMyVmtJR3hwYTJVZ2RHaHBjenBjYmlBcUlGeDBYSFJoYzNObGNuUXVkMkZ5YmlodGVVUmhkR1VnSVQwOUlIVnVaR1ZtYVc1bFpDd2dYQ0pPYnlCa1lYUmxJSEJ5YjNacFpHVmtMbHdpS1R0Y2JpQXFJRUJoY0drZ2NIVmliR2xqWEc0Z0tpQkFiV1YwYUc5a0lIZGhjbTVjYmlBcUlFQndZWEpoYlNBZ2UwSnZiMnhsWVc1OUlHTnZibVJwZEdsdmJpQXRJRkpsYzNWc2RDQnZaaUIwYUdVZ1pYWmhiSFZoZEdWa0lHTnZibVJwZEdsdmJseHVJQ29nUUhCaGNtRnRJQ0I3VTNSeWFXNW5mU0JsY25KdmNrMWxjM05oWjJVZ0xTQk5aWE56WVdkbElHVjRjR3hoYVc1cFp5QjBhR1VnWlhKeWIzSWdhVzRnWTJGelpTQnBkQ0JwY3lCMGFISnZkMjVjYmlBcUlFQnlaWFIxY200Z2RtOXBaRnh1SUNvdlhHNWhjM05sY25RdWQyRnliaUE5SUdaMWJtTjBhVzl1SUhkaGNtNG9ZMjl1WkdsMGFXOXVMQ0JsY25KdmNrMWxjM05oWjJVcElIdGNiaUFnWTI5dWMzUWdaWEp5YjNJZ1BTQndjbTlqWlhOelEyOXVaR2wwYVc5dUtHTnZibVJwZEdsdmJpd2daWEp5YjNKTlpYTnpZV2RsS1R0Y2JpQWdhV1lnS0hSNWNHVnZaaUJsY25KdmNpQTlQVDBnSjNOMGNtbHVaeWNwSUh0Y2JpQWdJQ0JqYjI1emIyeGxMbmRoY200b1pYSnliM0lwTzF4dUlDQjlYRzU5TzF4dVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCaGMzTmxjblE3WEc0aVhTd2labWxzWlNJNkltRnpjMlZ5ZEM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJdmMyOTFjbU5sTHlKOVxuIiwiLyoqXG4gKiBUZXN0cyB3aGV0aGVyIG9yIG5vdCBhbiBvYmplY3QgaXMgYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSBvYmplY3QgdG8gdGVzdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgdmFsYCBpcyBhbiBhcnJheSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgX2lzQXJyYXkoW10pOyAvLz0+IHRydWVcbiAqICAgICAgX2lzQXJyYXkobnVsbCk7IC8vPT4gZmFsc2VcbiAqICAgICAgX2lzQXJyYXkoe30pOyAvLz0+IGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBfaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuICh2YWwgIT0gbnVsbCAmJlxuICAgICAgICAgIHZhbC5sZW5ndGggPj0gMCAmJlxuICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nKTtcbn07XG4iLCIvKipcbiAqIEFuIG9wdGltaXplZCwgcHJpdmF0ZSBhcnJheSBgc2xpY2VgIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FyZ3VtZW50c3xBcnJheX0gYXJncyBUaGUgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdCB0byBjb25zaWRlci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbZnJvbT0wXSBUaGUgYXJyYXkgaW5kZXggdG8gc2xpY2UgZnJvbSwgaW5jbHVzaXZlLlxuICogQHBhcmFtIHtOdW1iZXJ9IFt0bz1hcmdzLmxlbmd0aF0gVGhlIGFycmF5IGluZGV4IHRvIHNsaWNlIHRvLCBleGNsdXNpdmUuXG4gKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcsIHNsaWNlZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBfc2xpY2UoWzEsIDIsIDMsIDQsIDVdLCAxLCAzKTsgLy89PiBbMiwgM11cbiAqXG4gKiAgICAgIHZhciBmaXJzdFRocmVlQXJncyA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcbiAqICAgICAgICByZXR1cm4gX3NsaWNlKGFyZ3VtZW50cywgMCwgMyk7XG4gKiAgICAgIH07XG4gKiAgICAgIGZpcnN0VGhyZWVBcmdzKDEsIDIsIDMsIDQpOyAvLz0+IFsxLCAyLCAzXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9zbGljZShhcmdzLCBmcm9tLCB0bykge1xuICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBfc2xpY2UoYXJncywgMCwgYXJncy5sZW5ndGgpO1xuICAgIGNhc2UgMjogcmV0dXJuIF9zbGljZShhcmdzLCBmcm9tLCBhcmdzLmxlbmd0aCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHZhciBsaXN0ID0gW107XG4gICAgICB2YXIgaWR4ID0gMDtcbiAgICAgIHZhciBsZW4gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihhcmdzLmxlbmd0aCwgdG8pIC0gZnJvbSk7XG4gICAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICAgIGxpc3RbaWR4XSA9IGFyZ3NbZnJvbSArIGlkeF07XG4gICAgICAgIGlkeCArPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3Q7XG4gIH1cbn07XG4iLCJ2YXIgX2lzQXJyYXkgPSByZXF1aXJlKCcuL19pc0FycmF5Jyk7XG52YXIgX3NsaWNlID0gcmVxdWlyZSgnLi9fc2xpY2UnKTtcblxuXG4vKipcbiAqIFNpbWlsYXIgdG8gaGFzTWV0aG9kLCB0aGlzIGNoZWNrcyB3aGV0aGVyIGEgZnVuY3Rpb24gaGFzIGEgW21ldGhvZG5hbWVdXG4gKiBmdW5jdGlvbi4gSWYgaXQgaXNuJ3QgYW4gYXJyYXkgaXQgd2lsbCBleGVjdXRlIHRoYXQgZnVuY3Rpb24gb3RoZXJ3aXNlIGl0XG4gKiB3aWxsIGRlZmF1bHQgdG8gdGhlIHJhbWRhIGltcGxlbWVudGF0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiByYW1kYSBpbXBsZW10YXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RuYW1lIHByb3BlcnR5IHRvIGNoZWNrIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICogQHJldHVybiB7T2JqZWN0fSBXaGF0ZXZlciB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBtZXRob2QgaXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2NoZWNrRm9yTWV0aG9kKG1ldGhvZG5hbWUsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZm4oKTtcbiAgICB9XG4gICAgdmFyIG9iaiA9IGFyZ3VtZW50c1tsZW5ndGggLSAxXTtcbiAgICByZXR1cm4gKF9pc0FycmF5KG9iaikgfHwgdHlwZW9mIG9ialttZXRob2RuYW1lXSAhPT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKSA6XG4gICAgICBvYmpbbWV0aG9kbmFtZV0uYXBwbHkob2JqLCBfc2xpY2UoYXJndW1lbnRzLCAwLCBsZW5ndGggLSAxKSk7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfaXNQbGFjZWhvbGRlcihhKSB7XG4gIHJldHVybiBhICE9IG51bGwgJiZcbiAgICAgICAgIHR5cGVvZiBhID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWU7XG59O1xuIiwidmFyIF9pc1BsYWNlaG9sZGVyID0gcmVxdWlyZSgnLi9faXNQbGFjZWhvbGRlcicpO1xuXG5cbi8qKlxuICogT3B0aW1pemVkIGludGVybmFsIG9uZS1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGN1cnJpZWQgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2N1cnJ5MShmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZjEoYSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IF9pc1BsYWNlaG9sZGVyKGEpKSB7XG4gICAgICByZXR1cm4gZjE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcbn07XG4iLCJ2YXIgX2N1cnJ5MSA9IHJlcXVpcmUoJy4vX2N1cnJ5MScpO1xudmFyIF9pc1BsYWNlaG9sZGVyID0gcmVxdWlyZSgnLi9faXNQbGFjZWhvbGRlcicpO1xuXG5cbi8qKlxuICogT3B0aW1pemVkIGludGVybmFsIHR3by1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGN1cnJpZWQgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2N1cnJ5Mihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZjIoYSwgYikge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gZjI7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiBfaXNQbGFjZWhvbGRlcihhKSA/IGYyXG4gICAgICAgICAgICAgOiBfY3VycnkxKGZ1bmN0aW9uKF9iKSB7IHJldHVybiBmbihhLCBfYik7IH0pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpID8gZjJcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGEpID8gX2N1cnJ5MShmdW5jdGlvbihfYSkgeyByZXR1cm4gZm4oX2EsIGIpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYikgPyBfY3VycnkxKGZ1bmN0aW9uKF9iKSB7IHJldHVybiBmbihhLCBfYik7IH0pXG4gICAgICAgICAgICAgOiBmbihhLCBiKTtcbiAgICB9XG4gIH07XG59O1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL19jdXJyeTEnKTtcbnZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9fY3VycnkyJyk7XG52YXIgX2lzUGxhY2Vob2xkZXIgPSByZXF1aXJlKCcuL19pc1BsYWNlaG9sZGVyJyk7XG5cblxuLyoqXG4gKiBPcHRpbWl6ZWQgaW50ZXJuYWwgdGhyZWUtYXJpdHkgY3VycnkgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jdXJyeTMoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGYzKGEsIGIsIGMpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIGYzO1xuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gX2lzUGxhY2Vob2xkZXIoYSkgPyBmM1xuICAgICAgICAgICAgIDogX2N1cnJ5MihmdW5jdGlvbihfYiwgX2MpIHsgcmV0dXJuIGZuKGEsIF9iLCBfYyk7IH0pO1xuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gX2lzUGxhY2Vob2xkZXIoYSkgJiYgX2lzUGxhY2Vob2xkZXIoYikgPyBmM1xuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYSkgPyBfY3VycnkyKGZ1bmN0aW9uKF9hLCBfYykgeyByZXR1cm4gZm4oX2EsIGIsIF9jKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGIpID8gX2N1cnJ5MihmdW5jdGlvbihfYiwgX2MpIHsgcmV0dXJuIGZuKGEsIF9iLCBfYyk7IH0pXG4gICAgICAgICAgICAgOiBfY3VycnkxKGZ1bmN0aW9uKF9jKSB7IHJldHVybiBmbihhLCBiLCBfYyk7IH0pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpICYmIF9pc1BsYWNlaG9sZGVyKGMpID8gZjNcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpID8gX2N1cnJ5MihmdW5jdGlvbihfYSwgX2IpIHsgcmV0dXJuIGZuKF9hLCBfYiwgYyk7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihjKSA/IF9jdXJyeTIoZnVuY3Rpb24oX2EsIF9jKSB7IHJldHVybiBmbihfYSwgYiwgX2MpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYikgJiYgX2lzUGxhY2Vob2xkZXIoYykgPyBfY3VycnkyKGZ1bmN0aW9uKF9iLCBfYykgeyByZXR1cm4gZm4oYSwgX2IsIF9jKTsgfSlcbiAgICAgICAgICAgICA6IF9pc1BsYWNlaG9sZGVyKGEpID8gX2N1cnJ5MShmdW5jdGlvbihfYSkgeyByZXR1cm4gZm4oX2EsIGIsIGMpOyB9KVxuICAgICAgICAgICAgIDogX2lzUGxhY2Vob2xkZXIoYikgPyBfY3VycnkxKGZ1bmN0aW9uKF9iKSB7IHJldHVybiBmbihhLCBfYiwgYyk7IH0pXG4gICAgICAgICAgICAgOiBfaXNQbGFjZWhvbGRlcihjKSA/IF9jdXJyeTEoZnVuY3Rpb24oX2MpIHsgcmV0dXJuIGZuKGEsIGIsIF9jKTsgfSlcbiAgICAgICAgICAgICA6IGZuKGEsIGIsIGMpO1xuICAgIH1cbiAgfTtcbn07XG4iLCJ2YXIgX2NoZWNrRm9yTWV0aG9kID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY2hlY2tGb3JNZXRob2QnKTtcbnZhciBfY3VycnkzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkzJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gbGlzdCBvciBzdHJpbmcgKG9yIG9iamVjdCB3aXRoIGEgYHNsaWNlYFxuICogbWV0aG9kKSBmcm9tIGBmcm9tSW5kZXhgIChpbmNsdXNpdmUpIHRvIGB0b0luZGV4YCAoZXhjbHVzaXZlKS5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgc2xpY2VgIG1ldGhvZCBvZiB0aGUgdGhpcmQgYXJndW1lbnQsIGlmIHByZXNlbnQuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS40XG4gKiBAY2F0ZWdvcnkgTGlzdFxuICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IFthXSAtPiBbYV1cbiAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBTdHJpbmcgLT4gU3RyaW5nXG4gKiBAcGFyYW0ge051bWJlcn0gZnJvbUluZGV4IFRoZSBzdGFydCBpbmRleCAoaW5jbHVzaXZlKS5cbiAqIEBwYXJhbSB7TnVtYmVyfSB0b0luZGV4IFRoZSBlbmQgaW5kZXggKGV4Y2x1c2l2ZSkuXG4gKiBAcGFyYW0geyp9IGxpc3RcbiAqIEByZXR1cm4geyp9XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5zbGljZSgxLCAzLCBbJ2EnLCAnYicsICdjJywgJ2QnXSk7ICAgICAgICAvLz0+IFsnYicsICdjJ11cbiAqICAgICAgUi5zbGljZSgxLCBJbmZpbml0eSwgWydhJywgJ2InLCAnYycsICdkJ10pOyAvLz0+IFsnYicsICdjJywgJ2QnXVxuICogICAgICBSLnNsaWNlKDAsIC0xLCBbJ2EnLCAnYicsICdjJywgJ2QnXSk7ICAgICAgIC8vPT4gWydhJywgJ2InLCAnYyddXG4gKiAgICAgIFIuc2xpY2UoLTMsIC0xLCBbJ2EnLCAnYicsICdjJywgJ2QnXSk7ICAgICAgLy89PiBbJ2InLCAnYyddXG4gKiAgICAgIFIuc2xpY2UoMCwgMywgJ3JhbWRhJyk7ICAgICAgICAgICAgICAgICAgICAgLy89PiAncmFtJ1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTMoX2NoZWNrRm9yTWV0aG9kKCdzbGljZScsIGZ1bmN0aW9uIHNsaWNlKGZyb21JbmRleCwgdG9JbmRleCwgbGlzdCkge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobGlzdCwgZnJvbUluZGV4LCB0b0luZGV4KTtcbn0pKTtcbiIsInZhciBfY3VycnkzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkzJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSByZXN1bHQgb2YgXCJzZXR0aW5nXCIgdGhlIHBvcnRpb24gb2YgdGhlIGdpdmVuIGRhdGEgc3RydWN0dXJlXG4gKiBmb2N1c2VkIGJ5IHRoZSBnaXZlbiBsZW5zIHRvIHRoZSByZXN1bHQgb2YgYXBwbHlpbmcgdGhlIGdpdmVuIGZ1bmN0aW9uIHRvXG4gKiB0aGUgZm9jdXNlZCB2YWx1ZS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xNi4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAdHlwZWRlZm4gTGVucyBzIGEgPSBGdW5jdG9yIGYgPT4gKGEgLT4gZiBhKSAtPiBzIC0+IGYgc1xuICogQHNpZyBMZW5zIHMgYSAtPiAoYSAtPiBhKSAtPiBzIC0+IHNcbiAqIEBwYXJhbSB7TGVuc30gbGVuc1xuICogQHBhcmFtIHsqfSB2XG4gKiBAcGFyYW0geyp9IHhcbiAqIEByZXR1cm4geyp9XG4gKiBAc2VlIFIucHJvcCwgUi5sZW5zSW5kZXgsIFIubGVuc1Byb3BcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgaGVhZExlbnMgPSBSLmxlbnNJbmRleCgwKTtcbiAqXG4gKiAgICAgIFIub3ZlcihoZWFkTGVucywgUi50b1VwcGVyLCBbJ2ZvbycsICdiYXInLCAnYmF6J10pOyAvLz0+IFsnRk9PJywgJ2JhcicsICdiYXonXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgLy8gYElkZW50aXR5YCBpcyBhIGZ1bmN0b3IgdGhhdCBob2xkcyBhIHNpbmdsZSB2YWx1ZSwgd2hlcmUgYG1hcGAgc2ltcGx5XG4gIC8vIHRyYW5zZm9ybXMgdGhlIGhlbGQgdmFsdWUgd2l0aCB0aGUgcHJvdmlkZWQgZnVuY3Rpb24uXG4gIHZhciBJZGVudGl0eSA9IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4ge3ZhbHVlOiB4LCBtYXA6IGZ1bmN0aW9uKGYpIHsgcmV0dXJuIElkZW50aXR5KGYoeCkpOyB9fTtcbiAgfTtcblxuICByZXR1cm4gX2N1cnJ5MyhmdW5jdGlvbiBvdmVyKGxlbnMsIGYsIHgpIHtcbiAgICAvLyBUaGUgdmFsdWUgcmV0dXJuZWQgYnkgdGhlIGdldHRlciBmdW5jdGlvbiBpcyBmaXJzdCB0cmFuc2Zvcm1lZCB3aXRoIGBmYCxcbiAgICAvLyB0aGVuIHNldCBhcyB0aGUgdmFsdWUgb2YgYW4gYElkZW50aXR5YC4gVGhpcyBpcyB0aGVuIG1hcHBlZCBvdmVyIHdpdGggdGhlXG4gICAgLy8gc2V0dGVyIGZ1bmN0aW9uIG9mIHRoZSBsZW5zLlxuICAgIHJldHVybiBsZW5zKGZ1bmN0aW9uKHkpIHsgcmV0dXJuIElkZW50aXR5KGYoeSkpOyB9KSh4KS52YWx1ZTtcbiAgfSk7XG59KCkpO1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTEnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGFsd2F5cyByZXR1cm5zIHRoZSBnaXZlbiB2YWx1ZS4gTm90ZSB0aGF0IGZvclxuICogbm9uLXByaW1pdGl2ZXMgdGhlIHZhbHVlIHJldHVybmVkIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGtub3duIGFzIGBjb25zdGAsIGBjb25zdGFudGAsIG9yIGBLYCAoZm9yIEsgY29tYmluYXRvcikgaW5cbiAqIG90aGVyIGxhbmd1YWdlcyBhbmQgbGlicmFyaWVzLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAc2lnIGEgLT4gKCogLT4gYSlcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB3cmFwIGluIGEgZnVuY3Rpb25cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIEZ1bmN0aW9uIDo6ICogLT4gdmFsLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciB0ID0gUi5hbHdheXMoJ1RlZScpO1xuICogICAgICB0KCk7IC8vPT4gJ1RlZSdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkxKGZ1bmN0aW9uIGFsd2F5cyh2YWwpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWw7XG4gIH07XG59KTtcbiIsInZhciBfY3VycnkzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkzJyk7XG52YXIgYWx3YXlzID0gcmVxdWlyZSgnLi9hbHdheXMnKTtcbnZhciBvdmVyID0gcmVxdWlyZSgnLi9vdmVyJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSByZXN1bHQgb2YgXCJzZXR0aW5nXCIgdGhlIHBvcnRpb24gb2YgdGhlIGdpdmVuIGRhdGEgc3RydWN0dXJlXG4gKiBmb2N1c2VkIGJ5IHRoZSBnaXZlbiBsZW5zIHRvIHRoZSBnaXZlbiB2YWx1ZS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xNi4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAdHlwZWRlZm4gTGVucyBzIGEgPSBGdW5jdG9yIGYgPT4gKGEgLT4gZiBhKSAtPiBzIC0+IGYgc1xuICogQHNpZyBMZW5zIHMgYSAtPiBhIC0+IHMgLT4gc1xuICogQHBhcmFtIHtMZW5zfSBsZW5zXG4gKiBAcGFyYW0geyp9IHZcbiAqIEBwYXJhbSB7Kn0geFxuICogQHJldHVybiB7Kn1cbiAqIEBzZWUgUi5wcm9wLCBSLmxlbnNJbmRleCwgUi5sZW5zUHJvcFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciB4TGVucyA9IFIubGVuc1Byb3AoJ3gnKTtcbiAqXG4gKiAgICAgIFIuc2V0KHhMZW5zLCA0LCB7eDogMSwgeTogMn0pOyAgLy89PiB7eDogNCwgeTogMn1cbiAqICAgICAgUi5zZXQoeExlbnMsIDgsIHt4OiAxLCB5OiAyfSk7ICAvLz0+IHt4OiA4LCB5OiAyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTMoZnVuY3Rpb24gc2V0KGxlbnMsIHYsIHgpIHtcbiAgcmV0dXJuIG92ZXIobGVucywgYWx3YXlzKHYpLCB4KTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfYXJpdHkobiwgZm4pIHtcbiAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgc3dpdGNoIChuKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuY3Rpb24oKSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEwKSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyKSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzKSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgNTogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzLCBhNCkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDY6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQsIGE1KSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgNzogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2KSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgODogcmV0dXJuIGZ1bmN0aW9uKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNykgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBjYXNlIDk6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4KSB7IHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICAgIGNhc2UgMTA6IHJldHVybiBmdW5jdGlvbihhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSkgeyByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IHRvIF9hcml0eSBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIgbm8gZ3JlYXRlciB0aGFuIHRlbicpO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfcGlwZShmLCBnKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZy5jYWxsKHRoaXMsIGYuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFhXcmFwKGZuKSB7XG4gICAgdGhpcy5mID0gZm47XG4gIH1cbiAgWFdyYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbml0IG5vdCBpbXBsZW1lbnRlZCBvbiBYV3JhcCcpO1xuICB9O1xuICBYV3JhcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uKGFjYykgeyByZXR1cm4gYWNjOyB9O1xuICBYV3JhcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbihhY2MsIHgpIHtcbiAgICByZXR1cm4gdGhpcy5mKGFjYywgeCk7XG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIF94d3JhcChmbikgeyByZXR1cm4gbmV3IFhXcmFwKGZuKTsgfTtcbn0oKSk7XG4iLCJ2YXIgX2FyaXR5ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fYXJpdHknKTtcbnZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG5cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyBib3VuZCB0byBhIGNvbnRleHQuXG4gKiBOb3RlOiBgUi5iaW5kYCBkb2VzIG5vdCBwcm92aWRlIHRoZSBhZGRpdGlvbmFsIGFyZ3VtZW50LWJpbmRpbmcgY2FwYWJpbGl0aWVzIG9mXG4gKiBbRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL2JpbmQpLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjYuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAc2lnICgqIC0+ICopIC0+IHsqfSAtPiAoKiAtPiAqKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGJpbmQgdG8gY29udGV4dFxuICogQHBhcmFtIHtPYmplY3R9IHRoaXNPYmogVGhlIGNvbnRleHQgdG8gYmluZCBgZm5gIHRvXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0aGF0IHdpbGwgZXhlY3V0ZSBpbiB0aGUgY29udGV4dCBvZiBgdGhpc09iamAuXG4gKiBAc2VlIFIucGFydGlhbFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBsb2cgPSBSLmJpbmQoY29uc29sZS5sb2csIGNvbnNvbGUpO1xuICogICAgICBSLnBpcGUoUi5hc3NvYygnYScsIDIpLCBSLnRhcChsb2cpLCBSLmFzc29jKCdhJywgMykpKHthOiAxfSk7IC8vPT4ge2E6IDN9XG4gKiAgICAgIC8vIGxvZ3Mge2E6IDJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBiaW5kKGZuLCB0aGlzT2JqKSB7XG4gIHJldHVybiBfYXJpdHkoZm4ubGVuZ3RoLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc09iaiwgYXJndW1lbnRzKTtcbiAgfSk7XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2lzU3RyaW5nKHgpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG59O1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTEnKTtcbnZhciBfaXNBcnJheSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2lzQXJyYXknKTtcbnZhciBfaXNTdHJpbmcgPSByZXF1aXJlKCcuL2ludGVybmFsL19pc1N0cmluZycpO1xuXG5cbi8qKlxuICogVGVzdHMgd2hldGhlciBvciBub3QgYW4gb2JqZWN0IGlzIHNpbWlsYXIgdG8gYW4gYXJyYXkuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuNS4wXG4gKiBAY2F0ZWdvcnkgVHlwZVxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgKiAtPiBCb29sZWFuXG4gKiBAcGFyYW0geyp9IHggVGhlIG9iamVjdCB0byB0ZXN0LlxuICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGB4YCBoYXMgYSBudW1lcmljIGxlbmd0aCBwcm9wZXJ0eSBhbmQgZXh0cmVtZSBpbmRpY2VzIGRlZmluZWQ7IGBmYWxzZWAgb3RoZXJ3aXNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuaXNBcnJheUxpa2UoW10pOyAvLz0+IHRydWVcbiAqICAgICAgUi5pc0FycmF5TGlrZSh0cnVlKTsgLy89PiBmYWxzZVxuICogICAgICBSLmlzQXJyYXlMaWtlKHt9KTsgLy89PiBmYWxzZVxuICogICAgICBSLmlzQXJyYXlMaWtlKHtsZW5ndGg6IDEwfSk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pc0FycmF5TGlrZSh7MDogJ3plcm8nLCA5OiAnbmluZScsIGxlbmd0aDogMTB9KTsgLy89PiB0cnVlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MShmdW5jdGlvbiBpc0FycmF5TGlrZSh4KSB7XG4gIGlmIChfaXNBcnJheSh4KSkgeyByZXR1cm4gdHJ1ZTsgfVxuICBpZiAoIXgpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmICh0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmIChfaXNTdHJpbmcoeCkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGlmICh4Lm5vZGVUeXBlID09PSAxKSB7IHJldHVybiAhIXgubGVuZ3RoOyB9XG4gIGlmICh4Lmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdHJ1ZTsgfVxuICBpZiAoeC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHguaGFzT3duUHJvcGVydHkoMCkgJiYgeC5oYXNPd25Qcm9wZXJ0eSh4Lmxlbmd0aCAtIDEpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn0pO1xuIiwidmFyIF94d3JhcCA9IHJlcXVpcmUoJy4vX3h3cmFwJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4uL2JpbmQnKTtcbnZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2lzQXJyYXlMaWtlJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIF9hcnJheVJlZHVjZSh4ZiwgYWNjLCBsaXN0KSB7XG4gICAgdmFyIGlkeCA9IDA7XG4gICAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xuICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgIGFjYyA9IHhmWydAQHRyYW5zZHVjZXIvc3RlcCddKGFjYywgbGlzdFtpZHhdKTtcbiAgICAgIGlmIChhY2MgJiYgYWNjWydAQHRyYW5zZHVjZXIvcmVkdWNlZCddKSB7XG4gICAgICAgIGFjYyA9IGFjY1snQEB0cmFuc2R1Y2VyL3ZhbHVlJ107XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWR4ICs9IDE7XG4gICAgfVxuICAgIHJldHVybiB4ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKGFjYyk7XG4gIH1cblxuICBmdW5jdGlvbiBfaXRlcmFibGVSZWR1Y2UoeGYsIGFjYywgaXRlcikge1xuICAgIHZhciBzdGVwID0gaXRlci5uZXh0KCk7XG4gICAgd2hpbGUgKCFzdGVwLmRvbmUpIHtcbiAgICAgIGFjYyA9IHhmWydAQHRyYW5zZHVjZXIvc3RlcCddKGFjYywgc3RlcC52YWx1ZSk7XG4gICAgICBpZiAoYWNjICYmIGFjY1snQEB0cmFuc2R1Y2VyL3JlZHVjZWQnXSkge1xuICAgICAgICBhY2MgPSBhY2NbJ0BAdHJhbnNkdWNlci92YWx1ZSddO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHN0ZXAgPSBpdGVyLm5leHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10oYWNjKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9tZXRob2RSZWR1Y2UoeGYsIGFjYywgb2JqKSB7XG4gICAgcmV0dXJuIHhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ob2JqLnJlZHVjZShiaW5kKHhmWydAQHRyYW5zZHVjZXIvc3RlcCddLCB4ZiksIGFjYykpO1xuICB9XG5cbiAgdmFyIHN5bUl0ZXJhdG9yID0gKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnKSA/IFN5bWJvbC5pdGVyYXRvciA6ICdAQGl0ZXJhdG9yJztcbiAgcmV0dXJuIGZ1bmN0aW9uIF9yZWR1Y2UoZm4sIGFjYywgbGlzdCkge1xuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGZuID0gX3h3cmFwKGZuKTtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXlMaWtlKGxpc3QpKSB7XG4gICAgICByZXR1cm4gX2FycmF5UmVkdWNlKGZuLCBhY2MsIGxpc3QpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGxpc3QucmVkdWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gX21ldGhvZFJlZHVjZShmbiwgYWNjLCBsaXN0KTtcbiAgICB9XG4gICAgaWYgKGxpc3Rbc3ltSXRlcmF0b3JdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBfaXRlcmFibGVSZWR1Y2UoZm4sIGFjYywgbGlzdFtzeW1JdGVyYXRvcl0oKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbGlzdC5uZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gX2l0ZXJhYmxlUmVkdWNlKGZuLCBhY2MsIGxpc3QpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2U6IGxpc3QgbXVzdCBiZSBhcnJheSBvciBpdGVyYWJsZScpO1xuICB9O1xufSgpKTtcbiIsInZhciBfY3VycnkzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkzJyk7XG52YXIgX3JlZHVjZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX3JlZHVjZScpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIHNpbmdsZSBpdGVtIGJ5IGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBsaXN0LCBzdWNjZXNzaXZlbHkgY2FsbGluZ1xuICogdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIGFuZCBwYXNzaW5nIGl0IGFuIGFjY3VtdWxhdG9yIHZhbHVlIGFuZCB0aGUgY3VycmVudFxuICogdmFsdWUgZnJvbSB0aGUgYXJyYXksIGFuZCB0aGVuIHBhc3NpbmcgdGhlIHJlc3VsdCB0byB0aGUgbmV4dCBjYWxsLlxuICpcbiAqIFRoZSBpdGVyYXRvciBmdW5jdGlvbiByZWNlaXZlcyB0d28gdmFsdWVzOiAqKGFjYywgdmFsdWUpKi4gSXQgbWF5IHVzZVxuICogYFIucmVkdWNlZGAgdG8gc2hvcnRjdXQgdGhlIGl0ZXJhdGlvbi5cbiAqXG4gKiBOb3RlOiBgUi5yZWR1Y2VgIGRvZXMgbm90IHNraXAgZGVsZXRlZCBvciB1bmFzc2lnbmVkIGluZGljZXMgKHNwYXJzZVxuICogYXJyYXlzKSwgdW5saWtlIHRoZSBuYXRpdmUgYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlsc1xuICogb24gdGhpcyBiZWhhdmlvciwgc2VlOlxuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvcmVkdWNlI0Rlc2NyaXB0aW9uXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYHJlZHVjZWAgbWV0aG9kIG9mIHRoZSB0aGlyZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnICgoYSwgYikgLT4gYSkgLT4gYSAtPiBbYl0gLT4gYVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLiBSZWNlaXZlcyB0d28gdmFsdWVzLCB0aGUgYWNjdW11bGF0b3IgYW5kIHRoZVxuICogICAgICAgIGN1cnJlbnQgZWxlbWVudCBmcm9tIHRoZSBhcnJheS5cbiAqIEBwYXJhbSB7Kn0gYWNjIFRoZSBhY2N1bXVsYXRvciB2YWx1ZS5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHJldHVybiB7Kn0gVGhlIGZpbmFsLCBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqIEBzZWUgUi5yZWR1Y2VkLCBSLmFkZEluZGV4XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIG51bWJlcnMgPSBbMSwgMiwgM107XG4gKiAgICAgIHZhciBwbHVzID0gKGEsIGIpID0+IGEgKyBiO1xuICpcbiAqICAgICAgUi5yZWR1Y2UocGx1cywgMTAsIG51bWJlcnMpOyAvLz0+IDE2XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MyhfcmVkdWNlKTtcbiIsInZhciBfY2hlY2tGb3JNZXRob2QgPSByZXF1aXJlKCcuL2ludGVybmFsL19jaGVja0Zvck1ldGhvZCcpO1xudmFyIHNsaWNlID0gcmVxdWlyZSgnLi9zbGljZScpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhbGwgYnV0IHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBnaXZlbiBsaXN0IG9yIHN0cmluZyAob3Igb2JqZWN0XG4gKiB3aXRoIGEgYHRhaWxgIG1ldGhvZCkuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYHNsaWNlYCBtZXRob2Qgb2YgdGhlIGZpcnN0IGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgW2FdIC0+IFthXVxuICogQHNpZyBTdHJpbmcgLT4gU3RyaW5nXG4gKiBAcGFyYW0geyp9IGxpc3RcbiAqIEByZXR1cm4geyp9XG4gKiBAc2VlIFIuaGVhZCwgUi5pbml0LCBSLmxhc3RcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnRhaWwoWzEsIDIsIDNdKTsgIC8vPT4gWzIsIDNdXG4gKiAgICAgIFIudGFpbChbMSwgMl0pOyAgICAgLy89PiBbMl1cbiAqICAgICAgUi50YWlsKFsxXSk7ICAgICAgICAvLz0+IFtdXG4gKiAgICAgIFIudGFpbChbXSk7ICAgICAgICAgLy89PiBbXVxuICpcbiAqICAgICAgUi50YWlsKCdhYmMnKTsgIC8vPT4gJ2JjJ1xuICogICAgICBSLnRhaWwoJ2FiJyk7ICAgLy89PiAnYidcbiAqICAgICAgUi50YWlsKCdhJyk7ICAgIC8vPT4gJydcbiAqICAgICAgUi50YWlsKCcnKTsgICAgIC8vPT4gJydcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY2hlY2tGb3JNZXRob2QoJ3RhaWwnLCBzbGljZSgxLCBJbmZpbml0eSkpO1xuIiwidmFyIF9hcml0eSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2FyaXR5Jyk7XG52YXIgX3BpcGUgPSByZXF1aXJlKCcuL2ludGVybmFsL19waXBlJyk7XG52YXIgcmVkdWNlID0gcmVxdWlyZSgnLi9yZWR1Y2UnKTtcbnZhciB0YWlsID0gcmVxdWlyZSgnLi90YWlsJyk7XG5cblxuLyoqXG4gKiBQZXJmb3JtcyBsZWZ0LXRvLXJpZ2h0IGZ1bmN0aW9uIGNvbXBvc2l0aW9uLiBUaGUgbGVmdG1vc3QgZnVuY3Rpb24gbWF5IGhhdmVcbiAqIGFueSBhcml0eTsgdGhlIHJlbWFpbmluZyBmdW5jdGlvbnMgbXVzdCBiZSB1bmFyeS5cbiAqXG4gKiBJbiBzb21lIGxpYnJhcmllcyB0aGlzIGZ1bmN0aW9uIGlzIG5hbWVkIGBzZXF1ZW5jZWAuXG4gKlxuICogKipOb3RlOioqIFRoZSByZXN1bHQgb2YgcGlwZSBpcyBub3QgYXV0b21hdGljYWxseSBjdXJyaWVkLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAc2lnICgoKGEsIGIsIC4uLiwgbikgLT4gbyksIChvIC0+IHApLCAuLi4sICh4IC0+IHkpLCAoeSAtPiB6KSkgLT4gKChhLCBiLCAuLi4sIG4pIC0+IHopXG4gKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBmdW5jdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQHNlZSBSLmNvbXBvc2VcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgZiA9IFIucGlwZShNYXRoLnBvdywgUi5uZWdhdGUsIFIuaW5jKTtcbiAqXG4gKiAgICAgIGYoMywgNCk7IC8vIC0oM140KSArIDFcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwaXBlKCkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcigncGlwZSByZXF1aXJlcyBhdCBsZWFzdCBvbmUgYXJndW1lbnQnKTtcbiAgfVxuICByZXR1cm4gX2FyaXR5KGFyZ3VtZW50c1swXS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcmVkdWNlKF9waXBlLCBhcmd1bWVudHNbMF0sIHRhaWwoYXJndW1lbnRzKSkpO1xufTtcbiIsIi8qKlxuICogUHJpdmF0ZSBgY29uY2F0YCBmdW5jdGlvbiB0byBtZXJnZSB0d28gYXJyYXktbGlrZSBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fEFyZ3VtZW50c30gW3NldDE9W11dIEFuIGFycmF5LWxpa2Ugb2JqZWN0LlxuICogQHBhcmFtIHtBcnJheXxBcmd1bWVudHN9IFtzZXQyPVtdXSBBbiBhcnJheS1saWtlIG9iamVjdC5cbiAqIEByZXR1cm4ge0FycmF5fSBBIG5ldywgbWVyZ2VkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIF9jb25jYXQoWzQsIDUsIDZdLCBbMSwgMiwgM10pOyAvLz0+IFs0LCA1LCA2LCAxLCAyLCAzXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jb25jYXQoc2V0MSwgc2V0Mikge1xuICBzZXQxID0gc2V0MSB8fCBbXTtcbiAgc2V0MiA9IHNldDIgfHwgW107XG4gIHZhciBpZHg7XG4gIHZhciBsZW4xID0gc2V0MS5sZW5ndGg7XG4gIHZhciBsZW4yID0gc2V0Mi5sZW5ndGg7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBpZHggPSAwO1xuICB3aGlsZSAoaWR4IDwgbGVuMSkge1xuICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHNldDFbaWR4XTtcbiAgICBpZHggKz0gMTtcbiAgfVxuICBpZHggPSAwO1xuICB3aGlsZSAoaWR4IDwgbGVuMikge1xuICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHNldDJbaWR4XTtcbiAgICBpZHggKz0gMTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciBfY29uY2F0ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY29uY2F0Jyk7XG52YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIG5ldyBsaXN0IHdpdGggdGhlIGdpdmVuIGVsZW1lbnQgYXQgdGhlIGZyb250LCBmb2xsb3dlZCBieSB0aGVcbiAqIGNvbnRlbnRzIG9mIHRoZSBsaXN0LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgYSAtPiBbYV0gLT4gW2FdXG4gKiBAcGFyYW0geyp9IGVsIFRoZSBpdGVtIHRvIGFkZCB0byB0aGUgaGVhZCBvZiB0aGUgb3V0cHV0IGxpc3QuXG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBhZGQgdG8gdGhlIHRhaWwgb2YgdGhlIG91dHB1dCBsaXN0LlxuICogQHJldHVybiB7QXJyYXl9IEEgbmV3IGFycmF5LlxuICogQHNlZSBSLmFwcGVuZFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIucHJlcGVuZCgnZmVlJywgWydmaScsICdmbycsICdmdW0nXSk7IC8vPT4gWydmZWUnLCAnZmknLCAnZm8nLCAnZnVtJ11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIHByZXBlbmQoZWwsIGxpc3QpIHtcbiAgcmV0dXJuIF9jb25jYXQoW2VsXSwgbGlzdCk7XG59KTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aGVuIHN1cHBsaWVkIGFuIG9iamVjdCByZXR1cm5zIHRoZSBpbmRpY2F0ZWRcbiAqIHByb3BlcnR5IG9mIHRoYXQgb2JqZWN0LCBpZiBpdCBleGlzdHMuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAc2lnIHMgLT4ge3M6IGF9IC0+IGEgfCBVbmRlZmluZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBwIFRoZSBwcm9wZXJ0eSBuYW1lXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcXVlcnlcbiAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZSBhdCBgb2JqLnBgLlxuICogQHNlZSBSLnBhdGhcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnByb3AoJ3gnLCB7eDogMTAwfSk7IC8vPT4gMTAwXG4gKiAgICAgIFIucHJvcCgneCcsIHt9KTsgLy89PiB1bmRlZmluZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIHByb3AocCwgb2JqKSB7IHJldHVybiBvYmpbcF07IH0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfaXNUcmFuc2Zvcm1lcihvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmpbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPT09ICdmdW5jdGlvbic7XG59O1xuIiwidmFyIF9pc0FycmF5ID0gcmVxdWlyZSgnLi9faXNBcnJheScpO1xudmFyIF9pc1RyYW5zZm9ybWVyID0gcmVxdWlyZSgnLi9faXNUcmFuc2Zvcm1lcicpO1xudmFyIF9zbGljZSA9IHJlcXVpcmUoJy4vX3NsaWNlJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBkaXNwYXRjaGVzIHdpdGggZGlmZmVyZW50IHN0cmF0ZWdpZXMgYmFzZWQgb24gdGhlXG4gKiBvYmplY3QgaW4gbGlzdCBwb3NpdGlvbiAobGFzdCBhcmd1bWVudCkuIElmIGl0IGlzIGFuIGFycmF5LCBleGVjdXRlcyBbZm5dLlxuICogT3RoZXJ3aXNlLCBpZiBpdCBoYXMgYSBmdW5jdGlvbiB3aXRoIFttZXRob2RuYW1lXSwgaXQgd2lsbCBleGVjdXRlIHRoYXRcbiAqIGZ1bmN0aW9uIChmdW5jdG9yIGNhc2UpLiBPdGhlcndpc2UsIGlmIGl0IGlzIGEgdHJhbnNmb3JtZXIsIHVzZXMgdHJhbnNkdWNlclxuICogW3hmXSB0byByZXR1cm4gYSBuZXcgdHJhbnNmb3JtZXIgKHRyYW5zZHVjZXIgY2FzZSkuIE90aGVyd2lzZSwgaXQgd2lsbFxuICogZGVmYXVsdCB0byBleGVjdXRpbmcgW2ZuXS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZG5hbWUgcHJvcGVydHkgdG8gY2hlY2sgZm9yIGEgY3VzdG9tIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB4ZiB0cmFuc2R1Y2VyIHRvIGluaXRpYWxpemUgaWYgb2JqZWN0IGlzIHRyYW5zZm9ybWVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBkZWZhdWx0IHJhbWRhIGltcGxlbWVudGF0aW9uXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0aGF0IGRpc3BhdGNoZXMgb24gb2JqZWN0IGluIGxpc3QgcG9zaXRpb25cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZGlzcGF0Y2hhYmxlKG1ldGhvZG5hbWUsIHhmLCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZuKCk7XG4gICAgfVxuICAgIHZhciBvYmogPSBhcmd1bWVudHNbbGVuZ3RoIC0gMV07XG4gICAgaWYgKCFfaXNBcnJheShvYmopKSB7XG4gICAgICB2YXIgYXJncyA9IF9zbGljZShhcmd1bWVudHMsIDAsIGxlbmd0aCAtIDEpO1xuICAgICAgaWYgKHR5cGVvZiBvYmpbbWV0aG9kbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIG9ialttZXRob2RuYW1lXS5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgfVxuICAgICAgaWYgKF9pc1RyYW5zZm9ybWVyKG9iaikpIHtcbiAgICAgICAgdmFyIHRyYW5zZHVjZXIgPSB4Zi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgcmV0dXJuIHRyYW5zZHVjZXIob2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfbWFwKGZuLCBmdW5jdG9yKSB7XG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gZnVuY3Rvci5sZW5ndGg7XG4gIHZhciByZXN1bHQgPSBBcnJheShsZW4pO1xuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgcmVzdWx0W2lkeF0gPSBmbihmdW5jdG9yW2lkeF0pO1xuICAgIGlkeCArPSAxO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvaW5pdCddKCk7XG4gIH0sXG4gIHJlc3VsdDogZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShyZXN1bHQpO1xuICB9XG59O1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL19jdXJyeTInKTtcbnZhciBfeGZCYXNlID0gcmVxdWlyZSgnLi9feGZCYXNlJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFhNYXAoZiwgeGYpIHtcbiAgICB0aGlzLnhmID0geGY7XG4gICAgdGhpcy5mID0gZjtcbiAgfVxuICBYTWFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IF94ZkJhc2UucmVzdWx0O1xuICBYTWFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIHRoaXMuZihpbnB1dCkpO1xuICB9O1xuXG4gIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94bWFwKGYsIHhmKSB7IHJldHVybiBuZXcgWE1hcChmLCB4Zik7IH0pO1xufSgpKTtcbiIsInZhciBfYXJpdHkgPSByZXF1aXJlKCcuL19hcml0eScpO1xudmFyIF9pc1BsYWNlaG9sZGVyID0gcmVxdWlyZSgnLi9faXNQbGFjZWhvbGRlcicpO1xuXG5cbi8qKlxuICogSW50ZXJuYWwgY3VycnlOIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIGFyaXR5IG9mIHRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtBcnJheX0gcmVjZWl2ZWQgQW4gYXJyYXkgb2YgYXJndW1lbnRzIHJlY2VpdmVkIHRodXMgZmFyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9jdXJyeU4obGVuZ3RoLCByZWNlaXZlZCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb21iaW5lZCA9IFtdO1xuICAgIHZhciBhcmdzSWR4ID0gMDtcbiAgICB2YXIgbGVmdCA9IGxlbmd0aDtcbiAgICB2YXIgY29tYmluZWRJZHggPSAwO1xuICAgIHdoaWxlIChjb21iaW5lZElkeCA8IHJlY2VpdmVkLmxlbmd0aCB8fCBhcmdzSWR4IDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGlmIChjb21iaW5lZElkeCA8IHJlY2VpdmVkLmxlbmd0aCAmJlxuICAgICAgICAgICghX2lzUGxhY2Vob2xkZXIocmVjZWl2ZWRbY29tYmluZWRJZHhdKSB8fFxuICAgICAgICAgICBhcmdzSWR4ID49IGFyZ3VtZW50cy5sZW5ndGgpKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlY2VpdmVkW2NvbWJpbmVkSWR4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGFyZ3VtZW50c1thcmdzSWR4XTtcbiAgICAgICAgYXJnc0lkeCArPSAxO1xuICAgICAgfVxuICAgICAgY29tYmluZWRbY29tYmluZWRJZHhdID0gcmVzdWx0O1xuICAgICAgaWYgKCFfaXNQbGFjZWhvbGRlcihyZXN1bHQpKSB7XG4gICAgICAgIGxlZnQgLT0gMTtcbiAgICAgIH1cbiAgICAgIGNvbWJpbmVkSWR4ICs9IDE7XG4gICAgfVxuICAgIHJldHVybiBsZWZ0IDw9IDAgPyBmbi5hcHBseSh0aGlzLCBjb21iaW5lZClcbiAgICAgICAgICAgICAgICAgICAgIDogX2FyaXR5KGxlZnQsIF9jdXJyeU4obGVuZ3RoLCBjb21iaW5lZCwgZm4pKTtcbiAgfTtcbn07XG4iLCJ2YXIgX2FyaXR5ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fYXJpdHknKTtcbnZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG52YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIF9jdXJyeU4gPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeU4nKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBjdXJyaWVkIGVxdWl2YWxlbnQgb2YgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uLCB3aXRoIHRoZSBzcGVjaWZpZWRcbiAqIGFyaXR5LiBUaGUgY3VycmllZCBmdW5jdGlvbiBoYXMgdHdvIHVudXN1YWwgY2FwYWJpbGl0aWVzLiBGaXJzdCwgaXRzXG4gKiBhcmd1bWVudHMgbmVlZG4ndCBiZSBwcm92aWRlZCBvbmUgYXQgYSB0aW1lLiBJZiBgZ2AgaXMgYFIuY3VycnlOKDMsIGYpYCwgdGhlXG4gKiBmb2xsb3dpbmcgYXJlIGVxdWl2YWxlbnQ6XG4gKlxuICogICAtIGBnKDEpKDIpKDMpYFxuICogICAtIGBnKDEpKDIsIDMpYFxuICogICAtIGBnKDEsIDIpKDMpYFxuICogICAtIGBnKDEsIDIsIDMpYFxuICpcbiAqIFNlY29uZGx5LCB0aGUgc3BlY2lhbCBwbGFjZWhvbGRlciB2YWx1ZSBgUi5fX2AgbWF5IGJlIHVzZWQgdG8gc3BlY2lmeVxuICogXCJnYXBzXCIsIGFsbG93aW5nIHBhcnRpYWwgYXBwbGljYXRpb24gb2YgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyxcbiAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgcG9zaXRpb25zLiBJZiBgZ2AgaXMgYXMgYWJvdmUgYW5kIGBfYCBpcyBgUi5fX2AsIHRoZVxuICogZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICpcbiAqICAgLSBgZygxLCAyLCAzKWBcbiAqICAgLSBgZyhfLCAyLCAzKSgxKWBcbiAqICAgLSBgZyhfLCBfLCAzKSgxKSgyKWBcbiAqICAgLSBgZyhfLCBfLCAzKSgxLCAyKWBcbiAqICAgLSBgZyhfLCAyKSgxKSgzKWBcbiAqICAgLSBgZyhfLCAyKSgxLCAzKWBcbiAqICAgLSBgZyhfLCAyKShfLCAzKSgxKWBcbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC41LjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyBOdW1iZXIgLT4gKCogLT4gYSkgLT4gKCogLT4gYSlcbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIGFyaXR5IGZvciB0aGUgcmV0dXJuZWQgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcsIGN1cnJpZWQgZnVuY3Rpb24uXG4gKiBAc2VlIFIuY3VycnlcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgc3VtQXJncyA9ICguLi5hcmdzKSA9PiBSLnN1bShhcmdzKTtcbiAqXG4gKiAgICAgIHZhciBjdXJyaWVkQWRkRm91ck51bWJlcnMgPSBSLmN1cnJ5Tig0LCBzdW1BcmdzKTtcbiAqICAgICAgdmFyIGYgPSBjdXJyaWVkQWRkRm91ck51bWJlcnMoMSwgMik7XG4gKiAgICAgIHZhciBnID0gZigzKTtcbiAqICAgICAgZyg0KTsgLy89PiAxMFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gY3VycnlOKGxlbmd0aCwgZm4pIHtcbiAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBfY3VycnkxKGZuKTtcbiAgfVxuICByZXR1cm4gX2FyaXR5KGxlbmd0aCwgX2N1cnJ5TihsZW5ndGgsIFtdLCBmbikpO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9oYXMocHJvcCwgb2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn07XG4iLCJ2YXIgX2hhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChhcmd1bWVudHMpID09PSAnW29iamVjdCBBcmd1bWVudHNdJyA/XG4gICAgZnVuY3Rpb24gX2lzQXJndW1lbnRzKHgpIHsgcmV0dXJuIHRvU3RyaW5nLmNhbGwoeCkgPT09ICdbb2JqZWN0IEFyZ3VtZW50c10nOyB9IDpcbiAgICBmdW5jdGlvbiBfaXNBcmd1bWVudHMoeCkgeyByZXR1cm4gX2hhcygnY2FsbGVlJywgeCk7IH07XG59KCkpO1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTEnKTtcbnZhciBfaGFzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9faGFzJyk7XG52YXIgX2lzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9faXNBcmd1bWVudHMnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBsaXN0IGNvbnRhaW5pbmcgdGhlIG5hbWVzIG9mIGFsbCB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBvZlxuICogdGhlIHN1cHBsaWVkIG9iamVjdC5cbiAqIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIG91dHB1dCBhcnJheSBpcyBub3QgZ3VhcmFudGVlZCB0byBiZSBjb25zaXN0ZW50XG4gKiBhY3Jvc3MgZGlmZmVyZW50IEpTIHBsYXRmb3Jtcy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcge2s6IHZ9IC0+IFtrXVxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgcHJvcGVydGllcyBmcm9tXG4gKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgdGhlIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIua2V5cyh7YTogMSwgYjogMiwgYzogM30pOyAvLz0+IFsnYScsICdiJywgJ2MnXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgLy8gY292ZXIgSUUgPCA5IGtleXMgaXNzdWVzXG4gIHZhciBoYXNFbnVtQnVnID0gISh7dG9TdHJpbmc6IG51bGx9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFsnY29uc3RydWN0b3InLCAndmFsdWVPZicsICdpc1Byb3RvdHlwZU9mJywgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTtcbiAgLy8gU2FmYXJpIGJ1Z1xuICB2YXIgaGFzQXJnc0VudW1CdWcgPSAoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHJldHVybiBhcmd1bWVudHMucHJvcGVydHlJc0VudW1lcmFibGUoJ2xlbmd0aCcpO1xuICB9KCkpO1xuXG4gIHZhciBjb250YWlucyA9IGZ1bmN0aW9uIGNvbnRhaW5zKGxpc3QsIGl0ZW0pIHtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgIGlmIChsaXN0W2lkeF0gPT09IGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZHggKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIHJldHVybiB0eXBlb2YgT2JqZWN0LmtleXMgPT09ICdmdW5jdGlvbicgJiYgIWhhc0FyZ3NFbnVtQnVnID9cbiAgICBfY3VycnkxKGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgICByZXR1cm4gT2JqZWN0KG9iaikgIT09IG9iaiA/IFtdIDogT2JqZWN0LmtleXMob2JqKTtcbiAgICB9KSA6XG4gICAgX2N1cnJ5MShmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgICAgaWYgKE9iamVjdChvYmopICE9PSBvYmopIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgdmFyIHByb3AsIG5JZHg7XG4gICAgICB2YXIga3MgPSBbXTtcbiAgICAgIHZhciBjaGVja0FyZ3NMZW5ndGggPSBoYXNBcmdzRW51bUJ1ZyAmJiBfaXNBcmd1bWVudHMob2JqKTtcbiAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKF9oYXMocHJvcCwgb2JqKSAmJiAoIWNoZWNrQXJnc0xlbmd0aCB8fCBwcm9wICE9PSAnbGVuZ3RoJykpIHtcbiAgICAgICAgICBrc1trcy5sZW5ndGhdID0gcHJvcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGhhc0VudW1CdWcpIHtcbiAgICAgICAgbklkeCA9IG5vbkVudW1lcmFibGVQcm9wcy5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAobklkeCA+PSAwKSB7XG4gICAgICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tuSWR4XTtcbiAgICAgICAgICBpZiAoX2hhcyhwcm9wLCBvYmopICYmICFjb250YWlucyhrcywgcHJvcCkpIHtcbiAgICAgICAgICAgIGtzW2tzLmxlbmd0aF0gPSBwcm9wO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuSWR4IC09IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBrcztcbiAgICB9KTtcbn0oKSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIF9kaXNwYXRjaGFibGUgPSByZXF1aXJlKCcuL2ludGVybmFsL19kaXNwYXRjaGFibGUnKTtcbnZhciBfbWFwID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fbWFwJyk7XG52YXIgX3JlZHVjZSA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX3JlZHVjZScpO1xudmFyIF94bWFwID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9feG1hcCcpO1xudmFyIGN1cnJ5TiA9IHJlcXVpcmUoJy4vY3VycnlOJyk7XG52YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG5cbi8qKlxuICogVGFrZXMgYSBmdW5jdGlvbiBhbmRcbiAqIGEgW2Z1bmN0b3JdKGh0dHBzOi8vZ2l0aHViLmNvbS9mYW50YXN5bGFuZC9mYW50YXN5LWxhbmQjZnVuY3RvciksXG4gKiBhcHBsaWVzIHRoZSBmdW5jdGlvbiB0byBlYWNoIG9mIHRoZSBmdW5jdG9yJ3MgdmFsdWVzLCBhbmQgcmV0dXJuc1xuICogYSBmdW5jdG9yIG9mIHRoZSBzYW1lIHNoYXBlLlxuICpcbiAqIFJhbWRhIHByb3ZpZGVzIHN1aXRhYmxlIGBtYXBgIGltcGxlbWVudGF0aW9ucyBmb3IgYEFycmF5YCBhbmQgYE9iamVjdGAsXG4gKiBzbyB0aGlzIGZ1bmN0aW9uIG1heSBiZSBhcHBsaWVkIHRvIGBbMSwgMiwgM11gIG9yIGB7eDogMSwgeTogMiwgejogM31gLlxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGBtYXBgIG1ldGhvZCBvZiB0aGUgc2Vjb25kIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAqXG4gKiBBbHNvIHRyZWF0cyBmdW5jdGlvbnMgYXMgZnVuY3RvcnMgYW5kIHdpbGwgY29tcG9zZSB0aGVtIHRvZ2V0aGVyLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgRnVuY3RvciBmID0+IChhIC0+IGIpIC0+IGYgYSAtPiBmIGJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gZXZlcnkgZWxlbWVudCBvZiB0aGUgaW5wdXQgYGxpc3RgLlxuICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBiZSBpdGVyYXRlZCBvdmVyLlxuICogQHJldHVybiB7QXJyYXl9IFRoZSBuZXcgbGlzdC5cbiAqIEBzZWUgUi50cmFuc2R1Y2UsIFIuYWRkSW5kZXhcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgZG91YmxlID0geCA9PiB4ICogMjtcbiAqXG4gKiAgICAgIFIubWFwKGRvdWJsZSwgWzEsIDIsIDNdKTsgLy89PiBbMiwgNCwgNl1cbiAqXG4gKiAgICAgIFIubWFwKGRvdWJsZSwge3g6IDEsIHk6IDIsIHo6IDN9KTsgLy89PiB7eDogMiwgeTogNCwgejogNn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKF9kaXNwYXRjaGFibGUoJ21hcCcsIF94bWFwLCBmdW5jdGlvbiBtYXAoZm4sIGZ1bmN0b3IpIHtcbiAgc3dpdGNoIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZnVuY3RvcikpIHtcbiAgICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6XG4gICAgICByZXR1cm4gY3VycnlOKGZ1bmN0b3IubGVuZ3RoLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZnVuY3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICAgIH0pO1xuICAgIGNhc2UgJ1tvYmplY3QgT2JqZWN0XSc6XG4gICAgICByZXR1cm4gX3JlZHVjZShmdW5jdGlvbihhY2MsIGtleSkge1xuICAgICAgICBhY2Nba2V5XSA9IGZuKGZ1bmN0b3Jba2V5XSk7XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSwga2V5cyhmdW5jdG9yKSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBfbWFwKGZuLCBmdW5jdG9yKTtcbiAgfVxufSkpO1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBtYXAgPSByZXF1aXJlKCcuL21hcCcpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGxlbnMgZm9yIHRoZSBnaXZlbiBnZXR0ZXIgYW5kIHNldHRlciBmdW5jdGlvbnMuIFRoZSBnZXR0ZXIgXCJnZXRzXCJcbiAqIHRoZSB2YWx1ZSBvZiB0aGUgZm9jdXM7IHRoZSBzZXR0ZXIgXCJzZXRzXCIgdGhlIHZhbHVlIG9mIHRoZSBmb2N1cy4gVGhlIHNldHRlclxuICogc2hvdWxkIG5vdCBtdXRhdGUgdGhlIGRhdGEgc3RydWN0dXJlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjguMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHR5cGVkZWZuIExlbnMgcyBhID0gRnVuY3RvciBmID0+IChhIC0+IGYgYSkgLT4gcyAtPiBmIHNcbiAqIEBzaWcgKHMgLT4gYSkgLT4gKChhLCBzKSAtPiBzKSAtPiBMZW5zIHMgYVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZ2V0dGVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzZXR0ZXJcbiAqIEByZXR1cm4ge0xlbnN9XG4gKiBAc2VlIFIudmlldywgUi5zZXQsIFIub3ZlciwgUi5sZW5zSW5kZXgsIFIubGVuc1Byb3BcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgeExlbnMgPSBSLmxlbnMoUi5wcm9wKCd4JyksIFIuYXNzb2MoJ3gnKSk7XG4gKlxuICogICAgICBSLnZpZXcoeExlbnMsIHt4OiAxLCB5OiAyfSk7ICAgICAgICAgICAgLy89PiAxXG4gKiAgICAgIFIuc2V0KHhMZW5zLCA0LCB7eDogMSwgeTogMn0pOyAgICAgICAgICAvLz0+IHt4OiA0LCB5OiAyfVxuICogICAgICBSLm92ZXIoeExlbnMsIFIubmVnYXRlLCB7eDogMSwgeTogMn0pOyAgLy89PiB7eDogLTEsIHk6IDJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBsZW5zKGdldHRlciwgc2V0dGVyKSB7XG4gIHJldHVybiBmdW5jdGlvbih0b0Z1bmN0b3JGbikge1xuICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIHJldHVybiBtYXAoXG4gICAgICAgIGZ1bmN0aW9uKGZvY3VzKSB7XG4gICAgICAgICAgcmV0dXJuIHNldHRlcihmb2N1cywgdGFyZ2V0KTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9GdW5jdG9yRm4oZ2V0dGVyKHRhcmdldCkpXG4gICAgICApO1xuICAgIH07XG4gIH07XG59KTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG52YXIgY3VycnlOID0gcmVxdWlyZSgnLi9jdXJyeU4nKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBjdXJyaWVkIGVxdWl2YWxlbnQgb2YgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uLiBUaGUgY3VycmllZCBmdW5jdGlvblxuICogaGFzIHR3byB1bnVzdWFsIGNhcGFiaWxpdGllcy4gRmlyc3QsIGl0cyBhcmd1bWVudHMgbmVlZG4ndCBiZSBwcm92aWRlZCBvbmVcbiAqIGF0IGEgdGltZS4gSWYgYGZgIGlzIGEgdGVybmFyeSBmdW5jdGlvbiBhbmQgYGdgIGlzIGBSLmN1cnJ5KGYpYCwgdGhlXG4gKiBmb2xsb3dpbmcgYXJlIGVxdWl2YWxlbnQ6XG4gKlxuICogICAtIGBnKDEpKDIpKDMpYFxuICogICAtIGBnKDEpKDIsIDMpYFxuICogICAtIGBnKDEsIDIpKDMpYFxuICogICAtIGBnKDEsIDIsIDMpYFxuICpcbiAqIFNlY29uZGx5LCB0aGUgc3BlY2lhbCBwbGFjZWhvbGRlciB2YWx1ZSBgUi5fX2AgbWF5IGJlIHVzZWQgdG8gc3BlY2lmeVxuICogXCJnYXBzXCIsIGFsbG93aW5nIHBhcnRpYWwgYXBwbGljYXRpb24gb2YgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyxcbiAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgcG9zaXRpb25zLiBJZiBgZ2AgaXMgYXMgYWJvdmUgYW5kIGBfYCBpcyBgUi5fX2AsIHRoZVxuICogZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICpcbiAqICAgLSBgZygxLCAyLCAzKWBcbiAqICAgLSBgZyhfLCAyLCAzKSgxKWBcbiAqICAgLSBgZyhfLCBfLCAzKSgxKSgyKWBcbiAqICAgLSBgZyhfLCBfLCAzKSgxLCAyKWBcbiAqICAgLSBgZyhfLCAyKSgxKSgzKWBcbiAqICAgLSBgZyhfLCAyKSgxLCAzKWBcbiAqICAgLSBgZyhfLCAyKShfLCAzKSgxKWBcbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyAoKiAtPiBhKSAtPiAoKiAtPiBhKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3LCBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHNlZSBSLmN1cnJ5TlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIHZhciBhZGRGb3VyTnVtYmVycyA9IChhLCBiLCBjLCBkKSA9PiBhICsgYiArIGMgKyBkO1xuICpcbiAqICAgICAgdmFyIGN1cnJpZWRBZGRGb3VyTnVtYmVycyA9IFIuY3VycnkoYWRkRm91ck51bWJlcnMpO1xuICogICAgICB2YXIgZiA9IGN1cnJpZWRBZGRGb3VyTnVtYmVycygxLCAyKTtcbiAqICAgICAgdmFyIGcgPSBmKDMpO1xuICogICAgICBnKDQpOyAvLz0+IDEwXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MShmdW5jdGlvbiBjdXJyeShmbikge1xuICByZXR1cm4gY3VycnlOKGZuLmxlbmd0aCwgZm4pO1xufSk7XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNCBRdWlsZHJlZW4gTW90dGEgPHF1aWxkcmVlbkBnbWFpbC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbi8vIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzXG4vLyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4vLyBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuLy8gcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbi8vIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4vLyBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuLy8gaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbi8vIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkRcbi8vIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbi8vIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT05cbi8vIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8qKlxuICogQG1vZHVsZSBsaWIvZWl0aGVyXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gRWl0aGVyXG5cbi8vIC0tIEFsaWFzZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNsb25lICAgICAgICAgPSBPYmplY3QuY3JlYXRlXG52YXIgdW5pbXBsZW1lbnRlZCA9IGZ1bmN0aW9uKCl7IHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkLicpIH1cbnZhciBub29wICAgICAgICAgID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXMgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cbi8vIC0tIEltcGxlbWVudGF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRoZSBgRWl0aGVyKGEsIGIpYCBzdHJ1Y3R1cmUgcmVwcmVzZW50cyB0aGUgbG9naWNhbCBkaXNqdW5jdGlvbiBiZXR3ZWVuIGBhYFxuICogYW5kIGBiYC4gSW4gb3RoZXIgd29yZHMsIGBFaXRoZXJgIG1heSBjb250YWluIGVpdGhlciBhIHZhbHVlIG9mIHR5cGUgYGFgIG9yXG4gKiBhIHZhbHVlIG9mIHR5cGUgYGJgLCBhdCBhbnkgZ2l2ZW4gdGltZS4gVGhpcyBwYXJ0aWN1bGFyIGltcGxlbWVudGF0aW9uIGlzXG4gKiBiaWFzZWQgb24gdGhlIHJpZ2h0IHZhbHVlIChgYmApLCB0aHVzIHByb2plY3Rpb25zIHdpbGwgdGFrZSB0aGUgcmlnaHQgdmFsdWVcbiAqIG92ZXIgdGhlIGxlZnQgb25lLlxuICpcbiAqIFRoaXMgY2xhc3MgbW9kZWxzIHR3byBkaWZmZXJlbnQgY2FzZXM6IGBMZWZ0IGFgIGFuZCBgUmlnaHQgYmAsIGFuZCBjYW4gaG9sZFxuICogb25lIG9mIHRoZSBjYXNlcyBhdCBhbnkgZ2l2ZW4gdGltZS4gVGhlIHByb2plY3Rpb25zIGFyZSwgbm9uZSB0aGUgbGVzcyxcbiAqIGJpYXNlZCBmb3IgdGhlIGBSaWdodGAgY2FzZSwgdGh1cyBhIGNvbW1vbiB1c2UgY2FzZSBmb3IgdGhpcyBzdHJ1Y3R1cmUgaXMgdG9cbiAqIGhvbGQgdGhlIHJlc3VsdHMgb2YgY29tcHV0YXRpb25zIHRoYXQgbWF5IGZhaWwsIHdoZW4geW91IHdhbnQgdG8gc3RvcmVcbiAqIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gb24gdGhlIGZhaWx1cmUgKGluc3RlYWQgb2YgdGhyb3dpbmcgYW4gZXhjZXB0aW9uKS5cbiAqXG4gKiBGdXJ0aGVybW9yZSwgdGhlIHZhbHVlcyBvZiBgRWl0aGVyKGEsIGIpYCBjYW4gYmUgY29tYmluZWQgYW5kIG1hbmlwdWxhdGVkIGJ5XG4gKiB1c2luZyB0aGUgZXhwcmVzc2l2ZSBtb25hZGljIG9wZXJhdGlvbnMuIFRoaXMgYWxsb3dzIHNhZmVseSBzZXF1ZW5jaW5nXG4gKiBvcGVyYXRpb25zIHRoYXQgbWF5IGZhaWwsIGFuZCBzYWZlbHkgY29tcG9zaW5nIHZhbHVlcyB0aGF0IHlvdSBkb24ndCBrbm93XG4gKiB3aGV0aGVyIHRoZXkncmUgcHJlc2VudCBvciBub3QsIGZhaWxpbmcgZWFybHkgKHJldHVybmluZyBhIGBMZWZ0IGFgKSBpZiBhbnlcbiAqIG9mIHRoZSBvcGVyYXRpb25zIGZhaWwuXG4gKlxuICogV2hpbGUgdGhpcyBjbGFzcyBjYW4gY2VydGFpbmx5IG1vZGVsIGlucHV0IHZhbGlkYXRpb25zLCB0aGUgW1ZhbGlkYXRpb25dW11cbiAqIHN0cnVjdHVyZSBsZW5kcyBpdHNlbGYgYmV0dGVyIHRvIHRoYXQgdXNlIGNhc2UsIHNpbmNlIGl0IGNhbiBuYXR1cmFsbHlcbiAqIGFnZ3JlZ2F0ZSBmYWlsdXJlcyDigJQgbW9uYWRzIHNob3J0Y3V0IG9uIHRoZSBmaXJzdCBmYWlsdXJlLlxuICpcbiAqIFtWYWxpZGF0aW9uXTogaHR0cHM6Ly9naXRodWIuY29tL2ZvbGt0YWxlL2RhdGEudmFsaWRhdGlvblxuICpcbiAqXG4gKiBAY2xhc3NcbiAqIEBzdW1tYXJ5XG4gKiBFaXRoZXJbzrEsIM6yXSA8OiBBcHBsaWNhdGl2ZVvOsl1cbiAqICAgICAgICAgICAgICAgLCBGdW5jdG9yW86yXVxuICogICAgICAgICAgICAgICAsIENoYWluW86yXVxuICogICAgICAgICAgICAgICAsIFNob3dcbiAqICAgICAgICAgICAgICAgLCBFcVxuICovXG5mdW5jdGlvbiBFaXRoZXIoKSB7IH1cblxuTGVmdC5wcm90b3R5cGUgPSBjbG9uZShFaXRoZXIucHJvdG90eXBlKVxuZnVuY3Rpb24gTGVmdChhKSB7XG4gIHRoaXMudmFsdWUgPSBhXG59XG5cblJpZ2h0LnByb3RvdHlwZSA9IGNsb25lKEVpdGhlci5wcm90b3R5cGUpXG5mdW5jdGlvbiBSaWdodChhKSB7XG4gIHRoaXMudmFsdWUgPSBhXG59XG5cbi8vIC0tIENvbnN0cnVjdG9ycyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUgaG9sZGluZyBhIGBMZWZ0YCB2YWx1ZS4gVGhpc1xuICogdXN1YWxseSByZXByZXNlbnRzIGEgZmFpbHVyZSBkdWUgdG8gdGhlIHJpZ2h0LWJpYXMgb2YgdGhpcyBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgYSDihpIgRWl0aGVyW86xLCDOsl1cbiAqL1xuRWl0aGVyLkxlZnQgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBuZXcgTGVmdChhKVxufVxuRWl0aGVyLnByb3RvdHlwZS5MZWZ0ID0gRWl0aGVyLkxlZnRcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIGhvbGRpbmcgYSBgUmlnaHRgIHZhbHVlLiBUaGlzXG4gKiB1c3VhbGx5IHJlcHJlc2VudHMgYSBzdWNjZXNzZnVsIHZhbHVlIGR1ZSB0byB0aGUgcmlnaHQgYmlhcyBvZiB0aGlzXG4gKiBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrIg4oaSIEVpdGhlclvOsSwgzrJdXG4gKi9cbkVpdGhlci5SaWdodCA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIG5ldyBSaWdodChhKVxufVxuRWl0aGVyLnByb3RvdHlwZS5SaWdodCA9IEVpdGhlci5SaWdodFxuXG5cbi8vIC0tIENvbnZlcnNpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBuZXcgYEVpdGhlclvOsSwgzrJdYCBzdHJ1Y3R1cmUgZnJvbSBhIG51bGxhYmxlIHR5cGUuXG4gKlxuICogVGFrZXMgdGhlIGBMZWZ0YCBjYXNlIGlmIHRoZSB2YWx1ZSBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAuIFRha2VzIHRoZVxuICogYFJpZ2h0YCBjYXNlIG90aGVyd2lzZS5cbiAqXG4gKiBAc3VtbWFyeSDOsSDihpIgRWl0aGVyW86xLCDOsV1cbiAqL1xuRWl0aGVyLmZyb21OdWxsYWJsZSA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGEgIT0gbnVsbD8gICAgICAgbmV3IFJpZ2h0KGEpXG4gIDogICAgICAvKiBvdGhlcndpc2UgKi8gIG5ldyBMZWZ0KGEpXG59XG5FaXRoZXIucHJvdG90eXBlLmZyb21OdWxsYWJsZSA9IEVpdGhlci5mcm9tTnVsbGFibGVcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIGZyb20gYSBgVmFsaWRhdGlvblvOsSwgzrJdYCB0eXBlLlxuICpcbiAqIEBzdW1tYXJ5IFZhbGlkYXRpb25bzrEsIM6yXSDihpIgRWl0aGVyW86xLCDOsl1cbiAqL1xuRWl0aGVyLmZyb21WYWxpZGF0aW9uID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYS5mb2xkKEVpdGhlci5MZWZ0LCBFaXRoZXIuUmlnaHQpXG59XG5cbi8qKlxuICogRXhlY3V0ZXMgYSBzeW5jaHJvbm91cyBjb21wdXRhdGlvbiB0aGF0IG1heSB0aHJvdyBhbmQgY29udmVydHMgaXQgdG8gYW5cbiAqIEVpdGhlciB0eXBlLlxuICpcbiAqIEBzdW1tYXJ5ICjOseKCgSwgzrHigoIsIC4uLiwgzrHigpkgLT4gzrIgOjogdGhyb3dzIM6zKSAtPiAozrHigoEsIM6x4oKCLCAuLi4sIM6x4oKZIC0+IEVpdGhlclvOsywgzrJdKVxuICovXG5FaXRoZXIudHJ5ID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBuZXcgUmlnaHQoZi5hcHBseShudWxsLCBhcmd1bWVudHMpKVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgcmV0dXJuIG5ldyBMZWZ0KGUpXG4gICAgfVxuICB9XG59XG5cblxuLy8gLS0gUHJlZGljYXRlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVHJ1ZSBpZiB0aGUgYEVpdGhlclvOsSwgzrJdYCBjb250YWlucyBhIGBMZWZ0YCB2YWx1ZS5cbiAqXG4gKiBAc3VtbWFyeSBCb29sZWFuXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuaXNMZWZ0ID0gZmFsc2VcbkxlZnQucHJvdG90eXBlLmlzTGVmdCAgID0gdHJ1ZVxuXG4vKipcbiAqIFRydWUgaWYgdGhlIGBFaXRoZXJbzrEsIM6yXWAgY29udGFpbnMgYSBgUmlnaHRgIHZhbHVlLlxuICpcbiAqIEBzdW1tYXJ5IEJvb2xlYW5cbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5pc1JpZ2h0ID0gZmFsc2VcblJpZ2h0LnByb3RvdHlwZS5pc1JpZ2h0ICA9IHRydWVcblxuXG4vLyAtLSBBcHBsaWNhdGl2ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBFaXRoZXJbzrEsIM6yXWAgaW5zdGFuY2UgaG9sZGluZyB0aGUgYFJpZ2h0YCB2YWx1ZSBgYmAuXG4gKlxuICogYGJgIGNhbiBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAsIGB1bmRlZmluZWRgIG9yIGFub3RoZXJcbiAqIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlLlxuICpcbiAqIEBzdW1tYXJ5IM6yIOKGkiBFaXRoZXJbzrEsIM6yXVxuICovXG5FaXRoZXIub2YgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBuZXcgUmlnaHQoYSlcbn1cbkVpdGhlci5wcm90b3R5cGUub2YgPSBFaXRoZXIub2ZcblxuXG4vKipcbiAqIEFwcGxpZXMgdGhlIGZ1bmN0aW9uIGluc2lkZSB0aGUgYFJpZ2h0YCBjYXNlIG9mIHRoZSBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZVxuICogdG8gYW5vdGhlciBhcHBsaWNhdGl2ZSB0eXBlLlxuICpcbiAqIFRoZSBgRWl0aGVyW86xLCDOsl1gIHNob3VsZCBjb250YWluIGEgZnVuY3Rpb24gdmFsdWUsIG90aGVyd2lzZSBhIGBUeXBlRXJyb3JgXG4gKiBpcyB0aHJvd24uXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yIOKGkiDOs10sIGY6QXBwbGljYXRpdmVbX10pID0+IGZbzrJdIOKGkiBmW86zXVxuICovXG5FaXRoZXIucHJvdG90eXBlLmFwID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5hcCA9IGZ1bmN0aW9uKGIpIHtcbiAgcmV0dXJuIHRoaXNcbn1cblxuUmlnaHQucHJvdG90eXBlLmFwID0gZnVuY3Rpb24oYikge1xuICByZXR1cm4gYi5tYXAodGhpcy52YWx1ZSlcbn1cblxuXG4vLyAtLSBGdW5jdG9yIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSBgUmlnaHRgIHZhbHVlIG9mIHRoZSBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZSB1c2luZyBhIHJlZ3VsYXJcbiAqIHVuYXJ5IGZ1bmN0aW9uLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+ICjOsiDihpIgzrMpIOKGkiBFaXRoZXJbzrEsIM6zXVxuICovXG5FaXRoZXIucHJvdG90eXBlLm1hcCA9IHVuaW1wbGVtZW50ZWRcbkxlZnQucHJvdG90eXBlLm1hcCAgID0gbm9vcFxuXG5SaWdodC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gdGhpcy5vZihmKHRoaXMudmFsdWUpKVxufVxuXG5cbi8vIC0tIENoYWluIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIGBSaWdodGAgdmFsdWUgb2YgdGhlIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIHVzaW5nIGFuIHVuYXJ5XG4gKiBmdW5jdGlvbiB0byBtb25hZHMuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSwgbTpNb25hZFtfXSkgPT4gKM6yIOKGkiBtW86zXSkg4oaSIG1bzrNdXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuY2hhaW4gPSB1bmltcGxlbWVudGVkXG5MZWZ0LnByb3RvdHlwZS5jaGFpbiAgID0gbm9vcFxuXG5SaWdodC5wcm90b3R5cGUuY2hhaW4gPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBmKHRoaXMudmFsdWUpXG59XG5cblxuLy8gLS0gU2hvdyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogUmV0dXJucyBhIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+IFZvaWQg4oaSIFN0cmluZ1xuICovXG5FaXRoZXIucHJvdG90eXBlLnRvU3RyaW5nID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ0VpdGhlci5MZWZ0KCcgKyB0aGlzLnZhbHVlICsgJyknXG59XG5cblJpZ2h0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ0VpdGhlci5SaWdodCgnICsgdGhpcy52YWx1ZSArICcpJ1xufVxuXG5cbi8vIC0tIEVxIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRlc3RzIGlmIGFuIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlIGlzIGVxdWFsIHRvIGFub3RoZXIgYEVpdGhlclvOsSwgzrJdYFxuICogc3RydWN0dXJlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+IEVpdGhlclvOsSwgzrJdIOKGkiBCb29sZWFuXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuaXNFcXVhbCA9IHVuaW1wbGVtZW50ZWRcblxuTGVmdC5wcm90b3R5cGUuaXNFcXVhbCA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGEuaXNMZWZ0ICYmIChhLnZhbHVlID09PSB0aGlzLnZhbHVlKVxufVxuXG5SaWdodC5wcm90b3R5cGUuaXNFcXVhbCA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGEuaXNSaWdodCAmJiAoYS52YWx1ZSA9PT0gdGhpcy52YWx1ZSlcbn1cblxuXG4vLyAtLSBFeHRyYWN0aW5nIGFuZCByZWNvdmVyaW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBFeHRyYWN0cyB0aGUgYFJpZ2h0YCB2YWx1ZSBvdXQgb2YgdGhlIGBFaXRoZXJbzrEsIM6yXWAgc3RydWN0dXJlLCBpZiBpdFxuICogZXhpc3RzLiBPdGhlcndpc2UgdGhyb3dzIGEgYFR5cGVFcnJvcmAuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gVm9pZCDihpIgzrIgICAgICAgICA6OiBwYXJ0aWFsLCB0aHJvd3NcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpsaWIvZWl0aGVyfkVpdGhlciNnZXRPckVsc2V9IOKAlCBBIGdldHRlciB0aGF0IGNhbiBoYW5kbGUgZmFpbHVyZXMuXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6bGliL2VpdGhlcn5FaXRoZXIjbWVyZ2V9IOKAlCBUaGUgY29udmVyZ2VuY2Ugb2YgYm90aCB2YWx1ZXMuXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IGlmIHRoZSBzdHJ1Y3R1cmUgaGFzIG5vIGBSaWdodGAgdmFsdWUuXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuZ2V0ID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbid0IGV4dHJhY3QgdGhlIHZhbHVlIG9mIGEgTGVmdChhKS5cIilcbn1cblxuUmlnaHQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy52YWx1ZVxufVxuXG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIGBSaWdodGAgdmFsdWUgb3V0IG9mIHRoZSBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZS4gSWYgdGhlXG4gKiBzdHJ1Y3R1cmUgZG9lc24ndCBoYXZlIGEgYFJpZ2h0YCB2YWx1ZSwgcmV0dXJucyB0aGUgZ2l2ZW4gZGVmYXVsdC5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiDOsiDihpIgzrJcbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5nZXRPckVsc2UgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLmdldE9yRWxzZSA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGFcbn1cblxuUmlnaHQucHJvdG90eXBlLmdldE9yRWxzZSA9IGZ1bmN0aW9uKF8pIHtcbiAgcmV0dXJuIHRoaXMudmFsdWVcbn1cblxuXG4vKipcbiAqIFRyYW5zZm9ybXMgYSBgTGVmdGAgdmFsdWUgaW50byBhIG5ldyBgRWl0aGVyW86xLCDOsl1gIHN0cnVjdHVyZS4gRG9lcyBub3RoaW5nXG4gKiBpZiB0aGUgc3RydWN0dXJlIGNvbnRhaW4gYSBgUmlnaHRgIHZhbHVlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsl0pID0+ICjOsSDihpIgRWl0aGVyW86zLCDOsl0pIOKGkiBFaXRoZXJbzrMsIM6yXVxuICovXG5FaXRoZXIucHJvdG90eXBlLm9yRWxzZSA9IHVuaW1wbGVtZW50ZWRcblJpZ2h0LnByb3RvdHlwZS5vckVsc2UgID0gbm9vcFxuXG5MZWZ0LnByb3RvdHlwZS5vckVsc2UgPSBmdW5jdGlvbihmKSB7XG4gIHJldHVybiBmKHRoaXMudmFsdWUpXG59XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB3aGljaGV2ZXIgc2lkZSBvZiB0aGUgZGlzanVuY3Rpb24gdGhhdCBpcyBwcmVzZW50LlxuICpcbiAqIEBzdW1tYXJ5IChARWl0aGVyW86xLCDOsV0pID0+IFZvaWQg4oaSIM6xXG4gKi9cbkVpdGhlci5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudmFsdWVcbn1cblxuXG4vLyAtLSBGb2xkcyBhbmQgRXh0ZW5kZWQgVHJhbnNmb3JtYXRpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBBcHBsaWVzIGEgZnVuY3Rpb24gdG8gZWFjaCBjYXNlIGluIHRoaXMgZGF0YSBzdHJ1Y3R1cmUuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gKM6xIOKGkiDOsyksICjOsiDihpIgzrMpIOKGkiDOs1xuICovXG5FaXRoZXIucHJvdG90eXBlLmZvbGQgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLmZvbGQgPSBmdW5jdGlvbihmLCBfKSB7XG4gIHJldHVybiBmKHRoaXMudmFsdWUpXG59XG5cblJpZ2h0LnByb3RvdHlwZS5mb2xkID0gZnVuY3Rpb24oXywgZykge1xuICByZXR1cm4gZyh0aGlzLnZhbHVlKVxufVxuXG4vKipcbiAqIENhdGFtb3JwaGlzbS5cbiAqIFxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4geyBMZWZ0OiDOsSDihpIgzrMsIFJpZ2h0OiDOsiDihpIgzrMgfSDihpIgzrNcbiAqL1xuRWl0aGVyLnByb3RvdHlwZS5jYXRhID0gdW5pbXBsZW1lbnRlZFxuXG5MZWZ0LnByb3RvdHlwZS5jYXRhID0gZnVuY3Rpb24ocGF0dGVybikge1xuICByZXR1cm4gcGF0dGVybi5MZWZ0KHRoaXMudmFsdWUpXG59XG5cblJpZ2h0LnByb3RvdHlwZS5jYXRhID0gZnVuY3Rpb24ocGF0dGVybikge1xuICByZXR1cm4gcGF0dGVybi5SaWdodCh0aGlzLnZhbHVlKVxufVxuXG5cbi8qKlxuICogU3dhcHMgdGhlIGRpc2p1bmN0aW9uIHZhbHVlcy5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiBWb2lkIOKGkiBFaXRoZXJbzrIsIM6xXVxuICovXG5FaXRoZXIucHJvdG90eXBlLnN3YXAgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuUmlnaHQodGhpcy52YWx1ZSlcbn1cblxuUmlnaHQucHJvdG90eXBlLnN3YXAgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuTGVmdCh0aGlzLnZhbHVlKVxufVxuXG5cbi8qKlxuICogTWFwcyBib3RoIHNpZGVzIG9mIHRoZSBkaXNqdW5jdGlvbi5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQEVpdGhlclvOsSwgzrJdKSA9PiAozrEg4oaSIM6zKSwgKM6yIOKGkiDOtCkg4oaSIEVpdGhlclvOsywgzrRdXG4gKi9cbkVpdGhlci5wcm90b3R5cGUuYmltYXAgPSB1bmltcGxlbWVudGVkXG5cbkxlZnQucHJvdG90eXBlLmJpbWFwID0gZnVuY3Rpb24oZiwgXykge1xuICByZXR1cm4gdGhpcy5MZWZ0KGYodGhpcy52YWx1ZSkpXG59XG5cblJpZ2h0LnByb3RvdHlwZS5iaW1hcCA9IGZ1bmN0aW9uKF8sIGcpIHtcbiAgcmV0dXJuIHRoaXMuUmlnaHQoZyh0aGlzLnZhbHVlKSlcbn1cblxuXG4vKipcbiAqIE1hcHMgdGhlIGxlZnQgc2lkZSBvZiB0aGUgZGlzanVuY3Rpb24uXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBFaXRoZXJbzrEsIM6yXSkgPT4gKM6xIOKGkiDOsykg4oaSIEVpdGhlclvOsywgzrJdXG4gKi9cbkVpdGhlci5wcm90b3R5cGUubGVmdE1hcCA9IHVuaW1wbGVtZW50ZWRcblJpZ2h0LnByb3RvdHlwZS5sZWZ0TWFwICA9IG5vb3BcblxuTGVmdC5wcm90b3R5cGUubGVmdE1hcCA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIHRoaXMuTGVmdChmKHRoaXMudmFsdWUpKVxufVxuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTQgUXVpbGRyZWVuIE1vdHRhIDxxdWlsZHJlZW5AZ21haWwuY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4vLyBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuLy8gKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuLy8gaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbi8vIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4vLyBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuLy8gc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbi8vIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4vLyBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4vLyBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4vLyBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4vLyBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZWl0aGVyJykiLCIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5cbmltcG9ydCBJbW11dGFibGUgZnJvbSBcInNlYW1sZXNzLWltbXV0YWJsZVwiO1xuaW1wb3J0IHsgY3VycnksIGxlbnMsIHByb3AsIHByZXBlbmQsIG92ZXIsIHNldCwgcGlwZSB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IEVpdGhlciBmcm9tIFwiZGF0YS5laXRoZXJcIjtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUF0ID0gY3VycnkoKGtleUFycmF5LCBuZXdWYWwsIG9iaikgPT4ge1xuICBjb25zdCBkZWVwTmV3VmFsID0ga2V5QXJyYXkucmVkdWNlUmlnaHQoXG4gICAgKHJlc3VsdCwga2V5KSA9PiAoeyBba2V5XTogcmVzdWx0IH0pXG4gICAgLCBuZXdWYWxcbiAgKTtcblxuICByZXR1cm4gSW1tdXRhYmxlKG9iaikubWVyZ2UoZGVlcE5ld1ZhbCwgeyBkZWVwOiB0cnVlIH0pO1xufSk7XG5cbi8vIFN0YXRlIGxlbnNlc1xuZXhwb3J0IGNvbnN0IFN0YXRlTGVuc2VzID0ge1xuICBmaWVsZFR5cGVzOiBsZW5zKHByb3AoXCJmaWVsZFR5cGVzXCIpLCB1cGRhdGVBdChbXCJmaWVsZFR5cGVzXCJdKSksXG4gIGZpZWxkc1N0YXRlOiBsZW5zKHByb3AoXCJmaWVsZHNTdGF0ZVwiKSwgdXBkYXRlQXQoW1wiZmllbGRzU3RhdGVcIl0pKSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBsZW5zKHByb3AoXCJmaWVsZHNTdGF0ZUhpc3RvcnlcIiksIHVwZGF0ZUF0KFtcImZpZWxkc1N0YXRlSGlzdG9yeVwiXSkpLFxufTtcblxuLy8gXyA9PiBTdHJpbmdcbmV4cG9ydCBjb25zdCBjcmVhdGVJZCA9IF8gPT5cbiAgRGF0ZS5ub3coKS50b1N0cmluZygpO1xuXG4vLyBTdGF0ZSAtPiBbZmllbGRzU3RhdGVdIC0+IFN0YXRlXG5leHBvcnQgY29uc3QgcHVzaEhpc3RvcnlTdGF0ZSA9IGN1cnJ5KChzdGF0ZSwgbmV3SGlzdG9yeVN0YXRlKSA9PiBwaXBlKFxuICAvLyBBZGQgY3VycmVudCBzdGF0ZSB0byBoaXN0b3J5XG4gIG92ZXIoU3RhdGVMZW5zZXMuZmllbGRzU3RhdGVIaXN0b3J5LCBwcmVwZW5kKHN0YXRlLmZpZWxkc1N0YXRlKSksXG4gIC8vIE1ha2UgbmV3IFN0YXRlIHRoZSBjdXJyZW50XG4gIHNldChTdGF0ZUxlbnNlcy5maWVsZHNTdGF0ZSwgbmV3SGlzdG9yeVN0YXRlKVxuKShzdGF0ZSkpO1xuXG5cbi8vIFN0YXRlIC0+IFN0YXRlXG5leHBvcnQgY29uc3QgaGlkZUNvbmZpZ3MgPSBzdGF0ZSA9PlxuICBzZXQoXG4gICAgU3RhdGVMZW5zZXMuZmllbGRzU3RhdGUsXG4gICAgc3RhdGUuZmllbGRzU3RhdGUubWFwKHMgPT4gT2JqZWN0LmFzc2lnbih7fSwgcywgeyBjb25maWdTaG93aW5nOiBmYWxzZSB9KSksXG4gICAgc3RhdGVcbiAgKTtcblxuXG4vLyBTdHJpbmcgLT4gU3RyaW5nIC0+IE9iamVjdCAtPiBFaXRoZXIgU3RyaW5nIE9iamVjdFxuY29uc3QgcHJvcGVydHlUeXBlQ2hlY2sgPSBjdXJyeSgocHJvcGVydHlOYW1lLCB0eXBlLCBvYmopID0+XG4gIHR5cGVvZiBvYmpbcHJvcGVydHlOYW1lXSA9PT0gdHlwZVxuICAgID8gRWl0aGVyLlJpZ2h0KG9iailcbiAgICA6IEVpdGhlci5MZWZ0KGBQcm9wZXJ0eSAnJHtwcm9wZXJ0eU5hbWV9JyBjYW5ub3QgYmUgb2YgdHlwZSAke3R5cGVvZiBvYmpbcHJvcGVydHlOYW1lXX1gKVxuKTtcblxuLy8gQ2hlY2tzIHRoYXQgYSBmaWVsZCBoYXMgaXRzIGVzc2VudGlhbCBwcm9wZXJ0aWVzXG4vLyBPYmplY3QgLT4gRWl0aGVyIFN0cmluZyBPYmplY3RcbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUZpZWxkID0gZmllbGRTdGF0ZSA9PlxuICBFaXRoZXIuZnJvbU51bGxhYmxlKGZpZWxkU3RhdGUpXG4gICAgLmxlZnRNYXAoZnMgPT4gYEEgZmllbGQgU3RhdGUgY2Fubm90IGJlIGVtcHR5ICR7dHlwZW9mIGZzfWApXG4gICAgLmNoYWluKHByb3BlcnR5VHlwZUNoZWNrKFwicmVxdWlyZWRcIiwgXCJib29sZWFuXCIpKVxuICAgIC5jaGFpbihwcm9wZXJ0eVR5cGVDaGVjayhcImNvbmZpZ1Nob3dpbmdcIiwgXCJib29sZWFuXCIpKVxuICAgIC5jaGFpbihwcm9wZXJ0eVR5cGVDaGVjayhcImlkXCIsIFwic3RyaW5nXCIpKTtcbiIsImltcG9ydCB7IFN0YXRlTGVuc2VzIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IHNldCwgb3Zlciwgc2xpY2UsIHBpcGUgfSBmcm9tIFwicmFtZGFcIjtcblxuY29uc3QgbGFzdEhpc3RvcnlTdGF0ZSA9IHN0YXRlID0+XG4gIHN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeVswXSB8fCBbXTtcblxuY29uc3QgdW5kbyA9IChzdGF0ZSwgXykgPT4gcGlwZShcbiAgLy8gTWFrZSBsYXN0IGhpc3RvcnkgbGFzdCBzdGF0ZSB0aGUgY3VycmVudCBvbmVcbiAgc2V0KFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlLCBsYXN0SGlzdG9yeVN0YXRlKHN0YXRlKSksXG4gIC8vIFJlbW92ZSBsYXN0IGhpc3Rvcnkgc3RhdGUgZnJvbSB0aGUgaGlzdG9yeSBhcnJheVxuICBvdmVyKFN0YXRlTGVuc2VzLmZpZWxkc1N0YXRlSGlzdG9yeSwgc2xpY2UoMSwgSW5maW5pdHkpKVxuKShzdGF0ZSk7XG5cbmV4cG9ydCBkZWZhdWx0IHVuZG87XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9pZGVudGl0eSh4KSB7IHJldHVybiB4OyB9O1xuIiwidmFyIF9jdXJyeTEgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTEnKTtcbnZhciBfaWRlbnRpdHkgPSByZXF1aXJlKCcuL2ludGVybmFsL19pZGVudGl0eScpO1xuXG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IGRvZXMgbm90aGluZyBidXQgcmV0dXJuIHRoZSBwYXJhbWV0ZXIgc3VwcGxpZWQgdG8gaXQuIEdvb2RcbiAqIGFzIGEgZGVmYXVsdCBvciBwbGFjZWhvbGRlciBmdW5jdGlvbi5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyBhIC0+IGFcbiAqIEBwYXJhbSB7Kn0geCBUaGUgdmFsdWUgdG8gcmV0dXJuLlxuICogQHJldHVybiB7Kn0gVGhlIGlucHV0IHZhbHVlLCBgeGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5pZGVudGl0eSgxKTsgLy89PiAxXG4gKlxuICogICAgICB2YXIgb2JqID0ge307XG4gKiAgICAgIFIuaWRlbnRpdHkob2JqKSA9PT0gb2JqOyAvLz0+IHRydWVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkxKF9pZGVudGl0eSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xuXG5cbi8qKlxuICogUmV0cmlldmUgdGhlIHZhbHVlIGF0IGEgZ2l2ZW4gcGF0aC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4yLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcgW1N0cmluZ10gLT4ge2s6IHZ9IC0+IHYgfCBVbmRlZmluZWRcbiAqIEBwYXJhbSB7QXJyYXl9IHBhdGggVGhlIHBhdGggdG8gdXNlLlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHJldHJpZXZlIHRoZSBuZXN0ZWQgcHJvcGVydHkgZnJvbS5cbiAqIEByZXR1cm4geyp9IFRoZSBkYXRhIGF0IGBwYXRoYC5cbiAqIEBzZWUgUi5wcm9wXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5wYXRoKFsnYScsICdiJ10sIHthOiB7YjogMn19KTsgLy89PiAyXG4gKiAgICAgIFIucGF0aChbJ2EnLCAnYiddLCB7Yzoge2I6IDJ9fSk7IC8vPT4gdW5kZWZpbmVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBwYXRoKHBhdGhzLCBvYmopIHtcbiAgdmFyIHZhbCA9IG9iajtcbiAgdmFyIGlkeCA9IDA7XG4gIHdoaWxlIChpZHggPCBwYXRocy5sZW5ndGgpIHtcbiAgICBpZiAodmFsID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFsID0gdmFsW3BhdGhzW2lkeF1dO1xuICAgIGlkeCArPSAxO1xuICB9XG4gIHJldHVybiB2YWw7XG59KTtcbiIsInZhciBfY29uY2F0ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY29uY2F0Jyk7XG52YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIF9yZWR1Y2UgPSByZXF1aXJlKCcuL2ludGVybmFsL19yZWR1Y2UnKTtcbnZhciBtYXAgPSByZXF1aXJlKCcuL21hcCcpO1xuXG5cbi8qKlxuICogYXAgYXBwbGllcyBhIGxpc3Qgb2YgZnVuY3Rpb25zIHRvIGEgbGlzdCBvZiB2YWx1ZXMuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYGFwYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC4gQWxzb1xuICogdHJlYXRzIGN1cnJpZWQgZnVuY3Rpb25zIGFzIGFwcGxpY2F0aXZlcy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4zLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHNpZyBbYSAtPiBiXSAtPiBbYV0gLT4gW2JdXG4gKiBAc2lnIEFwcGx5IGYgPT4gZiAoYSAtPiBiKSAtPiBmIGEgLT4gZiBiXG4gKiBAcGFyYW0ge0FycmF5fSBmbnMgQW4gYXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcGFyYW0ge0FycmF5fSB2cyBBbiBhcnJheSBvZiB2YWx1ZXNcbiAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiByZXN1bHRzIG9mIGFwcGx5aW5nIGVhY2ggb2YgYGZuc2AgdG8gYWxsIG9mIGB2c2AgaW4gdHVybi5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmFwKFtSLm11bHRpcGx5KDIpLCBSLmFkZCgzKV0sIFsxLDIsM10pOyAvLz0+IFsyLCA0LCA2LCA0LCA1LCA2XVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTIoZnVuY3Rpb24gYXAoYXBwbGljYXRpdmUsIGZuKSB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIGFwcGxpY2F0aXZlLmFwID09PSAnZnVuY3Rpb24nID9cbiAgICAgIGFwcGxpY2F0aXZlLmFwKGZuKSA6XG4gICAgdHlwZW9mIGFwcGxpY2F0aXZlID09PSAnZnVuY3Rpb24nID9cbiAgICAgIGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGFwcGxpY2F0aXZlKHgpKGZuKHgpKTsgfSA6XG4gICAgLy8gZWxzZVxuICAgICAgX3JlZHVjZShmdW5jdGlvbihhY2MsIGYpIHsgcmV0dXJuIF9jb25jYXQoYWNjLCBtYXAoZiwgZm4pKTsgfSwgW10sIGFwcGxpY2F0aXZlKVxuICApO1xufSk7XG4iLCJ2YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIHNpbmdsZSBpdGVtIGJ5IGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBsaXN0LCBzdWNjZXNzaXZlbHkgY2FsbGluZ1xuICogdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIGFuZCBwYXNzaW5nIGl0IGFuIGFjY3VtdWxhdG9yIHZhbHVlIGFuZCB0aGUgY3VycmVudFxuICogdmFsdWUgZnJvbSB0aGUgYXJyYXksIGFuZCB0aGVuIHBhc3NpbmcgdGhlIHJlc3VsdCB0byB0aGUgbmV4dCBjYWxsLlxuICpcbiAqIFNpbWlsYXIgdG8gYHJlZHVjZWAsIGV4Y2VwdCBtb3ZlcyB0aHJvdWdoIHRoZSBpbnB1dCBsaXN0IGZyb20gdGhlIHJpZ2h0IHRvXG4gKiB0aGUgbGVmdC5cbiAqXG4gKiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gcmVjZWl2ZXMgdHdvIHZhbHVlczogKihhY2MsIHZhbHVlKSpcbiAqXG4gKiBOb3RlOiBgUi5yZWR1Y2VSaWdodGAgZG9lcyBub3Qgc2tpcCBkZWxldGVkIG9yIHVuYXNzaWduZWQgaW5kaWNlcyAoc3BhcnNlXG4gKiBhcnJheXMpLCB1bmxpa2UgdGhlIG5hdGl2ZSBgQXJyYXkucHJvdG90eXBlLnJlZHVjZWAgbWV0aG9kLiBGb3IgbW9yZSBkZXRhaWxzXG4gKiBvbiB0aGlzIGJlaGF2aW9yLCBzZWU6XG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9yZWR1Y2VSaWdodCNEZXNjcmlwdGlvblxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgKGEsYiAtPiBhKSAtPiBhIC0+IFtiXSAtPiBhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24uIFJlY2VpdmVzIHR3byB2YWx1ZXMsIHRoZSBhY2N1bXVsYXRvciBhbmQgdGhlXG4gKiAgICAgICAgY3VycmVudCBlbGVtZW50IGZyb20gdGhlIGFycmF5LlxuICogQHBhcmFtIHsqfSBhY2MgVGhlIGFjY3VtdWxhdG9yIHZhbHVlLlxuICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcmV0dXJuIHsqfSBUaGUgZmluYWwsIGFjY3VtdWxhdGVkIHZhbHVlLlxuICogQHNlZSBSLmFkZEluZGV4XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIHBhaXJzID0gWyBbJ2EnLCAxXSwgWydiJywgMl0sIFsnYycsIDNdIF07XG4gKiAgICAgIHZhciBmbGF0dGVuUGFpcnMgPSAoYWNjLCBwYWlyKSA9PiBhY2MuY29uY2F0KHBhaXIpO1xuICpcbiAqICAgICAgUi5yZWR1Y2VSaWdodChmbGF0dGVuUGFpcnMsIFtdLCBwYWlycyk7IC8vPT4gWyAnYycsIDMsICdiJywgMiwgJ2EnLCAxIF1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkzKGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGZuLCBhY2MsIGxpc3QpIHtcbiAgdmFyIGlkeCA9IGxpc3QubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgYWNjID0gZm4oYWNjLCBsaXN0W2lkeF0pO1xuICAgIGlkeCAtPSAxO1xuICB9XG4gIHJldHVybiBhY2M7XG59KTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG52YXIgYXAgPSByZXF1aXJlKCcuL2FwJyk7XG52YXIgbWFwID0gcmVxdWlyZSgnLi9tYXAnKTtcbnZhciBwcmVwZW5kID0gcmVxdWlyZSgnLi9wcmVwZW5kJyk7XG52YXIgcmVkdWNlUmlnaHQgPSByZXF1aXJlKCcuL3JlZHVjZVJpZ2h0Jyk7XG5cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIGEgW1RyYXZlcnNhYmxlXShodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWxhbmQvZmFudGFzeS1sYW5kI3RyYXZlcnNhYmxlKVxuICogb2YgW0FwcGxpY2F0aXZlXShodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWxhbmQvZmFudGFzeS1sYW5kI2FwcGxpY2F0aXZlKSBpbnRvIGFuXG4gKiBBcHBsaWNhdGl2ZSBvZiBUcmF2ZXJzYWJsZS5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgc2VxdWVuY2VgIG1ldGhvZCBvZiB0aGUgc2Vjb25kIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE5LjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIChBcHBsaWNhdGl2ZSBmLCBUcmF2ZXJzYWJsZSB0KSA9PiAoYSAtPiBmIGEpIC0+IHQgKGYgYSkgLT4gZiAodCBhKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb2ZcbiAqIEBwYXJhbSB7Kn0gdHJhdmVyc2FibGVcbiAqIEByZXR1cm4geyp9XG4gKiBAc2VlIFIudHJhdmVyc2VcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnNlcXVlbmNlKE1heWJlLm9mLCBbSnVzdCgxKSwgSnVzdCgyKSwgSnVzdCgzKV0pOyAgIC8vPT4gSnVzdChbMSwgMiwgM10pXG4gKiAgICAgIFIuc2VxdWVuY2UoTWF5YmUub2YsIFtKdXN0KDEpLCBKdXN0KDIpLCBOb3RoaW5nKCldKTsgLy89PiBOb3RoaW5nKClcbiAqXG4gKiAgICAgIFIuc2VxdWVuY2UoUi5vZiwgSnVzdChbMSwgMiwgM10pKTsgLy89PiBbSnVzdCgxKSwgSnVzdCgyKSwgSnVzdCgzKV1cbiAqICAgICAgUi5zZXF1ZW5jZShSLm9mLCBOb3RoaW5nKCkpOyAgICAgICAvLz0+IFtOb3RoaW5nKCldXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihmdW5jdGlvbiBzZXF1ZW5jZShvZiwgdHJhdmVyc2FibGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB0cmF2ZXJzYWJsZS5zZXF1ZW5jZSA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgdHJhdmVyc2FibGUuc2VxdWVuY2Uob2YpIDpcbiAgICByZWR1Y2VSaWdodChmdW5jdGlvbihhY2MsIHgpIHsgcmV0dXJuIGFwKG1hcChwcmVwZW5kLCB4KSwgYWNjKTsgfSxcbiAgICAgICAgICAgICAgICBvZihbXSksXG4gICAgICAgICAgICAgICAgdHJhdmVyc2FibGUpO1xufSk7XG4iLCJ2YXIgX2N1cnJ5MyA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MycpO1xudmFyIG1hcCA9IHJlcXVpcmUoJy4vbWFwJyk7XG52YXIgc2VxdWVuY2UgPSByZXF1aXJlKCcuL3NlcXVlbmNlJyk7XG5cblxuLyoqXG4gKiBNYXBzIGFuIFtBcHBsaWNhdGl2ZV0oaHR0cHM6Ly9naXRodWIuY29tL2ZhbnRhc3lsYW5kL2ZhbnRhc3ktbGFuZCNhcHBsaWNhdGl2ZSktcmV0dXJuaW5nXG4gKiBmdW5jdGlvbiBvdmVyIGEgW1RyYXZlcnNhYmxlXShodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWxhbmQvZmFudGFzeS1sYW5kI3RyYXZlcnNhYmxlKSxcbiAqIHRoZW4gdXNlcyBbYHNlcXVlbmNlYF0oI3NlcXVlbmNlKSB0byB0cmFuc2Zvcm0gdGhlIHJlc3VsdGluZyBUcmF2ZXJzYWJsZSBvZiBBcHBsaWNhdGl2ZVxuICogaW50byBhbiBBcHBsaWNhdGl2ZSBvZiBUcmF2ZXJzYWJsZS5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgc2VxdWVuY2VgIG1ldGhvZCBvZiB0aGUgdGhpcmQgYXJndW1lbnQsIGlmIHByZXNlbnQuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMTkuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgKEFwcGxpY2F0aXZlIGYsIFRyYXZlcnNhYmxlIHQpID0+IChhIC0+IGYgYSkgLT4gKGEgLT4gZiBiKSAtPiB0IGEgLT4gZiAodCBiKVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb2ZcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZcbiAqIEBwYXJhbSB7Kn0gdHJhdmVyc2FibGVcbiAqIEByZXR1cm4geyp9XG4gKiBAc2VlIFIuc2VxdWVuY2VcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICAvLyBSZXR1cm5zIGBOb3RoaW5nYCBpZiB0aGUgZ2l2ZW4gZGl2aXNvciBpcyBgMGBcbiAqICAgICAgc2FmZURpdiA9IG4gPT4gZCA9PiBkID09PSAwID8gTm90aGluZygpIDogSnVzdChuIC8gZClcbiAqXG4gKiAgICAgIFIudHJhdmVyc2UoTWF5YmUub2YsIHNhZmVEaXYoMTApLCBbMiwgNCwgNV0pOyAvLz0+IEp1c3QoWzUsIDIuNSwgMl0pXG4gKiAgICAgIFIudHJhdmVyc2UoTWF5YmUub2YsIHNhZmVEaXYoMTApLCBbMiwgMCwgNV0pOyAvLz0+IE5vdGhpbmdcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkzKGZ1bmN0aW9uIHRyYXZlcnNlKG9mLCBmLCB0cmF2ZXJzYWJsZSkge1xuICByZXR1cm4gc2VxdWVuY2Uob2YsIG1hcChmLCB0cmF2ZXJzYWJsZSkpO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIF9hcnJheUZyb21JdGVyYXRvcihpdGVyKSB7XG4gIHZhciBsaXN0ID0gW107XG4gIHZhciBuZXh0O1xuICB3aGlsZSAoIShuZXh0ID0gaXRlci5uZXh0KCkpLmRvbmUpIHtcbiAgICBsaXN0LnB1c2gobmV4dC52YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGxpc3Q7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfZnVuY3Rpb25OYW1lKGYpIHtcbiAgLy8gU3RyaW5nKHggPT4geCkgZXZhbHVhdGVzIHRvIFwieCA9PiB4XCIsIHNvIHRoZSBwYXR0ZXJuIG1heSBub3QgbWF0Y2guXG4gIHZhciBtYXRjaCA9IFN0cmluZyhmKS5tYXRjaCgvXmZ1bmN0aW9uIChcXHcqKS8pO1xuICByZXR1cm4gbWF0Y2ggPT0gbnVsbCA/ICcnIDogbWF0Y2hbMV07XG59O1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcblxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBpdHMgYXJndW1lbnRzIGFyZSBpZGVudGljYWwsIGZhbHNlIG90aGVyd2lzZS4gVmFsdWVzIGFyZVxuICogaWRlbnRpY2FsIGlmIHRoZXkgcmVmZXJlbmNlIHRoZSBzYW1lIG1lbW9yeS4gYE5hTmAgaXMgaWRlbnRpY2FsIHRvIGBOYU5gO1xuICogYDBgIGFuZCBgLTBgIGFyZSBub3QgaWRlbnRpY2FsLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE1LjBcbiAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICogQHNpZyBhIC0+IGEgLT4gQm9vbGVhblxuICogQHBhcmFtIHsqfSBhXG4gKiBAcGFyYW0geyp9IGJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIG8gPSB7fTtcbiAqICAgICAgUi5pZGVudGljYWwobywgbyk7IC8vPT4gdHJ1ZVxuICogICAgICBSLmlkZW50aWNhbCgxLCAxKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuaWRlbnRpY2FsKDEsICcxJyk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pZGVudGljYWwoW10sIFtdKTsgLy89PiBmYWxzZVxuICogICAgICBSLmlkZW50aWNhbCgwLCAtMCk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pZGVudGljYWwoTmFOLCBOYU4pOyAvLz0+IHRydWVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGlkZW50aWNhbChhLCBiKSB7XG4gIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgaWYgKGEgPT09IGIpIHsgLy8gU3RlcHMgMS01LCA3LTEwXG4gICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gIH0gZWxzZSB7XG4gICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICByZXR1cm4gYSAhPT0gYSAmJiBiICE9PSBiO1xuICB9XG59KTtcbiIsInZhciBfY3VycnkxID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkxJyk7XG5cblxuLyoqXG4gKiBHaXZlcyBhIHNpbmdsZS13b3JkIHN0cmluZyBkZXNjcmlwdGlvbiBvZiB0aGUgKG5hdGl2ZSkgdHlwZSBvZiBhIHZhbHVlLFxuICogcmV0dXJuaW5nIHN1Y2ggYW5zd2VycyBhcyAnT2JqZWN0JywgJ051bWJlcicsICdBcnJheScsIG9yICdOdWxsJy4gRG9lcyBub3RcbiAqIGF0dGVtcHQgdG8gZGlzdGluZ3Vpc2ggdXNlciBPYmplY3QgdHlwZXMgYW55IGZ1cnRoZXIsIHJlcG9ydGluZyB0aGVtIGFsbCBhc1xuICogJ09iamVjdCcuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuOC4wXG4gKiBAY2F0ZWdvcnkgVHlwZVxuICogQHNpZyAoKiAtPiB7Kn0pIC0+IFN0cmluZ1xuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnR5cGUoe30pOyAvLz0+IFwiT2JqZWN0XCJcbiAqICAgICAgUi50eXBlKDEpOyAvLz0+IFwiTnVtYmVyXCJcbiAqICAgICAgUi50eXBlKGZhbHNlKTsgLy89PiBcIkJvb2xlYW5cIlxuICogICAgICBSLnR5cGUoJ3MnKTsgLy89PiBcIlN0cmluZ1wiXG4gKiAgICAgIFIudHlwZShudWxsKTsgLy89PiBcIk51bGxcIlxuICogICAgICBSLnR5cGUoW10pOyAvLz0+IFwiQXJyYXlcIlxuICogICAgICBSLnR5cGUoL1tBLXpdLyk7IC8vPT4gXCJSZWdFeHBcIlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IF9jdXJyeTEoZnVuY3Rpb24gdHlwZSh2YWwpIHtcbiAgcmV0dXJuIHZhbCA9PT0gbnVsbCAgICAgID8gJ051bGwnICAgICAgOlxuICAgICAgICAgdmFsID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6XG4gICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKS5zbGljZSg4LCAtMSk7XG59KTtcbiIsInZhciBfYXJyYXlGcm9tSXRlcmF0b3IgPSByZXF1aXJlKCcuL19hcnJheUZyb21JdGVyYXRvcicpO1xudmFyIF9mdW5jdGlvbk5hbWUgPSByZXF1aXJlKCcuL19mdW5jdGlvbk5hbWUnKTtcbnZhciBfaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgaWRlbnRpY2FsID0gcmVxdWlyZSgnLi4vaWRlbnRpY2FsJyk7XG52YXIga2V5cyA9IHJlcXVpcmUoJy4uL2tleXMnKTtcbnZhciB0eXBlID0gcmVxdWlyZSgnLi4vdHlwZScpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2VxdWFscyhhLCBiLCBzdGFja0EsIHN0YWNrQikge1xuICBpZiAoaWRlbnRpY2FsKGEsIGIpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAodHlwZShhKSAhPT0gdHlwZShiKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgYi5lcXVhbHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZW9mIGEuZXF1YWxzID09PSAnZnVuY3Rpb24nICYmIGEuZXF1YWxzKGIpICYmXG4gICAgICAgICAgIHR5cGVvZiBiLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyAmJiBiLmVxdWFscyhhKTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZShhKSkge1xuICAgIGNhc2UgJ0FyZ3VtZW50cyc6XG4gICAgY2FzZSAnQXJyYXknOlxuICAgIGNhc2UgJ09iamVjdCc6XG4gICAgICBpZiAodHlwZW9mIGEuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgICBfZnVuY3Rpb25OYW1lKGEuY29uc3RydWN0b3IpID09PSAnUHJvbWlzZScpIHtcbiAgICAgICAgcmV0dXJuIGEgPT09IGI7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdCb29sZWFuJzpcbiAgICBjYXNlICdOdW1iZXInOlxuICAgIGNhc2UgJ1N0cmluZyc6XG4gICAgICBpZiAoISh0eXBlb2YgYSA9PT0gdHlwZW9mIGIgJiYgaWRlbnRpY2FsKGEudmFsdWVPZigpLCBiLnZhbHVlT2YoKSkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgaWYgKCFpZGVudGljYWwoYS52YWx1ZU9mKCksIGIudmFsdWVPZigpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdFcnJvcic6XG4gICAgICByZXR1cm4gYS5uYW1lID09PSBiLm5hbWUgJiYgYS5tZXNzYWdlID09PSBiLm1lc3NhZ2U7XG4gICAgY2FzZSAnUmVnRXhwJzpcbiAgICAgIGlmICghKGEuc291cmNlID09PSBiLnNvdXJjZSAmJlxuICAgICAgICAgICAgYS5nbG9iYWwgPT09IGIuZ2xvYmFsICYmXG4gICAgICAgICAgICBhLmlnbm9yZUNhc2UgPT09IGIuaWdub3JlQ2FzZSAmJlxuICAgICAgICAgICAgYS5tdWx0aWxpbmUgPT09IGIubXVsdGlsaW5lICYmXG4gICAgICAgICAgICBhLnN0aWNreSA9PT0gYi5zdGlja3kgJiZcbiAgICAgICAgICAgIGEudW5pY29kZSA9PT0gYi51bmljb2RlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlICdNYXAnOlxuICAgIGNhc2UgJ1NldCc6XG4gICAgICBpZiAoIV9lcXVhbHMoX2FycmF5RnJvbUl0ZXJhdG9yKGEuZW50cmllcygpKSwgX2FycmF5RnJvbUl0ZXJhdG9yKGIuZW50cmllcygpKSwgc3RhY2tBLCBzdGFja0IpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ0ludDhBcnJheSc6XG4gICAgY2FzZSAnVWludDhBcnJheSc6XG4gICAgY2FzZSAnVWludDhDbGFtcGVkQXJyYXknOlxuICAgIGNhc2UgJ0ludDE2QXJyYXknOlxuICAgIGNhc2UgJ1VpbnQxNkFycmF5JzpcbiAgICBjYXNlICdJbnQzMkFycmF5JzpcbiAgICBjYXNlICdVaW50MzJBcnJheSc6XG4gICAgY2FzZSAnRmxvYXQzMkFycmF5JzpcbiAgICBjYXNlICdGbG9hdDY0QXJyYXknOlxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQXJyYXlCdWZmZXInOlxuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIFZhbHVlcyBvZiBvdGhlciB0eXBlcyBhcmUgb25seSBlcXVhbCBpZiBpZGVudGljYWwuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIga2V5c0EgPSBrZXlzKGEpO1xuICBpZiAoa2V5c0EubGVuZ3RoICE9PSBrZXlzKGIpLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBpZHggPSBzdGFja0EubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgaWYgKHN0YWNrQVtpZHhdID09PSBhKSB7XG4gICAgICByZXR1cm4gc3RhY2tCW2lkeF0gPT09IGI7XG4gICAgfVxuICAgIGlkeCAtPSAxO1xuICB9XG5cbiAgc3RhY2tBLnB1c2goYSk7XG4gIHN0YWNrQi5wdXNoKGIpO1xuICBpZHggPSBrZXlzQS5sZW5ndGggLSAxO1xuICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICB2YXIga2V5ID0ga2V5c0FbaWR4XTtcbiAgICBpZiAoIShfaGFzKGtleSwgYikgJiYgX2VxdWFscyhiW2tleV0sIGFba2V5XSwgc3RhY2tBLCBzdGFja0IpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZHggLT0gMTtcbiAgfVxuICBzdGFja0EucG9wKCk7XG4gIHN0YWNrQi5wb3AoKTtcbiAgcmV0dXJuIHRydWU7XG59O1xuIiwidmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcbnZhciBfZXF1YWxzID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fZXF1YWxzJyk7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGB0cnVlYCBpZiBpdHMgYXJndW1lbnRzIGFyZSBlcXVpdmFsZW50LCBgZmFsc2VgIG90aGVyd2lzZS4gSGFuZGxlc1xuICogY3ljbGljYWwgZGF0YSBzdHJ1Y3R1cmVzLlxuICpcbiAqIERpc3BhdGNoZXMgc3ltbWV0cmljYWxseSB0byB0aGUgYGVxdWFsc2AgbWV0aG9kcyBvZiBib3RoIGFyZ3VtZW50cywgaWZcbiAqIHByZXNlbnQuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMTUuMFxuICogQGNhdGVnb3J5IFJlbGF0aW9uXG4gKiBAc2lnIGEgLT4gYiAtPiBCb29sZWFuXG4gKiBAcGFyYW0geyp9IGFcbiAqIEBwYXJhbSB7Kn0gYlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmVxdWFscygxLCAxKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuZXF1YWxzKDEsICcxJyk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5lcXVhbHMoWzEsIDIsIDNdLCBbMSwgMiwgM10pOyAvLz0+IHRydWVcbiAqXG4gKiAgICAgIHZhciBhID0ge307IGEudiA9IGE7XG4gKiAgICAgIHZhciBiID0ge307IGIudiA9IGI7XG4gKiAgICAgIFIuZXF1YWxzKGEsIGIpOyAvLz0+IHRydWVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gIHJldHVybiBfZXF1YWxzKGEsIGIsIFtdLCBbXSk7XG59KTtcbiIsIi8qIEBmbG93IHdlYWsgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmltcG9ydCB7IHB1c2hIaXN0b3J5U3RhdGUsIGNyZWF0ZUlkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IGN1cnJ5LCBlcXVhbHMsIHRyYXZlcnNlLCBpZGVudGl0eSwgcGF0aCB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IEVpdGhlciBmcm9tIFwiZGF0YS5laXRoZXJcIjtcblxuLy8gW2FdID0+IEVpdGhlciBTdHJpbmcgW2FdXG5jb25zdCBpc0FycmF5ID0gYXJyID0+XG4gIEFycmF5LmlzQXJyYXkoYXJyKVxuICAgID8gRWl0aGVyLlJpZ2h0KGFycilcbiAgICA6IEVpdGhlci5MZWZ0KGBJbnZhbGlkIHN0YXRlcyBzZW50IHdpdGggaW1wb3J0U3RhdGUuIEV4cGVjdGVkIEFycmF5IGJ1dCByZWNlaXZlZCAke3R5cGVvZiBhcnJ9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxuXG5jb25zdCBmaWVsZFR5cGVJc1ZhbGlkID0gY3VycnkoKHZhbGlkVHlwZXMsIGZpZWxkKSA9PlxuICB2YWxpZFR5cGVzLmZpbmQoZXF1YWxzKGZpZWxkLnR5cGUpKVxuICAgID8gRWl0aGVyLlJpZ2h0KGZpZWxkKVxuICAgIDogRWl0aGVyLkxlZnQoYEludmFsaWQgZmllbGQgdHlwZSAke2ZpZWxkLnR5cGV9YClcbik7XG5cbmNvbnN0IHZhbGlkRmllbGRUeXBlcyA9IGN1cnJ5KCh2YWxpZFR5cGVzLCBmaWVsZHNTdGF0ZSkgPT5cbiAgdHJhdmVyc2UoRWl0aGVyLm9mLCBmaWVsZFR5cGVJc1ZhbGlkKHZhbGlkVHlwZXMpLCBmaWVsZHNTdGF0ZSlcbik7XG5cblxuLy8gW2FdIC0+IFthXSAtPiBFaXRoZXIgU3RyaW5nIFthXVxuY29uc3QgdmFsaWRhdGVGaWVsZHNTdGF0ZSA9IGN1cnJ5KChmaWVsZHNTdGF0ZSwgc3RhdGUpID0+XG4gIEVpdGhlci5vZihmaWVsZHNTdGF0ZSlcbiAgICAuY2hhaW4oaXNBcnJheSlcbiAgICAuY2hhaW4odmFsaWRGaWVsZFR5cGVzKHN0YXRlLmZpZWxkVHlwZXMubWFwKHBhdGgoW1wiaW5mb1wiLFwidHlwZVwiXSkpKSlcbik7XG5cblxuLy8gQWRkIHJlcXVpcmVkIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IG1hbmFnZWQgYnkgdGhlIGZpZWxkXG4vLyBjb21wb25lbnQgYnV0IGJ5IHRoZSBGb3JtQnVpbGRlciBjb21wb25lbnQgaXRzZWxmLCBzbyBtYXlcbi8vIG5vdCBiZSB0aGVyZS5cbi8vIFthXSA9PiBbYV1cbmNvbnN0IGFkZFJlcXVpcmVkUHJvcGVydGllcyA9IGZpZWxkU3RhdGVzID0+XG4gIGZpZWxkU3RhdGVzXG4gICAgLm1hcChzID0+IE9iamVjdC5hc3NpZ24oXG4gICAgICB7XG4gICAgICAgIGNvbmZpZ1Nob3dpbmc6IGZhbHNlLFxuICAgICAgICBpZDogY3JlYXRlSWQoKSxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgfSwgc1xuICAgICkpO1xuXG5cbi8vIElmIHRoZXJlIGFyZSBhbnkgcHJvYmxlbXMgd2l0aCB0aGUgaW1wb3J0LCB0aGUgc2FtZSBzdGF0ZVxuLy8gd2lsbCBiZSByZXR1cm5lZFxuZXhwb3J0IGRlZmF1bHQgKHN0YXRlLCB7IG5ld0ZpZWxkc1N0YXRlIH0pID0+XG4gIHZhbGlkYXRlRmllbGRzU3RhdGUobmV3RmllbGRzU3RhdGUsIHN0YXRlKVxuICAgIC5tYXAoYWRkUmVxdWlyZWRQcm9wZXJ0aWVzKVxuICAgIC5tYXAocHVzaEhpc3RvcnlTdGF0ZShzdGF0ZSkpXG4gICAgLmJpbWFwKGNvbnNvbGUuZXJyb3IsIGlkZW50aXR5KVxuICAgIC5nZXRPckVsc2Uoc3RhdGUpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfcmVkdWNlZCh4KSB7XG4gIHJldHVybiB4ICYmIHhbJ0BAdHJhbnNkdWNlci9yZWR1Y2VkJ10gPyB4IDpcbiAgICB7XG4gICAgICAnQEB0cmFuc2R1Y2VyL3ZhbHVlJzogeCxcbiAgICAgICdAQHRyYW5zZHVjZXIvcmVkdWNlZCc6IHRydWVcbiAgICB9O1xufTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9fY3VycnkyJyk7XG52YXIgX3JlZHVjZWQgPSByZXF1aXJlKCcuL19yZWR1Y2VkJyk7XG52YXIgX3hmQmFzZSA9IHJlcXVpcmUoJy4vX3hmQmFzZScpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBYRmluZChmLCB4Zikge1xuICAgIHRoaXMueGYgPSB4ZjtcbiAgICB0aGlzLmYgPSBmO1xuICAgIHRoaXMuZm91bmQgPSBmYWxzZTtcbiAgfVxuICBYRmluZC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBfeGZCYXNlLmluaXQ7XG4gIFhGaW5kLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgaWYgKCF0aGlzLmZvdW5kKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgdm9pZCAwKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShyZXN1bHQpO1xuICB9O1xuICBYRmluZC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbihyZXN1bHQsIGlucHV0KSB7XG4gICAgaWYgKHRoaXMuZihpbnB1dCkpIHtcbiAgICAgIHRoaXMuZm91bmQgPSB0cnVlO1xuICAgICAgcmVzdWx0ID0gX3JlZHVjZWQodGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGlucHV0KSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3hmaW5kKGYsIHhmKSB7IHJldHVybiBuZXcgWEZpbmQoZiwgeGYpOyB9KTtcbn0oKSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIF9kaXNwYXRjaGFibGUgPSByZXF1aXJlKCcuL2ludGVybmFsL19kaXNwYXRjaGFibGUnKTtcbnZhciBfeGZpbmQgPSByZXF1aXJlKCcuL2ludGVybmFsL194ZmluZCcpO1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgbGlzdCB3aGljaCBtYXRjaGVzIHRoZSBwcmVkaWNhdGUsIG9yXG4gKiBgdW5kZWZpbmVkYCBpZiBubyBlbGVtZW50IG1hdGNoZXMuXG4gKlxuICogRGlzcGF0Y2hlcyB0byB0aGUgYGZpbmRgIG1ldGhvZCBvZiB0aGUgc2Vjb25kIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBhIHwgdW5kZWZpbmVkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJlZGljYXRlIGZ1bmN0aW9uIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoZSBlbGVtZW50IGlzIHRoZVxuICogICAgICAgIGRlc2lyZWQgb25lLlxuICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBlbGVtZW50IGZvdW5kLCBvciBgdW5kZWZpbmVkYC5cbiAqIEBzZWUgUi50cmFuc2R1Y2VcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgeHMgPSBbe2E6IDF9LCB7YTogMn0sIHthOiAzfV07XG4gKiAgICAgIFIuZmluZChSLnByb3BFcSgnYScsIDIpKSh4cyk7IC8vPT4ge2E6IDJ9XG4gKiAgICAgIFIuZmluZChSLnByb3BFcSgnYScsIDQpKSh4cyk7IC8vPT4gdW5kZWZpbmVkXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdmaW5kJywgX3hmaW5kLCBmdW5jdGlvbiBmaW5kKGZuLCBsaXN0KSB7XG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XG4gIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICBpZiAoZm4obGlzdFtpZHhdKSkge1xuICAgICAgcmV0dXJuIGxpc3RbaWR4XTtcbiAgICB9XG4gICAgaWR4ICs9IDE7XG4gIH1cbn0pKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiAqIEEgaGVscGVyIGZvciBkZWxheWluZyB0aGUgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24uXG4gKiBAcHJpdmF0ZVxuICogQHN1bW1hcnkgKEFueS4uLiAtPiBBbnkpIC0+IFZvaWRcbiAqL1xudmFyIGRlbGF5ZWQgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlICE9PSAndW5kZWZpbmVkJz8gIHNldEltbWVkaWF0ZVxuICAgICAgICAgICAgOiB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCc/ICAgICAgIHByb2Nlc3MubmV4dFRpY2tcbiAgICAgICAgICAgIDogLyogb3RoZXJ3aXNlICovICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0XG5cbi8qKlxuICogQG1vZHVsZSBsaWIvdGFza1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IFRhc2s7XG5cbi8vIC0tIEltcGxlbWVudGF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRoZSBgVGFza1vOsSwgzrJdYCBzdHJ1Y3R1cmUgcmVwcmVzZW50cyB2YWx1ZXMgdGhhdCBkZXBlbmQgb24gdGltZS4gVGhpc1xuICogYWxsb3dzIG9uZSB0byBtb2RlbCB0aW1lLWJhc2VkIGVmZmVjdHMgZXhwbGljaXRseSwgc3VjaCB0aGF0IG9uZSBjYW4gaGF2ZVxuICogZnVsbCBrbm93bGVkZ2Ugb2Ygd2hlbiB0aGV5J3JlIGRlYWxpbmcgd2l0aCBkZWxheWVkIGNvbXB1dGF0aW9ucywgbGF0ZW5jeSxcbiAqIG9yIGFueXRoaW5nIHRoYXQgY2FuIG5vdCBiZSBjb21wdXRlZCBpbW1lZGlhdGVseS5cbiAqXG4gKiBBIGNvbW1vbiB1c2UgZm9yIHRoaXMgc3RydWN0dXJlIGlzIHRvIHJlcGxhY2UgdGhlIHVzdWFsIENvbnRpbnVhdGlvbi1QYXNzaW5nXG4gKiBTdHlsZSBmb3JtIG9mIHByb2dyYW1taW5nLCBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGNvbXBvc2UgYW5kIHNlcXVlbmNlXG4gKiB0aW1lLWRlcGVuZGVudCBlZmZlY3RzIHVzaW5nIHRoZSBnZW5lcmljIGFuZCBwb3dlcmZ1bCBtb25hZGljIG9wZXJhdGlvbnMuXG4gKlxuICogQGNsYXNzXG4gKiBAc3VtbWFyeVxuICogKCjOsSDihpIgVm9pZCksICjOsiDihpIgVm9pZCkg4oaSIFZvaWQpLCAoVm9pZCDihpIgVm9pZCkg4oaSIFRhc2tbzrEsIM6yXVxuICpcbiAqIFRhc2tbzrEsIM6yXSA8OiBDaGFpblvOsl1cbiAqICAgICAgICAgICAgICAgLCBNb25hZFvOsl1cbiAqICAgICAgICAgICAgICAgLCBGdW5jdG9yW86yXVxuICogICAgICAgICAgICAgICAsIEFwcGxpY2F0aXZlW86yXVxuICogICAgICAgICAgICAgICAsIFNlbWlncm91cFvOsl1cbiAqICAgICAgICAgICAgICAgLCBNb25vaWRbzrJdXG4gKiAgICAgICAgICAgICAgICwgU2hvd1xuICovXG5mdW5jdGlvbiBUYXNrKGNvbXB1dGF0aW9uLCBjbGVhbnVwKSB7XG4gIHRoaXMuZm9yayA9IGNvbXB1dGF0aW9uO1xuXG4gIHRoaXMuY2xlYW51cCA9IGNsZWFudXAgfHwgZnVuY3Rpb24oKSB7fTtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBUYXNrW86xLCDOsl1gIGNvbnRhaW5pbmcgdGhlIHNpbmdsZSB2YWx1ZSBgzrJgLlxuICpcbiAqIGDOsmAgY2FuIGJlIGFueSB2YWx1ZSwgaW5jbHVkaW5nIGBudWxsYCwgYHVuZGVmaW5lZGAsIG9yIGFub3RoZXJcbiAqIGBUYXNrW86xLCDOsl1gIHN0cnVjdHVyZS5cbiAqXG4gKiBAc3VtbWFyeSDOsiDihpIgVGFza1vOsSwgzrJdXG4gKi9cblRhc2sucHJvdG90eXBlLm9mID0gZnVuY3Rpb24gX29mKGIpIHtcbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKF8sIHJlc29sdmUpIHtcbiAgICByZXR1cm4gcmVzb2x2ZShiKTtcbiAgfSk7XG59O1xuXG5UYXNrLm9mID0gVGFzay5wcm90b3R5cGUub2Y7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgVGFza1vOsSwgzrJdYCBjb250YWluaW5nIHRoZSBzaW5nbGUgdmFsdWUgYM6xYC5cbiAqXG4gKiBgzrFgIGNhbiBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAsIGB1bmRlZmluZWRgLCBvciBhbm90aGVyXG4gKiBgVGFza1vOsSwgzrJdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrEg4oaSIFRhc2tbzrEsIM6yXVxuICovXG5UYXNrLnByb3RvdHlwZS5yZWplY3RlZCA9IGZ1bmN0aW9uIF9yZWplY3RlZChhKSB7XG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QpIHtcbiAgICByZXR1cm4gcmVqZWN0KGEpO1xuICB9KTtcbn07XG5cblRhc2sucmVqZWN0ZWQgPSBUYXNrLnByb3RvdHlwZS5yZWplY3RlZDtcblxuLy8gLS0gRnVuY3RvciAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogVHJhbnNmb3JtcyB0aGUgc3VjY2Vzc2Z1bCB2YWx1ZSBvZiB0aGUgYFRhc2tbzrEsIM6yXWAgdXNpbmcgYSByZWd1bGFyIHVuYXJ5XG4gKiBmdW5jdGlvbi5cbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+ICjOsiDihpIgzrMpIOKGkiBUYXNrW86xLCDOs11cbiAqL1xuVGFzay5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gX21hcChmKSB7XG4gIHZhciBmb3JrID0gdGhpcy5mb3JrO1xuICB2YXIgY2xlYW51cCA9IHRoaXMuY2xlYW51cDtcblxuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlKSB7XG4gICAgcmV0dXJuIGZvcmsoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIHJlamVjdChhKTtcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShmKGIpKTtcbiAgICB9KTtcbiAgfSwgY2xlYW51cCk7XG59O1xuXG4vLyAtLSBDaGFpbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSBzdWNjZXNmdWwgdmFsdWUgb2YgdGhlIGBUYXNrW86xLCDOsl1gIHVzaW5nIGEgZnVuY3Rpb24gdG8gYVxuICogbW9uYWQuXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiAozrIg4oaSIFRhc2tbzrEsIM6zXSkg4oaSIFRhc2tbzrEsIM6zXVxuICovXG5UYXNrLnByb3RvdHlwZS5jaGFpbiA9IGZ1bmN0aW9uIF9jaGFpbihmKSB7XG4gIHZhciBmb3JrID0gdGhpcy5mb3JrO1xuICB2YXIgY2xlYW51cCA9IHRoaXMuY2xlYW51cDtcblxuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlKSB7XG4gICAgcmV0dXJuIGZvcmsoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIHJlamVjdChhKTtcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gZihiKS5mb3JrKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLy8gLS0gQXBwbHkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQXBwbHlzIHRoZSBzdWNjZXNzZnVsIHZhbHVlIG9mIHRoZSBgVGFza1vOsSwgKM6yIOKGkiDOsyldYCB0byB0aGUgc3VjY2Vzc2Z1bFxuICogdmFsdWUgb2YgdGhlIGBUYXNrW86xLCDOsl1gXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsICjOsiDihpIgzrMpXSA9PiBUYXNrW86xLCDOsl0g4oaSIFRhc2tbzrEsIM6zXVxuICovXG5cblRhc2sucHJvdG90eXBlLmFwID0gZnVuY3Rpb24gX2FwKHRoYXQpIHtcbiAgdmFyIGZvcmtUaGlzID0gdGhpcy5mb3JrO1xuICB2YXIgZm9ya1RoYXQgPSB0aGF0LmZvcms7XG4gIHZhciBjbGVhbnVwVGhpcyA9IHRoaXMuY2xlYW51cDtcbiAgdmFyIGNsZWFudXBUaGF0ID0gdGhhdC5jbGVhbnVwO1xuXG4gIGZ1bmN0aW9uIGNsZWFudXBCb3RoKHN0YXRlKSB7XG4gICAgY2xlYW51cFRoaXMoc3RhdGVbMF0pO1xuICAgIGNsZWFudXBUaGF0KHN0YXRlWzFdKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICB2YXIgZnVuYywgZnVuY0xvYWRlZCA9IGZhbHNlO1xuICAgIHZhciB2YWwsIHZhbExvYWRlZCA9IGZhbHNlO1xuICAgIHZhciByZWplY3RlZCA9IGZhbHNlO1xuICAgIHZhciBhbGxTdGF0ZTtcblxuICAgIHZhciB0aGlzU3RhdGUgPSBmb3JrVGhpcyhndWFyZFJlamVjdCwgZ3VhcmRSZXNvbHZlKGZ1bmN0aW9uKHgpIHtcbiAgICAgIGZ1bmNMb2FkZWQgPSB0cnVlO1xuICAgICAgZnVuYyA9IHg7XG4gICAgfSkpO1xuXG4gICAgdmFyIHRoYXRTdGF0ZSA9IGZvcmtUaGF0KGd1YXJkUmVqZWN0LCBndWFyZFJlc29sdmUoZnVuY3Rpb24oeCkge1xuICAgICAgdmFsTG9hZGVkID0gdHJ1ZTtcbiAgICAgIHZhbCA9IHg7XG4gICAgfSkpO1xuXG4gICAgZnVuY3Rpb24gZ3VhcmRSZXNvbHZlKHNldHRlcikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0dGVyKHgpO1xuICAgICAgICBpZiAoZnVuY0xvYWRlZCAmJiB2YWxMb2FkZWQpIHtcbiAgICAgICAgICBkZWxheWVkKGZ1bmN0aW9uKCl7IGNsZWFudXBCb3RoKGFsbFN0YXRlKSB9KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShmdW5jKHZhbCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ3VhcmRSZWplY3QoeCkge1xuICAgICAgaWYgKCFyZWplY3RlZCkge1xuICAgICAgICByZWplY3RlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiByZWplY3QoeCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFsbFN0YXRlID0gW3RoaXNTdGF0ZSwgdGhhdFN0YXRlXTtcbiAgfSwgY2xlYW51cEJvdGgpO1xufTtcblxuLy8gLS0gU2VtaWdyb3VwIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFNlbGVjdHMgdGhlIGVhcmxpZXIgb2YgdGhlIHR3byB0YXNrcyBgVGFza1vOsSwgzrJdYFxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCDOsl0gPT4gVGFza1vOsSwgzrJdIOKGkiBUYXNrW86xLCDOsl1cbiAqL1xuXG5UYXNrLnByb3RvdHlwZS5jb25jYXQgPSBmdW5jdGlvbiBfY29uY2F0KHRoYXQpIHtcbiAgdmFyIGZvcmtUaGlzID0gdGhpcy5mb3JrO1xuICB2YXIgZm9ya1RoYXQgPSB0aGF0LmZvcms7XG4gIHZhciBjbGVhbnVwVGhpcyA9IHRoaXMuY2xlYW51cDtcbiAgdmFyIGNsZWFudXBUaGF0ID0gdGhhdC5jbGVhbnVwO1xuXG4gIGZ1bmN0aW9uIGNsZWFudXBCb3RoKHN0YXRlKSB7XG4gICAgY2xlYW51cFRoaXMoc3RhdGVbMF0pO1xuICAgIGNsZWFudXBUaGF0KHN0YXRlWzFdKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgVGFzayhmdW5jdGlvbihyZWplY3QsIHJlc29sdmUpIHtcbiAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgIHZhciBhbGxTdGF0ZTtcbiAgICB2YXIgdGhpc1N0YXRlID0gZm9ya1RoaXMoZ3VhcmQocmVqZWN0KSwgZ3VhcmQocmVzb2x2ZSkpO1xuICAgIHZhciB0aGF0U3RhdGUgPSBmb3JrVGhhdChndWFyZChyZWplY3QpLCBndWFyZChyZXNvbHZlKSk7XG5cbiAgICByZXR1cm4gYWxsU3RhdGUgPSBbdGhpc1N0YXRlLCB0aGF0U3RhdGVdO1xuXG4gICAgZnVuY3Rpb24gZ3VhcmQoZikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgaWYgKCFkb25lKSB7XG4gICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgZGVsYXllZChmdW5jdGlvbigpeyBjbGVhbnVwQm90aChhbGxTdGF0ZSkgfSlcbiAgICAgICAgICByZXR1cm4gZih4KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH0sIGNsZWFudXBCb3RoKTtcblxufTtcblxuLy8gLS0gTW9ub2lkIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFJldHVybnMgYSBUYXNrIHRoYXQgd2lsbCBuZXZlciByZXNvbHZlXG4gKlxuICogQHN1bW1hcnkgVm9pZCDihpIgVGFza1vOsSwgX11cbiAqL1xuVGFzay5lbXB0eSA9IGZ1bmN0aW9uIF9lbXB0eSgpIHtcbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKCkge30pO1xufTtcblxuVGFzay5wcm90b3R5cGUuZW1wdHkgPSBUYXNrLmVtcHR5O1xuXG4vLyAtLSBTaG93IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBSZXR1cm5zIGEgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgYFRhc2tbzrEsIM6yXWBcbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+IFZvaWQg4oaSIFN0cmluZ1xuICovXG5UYXNrLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIF90b1N0cmluZygpIHtcbiAgcmV0dXJuICdUYXNrJztcbn07XG5cbi8vIC0tIEV4dHJhY3RpbmcgYW5kIHJlY292ZXJpbmcgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRyYW5zZm9ybXMgYSBmYWlsdXJlIHZhbHVlIGludG8gYSBuZXcgYFRhc2tbzrEsIM6yXWAuIERvZXMgbm90aGluZyBpZiB0aGVcbiAqIHN0cnVjdHVyZSBhbHJlYWR5IGNvbnRhaW5zIGEgc3VjY2Vzc2Z1bCB2YWx1ZS5cbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+ICjOsSDihpIgVGFza1vOsywgzrJdKSDihpIgVGFza1vOsywgzrJdXG4gKi9cblRhc2sucHJvdG90eXBlLm9yRWxzZSA9IGZ1bmN0aW9uIF9vckVsc2UoZikge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiBmKGEpLmZvcmsocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9LCBmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShiKTtcbiAgICB9KTtcbiAgfSwgY2xlYW51cCk7XG59O1xuXG4vLyAtLSBGb2xkcyBhbmQgZXh0ZW5kZWQgdHJhbnNmb3JtYXRpb25zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDYXRhbW9ycGhpc20uIFRha2VzIHR3byBmdW5jdGlvbnMsIGFwcGxpZXMgdGhlIGxlZnRtb3N0IG9uZSB0byB0aGUgZmFpbHVyZVxuICogdmFsdWUsIGFuZCB0aGUgcmlnaHRtb3N0IG9uZSB0byB0aGUgc3VjY2Vzc2Z1bCB2YWx1ZSwgZGVwZW5kaW5nIG9uIHdoaWNoIG9uZVxuICogaXMgcHJlc2VudC5cbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+ICjOsSDihpIgzrMpLCAozrIg4oaSIM6zKSDihpIgVGFza1vOtCwgzrNdXG4gKi9cblRhc2sucHJvdG90eXBlLmZvbGQgPSBmdW5jdGlvbiBfZm9sZChmLCBnKSB7XG4gIHZhciBmb3JrID0gdGhpcy5mb3JrO1xuICB2YXIgY2xlYW51cCA9IHRoaXMuY2xlYW51cDtcblxuICByZXR1cm4gbmV3IFRhc2soZnVuY3Rpb24ocmVqZWN0LCByZXNvbHZlKSB7XG4gICAgcmV0dXJuIGZvcmsoZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIHJlc29sdmUoZihhKSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIHJlc29sdmUoZyhiKSk7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLyoqXG4gKiBDYXRhbW9ycGhpc20uXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiB7IFJlamVjdGVkOiDOsSDihpIgzrMsIFJlc29sdmVkOiDOsiDihpIgzrMgfSDihpIgVGFza1vOtCwgzrNdXG4gKi9cblRhc2sucHJvdG90eXBlLmNhdGEgPSBmdW5jdGlvbiBfY2F0YShwYXR0ZXJuKSB7XG4gIHJldHVybiB0aGlzLmZvbGQocGF0dGVybi5SZWplY3RlZCwgcGF0dGVybi5SZXNvbHZlZCk7XG59O1xuXG4vKipcbiAqIFN3YXBzIHRoZSBkaXNqdW5jdGlvbiB2YWx1ZXMuXG4gKlxuICogQHN1bW1hcnkgQFRhc2tbzrEsIM6yXSA9PiBWb2lkIOKGkiBUYXNrW86yLCDOsV1cbiAqL1xuVGFzay5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uIF9zd2FwKCkge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKGEpO1xuICAgIH0sIGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiByZWplY3QoYik7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLyoqXG4gKiBNYXBzIGJvdGggc2lkZXMgb2YgdGhlIGRpc2p1bmN0aW9uLlxuICpcbiAqIEBzdW1tYXJ5IEBUYXNrW86xLCDOsl0gPT4gKM6xIOKGkiDOsyksICjOsiDihpIgzrQpIOKGkiBUYXNrW86zLCDOtF1cbiAqL1xuVGFzay5wcm90b3R5cGUuYmltYXAgPSBmdW5jdGlvbiBfYmltYXAoZiwgZykge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZWplY3QoZihhKSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIHJlc29sdmUoZyhiKSk7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcblxuLyoqXG4gKiBNYXBzIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIGRpc2p1bmN0aW9uIChmYWlsdXJlKS5cbiAqXG4gKiBAc3VtbWFyeSBAVGFza1vOsSwgzrJdID0+ICjOsSDihpIgzrMpIOKGkiBUYXNrW86zLCDOsl1cbiAqL1xuVGFzay5wcm90b3R5cGUucmVqZWN0ZWRNYXAgPSBmdW5jdGlvbiBfcmVqZWN0ZWRNYXAoZikge1xuICB2YXIgZm9yayA9IHRoaXMuZm9yaztcbiAgdmFyIGNsZWFudXAgPSB0aGlzLmNsZWFudXA7XG5cbiAgcmV0dXJuIG5ldyBUYXNrKGZ1bmN0aW9uKHJlamVjdCwgcmVzb2x2ZSkge1xuICAgIHJldHVybiBmb3JrKGZ1bmN0aW9uKGEpIHtcbiAgICAgIHJldHVybiByZWplY3QoZihhKSk7XG4gICAgfSwgZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIHJlc29sdmUoYik7XG4gICAgfSk7XG4gIH0sIGNsZWFudXApO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi90YXNrJyk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5pbXBvcnQgeyBwcm9wLCBmaW5kLCBpZGVudGl0eSwgcGlwZSB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IHsgY3JlYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IEVpdGhlciBmcm9tIFwiZGF0YS5laXRoZXJcIjtcbmltcG9ydCBUYXNrIGZyb20gXCJkYXRhLnRhc2tcIjtcbmltcG9ydCBJbW11dGFibGUgZnJvbSBcInNlYW1sZXNzLWltbXV0YWJsZVwiO1xuaW1wb3J0IHsgZmllbGRDcmVhdGVkIH0gZnJvbSBcIi4uL0FjdGlvbnNcIjtcblxuLy8gU3RhdGUgLT4gU3RyaW5nIC0+IEVpdGhlciBTdHJpbmcgRnVuY3Rpb25cbmNvbnN0IHR5cGVDb25zdHJ1Y3RvciA9IChzdGF0ZSwgZmllbGRUeXBlKSA9PiB7XG4gIHJldHVybiBFaXRoZXIub2Yoc3RhdGUpXG4gICAgLm1hcChwcm9wKFwiZmllbGRUeXBlc1wiKSlcbiAgICAubWFwKGZpbmQodiA9PiB2LmluZm8udHlwZSA9PT0gZmllbGRUeXBlKSlcbiAgICAuY2hhaW4oRWl0aGVyLmZyb21OdWxsYWJsZSlcbiAgICAuYmltYXAoXyA9PiBgRmllbGQgXCIke2ZpZWxkVHlwZX1cIiBkb2VzIG5vdCBleGlzdC5gLCBpZGVudGl0eSk7XG59O1xuXG4vLyB7IGluaXRpYWxTdGF0ZTogRnVuY3Rpb24gfSAtPiBUYXNrIFN0cmluZyBPYmplY3RcbmNvbnN0IGNyZWF0ZUZpZWxkID0gY29uc3RyID0+XG4gIG5ldyBUYXNrKChyZWplY3QsIHJlc29sdmUpID0+IHtcbiAgICAvLyBNYWtlIHN1cmUgdGhlIHByb21pc2UgaXMgb25seSByZXNvbHZlZCBvbmNlXG4gICAgbGV0IGNhbGxlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGZpZWxkU3RhdGUgPSBjb25zdHIuaW5pdGlhbFN0YXRlKCk7XG5cbiAgICBpZiAoIShmaWVsZFN0YXRlIGluc3RhbmNlb2YgUHJvbWlzZSkpIHtcbiAgICAgIHJlc29sdmUoZmllbGRTdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpZWxkU3RhdGVcbiAgICAgIC50aGVuKHYgPT4ge1xuICAgICAgICBpZiAoY2FsbGVkKSB7IHJldHVybjsgfVxuICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHYpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCh2ID0+IHtcbiAgICAgICAgaWYgKGNhbGxlZCkgeyB0aHJvdyB2OyB9XG4gICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgIHJlamVjdCh2KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbi8vIE9iamVjdCAtPiBPYmplY3RcbmNvbnN0IGluc2VydFJlcXVpcmVkUHJvcHMgPSBmaWVsZCA9PlxuICBJbW11dGFibGUoZmllbGQpLm1lcmdlKHtcbiAgICBpZDogY3JlYXRlSWQoKSxcbiAgICBjb25maWdTaG93aW5nOiB0cnVlLFxuICB9LCB7XG4gICAgZGVlcDogdHJ1ZSxcbiAgfSk7XG5cbmNvbnN0IGNyZWF0ZUZpZWxkQXN5bmNocm9ub3VzbHkgPSAoc3RhdGUsIGZpZWxkVHlwZSwgYXN5bmNEaXNwYXRjaCkgPT5cbiAgdHlwZUNvbnN0cnVjdG9yKHN0YXRlLCBmaWVsZFR5cGUpXG4gIC5tYXAoY3JlYXRlRmllbGQpIC8vIEVpdGhlciBTdHJpbmcgKFRhc2sgU3RyaW5nIE9iamVjdClcbiAgLmxlZnRNYXAoVGFzay5yZWplY3RlZClcbiAgLm1lcmdlKCkgLy8gVGFzayBTdHJpbmcgT2JqZWN0XG4gIC5tYXAoaW5zZXJ0UmVxdWlyZWRQcm9wcylcbiAgLmZvcmsoIC8vIGV4ZWN1dGUgdGFza1xuICAgIGVyciA9PiBjb25zb2xlLmVycm9yKFwiVGFzayByZWplY3RlZFwiLCBlcnIpLFxuICAgIHBpcGUoZmllbGRDcmVhdGVkLCBhc3luY0Rpc3BhdGNoKVxuICApO1xuXG4vLyBUaGlzIGlzIGFuIGFzeW5jIGFjdGlvbi4gV2hlbiBpdCBpcyBmaW5pc2hlZCBpdCB3aWxsIHRyaWdnZXIgdGhlXG4vLyBmaWVsZCBjcmVhdGVkIGFjdGlvblxuZXhwb3J0IGRlZmF1bHQgKHN0YXRlLCB7IGZpZWxkVHlwZSwgYXN5bmNEaXNwYXRjaCB9KSA9PiB7XG4gIGNyZWF0ZUZpZWxkQXN5bmNocm9ub3VzbHkoc3RhdGUsIGZpZWxkVHlwZSwgYXN5bmNEaXNwYXRjaCk7XG4gIHJldHVybiBzdGF0ZTtcbn07XG4iLCJ2YXIgX2NvbmNhdCA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2NvbmNhdCcpO1xudmFyIF9jdXJyeTIgPSByZXF1aXJlKCcuL2ludGVybmFsL19jdXJyeTInKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gbGlzdCwgZm9sbG93ZWQgYnlcbiAqIHRoZSBnaXZlbiBlbGVtZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgYSAtPiBbYV0gLT4gW2FdXG4gKiBAcGFyYW0geyp9IGVsIFRoZSBlbGVtZW50IHRvIGFkZCB0byB0aGUgZW5kIG9mIHRoZSBuZXcgbGlzdC5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3Qgd2hvc2UgY29udGVudHMgd2lsbCBiZSBhZGRlZCB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBvdXRwdXRcbiAqICAgICAgICBsaXN0LlxuICogQHJldHVybiB7QXJyYXl9IEEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgY29udGVudHMgb2YgdGhlIG9sZCBsaXN0IGZvbGxvd2VkIGJ5IGBlbGAuXG4gKiBAc2VlIFIucHJlcGVuZFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuYXBwZW5kKCd0ZXN0cycsIFsnd3JpdGUnLCAnbW9yZSddKTsgLy89PiBbJ3dyaXRlJywgJ21vcmUnLCAndGVzdHMnXVxuICogICAgICBSLmFwcGVuZCgndGVzdHMnLCBbXSk7IC8vPT4gWyd0ZXN0cyddXG4gKiAgICAgIFIuYXBwZW5kKFsndGVzdHMnXSwgWyd3cml0ZScsICdtb3JlJ10pOyAvLz0+IFsnd3JpdGUnLCAnbW9yZScsIFsndGVzdHMnXV1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIGFwcGVuZChlbCwgbGlzdCkge1xuICByZXR1cm4gX2NvbmNhdChsaXN0LCBbZWxdKTtcbn0pO1xuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTQgUXVpbGRyZWVuIE1vdHRhIDxxdWlsZHJlZW5AZ21haWwuY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4vLyBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlc1xuLy8gKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuLy8gaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbi8vIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4vLyBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuLy8gc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbi8vIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4vLyBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4vLyBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4vLyBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OXG4vLyBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vKipcbiAqIEBtb2R1bGUgbGliL21heWJlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gTWF5YmVcblxuLy8gLS0gQWxpYXNlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY2xvbmUgICAgICAgICA9IE9iamVjdC5jcmVhdGVcbnZhciB1bmltcGxlbWVudGVkID0gZnVuY3Rpb24oKXsgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQuJykgfVxudmFyIG5vb3AgICAgICAgICAgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpcyAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbi8vIC0tIEltcGxlbWVudGF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIEEgc3RydWN0dXJlIGZvciB2YWx1ZXMgdGhhdCBtYXkgbm90IGJlIHByZXNlbnQsIG9yIGNvbXB1dGF0aW9ucyB0aGF0IG1heVxuICogZmFpbC4gYE1heWJlKGEpYCBleHBsaWNpdGx5IG1vZGVscyB0aGUgZWZmZWN0cyB0aGF0IGFyZSBpbXBsaWNpdCBpblxuICogYE51bGxhYmxlYCB0eXBlcywgdGh1cyBoYXMgbm9uZSBvZiB0aGUgcHJvYmxlbXMgYXNzb2NpYXRlZCB3aXRoXG4gKiBgbnVsbGAgb3IgYHVuZGVmaW5lZGAg4oCUIGxpa2UgYE51bGxQb2ludGVyRXhjZXB0aW9uc2AuXG4gKlxuICogVGhlIGNsYXNzIG1vZGVscyB0d28gZGlmZmVyZW50IGNhc2VzOlxuICpcbiAqICArIGBKdXN0IGFgIOKAlCByZXByZXNlbnRzIGEgYE1heWJlKGEpYCB0aGF0IGNvbnRhaW5zIGEgdmFsdWUuIGBhYCBtYXlcbiAqICAgICBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAuXG4gKlxuICogICsgYE5vdGhpbmdgIOKAlCByZXByZXNlbnRzIGEgYE1heWJlKGEpYCB0aGF0IGhhcyBubyB2YWx1ZXMuIE9yIGFcbiAqICAgICBmYWlsdXJlIHRoYXQgbmVlZHMgbm8gYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqXG4gKiBDb21tb24gdXNlcyBvZiB0aGlzIHN0cnVjdHVyZSBpbmNsdWRlcyBtb2RlbGxpbmcgdmFsdWVzIHRoYXQgbWF5IG9yIG1heVxuICogbm90IGJlIHByZXNlbnQgaW4gYSBjb2xsZWN0aW9uLCB0aHVzIGluc3RlYWQgb2YgbmVlZGluZyBhXG4gKiBgY29sbGVjdGlvbi5oYXMoYSlgLCB0aGUgYGNvbGxlY3Rpb24uZ2V0KGEpYCBvcGVyYXRpb24gZ2l2ZXMgeW91IGFsbFxuICogdGhlIGluZm9ybWF0aW9uIHlvdSBuZWVkIOKAlCBgY29sbGVjdGlvbi5nZXQoYSkuaXMtbm90aGluZ2AgYmVpbmdcbiAqIGVxdWl2YWxlbnQgdG8gYGNvbGxlY3Rpb24uaGFzKGEpYDsgU2ltaWxhcmx5IHRoZSBzYW1lIHJlYXNvbmluZyBtYXlcbiAqIGJlIGFwcGxpZWQgdG8gY29tcHV0YXRpb25zIHRoYXQgbWF5IGZhaWwgdG8gcHJvdmlkZSBhIHZhbHVlLCBlLmcuOlxuICogYGNvbGxlY3Rpb24uZmluZChwcmVkaWNhdGUpYCBjYW4gc2FmZWx5IHJldHVybiBhIGBNYXliZShhKWAgaW5zdGFuY2UsXG4gKiBldmVuIGlmIHRoZSBjb2xsZWN0aW9uIGNvbnRhaW5zIG51bGxhYmxlIHZhbHVlcy5cbiAqXG4gKiBGdXJ0aGVybW9yZSwgdGhlIHZhbHVlcyBvZiBgTWF5YmUoYSlgIGNhbiBiZSBjb21iaW5lZCBhbmQgbWFuaXB1bGF0ZWRcbiAqIGJ5IHVzaW5nIHRoZSBleHByZXNzaXZlIG1vbmFkaWMgb3BlcmF0aW9ucy4gVGhpcyBhbGxvd3Mgc2FmZWx5XG4gKiBzZXF1ZW5jaW5nIG9wZXJhdGlvbnMgdGhhdCBtYXkgZmFpbCwgYW5kIHNhZmVseSBjb21wb3NpbmcgdmFsdWVzIHRoYXRcbiAqIHlvdSBkb24ndCBrbm93IHdoZXRoZXIgdGhleSdyZSBwcmVzZW50IG9yIG5vdCwgZmFpbGluZyBlYXJseVxuICogKHJldHVybmluZyBhIGBOb3RoaW5nYCkgaWYgYW55IG9mIHRoZSBvcGVyYXRpb25zIGZhaWwuXG4gKlxuICogSWYgb25lIHdhbnRzIHRvIHN0b3JlIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gYWJvdXQgZmFpbHVyZXMsIHRoZVxuICogW0VpdGhlcl1bXSBhbmQgW1ZhbGlkYXRpb25dW10gc3RydWN0dXJlcyBwcm92aWRlIHN1Y2ggYSBjYXBhYmlsaXR5LCBhbmRcbiAqIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIGBNYXliZShhKWAgc3RydWN0dXJlLlxuICpcbiAqIFtFaXRoZXJdOiBodHRwczovL2dpdGh1Yi5jb20vZm9sa3RhbGUvZGF0YS5laXRoZXJcbiAqIFtWYWxpZGF0aW9uXTogaHR0cHM6Ly9naXRodWIuY29tL2ZvbGt0YWxlL2RhdGEudmFsaWRhdGlvblxuICpcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gTWF5YmUoKSB7fVxuXG4vLyBUaGUgY2FzZSBmb3Igc3VjY2Vzc2Z1bCB2YWx1ZXNcbkp1c3QucHJvdG90eXBlID0gY2xvbmUoTWF5YmUucHJvdG90eXBlKVxuZnVuY3Rpb24gSnVzdChhKXtcbiAgdGhpcy52YWx1ZSA9IGFcbn1cblxuLy8gVGhlIGNhc2UgZm9yIGZhaWx1cmUgdmFsdWVzXG5Ob3RoaW5nLnByb3RvdHlwZSA9IGNsb25lKE1heWJlLnByb3RvdHlwZSlcbmZ1bmN0aW9uIE5vdGhpbmcoKXt9XG5cblxuLy8gLS0gQ29uc3RydWN0b3JzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgd2l0aCBhbiBhYnNlbnQgdmFsdWUuIENvbW1vbmx5IHVzZWRcbiAqIHRvIHJlcHJlc2VudCBhIGZhaWx1cmUuXG4gKlxuICogQHN1bW1hcnkgVm9pZCDihpIgTWF5YmVbzrFdXG4gKi9cbk1heWJlLk5vdGhpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBOb3RoaW5nXG59XG5NYXliZS5wcm90b3R5cGUuTm90aGluZyA9IE1heWJlLk5vdGhpbmdcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBNYXliZVvOsV1gIHN0cnVjdHVyZSB0aGF0IGhvbGRzIHRoZSBzaW5nbGUgdmFsdWVcbiAqIGDOsWAuIENvbW1vbmx5IHVzZWQgdG8gcmVwcmVzZW50IGEgc3VjY2Vzcy5cbiAqXG4gKiBgzrFgIGNhbiBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAsIGB1bmRlZmluZWRgIG9yIGFub3RoZXJcbiAqIGBNYXliZVvOsV1gIHN0cnVjdHVyZS5cbiAqXG4gKiBAc3VtbWFyeSDOsSDihpIgTWF5YmVbzrFdXG4gKi9cbk1heWJlLkp1c3QgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBuZXcgSnVzdChhKVxufVxuTWF5YmUucHJvdG90eXBlLkp1c3QgPSBNYXliZS5KdXN0XG5cblxuLy8gLS0gQ29udmVyc2lvbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgZnJvbSBhIG51bGxhYmxlIHR5cGUuXG4gKlxuICogSWYgdGhlIHZhbHVlIGlzIGVpdGhlciBgbnVsbGAgb3IgYHVuZGVmaW5lZGAsIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBhXG4gKiBgTm90aGluZ2AsIG90aGVyd2lzZSB0aGUgdmFsdWUgaXMgd3JhcHBlZCBpbiBhIGBKdXN0KM6xKWAuXG4gKlxuICogQHN1bW1hcnkgzrEg4oaSIE1heWJlW86xXVxuICovXG5NYXliZS5mcm9tTnVsbGFibGUgPSBmdW5jdGlvbihhKSB7XG4gIHJldHVybiBhICE9IG51bGw/ICAgICAgIG5ldyBKdXN0KGEpXG4gIDogICAgICAvKiBvdGhlcndpc2UgKi8gIG5ldyBOb3RoaW5nXG59XG5NYXliZS5wcm90b3R5cGUuZnJvbU51bGxhYmxlID0gTWF5YmUuZnJvbU51bGxhYmxlXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIG5ldyBgTWF5YmVbzrJdYCBzdHJ1Y3R1cmUgZnJvbSBhbiBgRWl0aGVyW86xLCDOsl1gIHR5cGUuXG4gKlxuICogVGhlIGxlZnQgc2lkZSBvZiB0aGUgYEVpdGhlcmAgYmVjb21lcyBgTm90aGluZ2AsIGFuZCB0aGUgcmlnaHQgc2lkZVxuICogaXMgd3JhcHBlZCBpbiBhIGBKdXN0KM6yKWAuXG4gKlxuICogQHN1bW1hcnkgRWl0aGVyW86xLCDOsl0g4oaSIE1heWJlW86yXVxuICovXG5NYXliZS5mcm9tRWl0aGVyID0gZnVuY3Rpb24oYSkge1xuICByZXR1cm4gYS5mb2xkKE1heWJlLk5vdGhpbmcsIE1heWJlLkp1c3QpXG59XG5NYXliZS5wcm90b3R5cGUuZnJvbUVpdGhlciA9IE1heWJlLmZyb21FaXRoZXJcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbmV3IGBNYXliZVvOsl1gIHN0cnVjdHVyZSBmcm9tIGEgYFZhbGlkYXRpb25bzrEsIM6yXWAgdHlwZS5cbiAqXG4gKiBUaGUgZmFpbHVyZSBzaWRlIG9mIHRoZSBgVmFsaWRhdGlvbmAgYmVjb21lcyBgTm90aGluZ2AsIGFuZCB0aGUgcmlnaHRcbiAqIHNpZGUgaXMgd3JhcHBlZCBpbiBhIGBKdXN0KM6yKWAuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgVmFsaWRhdGlvblvOsSwgzrJdIOKGkiBNYXliZVvOsl1cbiAqL1xuTWF5YmUuZnJvbVZhbGlkYXRpb24gICAgICAgICAgID0gTWF5YmUuZnJvbUVpdGhlclxuTWF5YmUucHJvdG90eXBlLmZyb21WYWxpZGF0aW9uID0gTWF5YmUuZnJvbUVpdGhlclxuXG5cbi8vIC0tIFByZWRpY2F0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRydWUgaWYgdGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZSBjb250YWlucyBhIGZhaWx1cmUgKGkuZS46IGBOb3RoaW5nYCkuXG4gKlxuICogQHN1bW1hcnkgQm9vbGVhblxuICovXG5NYXliZS5wcm90b3R5cGUuaXNOb3RoaW5nICAgPSBmYWxzZVxuTm90aGluZy5wcm90b3R5cGUuaXNOb3RoaW5nID0gdHJ1ZVxuXG5cbi8qKlxuICogVHJ1ZSBpZiB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlIGNvbnRhaW5zIGEgc2luZ2xlIHZhbHVlIChpLmUuOiBgSnVzdCjOsSlgKS5cbiAqXG4gKiBAc3VtbWFyeSBCb29sZWFuXG4gKi9cbk1heWJlLnByb3RvdHlwZS5pc0p1c3QgPSBmYWxzZVxuSnVzdC5wcm90b3R5cGUuaXNKdXN0ICA9IHRydWVcblxuXG4vLyAtLSBBcHBsaWNhdGl2ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBNYXliZVvOsV1gIHN0cnVjdHVyZSBob2xkaW5nIHRoZSBzaW5nbGUgdmFsdWUgYM6xYC5cbiAqXG4gKiBgzrFgIGNhbiBiZSBhbnkgdmFsdWUsIGluY2x1ZGluZyBgbnVsbGAsIGB1bmRlZmluZWRgLCBvciBhbm90aGVyXG4gKiBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQHN1bW1hcnkgzrEg4oaSIE1heWJlW86xXVxuICovXG5NYXliZS5vZiA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIG5ldyBKdXN0KGEpXG59XG5NYXliZS5wcm90b3R5cGUub2YgPSBNYXliZS5vZlxuXG5cbi8qKlxuICogQXBwbGllcyB0aGUgZnVuY3Rpb24gaW5zaWRlIHRoZSBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgdG8gYW5vdGhlclxuICogYXBwbGljYXRpdmUgdHlwZS5cbiAqXG4gKiBUaGUgYE1heWJlW86xXWAgc3RydWN0dXJlIHNob3VsZCBjb250YWluIGEgZnVuY3Rpb24gdmFsdWUsIG90aGVyd2lzZSBhXG4gKiBgVHlwZUVycm9yYCBpcyB0aHJvd24uXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgKEBNYXliZVvOsSDihpIgzrJdLCBmOkFwcGxpY2F0aXZlW19dKSA9PiBmW86xXSDihpIgZlvOsl1cbiAqL1xuTWF5YmUucHJvdG90eXBlLmFwID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5hcCA9IG5vb3BcblxuSnVzdC5wcm90b3R5cGUuYXAgPSBmdW5jdGlvbihiKSB7XG4gIHJldHVybiBiLm1hcCh0aGlzLnZhbHVlKVxufVxuXG5cblxuXG4vLyAtLSBGdW5jdG9yIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBUcmFuc2Zvcm1zIHRoZSB2YWx1ZSBvZiB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlIHVzaW5nIGEgcmVndWxhciB1bmFyeVxuICogZnVuY3Rpb24uXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgQE1heWJlW86xXSA9PiAozrEg4oaSIM6yKSDihpIgTWF5YmVbzrJdXG4gKi9cbk1heWJlLnByb3RvdHlwZS5tYXAgICA9IHVuaW1wbGVtZW50ZWRcbk5vdGhpbmcucHJvdG90eXBlLm1hcCA9IG5vb3BcblxuSnVzdC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gdGhpcy5vZihmKHRoaXMudmFsdWUpKVxufVxuXG5cbi8vIC0tIENoYWluIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRyYW5zZm9ybXMgdGhlIHZhbHVlIG9mIHRoZSBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUgdXNpbmcgYW4gdW5hcnkgZnVuY3Rpb25cbiAqIHRvIG1vbmFkcy5cbiAqXG4gKiBAbWV0aG9kXG4gKiBAc3VtbWFyeSAoQE1heWJlW86xXSwgbTpNb25hZFtfXSkgPT4gKM6xIOKGkiBtW86yXSkg4oaSIG1bzrJdXG4gKi9cbk1heWJlLnByb3RvdHlwZS5jaGFpbiAgID0gdW5pbXBsZW1lbnRlZFxuTm90aGluZy5wcm90b3R5cGUuY2hhaW4gPSBub29wXG5cbkp1c3QucHJvdG90eXBlLmNoYWluID0gZnVuY3Rpb24oZikge1xuICByZXR1cm4gZih0aGlzLnZhbHVlKVxufVxuXG5cbi8vIC0tIFNob3cgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFJldHVybnMgYSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgQE1heWJlW86xXSA9PiBWb2lkIOKGkiBTdHJpbmdcbiAqL1xuTWF5YmUucHJvdG90eXBlLnRvU3RyaW5nID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ01heWJlLk5vdGhpbmcnXG59XG5cbkp1c3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnTWF5YmUuSnVzdCgnICsgdGhpcy52YWx1ZSArICcpJ1xufVxuXG5cbi8vIC0tIEVxIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIFRlc3RzIGlmIGEgYE1heWJlW86xXWAgc3RydWN0dXJlIGlzIGVxdWFsIHRvIGFub3RoZXIgYE1heWJlW86xXWAgc3RydWN0dXJlLlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gTWF5YmVbzrFdIOKGkiBCb29sZWFuXG4gKi9cbk1heWJlLnByb3RvdHlwZS5pc0VxdWFsID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5pc0VxdWFsID0gZnVuY3Rpb24oYikge1xuICByZXR1cm4gYi5pc05vdGhpbmdcbn1cblxuSnVzdC5wcm90b3R5cGUuaXNFcXVhbCA9IGZ1bmN0aW9uKGIpIHtcbiAgcmV0dXJuIGIuaXNKdXN0XG4gICYmICAgICBiLnZhbHVlID09PSB0aGlzLnZhbHVlXG59XG5cblxuLy8gLS0gRXh0cmFjdGluZyBhbmQgcmVjb3ZlcmluZyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIHZhbHVlIG91dCBvZiB0aGUgYE1heWJlW86xXWAgc3RydWN0dXJlLCBpZiBpdFxuICogZXhpc3RzLiBPdGhlcndpc2UgdGhyb3dzIGEgYFR5cGVFcnJvcmAuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgQE1heWJlW86xXSA9PiBWb2lkIOKGkiBhLCAgICAgIDo6IHBhcnRpYWwsIHRocm93c1xuICogQHNlZSB7QGxpbmsgbW9kdWxlOmxpYi9tYXliZX5NYXliZSNnZXRPckVsc2V9IOKAlCBBIGdldHRlciB0aGF0IGNhbiBoYW5kbGUgZmFpbHVyZXNcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gaWYgdGhlIHN0cnVjdHVyZSBoYXMgbm8gdmFsdWUgKGBOb3RoaW5nYCkuXG4gKi9cbk1heWJlLnByb3RvdHlwZS5nZXQgPSB1bmltcGxlbWVudGVkXG5cbk5vdGhpbmcucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2FuJ3QgZXh0cmFjdCB0aGUgdmFsdWUgb2YgYSBOb3RoaW5nLlwiKVxufVxuXG5KdXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudmFsdWVcbn1cblxuXG4vKipcbiAqIEV4dHJhY3RzIHRoZSB2YWx1ZSBvdXQgb2YgdGhlIGBNYXliZVvOsV1gIHN0cnVjdHVyZS4gSWYgdGhlcmUgaXMgbm8gdmFsdWUsXG4gKiByZXR1cm5zIHRoZSBnaXZlbiBkZWZhdWx0LlxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gzrEg4oaSIM6xXG4gKi9cbk1heWJlLnByb3RvdHlwZS5nZXRPckVsc2UgPSB1bmltcGxlbWVudGVkXG5cbk5vdGhpbmcucHJvdG90eXBlLmdldE9yRWxzZSA9IGZ1bmN0aW9uKGEpIHtcbiAgcmV0dXJuIGFcbn1cblxuSnVzdC5wcm90b3R5cGUuZ2V0T3JFbHNlID0gZnVuY3Rpb24oXykge1xuICByZXR1cm4gdGhpcy52YWx1ZVxufVxuXG5cbi8qKlxuICogVHJhbnNmb3JtcyBhIGZhaWx1cmUgaW50byBhIG5ldyBgTWF5YmVbzrFdYCBzdHJ1Y3R1cmUuIERvZXMgbm90aGluZyBpZiB0aGVcbiAqIHN0cnVjdHVyZSBhbHJlYWR5IGNvbnRhaW5zIGEgdmFsdWUuXG4gKlxuICogQG1ldGhvZFxuICogQHN1bW1hcnkgQE1heWJlW86xXSA9PiAoVm9pZCDihpIgTWF5YmVbzrFdKSDihpIgTWF5YmVbzrFdXG4gKi9cbk1heWJlLnByb3RvdHlwZS5vckVsc2UgPSB1bmltcGxlbWVudGVkXG5cbk5vdGhpbmcucHJvdG90eXBlLm9yRWxzZSA9IGZ1bmN0aW9uKGYpIHtcbiAgcmV0dXJuIGYoKVxufVxuXG5KdXN0LnByb3RvdHlwZS5vckVsc2UgPSBmdW5jdGlvbihfKSB7XG4gIHJldHVybiB0aGlzXG59XG5cblxuLyoqXG4gKiBDYXRhbW9ycGhpc20uXG4gKiBcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4geyBOb3RoaW5nOiBWb2lkIOKGkiDOsiwgSnVzdDogzrEg4oaSIM6yIH0g4oaSIM6yXG4gKi9cbk1heWJlLnByb3RvdHlwZS5jYXRhID0gdW5pbXBsZW1lbnRlZFxuXG5Ob3RoaW5nLnByb3RvdHlwZS5jYXRhID0gZnVuY3Rpb24ocGF0dGVybikge1xuICByZXR1cm4gcGF0dGVybi5Ob3RoaW5nKClcbn1cblxuSnVzdC5wcm90b3R5cGUuY2F0YSA9IGZ1bmN0aW9uKHBhdHRlcm4pIHtcbiAgcmV0dXJuIHBhdHRlcm4uSnVzdCh0aGlzLnZhbHVlKTtcbn1cblxuXG4vKipcbiAqIEpTT04gc2VyaWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2RcbiAqIEBzdW1tYXJ5IEBNYXliZVvOsV0gPT4gVm9pZCDihpIgT2JqZWN0XG4gKi9cbk1heWJlLnByb3RvdHlwZS50b0pTT04gPSB1bmltcGxlbWVudGVkXG5cbk5vdGhpbmcucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4geyAnI3R5cGUnOiAnZm9sa3RhbGU6TWF5YmUuTm90aGluZycgfVxufVxuXG5KdXN0LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHsgJyN0eXBlJzogJ2ZvbGt0YWxlOk1heWJlLkp1c3QnXG4gICAgICAgICAsIHZhbHVlOiB0aGlzLnZhbHVlIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMy0yMDE0IFF1aWxkcmVlbiBNb3R0YSA8cXVpbGRyZWVuQGdtYWlsLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuLy8gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXNcbi8vICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbi8vIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4vLyBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuLy8gYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbi8vIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4vLyBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuLy8gRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuLy8gTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuLy8gTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTlxuLy8gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL21heWJlJykiLCJpbXBvcnQgeyBjdXJyeSwgcGlwZSwgcHJvcCwgb3ZlciwgYXBwZW5kIH0gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgeyBoaWRlQ29uZmlncywgU3RhdGVMZW5zZXMsIHB1c2hIaXN0b3J5U3RhdGUgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IE1heWJlIGZyb20gXCJkYXRhLm1heWJlXCI7XG5cbi8vIFN0YXRlIC0+IE9iamVjdCAtPiBTdGF0ZVxuY29uc3QgaGlzdG9yeVN0YXRlV2l0aE5ld0ZpZWxkID0gY3VycnkoKHN0YXRlLCBuZXdGaWVsZCkgPT4gcGlwZShcbiAgaGlkZUNvbmZpZ3MsXG4gIG92ZXIoU3RhdGVMZW5zZXMuZmllbGRzU3RhdGUsIGFwcGVuZChuZXdGaWVsZCkpXG4pKHN0YXRlKSk7XG5cbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBjcmVhdGVkRmllbGRTdGF0ZSB9KSA9PlxuICBNYXliZS5mcm9tTnVsbGFibGUoY3JlYXRlZEZpZWxkU3RhdGUpXG4gIC5tYXAoaGlzdG9yeVN0YXRlV2l0aE5ld0ZpZWxkKHN0YXRlKSlcbiAgLm1hcChwcm9wKFwiZmllbGRzU3RhdGVcIikpXG4gIC5tYXAocHVzaEhpc3RvcnlTdGF0ZShzdGF0ZSkpXG4gIC5nZXRPckVsc2Uoc3RhdGUpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbmV3LWNhcCAqL1xuaW1wb3J0IHsgY3VycnkgfSBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCBNYXliZSBmcm9tIFwiZGF0YS5tYXliZVwiO1xuaW1wb3J0IEltbXV0YWJsZSBmcm9tIFwic2VhbWxlc3MtaW1tdXRhYmxlXCI7XG5pbXBvcnQgeyBwdXNoSGlzdG9yeVN0YXRlIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuY29uc3QgdG9nZ2xlQ29uZmlnID0gZmllbGRTdGF0ZSA9PlxuICBJbW11dGFibGUoZmllbGRTdGF0ZSkuc2V0KFwiY29uZmlnU2hvd2luZ1wiLCAhZmllbGRTdGF0ZS5jb25maWdTaG93aW5nKTtcblxuY29uc3QgcmVwbGFjZUZpZWxkU3RhdGUgPSBjdXJyeSgoc3RhdGUsIGZpZWxkU3RhdGUpID0+XG4gIHN0YXRlXG4gICAgLmZpZWxkc1N0YXRlXG4gICAgLm1hcChhRmllbGQgPT4gYUZpZWxkLmlkID09PSBmaWVsZFN0YXRlLmlkXG4gICAgICA/IGZpZWxkU3RhdGVcbiAgICAgIDogYUZpZWxkXG4gICAgKVxuKTtcblxuZXhwb3J0IGRlZmF1bHQgKHN0YXRlLCB7IGZpZWxkU3RhdGUgfSkgPT5cbiAgTWF5YmUuZnJvbU51bGxhYmxlKGZpZWxkU3RhdGUpXG4gIC5tYXAodG9nZ2xlQ29uZmlnKVxuICAubWFwKHJlcGxhY2VGaWVsZFN0YXRlKHN0YXRlKSlcbiAgLm1hcChwdXNoSGlzdG9yeVN0YXRlKHN0YXRlKSlcbiAgLmdldE9yRWxzZShzdGF0ZSk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuZXctY2FwICovXG5pbXBvcnQgeyBjdXJyeSB9IGZyb20gXCJyYW1kYVwiO1xuaW1wb3J0IE1heWJlIGZyb20gXCJkYXRhLm1heWJlXCI7XG5pbXBvcnQgSW1tdXRhYmxlIGZyb20gXCJzZWFtbGVzcy1pbW11dGFibGVcIjtcbmltcG9ydCB7IHB1c2hIaXN0b3J5U3RhdGUgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5jb25zdCB0b2dnbGVSZXF1aXJlZCA9IGZpZWxkU3RhdGUgPT5cbiAgSW1tdXRhYmxlKGZpZWxkU3RhdGUpLnNldChcInJlcXVpcmVkXCIsICFmaWVsZFN0YXRlLnJlcXVpcmVkKTtcblxuY29uc3QgcmVwbGFjZUZpZWxkU3RhdGUgPSBjdXJyeSgoc3RhdGUsIGZpZWxkU3RhdGUpID0+XG4gIHN0YXRlXG4gICAgLmZpZWxkc1N0YXRlXG4gICAgLm1hcChhRmllbGQgPT4gYUZpZWxkLmlkID09PSBmaWVsZFN0YXRlLmlkXG4gICAgICA/IGZpZWxkU3RhdGVcbiAgICAgIDogYUZpZWxkXG4gICAgKVxuKTtcblxuZXhwb3J0IGRlZmF1bHQgKHN0YXRlLCB7IGZpZWxkU3RhdGUgfSkgPT5cbiAgTWF5YmUuZnJvbU51bGxhYmxlKGZpZWxkU3RhdGUpXG4gIC5tYXAodG9nZ2xlUmVxdWlyZWQpXG4gIC5tYXAocmVwbGFjZUZpZWxkU3RhdGUoc3RhdGUpKVxuICAubWFwKHB1c2hIaXN0b3J5U3RhdGUoc3RhdGUpKVxuICAuZ2V0T3JFbHNlKHN0YXRlKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gX2ZpbHRlcihmbiwgbGlzdCkge1xuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIGlmIChmbihsaXN0W2lkeF0pKSB7XG4gICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBsaXN0W2lkeF07XG4gICAgfVxuICAgIGlkeCArPSAxO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBfaXNPYmplY3QoeCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBPYmplY3RdJztcbn07XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vX2N1cnJ5MicpO1xudmFyIF94ZkJhc2UgPSByZXF1aXJlKCcuL194ZkJhc2UnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gWEZpbHRlcihmLCB4Zikge1xuICAgIHRoaXMueGYgPSB4ZjtcbiAgICB0aGlzLmYgPSBmO1xuICB9XG4gIFhGaWx0ZXIucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICBYRmlsdGVyLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gX3hmQmFzZS5yZXN1bHQ7XG4gIFhGaWx0ZXIucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24ocmVzdWx0LCBpbnB1dCkge1xuICAgIHJldHVybiB0aGlzLmYoaW5wdXQpID8gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGlucHV0KSA6IHJlc3VsdDtcbiAgfTtcblxuICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeGZpbHRlcihmLCB4ZikgeyByZXR1cm4gbmV3IFhGaWx0ZXIoZiwgeGYpOyB9KTtcbn0oKSk7XG4iLCJ2YXIgX2N1cnJ5MiA9IHJlcXVpcmUoJy4vaW50ZXJuYWwvX2N1cnJ5MicpO1xudmFyIF9kaXNwYXRjaGFibGUgPSByZXF1aXJlKCcuL2ludGVybmFsL19kaXNwYXRjaGFibGUnKTtcbnZhciBfZmlsdGVyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fZmlsdGVyJyk7XG52YXIgX2lzT2JqZWN0ID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9faXNPYmplY3QnKTtcbnZhciBfcmVkdWNlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fcmVkdWNlJyk7XG52YXIgX3hmaWx0ZXIgPSByZXF1aXJlKCcuL2ludGVybmFsL194ZmlsdGVyJyk7XG52YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG5cbi8qKlxuICogVGFrZXMgYSBwcmVkaWNhdGUgYW5kIGEgXCJmaWx0ZXJhYmxlXCIsIGFuZCByZXR1cm5zIGEgbmV3IGZpbHRlcmFibGUgb2YgdGhlXG4gKiBzYW1lIHR5cGUgY29udGFpbmluZyB0aGUgbWVtYmVycyBvZiB0aGUgZ2l2ZW4gZmlsdGVyYWJsZSB3aGljaCBzYXRpc2Z5IHRoZVxuICogZ2l2ZW4gcHJlZGljYXRlLlxuICpcbiAqIERpc3BhdGNoZXMgdG8gdGhlIGBmaWx0ZXJgIG1ldGhvZCBvZiB0aGUgc2Vjb25kIGFyZ3VtZW50LCBpZiBwcmVzZW50LlxuICpcbiAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIEZpbHRlcmFibGUgZiA9PiAoYSAtPiBCb29sZWFuKSAtPiBmIGEgLT4gZiBhXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkXG4gKiBAcGFyYW0ge0FycmF5fSBmaWx0ZXJhYmxlXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBzZWUgUi5yZWplY3QsIFIudHJhbnNkdWNlLCBSLmFkZEluZGV4XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgdmFyIGlzRXZlbiA9IG4gPT4gbiAlIDIgPT09IDA7XG4gKlxuICogICAgICBSLmZpbHRlcihpc0V2ZW4sIFsxLCAyLCAzLCA0XSk7IC8vPT4gWzIsIDRdXG4gKlxuICogICAgICBSLmZpbHRlcihpc0V2ZW4sIHthOiAxLCBiOiAyLCBjOiAzLCBkOiA0fSk7IC8vPT4ge2I6IDIsIGQ6IDR9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdmaWx0ZXInLCBfeGZpbHRlciwgZnVuY3Rpb24ocHJlZCwgZmlsdGVyYWJsZSkge1xuICByZXR1cm4gKFxuICAgIF9pc09iamVjdChmaWx0ZXJhYmxlKSA/XG4gICAgICBfcmVkdWNlKGZ1bmN0aW9uKGFjYywga2V5KSB7XG4gICAgICAgIGlmIChwcmVkKGZpbHRlcmFibGVba2V5XSkpIHtcbiAgICAgICAgICBhY2Nba2V5XSA9IGZpbHRlcmFibGVba2V5XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30sIGtleXMoZmlsdGVyYWJsZSkpIDpcbiAgICAvLyBlbHNlXG4gICAgICBfZmlsdGVyKHByZWQsIGZpbHRlcmFibGUpXG4gICk7XG59KSk7XG4iLCJpbXBvcnQgeyBjdXJyeSwgcHJvcCwgb3ZlciwgZmlsdGVyIH0gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgeyBTdGF0ZUxlbnNlcywgcHVzaEhpc3RvcnlTdGF0ZSB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgTWF5YmUgZnJvbSBcImRhdGEubWF5YmVcIjtcblxuLy8gU3RhdGUgLT4gT2JqZWN0IC0+IFN0YXRlXG5jb25zdCBoaXN0b3J5U3RhdGVXaXRob3V0RmllbGQgPSBjdXJyeSgoc3RhdGUsIGZpZWxkU3RhdGUpID0+XG4gIG92ZXIoXG4gICAgU3RhdGVMZW5zZXMuZmllbGRzU3RhdGUsXG4gICAgZmlsdGVyKGZzID0+IGZzLmlkICE9PSBmaWVsZFN0YXRlLmlkKSxcbiAgICBzdGF0ZVxuICApXG4pO1xuXG5leHBvcnQgZGVmYXVsdCAoc3RhdGUsIHsgZmllbGRTdGF0ZSB9KSA9PlxuICBNYXliZS5mcm9tTnVsbGFibGUoZmllbGRTdGF0ZSlcbiAgLm1hcChoaXN0b3J5U3RhdGVXaXRob3V0RmllbGQoc3RhdGUpKVxuICAubWFwKHByb3AoXCJmaWVsZHNTdGF0ZVwiKSlcbiAgLm1hcChwdXNoSGlzdG9yeVN0YXRlKHN0YXRlKSlcbiAgLmdldE9yRWxzZShzdGF0ZSk7XG4iLCJpbXBvcnQgeyBjdXJyeSwgcHJvcCwgb3ZlciwgbWFwIH0gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgeyBTdGF0ZUxlbnNlcywgcHVzaEhpc3RvcnlTdGF0ZSwgdmFsaWRhdGVGaWVsZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbi8vIFN0YXRlIC0+IE9iamVjdCAtPiBTdGF0ZVxuY29uc3QgdXBkYXRlRmllbGRTdGF0ZSA9IGN1cnJ5KChzdGF0ZSwgbmV3RmllbGRTdGF0ZSkgPT5cbiAgb3ZlcihcbiAgICBTdGF0ZUxlbnNlcy5maWVsZHNTdGF0ZSxcbiAgICBtYXAoZnMgPT4gZnMuaWQgPT09IG5ld0ZpZWxkU3RhdGUuaWQgPyBuZXdGaWVsZFN0YXRlIDogZnMpLFxuICAgIHN0YXRlXG4gIClcbik7XG5cbmV4cG9ydCBkZWZhdWx0IChzdGF0ZSwgeyBuZXdGaWVsZFN0YXRlIH0pID0+XG4gIHZhbGlkYXRlRmllbGQobmV3RmllbGRTdGF0ZSkgLy8gRWl0aGVyXG4gIC5tYXAodXBkYXRlRmllbGRTdGF0ZShzdGF0ZSkpXG4gIC5tYXAocHJvcChcImZpZWxkc1N0YXRlXCIpKVxuICAubWFwKHB1c2hIaXN0b3J5U3RhdGUoc3RhdGUpKVxuICAubGVmdE1hcChjb25zb2xlLmVycm9yKVxuICAuZ2V0T3JFbHNlKHN0YXRlKTtcbiIsInZhciBfY3VycnkyID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fY3VycnkyJyk7XG52YXIgX3NsaWNlID0gcmVxdWlyZSgnLi9pbnRlcm5hbC9fc2xpY2UnKTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBjb3B5IG9mIHRoZSBsaXN0LCBzb3J0ZWQgYWNjb3JkaW5nIHRvIHRoZSBjb21wYXJhdG9yIGZ1bmN0aW9uLFxuICogd2hpY2ggc2hvdWxkIGFjY2VwdCB0d28gdmFsdWVzIGF0IGEgdGltZSBhbmQgcmV0dXJuIGEgbmVnYXRpdmUgbnVtYmVyIGlmIHRoZVxuICogZmlyc3QgdmFsdWUgaXMgc21hbGxlciwgYSBwb3NpdGl2ZSBudW1iZXIgaWYgaXQncyBsYXJnZXIsIGFuZCB6ZXJvIGlmIHRoZXlcbiAqIGFyZSBlcXVhbC4gUGxlYXNlIG5vdGUgdGhhdCB0aGlzIGlzIGEgKipjb3B5Kiogb2YgdGhlIGxpc3QuIEl0IGRvZXMgbm90XG4gKiBtb2RpZnkgdGhlIG9yaWdpbmFsLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgKGEsYSAtPiBOdW1iZXIpIC0+IFthXSAtPiBbYV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgQSBzb3J0aW5nIGZ1bmN0aW9uIDo6IGEgLT4gYiAtPiBJbnRcbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gc29ydFxuICogQHJldHVybiB7QXJyYXl9IGEgbmV3IGFycmF5IHdpdGggaXRzIGVsZW1lbnRzIHNvcnRlZCBieSB0aGUgY29tcGFyYXRvciBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICB2YXIgZGlmZiA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEgLSBiOyB9O1xuICogICAgICBSLnNvcnQoZGlmZiwgWzQsMiw3LDVdKTsgLy89PiBbMiwgNCwgNSwgN11cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBfY3VycnkyKGZ1bmN0aW9uIHNvcnQoY29tcGFyYXRvciwgbGlzdCkge1xuICByZXR1cm4gX3NsaWNlKGxpc3QpLnNvcnQoY29tcGFyYXRvcik7XG59KTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5ldy1jYXAgKi9cbmltcG9ydCB7IGN1cnJ5LCBwaXBlLCBwcm9wLCBvdmVyLCBzb3J0IH0gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgeyBoaWRlQ29uZmlncywgU3RhdGVMZW5zZXMsIHB1c2hIaXN0b3J5U3RhdGUgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IEVpdGhlciBmcm9tIFwiZGF0YS5laXRoZXJcIjtcblxuLy8gU3RhdGUgLT4gT2JqZWN0IC0+IFN0YXRlXG5jb25zdCBoaXN0b3J5U3RhdGVXaXRoTmV3T3JkZXIgPSBjdXJyeSgoc3RhdGUsIG5ld09yZGVyKSA9PiBwaXBlKFxuICBoaWRlQ29uZmlncyxcbiAgb3ZlcihcbiAgICBTdGF0ZUxlbnNlcy5maWVsZHNTdGF0ZSxcbiAgICBzb3J0KChmMSwgZjIpID0+IG5ld09yZGVyLmluZGV4T2YoZjEuaWQpIC0gbmV3T3JkZXIuaW5kZXhPZihmMi5pZCkpXG4gIClcbikoc3RhdGUpKTtcblxuZXhwb3J0IGRlZmF1bHQgKHN0YXRlLCB7IG5ld0ZpZWxkc09yZGVyIH0pID0+XG4gIChuZXdGaWVsZHNPcmRlciAmJiBBcnJheS5pc0FycmF5KG5ld0ZpZWxkc09yZGVyKVxuICAgID8gRWl0aGVyLlJpZ2h0KG5ld0ZpZWxkc09yZGVyKVxuICAgIDogRWl0aGVyLkxlZnQoYG5ld0ZpZWxkc09yZGVyIG11c3QgYmUgYW4gYXJyYXkgYnV0IHJlY2VpdmVkICR7dHlwZW9mIG5ld0ZpZWxkc09yZGVyfWApXG4gIClcbiAgLmNoYWluKG8gPT5cbiAgICBvLmxlbmd0aCA9PT0gc3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoXG4gICAgICA/IEVpdGhlci5SaWdodChvKVxuICAgICAgOiBFaXRoZXIuTGVmdChgbmV3RmllbGRzT3JkZXIgaGFzICR7by5sZW5ndGh9IGVsZW1lbnRzLCBidXQgdGhlIGN1cnJlbnQgc3RhdGUgaGFzICR7c3RhdGUuZmllbGRzU3RhdGUubGVuZ3RofSBlbGVtZW50c2ApIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbWF4LWxlblxuICApXG4gIC5jaGFpbihvID0+IHtcbiAgICBjb25zdCBzdGF0ZUlkcyA9IHN0YXRlLmZpZWxkc1N0YXRlLm1hcChwcm9wKFwiaWRcIikpO1xuICAgIGNvbnN0IG5vTWlzc2luZ0lkID0gc3RhdGVJZHMucmVkdWNlKChhY2MsIGZJZCkgPT4gYWNjICYmIG8uaW5jbHVkZXMoZklkKSwgdHJ1ZSk7XG4gICAgcmV0dXJuIG5vTWlzc2luZ0lkXG4gICAgICA/IEVpdGhlci5SaWdodChvKVxuICAgICAgOiBFaXRoZXIuTGVmdChcIk5vdCBhbGwgaWRzIGluIHRoZSBuZXcgb3JkZXIgYXJlIG1hdGNoZWQgaW4gdGhlIGV4aXN0aW5nIHN0YXRlIGlkcy5cIik7XG4gIH0pXG4gIC5tYXAoaGlzdG9yeVN0YXRlV2l0aE5ld09yZGVyKHN0YXRlKSlcbiAgLm1hcChwcm9wKFwiZmllbGRzU3RhdGVcIikpXG4gIC5tYXAocHVzaEhpc3RvcnlTdGF0ZShzdGF0ZSkpXG4gIC5sZWZ0TWFwKGVyciA9PiBjb25zb2xlLmVycm9yKGBVbmFibGUgdG8gcmVvcmRlcjogJHtlcnJ9YCkpXG4gIC5nZXRPckVsc2Uoc3RhdGUpO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbmVzdGVkLXRlcm5hcnkgKi9cbmltcG9ydCBhc3NlcnQgZnJvbSBcImZsLWFzc2VydFwiO1xuaW1wb3J0IHVuZG8gZnJvbSBcIi4vdW5kb1wiO1xuaW1wb3J0IGltcG9ydFN0YXRlIGZyb20gXCIuL2ltcG9ydFN0YXRlXCI7XG5pbXBvcnQgY3JlYXRlRmllbGQgZnJvbSBcIi4vY3JlYXRlRmllbGRcIjtcbmltcG9ydCBmaWVsZENyZWF0ZWQgZnJvbSBcIi4vZmllbGRDcmVhdGVkXCI7XG5pbXBvcnQgdG9nZ2xlQ29uZmlnIGZyb20gXCIuL2ZpZWxkLnRvZ2dsZUNvbmZpZ1wiO1xuaW1wb3J0IHRvZ2dsZVJlcXVpcmVkIGZyb20gXCIuL2ZpZWxkLnRvZ2dsZVJlcXVpcmVkXCI7XG5pbXBvcnQgZGVsZXRlRmllbGQgZnJvbSBcIi4vZmllbGQuZGVsZXRlRmllbGRcIjtcbmltcG9ydCB1cGRhdGVGaWVsZCBmcm9tIFwiLi9maWVsZC51cGRhdGVGaWVsZFwiO1xuaW1wb3J0IHJlb3JkZXJGaWVsZHMgZnJvbSBcIi4vcmVvcmRlckZpZWxkc1wiO1xuXG5jb25zdCBhY3Rpb25IYW5kbGVycyA9IHtcbiAgdW5kbyxcbiAgaW1wb3J0U3RhdGUsXG4gIGNyZWF0ZUZpZWxkLFxuICBmaWVsZENyZWF0ZWQsXG4gIHRvZ2dsZUNvbmZpZyxcbiAgdG9nZ2xlUmVxdWlyZWQsXG4gIGRlbGV0ZUZpZWxkLFxuICB1cGRhdGVGaWVsZCxcbiAgcmVvcmRlckZpZWxkcyxcbn07XG5cbmNvbnN0IGlzRXhwZWN0ZWRBY3Rpb24gPSBhID0+IGEgJiYgYS50eXBlICYmIGFjdGlvbkhhbmRsZXJzW2EudHlwZV07XG5jb25zdCBpc1JlZHV4QWN0aW9uID0gYSA9PiBhICYmIGEudHlwZSAmJiBhLnR5cGUuaW5jbHVkZXMoXCJAQHJlZHV4XCIpO1xuXG5cbmNvbnN0IHVwZGF0ZSA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICBpc0V4cGVjdGVkQWN0aW9uKGFjdGlvbilcbiAgICA/IGFjdGlvbkhhbmRsZXJzW2FjdGlvbi50eXBlXShzdGF0ZSwgYWN0aW9uKVxuICA6IGlzUmVkdXhBY3Rpb24oYWN0aW9uKVxuICAgID8gc3RhdGVcbiAgOiBhc3NlcnQoZmFsc2UsIGBJbnZhbGlkIGFjdGlvbiB0eXBlOiAke2FjdGlvbi50eXBlfWApO1xuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGU7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHsgdW5kbyBhcyB1bmRvQWN0aW9uIH0gZnJvbSBcIi4uLy4uL2pzL0FjdGlvbnNcIjtcbmltcG9ydCB1cGRhdGUgZnJvbSBcIi4uLy4uL2pzL1VwZGF0ZVwiO1xuXG5jb25zdCBjdXJyZW50RmllbGRzU3RhdGUgPSBbXCJjdXJyZW50XCJdO1xuY29uc3Qgb2xkRmllbGRzU3RhdGUgPSBbXCJvbGRcIl07XG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFtdLFxuICBmaWVsZHNTdGF0ZTogY3VycmVudEZpZWxkc1N0YXRlLFxuICBmaWVsZHNTdGF0ZUhpc3Rvcnk6IFtvbGRGaWVsZHNTdGF0ZV0sXG59O1xuXG5jb25zdCBlbXB0eU1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW10sXG4gIGZpZWxkc1N0YXRlOiBbXSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBbXSxcbn07XG5cbmNvbnN0IGVtcHR5SGlzdG9yeU1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW10sXG4gIGZpZWxkc1N0YXRlOiBjdXJyZW50RmllbGRzU3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogW10sXG59O1xuXG5kZXNjcmliZShcIlVwZGF0ZS51bmRvXCIsICgpID0+IHtcbiAgaXQoXCJyZW1vdmVzIGZpcnN0IG9sZCBzdGF0ZSBmcm9tIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB1bmRvQWN0aW9uKCkpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoMCk7XG4gIH0pO1xuXG4gIGl0KFwic2V0cyBmaXJzdCBvbGQgc3RhdGUgYXMgY3VycmVudCBzdGF0ZVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIHVuZG9BY3Rpb24oKSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGUpLnRvRXF1YWwob2xkRmllbGRzU3RhdGUpO1xuICB9KTtcblxuICBpdChcImRvZXNuJ3QgbW9kaWZ5IHRoZSBzdGF0ZSBpZiB0aGVyZSBhcmVuJ3QgbW9yZSBoaXN0b3J5IHN0YXRlcyB0byB1bmRvXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RpZmllZFN0YXRlID0gdXBkYXRlKGVtcHR5TW9ja1N0YXRlLCB1bmRvQWN0aW9uKCkpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlKS50b0VxdWFsKGVtcHR5TW9ja1N0YXRlKTtcbiAgfSk7XG5cbiAgaXQoXCJzZXQncyB0aGUgY3VycmVudCBzdGF0ZSB0byBlbXB0eSBpZiB0aGVyZSBhcmUgbm8gbW9yZSBoaXN0b3J5IHN0YXRlc1wiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShlbXB0eUhpc3RvcnlNb2NrU3RhdGUsIHVuZG9BY3Rpb24oKSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKS50b0VxdWFsKDApO1xuICB9KTtcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5pbXBvcnQgeyBpbXBvcnRTdGF0ZSB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuY29uc3QgdHlwZXNBcnJheSA9IFt7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiUmFkaW9CdXR0b25zXCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiQ2hlY2tib3hlc1wiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIkRyb3Bkb3duXCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiVGV4dEJveFwiLFxuICB9LFxufSwge1xuICBcImluZm9cIjoge1xuICAgIFwidHlwZVwiOiBcIkVtYWlsQm94XCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiVGVsZXBob25lQm94XCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiTnVtYmVyQm94XCIsXG4gIH0sXG59LCB7XG4gIFwiaW5mb1wiOiB7XG4gICAgXCJ0eXBlXCI6IFwiVGV4dEFyZWFcIixcbiAgfSxcbn0sIHtcbiAgXCJpbmZvXCI6IHtcbiAgICBcInR5cGVcIjogXCJEYXRlRmllbGRcIixcbiAgfSxcbn1dO1xuXG5jb25zdCBtb2NrQ3VycmVudFN0YXRlID0gW1wiYVwiLCBcImJcIl07XG5jb25zdCBtb2NrSGlzdG9yeSA9IFtdO1xuY29uc3QgbW9ja1N0YXRlID0ge1xuICBmaWVsZFR5cGVzOiB0eXBlc0FycmF5LFxuICBmaWVsZHNTdGF0ZTogbW9ja0N1cnJlbnRTdGF0ZSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBtb2NrSGlzdG9yeSxcbn07XG5cbmNvbnN0IG5ld1ZhbGlkU3RhdGUgPSBbe1xuICBcInR5cGVcIjogXCJDaGVja2JveGVzXCIsXG4gIFwiZGlzcGxheU5hbWVcIjogXCJDaGVja2JveGVzXCIsXG4gIFwiZ3JvdXBcIjogXCJPcHRpb25zIENvbXBvbmVudHNcIixcbiAgXCJodG1sSW5wdXRUeXBlXCI6IFwiY2hlY2tib3hcIixcbiAgXCJ0aXRsZVwiOiBcIkFkZCBhIHRpdGxlXCIsXG4gIFwib3B0aW9uc1wiOiBbe1xuICAgIFwiY2FwdGlvblwiOiBcIkluc2VydCBhbiBvcHRpb25cIixcbiAgfV0sXG4gIFwibmV3T3B0aW9uQ2FwdGlvblwiOiBcIlwiLFxufV07XG5cbmNvbnN0IG5ld0ludmFsaWRTdGF0ZSA9IFt7XG4gIFwidHlwZVwiOiBcIkludmFsaWQgdHlwZVwiLFxuICBcImRpc3BsYXlOYW1lXCI6IFwiQ2hlY2tib3hlc1wiLFxuICBcImdyb3VwXCI6IFwiT3B0aW9ucyBDb21wb25lbnRzXCIsXG4gIFwiaHRtbElucHV0VHlwZVwiOiBcImNoZWNrYm94XCIsXG4gIFwidGl0bGVcIjogXCJBZGQgYSB0aXRsZVwiLFxuICBcIm9wdGlvbnNcIjogW3tcbiAgICBcImNhcHRpb25cIjogXCJJbnNlcnQgYW4gb3B0aW9uXCIsXG4gIH1dLFxuICBcIm5ld09wdGlvbkNhcHRpb25cIjogXCJcIixcbn1dO1xuXG5kZXNjcmliZShcIlVwZGF0ZS5pbXBvcnRTdGF0ZVwiLCAoKSA9PiB7XG4gIGl0KFwiUmV0dXJucyBhbiB1bmNoYW5nZWQgYXJyYXkgaWYgdGhlIG5ldyBzdGF0ZSBpcyBpbnZhbGlkXCIsICgpID0+IHtcbiAgICBleHBlY3QodXBkYXRlKG1vY2tTdGF0ZSwgaW1wb3J0U3RhdGUoe30pKSkudG9FcXVhbChtb2NrU3RhdGUpO1xuICAgIGV4cGVjdCh1cGRhdGUobW9ja1N0YXRlLCBpbXBvcnRTdGF0ZShudWxsKSkpLnRvRXF1YWwobW9ja1N0YXRlKTtcbiAgfSk7XG5cbiAgaXQoXCJSZXR1cm5zIGFuIHVuY2hhbmdlZCBhcnJheSBpZiB0aGUgYSBmaWVsZCdzIHR5cGUgaXMgbm90IGluIGZpZWxkVHlwZXNcIiwgKCkgPT4ge1xuICAgIGV4cGVjdCh1cGRhdGUobW9ja1N0YXRlLCBpbXBvcnRTdGF0ZShuZXdJbnZhbGlkU3RhdGUpKSkudG9FcXVhbChtb2NrU3RhdGUpO1xuICB9KTtcblxuICBpdChcIlNlbmRzIHRoZSBsYXN0IGN1cnJlbnQgc3RhdGUgdG8gdGhlIGhpc3RvcnlcIiwgKCkgPT4ge1xuICAgIGNvbnN0IHVwZGF0ZWQgPSB1cGRhdGUobW9ja1N0YXRlLCBpbXBvcnRTdGF0ZShuZXdWYWxpZFN0YXRlKSk7XG4gICAgZXhwZWN0KHVwZGF0ZWQuZmllbGRzU3RhdGVIaXN0b3J5WzBdLnRvU3RyaW5nKCkpLnRvRXF1YWwobW9ja0N1cnJlbnRTdGF0ZS50b1N0cmluZygpKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKG1vY2tIaXN0b3J5Lmxlbmd0aCArIDEpO1xuICB9KTtcblxuICBpdChcIlNldHMgdGhlIG5ldyBzdGF0ZSBhcyBjdXJyZW50XCIsICgpID0+IHtcbiAgICBjb25zdCB1cGRhdGVkID0gdXBkYXRlKG1vY2tTdGF0ZSwgaW1wb3J0U3RhdGUobmV3VmFsaWRTdGF0ZSkpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLnR5cGUpLnRvRXF1YWwobmV3VmFsaWRTdGF0ZVswXS50eXBlKTtcbiAgICBleHBlY3QodXBkYXRlZC5maWVsZHNTdGF0ZVswXS50eXBlKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmRpc3BsYXlOYW1lKS50b0VxdWFsKG5ld1ZhbGlkU3RhdGVbMF0uZGlzcGxheU5hbWUpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmRpc3BsYXlOYW1lKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmdyb3VwKS50b0VxdWFsKG5ld1ZhbGlkU3RhdGVbMF0uZ3JvdXApO1xuICAgIGV4cGVjdCh1cGRhdGVkLmZpZWxkc1N0YXRlWzBdLmdyb3VwKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICB9KTtcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5pbXBvcnQgeyBjcmVhdGVGaWVsZCB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuY29uc3QgcHJvbWlzZVR5cGVJbnN0YW5jZSA9IHsgdHlwZTogXCJwcm9taXNlLWluc3RhbmNlXCIgfTtcbmNvbnN0IHByb21pc2VUeXBlID0ge1xuICBpbmZvOiB7IHR5cGU6IFwiUHJvbWlzZVR5cGVcIiB9LFxuICBpbml0aWFsU3RhdGU6ICgpID0+IFByb21pc2UucmVzb2x2ZShwcm9taXNlVHlwZUluc3RhbmNlKSxcbn07XG5cbmNvbnN0IHN5bmNUeXBlSW5zdGFuY2UgPSB7IHR5cGU6IFwic3luYy1pbnN0YW5jZVwiIH07XG5jb25zdCBzeW5jVHlwZSA9IHtcbiAgaW5mbzogeyB0eXBlOiBcIlN5bmNUeXBlXCIgfSxcbiAgaW5pdGlhbFN0YXRlOiAoKSA9PiBzeW5jVHlwZUluc3RhbmNlLFxufTtcblxuY29uc3QgdHlwZXNBcnJheSA9IFtwcm9taXNlVHlwZSwgc3luY1R5cGVdO1xuY29uc3QgbW9ja0N1cnJlbnRTdGF0ZSA9IFtcImFcIiwgXCJiXCJdO1xuY29uc3QgbW9ja0hpc3RvcnkgPSBbXTtcbmNvbnN0IG1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogdHlwZXNBcnJheSxcbiAgZmllbGRzU3RhdGU6IG1vY2tDdXJyZW50U3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbW9ja0hpc3RvcnksXG59O1xuXG5kZXNjcmliZShcIlVwZGF0ZS5jcmVhdGVGaWVsZFwiLCAoKSA9PiB7XG4gIGl0KFwiY3JlYXRlcyBmaWVsZHMgYXN5bmNocm9ub3VzbHlcIiwgZG9uZSA9PiB7XG4gICAgY29uc3QgYXN5bmNEaXNwYXRjaCA9IHYgPT4ge1xuICAgICAgZXhwZWN0KHYpLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFzeW5jQWNpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBhc3luY0Rpc3BhdGNoIH0sXG4gICAgICBjcmVhdGVGaWVsZChzeW5jVHlwZS5pbmZvLnR5cGUpXG4gICAgKTtcblxuICAgIHVwZGF0ZShtb2NrU3RhdGUsIGFzeW5jQWNpb24pO1xuICB9KTtcblxuICBpdChcInJldHVybnMgYSAnZmllbGRDcmVhdGVkJyBhY3Rpb24gd2hlbiBmaWVsZCBpcyBjcmVhdGVkXCIsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGFzeW5jRGlzcGF0Y2ggPSBhY3Rpb24gPT4ge1xuICAgICAgZXhwZWN0KGFjdGlvbi50eXBlKS50b0VxdWFsKFwiZmllbGRDcmVhdGVkXCIpO1xuICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBhc3luY0FjaW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgYXN5bmNEaXNwYXRjaCB9LFxuICAgICAgY3JlYXRlRmllbGQoc3luY1R5cGUuaW5mby50eXBlKVxuICAgICk7XG5cbiAgICB1cGRhdGUobW9ja1N0YXRlLCBhc3luY0FjaW9uKTtcbiAgfSk7XG5cbiAgaXQoXCJjcmVhdGVzIHR5cGVzIHdpdGggY29uc3RydWN0b3JzIHRoYXQgcmV0dXJuIGEgcGxhaW4gb2JqZWN0XCIsIGRvbmUgPT4ge1xuICAgIGNvbnN0IGFzeW5jRGlzcGF0Y2ggPSBhY3Rpb24gPT4ge1xuICAgICAgZXhwZWN0KGFjdGlvbi5jcmVhdGVkRmllbGRTdGF0ZSkubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgICAgIGV4cGVjdChhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUudHlwZSkudG9FcXVhbChzeW5jVHlwZUluc3RhbmNlLnR5cGUpO1xuICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBhc3luY0FjaW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHsgYXN5bmNEaXNwYXRjaCB9LFxuICAgICAgY3JlYXRlRmllbGQoc3luY1R5cGUuaW5mby50eXBlKVxuICAgICk7XG5cbiAgICB1cGRhdGUobW9ja1N0YXRlLCBhc3luY0FjaW9uKTtcbiAgfSk7XG5cbiAgaXQoXCJjcmVhdGVzIHR5cGVzIHdpdGggY29uc3RydWN0b3JzIHRoYXQgcmV0dXJuIGEgcHJvbWlzZVwiLCBkb25lID0+IHtcbiAgICBjb25zdCBhc3luY0Rpc3BhdGNoID0gYWN0aW9uID0+IHtcbiAgICAgIGV4cGVjdChhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUpLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICBleHBlY3QoYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlLnR5cGUpLnRvRXF1YWwocHJvbWlzZVR5cGVJbnN0YW5jZS50eXBlKTtcbiAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgYXN5bmNBY2lvbiA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7IGFzeW5jRGlzcGF0Y2ggfSxcbiAgICAgIGNyZWF0ZUZpZWxkKHByb21pc2VUeXBlLmluZm8udHlwZSlcbiAgICApO1xuXG4gICAgdXBkYXRlKG1vY2tTdGF0ZSwgYXN5bmNBY2lvbik7XG4gIH0pO1xuXG4gIGl0KFwiYWRkcyByZXF1aXJlZCBmaWVsZHMgdG8gaW5zdGFuY2VcIiwgZG9uZSA9PiB7XG4gICAgY29uc3QgYXN5bmNEaXNwYXRjaCA9IGFjdGlvbiA9PiB7XG4gICAgICBleHBlY3QoYWN0aW9uLmNyZWF0ZWRGaWVsZFN0YXRlLmlkKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgICAgZXhwZWN0KHR5cGVvZiBhY3Rpb24uY3JlYXRlZEZpZWxkU3RhdGUuY29uZmlnU2hvd2luZykudG9FcXVhbChcImJvb2xlYW5cIik7XG4gICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFzeW5jQWNpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBhc3luY0Rpc3BhdGNoIH0sXG4gICAgICBjcmVhdGVGaWVsZChwcm9taXNlVHlwZS5pbmZvLnR5cGUpXG4gICAgKTtcblxuICAgIHVwZGF0ZShtb2NrU3RhdGUsIGFzeW5jQWNpb24pO1xuICB9KTtcblxuICBpdChcImRvZXMgbm90IGNyZWF0ZSBhIGZpZWxkIGlmIHR5cGUgaXMgbm90IGluIG1vZGVsLmZpZWxkVHlwZXNcIiwgZG9uZSA9PiB7XG4gICAgY29uc3QgYXN5bmNEaXNwYXRjaCA9IGphc21pbmUuY3JlYXRlU3B5KFwiYXN5bmNEaXNwYXRjaFwiKTtcblxuICAgIGNvbnN0IGFzeW5jQWNpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgeyBhc3luY0Rpc3BhdGNoIH0sXG4gICAgICBjcmVhdGVGaWVsZChcIm5vbi1leGlzdGluZy10eXBlXCIpXG4gICAgKTtcblxuICAgIHVwZGF0ZShtb2NrU3RhdGUsIGFzeW5jQWNpb24pO1xuXG4gICAgc2V0VGltZW91dChcbiAgICAgICgpID0+IHsgZXhwZWN0KGFzeW5jRGlzcGF0Y2gpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKCk7IGRvbmUoKTsgfSxcbiAgICAgIDUwXG4gICAgKTtcbiAgfSk7XG59KTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuaW1wb3J0IHsgZmllbGRDcmVhdGVkIH0gZnJvbSBcIi4uLy4uL2pzL0FjdGlvbnNcIjtcbmltcG9ydCB1cGRhdGUgZnJvbSBcIi4uLy4uL2pzL1VwZGF0ZVwiO1xuXG5jb25zdCBjcmVhdGVkRmllbGRTdGF0ZSA9IHsgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIgfTtcbmNvbnN0IG1vY2tDdXJyZW50U3RhdGUgPSBbXCJhXCIsIFwiYlwiXTtcbmNvbnN0IG1vY2tIaXN0b3J5ID0gW107XG5jb25zdCBtb2NrU3RhdGUgPSB7XG4gIGZpZWxkVHlwZXM6IFt7IGluZm86IHsgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIgfSB9XSxcbiAgZmllbGRzU3RhdGU6IG1vY2tDdXJyZW50U3RhdGUsXG4gIGZpZWxkc1N0YXRlSGlzdG9yeTogbW9ja0hpc3RvcnksXG59O1xuXG5jb25zdCBmaWVsZENyZWF0ZWRBY3Rpb24gPSBmaWVsZENyZWF0ZWQoY3JlYXRlZEZpZWxkU3RhdGUpO1xuY29uc3QgbmV3U3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCBmaWVsZENyZWF0ZWRBY3Rpb24pO1xuXG5kZXNjcmliZShcIlVwZGF0ZS5maWVsZENyZWF0ZWRcIiwgKCkgPT4ge1xuICBpdChcIm91dHB1dHMgYSBzdGF0ZSB3aXRoIHRoZSBuZXcgZmllbGQgaW5jbHVkZWRcIiwgKCkgPT4ge1xuICAgIGV4cGVjdChuZXdTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCArIDEpO1xuICAgIGV4cGVjdChcbiAgICAgIG5ld1N0YXRlLmZpZWxkc1N0YXRlXG4gICAgICAuZmluZCh2ID0+IHYudHlwZSA9PT0gY3JlYXRlZEZpZWxkU3RhdGUudHlwZSlcbiAgICApLm5vdC50b0VxdWFsKHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGl0KFwic2VuZHMgdGhlIGN1cnJlbnQgc3RhdGUgdG8gaGlzdG9yeVwiLCAoKSA9PiB7XG4gICAgZXhwZWN0KG5ld1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeVswXVswXSkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlWzBdKTtcbiAgICBleHBlY3QobmV3U3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdWzFdKS50b0VxdWFsKG1vY2tDdXJyZW50U3RhdGVbMV0pO1xuICB9KTtcblxuICBpdChcIlJldHVybnMgdGhlIGN1cnJlbnQgc3RhdGUgaWYgbm8gbmV3IGZpZWxkIGlzIGdpdmVuIHRvIGl0XCIsICgpID0+IHtcbiAgICBjb25zdCBzYW1lU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCBmaWVsZENyZWF0ZWQobnVsbCkpO1xuICAgIGV4cGVjdChzYW1lU3RhdGUuZmllbGRUeXBlcy5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkVHlwZXMubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpO1xuICB9KTtcblxuICBpdChcImRvZXMgbm90IGJyZWFrIHRoZSBzdGF0ZSBhZnRlciBjcmVhdGluZyBvbmUgb2JqZWN0XCIsICgpID0+IHtcbiAgICBjb25zdCBjaGFuZ2VkMSA9IHVwZGF0ZShtb2NrU3RhdGUsIGZpZWxkQ3JlYXRlZChjcmVhdGVkRmllbGRTdGF0ZSkpO1xuICAgIGNvbnN0IGNoYW5nZWQyID0gdXBkYXRlKGNoYW5nZWQxLCBmaWVsZENyZWF0ZWQoY3JlYXRlZEZpZWxkU3RhdGUpKTtcbiAgICBjb25zdCBjaGFuZ2VkMyA9IHVwZGF0ZShjaGFuZ2VkMiwgZmllbGRDcmVhdGVkKGNyZWF0ZWRGaWVsZFN0YXRlKSk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkVHlwZXMubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZFR5cGVzLmxlbmd0aCk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlLmxlbmd0aCArIDMpO1xuICAgIGV4cGVjdChjaGFuZ2VkMy5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKDMpO1xuICB9KTtcbn0pO1xuIiwiLyogZXNsaW50LWVudiBqYXNtaW5lICovXG5cbmltcG9ydCB7IHRvZ2dsZUNvbmZpZyB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuXG5jb25zdCBmaWVsZFN0YXRlQ29uZmlnU2hvd2luZyA9IHtcbiAgaWQ6IDEyMyxcbiAgY29uZmlnU2hvd2luZzogdHJ1ZSxcbn07XG5cbmNvbnN0IGZpZWxkU3RhdGVDb25maWdOb3RTaG93aW5nID0ge1xuICBpZDogMzIxLFxuICBjb25maWdTaG93aW5nOiBmYWxzZSxcbn07XG5cbmNvbnN0IG1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW10sXG4gIGZpZWxkc1N0YXRlOiBbZmllbGRTdGF0ZUNvbmZpZ1Nob3dpbmcsIGZpZWxkU3RhdGVDb25maWdOb3RTaG93aW5nXSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBbXSxcbn07XG5cbmRlc2NyaWJlKFwiVXBkYXRlLnRvZ2dsZUNvbmZpZ1wiLCAoKSA9PiB7XG4gIGl0KFwidHVybnMgdGhlIGNvbmZpZyBvcHRpb24gdG8gZmFsc2Ugd2hlbiBuZWVkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB0b2dnbGVDb25maWcoZmllbGRTdGF0ZUNvbmZpZ1Nob3dpbmcpKTtcbiAgICBleHBlY3QoXG4gICAgICBtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlXG4gICAgICAuZmluZChmID0+IGYuaWQgPT09IGZpZWxkU3RhdGVDb25maWdTaG93aW5nLmlkKVxuICAgICAgLmNvbmZpZ1Nob3dpbmdcbiAgICApLnRvRXF1YWwoZmFsc2UpO1xuICB9KTtcblxuICBpdChcInR1cm5zIHRoZSBjb25maWcgb3B0aW9uIHRvIHRydWUgd2hlbiBuZWVkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB0b2dnbGVDb25maWcoZmllbGRTdGF0ZUNvbmZpZ05vdFNob3dpbmcpKTtcbiAgICBleHBlY3QoXG4gICAgICBtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlXG4gICAgICAuZmluZChmID0+IGYuaWQgPT09IGZpZWxkU3RhdGVDb25maWdTaG93aW5nLmlkKVxuICAgICAgLmNvbmZpZ1Nob3dpbmdcbiAgICApLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KFwiYWRkcyB0aGUgbGFzdCBzdGF0ZSB0byB0aGUgaGlzdG9yeVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIHRvZ2dsZUNvbmZpZyhmaWVsZFN0YXRlQ29uZmlnU2hvd2luZykpO1xuICAgIGV4cGVjdChtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdWzBdLmlkKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZVswXS5pZCk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdWzFdLmlkKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZVsxXS5pZCk7XG4gIH0pO1xufSk7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cblxuaW1wb3J0IHsgdG9nZ2xlUmVxdWlyZWQgfSBmcm9tIFwiLi4vLi4vanMvQWN0aW9uc1wiO1xuaW1wb3J0IHVwZGF0ZSBmcm9tIFwiLi4vLi4vanMvVXBkYXRlXCI7XG5cblxuY29uc3QgZmllbGRTdGF0ZUlzUmVxdWlyZWQgPSB7XG4gIGlkOiAxMjMsXG4gIHJlcXVpcmVkOiB0cnVlLFxufTtcblxuY29uc3QgZmllbGRTdGF0ZUlzTm90UmVxdWlyZWQgPSB7XG4gIGlkOiAzMjEsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbn07XG5cbmNvbnN0IG1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW10sXG4gIGZpZWxkc1N0YXRlOiBbZmllbGRTdGF0ZUlzUmVxdWlyZWQsIGZpZWxkU3RhdGVJc05vdFJlcXVpcmVkXSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBbXSxcbn07XG5cbmRlc2NyaWJlKFwiVXBkYXRlLnRvZ2dsZVJlcXVpcmVkXCIsICgpID0+IHtcbiAgaXQoXCJ0dXJucyB0aGUgcmVxdWlyZWQgb3B0aW9uIHRvIGZhbHNlIHdoZW4gbmVlZGVkXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2RpZmllZFN0YXRlID0gdXBkYXRlKG1vY2tTdGF0ZSwgdG9nZ2xlUmVxdWlyZWQoZmllbGRTdGF0ZUlzUmVxdWlyZWQpKTtcbiAgICBleHBlY3QoXG4gICAgICBtb2RpZmllZFN0YXRlLmZpZWxkc1N0YXRlXG4gICAgICAuZmluZChmID0+IGYuaWQgPT09IGZpZWxkU3RhdGVJc1JlcXVpcmVkLmlkKVxuICAgICAgLnJlcXVpcmVkXG4gICAgKS50b0VxdWFsKGZhbHNlKTtcbiAgfSk7XG5cbiAgaXQoXCJ0dXJucyB0aGUgcmVxdWlyZWQgb3B0aW9uIHRvIHRydWUgd2hlbiBuZWVkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGlmaWVkU3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCB0b2dnbGVSZXF1aXJlZChmaWVsZFN0YXRlSXNOb3RSZXF1aXJlZCkpO1xuICAgIGV4cGVjdChcbiAgICAgIG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGVcbiAgICAgIC5maW5kKGYgPT4gZi5pZCA9PT0gZmllbGRTdGF0ZUlzUmVxdWlyZWQuaWQpXG4gICAgICAucmVxdWlyZWRcbiAgICApLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KFwiYWRkcyB0aGUgbGFzdCBzdGF0ZSB0byB0aGUgaGlzdG9yeVwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kaWZpZWRTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIHRvZ2dsZVJlcXVpcmVkKGZpZWxkU3RhdGVJc1JlcXVpcmVkKSk7XG4gICAgZXhwZWN0KG1vZGlmaWVkU3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5Lmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICBleHBlY3QobW9kaWZpZWRTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnlbMF1bMF0uaWQpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlWzBdLmlkKTtcbiAgICBleHBlY3QobW9kaWZpZWRTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnlbMF1bMV0uaWQpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlWzFdLmlkKTtcbiAgfSk7XG59KTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuaW1wb3J0IHsgZGVsZXRlRmllbGQgfSBmcm9tIFwiLi4vLi4vanMvQWN0aW9uc1wiO1xuaW1wb3J0IHVwZGF0ZSBmcm9tIFwiLi4vLi4vanMvVXBkYXRlXCI7XG5cbmNvbnN0IHRvQmVEZWxldGVkRmllbGRTdGF0ZSA9IHsgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIsIGlkOiAwIH07XG5jb25zdCBtb2NrQ3VycmVudFN0YXRlID0gW3RvQmVEZWxldGVkRmllbGRTdGF0ZSwgeyBpZDogMSB9LCB7IGlkOiAyIH1dO1xuY29uc3QgbW9ja0hpc3RvcnkgPSBbXTtcbmNvbnN0IG1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW3sgaW5mbzogeyB0eXBlOiBcImZpY3RpdGlvdXMtaW5zdGFuY2VcIiB9IH1dLFxuICBmaWVsZHNTdGF0ZTogbW9ja0N1cnJlbnRTdGF0ZSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBtb2NrSGlzdG9yeSxcbn07XG5cbmNvbnN0IGZpZWxkRGVsZXRlQWN0aW9uID0gZGVsZXRlRmllbGQodG9CZURlbGV0ZWRGaWVsZFN0YXRlKTtcbmNvbnN0IG5ld1N0YXRlID0gdXBkYXRlKG1vY2tTdGF0ZSwgZmllbGREZWxldGVBY3Rpb24pO1xuXG5kZXNjcmliZShcIlVwZGF0ZS5kZWxldGVGaWVsZFwiLCAoKSA9PiB7XG4gIGl0KFwib3V0cHV0cyBhIHN0YXRlIHdpdGhvdXQgdGhlIGZpZWxkIGluY2x1ZGVkXCIsICgpID0+IHtcbiAgICBleHBlY3QobmV3U3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGggLSAxKTtcbiAgICBleHBlY3QoXG4gICAgICBuZXdTdGF0ZS5maWVsZHNTdGF0ZVxuICAgICAgLmZpbmQodiA9PiB2LmlkID09PSB0b0JlRGVsZXRlZEZpZWxkU3RhdGUuaWQpXG4gICAgKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gIH0pO1xuXG4gIGl0KFwic2VuZHMgdGhlIGN1cnJlbnQgc3RhdGUgdG8gaGlzdG9yeVwiLCAoKSA9PiB7XG4gICAgY29uc3QgcmVjZW50SGlzdG9yeVN0YXRlID0gbmV3U3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdO1xuICAgIGV4cGVjdChyZWNlbnRIaXN0b3J5U3RhdGUubGVuZ3RoKS50b0VxdWFsKG1vY2tDdXJyZW50U3RhdGUubGVuZ3RoKTtcbiAgICBleHBlY3QocmVjZW50SGlzdG9yeVN0YXRlWzBdLmlkKS50b0VxdWFsKG1vY2tDdXJyZW50U3RhdGVbMF0uaWQpO1xuICAgIGV4cGVjdChyZWNlbnRIaXN0b3J5U3RhdGVbMV0uaWQpLnRvRXF1YWwobW9ja0N1cnJlbnRTdGF0ZVsxXS5pZCk7XG4gIH0pO1xuXG4gIGl0KFwiUmV0dXJucyB0aGUgY3VycmVudCBzdGF0ZSBpZiBubyBuZXcgZmllbGQgaXMgZ2l2ZW4gdG8gaXRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IHNhbWVTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIGRlbGV0ZUZpZWxkKG51bGwpKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkVHlwZXMubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZFR5cGVzLmxlbmd0aCk7XG4gICAgZXhwZWN0KHNhbWVTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCk7XG4gICAgZXhwZWN0KHNhbWVTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnkubGVuZ3RoKTtcbiAgfSk7XG5cbiAgaXQoXCJkb2VzIG5vdCBicmVhayB0aGUgc3RhdGUgYWZ0ZXIgZGVsZXRpbmcgYSBmaWVsZFwiLCAoKSA9PiB7XG4gICAgY29uc3QgbW9ja0ZpZWxkMSA9IE9iamVjdC5hc3NpZ24oe30sIHRvQmVEZWxldGVkRmllbGRTdGF0ZSwgeyBpZDogNSB9KTtcbiAgICBjb25zdCBtb2NrRmllbGQyID0gT2JqZWN0LmFzc2lnbih7fSwgdG9CZURlbGV0ZWRGaWVsZFN0YXRlLCB7IGlkOiA2IH0pO1xuICAgIGNvbnN0IG1vY2tGaWVsZDMgPSBPYmplY3QuYXNzaWduKHt9LCB0b0JlRGVsZXRlZEZpZWxkU3RhdGUsIHsgaWQ6IDcgfSk7XG5cbiAgICBjb25zdCBtb2NrU3RhdGUyID0gT2JqZWN0LmFzc2lnbih7fSwgbW9ja1N0YXRlLCB7XG4gICAgICBmaWVsZHNTdGF0ZTogW1xuICAgICAgICBtb2NrRmllbGQxLFxuICAgICAgICBtb2NrRmllbGQyLFxuICAgICAgICBtb2NrRmllbGQzLFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBjb25zdCBjaGFuZ2VkMSA9IHVwZGF0ZShtb2NrU3RhdGUyLCBkZWxldGVGaWVsZChtb2NrRmllbGQxKSk7XG4gICAgY29uc3QgY2hhbmdlZDIgPSB1cGRhdGUoY2hhbmdlZDEsIGRlbGV0ZUZpZWxkKG1vY2tGaWVsZDIpKTtcbiAgICBjb25zdCBjaGFuZ2VkMyA9IHVwZGF0ZShjaGFuZ2VkMiwgZGVsZXRlRmllbGQobW9ja0ZpZWxkMykpO1xuICAgIGV4cGVjdChjaGFuZ2VkMy5maWVsZFR5cGVzLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUyLmZpZWxkVHlwZXMubGVuZ3RoKTtcbiAgICBleHBlY3QoY2hhbmdlZDMuZmllbGRzU3RhdGUubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZTIuZmllbGRzU3RhdGUubGVuZ3RoIC0gMyk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoMyk7XG4gIH0pO1xufSk7XG4iLCIvKiBlc2xpbnQtZW52IGphc21pbmUgKi9cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmltcG9ydCB7IHVwZGF0ZUZpZWxkIH0gZnJvbSBcIi4uLy4uL2pzL0FjdGlvbnNcIjtcbmltcG9ydCB1cGRhdGUgZnJvbSBcIi4uLy4uL2pzL1VwZGF0ZVwiO1xuXG5jb25zdCBvbGRGaWVsZFN0YXRlID0ge1xuICB0eXBlOiBcImZpY3RpdGlvdXMtaW5zdGFuY2VcIixcbiAgaWQ6IFwiMFwiLFxuICBjb25maWdTaG93aW5nOiBmYWxzZSxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICBjb2xvcjogXCJibHVlXCIsXG59O1xuY29uc3QgbmV3RmllbGRTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIG9sZEZpZWxkU3RhdGUsIHsgY29sb3I6IFwiZ3JlZW5cIiB9KTtcbmNvbnN0IG1vY2tDdXJyZW50U3RhdGUgPSBbb2xkRmllbGRTdGF0ZSwgeyBpZDogMSB9LCB7IGlkOiAyIH1dO1xuY29uc3QgbW9ja0hpc3RvcnkgPSBbXTtcbmNvbnN0IG1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW3sgaW5mbzogeyB0eXBlOiBcImZpY3RpdGlvdXMtaW5zdGFuY2VcIiB9IH1dLFxuICBmaWVsZHNTdGF0ZTogbW9ja0N1cnJlbnRTdGF0ZSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBtb2NrSGlzdG9yeSxcbn07XG5cbmNvbnN0IGZpZWxkVXBkYXRlQWN0aW9uID0gdXBkYXRlRmllbGQobmV3RmllbGRTdGF0ZSk7XG5jb25zdCBuZXdTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIGZpZWxkVXBkYXRlQWN0aW9uKTtcblxuZGVzY3JpYmUoXCJVcGRhdGUudXBkYXRlRmllbGRcIiwgKCkgPT4ge1xuICBpdChcIm91dHB1dHMgYSBzdGF0ZSB0aGUgZmllbGQgdXBkYXRlZFwiLCAoKSA9PiB7XG4gICAgZXhwZWN0KG5ld1N0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKTtcbiAgICBleHBlY3QoXG4gICAgICBuZXdTdGF0ZS5maWVsZHNTdGF0ZVxuICAgICAgLmZpbmQodiA9PiB2LmNvbG9yID09PSBuZXdGaWVsZFN0YXRlLmNvbG9yKVxuICAgICkubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgfSk7XG5cbiAgaXQoXCJvdXRwdXRzIGEgc3RhdGUgdGhlIHVwZGF0ZWQgZmllbGQgaW4gdGhlIGNvcnJlY3Qgb3JkZXJcIiwgKCkgPT4ge1xuICAgIGV4cGVjdChuZXdTdGF0ZS5maWVsZHNTdGF0ZVswXS5pZCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGVbMF0uaWQpO1xuICAgIGV4cGVjdChuZXdTdGF0ZS5maWVsZHNTdGF0ZVswXS5jb2xvcikudG9FcXVhbChuZXdGaWVsZFN0YXRlLmNvbG9yKTtcbiAgfSk7XG5cbiAgaXQoXCJzZW5kcyB0aGUgY3VycmVudCBzdGF0ZSB0byBoaXN0b3J5XCIsICgpID0+IHtcbiAgICBjb25zdCByZWNlbnRIaXN0b3J5U3RhdGUgPSBuZXdTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnlbMF07XG4gICAgZXhwZWN0KHJlY2VudEhpc3RvcnlTdGF0ZS5sZW5ndGgpLnRvRXF1YWwobW9ja0N1cnJlbnRTdGF0ZS5sZW5ndGgpO1xuICAgIGV4cGVjdChyZWNlbnRIaXN0b3J5U3RhdGVbMF0uaWQpLnRvRXF1YWwobW9ja0N1cnJlbnRTdGF0ZVswXS5pZCk7XG4gICAgZXhwZWN0KHJlY2VudEhpc3RvcnlTdGF0ZVswXS5jb2xvcikudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlWzBdLmNvbG9yKTtcbiAgfSk7XG5cbiAgaXQoXCJSZXR1cm5zIHRoZSBjdXJyZW50IHN0YXRlIGlmIGFuIGludmFsaWQgZmllbGQgc3RhdGUgaXMgZ2l2ZW4gdG8gaXRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGlzU2FtZSA9IChzdGF0ZTEsIHN0YXRlMikgPT4ge1xuICAgICAgZXhwZWN0KHN0YXRlMS5maWVsZFR5cGVzLmxlbmd0aCkudG9FcXVhbChzdGF0ZTIuZmllbGRUeXBlcy5sZW5ndGgpO1xuICAgICAgZXhwZWN0KHN0YXRlMS5maWVsZHNTdGF0ZS5sZW5ndGgpLnRvRXF1YWwoc3RhdGUyLmZpZWxkc1N0YXRlLmxlbmd0aCk7XG4gICAgICBleHBlY3Qoc3RhdGUxLmZpZWxkc1N0YXRlWzBdLmNvbG9yKS50b0VxdWFsKHN0YXRlMi5maWVsZHNTdGF0ZVswXS5jb2xvcik7XG4gICAgICBleHBlY3Qoc3RhdGUxLmZpZWxkc1N0YXRlWzBdLmlkKS50b0VxdWFsKHN0YXRlMi5maWVsZHNTdGF0ZVswXS5pZCk7XG4gICAgICBleHBlY3Qoc3RhdGUxLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoc3RhdGUyLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpO1xuICAgIH07XG5cbiAgICBjb25zdCBzYW1lU3RhdGUxID0gdXBkYXRlKG1vY2tTdGF0ZSwgdXBkYXRlRmllbGQobnVsbCkpO1xuICAgIGlzU2FtZShtb2NrU3RhdGUsIHNhbWVTdGF0ZTEpO1xuXG4gICAgY29uc3Qgc2FtZVN0YXRlMiA9IHVwZGF0ZShcbiAgICAgIG1vY2tTdGF0ZSxcbiAgICAgIHVwZGF0ZUZpZWxkKE9iamVjdC5hc3NpZ24oe30sIG5ld0ZpZWxkU3RhdGUsIHsgaWQ6IG51bGwgfSkpXG4gICAgKTtcbiAgICBpc1NhbWUobW9ja1N0YXRlLCBzYW1lU3RhdGUyKTtcblxuICAgIGNvbnN0IHNhbWVTdGF0ZTMgPSB1cGRhdGUoXG4gICAgICBtb2NrU3RhdGUsXG4gICAgICB1cGRhdGVGaWVsZChPYmplY3QuYXNzaWduKHt9LCBuZXdGaWVsZFN0YXRlLCB7IGNvbmZpZ1Nob3dpbmc6IG51bGwgfSkpXG4gICAgKTtcbiAgICBpc1NhbWUobW9ja1N0YXRlLCBzYW1lU3RhdGUzKTtcblxuICAgIGNvbnN0IHNhbWVTdGF0ZTQgPSB1cGRhdGUoXG4gICAgICBtb2NrU3RhdGUsXG4gICAgICB1cGRhdGVGaWVsZChPYmplY3QuYXNzaWduKHt9LCBuZXdGaWVsZFN0YXRlLCB7IHJlcXVpcmVkOiBudWxsIH0pKVxuICAgICk7XG5cbiAgICBpc1NhbWUobW9ja1N0YXRlLCBzYW1lU3RhdGU0KTtcbiAgfSk7XG5cbiAgaXQoXCJkb2VzIG5vdCBicmVhayB0aGUgc3RhdGUgYWZ0ZXIgdXBkYXRpbmcgYSBmaWVsZCBtdWx0aXBsZSB0aW1lcyBhIGZpZWxkXCIsICgpID0+IHtcbiAgICBjb25zdCBtb2NrRmllbGQxID0gT2JqZWN0LmFzc2lnbih7fSwgb2xkRmllbGRTdGF0ZSwgeyBjb2xvcjogXCJ5ZWxsb3dcIiB9KTtcbiAgICBjb25zdCBtb2NrRmllbGQyID0gT2JqZWN0LmFzc2lnbih7fSwgb2xkRmllbGRTdGF0ZSwgeyBjb2xvcjogXCJvcmFuZ2VcIiB9KTtcbiAgICBjb25zdCBtb2NrRmllbGQzID0gT2JqZWN0LmFzc2lnbih7fSwgb2xkRmllbGRTdGF0ZSwgeyBjb2xvcjogXCJwdXJwbGVcIiB9KTtcblxuICAgIGNvbnN0IGNoYW5nZWQxID0gdXBkYXRlKG1vY2tTdGF0ZSwgdXBkYXRlRmllbGQobW9ja0ZpZWxkMSkpO1xuICAgIGNvbnN0IGNoYW5nZWQyID0gdXBkYXRlKGNoYW5nZWQxLCB1cGRhdGVGaWVsZChtb2NrRmllbGQyKSk7XG4gICAgY29uc3QgY2hhbmdlZDMgPSB1cGRhdGUoY2hhbmdlZDIsIHVwZGF0ZUZpZWxkKG1vY2tGaWVsZDMpKTtcbiAgICBleHBlY3QoY2hhbmdlZDMuZmllbGRUeXBlcy5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkVHlwZXMubGVuZ3RoKTtcbiAgICBleHBlY3QoY2hhbmdlZDMuZmllbGRzU3RhdGUubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGgpO1xuICAgIGV4cGVjdChjaGFuZ2VkMy5maWVsZHNTdGF0ZVswXS5pZCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGVbMF0uaWQpO1xuICAgIGV4cGVjdChjaGFuZ2VkMy5maWVsZHNTdGF0ZVswXS5jb2xvcikudG9FcXVhbChtb2NrRmllbGQzLmNvbG9yKTtcbiAgICBleHBlY3QoY2hhbmdlZDMuZmllbGRzU3RhdGVIaXN0b3J5Lmxlbmd0aCkudG9FcXVhbCgzKTtcbiAgfSk7XG59KTtcbiIsIi8qIGVzbGludC1lbnYgamFzbWluZSAqL1xuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuaW1wb3J0IHsgcmVvcmRlckZpZWxkcyB9IGZyb20gXCIuLi8uLi9qcy9BY3Rpb25zXCI7XG5pbXBvcnQgdXBkYXRlIGZyb20gXCIuLi8uLi9qcy9VcGRhdGVcIjtcblxuY29uc3QgdGVtcGxhdGVGaWVsZCA9IHtcbiAgdHlwZTogXCJmaWN0aXRpb3VzLWluc3RhbmNlXCIsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgY29uZmlnU2hvd2luZzogZmFsc2UsXG4gIGlkOiBcIjBcIixcbn07XG5jb25zdCBmaWVsZDEgPSBPYmplY3QuYXNzaWduKHt9LCB0ZW1wbGF0ZUZpZWxkLCB7IGlkOiBcIjFcIiB9KTtcbmNvbnN0IGZpZWxkMiA9IE9iamVjdC5hc3NpZ24oe30sIHRlbXBsYXRlRmllbGQsIHsgaWQ6IFwiMlwiIH0pO1xuY29uc3QgZmllbGQzID0gT2JqZWN0LmFzc2lnbih7fSwgdGVtcGxhdGVGaWVsZCwgeyBpZDogXCIzXCIgfSk7XG5jb25zdCBtb2NrQ3VycmVudFN0YXRlID0gW2ZpZWxkMSwgZmllbGQyLCBmaWVsZDNdO1xuY29uc3QgbW9ja0hpc3RvcnkgPSBbXTtcbmNvbnN0IG1vY2tTdGF0ZSA9IHtcbiAgZmllbGRUeXBlczogW3sgaW5mbzogeyB0eXBlOiBcImZpY3RpdGlvdXMtaW5zdGFuY2VcIiB9IH1dLFxuICBmaWVsZHNTdGF0ZTogbW9ja0N1cnJlbnRTdGF0ZSxcbiAgZmllbGRzU3RhdGVIaXN0b3J5OiBtb2NrSGlzdG9yeSxcbn07XG5cbmNvbnN0IG5ld09yZGVyID0gW1wiMlwiLCBcIjNcIiwgXCIxXCJdO1xuY29uc3QgcmVvcmRlckZpZWxkc0FjdGlvbiA9IHJlb3JkZXJGaWVsZHMobmV3T3JkZXIpO1xuY29uc3QgbmV3U3RhdGUgPSB1cGRhdGUobW9ja1N0YXRlLCByZW9yZGVyRmllbGRzQWN0aW9uKTtcblxuZGVzY3JpYmUoXCJVcGRhdGUucmVvcmRlckZpZWxkc1wiLCAoKSA9PiB7XG4gIGl0KFwib3V0cHV0cyBhIHN0YXRlIHdpdGggZmllbGRzIGluIHRoZSBuZXcgb3JkZXJcIiwgKCkgPT4ge1xuICAgIGV4cGVjdChuZXdTdGF0ZS5maWVsZHNTdGF0ZS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCk7XG4gICAgZXhwZWN0KG5ld1N0YXRlLmZpZWxkc1N0YXRlWzBdLmlkKS50b0VxdWFsKG5ld09yZGVyWzBdKTtcbiAgICBleHBlY3QobmV3U3RhdGUuZmllbGRzU3RhdGVbMV0uaWQpLnRvRXF1YWwobmV3T3JkZXJbMV0pO1xuICAgIGV4cGVjdChuZXdTdGF0ZS5maWVsZHNTdGF0ZVsyXS5pZCkudG9FcXVhbChuZXdPcmRlclsyXSk7XG4gIH0pO1xuXG4gIGl0KFwic2VuZHMgdGhlIGN1cnJlbnQgc3RhdGUgdG8gaGlzdG9yeVwiLCAoKSA9PiB7XG4gICAgZXhwZWN0KG5ld1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeVswXVswXS5pZCkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlWzBdLmlkKTtcbiAgICBleHBlY3QobmV3U3RhdGUuZmllbGRzU3RhdGVIaXN0b3J5WzBdWzFdLmlkKS50b0VxdWFsKG1vY2tDdXJyZW50U3RhdGVbMV0uaWQpO1xuICAgIGV4cGVjdChuZXdTdGF0ZS5maWVsZHNTdGF0ZUhpc3RvcnlbMF1bMl0uaWQpLnRvRXF1YWwobW9ja0N1cnJlbnRTdGF0ZVsyXS5pZCk7XG4gIH0pO1xuXG4gIGl0KFwiUmV0dXJucyB0aGUgY3VycmVudCBzdGF0ZSBpZiBhbnkgZmllbGQgaWQgaXMgbWlzc2luZ1wiLCAoKSA9PiB7XG4gICAgY29uc3Qgc2FtZVN0YXRlID0gdXBkYXRlKG1vY2tTdGF0ZSwgcmVvcmRlckZpZWxkcyhbXCIxXCIsIFwiMlwiXSkpO1xuICAgIGV4cGVjdChzYW1lU3RhdGUuZmllbGRUeXBlcy5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkVHlwZXMubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlWzBdLmlkKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZVswXS5pZCk7XG4gICAgZXhwZWN0KHNhbWVTdGF0ZS5maWVsZHNTdGF0ZVsxXS5pZCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGVbMV0uaWQpO1xuICAgIGV4cGVjdChzYW1lU3RhdGUuZmllbGRzU3RhdGVbMl0uaWQpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlWzJdLmlkKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpO1xuICB9KTtcblxuICBpdChcIlJldHVybnMgdGhlIGN1cnJlbnQgc3RhdGUgaWYgdGhlIHJlb3JkZXIgYXJyYXkgaGFzIG1vcmUgZWxlbWVudHMgdGhhbiBpdCBzaG91bGRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IHNhbWVTdGF0ZSA9IHVwZGF0ZShtb2NrU3RhdGUsIHJlb3JkZXJGaWVsZHMoW1wiMVwiLCBcIjJcIiwgXCIzXCIsIFwiNFwiXSkpO1xuICAgIGV4cGVjdChzYW1lU3RhdGUuZmllbGRUeXBlcy5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkVHlwZXMubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlWzBdLmlkKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZHNTdGF0ZVswXS5pZCk7XG4gICAgZXhwZWN0KHNhbWVTdGF0ZS5maWVsZHNTdGF0ZVsxXS5pZCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGVbMV0uaWQpO1xuICAgIGV4cGVjdChzYW1lU3RhdGUuZmllbGRzU3RhdGVbMl0uaWQpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlWzJdLmlkKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrU3RhdGUuZmllbGRzU3RhdGUubGVuZ3RoKTtcbiAgICBleHBlY3Qoc2FtZVN0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwobW9ja1N0YXRlLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpO1xuICB9KTtcblxuICBpdChcImRvZXMgbm90IGJyZWFrIHRoZSBzdGF0ZSBhZnRlciBjcmVhdGluZyBvbmUgb2JqZWN0XCIsICgpID0+IHtcbiAgICBjb25zdCBjaGFuZ2VkMSA9IHVwZGF0ZShtb2NrU3RhdGUsIHJlb3JkZXJGaWVsZHMoW1wiMVwiLCBcIjJcIiwgXCIzXCJdKSk7XG4gICAgY29uc3QgY2hhbmdlZDIgPSB1cGRhdGUoY2hhbmdlZDEsIHJlb3JkZXJGaWVsZHMoW1wiM1wiLCBcIjFcIiwgXCIyXCJdKSk7XG4gICAgY29uc3QgY2hhbmdlZDMgPSB1cGRhdGUoY2hhbmdlZDIsIHJlb3JkZXJGaWVsZHMoW1wiM1wiLCBcIjJcIiwgXCIxXCJdKSk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkVHlwZXMubGVuZ3RoKS50b0VxdWFsKG1vY2tTdGF0ZS5maWVsZFR5cGVzLmxlbmd0aCk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkc1N0YXRlLmxlbmd0aCkudG9FcXVhbChtb2NrQ3VycmVudFN0YXRlLmxlbmd0aCk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkc1N0YXRlSGlzdG9yeS5sZW5ndGgpLnRvRXF1YWwoMyk7XG4gICAgZXhwZWN0KGNoYW5nZWQzLmZpZWxkc1N0YXRlWzBdLmlkKS50b0VxdWFsKFwiM1wiKTtcbiAgICBleHBlY3QoY2hhbmdlZDMuZmllbGRzU3RhdGVbMV0uaWQpLnRvRXF1YWwoXCIyXCIpO1xuICAgIGV4cGVjdChjaGFuZ2VkMy5maWVsZHNTdGF0ZVsyXS5pZCkudG9FcXVhbChcIjFcIik7XG4gIH0pO1xufSk7XG4iXSwibmFtZXMiOlsidW5kbyIsIl8iLCJpbXBvcnRTdGF0ZSIsIm5ld0ZpZWxkc1N0YXRlIiwiY3JlYXRlRmllbGQiLCJmaWVsZFR5cGUiLCJmaWVsZENyZWF0ZWQiLCJjcmVhdGVkRmllbGRTdGF0ZSIsInRvZ2dsZUNvbmZpZyIsImZpZWxkU3RhdGUiLCJ0b2dnbGVSZXF1aXJlZCIsImRlbGV0ZUZpZWxkIiwidXBkYXRlRmllbGQiLCJuZXdGaWVsZFN0YXRlIiwicmVvcmRlckZpZWxkcyIsIm5ld0ZpZWxkc09yZGVyIiwiZGVzY3JpYmUiLCJhY3Rpb24iLCJ0eXBlIiwidG9FcXVhbCIsIm1vY2tTdGF0ZVRvSW1wb3J0IiwiZ2xvYmFsIiwiYXN5bmNEaXNwYXRjaE1pZGRsZXdhcmUiLCJzdG9yZSIsIm5leHQiLCJzeW5jQWN0aXZpdHlGaW5pc2hlZCIsImFjdGlvblF1ZXVlIiwiZmx1c2hRdWV1ZSIsImZvckVhY2giLCJhIiwiZGlzcGF0Y2giLCJhc3luY0Rpc3BhdGNoIiwiYXN5bmNBY3Rpb24iLCJjb25jYXQiLCJhY3Rpb25XaXRoQXN5bmNEaXNwYXRjaCIsIkltbXV0YWJsZSIsIm1lcmdlIiwiZmFrZUFjdGlvbiIsImRvbmUiLCJyZXR1cm5lZEFjdGlvbiIsIm5vdCIsInVuZGVmaW5lZCIsImZha2VBc3luY0FjdGlvbiIsImZha2VTdG9yZSIsIl9pc0FycmF5IiwiX3NsaWNlIiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDAiLCJfY2hlY2tGb3JNZXRob2QiLCJfaXNQbGFjZWhvbGRlciIsIl9jdXJyeTEiLCJfY3VycnkyIiwicmVxdWlyZSQkMiIsIl9jdXJyeTMiLCJhbHdheXMiLCJvdmVyIiwiX2FyaXR5IiwiX3BpcGUiLCJfeHdyYXAiLCJiaW5kIiwiX2lzU3RyaW5nIiwiaXNBcnJheUxpa2UiLCJfcmVkdWNlIiwic2xpY2UiLCJyZXF1aXJlJCQzIiwiX2NvbmNhdCIsInByb3AiLCJfaXNUcmFuc2Zvcm1lciIsIl9kaXNwYXRjaGFibGUiLCJfbWFwIiwiX3htYXAiLCJfY3VycnlOIiwiY3VycnlOIiwiX2hhcyIsIl9pc0FyZ3VtZW50cyIsImtleXMiLCJyZXF1aXJlJCQ2IiwicmVxdWlyZSQkNSIsInJlcXVpcmUkJDQiLCJtYXAiLCJsZW5zIiwiY3VycnkiLCJFaXRoZXIiLCJ1cGRhdGVBdCIsIl9kZWZhdWx0Iiwia2V5QXJyYXkiLCJuZXdWYWwiLCJvYmoiLCJkZWVwTmV3VmFsIiwicmVkdWNlUmlnaHQiLCJyZXN1bHQiLCJrZXkiLCJkZWVwIiwiU3RhdGVMZW5zZXMiLCJfZGVmYXVsdDIiLCJfZGVmYXVsdDMiLCJjcmVhdGVJZCIsIkRhdGUiLCJub3ciLCJ0b1N0cmluZyIsInB1c2hIaXN0b3J5U3RhdGUiLCJzdGF0ZSIsIm5ld0hpc3RvcnlTdGF0ZSIsIl9kZWZhdWx0NCIsIl9kZWZhdWx0NSIsImZpZWxkc1N0YXRlSGlzdG9yeSIsIl9kZWZhdWx0NiIsImZpZWxkc1N0YXRlIiwiX2RlZmF1bHQ3IiwiaGlkZUNvbmZpZ3MiLCJzIiwiT2JqZWN0IiwiYXNzaWduIiwiY29uZmlnU2hvd2luZyIsInByb3BlcnR5VHlwZUNoZWNrIiwicHJvcGVydHlOYW1lIiwiUmlnaHQiLCJMZWZ0IiwidmFsaWRhdGVGaWVsZCIsImZyb21OdWxsYWJsZSIsImxlZnRNYXAiLCJmcyIsImNoYWluIiwibGFzdEhpc3RvcnlTdGF0ZSIsIkluZmluaXR5IiwiX2lkZW50aXR5IiwiYXAiLCJwcmVwZW5kIiwic2VxdWVuY2UiLCJfYXJyYXlGcm9tSXRlcmF0b3IiLCJfZnVuY3Rpb25OYW1lIiwiaWRlbnRpY2FsIiwiX2VxdWFscyIsImlzQXJyYXkiLCJhcnIiLCJBcnJheSIsImZpZWxkVHlwZUlzVmFsaWQiLCJ2YWxpZFR5cGVzIiwiZmllbGQiLCJmaW5kIiwidmFsaWRGaWVsZFR5cGVzIiwib2YiLCJ2YWxpZGF0ZUZpZWxkc1N0YXRlIiwiZmllbGRUeXBlcyIsImFkZFJlcXVpcmVkUHJvcGVydGllcyIsImZpZWxkU3RhdGVzIiwiYmltYXAiLCJjb25zb2xlIiwiZXJyb3IiLCJnZXRPckVsc2UiLCJfcmVkdWNlZCIsIl94ZkJhc2UiLCJfeGZpbmQiLCJUYXNrIiwidHlwZUNvbnN0cnVjdG9yIiwidiIsImluZm8iLCJjb25zdHIiLCJyZWplY3QiLCJyZXNvbHZlIiwiY2FsbGVkIiwiaW5pdGlhbFN0YXRlIiwiUHJvbWlzZSIsInRoZW4iLCJjYXRjaCIsImluc2VydFJlcXVpcmVkUHJvcHMiLCJjcmVhdGVGaWVsZEFzeW5jaHJvbm91c2x5IiwicmVqZWN0ZWQiLCJmb3JrIiwiZXJyIiwiTWF5YmUiLCJjbG9uZSIsInVuaW1wbGVtZW50ZWQiLCJub29wIiwiaGlzdG9yeVN0YXRlV2l0aE5ld0ZpZWxkIiwibmV3RmllbGQiLCJzZXQiLCJyZXBsYWNlRmllbGRTdGF0ZSIsImFGaWVsZCIsImlkIiwicmVxdWlyZWQiLCJfZmlsdGVyIiwiX2lzT2JqZWN0IiwiX3hmaWx0ZXIiLCJoaXN0b3J5U3RhdGVXaXRob3V0RmllbGQiLCJ1cGRhdGVGaWVsZFN0YXRlIiwiaGlzdG9yeVN0YXRlV2l0aE5ld09yZGVyIiwibmV3T3JkZXIiLCJmMSIsImYyIiwiaW5kZXhPZiIsIm8iLCJsZW5ndGgiLCJzdGF0ZUlkcyIsIm5vTWlzc2luZ0lkIiwicmVkdWNlIiwiYWNjIiwiZklkIiwiaW5jbHVkZXMiLCJhY3Rpb25IYW5kbGVycyIsImlzRXhwZWN0ZWRBY3Rpb24iLCJpc1JlZHV4QWN0aW9uIiwidXBkYXRlIiwiYXNzZXJ0IiwiY3VycmVudEZpZWxkc1N0YXRlIiwib2xkRmllbGRzU3RhdGUiLCJtb2NrU3RhdGUiLCJlbXB0eU1vY2tTdGF0ZSIsImVtcHR5SGlzdG9yeU1vY2tTdGF0ZSIsIm1vZGlmaWVkU3RhdGUiLCJ1bmRvQWN0aW9uIiwidHlwZXNBcnJheSIsIm1vY2tDdXJyZW50U3RhdGUiLCJtb2NrSGlzdG9yeSIsIm5ld1ZhbGlkU3RhdGUiLCJuZXdJbnZhbGlkU3RhdGUiLCJ1cGRhdGVkIiwiZGlzcGxheU5hbWUiLCJncm91cCIsInByb21pc2VUeXBlSW5zdGFuY2UiLCJwcm9taXNlVHlwZSIsInN5bmNUeXBlSW5zdGFuY2UiLCJzeW5jVHlwZSIsImFzeW5jQWNpb24iLCJqYXNtaW5lIiwiY3JlYXRlU3B5IiwidG9IYXZlQmVlbkNhbGxlZCIsImZpZWxkQ3JlYXRlZEFjdGlvbiIsIm5ld1N0YXRlIiwic2FtZVN0YXRlIiwiY2hhbmdlZDEiLCJjaGFuZ2VkMiIsImNoYW5nZWQzIiwiZmllbGRTdGF0ZUNvbmZpZ1Nob3dpbmciLCJmaWVsZFN0YXRlQ29uZmlnTm90U2hvd2luZyIsImYiLCJmaWVsZFN0YXRlSXNSZXF1aXJlZCIsImZpZWxkU3RhdGVJc05vdFJlcXVpcmVkIiwidG9CZURlbGV0ZWRGaWVsZFN0YXRlIiwiZmllbGREZWxldGVBY3Rpb24iLCJyZWNlbnRIaXN0b3J5U3RhdGUiLCJtb2NrRmllbGQxIiwibW9ja0ZpZWxkMiIsIm1vY2tGaWVsZDMiLCJtb2NrU3RhdGUyIiwib2xkRmllbGRTdGF0ZSIsImNvbG9yIiwiZmllbGRVcGRhdGVBY3Rpb24iLCJpc1NhbWUiLCJzdGF0ZTEiLCJzdGF0ZTIiLCJzYW1lU3RhdGUxIiwic2FtZVN0YXRlMiIsInNhbWVTdGF0ZTMiLCJzYW1lU3RhdGU0IiwidGVtcGxhdGVGaWVsZCIsImZpZWxkMSIsImZpZWxkMiIsImZpZWxkMyIsInJlb3JkZXJGaWVsZHNBY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBSUEsQUFBTyxNQUFNQSxPQUFPQyxNQUNuQjtRQUNPO0NBRlksQ0FBYjs7QUFLUCxBQUFPLE1BQU1DLGNBQWNDLG1CQUMxQjtRQUNPLGFBRFA7O0NBRDBCLENBQXBCOztBQU1QLEFBQU8sTUFBTUMsY0FBY0MsY0FDMUI7UUFDTyxhQURQOztDQUQwQixDQUFwQjs7QUFNUCxBQUFPLE1BQU1DLGVBQWVDLHNCQUMzQjtRQUNPLGNBRFA7O0NBRDJCLENBQXJCOztB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LEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMxRSxLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUUsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNsRixLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN0RixLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDMUYsS0FBSyxDQUFDLEVBQUUsT0FBTyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM5RixLQUFLLENBQUMsRUFBRSxPQUFPLFNBQVMsRUFB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