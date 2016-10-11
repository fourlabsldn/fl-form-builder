import React from 'react';
import { overshadow } from './utils';
import { curry } from 'lodash';

const typeInfo = {
  type: 'TextField',
  group: 'Text Components',
  displayName: 'Text field',
};

const initialState = () => {
  const componentFields = {
    // Compulsory fields
    required: false,
    // Component specific fields
    title: 'Add a title',
    placeholder: 'Add a placeholder',
  };

  return Object.assign(
    {},
    typeInfo,
    componentFields
  );
};

const updateField = curry((update, state, fieldName, event) => {
  const value = event.target.value;
  // Update or fallback to default value
  const newValue = value || initialState()[fieldName];
  const newState = overshadow(state, { [fieldName]: newValue });
  update(newState);
});

// When configuration is open, this is what is going to be displayed
/**
 * @method RenderConfigMode
 * @param  {Object} state : State
 * @param  {Function} update : State -> void // Will trigger a re-render
 */
const RenderConfigMode = ({ state, update }) => {
  return (
    <div>
      <h2>
        <input
          type="text"
          className="fl-fb-Field--transparent"
          onChange={updateField(update, state, 'title')}
          defaultValue={state.title}
        />
      </h2>
      <input
        type="text"
        className="form-control"
        onChange={updateField(update, state, 'placeholder')}
        defaultValue={state.placeholder}
      />
    </ div>
  );
};

const RenderFormMode = ({ state, update }) => {
  return (
    <div>
      <h2>{state.title}</h2>
      <input type="text" className="form-control" placeholder={state.placeholder} />
    </div>
  );
};

const TextBox = {
  info: typeInfo,
  initialState,
  RenderConfigMode,
  RenderFormMode,
};

export default TextBox;
