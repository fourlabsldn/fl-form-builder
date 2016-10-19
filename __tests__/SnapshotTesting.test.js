/* eslint-env jasmine */
const React = require('react');
const renderer = require('react-test-renderer');
const FormBuilder = require('../dist/__test-files__/FormBuilder');
const UiSnapshots = require('./UiSnapshots');

// Field Types
const Checkboxes = require('../dist/__test-files__/Checkboxes');
const Dropdown = require('../dist/__test-files__/Dropdown');

const TextBox = require('../dist/__test-files__/TextBox');
const TextArea = require('../dist/__test-files__/TextArea');
const EmailBox = require('../dist/__test-files__/EmailBox');
const NumberBox = require('../dist/__test-files__/NumberBox');
const TelephoneBox = require('../dist/__test-files__/TelephoneBox');

// const shots = new UiSnapshots('SET'); // Use this mode to register changes
const shots = new UiSnapshots('CHECK');

const state = [{
  "type": "RadioButtons",
  "displayName": "Radio Button",
  "group": "Options Components",
  "htmlInputType": "radio",
  "required": true,
  "title": "Add a title",
  "options": ["something", "something else", "another something"],
  "newOptionText": "",
  "id": 1476867937327,
  "configShowing": false
}, {
  "type": "Checkboxes",
  "displayName": "Checkboxes",
  "group": "Options Components",
  "htmlInputType": "checkbox",
  "required": false,
  "title": "Add a title",
  "options": ["One option", "Another option", "even another"],
  "newOptionText": "",
  "id": 1476867938770,
  "configShowing": false
}, {
  "type": "Dropdown",
  "displayName": "Dropdown",
  "group": "Options Components",
  "required": true,
  "title": "Add a title",
  "options": ["One option", "Another option", "another another option"],
  "newOptionText": "one fourth option",
  "id": 1476867939975,
  "configShowing": false
}, {
  "type": "TextBox",
  "group": "Text Components",
  "displayName": "Text Box",
  "htmlInputType": "text",
  "htmlElement": "input",
  "required": true,
  "title": "with a title",
  "placeholder": "With a placeholder",
  "id": 1476867995625,
  "configShowing": false
}, {
  "type": "EmailBox",
  "group": "Text Components",
  "displayName": "Email Box",
  "htmlInputType": "email",
  "htmlElement": "input",
  "required": false,
  "title": "With a title",
  "placeholder": "And a placeholder",
  "id": 1476868009822,
  "configShowing": false
}, {
  "type": "TelephoneBox",
  "group": "Text Components",
  "displayName": "Telephone Box",
  "htmlInputType": "tel",
  "htmlElement": "input",
  "required": true,
  "title": "A telephone type with or without a placeholder",
  "placeholder": " ",
  "id": 1476868021663,
  "configShowing": false
}, {
  "type": "NumberBox",
  "group": "Text Components",
  "displayName": "Number Box",
  "htmlInputType": "number",
  "htmlElement": "input",
  "required": true,
  "title": "My title",
  "placeholder": "Number box",
  "id": 1476868052675,
  "configShowing": false
}, {
  "type": "TextArea",
  "group": "Text Components",
  "displayName": "Text Area",
  "htmlInputType": "text",
  "htmlElement": "textarea",
  "required": false,
  "title": "Text area title.",
  "placeholder": "Last component, a text area",
  "id": 1476868070006,
  "configShowing": false
}]

// ==  FormBuilder

describe('The FormBuilder`s ui', () => {
  it('is created correctly when empty', () => {
    const formBuildder = renderer.create(React.createElement(FormBuilder));

    expect(
      shots.matchesSnapshot(formBuildder.toJSON())
    ).toBe(true);
  });
});

// ==  FormBuilder

const RadioButtons = require('../dist/__test-files__/RadioButtons');
describe('The RadioButtons` ui', () => {
  it('is created correctly when empty', () => {
    const formBuildder = renderer.create(
      React.createElement(FormBuilder, {
        fieldTypes: [RadioButtons],
      })
    );

    expect(
      shots.matchesSnapshot(formBuildder.toJSON())
    ).toBe(true);
  });

  it('is created correctly with one item', () => {
    let importFunc;
    const formBuildder = renderer.create(
      React.createElement(FormBuilder, {
        fieldTypes: [RadioButtons],
        importState: f => (importFunc = f),
      })
    );

    importFunc([{
      "type": "RadioButtons",
      "displayName": "Radio Button",
      "group": "Options Components",
      "htmlInputType": "radio",
      "required": true,
      "title": "Add a title",
      "options": ["something", "something else", "another something"],
      "newOptionText": "",
      "id": 1476867937327,
      "configShowing": false
    }]);

    expect(
      shots.matchesSnapshot(formBuildder.toJSON())
    ).toBe(true);
  });
});
