import React from 'react';
import { curry } from 'lodash/fp';
import {
  ifEnterPressed,
  validate,
  removeOption,
  addOption,
  updateProperty,
} from './options-utils';

/**
 * When configuration is open, this is what is going to be displayed
 * @method RenderConfigMode
 * @param  {Object} state : State
 * @param  {Function} update : State -> void // Will trigger a re-render
 */
const RenderConfigMode = curry((initialState, renderOptions, { state, update }) => {
  validate(state);

  return (
    <div>
      <h2>
        <input
          type="text"
          className="fl-fb-Field-editable"
          onChange={updateProperty(initialState, state, update, 'title')}
          defaultValue={state.title}
          placeholder="Add a title"
        />
      </h2>

      {renderOptions(state, update)}

      <div className="fl-fb-Field-config">
        <button
          onMouseDown={() => removeOption(state, update)}
          className="glyphicon-minus-sign glyphicon fl-fb-Field-config-btn"
        />
        <button
          onMouseDown={() => addOption(initialState, state, update)}
          className="glyphicon-plus-sign glyphicon fl-fb-Field-config-btn"
        />
        <input
          className="fl-fb-Field-config-captionInput"
          type="text"
          value={state.newOptionCaption}
          placeholder="Type a new option caption"
          onChange={updateProperty(initialState, state, update, 'newOptionCaption')}
          onKeyPress={ifEnterPressed(() => addOption(initialState, state, update))}
        />
      </div>
    </div>
  );
});

// Renders the element without the config being open
const RenderFormMode = (renderOptions, { state, update }) => {
  validate(state);

  return (
    <div>
      <h2>{state.title}</h2>
      {renderOptions(state, update)}
    </div>
  );
};

export default function buildOptionsFieldConstructor(typeInfo, renderOptions) {

  // These are the fields that will end up being
  // changed on updates
  const componentFields = {
    // Compulsory fields
    required: false,
    // Component specific fields
    title: '',
    options: [
      { caption: 'Insert an option' },
    ],

    // states needed to handle UI
    newOptionCaption: '',
  };


  // For Text Fields the initialState function will only return an object.
  const initialState = () => Object.assign(
      {},
      typeInfo,
      componentFields
    );

  const RenderEditor = ({ state, update }) => {
    return state.configShowing
      ? RenderConfigMode(initialState, renderOptions, { state, update }) // eslint-disable-line new-cap
      : RenderFormMode(renderOptions, { state, update }); // eslint-disable-line new-cap
  };

  const OptionsField = {
    info: typeInfo,
    initialState,
    RenderEditor,
  };

  return OptionsField;
}
