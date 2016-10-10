/* globals xController */
//
import ReactFormBuilder from './FormBuilder';
import assert from 'fl-assert';
import ReactDOM from 'react-dom';
import React from 'react';


// Field Types
import TextBox from './DefaultFields/TextBox';

function FormBuilder(container, components = []) {
  assert(
    container && container.nodeName,
    `Invalid contianer: ${container}. Container must be an HTML element.`
  );

  const defaultTypes = [
    TextBox,
  ];

  const customFieldTypes = components.concat(defaultTypes);

  ReactDOM.render(<ReactFormBuilder fieldTypes={customFieldTypes} />, container);

  this.exportState = () => { throw new Error('Not working'); };
}

export default FormBuilder;