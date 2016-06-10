(function () {
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

class ViewController {
  constructor(modulePrefix) {
    this.html = {};
    this.html.container = document.createElement('div');

    this.listeners = {};
    this.acceptEvents('destroy');

    this.modulePrefix = modulePrefix;
    this.cssPrefix = `${ this.modulePrefix }-${ this.constructor.name }`;
    this.html.container.classList.add(this.cssPrefix);
  }

  /**
   * Sets which events will be accepted.
   * @method acceptEvents
   * @param  {Array<String>} eventList
   * @return {void}
   */
  acceptEvents(...eventList) {
    for (const eventName of eventList) {
      this.listeners[eventName] = new Set();
    }
  }

  /**
   * @method on
   * @param  {function} fn
   * @param {String} event
   * @return {void}
   */
  on(event, fn) {
    assert(this.listeners[event], `Trying to listen to invalid event: ${ event }`);
    this.listeners[event].add(fn);
  }

  /**
   * @method removeListener
   * @param  {String} event
   * @param  {Function} fn
   * @return {void}
   */
  removeListener(event, fn) {
    assert(this.listeners[event], `Trying to remove listener from invalid event: ${ event }`);
    this.listeners[event].delete(fn);
  }

  /**
   * @method trigger
   * @param  {String} event
   */
  trigger(event) {
    this.listeners[event].forEach(fn => fn(this));
  }

  destroy() {
    this.html.container.remove();
    this.listeners = null;
    this.html = {};
  }

  getHtmlContainer() {
    return this.html.container;
  }
}

function createSwitch(labelText, modulePrefix) {
  const cssPrefix = `${ modulePrefix }-ui-switch`;

  const wrapper = document.createElement('label');
  wrapper.textContent = labelText;

  const switchElement = document.createElement('div');
  switchElement.classList.add(cssPrefix);

  const switchInput = document.createElement('input');
  switchInput.classList.add(`${ cssPrefix }-toggle`);
  switchInput.classList.add(`${ cssPrefix }-toggle-round`);
  switchInput.type = 'checkbox';
  switchInput.id = `${ cssPrefix }-${ Date.now() }`;
  wrapper.input = switchInput;
  switchElement.appendChild(switchInput);

  const switchLabel = document.createElement('label');
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
  const clickOutOfComponent = createClickOut(elements, callback);
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
  const x = e.clientX;
  const y = e.clientY;
  let isInsideAnyElement = false;

  for (const element of elements) {
    const elementBox = element.getBoundingClientRect();
    const top = elementBox.top;
    const bottom = elementBox.bottom;
    const right = elementBox.right;
    const left = elementBox.left;

    // If point is outside of the component
    if (x > left && right > x && bottom > y && y > top) {
      isInsideAnyElement = true;
      break;
    }
  }

  return isInsideAnyElement;
}

function blinkRed(el, modulePrefix) {
  if (!el || !el.classList) {
    return;
  }

  const blickClass = `${ modulePrefix }-blink-red`;
  el.classList.add(blickClass);
  setTimeout(() => {
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
  let lastCall = +new Date();
  const delay = FuncDelay;
  let params;
  const context = {};
  let calledDuringDelay = false;

  return (...args) => {
    const now = +new Date();
    const diff = now - lastCall;
    let timeToEndOfDelay;

    params = args;

    if (diff > delay) {
      callback.apply(context, params); // Call function with latest parameters
      calledDuringDelay = false;
      lastCall = now;
    } else if (!calledDuringDelay) {
      // If it wasn't called yet, call it when there is enough delay.
      timeToEndOfDelay = delay - diff;

      setTimeout(() => {
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
    el.style.transform = `translate3d(0, ${ val }px, 0)`; //  eslint-disable-line no-param-reassign
  }

  /**
   * @function resetElementsPositions
   * @param {Array<HTMLElement>} els Elements being tracked
   */
  function resetElementsPositions(els) {
    els.forEach(el => {
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
    let spaceOccupied;

    // If not the last element
    if (elIndex < els.length - 1) {
      const elTop = els[elIndex].getBoundingClientRect().top;
      const nextElTop = els[elIndex + 1].getBoundingClientRect().top;
      spaceOccupied = nextElTop - elTop;
    } else {
      // let's estimate the general vertical distance between elements by
      // subtracting the size of the first element from the distance between
      // its top and the next element.
      const firstElSpaceOccupied = els[1].getBoundingClientRect().top - els[0].getBoundingClientRect().top;
      const verticalDistance = firstElSpaceOccupied - els[0].clientHeight;
      const height = els[elIndex].clientHeight;
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
    const target = els[targetIndex];
    const targetInitialTop = tops[targetIndex];
    const targetHeight = calculateElementHeight(els, targetIndex);
    return function doDragMove() {
      const targetTop = target.getBoundingClientRect().top;
      const movedUp = targetTop < targetInitialTop;

      let i;
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
    const target = els[targetIndex];
    const doDragMove = createDragMover(els, tops, targetIndex);
    let shouldStopListening;
    function dragListener(e) {
      if (shouldStopListening) {
        return;
      }

      doDragMove();
      const newY = e.pageY;
      if (newY === 0) {
        return;
      } // correct weird behaviour when mouse goes up

      const diff = newY - initialY;
      setTranslation(target, diff);
    }

    dragListener.stop = () => {
      shouldStopListening = true;
    };

    return dragListener;
  }

  function getElementsCurrentTop(els) {
    const tops = [];
    els.forEach(el => {
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
    const target = els[targetIndex];
    const topsBeforeInsertion = getElementsCurrentTop(els);
    const targetTop = topsBeforeInsertion[targetIndex];
    let i = 0;

    // Pass by all elements that are above the target
    while (topsBeforeInsertion[i] && topsBeforeInsertion[i] < targetTop || i === targetIndex) {
      i++;
    }

    // Take away transitions from all elements and save them
    const initialTransitions = [];
    els.forEach(anEl => {
      initialTransitions.push(anEl.style.transition);
      anEl.style.transition = 'none'; // eslint-disable-line no-param-reassign
    });

    // Put everyone at translate3d(0,0,0) without transitions
    resetElementsPositions(els);

    // Add the element in the appropriate place. This will displace everyone else.
    const parent = els[i] ? els[i].parentElement : els[els.length - 1].parentElement;
    if (!parent || !parent.appendChild) {
      throw new Error('trackReorderDrag(): No parent found in element list.');
    } else if (els[i]) {
      parent.insertBefore(target, els[i]);
    } else {
      const lastEl = els[els.length - 1];
      parent.insertBefore(target, lastEl);
      parent.insertBefore(lastEl, target);
    }

    // Now let's translate it to where it was just before it was repositioned
    // All without transitions. It will seem like it never left that spot.
    const futureTop = target.getBoundingClientRect().top;
    const displacement = targetTop - futureTop;
    setTranslation(target, displacement);

    // Let's add a timeout to get the last place in the UI queue and let the
    // CSS renderer to process the fact that all these elements do not have
    // transitions and should appear wherever their coordinates say immediately.
    setTimeout(() => {
      // Restore all transitions
      els.forEach((anEl, k) => {
        anEl.style.transition = initialTransitions[k]; // eslint-disable-line no-param-reassign
      });

      // Now transition the target can transition smoothly from where it
      // was dropped to its final position at translate value 0.
      setTranslation(target, 0);
    }, 15);

    //  adjustElementsToTops(els, topsBeforeInsertion);
  }

  function init(e, el, elements) {
    if (typeof el !== 'object') {
      throw new Error('trackReorderDrag(): Invalid parameter');
    }

    // Reorder elements
    elements.sort((el1, el2) => {
      return el1.getBoundingClientRect().top > el2.getBoundingClientRect().top;
    });

    // Set initial states
    const initialTops = [];
    elements.forEach(element => {
      initialTops.push(element.getBoundingClientRect().top);
    });

    const elIndex = elements.indexOf(el);

    // Create throttled drag listener
    const initialY = e.pageY;
    const dragListener = createDragListener(elements, initialTops, elIndex, initialY);
    const throttledDragListener = throttle(50, dragListener);

    // Listen to drags
    const eventTarget = e.target;
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
  assert(typeof eventName === 'string', `Invalid event name: ${ eventName }`);
  const targetIsHtmlNode = targetElement && targetElement.appendChild;
  assert(targetIsHtmlNode, `Target element is not an HTML element: ${ eventName }`);

  const event = new CustomEvent(eventName, { detail: detailObj });
  targetElement.dispatchEvent(event);
}

var utils = {
  trackReorderDrag,
  createSwitch,
  onClickOut,
  fireEvent,
  blinkRed
};

/**
 * @abstract @class FormComponent
 */
class FormComponent extends ViewController {
  static getInfo() {
    return {
      description: 'General Component',
      iconClass: undefined,
      name: this.name
    };
  }

  constructor(modulePrefix) {
    super(modulePrefix);
    this.cssPrefix = `${ modulePrefix }-FormComponent`;
    this.html.container.classList.add(`${ modulePrefix }-FormComponent`);

    this.editables = new Set();
    this.isRequired = false;
    this.isConfigVisible = false;
    this.isDetroyed = false;
    this.lastState = null;

    this.acceptEvents('destroy', 'change');

    // Focused on config show
    this.focusElement = null;
    this.buildHtml();
    this.setRequired(false);
  }

  buildHtml() {
    const frag = document.createDocumentFragment();

    // -- Content --
    this.html.content = document.createElement('div');
    this.html.content.classList.add(`${ this.cssPrefix }-content`);
    frag.appendChild(this.html.content);

    this.html.title = document.createElement('h3');
    this.html.title.innerText = 'Add a title';
    this.addEditable(this.html.title);
    this.html.content.appendChild(this.html.title);

    // -- Configuration --
    this.html.configuration = document.createElement('div');
    const configurationCssClass = `${ this.cssPrefix }-configuration`;
    this.html.configuration.classList.add(configurationCssClass);
    frag.appendChild(this.html.configuration);

    const configurationButtons = document.createElement('div');
    configurationButtons.classList.add(`${ this.cssPrefix }-configuration-buttons`);
    this.html.configuration.appendChild(configurationButtons);

    this.html.requiredSwitch = utils.createSwitch('Required', this.modulePrefix);
    this.html.requiredSwitch.classList.add(`${ configurationCssClass }-switch-required`);
    this.html.requiredSwitch.addEventListener('change', e => {
      const checked = e.target.checked;
      this.setRequired(checked);
    });
    configurationButtons.appendChild(this.html.requiredSwitch);

    const okBtn = document.createElement('button');
    okBtn.classList.add(`${ configurationCssClass }-btn-ok`, 'btn', // Bootstrap
    'btn-sm', 'btn-default', 'glyphicon', // Font-awesome
    'glyphicon-ok');
    okBtn.type = 'button';
    okBtn.addEventListener('click', () => {
      this.configToggle();
    });
    configurationButtons.appendChild(okBtn);

    // -- Sidebar --
    this.html.sidebar = document.createElement('div');
    const sidebarCssClass = `${ this.cssPrefix }-sidebar`;
    this.html.sidebar.classList.add(sidebarCssClass);
    frag.appendChild(this.html.sidebar);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('glyphicon', 'glyphicon-trash');
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('click', () => this.destroy());
    this.addSidebarButton(deleteBtn, 'delete');

    const showConfigBtn = document.createElement('button');
    showConfigBtn.type = 'button';
    showConfigBtn.classList.add('glyphicon', // Font-awesome
    'glyphicon-cog');
    showConfigBtn.title = 'Configure form group';
    this.addSidebarButton(showConfigBtn, 'config');

    showConfigBtn.addEventListener('click', () => {
      this.configToggle();
    });

    this.html.container.appendChild(frag);
  }

  addSidebarButton(button, elementName) {
    const className = elementName ? `${ this.cssPrefix }-sidebar-btn-${ elementName }` : `${ this.cssPrefix }-sidebar-btn`;
    button.classList.add(className);
    this.html.sidebar.insertBefore(button, this.html.sidebar.children[0]);
  }

  /**
   * @method addEditable
   * @param  {HTMLElement} element
   */
  addEditable(element) {
    element.classList.add(`${ this.cssPrefix }-editable`);
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
  enableEditing(enable = true) {
    this.editables.forEach(element => {
      element.setAttribute('contenteditable', enable);
    });
  }

  /**
   * @method configToggle
   * @param  {Boolean} forceState Optional parameter to force a state.
   * @return {void}
   */
  configToggle(newState = !this.isConfigVisible) {
    this.isConfigVisible = newState;
    if (!newState) {
      // hide
      this.html.container.classList.remove(`${ this.cssPrefix }--configuration-visible`);
      this.enableEditing(false);
      this.triggerChangeIfNeeded();
    } else {
      // show
      this.html.container.classList.add(`${ this.cssPrefix }--configuration-visible`);
      this.enableEditing(true);

      // hide on clickOut
      utils.onClickOut([this.html.container, this.html.configuration], () => {
        if (this.isConfigVisible && !this.isDetroyed) {
          this.configToggle();
        }
      });
      this.focus();
    }
  }

  // Focus on the appropriate element
  focus() {
    if (this.focusElement) {
      // NOTE: There is a bug that for some reason it doesn't focus if you just
      // call focus() straight away. setTimeout solves it.
      // see http:// goo.gl/UjKOk5
      setTimeout(() => {
        this.focusElement.focus();
      }, 15);
    }
  }

  destroy() {
    if (this.isDetroyed) {
      return;
    }
    this.isDetroyed = true;
    this.trigger('destroy');
    super.destroy();
  }

  /**
   * @method setRequired
   * @param  {Boolean} required
   */
  setRequired(required) {
    this.isRequired = !!required;
    this.html.requiredSwitch.input.checked = !!required;
  }

  /**
   * Exports the information of a component in one object
   * @method exportState
   * @return {Object}
   */
  exportState() {
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
  importState(state) {
    assert(state.type === this.constructor.name, `Importing incompatible state. Expected ${ this.constructor.name }, got ${ state.type }`);
    this.html.title.textContent = state.title;
    this.setRequired(state.required);
  }

  /**
   * Triggers the change event if any change happened.
   * @method triggerChangeIfNeeded
   * @return {void}
   */
  triggerChangeIfNeeded() {
    const currentState = this.exportState();
    const currStateJson = JSON.stringify(currentState);

    const lastStateJson = JSON.stringify(this.lastState);
    const changeHappened = lastStateJson !== currStateJson;
    if (changeHappened && this.lastState !== null) {
      this.trigger('change');
    }
    this.lastState = currentState;
  }
}

/**
 * @class ControlBar
 */
class ComponentsContainer extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);

    // This is kept in the order they appear on screen.
    this.components = [];

    // Used with component.ondestroy;
    // This must be here and not together with other class methods because
    // of the binding of 'this'
    this.componentDestroyListener = component => {
      this.deleteComponent(component);
      this.trigger('change');
    };

    this.acceptEvents('change');
    Object.preventExtensions(this);
  }

  /**
   * @method addComponent
   * @param  {FormComponent} component
   * @param  {Boolean} showConfig
   */
  addComponent(component, showConfig = true) {
    assert(component instanceof FormComponent, 'Invalid component being added. No an instance of Component.');
    this.components.push(component);
    this.html.container.appendChild(component.getHtmlContainer());
    component.on('destroy', this.componentDestroyListener);

    this.addDragButtonToComponent(component);
    component.configToggle(showConfig);
    component.on('change', () => this.trigger('change'));
  }

  addDragButtonToComponent(component) {
    const dragBtn = document.createElement('button');
    dragBtn.type = 'button';
    dragBtn.title = 'Drag to reorder';
    dragBtn.setAttribute('draggable', true);
    dragBtn.classList.add('glyphicon', // Font-awesome
    'glyphicon-menu-hamburger');

    const draggingClass = `${ this.modulePrefix }--dragging`;
    dragBtn.addEventListener('dragstart', e => {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      if (this.components.length < 2) {
        return;
      }

      const container = component.getHtmlContainer();
      const containersArray = this.components.map(c => c.getHtmlContainer());

      container.classList.add(draggingClass);

      // Take care of moving and reordering
      utils.trackReorderDrag(e, container, containersArray);
    });

    dragBtn.addEventListener('dragend', () => {
      const container = component.getHtmlContainer();
      setTimeout(() => container.classList.remove(draggingClass), 250);

      // Reorder components according to their position.
      const beforeReordering = JSON.stringify(this.components);
      this.components.sort((el1, el2) => {
        return el1.getHtmlContainer().getBoundingClientRect().top > el2.getHtmlContainer().getBoundingClientRect().top;
      });

      // Trigger change if elements were reordered
      const afterReordering = JSON.stringify(this.components);
      if (beforeReordering !== afterReordering) {
        this.trigger('change');
      }
    });

    component.addSidebarButton(dragBtn);
  }

  getAllComponents() {
    return Array.from(this.components);
  }

  deleteComponent(component) {
    const componentIndex = this.components.indexOf(component);
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
  deleteAllComponents() {
    // NOTE: we create a new array because deleteComponent modifies
    // 'this.components', so we would have problems as we are
    // iterating trough an array being modified.
    const components = Array.from(this.components);
    for (const comp of components) {
      this.deleteComponent(comp);
    }
  }

  /**
   * Erases all components and inserts a new component group.
   * @method setComponents
   * @param  {Array<FormComponent>} components
   * @return {void}
   */
  setComponents(components) {
    this.deleteAllComponents();
    components.forEach(comp => this.addComponent(comp, false));
  }
}

class OptionsComponent extends FormComponent {
  static getInfo() {
    const info = super.getInfo();
    info.group = 'Options Components';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix);
    this.html.options = [];
  }

  /**
   * In addition to building the standard html structure, it adds
   * a field to add an option.
   * @method buildHtml
   * @return {void}
   */
  buildHtml() {
    super.buildHtml();

    const optionsConfig = document.createElement('div');
    const optionsConfigCssClass = `${ this.cssPrefix }-configuration-options`;
    optionsConfig.classList.add(optionsConfigCssClass);

    if (this.html.configuration.children[0]) {
      this.html.configuration.insertBefore(optionsConfig, this.html.configuration.children[0]);
    } else {
      this.html.configuration.appendChild(optionsConfig);
    }

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.title = 'Remove last option';
    removeBtn.classList.add('glyphicon-minus-sign', 'glyphicon', `${ optionsConfigCssClass }-btn-remove`);
    removeBtn.addEventListener('click', () => this.removeOption());
    optionsConfig.appendChild(removeBtn);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.title = 'Add new option';
    addBtn.classList.add('glyphicon-plus-sign', 'glyphicon', `${ optionsConfigCssClass }-btn-add`);
    addBtn.addEventListener('click', () => this.submitOptionFromConfigBar());
    optionsConfig.appendChild(addBtn);

    this.html.newOptionText = document.createElement('input');
    this.html.newOptionText.setAttribute('placeholder', 'Type a new option');
    this.html.newOptionText.setAttribute('type', 'text');
    this.html.newOptionText.classList.add(`${ optionsConfigCssClass }-input`);
    this.focusElement = this.html.newOptionText;
    optionsConfig.appendChild(this.html.newOptionText);
    this.html.newOptionText.addEventListener('keypress', e => {
      if (e.which === 13) {
        const click = new Event('click');
        addBtn.dispatchEvent(click);
        e.preventDefault();
        return false; //  returning false will prevent the event from bubbling up.
      }
      return true;
    });

    this.focus();
  }

  submitOptionFromConfigBar() {
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
   * @param  {Stirng} optionType
   */
  addOption(text, optionType) {
    const newOption = document.createElement('div');
    newOption.classList.add(`${ this.cssPrefix }-option`);

    const optionCheckbox = document.createElement('input');
    optionCheckbox.type = optionType;
    newOption.appendChild(optionCheckbox);

    const optionText = document.createElement('span');
    optionText.classList.add(`${ this.cssPrefix }-option-text`);
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
  removeOption() {
    const optionToRemove = this.html.options.pop();
    if (optionToRemove) {
      optionToRemove.remove();
    }
  }

  /**
   * @override @method exportState
   * @return {Object}
   */
  exportState() {
    const output = super.exportState();
    output.options = this.html.options.map(o => o.textContent);
    return output;
  }

  /**
   * @override @method importState
   * @return {void}
   */
  importState(state) {
    super.importState(state);
    const optionCount = this.html.options.length;
    for (let i = 0; i < optionCount; i++) {
      this.removeOption();
    }
    state.options.forEach(o => this.addOption(o));
  }
}

class RadioBtns extends OptionsComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Radio Buttons';
    info.iconClass = 'glyphicon glyphicon-ok-circle';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix);
    Object.preventExtensions(this);
    this.addOption('Insert an option');
  }

  /**
   * @override @method addOption
   * @param  {String} text
   */
  addOption(text) {
    super.addOption(text, 'radio');
  }
}

class Checkboxes extends OptionsComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Checkboxes';
    info.iconClass = 'glyphicon glyphicon-check';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix);
    Object.preventExtensions(this);
    this.addOption('Insert an option');
  }

  /**
   * @override @method addOption
   * @param  {String} text
   */
  addOption(text) {
    super.addOption(text, 'checkbox');
  }
}

class Dropdown extends OptionsComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Dropdown';
    info.iconClass = 'glyphicon glyphicon-collapse-down';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix);
    Object.preventExtensions(this);

    // Create placeholder
    this.addOption('Select an option');
    this.html.options[0].disabled = true;
    this.html.options[0].selected = true;
  }

  buildHtml() {
    super.buildHtml();
    this.buildComponent();
    this.buildComponentSpecificConfiguration();
  }

  buildComponent() {
    const dropdown = document.createElement('select');
    dropdown.setAttribute('multiple', true);
    dropdown.classList.add(`${ this.cssPrefix }-${ this.constructor.name }`, 'form-control' // Bootstrap
    );

    this.html.dropdown = dropdown;
    this.focusElement = dropdown;
    this.html.content.appendChild(dropdown);
  }

  buildComponentSpecificConfiguration() {
    const newOptionDisabledWrapper = document.createElement('label');

    const newOptionDisabled = document.createElement('input');
    newOptionDisabled.classList.add(`${ this.cssPrefix }-configuration-options-optionDisabled`);
    newOptionDisabled.type = 'checkbox';
    newOptionDisabledWrapper.appendChild(newOptionDisabled);
    newOptionDisabledWrapper.appendChild(document.createTextNode('Divider'));

    const optionConfig = this.html.configuration.children[0];
    this.html.newOptionDisabled = newOptionDisabled;
    optionConfig.appendChild(newOptionDisabledWrapper);
  }

  submitOptionFromConfigBar() {
    if (!this.html.newOptionText.value.trim()) {
      utils.blinkRed(this.html.newOptionText, this.modulePrefix);
      return;
    }
    this.addOption(this.html.newOptionText.value, this.html.newOptionDisabled.checked);
    this.html.newOptionDisabled.checked = false;
    this.html.newOptionText.value = '';
    this.triggerChangeIfNeeded();
  }

  addOption(text, disabled = false) {
    const newOption = document.createElement('option');
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
  enableEditing(enable = true) {
    super.enableEditing(enable);
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
  exportState() {
    const output = super.exportState();
    output.disabledIndexes = [];
    this.html.options.forEach((o, index) => {
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
  importState(state) {
    super.importState(state);
    for (const disabledIndex of state.disabledIndexes) {
      this.html.options[disabledIndex].setAttribute('disabled', true);
    }
  }
}

/**
 * @abstract @class TextComponent
 */
class TextComponent extends FormComponent {
  static getInfo() {
    const info = super.getInfo();
    info.group = 'Text Components';
    return info;
  }

  constructor(modulePrefix, tagName, fieldType = 'text') {
    super(modulePrefix);
    this.fieldType = fieldType;
    this.buildComponent(tagName, fieldType);

    this.focus();
  }

  buildComponent(tagName, fieldType) {
    const textElement = document.createElement(tagName);
    textElement.type = fieldType;

    textElement.classList.add(`${ this.cssPrefix }-${ this.constructor.name }`, 'form-control' // Bootstrap
    );
    this.html.textElement = textElement;
    this.focusElement = textElement;
    this.html.content.appendChild(textElement);

    this.setPlaceholder('Insert a placeholder text');
  }

  /**
   * @override @method enableEditing
   * @param  {Boolean} enable
   * @return {void}
   */
  enableEditing(enable = true) {
    super.enableEditing(enable);
    if (!this.html.textElement) {
      return;
    }
    if (enable) {
      this.html.textElement.value = this.getPlaceholder();
      this.html.textElement.type = 'text';
      return;
    }
    if (this.html.textElement.value) {
      this.setPlaceholder(this.html.textElement.value);
    }
    this.html.textElement.type = this.fieldType;
    this.html.textElement.value = '';
  }

  setPlaceholder(text) {
    if (this.isConfigVisible) {
      this.html.textElement.value = text;
    }
    this.html.textElement.setAttribute('placeholder', text);
  }

  getPlaceholder() {
    return this.html.textElement.getAttribute('placeholder');
  }

  /**
   * @override @method exportState
   * @return {Object}
   */
  exportState() {
    const output = super.exportState();
    output.placeholder = this.getPlaceholder();
    return output;
  }

  /**
   * @override @method importState
   * @param  {Object} state
   * @return {void}
   */
  importState(state) {
    super.importState(state);
    this.setPlaceholder(state.placeholder);
  }
}

class TextBox extends TextComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Text Box';
    info.iconClass = 'glyphicon glyphicon-text-width';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix, 'input', 'text');
  }
}

class TextArea extends TextComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Text Area';
    info.iconClass = 'glyphicon glyphicon-text-height';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix, 'textarea');
  }

  /**
   * @override @method buildComponent
   */
  buildComponent(...args) {
    super.buildComponent(...args);
    this.html.textElement.setAttribute('rows', 5);
  }
}

class EmailBox extends TextComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Email Box';
    info.iconClass = 'glyphicon glyphicon-envelope';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix, 'input', 'email');
  }
}

class TelephoneBox extends TextComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Telephone Box';
    info.iconClass = 'glyphicon glyphicon-earphone';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix, 'input', 'tel');
  }
}

