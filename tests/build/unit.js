var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
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

babelHelpers.get = function get(object, property, receiver) {
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

babelHelpers.inherits = function (subClass, superClass) {
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

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers.toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

babelHelpers;

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
 * This class creates elements with an html counterpart.
 * HTML components are stored in this.html, and the main container
 * is this.html.container.
 * @abstract @class
 */

var ViewController = function () {
  function ViewController(modulePrefix) {
    babelHelpers.classCallCheck(this, ViewController);

    this.html = {};
    this.html.container = document.createElement('div');

    this.listeners = {};
    this.acceptEvents('destroy');

    this.modulePrefix = modulePrefix;
    this.cssPrefix = this.modulePrefix + '-' + this.constructor.name;
    this.html.container.classList.add(this.cssPrefix);
  }

  /**
   * Sets which events will be accepted.
   * @method acceptEvents
   * @param  {Array<String>} eventList
   * @return {void}
   */


  babelHelpers.createClass(ViewController, [{
    key: 'acceptEvents',
    value: function acceptEvents() {
      for (var _len = arguments.length, eventList = Array(_len), _key = 0; _key < _len; _key++) {
        eventList[_key] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = eventList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var eventName = _step.value;

          this.listeners[eventName] = new Set();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * @method on
     * @param  {function} fn
     * @param {String} event
     * @return {void}
     */

  }, {
    key: 'on',
    value: function on(event, fn) {
      assert(this.listeners[event], 'Trying to listen to invalid event: ' + event);
      this.listeners[event].add(fn);
    }

    /**
     * @method removeListener
     * @param  {String} event
     * @param  {Function} fn
     * @return {void}
     */

  }, {
    key: 'removeListener',
    value: function removeListener(event, fn) {
      assert(this.listeners[event], 'Trying to remove listener from invalid event: ' + event);
      this.listeners[event].delete(fn);
    }

    /**
     * @method trigger
     * @param  {String} event
     */

  }, {
    key: 'trigger',
    value: function trigger(event) {
      var _this = this;

      this.listeners[event].forEach(function (fn) {
        return fn(_this);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.trigger('destroy');
      this.html.container.remove();
      this.listeners = null;
      this.html = {};
    }
  }, {
    key: 'getHtmlContainer',
    value: function getHtmlContainer() {
      return this.html.container;
    }
  }]);
  return ViewController;
}();

function createSwitch(labelText, modulePrefix) {
  var cssPrefix = modulePrefix + '-ui-switch';

  var wrapper = document.createElement('label');
  wrapper.textContent = labelText;

  var switchElement = document.createElement('div');
  switchElement.classList.add(cssPrefix);

  var switchInput = document.createElement('input');
  switchInput.classList.add(cssPrefix + '-toggle');
  switchInput.classList.add(cssPrefix + '-toggle-round');
  switchInput.type = 'checkbox';
  switchInput.id = cssPrefix + '-' + Date.now();
  wrapper.input = switchInput;
  switchElement.appendChild(switchInput);

  var switchLabel = document.createElement('label');
  switchLabel.setAttribute('for', switchInput.id);
  switchElement.appendChild(switchLabel);

  wrapper.appendChild(switchElement);
  return wrapper;
}

/**
 * executes a callback when there is a click outside of a list of
 * elements
 * @method onClickOut
 * @param  {Array<HTMLElement>} elements
 * @param  {Function} callback
 * @return {Function} A function to cancel onClickOut
 */
function onClickOut(elements, callback) {
  var clickOutOfComponent = createClickOut(elements, callback);
  document.body.addEventListener('mousedown', clickOutOfComponent, true);

  return function cancelOnclickOut() {
    document.body.removeEventListener('mousedown', clickOutOfComponent, true);
  };
}

// Returns a function that will execute a callback if there is a click
// outside of the given element.
function createClickOut(elements, callback) {
  return function clickOutOfComponent(e) {
    if (clickIsWithinComponents(elements, e)) {
      return;
    }

    document.body.removeEventListener('mousedown', clickOutOfComponent, true);
    callback();
  };
}

function clickIsWithinComponents(elements, e) {
  var x = e.clientX;
  var y = e.clientY;
  var isInsideAnyElement = false;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var element = _step.value;

      var elementBox = element.getBoundingClientRect();
      var top = elementBox.top;
      var bottom = elementBox.bottom;
      var right = elementBox.right;
      var left = elementBox.left;

      // If point is outside of the component
      if (x > left && right > x && bottom > y && y > top) {
        isInsideAnyElement = true;
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return isInsideAnyElement;
}

function blinkRed(el, modulePrefix) {
  if (!el || !el.classList) {
    return;
  }

  var blickClass = modulePrefix + "-blink-red";
  el.classList.add(blickClass);
  setTimeout(function () {
    el.classList.remove(blickClass);
  }, 1500);
}

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
    if ((typeof el === 'undefined' ? 'undefined' : babelHelpers.typeof(el)) !== 'object') {
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

function fireEvent(targetElement, eventName, detailObj) {
  assert(typeof eventName === 'string', 'Invalid event name: ' + eventName);
  var targetIsHtmlNode = targetElement && targetElement.appendChild;
  assert(targetIsHtmlNode, 'Target element is not an HTML element: ' + eventName);

  var event = new CustomEvent(eventName, { detail: detailObj });
  targetElement.dispatchEvent(event);
}

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

var utils = {
  trackReorderDrag: trackReorderDrag,
  createSwitch: createSwitch,
  onClickOut: onClickOut,
  fireEvent: fireEvent,
  blinkRed: blinkRed,
  overshadow: overshadow
};

var cssPrefix = 'fl-fb-FormComponent';

// This will create the wrapper for the element to be shown in the
// form builder. It will take care of the show/hide config buttons
// as well as the delete and move buttons.
// It will take care of informing the component when any relevant action is
// performed, such as the required button being toggled on/off
// Use it as such
//
//  const shell = new ComponentShell()
//  shell.attachedComponent(comp);
//  shell.setContent(comp.importState(state));
//  shell.onDelete = myFunc;

var ComponentShell = function () {
  function ComponentShell() {
    var _this = this;

    babelHelpers.classCallCheck(this, ComponentShell);

    this.state = {
      html: buildHtml(),
      attachedComponent: null,
      onDelete: function onDelete() {
        return null;
      }
    };
    Object.preventExtensions(this);

    // Listen to UI events from root.
    var events = ['requiredSwitchChange', 'configHide', 'configShow', 'componentDeleted'];
    events.forEach(function (eName) {
      _this.state.html.root.addEventListener(eName, function (e) {
        return _this.trigger(eName, e);
      });
    });
  }

  babelHelpers.createClass(ComponentShell, [{
    key: 'trigger',
    value: function trigger(eventName, e) {
      // eslint-disable-line complexity
      if (!this.attachedComponent) {
        return;
      }
      switch (eventName) {
        case 'requiredSwitchChange':
          this.attachedComponent.setRequired(e.target.checked);
          break;
        case 'configHide':
          this.attachedComponent.onConfigClose();
          break;
        case 'configShow':
          this.attachedComponent.onConfigOpen();
          break;
        case 'componentDeleted':
          this.attachedComponent.onDelete();
          this.state.onDelete();
          break;
        default:
          assert(false, 'Unexpected event: ' + eventName);
      }
    }
  }, {
    key: 'attachComponent',
    value: function attachComponent(component) {
      assert(component, 'No component provided');
      this.state.attachedComponent = component;
      this.state.html.componentTypeField.innerHTML = component.getInfo().type;
    }
  }, {
    key: 'setContent',
    value: function setContent(_ref) {
      var main = _ref.main;
      var config = _ref.config;

      this.state.componentMain.innerHTMl = '';
      this.state.componentMain.appendChild(main);

      this.state.componentConfig.innerHTMl = '';
      this.state.componentConfig.appendChild(config);
    }
  }]);
  return ComponentShell;
}();

function buildHtml() {
  // We will put everything in these two keys
  var html = {
    componentMain: null,
    componentConfig: null,
    root: document.createElement('div'),
    componentTypeField: null
  };
  Object.preventExtensions(html);

  // -- Main content --
  html.componentMain = document.createElement('div');
  html.componentMain.classList.add(cssPrefix + '-content');
  html.root.appendChild(html.componentMain);

  // -- Configuration --
  var config = document.createElement('div');
  var configurationCssClass = cssPrefix + '-configuration';
  config.classList.add(configurationCssClass);
  html.root.appendChild(config);

  html.componentConfig = document.createElement('div');
  html.componentConfig.classList.add('${cssPrefix}-configuration-options');
  config.appendChild(configurationButtons);

  var configurationButtons = document.createElement('div');
  configurationButtons.classList.add(cssPrefix + '-configuration-buttons');
  config.appendChild(configurationButtons);

  var requiredSwitch = utils.createSwitch('Required', 'fl-fb');
  requiredSwitch.classList.add(configurationCssClass + '-switch-required');

  requiredSwitch.addEventListener('change', function (e) {
    utils.fireEvent(e.target, 'requiredSwitchChange');
  });

  configurationButtons.appendChild(requiredSwitch);

  html.componentTypeField = document.createElement('span');
  html.componentTypeField.classList.add(configurationCssClass + '-elementName');
  html.componentTypeField.innerHTML = 'Type not set';
  configurationButtons.appendChild(html.componentTypeField);

  var okBtn = document.createElement('button');
  okBtn.classList.add(configurationCssClass + '-btn-ok', 'btn', // Bootstrap
  'btn-sm', 'btn-default', 'glyphicon', // Font-awesome
  'glyphicon-ok');
  okBtn.type = 'button';
  okBtn.addEventListener('click', function () {
    showConfig(false, html);
    utils.fireEvent(okBtn, 'configHide');
  });
  configurationButtons.appendChild(okBtn);

  // -- Sidebar --
  var sidebar = document.createElement('div');
  var sidebarCssClass = cssPrefix + '-sidebar';
  sidebar.classList.add(sidebarCssClass);
  html.root.appendChild(sidebar);

  var deleteBtn = document.createElement('button');
  deleteBtn.classList.add('glyphicon', 'glyphicon-trash');
  deleteBtn.type = 'button';
  deleteBtn.addEventListener('click', function () {
    utils.fireEvent(deleteBtn, 'componentDeleted');
    html.root.remove();
  });
  addSidebarButton('delete', deleteBtn, sidebar);

  var showConfigBtn = document.createElement('button');
  showConfigBtn.type = 'button';
  showConfigBtn.classList.add('glyphicon', // Font-awesome
  'glyphicon-cog');
  showConfigBtn.title = 'Configure form group';
  this.addSidebarButton('config', showConfigBtn, sidebar);

  showConfigBtn.addEventListener('click', function () {
    showConfig(true, html);
    utils.fireEvent(okBtn, 'configHide');
  });

  return html;
}

/**
 * @method showConfig
 * @param  {Boolean} show
 * @return {void}
 */
function showConfig(show, shellHtml) {
  if (show) {
    // show
    shellHtml.main.classList.add(cssPrefix + '--configuration-visible');

    // hide on clickOut
    utils.onClickOut([shellHtml.main, shellHtml.config], function () {
      var ComponentWasNotDeleted = shellHtml.root.parentElement;
      if (ComponentWasNotDeleted) {
        showConfig(false, shellHtml);
      }
    });
  } else {
    // hide
    shellHtml.main.classList.remove(cssPrefix + '--configuration-visible');
  }
}

function addSidebarButton(elementName, button, sidebar) {
  var className = elementName ? this.cssPrefix + '-sidebar-btn-' + elementName : this.cssPrefix + '-sidebar-btn';
  button.classList.add(className);
  sidebar.insertBefore(button, sidebar.children[0]);
}

/**
 * @class ControlBar
 */

var ComponentsContainer = function (_ViewController) {
  babelHelpers.inherits(ComponentsContainer, _ViewController);

  function ComponentsContainer(modulePrefix) {
    babelHelpers.classCallCheck(this, ComponentsContainer);


    // This is kept in the order they appear on screen.

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ComponentsContainer).call(this, modulePrefix));

    _this.components = [];

    // Used with component.ondestroy;
    // This must be here and not together with other class methods because
    // of the binding of 'this'
    _this.componentDestroyListener = function (component) {
      _this.deleteComponent(component);
      _this.trigger('change');
    };

    _this.acceptEvents('change');
    Object.preventExtensions(_this);
    return _this;
  }

  /**
   * @method addComponent
   * @param  {FormComponent} component
   * @param  {Boolean} showConfig
   */


  babelHelpers.createClass(ComponentsContainer, [{
    key: 'addComponent',
    value: function addComponent(component) {
      var _this2 = this;

      var showConfig = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.components.push(component);
      var shell = new ComponentShell();
      shell.attachComponent(component);
      shell.setContent(component.importState({}));

      this.html.container.appendChild(component.getHtmlContainer());
      component.on('destroy', this.componentDestroyListener);

      this.addDragButtonToComponent(component);
      component.configToggle(showConfig);
      component.on('change', function () {
        return _this2.trigger('change');
      });
    }
  }, {
    key: 'addDragButtonToComponent',
    value: function addDragButtonToComponent(component) {
      var _this3 = this;

      var dragBtn = document.createElement('button');
      dragBtn.type = 'button';
      dragBtn.title = 'Drag to reorder';
      dragBtn.setAttribute('draggable', true);
      dragBtn.classList.add('glyphicon', // Font-awesome
      'glyphicon-menu-hamburger');

      var draggingClass = this.modulePrefix + '--dragging';
      dragBtn.addEventListener('dragstart', function (e) {
        e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
        if (_this3.components.length < 2) {
          return;
        }

        var container = component.getHtmlContainer();
        var containersArray = _this3.components.map(function (c) {
          return c.getHtmlContainer();
        });

        container.classList.add(draggingClass);

        // Take care of moving and reordering
        utils.trackReorderDrag(e, container, containersArray);
      });

      dragBtn.addEventListener('dragend', function () {
        var container = component.getHtmlContainer();
        setTimeout(function () {
          return container.classList.remove(draggingClass);
        }, 250);

        // Reorder components according to their position.
        var beforeReordering = JSON.stringify(_this3.components);
        _this3.components.sort(function (el1, el2) {
          return el1.getHtmlContainer().getBoundingClientRect().top > el2.getHtmlContainer().getBoundingClientRect().top;
        });

        // Trigger change if elements were reordered
        var afterReordering = JSON.stringify(_this3.components);
        if (beforeReordering !== afterReordering) {
          _this3.trigger('change');
        }
      });

      component.addSidebarButton(dragBtn);
    }
  }, {
    key: 'getAllComponents',
    value: function getAllComponents() {
      return Array.from(this.components);
    }
  }, {
    key: 'deleteComponent',
    value: function deleteComponent(component) {
      var componentIndex = this.components.indexOf(component);
      if (componentIndex === -1) {
        console.warn('Removing component not in container');
        return;
      }
      // Delete element from components array
      this.components.splice(componentIndex, 1);
      component.removeListener('destroy', this.componentDestroyListener);
      component.destroy();
    }
    /**
     * Deletes all components
     * @method deleteAllComponents
     * @return {void}
     */

  }, {
    key: 'deleteAllComponents',
    value: function deleteAllComponents() {
      // NOTE: we create a new array because deleteComponent modifies
      // 'this.components', so we would have problems as we are
      // iterating trough an array being modified.
      var components = Array.from(this.components);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var comp = _step.value;

          this.deleteComponent(comp);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Erases all components and inserts a new component group.
     * @method setComponents
     * @param  {Array<FormComponent>} components
     * @return {void}
     */

  }, {
    key: 'setComponents',
    value: function setComponents(components) {
      var _this4 = this;

      this.deleteAllComponents();
      components.forEach(function (comp) {
        return _this4.addComponent(comp, false);
      });
    }
  }]);
  return ComponentsContainer;
}(ViewController);

/**
 * @class ControlBar
 */

var ControlBar = function (_ViewController) {
  babelHelpers.inherits(ControlBar, _ViewController);

  function ControlBar(modulePrefix, moduleCoordinator) {
    babelHelpers.classCallCheck(this, ControlBar);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ControlBar).call(this, modulePrefix));

    _this.moduleCoordinator = moduleCoordinator;
    Object.preventExtensions(_this);
    _this.buildHtml();
    return _this;
  }

  babelHelpers.createClass(ControlBar, [{
    key: 'buildHtml',
    value: function buildHtml() {
      var _this2 = this;

      var componentGroups = {};
      var conponentsInfo = this.moduleCoordinator.getComponentsInfo();

      // Create component buttons
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = conponentsInfo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var info = _step.value;

          componentGroups[info.group] = componentGroups[info.group] || [];
          componentGroups[info.group].push(info);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var componentsBtnGroups = createButtonGroup();
      var buttonsClass = this.cssPrefix + '-button-component';
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(componentGroups)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var group = _step2.value;

          var dropdown = createDropdown(group, componentGroups[group], buttonsClass);
          componentsBtnGroups.appendChild(dropdown);
        }

        // Add listeners to all component creation buttons
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var buttons = Array.from(componentsBtnGroups.querySelectorAll('.' + buttonsClass));
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          _this2.moduleCoordinator.createComponent(btn.name);
        });
      });

      var actionsBtnGroup = createButtonGroup();
      // // Create Save button
      // const saveBtn = document.createElement('button');
      // saveBtn.className = `${this.cssPrefix}-button-save`;
      // saveBtn.classList.add(
      //   'btn', // Bootstrap
      //   'btn-primary'
      // );
      // saveBtn.textContent = 'Save';
      // saveBtn.addEventListener('click', () => this.moduleCoordinator.save());
      // actionsBtnGroup.appendChild(saveBtn);

      // Create Import button
      var undoBtn = document.createElement('button');
      undoBtn.className = this.cssPrefix + '-button-save';
      undoBtn.classList.add('btn', 'btn-primary'); // Bootstrap
      undoBtn.textContent = 'Undo';
      undoBtn.addEventListener('click', function () {
        var undoSuccess = _this2.moduleCoordinator.popHistoryState();
        if (!undoSuccess) {
          utils.blinkRed(undoBtn, _this2.modulePrefix);
        }
      });
      actionsBtnGroup.appendChild(undoBtn);

      this.html.container.appendChild(componentsBtnGroups);
      this.html.container.appendChild(actionsBtnGroup);
    }
  }]);
  return ControlBar;
}(ViewController);

