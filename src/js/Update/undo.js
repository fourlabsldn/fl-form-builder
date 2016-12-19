import { StateLenses } from "./utils";
import { set, over, slice, pipe } from "ramda";

const undo = (state, _) => pipe(
  set(StateLenses.fieldsState, state.fieldsStateHistory[1]),
  over(StateLenses.fieldsStateHistory, slice(1))
)(state);

export default undo;
