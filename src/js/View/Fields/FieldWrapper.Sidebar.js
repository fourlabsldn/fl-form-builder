/* eslint-disable react/prop-types, no-nested-ternary */
import React from "react";
import store from "../../store";
import { toggleConfig, deleteField } from "../../Actions";
import { curry } from "ramda";
import addListenerOnce from "../../utils/addListenerOnce";
import trackReorderDrag from "../../utils/trackReorderDrag";

// String -> HTMLElement -> HTMLElement
const getParentWithClass = curry((className, el) =>
  el && el.classList && el.classList.contains(className) ? el
    : el.parentNode ? getParentWithClass(className, el.parentNode)
    : null
);

// HTMLElement -> HTMLElement
const getFieldWrapper = getParentWithClass("fl-fb-Field");

// HTMLElement -> HTMLElement
const getFieldsContainer = getParentWithClass("fl-fb-Fields");

// Event => Event
const setTranparentDragImage = e =>
  e.dataTransfer.setDragImage(document.createElement("img"), 0, 0) || e;

const onDragStart = event => {
  const e = event.nativeEvent;
  // hide any dragging image
  setTranparentDragImage(e);

  const mainField = getFieldWrapper(e.target);
  const fieldsContainer = getFieldsContainer(e.target);
  const trackedFields = fieldsContainer
    ? Array.from(fieldsContainer.children)
    : [];

  if (!(mainField && fieldsContainer && trackedFields.length > 1)) {
    return;
  }

  mainField.classList.add("fl-fb-Field--dragging");
  trackReorderDrag(e, mainField, trackedFields);

  // Post dragging
  addListenerOnce("dragend", mainField, () => {
    // remove dragging class after animation finishes
    setTimeout(() => mainField.classList.remove("fl-fb-Field--dragging"), 250);

    const reorderedIds = Array.from(trackedFields)
      .sort((el1, el2) => {
        return el1.getBoundingClientRect().top >
               el2.getBoundingClientRect().top;
      })
      .map(f => f.dataset.id);

    // EventHub.trigger('fieldsReorder', reorderedIds);
    console.log("Reorder ids like this:", reorderedIds);
  });
};

const Sidebar = ({ fieldState }) => (
  <div className="fl-fb-Field-sidebar">
    <button
      className="glyphicon glyphicon-menu-hamburger fl-fb-Field-sidebar-btn"
      onDragStart={onDragStart}
      draggable="true"
      type="button"
    />
    <button
      className="glyphicon glyphicon-cog fl-fb-Field-sidebar-btn-config"
      onClick={() => store.dispatch(toggleConfig(fieldState))}
      type="button"
    />
    <button
      className="glyphicon glyphicon-trash fl-fb-Field-sidebar-btn-delete"
      onClick={() => store.dispatch(deleteField(fieldState))}
      type="button"
    />
  </div>
);


export default Sidebar;
