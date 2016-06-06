var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
babelHelpers;

function blinkRed(el) {
  if (!el || !el.classList) {
    return;
  }

  el.classList.add('fl-blink-red');
  setTimeout(function () {
    el.classList.remove('fl-blink-red');
  }, 1500);
};

/**
 * Will take care of the dragging and reordering a list for one drag.
 * @function trackReorderDrag
 * @param  {event} param_e        The dragstart event, from which this should be called.
 * @param  {HTMLElement} param_el       The main Element being dragged
 * @param  {Array} param_elements Array of elements to be tracked.
 * @return {void}
 */
function trackReorderDrag(param_e, param_el, param_elements) {

  function setTranslation(el, val) {
    el.style.transform = 'translate3d(0, ' + val + 'px, 0)';
  }

  /**
   * @function resetElementsPositions
   * @param {Array[HTMLElement]} els Elements being tracked
   */
  function resetElementsPositions(els) {
    els.forEach(function (el) {
      setTranslation(el, 0);
    });
  }

  /**
   * @function calculateElementHeight
   * @param  {Array[HTMLElement]} els    Elements ordered by vertical position
   * @param  {Integer} elIndex
   * @return {void}
   */
  function calculateElementHeight(els, elIndex) {
    var spaceOccupied;

    //If not the last element
    if (elIndex < els.length - 1) {
      var elTop = els[elIndex].getBoundingClientRect().top;
      var nextElTop = els[elIndex + 1].getBoundingClientRect().top;
      spaceOccupied = nextElTop - elTop;
    } else {
      //let's estimate the general vertical distance between elements by
      //subtracting the size of the first element from the distance between
      //its top and the next element.
      var firstElSpaceOccupied = els[1].getBoundingClientRect().top - els[0].getBoundingClientRect().top;
      var verticalDistance = firstElSpaceOccupied - els[0].clientHeight;
      var height = els[elIndex].clientHeight;
      spaceOccupied = height + verticalDistance;
    }

    return spaceOccupied;
  }

  /**
   * @function createDragMover
   * @param  {Array[HTMLElements]} els         [description]
   * @param  {Array[Integer]} tops        Initial tops
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

      var i;
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
    var targetInitialTop = target.getBoundingClientRect().top;
    var doDragMove = createDragMover(els, tops, targetIndex);
    var shouldStopListening;
    function dragListener(e) {
      if (shouldStopListening) {
        return;
      }

      doDragMove();
      var newY = e.pageY;
      if (newY === 0) {
        return;
      } //correct weird behaviour when mouse goes up

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

  function adjustElementsToTops(els, tops) {
    var currentTops = getElementsCurrentTop(els);
    els.forEach(function (el, i) {
      var diff = currentTops[i] - tops[i];
      setTranslation(el, diff);
    });
  }

  function insertTargetInRightPlace(els, initialTops, targetIndex) {
    var target = els[targetIndex];
    var topsBeforeInsertion = getElementsCurrentTop(els);
    var targetTop = topsBeforeInsertion[targetIndex];
    var i = 0;

    //Pass by all elements that are above the target
    while (topsBeforeInsertion[i] && topsBeforeInsertion[i] < targetTop || i === targetIndex) {
      i++;
    }

    var indexToInsertEl = i > targetIndex ? i - 1 : i;

    //Take away transitions from all elements and save them
    var initialTransitions = [];
    els.forEach(function (anEl) {
      initialTransitions.push(anEl.style.transition);
      anEl.style.transition = 'none';
    });

    //Put everyone at translate3d(0,0,0) without transitions
    resetElementsPositions(els);

    //Add the element in the appropriate place. This will displace everyone else.
    var parent;
    parent = els[i] ? els[i].parentElement : els[els.length - 1].parentElement;
    if (!parent || !parent.appendChild) {
      throw new Error('trackReorderDrag(): No parent found in element list.');
    } else if (els[i]) {
      parent.insertBefore(target, els[i]);
    } else {
      var lastEl = els[els.length - 1];
      parent.insertBefore(target, lastEl);
      parent.insertBefore(lastEl, target);
    }

    //Now let's translate it to where it was just before it was repositioned
    //All without transitions. It will seem like it never left that spot.
    var futureTop = target.getBoundingClientRect().top;
    var displacement = targetTop - futureTop;
    setTranslation(target, displacement);

    //Let's add a timeout to get the last place in the UI queue and let the
    //CSS renderer to process the fact that all these elements do not have
    //transitions and should appear wherever their coordinates say immediately.
    setTimeout(function () {

      //Restore all transitions
      els.forEach(function (anEl, k) {
        anEl.style.transition = initialTransitions[k];
      });

      //Now transition the target can transition smoothly from where it
      //was dropped to its final position at translate value 0.
      setTranslation(target, 0);
    }, 15);

    // adjustElementsToTops(els, topsBeforeInsertion);
  }

  function init(e, el, elements) {
    if ((typeof el === 'undefined' ? 'undefined' : babelHelpers.typeof(el)) !== 'object') {
      throw new Error('trackReorderDrag(): Invalid parameter');
    }

    //Reorder elements
    elements.sort(function (el1, el2) {
      return el1.getBoundingClientRect().top > el2.getBoundingClientRect().top;
    });

    //Set initial states
    var initialTops = [];
    elements.forEach(function (element) {
      initialTops.push(element.getBoundingClientRect().top);
    });

    var elIndex = elements.indexOf(el);
    var elInitialTop = initialTops[elIndex];

    //Create throttled drag listener
    var initialY = e.pageY;
    var dragListener = createDragListener(elements, initialTops, elIndex, initialY);
    var throttledDragListener = utils.throttle(50, dragListener);

    //Listen to drags
    var eventTarget = e.target;
    eventTarget.addEventListener('drag', throttledDragListener);
    eventTarget.addEventListener('dragend', function dragEndListener() {
      dragListener.stop();
      insertTargetInRightPlace(elements, initialTops, elIndex);
      eventTarget.removeEventListener('drag', throttledDragListener);
      eventTarget.removeEventListener('dragend', dragEndListener);
    });
  }

  init(param_e, param_el, param_elements);
};

/**
 * @function throttle
 * @param  {integer}   FuncDelay
 * @param  {Function} callback
 * @return {Function}                  the throttled function
 */
function throttle(FuncDelay, callback) {
  var lastCall = +new Date();
  var delay = FuncDelay;
  var params;
  var context = {};
  var calledDuringDelay = false;

  return function () {
    var now = +new Date();
    var diff = now - lastCall;
    var timeToEndOfDelay;

    params = arguments;

    if (diff > delay) {
      callback.apply(context, params); //Call function with latest parameters
      calledDuringDelay = false;
      lastCall = now;
    } else if (!calledDuringDelay) {
      // If it wasn't called yet, call it when there is enough delay.
      timeToEndOfDelay = delay - diff;

      setTimeout(function () {
        callback.apply(context, params); //Call function with latest parameters
      }, timeToEndOfDelay);

      calledDuringDelay = true;
      lastCall = now + timeToEndOfDelay;
    } // Otherwise do nothing.
  };
};

var utils$1 = {
  blinkRed: blinkRed,
  listReorder: trackReorderDrag,
  throttle: throttle
};

function FormBody() {
  'use strict';

  if (!(this instanceof FormBody)) {
    return new FormBody();
  }

  var form;
  var submitBtn;
  var components = [];

  function getAllComponents() {
    var comps = form.querySelectorAll('.fl-component');
    return [].slice.call(comps);
  }

  function addReorderButton(comp) {
    var controls = comp.element.querySelector('.fl-component-side-control');
    if (!controls) {
      throw new Error('FormBody.addReorderButton(): No side control bar defined');
    }

    var dragBtn = document.createElement('i');
    dragBtn.classList.add('glyphicon', 'glyphicon-menu-hamburger');
    dragBtn.setAttribute('draggable', true);
    dragBtn.title = 'Drag to reorder';

    dragBtn.addEventListener('dragstart', function (e) {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      comp.element.classList.add('fl-dragging');

      //Take care of moving and reordering
      var elements = getAllComponents();
      utils$1.trackReorderDrag(e, comp.element, elements);
    });

    var throttleDelay = 50;
    dragBtn.addEventListener('dragend', function () {
      setTimeout(function () {
        comp.element.classList.remove('fl-dragging');
      }, throttleDelay + 200);
    });

    //prepend to side control bar
    if (controls.children.length > 0) {
      controls.insertBefore(dragBtn, controls.children[0]);
    } else {
      controls.appendChild(dragBtn);
    }
  }

  this.addComponent = function addComponent(comp) {
    if (!form) {
      console.error('FormBody: Form not initialised.');
      return;
    } else if (!comp) {
      console.error('FormBody: No element to be added included.');
      return;
    } else {
      addReorderButton(comp);
      components.push(comp);
      form.insertBefore(comp.element, submitBtn);
      comp.configToggle(true);
    }
  };

  this.removeComponent = function removeComponent(comp) {
    var compIndex = components.indexOf(comp);
    if (compIndex < 0) {
      throw new Error('FormBody.removeComponent(): ' + 'Component being destroyed is not registered in FormBody.');
    }

    components.splice(compIndex, 1);
    comp.destroy();
  };

  this.init = function () {
    form = document.createElement('form');
    form.classList.add('form-horizontal', 'fl-form-body');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Submit button clicked.');

      //Reorder components array according to their vertical position
      components.sort(function (com1, com2) {
        return com1.element.getBoundingClientRect().top > com2.element.getBoundingClientRect().top;
      });

      // NOTE: Components are prepared to expose the appropriate values
      // when stringified. To export them they need to be stringified.
      var readyToExport = JSON.stringify(components);
      console.dir(JSON.parse(readyToExport));

      //For now let's emmit an event with the result.
      var ev = new CustomEvent('formSubmitted', { detail: { json: readyToExport },
        bubbles: true,
        cancelable: true
      });

      this.dispatchEvent(ev);
    });

    var _this = this;

    //Listen to new components being created
    form.addEventListener('addComponent', function (e) {
      if (!e.detail) {
        throw new Error('No data in "newElement" event.');
      }

      _this.addComponent(e.detail.comp);
    });

    //Listen to delete buttons being pressed
    form.addEventListener('removeComponent', function (e) {
      if (!e.detail) {
        throw new Error('No data in "removeElement" event.');
      }

      _this.removeComponent(e.detail.comp);
    });

    submitBtn = document.createElement('input');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.classList.add('btn', 'col-sm-12');
    form.appendChild(submitBtn);
    this.element = form;
  };

  this.init();
}

