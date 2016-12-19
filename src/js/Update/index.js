/* eslint-disable no-nested-ternary */
import assert from "fl-assert";
import undo from "./undo";
import importState from "./importState";

const actionHandlers = {
  undo,
  importState,
};

const isExpectedAction = a => a && a.type && actionHandlers[a.type];
const isReduxAction = a => a && a.type && a.type.includes("@@redux");


const update = (state, action) =>
  isExpectedAction(action)
    ? actionHandlers[action.type](state, action)
  : isReduxAction(action)
    ? state
  : assert(false, `Invalid action type: ${action.type}`);

export default update;
