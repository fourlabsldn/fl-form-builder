/*globals xDivTester*/

'use strict'; //jshint ignore:line

describe('A Form Builder should', function () {
  it('initialise without errors', function () {
    expect(function () {
      xDivTester.callWith(document.createElement('div'));
    }).not.toThrow();
  });
});

describe('After initialised, a FormBuilder should', function () {
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

  it('be empty of components', function () {
    var components = container.querySelectorAll('.fl-component');
    expect(components.length).toBe(0);
  });

  it('show the factory bar', function () {
    var fabrics = container.querySelectorAll('.fl-form-fabric');
    expect(fabrics.length).toBe(1);
  });

  it('show the submit button', function () {
    var submitBtns = container.querySelectorAll('input[type=submit]');
    expect(submitBtns.length).toBe(1);
  });
});
