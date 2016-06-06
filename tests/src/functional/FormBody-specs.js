/* eslint-env jasmine*/

import componentsArray from './helpers/componentsArray';
import helpers from './helpers/help-functions';
import xdiv from 'x-div';
const xDivTester = new xdiv.xDivTester();

describe('The save button should', () => {
  'use strict';
  let container;
  let submitBtn;

  beforeEach(() => {
    // Create form-builder
    container = document.createElement('div');
    document.body.appendChild(container);
    xDivTester.callWith(container);

    // Create one of each component
    componentsArray.forEach((comp) => {
      helpers.clickButton(comp.buttonName, container);
    });

    submitBtn = container.querySelector('input[type=submit]');
  });

  afterEach(() => {
    // Destroy form-builder
    container.remove();
  });

  it('trigger an event when submitting the form', (done) => {
    container.addEventListener('formSubmitted', (e) => {
      expect(e).toBeDefined();
      done();
    });

    submitBtn.click();
  });

  it('export the right amount of components when nothing has been deleted', (done) => {
    container.addEventListener('formSubmitted', (e) => {
      const json = e.detail.json;
      const exportObj = JSON.parse(json);
      expect(exportObj.length).toBe(componentsArray.length);
      done();
    });

    submitBtn.click();
  });

  it('export the right amount of components when some components were deleted', (done) => {
    const noElementsToDelete = 2;

    container.addEventListener('formSubmitted', (e) => {
      const json = e.detail.json;
      const exportObj = JSON.parse(json);
      expect(exportObj.length).toBe(componentsArray.length - noElementsToDelete);
      done();
    });

    // Click some delete buttons
    const deleteBtns = container.querySelectorAll('button[name=delete]');
    for (let i = 0; i < noElementsToDelete; i++) {
      deleteBtns[i].click();
    }

    submitBtn.click();
  });

  it('export the right type of components', (done) => {
    container.addEventListener('formSubmitted', (e) => {
      const json = e.detail.json;
      const exportObj = JSON.parse(json);
      for (let i = 0; i < exportObj.length; i++) {
        expect(exportObj[i].componentType).toBe(componentsArray[i].componentType);
      }

      done();
    });

    submitBtn.click();
  });

  it('export the right number of options in a dropdown', (done) => {
    let dropdownIndex;
    const optionsToAddCount = 2;

    // Find the index of the dropdown element
    for (let i = 0; i < componentsArray.length; i++) {
      if (componentsArray[i].componentType === 'Dropdown') {
        dropdownIndex = i;
      }
    }

    // Add options to the dropdown
    const optionText = 'Testing option insertion';
    const compEl = container.querySelectorAll('.fl-component')[dropdownIndex];

    for (let i = 0; i < optionsToAddCount; i++) {
      helpers.addOption(optionText, compEl);
    }

    container.addEventListener('formSubmitted', (e) => {
      const json = e.detail.json;
      const exportObj = JSON.parse(json);

      const dropdownExportObj = exportObj[dropdownIndex];
      expect(dropdownExportObj.content.length).toBe(optionsToAddCount);

      for (let i = 0; i < optionsToAddCount; i++) {
        expect(dropdownExportObj.content[i].label).toBe(optionText);
      }

      done();
    });

    submitBtn.click();
  });

  it('export titles correctly', (done) => {
    const titles = container.querySelectorAll('h3[contenteditable]');
    container.addEventListener('formSubmitted', (e) => {
      const json = e.detail.json;
      const exportObj = JSON.parse(json);
      for (let i = 0; i < exportObj.length; i++) {
        expect(exportObj[i].title).toBe(titles[i].innerText);
      }

      done();
    });

    submitBtn.click();
  });

  xit('export placeholders correctly');
});
