/* eslint-disable no-nested-ternary */
import assert from "fl-assert";
import undo from "./undo";
import importState from "./importState";
import createField from "./createField";
import fieldCreated from "./fieldCreated";
import toggleConfig from "./field.toggleConfig";
import toggleRequired from "./field.toggleRequired";
import deleteField from "./field.deleteField";

const actionHandlers = {
  undo,
  importState,
  createField,
  fieldCreated,
  toggleConfig,
  toggleRequired,
  deleteField,
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
