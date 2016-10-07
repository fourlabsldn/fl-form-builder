import ViewController from './ViewController';
import ComponentShell from './ComponentShell';
import utils from './utils/utils';

/**
 * @class ControlBar
 */
export default class ComponentsContainer extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);

    // This is kept in the order they appear on screen.
    this.componentShells = [];

    // Used with component.ondestroy;
    // This must be here and not together with other class methods because
    // of the binding of 'this'
    this.componentDestroyListener = (shell) => {
      this.deleteComponent(shell);
      this.trigger('change');
    };

    this.acceptEvents('change');
    Object.preventExtensions(this);
  }

  /**
   * @method addComponent
   * @param  {FormComponent} component
   * @param  {Boolean} showConfig
   */
  addComponent(component) {
    const shell = new ComponentShell(this.modulePrefix);
    shell.setContent(component.importState({}));
    shell.attachComponent(component);
    this.componentShells.push(shell);

    this.html.container.appendChild(shell.getHtmlContainer());
    shell.on('destroy', this.componentDestroyListener);

    this.addDragFunctionalityToShell(shell);
    shell.on('change', () => this.trigger('change'));
  }

  addDragFunctionalityToShell(shell) {
    const draggingClass = `${this.modulePrefix}--dragging`;
    shell.on('ComponentDragstart', (sh, e) => {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      if (this.componentShells.length < 2) { return; }

      const container = shell.getHtmlContainer();
      const containersArray = this.componentShells.map(s => s.getHtmlContainer());

      container.classList.add(draggingClass);

      // Take care of moving and reordering
      utils.trackReorderDrag(e, container, containersArray);
    });

    shell.on('ComponentDragend', () => {
      const container = shell.getHtmlContainer();
      setTimeout(() => container.classList.remove(draggingClass), 250);


      // Reorder components according to their position.
      const beforeReordering = JSON.stringify(this.componentShells);
      this.componentShells.sort((el1, el2) => {
        return el1.getHtmlContainer().getBoundingClientRect().top >
               el2.getHtmlContainer().getBoundingClientRect().top;
      });

      // Trigger change if elements were reordered
      const afterReordering = JSON.stringify(this.componentShells);
      if (beforeReordering !== afterReordering) {
        this.trigger('change');
      }
    });
  }

  getAllComponents() {
    return Array.from(this.componentShells).map(s => s.getAttachedComponent());
  }

  deleteComponent(shell) {
    const shellIndex = this.components.indexOf(shell);
    if (shellIndex === -1) {
      console.warn('Removing component not in container');
      return;
    }
    // Delete element from components array
    this.componentShells.splice(shellIndex, 1);
    shell.removeListener('destroy', this.componentDestroyListener);
    shell.destroy();
  }
  /**
   * Deletes all components
   * @method deleteAllComponents
   * @return {void}
   */
  deleteAllComponents() {
    // NOTE: we create a new array because deleteComponent modifies
    // 'this.components', so we would have problems as we are
    // iterating trough an array being modified.
    const shells = Array.from(this.componentShells);
    for (const shell of shells) {
      this.deleteComponent(shell);
    }
  }

  /**
   * Erases all components and inserts a new component group.
   * @method setComponents
   * @param  {Array<FormComponent>} components
   * @return {void}
   */
  setComponents(components) {
    this.deleteAllComponents();
    components.forEach(comp => this.addComponent(comp));
  }
}
