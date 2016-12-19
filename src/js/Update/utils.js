/* eslint-disable new-cap */

import Immutable from 'seamless-immutable';
import { curry, lens, prop } from 'ramda';

export const updateAt = curry((keyArray, newVal, obj) => {
  const deepNewVal = keyArray.reduceRight(
    (result, key) => ({ [key]: result })
    , newVal
  );

  return Immutable(obj).merge(deepNewVal, { deep: true });
});

// State lenses
export const StateLenses = {
  fieldTypes: lens(prop('fieldTypes'), updateAt(['fieldTypes'])),
  fieldsState: lens(prop('fieldsState'), updateAt(['fieldsState'])),
  fieldsStateHistory: lens(prop('fieldsStateHistory'), updateAt(['fieldsStateHistory'])),
};
