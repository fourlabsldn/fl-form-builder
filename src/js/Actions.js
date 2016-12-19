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
