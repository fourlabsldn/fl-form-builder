/*globals FormFabric, FormBody, xController*/

xController(function flFormBuilder(xDivEl) {
  var formBody = new FormBody();
  var fabric = new FormFabric(formBody.element);

  xDivEl.classList.add('fl-form-builder');
  xDivEl.appendChild(fabric.element);
  xDivEl.appendChild(formBody.element);
});
