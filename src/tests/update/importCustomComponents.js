/* eslint-env jasmine */
/* eslint-disable quote-props */

import { importCustomComponents } from "../../js/Actions";
import update from "../../js/Update";

const createType = name => ({
  initialState: _ => _,
  RenderEditor: _ => _,
  info: { type: name, group: "custom", displayName: name },
});

const mockState = {
  fieldTypes: [createType("fictitious-instance")],
  fieldsState: [],
  fieldsStateHistory: [],
};

const customTypes = [
  createType("custom-1"),
  createType("custom-2"),
  createType("custom-3"),
];

const importCustomComponentsAction = importCustomComponents(customTypes);
const newState = update(mockState, importCustomComponentsAction);


describe("Update.importCustomComponents", () => {
  it("Appends the new valid custom types to the end of the existing types", () => {
    expect(newState.fieldTypes.length).toEqual(mockState.fieldTypes.length + customTypes.length);
    // expect(newState.fieldTypes[1].info.type).toEqual(customTypes[0].info.type);
    // expect(newState.fieldTypes[2].info.type).toEqual(customTypes[1].info.type);
    // expect(newState.fieldTypes[3].info.type).toEqual(customTypes[2].info.type);
  });

  it("Returns an unchanged array if customTypes is invalid", () => {
    expect(update(mockState, importCustomComponents(null))).toEqual(mockState);

    const invalid1 = [
      Object.assign({}, createType("custom-1"), { info: null }),
    ];
    expect(update(mockState, importCustomComponents(invalid1))).toEqual(mockState);

    const invalid2 = [
      Object.assign(
        {},
        createType("custom-1"),
        { info: { type: null, group: "custom", displayName: "custom" } }),
    ];
    expect(update(mockState, importCustomComponents(invalid2))).toEqual(mockState);

    const invalid3 = [
      Object.assign(
        {},
        createType("custom-1"),
        { info: { type: "custom", group: null, displayName: "custom" } }
      ),
    ];
    expect(update(mockState, importCustomComponents(invalid3))).toEqual(mockState);

    const invalid4 = [
      Object.assign(
        {},
        createType("custom-1"),
        { info: { type: "custom", group: "custom", displayName: null } }),
    ];
    expect(update(mockState, importCustomComponents(invalid4))).toEqual(mockState);

    const invalid5 = [
      Object.assign(
        {},
        createType("custom-1"),
        { RenderEditor: "not a function" }),
    ];
    expect(update(mockState, importCustomComponents(invalid5))).toEqual(mockState);

    const invalid6 = [
      Object.assign(
        {},
        createType("custom-1"),
        { initialState: "not a function" }),
    ];
    expect(update(mockState, importCustomComponents(invalid6))).toEqual(mockState);
  });
});
