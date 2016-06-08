import FormComponent from './FormComponent';

export default class TextBox extends FormComponent {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.buildComponent();
    Object.preventExtensions(this);
  }

  buildComponent() {
    const textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.classList.add(
      `${this.cssPrefix}-${this.constructor.name}`,
      'form-control' // Bootstrap
    );
    textBox.placeholder = 'Test';

    this.addEditable(textBox);
    this.html.textBox = textBox;
    this.focusElement = textBox;
    this.html.content.appendChild(textBox);
  }
}
