/* globals xController */
import assert from 'fl-assert';
import ModuleCoordinator from './ModuleCoordinator';
import utils from './utils/utils';
const MODULE_PREFIX = 'fl-fb';

const FormBuilder = (xdiv) => {
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

  utils.fireEvent(xdiv, 'formBuilderLoaded', { instance: coordinator });
  return coordinator;
};

export default FormBuilder;
