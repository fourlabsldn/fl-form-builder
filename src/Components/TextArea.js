import FormComponent from './FormComponent';

export default class TextArea extends FormComponent {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.buildComponent();
    Object.preventExtensions(this);

    // We need to call enableEditing here again because the when it was
    // called by the parent class this.html.textArea still didn't exist
    this.enableEditing(true);
    this.focus();
  }

  buildComponent() {
    const textArea = document.createElement('textarea');
    textArea.setAttribute('rows', 5);

    textArea.classList.add(
      `${this.cssPrefix}-${this.constructor.name}`,
      'form-control' // Bootstrap
    );
    textArea.placeholder = 'Insert a placeholder text';

    this.html.textArea = textArea;
    this.focusElement = textArea;
    this.html.content.appendChild(textArea);
  }

  /**
   * @override @method enableEditing
   * @param  {Boolean} enable
   * @return {void}
   */
  enableEditing(enable = true) {
    super.enableEditing(enable);
    if (!this.html.textArea) { return; }
    if (enable) {
      this.html.textArea.value = this.html.textArea.placeholder;
      this.html.textArea.placeholder = '';
    } else {
      this.html.textArea.placeholder = this.html.textArea.value;
      this.html.textArea.value = '';
    }
  }
}
