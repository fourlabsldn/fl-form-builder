export default function addListenerOnce(eventName, el, f) {
  function triggerAndRemove(event) {
    f(event);
    el.removeEventListener(eventName, triggerAndRemove);
  }

  el.addEventListener(eventName, triggerAndRemove);
}
