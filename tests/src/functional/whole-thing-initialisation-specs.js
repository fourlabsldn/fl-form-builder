/* eslint-env jasmine */
import xdiv from 'x-div';
const xDivTester = new xdiv.xDivTester();

describe('A Form Builder should', () => {
  it('initialise without errors', () => {
    expect(() => {
      xDivTester.callWith(document.createElement('div'));
    }).not.toThrow();
  });
});

describe('After initialised, a FormBuilder should', () => {
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

  it('be empty of components', () => {
    const components = container.querySelectorAll('.fl-component');
    expect(components.length).toBe(0);
  });

  it('show the factory bar', () => {
    const fabrics = container.querySelectorAll('.fl-form-fabric');
    expect(fabrics.length).toBe(1);
  });

  it('show the submit button', () => {
    const submitBtns = container.querySelectorAll('input[type=submit]');
    expect(submitBtns.length).toBe(1);
  });
});