class NumberBox extends TextComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Number Box';
    info.iconClass = 'glyphicon glyphicon-subscript';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix, 'input', 'number');
  }
}

/**
 * @class ControlBar
 */
class ComponentFabric {
  constructor(modulePrefix) {
    this.modulePrefix = modulePrefix;
    this.componentConstructors = [RadioBtns, Checkboxes, Dropdown, TextBox, EmailBox, TelephoneBox, NumberBox, TextArea];

    Object.preventExtensions(this);
  }

  /**
   * @method createComponent
   * @param  {String} componentName
   * @return {Component}
   */
  createComponent(componentName) {
    const Comp = this.componentConstructors.find(c => c.getInfo().name === componentName);
    assert(Comp, `Invalid component: ${ componentName }`);
    return new Comp(this.modulePrefix);
  }

  /**
   * @method getComponentTypes
   * @return {Array<Object>}
   */
  getComponentTypes() {
    const types = this.componentConstructors.map(component => component.getInfo());
    return types;
  }
}

/**
 * @class ControlBar
 */
class ControlBar extends ViewController {
  constructor(modulePrefix, moduleCoordinator) {
    super(modulePrefix);
    this.moduleCoordinator = moduleCoordinator;
    Object.preventExtensions(this);
    this.buildHtml();
  }

