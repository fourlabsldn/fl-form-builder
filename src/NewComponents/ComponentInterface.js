export default class ComponentInterface {

  // ========== Field editing ============

  /**
   * This method is used for both importing a state and building the element
   * for the first time. Every time a state is imported the element
   * should be rebuilt from scratch
   * @method importState
   * @param {Object | null} state
   * @return {Object} { main: HTMLElement, config: HTMLElement }
   */
  importState(state) {}

  /**
   * This object should be sufficient to rebuild the element exactly the way
   * it was at exporting time
   * @method exportState
   * @return {Object}
   */
  exportState() {}

  /**
   * Chance to do some cleanup before the component is destroyed
   * @method onDelete
   * @return {void}
   */
  onDelete() {}

  /**
   * Add required: true to the element's state
   * @method setRequired
   * @return {void}
   */
  setRequired() {}

  /**
   * Return whether the elment is required or not.
   * @method isRequired
   * @return {Boolean}
   */
  isRequired() {}

  /**
   * Change to do somethign when config opens
   * @method onConfigOpen
   * @return void
   */
  onConfigOpen() {}

  /**
   * Chance to do something when config closes
   * @method onConfigClose
   * @return void
   */
  onConfigClose() {}

  // ========== Field editing ============

  /**
   * Create the form element to be displayed in production
   * @method createFormField
   * @param {Object} state - The state that was exported during form building time
   * @return {Object} { main: HTMLElement }
   */
  createFormField() {}

  /**
   * @method getValue
   * @return {Object | Array | String} Value to be sent to server.
   */
  getValue() {}
}
