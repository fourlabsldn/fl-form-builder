/* eslint-env jasmine */

import React from 'react';
import renderer from 'react-test-renderer';
import FormBuilder from '../js/FormBuilder';
import polyfills from 'babel-polyfill'; // eslint-disable-line

describe('The FormBuilder', () => {
  it('can be created without any props', () => {
    const component = renderer.create(
      <FormBuilder />
    );
    expect(component.toJSON()).toBeTruthy();
  });

  it('can export state', () => {
    let exportFunc;
    renderer.create((
      <FormBuilder
        exportState={f => (exportFunc = f)}
      />
    ));

    const emptyExport = exportFunc();
    expect(JSON.stringify(emptyExport)).toEqual('[]');
  });

  it('can export state', () => {
    let importFunc;
    renderer.create((
      <FormBuilder
        importState={f => (importFunc = f)}
      />
    ));

    const doImport = () => importFunc([]);
    expect(doImport).not.toThrow();
  });
});
