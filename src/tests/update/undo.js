/* eslint-env jasmine */

import { undo as undoAction } from "../../js/Actions";
import update from "../../js/Update";

const currentFieldsState = ["current"];
const oldFieldsState = ["old"];
const mockState = {
  fieldTypes: [],
  fieldsState: currentFieldsState,
  fieldsStateHistory: [oldFieldsState],
};

const emptyMockState = {
  fieldTypes: [],
  fieldsState: [],
  fieldsStateHistory: [],
};

const emptyHistoryMockState = {
  fieldTypes: [],
  fieldsState: currentFieldsState,
  fieldsStateHistory: [],
};

describe("Update.undo", () => {
  it("removes first old state from history", () => {
    const modifiedState = update(mockState, undoAction());
    expect(modifiedState.fieldsStateHistory.length).toEqual(0);
  });

  it("sets first old state as current state", () => {
    const modifiedState = update(mockState, undoAction());
    expect(modifiedState.fieldsState).toEqual(oldFieldsState);
  });

  it("doesn't modify the state if there aren't more history states to undo", () => {
    const modifiedState = update(emptyMockState, undoAction());
    expect(modifiedState).toEqual(emptyMockState);
  });

  it("set's the current state to empty if there are no more history states", () => {
    const modifiedState = update(emptyHistoryMockState, undoAction());
    expect(modifiedState.fieldsState.length).toEqual(0);
  });
});
