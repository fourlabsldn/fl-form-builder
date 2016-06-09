/* globals xController */
import assert from 'fl-assert';
import ModuleCoordinator from './ModuleCoordinator';
const MODULE_PREFIX = 'fl-fb';

xController((xdiv) => {
  xdiv.classList.add(MODULE_PREFIX);
  const coordinator = new ModuleCoordinator(MODULE_PREFIX, xdiv);
  const jsonStateToRestore = xdiv.dataset.restoreState;
  if (jsonStateToRestore) {
    try {
      const stateToRestore = JSON.parse(jsonStateToRestore);
      coordinator.importState(stateToRestore);
    } catch (e) {
      assert.warn(e);
    }
  }

  const loadEvent = new CustomEvent('formBuilderLoaded', {
    detail: {
      instance: coordinator,
    },
  });
  xdiv.dispatchEvent(loadEvent);
  return coordinator;
});
