import store from './store';
import React from 'react';
import ReactDOM from 'react-dom';
import assert from 'fl-assert';
import View from './View';

function FormBuilder(container, components = []) {
  assert(
    container && container.nodeName,
    `Invalid contianer: ${container}. Container must be an HTML element.`
  );

  ReactDOM.render(<View store={store} />, container);

  // Import custom components
  // this.exportState = () => { return exportFunc(); };
  // this.importState = (s) => { return importFunc(s); };
}

export default FormBuilder;