function createButtonGroup() {
  var group = document.createElement('div');
  group.classList.add('btn-group');
  group.setAttribute('role', 'group');
  return group;
}

function createDropdown(buttonName, subButtons, subButtonsClass) {
  var wrapper = document.createElement('div');
  wrapper.classList.add('btn', // Bootstrap
  'btn-default', 'fl-fb-ControlBar-dropdown');

  var mainButton = document.createElement('label');
  mainButton.classList.add('fl-fb-ControlBar-dropdown-checkbox-label');
  mainButton.textContent = buttonName;
  wrapper.appendChild(mainButton);

  var arrowDown = document.createElement('span');
  arrowDown.classList.add('caret');
  mainButton.appendChild(arrowDown);

  var list = document.createElement('ul');
  list.classList.add('fl-fb-ControlBar-dropdown-content');

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = subButtons[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var buttonInfo = _step3.value;

      var listItem = document.createElement('li');
      var clickable = document.createElement('a');
      clickable.name = buttonInfo.name;
      clickable.textContent = buttonInfo.description;
      clickable.classList.add(subButtonsClass);

      listItem.appendChild(clickable);
      list.appendChild(listItem);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  wrapper.appendChild(list);
  return wrapper;
}

/**
 * @class ControlBar
 */

var ComponentFabric = function () {
  function ComponentFabric(modulePrefix) {
    babelHelpers.classCallCheck(this, ComponentFabric);

    this.modulePrefix = modulePrefix;
    this.componentContructors = [];
    Object.preventExtensions(this);
  }

  /**
   * @method addComponentConstructor
   * @param {Function} constr - Component constructor Function
   * @return {void}
   */


  babelHelpers.createClass(ComponentFabric, [{
    key: 'addComponentConstructor',
    value: function addComponentConstructor(constr) {
      this.componentConstructors = this.componentConstructors.concat([constr]);
    }

    /**
     * @method createComponent
     * @param  {String} componentType
     * @return {Component}
     */

  }, {
    key: 'createComponent',
    value: function createComponent(componentType) {
      var Comp = this.componentConstructors.find(function (c) {
        return c.getInfo().type === componentType;
      });
      assert(Comp, 'Invalid component: ' + componentType);
      return new Comp();
    }

    /**
     * @method getComponentTypes
     * @return {Array<Object>}
     */

  }, {
    key: 'getComponentsInfo',
    value: function getComponentsInfo() {
      var info = this.componentConstructors.map(function (component) {
        return component.getInfo();
      });
      return info;
    }
  }]);
  return ComponentFabric;
}();

var MAX_HISTORY_STATES = 15;
/**
 * This class takes care of storing forms in local storage
 * as well as sending it to the database, and keeping intermediate states
 * so as to add the undo function.
 * @class Storage
 */

var Storage = function () {
  function Storage() {
    babelHelpers.classCallCheck(this, Storage);

    this.currentState = null;
    this.history = [];
    Object.preventExtensions(this);
  }

  babelHelpers.createClass(Storage, [{
    key: 'pushHistoryState',
    value: function pushHistoryState(state) {
      assert(state, 'Invalid state being saved: ' + state);
      if (this.history.length > MAX_HISTORY_STATES) {
        this.history = this.history.slice(1);
      }
      if (this.currentState) {
        this.history.push(this.currentState);
      }
      this.currentState = state;
    }

    /**
     * @method popHistoryState
     * @return {Object} - A State object
     */

  }, {
    key: 'popHistoryState',
    value: function popHistoryState() {
      if (this.history.length > 0) {
        this.currentState = this.history.pop();
        return this.currentState;
      }
      return undefined;
    }
  }]);
  return Storage;
}();

/**
 * The module coordinator contains all of the methods the consumer of the
 * application will need.
 * @class Coordinator
 */

var ModuleCoordinator = function () {
  function ModuleCoordinator(modulePrefix, htmlContainer) {
    babelHelpers.classCallCheck(this, ModuleCoordinator);

    this.storage = new Storage();
    this.componentFabric = new ComponentFabric(modulePrefix);

    this.componentsContainer = new ComponentsContainer(modulePrefix);
    this.componentsContainer.on('change', this.pushHistoryState.bind(this));

    this.controlBar = new ControlBar(modulePrefix, this);
    this.htmlContainer = htmlContainer;

    Object.preventExtensions(this);
    this.htmlContainer.appendChild(this.controlBar.getHtmlContainer());
    this.htmlContainer.appendChild(this.componentsContainer.getHtmlContainer());
    this.pushHistoryState();
  }

  babelHelpers.createClass(ModuleCoordinator, [{
    key: 'getComponentsInfo',
    value: function getComponentsInfo() {
      return this.componentFabric.getComponentsInfo();
    }
  }, {
    key: 'createComponent',
    value: function createComponent(compName) {
      var newComponent = this.componentFabric.createComponent(compName);
      this.componentsContainer.addComponent(newComponent);
      this.pushHistoryState();
    }
  }, {
    key: 'save',
    value: function save() {
      var content = this.exportState();
      utils.fireEvent(this.htmlContainer, 'formBuilderSave', { formState: content });
    }

    /**
     * Use this method to get the current state of the application
     * @method exportState
     * @param {void}
     * @return {Array<Object>} An array of objects that represents the current
     * state of the application and which can be used to restore the application to that state.
     */

  }, {
    key: 'exportState',
    value: function exportState() {
      var components = this.componentsContainer.getAllComponents();
      var outcome = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var component = _step.value;

          outcome.push(component.exportState());
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return outcome;
    }

    /**
     * Use this function to import a past saved state
     * @method importState
     * @param  {Array<Object>} state - A state obtained previsously obtained.
     * @return {void}
     */

  }, {
    key: 'importState',
    value: function importState() {
      var _this = this;

      var state = arguments.length <= 0 || arguments[0] === undefined ? this.exportState() : arguments[0];
      var registerInHistory = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.componentsContainer.deleteAllComponents();

      var components = [];
      state.forEach(function (componentState) {
        var component = _this.componentFabric.createComponent(componentState.type);
        component.importState(componentState);
        components.push(component);
      });

      this.componentsContainer.setComponents(components);
      if (registerInHistory) {
        this.pushHistoryState();
      }
    }

    /**
     * Add current state to the saved history.
     * @private
     * @method pushHistoryState
     * @return {void}
     */

  }, {
    key: 'pushHistoryState',
    value: function pushHistoryState() {
      var currentState = this.exportState();
      this.storage.pushHistoryState(currentState);
    }

    /**
     * Undo function
     * @private
     * @method popHistoryState
     * @return {Boolean} success
     */

  }, {
    key: 'popHistoryState',
    value: function popHistoryState() {
      var lastState = this.storage.popHistoryState();
      if (lastState) {
        this.importState(lastState, false);
        return true;
      }
      return false;
    }
  }]);
  return ModuleCoordinator;
}();

/**
 * @abstract @class FormComponent
 */

var FormComponent = function (_ViewController) {
  babelHelpers.inherits(FormComponent, _ViewController);
  babelHelpers.createClass(FormComponent, null, [{
    key: 'getInfo',
    value: function getInfo() {
      return {
        description: 'General Component',
        iconClass: undefined,
        name: this.name
      };
    }
  }]);

  function FormComponent(modulePrefix) {
    babelHelpers.classCallCheck(this, FormComponent);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(FormComponent).call(this, modulePrefix));

    _this.cssPrefix = modulePrefix + '-FormComponent';
    _this.html.container.classList.add(modulePrefix + '-FormComponent');

    _this.editables = new Set();
    _this.isRequired = false;
    _this.isConfigVisible = false;
    _this.isDetroyed = false;
    _this.lastState = null;

    _this.acceptEvents('destroy', 'change');

    // Focused on config show
    _this.focusElement = null;
    _this.buildHtml();
    _this.setRequired(false);
    return _this;
  }

  babelHelpers.createClass(FormComponent, [{
    key: 'buildHtml',
    value: function buildHtml() {
      var _this2 = this;

      var frag = document.createDocumentFragment();

      // -- Content --
      this.html.content = document.createElement('div');
      this.html.content.classList.add(this.cssPrefix + '-content');
      frag.appendChild(this.html.content);

      this.html.title = document.createElement('h3');
      this.html.title.innerText = 'Add a title';
      this.addEditable(this.html.title);
      this.html.content.appendChild(this.html.title);

      // -- Configuration --
      this.html.configuration = document.createElement('div');
      var configurationCssClass = this.cssPrefix + '-configuration';
      this.html.configuration.classList.add(configurationCssClass);
      frag.appendChild(this.html.configuration);

      var configurationButtons = document.createElement('div');
      configurationButtons.classList.add(this.cssPrefix + '-configuration-buttons');
      this.html.configuration.appendChild(configurationButtons);

      this.html.requiredSwitch = utils.createSwitch('Required', this.modulePrefix);
      this.html.requiredSwitch.classList.add(configurationCssClass + '-switch-required');
      this.html.requiredSwitch.addEventListener('change', function (e) {
        var checked = e.target.checked;
        _this2.setRequired(checked);
      });
      configurationButtons.appendChild(this.html.requiredSwitch);

      var elementName = document.createElement('span');
      elementName.classList.add(configurationCssClass + '-elementName');
      elementName.innerHTML = this.constructor.name;
      configurationButtons.appendChild(elementName);

      var okBtn = document.createElement('button');
      okBtn.classList.add(configurationCssClass + '-btn-ok', 'btn', // Bootstrap
      'btn-sm', 'btn-default', 'glyphicon', // Font-awesome
      'glyphicon-ok');
      okBtn.type = 'button';
      okBtn.addEventListener('click', function () {
        _this2.configToggle();
      });
      configurationButtons.appendChild(okBtn);

      // -- Sidebar --
      this.html.sidebar = document.createElement('div');
      var sidebarCssClass = this.cssPrefix + '-sidebar';
      this.html.sidebar.classList.add(sidebarCssClass);
      frag.appendChild(this.html.sidebar);

      var deleteBtn = document.createElement('button');
      deleteBtn.classList.add('glyphicon', 'glyphicon-trash');
      deleteBtn.type = 'button';
      deleteBtn.addEventListener('click', function () {
        return _this2.destroy();
      });
      this.addSidebarButton(deleteBtn, 'delete');

      var showConfigBtn = document.createElement('button');
      showConfigBtn.type = 'button';
      showConfigBtn.classList.add('glyphicon', // Font-awesome
      'glyphicon-cog');
      showConfigBtn.title = 'Configure form group';
      this.addSidebarButton(showConfigBtn, 'config');

      showConfigBtn.addEventListener('click', function () {
        _this2.configToggle();
      });

      this.html.container.appendChild(frag);
    }
  }, {
    key: 'addSidebarButton',
    value: function addSidebarButton(button, elementName) {
      var className = elementName ? this.cssPrefix + '-sidebar-btn-' + elementName : this.cssPrefix + '-sidebar-btn';
      button.classList.add(className);
      this.html.sidebar.insertBefore(button, this.html.sidebar.children[0]);
    }

    /**
     * @method addEditable
     * @param  {HTMLElement} element
     */

  }, {
    key: 'addEditable',
    value: function addEditable(element) {
      element.classList.add(this.cssPrefix + '-editable');
      this.editables.add(element);
      if (this.isConfigVisible) {
        this.enableEditing(true);
      }
    }

    /**
     * @method enableEditing
     * @param  {Boolean} enable - Whether to enable editing or not.
     * @return {void}
     */

  }, {
    key: 'enableEditing',
    value: function enableEditing() {
      var enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      this.editables.forEach(function (element) {
        element.setAttribute('contenteditable', enable);
      });
    }

    /**
     * @method configToggle
     * @param  {Boolean} forceState Optional parameter to force a state.
     * @return {void}
     */

  }, {
    key: 'configToggle',
    value: function configToggle() {
      var _this3 = this;

      var newState = arguments.length <= 0 || arguments[0] === undefined ? !this.isConfigVisible : arguments[0];

      if (this.isConfigVisible === newState) {
        return;
      }
      this.isConfigVisible = newState;
      if (!newState) {
        // hide
        this.html.container.classList.remove(this.cssPrefix + '--configuration-visible');
        this.enableEditing(false);
        this.triggerChangeIfNeeded();
      } else {
        // show
        this.html.container.classList.add(this.cssPrefix + '--configuration-visible');
        this.enableEditing(true);

        // hide on clickOut
        utils.onClickOut([this.html.container, this.html.configuration], function () {
          if (_this3.isConfigVisible && !_this3.isDetroyed) {
            _this3.configToggle();
          }
        });
        this.focus();
      }
    }

    // Focus on the appropriate element

  }, {
    key: 'focus',
    value: function focus() {
      var _this4 = this;

      if (this.focusElement) {
        // NOTE: There is a bug that for some reason it doesn't focus if you just
        // call focus() straight away. setTimeout solves it.
        // see http:// goo.gl/UjKOk5
        setTimeout(function () {
          _this4.focusElement.focus();
        }, 15);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.isDetroyed) {
        return;
      }
      this.isDetroyed = true;
      babelHelpers.get(Object.getPrototypeOf(FormComponent.prototype), 'destroy', this).call(this);
    }

    /**
     * @method setRequired
     * @param  {Boolean} required
     */

  }, {
    key: 'setRequired',
    value: function setRequired(required) {
      this.isRequired = !!required;
      this.html.requiredSwitch.input.checked = !!required;
    }

    /**
     * Exports the information of a component in one object
     * @method exportState
     * @return {Object}
     */

  }, {
    key: 'exportState',
    value: function exportState() {
      return {
        required: this.isRequired,
        title: this.html.title.textContent,
        type: this.constructor.name
      };
    }

    /**
     * Sets the component state the the options specified in the
     * state object
     * @method importState
     * @param  {Object} state
     * @return {void}
     */

  }, {
    key: 'importState',
    value: function importState(state) {
      assert(state.type === this.constructor.name, 'Importing incompatible state. Expected ' + this.constructor.name + ', got ' + state.type);
      this.html.title.textContent = state.title;
      this.setRequired(state.required);
    }

    /**
     * Triggers the change event if any change happened.
     * @method triggerChangeIfNeeded
     * @return {void}
     */

  }, {
    key: 'triggerChangeIfNeeded',
    value: function triggerChangeIfNeeded() {
      var currentState = this.exportState();
      var currStateJson = JSON.stringify(currentState);

      var lastStateJson = JSON.stringify(this.lastState);
      var changeHappened = lastStateJson !== currStateJson;
      if (changeHappened && this.lastState !== null) {
        this.trigger('change');
      }
      this.lastState = currentState;
    }
  }]);
  return FormComponent;
}(ViewController);

