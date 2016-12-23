import { curry, prop, over, filter } from "ramda";
import { StateLenses, pushHistoryState } from "./utils";
import Maybe from "data.maybe";

// State -> Object -> State
const historyStateWithoutField = curry((state, fieldState) =>
  over(
    StateLenses.fieldsState,
    filter(fs => fs.id !== fieldState.id),
    state
  )
);

export default (state, { fieldState }) =>
  Maybe.fromNullable(fieldState)
  .map(historyStateWithoutField(state))
  .map(prop("fieldsState"))
  .map(pushHistoryState(state))
  .getOrElse(state);
