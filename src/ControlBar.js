import ViewController from './ViewController';
/**
 * @class ControlBar
 */
export default class ControlBar extends ViewController {
  constructor(modulePrefix, moduleCoordinator) {
    super(modulePrefix);
    this.moduleCoordinator = moduleCoordinator;
    Object.preventExtensions(this);
    this.buildHtml();
  }

  buildHtml() {
    const frag = document.createDocumentFragment();

    // Create component buttons
    const componentTypes = this.moduleCoordinator.getComponentTypes();
    for (const component of componentTypes) {
      const compBtn = document.createElement('button');
      compBtn.className = `${this.cssPrefix}-button-component`;
      compBtn.className += ` ${component.iconClass}`;
      compBtn.classList.add('btn', 'btn-default'); // Bootstrap

      compBtn.value = component.name;
      compBtn.name = component.description;
      compBtn.title = component.description;
      compBtn.addEventListener('click', () => {
        this.moduleCoordinator.createComponent(component.name);
      });

      frag.appendChild(compBtn);
    }

    // Create Save button
    const saveBtn = document.createElement('button');
    saveBtn.className = `${this.cssPrefix}-button-save`;
    saveBtn.classList.add('btn', 'btn-primary'); // Bootstrap
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => this.moduleCoordinator.save());
    frag.appendChild(saveBtn);

    // Create Import button
    const undoBtn = document.createElement('button');
    undoBtn.className = `${this.cssPrefix}-button-save`;
    undoBtn.classList.add('btn', 'btn-default'); // Bootstrap
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => this.moduleCoordinator.popHistoryState());
    frag.appendChild(undoBtn);

    this.html.container.appendChild(frag);
  }
}
