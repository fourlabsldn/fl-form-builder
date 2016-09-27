/* eslint-env jasmine */
import componentsArray from '../helpers/textComponentsArray';

export default () => {
  componentsArray.forEach((ComponentContructor) => {
    describe(`${ComponentContructor.name}: A TextComponent subclass component should`, () => {
      const MODULE_PREFIX = '-test-';
      let comp;
      beforeEach(() => {
        comp = new ComponentContructor(MODULE_PREFIX);
      });

      it('get and set placeholders with getPlaceholder and setPlaceholder', () => {
        expect(typeof comp.getPlaceholder).toEqual('function');
        const initialPlaceholder = comp.getPlaceholder();
        expect(typeof initialPlaceholder).toEqual('string');

        const newPlaceholder = 'New placeholder text';
        expect(typeof comp.setPlaceholder).toEqual('function');
        comp.setPlaceholder(newPlaceholder);
        expect(comp.getPlaceholder()).toEqual(newPlaceholder);
      });

      it('include the correct placeholder when exporting its state', () => {
        const state = comp.exportState();
        const newPlaceholder = 'New Placeholder text';
        state.placeholder = newPlaceholder;
        comp.importState(state);
        expect(comp.getPlaceholder()).toEqual(newPlaceholder);
        expect(comp.html.textElement.getAttribute('placeholder')).toEqual(newPlaceholder);
      });

      it('not export the default placeholder', () => {
        const state = comp.exportState();
        expect(state.placeholder).toBeFalsy();
      });
    }); // wrapping describe
  }); // forEach
}; // wrapping function
