import React from 'react';
import assert from 'fl-assert';
import EventHub from './EventHub';
import trackReorderDrag from './utils/trackReorderDrag';
import addListenerOnce from './utils/addListenerOnce';


// =========== Handle drag


function getParentField(el) {
  if (!el || ! el.parentNode) { return el; }
  return el.classList.contains('fl-fb-Field')
    ? el
    : getParentField(el.parentNode);
}

const onDragStart = event => {
  const e = event.nativeEvent;
  // hide any dragging image
  e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);

  const mainField = getParentField(e.target);
  const trackedFields = Array.from(mainField.parentElement.children);

  if (trackedFields.length < 2) { return; }
  mainField.classList.add('fl-fb-Field--dragging');
  trackReorderDrag(e, mainField, trackedFields);

  // Post dragging
  addListenerOnce('dragend', mainField, () => {
    // remove dragging class after animation finishes
    setTimeout(() => mainField.classList.remove('fl-fb-Field--dragging'), 250);

    const reorderedIds = Array.from(trackedFields)
      .sort((el1, el2) => {
        return el1.getBoundingClientRect().top >
               el2.getBoundingClientRect().top;
      })
      .map(f => f.dataset.id);

    EventHub.trigger('fieldsReorder', reorderedIds);
  });
};

// =========== END OF Handle drag


const updateField = newState => {
  EventHub.trigger('updateField', newState);
};

const deleteField = fieldState => {
  EventHub.trigger('deleteField', fieldState);
};

const toggleConfig = (fieldState) => {
  const newFieldState = Object.assign(
    {},
    fieldState,
    { configShowing: !fieldState.configShowing }
  );
  updateField(newFieldState);
};

const toggleRequired = (fieldState) => {
  const newFieldState = Object.assign(
    {},
    fieldState,
    { required: !fieldState.required }
  );
  updateField(newFieldState);
};

const isValidFieldState = state => {
  return typeof state.id === 'number'
    && typeof state.type === 'string'
    && typeof state.group === 'string'
    && typeof state.configShowing === 'boolean';
};

const Sidebar = ({ fieldState }) => (
  <div className="fl-fb-Field-sidebar">
    <button
      className="glyphicon glyphicon-menu-hamburger fl-fb-Field-sidebar-btn"
      onDragStart={onDragStart}
      draggable="true"
    />
    <button
      className="glyphicon glyphicon-cog fl-fb-Field-sidebar-btn-config"
      onClick={() => toggleConfig(fieldState)}
    />
    <button
      className="glyphicon glyphicon-trash fl-fb-Field-sidebar-btn-delete"
      onClick={() => deleteField(fieldState)}
    />
  </div>
);

const ConfigBar = ({ fieldState }) => (
  <div className="fl-fb-Field-configuration">
    <div className="fl-fb-Field-configuration-buttons">
      <label
        className="fl-fb-Field-configuration-switch-required"
        onMouseDown={() => toggleRequired(fieldState)}
      >
        Required
        <div className="fl-fb-ui-switch">
          <input
            className="fl-fb-ui-switch-toggle fl-fb-ui-switch-toggle-round"
            type="checkbox"
            id={`fl-fb-ui-switch-${fieldState.id}`}
            checked={fieldState.required}
          />
          <label htmlFor={`fl-fb-ui-switch-${fieldState.id}`}> </label>
        </div >
      </label>

      <span className="fl-fb-Field-configuration-elementName">
        {fieldState.displayName}
      </span >

      <button
        className="fl-fb-Field-configuration-btn-ok btn btn-sm btn-default glyphicon glyphicon-ok"
        onClick={() => toggleConfig(fieldState)}
        type="button"
      />
    </div >
  </div>
);

const Field = ({ fieldState, fieldConstructor }) => {
  assert(isValidFieldState(fieldState), `Invalid field state: ${fieldState}`);

  const fieldComponent = fieldState.configShowing
    ? fieldConstructor.RenderConfigMode
    : fieldConstructor.RenderFormMode;

  const topClasses = fieldState.configShowing
    ? 'fl-fb-Field fl-fb-Field--configuration-visible'
    : 'fl-fb-Field';

  return (
    <div className={topClasses} data-id={fieldState.id}>
      <div className="fl-fb-Field-content">
        {React.createElement(fieldComponent, { state: fieldState, update: updateField })}
      </div>
      <Sidebar fieldState={fieldState} />
      <ConfigBar fieldState={fieldState} />
    </div>
  );
};

Field.propTypes = {
  fieldState: React.PropTypes.object,
  fieldConstructor: React.PropTypes.object,
};

export default Field;