  buildHtml() {
    const componentGroups = {};
    const componentTypes = this.moduleCoordinator.getComponentTypes();

    // Create component buttons
    for (const component of componentTypes) {
      componentGroups[component.group] = componentGroups[component.group] || [];
      componentGroups[component.group].push(component);
    }

    const componentsBtnGroups = createButtonGroup();
    const buttonsClass = `${ this.cssPrefix }-button-component`;
    for (const group of Object.keys(componentGroups)) {
      const dropdown = createDropdown(group, componentGroups[group], buttonsClass);
      componentsBtnGroups.appendChild(dropdown);
    }

    // Add listeners to all component creation buttons
    componentsBtnGroups.querySelectorAll(`.${ buttonsClass }`).forEach(btn => {
      btn.addEventListener('click', () => {
        this.moduleCoordinator.createComponent(btn.name);
      });
    });

    const actionsBtnGroup = createButtonGroup();
    // Create Save button
    const saveBtn = document.createElement('button');
    saveBtn.className = `${ this.cssPrefix }-button-save`;
    saveBtn.classList.add('btn', // Bootstrap
    'btn-primary');
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => this.moduleCoordinator.save());
    actionsBtnGroup.appendChild(saveBtn);

    // Create Import button
    const undoBtn = document.createElement('button');
    undoBtn.className = `${ this.cssPrefix }-button-save`;
    undoBtn.classList.add('btn', 'btn-default'); // Bootstrap
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => {
      const undoSuccess = this.moduleCoordinator.popHistoryState();
      if (!undoSuccess) {
        utils.blinkRed(undoBtn, this.modulePrefix);
      }
    });
    actionsBtnGroup.appendChild(undoBtn);

    this.html.container.appendChild(componentsBtnGroups);
    this.html.container.appendChild(actionsBtnGroup);
  }
}

