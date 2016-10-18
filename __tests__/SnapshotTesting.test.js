/* eslint-env jasmine */
const React = require('react');
const renderer = require('react-test-renderer');
const FormBuilder = require('../dist/__test-files__/FormBuilder');
const UiSnapshots = require('./UiSnapshots');

const shots = new UiSnapshots('CHECK');

describe('The FormBuilder`s ui', () => {
  it('is created correctly when empty', () => {
    const formBuildder = renderer.create(React.createElement(FormBuilder));

    expect(
      shots.matchesSnapshot(formBuildder.toJSON())
    ).toBe(true);
  });
});
