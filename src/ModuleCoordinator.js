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
    this.controlBar = new ControlBar(modulePrefix, this);
    Object.preventExtensions(this);

    xdiv.appendChild(this.controlBar.getHtmlContainer());
    xdiv.appendChild(this.componentsContainer.getHtmlContainer());
  }

  getComponentTypes() {
    return this.componentFabric.getComponentTypes();
  }

  createComponent(compName) {
    const newComponent = this.componentFabric.createComponent(compName);
    this.componentsContainer.addComponent(newComponent);
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
    // return outcome;
    const imported = '[{"required":false,"title":"aaaaaa","type":"RadioBtns","options":["Insert an option"]},{"required":false,"title":"bbbbbb","type":"Checkboxes","options":[]},{"required":false,"title":"CCCCC","type":"Dropdown","options":["Select an option","option 2","option 3 [disabled]"],"disabledIndexes":[0,2]},{"required":false,"title":"DDDDD","type":"TextBox","placeholder":"pppppppppp"},{"required":false,"title":"eEeEeE","type":"TextArea","placeholder":"p2p2p2"}]';
    return JSON.parse(imported);
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
}
