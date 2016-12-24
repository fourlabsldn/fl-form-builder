import setTranslation from "./setTranslation";

//
// function insertTargetInRightPlace(nonDraggedElsInfo, draggedElInfo) {
//   const target = els[targetIndex];
//   const topsBeforeInsertion = getElementsCurrentTop(els);
//   const targetTop = topsBeforeInsertion[targetIndex];
//   let i = 0;
//
//   // Pass by all elements that are above the target
//   while ((topsBeforeInsertion[i] && topsBeforeInsertion[i] < targetTop) ||
//             (i === targetIndex)) {
//     i++;
//   }
//
//   // Take away transitions from all elements and save them
//   const initialTransitions = [];
//   els.forEach((anEl) => {
//     initialTransitions.push(anEl.style.transition);
//     anEl.style.transition = 'none'; // eslint-disable-line no-param-reassign
//   });
//
//   // Put everyone at translate3d(0,0,0) without transitions
//   resetElementsPositions(els);
//
//   // Add the element in the appropriate place. This will displace everyone else.
//   const parent = (els[i]) ? els[i].parentElement : els[els.length - 1].parentElement;
//   if (!parent || !parent.appendChild) {
//     throw new Error('trackReorderDrag(): No parent found in element list.');
//   } else if (els[i]) {
//     parent.insertBefore(target, els[i]);
//   } else {
//     const lastEl = els[els.length - 1];
//     parent.insertBefore(target, lastEl);
//     parent.insertBefore(lastEl, target);
//   }
//
//   // Now let's translate it to where it was just before it was repositioned
//   // All without transitions. It will seem like it never left that spot.
//   const futureTop = target.getBoundingClientRect().top;
//   const displacement = targetTop - futureTop;
//   setTranslation(target, displacement);
//
//   // Let's add a timeout to get the last place in the UI queue and let the
//   // CSS renderer to process the fact that all these elements do not have
//   // transitions and should appear wherever their coordinates say immediately.
//   setTimeout(() => {
//     // Restore all transitions
//     els.forEach((anEl, k) => {
//       anEl.style.transition = initialTransitions[k]; // eslint-disable-line no-param-reassign
//     });
//
//     // Now transition the target can transition smoothly from where it
//     // was dropped to its final position at translate value 0.
//     setTranslation(target, 0);
//   }, 15);
//
//   //  adjustElementsToTops(els, topsBeforeInsertion);
// }
//
//
//





const dragEnd = model => {
  const { draggedElInfo, nonDraggedElsInfo } = model;

  [draggedElInfo, ...nonDraggedElsInfo]
    .map(info => info.element)
    .forEach(element => setTranslation(element, 0));
  // insertTargetInRightPlace(elements, initialTops, elIndex);

  return Object.assign({}, model, { isDragging: false });
};

export default dragEnd;
