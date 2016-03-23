/*global xDivTester, componentsArray, clickButton, addOption*/

describe('The save button should', function () {
  'use strict';
  var container;
  var submitBtn;

  beforeEach(function () {
    //Create form-builder
    container = document.createElement('div');
    document.body.appendChild(container);
    xDivTester.callWith(container);

    //Create one of each component
    componentsArray.forEach(function (comp) {
      clickButton(comp.buttonName, container);
    });

    submitBtn = container.querySelector('input[type=submit]');
  });

  afterEach(function () {
    //Destroy form-builder
    container.remove();
  });

  it('trigger an event when submitting the form', function (done) {
    container.addEventListener('formSubmitted', function (e) {
      expect(e).toBeDefined();
      done();
    });

    submitBtn.click();
  });

  it('export the right amount of components when nothing has been deleted', function (done) {
    container.addEventListener('formSubmitted', function (e) {
      var json = e.detail.json;
      var exportObj = JSON.parse(json);
      expect(exportObj.length).toBe(componentsArray.length);
      done();
    });

    submitBtn.click();
  });

  it('export the right amount of components when some components were deleted', function (done) {
    var noElementsToDelete = 2;

    container.addEventListener('formSubmitted', function (e) {
      var json = e.detail.json;
      var exportObj = JSON.parse(json);
      expect(exportObj.length).toBe(componentsArray.length - noElementsToDelete);
      done();
    });

    //Click some delete buttons
    var deleteBtns = container.querySelectorAll('button[name=delete]');
    for (var i = 0; i < noElementsToDelete; i++) {
      deleteBtns[i].click();
    }

    submitBtn.click();
  });

  it('export the right type of components', function (done) {
    container.addEventListener('formSubmitted', function (e) {
      var json = e.detail.json;
      var exportObj = JSON.parse(json);
      for (var i = 0; i < exportObj.length; i++) {
        expect(exportObj[i].componentType).toBe(componentsArray[i].componentType);
      }

      done();
    });

    submitBtn.click();
  });

  it('export the right number of options in a dropdown', function (done) {
    var dropdownIndex;
    var optionsToAddCount = 2;

    //Find the index of the dropdown element
    for (var i = 0; i < componentsArray.length; i++) {
      if (componentsArray[i].componentType === 'Dropdown') {
        dropdownIndex = i;
      }
    }

    //Add options to the dropdown
    var optionText = 'Testing option insertion';
    var compEl = container.querySelectorAll('.fl-component')[dropdownIndex];

    for (i = 0; i < optionsToAddCount; i++) {
      addOption(optionText, compEl);
    }

    container.addEventListener('formSubmitted', function (e) {
      var json = e.detail.json;
      var exportObj = JSON.parse(json);

      var dropdownExportObj = exportObj[dropdownIndex];
      expect(dropdownExportObj.content.length).toBe(optionsToAddCount);

      for (i = 0; i < optionsToAddCount; i++) {
        expect(dropdownExportObj.content[i].label).toBe(optionText);
      }

      done();
    });

    submitBtn.click();
  });

  xit('export titles correctly');
  xit('export placeholders correctly');
});
