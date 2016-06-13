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

      // this.cssPrefix = `${modulePrefix}-FormComponent`;
      // this.html.container.classList.add(`${modulePrefix}-FormComponent`);
      //
      // this.editables = new Set();
      // this.isRequired = false;
      // this.isConfigVisible = false;
      // this.isDetroyed = false;
      // this.lastState = null;
      //
      // this.acceptEvents('destroy', 'change');
      //
      //
      // // Focused on config show
      // this.focusElement = null;

      it('have a cssPrefix property', () => {
        expect(comp.cssPrefix).toBeDefined();
        expect(comp.cssPrefix.substring(MODULE_PREFIX)).toBeGreaterThan(-1);
      });

      it('have a requiried property with setter', () => {
        expect(comp.isRequired).toBeDefined();
        expect(comp.setRequired).toBeDefined();
        expect(typeof comp.setRequired === 'function').toBeTruthy();
      });

      it('have a focus function', () => {
        expect(comp.focus).toBeDefined();
        expect(typeof comp.focus === 'function').toBeTruthy();
      });

      it('have a destroy method', () => {
        expect(comp.destroy).toBeDefined();
        expect(typeof comp.destroy === 'function').toBeTruthy();
      });

      it('have a destroy method', () => {
        expect(comp.destroy).toBeDefined();
        expect(typeof comp.destroy === 'function').toBeTruthy();
      });
    }); // wrapping describe
  }); // forEach
}; // wrapping function
