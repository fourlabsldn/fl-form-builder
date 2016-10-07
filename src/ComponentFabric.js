import assert from 'fl-assert';

/**
 * @class ControlBar
 */
export default class ComponentFabric {
  constructor(modulePrefix) {
    this.modulePrefix = modulePrefix;
    this.componentConstructors = [];
    Object.preventExtensions(this);
  }

  /**
   * @method addComponentConstructor
   * @param {Function} constr - Component constructor Function
   * @return {void}
   */
  addComponentConstructor(constr) {
    this.componentConstructors = this.componentConstructors.concat([constr]);
  }

  /**
   * @method createComponent
   * @param  {String} componentType
   * @return {Component}
   */
  createComponent(componentType) {
    const Comp = this.componentConstructors.find(c => c.getInfo().type === componentType);
    assert(Comp, `Invalid component: ${componentType}`);
    return new Comp();
  }

  /**
   * @method getComponentTypes
   * @return {Array<Object>}
   */
  getComponentsInfo() {
    const info = this.componentConstructors.map(component => component.getInfo());
    return info;
  }
}
