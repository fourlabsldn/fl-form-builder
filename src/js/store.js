/* eslint-disable new-cap */
import { createStore, applyMiddleware } from "redux";
import update from "./Update";
import defaultTypes from "./default-types";
import Immutable from "seamless-immutable";

const initialState = {
  fieldTypes: defaultTypes,
  fieldsState: [],
  fieldsStateHistory: [], // array of fieldStates
};

// This middleware will just add the property "async dispatch"
// to actions with the "async" propperty set to true
export const asyncDispatchMiddleware = store => next => action => {
  let syncActivityFinished = false;
  let actionQueue = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function asyncDispatch(asyncAction) {
    actionQueue = actionQueue.concat([asyncAction]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithAsyncDispatch =
      Immutable(action).merge({ asyncDispatch });

  next(actionWithAsyncDispatch);
  syncActivityFinished = true;
  flushQueue();
};

const store = createStore(
  update,
  initialState,
  applyMiddleware(asyncDispatchMiddleware),
);

export default store;
