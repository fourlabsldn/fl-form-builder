import buildOptionsFieldConstructor from './buildOptionsFieldConstructor';
import { renderRadioOrCheckboxOptions } from './options-utils';

const typeInfo = {
  // Compulsory
  type: 'RadioButtons',
  displayName: 'Radio Button',
  group: 'Options Components',

  // Field type specific
  htmlInputType: 'radio',
};

const RadioButtons = buildOptionsFieldConstructor(typeInfo, renderRadioOrCheckboxOptions);

export default RadioButtons;
