/* eslint-disable new-cap */
import { curry } from "ramda";
import Maybe from "data.maybe";
import Immutable from "seamless-immutable";
import { pushHistoryState } from "./utils";

const toggleConfig = fieldState =>
  Immutable(fieldState).set("configShowing", !fieldState.configShowing);

const replaceFieldState = curry((state, fieldState) =>
  state
    .fieldsState
    .map(aField => aField.id === fieldState.id
      ? fieldState
      : aField
    )
);

export default (state, { fieldState }) =>
  Maybe.fromNullable(fieldState)
  .map(toggleConfig)
  .map(replaceFieldState(state))
  .map(pushHistoryState(state))
  .getOrElse(state);
