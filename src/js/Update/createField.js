/* eslint-disable new-cap */
import { prop, find, identity, pipe } from "ramda";
import { createId } from "./utils";
import Either from "data.either";
import Task from "data.task";
import Immutable from "seamless-immutable";
import { fieldCreated } from "../Actions";

// State -> String -> Either String Function
const typeConstructor = (state, fieldType) => {
  return Either.of(state)
    .map(prop("fieldTypes"))
    .map(find(v => v.info.type === fieldType))
    .chain(Either.fromNullable)
    .bimap(_ => `Field "${fieldType}" does not exist.`, identity);
};

// { initialState: Function } -> Task String Object
const createField = constr =>
  new Task((reject, resolve) => {
    // Make sure the promise is only resolved once
    let called = false;
    const fieldState = constr.initialState();

    if (!(fieldState instanceof Promise)) {
      resolve(fieldState);
    } else {
      fieldState
      .then(v => {
        if (called) { return; }
        called = true;
        resolve(v);
      })
      .catch(v => {
        if (called) { throw v; }
        called = true;
        reject(v);
      });
    }
  });

// Object -> Object
const insertRequiredProps = field =>
  Immutable(field).merge({
    id: createId(),
    configShowing: true,
  }, {
    deep: true,
  });

const createFieldAsynchronously = (state, fieldType, asyncDispatch) =>
  typeConstructor(state, fieldType)
  .map(createField) // Either String (Task String Object)
  .leftMap(Task.rejected)
  .merge() // Task String Object
  .map(insertRequiredProps)
  .fork( // execute task
    err => console.error("Task rejected", err),
    pipe(fieldCreated, asyncDispatch)
  );

// This is an async action. When it is finished it will trigger the
// field created action
export default (state, { fieldType, asyncDispatch }) => {
  createFieldAsynchronously(state, fieldType, asyncDispatch);
  return state;
};
