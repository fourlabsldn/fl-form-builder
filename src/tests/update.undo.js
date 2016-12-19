/* eslint-env jasmine */

import { undo as undoAction } from "../js/Actions";
import update from "../js/Update";

const currentFieldsState = ["current"];
const oldFieldsState = ["old"];
const mockState = {
  fieldTypes: [],
  fieldsState: currentFieldsState,
  fieldsStateHistory: [oldFieldsState],
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
});
