/**
 * This class takes care of storing forms in local storage
 * as well as sending it to the database, and keeping intermediate states
 * so as to add the undo function.
 * @class Storage
 */
export default class Storage {
  constructor() {
    this.history = [];
    Object.preventExtensions(this);
  }

  saveContent(content) {
    console.warn('Not implemented.');
    console.log(content);
  }

  pushHistoryState(state) {
    console.log(`Pushing history state: ${this.history.length}`);
    this.history.push(state);
  }

  /**
   * @method popHistoryState
   * @return {Object} - A State object
   */
  popHistoryState() {
    console.log(`Popping history state: ${this.history.length}`);
    return this.history.pop();
  }

}