function createButtonGroup() {
  const group = document.createElement('div');
  group.classList.add('btn-group');
  group.setAttribute('role', 'group');
  return group;
}

function createDropdown(buttonName, subButtons, subButtonsClass) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('btn', // Bootstrap
  'btn-default', 'fl-fb-ControlBar-dropdown');

  const mainButton = document.createElement('label');
  mainButton.classList.add('fl-fb-ControlBar-dropdown-checkbox-label');
  mainButton.textContent = buttonName;
  wrapper.appendChild(mainButton);

  const arrowDown = document.createElement('span');
  arrowDown.classList.add('caret');
  mainButton.appendChild(arrowDown);

  const list = document.createElement('ul');
  list.classList.add('fl-fb-ControlBar-dropdown-content');

  for (const buttonInfo of subButtons) {
    const listItem = document.createElement('li');
    const clickable = document.createElement('a');
    clickable.name = buttonInfo.name;
    clickable.textContent = buttonInfo.description;
    clickable.classList.add(subButtonsClass);

    listItem.appendChild(clickable);
    list.appendChild(listItem);
  }

  wrapper.appendChild(list);
  return wrapper;
}

const MAX_HISTORY_STATES = 15;
/**
 * This class takes care of storing forms in local storage
 * as well as sending it to the database, and keeping intermediate states
 * so as to add the undo function.
 * @class Storage
 */
