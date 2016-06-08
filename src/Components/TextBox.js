import FormComponent from './FormComponent';

export default class TextBox extends FormComponent {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.buildComponent();
    Object.preventExtensions(this);

    // We need to call enableEditing here again because the when it was
    // called by the parent class this.html.textBox still didn't exist
    this.enableEditing(true);
    this.focus();
  }

  buildComponent() {
    const textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.classList.add(
      `${this.cssPrefix}-${this.constructor.name}`,
      'form-control' // Bootstrap
    );
    textBox.placeholder = 'Insert a placeholder text';

    this.html.textBox = textBox;
    this.focusElement = textBox;
    this.html.content.appendChild(textBox);
  }

  /**
   * @override @method enableEditing
   * @param  {Boolean} enable
   * @return {void}
   */
  enableEditing(enable = true) {
    super.enableEditing(enable);
    if (!this.html.textBox) { return; }
    if (enable) {
      this.html.textBox.value = this.html.textBox.placeholder;
      this.html.textBox.placeholder = '';
    } else {
      this.html.textBox.placeholder = this.html.textBox.value;
      this.html.textBox.value = '';
    }
  }
}
