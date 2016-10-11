import buildOptionsFieldConstructor from './buildOptionsFieldConstructor';

const typeInfo = {
  // Compulsory
  type: 'Checkboxes',
  displayName: 'Checkboxes',
  group: 'Options Components',

  // Field type specific
  htmlInputType: 'checkbox',
};


const RadioButtons = buildOptionsFieldConstructor(typeInfo);

export default RadioButtons;
