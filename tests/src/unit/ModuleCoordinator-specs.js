/* eslint-env jasmine */
import ModuleCoordinator from '../../../src/ModuleCoordinator';
import ComponentFabric from '../../../src/ComponentFabric';
const MODULE_PREFIX = '-test-';

function createCoordinator(container = document.createElement('div')) {
  return new ModuleCoordinator(MODULE_PREFIX, container);
}

export default () => {
  describe('A ModuleCoordinator should', () => {
    let coordinator;
    let componentNames;
    beforeAll(() => {
      const fabric = new ComponentFabric(MODULE_PREFIX);
      componentNames = fabric.getComponentTypes().map(c => c.name);
    });

    beforeEach(() => {
      coordinator = createCoordinator();
    });

    it('allow for creation of components', () => {
      expect(() => {
        componentNames.forEach(name => {
          coordinator.createComponent(name);
        });
      }).not.toThrow();
    });

    it('throw when there is an attempt to create an invalid component', () => {
      expect(() => coordinator.createComponent('non-existing-name')).toThrow();
    });

    it('export the current state including all components', () => {
      let state = coordinator.exportState();
      expect(Array.isArray(state)).toBe(true);
      expect(state.length).toBe(0);

      // Create loads of components
      componentNames.forEach(name => {
        coordinator.createComponent(name);
      });

      state = coordinator.exportState();
      expect(state.length).toBe(componentNames.length);
      state.forEach((componentObj, index) => {
        expect(componentObj.type).toEqual(componentNames[index]);
      });
    });

    it('adds all correct components when importing a state', () => {
      const coordinator2 = createCoordinator();
      componentNames.forEach(name => {
        coordinator2.createComponent(name);
      });

      const coordinator2State = coordinator2.exportState();
      coordinator.importState(coordinator2State);
      const finalState = coordinator.exportState();
      expect(JSON.stringify(finalState)).toEqual(JSON.stringify(coordinator2State));
    });

    it('on save emmit correct event in container element', () => {
      const saveSpy = jasmine.createSpy();
      const container = document.createElement('div');
      const coordinator2 = createCoordinator(container);

      container.addEventListener('formBuilderSave', saveSpy);
      coordinator2.save();
      expect(saveSpy).toHaveBeenCalled();
    });

    it('allows for pushing and popping history states', () => {
      expect(() => {
        coordinator.pushHistoryState();
        coordinator.pushHistoryState();
        coordinator.pushHistoryState();
        coordinator.pushHistoryState();
      }).not.toThrow();

      expect(() => {
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
      }).not.toThrow();
    });

    it('does not throw when popping more history states than pushed', () => {
      expect(() => {
        coordinator.pushHistoryState();
        coordinator.pushHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
        coordinator.popHistoryState();
      }).not.toThrow();
    });

    it('returns correctly to past history states', () => {
      const state1 = coordinator.exportState();
      coordinator.createComponent(componentNames[0]);

      const state2 = coordinator.exportState();
      coordinator.createComponent(componentNames[0]);
      expect(JSON.stringify(state2)).not.toEqual(JSON.stringify(state1));

      const state3 = coordinator.exportState();
      coordinator.createComponent(componentNames[0]);
      expect(JSON.stringify(state3)).not.toEqual(JSON.stringify(state2));


      const state4 = coordinator.exportState();
      coordinator.createComponent(componentNames[0]);
      expect(JSON.stringify(state4)).not.toEqual(JSON.stringify(state3));

      const state5 = coordinator.exportState();
      coordinator.createComponent(componentNames[0]);
      expect(JSON.stringify(state5)).not.toEqual(JSON.stringify(state4));

      coordinator.popHistoryState();
      const poppedToState4 = coordinator.exportState();
      expect(JSON.stringify(poppedToState4)).not.toEqual(JSON.stringify(state4));

      coordinator.popHistoryState();
      const poppedToState3 = coordinator.exportState();
      expect(JSON.stringify(poppedToState3)).not.toEqual(JSON.stringify(state3));

      coordinator.popHistoryState();
      const poppedToState2 = coordinator.exportState();
      expect(JSON.stringify(poppedToState2)).not.toEqual(JSON.stringify(state2));

      coordinator.popHistoryState();
      const poppedToState1 = coordinator.exportState();
      expect(JSON.stringify(poppedToState1)).not.toEqual(JSON.stringify(state1));
    });
  });
};