/**
 * Parent class for form components
 * @abstract
 * @class FormComponent
 */
function FormComponent() {
  if (!(this instanceof FormComponent)) {
    return new FormComponent();
  }
}

FormComponent.prototype.init = function init(name) {
  if (typeof name !== 'string') {
    throw new Error('FormComponent: ' + name + ' is not a valid "name" parameter.');
  }

  //Create wrapper element
  this.element = document.createElement('div');
  this.element.classList.add('fl-component', 'col-md-12', 'form-group');

  //Create div where content will go
  this.content = document.createElement('div');
  this.content.classList.add('fl-form-content');
  this.element.appendChild(this.content);

  //Create a title
  var title = document.createElement('h3');
  title.innerText = 'Add a title';
  title.classList.add('fl-editable');
  this.title = title;
  this.content.appendChild(title);

  this.name = name;
  this.isRequired = false;
  this.createControls();
};

/**
 * Creates the config box
 * @method createControls
 * @return {void}
 */
FormComponent.prototype.createControls = function createControls() {

  //Create side control bar -----------------------------
  var controls = document.createElement('div');
  controls.classList.add('fl-component-side-control');

  var moreConfigBtn = document.createElement('button');
  moreConfigBtn.setAttribute('type', 'button');
  moreConfigBtn.classList.add('glyphicon', 'glyphicon-cog');
  moreConfigBtn.title = 'Configure form group';
  controls.appendChild(moreConfigBtn);

  var _this = this;
  moreConfigBtn.addEventListener('click', function () {
    _this.configToggle();
  });

  //Create configuration box -----------------------------
  var configBox = document.createElement('div');
  configBox.classList.add('fl-component-config');
  this.configBox = configBox;

  //Component-specific content wrapper
  var configContent = document.createElement('div');
  configContent.classList.add('full-width');
  this.configContent = configContent;
  configBox.appendChild(configContent);

  //Bottom buttons container
  var buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('col-sm-12');

  var deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.setAttribute('name', 'delete');
  deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'fl-bottom-btn', 'glyphicon', 'glyphicon-trash');
  deleteBtn.addEventListener('click', function () {
    var ev = new CustomEvent('removeComponent', {
      detail: { comp: _this },
      bubbles: true,
      cancelable: true
    });

    _this.element.dispatchEvent(ev);
  });

  buttonsContainer.appendChild(deleteBtn);

  var okBtn = document.createElement('button');
  okBtn.setAttribute('type', 'button');
  okBtn.setAttribute('name', 'ok');
  okBtn.classList.add('btn', 'btn-default', 'btn-sm', 'fl-bottom-btn', 'glyphicon', 'glyphicon-ok');
  okBtn.addEventListener('click', function () {
    _this.saveConfig();
    _this.configToggle();
  });

  buttonsContainer.appendChild(okBtn);
  var requiredLabel = document.createElement('label');
  requiredLabel.innerText = 'Required';

  //Switch for whether the field is required or not.
  var requiredSwitch = document.createElement('div');
  requiredSwitch.classList.add('switch');

  var switchInput = document.createElement('input');
  switchInput.classList.add('cmn-toggle', 'cmn-toggle-round');
  switchInput.setAttribute('type', 'checkbox');
  switchInput.id = 'cmn-toggle-' + Date.now();
  switchInput.addEventListener('change', function (e) {
    var checked = e.target.checked;
    _this.required(checked);
  });

  this.requiredSwitch = switchInput;
  requiredSwitch.appendChild(switchInput);

  var switchLabel = document.createElement('label');
  switchLabel.setAttribute('for', switchInput.id);
  requiredSwitch.appendChild(switchLabel);

  requiredLabel.appendChild(requiredSwitch);
  buttonsContainer.appendChild(requiredLabel);

  configBox.appendChild(buttonsContainer);

  this.element.appendChild(configBox);
  this.element.appendChild(controls);

  //If it adds options, let's create the option adding field.
  if (typeof this.addOption === 'function') {
    this.createAddOptionField();
  }
};

