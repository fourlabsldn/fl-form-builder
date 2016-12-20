/* eslint-disable new-cap */
import { prop, find, identity, pipe } from "ramda";
import { createId } from "./utils";
import Either from "data.either";
import Task from "data.task";
import Immutable from "seamless-immutable";
import { fieldCreated } from "../Actions";

// State -> String -> Either String Function
const typeConstructor = (state, fieldType) => {
  console.log("PIECE OF FUCK!", fieldType);
  return Either.of(state)
    .map(prop("fieldTypes"))
    .map(find(v => v.info.type === fieldType))
    .chain(Either.fromNullable)
    .bimap(_ => `Field "${fieldType}" does not exist.`, identity);
};

// { initialState: Function } -> Task String Object
const createField = constr =>
  new Task((reject, resolve) =>
    // This is a quick hack so that we can handle initial state if
    // it is a promise and if it isn"t.
    Promise.resolve()
    .then(() => constr.initialState())
    .then(resolve)
    .catch(reject)
  );

// Object -> Object
const insertRequiredProps = field =>
  Immutable(field).merge({
    id: createId(),
    configShowing: true,
  }, {
    deep: true,
  });

// This is an async action. When it is finished it will trigger the
// field created action
export default (state, { fieldType }) =>
( console.log('here?') ||
  (v => console.log('Called with', v))
)


// (asyncDispatch =>
//   typeConstructor(state, fieldType)
//   .map(createField) // Either String (Task String Object)
//   .fold(Task.rejected, identity) // Task String Object
//   .map(insertRequiredProps)
//   .fork( // execute task
//     console.error,
//     pipe(fieldCreated)
//   ))
