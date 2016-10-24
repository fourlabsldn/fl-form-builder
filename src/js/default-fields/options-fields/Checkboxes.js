import React from 'react';
import buildOptionsFieldConstructor from './buildOptionsFieldConstructor';
import { renderRadioOrCheckboxOptions } from './options-utils';

const typeInfo = {
  // Compulsory
  type: 'Checkboxes',
  displayName: 'Checkboxes',
  group: 'Options Components',

  // Field type specific
  htmlInputType: 'checkbox',
};



const RadioButtons = buildOptionsFieldConstructor(typeInfo, renderRadioOrCheckboxOptions);

export default RadioButtons;
