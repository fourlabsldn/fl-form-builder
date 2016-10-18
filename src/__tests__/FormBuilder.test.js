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

  it('does the setup of the export state function', () => {
    let exportFunc;
    renderer.create((
      <FormBuilder
        exportState={f => (exportFunc = f)}
      />
    ));

    const emptyExport = exportFunc();
    expect(JSON.stringify(emptyExport)).toEqual('[]');
  });

  it('does the setup of the import state function', () => {
    let importFunc;
    renderer.create((
      <FormBuilder
        importState={f => (importFunc = f)}
      />
    ));

    const doImport = () => importFunc([]);
    expect(doImport).not.toThrow();
  });

  it('can export the correct object after importing it', () => {
    let importFunc;
    let exportFunc;
    renderer.create((
      <FormBuilder
        importState={f => (importFunc = f)}
        exportState={f => (exportFunc = f)}
      />
    ));

    const initial = [{"type":"TextBox","group":"Text Components","displayName":"Text Box","htmlInputType":"text","htmlElement":"input","required":false,"title":"asdasdfasdf asdfasdf ","placeholder":"Add a placeholdeasdfasdfr","id":1476724219155,"configShowing":false},{"type":"RadioButtons","displayName":"Radio Button","group":"Options Components","htmlInputType":"radio","required":false,"title":"Add a title","options":["asdfasdf","fdfsf","dsfd fsasdf "],"newOptionText":"","id":1476724207216,"configShowing":false},{"primitiveType":"Dropdown","type":"ImageCards","displayName":"Image Cards","group":"Custom Components","required":false,"title":"My image component","options":["http://ingridwu.dmmdmcfatter.com/wp-content/uploads/2015/01/placeholder.png"],"newImageText":"","id":1476724232653,"configShowing":true}];
    importFunc(initial);
    const exported = exportFunc();
    expect(exported).toEqual(initial);
  });
});
