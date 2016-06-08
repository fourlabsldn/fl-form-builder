import FormComponent from './FormComponent';

export default class TextArea extends FormComponent {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.buildComponent();
    Object.preventExtensions(this);
  }

  buildComponent() {
    const textArea = document.createElement('textarea');
    textArea.setAttribute('rows', 5);

    textArea.classList.add(
      `${this.cssPrefix}-textArea`,
      'form-control' // Bootstrap
    );
    textArea.placeholder = 'Test';

    this.addEditable(textArea);
    this.html.container.appendChild(textArea);
    this.html.textArea = textArea;
    this.focusElement = textArea;
    this.html.content.appendChild(textArea);
  }
}
