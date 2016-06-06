/* eslint-env jasmine*/
import componentsArray from './helpers/componentsArray';
import helpers from './helpers/help-functions';
import xdiv from 'x-div';
const xDivTester = new xdiv.xDivTester();

describe('The factory bar should', () => {
  'use strict';

  let container;

  beforeEach(() => {
    // Create form-builder
    container = document.createElement('div');
    document.body.appendChild(container);
    xDivTester.callWith(container);
  });

  afterEach(() => {
    // Destroy form-builder
    container.remove();
  });

  it('show five elements to be created', () => {
    const formFabric = container.querySelector('.fl-form-fabric');
    const buttons = formFabric.children;
    expect(buttons.length).toBe(5);
  });

  componentsArray.forEach((comp) => {
    it(`create the right component when clicking the ${comp.name} button'`,
      () => {
        helpers.clickButton(comp.buttonName, container);
        const components = container.querySelectorAll('.fl-component');
        expect(components.length).toBe(1);

        const compEl = components[0];
        const content = compEl.querySelectorAll(comp.contentQuery);
        expect(content.length).toBeGreaterThan(0);
      });
  });
});
