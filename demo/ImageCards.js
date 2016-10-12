//
//
//    THIS IS THE PRECOMPILED VERSION ON THIS FILE
//
//    LOOK INTO DIST FOLDER FOR COMPILED VERSION TE BE
//
//    INCLUDED IN THE BROWSER
//

import React from 'react';

const typeInfo = {
  // Compulsory
  type: 'ImageCards',
  displayName: 'Image Cards',
  group: 'Custom Components',
  required: false,

  // Component specific fields
  title: 'My image component',
  images: [
    'http://ingridwu.dmmdmcfatter.com/wp-content/uploads/2015/01/placeholder.png',
  ],

  newImageText: '',
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
  const updateNewImageText = event => {
    const text = event.target.value;
    const newState = Object.assign(
      {},
      state,
      { newImageText: text }
    );

    update(newState);
  };

  const addNewImage = event => {
    if (event.key !== 'Enter') { return; }
    const text = event.target.value;
    const newState = Object.assign(
      {},
      state,
      { newImageText: '',
        images: state.images.concat([text]),
      }
    );

    update(newState);
  };

  return (
    <div>
      {state.images.map(img => <img alt={img} className="ImageCards-card" src={img} />)}

      {!state.configShowing
        ? null
        : (
        <div className="fl-fb-Field-config">
          <input
            type="text"
            value={state.newImageText}
            onChange={updateNewImageText}
            onKeyDown={addNewImage}
          />
        </div>
      )}
    </div>
  );
};

const ImageCards = {
  info: typeInfo,
  initialState,
  RenderEditor,
};

export default ImageCards;
