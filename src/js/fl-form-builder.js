/* globals xController */
//
import ReactFormBuilder from './FormBuilder';
import assert from 'fl-assert';
import ReactDOM from 'react-dom';
import React from 'react';


// Field Types
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
    TextBox,
    EmailBox,
    TelephoneBox,
    NumberBox,
    TextArea,
  ];

  const customFieldTypes = components.concat(defaultTypes);

  let exportFunc;
  ReactDOM.render((
    <ReactFormBuilder
      fieldTypes={customFieldTypes}
      exportState={f => (exportFunc = f)}
    />),
    container
  );

  this.exportState = () => { return exportFunc(); };
}

export default FormBuilder;
