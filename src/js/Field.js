import React from 'react';
import assert from 'fl-assert';

const isValidFieldState = state => {
  return typeof state.id === 'number'
    && typeof state.type === 'string'
    && typeof state.group === 'string'
    && typeof state.configShowing === 'boolean';
};

const Sidebar = ({ fieldState }) => (
  <div className="fl-fb-Field-sidebar">
    <button className="glyphicon glyphicon-menu-hamburger fl-fb-Field-sidebar-btn"></button>
    {fieldState.configShowing
      ? null
      : <button className="glyphicon glyphicon-cog fl-fb-Field-sidebar-btn-config"></button>
    }
    <button className="glyphicon glyphicon-trash fl-fb-Field-sidebar-btn-delete"></button>
  </div>
);

const ConfigBar = ({ fieldState }) => (
  <div className="fl-fb-Field-configuration">
    <div className="fl-fb-Field-configuration-buttons">
      <label className="fl-fb-Field-configuration-switch-required">
        Required
        <div className="fl-fb-ui-switch">
          <input
            className="fl-fb-ui-switch-toggle fl-fb-ui-switch-toggle-round"
            type="checkbox"
            id={`fl-fb-ui-switch-${fieldState.id}`}
          />
          <label htmlFor={`fl-fb-ui-switch-${fieldState.id}`}> </label>
        </div >
      < /label>
      <span className="fl-fb-Field-configuration-elementName">
        {fieldState.displayName}
      </span >
      <button
        className="fl-fb-Field-configuration-btn-ok btn btn-sm btn-default glyphicon glyphicon-ok"
        type="button"
      >
      </button>
    </div >
  </div>
);

const Field = ({ fieldState, fieldConstructor }) => {
  assert(isValidFieldState(fieldState), `Invalid field state: ${fieldState}`);

  const updateFunction = (newState) => {
    console.log('Pretending to update to', newState);
  };

  const fieldComponent = fieldState.configShowing
    ? fieldConstructor.RenderConfigMode
    : fieldConstructor.RenderFormMode;

  const topClasses = fieldState.configShowing
    ? 'fl-fb-Field fl-fb-Field--configuration-visible'
    : 'fl-fb-Field';

  return (
    <div className={topClasses}>
      {React.createElement(fieldComponent, { state: fieldState, update: updateFunction })}
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
