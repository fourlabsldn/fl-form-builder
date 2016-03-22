/*globals xDivTester, describe, it, xit, expect*/
'use strict'; //jshint ignore:line

describe('A Form Builder should', function () {
  it('initialise without errors', function () {
    expect(function () {
      xDivTester.callWith(document.createElement('div'));
    }).not.toThrow();
  });
});

describe('After initialised, a FormBuilder should', function () {
  xit('be empty of components');
  xit('show the factory bar');
  xit('show the submit button');
});

describe('The factory bar should', function () {
  xit('show five elements to be created');
  xit('create the right component when clicking the checkbox button');
  xit('create the right component when clicking the radio-button button');
  xit('create the right component when clicking the dropdown button');
  xit('create the right component when clicking the text-box button');
  xit('create the right component when clicking the text-area button');
});

describe('A component when created should', function () {
  xit('show the config menu by default');
  xit('show the required switch');
  xit('have the required switch in the off position');
  xit('focus in the "add new option box" or in the correct text-box/area');
  xit('have the title editable');
  xit('have options editable');
});

describe('The config box should', function () {
  xit('set elements as required when the required switch is changed');
  xit('add an option when the add option button is clicked');
  xit('not add an option if the option text-box is empty');
  xit('make content non-editable when hiding');
  xit('hide when clicking the OK button');
  xit('hide when clicking outside the box');
  xit('remove the component when clicking in the delete button');
  xit('remove option when clicking the "minus" button');
});

describe('The save button should', function () {
  xit('export the right amount of components');
  xit('export the right type of components');
  xit('export the right number of options in a dropdown');
  xit('export titles correctly');
  xit('export placeholders correctly');
});
