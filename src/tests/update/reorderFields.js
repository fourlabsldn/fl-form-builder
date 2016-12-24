/* eslint-env jasmine */
/* eslint-disable quote-props */

import { reorderFields } from "../../js/Actions";
import update from "../../js/Update";

const templateField = {
  type: "fictitious-instance",
  required: false,
  configShowing: false,
  id: "0",
};
const field1 = Object.assign({}, templateField, { id: "1" });
const field2 = Object.assign({}, templateField, { id: "2" });
const field3 = Object.assign({}, templateField, { id: "3" });
const mockCurrentState = [field1, field2, field3];
const mockHistory = [];
const mockState = {
  fieldTypes: [{ info: { type: "fictitious-instance" } }],
  fieldsState: mockCurrentState,
  fieldsStateHistory: mockHistory,
};

const newOrder = ["2", "3", "1"];
const reorderFieldsAction = reorderFields(newOrder);
const newState = update(mockState, reorderFieldsAction);

describe("Update.reorderFields", () => {
  it("outputs a state with fields in the new order", () => {
    expect(newState.fieldsState.length).toEqual(mockState.fieldsState.length);
    expect(newState.fieldsState[0].id).toEqual(newOrder[0]);
    expect(newState.fieldsState[1].id).toEqual(newOrder[1]);
    expect(newState.fieldsState[2].id).toEqual(newOrder[2]);
  });

  it("sends the current state to history", () => {
    expect(newState.fieldsStateHistory[0][0].id).toEqual(mockCurrentState[0].id);
    expect(newState.fieldsStateHistory[0][1].id).toEqual(mockCurrentState[1].id);
    expect(newState.fieldsStateHistory[0][2].id).toEqual(mockCurrentState[2].id);
  });

  it("Returns the current state if any field id is missing", () => {
    const sameState = update(mockState, reorderFields(["1", "2"]));
    expect(sameState.fieldTypes.length).toEqual(mockState.fieldTypes.length);
    expect(sameState.fieldsState[0].id).toEqual(mockState.fieldsState[0].id);
    expect(sameState.fieldsState[1].id).toEqual(mockState.fieldsState[1].id);
    expect(sameState.fieldsState[2].id).toEqual(mockState.fieldsState[2].id);
    expect(sameState.fieldsState.length).toEqual(mockState.fieldsState.length);
    expect(sameState.fieldsStateHistory.length).toEqual(mockState.fieldsStateHistory.length);
  });

  it("Returns the current state if the reorder array has more elements than it should", () => {
    const sameState = update(mockState, reorderFields(["1", "2", "3", "4"]));
    expect(sameState.fieldTypes.length).toEqual(mockState.fieldTypes.length);
    expect(sameState.fieldsState[0].id).toEqual(mockState.fieldsState[0].id);
    expect(sameState.fieldsState[1].id).toEqual(mockState.fieldsState[1].id);
    expect(sameState.fieldsState[2].id).toEqual(mockState.fieldsState[2].id);
    expect(sameState.fieldsState.length).toEqual(mockState.fieldsState.length);
    expect(sameState.fieldsStateHistory.length).toEqual(mockState.fieldsStateHistory.length);
  });

  it("does not break the state after creating one object", () => {
    const changed1 = update(mockState, reorderFields(["1", "2", "3"]));
    const changed2 = update(changed1, reorderFields(["3", "1", "2"]));
    const changed3 = update(changed2, reorderFields(["3", "2", "1"]));
    expect(changed3.fieldTypes.length).toEqual(mockState.fieldTypes.length);
    expect(changed3.fieldsState.length).toEqual(mockCurrentState.length);
    expect(changed3.fieldsStateHistory.length).toEqual(3);
    expect(changed3.fieldsState[0].id).toEqual("3");
    expect(changed3.fieldsState[1].id).toEqual("2");
    expect(changed3.fieldsState[2].id).toEqual("1");
  });
});
