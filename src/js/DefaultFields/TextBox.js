import React from 'react';
import abstract from './TextField-abstract';
import { overshadow } from './utils';

const typeInfo = overshadow(
  abstract.typeInfo,
  {
    type: 'TextField',
    group: 'Text Components',
    displayName: 'Text field',
  }
);

const componentFields = Object.assign({}, abstract.componentFields);

const initialState = abstract.createInitialState(typeInfo, componentFields);

const RenderConfigMode = abstract.createRenderConfigMode(initialState());

const RenderFormMode = abstract.RenderFormMode;

const TextBox = {
  info: typeInfo,
  initialState,
  RenderConfigMode,
  RenderFormMode,
};

export default TextBox;
