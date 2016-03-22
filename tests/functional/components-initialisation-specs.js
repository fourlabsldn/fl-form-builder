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
          expect(focusedElement.nodeName).toBe('INPUT');
          expect(focusedElement.hasAttribute('placeholder')).toBe(true);
          done();
        }, 50);
      });

      xit('have the title editable');
      xit('have options editable');
    });

    describe('config box should', function () {
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
  });
});
