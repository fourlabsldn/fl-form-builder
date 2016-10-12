/**
 *
 *
 * This is a group of functions to build a Text Field Constructor.
 * It is not supposed to be used as a FieldConstructor, but used to build one.
 *
 *
 */

import React from 'react';
import { overshadow } from '../utils';
import { curry } from 'lodash';

// ========== UTILS =================== //

const updateField = curry((update, state, initialState, fieldName, event) => {
  const value = event.target.value;
  // Update or fallback to default value
  const newValue = value || initialState[fieldName];
  const newState = overshadow(state, { [fieldName]: newValue });
  update(newState);
});

// ========== END OF UTILS ============ //

const templateTypeInfo = {
  // Compulsory
  type: 'TextField',
  group: 'Text Components',
  displayName: 'Text field',

  // Field type specific
  htmlInputType: 'text',
  htmlElement: 'input',
};

// These are the fields that will end up being
// changed on updates
const componentFields = {
  // Compulsory fields
  required: false,
  // Component specific fields
  title: 'Add a title',
  placeholder: 'Add a placeholder',
};


// For Text Fields the initialState function will only return an object.
const createInitialState = (typeSpecific, componentSpecific) => {
  return () => Object.assign(
      {},
      typeSpecific,
      componentSpecific
    );
};

// When configuration is open, this is what is going to be displayed
/**
 * @method RenderConfigMode
 * @param  {Object} state : State
 * @param  {Function} update : State -> void // Will trigger a re-render
 */
const createRenderConfigMode = curry((initialState, { state, update }) => {
  return (
    <div>
      <h2>
        <input
          type="text"
          className="fl-fb-Field-editable"
          onChange={updateField(update, state, initialState, 'title')}
          defaultValue={state.title}
        />
      </h2>

      {React.createElement(state.htmlElement, {
        type: 'text',
        className: 'form-control',
        defaultValue: state.placeholder,
        onChange: updateField(update, state, initialState, 'placeholder'),
      })}
    </ div>
  );
});

const RenderFormMode = ({ state }) => {
  return (
    <div>
      <h2>{state.title}</h2>

      {React.createElement(state.htmlElement, {
        type: state.htmlInputType,
        className: 'form-control',
        placeholder: state.placeholder,
      })}
    </div>
  );
};


export default function buildTextFieldConstructor(customTypeInfo) {
  const typeInfo = overshadow(templateTypeInfo, customTypeInfo);

  const initialState = createInitialState(typeInfo, componentFields);

  const RenderConfigMode = createRenderConfigMode(initialState());

  const RenderEditor = ({ state, update }) => {
    return state.configShowing
      ? RenderConfigMode({ state, update }) // eslint-disable-line new-cap
      : RenderFormMode({ state, update }); // eslint-disable-line new-cap
  };

  const FieldConstructor = {
    info: typeInfo,
    initialState,
    RenderEditor,
  };

  return FieldConstructor;
}
