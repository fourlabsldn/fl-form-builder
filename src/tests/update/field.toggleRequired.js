/* eslint-env jasmine */

import { toggleRequired } from "../../js/Actions";
import update from "../../js/Update";


const fieldStateIsRequired = {
  id: 123,
  required: true,
};

const fieldStateIsNotRequired = {
  id: 321,
  required: false,
};

const mockState = {
  fieldTypes: [],
  fieldsState: [fieldStateIsRequired, fieldStateIsNotRequired],
  fieldsStateHistory: [],
};

describe("Update.toggleRequired", () => {
  it("turns the required option to false when needed", () => {
    const modifiedState = update(mockState, toggleRequired(fieldStateIsRequired));
    expect(
      modifiedState.fieldsState
      .find(f => f.id === fieldStateIsRequired.id)
      .required
    ).toEqual(false);
  });

  it("turns the required option to true when needed", () => {
    const modifiedState = update(mockState, toggleRequired(fieldStateIsNotRequired));
    expect(
      modifiedState.fieldsState
      .find(f => f.id === fieldStateIsRequired.id)
      .required
    ).toEqual(true);
  });

  it("adds the last state to the history", () => {
    const modifiedState = update(mockState, toggleRequired(fieldStateIsRequired));
    expect(modifiedState.fieldsStateHistory.length).toEqual(1);
    expect(modifiedState.fieldsStateHistory[0][0].id).toEqual(mockState.fieldsState[0].id);
    expect(modifiedState.fieldsStateHistory[0][1].id).toEqual(mockState.fieldsState[1].id);
  });
});