/**
 * Toggle the configuration mode for the component
 * @method configToggle
 * @param  {boolean} showHide
 * @return {void}
 */
FormComponent.prototype.configToggle = function configToggle(showHide) {
  showHide = showHide || !this.configShowing;
  if (showHide) {
    this.showConfig();
  } else {
    this.hideConfig();
  }
};

/**
 * Hides the config box and make the content non-editable
 * @method hideConfig
 * @return {void}
 */
FormComponent.prototype.hideConfig = function hideConfig() {
  if (!this.configBox) {
    throw new Error('FormComponent.configToggle(): No configBox initialised');
  } else if (!this.configShowing) {
    return;
  }

  this.element.classList.remove('fl-form-config-visible');
  this.configShowing = false;

  var editables = this.element.querySelectorAll('.fl-editable');
  var placeholderMessage = 'Set a placeholder text.';

  [].forEach.call(editables, function (el) {
    el.setAttribute('contenteditable', false);

    //Show message to input placeholder text if there is no placeholder already
    //in place. Remove the message if placeholder wasn't set.
    if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT' && el.type === 'text') {
      var placeholderText = el.getAttribute('placeholder');
      var value = el.value;

      if (value) {
        el.setAttribute('placeholder', value);
      } else if (placeholderText === placeholderMessage) {
        el.removeAttribute('placeholder');
      }

      el.value = '';
    }
  });
};

