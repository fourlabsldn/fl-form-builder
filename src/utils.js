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

  return {
    blinkRed: blinkRed,
    throttle: throttle,
  };
}());
