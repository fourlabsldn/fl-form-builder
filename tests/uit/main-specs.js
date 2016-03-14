/*globals xDivTester, describe, it, xit, expect*/

describe('A Form Builder should', function () {
  it('initialise without errors', function () {
    expect(function () {
      xDivTester.callWith(document.createElement('div'));
    }).not.toThrow();
  });
});
