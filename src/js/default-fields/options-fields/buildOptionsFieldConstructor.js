import React from 'react';
import { overshadow } from '../utils';
import { curry, get } from 'lodash/fp';

const ifEnterPressed = curry((f, e) => {
  if (event.key === 'Enter') {
    f(e);
  }
});

const validate = (state) => {
  if (!Array.isArray(state.options)) {
    throw new Error('Invalid "options" property. Not an array.');
  }

  const allOptionsHaveCaption = state.options.reduce((result, option) => {
    return result && (option.caption !== undefined);
  }, true);

  if (!allOptionsHaveCaption) {
    throw new Error('Invalid option in options array.');
  }
};

// Remove the last option
const removeOption = (state, update) => {
  const options = state.options.slice(0, state.options.length - 1);
  const newState = overshadow(state, { options });
  update(newState);
};

// Add the option in the config input fields
const addOption = (initialState, state, update) => {
  const newOption = {
    value: state.newOptionValue.trim(),
    caption: state.newOptionCaption.trim(),
  };

  const optionIsEmpty = !newOption.caption;
  const valueIsEmpty = !newOption.value;
  const valueAlreadyExists = state.options
    .map(get('value'))
    .indexOf(newOption.value) !== -1;

  if (optionIsEmpty || valueIsEmpty || valueAlreadyExists) {
    return;
  }

  // Add option and remove default option
  const defaultOptionCaption = initialState().options[0].caption;
  const options = state.options
    .filter(o => o.caption !== defaultOptionCaption) // Remove default option
    .concat([newOption]); // Add new option

  const newState = overshadow(state, {
    options,
    newOptionValue: '',
    newOptionCaption: '',
  });
  update(newState);
};

// Updated the caption text of an existing option
const updateOption = curry((state, update, optionIndex, event) => {
  const caption = event.target.value;
  const options = Array.from(state.options);
  options[optionIndex] = overshadow(options[optionIndex], { caption });

  const newState = overshadow(state, { options });
  update(newState);
});

const removeIfOptionIsNull = curry((state, update, optionIndex, event) => {
  const caption = event.target.value;
  if (caption) { return; }
  const optionsBefore = state.options.slice(0, optionIndex);
  const optionsAfter = state.options.slice(optionIndex + 1, state.options.length);
  const options = optionsBefore.concat(optionsAfter);
  const newState = overshadow(state, { options });
  update(newState);
});

const updateProperty = curry((initialState, state, update, propName, event) => {
  const value = event.target.value;
  const newValue = value || initialState()[propName];
  const newState = overshadow(state, { [propName]: newValue });
  update(newState);
});

/**
 * When configuration is open, this is what is going to be displayed
 * @method RenderConfigMode
 * @param  {Object} state : State
 * @param  {Function} update : State -> void // Will trigger a re-render
 */
const RenderConfigMode = curry((initialState, { state, update }) => {
  validate(state);

  return (
    <div>
      <h2>
        <input
          type="text"
          className="fl-fb-Field-editable"
          onChange={updateProperty(initialState, state, update, 'title')}
          defaultValue={state.title}
        />
      </h2>

      {state.options.map((option, optionIndex) => (
        <div className="fl-fb-Field-option">
          <input type={state.htmlInputType} value={option.value} />
          <span className="text-muted">
            {option.value}
          </span>
          <input
            type="text"
            className="fl-fb-Field-option-text fl-fb-Field-editable"
            value={option.caption}
            onKeyPress={ifEnterPressed(removeIfOptionIsNull(state, update, optionIndex))}
            onChange={updateOption(state, update, optionIndex)}
          />
        </div>
      ))}

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
          className="fl-fb-Field-config-valueInput"
          type="text"
          value={state.newOptionValue}
          placeholder="Value"
          onChange={updateProperty(initialState, state, update, 'newOptionValue')}
          onKeyPress={ifEnterPressed(addOption)}
        />
        <input
          className="fl-fb-Field-config-captionInput"
          type="text"
          value={state.newOptionCaption}
          placeholder="Type a new option caption"
          onChange={updateProperty(initialState, state, update, 'newOptionCaption')}
          onKeyPress={ifEnterPressed(addOption)}
        />
      </div>
    </div>
  );
});

// Renders the element without the config being open
const RenderFormMode = ({ state }) => {
  validate(state);

  return (
    <div>
      <h2>{state.title}</h2>
      {state.options.map(option => (
        <div className="fl-fb-Field-option">
          <input type={state.htmlInputType} value={option.value} />
          <span className="fl-fb-Field-option-text"> {option.caption} </span>
        </div>
      ))}
    </div>
  );
};

export default function buildOptionsFieldConstructor(typeInfo) {
  // These are the fields that will end up being
  // changed on updates
  const componentFields = {
    // Compulsory fields
    required: false,
    // Component specific fields
    title: 'Add a title',
    options: [
      { value: 0, caption: 'Insert an option' },
    ],

    // states needed to handle UI
    newOptionValue: '',
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
      ? RenderConfigMode(initialState, { state, update }) // eslint-disable-line new-cap
      : RenderFormMode({ state, update }); // eslint-disable-line new-cap
  };

  const OptionsField = {
    info: typeInfo,
    initialState,
    RenderEditor,
  };

  return OptionsField;
}
