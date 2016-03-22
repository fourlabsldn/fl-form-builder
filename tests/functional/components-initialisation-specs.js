//Helpers
/*globals xDivTester, clickButton, componentsArray*/
'use strict'; //jshint ignore: line

componentsArray.forEach(function (comp) {
  describe('A ' + comp.name, function () {
    var container;
    var compEl; //HTML Element of the component

    beforeEach(function (done) {
      //Create form-builder
      container = document.createElement('div');
      document.body.appendChild(container);
      xDivTester.callWith(container);
      clickButton(comp.buttonName, container);
      compEl = container.querySelector('.fl-component');
      done();
    });

    afterEach(function (done) {
      //Destroy form-builder
      container.remove();
      done();
    });

    describe('when created should', function () {
      it('show the config menu by default', function () {
        var config = compEl.querySelector('.fl-component-config');
        var configStyles = window.getComputedStyle(config);

        var configVisibility = configStyles.visibility;
        expect(configVisibility).toBe('visible');

        var configDisplayMode = configStyles.visibility;
        expect(configDisplayMode).not.toBe('none');
      });

      it('show the required switch', function () {
        var config = compEl.querySelector('.fl-component-config');
        var requiredSwitch = config.querySelector('.switch');
        expect(requiredSwitch).toBeDefined();

        var switchStyles = window.getComputedStyle(requiredSwitch);
        var switchVisibility = switchStyles.visibility;
        expect(switchVisibility).toBe('visible');

        var switchDisplayMode = switchStyles.visibility;
        expect(switchDisplayMode).not.toBe('none');
      });

      it('have the required switch in the off position', function () {
        var config = compEl.querySelector('.fl-component-config');
        var requiredSwitch = config.querySelector('.switch');
        var requiredInputElement = requiredSwitch.querySelector('input');
        expect(requiredInputElement.checked).toBe(false);
      });

      it('focus in the "add new option box" or in the correct text-box/area',
      function (done) {
        setTimeout(function () {
          var focusedElement = document.activeElement;
          var focusedExpectedNodeName = comp.focusElementNodeName || 'INPUT';
          focusedExpectedNodeName = focusedExpectedNodeName.toUpperCase();
          expect(focusedElement.nodeName).toBe(focusedExpectedNodeName);
          expect(focusedElement.hasAttribute('placeholder')).toBe(true);
          done();
        }, 50);
      });

      it('have the title editable', function () {
        var title = compEl.querySelector('h3');
        expect(title.hasAttribute('contenteditable')).toBe(true);

        var editableValue = title.getAttribute('contenteditable');
        expect(editableValue).not.toBe(false);
        expect(editableValue).not.toBe(null);
        expect(editableValue).not.toBe('false');
      });

      if (comp.name === 'Dropdown') {
        it('show the select as multiple', function () {
          var selector = compEl.querySelector('select');
          expect(selector.hasAttribute('multiple')).toBe(true);
        });
      } else {
        it('have options editable', function () {
          var editables = compEl.querySelectorAll('[contenteditable]');

          //Has to have at least 2. The title and one more.
          expect(editables.length).toBeGreaterThan(1);
        });
      }
    });

    describe('config box should', function () {
      it('set elements as required when the required switch is changed', function () {
        var requiredInputElement = compEl.querySelector('.fl-component-config .switch input');
        requiredInputElement.click();

        var requiredElements = compEl.querySelectorAll('[required]');
        expect(requiredElements.length).toBeGreaterThan(0);
      });

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
  });
});
