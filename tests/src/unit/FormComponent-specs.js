/* eslint-env jasmine */
import componentsArray from '../helpers/componentsArray';

export default () => {
  componentsArray.forEach((ComponentContructor) => {
    describe(`${ComponentContructor.name}: A FormComponent subclass component should`, () => {
      const MODULE_PREFIX = '-test-';
      let comp;
      beforeEach(() => {
        comp = new ComponentContructor(MODULE_PREFIX);
      });

      it('have a cssPrefix property', () => {
        expect(comp.cssPrefix).toBeDefined();
        expect(comp.cssPrefix.indexOf(MODULE_PREFIX)).toBeGreaterThan(-1);
      });

      it('have a requiried property with setter', () => {
        expect(comp.isRequired).toBeDefined();
        expect(comp.setRequired).toBeDefined();
        expect(typeof comp.setRequired === 'function').toBeTruthy();
      });

      it('set required property when the "setRequired" function is called', () => {
        comp.setRequired(true);
        expect(comp.isRequired).toBeTruthy();
        comp.setRequired(false);
        expect(comp.isRequired).toBeFalsy();
      });

      it('have a focus function', () => {
        expect(comp.focus).toBeDefined();
        expect(typeof comp.focus === 'function').toBeTruthy();
      });

      it('set isDestroyed to true when "destroy" is called', () => {
        expect(comp.isDetroyed).toBeDefined();
        expect(comp.isDetroyed).toBeFalsy();
        comp.destroy();
        expect(comp.isDetroyed).toBeTruthy();
      });

      it('export the object without throwing', () => {
        let state;
        expect(() => { state = comp.exportState(); }).not.toThrow();
        expect(typeof state).toEqual('object');
        expect(state.type).toEqual(ComponentContructor.name);
        expect(state.required).toEqual(comp.isRequired);
      });

      it('set "title" and "isRequired" properties when importing a state', () => {
        comp.setRequired(true);
        const state = comp.exportState();
        expect(state.required).toEqual(true);
        state.required = false;
        comp.importState(state);
        expect(comp.isRequired).toBe(false);
      });

      it('change isConfigVisible state with "configToggle"', () => {
        const isConfigVisible = comp.isConfigVisible;
        comp.configToggle();
        expect(comp.isConfigVisible).toEqual(!isConfigVisible);

        comp.configToggle(false);
        expect(comp.isConfigVisible).toEqual(false);

        comp.configToggle(true);
        expect(comp.isConfigVisible).toEqual(true);
      });

      it('enable editing with "enableEditing" an element added with "addEditable"', () => {
        const myEl = document.createElement('p');
        myEl.setAttribute('contenteditable', false);

        comp.addEditable(myEl);
        comp.enableEditing();
        expect(myEl.getAttribute('contenteditable')).toEqual('true');

        comp.enableEditing(false);
        expect(myEl.getAttribute('contenteditable')).toEqual('false');
      });
    }); // wrapping describe
  }); // forEach
}; // wrapping function
