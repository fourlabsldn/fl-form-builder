/**
 * This class takes care of storing forms in local storage
 * as well as sending it to the database, and keeping intermediate states
 * so as to add the undo function.
 * @class Storage
 */
export default class Storage {
  constructor() {
    Object.preventExtensions(this);
  }

  saveContent(content) {
    console.warn('Not implemented.');
    console.log(content);
  }
}
