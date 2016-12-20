import { curry, pipe, prop, over, append } from "ramda";
import { hideConfigs, StateLenses, pushHistoryState } from "./utils";
import Maybe from "data.maybe";

// State -> Object -> State
const historyStateWithNewField = curry((state, newField) => pipe(
  hideConfigs,
  over(StateLenses.fieldsState, append(newField))
)(state));

export default (state, { createdFieldState }) =>
  Maybe.of(createdFieldState)
  .map(historyStateWithNewField(state))
  .map(prop("fieldsState"))
  .map(pushHistoryState(state))
  .getOrElse(state);
