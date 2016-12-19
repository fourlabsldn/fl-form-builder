/* eslint-env jasmine */
/* eslint-disable quote-props */

import { importState } from "../js/Actions";
import update from "../js/Update";

const typesArray = [{
  "info": {
    "type": "RadioButtons",
  },
}, {
  "info": {
    "type": "Checkboxes",
  },
}, {
  "info": {
    "type": "Dropdown",
  },
}, {
  "info": {
    "type": "TextBox",
  },
}, {
  "info": {
    "type": "EmailBox",
  },
}, {
  "info": {
    "type": "TelephoneBox",
  },
}, {
  "info": {
    "type": "NumberBox",
  },
}, {
  "info": {
    "type": "TextArea",
  },
}, {
  "info": {
    "type": "DateField",
  },
}];

const mockCurrentState = ["a", "b"];
const mockHistory = [];
const mockState = {
  fieldTypes: typesArray,
  fieldsState: mockCurrentState,
  fieldsStateHistory: mockHistory,
};

const newValidState = [{
  "type": "Checkboxes",
  "displayName": "Checkboxes",
  "group": "Options Components",
  "htmlInputType": "checkbox",
  "title": "Add a title",
  "options": [{
    "caption": "Insert an option",
  }],
  "newOptionCaption": "",
}];

const newInvalidState = [{
  "type": "Invalid type",
  "displayName": "Checkboxes",
  "group": "Options Components",
  "htmlInputType": "checkbox",
  "title": "Add a title",
  "options": [{
    "caption": "Insert an option",
  }],
  "newOptionCaption": "",
}];

describe("Update.importState", () => {
  it("Returns an unchanged array if the new state is invalid", () => {
    expect(update(mockState, importState({}))).toEqual(mockState);
    expect(update(mockState, importState(null))).toEqual(mockState);
  });

  it("Returns an unchanged array if the a field's type is not in fieldTypes", () => {
    expect(update(mockState, importState(newInvalidState))).toEqual(mockState);
  });

  it("Sends the last current state to the history", () => {
    const updated = update(mockState, importState(newValidState));
    expect(updated.fieldsStateHistory[0].toString()).toEqual(mockCurrentState.toString());
    expect(updated.fieldsStateHistory.length).toEqual(mockHistory.length + 1);
  });

  it("Sets the new state as current", () => {
    const updated = update(mockState, importState(newValidState));
    expect(updated.fieldsState[0].type).toEqual(newValidState[0].type);
    expect(updated.fieldsState[0].type).not.toEqual(undefined);
    expect(updated.fieldsState[0].displayName).toEqual(newValidState[0].displayName);
    expect(updated.fieldsState[0].displayName).not.toEqual(undefined);
    expect(updated.fieldsState[0].group).toEqual(newValidState[0].group);
    expect(updated.fieldsState[0].group).not.toEqual(undefined);
  });
});
