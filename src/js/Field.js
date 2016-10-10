import React from 'react';
import assert from 'fl-assert';
import EventHub from './EventHub';

const updateField = newState => {
  EventHub.trigger('updateField', newState);
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
    <button className="glyphicon glyphicon-menu-hamburger fl-fb-Field-sidebar-btn" />
    <button
      className="glyphicon glyphicon-cog fl-fb-Field-sidebar-btn-config"
      onClick={() => toggleConfig(fieldState)}
    />
    <button className="glyphicon glyphicon-trash fl-fb-Field-sidebar-btn-delete" />
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
    <div className={topClasses}>
      {React.createElement(fieldComponent, { state: fieldState, update: updateField })}
      <ConfigBar fieldState={fieldState} />
      <Sidebar fieldState={fieldState} />
    </div>
  );
};

Field.propTypes = {
  fieldState: React.PropTypes.object,
  fieldConstructor: React.PropTypes.object,
};

export default Field;
