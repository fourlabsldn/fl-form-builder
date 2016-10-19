/* eslint-env jasmine */
const React = require('react');
const renderer = require('react-test-renderer');
const FormBuilder = require('../dist/__test-files__/FormBuilder');

// Field Types
const RadioButtons = require('../dist/__test-files__/RadioButtons');
const Checkboxes = require('../dist/__test-files__/Checkboxes');
const Dropdown = require('../dist/__test-files__/Dropdown');

const TextBox = require('../dist/__test-files__/TextBox');
const TextArea = require('../dist/__test-files__/TextArea');
const EmailBox = require('../dist/__test-files__/EmailBox');
const NumberBox = require('../dist/__test-files__/NumberBox');
const TelephoneBox = require('../dist/__test-files__/TelephoneBox');

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
      React.createElement(FormBuilder)
    );
    expect(component.toJSON()).toBeTruthy();
  });

  it('does the setup of the export state function', () => {
    let exportFunc;
    renderer.create(
      React.createElement(FormBuilder, {
        exportState: f => (exportFunc = f),
      })
    );

    const emptyExport = exportFunc();
    expect(JSON.stringify(emptyExport)).toEqual('[]');
  });

  it('does the setup of the import state function', () => {
    let importFunc;
    renderer.create(React.createElement(FormBuilder, {
      importState: f => (importFunc = f),
    }));

    const doImport = () => importFunc([]);
    expect(doImport).not.toThrow();
  });

  it('can export the correct object after importing it', () => {
    let importFunc;
    let exportFunc;
    renderer.create(
      React.createElement(FormBuilder, {
        importState: f => (importFunc = f),
        exportState: f => (exportFunc = f),
        fieldTypes: defaultTypes,
      })
    );

    const initialState = [{"type":"TextBox","group":"Text Components","displayName":"Text Box","htmlInputType":"text","htmlElement":"input","required":false,"title":"asdasdfasdf asdfasdf ","placeholder":"Add a placeholdeasdfasdfr","id":1476724219155,"configShowing":false},{"type":"RadioButtons","displayName":"Radio Button","group":"Options Components","htmlInputType":"radio","required":false,"title":"Add a title","options":["asdfasdf","fdfsf","dsfd fsasdf "],"newOptionText":"","id":1476724207216,"configShowing":false}];
    importFunc(initialState);
    const exported = exportFunc();
    expect(exported).toEqual(initialState);
  });

  it('throws an error when creating types it doesn`t have', () => {
    let importFunc;
    renderer.create(React.createElement(FormBuilder, {
      importState: f => (importFunc = f),
    }));

    const initialState = [{"type":"TextBox","group":"Text Components","displayName":"Text Box","htmlInputType":"text","htmlElement":"input","required":false,"title":"asdasdfasdf asdfasdf ","placeholder":"Add a placeholdeasdfasdfr","id":1476724219155,"configShowing":false}];
    expect(() => importFunc(initial)).toThrow();
  })
});
