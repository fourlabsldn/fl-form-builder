import OptionsComponent from './OptionsComponent';
import utils from '../utils/utils';

export default class Dropdown extends OptionsComponent {
  static getInfo() {
    const info = super.getInfo();
    info.description = 'Dropdown';
    info.iconClass = 'glyphicon glyphicon-collapse-down';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix);
    Object.preventExtensions(this);

    // Create placeholder
    this.addOption('Select an option');
    this.html.options[0].disabled = true;
    this.html.options[0].selected = true;
  }

  buildHtml() {
    super.buildHtml();
    this.buildComponent();
    this.buildComponentSpecificConfiguration();
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
    const newOptionDisabledWrapper = document.createElement('label');

    const newOptionDisabled = document.createElement('input');
    newOptionDisabled.classList.add(
      `${this.cssPrefix}-configuration-options-optionDisabled`
    );
    newOptionDisabled.type = 'checkbox';
    newOptionDisabledWrapper.appendChild(newOptionDisabled);
    newOptionDisabledWrapper.appendChild(document.createTextNode('Divider'));

    const optionConfig = this.html.configuration.children[0];
    this.html.newOptionDisabled = newOptionDisabled;
    optionConfig.appendChild(newOptionDisabledWrapper);
  }

  submitOptionFromConfigBar() {
    if (!this.html.newOptionText.value.trim()) {
      utils.blinkRed(this.html.newOptionText, this.modulePrefix);
      return;
    }
    this.addOption(
      this.html.newOptionText.value,
      this.html.newOptionDisabled.checked
    );
    this.html.newOptionDisabled.checked = false;
    this.html.newOptionText.value = '';
    this.triggerChangeIfNeeded();
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

  /**
   * @override @method exportState
   * @return {Object}
   */
  exportState() {
    const output = super.exportState();
    output.disabledIndexes = [];
    this.html.options.forEach((o, index) => {
      if (o.hasAttribute('disabled')) {
        output.disabledIndexes.push(index);
      }
    });
    return output;
  }


  /**
   * @override @method importState
   * @return {void}
   */
  importState(state) {
    super.importState(state);
    for (const disabledIndex of state.disabledIndexes) {
      this.html.options[disabledIndex].setAttribute('disabled', true);
    }
  }
}
