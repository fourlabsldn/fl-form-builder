/* globals xController */

import FormBody from './FormBody';
import FormFabric from './FormFabric';

function flFormBuilder(xDivEl) {
  'use strict';
  var formBody = new FormBody();
  var fabric = new FormFabric(formBody.element);

  xDivEl.classList.add('fl-form-builder');
  xDivEl.appendChild(fabric.element);
  xDivEl.appendChild(formBody.element);
}

xController(flFormBuilder);
