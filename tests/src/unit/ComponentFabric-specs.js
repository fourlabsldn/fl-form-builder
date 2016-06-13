/* eslint-env jasmine */
import ComponentFabric from '../../../src/ComponentFabric';

export default () => {
  describe('A ComponentFabric should', () => {
    const MODULE_PREFIX = '-test-';
    let fabric;
    beforeEach(() => {
      fabric = new ComponentFabric(MODULE_PREFIX);
    });

    it('return the name of all components it can create with "getComponentTypes"', () => {
      expect(typeof fabric.getComponentTypes).toBe('function');
      const types = fabric.getComponentTypes();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      types.forEach(typeName => {
        expect(typeof typeName).toEqual('object');
        expect(typeof typeName.name).toBe('string');
      });
    });

    it('create an adequate object for all of its types', () => {
      const types = fabric.getComponentTypes();
      types.forEach(typeName => {
        const comp = fabric.createComponent(typeName.name);
        expect(comp instanceof window[typeName.name]).toBe(true);
      });
    });

    it('throw an error if we try to create an unknown component', () => {
      expect(() => fabric.createComponent('asdfasdfasdfasdf')).toThrow();
    });
  });
}; // wrapping function
