/* eslint-disable new-cap */

import Immutable from "seamless-immutable";
import { curry, lens, prop, prepend, over, set, pipe } from "ramda";
import Either from "data.either";

export const updateAt = curry((keyArray, newVal, obj) => {
  const deepNewVal = keyArray.reduceRight(
    (result, key) => ({ [key]: result })
    , newVal
  );

  return Immutable(obj).merge(deepNewVal, { deep: true });
});

// State lenses
export const StateLenses = {
  fieldTypes: lens(prop("fieldTypes"), updateAt(["fieldTypes"])),
  fieldsState: lens(prop("fieldsState"), updateAt(["fieldsState"])),
  fieldsStateHistory: lens(prop("fieldsStateHistory"), updateAt(["fieldsStateHistory"])),
};

// _ => String
export const createId = _ =>
  Date.now().toString();

// State -> [fieldsState] -> State
export const pushHistoryState = curry((state, newHistoryState) => pipe(
  // Add current state to history
  over(StateLenses.fieldsStateHistory, prepend(state.fieldsState)),
  // Make new State the current
  set(StateLenses.fieldsState, newHistoryState)
)(state));


// State -> State
export const hideConfigs = state =>
  set(
    StateLenses.fieldsState,
    state.fieldsState.map(s => Object.assign({}, s, { configShowing: false })),
    state
  );


// String -> String -> Object -> Either String Object
const propertyTypeCheck = curry((propertyName, type, obj) =>
  typeof obj[propertyName] === type
    ? Either.Right(obj)
    : Either.Left(`Property 'required' cannot be of type ${typeof obj.required}`)
);

// Checks that a field has its essential properties
// Object -> Either String Object
export const validateField = fieldState =>
  Either.fromNulleble(fieldState)
    .leftMap("A field State cannot be empty")
    .chain(propertyTypeCheck("required", "boolean"))
    .chain(propertyTypeCheck("configShowing", "boolean"))
    .chain(propertyTypeCheck("id", "string"));
