/*global xDivTester, componentsArray*/

describe('The factory bar should', function () {
  'use strict';

  var container;

  beforeEach(function () {
    //Create form-builder
    container = document.createElement('div');
    document.body.appendChild(container);
    xDivTester.callWith(container);
  });

  afterEach(function () {
    //Destroy form-builder
    container.remove();
  });

  it('show five elements to be created', function () {
    var formFabric = container.querySelector('.fl-form-fabric');
    var buttons = formFabric.children;
    expect(buttons.length).toBe(5);
  });

  componentsArray.forEach(function (comp) {
    it('create the right component when clicking the ' + comp.name + ' button',
      function () {
        clickButton(comp.buttonName, container);
        var components = container.querySelectorAll('.fl-component');
        expect(components.length).toBe(1);

        var compEl = components[0];
        var content = compEl.querySelectorAll(comp.contentQuery);
        expect(content.length).toBeGreaterThan(0);
      });
  });
});
