import React from 'react';
import ReactDOM from 'react-dom';
import { curry } from 'lodash/fp';

const updateField = curry((update, state, initialState, fieldName, e) => {
  const value = e.target.value || initialState[fieldName];
  const newState = Object.assign({}, state, { [fieldName]: value });
  update(newState);
});

const updateDate = curry((numCount, propName, state, update, e) => {
  const value = e.target.value
    .toString()
    .replace(/[^0-9]/g, '') // remove non-numeric characters
    .replace(/^0*/, '') // remove leading zeroes
    .slice(-numCount); // we only case about the last `numCount` digits

  const newValue = value;

  const newState = Object.assign({}, state, { [propName]: newValue });
  update(newState);

  const fieldFilled = newValue.length === numCount;
  const nextField = ReactDOM.findDOMNode(e.target).nextElementSibling;
  if (fieldFilled && nextField && nextField.nodeName === 'INPUT') {
    nextField.focus();
  }
});

const typeInfo = {
  // Compulsory
  type: 'DateField',
  displayName: 'Date Field',
  group: 'Custom Components',
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
        placeholder="DD"
        value={state.day}
        onChange={updateDate(2, 'day', state, update)}
      />
      /
      <input
        type="text"
        placeholder="MM"
        value={state.month}
        onChange={updateDate(2, 'month', state, update)}
      />
      /
      <input
        type="text"
        placeholder="YYYY"
        value={state.year}
        onChange={updateDate(4, 'year', state, update)}
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
