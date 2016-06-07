import Component from './FormComponent';

export default class TextBox extends Component {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.buildComponent();
    Object.preventExtensions(this);
  }

  buildComponent() {
    const textBox = document.createElement('input');
    textBox.classList.add(
      `${this.cssPrefix}-textBox`,
      `${this.modulePrefix}-editable`,
      'form-control' // Bootstrap
    );
    textBox.placeholder = 'Test';

    this.html.container.appendChild(textBox);
    this.html.textBox = textBox;
    this.focusElement = textBox;
    this.html.content.appendChild(textBox);
  }

  exportContent() {
    return {
      required: this.isRequired,
      title: this.html.title.textContent,
      type: 'text', // In the future we will support 'email', 'address', etc.
    };
  }
}
