/* eslint-env jasmine */
import ComponentsContainer from '../../../src/ComponentsContainer';
import ControlBar from '../../../src/ControlBar';
import ModuleCoordinator from '../../../src/ModuleCoordinator';
import componentsArray from '../helpers/componentsArray';
import isHtmlNode from '../helpers/isHtmlNode';

const viewControllerSubclasses = [
  ComponentsContainer,
  // ControlBar,
  ...componentsArray,
];

export default () => {
  viewControllerSubclasses.forEach((ViewControllerContructor) => {
    describe(`${ViewControllerContructor.name}: A ViewController instance should`, () => {
      const MODULE_PREFIX = '-test-';
      let comp;

      beforeEach(() => {
        if (ViewControllerContructor === ControlBar) {
          const container = document.createElement('div');
          const coordinator = new ModuleCoordinator(MODULE_PREFIX, container);
          comp = new ControlBar(MODULE_PREFIX, coordinator);
        } else {
          comp = new ViewControllerContructor(MODULE_PREFIX);
        }
      });

      it('create an html object to hold DOM nodes', () => {
        expect(comp.html).toBeDefined();
      });

      it('have a container DOM node and its getter', () => {
        expect(comp.html.container).toBeDefined();
        expect(isHtmlNode(comp.html.container)).toBeTruthy();
        expect(comp.getHtmlContainer).toBeDefined();
        expect(comp.getHtmlContainer() === comp.html.container).toBeTruthy();
      });

      it('have an "on" method for event listening', () => {
        expect(comp.on).toBeDefined();
        expect(typeof comp.on === 'function').toBeTruthy();
      });

      it('accept listening for the destroy event', () => {
        const removeSpy = jasmine.createSpy('removeSpy');
        expect(() => comp.on('destroy', removeSpy)).not.toThrow();
        comp.destroy();
        expect(removeSpy).toHaveBeenCalled();
      });

      it('remove listeners with the "removeListener" method', () => {
        const removeSpy = jasmine.createSpy('removeSpy');
        comp.on('destroy', removeSpy);
        comp.removeListener('destroy', removeSpy);
        comp.destroy();
        expect(removeSpy).not.toHaveBeenCalled();
      });

      it('destroy the html container on destroy', () => {
        expect(comp.html !== null).toBeTruthy();
        comp.destroy();
        expect(comp.getHtmlContainer()).toBeFalsy();
      });

      it('execute events added via the "acceptEvents" method', () => {
        const testSpy = jasmine.createSpy();
        const testEvent = 'test';
        comp.acceptEvents(testEvent);
        expect(() => comp.on(testEvent, testSpy)).not.toThrow();
        comp.trigger(testEvent);
        expect(testSpy).toHaveBeenCalled();
      });
    });
  });
};
