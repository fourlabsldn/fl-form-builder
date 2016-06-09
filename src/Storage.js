/**
 * This class takes care of storing forms in local storage
 * as well as sending it to the database, and keeping intermediate states
 * so as to add the undo function.
 * @class Storage
 */
export default class Storage {
  constructor() {
    this.currentState = null;
    this.history = [];
    Object.preventExtensions(this);
  }

  saveContent(content) {
    console.warn('Not implemented.');
    console.log(content);
  }

  pushHistoryState(state) {
    console.log(`Pushing history state of index: ${this.history.length}`);
    if (this.currentState) {
      this.history.push(this.currentState);
    }
    this.currentState = state;
  }

  /**
   * @method popHistoryState
   * @return {Object} - A State object
   */
  popHistoryState() {
    this.currentState = this.history.pop();
    console.log(`Popping history state of index: ${this.history.length || undefined}`);
    return this.currentState;
  }

}
