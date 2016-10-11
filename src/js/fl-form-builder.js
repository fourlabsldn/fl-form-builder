/* globals xController */
//
import ReactFormBuilder from './FormBuilder';
import assert from 'fl-assert';
import ReactDOM from 'react-dom';
import React from 'react';


// Field Types
import TextBox from './DefaultFields/TextBox';
import EmailBox from './DefaultFields/EmailBox';
import TelephoneBox from './DefaultFields/TelephoneBox';
import NumberBox from './DefaultFields/NumberBox';
import TextArea from './DefaultFields/TextArea';

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

  this.exportState = () => { return exportFunc() };
}

export default FormBuilder;
