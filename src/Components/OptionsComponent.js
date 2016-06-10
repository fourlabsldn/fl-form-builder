import FormComponent from './FormComponent';
import utils from '../utils/utils';

export default class OptionsComponent extends FormComponent {
  static getInfo() {
    const info = super.getInfo();
    info.group = 'Options Components';
    return info;
  }

  constructor(modulePrefix) {
    super(modulePrefix);
    this.html.options = [];
  }

  /**
   * In addition to building the standard html structure, it adds
   * a field to add an option.
   * @method buildHtml
   * @return {void}
   */
  buildHtml() {
    super.buildHtml();

    const optionsConfig = document.createElement('div');
    const optionsConfigCssClass = `${this.cssPrefix}-configuration-options`;
    optionsConfig.classList.add(optionsConfigCssClass);

    if (this.html.configuration.children[0]) {
      this.html.configuration.insertBefore(
        optionsConfig,
        this.html.configuration.children[0]
      );
    } else {
      this.html.configuration.appendChild(optionsConfig);
    }

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.title = 'Remove last option';
    removeBtn.classList.add(
      'glyphicon-minus-sign',
      'glyphicon',
      `${optionsConfigCssClass}-btn-remove`
    );
    removeBtn.addEventListener('click', () => this.removeOption());
    optionsConfig.appendChild(removeBtn);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.title = 'Add new option';
    addBtn.classList.add(
      'glyphicon-plus-sign',
      'glyphicon',
      `${optionsConfigCssClass}-btn-add`
    );
    addBtn.addEventListener('click', () => this.submitOptionFromConfigBar());
    optionsConfig.appendChild(addBtn);

    this.html.newOptionText = document.createElement('input');
    this.html.newOptionText.setAttribute('placeholder', 'Type a new option');
    this.html.newOptionText.setAttribute('type', 'text');
    this.html.newOptionText.classList.add(
      `${optionsConfigCssClass}-input`
    );
    this.focusElement = this.html.newOptionText;
    optionsConfig.appendChild(this.html.newOptionText);
    this.html.newOptionText.addEventListener('keypress', (e) => {
      if (e.which === 13) {
        const click = new Event('click');
        addBtn.dispatchEvent(click);
        e.preventDefault();
        return false; //  returning false will prevent the event from bubbling up.
      }
      return true;
    });

    this.focus();
  }

  submitOptionFromConfigBar() {
    if (!this.html.newOptionText.value.trim()) {
      utils.blinkRed(this.html.newOptionText, this.modulePrefix);
      return;
    }
    this.addOption(this.html.newOptionText.value);
    this.html.newOptionText.value = '';
    this.triggerChangeIfNeeded();
  }

  /**
   * This method is supposed to be extended by subclasses and they will
   * define the optionType or change this method completely.
   * @method addOption
   * @param  {String} text
   * @param  {Stirng} optionType
   */
  addOption(text, optionType) {
    const newOption = document.createElement('div');
    newOption.classList.add(`${this.cssPrefix}-option`);

    const optionCheckbox = document.createElement('input');
    optionCheckbox.type = optionType;
    newOption.appendChild(optionCheckbox);

    const optionText = document.createElement('span');
    optionText.classList.add(`${this.cssPrefix}-option-text`);
    optionText.textContent = text;
    newOption.appendChild(optionText);

    this.html.options.push(newOption);
    this.html.content.appendChild(newOption);
    this.addEditable(optionText);
  }

  /**
   * Removes an option element
   * @method removeOption
   * @return {void}
   */
  removeOption() {
    const optionToRemove = this.html.options.pop();
    if (optionToRemove) {
      optionToRemove.remove();
    }
  }

  /**
   * @override @method exportState
   * @return {Object}
   */
  exportState() {
    const output = super.exportState();
    output.options = this.html.options.map(o => o.textContent);
    return output;
  }

  /**
   * @override @method importState
   * @return {void}
   */
  importState(state) {
    super.importState(state);
    const optionCount = this.html.options.length;
    for (let i = 0; i < optionCount; i++) {
      this.removeOption();
    }
    state.options.forEach(o => this.addOption(o));
  }
}
