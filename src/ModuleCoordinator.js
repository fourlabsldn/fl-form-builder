import ComponentsContainer from './ComponentsContainer';
import ComponentFabric from './ComponentFabric';
import ControlBar from './ControlBar';
import Storage from './Storage';

/**
 * @class Coordinator
 */
export default class Coordinator {
  constructor(modulePrefix, xdiv) {
    this.storage = new Storage();
    this.componentFabric = new ComponentFabric(modulePrefix);

    this.componentsContainer = new ComponentsContainer(modulePrefix);
    this.componentsContainer.on('change', this.pushHistoryState.bind(this));

    this.controlBar = new ControlBar(modulePrefix, this);

    Object.preventExtensions(this);
    xdiv.appendChild(this.controlBar.getHtmlContainer());
    xdiv.appendChild(this.componentsContainer.getHtmlContainer());

    this.pushHistoryState();
  }

  getComponentTypes() {
    return this.componentFabric.getComponentTypes();
  }

  createComponent(compName) {
    const newComponent = this.componentFabric.createComponent(compName);
    this.componentsContainer.addComponent(newComponent);
    this.pushHistoryState();
  }

  save() {
    const content = this.exportState();
    this.storage.saveContent(content);
  }

  /**
   * @method exportState
   * @return {Array<Object>} - each component is a state object for a FormComponent
   */
  exportState() {
    const components = this.componentsContainer.getAllComponents();
    const outcome = [];
    for (const component of components) {
      outcome.push(component.exportState());
    }
    return outcome;
  }

  importState(state = this.exportState()) {
    this.componentsContainer.deleteAllComponents();

    const components = [];
    state.forEach(componentState => {
      const component = this.componentFabric.createComponent(componentState.type);
      component.importState(componentState);
      components.push(component);
    });

    this.componentsContainer.setComponents(components);
  }

  pushHistoryState() {
    const currentState = this.exportState();
    this.storage.pushHistoryState(currentState);
  }

  /**
   * Undo function
   * @method popHistoryState
   * @return {Boolean} success
   */
  popHistoryState() {
    const lastState = this.storage.popHistoryState();
    if (lastState) {
      this.importState(lastState);
      return true;
    }
    return false;
  }
}
