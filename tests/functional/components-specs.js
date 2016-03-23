//Helpers
/*globals xDivTester, clickButton, componentsArray, addOption*/
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

      //No text-box or text-area for this spec
      if (comp.optionQuery) {

        it('add an option when the add option button is clicked', function () {
          //Write option text
          var optionText = 'Testing option insertion';
          addOption(optionText, compEl);

          //Check that it has at least one option
          var formContent = compEl.querySelector('.fl-form-content');
          var options = formContent.querySelectorAll(comp.optionQuery);
          expect(options.length).toBeGreaterThan(0);

          //Check that there is at least one option with the right text.
          var found = 0;
          for (var i = 0; i < options.length; i++) {
            if (options[i].innerHTML.indexOf(optionText) >= 0) { found++; }
          }

          expect(found).toBe(1);
        });

        it('not add an option if the option text-box is empty', function () {
          //register number of options before clicking the add button
          var formContent = compEl.querySelector('.fl-form-content');
          var optionsBefore = formContent.querySelectorAll(comp.optionQuery);
          var optionsCountBefore = optionsBefore.length;

          //Click the add button
          var addBtn = compEl.querySelector('.fl-component-config [name=add]');
          addBtn.click();

          //Compare with the number of options after
          var optionsAfter = formContent.querySelectorAll(comp.optionQuery);
          var optionsCountAfter = optionsAfter.length;
          expect(optionsCountAfter).toEqual(optionsCountBefore);
        });

        it('remove option when clicking the "minus" button', function () {
          //Add option
          var optionText = 'Testing option insertion';
          addOption(optionText, compEl);

          //Click the delete button
          var removeBtn = compEl.querySelector('.fl-component-config [name=remove]');
          removeBtn.click();

          //Check that it disappeared
          var indexOfOptionText = compEl.innerHTML.indexOf(optionText);

          expect(indexOfOptionText).toBeLessThan(0);
        });
      }

      it('make content non-editable when hiding', function () {
        var elementsBeforeHiding = compEl.querySelectorAll('[contenteditable=true]');
        var elementCountBeforeHiding = elementsBeforeHiding.length;
        expect(elementCountBeforeHiding).toBeGreaterThan(0);

        //Click OK btn;
        var okBtn = compEl.querySelector('.fl-component-config button[name=ok]');
        okBtn.click();

        var elementsAfterHiding = compEl.querySelectorAll('[contenteditable=true]');
        var elementCountAfterHiding = elementsAfterHiding.length;
        expect(elementCountAfterHiding).toBe(0);
      });

      it('hide when clicking the OK button', function () {
        //Click OK btn;
        var okBtn = compEl.querySelector('.fl-component-config button[name=ok]');
        okBtn.click();
        var config = compEl.querySelector('.fl-component-config');
        var configStyles = window.getComputedStyle(config);

        var configVisibility = configStyles.visibility;
        expect(configVisibility).toBe('hidden');
      });

      xit('hide when clicking outside the box', function () {
        var config = compEl.querySelector('.fl-component-config');

        //Visible before clicking out
        var configStyles = window.getComputedStyle(config);
        var configVisibility = configStyles.visibility;
        expect(configVisibility).toBe('visible');

        //Click a button outside of the form builder
        var button = document.createElement('button');
        document.body.insertBefore(button, document.body.children[0]);
        button.dispatchEvent(new MouseEvent('mousedown', { clickX: 0, clickY: 0 }));

        //Hidden after clicking out
        configStyles = window.getComputedStyle(config);
        configVisibility = configStyles.visibility;
        expect(configVisibility).toBe('hidden');
        button.delete();
      });

      it('remove the component when clicking in the delete button', function () {
        var deleteBtn = compEl.querySelector('.fl-component-config button[name=delete]');
        deleteBtn.click();

        compEl = container.querySelector('.fl-component');
        expect(compEl).toBeFalsy();
      });
    });
  });
});
