import FormComponent from './FormComponent';

export default class Dropdown extends FormComponent {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.buildComponent();
    this.buildOptionsConfiguration();
    Object.preventExtensions(this);
  }

  buildComponent() {
    const dropdown = document.createElement('select');
    dropdown.setAttribute('multiple', true);
    dropdown.classList.add(
      `${this.cssPrefix}-${this.constructor.name}`,
      'form-control' // Bootstrap
    );

    this.html.dropdown = dropdown;
    this.focusElement = dropdown;
    this.html.content.appendChild(dropdown);
  }

  addOption(text) {
    const newOption = document.createElement('option');
    newOption.textContent = text;

    this.html.options.push(newOption);
    this.html.dropdown.appendChild(newOption);
  }

  /**
   * @override @method enableEditing
   * @param  {Boolean} enable
   * @return {void}
   */
  enableEditing(enable = true) {
    super.enableEditing(enable);
    if (!this.html.dropdown) { return; }
    if (enable) {
      this.html.dropdown.setAttribute('multiple', true);
    } else {
      this.html.dropdown.removeAttribute('multiple');
    }
  }
}
