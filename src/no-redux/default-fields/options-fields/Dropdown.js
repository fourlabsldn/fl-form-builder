import buildOptionsFieldConstructor from './buildOptionsFieldConstructor';
import { renderDropdownOptions } from './options-utils';

const typeInfo = {
  // Compulsory
  type: 'Dropdown',
  displayName: 'Dropdown',
  group: 'Options Components',
};

const Dropdown = buildOptionsFieldConstructor(typeInfo, renderDropdownOptions);

export default Dropdown;
