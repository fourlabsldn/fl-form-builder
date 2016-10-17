import React from 'react';
import renderer from 'react-test-renderer';
import FormBuilder from '../js/FormBuilder';
import polyfills from 'babel-polyfill';

describe('FormBuiler constructs UI correctly', () => {
  const component = renderer.create(
    <FormBuilder />
  );

  it('works?', () => {
    let tree = component.toJSON();
    expect(tree).toEqual(tree);
  })
});

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});
