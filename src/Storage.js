import assert from 'fl-assert';


const MAX_HISTORY_STATES = 15;
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
    console.log(JSON.stringify(content));
  }

  pushHistoryState(state) {
    assert(state, `Invalid state being saved: ${state}`);
    if (this.history.length > MAX_HISTORY_STATES) {
      this.history = this.history.slice(1);
    }
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
    if (this.history.length > 0) {
      this.currentState = this.history.pop();
      return this.currentState;
    }
    return undefined;
  }
}
