/* eslint-env jasmine */
/* eslint-disable quote-props */

import { updateField } from "../../js/Actions";
import update from "../../js/Update";

const oldFieldState = {
  type: "fictitious-instance",
  id: "0",
  configShowing: false,
  required: false,
  color: "blue",
};
const newFieldState = Object.assign({}, oldFieldState, { color: "green" });
const mockCurrentState = [oldFieldState, { id: 1 }, { id: 2 }];
const mockHistory = [];
const mockState = {
  fieldTypes: [{ info: { type: "fictitious-instance" } }],
  fieldsState: mockCurrentState,
  fieldsStateHistory: mockHistory,
};

const fieldUpdateAction = updateField(newFieldState);
const newState = update(mockState, fieldUpdateAction);

describe("Update.updateField", () => {
  it("outputs a state the field updated", () => {
    expect(newState.fieldsState.length).toEqual(mockState.fieldsState.length);
    expect(
      newState.fieldsState
      .find(v => v.color === newFieldState.color)
    ).not.toEqual(undefined);
  });

  it("outputs a state the updated field in the correct order", () => {
    expect(newState.fieldsState[0].id).toEqual(mockState.fieldsState[0].id);
    expect(newState.fieldsState[0].color).toEqual(newFieldState.color);
  });

  it("sends the current state to history", () => {
    const recentHistoryState = newState.fieldsStateHistory[0];
    expect(recentHistoryState.length).toEqual(mockCurrentState.length);
    expect(recentHistoryState[0].id).toEqual(mockCurrentState[0].id);
    expect(recentHistoryState[0].color).toEqual(mockCurrentState[0].color);
  });

  it("Returns the current state if an invalid field state is given to it", () => {
    const isSame = (state1, state2) => {
      expect(state1.fieldTypes.length).toEqual(state2.fieldTypes.length);
      expect(state1.fieldsState.length).toEqual(state2.fieldsState.length);
      expect(state1.fieldsState[0].color).toEqual(state2.fieldsState[0].color);
      expect(state1.fieldsState[0].id).toEqual(state2.fieldsState[0].id);
      expect(state1.fieldsStateHistory.length).toEqual(state2.fieldsStateHistory.length);
    };

    const sameState1 = update(mockState, updateField(null));
    isSame(mockState, sameState1);

    const sameState2 = update(
      mockState,
      updateField(Object.assign({}, newFieldState, { id: null }))
    );
    isSame(mockState, sameState2);

    const sameState3 = update(
      mockState,
      updateField(Object.assign({}, newFieldState, { configShowing: null }))
    );
    isSame(mockState, sameState3);

    const sameState4 = update(
      mockState,
      updateField(Object.assign({}, newFieldState, { required: null }))
    );

    isSame(mockState, sameState4);
  });

  it("does not break the state after updating a field multiple times a field", () => {
    const mockField1 = Object.assign({}, oldFieldState, { color: "yellow" });
    const mockField2 = Object.assign({}, oldFieldState, { color: "orange" });
    const mockField3 = Object.assign({}, oldFieldState, { color: "purple" });

    const changed1 = update(mockState, updateField(mockField1));
    const changed2 = update(changed1, updateField(mockField2));
    const changed3 = update(changed2, updateField(mockField3));
    expect(changed3.fieldTypes.length).toEqual(mockState.fieldTypes.length);
    expect(changed3.fieldsState.length).toEqual(mockState.fieldsState.length);
    expect(changed3.fieldsState[0].id).toEqual(mockState.fieldsState[0].id);
    expect(changed3.fieldsState[0].color).toEqual(mockField3.color);
    expect(changed3.fieldsStateHistory.length).toEqual(3);
  });
});
