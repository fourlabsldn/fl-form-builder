/* globals xController */

import FormBody from './FormBody';
import FormFabric from './FormFabric';

function flFormBuilder(xDivEl) {
  'use strict';
  const formBody = new FormBody();
  const fabric = new FormFabric(formBody.element);

  xDivEl.classList.add('fl-form-builder');
  xDivEl.appendChild(fabric.element);
  xDivEl.appendChild(formBody.element);
}

xController(flFormBuilder);
