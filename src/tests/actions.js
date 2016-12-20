/* eslint-env jasmine */

import {
  undo,
  importState,
  createField,
  fieldCreated,
} from "../js/Actions";

describe("Action", () => {
  describe("undo", () => {
    it("returns the correct action type", () => {
      const action = undo();
      expect(action.type).toEqual("undo");
    });
  });

  describe("importState", () => {
    const mockStateToImport = ["a", "b"];

    it("returns the correct action type", () => {
      const action = importState(mockStateToImport);
      expect(action.type).toEqual("importState");
    });

    it("Creates the correct variables", () => {
      const action = importState(mockStateToImport);
      expect(action.newFieldsState).toEqual(mockStateToImport);
    });
  });

  describe("createField", () => {
    const fieldType = "testField";

    it("returns the correct action type", () => {
      const action = createField(fieldType);
      expect(action.type).toEqual("createField");
    });

    it("Creates the correct variables", () => {
      const action = createField(fieldType);
      expect(action.fieldType).toEqual(fieldType);
    });
  });

  describe("fieldCreated", () => {
    const createdFieldState = {};

    it("returns the correct action type", () => {
      const action = fieldCreated(createdFieldState);
      expect(action.type).toEqual("fieldCreated");
    });

    it("Creates the correct variables", () => {
      const action = fieldCreated(createdFieldState);
      expect(action.createdFieldState).toEqual(createdFieldState);
    });
  });
});
