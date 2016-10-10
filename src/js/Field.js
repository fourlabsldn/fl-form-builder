import React from 'react';
import assert from 'fl-assert';

const isValidFieldState = state => {
  return typeof state.id === 'number'
    && typeof state.type === 'string'
    && typeof state.group === 'string'
    && typeof state.configShowing === 'boolean';
};

const Field = ({ fieldState, fieldConstructor }) => {
  assert(isValidFieldState(fieldState), `Invalid field state: ${fieldState}`);

  const updateFunction = (newState) => {
    console.log('Pretending to update to', newState);
  };

  const fieldComponent = fieldState.configShowing
    ? fieldConstructor.RenderConfigMode
    : fieldConstructor.RenderFormMode;

  return (
    <div className="fb-Field">
      {React.createElement(fieldComponent, { state: fieldState, update: updateFunction })}
    </div>
  );
};

Field.propTypes = {
  fieldState: React.PropTypes.object,
  fieldConstructor: React.PropTypes.object,
};

export default Field;
