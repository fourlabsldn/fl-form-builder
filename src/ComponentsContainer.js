import ViewController from './ViewController';
import FormComponent from './Components/FormComponent';
import assert from 'fl-assert';

/**
 * @class ControlBar
 */
export default class ComponentsContainer extends ViewController {
  constructor(modulePrefix) {
    super(modulePrefix);
    this.components = new Set();
    Object.preventExtensions(this);
  }

  /**
   * @method addComponent
   * @param  {FormComponent} component
   */
  addComponent(component) {
    assert(component instanceof FormComponent,
      'Invalid component being added. No an instance of Component.');
    this.components.add(component);
    this.html.container.appendChild(component.getHtmlContainer());
    component.onDestroy(() => this.deleteComponent(component));
  }

  deleteComponent(component) {
    if (!this.components.has(component)) {
      assert.warn(false, 'Component being deleted is not part of component list.');
      return;
    }
    this.components.delete(component);
    if (!component.isDestroyed) { component.destroy(); }
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
    components.forEach(comp => this.addComponent(comp));
  }

  exportState() {
    const outcome = [];
    for (const component of this.components) {
      outcome.push(component.exportState());
    }
    return outcome;
  }
}
