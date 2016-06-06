/* eslint-env jasmine*/

import componentsArray from './helpers/componentsArray';
import helpers from './helpers/help-functions';
import xdiv from 'x-div';
const xDivTester = new xdiv.xDivTester();

componentsArray.forEach((comp) => {
  describe(`A ${comp.name}`, () => {
    let container;
    let compEl; // HTML Element of the component

    beforeEach((done) => {
      // Create form-builder
      container = document.createElement('div');
      document.body.appendChild(container);
      xDivTester.callWith(container);
      helpers.clickButton(comp.buttonName, container);
      compEl = container.querySelector('.fl-component');
      done();
    });

    afterEach((done) => {
      // Destroy form-builder
      container.remove();
      done();
    });

    describe('when created should', () => {
      it('show the config menu by default', () => {
        const config = compEl.querySelector('.fl-component-config');
        const configStyles = window.getComputedStyle(config);

        const configVisibility = configStyles.visibility;
        expect(configVisibility).toBe('visible');

        const configDisplayMode = configStyles.visibility;
        expect(configDisplayMode).not.toBe('none');
      });

      it('show the required switch', () => {
        const config = compEl.querySelector('.fl-component-config');
        const requiredSwitch = config.querySelector('.switch');
        expect(requiredSwitch).toBeDefined();

        const switchStyles = window.getComputedStyle(requiredSwitch);
        const switchVisibility = switchStyles.visibility;
        expect(switchVisibility).toBe('visible');

        const switchDisplayMode = switchStyles.visibility;
        expect(switchDisplayMode).not.toBe('none');
      });

      it('have the required switch in the off position', () => {
        const config = compEl.querySelector('.fl-component-config');
        const requiredSwitch = config.querySelector('.switch');
        const requiredInputElement = requiredSwitch.querySelector('input');
        expect(requiredInputElement.checked).toBe(false);
      });

      it('focus in the "add new option box" or in the correct text-box/area',
      (done) => {
        setTimeout(() => {
          const focusedElement = document.activeElement;
          let focusedExpectedNodeName = comp.focusElementNodeName || 'INPUT';
          focusedExpectedNodeName = focusedExpectedNodeName.toUpperCase();
          expect(focusedElement.nodeName).toBe(focusedExpectedNodeName);
          expect(focusedElement.hasAttribute('placeholder')).toBe(true);
          done();
        }, 50);
      });

      it('have the title editable', () => {
        const title = compEl.querySelector('h3');
        expect(title.hasAttribute('contenteditable')).toBe(true);

        const editableValue = title.getAttribute('contenteditable');
        expect(editableValue).not.toBe(false);
        expect(editableValue).not.toBe(null);
        expect(editableValue).not.toBe('false');
      });

      if (comp.name === 'Dropdown') {
        it('show the select as multiple', () => {
          const selector = compEl.querySelector('select');
          expect(selector.hasAttribute('multiple')).toBe(true);
        });
      } else {
        it('have options editable', () => {
          const editables = compEl.querySelectorAll('[contenteditable]');

          // Has to have at least 2. The title and one more.
          expect(editables.length).toBeGreaterThan(1);
        });
      }
    });

    describe('config box should', () => {
      it('set elements as required when the required switch is changed', () => {
        const requiredInputElement = compEl.querySelector('.fl-component-config .switch input');
        requiredInputElement.click();

        const requiredElements = compEl.querySelectorAll('[required]');
        expect(requiredElements.length).toBeGreaterThan(0);
      });

      // No text-box or text-area for this spec
      if (comp.optionQuery) {
        it('add an option when the add option button is clicked', () => {
          // Write option text
          const optionText = 'Testing option insertion';
          helpers.addOption(optionText, compEl);

          // Check that it has at least one option
          const formContent = compEl.querySelector('.fl-form-content');
          const options = formContent.querySelectorAll(comp.optionQuery);
          expect(options.length).toBeGreaterThan(0);

          // Check that there is at least one option with the right text.
          let found = 0;
          for (let i = 0; i < options.length; i++) {
            if (options[i].innerHTML.indexOf(optionText) >= 0) { found++; }
          }

          expect(found).toBe(1);
        });

        it('not add an option if the option text-box is empty', () => {
          // register number of options before clicking the add button
          const formContent = compEl.querySelector('.fl-form-content');
          const optionsBefore = formContent.querySelectorAll(comp.optionQuery);
          const optionsCountBefore = optionsBefore.length;

          // Click the add button
          const addBtn = compEl.querySelector('.fl-component-config [name=add]');
          addBtn.click();

          // Compare with the number of options after
          const optionsAfter = formContent.querySelectorAll(comp.optionQuery);
          const optionsCountAfter = optionsAfter.length;
          expect(optionsCountAfter).toEqual(optionsCountBefore);
        });

        it('remove option when clicking the "minus" button', () => {
          // Add option
          const optionText = 'Testing option insertion';
          helpers.addOption(optionText, compEl);

          // Click the delete button
          const removeBtn = compEl.querySelector('.fl-component-config [name=remove]');
          removeBtn.click();

          // Check that it disappeared
          const indexOfOptionText = compEl.innerHTML.indexOf(optionText);

          expect(indexOfOptionText).toBeLessThan(0);
        });
      }

      it('make content non-editable when hiding', () => {
        const elementsBeforeHiding = compEl.querySelectorAll('[contenteditable=true]');
        const elementCountBeforeHiding = elementsBeforeHiding.length;
        expect(elementCountBeforeHiding).toBeGreaterThan(0);

        // Click OK btn;
        const okBtn = compEl.querySelector('.fl-component-config button[name=ok]');
        okBtn.click();

        const elementsAfterHiding = compEl.querySelectorAll('[contenteditable=true]');
        const elementCountAfterHiding = elementsAfterHiding.length;
        expect(elementCountAfterHiding).toBe(0);
      });

      it('hide when clicking the OK button', () => {
        // Click OK btn;
        const okBtn = compEl.querySelector('.fl-component-config button[name=ok]');
        okBtn.click();
        const config = compEl.querySelector('.fl-component-config');
        const configStyles = window.getComputedStyle(config);

        const configVisibility = configStyles.visibility;
        expect(configVisibility).toBe('hidden');
      });

      xit('hide when clicking outside the box', () => {
        const config = compEl.querySelector('.fl-component-config');

        // Visible before clicking out
        let configStyles = window.getComputedStyle(config);
        let configVisibility = configStyles.visibility;
        expect(configVisibility).toBe('visible');

        // Click a button outside of the form builder
        const button = document.createElement('button');
        document.body.insertBefore(button, document.body.children[0]);
        button.dispatchEvent(new MouseEvent('mousedown', { clickX: 0, clickY: 0 }));

        // Hidden after clicking out
        configStyles = window.getComputedStyle(config);
        configVisibility = configStyles.visibility;
        expect(configVisibility).toBe('hidden');
        button.delete();
      });

      it('remove the component when clicking in the delete button', () => {
        const deleteBtn = compEl.querySelector('.fl-component-config button[name=delete]');
        deleteBtn.click();

        compEl = container.querySelector('.fl-component');
        expect(compEl).toBeFalsy();
      });
    });
  });
});
