/* eslint-disable no-nested-ternary */
//
// This algorythm assumes that  elements do not change size during the drag.
//
import documentOffset from "document-offset";
import { pipe, prop, zip } from "ramda";
import Maybe from "data.maybe";
import addListenerOnce from "./addListenerOnce";
import throttle from "./throttle";

function setTranslation(el, val) {
  el.style.transform = `translate3d(0, ${val}px, 0)`; //  eslint-disable-line no-param-reassign
}

// An element's height is considered the difference between it's top value
// and the top value of the element after it. If there is no element after it
// the clientHeight is used instead.
// Array HTMLElement -> HTLMElement -> ElementInfo
const elementInfo = (previousElements, el) =>
({
  element: el,
  initalTop: documentOffset(el).top,
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


// elementsInfo does not include the draggedElInfo
// Array ElementInfo -> ElementInfo -> Int -> Array Int
const calculateDisplacement = (elsInfo, draggedElInfo, draggedElTranslation) =>
  elsInfo.map(elInfo => {
    const originallyAboveDraggedEl = elInfo.initialTop < draggedElInfo.initialTop;
    const currentlyAboveDraggedEl =
      elInfo.initialTop < (draggedElInfo.initialTop + draggedElTranslation);

    return (originallyAboveDraggedEl && !currentlyAboveDraggedEl) ? draggedElInfo.height
      : (!originallyAboveDraggedEl && currentlyAboveDraggedEl) ? -draggedElInfo.height
      : 0;
  });



// Set translation of all elements
// Int -> Array ElementInfo -> ElementInfo -> Model
const onDrag = (model, { eventY }) => {
  const { isDragging, initialY, draggedElInfo, nonDraggedElsInfo } = model;
  if (!isDragging) { return model; }

  const draggedElDisplacement = eventY - initialY;
  const elsDisplacement =
    calculateDisplacement(nonDraggedElsInfo, draggedElInfo, draggedElDisplacement);

  zip(
    [draggedElInfo, ...nonDraggedElsInfo],
    [draggedElDisplacement, ...elsDisplacement]
  )
  .forEach(([elInfo, elDisplacement]) =>
      setTranslation(elInfo.element, elDisplacement)
  );

  // Does not change model
  return model;
};

const dragEnd = model => {
  const { draggedElInfo, nonDraggedElsInfo } = model;

  [draggedElInfo, ...nonDraggedElsInfo]
    .map(prop("element"))
    .forEach(elem => setTranslation(elem, 0));
  // insertTargetInRightPlace(elements, initialTops, elIndex);

  return Object.assign({}, model, { isDragging: false });
};

// ============================================================================

const effectsManager = (initialModel, updateFunction) => {
  let model = initialModel;
  return {
    update: action => {
      model = updateFunction(model, action);
    },
  };
};

const actionCreators = {
  dragEnd: _ => ({ type: "dragEnd" }),
  drag: e => ({ type: "drag", eventY: e.pageY }),
};

const updateFunction = (model, action) => {
  switch (action.type) {
  case "dragEnd":
    return dragEnd(model, action);
  case "drag":
    onDrag(model, action);
    return model;
  default:
    throw new Error(`Unexpected action in trackReorderDrag: ${action.type}`);
  }
};

// ============================================================================



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

  const draggedElInfo = allInfos.find(elInfo => elInfo.element === el);
  const nonDraggedElsInfo = allInfos.filter(elInfo => elInfo !== draggedElInfo);

  const initialModel = {
    initialY: e.pageY,
    draggedElInfo,
    nonDraggedElsInfo,
    isDragging: true,
  };

  const localStore = effectsManager(initialModel, updateFunction);

  // Listen to drags
  const eventTarget = e.target;
  const throttledOnDrag = throttle(50, pipe(actionCreators.drag, localStore.update));

  eventTarget.addEventListener("drag", throttledOnDrag);
  addListenerOnce("dragend", eventTarget, _ => {
    console.log("dragend");
    localStore.update(actionCreators.dragEnd());
    eventTarget.removeEventListener("drag", throttledOnDrag);
  });
}
