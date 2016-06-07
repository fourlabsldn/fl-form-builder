import ViewController from './ViewController';
/**
 * @class ControlBar
 */
export default class ControlBar extends ViewController {
  constructor(modulePrefix, moduleCoordinator) {
    super(modulePrefix);
    this.moduleCoordinator = moduleCoordinator;
    this.buildHtml();
  }

  buildHtml() {
    const frag = document.createDocumentFragment();

    // Create component buttons
    const componentTypes = this.moduleCoordinator.getComponentTypes();
    for (const component of componentTypes) {
      const compBtn = document.createElement('button');
      compBtn.className = `${this.cssPrefix}-component-button`;
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
    saveBtn.className = `${this.cssPrefix}-save-button`;
    saveBtn.classList.add('btn', 'btn-primary'); // Bootstrap
    saveBtn.textContent = 'Save';
    frag.appendChild(saveBtn);

    this.html.container.appendChild(frag);
  }
}