class Storage {
  constructor() {
    this.currentState = null;
    this.history = [];
    Object.preventExtensions(this);
  }

  pushHistoryState(state) {
    assert(state, `Invalid state being saved: ${ state }`);
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
  popHistoryState() {
    if (this.history.length > 0) {
      this.currentState = this.history.pop();
      return this.currentState;
    }
    return undefined;
  }
}

/**
 * The module coordinator contains all of the methods the consumer of the
 * application will need.
 * @class Coordinator
 */
class ModuleCoordinator {
  constructor(modulePrefix, htmlContainer) {
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

  getComponentTypes() {
    return this.componentFabric.getComponentTypes();
  }

  createComponent(compName) {
    const newComponent = this.componentFabric.createComponent(compName);
    this.componentsContainer.addComponent(newComponent);
    this.pushHistoryState();
  }

  save() {
    const content = this.exportState();
    utils.fireEvent(this.htmlContainer, 'formBuilderSave', { formState: content });
  }

  /**
   * Use this method to get the current state of the application
   * @method exportState
   * @param {void}
   * @return {Array<Object>} An array of objects that represents the current
   * state of the application and which can be used to restore the application to that state.
   */
  exportState() {
    const components = this.componentsContainer.getAllComponents();
    const outcome = [];
    for (const component of components) {
      outcome.push(component.exportState());
    }
    return outcome;
  }

  /**
   * Use this function to import a past saved state
   * @method importState
   * @param  {Array<Object>} state - A state obtained previsously obtained.
   * @return {void}
   */
  importState(state = this.exportState(), registerInHistory = true) {
    this.componentsContainer.deleteAllComponents();

    const components = [];
    state.forEach(componentState => {
      const component = this.componentFabric.createComponent(componentState.type);
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
  pushHistoryState() {
    const currentState = this.exportState();
    this.storage.pushHistoryState(currentState);
  }

  /**
   * Undo function
   * @private
   * @method popHistoryState
   * @return {Boolean} success
   */
  popHistoryState() {
    const lastState = this.storage.popHistoryState();
    if (lastState) {
      this.importState(lastState, false);
      return true;
    }
    return false;
  }
}

const MODULE_PREFIX = 'fl-fb';

xController(xdiv => {
  xdiv.classList.add(MODULE_PREFIX);
  const coordinator = new ModuleCoordinator(MODULE_PREFIX, xdiv);
  const jsonStateToRestore = xdiv.dataset.restoreState;
  if (jsonStateToRestore) {
    try {
      const stateToRestore = JSON.parse(jsonStateToRestore);
      coordinator.importState(stateToRestore);
    } catch (e) {
      assert.warn(e);
    }
  }

  utils.fireEvent(xdiv, 'formBuilderLoaded', { instance: coordinator });
  return coordinator;
});
}());
//# sourceMappingURL=fl-form-builder.js.map
