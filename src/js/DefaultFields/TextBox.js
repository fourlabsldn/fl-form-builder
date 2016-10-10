import React from 'react';


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

// When configuration is open, this is what is going to be displayed
/**
 * @method RenderConfigMode
 * @param  {Object} state : State
 * @param  {Function} update : State -> void // Will trigger a re-render
 */
const RenderConfigMode = ({ state, update }) => {
  return (
    <div>
      <h2> Config Mode </h2>
      <label>
        Type a placeholder
        <input type="text" />
      </label>
    </ div>
  );
};

const RenderFormMode = ({ state, update }) => {
  return (
    <div>
      <h2> My Title </h2>
      <input type="text" />
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