var OptionsComponent = function (_FormComponent) {
  babelHelpers.inherits(OptionsComponent, _FormComponent);
  babelHelpers.createClass(OptionsComponent, null, [{
    key: 'getInfo',
    value: function getInfo() {
      var info = babelHelpers.get(Object.getPrototypeOf(OptionsComponent), 'getInfo', this).call(this);
      info.group = 'Options Components';
      return info;
    }
  }]);

  function OptionsComponent(modulePrefix) {
    babelHelpers.classCallCheck(this, OptionsComponent);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(OptionsComponent).call(this, modulePrefix));

    _this.html.options = [];
    return _this;
  }

  /**
   * In addition to building the standard html structure, it adds
   * a field to add an option.
   * @method buildHtml
   * @return {void}
   */


  babelHelpers.createClass(OptionsComponent, [{
    key: 'buildHtml',
    value: function buildHtml() {
      var _this2 = this;

      babelHelpers.get(Object.getPrototypeOf(OptionsComponent.prototype), 'buildHtml', this).call(this);

      var optionsConfig = document.createElement('div');
      var optionsConfigCssClass = this.cssPrefix + '-configuration-options';
      optionsConfig.classList.add(optionsConfigCssClass);

      if (this.html.configuration.children[0]) {
        this.html.configuration.insertBefore(optionsConfig, this.html.configuration.children[0]);
      } else {
        this.html.configuration.appendChild(optionsConfig);
      }

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.title = 'Remove last option';
      removeBtn.classList.add('glyphicon-minus-sign', 'glyphicon', optionsConfigCssClass + '-btn-remove');
      removeBtn.addEventListener('click', function () {
        return _this2.removeOption();
      });
      optionsConfig.appendChild(removeBtn);

      var addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.title = 'Add new option';
      addBtn.classList.add('glyphicon-plus-sign', 'glyphicon', optionsConfigCssClass + '-btn-add');
      addBtn.addEventListener('click', function () {
        return _this2.submitOptionFromConfigBar();
      });
      optionsConfig.appendChild(addBtn);

      this.html.newOptionText = document.createElement('input');
      this.html.newOptionText.setAttribute('placeholder', 'Type a new option');
      this.html.newOptionText.setAttribute('type', 'text');
      this.html.newOptionText.classList.add(optionsConfigCssClass + '-input');
      this.focusElement = this.html.newOptionText;
      optionsConfig.appendChild(this.html.newOptionText);
      this.html.newOptionText.addEventListener('keypress', function (e) {
        if (e.which === 13) {
          var click = new Event('click');
          addBtn.dispatchEvent(click);
          e.preventDefault();
          return false; //  returning false will prevent the event from bubbling up.
        }
        return true;
      });

      this.focus();
    }
  }, {
    key: 'submitOptionFromConfigBar',
    value: function submitOptionFromConfigBar() {
      if (!this.html.newOptionText.value.trim()) {
        utils.blinkRed(this.html.newOptionText, this.modulePrefix);
        return;
      }
      this.addOption(this.html.newOptionText.value);
      this.html.newOptionText.value = '';
      this.triggerChangeIfNeeded();
    }

    /**
     * This method is supposed to be extended by subclasses and they will
     * define the optionType or change this method completely.
     * @method addOption
     * @param  {String} text
     * @param  {String} optionType
     */

  }, {
    key: 'addOption',
    value: function addOption(text, optionType) {
      var newOption = document.createElement('div');
      newOption.classList.add(this.cssPrefix + '-option');

      var optionCheckbox = document.createElement('input');
      optionCheckbox.type = optionType;
      newOption.appendChild(optionCheckbox);

      var optionText = document.createElement('span');
      optionText.classList.add(this.cssPrefix + '-option-text');
      optionText.textContent = text;
      newOption.appendChild(optionText);

      this.html.options.push(newOption);
      this.html.content.appendChild(newOption);
      this.addEditable(optionText);
    }

    /**
     * Removes an option element
     * @method removeOption
     * @return {void}
     */

  }, {
    key: 'removeOption',
    value: function removeOption() {
      var optionToRemove = this.html.options.pop();
      if (optionToRemove) {
        optionToRemove.remove();
      }
    }

    /**
     * @override @method exportState
     * @return {Object}
     */

  }, {
    key: 'exportState',
    value: function exportState() {
      var output = babelHelpers.get(Object.getPrototypeOf(OptionsComponent.prototype), 'exportState', this).call(this);
      output.options = this.html.options.map(function (o) {
        return o.textContent;
      });
      return output;
    }

    /**
     * @override @method importState
     * @return {void}
     */

  }, {
    key: 'importState',
    value: function importState(state) {
      var _this3 = this;

      babelHelpers.get(Object.getPrototypeOf(OptionsComponent.prototype), 'importState', this).call(this, state);
      var optionCount = this.html.options.length;
      for (var i = 0; i < optionCount; i++) {
        this.removeOption();
      }
      state.options.forEach(function (o) {
        return _this3.addOption(o);
      });
    }
  }]);
  return OptionsComponent;
}(FormComponent);

