import React from 'react';
import ReactDOM from 'react-dom';
import { curry } from 'lodash/fp';

const updateField = curry((update, state, initialState, fieldName, e) => {
  const value = e.target.value || initialState[fieldName];
  const newState = Object.assign({}, state, { [fieldName]: value });
  update(newState);
});

const leadingZeroes = (zeroCount, num) => {
  const zeroes = Math.max(0, zeroCount); // make sure never negative
  return Array(zeroes).fill(0).join('') + num.toString();
};

const betweenLimits = curry((min, max, propName, state, update, e) => {
  const charCount = max.toString().length;
  const value = e.target.value
    .toString()
    .replace(/[^0-9]/g, '') // remove non-numeric characters
    .slice(-charCount); // we only case about the last `charCount` digits

  const valueInt = parseInt(value, 10);
  // min < valueInt < max
  const withinLimits = isNaN(valueInt) ? min : Math.max(min, Math.min(max, valueInt));
  const newValue = leadingZeroes(charCount - withinLimits.toString().length, withinLimits);
  const newState = Object.assign({}, state, { [propName]: newValue });
  update(newState);
});

const updateDate = curry((min, max, propName, state, update, e) => {
  const charCount = max.toString().length;

  const value = e.target.value
    .toString()
    .replace(/[^0-9]/g, '') // remove non-numeric characters
    .slice(-charCount); // we only case about the last `charCount` digits

  const valueInt = parseInt(value, 10);
  const newValue = value.length < charCount
    ? value
    : leadingZeroes(
        charCount - valueInt.toString().length,
        Math.max(min, Math.min(max, valueInt)) // min < valueInt < max
      );

  const newState = Object.assign({}, state, { [propName]: newValue });
  update(newState);

  const fieldFilled = newValue.toString().length === charCount;
  const nextField = ReactDOM.findDOMNode(e.target).nextElementSibling;
  if (fieldFilled && nextField && nextField.nodeName === 'INPUT') {
    nextField.focus();
  }
});

const typeInfo = {
  // Compulsory
  type: 'DateField',
  displayName: 'Date Field',
  group: 'Text Components',
  required: false,

  // Component specific fields
  title: 'My date component',
  day: '',
  month: '',
  year: '',
};


// For Text Fields the initialState function will only return an object.
const initialState = () => Object.assign({}, typeInfo);

// When configuration is open, this is what is going to be displayed
/**
 * @method RenderConfigMode
 * @param  {Object} state : State
 * @param  {Function} update : State -> void // Will trigger a re-render
 */
const RenderEditor = ({ state, update }) => {

  return (
    <div>
      {state.configShowing
        ? (
            <h2>
              <input
                type="text"
                className="fl-fb-Field-editable"
                onChange={updateField(update, state, initialState, 'title')}
                defaultValue={state.title}
              />
            </h2>
          )
        : <h2>{state.title}</h2>
      }

      <input
        type="text"
        className="fl-fb-Field-editable fl-fb-Field-dateslot-day"
        placeholder="DD"
        value={state.day}
        onChange={updateDate(1, 31, 'day', state, update)}
        onBlur={betweenLimits(1, 31, 'day', state, update)}
        required={state.required}
      />
      /
      <input
        type="text"
        className="fl-fb-Field-editable fl-fb-Field-dateslot-month"
        placeholder="MM"
        value={state.month}
        onChange={updateDate(1, 12, 'month', state, update)}
        onBlur={betweenLimits(1, 12, 'month', state, update)}
        required={state.required}
      />
      /
      <input
        type="text"
        className="fl-fb-Field-editable fl-fb-Field-dateslot-year"
        placeholder="YYYY"
        value={state.year}
        onChange={updateDate(1, 2050, 'year', state, update)}
        onBlur={betweenLimits(1900, 2050, 'year', state, update)}
        required={state.required}
      />
    </div>
  );
};

const ImageCards = {
  info: typeInfo,
  initialState,
  RenderEditor,
};

export default ImageCards;
