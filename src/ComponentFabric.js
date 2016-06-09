import RadioBtns from './Components/OptionsComponents/RadioBtns';
import Checkboxes from './Components/OptionsComponents/Checkboxes';
import Dropdown from './Components/OptionsComponents/Dropdown';
import TextBox from './Components/TextComponents/TextBox';
import TextArea from './Components/TextComponents/TextArea';
import EmailBox from './Components/TextComponents/EmailBox';
import TelephoneBox from './Components/TextComponents/TelephoneBox';
import NumberBox from './Components/TextComponents/NumberBox';
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
      EmailBox,
      TelephoneBox,
      NumberBox,
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