var RadioBtns = function (_OptionsComponent) {
  babelHelpers.inherits(RadioBtns, _OptionsComponent);
  babelHelpers.createClass(RadioBtns, null, [{
    key: 'getInfo',
    value: function getInfo() {
      var info = babelHelpers.get(Object.getPrototypeOf(RadioBtns), 'getInfo', this).call(this);
      info.description = 'Radio Buttons';
      info.iconClass = 'glyphicon glyphicon-ok-circle';
      return info;
    }
  }]);

  function RadioBtns(modulePrefix) {
    babelHelpers.classCallCheck(this, RadioBtns);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(RadioBtns).call(this, modulePrefix));

    Object.preventExtensions(_this);
    _this.addOption('Insert an option');
    return _this;
  }

  /**
   * @override @method addOption
   * @param  {String} text
   */


  babelHelpers.createClass(RadioBtns, [{
    key: 'addOption',
    value: function addOption(text) {
      babelHelpers.get(Object.getPrototypeOf(RadioBtns.prototype), 'addOption', this).call(this, text, 'radio');
    }
  }]);
  return RadioBtns;
}(OptionsComponent);

var Checkboxes = function (_OptionsComponent) {
  babelHelpers.inherits(Checkboxes, _OptionsComponent);
  babelHelpers.createClass(Checkboxes, null, [{
    key: 'getInfo',
    value: function getInfo() {
      var info = babelHelpers.get(Object.getPrototypeOf(Checkboxes), 'getInfo', this).call(this);
      info.description = 'Checkboxes';
      info.iconClass = 'glyphicon glyphicon-check';
      return info;
    }
  }]);

  function Checkboxes(modulePrefix) {
    babelHelpers.classCallCheck(this, Checkboxes);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Checkboxes).call(this, modulePrefix));

    Object.preventExtensions(_this);
    _this.addOption('Insert an option');
    return _this;
  }

  /**
   * @override @method addOption
   * @param  {String} text
   */


  babelHelpers.createClass(Checkboxes, [{
    key: 'addOption',
    value: function addOption(text) {
      babelHelpers.get(Object.getPrototypeOf(Checkboxes.prototype), 'addOption', this).call(this, text, 'checkbox');
    }
  }]);
  return Checkboxes;
}(OptionsComponent);

