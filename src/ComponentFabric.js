import RadioBtns from './Components/RadioBtns';
import Checkboxes from './Components/Checkboxes';
import Dropdown from './Components/Dropdown';
import TextBox from './Components/TextBox';
import TextArea from './Components/TextArea';
import assert from 'fl-assert';

/**
 * @class ControlBar
 */
export default class ComponentFabric {
  constructor(modulePrefix) {
    this.modulePrefix = modulePrefix;
    this.componentConstructors = [
      RadioBtns,
      Checkboxes,
      Dropdown,
      TextBox,
      TextArea,
    ];

    Object.preventExtensions(this);
  }

  /**
   * @method createComponent
   * @param  {String} componentName
   * @return {Component}
   */
  createComponent(componentName) {
    const Comp = this.componentConstructors.find(c => c.getInfo().name === componentName);
    assert(Comp, `Invalid component: ${componentName}`);
    return new Comp(this.modulePrefix);
  }

  /**
   * @method getComponentTypes
   * @return {Array<Object>}
   */
  getComponentTypes() {
    const types = this.componentConstructors.map(component => component.getInfo());
    return types;
  }
}
