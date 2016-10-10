/* globals xController */
//
import ReactFormBuilder from './FormBuilder';
import assert from 'fl-assert';
import ReactDOM from 'react-dom';
import React from 'react';

function FormBuilder(container, components = []) {
  assert(
    container && container.nodeName,
    `Invalid contianer: ${container}. Container must be an HTML element.`
  );

  ReactDOM.render(<ReactFormBuilder components={components} />, container);

  this.exportState = () => { throw new Error('Not working'); };
}

export default FormBuilder;
