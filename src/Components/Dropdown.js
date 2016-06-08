import FormComponent from './FormComponent';

export default class Dropdown extends FormComponent {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.buildComponent();
    this.buildOptionsConfiguration();
    this.buildComponentSpecificConfiguration();

    Object.preventExtensions(this);


    // Create placeholder
    this.addOption('Select an option');
    this.html.options[0].disabled = true;
    this.html.options[0].selected = true;
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

  buildComponentSpecificConfiguration() {
    this.html.configOptions = {};

    const disabledOptionWrapper = document.createElement('label');
    const disabledOption = document.createElement('input');
    disabledOption.type = 'checkbox';
    disabledOptionWrapper.appendChild(disabledOption);
    disabledOptionWrapper.appendChild(document.createTextNode('Disabled'));

    this.html.configOptions.disabledOption = disabledOption;
    this.html.componentSpecificConfiguration.appendChild(disabledOptionWrapper);
  }

  /**
   * Fetches component specific options and clears component-specific fields
   * @method getComponentSpecificOptions
   * @return {Array}
   */
  getComponentSpecificOptions() {
    // Fetch data
    const disabledOption = this.html.configOptions.disabledOption.checked;

    // Reset fields
    this.html.configOptions.disabledOption.checked = false;
    return [disabledOption];
  }

  addOption(text, disabled = false) {
    const newOption = document.createElement('option');
    if (disabled) { newOption.setAttribute('disabled', true); }
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
