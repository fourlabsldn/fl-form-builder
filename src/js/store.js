// @flow
import { createStore } from 'redux';
import update from './Update';

const initialState = {
  fieldTypes: [],
  fieldsState: [],
  fieldsStateHistory: [], // array of fieldStates
};

const store = createStore(update, initialState);

export default store;