/**
 * Displays the configuration box and makes appropriate fields editable.
 * @method showConfig
 * @return {void}
 */
FormComponent.prototype.showConfig = function showConfing() {
  if (!this.configBox) {
    throw new Error('FormComponent.showConfing(): No configBox initialised');
  } else if (this.configShowing) {
    return;
  }

  //Show config box and change configShowing value
  this.element.classList.add('fl-form-config-visible');
  this.configShowing = true;

  //Make appropriate elements editable.
  var editables = this.element.querySelectorAll('.fl-editable');
  var placeholderMessage = 'Set a placeholder text.';
  [].forEach.call(editables, function (el) {
    el.setAttribute('contenteditable', true);

    //Show message to input placeholder text if there is no placeholder already
    //in place. Remove the message if placeholder wasn't set.
    if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT' && el.type === 'text') {
      var placeholderText = el.getAttribute('placeholder');
      var newContent = placeholderText ? placeholderText : placeholderMessage;
      el.setAttribute('placeholder', newContent);
      el.value = '';
    }
  });

  //Focus on the appropriate element
  var focusElement = this.focusElement || this.configBox.querySelector('switch');
  if (focusElement) {
    //NOTE: There is a bug that for some reason it doesn't focus if you just
    //call focus() straight away. setTimeout solves it.
    //see http://goo.gl/UjKOk5
    setTimeout(function () {
      focusElement.focus();
    }, 15);
  }

  //Set a listener to hide the configuration when the user clicks somewhere else.
  var _this = this;
  var listenerTarget = document.body;
  var useCapture = true;
  listenerTarget.addEventListener('mousedown', function clickOutOfComponent(e) {
    var func = clickOutOfComponent;
    var clickX = e.clientX;
    var clickY = e.clientY;

    //If clicked outside of the component.
    if (!_this.isAtPoint(clickX, clickY)) {
      listenerTarget.removeEventListener('mousedown', func, useCapture);
      _this.hideConfig();
    }
  }, useCapture);
};

