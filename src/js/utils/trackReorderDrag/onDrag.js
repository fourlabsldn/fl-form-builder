/* eslint-disable no-nested-ternary */
import setTranslation from "./setTranslation";
import { zip } from "ramda";

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

export default onDrag;
