import FormComponent from './FormComponent';

const defaultPlaceholder = 'Insert a placeholder text';

/**
 * @abstract @class TextComponent
 */
export default class TextComponent extends FormComponent {
  static getInfo() {
    const info = super.getInfo();
    info.group = 'Text Components';
    return info;
  }

  constructor(modulePrefix, tagName, fieldType = 'text') {
    super(modulePrefix);
    this.fieldType = fieldType;
    this.buildComponent(tagName, fieldType);
    this.focus();
  }

  buildComponent(tagName, fieldType) {
    const textElement = document.createElement(tagName);
    textElement.type = fieldType;

    textElement.classList.add(
      `${this.cssPrefix}-${this.constructor.name}`,
      'form-control' // Bootstrap
    );
    this.html.textElement = textElement;
    this.focusElement = textElement;
    this.html.content.appendChild(textElement);

    this.setPlaceholder(defaultPlaceholder);
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
      this.html.textElement.value = this.getPlaceholder();
      this.html.textElement.type = 'text';
      return;
    }
    this.setPlaceholder(this.html.textElement.value);
    this.html.textElement.type = this.fieldType;
    this.html.textElement.value = '';
  }

  setPlaceholder(text) {
    if (this.isConfigVisible) {
      this.html.textElement.value = text;
    }
    this.html.textElement.setAttribute('placeholder', text);
  }

  getPlaceholder() {
    return this.html.textElement.getAttribute('placeholder');
  }

  /**
   * @override @method exportState
   * @return {Object}
   */
  exportState() {
    const output = super.exportState();
    const placeholder = this.getPlaceholder();
    // We don't want to export the default placeholder.
    output.placeholder = placeholder === defaultPlaceholder ? '' : placeholder;
    return output;
  }

  /**
   * @override @method importState
   * @param  {Object} state
   * @return {void}
   */
  importState(state) {
    super.importState(state);
    this.setPlaceholder(state.placeholder);
  }
}
