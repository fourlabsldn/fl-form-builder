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
}
