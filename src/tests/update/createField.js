/* eslint-env jasmine */
/* eslint-disable quote-props */

import { createField } from "../../js/Actions";
import update from "../../js/Update";

const promiseTypeInstance = { type: "promise-instance" };
const promiseType = {
  info: { type: "PromiseType" },
  initialState: () => Promise.resolve(promiseTypeInstance),
};

const syncTypeInstance = { type: "sync-instance" };
const syncType = {
  info: { type: "SyncType" },
  initialState: () => syncTypeInstance,
};

const typesArray = [promiseType, syncType];
const mockCurrentState = ["a", "b"];
const mockHistory = [];
const mockState = {
  fieldTypes: typesArray,
  fieldsState: mockCurrentState,
  fieldsStateHistory: mockHistory,
};

describe("Update.createField", () => {
  it("creates fields asynchronously", done => {
    const asyncDispatch = v => {
      expect(v).not.toEqual(undefined);
      done();
    };

    const asyncAcion = Object.assign(
      { asyncDispatch },
      createField(syncType.info.type)
    );

    update(mockState, asyncAcion);
  });

  it("returns a 'fieldCreated' action when field is created", done => {
    const asyncDispatch = action => {
      expect(action.type).toEqual("fieldCreated");
      done();
    };

    const asyncAcion = Object.assign(
      { asyncDispatch },
      createField(syncType.info.type)
    );

    update(mockState, asyncAcion);
  });

  it("creates types with constructors that return a plain object", done => {
    const asyncDispatch = action => {
      expect(action.createdFieldState).not.toEqual(undefined);
      expect(action.createdFieldState.type).toEqual(syncTypeInstance.type);
      done();
    };

    const asyncAcion = Object.assign(
      { asyncDispatch },
      createField(syncType.info.type)
    );

    update(mockState, asyncAcion);
  });

  it("creates types with constructors that return a promise", done => {
    const asyncDispatch = action => {
      expect(action.createdFieldState).not.toEqual(undefined);
      expect(action.createdFieldState.type).toEqual(promiseTypeInstance.type);
      done();
    };

    const asyncAcion = Object.assign(
      { asyncDispatch },
      createField(promiseType.info.type)
    );

    update(mockState, asyncAcion);
  });

  it("adds required fields to instance", done => {
    const asyncDispatch = action => {
      expect(action.createdFieldState.id).not.toEqual(undefined);
      expect(typeof action.createdFieldState.configShowing).toEqual("boolean");
      done();
    };

    const asyncAcion = Object.assign(
      { asyncDispatch },
      createField(promiseType.info.type)
    );

    update(mockState, asyncAcion);
  });

  it("does not create a field if type is not in model.fieldTypes", done => {
    const asyncDispatch = jasmine.createSpy("asyncDispatch");

    const asyncAcion = Object.assign(
      { asyncDispatch },
      createField("non-existing-type")
    );

    update(mockState, asyncAcion);

    setTimeout(
      () => { expect(asyncDispatch).not.toHaveBeenCalled(); done(); },
      50
    );
  });
});
