/* eslint-env jasmine */
/* eslint-disable quote-props */

import { fieldCreated } from "../../js/Actions";
import update from "../../js/Update";

const createdFieldState = { type: "fictitious-instance" };
const mockCurrentState = ["a", "b"];
const mockHistory = [];
const mockState = {
  fieldTypes: [{ info: { type: "fictitious-instance" } }],
  fieldsState: mockCurrentState,
  fieldsStateHistory: mockHistory,
};

const fieldCreatedAction = fieldCreated(createdFieldState);
const newState = update(mockState, fieldCreatedAction);

describe("Update.fieldCreated", () => {
  it("outputs a field with the new state included", () => {
    expect(newState.fieldsState.length).toEqual(mockState.fieldsState.length + 1);
    expect(
      newState.fieldsState
      .find(v => v.type === createdFieldState.type)
    ).not.toEqual(undefined);
  });

  it("sends the current state to history", () => {
    expect(newState.fieldsStateHistory[0][0]).toEqual(mockCurrentState[0]);
    expect(newState.fieldsStateHistory[0][1]).toEqual(mockCurrentState[1]);
  });

  it("Returns the current state if no new field is given to it", () => {
    const sameState = update(mockState, fieldCreated(null));
    expect(sameState.fieldTypes.length).toEqual(mockState.fieldTypes.length);
    expect(sameState.fieldsState.length).toEqual(mockState.fieldsState.length);
    expect(sameState.fieldsStateHistory.length).toEqual(mockState.fieldsStateHistory.length);
  });
});
