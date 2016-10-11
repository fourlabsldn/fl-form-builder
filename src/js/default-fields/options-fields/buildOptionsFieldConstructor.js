import React from 'react';
import { overshadow } from '../utils';
import { curry } from 'lodash';

export default function buildOptionsFieldConstructor(typeInfo) {
  // These are the fields that will end up being
  // changed on updates
  const componentFields = {
    // Compulsory fields
    required: false,
    // Component specific fields
    title: 'Add a title',
    options: [
      'Insert an option',
    ],

    // states needed to handle UI
    newOptionText: '',
  };


  // For Text Fields the initialState function will only return an object.
  const initialState = () => Object.assign(
      {},
      typeInfo,
      componentFields
    );

  // When configuration is open, this is what is going to be displayed
  /**
   * @method RenderConfigMode
   * @param  {Object} state : State
   * @param  {Function} update : State -> void // Will trigger a re-render
   */
  const RenderConfigMode = ({ state, update }) => {
    const removeOption = () => {
      // Remove last option
      const options = state.options.slice(0, state.options.length - 1);
      const newState = overshadow(state, { options });
      update(newState);
    };

    const addOption = () => {
      if (!state.newOptionText.trim()) {
        return;
      }

      const options = state.options
        .filter(o => !initialState().options.includes(o)) // Remove default option
        .concat([state.newOptionText]); // Add new option
      const newOptionText = '';
      const newState = overshadow(state, { options, newOptionText });
      update(newState);
    };

    const updateOption = curry((optionIndex, event) => {
      const value = event.target.value;
      const options = Array.from(state.options);
      options[optionIndex] = value;

      const newState = overshadow(state, { options });
      update(newState);
    });

    const removeIfOptionIsNull = curry((optionIndex, event) => {
      const value = event.target.value;
      if (value) { return; }
      const optionsBefore = state.options.slice(0, optionIndex);
      const optionsAfter = state.options.slice(optionIndex + 1, state.options.length);
      const options = optionsBefore.concat(optionsAfter);
      const newState = overshadow(state, { options });
      update(newState);
    });

    const updateProperty = curry((propName, event) => {
      const value = event.target.value;
      const newValue = value || initialState()[propName];
      const newState = overshadow(state, { [propName]: newValue });
      update(newState);
    });

    const ifEnterPressed = curry((f, e) => {
      if (event.key === 'Enter') {
        f(e);
      }
    });

    return (
      <div>
        <h2>
          <input
            type="text"
            className="fl-fb-Field-editable"
            onChange={updateProperty('title')}
            defaultValue={state.title}
          />
        </h2>

        {state.options.map((optionText, optionIndex) => (
          <div className="fl-fb-Field-option">
            <input type={state.htmlInputType} />
            <input
              type="text"
              className="fl-fb-Field-option-text fl-fb-Field-editable"
              value={optionText}
              onKeyPress={ifEnterPressed(removeIfOptionIsNull(optionIndex))}
              onChange={updateOption(optionIndex)}
            />
          </div>
        ))}

        <div className="fl-fb-Field-config">
          <button onMouseDown={removeOption} className="glyphicon-minus-sign glyphicon fl-fb-Field-config-btn" />
          <button onMouseDown={addOption} className="glyphicon-plus-sign glyphicon fl-fb-Field-config-btn" />
          <input
            className="fl-fb-Field-config-input"
            type="text"
            value={state.newOptionText}
            onChange={updateProperty('newOptionText')}
            onKeyPress={ifEnterPressed(addOption)}
          />
        </div>
      </div>
    );
  };

  const RenderFormMode = ({ state }) => {
    return (
      <div>
        <h2>{state.title}</h2>
        {state.options.map(optionText => (
          <div className="fl-fb-Field-option">
            <input type={state.htmlInputType} />
            <span className="fl-fb-Field-option-text"> {optionText} </span>
          </div>
        ))}
      </div>
    );
  };

  const OptionsField = {
    info: typeInfo,
    initialState,
    RenderConfigMode,
    RenderFormMode,
  };

  return OptionsField;
}
