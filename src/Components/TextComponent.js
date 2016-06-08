import FormComponent from './FormComponent';

/**
 * @abstract @class TextComponent
 */
export default class TextComponent extends FormComponent {
  constructor(modulePrefix, tagName, fieldType = 'text') {
    super(modulePrefix);
    this.fieldType = fieldType;
    this.buildComponent(tagName, fieldType);

    // We need to call enableEditing here again because the when it was
    // called by the parent class this.html.textElement still didn't exist
    this.enableEditing(true);
    this.focus();
  }

  buildComponent(tagName, fieldType) {
    const textElement = document.createElement(tagName);
    textElement.type = fieldType;

    textElement.classList.add(
      `${this.cssPrefix}-${this.constructor.name}`,
      'form-control' // Bootstrap
    );
    textElement.placeholder = 'Insert a placeholder text';

    this.html.textElement = textElement;
    this.focusElement = textElement;
    this.html.content.appendChild(textElement);
  }

  /**
   * @override @method enableEditing
   * @param  {Boolean} enable
   * @return {void}
   */
  enableEditing(enable = true) {
    super.enableEditing(enable);
    if (!this.html.textElement) { return; }
    if (enable) {
      this.html.textElement.value = this.html.textElement.placeholder;
      this.html.textElement.type = 'text';
      this.html.textElement.placeholder = '';
    } else {
      this.html.textElement.placeholder = this.html.textElement.value;
      this.html.textElement.type = this.fieldType;
      this.html.textElement.value = '';
    }
  }

  /**
   * @override @method exportState
   * @return {Object}
   */
  exportState() {
    const output = super.exportState();
    output.placeholder = this.html.textElement.placeholder;
    return output;
  }

  /**
   * @override @method importState
   * @param  {Object} state
   * @return {void}
   */
  importState(state) {
    super.importState(state);
    this.html.textElement.setAttribute('placeholder', state.placeholder);
  }
}
