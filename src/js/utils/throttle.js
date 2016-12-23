
/**
 * @function throttle
 * @param  {integer}   FuncDelay
 * @param  {Function} callback
 * @return {Function}                  the throttled function
 */
export default function throttle(FuncDelay, callback) {
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
