import React from 'react';
import assert from 'fl-assert';

const isValidFieldState = state => {
  return typeof state.id === 'number'
    && typeof state.type === 'string'
    && typeof state.group === 'string';
};

const Field = ({ fieldState, fieldConstructor }) => {
  assert(isValidFieldState(fieldState), `Invalid field state: ${fieldState}`);

  return (
    <div className="fb-Field">
      <div className="fb-Field-main">
        {JSON.stringify(fieldState)}
      </div>
      <div className="fb-Field-config">
        {JSON.stringify(fieldConstructor)}
      </div>
    </div>
  );
};

Field.propTypes = {
  fieldState: React.PropTypes.object,
  fieldConstructor: React.PropTypes.object,
};

export default Field;
