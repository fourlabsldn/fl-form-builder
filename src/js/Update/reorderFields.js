/* eslint-disable new-cap */
import { curry, pipe, prop, over, sort } from "ramda";
import { hideConfigs, StateLenses, pushHistoryState } from "./utils";
import Either from "data.either";

// State -> Object -> State
const historyStateWithNewOrder = curry((state, newOrder) => pipe(
  hideConfigs,
  over(
    StateLenses.fieldsState,
    sort((f1, f2) => newOrder.indexOf(f1.id) - newOrder.indexOf(f2.id))
  )
)(state));

export default (state, { newFieldsOrder }) =>
  (newFieldsOrder && Array.isArray(newFieldsOrder)
    ? Either.Right(newFieldsOrder)
    : Either.Left(`newFieldsOrder must be an array but received ${typeof newFieldsOrder}`)
  )
  .chain(o =>
    o.length === state.fieldsState.length
      ? Either.Right(o)
      : Either.Left(`newFieldsOrder has ${o.length} elements, but the current state has ${state.fieldsState.length} elements`) // eslint-disable-line max-len
  )
  .chain(o => {
    const stateIds = state.fieldsState.map(prop("id"));
    const noMissingId = stateIds.reduce((acc, fId) => acc && o.includes(fId), true);
    return noMissingId
      ? Either.Right(o)
      : Either.Left("Not all ids in the new order are matched in the existing state ids.");
  })
  .map(historyStateWithNewOrder(state))
  .map(prop("fieldsState"))
  .map(pushHistoryState(state))
  .leftMap(err => console.error(`Unable to reorder: ${err}`))
  .getOrElse(state);
