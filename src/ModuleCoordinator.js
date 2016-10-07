import ComponentsContainer from './ComponentsContainer';
import ComponentFabric from './ComponentFabric';
import ControlBar from './ControlBar';
import utils from './utils/utils';
import Storage from './Storage';


import TextField from './NewComponents/TextField';
const defaultComponents = [
  TextField,
];


/**
 * The module coordinator contains all of the methods the consumer of the
 * application will need.
 * @class Coordinator
 */
export default class ModuleCoordinator {
  constructor(modulePrefix, htmlContainer, customComponents = []) {
    this.storage = new Storage();
    this.componentFabric = new ComponentFabric(modulePrefix);

    const components = customComponents.concat(defaultComponents);
    components.forEach(c => {
      this.componentFabric.addComponentConstructor(c);
    });

    this.componentsContainer = new ComponentsContainer(modulePrefix);
    this.componentsContainer.on('change', this.pushHistoryState.bind(this));

    this.controlBar = new ControlBar(modulePrefix, this);
    this.htmlContainer = htmlContainer;

    Object.preventExtensions(this);
    this.htmlContainer.appendChild(this.controlBar.getHtmlContainer());
    this.htmlContainer.appendChild(this.componentsContainer.getHtmlContainer());
    this.pushHistoryState();
  }

  getComponentsInfo() {
    return this.componentFabric.getComponentsInfo();
  }

  createComponent(compName) {
    const newComponent = this.componentFabric.createComponent(compName);
    this.componentsContainer.addComponent(newComponent);
    this.pushHistoryState();
  }

  save() {
    const content = this.exportState();
    utils.fireEvent(this.htmlContainer, 'formBuilderSave', { formState: content });
  }

  /**
   * Use this method to get the current state of the application
   * @method exportState
   * @param {void}
   * @return {Array<Object>} An array of objects that represents the current
   * state of the application and which can be used to restore the application to that state.
   */
  exportState() {
    const components = this.componentsContainer.getAllComponents();
    const outcome = [];
    for (const component of components) {
      outcome.push(component.exportState());
    }
    return outcome;
  }

  /**
   * Use this function to import a past saved state
   * @method importState
   * @param  {Array<Object>} state - A state obtained previsously obtained.
   * @return {void}
   */
  importState(state = this.exportState(), registerInHistory = true) {
    this.componentsContainer.deleteAllComponents();

    const components = [];
    state.forEach(componentState => {
      const component = this.componentFabric.createComponent(componentState.type);
      component.importState(componentState);
      components.push(component);
    });

    this.componentsContainer.setComponents(components);
    if (registerInHistory) {
      this.pushHistoryState();
    }
  }

  /**
   * Add current state to the saved history.
   * @private
   * @method pushHistoryState
   * @return {void}
   */
  pushHistoryState() {
    const currentState = this.exportState();
    this.storage.pushHistoryState(currentState);
  }

  /**
   * Undo function
   * @private
   * @method popHistoryState
   * @return {Boolean} success
   */
  popHistoryState() {
    const lastState = this.storage.popHistoryState();
    if (lastState) {
      this.importState(lastState, false);
      return true;
    }
    return false;
  }
}
