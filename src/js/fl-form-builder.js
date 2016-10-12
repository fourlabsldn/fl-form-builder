/* globals xController */
//
import ReactFormBuilder from './FormBuilder';
import assert from 'fl-assert';
import ReactDOM from 'react-dom';
import React from 'react';


// Field Types
import RadioButtons from './default-fields/options-fields/RadioButtons';
import Checkboxes from './default-fields/options-fields/Checkboxes';
import Dropdown from './default-fields/options-fields/Dropdown';

import TextBox from './default-fields/text-fields/TextBox';
import TextArea from './default-fields/text-fields/TextArea';
import EmailBox from './default-fields/text-fields/EmailBox';
import NumberBox from './default-fields/text-fields/NumberBox';
import TelephoneBox from './default-fields/text-fields/TelephoneBox';

function FormBuilder(container, components = []) {
  assert(
    container && container.nodeName,
    `Invalid contianer: ${container}. Container must be an HTML element.`
  );

  const defaultTypes = [
    RadioButtons,
    Checkboxes,
    Dropdown,
    TextBox,
    EmailBox,
    TelephoneBox,
    NumberBox,
    TextArea,
  ];

  const customFieldTypes = defaultTypes.concat(components);

  let exportFunc;
  let importFunc;
  ReactDOM.render((
    <ReactFormBuilder
      fieldTypes={customFieldTypes}
      exportState={f => (exportFunc = f)}
      importState={f => (importFunc = f)}
    />),
    container
  );

  this.exportState = () => { return exportFunc(); };
  this.importState = (s) => { return importFunc(s); };
}

export default FormBuilder;
