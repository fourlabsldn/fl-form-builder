export default function blinkRed(el) {
  if (!el || !el.classList) {
    return;
  }

  el.classList.add('fl-blink-red');
  setTimeout(function () {
    el.classList.remove('fl-blink-red');
  }, 1500);
};
