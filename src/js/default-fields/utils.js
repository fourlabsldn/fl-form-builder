// Creates a new object with properties of the old one
// ovewritten by properties of the new object.
// No new properties of the new Object are added.
// overshadow Object -> Object -> Object
export function overshadow(oldObj, newObj) {
  return Object.keys(oldObj)
    .reduce((result, key) => {
      // We want to use values from newObj even if the value is set to undefined,
      // but not use it if it is not set at all. That's why we use hasOwnProperty.
      result[key] = newObj.hasOwnProperty(key) ? newObj[key] : oldObj[key]; // eslint-disable-line no-param-reassign, max-len
      return result;
    }, {});
}
