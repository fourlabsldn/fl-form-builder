export default function blinkRed(el, modulePrefix) {
  if (!el || !el.classList) {
    return;
  }

  const blickClass = `${modulePrefix}-blink-red`;
  el.classList.add(blickClass);
  setTimeout(() => {
    el.classList.remove(blickClass);
  }, 1500);
}
