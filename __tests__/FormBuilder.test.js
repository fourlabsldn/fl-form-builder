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

    const initialState = [
      {
        "type": "RadioButtons",
        "displayName": "Radio Button",
        "group": "Options Components",
        "htmlInputType": "radio",
        "required": true,
        "title": "Checkbox fields",
        "options": [
          {
            "value": "0",
            "caption": "Option 1"
          },
          {
            "value": "1",
            "caption": "Option 2"
          },
          {
            "value": "2",
            "caption": "Third option"
          }
        ],
        "newOptionValue": "",
        "newOptionCaption": "",
        "id": 1477307308469,
        "configShowing": false
      },
      {
        "type": "Checkboxes",
        "displayName": "Checkboxes",
        "group": "Options Components",
        "htmlInputType": "checkbox",
        "required": false,
        "title": "A Radio button component",
        "options": [
          {
            "value": "12",
            "caption": "An option"
          },
          {
            "value": "13",
            "caption": "Another option"
          },
          {
            "value": "14",
            "caption": "One third option"
          }
        ],
        "newOptionValue": "",
        "newOptionCaption": "",
        "id": 1477307309997,
        "configShowing": false
      },
      {
        "type": "Dropdown",
        "displayName": "Dropdown",
        "group": "Options Components",
        "required": false,
        "title": "A dropdown option",
        "options": [
          {
            "value": "2",
            "caption": "number 1 option"
          },
          {
            "value": "3",
            "caption": "small op"
          },
          {
            "value": "4",
            "caption": "anoth sm op"
          }
        ],
        "newOptionValue": "",
        "newOptionCaption": "",
        "id": 1477307311438,
        "configShowing": false
      },
      {
        "type": "TextBox",
        "group": "Text Components",
        "displayName": "Text Box",
        "htmlInputType": "text",
        "htmlElement": "input",
        "required": true,
        "title": "A Text Box",
        "placeholder": "With placeholder and required",
        "id": 1477307312709,
        "configShowing": false
      },
      {
        "type": "EmailBox",
        "group": "Text Components",
        "displayName": "Email Box",
        "htmlInputType": "email",
        "htmlElement": "input",
        "required": true,
        "title": "No Placeholder",
        "placeholder": " ",
        "id": 1477307314077,
        "configShowing": false
      },
      {
        "type": "TelephoneBox",
        "group": "Text Components",
        "displayName": "Telephone Box",
        "htmlInputType": "tel",
        "htmlElement": "input",
        "required": false,
        "title": "Telephone bbbbox",
        "placeholder": "0123456",
        "id": 1477307315510,
        "configShowing": false
      },
      {
        "type": "NumberBox",
        "group": "Text Components",
        "displayName": "Number Box",
        "htmlInputType": "number",
        "htmlElement": "input",
        "required": false,
        "title": "Number field",
        "placeholder": "nnnnumber placeholder",
        "id": 1477307316947,
        "configShowing": false
      },
      {
        "type": "TextArea",
        "group": "Text Components",
        "displayName": "Text Area",
        "htmlInputType": "text",
        "htmlElement": "textarea",
        "required": true,
        "title": "A text area",
        "placeholder": "Add a placeholder",
        "id": 1477307318522,
        "configShowing": false
      }
    ];
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


defaultTypes.forEach((component) => {
  const { info, initialState, RenderEditor } = component;

  describe(`The ${info.displayName} component`, () => {
    it('exports the correct info keys', () => {
      expect(typeof info.type).toEqual('string');
      expect(typeof info.displayName).toEqual('string');
      expect(typeof info.group).toEqual('string');
    });

    it('has an initialState function that returns the correct values', () => {
      const state = initialState();
      expect(state.type).toEqual(info.type);
      expect(state.displayName).toEqual(info.displayName);
      expect(state.group).toEqual(info.group);
    });

    it('exports the correct keys after inseted into FormBuilder', () => {
      let importFunc;
      let exportFunc;
      renderer.create(
        React.createElement(FormBuilder, {
          importState: f => (importFunc = f),
          exportState: f => (exportFunc = f),
          fieldTypes: [component],
        })
      );
      importFunc([initialState()]);
      const exportedState = exportFunc()[0];
      expect(exportedState.type).toEqual(info.type);
      expect(exportedState.displayName).toEqual(info.displayName);
      expect(exportedState.group).toEqual(info.group);
      expect(typeof exportedState.required).toEqual('boolean');
    });
  });
});
