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

    this.componentTypes = {
      radioBtns: {
        description: 'Radio buttons',
        Contructor: RadioBtns,
        iconClass: 'glyphicon glyphicon-ok-circle',
      },
      checkboxes: {
        description: 'Checkboxes',
        Contructor: Checkboxes,
        iconClass: 'glyphicon glyphicon-check',
      },
      dropdown: {
        description: 'Dropdown',
        Contructor: Dropdown,
        iconClass: 'glyphicon glyphicon-collapse-down',
      },
      textBox: {
        description: 'Text box',
        Contructor: TextBox,
        iconClass: 'glyphicon glyphicon-text-width',
      },
      textArea: {
        description: 'Text area',
        Contructor: TextArea,
        iconClass: 'glyphicon glyphicon-text-height',
      },
    };
  }

  /**
   * @method createComponent
   * @param  {String} componentName
   * @return {Component}
   */
  createComponent(componentName) {
    assert(this.componentTypes[componentName], `Invalid component: ${componentName}`);
    return new this.componentTypes[componentName].Contructor(this.modulePrefix);
  }

  /**
   * @method getComponentTypes
   * @return {Array<Object>}
   */
  getComponentTypes() {
    const types = [];
    const names = Object.keys(this.componentTypes);
    for (const componentName of names) {
      const comp = this.componentTypes[componentName];

      types.push({
        iconClass: comp.iconClass,
        description: comp.decription,
        name: componentName,
      });
    }
    return types;
  }
}
