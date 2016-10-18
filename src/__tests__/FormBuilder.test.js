/* eslint-env jasmine */

import React from 'react';
import renderer from 'react-test-renderer';
import FormBuilder from '../js/FormBuilder';
import polyfills from 'babel-polyfill'; // eslint-disable-line

// Field Types
import RadioButtons from '../js/default-fields/options-fields/RadioButtons';
import Checkboxes from '../js/default-fields/options-fields/Checkboxes';
import Dropdown from '../js/default-fields/options-fields/Dropdown';

import TextBox from '../js/default-fields/text-fields/TextBox';
import TextArea from '../js/default-fields/text-fields/TextArea';
import EmailBox from '../js/default-fields/text-fields/EmailBox';
import NumberBox from '../js/default-fields/text-fields/NumberBox';
import TelephoneBox from '../js/default-fields/text-fields/TelephoneBox';

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
        fieldTypes={defaultTypes}
        importState={f => (importFunc = f)}
        exportState={f => (exportFunc = f)}
      />
    ));

    const initialState = [{"type":"TextBox","group":"Text Components","displayName":"Text Box","htmlInputType":"text","htmlElement":"input","required":false,"title":"asdasdfasdf asdfasdf ","placeholder":"Add a placeholdeasdfasdfr","id":1476724219155,"configShowing":false},{"type":"RadioButtons","displayName":"Radio Button","group":"Options Components","htmlInputType":"radio","required":false,"title":"Add a title","options":["asdfasdf","fdfsf","dsfd fsasdf "],"newOptionText":"","id":1476724207216,"configShowing":false}];
    importFunc(initialState);
    const exported = exportFunc();
    expect(exported).toEqual(initialState);
  });

  it('throws an error when creating types it doesn`t have', () => {
    let importFunc;
    renderer.create((
      <FormBuilder
        importState={f => (importFunc = f)}
      />
    ));

    const initialState = [{"type":"TextBox","group":"Text Components","displayName":"Text Box","htmlInputType":"text","htmlElement":"input","required":false,"title":"asdasdfasdf asdfasdf ","placeholder":"Add a placeholdeasdfasdfr","id":1476724219155,"configShowing":false}];
    expect(() => importFunc(initial)).toThrow();
  })
});
