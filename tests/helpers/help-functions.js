//jshint -W098

function clickButton(buttonName, container) {
  'use strict';

  container = container || window;
  var button = container.querySelector('button[name*=' + buttonName + ']');
  button.click();
}
