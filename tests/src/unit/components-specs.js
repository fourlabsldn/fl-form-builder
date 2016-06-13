/* eslint-env jasmine */
import componentsArray from '../helpers/componentsArray';

componentsArray.forEach((ComponentContructor) => {
  const MODULE_PREFIX = '-test-';
  describe(`A ${ComponentContructor.name} ComponentContructor`, () => {
    let comp;
    beforeEach(() => {
      comp = new ComponentContructor(MODULE_PREFIX);
    });

    describe('when initialised should', () => {
      it('create a ComponentContructor div', () => {
        expect(comp.element).toBeDefined();
      });

      it('start with the correct name', () => {
        expect(comp.name.indexOf(name)).toBeGreaterThan(-1);
      });

      it('have a title propperty', () => {
        expect(comp.title).toBeDefined();
        expect(comp.title.innerText).toBeDefined();
      });

      it('have a content propperty', () => {
        expect(comp.content).toBeDefined();
        expect(comp.content.innerHTML).toBeDefined();
      });

      it('have a configContent propperty', () => {
        expect(comp.configContent).toBeDefined();
        expect(comp.configContent.innerHTML).toBeDefined();
      });

      it('have a focusElement propperty', () => {
        expect(comp.focusElement).toBeDefined();
        expect(comp.focusElement.innerHTML).toBeDefined();
      });

      it('have a isRequired propperty', () => {
        expect(comp.isRequired).toBeDefined();

        // Test that it is a boolean value
        expect(comp.isRequired === true || comp.isRequired === false).toBe(true);
      });

      it('have the isRequired propperty initialised to false', () => {
        expect(comp.isRequired).toBeFalsy();
      });

      it('have a required switch propperty', () => {
        expect(comp.requiredSwitch).toBeDefined();
        expect(comp.requiredSwitch.innerHTML).toBeDefined();
      });

      if (ComponentContructor.hasOptions) {
        it('have a placeHolder propperty', () => {
          expect(comp.placeHolder).toBeDefined();
          expect(comp.placeHolder.innerHTML).toBeDefined();
        });

        it('have an addPlaceHolder function', () => {
          expect(comp.addPlaceHolder).toBeDefined();
          expect(typeof comp.addPlaceHolder).toBe('function');
        });

        it('have an addOption function', () => {
          expect(comp.addOption).toBeDefined();
          expect(typeof comp.addOption).toBe('function');
        });

        it('have a removeOption function', () => {
          expect(comp.removeOption).toBeDefined();
          expect(typeof comp.removeOption).toBe('function');
        });
      }

      it('have a componentType propperty correctly set', () => {
        expect(comp.componentType).toBeDefined();
        expect(comp.componentType).toBe(ComponentContructor.constructorName);
      });

      it('have a "required" function', () => {
        expect(comp.required).toBeDefined();
        expect(typeof comp.required).toBe('function');
      });
    });

    describe('should with the function', () => {
      if (ComponentContructor.hasOptions) {
        it('getElements return all option elements', () => {
          const els = comp.getElements(); // Should return at least the placeholder
          expect(els).toBeDefined();
          expect(els.length).toBeGreaterThan(0);
        });

        it('addOption increase the number of option elements', () => {
          comp.addOption('op1'); // This one will replace the placeholder
          comp.addOption('op2'); // This one will be displayed together with the first

          const els = comp.getElements();
          expect(els.length).toBe(2);
        });

        it('removeOption reduce the number of option elements', () => {
          comp.addOption('op1'); // This one will replace the placeholder
          comp.addOption('op2'); // This one will be displayed together with the first
          comp.removeOption();
          comp.removeOption();
          const els = comp.getElements();
          expect(els.length).toBe(0);
        });
      } else {
        it('getElements return the main input element', () => {
          const els = comp.getElements();
          expect(els.length).toBe(1);
        });
      }

      describe('required', () => {
        beforeEach(() => {
          if (ComponentContructor.hasOptions) {
            comp.addOption('op1'); // Add an option just to make it 'requirable'
          }
        });

        it('return whether the required was successfully set', () => {
          const outcome = comp.required(true);
          expect(outcome === true || outcome === false).toBe(true);
        });

        it('change the isRequired propperty when making it required', () => {
          const wasSet = comp.required(true);
          expect(wasSet).toBe(true);
          expect(comp.isRequired).toBe(true);
        });

        it('change the isRequired propperty when making it not required', () => {
          const wasSet = comp.required(false);
          expect(wasSet).toBe(true);
          expect(comp.isRequired).toBe(false);
        });
      });
    });
  });
});
