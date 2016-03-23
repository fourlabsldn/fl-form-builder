//helpers
/*globals componentsArray*/

componentsArray.forEach(function (compHelper) {
  'use strict';

  describe('A ' + compHelper.name + ' Component', function () {
    var comp;
    var name = 'My Component';
    beforeEach(function () {
      comp = new window[compHelper.constructorName](name);
    });

    describe('when initialised should', function () {
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
        it('have a placeHolder propperty', function () {
          expect(comp.placeHolder).toBeDefined();
          expect(comp.placeHolder.innerHTML).toBeDefined();
        });

        it('have an addPlaceHolder function', function () {
          expect(comp.addPlaceHolder).toBeDefined();
          expect(typeof comp.addPlaceHolder).toBe('function');
        });

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

    describe('should with the function', function () {
      if (compHelper.hasOptions) {
        it('getElements return all option elements', function () {
          var els = comp.getElements(); //Should return at least the placeholder
          expect(els).toBeDefined();
          expect(els.length).toBeGreaterThan(0);
        });

        it('addOption increase the number of option elements', function () {
          comp.addOption('op1'); //This one will replace the placeholder
          comp.addOption('op2'); //This one will be displayed together with the first

          var els = comp.getElements();
          expect(els.length).toBe(2);
        });

        it('removeOption reduce the number of option elements', function () {
          comp.addOption('op1'); //This one will replace the placeholder
          comp.addOption('op2'); //This one will be displayed together with the first
          comp.removeOption();
          comp.removeOption();
          var els = comp.getElements();
          expect(els.length).toBe(0);
        });

      } else {
        it('getElements return the main input element', function () {
          var els = comp.getElements();
          expect(els.length).toBe(1);
        });
      }

      describe('required', function () {
        beforeEach(function () {
          if (compHelper.hasOptions) {
            comp.addOption('op1'); //Add an option just to make it 'requirable'
          }
        });

        it('return whether the required was successfully set', function () {
          var outcome = comp.required(true);
          expect(outcome === true || outcome === false).toBe(true);
        });

        it('change the isRequired propperty when making it required', function () {
          var wasSet = comp.required(true);
          expect(wasSet).toBe(true);
          expect(comp.isRequired).toBe(true);
        });

        it('change the isRequired propperty when making it not required', function () {
          var wasSet = comp.required(false);
          expect(wasSet).toBe(true);
          expect(comp.isRequired).toBe(false);
        });
      });
    });
  });
});
