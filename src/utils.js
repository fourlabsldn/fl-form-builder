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

  return {
    blinkRed: blinkRed,
  };
}());
