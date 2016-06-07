import ViewController from '../ViewController';
import utils from '../utils/utils';

/**
 * @abstract @class FormComponent
 */
export default class FormComponent extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.cssPrefix = `${modulePrefix}-FormComponent`;
    this.html.container.classList.add(`${modulePrefix}-FormComponent`);

    this.editables = [];
    this.deleteListeners = [];
    this.isRequired = false;

    this.buildHtml();
  }

  buildHtml() {
    const frag = document.createDocumentFragment();

    // -- Content --
    this.html.content = document.createElement('div');
    this.html.content.classList.add(`${this.cssPrefix}-content`);
    frag.appendChild(this.html.content);

    this.html.title = document.createElement('h3');
    this.html.title.innerText = 'Add a title';
    this.editables.push(this.html.title);
    this.html.content.appendChild(this.html.title);

    // -- Configuration --
    this.html.configuration = document.createElement('div');
    const configurationCssClass = `${this.cssPrefix}-configuration`;
    this.html.configuration.classList.add(configurationCssClass);
    frag.appendChild(this.html.configuration);

    this.html.componentSpecificConfiguration = document.createElement('div');
    this.html.configuration.appendChild(this.html.componentSpecificConfiguration);

    const configurationButtons = document.createElement('div');
    this.html.configuration.appendChild(configurationButtons);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = `${configurationCssClass}-btn-delete`;
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('click', () => this.delete());
    configurationButtons.appendChild(deleteBtn);

    const okBtn = document.createElement('button');
    okBtn.className = `${configurationCssClass}-btn-ok`;
    okBtn.type = 'button';
    okBtn.addEventListener('click', () => this.configToggle());
    configurationButtons.appendChild(okBtn);

    const requiredSwitch = utils.createSwitch('Requered', this.modulePrefix);
    requiredSwitch.classList.add(`${configurationCssClass}-switch-required`);
    requiredSwitch.addEventListener('change', (e) => {
      const checked = e.target.checked;
      this.setRequired(checked);
    });
    configurationButtons.appendChild(requiredSwitch);

    // -- Sidebar --
    this.html.sidebar = document.createElement('div');
    const sidebarCssClass = `${this.cssPrefix}-sidebar`;
    this.html.sidebar.classList.add(sidebarCssClass);
    frag.appendChild(this.html.sidebar);

    const showConfigBtn = document.createElement('button');
    showConfigBtn.type = 'button';
    showConfigBtn.classList.add(
      `${sidebarCssClass}-btn`,
      'glyphicon',
      'glyphicon-cog'
    );
    showConfigBtn.title = 'Configure form group';
    this.html.sidebar.appendChild(showConfigBtn);

    showConfigBtn.addEventListener('click', () => {
      this.configToggle();
    });

    this.html.container.appendChild(frag);
  }

  /**
   * @method enableEditing
   * @param  {Boolean} enable - Whether to enable editing or not.
   * @return {void}
   */
  enableEditing(enable = true) {
    this.editables.forEach(element => {
      element.setAttribute('contenteditable', enable);
    });
  }

  configToggle() {
    this.html.configuration.classList.toggle(`${this.cssPrefix}-configuration--visible`);
  }

  /**
   * @method onDelete
   * @param  {function} fn
   * @return {void}
   */
  onDelete(fn) {
    this.deleteListeners.push(fn);
  }

  delete() {
    this.deleteListeners.forEach(fn => fn(this));
    this.destroy();
  }

  /**
   * @method setRequired
   * @param  {Boolean} required
   */
  setRequired(required) {
    this.isRequired = required;
  }
}
