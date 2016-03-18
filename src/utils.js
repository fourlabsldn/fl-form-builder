var utils = (function utils() {

  function blinkRed(el) {
    if (!el || !el.classList) {
      return;
    }

    el.classList.add('fl-blink-red');
    setTimeout(function () {
      el.classList.remove('fl-blink-red');
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
  }

  //Tracks a drag and reorders a list of elements
  var trackReorderDrag = function trackReorderDrag(param_e, param_el, param_elements) {

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
      return function doDragMove() {
        var targetTop = target.getBoundingClientRect().top;
        var targetHeight = target.clientHeight;
        var movedUp = (targetTop < targetInitialTop);

        var i;
        for (i = 0; i < tops.length; i++) {
          if (i === targetIndex) {
            continue;
          } else
          if (!movedUp && targetTop > tops[i] && tops[i] > targetInitialTop) {
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
        if (shouldStopListening) { return; }

        doDragMove();
        var newY = e.pageY;
        if (newY === 0) { return; } //correct weird behaviour when mouse goes up

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
      els.forEach(function (el) { tops.push(el.getBoundingClientRect().top); });

      return tops;
    }

    function adjustElementsToTops(els, tops) {
      var currentTops = getElementsCurrentTop(els);
      els.forEach(function (el, i) {
        var diff =  currentTops[i] - tops[i];
        setTranslation(el, diff);
      });
    }

    function insertTargetInRightPlace(els, initialTops, targetIndex) {
      var target = els[targetIndex];
      var topsBeforeInsertion = getElementsCurrentTop(els);
      var targetTop = topsBeforeInsertion[targetIndex];
      var i = 0;

      //Pass by all elements that are above the target
      while ((topsBeforeInsertion[i] && topsBeforeInsertion[i] < targetTop) ||
                (i === targetIndex)) {
        i++;
      }

      var indexToInsertEl = (i > targetIndex) ? i - 1 : i;
      var futureTop = initialTops[indexToInsertEl];
      var displacement = targetTop - futureTop;
      setTranslation(target, displacement);

      var parent;
      parent = (els[i]) ? els[i].parentElement : els[els.length - 1].parentElement;
      if (!parent || !parent.appendChild) {
        throw new Error('trackReorderDrag(): No parent found in element list.');
      } else {
        parent.insertBefore(target, els[i]);
      }

      // adjustElementsToTops(els, topsBeforeInsertion);
    }

    function init(e, el, elements) {
      if (typeof el !== 'object') {
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
      var throttledDragListener = throttle(50, dragListener);

      //Listen to drags
      var eventTarget = e.target;
      eventTarget.addEventListener('drag', throttledDragListener);
      eventTarget.addEventListener('dragend', function dragEndListener() {
        insertTargetInRightPlace(elements, initialTops, elIndex);
        eventTarget.removeEventListener('drag', throttledDragListener);
        eventTarget.removeEventListener('dragend', dragEndListener);
        dragListener.stop();
        resetElementsPositions(elements);
      });
    }

    init(param_e, param_el, param_elements);
  };

  return {
    blinkRed: blinkRed,
    throttle: throttle,
    trackReorderDrag: trackReorderDrag,
  };
}());
