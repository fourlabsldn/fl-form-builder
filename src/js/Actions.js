//
//    ACTION CREATORS
//

export const undo = _ =>
({
  type: "undo",
});

export const importState = newFieldsState =>
({
  type: "importState",
  newFieldsState,
});

export const createField = fieldType =>
({
  type: "createField",
  fieldType,
});

export const fieldCreated = createdFieldState =>
({
  type: "fieldCreated",
  createdFieldState,
});