/**
 * Checks whether a point is inside a component or outside of it.
 * @method isAtPoint
 * @param  {integer}  x
 * @param  {integer}  y
 * @return {Boolean}   Whether point is inside component or not
 */
FormComponent.prototype.isAtPoint = function isAtPoint(x, y) {
  var configPosition = this.configBox.getBoundingClientRect();
  var componentPosition = this.element.getBoundingClientRect();

  var top = componentPosition.top;
  var bottom = configPosition.bottom;
  var right = Math.max(configPosition.right, componentPosition.right);
  var left = Math.min(configPosition.left, componentPosition.left);

  //If point is outside of the component
  if (x < left || right < x || y < top || bottom < y) {
    return false;
  } else {
    return true;
  }
};

/**
 * Creates an input field in the configContent which will call this.add with
 * its content value
 * @method createAddOptionField
 * @param {String} placeHolderText    text to show in the input field
 * @param {Function} removeFunction    function to be called when removing an option
 * @return {HTMLElement} The cretated element
 */
FormComponent.prototype.createAddOptionField = function createAddOptionField() {

  var _this = this;
  if (typeof this.removeOption === 'function') {
    var removeBtn = document.createElement('i');
    removeBtn.setAttribute('name', 'remove');
    removeBtn.classList.add('glyphicon', 'glyphicon-minus-sign', 'fl-grey-btn');
    removeBtn.title = 'Remove last option';
    removeBtn.addEventListener('click', function () {
      _this.removeOption();
    });

    this.configContent.appendChild(removeBtn);
  }

  var addBtn = document.createElement('i');
  addBtn.setAttribute('name', 'add');
  addBtn.classList.add('glyphicon', 'glyphicon-plus-sign', 'fl-grey-btn');
  addBtn.title = 'Add this option';
  this.configContent.appendChild(addBtn);

  var legend = document.createElement('input');
  legend.setAttribute('placeholder', 'Type a new option');
  legend.setAttribute('type', 'text');
  this.focusElement = legend;
  this.configContent.appendChild(legend);

  addBtn.addEventListener('click', function () {

    //Blink red and return if no value was provided
    if (!legend.value.trim()) {
      utils$1.blinkRed(legend);

      return;
    }

    _this.addOption(legend.value);
    legend.value = '';
  });

  legend.addEventListener('keypress', function (e) {
    if (e.which === 13) {
      var click = new Event('click');
      addBtn.dispatchEvent(click);
      e.preventDefault();
      return false; // returning false will prevent the event from bubbling up.
    } else {
        return true;
      }
  });
};

//To be implemented by child clases
FormComponent.prototype.saveConfig = function saveConfig() {};

FormComponent.prototype.destroy = function destroy() {
  this.element.remove();
};

/**
 * Sets checkboxes as required. Only does that if there is only one checkbox.
 * @method required
 * @param  {boolean} isRequired
 * @return {Boolean}      Whether required was set or not.
 */
FormComponent.prototype.required = function required(isRequired) {
  if (this.isRequired === isRequired) {
    return true;
  }

  var inputs = this.content.querySelectorAll('input');
  var textAreas = this.content.querySelectorAll('textarea');
  var selects = this.content.querySelectorAll('select');
  inputs = [].slice.call(inputs);
  textAreas = [].slice.call(textAreas);
  selects = [].slice.call(selects);

  var els = [].concat.call(inputs, textAreas, selects);

  if (isRequired) {
    els.forEach(function (el) {
      el.setAttribute('required', true);
    });
  } else {
    els.forEach(function (el) {
      el.removeAttribute('required');
    });
  }

  this.isRequired = isRequired;
  return true;
};

FormComponent.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.addOption('placeholder', 'Insert an option');
  this.placeHolder.setAttribute('disabled', true);
};

FormComponent.prototype.removePlaceHolder = function removePlaceHolder() {
  this.placeHolder.remove();
  this.placeHolder = null;
};

FormComponent.prototype.getElements = function getElements() {
  var allContent = this.content.children;
  var elements = [];
  [].forEach.call(allContent, function (el) {
    if (el.nodeName !== 'H3') {
      elements.push(el);
    }
  });

  return elements;
};

