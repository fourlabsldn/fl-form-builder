import { createStore, applyMiddleware } from "redux";
import update from "./Update";
import defaultTypes from "./default-types";
import asyncDispatchMiddleware from "./utils/asyncDispatchMiddleware";

const initialState = {
  fieldTypes: defaultTypes,
  fieldsState: [],
  fieldsStateHistory: [], // array of fieldStates
};

const store = createStore(
  update,
  initialState,
  applyMiddleware(asyncDispatchMiddleware),
);

export default store;
