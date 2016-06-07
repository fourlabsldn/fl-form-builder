/* globals xController */

import ModuleCoordinator from './ModuleCoordinator';
const MODULE_PREFIX = 'fl-fb';

xController((xdiv) => {
  xdiv.classList.add(MODULE_PREFIX);
  const coordinator = new ModuleCoordinator(MODULE_PREFIX, xdiv);
  return coordinator;
});
