/* eslint-env jasmine */
import componentsArray from '../helpers/optionsComponentsArray';

export default () => {
  componentsArray.forEach((ComponentContructor) => {
    describe(`${ComponentContructor.name}: An OptionsComponent subclass component should`, () => {
      const MODULE_PREFIX = '-test-';
      let comp;
      beforeEach(() => {
        comp = new ComponentContructor(MODULE_PREFIX);
      });

      it('include options in exported object', () => {
        const state = comp.exportState();
        expect(Array.isArray(state.options)).toBe(true);
      });

      it('add an option with the "addOption" method', () => {
        const optionText = 'New option test';
        comp.addOption(optionText);
        const state = comp.exportState();
        expect(state.options.indexOf(optionText)).toBeGreaterThan(-1);
      });

      it('remove options with the "removeOption" method', () => {
        const optionText = 'New option test';
        comp.addOption(optionText);
        comp.addOption(optionText);
        comp.removeOption();
        comp.removeOption();
        const state = comp.exportState();
        expect(state.options.indexOf(optionText)).toEqual(-1);
      });

      it('import options from a state', () => {
        const optionText1 = 'New option test 1';
        comp.addOption(optionText1);
        const optionText2 = 'New option test 2';
        comp.addOption(optionText2);
        const state = comp.exportState();

        const newComponent = new ComponentContructor(MODULE_PREFIX);
        newComponent.importState(state);
        const newComponentState = newComponent.exportState();
        expect(newComponentState.options.indexOf(optionText1)).toBeGreaterThan(-1);
        expect(newComponentState.options.indexOf(optionText2)).toBeGreaterThan(-1);
      });
    }); // wrapping describe
  }); // forEach
}; // wrapping function
