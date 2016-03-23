//jshint -W098

function clickButton(buttonName, container) {
  'use strict';

  container = container || window;
  var button = container.querySelector('button[name*=' + buttonName + ']');
  button.click();
}

function addOption(optionText, compEl) {
  //Write option text
  var inputBar = compEl.querySelector('.fl-component-config input[type=text]');
  inputBar.value = optionText;

  //Click the add button
  var addBtn = compEl.querySelector('.fl-component-config [name=add]');
  addBtn.click();
}