//Method to be called by JSON.stringify
//This method is augmented in the relevant classes.
FormComponent.prototype.toJSON = function toJSON() {
  var json = {};

  if (this.title && this.title.innerText) {
    json.title = this.title.innerText;
  }

  json.componentType = this.componentType;
  json.required = this.isRequired || false;

  json.content = [];
  var contentEls = this.getElements();
  contentEls = [].slice.call(contentEls);
  contentEls.forEach(function (el) {
    var elJson = {};
    elJson.nodeName = el.nodeName.toLowerCase();
    elJson.type = el.getAttribute('type') || undefined;
    elJson.name = el.getAttribute('name') || undefined;
    elJson.placeholder = el.getAttribute('placeholder') || undefined;
    elJson.label = el.innerText || el.innerHTML;
    json.content.push(elJson);
  });

  return json;
};

/**
 * @class RadioBtns
 * @extends FormComponent
 */
function RadioBtns(name) {
  if (!(this instanceof RadioBtns)) {
    return new RadioBtns();
  }

  this.init(name);
}

RadioBtns.prototype = new FormComponent(); //Inheritance part
RadioBtns.prototype.componentType = 'RadioBtns';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
RadioBtns.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.
  this.addPlaceHolder();
};

/**
 * @method add
 * @param {String} value
 * @param {String} legend [optional]
 * @return HTMLElement the element added
 */
RadioBtns.prototype.addOption = function addOption(value, legend) {
  if (!value) {
    throw new Error('RadioBtns.add(): ' + value + ' is not a valid "value" parameter');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  var newRadio = document.createElement('input');
  newRadio.setAttribute('type', 'radio');
  newRadio.setAttribute('name', this.name);
  newRadio.setAttribute('value', value);
  newRadio.classList.add('fl-radio-btn');

  //FIXME: Radio button labels allow you to delete the radio btn. Fix that.
  var newLabel = document.createElement('label');

  var legendNode = document.createElement('span');
  legendNode.innerText = legend || value;
  legendNode.classList.add('fl-editable');
  legendNode.setAttribute('contenteditable', true);

  newLabel.appendChild(newRadio);
  newLabel.appendChild(legendNode);

  this.content.appendChild(newLabel);
  return newLabel;
};

/**
 * @method removeOption
 * @return {void}
 */
RadioBtns.prototype.removeOption = function removeOption() {
  var radioBtns = this.getElements();
  var atLeastOneBtn = radioBtns.length > 0;
  if (!atLeastOneBtn || this.placeHolder) {
    utils$1.blinkRed(this.content);
    return;
  }

  var lastEl = radioBtns.pop();
  lastEl.remove();
};

/**
 * @class Checkboxes
 * @extends FormComponent
 */
function Checkboxes(name) {
  if (!(this instanceof Checkboxes)) {
    return new Checkboxes();
  }

  this.init(name);
}

Checkboxes.prototype = new FormComponent(); //Inheritance part
Checkboxes.prototype.componentType = 'Checkboxes';
/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
Checkboxes.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  this.name = name + '[]';
  this.addPlaceHolder();
};

/**
 * Adds one checkbox to a group of checkboxes.
 * @method add
 * @param {String} value  value that will be sent on form submit
 * @param {String} legend [optional]
 */
