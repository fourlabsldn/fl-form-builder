/*globals FormFabric, FormBody, xController*/

xController(function flFormBuilder(xDivEl) {
  xDivEl.innerText = "I'm working!";

  var formBody = new FormBody();
  var fabric = new FormFabric(formBody.element);

  xDivEl.appendChild(fabric.element);
  xDivEl.appendChild(formBody.element);
});
