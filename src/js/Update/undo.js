import { StateLenses } from "./utils";
import { set, over, slice, pipe } from "ramda";


const undo = (state, _) => pipe(
  // Make last history last state the current one
  set(StateLenses.fieldsState, state.fieldsStateHistory[0]),
  // Remove last history state from the history array
  over(StateLenses.fieldsStateHistory, slice(1, Infinity))
)(state);

export default undo;
