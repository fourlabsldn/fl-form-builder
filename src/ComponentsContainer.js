import ViewController from './ViewController';
import Component from './Components/Component';
import assert from 'fl-assert';

/**
 * @class ControlBar
 */
export default class ComponentsContainer extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.components = [];
  }

  /**
   * @method addComponent
   * @param  {FormComponent} component
   */
  addComponent(component) {
    assert(component instanceof Component,
      'Invalid component being added. No an instance of Component.');
    this.components.push(component);
    this.html.container.appendChild(component.getHtmlContainer());
  }

  /**
   * Deletes all components
   * @method deleteComponents
   * @return {void}
   */
  deleteComponents() {
    this.components.forEach(comp => comp.destroy);
  }

  /**
   * Erases all components and inserts a new component group.
   * @method setComponents
   * @param  {Array<FormComponent>} components
   * @return {void}
   */
  setComponents(components) {
    this.deleteComponents();
    components.forEach(comp => this.addComponent(comp));
  }
}
