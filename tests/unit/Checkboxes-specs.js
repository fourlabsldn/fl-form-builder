describe('A Checkbox Component should', function () {
  'use strict';

  describe('when initialised', function () {
    var comp;
    beforeAll(function () {
      var name = 'My box';
      comp = new Checkbox(name);
    });

    it('create a component div', function () {
      expect(comp.element).toBeDefined();
    });
  });
});