Checkboxes.prototype.addOption = function addOption(value, legend) {
  if (!value) {
    throw new Error('Checkboxes.addOption(): No value parameter provided.');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  if (this.isRequired && this.getElements().length > 0) {
    this.required(false);
  }

  var newBox = document.createElement('input');
  newBox.setAttribute('type', 'checkbox');
  newBox.setAttribute('name', this.name);
  newBox.setAttribute('value', value);
  newBox.classList.add('fl-check-box');

  if (this.isRequired) {
    newBox.setAttribute('required', true);
  }

  var legendNode = document.createElement('span');
  legendNode.innerText = legend || value;
  legendNode.classList.add('fl-editable');

  //Let's already make it contenteditable as the config box is currently open.
  legendNode.setAttribute('contenteditable', true);

  var label = document.createElement('label');
  label.appendChild(newBox);
  label.appendChild(legendNode);
  this.content.appendChild(label);
  return label;
};

/**
 * @method removeOption
 * @return {void}
 */
Checkboxes.prototype.removeOption = function removeOption() {
  var boxes = this.getElements();
  var atLeastOneBox = boxes.length > 0;
  if (!atLeastOneBox || this.placeHolder) {
    utils$1.blinkRed(this.content);
    return;
  }

  var lastEl = boxes.pop();
  lastEl.remove();
};
/**
 * Sets checkboxes as required. Only does that if there is only one checkbox.
 * @override @method required
 * @param  {boolean} isRequired
 * @return {Boolean}      Whether required was set or not.
 */
Checkboxes.prototype.required = function required(isRequired) {
  if (this.isRequired === isRequired) {
    return true;
  } else if (!this.requiredSwitch) {
    throw new Error('Checkboxes.required(): No required button in place.');
  } else if (this.getElements().length > 1 && isRequired) {
    console.error('Checkboxes: To be "required" there can only ' + 'be one checkbox in the group.');
    this.requiredSwitch.checked = false;
    return false;
  }

  this.isRequired = isRequired;
  var boxes = this.content.querySelectorAll('input');
  if (isRequired) {
    [].forEach.call(boxes, function (box) {
      box.setAttribute('required', true);
    });
  } else {
    [].forEach.call(boxes, function (box) {
      box.removeAttribute('required');
    });
  }

  this.requiredSwitch.checked = isRequired;
  return true;
};

/**
 * @override addPlaceHolder
 */
Checkboxes.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.addOption('placeholder', 'Check a box');
};

/**
 * @class TextBox
 * @extends FormComponent
 */
function TextBox(name) {
  if (!(this instanceof TextBox)) {
    return new TextBox();
  }

  this.init(name);
}

TextBox.prototype = new FormComponent(); //Inheritance part
TextBox.prototype.componentType = 'TextBox';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextBox.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  //Create the text box
  var labelEl = document.createElement('div');
  labelEl.classList.add('full-width');

  var box = document.createElement('input');
  box.setAttribute('type', 'text');
  box.setAttribute('name', name);
  box.classList.add('fl-editable', 'fl-text-box', 'form-control');
  labelEl.appendChild(box);

  this.content.appendChild(labelEl);
  this.focusElement = box;
};

TextBox.prototype.setLabel = function setLabel(desc) {
  if (!desc || !this.title) {
    return;
  }

  this.title.innerText = desc;
};

/**
 * @class TextArea
 * @extends FormComponent
 */
function TextArea(name) {
  if (!(this instanceof TextArea)) {
    return new TextArea();
  }

  this.init(name);
}

TextArea.prototype = new FormComponent(); //Inheritance part
TextArea.prototype.componentType = 'TextArea';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
TextArea.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.
  var labelEl = document.createElement('div');
  labelEl.classList.add('full-width');

  var area = document.createElement('textarea');
  area.setAttribute('name', name);
  area.setAttribute('rows', 5);
  area.classList.add('fl-editable', 'fl-text-area', 'form-control');
  labelEl.appendChild(area);

  this.content.appendChild(labelEl);
  this.focusElement = area;
};

TextArea.prototype.setTitle = function setTitle(desc) {
  if (!desc || !this.title) {
    return;
  }

  this.title.innerText = desc;
};

/**
 * @class Dropdown
 * @extends FormComponent
 */
function Dropdown(name) {
  if (!(this instanceof Dropdown)) {
    return new Dropdown();
  }

  this.init(name);
}

Dropdown.prototype = new FormComponent(); //Inheritance part
Dropdown.prototype.componentType = 'Dropdown';

/**
 * init() is automatically called in construction by FormComponent, the parent class
 * @override @method init
 * @param  {String} name
 * @return {void}
 */
Dropdown.prototype.init = function init(name) {
  this.constructor.prototype.init.call(this, name); // parent class init.

  var labelEl = document.createElement('div');
  labelEl.classList.add('full-width');
  this.selector = document.createElement('select');
  this.selector.setAttribute('name', name);
  this.selector.classList.add('fl-dropdown', 'form-control');
  labelEl.appendChild(this.selector);

  this.content.appendChild(labelEl);
  this.addPlaceHolder();
};

/**
 * Adds a new option to the dropdown
 * @method add
 * @param {String} value
 * @param {String} legend [optional]
 * @return {HTMLElement} the option created
 */
Dropdown.prototype.addOption = function addOption(value, legend) {
  if (!value) {
    throw new Error('Dropdown.addOption(): ' + value + ' is not a valid "value" value.');
  } else if (this.placeHolder) {
    this.removePlaceHolder();
  }

  var newOp = document.createElement('option');
  newOp.innerText = legend || value;
  this.selector.appendChild(newOp);
  return newOp;
};

