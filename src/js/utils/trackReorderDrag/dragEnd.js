import setTranslation from "./setTranslation";

const dragEnd = model => {
  const { draggedElInfo, nonDraggedElsInfo } = model;

  [draggedElInfo, ...nonDraggedElsInfo]
    .map(info => info.element)
    .forEach(element => setTranslation(element, 0));
  // insertTargetInRightPlace(elements, initialTops, elIndex);

  return Object.assign({}, model, { isDragging: false });
};

export default dragEnd;
