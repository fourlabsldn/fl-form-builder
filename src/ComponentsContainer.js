import ViewController from './ViewController';
import FormComponent from './Components/FormComponent';
import utils from './utils/utils';
import assert from 'fl-assert';

/**
 * @class ControlBar
 */
export default class ComponentsContainer extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.components = new Set();

    // Used with component.ondestroy;
    this.componentDestroyListener = (component) => {
      this.deleteComponent(component);
    };

    Object.preventExtensions(this);
  }

  /**
   * @method addComponent
   * @param  {FormComponent} component
   * @param  {Boolean} showConfig
   */
  addComponent(component, showConfig = true) {
    assert(component instanceof FormComponent,
      'Invalid component being added. No an instance of Component.');
    this.components.add(component);
    this.html.container.appendChild(component.getHtmlContainer());
    component.onDestroy(this.componentDestroyListener);

    this.addDragButtonToComponent(component);
    component.configToggle(showConfig);
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
      const container = component.getHtmlContainer();
      const componentsArray = Array.from(this.components);
      const containersArray = componentsArray.map(c => c.getHtmlContainer());

      container.classList.add(draggingClass);
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);

      // Take care of moving and reordering
      utils.trackReorderDrag(e, container, containersArray);
    });

    dragBtn.addEventListener('dragend', () => {
      const container = component.getHtmlContainer();
      setTimeout(() => container.classList.remove(draggingClass), 250);
    });

    component.addSidebarButton(dragBtn);
  }

  getAllComponents() {
    return Array.from(this.components);
  }

  deleteComponent(component) {
    if (!this.components.has(component)) {
      console.warn('Removing component not in container');
      return;
    }
    this.components.delete(component);
    component.removeDestroyListener(this.componentDestroyListener);
    component.destroy();
  }
  /**
   * Deletes all components
   * @method deleteAllComponents
   * @return {void}
   */
  deleteAllComponents() {
    this.components.forEach(comp => this.deleteComponent(comp));
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
