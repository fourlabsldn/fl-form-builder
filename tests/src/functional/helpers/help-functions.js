export default {
  clickButton(buttonName, containerPar) {
    'use strict';

    const container = containerPar || window;
    const button = container.querySelector('button[name*=' + buttonName + ']');
    button.click();
  },

  addOption(optionText, compEl) {
    // Write option text
    const inputBar = compEl.querySelector('.fl-component-config input[type=text]');
    inputBar.value = optionText;

    // Click the add button
    const addBtn = compEl.querySelector('.fl-component-config [name=add]');
    addBtn.click();
  },
};
