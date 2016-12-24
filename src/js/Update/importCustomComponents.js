/* @flow weak */
/* eslint-disable new-cap */
import { StateLenses, propertyTypeCheck } from "./utils";
import { over, traverse, curry } from "ramda";
import Either from "data.either";

// [a] => Either String [a]
const isArray = arr =>
  Array.isArray(arr)
    ? Either.Right(arr)
    : Either.Left(`Expected Array but received ${typeof arr}`); // eslint-disable-line max-len

// Object -> Either String Object
const hasRequiredInfo = component =>
  propertyTypeCheck("initialState", "function", component)
  .chain(propertyTypeCheck("RenderEditor", "function"))
  .chain(propertyTypeCheck("info", "object"))
  .chain(c => Either.fromNullable(c.info))
  .chain(propertyTypeCheck("type", "string"))
  .chain(propertyTypeCheck("displayName", "string"))
  .chain(propertyTypeCheck("group", "string"))
  .chain(_ => Either.Right(component));

const isComponentValid = customComponents =>
  traverse(Either.of, hasRequiredInfo, customComponents);

// [a] -> [a] -> Either String [a]
const validateComponents = customComponents =>
  Either.Right(customComponents)
    .chain(isArray)
    .chain(isComponentValid);

const addToFieldTypes = curry((state, customComponents) =>
  over(StateLenses.fieldTypes, s => s.concat(customComponents), state)
);

// If there are any problems with the import, the same state
// will be returned
export default (state, { customComponents }) =>
  (customComponents
    ? Either.Right(customComponents)
    : Either.Left("Empty custom components")
  )
    .chain(validateComponents)
    .leftMap(err => console.error("Invalid custom components:", err))
    .map(addToFieldTypes(state))
    .getOrElse(state);
