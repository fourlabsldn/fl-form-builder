import documentOffset from "document-offset";
import { prop, pipe } from "ramda";
import Maybe from "data.maybe";
import { effectsManager, actionCreators, updateFunction } from "./effectsManager";
import addListenerOnce from "../addListenerOnce";
import throttle from "../throttle";

// An element's height is considered the difference between it's top value
// and the top value of the element after it. If there is no element after it
// the clientHeight is used instead.
// Array HTMLElement -> HTLMElement -> ElementInfo
const elementInfo = (previousElements, el) =>
({
  element: el,
  initialTop: documentOffset(el).top,
  height:
    Maybe.fromNullable(previousElements[0])
      .map(prop("initialTop"))
      .map(prevTop => prevTop - documentOffset(el).top)
      .getOrElse(el.clientHeight),
});

// Array HTMLElement -> Array ElementInfo
const elementsInfo = elements =>
  elements.reduceRight(
      (acc, el) => [elementInfo(acc, el)].concat(acc)
    , []
  );


/**
 * [init description]
 * @method init
 * @param  {Event} e - The dragStart event, which will have been triggered on the
 *                   drag icon of a element to be reordered
 * @param  {HTMLElement} el - The main element to be dragged up and down
 * @param  {Array<HTMLElement>} elements - The main element plus all of its
 *                                       siblings that will be reordered
 * @return {void}
 */
export default function trackReorderDrag(e, el, elements) {
  const allInfos = elementsInfo(elements)
    .sort((elInfo1, elInfo2) => elInfo1.initialTop - elInfo2.initialTop);

  const initialModel = {
    initialY: e.pageY,
    draggedElInfo: allInfos.find(elInfo => elInfo.element === el),
    nonDraggedElsInfo: allInfos.filter(elInfo => elInfo.element !== el),
    isDragging: true,
  };

  const localStore = effectsManager(initialModel, updateFunction);

  // Listen to drags
  const eventTarget = e.target;
  const throttledOnDrag = throttle(50, pipe(actionCreators.drag, localStore.update));

  eventTarget.addEventListener("drag", throttledOnDrag);
  addListenerOnce("dragend", eventTarget, _ => {
    localStore.update(actionCreators.dragEnd());
    eventTarget.removeEventListener("drag", throttledOnDrag);
  });
}
