import { overshadow } from '../utils';
import { curry, get } from 'lodash/fp';
import React from 'react';

export const ifEnterPressed = curry((f, e) => {
  if (event.key === 'Enter') {
    f(e);
  }
});

export const validate = (state) => {
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
export const removeOption = (state, update) => {
  const options = state.options.slice(0, state.options.length - 1);
  const newState = overshadow(state, { options });
  update(newState);
};

// Add the option in the config input fields
export const addOption = (initialState, state, update) => {
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
export const updateOption = curry((state, update, optionIndex, event) => {
  const caption = event.target.value;
  const options = Array.from(state.options);
  options[optionIndex] = overshadow(options[optionIndex], { caption });

  const newState = overshadow(state, { options });
  update(newState);
});

export const removeIfOptionIsNull = curry((state, update, optionIndex, event) => {
  const caption = event.target.value;
  if (caption) { return; }
  const optionsBefore = state.options.slice(0, optionIndex);
  const optionsAfter = state.options.slice(optionIndex + 1, state.options.length);
  const options = optionsBefore.concat(optionsAfter);
  const newState = overshadow(state, { options });
  update(newState);
});

export const updateProperty = curry((initialState, state, update, propName, event) => {
  const value = event.target.value;
  const newValue = value || initialState()[propName];
  const newState = overshadow(state, { [propName]: newValue });
  update(newState);
});

export const renderRadioOrCheckboxOptions = (state, update) => {
  if (state.configShowing) {
    return state.options.map((option, optionIndex) => (
      <div className="fl-fb-Field-option">
        <input
          type={state.htmlInputType}
          value={option.value}
          name={state.title}
        />
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
    ));
  }

  return state.options.map(option => (
    <div className="fl-fb-Field-option">
      <input
        type={state.htmlInputType}
        value={option.value}
        name={state.title}
      />
      <span className="fl-fb-Field-option-text"> {option.caption} </span>
    </div>
  ));
};


export const renderDropdownOptions = (state, update) => {
  if (state.configShowing) {
    return state.options.map((option, optionIndex) => (
      <div className="fl-fb-Field-option">
        <span className="text-muted">
          {option.value}
        </span>
        <input
          className="fl-fb-Field-editable"
          type="text"
          value={option.caption}
          onKeyPress={ifEnterPressed(removeIfOptionIsNull(state, update, optionIndex))}
          onChange={updateOption(state, update, optionIndex)}
        />
      </div>
    ));
  }

  return (
    <select className="form-control">
      {state.options.map(option => (
        <option value={option.value}> {option.caption} </option>
      ))}
    </select>
  );
};