var Dropdown = function (_OptionsComponent) {
  babelHelpers.inherits(Dropdown, _OptionsComponent);
  babelHelpers.createClass(Dropdown, null, [{
    key: 'getInfo',
    value: function getInfo() {
      var info = babelHelpers.get(Object.getPrototypeOf(Dropdown), 'getInfo', this).call(this);
      info.description = 'Dropdown';
      info.iconClass = 'glyphicon glyphicon-collapse-down';
      return info;
    }
  }]);

  function Dropdown(modulePrefix) {
    babelHelpers.classCallCheck(this, Dropdown);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Dropdown).call(this, modulePrefix));

    Object.preventExtensions(_this);

    // Create placeholder
    _this.addOption('Select an option');
    _this.html.options[0].disabled = true;
    _this.html.options[0].setAttribute('selected', true);
    return _this;
  }

  babelHelpers.createClass(Dropdown, [{
    key: 'buildHtml',
    value: function buildHtml() {
      babelHelpers.get(Object.getPrototypeOf(Dropdown.prototype), 'buildHtml', this).call(this);
      this.buildComponent();
      this.buildComponentSpecificConfiguration();
    }
  }, {
    key: 'buildComponent',
    value: function buildComponent() {
      var dropdown = document.createElement('select');
      dropdown.classList.add(this.cssPrefix + '-' + this.constructor.name, 'form-control' // Bootstrap
      );

      this.html.dropdown = dropdown;
      this.focusElement = dropdown;
      this.html.content.appendChild(dropdown);
    }
  }, {
    key: 'buildComponentSpecificConfiguration',
    value: function buildComponentSpecificConfiguration() {
      var newOptionDisabledWrapper = document.createElement('label');

      var newOptionDisabled = document.createElement('input');
      newOptionDisabled.classList.add(this.cssPrefix + '-configuration-options-optionDisabled');
      newOptionDisabled.type = 'checkbox';
      newOptionDisabledWrapper.appendChild(newOptionDisabled);
      newOptionDisabledWrapper.appendChild(document.createTextNode('Divider'));

      var optionConfig = this.html.configuration.children[0];
      this.html.newOptionDisabled = newOptionDisabled;
      optionConfig.appendChild(newOptionDisabledWrapper);
    }
  }, {
    key: 'submitOptionFromConfigBar',
    value: function submitOptionFromConfigBar() {
      if (!this.html.newOptionText.value.trim()) {
        utils.blinkRed(this.html.newOptionText, this.modulePrefix);
        return;
      }
      this.addOption(this.html.newOptionText.value, this.html.newOptionDisabled.checked);
      this.html.newOptionDisabled.checked = false;
      this.html.newOptionText.value = '';
      this.triggerChangeIfNeeded();
    }
  }, {
    key: 'addOption',
    value: function addOption(text) {
      var disabled = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var newOption = document.createElement('option');
      if (disabled) {
        newOption.setAttribute('disabled', true);
      }
      newOption.textContent = text;

      this.html.options.push(newOption);
      this.html.dropdown.appendChild(newOption);
    }

    /**
     * @override @method enableEditing
     * @param  {Boolean} enable
     * @return {void}
     */

  }, {
    key: 'enableEditing',
    value: function enableEditing() {
      var enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      babelHelpers.get(Object.getPrototypeOf(Dropdown.prototype), 'enableEditing', this).call(this, enable);
      if (!this.html.dropdown) {
        return;
      }
      if (enable) {
        this.html.dropdown.setAttribute('multiple', true);
      } else {
        this.html.dropdown.removeAttribute('multiple');
      }
    }

    /**
     * @override @method exportState
     * @return {Object}
     */

  }, {
    key: 'exportState',
    value: function exportState() {
      var output = babelHelpers.get(Object.getPrototypeOf(Dropdown.prototype), 'exportState', this).call(this);
      output.disabledIndexes = [];
      this.html.options.forEach(function (o, index) {
        if (o.hasAttribute('disabled')) {
          output.disabledIndexes.push(index);
        }
      });
      return output;
    }

    /**
     * @override @method importState
     * @return {void}
     */

  }, {
    key: 'importState',
    value: function importState(state) {
      babelHelpers.get(Object.getPrototypeOf(Dropdown.prototype), 'importState', this).call(this, state);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = state.disabledIndexes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var disabledIndex = _step.value;

          this.html.options[disabledIndex].setAttribute('disabled', true);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);
  return Dropdown;
}(OptionsComponent);

var componentsArray$1 = [RadioBtns, Checkboxes, Dropdown];

var defaultPlaceholder = 'Insert a placeholder text';

/**
 * @abstract @class TextComponent
 */

var TextComponent = function (_FormComponent) {
  babelHelpers.inherits(TextComponent, _FormComponent);
  babelHelpers.createClass(TextComponent, null, [{
    key: 'getInfo',
    value: function getInfo() {
      var info = babelHelpers.get(Object.getPrototypeOf(TextComponent), 'getInfo', this).call(this);
      info.group = 'Text Components';
      return info;
    }
  }]);

  function TextComponent(modulePrefix, tagName) {
    var fieldType = arguments.length <= 2 || arguments[2] === undefined ? 'text' : arguments[2];
    babelHelpers.classCallCheck(this, TextComponent);

    var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(TextComponent).call(this, modulePrefix));

    _this.fieldType = fieldType;
    _this.buildComponent(tagName, fieldType);
    _this.focus();
    return _this;
  }

  babelHelpers.createClass(TextComponent, [{
    key: 'buildComponent',
    value: function buildComponent(tagName, fieldType) {
      var textElement = document.createElement(tagName);
      textElement.setAttribute('type', fieldType);

      textElement.classList.add(this.cssPrefix + '-' + this.constructor.name, 'form-control' // Bootstrap
      );
      this.html.textElement = textElement;
      this.focusElement = textElement;
      this.html.content.appendChild(textElement);

      this.setPlaceholder(defaultPlaceholder);
    }

    /**
     * @override @method enableEditing
     * @param  {Boolean} enable
     * @return {void}
     */

  }, {
    key: 'enableEditing',
    value: function enableEditing() {
      var enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      babelHelpers.get(Object.getPrototypeOf(TextComponent.prototype), 'enableEditing', this).call(this, enable);
      if (!this.html.textElement) {
        return;
      }
      if (enable) {
        this.html.textElement.value = this.getPlaceholder();
        this.html.textElement.setAttribute('type', 'text');
        return;
      }
      this.setPlaceholder(this.html.textElement.value);
      this.html.textElement.setAttribute('type', this.fieldType);
      this.html.textElement.value = '';
    }
  }, {
    key: 'setPlaceholder',
    value: function setPlaceholder(text) {
      if (this.isConfigVisible) {
        this.html.textElement.value = text;
      }
      this.html.textElement.setAttribute('placeholder', text);
    }
  }, {
    key: 'getPlaceholder',
    value: function getPlaceholder() {
      return this.html.textElement.getAttribute('placeholder');
    }

    /**
     * @override @method exportState
     * @return {Object}
     */

  }, {
    key: 'exportState',
    value: function exportState() {
      var output = babelHelpers.get(Object.getPrototypeOf(TextComponent.prototype), 'exportState', this).call(this);
      var placeholder = this.getPlaceholder();
      // We don't want to export the default placeholder.
      output.placeholder = placeholder === defaultPlaceholder ? '' : placeholder;
      return output;
    }

    /**
     * @override @method importState
     * @param  {Object} state
     * @return {void}
     */

  }, {
    key: 'importState',
    value: function importState(state) {
      babelHelpers.get(Object.getPrototypeOf(TextComponent.prototype), 'importState', this).call(this, state);
      this.setPlaceholder(state.placeholder);
    }
  }]);
  return TextComponent;
}(FormComponent);

var TextBox = function (_TextComponent) {
  babelHelpers.inherits(TextBox, _TextComponent);
  babelHelpers.createClass(TextBox, null, [{
    key: 'getInfo',
    value: function getInfo() {
      var info = babelHelpers.get(Object.getPrototypeOf(TextBox), 'getInfo', this).call(this);
      info.description = 'Text Box';
      info.iconClass = 'glyphicon glyphicon-text-width';
      return info;
    }
  }]);

  function TextBox(modulePrefix) {
    babelHelpers.classCallCheck(this, TextBox);
    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(TextBox).call(this, modulePrefix, 'input', 'text'));
  }

  return TextBox;
}(TextComponent);