/**
 * @method removeOption
 * @return {void}
 */
Dropdown.prototype.removeOption = function removeOption() {
  var options = this.getElements();
  var hasAtLeastOneOption = options.length > 0;
  if (!hasAtLeastOneOption || this.placeHolder) {
    utils$1.blinkRed(this.selector);
    return;
  }

  var selectedIndex = this.selector.selectedIndex;
  var index = selectedIndex >= 0 ? selectedIndex : 0;
  var optionToBeRemoved = this.selector.children[index];
  optionToBeRemoved.remove();
};

/**
 * Adds a placeholder and saves it in this.placeHolder
 * @method @override addPlaceHolder
 */
Dropdown.prototype.addPlaceHolder = function addPlaceHolder() {
  this.placeHolder = this.addOption('placeholder', 'Select an option');
  this.placeHolder.setAttribute('disabled', true);
  this.placeHolder.setAttribute('selected', true);
};

/**
 * Hides the config panel and makes the selectable a dropdown again
 * @method @override hideConfig
 * @return {void}
 */
Dropdown.prototype.hideConfig = function hideConfig() {
  this.constructor.prototype.hideConfig.call(this);

  if (!this.selector) {
    console.error('Dropdown.hideConfig(): Selector not specified');
    return;
  }

  //Make selector not multiple
  this.selector.removeAttribute('multiple');
};

/**
 * Shows the config panes and allows the selection of multiple elements
 * @method @override showConfig
 * @return {void}
 */
Dropdown.prototype.showConfig = function showConfig() {
  this.constructor.prototype.showConfig.call(this);

  if (!this.selector) {
    console.error('Dropdown.showConfig(): Selector not specified');
    return;
  }

  //Make selector multiple;
  this.selector.setAttribute('multiple', true);
};

/**
 * @method @override getElements
 * @return {HTMLElement}
 */
Dropdown.prototype.getElements = function getElements() {
  var allOptions = this.content.querySelectorAll('option');
  return [].slice.call(allOptions);
};

/**
 * Singleton to create form components
 * @class FormFabric
 * @param {HTMLElement} el Where the fabric will be put.
 */
function FormFabric(formBody) {
  'use strict';

  if (!(this instanceof FormFabric)) {
    return new FormFabric();
  }

  var formComponents = [{ desc: 'Radio buttons', constr: RadioBtns, class: 'glyphicon glyphicon-ok-circle' }, { desc: 'Checkboxes', constr: Checkboxes, class: 'glyphicon glyphicon-check' }, { desc: 'Dropdown', constr: Dropdown, class: 'glyphicon glyphicon-collapse-down' }, { desc: 'Text box', constr: TextBox, class: 'glyphicon glyphicon-text-width' }, { desc: 'Text area', constr: TextArea, class: 'glyphicon glyphicon-text-height' }];

  function createElement(Constr, formBody) {
    var name = 'Temp name' + Math.floor(Math.random() * 1000);
    var comp = new Constr(name);
    var ev = new CustomEvent('addComponent', {
      detail: { comp: comp },
      bubbles: true,
      cancelable: true
    });

    formBody.dispatchEvent(ev);
  }

  /**
   * @function createOptionsDropdown
   * @return {HTMLElement} The dropdown menu
   */
  function createOptions() {
    var frag = document.createDocumentFragment();
    formComponents.forEach(function (component, idx) {
      var op = document.createElement('button');
      op.setAttribute('value', idx);
      op.className = component.class;
      op.name = component.desc;
      op.title = component.desc;
      op.classList.add('btn', 'btn-default');
      op.addEventListener('click', function () {
        var idx = op.value;
        createElement(formComponents[idx].constr, formBody);
      });

      frag.appendChild(op);
    });

    return frag;
  }

  this.init = function init() {
    this.element = document.createElement('div');
    this.element.classList.add('fl-form-fabric');
    var options = createOptions();
    this.element.appendChild(options);
  };

  this.init(formBody);
}

function flFormBuilder(xDivEl) {
  'use strict';

  var formBody = new FormBody();
  var fabric = new FormFabric(formBody.element);

  xDivEl.classList.add('fl-form-builder');
  xDivEl.appendChild(fabric.element);
  xDivEl.appendChild(formBody.element);
}

xController(flFormBuilder);
//# sourceMappingURL=fl-form-builder.js.map
