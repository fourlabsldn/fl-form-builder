//helpers
/*globals componentsArray*/

componentsArray.forEach(function (compHelper) {
  'use strict';

  describe('A ' + compHelper.name + ' Component should', function () {
    describe('when initialised should', function () {
      var comp;
      var name = 'My Component';
      beforeAll(function () {
        comp = new window[compHelper.constructorName](name);
      });

      it('create a component div', function () {
        expect(comp.element).toBeDefined();
      });

      it('start with the correct name', function () {
        expect(comp.name.indexOf(name)).toBeGreaterThan(-1);
      });

      it('have a title propperty', function () {
        expect(comp.title).toBeDefined();
        expect(comp.title.innerText).toBeDefined();
      });

      it('have a content propperty', function () {
        expect(comp.content).toBeDefined();
        expect(comp.content.innerHTML).toBeDefined();
      });

      it('have a configContent propperty', function () {
        expect(comp.configContent).toBeDefined();
        expect(comp.configContent.innerHTML).toBeDefined();
      });

      it('have a focusElement propperty', function () {
        expect(comp.focusElement).toBeDefined();
        expect(comp.focusElement.innerHTML).toBeDefined();
      });

      it('have a isRequired propperty', function () {
        expect(comp.isRequired).toBeDefined();

        //Test that it is a boolean value
        expect(comp.isRequired === true || comp.isRequired === false).toBe(true);
      });

      it('have the isRequired propperty initialised to false', function () {
        expect(comp.isRequired).toBeFalsy();
      });

      it('have a required switch propperty', function () {
        expect(comp.requiredSwitch).toBeDefined();
        expect(comp.requiredSwitch.innerHTML).toBeDefined();
      });

      if (compHelper.hasOptions) {
        it('have an addOption function', function () {
          expect(comp.addOption).toBeDefined();
          expect(typeof comp.addOption).toBe('function');
        });
        it('have a removeOption function', function () {
          expect(comp.removeOption).toBeDefined();
          expect(typeof comp.removeOption).toBe('function');
        });
      }

      it('have a componentType propperty correctly set', function () {
        expect(comp.componentType).toBeDefined();
        expect(comp.componentType).toBe(compHelper.constructorName);
      });

      it('have a "required" function', function () {
        expect(comp.required).toBeDefined();
        expect(typeof comp.required).toBe('function');
      });
    });
  });
});
