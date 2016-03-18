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
        var firstElSpaceOccupied =
            els[1].getBoundingClientRect().top - els[0].getBoundingClientRect().top;
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
      parent = (els[i]) ? els[i].parentElement : els[els.length - 1].parentElement;
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
        dragListener.stop();
        insertTargetInRightPlace(elements, initialTops, elIndex);
        eventTarget.removeEventListener('drag', throttledDragListener);
        eventTarget.removeEventListener('dragend', dragEndListener);
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
