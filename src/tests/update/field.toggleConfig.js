/* eslint-env jasmine */

import { toggleConfig } from "../../js/Actions";
import update from "../../js/Update";


const fieldStateConfigShowing = {
  id: 123,
  configShowing: true,
};

const fieldStateConfigNotShowing = {
  id: 321,
  configShowing: false,
};

const mockState = {
  fieldTypes: [],
  fieldsState: [fieldStateConfigShowing, fieldStateConfigNotShowing],
  fieldsStateHistory: [],
};

describe("Update.toggleConfig", () => {
  it("turns the config option to false when needed", () => {
    const modifiedState = update(mockState, toggleConfig(fieldStateConfigShowing));
    expect(
      modifiedState.fieldsState
      .find(f => f.id === fieldStateConfigShowing.id)
      .configShowing
    ).toEqual(false);
  });

  it("turns the config option to true when needed", () => {
    const modifiedState = update(mockState, toggleConfig(fieldStateConfigNotShowing));
    expect(
      modifiedState.fieldsState
      .find(f => f.id === fieldStateConfigShowing.id)
      .configShowing
    ).toEqual(true);
  });

  it("adds the last state to the history", () => {
    const modifiedState = update(mockState, toggleConfig(fieldStateConfigShowing));
    expect(modifiedState.fieldsStateHistory.length).toEqual(1);
    expect(modifiedState.fieldsStateHistory[0][0].id).toEqual(mockState.fieldsState[0].id);
    expect(modifiedState.fieldsStateHistory[0][1].id).toEqual(mockState.fieldsState[1].id);
  });
});
