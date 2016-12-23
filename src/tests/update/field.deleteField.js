/* eslint-env jasmine */
/* eslint-disable quote-props */

import { deleteField } from "../../js/Actions";
import update from "../../js/Update";

const toBeDeletedFieldState = { type: "fictitious-instance", id: 0 };
const mockCurrentState = [toBeDeletedFieldState, { id: 1 }, { id: 2 }];
const mockHistory = [];
const mockState = {
  fieldTypes: [{ info: { type: "fictitious-instance" } }],
  fieldsState: mockCurrentState,
  fieldsStateHistory: mockHistory,
};

const fieldDeleteAction = deleteField(toBeDeletedFieldState);
const newState = update(mockState, fieldDeleteAction);

describe("Update.deleteField", () => {
  it("outputs a state without the field included", () => {
    expect(newState.fieldsState.length).toEqual(mockState.fieldsState.length - 1);
    expect(
      newState.fieldsState
      .find(v => v.id === toBeDeletedFieldState.id)
    ).toEqual(undefined);
  });

  it("sends the current state to history", () => {
    const recentHistoryState = newState.fieldsStateHistory[0];
    expect(recentHistoryState.length).toEqual(mockCurrentState.length);
    expect(recentHistoryState[0].id).toEqual(mockCurrentState[0].id);
    expect(recentHistoryState[1].id).toEqual(mockCurrentState[1].id);
  });

  it("Returns the current state if no new field is given to it", () => {
    const sameState = update(mockState, deleteField(null));
    expect(sameState.fieldTypes.length).toEqual(mockState.fieldTypes.length);
    expect(sameState.fieldsState.length).toEqual(mockState.fieldsState.length);
    expect(sameState.fieldsStateHistory.length).toEqual(mockState.fieldsStateHistory.length);
  });

  it("does not break the state after deleting a field", () => {
    const mockField1 = Object.assign({}, toBeDeletedFieldState, { id: 5 });
    const mockField2 = Object.assign({}, toBeDeletedFieldState, { id: 6 });
    const mockField3 = Object.assign({}, toBeDeletedFieldState, { id: 7 });

    const mockState2 = Object.assign({}, mockState, {
      fieldsState: [
        mockField1,
        mockField2,
        mockField3,
      ],
    });
    const changed1 = update(mockState2, deleteField(mockField1));
    const changed2 = update(changed1, deleteField(mockField2));
    const changed3 = update(changed2, deleteField(mockField3));
    expect(changed3.fieldTypes.length).toEqual(mockState2.fieldTypes.length);
    expect(changed3.fieldsState.length).toEqual(mockState2.fieldsState.length - 3);
    expect(changed3.fieldsStateHistory.length).toEqual(3);
  });
});