var TextArea = function (_TextComponent) {
  babelHelpers.inherits(TextArea, _TextComponent);
  babelHelpers.createClass(TextArea, null, [{
    key: 'getInfo',
    value: function getInfo() {
      var info = babelHelpers.get(Object.getPrototypeOf(TextArea), 'getInfo', this).call(this);
      info.description = 'Text Area';
      info.iconClass = 'glyphicon glyphicon-text-height';
      return info;
    }
  }]);

  function TextArea(modulePrefix) {
    babelHelpers.classCallCheck(this, TextArea);
    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(TextArea).call(this, modulePrefix, 'textarea'));
  }

  /**
   * @override @method buildComponent
   */


  babelHelpers.createClass(TextArea, [{
    key: 'buildComponent',
    value: function buildComponent() {
      var _babelHelpers$get;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_babelHelpers$get = babelHelpers.get(Object.getPrototypeOf(TextArea.prototype), 'buildComponent', this)).call.apply(_babelHelpers$get, [this].concat(args));
      this.html.textElement.setAttribute('rows', 5);
    }
  }]);
  return TextArea;
}(TextComponent);

var EmailBox = function (_TextComponent) {
  babelHelpers.inherits(EmailBox, _TextComponent);
  babelHelpers.createClass(EmailBox, null, [{
    key: 'getInfo',
    value: function getInfo() {
      var info = babelHelpers.get(Object.getPrototypeOf(EmailBox), 'getInfo', this).call(this);
      info.description = 'Email Box';
      info.iconClass = 'glyphicon glyphicon-envelope';
      return info;
    }
  }]);

  function EmailBox(modulePrefix) {
    babelHelpers.classCallCheck(this, EmailBox);
    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(EmailBox).call(this, modulePrefix, 'input', 'email'));
  }

  return EmailBox;
}(TextComponent);

