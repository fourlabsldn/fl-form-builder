import ComponentInterface from './ComponentInterface';
import utils from '../utils/utils';
const { overshadow } = utils;

const defaultState = {
  required: false,
  type: 'TextField',
  displayName: 'Text field',
  group: 'Text Components',
  title: 'Add a title',
  placeholder: 'Add a placeholder',
};

const defaultHtml = {
  textBox: null,
  titleBox: null,
};

export default class TextField extends ComponentInterface {
  /**
   * @override @method getInfo
   * @return {Object}
   */
  static getInfo() {
    const { type, group, displayName } = defaultState;
    return { type, group, displayName };
  }

  constructor() {
    super();
    this.state = defaultState;
    this.html = defaultHtml;
    Object.preventExtensions(this);
  }

  // ========= Private methods ============ //
  /**
   * Performs a shallow merge of old state and the newState passed. Only
   * properties in defaultState are allowed
   * @private
   * @method setState
   * @param {Object} newState
   */
  setState(newState) {
    this.state = overshadow(this.state, newState);
  }

  /**
   * @method setCleanState sets the state based on the default state
   */
  setCleanState(newState) {
    this.state = overshadow(defaultState, newState);
  }

  /**
   * @method setHtml
   * @param {Object<HTMLElement>} Reference to relevant html elements
   */
  setHtml(newHtmlState) {
    this.html = overshadow(this.html, newHtmlState);
  }

  // ========== Public API ============== //

  /**
   * @override @method importState
   * @param {Object | null} state
   * @return {Object} { main: HTMLElement, config: HTMLElement }
   */
  importState(state) {
    this.setCleanState(state);

    const html = {};

    const main = document.createElement('div');
    html.textBox = document.createElement('input');
    html.textBox.setAttribute('type', 'text');
    html.textBox.placeholder = this.state.placeholder;
    main.appendChild(html.textBox);

    const config = document.createElement('div');
    html.titleBox = document.createElement('h3');
    html.titleBox.value = state.title;
    config.appendChild(html.titleBox);
    this.setHtml(html);

    return { main, config };
  }

  /**
   * @override @method exportState
   * @return {Object}
   */
  exportState() {
    // We export a copy, because we don't want anyone fiddling with out state.
    return Object.assign({}, this.state);
  }

  /**
   * @override @method onDelete
   * @return {void}
   */
  onDelete() {}

  /**
   * Add required: true to the element's state
   * @override @method setRequired
   * @param {Boolean} - whether setting required or not required.
   * @return {void}
   */
  setRequired(required) {
    this.setState({ required });
  }

  /**
   * @override @method isRequired
   * @return {Boolean}
   */
  isRequired() {
    return this.state.required;
  }

  /**
   * @override @method onConfigOpen
   * @return void
   */
  onConfigOpen() {
    this.html.titleBox.setAttribute('contenteditable', true);
    this.html.textBox.value = this.state.placeholder;
  }

  /**
   * @override @method onConfigClose
   * @return void
   */
  onConfigClose() {
    const newState = {
      title: this.html.titleBox.value,
      placeholder: this.html.textBox.value,
    };

    this.setState(newState);

    this.html.titleBox.setAttribute('contenteditable', false);
    this.html.textBox.value = '';
    this.html.textBox.placeholder = this.state.placeholder;
  }

  // ========== Field editing ============

  /**
   * Create the form element to be displayed in production
   * @override @method createFormField
   * @param {Object} state - The state that was exported during form building time
   * @return {Object} { main: HTMLElement }
   */
  createFormField(state) {
    this.setState(state);
    const main = document.createElement('div');
    const html = {};
    html.textBox = document.createElement('input');
    html.textBox.setAttribute('type', 'text');
    main.appendChild(html.textBox);

    this.setHtml(html);
    return { main };
  }

  /**
   * @override @method getValue
   * @return {String} Value to be sent to server.
   */
  getValue() {
    if (this.html.textBox) {
      return this.html.textBox.value;
    }
    return '';
  }
}
