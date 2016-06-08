import Component from './FormComponent';

export default class RadioBtns extends Component {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.buildOptionsConfiguration();
    Object.preventExtensions(this);

    this.addOption('Insert an option');
  }

  addOption(text) {
    const newOption = document.createElement('div');
    newOption.classList.add(`${this.cssPrefix}-option`);

    const optionRadio = document.createElement('input');
    optionRadio.type = 'radio';
    newOption.appendChild(optionRadio);

    const optionText = document.createElement('span');
    optionText.classList.add(`${this.cssPrefix}-option-text`);
    optionText.textContent = text;
    newOption.appendChild(optionText);

    this.html.options.push(newOption);
    this.html.content.appendChild(newOption);
    this.addEditable(optionText);
  }
}
