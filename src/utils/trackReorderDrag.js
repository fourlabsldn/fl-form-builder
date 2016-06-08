import throttle from './throttle';
/**
 * Will take care of the dragging and reordering a list for one drag.
 * @function trackReorderDrag
 * @param  {event} paramE        The dragstart event, from which this should be called.
 * @param  {HTMLElement} paramEl       The main Element being dragged
 * @param  {Array<HTMLElement>} paramElements Array of elements to be tracked.
 * @return {void}
 */
export default function trackReorderDrag(paramE, paramEl, paramElements) {
  function setTranslation(el, val) {
    el.style.transform = `translate3d(0, ${val}px, 0)`; //  eslint-disable-line no-param-reassign
  }

  /**
   * @function resetElementsPositions
   * @param {Array[HTMLElement]} els Elements being tracked
   */
  function resetElementsPositions(els) {
    els.forEach((el) => {
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
      const firstElSpaceOccupied =
          els[1].getBoundingClientRect().top - els[0].getBoundingClientRect().top;
      const verticalDistance = firstElSpaceOccupied - els[0].clientHeight;
      const height = els[elIndex].clientHeight;
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
    const target = els[targetIndex];
    const targetInitialTop = tops[targetIndex];
    const targetHeight = calculateElementHeight(els, targetIndex);
    return function doDragMove() {
      const targetTop = target.getBoundingClientRect().top;
      const movedUp = (targetTop < targetInitialTop);

      let i;
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
    const target = els[targetIndex];
    const doDragMove = createDragMover(els, tops, targetIndex);
    let shouldStopListening;
    function dragListener(e) {
      if (shouldStopListening) { return; }

      doDragMove();
      const newY = e.pageY;
      if (newY === 0) { return; } // correct weird behaviour when mouse goes up

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
    els.forEach((el) => { tops.push(el.getBoundingClientRect().top); });

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
    while ((topsBeforeInsertion[i] && topsBeforeInsertion[i] < targetTop) ||
              (i === targetIndex)) {
      i++;
    }

    // Take away transitions from all elements and save them
    const initialTransitions = [];
    els.forEach((anEl) => {
      initialTransitions.push(anEl.style.transition);
      anEl.style.transition = 'none'; // eslint-disable-line no-param-reassign
    });

    // Put everyone at translate3d(0,0,0) without transitions
    resetElementsPositions(els);

    // Add the element in the appropriate place. This will displace everyone else.
    const parent = (els[i]) ? els[i].parentElement : els[els.length - 1].parentElement;
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
    elements.forEach((element) => {
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
