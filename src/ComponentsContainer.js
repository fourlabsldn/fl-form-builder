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

    // This is kept in the order they appear on screen.
    this.components = [];

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
    this.components.push(component);
    this.html.container.appendChild(component.getHtmlContainer());
    component.on('destroy', this.componentDestroyListener);

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
      const containersArray = this.components.map(c => c.getHtmlContainer());

      container.classList.add(draggingClass);
      e.dataTransfer.setDragImage(document.createElement('img'), 0, 0);

      // Take care of moving and reordering
      utils.trackReorderDrag(e, container, containersArray);
    });

    dragBtn.addEventListener('dragend', () => {
      const container = component.getHtmlContainer();
      setTimeout(() => container.classList.remove(draggingClass), 250);

      // Reorder components according to their position.
      this.components.sort((el1, el2) => {
        return el1.getHtmlContainer().getBoundingClientRect().top >
               el2.getHtmlContainer().getBoundingClientRect().top;
      });
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
