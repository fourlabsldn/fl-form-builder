/* @flow weak */
/* eslint-disable new-cap */
import { pushHistoryState, createId } from "./utils";
import { curry, equals, traverse, identity, path } from "ramda";
import Either from "data.either";

// [a] => Either String [a]
const isArray = arr =>
  Array.isArray(arr)
    ? Either.Right(arr)
    : Either.Left(`Invalid states sent with importState. Expected Array but received ${typeof arr}`); // eslint-disable-line max-len

const fieldTypeIsValid = curry((validTypes, field) =>
  validTypes.find(equals(field.type))
    ? Either.Right(field)
    : Either.Left(`Invalid field type ${field.type}`)
);

const validFieldTypes = curry((validTypes, fieldsState) =>
  traverse(Either.of, fieldTypeIsValid(validTypes), fieldsState)
);


// [a] -> [a] -> Either String [a]
const validateFieldsState = curry((fieldsState, state) =>
  Either.of(fieldsState)
    .chain(isArray)
    .chain(validFieldTypes(state.fieldTypes.map(path(["info", "type"]))))
);


// Add required properties that are not managed by the field
// component but by the FormBuilder component itself, so may
// not be there.
// [a] => [a]
const addRequiredProperties = fieldStates =>
  fieldStates
    .map(s => Object.assign(
      {
        configShowing: false,
        required: false,
      },
      s,
      { id: createId() }
    ));


// If there are any problems with the import, the same state
// will be returned
export default (state, { newFieldsState }) =>
  validateFieldsState(newFieldsState, state)
    .map(addRequiredProperties)
    .map(pushHistoryState(state))
    .bimap(console.error, identity)
    .getOrElse(state);