var TelephoneBox = function (_TextComponent) {
  babelHelpers.inherits(TelephoneBox, _TextComponent);
  babelHelpers.createClass(TelephoneBox, null, [{
    key: 'getInfo',
    value: function getInfo() {
      var info = babelHelpers.get(Object.getPrototypeOf(TelephoneBox), 'getInfo', this).call(this);
      info.description = 'Telephone Box';
      info.iconClass = 'glyphicon glyphicon-earphone';
      return info;
    }
  }]);

  function TelephoneBox(modulePrefix) {
    babelHelpers.classCallCheck(this, TelephoneBox);
    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(TelephoneBox).call(this, modulePrefix, 'input', 'tel'));
  }

  return TelephoneBox;
}(TextComponent);

var NumberBox = function (_TextComponent) {
  babelHelpers.inherits(NumberBox, _TextComponent);
  babelHelpers.createClass(NumberBox, null, [{
    key: 'getInfo',
    value: function getInfo() {
      var info = babelHelpers.get(Object.getPrototypeOf(NumberBox), 'getInfo', this).call(this);
      info.description = 'Number Box';
      info.iconClass = 'glyphicon glyphicon-subscript';
      return info;
    }
  }]);

  function NumberBox(modulePrefix) {
    babelHelpers.classCallCheck(this, NumberBox);
    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(NumberBox).call(this, modulePrefix, 'input', 'number'));
  }

  return NumberBox;
}(TextComponent);

var componentsArray$2 = [TextBox, TextArea, EmailBox, TelephoneBox, NumberBox];

var componentsArray = componentsArray$1.concat(componentsArray$2);

function isHtmlNode(node) {
  return node.setAttribute && node.appendChild;
}

var viewControllerSubclasses = [ComponentsContainer, ControlBar].concat(babelHelpers.toConsumableArray(componentsArray));

var viewControllerSpecs = (function () {
  viewControllerSubclasses.forEach(function (ViewControllerContructor) {
    describe(ViewControllerContructor.name + ': A ViewController instance should', function () {
      var MODULE_PREFIX = '-test-';
      var comp = void 0;

      beforeEach(function () {
        if (ViewControllerContructor === ControlBar) {
          var container = document.createElement('div');
          var coordinator = new ModuleCoordinator(MODULE_PREFIX, container);
          comp = new ControlBar(MODULE_PREFIX, coordinator);
        } else {
          comp = new ViewControllerContructor(MODULE_PREFIX);
        }
      });

      it('create an html object to hold DOM nodes', function () {
        expect(comp.html).toBeDefined();
      });

      it('have a container DOM node and its getter', function () {
        expect(comp.html.container).toBeDefined();
        expect(isHtmlNode(comp.html.container)).toBeTruthy();
        expect(comp.getHtmlContainer).toBeDefined();
        expect(comp.getHtmlContainer() === comp.html.container).toBeTruthy();
      });

      it('have an "on" method for event listening', function () {
        expect(comp.on).toBeDefined();
        expect(typeof comp.on === 'function').toBeTruthy();
      });

      it('accept listening for the destroy event', function () {
        var removeSpy = jasmine.createSpy('removeSpy');
        expect(function () {
          return comp.on('destroy', removeSpy);
        }).not.toThrow();
        comp.destroy();
        expect(removeSpy).toHaveBeenCalled();
      });

      it('remove listeners with the "removeListener" method', function () {
        var removeSpy = jasmine.createSpy('removeSpy');
        comp.on('destroy', removeSpy);
        comp.removeListener('destroy', removeSpy);
        comp.destroy();
        expect(removeSpy).not.toHaveBeenCalled();
      });

      it('destroy the html container on destroy', function () {
        expect(comp.html !== null).toBeTruthy();
        comp.destroy();
        expect(comp.getHtmlContainer()).toBeFalsy();
      });

      it('execute events added via the "acceptEvents" method', function () {
        var testSpy = jasmine.createSpy();
        var testEvent = 'test';
        comp.acceptEvents(testEvent);
        expect(function () {
          return comp.on(testEvent, testSpy);
        }).not.toThrow();
        comp.trigger(testEvent);
        expect(testSpy).toHaveBeenCalled();
      });
    });
  });
})

var formComponentSpecs = (function () {
  componentsArray.forEach(function (ComponentContructor) {
    describe(ComponentContructor.name + ': A FormComponent subclass component should', function () {
      var MODULE_PREFIX = '-test-';
      var comp = void 0;
      beforeEach(function () {
        comp = new ComponentContructor(MODULE_PREFIX);
      });

      it('have a cssPrefix property', function () {
        expect(comp.cssPrefix).toBeDefined();
        expect(comp.cssPrefix.indexOf(MODULE_PREFIX)).toBeGreaterThan(-1);
      });

      it('have a requiried property with setter', function () {
        expect(comp.isRequired).toBeDefined();
        expect(comp.setRequired).toBeDefined();
        expect(typeof comp.setRequired === 'function').toBeTruthy();
      });

      it('set required property when the "setRequired" function is called', function () {
        comp.setRequired(true);
        expect(comp.isRequired).toBeTruthy();
        comp.setRequired(false);
        expect(comp.isRequired).toBeFalsy();
      });

      it('have a focus function', function () {
        expect(comp.focus).toBeDefined();
        expect(typeof comp.focus === 'function').toBeTruthy();
      });

      it('set isDestroyed to true when "destroy" is called', function () {
        expect(comp.isDetroyed).toBeDefined();
        expect(comp.isDetroyed).toBeFalsy();
        comp.destroy();
        expect(comp.isDetroyed).toBeTruthy();
      });

      it('export the object without throwing', function () {
        var state = void 0;
        expect(function () {
          state = comp.exportState();
        }).not.toThrow();
        expect(typeof state === 'undefined' ? 'undefined' : babelHelpers.typeof(state)).toEqual('object');
        expect(state.type).toEqual(ComponentContructor.name);
        expect(state.required).toEqual(comp.isRequired);
      });

      it('set "title" and "isRequired" properties when importing a state', function () {
        comp.setRequired(true);
        var state = comp.exportState();
        expect(state.required).toEqual(true);
        state.required = false;
        comp.importState(state);
        expect(comp.isRequired).toBe(false);
      });

      it('change isConfigVisible state with "configToggle"', function () {
        var isConfigVisible = comp.isConfigVisible;
        comp.configToggle();
        expect(comp.isConfigVisible).toEqual(!isConfigVisible);

        comp.configToggle(false);
        expect(comp.isConfigVisible).toEqual(false);

        comp.configToggle(true);
        expect(comp.isConfigVisible).toEqual(true);
      });

      it('enable editing with "enableEditing" an element added with "addEditable"', function () {
        var myEl = document.createElement('p');
        myEl.setAttribute('contenteditable', false);

        comp.addEditable(myEl);
        comp.enableEditing();
        expect(myEl.getAttribute('contenteditable')).toEqual('true');

        comp.enableEditing(false);
        expect(myEl.getAttribute('contenteditable')).toEqual('false');
      });
    }); // wrapping describe
  }); // forEach
}) // wrapping function

