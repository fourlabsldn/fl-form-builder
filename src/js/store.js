// @flow
import { createStore } from "redux";
import update from "./Update";
import defaultTypes from "./default-types";

const initialState = {
  fieldTypes: defaultTypes,
  fieldsState: [],
  fieldsStateHistory: [], // array of fieldStates
};

const store = createStore(update, initialState);

export default store;
