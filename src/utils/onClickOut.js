/**
 * executes a callback when there is a click outside of a list of
 * elements
 * @method onClickOut
 * @param  {Array<HTMLElement>} elements
 * @param  {Function} callback
 * @return {Function} A function to cancel onClickOut
 */
export default function onClickOut(elements, callback) {
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
    console.log('listener triggered');

    // If clicked outside of the element.
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
