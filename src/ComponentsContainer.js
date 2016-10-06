import ViewController from './ViewController';
import ComponentShell from './ComponentShell';
import utils from './utils/utils';
import assert from 'fl-assert';

/**
 * @class ControlBar
 */
export default class ComponentsContainer extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);

    // This is kept in the order they appear on screen.
    this.components = [];

    // Used with component.ondestroy;
    // This must be here and not together with other class methods because
    // of the binding of 'this'
    this.componentDestroyListener = (component) => {
      this.deleteComponent(component);
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
  addComponent(component, showConfig = true) {
    this.components.push(component);
    const shell = new ComponentShell;
    shell.attachComponent(component);
    shell.setContent(component.importState({}));

    this.html.container.appendChild(component.getHtmlContainer());
    component.on('destroy', this.componentDestroyListener);

    this.addDragButtonToComponent(component);
    component.configToggle(showConfig);
    component.on('change', () => this.trigger('change'));
  }

  addDragButtonToComponent(component) {
    const dragBtn = document.createElement('button');
    dragBtn.type = 'button';
    dragBtn.title = 'Drag to reorder';
    dragBtn.setAttribute('draggable', true);
    dragBtn.classList.add(
      'glyphicon', // Font-awesome
      'glyphicon-menu-hamburger'
    );

    const draggingClass = `${this.modulePrefix}--dragging`;
    dragBtn.addEventListener('dragstart', (e) => {
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);
      if (this.components.length < 2) { return; }

      const container = component.getHtmlContainer();
      const containersArray = this.components.map(c => c.getHtmlContainer());

      container.classList.add(draggingClass);

      // Take care of moving and reordering
      utils.trackReorderDrag(e, container, containersArray);
    });

    dragBtn.addEventListener('dragend', () => {
      const container = component.getHtmlContainer();
      setTimeout(() => container.classList.remove(draggingClass), 250);


      // Reorder components according to their position.
      const beforeReordering = JSON.stringify(this.components);
      this.components.sort((el1, el2) => {
        return el1.getHtmlContainer().getBoundingClientRect().top >
               el2.getHtmlContainer().getBoundingClientRect().top;
      });

      // Trigger change if elements were reordered
      const afterReordering = JSON.stringify(this.components);
      if (beforeReordering !== afterReordering) {
        this.trigger('change');
      }
    });

    component.addSidebarButton(dragBtn);
  }

  getAllComponents() {
    return Array.from(this.components);
  }

  deleteComponent(component) {
    const componentIndex = this.components.indexOf(component);
    if (componentIndex === -1) {
      console.warn('Removing component not in container');
      return;
    }
    // Delete element from components array
    this.components.splice(componentIndex, 1);
    component.removeListener('destroy', this.componentDestroyListener);
    component.destroy();
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
    const components = Array.from(this.components);
    for (const comp of components) {
      this.deleteComponent(comp);
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
    components.forEach(comp => this.addComponent(comp, false));
  }
}
