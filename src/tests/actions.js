/* eslint-env jasmine */

import {
  undo,
  importState,
  createField,
  fieldCreated,
  toggleConfig,
  toggleRequired,
  deleteField,
  updateField,
  reorderFields,
  importCustomComponents,
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

  describe("toggleConfig", () => {
    const fieldState = {};

    it("returns the correct action type", () => {
      const action = toggleConfig(fieldState);
      expect(action.type).toEqual("toggleConfig");
    });

    it("Creates the correct variables", () => {
      const action = toggleConfig(fieldState);
      expect(action.fieldState).toEqual(fieldState);
    });
  });

  describe("toggleRequired", () => {
    const fieldState = {};

    it("returns the correct action type", () => {
      const action = toggleRequired(fieldState);
      expect(action.type).toEqual("toggleRequired");
    });

    it("Creates the correct variables", () => {
      const action = toggleRequired(fieldState);
      expect(action.fieldState).toEqual(fieldState);
    });
  });

  describe("deleteField", () => {
    const fieldState = {};

    it("returns the correct action type", () => {
      const action = deleteField(fieldState);
      expect(action.type).toEqual("deleteField");
    });

    it("Creates the correct variables", () => {
      const action = deleteField(fieldState);
      expect(action.fieldState).toEqual(fieldState);
    });
  });

  describe("updateField", () => {
    const newFieldState = {};

    it("returns the correct action type", () => {
      const action = updateField(newFieldState);
      expect(action.type).toEqual("updateField");
    });

    it("Creates the correct variables", () => {
      const action = updateField(newFieldState);
      expect(action.newFieldState).toEqual(newFieldState);
    });
  });

  describe("reorderFields", () => {
    const newFieldsOrder = {};

    it("returns the correct action type", () => {
      const action = reorderFields(newFieldsOrder);
      expect(action.type).toEqual("reorderFields");
    });

    it("Creates the correct variables", () => {
      const action = reorderFields(newFieldsOrder);
      expect(action.newFieldsOrder).toEqual(newFieldsOrder);
    });
  });

  describe("importCustomComponents", () => {
    const customComponents = [];

    it("returns the correct action type", () => {
      const action = importCustomComponents(customComponents);
      expect(action.type).toEqual("importCustomComponents");
    });

    it("Creates the correct variables", () => {
      const action = importCustomComponents(customComponents);
      expect(action.customComponents).toEqual(customComponents);
    });
  });
});