var textComponentSpecs = (function () {
  componentsArray$2.forEach(function (ComponentContructor) {
    describe(ComponentContructor.name + ': A TextComponent subclass component should', function () {
      var MODULE_PREFIX = '-test-';
      var comp = void 0;
      beforeEach(function () {
        comp = new ComponentContructor(MODULE_PREFIX);
      });

      it('get and set placeholders with getPlaceholder and setPlaceholder', function () {
        expect(babelHelpers.typeof(comp.getPlaceholder)).toEqual('function');
        var initialPlaceholder = comp.getPlaceholder();
        expect(typeof initialPlaceholder === 'undefined' ? 'undefined' : babelHelpers.typeof(initialPlaceholder)).toEqual('string');

        var newPlaceholder = 'New placeholder text';
        expect(babelHelpers.typeof(comp.setPlaceholder)).toEqual('function');
        comp.setPlaceholder(newPlaceholder);
        expect(comp.getPlaceholder()).toEqual(newPlaceholder);
      });

      it('include the correct placeholder when exporting its state', function () {
        var state = comp.exportState();
        var newPlaceholder = 'New Placeholder text';
        state.placeholder = newPlaceholder;
        comp.importState(state);
        expect(comp.getPlaceholder()).toEqual(newPlaceholder);
        expect(comp.html.textElement.getAttribute('placeholder')).toEqual(newPlaceholder);
      });

      it('not export the default placeholder', function () {
        var state = comp.exportState();
        expect(state.placeholder).toBeFalsy();
      });
    }); // wrapping describe
  }); // forEach
}) // wrapping function

var optionsComponentSpecs = (function () {
  componentsArray$1.forEach(function (ComponentContructor) {
    describe(ComponentContructor.name + ': An OptionsComponent subclass component should', function () {
      var MODULE_PREFIX = '-test-';
      var comp = void 0;
      beforeEach(function () {
        comp = new ComponentContructor(MODULE_PREFIX);
      });

      it('include options in exported object', function () {
        var state = comp.exportState();
        expect(Array.isArray(state.options)).toBe(true);
      });

      it('add an option with the "addOption" method', function () {
        var optionText = 'New option test';
        comp.addOption(optionText);
        var state = comp.exportState();
        expect(state.options.indexOf(optionText)).toBeGreaterThan(-1);
      });

      it('remove options with the "removeOption" method', function () {
        var optionText = 'New option test';
        comp.addOption(optionText);
        comp.addOption(optionText);
        comp.removeOption();
        comp.removeOption();
        var state = comp.exportState();
        expect(state.options.indexOf(optionText)).toEqual(-1);
      });

      it('import options from a state', function () {
        var optionText1 = 'New option test 1';
        comp.addOption(optionText1);
        var optionText2 = 'New option test 2';
        comp.addOption(optionText2);
        var state = comp.exportState();

        var newComponent = new ComponentContructor(MODULE_PREFIX);
        newComponent.importState(state);
        var newComponentState = newComponent.exportState();
        expect(newComponentState.options.indexOf(optionText1)).toBeGreaterThan(-1);
        expect(newComponentState.options.indexOf(optionText2)).toBeGreaterThan(-1);
      });
    }); // wrapping describe
  }); // forEach
}) // wrapping function

var componentFabricSpecs = (function () {
  describe('A ComponentFabric should', function () {
    var MODULE_PREFIX = '-test-';
    var fabric = void 0;
    beforeEach(function () {
      fabric = new ComponentFabric(MODULE_PREFIX);
    });

    it('return the name of all components it can create with "getComponentTypes"', function () {
      expect(babelHelpers.typeof(fabric.getComponentTypes)).toBe('function');
      var types = fabric.getComponentTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      types.forEach(function (typeName) {
        expect(typeof typeName === 'undefined' ? 'undefined' : babelHelpers.typeof(typeName)).toEqual('object');
        expect(babelHelpers.typeof(typeName.name)).toBe('string');
      });
    });

    it('create an adequate object for all of its types', function () {
      var types = fabric.getComponentTypes();
      types.forEach(function (typeName) {
        var comp = fabric.createComponent(typeName.name);
        expect(comp instanceof window[typeName.name]).toBe(true);
      });
    });

    it('throw an error if we try to create an unknown component', function () {
      expect(function () {
        return fabric.createComponent('asdfasdfasdfasdf');
      }).toThrow();
    });
  });
}) // wrapping function

var MODULE_PREFIX = '-test-';

function createCoordinator() {
  var container = arguments.length <= 0 || arguments[0] === undefined ? document.createElement('div') : arguments[0];

  return new ModuleCoordinator(MODULE_PREFIX, container);
}

var moduleCoordinatorSpecs = (function () {
  describe('A ModuleCoordinator should', function () {
    var coordinator = void 0;
    var fabric = new ComponentFabric(MODULE_PREFIX);
    var componentNames = fabric.getComponentTypes().map(function (c) {
      return c.name;
    });

    beforeEach(function () {
      coordinator = createCoordinator();
    });

    it('allow for creation of components', function () {
      expect(function () {
        componentNames.forEach(function (name) {
          coordinator.createComponent(name);
        });
      }).not.toThrow();
    });

    it('throw when there is an attempt to create an invalid component', function () {
      expect(function () {
        return coordinator.createComponent('non-existing-name');
      }).toThrow();
    });

    it('export the current state including all components', function () {
      var state = coordinator.exportState();
      expect(Array.isArray(state)).toBe(true);
      expect(state.length).toBe(0);

      // Create loads of components
      componentNames.forEach(function (name) {
        coordinator.createComponent(name);
      });

      state = coordinator.exportState();
      expect(state.length).toBe(componentNames.length);
      state.forEach(function (componentObj, index) {
        expect(componentObj.type).toEqual(componentNames[index]);
      });
    });

    it('adds all correct components when importing a state', function () {
      var coordinator2 = createCoordinator();
      componentNames.forEach(function (name) {
        coordinator2.createComponent(name);
      });

      var coordinator2State = coordinator2.exportState();
      coordinator.importState(coordinator2State);
      var finalState = coordinator.exportState();
      expect(JSON.stringify(finalState)).toEqual(JSON.stringify(coordinator2State));
    });

    it('on save emmit correct event in container element', function () {
      var saveSpy = jasmine.createSpy();
      var container = document.createElement('div');
      var coordinator2 = createCoordinator(container);

      container.addEventListener('formBuilderSave', saveSpy);
      coordinator2.save();
      expect(saveSpy).toHaveBeenCalled();
    });

    it('allows for pushing and popping history states', function () {
      expect(function () {
        coordinator.pushHistoryState();
        coordinator.pushHistoryState();
        coordinator.pushHistoryState();
        coordinator.pushHistoryState();
      }).not.toThrow();

      expect(function () {
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
      }).not.toThrow();
    });

    it('does not throw when popping more history states than pushed', function () {
      expect(function () {
        coordinator.pushHistoryState();
        coordinator.pushHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
      }).not.toThrow();
    });

    it('returns correctly to past history states', function () {
      var state1 = coordinator.exportState();
      coordinator.createComponent(componentNames[0]);

      var state2 = coordinator.exportState();
      coordinator.createComponent(componentNames[0]);
      expect(JSON.stringify(state2)).not.toEqual(JSON.stringify(state1));

      var state3 = coordinator.exportState();
      coordinator.createComponent(componentNames[0]);
      expect(JSON.stringify(state3)).not.toEqual(JSON.stringify(state2));

      var state4 = coordinator.exportState();
      coordinator.createComponent(componentNames[0]);
      expect(JSON.stringify(state4)).not.toEqual(JSON.stringify(state3));

      var state5 = coordinator.exportState();
      coordinator.createComponent(componentNames[0]);
      expect(JSON.stringify(state5)).not.toEqual(JSON.stringify(state4));

      coordinator.popHistoryState();
      var poppedToState4 = coordinator.exportState();
      expect(JSON.stringify(poppedToState4)).not.toEqual(JSON.stringify(state4));

      coordinator.popHistoryState();
      var poppedToState3 = coordinator.exportState();
      expect(JSON.stringify(poppedToState3)).not.toEqual(JSON.stringify(state3));

      coordinator.popHistoryState();
      var poppedToState2 = coordinator.exportState();
      expect(JSON.stringify(poppedToState2)).not.toEqual(JSON.stringify(state2));

      coordinator.popHistoryState();
      var poppedToState1 = coordinator.exportState();
      expect(JSON.stringify(poppedToState1)).not.toEqual(JSON.stringify(state1));
    });
  });
})

viewControllerSpecs();

formComponentSpecs();

textComponentSpecs();

optionsComponentSpecs();

componentFabricSpecs();

moduleCoordinatorSpecs();
//# sourceMappingURL=unit.js.map
