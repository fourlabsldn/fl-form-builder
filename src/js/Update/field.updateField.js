import { curry, prop, over, map } from "ramda";
import { StateLenses, pushHistoryState, validateField } from "./utils";

// State -> Object -> State
const updateFieldState = curry((state, newFieldState) =>
  over(
    StateLenses.fieldsState,
    map(fs => fs.id === newFieldState.id ? newFieldState : fs),
    state
  )
);

export default (state, { newFieldState }) =>
  validateField(newFieldState) // Either
  .map(updateFieldState(state))
  .map(prop("fieldsState"))
  .map(pushHistoryState(state))
  .leftMap(console.error)
  .getOrElse(state);
