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

    this.editables = new Set();
    this.deleteListeners = [];
    this.isRequired = false;
    this.isConfigVisible = false;
    this.isDetroyed = false;

    // Focused on config show
    this.focusElement = null;

    // Elements that have options will store them in here.
    this.html.options = [];
    this.buildHtml();
    this.configToggle(true);
  }

  buildHtml() {
    const frag = document.createDocumentFragment();

    // -- Content --
    this.html.content = document.createElement('div');
    this.html.content.classList.add(`${this.cssPrefix}-content`);
    frag.appendChild(this.html.content);

    this.html.title = document.createElement('h3');
    this.html.title.innerText = 'Add a title';
    this.addEditable(this.html.title);
    this.html.content.appendChild(this.html.title);

    // -- Configuration --
    this.html.configuration = document.createElement('div');
    const configurationCssClass = `${this.cssPrefix}-configuration`;
    this.html.configuration.classList.add(configurationCssClass);
    frag.appendChild(this.html.configuration);

    this.html.componentSpecificConfiguration = document.createElement('div');
    this.html.componentSpecificConfiguration.classList.add(
      `${this.cssPrefix}-componentConfiguration`
    );
    this.html.configuration.appendChild(this.html.componentSpecificConfiguration);

    const configurationButtons = document.createElement('div');
    configurationButtons.classList.add(`${this.cssPrefix}-configuration-buttons`);
    this.html.configuration.appendChild(configurationButtons);

    const requiredSwitch = utils.createSwitch('Required', this.modulePrefix);
    requiredSwitch.classList.add(`${configurationCssClass}-switch-required`);
    requiredSwitch.addEventListener('change', (e) => {
      const checked = e.target.checked;
      this.setRequired(checked);
    });
    configurationButtons.appendChild(requiredSwitch);

    const okBtn = document.createElement('button');
    okBtn.classList.add(
      `${configurationCssClass}-btn-ok`,
      'btn', // Bootstrap
      'btn-sm',
      'btn-default',
      'glyphicon', // Font-awesome
      'glyphicon-ok'
    );
    okBtn.type = 'button';
    okBtn.addEventListener('click', () => this.configToggle());
    configurationButtons.appendChild(okBtn);


    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add(
      `${configurationCssClass}-btn-delete`,
      'btn', // Bootstrap
      'btn-sm',
      'btn-danger',
      'glyphicon',
      'glyphicon-trash'
    );
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('click', () => this.delete());
    configurationButtons.appendChild(deleteBtn);

    // -- Sidebar --
    this.html.sidebar = document.createElement('div');
    const sidebarCssClass = `${this.cssPrefix}-sidebar`;
    this.html.sidebar.classList.add(sidebarCssClass);
    frag.appendChild(this.html.sidebar);

    const showConfigBtn = document.createElement('button');
    showConfigBtn.type = 'button';
    showConfigBtn.classList.add(
      `${sidebarCssClass}-btn`,
      'glyphicon', // Font-awesome
      'glyphicon-cog'
    );
    showConfigBtn.title = 'Configure form group';
    this.html.sidebar.appendChild(showConfigBtn);

    showConfigBtn.addEventListener('click', () => {
      this.configToggle();
    });

    this.html.container.appendChild(frag);
  }

  buildOptionsConfiguration() {
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
    addBtn.addEventListener('click', () => {
      if (!legend.value.trim()) {
        utils.blinkRed(legend, this.modulePrefix);
      } else {
        this.addOption(legend.value);
        legend.value = '';
      }
    });
    optionsConfig.appendChild(addBtn);

    const legend = document.createElement('input');
    legend.setAttribute('placeholder', 'Type a new option');
    legend.setAttribute('type', 'text');
    legend.classList.add(
      `${optionsConfigCssClass}-input`
    );
    this.focusElement = legend;
    optionsConfig.appendChild(legend);
    legend.addEventListener('keypress', (e) => {
      if (e.which === 13) {
        const click = new Event('click');
        addBtn.dispatchEvent(click);
        e.preventDefault();
        return false; //  returning false will prevent the event from bubbling up.
      }
      return true;
    });
  }

  /**
   * @method addEditable
   * @param  {HTMLElement} element
   */
  addEditable(element) {
    element.classList.add(`${this.cssPrefix}-editable`);
    this.editables.add(element);
    if (this.isConfigVisible) {
      this.enableEditing(true);
    }
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

  /**
   * @method configToggle
   * @param  {Boolean} forceState Optional parameter to force a state.
   * @return {void}
   */
  configToggle(forceState = false) {
    if (this.isConfigVisible && !forceState) {
      // hide
      this.html.container.classList.remove(`${this.cssPrefix}--configuration-visible`);
      this.enableEditing(false);
    } else {
      // show
      this.html.container.classList.add(`${this.cssPrefix}--configuration-visible`);
      this.enableEditing(true);

      // hide on clickOut
      utils.onClickOut(
        [this.html.container, this.html.configuration],
        () => {
          if (this.isConfigVisible && !this.isDetroyed) { this.configToggle(); }
        }
      );

      // Focus on the appropriate element
      if (this.focusElement) {
        // NOTE: There is a bug that for some reason it doesn't focus if you just
        // call focus() straight away. setTimeout solves it.
        // see http:// goo.gl/UjKOk5
        setTimeout(() => { this.focusElement.focus(); }, 15);
      }
    }
    this.isConfigVisible = !this.isConfigVisible;
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
    this.isDetroyed = true;
  }

  /**
   * @method setRequired
   * @param  {Boolean} required
   */
  setRequired(required) {
    this.isRequired = required;
  }

  /**
   * Exports the information of a component in one object
   * @method exportContent
   * @return {[type]} [description]
   */
  exportContent() {
    return {
      required: this.isRequired,
      title: this.html.title.textContent,
      type: this.constructor.name,
      options: this.html.options.map(o => o.textContent),
    };
  }
}
