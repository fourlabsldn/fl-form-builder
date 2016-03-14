/*globals FormFabric, xController*/

xController(function flFormBuilder(xDivEl) {
  xDivEl.innerText = "I'm working!";

  var fabric = new FormFabric();
  xDivEl.appendChild(fabric.element);
});
