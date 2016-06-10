import assert from 'fl-assert';

export default function fireEvent(targetElement, eventName, detailObj) {
  assert(typeof eventName === 'string', `Invalid event name: ${eventName}`);
  const targetIsHtmlNode = targetElement && targetElement.appendChild;
  assert(targetIsHtmlNode, `Target element is not an HTML element: ${eventName}`);

  const event = new CustomEvent(eventName, { detail: detailObj });
  targetElement.dispatchEvent(event);
}
